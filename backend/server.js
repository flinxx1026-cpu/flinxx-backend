import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
import pg from 'pg'
import { createClient } from 'redis'
import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

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
        google_id VARCHAR(255) UNIQUE,
        birthday DATE,
        gender VARCHAR(50),
        age INTEGER,
        profileCompleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_users_provider ON users(auth_provider, provider_id);
      CREATE INDEX IF NOT EXISTS idx_users_profile_completed ON users(profileCompleted);
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
let redis = null

// ===== EXPRESS & SOCKET.IO SETUP =====

const app = express()
const httpServer = createServer(app)

// SET COOP/COEP headers FIRST - before everything else
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none')
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none')
  res.removeHeader('Cross-Origin-Resource-Policy')
  next()
})

// Get the frontend URL from environment or default to localhost:3000
const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// Allowed origins for CORS
const allowedOrigins = [
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
  "http://127.0.0.1:3006",
  "https://flinxx-backend-frontend.vercel.app"
]

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000
})

console.log("Socket server running on port 5000")

// Middleware - Enable CORS with credentials support
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON-Response'],
  maxAge: 86400 // 24 hours
}))

app.use(express.json())

// User Management (now using Redis for online presence)
// In-memory maps kept for socket connections during session
const userSockets = new Map() // socketId -> userId mapping
const activeSessions = new Map() // sessionId -> session details

// ===== HELPER FUNCTIONS =====

// Get TURN credentials from Metered service
async function getTurnCredentials() {
  try {
    const response = await fetch(
      `https://${process.env.METERED_TURN_DOMAIN}/api/v1/turn/credential?secretKey=${process.env.METERED_SECRET_KEY}`,
      { method: "POST" }
    )

    if (!response.ok) {
      throw new Error(`Failed to get TURN credentials: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('❌ Error getting TURN credentials:', error)
    return null
  }
}

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

// Get TURN credentials endpoint
app.get('/api/turn/credentials', async (req, res) => {
  try {
    const credentials = await getTurnCredentials()
    if (!credentials) {
      return res.status(500).json({ error: 'Failed to get TURN credentials' })
    }
    res.json({
      success: true,
      iceServers: credentials.iceServers || []
    })
  } catch (error) {
    console.error('❌ Error in /api/turn/credentials:', error)
    res.status(500).json({ error: 'Failed to retrieve TURN credentials', details: error.message })
  }
})

// ===== TURN ENDPOINTS =====
// ===== TURN CREDENTIALS ENDPOINT =====
app.get("/api/get-turn-credentials", async (req, res) => {
  try {
    const url = `https://${process.env.METERED_DOMAIN}.metered.live/api/v1/turn/credentials?secretKey=${process.env.METERED_SECRET_KEY}`;

    console.log("Calling TURN:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("Metered TURN response:", data);

    res.json(data);

  } catch (err) {
    console.error("TURN ERROR:", err);
    res.status(500).json({ error: "TURN fetch failed" });
  }
});

// ===== XIRSYS TURN ENDPOINT =====
app.get("/api/turn", async (req, res) => {
    try {
        const ident = process.env.XIRSYS_IDENT;
        const secret = process.env.XIRSYS_SECRET;
        const channel = process.env.XIRSYS_CHANNEL;

        const auth = Buffer.from(`${ident}:${secret}`).toString("base64");

        const response = await fetch(`https://global.xirsys.net/_turn/${channel}`, {
            method: "PUT",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ format: "urls" })
        });

        const data = await response.json();

        res.json(data);
    } catch (err) {
        console.error("TURN API Error:", err);
        res.status(500).json({ error: "Failed to get TURN servers" });
    }
});

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
        isProfileCompleted: user.profileCompleted,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    })
  } catch (error) {
    console.error('❌ Error saving user:', error)
    res.status(500).json({ error: 'Failed to save user', details: error.message })
  }
})

