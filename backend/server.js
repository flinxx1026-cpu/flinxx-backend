import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
import pg from 'pg'
import { createClient } from 'redis'

dotenv.config()

// ===== DATABASE CONFIGURATION =====

// PostgreSQL (Neon) Connection
const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: true
})

// Test PostgreSQL connection
pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err)
})

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected from pool')
})

// Initialize PostgreSQL tables
async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        photo_url TEXT,
        auth_provider VARCHAR(50),
        provider_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_provider ON users(auth_provider, provider_id);
    `)

    // Create premium table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS premium (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'inactive',
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_premium_user_id ON premium(user_id);
    `)

    // Create reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        reason VARCHAR(255),
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
      CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
    `)

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user1_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        user2_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        duration_seconds INTEGER,
        quality VARCHAR(50) DEFAULT 'good'
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_user1 ON sessions(user1_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_user2 ON sessions(user2_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
    `)

    console.log('✅ PostgreSQL tables initialized')
  } catch (error) {
    console.error('❌ Error initializing database tables:', error)
  }
}

// Redis Connection
const redis = await createClient({
  url: process.env.REDIS_URL
})

redis.on('error', (err) => {
  console.error('❌ Redis client error:', err)
})

redis.on('connect', () => {
  console.log('✅ Redis connected')
})

await redis.connect()

// ===== EXPRESS & SOCKET.IO SETUP =====

const app = express()
const httpServer = createServer(app)

// SET COOP/COEP headers FIRST - before everything else
app.use((req, res, next) => {
  console.log('Setting COOP/COEP headers for:', req.url)
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none')
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none')
  res.removeHeader('Cross-Origin-Resource-Policy')
  next()
})

// Get the frontend URL from environment or default to localhost:3000
const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:3000'

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:3005",
      "http://localhost:3006",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "http://127.0.0.1:3003",
      "http://127.0.0.1:3004",
      "http://127.0.0.1:3005",
      "http://127.0.0.1:3006"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000
})

console.log("Socket server running on port 5000")

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003',
    'http://127.0.0.1:3004',
    'http://127.0.0.1:3005',
    'http://127.0.0.1:3006'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}))

app.use(express.json())

// User Management (now using Redis for online presence)
// In-memory maps kept for socket connections during session
const userSockets = new Map() // socketId -> userId mapping
const activeSessions = new Map() // sessionId -> session details

// ===== HELPER FUNCTIONS =====

// Get online users from Redis
async function getOnlineUsers() {
  try {
    const users = await redis.keys('user:*:online')
    return users.length
  } catch (error) {
    console.error('❌ Error getting online users:', error)
    return 0
  }
}

// Add user to Redis online set
async function setUserOnline(userId, socketId) {
  try {
    await redis.setEx(`user:${userId}:online`, 86400, socketId) // 24 hour TTL
    await redis.sAdd('online_users', userId)
    console.log(`✅ User ${userId} marked as online`)
  } catch (error) {
    console.error('❌ Error setting user online:', error)
  }
}

// Remove user from Redis online set
async function setUserOffline(userId) {
  try {
    await redis.del(`user:${userId}:online`)
    await redis.sRem('online_users', userId)
    console.log(`✅ User ${userId} marked as offline`)
  } catch (error) {
    console.error('❌ Error setting user offline:', error)
  }
}

// Get random online user for matchmaking
async function getRandomOnlineUser(excludeUserId) {
  try {
    const onlineUsers = await redis.sMembers('online_users')
    const availableUsers = onlineUsers.filter(id => id !== excludeUserId)
    if (availableUsers.length === 0) return null
    return availableUsers[Math.floor(Math.random() * availableUsers.length)]
  } catch (error) {
    console.error('❌ Error getting random user:', error)
    return null
  }
}