// Complete user profile with birthday and gender
app.post('/api/users/complete-profile', async (req, res) => {
  try {
    // Log incoming request
    console.log('📨 /complete-profile endpoint called')
    console.log('   Request body:', JSON.stringify(req.body))
    
    const { userId, birthday, gender } = req.body

    // Validate required fields
    if (!userId) {
      console.warn('❌ Missing userId in request')
      return res.status(400).json({ error: 'Missing required field: userId' })
    }
    if (!birthday) {
      console.warn('❌ Missing birthday in request')
      return res.status(400).json({ error: 'Missing required field: birthday' })
    }
    if (!gender) {
      console.warn('❌ Missing gender in request')
      return res.status(400).json({ error: 'Missing required field: gender' })
    }

    // Validate birthday format (YYYY-MM-DD)
    if (typeof birthday !== 'string' || birthday.length < 10) {
      console.error(`❌ Invalid birthday format received: ${birthday} (type: ${typeof birthday}, length: ${birthday?.length})`)
      return res.status(400).json({ error: 'Invalid birthday format. Expected YYYY-MM-DD' })
    }

    // Validate birthday is a valid ISO date
    if (isNaN(Date.parse(birthday))) {
      console.error(`❌ Birthday is not a valid date: ${birthday}`)
      return res.status(400).json({ error: 'Invalid birthday date. Must be a valid date' })
    }

    console.log(`📝 Completing profile for user: ${userId}`)
    console.log(`   Birthday: ${birthday}, Gender: ${gender}`)

    // Verify user exists in database
    const existingUser = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      console.error(`❌ User not found in database: ${userId}`)
      return res.status(404).json({ error: 'User not found' })
    }

    console.log(`✓ User verified in DB: ${existingUser.email}`)
    console.log(`   Current user data:`, JSON.stringify({
      id: existingUser.id,
      email: existingUser.email,
      birthday: existingUser.birthday,
      gender: existingUser.gender,
      age: existingUser.age,
      profileCompleted: existingUser.profileCompleted
    }))

    // Calculate age from birthday
    const birthDate = new Date(birthday)
    
    // Validate date is valid
    if (isNaN(birthDate.getTime())) {
      console.error(`❌ Invalid date value: ${birthday}`)
      return res.status(400).json({ error: 'Invalid birthday date' })
    }

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    console.log(`✓ Calculated age: ${age}`)

    // Check if user is 18 or older
    if (age < 18) {
      console.warn(`⚠️ User ${userId} is under 18 (age: ${age})`)
      return res.status(400).json({ 
        error: 'You must be 18+ to use this app',
        code: 'UNDERAGE_USER'
      })
    }

    // Update user profile with Prisma
    console.log(`📝 Updating user with:`)
    console.log(`   - birthday: ${birthday} (type: ${typeof birthday})`)
    console.log(`   - birthDate: ${birthDate.toISOString()}`)
    console.log(`   - gender: ${gender}`)
    console.log(`   - age: ${age}`)
    console.log(`   - profileCompleted: true`)
    
    const user = await prisma.users.update({
      where: { id: userId },
      data: {
        birthday: birthDate,
        gender: gender,
        age: age,
        profileCompleted: true
      }
    })

    console.log(`✅ Profile completed successfully for user: ${user.email}`)
    console.log(`   Updated user data:`, JSON.stringify({
      id: user.id,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      age: user.age,
      profileCompleted: user.profileCompleted
    }))

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        photoURL: user.photo_url,
        birthday: user.birthday,
        gender: user.gender,
        age: user.age,
        profileCompleted: user.profileCompleted,
        authProvider: user.auth_provider
      }
    })
  } catch (error) {
    console.error('❌ PROFILE UPDATE ERROR:', error.message)
    console.error('   Full error:', error)
    console.error('   Error type:', error.constructor.name)
    console.error('   Stack:', error.stack)
    if (error.meta) {
      console.error('   Prisma meta:', error.meta)
    }
    if (error.code) {
      console.error('   Error code:', error.code)
    }
    res.status(500).json({ error: 'Failed to complete profile', details: error.message })
  }
})

// Get user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      photoURL: user.photo_url,
      authProvider: user.auth_provider,
      googleId: user.google_id,
      birthday: user.birthday,
      gender: user.gender,
      age: user.age,
      profileCompleted: user.profileCompleted,
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

    const user = await prisma.users.findUnique({
      where: { email: email }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      photoURL: user.photo_url,
      authProvider: user.auth_provider,
      googleId: user.google_id,
      birthday: user.birthday,
      gender: user.gender,
      age: user.age,
      profileCompleted: user.profileCompleted,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    })
  } catch (error) {
    console.error('❌ Error fetching user by email:', error)
    res.status(500).json({ error: 'Failed to fetch user', details: error.message })
  }
})

// Get user profile by ID or email (for frontend)
app.get('/api/user/profile', async (req, res) => {
  try {
    const { userId, email } = req.query

    if (!userId && !email) {
      return res.status(400).json({ error: 'Missing userId or email parameter' })
    }

    let result
    if (userId) {
      result = await pool.query(
        'SELECT id, email, display_name, photo_url, auth_provider, created_at, updated_at FROM users WHERE id = $1',
        [userId]
      )
    } else {
      result = await pool.query(
        'SELECT id, email, display_name, photo_url, auth_provider, created_at, updated_at FROM users WHERE email = $1',
        [email]
      )
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    console.log(`✅ Profile fetched for user: ${user.email}`)
    
    res.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        authProvider: user.auth_provider,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    })
  } catch (error) {
    console.error('❌ Error fetching user profile:', error)
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message })
  }
})

// ===== GOOGLE OAUTH ROUTES =====

// Get Google OAuth tokens
const getGoogleTokens = async (code) => {
  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI
    if (!redirectUri) {
      throw new Error('GOOGLE_REDIRECT_URI environment variable is not set')
    }
    console.log(`🔐 Exchanging code with redirect_uri: ${redirectUri}`)
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get tokens: ${response.status} - ${errorText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('❌ Error getting Google tokens:', error)
    throw error
  }
}

// Get Google user info
const getGoogleUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('❌ Error getting Google user info:', error)
    throw error
  }
}