// Queue management using Redis
async function addToMatchingQueue(userId, socketId, userData) {
  try {
    const queueData = JSON.stringify({
      userId,
      socketId,
      userName: userData?.userName || 'Anonymous',
      userAge: userData?.userAge || 18,
      userLocation: userData?.userLocation || 'Unknown',
      timestamp: Date.now()
    })
    await redis.lPush('matching_queue', queueData)
    console.log(`✅ User ${userId} added to matching queue`)
  } catch (error) {
    console.error('❌ Error adding to queue:', error)
  }
}

async function getNextFromQueue() {
  try {
    const data = await redis.rPop('matching_queue')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('❌ Error getting from queue:', error)
    return null
  }
}

async function getQueueLength() {
  try {
    return await redis.lLen('matching_queue')
  } catch (error) {
    console.error('❌ Error getting queue length:', error)
    return 0
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', db: 'Connected' })
})

app.get('/api/stats', async (req, res) => {
  try {
    const onlineUsers = await getOnlineUsers()
    const queueLength = await getQueueLength()
    res.json({
      activeUsers: onlineUsers,
      activeSessions: activeSessions.size,
      waitingUsers: queueLength,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error getting stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// ===== USER MANAGEMENT ENDPOINTS =====

// Save/Update user after Firebase login
app.post('/api/users/save', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, authProvider } = req.body

    if (!uid || !email) {
      return res.status(400).json({ error: 'Missing required fields: uid, email' })
    }

    console.log(`📝 Saving user to database: ${email}`)

    // Use INSERT ... ON CONFLICT for upsert behavior
    const result = await pool.query(
      `INSERT INTO users (id, email, display_name, photo_url, auth_provider)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         photo_url = EXCLUDED.photo_url,
         auth_provider = EXCLUDED.auth_provider,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [uid, email, displayName || 'User', photoURL || null, authProvider || 'unknown']
    )

    const user = result.rows[0]
    console.log(`✅ User saved/updated in database:`, user)

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        photoURL: user.photo_url,
        authProvider: user.auth_provider,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    })
  } catch (error) {
    console.error('❌ Error saving user:', error)
    res.status(500).json({ error: 'Failed to save user', details: error.message })
  }
})

// Get user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    const result = await pool.query(
      'SELECT id, email, display_name, photo_url, auth_provider, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      photoURL: user.photo_url,
      authProvider: user.auth_provider,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    })
  } catch (error) {
    console.error('❌ Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user', details: error.message })
  }
})

// Get user by email
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({ error: 'Missing email' })
    }

    const result = await pool.query(
      'SELECT id, email, display_name, photo_url, auth_provider, created_at, updated_at FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      photoURL: user.photo_url,
      authProvider: user.auth_provider,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    })
  } catch (error) {
    console.error('❌ Error fetching user by email:', error)
    res.status(500).json({ error: 'Failed to fetch user', details: error.message })
  }
})

// Initialize database on startup
await initializeDatabase()

// WebSocket Events
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`)
  console.log(`📊 Active connections: ${io.engine.clientsCount}`)

  // Register user
  const userId = uuidv4()
  userSockets.set(socket.id, userId)

  socket.emit('user_registered', { userId })

  // Handle finding partner
  socket.on('find_partner', async (userData) => {
    const userId = userSockets.get(socket.id)
    
    if (!userId) {
      socket.emit('error', 'User not registered')
      return
    }

    console.log(`[find_partner] User ${userId} looking for partner`, { userName: userData?.userName })

    // Set user as online in Redis
    await setUserOnline(userId, socket.id)

    // Check if there's someone in the queue
    const waitingUser = await getNextFromQueue()
    
    if (waitingUser) {
      console.log(`[find_partner] Found waiting partner: ${waitingUser.userId}`)
      matchUsers(socket.id, userId, waitingUser.socketId, waitingUser.userId, userData, waitingUser)
    } else {
      // Add to waiting queue
      await addToMatchingQueue(userId, socket.id, userData)
      console.log(`[find_partner] Added to queue. Queue length: ${await getQueueLength()}`)
      socket.emit('waiting', { message: 'Waiting for a partner...' })
    }
  })

  // Handle WebRTC offer
  socket.on('webrtc_offer', (data) => {
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data.to
    if (userId && partnerSocketId) {
      io.to(partnerSocketId).emit('webrtc_offer', {
        offer: data.offer,
        from: socket.id
      })
    }
  })

  // Handle WebRTC answer
  socket.on('webrtc_answer', (data) => {
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data.to
    if (userId && partnerSocketId) {
      io.to(partnerSocketId).emit('webrtc_answer', {
        answer: data.answer,
        from: socket.id
      })
    }
  })

  // Handle ICE Candidate
  socket.on('ice_candidate', (data) => {
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data.to
    if (userId && partnerSocketId) {
      io.to(partnerSocketId).emit('ice_candidate', {
        candidate: data.candidate,
        from: socket.id
      })
    }
  })

  // Handle skip user
  socket.on('skip_user', async (data) => {
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data.partnerSocketId
    
    if (userId && partnerSocketId) {
      console.log(`[skip_user] ${userId} skipping ${partnerSocketId}`)
      
      // Notify partner
      io.to(partnerSocketId).emit('user_skipped')
      
      // Try to find new partner
      const waitingUser = await getNextFromQueue()
      if (waitingUser) {
        matchUsers(socket.id, userId, waitingUser.socketId, waitingUser.userId, {}, waitingUser)
      } else {
        socket.emit('waiting', { message: 'Waiting for a new partner...' })
      }
    }
  })

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.id}`)
    
    const userId = userSockets.get(socket.id)
    
    if (userId) {
      // Mark user as offline in Redis
      await setUserOffline(userId)
      
      // Remove from socket mapping
      userSockets.delete(socket.id)
    }
  })
})

// Matching Function
async function matchUsers(socketId1, userId1, socketId2, userId2, userData1, userData2) {
  // Create session
  const sessionId = uuidv4()
  const startedAt = new Date()
  
  activeSessions.set(sessionId, {
    id: sessionId,
    socketId1: socketId1,
    socketId2: socketId2,
    userId1: userId1,
    userId2: userId2,
    startedAt: startedAt,
    duration: 0
  })

  // Store session in Redis for real-time tracking
  try {
    const sessionData = JSON.stringify({
      id: sessionId,
      userId1,
      userId2,
      startedAt: startedAt.toISOString()
    })
    await redis.setEx(`session:${sessionId}`, 3600, sessionData) // 1 hour TTL
    
    // Add to active sessions set
    await redis.sAdd('active_sessions', sessionId)
  } catch (error) {
    console.error('❌ Error storing session in Redis:', error)
  }

  // Notify both users
  io.to(socketId1).emit('partner_found', {
    partnerId: userId2,
    sessionId: sessionId,
    socketId: socketId2,
    userName: userData2?.userName || 'Anonymous',
    userAge: userData2?.userAge || 18,
    userLocation: userData2?.userLocation || 'Unknown'
  })
  io.to(socketId2).emit('partner_found', {
    partnerId: userId1,
    sessionId: sessionId,
    socketId: socketId1,
    userName: userData1?.userName || 'Anonymous',
    userAge: userData1?.userAge || 18,
    userLocation: userData1?.userLocation || 'Unknown'
  })

  console.log(`✅ Matched: ${userId1} <-> ${userId2}`)
}

// Start Server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Flinxx Server running on port ${PORT}`)
  console.log(`🔌 Socket.IO server running on ws://localhost:${PORT}`)
  console.log(`✅ CORS enabled for: ${process.env.CLIENT_URL}`)
  console.log(`\n📊 Database Configuration:`)
  console.log(`✅ PostgreSQL (Neon) connected`)
  console.log(`✅ Redis (Upstash) connected`)
  console.log(`\n🎯 Features Enabled:`)
  console.log(`  • User authentication via Firebase`)
  console.log(`  • Random partner matchmaking (Redis queue)`)
  console.log(`  • Online presence tracking (Redis)`)
  console.log(`  • WebRTC signaling`)
  console.log(`  • Session management`)
  console.log(`  • Real-time notifications`)
  console.log(`\n✅ WebSocket connections ready\n`)
})