// Step 1: Redirect to Google OAuth consent screen
app.get('/auth/google', (req, res) => {
  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI
    if (!redirectUri) {
      throw new Error('GOOGLE_REDIRECT_URI environment variable is not set')
    }
    console.log(`🔗 Google OAuth initiated with redirect_uri: ${redirectUri}`)
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent'
    })
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    console.log(`🔗 Redirecting to Google consent screen`)
    res.redirect(authUrl)
  } catch (error) {
    console.error('❌ Error in /auth/google:', error)
    res.status(500).json({ error: 'Failed to initiate Google login' })
  }
})
// Step 2: Handle Google OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query
    
    if (error) {
      console.error(`❌ Google OAuth error: ${error}`)
      const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
      return res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=${error}`)
    }
    
    if (!code) {
      console.error('❌ No authorization code received')
      const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
      return res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=no_code`)
    }
    
    console.log(`📝 Received authorization code: ${code.substring(0, 10)}...`)
    
    // Exchange code for tokens
    const tokens = await getGoogleTokens(code)
    console.log(`✅ Got access token from Google`)
    
    // Get user info
    const userInfo = await getGoogleUserInfo(tokens.access_token)
    console.log(`✅ Retrieved user info:`, userInfo.email)
    
    // Save user to database using Prisma upsert with google_id as key
    const user = await prisma.users.upsert({
      where: { google_id: userInfo.id },
      create: {
        email: userInfo.email,
        display_name: userInfo.name || 'User',
        photo_url: userInfo.picture || null,
        auth_provider: 'google',
        provider_id: userInfo.id,
        google_id: userInfo.id,
        profileCompleted: false
      },
      update: {
        email: userInfo.email,
        display_name: userInfo.name || 'User',
        photo_url: userInfo.picture || null,
        auth_provider: 'google',
        provider_id: userInfo.id,
        updated_at: new Date()
      }
    })
    
    console.log(`✅ User saved to database:`, user.email)
    
    // Create a JWT token with user data
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      googleId: user.google_id,
      timestamp: Date.now()
    })).toString('base64')
    
    // Redirect to frontend with token
    const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3003'
    const redirectUrl = `${baseUrl}/auth-success?token=${token}`
    
    console.log(`🔗 Redirecting to frontend: ${redirectUrl}`)
    res.redirect(redirectUrl)
  } catch (error) {
    console.error('❌ Error in /auth/google/callback:', error)
    const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
    res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=${encodeURIComponent(error.message)}`)
  }
})

// Step 3: Verify token and get user data from database
app.get('/auth-success', async (req, res) => {
  try {
    const token = req.query.token
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'No token provided'
      })
    }
    
    // Decode token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    console.log('✅ Token decoded for user:', decoded.email)
    
    // Fetch full user data from database
    const user = await prisma.users.findUnique({
      where: { id: parseInt(decoded.userId) }
    })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    
    // Return user data with profileCompleted flag
    res.json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        googleId: user.google_id,
        profileCompleted: user.profileCompleted
      }
    })
  } catch (error) {
    console.error('❌ Error in /auth-success:', error)
    res.status(400).json({
      success: false,
      error: 'Invalid token'
    })
  }
})

// Legacy endpoint for backward compatibility
app.get('/auth/google/success', (req, res) => {
  try {
    const token = req.query.token
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'No token provided'
      })
    }
    
    // Decode token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    console.log('✅ Token decoded:', decoded.email)
    
    res.json({
      success: true,
      token: token,
      user: {
        id: decoded.userId,
        email: decoded.email,
        googleId: decoded.googleId
      }
    })
  } catch (error) {
    console.error('❌ Error in /auth/google/success:', error)
    res.status(400).json({
      success: false,
      error: 'Invalid token'
    })
  }
})

// Step 4: Get user profile using token (for frontend)
app.get('/api/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header'
      })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Decode token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    console.log('✅ Token decoded for profile:', decoded.email)
    
    res.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        provider: decoded.provider
      }
    })
  } catch (error) {
    console.error('❌ Error in /api/profile:', error)
    res.status(400).json({
      success: false,
      error: 'Invalid token'
    })
  }
})

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
    console.log('\n\n');
    console.log('📨📨📨 SERVER RECEIVED webrtc_offer 📨📨📨');
    console.log('📨 Sender socket ID:', socket.id);
    console.log('📨 Incoming data:', JSON.stringify(data, null, 2));
    console.log('📨 data.to value:', data.to);
    console.log('📨 Is data.to empty?', !data.to);
    console.log('📨 Is data.to undefined?', data.to === undefined);
    console.log('📨 Is data.to null?', data.to === null);
    
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data.to
    
    console.log('📨 userSockets.get(socket.id):', userId);
    console.log('📨 partnerSocketId extracted from data.to:', partnerSocketId);
    console.log('📨 TARGET: Will send to socket:', partnerSocketId);
    
    if (userId && partnerSocketId) {
      console.log('✅ SERVER: Conditions met - sending webrtc_offer');
      console.log('✅ SERVER: FROM socket:', socket.id, '→ TO socket:', partnerSocketId);
      io.to(partnerSocketId).emit('webrtc_offer', {
        offer: data.offer,
        from: socket.id
      })
      console.log('✅ SERVER: webrtc_offer emitted successfully to:', partnerSocketId)
    } else {
      console.error('❌ SERVER: Cannot send webrtc_offer - conditions failed');
      console.error('   userId exists?', !!userId);
      console.error('   partnerSocketId exists?', !!partnerSocketId);
    }
  })

  // Handle WebRTC answer
  socket.on('webrtc_answer', (data) => {
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data.to
    console.log('📨 SERVER: Received webrtc_answer from socket:', socket.id)
    console.log('📨 SERVER: Target partner socket ID:', partnerSocketId)
    if (userId && partnerSocketId) {
      console.log('✅ SERVER: Sending webrtc_answer from', socket.id, 'to', partnerSocketId)
      io.to(partnerSocketId).emit('webrtc_answer', {
        answer: data.answer,
        from: socket.id
      })
      console.log('✅ SERVER: webrtc_answer sent successfully')
    } else {
      console.error('❌ SERVER: Cannot send webrtc_answer - userId or partnerSocketId missing')
    }
  })

  // Handle ICE Candidate
  socket.on('ice_candidate', (data) => {
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data.to
    console.log('🧊 SERVER: Received ICE candidate from socket:', socket.id)
    console.log('🧊 SERVER: Target partner socket ID:', partnerSocketId)
    if (userId && partnerSocketId) {
      console.log('✅ SERVER: Sending ICE candidate from', socket.id, 'to', partnerSocketId)
      io.to(partnerSocketId).emit('ice_candidate', {
        candidate: data.candidate,
        from: socket.id
      })
    } else {
      console.error('❌ SERVER: Cannot send ICE candidate - userId or partnerSocketId missing')
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
  console.log('\n🎯 MATCHING COMPLETE - SENDING partner_found TO BOTH PEERS')
  console.log('📤 Sending partner_found to socketId1:', socketId1)
  console.log('📤 Sending partner_found to socketId2:', socketId2)
  
  io.to(socketId1).emit('partner_found', {
    partnerId: userId2,
    sessionId: sessionId,
    socketId: socketId2,
    userName: userData2?.userName || 'Anonymous',
    userAge: userData2?.userAge || 18,
    userLocation: userData2?.userLocation || 'Unknown'
  })
  console.log('✅ partner_found emitted to socketId1:', socketId1)
  
  io.to(socketId2).emit('partner_found', {
    partnerId: userId1,
    sessionId: sessionId,
    socketId: socketId1,
    userName: userData1?.userName || 'Anonymous',
    userAge: userData1?.userAge || 18,
    userLocation: userData1?.userLocation || 'Unknown'
  })
  console.log('✅ partner_found emitted to socketId2:', socketId2)

  console.log(`✅ Matched: ${userId1} <-> ${userId2}`)
}

// Start Server
const PORT = process.env.PORT || 10000

// Start listening immediately
(async () => {
  // Add error handler for uncaught errors
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  })

  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error)
    process.exit(1)
  })

  // Set timeout for graceful shutdown on SIGTERM
  process.on('SIGTERM', () => {
    console.log('⚠️ SIGTERM received, shutting down gracefully...')
    httpServer.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
  })

  // Initialize Redis connection
  try {
    redis = await createClient({
      url: process.env.REDIS_URL
    })

    redis.on('error', (err) => {
      console.error('❌ Redis client error:', err)
    })

    redis.on('connect', () => {
      console.log('✅ Redis connected')
    })

    await redis.connect()
    console.log('✅ Redis initialization complete')
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message)
    console.warn('⚠️ Continuing without Redis - some features may be limited')
    redis = null
  }

  // Initialize database on startup
  try {
    await initializeDatabase()
    console.log('✅ Database initialization complete')
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    console.warn('⚠️ Continuing with limited database functionality')
  }

  httpServer.listen(PORT, () => {
    console.log(`\n🚀 Flinxx Server running on port ${PORT}`);
    console.log("🔴 ===== SERVER STARTUP COMPLETE =====");
    console.log("🔴 Available Endpoints:");
    console.log("🔴   - GET  /api/get-turn-credentials");
    console.log("🔴   - POST /api/get-turn-credentials");
    console.log("🔴 ===== SERVER STARTUP COMPLETE =====\n");
    console.log(`🔌 Socket.IO server running on ws://localhost:${PORT}`)
    console.log(`✅ CORS enabled for: ${process.env.CLIENT_URL}`)
    console.log(`\n📊 Backend Configuration:`)
    console.log(`✅ Node.js version: ${process.version}`)
    console.log(`✅ PostgreSQL (Neon) connection pool ready`)
    console.log(`${redis ? '✅' : '⚠️'} Redis (Upstash) ${redis ? 'connected' : 'unavailable'}`)
    console.log(`✅ TURN server: ${process.env.METERED_DOMAIN}`)
    console.log(`\n🎯 Features Enabled:`)
    console.log(`  • WebRTC signaling with TURN`)
    console.log(`  • Random partner matchmaking`)
    console.log(`  • Online presence tracking`)
    console.log(`  • Session management`)
    console.log(`  • Real-time notifications`)
    console.log(`\n✅ Backend is live and ready for connections!\n`)
  })
})()

httpServer.on('error', (error) => {
  console.error('❌ Server error:', error.message)
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`)
  }
  process.exit(1)
})
