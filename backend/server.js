import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
import pg from 'pg'
import { createClient } from 'redis'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import authMiddleware from './middleware/auth.js'
import friendsRoutes, { setIO as setFriendsIO } from './routes/friends.js'
import notificationsRoutes, { setPool as setNotificationsPool } from './routes/notifications.js'
import messagesRoutes from './routes/messages.js'
import matchesRoutes, { setMatchesPool } from './routes/matches.js'
import paymentsRoutes, { setPaymentsPool, setPaymentsPrisma } from './routes/payments.js'
import { initializeFirebaseAdmin, verifyFirebaseToken } from './firebaseAdmin.js'

// Load environment variables in correct order:
// 1. First load .env.local (development overrides) with override: true to ensure it takes precedence
// 2. Then load .env (fallbacks) without override to fill in missing values

// Load .env.local first (development/local environment)
dotenv.config({ 
  path: '.env.local',
  override: true  // Force .env.local to override any existing process.env values
})

// Load .env second as fallback for variables not in .env.local
dotenv.config({
  override: false  // Don't override - only fill in missing variables
})

console.log('📍 Backend initialization starting...')
console.log('📍 NODE_ENV:', process.env.NODE_ENV || 'not set')
console.log('📍 PORT will be:', process.env.PORT || 10000)
console.log('📍 FRONTEND_URL:', process.env.FRONTEND_URL || 'not set')
console.log('📍 CLIENT_URL:', process.env.CLIENT_URL || 'not set')
console.log('📍 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ SET' : '✗ NOT SET')
console.log('📍 GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ SET' : '✗ NOT SET')
console.log('📍 GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || '✗ NOT SET')
console.log('📍 GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI || '✗ NOT SET')
console.log('📍 ═══════════════════════════════════════════════════════')
console.log('📍 🔗 OAUTH DEBUGGING:')
console.log('📍   GOOGLE_CALLBACK_URL value:', process.env.GOOGLE_CALLBACK_URL)
console.log('📍   GOOGLE_REDIRECT_URI value:', process.env.GOOGLE_REDIRECT_URI)
console.log('📍 ═══════════════════════════════════════════════════════')
console.log('📍 ✅ All environment variables loaded successfully!')

// 🔥 Initialize Firebase Admin SDK
console.log('🔥 Initializing Firebase Admin SDK...')
initializeFirebaseAdmin()

let prisma

// Keep track of online users: userId -> socketId (used by both REST API and WebSocket)
const onlineUsers = new Map()

try {
  prisma = new PrismaClient()
  console.log('✅ Prisma Client initialized')
} catch (error) {
  console.error('❌ CRITICAL: Failed to initialize Prisma:', error.message)
  console.error('❌ Database operations will fail! Check DATABASE_URL and Prisma setup')
  prisma = null
}

// Helper function to check Prisma is available
function ensurePrismaAvailable() {
  if (!prisma) {
    const msg = 'CRITICAL: Prisma Client not initialized. Cannot perform database operations.'
    console.error('❌', msg)
    throw new Error(msg)
  }
  return prisma
}

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
        profileImage TEXT,
        auth_provider VARCHAR(50),
        provider_id VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        public_id VARCHAR(8) UNIQUE,
        birthday DATE,
        gender VARCHAR(50),
        age INTEGER,
        profileCompleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS profileImage TEXT;
      CREATE INDEX IF NOT EXISTS idx_users_public_id ON users(public_id);
      CREATE INDEX IF NOT EXISTS idx_users_provider ON users(auth_provider, provider_id);
      CREATE INDEX IF NOT EXISTS idx_users_profile_completed ON users("profileCompleted");
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

    // Create friend_requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS friend_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sender_id, receiver_id)
      );
      CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
    `)

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
    `)

    // Create matches table for match history
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        matched_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        matched_user_name VARCHAR(255),
        matched_user_country VARCHAR(255),
        duration_seconds INTEGER DEFAULT 0,
        is_liked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
      CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);
    `)

    // Create payments table for Razorpay transactions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        razorpay_signature TEXT,
        status VARCHAR(50) DEFAULT 'created',
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(razorpay_order_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `)

    // Add premium feature columns to users table
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS has_blue_tick BOOLEAN DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS blue_tick_expires_at TIMESTAMP;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS has_match_boost BOOLEAN DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS match_boost_expires_at TIMESTAMP;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS has_unlimited_skip BOOLEAN DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS unlimited_skip_expires_at TIMESTAMP;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_skip_count INTEGER DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_skip_reset_date DATE;
    `)

    console.log('✅ PostgreSQL tables initialized')
  } catch (error) {
    console.error('❌ Error initializing database tables:', error)
  }
}

// Redis Connection
let redis = null

// ===== IN-MEMORY QUEUE FALLBACK (when Redis is unavailable) =====
let inMemoryMatchingQueue = []; // For sorted set: [{score, value}, ...]
let inMemoryUserStatus = new Map();
let inMemoryOnlineUsers = new Set();

// Function to safely initialize Redis
async function initializeRedis() {
  console.log("[STARTUP] Skipping Redis initialization for now (development)");
  console.log("[STARTUP] Using in-memory queue as fallback");
  
  // Return a fallback object with in-memory implementations
  return {
    // ===== SORTED SET COMMANDS (used by matching queue) =====
    zAdd: async (key, ...args) => {
      if (key === 'matching_queue') {
        // args can be {score, value} object or multiple
        const items = Array.isArray(args[0]) ? args[0] : args;
        for (const item of items) {
          const { score, value } = item;
          // Remove existing entry with same value (dedup)
          inMemoryMatchingQueue = inMemoryMatchingQueue.filter(e => e.value !== value);
          inMemoryMatchingQueue.push({ score, value });
          // Sort by score ascending (boost users with score 0 first)
          inMemoryMatchingQueue.sort((a, b) => a.score - b.score);
          const parsed = JSON.parse(value);
          console.log(`   [IN-MEMORY] zAdd: Added User ${parsed.userId} with score ${score}, queue has ${inMemoryMatchingQueue.length} items`);
        }
        return items.length;
      }
      return 0;
    },

    zRange: async (key, start, end) => {
      if (key === 'matching_queue') {
        const endIdx = end === -1 ? undefined : end + 1;
        const result = inMemoryMatchingQueue.slice(start, endIdx).map(e => e.value);
        console.log(`   [IN-MEMORY] zRange(${start}, ${end}): Returning ${result.length} items`);
        return result;
      }
      return [];
    },

    zRem: async (key, value) => {
      if (key === 'matching_queue') {
        const before = inMemoryMatchingQueue.length;
        inMemoryMatchingQueue = inMemoryMatchingQueue.filter(e => e.value !== value);
        const removed = before - inMemoryMatchingQueue.length;
        if (removed > 0) {
          console.log(`   [IN-MEMORY] zRem: Removed entry, queue has ${inMemoryMatchingQueue.length} items`);
        }
        return removed;
      }
      return 0;
    },

    zCard: async (key) => {
      if (key === 'matching_queue') {
        return inMemoryMatchingQueue.length;
      }
      return 0;
    },

    // ===== LIST COMMANDS (kept for compatibility) =====
    lPush: async (key, value) => {
      if (key === 'matching_queue') {
        const parsed = JSON.parse(value);
        console.log(`   [IN-MEMORY] lPush: Adding User ${parsed.userId} to LEFT (beginning)`);
        inMemoryMatchingQueue.unshift({ score: Date.now(), value });
        console.log(`   [IN-MEMORY] lPush: Queue now has ${inMemoryMatchingQueue.length} items`);
        return inMemoryMatchingQueue.length;
      }
      return null;
    },
    
    rPop: async (key) => {
      if (key === 'matching_queue') {
        const item = inMemoryMatchingQueue.pop();
        console.log(`   [IN-MEMORY] rPop: Removing from RIGHT (end), queue now has ${inMemoryMatchingQueue.length} items`);
        return item?.value || null;
      }
      return null;
    },
    
    lRange: async (key, start, end) => {
      if (key === 'matching_queue') {
        const result = inMemoryMatchingQueue.slice(start, end === -1 ? undefined : end + 1).map(e => e.value);
        console.log(`   [IN-MEMORY] lRange: Returning ${result.length} items from queue`);
        return result;
      }
      return [];
    },
    
    lLen: async (key) => {
      if (key === 'matching_queue') {
        return inMemoryMatchingQueue.length;
      }
      return 0;
    },
    
    lRem: async (key, count, value) => {
      if (key === 'matching_queue') {
        const before = inMemoryMatchingQueue.length;
        inMemoryMatchingQueue = inMemoryMatchingQueue.filter(e => e.value !== value);
        const removed = before - inMemoryMatchingQueue.length;
        if (removed > 0) {
          console.log(`   [IN-MEMORY] lRem: Removed, queue now has ${inMemoryMatchingQueue.length} items`);
        }
        return removed;
      }
      return 0;
    },
    
    keys: async (pattern) => {
      // Simple pattern matching for development
      if (pattern === 'user:*:online') {
        return Array.from(inMemoryUserStatus.keys()).filter(k => k.includes(':online'));
      }
      return [];
    },
    
    set: async (key, value) => {
      inMemoryUserStatus.set(key, value);
      return 'OK';
    },
    
    setEx: async (key, ttl, value) => {
      inMemoryUserStatus.set(key, value);
      // Set expiration timeout (for development, we'll just store without actual expiration)
      return 'OK';
    },
    
    get: async (key) => {
      return inMemoryUserStatus.get(key) || null;
    },
    
    del: async (key) => {
      return inMemoryUserStatus.delete(key) ? 1 : 0;
    },
    
    sAdd: async (key, value) => {
      if (key === 'online_users' || key === 'active_sessions') {
        if (key === 'online_users') {
          inMemoryOnlineUsers.add(value);
        } else if (key === 'active_sessions') {
          inMemoryUserStatus.set(`session:${value}`, true);
        }
        return 1;
      }
      return 0;
    },
    
    sRem: async (key, value) => {
      if (key === 'online_users') {
        return inMemoryOnlineUsers.delete(value) ? 1 : 0;
      }
      return 0;
    },
    
    sMembers: async (key) => {
      if (key === 'online_users') {
        return Array.from(inMemoryOnlineUsers);
      }
      return [];
    }
  };
}

// ===== EXPRESS & SOCKET.IO SETUP =====

const app = express()
const httpServer = createServer(app)

// ===== SECURITY HEADERS & CORS CONFIGURATION =====

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
  "http://localhost:3007",
  "http://localhost:3008",
  "http://localhost:3009",
  "http://localhost:3010",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:3003",
  "http://127.0.0.1:3004",
  "http://127.0.0.1:3005",
  "http://127.0.0.1:3006",
  "http://127.0.0.1:3007",
  "http://127.0.0.1:3008",
  "http://127.0.0.1:3009",
  "http://127.0.0.1:3010",
  "https://flinxx-backend-frontend.vercel.app",
  "https://flinxx-admin-panel.vercel.app",
  "https://flinxx-frontend.vercel.app",
  "https://flinxx.in",
  "https://www.flinxx.in",
  "https://d1pphanrf0qsx7.cloudfront.net"
]

// CORS Configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Id", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400
}

// Security Headers Middleware
app.use((req, res, next) => {
  // CORS headers
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, Accept')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
  
  // Security Headers (COOP/COEP for SharedArrayBuffer support)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  next()
})

// Socket.IO Configuration with CORS
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000
})

// ✅ PASS IO INSTANCE TO ROUTES
setFriendsIO(io)
console.log('✅ [server.js] Socket.IO passed to friends routes')

// Middleware - Enable CORS for all routes
app.use(cors(corsOptions))

// CRITICAL: Handle preflight requests (OPTIONS) for all routes
app.options('*', cors(corsOptions))

app.use(express.json())

// ===== VERIFY USER TOKEN MIDDLEWARE =====
const verifyUserToken = async (req, res, next) => {
  try {
    console.log("\n🔐 [verifyUserToken] ═══════════════════════════════════════════");
    console.log("🔐 [verifyUserToken] MIDDLEWARE CALLED");
    console.log("AUTH HEADER:", req.headers.authorization);
    
    if (!req.headers.authorization) {
      console.error("🔐 [verifyUserToken] ❌ NO AUTHORIZATION HEADER");
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const token = req.headers.authorization?.split(" ")[1];
    console.log("🔐 [verifyUserToken] TOKEN EXTRACTED:", token ? "✓ Present" : "✗ Missing");
    
    if (!token) {
      console.error("🔐 [verifyUserToken] ❌ TOKEN NOT FOUND IN HEADER");
      return res.status(401).json({ error: 'Missing token' });
    }
    
    console.log("🔐 [verifyUserToken] Token length:", token.length);
    
    let decoded;
    try {
      // Try JWT verification first
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔐 [verifyUserToken] ✓ JWT VERIFIED SUCCESSFULLY");
      console.log("DECODED TOKEN:", decoded);
      console.log("🔐 [verifyUserToken] DECODED USER:", JSON.stringify(decoded, null, 2));
    } catch (jwtError) {
      console.warn("🔐 [verifyUserToken] ⚠️ JWT verification failed, trying base64 decode...");
      console.warn("🔐 [verifyUserToken] JWT Error:", jwtError.message);
      
      // Fallback to base64 decoding
      try {
        decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        console.log("🔐 [verifyUserToken] ✓ BASE64 DECODE SUCCESSFUL");
        console.log("DECODED TOKEN:", decoded);
        console.log("🔐 [verifyUserToken] DECODED USER:", JSON.stringify(decoded, null, 2));
      } catch (base64Error) {
        console.error("🔐 [verifyUserToken] ❌ BOTH METHODS FAILED");
        console.error("🔐 [verifyUserToken] Base64 error:", base64Error.message);
        return res.status(401).json({ error: 'Invalid token format' });
      }
    }
    
    // Check if user ID exists
    if (!decoded?.id && !decoded?.userId) {
      console.error("🔐 [verifyUserToken] ❌ USER ID NOT FOUND IN TOKEN");
      console.error("🔐 [verifyUserToken] Decoded payload:", JSON.stringify(decoded, null, 2));
      return res.status(401).json({ message: "Invalid token payload" });
    }
    
    const userId = decoded.id || decoded.userId;
    console.log("🔐 [verifyUserToken] User ID from token:", userId);
    
    // Fetch user from database
    console.log("🔐 [verifyUserToken] Fetching user from database...");
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error("🔐 [verifyUserToken] ❌ USER NOT FOUND IN DATABASE");
      console.error("🔐 [verifyUserToken] Searched for ID:", userId);
      return res.status(401).json({ error: 'User not found' });
    }
    
    console.log("🔐 [verifyUserToken] ✓ USER FOUND IN DATABASE");
    console.log("🔐 [verifyUserToken] User email:", user.email);
    console.log("🔐 [verifyUserToken] User UUID:", user.id);
    
    // Set req.decoded for use in route handler
    req.decoded = {
      id: user.id,
      userId: userId,
      email: user.email
    };
    
    console.log("🔐 [verifyUserToken] ✓ MIDDLEWARE COMPLETE - Calling next()");
    console.log("🔐 [verifyUserToken] ═══════════════════════════════════════════\n");
    
    next();
  } catch (error) {
    console.error('🔐 [verifyUserToken] ❌ MIDDLEWARE ERROR:', error.message);
    console.error('🔐 [verifyUserToken] Full error:', error);
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

// ===== MOUNT ROUTES =====

// Health check for ALB
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.use('/api/friends', friendsRoutes)
setNotificationsPool(pool)
setMatchesPool(pool)
app.use('/api', notificationsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/matches', matchesRoutes)
setPaymentsPool(pool)
setPaymentsPrisma(prisma)
app.use('/api/payments', paymentsRoutes)

// User Management (now using Redis for online presence)
// In-memory maps kept for socket connections during session
const userSockets = new Map() // socketId -> userId mapping
const activeSessions = new Map() // sessionId -> session details
const partnerSockets = new Map() // socketId -> partnerSocketId mapping (for WebRTC pairs)

// ===== HELPER FUNCTIONS =====

// Generate unique 8-digit public user ID
function generate8DigitId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

// Generate unique public ID with database collision check
async function generateUniquePublicId() {
  let publicId
  let exists = true
  let attempts = 0
  const maxAttempts = 100

  while (exists && attempts < maxAttempts) {
    publicId = generate8DigitId()
    
    // Check if already exists in database
    const existingUser = await prisma.users.findUnique({
      where: { public_id: publicId }
    })
    
    exists = !!existingUser
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique public_id after maximum attempts')
  }

  return publicId
}

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

// Queue management using Redis (Sorted Set for Match Boost priority)
async function addToMatchingQueue(userId, socketId, userData) {
  try {
    console.log(`\n📝 [QUEUE] Adding user ${userId} to queue...`)
    
    // CRITICAL: Check if this user is already in the queue (e.g., from a previous session)
    const existingMembers = await redis.zRange('matching_queue', 0, -1)
    let removedCount = 0
    
    for (const entry of existingMembers) {
      const queuedUser = JSON.parse(entry)
      if (queuedUser.userId === userId) {
        console.warn(`⚠️ DUPLICATE ENTRY FOUND: User ${userId} already in queue`)
        console.warn(`   Old socket: ${queuedUser.socketId}`)
        console.warn(`   New socket: ${socketId}`)
        console.warn(`   Removing old entry...`)
        await redis.zRem('matching_queue', entry)
        removedCount++
      }
    }
    
    if (removedCount > 0) {
      console.log(`✅ REMOVED ${removedCount} duplicate queue entries for user ${userId}`)
    }

    // Check if user has Match Boost
    let hasMatchBoost = false;
    try {
      const boostUser = await prisma.users.findUnique({ 
        where: { id: userId }, 
        select: { has_match_boost: true, match_boost_expires_at: true } 
      });
      hasMatchBoost = !!(boostUser?.has_match_boost && boostUser?.match_boost_expires_at && new Date(boostUser.match_boost_expires_at) > new Date());
    } catch (e) {
      console.warn(`⚠️ Could not check Match Boost status:`, e.message);
    }

    const queueData = JSON.stringify({
      userId,
      socketId,
      userName: userData?.userName || 'Anonymous',
      userAge: userData?.userAge || 18,
      userLocation: userData?.userLocation || 'Unknown',
      userPicture: userData?.userPicture || null,
      hasMatchBoost,
      timestamp: Date.now()
    })

    // Boost users get score 0 (highest priority), normal users get timestamp score
    const score = hasMatchBoost ? 0 : Date.now();
    await redis.zAdd('matching_queue', { score, value: queueData })
    console.log(`✅ [QUEUE] User ${userId} added with socket ${socketId} ${hasMatchBoost ? '🚀 (MATCH BOOST - PRIORITY)' : '(normal)'}`)
    
    // Verify it was added and log full queue state
    const queueLen = await redis.zCard('matching_queue')
    const allEntries = await redis.zRange('matching_queue', 0, -1)
    console.log(`📊 [QUEUE] After ADD - Total users in queue: ${queueLen}`)
    for (let i = 0; i < allEntries.length; i++) {
      const entry = JSON.parse(allEntries[i])
      console.log(`   [${i}] User ${entry.userId} - Socket ${entry.socketId.substring(0, 8)}... ${entry.hasMatchBoost ? '🚀 BOOST' : ''}`)
    }
  } catch (error) {
    console.error('❌ Error adding to queue:', error)
  }
}

async function getNextFromQueue() {
  try {
    const queueLen = await redis.zCard('matching_queue')
    console.log(`\n🔍 [QUEUE] Attempting to pop from sorted queue (${queueLen} users waiting)`)
    
    // Get the member with lowest score (boost users first, then oldest normal users)
    const members = await redis.zRange('matching_queue', 0, 0)
    
    if (members && members.length > 0) {
      const data = members[0]
      await redis.zRem('matching_queue', data)
      const parsed = JSON.parse(data)
      const newQueueLen = await redis.zCard('matching_queue')
      console.log(`✅ [QUEUE] Popped user ${parsed.userId} - socket ${parsed.socketId.substring(0, 8)}... ${parsed.hasMatchBoost ? '🚀 BOOST' : ''}`)
      console.log(`📊 [QUEUE] Queue now has ${newQueueLen} users after pop`)
      return parsed
    } else {
      console.log(`⏳ [QUEUE] Queue is empty - no users to pop`)
      return null
    }
  } catch (error) {
    console.error('❌ Error getting from queue:', error)
    return null
  }
}

async function removeUserFromQueue(userId) {
  try {
    // Get all queue entries from sorted set
    const allEntries = await redis.zRange('matching_queue', 0, -1)
    let removedCount = 0
    
    // Find and remove entries matching this userId
    for (const entry of allEntries) {
      const queuedUser = JSON.parse(entry)
      if (queuedUser.userId === userId) {
        await redis.zRem('matching_queue', entry)
        removedCount++
        console.log(`✅ Removed user ${userId} from queue (${removedCount} entry)`)
      }
    }
    
    if (removedCount > 0) {
      console.log(`✅ Totally removed ${removedCount} queue entries for user ${userId}`)
    }
    return removedCount
  } catch (error) {
    console.error('❌ Error removing user from queue:', error)
    return 0
  }
}

async function getQueueLength() {
  try {
    return await redis.zCard('matching_queue')
  } catch (error) {
    console.error('❌ Error getting queue length:', error)
    return 0
  }
}

// Generate unique 8-digit user ID
async function generateUniqueShortId() {
  let shortId
  let exists = true
  let attempts = 0
  const maxAttempts = 100

  while (exists && attempts < maxAttempts) {
    // Generate random 8-digit number
    shortId = Math.floor(10000000 + Math.random() * 90000000).toString()
    
    // Check if it already exists in database
    const existingUser = await prisma.users.findUnique({
      where: { short_id: shortId }
    })
    
    exists = !!existingUser
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique short_id after maximum attempts')
  }

  return shortId
}

// ===== ROUTES =====

// Handle preflight requests for all routes (explicit handler)
app.options('*', (req, res) => {
  const origin = req.headers.origin
  const allowedOriginsList = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
    "http://localhost:3007",
    "http://localhost:3008",
    "http://localhost:3009",
    "http://localhost:3010",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
    "http://127.0.0.1:3004",
    "http://127.0.0.1:3005",
    "http://127.0.0.1:3006",
    "http://127.0.0.1:3007",
    "http://127.0.0.1:3008",
    "http://127.0.0.1:3009",
    "http://127.0.0.1:3010",
    "https://flinxx-backend-frontend.vercel.app",
    "https://flinxx-admin-panel.vercel.app",
    "https://flinxx-frontend.vercel.app",
    "https://flinxx.in",
    "https://www.flinxx.in",
    "https://d1pphanrf0qsx7.cloudfront.net"
  ]
  
  if (allowedOriginsList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, Accept')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
  
  res.sendStatus(200)
})

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', db: 'Connected' })
})

// 🔍 DEBUG ENDPOINT - Check matching queue status
app.get('/api/debug/queue', async (req, res) => {
  try {
    const queueLength = await redis.lLen('matching_queue')
    const queueEntries = await redis.lRange('matching_queue', 0, -1)
    const parsedEntries = queueEntries.map(entry => {
      try {
        return JSON.parse(entry)
      } catch (e) {
        return { error: 'Failed to parse', raw: entry }
      }
    })
    
    res.json({
      status: 'OK',
      queueLength,
      queue: parsedEntries,
      timestamp: new Date().toISOString(),
      inMemoryQueueLength: inMemoryMatchingQueue.length,
      inMemoryQueue: inMemoryMatchingQueue.map(entry => {
        try {
          return JSON.parse(entry)
        } catch (e) {
          return { error: 'Failed to parse', raw: entry }
        }
      })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 🧪 TEST ENDPOINT - Manual matching for debugging
app.post('/api/debug/test-match', async (req, res) => {
  try {
    console.log('\n🧪 MANUAL TEST ENDPOINT CALLED')
    const queueLen = await getQueueLength()
    console.log(`Current queue length: ${queueLen}`)
    
    if (queueLen < 1) {
      return res.json({
        message: 'Queue has fewer than 1 users - cannot test',
        queueLength: queueLen
      })
    }
    
    const user = await getNextFromQueue()
    res.json({
      message: 'Popped user from queue',
      user,
      queueLength: queueLen - 1
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== FIREBASE AUTHENTICATION ENDPOINT =====
// POST /api/auth/firebase
// Frontend sends: Authorization: Bearer <FIREBASE_ID_TOKEN>
// Backend verifies token using Firebase Admin SDK and returns JWT
app.post('/api/auth/firebase', async (req, res) => {
  try {
    console.log('\n🔐 [/api/auth/firebase] Firebase authentication request')
    
    // Get Firebase ID token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Missing or invalid Authorization header')
      return res.status(401).json({ error: 'Missing Firebase ID token' })
    }
    
    const firebaseIdToken = authHeader.substring(7)
    console.log('📍 Firebase ID token received, length:', firebaseIdToken.length)
    
    // 🔥 VERIFY Firebase token using Firebase Admin SDK
    console.log('🔥 Verifying Firebase token with Admin SDK...')
    const decodedToken = await verifyFirebaseToken(firebaseIdToken)
    
    if (!decodedToken) {
      console.error('❌ Firebase token verification failed')
      return res.status(401).json({ error: 'Invalid or expired Firebase token' })
    }
    
    // Extract user data from verified Firebase token
    const firebaseUid = decodedToken.uid
    const email = decodedToken.email
    const name = decodedToken.name || 'User'
    const picture = decodedToken.picture || null
    
    if (!firebaseUid || !email) {
      console.error('❌ Firebase token missing required fields')
      return res.status(401).json({ error: 'Invalid Firebase token data' })
    }
    
    console.log('✅ Firebase token verified successfully')
    console.log('🔍 Firebase user:', { firebaseUid, email, name })
    
    // Find or create user in database
    let user = await prisma.users.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('👤 Creating new user...')
      
      // Generate unique public_id
      let publicId
      let publicIdExists = true
      const maxAttempts = 100
      let attempts = 0
      
      while (publicIdExists && attempts < maxAttempts) {
        publicId = Math.floor(10000000 + Math.random() * 90000000).toString()
        const existing = await prisma.users.findUnique({
          where: { public_id: publicId }
        })
        publicIdExists = !!existing
        attempts++
      }
      
      if (attempts >= maxAttempts) {
        console.error('❌ Failed to generate unique public_id')
        return res.status(500).json({ error: 'Failed to create user' })
      }
      
      user = await prisma.users.create({
        data: {
          email,
          display_name: name,
          photo_url: picture,
          auth_provider: 'google',
          provider_id: firebaseUid,
          google_id: firebaseUid,
          public_id: publicId,
          profileCompleted: false
        }
      })
      
      console.log('✅ New user created:', user.email)
    } else {
      console.log('👤 User found, updating last login...')
      // Update last login time
      user = await prisma.users.update({
        where: { email },
        data: {
          updated_at: new Date()
        }
      })
    }
    
    // Generate JWT token for frontend
    const backendJWT = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        publicId: user.public_id,
        firebaseUid: firebaseUid,
        authProvider: user.auth_provider
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )
    
    console.log('✅ Backend JWT generated successfully')
    
    // Return JWT and user info
    return res.json({
      success: true,
      token: backendJWT,
      user: {
        id: user.id,
        uuid: user.id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        publicId: user.public_id,
        profileCompleted: user.profileCompleted
      }
    })
    
  } catch (error) {
    console.error('❌ Firebase authentication error:', error)
    console.error('📍 Error details:', error.message)
    return res.status(500).json({ error: 'Authentication failed', details: error.message })
  }
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
app.post("/api/get-turn-credentials", async (req, res) => {
  try {
    const getTurnServers = async () => {
      try {
        const ident = process.env.XIRSYS_IDENT;
        const secret = process.env.XIRSYS_SECRET;
        const channel = process.env.XIRSYS_CHANNEL || "MyFirstApp";

        if (!ident || !secret) {
          console.error("❌ Missing XIRSYS_IDENT or XIRSYS_SECRET environment variables");
          return null;
        }

        const auth = Buffer.from(`${ident}:${secret}`).toString("base64");

        const res = await fetch(
          `https://global.xirsys.net/_turn/${channel}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ format: "urls" }),
          }
        );

        const data = await res.json();
        console.log("✅ Xirsys TURN response:", data);

        if (Array.isArray(data.v.iceServers)) {
          return data.v.iceServers;
        } else {
          console.error("❌ Invalid Xirsys response format");
          return null;
        }
      } catch (err) {
        console.error("❌ TURN fetch failed:", err);
        return null;
      }
    };

    const iceServers = await getTurnServers();
    
    if (!iceServers) {
      console.warn("⚠️ Failed to fetch TURN servers, returning error");
      return res.status(500).json({ error: "TURN fetch failed", iceServers: [] });
    }

    res.json({ iceServers });

  } catch (err) {
    console.error("TURN ERROR:", err);
    res.status(500).json({ error: "TURN fetch failed", iceServers: [] });
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

    console.log(`📝 [/api/users/save] Saving user to database: ${email}`)
    console.log(`   - UID: ${uid}`)
    console.log(`   - Auth Provider: ${authProvider}`)

    // CRITICAL: Use Prisma for consistency with OAuth flow
    ensurePrismaAvailable()
    
    // Check if user already exists
    let user = await prisma.users.findUnique({
      where: { email: email }
    })
    
    let isNewUser = false
    if (!user) {
      console.log(`📝 [/api/users/save] New user detected, creating account...`)
      
      // Generate unique public ID
      const publicId = await generateUniquePublicId()
      console.log(`✅ [/api/users/save] Generated public_id:`, publicId)
      
      // Create user with Prisma
      console.log(`💾 [/api/users/save] Calling prisma.users.create()...`)
      user = await prisma.users.create({
        data: {
          email: email,
          display_name: displayName || 'User',
          photo_url: photoURL || null,
          auth_provider: authProvider || 'unknown',
          provider_id: uid,
          public_id: publicId,
          profileCompleted: false,
          termsAccepted: false
        }
      })
      isNewUser = true
      console.log(`✅ [/api/users/save] New user created in database:`, user.email)
    } else {
      console.log(`✅ [/api/users/save] Existing user found:`, user.email)
      // Ensure they have a public_id
      if (!user.public_id) {
        const publicId = await generateUniquePublicId()
        user = await prisma.users.update({
          where: { id: user.id },
          data: { public_id: publicId }
        })
        console.log(`✅ [/api/users/save] Generated public_id for existing user:`, publicId)
      }
    }
    
    // Verify user was actually saved
    console.log(`🔍 [/api/users/save] Verifying user was saved to database...`)
    const verifyUser = await prisma.users.findUnique({
      where: { id: user.id }
    })
    
    if (!verifyUser) {
      throw new Error('CRITICAL: User creation failed - could not verify user in database')
    }
    
    console.log(`✅ [/api/users/save] Database verification successful:`, verifyUser.email)

    res.json({
      success: true,
      user: {
        uuid: user.id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        authProvider: user.auth_provider,
        profileCompleted: user.profileCompleted,
        birthday: user.birthday,
        gender: user.gender,
        age: user.age
      }
    })
  } catch (error) {
    console.error('\n❌ [/api/users/save] CRITICAL ERROR:', error.message)
    console.error('   Stack:', error.stack)
    console.error('   This user signup will FAIL\n')
    res.status(500).json({ error: 'Failed to save user', details: error.message })
  }
})

// Complete user profile with birthday and gender
app.post('/api/users/complete-profile', async (req, res) => {
  try {
    // Log incoming request
    console.log('\n\n📨 ===== COMPLETE-PROFILE ENDPOINT CALLED =====');
    console.log('[PROFILE SAVE] Request method:', req.method);
    console.log('[PROFILE SAVE] Request URL:', req.url);
    console.log('[PROFILE SAVE] Content-Type header:', req.headers['content-type']);
    console.log('[PROFILE SAVE] Request headers:', req.headers);
    console.log('[PROFILE SAVE] Request body:', JSON.stringify(req.body, null, 2));
    console.log('[PROFILE SAVE] Request body type:', typeof req.body);
    console.log('[PROFILE SAVE] Request body keys:', req.body ? Object.keys(req.body) : 'no body');
    
    const { userId, birthday, gender } = req.body

    console.log('[PROFILE SAVE] Extracted fields:');
    console.log('  - userId:', userId, '(type: ' + typeof userId + ')');
    console.log('  - birthday:', birthday, '(type: ' + typeof birthday + ')');
    console.log('  - gender:', gender, '(type: ' + typeof gender + ')');

    // Validate required fields
    if (!userId) {
      console.error('[PROFILE SAVE] ❌ VALIDATION ERROR: Missing userId');
      console.error('[PROFILE SAVE] Request body was:', req.body);
      return res.status(400).json({ error: 'Missing required field: userId' })
    }
    if (!birthday) {
      console.error('[PROFILE SAVE] ❌ VALIDATION ERROR: Missing birthday');
      return res.status(400).json({ error: 'Missing required field: birthday' })
    }
    if (!gender) {
      console.error('[PROFILE SAVE] ❌ VALIDATION ERROR: Missing gender');
      return res.status(400).json({ error: 'Missing required field: gender' })
    }

    // ✅ CRITICAL: Validate gender is only male or female
    const validGenders = ['male', 'female'];
    const genderLowercase = gender.toLowerCase().trim();
    if (!validGenders.includes(genderLowercase)) {
      console.error(`[PROFILE SAVE] ❌ VALIDATION ERROR: Invalid gender value: ${gender}. Only 'male' and 'female' are allowed.`);
      return res.status(400).json({ error: 'Invalid gender. Only "male" and "female" are allowed.' });
    }

    // Validate birthday format (YYYY-MM-DD)
    if (typeof birthday !== 'string' || birthday.length < 10) {
      console.error(`[PROFILE SAVE] ❌ VALIDATION ERROR: Invalid birthday format received: ${birthday} (type: ${typeof birthday}, length: ${birthday?.length})`);
      return res.status(400).json({ error: 'Invalid birthday format. Expected YYYY-MM-DD' })
    }

    // Validate birthday is a valid ISO date
    if (isNaN(Date.parse(birthday))) {
      console.error(`[PROFILE SAVE] ❌ VALIDATION ERROR: Birthday is not a valid date: ${birthday}`);
      return res.status(400).json({ error: 'Invalid birthday date. Must be a valid date' })
    }

    console.log(`[PROFILE SAVE] ✓ All validations passed`);
    console.log(`[PROFILE SAVE] Completing profile for user: ${userId}`);
    console.log(`[PROFILE SAVE] Birthday: ${birthday}, Gender: ${gender}`);

    // Verify user exists in database
    console.log('[PROFILE SAVE] Checking if user exists in database...');
    
    // Try to find user by ID (UUID from frontend) first
    let existingUser = await prisma.users.findUnique({
      where: { id: userId }
    })
    
    // If not found by ID, try by public_id for backward compatibility
    if (!existingUser) {
      console.log('[PROFILE SAVE] User not found by UUID, trying by public_id...');
      existingUser = await prisma.users.findUnique({
        where: { public_id: userId }
      })
    }

    if (!existingUser) {
      console.error(`[PROFILE SAVE] ❌ DATABASE ERROR: User not found in database: ${userId}`);
      return res.status(404).json({ error: 'User not found' })
    }

    console.log(`[PROFILE SAVE] ✓ User verified in DB: ${existingUser.email}`);
    console.log(`[PROFILE SAVE] Current user data:`, JSON.stringify({
      id: existingUser.id,
      email: existingUser.email,
      birthday: existingUser.birthday,
      gender: existingUser.gender,
      age: existingUser.age,
      profileCompleted: existingUser.profileCompleted
    }, null, 2));

    // Ensure user has an 8-digit public ID
    let publicId = existingUser.public_id;
    if (!publicId) {
      console.log('[PROFILE SAVE] ⚠️ public_id missing, generating new one');
      publicId = await generateUniquePublicId();
      await prisma.users.update({
        where: { id: existingUser.id },
        data: { public_id: publicId }
      });
      console.log('[PROFILE SAVE] ✅ public_id generated:', publicId);
    } else {
      console.log('[PROFILE SAVE] ✓ public_id already exists:', publicId);
    }

    // Calculate age from birthday
    console.log('[PROFILE SAVE] Calculating age from birthday:', birthday);
    
    // Parse the date more explicitly to avoid timezone issues
    // Birthday format is YYYY-MM-DD
    const [year, month, day] = birthday.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day, 12, 0, 0); // Set to noon to avoid timezone issues
    
    // Validate date is valid
    if (isNaN(birthDate.getTime())) {
      console.error(`[PROFILE SAVE] ❌ VALIDATION ERROR: Invalid date value: ${birthday}`);
      return res.status(400).json({ error: 'Invalid birthday date' })
    }

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    console.log(`[PROFILE SAVE] ✓ Calculated age: ${age}`);

    // Check if user is 18 or older
    if (age < 18) {
      console.warn(`[PROFILE SAVE] ⚠️ AGE VALIDATION FAILED: User ${userId} is under 18 (age: ${age})`);
      return res.status(400).json({ 
        error: 'You must be 18+ to use this app',
        code: 'UNDERAGE_USER'
      })
    }

    // Update user profile with Prisma
    console.log(`[PROFILE SAVE] ✓ Validation passed, updating user profile`);
    console.log(`[PROFILE SAVE] Updating user with:`);
    console.log(`  - birthday: ${birthday} (type: ${typeof birthday})`);
    console.log(`  - birthDate: ${birthDate.toISOString()}`);
    console.log(`  - gender: ${genderLowercase}`);
    console.log(`  - age: ${age}`);
    console.log(`  - profileCompleted: true`);
    
    const user = await prisma.users.update({
      where: { id: existingUser.id },
      data: {
        birthday: birthDate,
        gender: genderLowercase,
        age: age,
        profileCompleted: true
      }
    })

    console.log(`[PROFILE SAVE] ✅ PROFILE UPDATED SUCCESSFULLY`);
    console.log(`[PROFILE SAVE] User email: ${user.email}`);
    console.log(`[PROFILE SAVE] Updated user data:`, JSON.stringify({
      id: user.public_id,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      age: user.age,
      profileCompleted: user.profileCompleted
    }, null, 2));

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('[PROFILE SAVE] ❌ ===== PROFILE UPDATE ERROR =====');
    console.error('[PROFILE SAVE] Error message:', error.message);
    console.error('[PROFILE SAVE] Error type:', error.constructor.name);
    console.error('[PROFILE SAVE] Error stack:', error.stack);
    if (error.meta) {
      console.error('[PROFILE SAVE] Prisma meta:', JSON.stringify(error.meta, null, 2));
    }
    if (error.code) {
      console.error('[PROFILE SAVE] Error code:', error.code);
    }
    console.error('[PROFILE SAVE] Full error:', JSON.stringify(error, null, 2));
    
    // Return more detailed error message for debugging
    res.status(500).json({ 
      error: 'Failed to complete profile', 
      details: error.message,
      type: error.constructor.name
    })
  }
})

// Reset profile status (for development/debugging)
app.post('/api/users/reset-profile', async (req, res) => {
  try {
    console.log('\n\n📋 ===== RESET PROFILE ENDPOINT CALLED =====');
    console.log('[RESET PROFILE] Request received');
    console.log('[RESET PROFILE] Request body:', JSON.stringify(req.body, null, 2));
    
    const { userId } = req.body;
    
    console.log('[RESET PROFILE] Extracted userId:', userId);
    
    if (!userId) {
      console.error('[RESET PROFILE] ❌ VALIDATION ERROR: Missing userId');
      return res.status(400).json({ error: 'Missing required field: userId' });
    }
    
    // Find user
    console.log('[RESET PROFILE] Finding user with id:', userId);
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('[RESET PROFILE] ❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('[RESET PROFILE] ✓ User found:', user.email);
    console.log('[RESET PROFILE] Current profileCompleted status:', user.profileCompleted);
    
    // Reset profileCompleted to false
    console.log('[RESET PROFILE] Resetting profileCompleted to false...');
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        profileCompleted: false,
        birthday: null,
        gender: null,
        age: null
      }
    });
    
    console.log('[RESET PROFILE] ✅ Profile reset successfully');
    console.log('[RESET PROFILE] Updated user data:', {
      id: updatedUser.id,
      email: updatedUser.email,
      profileCompleted: updatedUser.profileCompleted,
      birthday: updatedUser.birthday,
      gender: updatedUser.gender,
      age: updatedUser.age
    });
    
    res.json({
      success: true,
      message: 'Profile reset successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        profileCompleted: updatedUser.profileCompleted,
        birthday: updatedUser.birthday,
        gender: updatedUser.gender,
        age: updatedUser.age
      }
    });
  } catch (error) {
    console.error('[RESET PROFILE] ❌ ERROR:', error.message);
    console.error('[RESET PROFILE] Stack:', error.stack);
    res.status(500).json({ error: 'Failed to reset profile', details: error.message });
  }
});

// Accept terms and conditions
app.post('/api/users/accept-terms', async (req, res) => {
  try {
    console.log('\n\n📋 ===== ACCEPT-TERMS ENDPOINT CALLED =====');
    console.log('[ACCEPT TERMS] Request body:', JSON.stringify(req.body, null, 2));
    
    const { userId } = req.body;
    
    console.log('[ACCEPT TERMS] Extracted userId:', userId);
    
    if (!userId) {
      console.error('[ACCEPT TERMS] ❌ VALIDATION ERROR: Missing userId');
      return res.status(400).json({ error: 'Missing required field: userId' });
    }
    
    // Find user
    console.log('[ACCEPT TERMS] Finding user with id:', userId);
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('[ACCEPT TERMS] ❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('[ACCEPT TERMS] ✓ User found:', user.email);
    console.log('[ACCEPT TERMS] Current termsAccepted status:', user.termsAccepted);
    
    // Update termsAccepted to true
    console.log('[ACCEPT TERMS] Setting termsAccepted to true...');
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        termsAccepted: true
      }
    });
    
    console.log('[ACCEPT TERMS] ✅ TERMS ACCEPTED SUCCESSFULLY');
    console.log('[ACCEPT TERMS] User email:', updatedUser.email);
    console.log('[ACCEPT TERMS] Updated user data:', {
      id: updatedUser.id,
      email: updatedUser.email,
      termsAccepted: updatedUser.termsAccepted
    });
    
    res.json({
      success: true,
      message: 'Terms accepted successfully',
      user: {
        uuid: updatedUser.id,
        email: updatedUser.email,
        termsAccepted: updatedUser.termsAccepted
      }
    });
  } catch (error) {
    console.error('[ACCEPT TERMS] ❌ ERROR:', error.message);
    console.error('[ACCEPT TERMS] Stack:', error.stack);
    res.status(500).json({ error: 'Failed to accept terms', details: error.message });
  }
});

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
      id: user.public_id,
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
      id: user.public_id,
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

// ✅ Check friend online status & last seen
app.get('/api/user/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const isOnline = onlineUsers.has(userId);
    let lastSeen = null;
    if (!isOnline) {
      const result = await pool.query('SELECT last_seen FROM users WHERE id = $1', [userId]);
      if (result.rows.length > 0 && result.rows[0].last_seen) {
        lastSeen = result.rows[0].last_seen;
      }
    }
    res.json({ isOnline, lastSeen });
  } catch (err) {
    console.error('❌ Error checking user status:', err.message);
    res.json({ isOnline: false, lastSeen: null });
  }
});

// Get user profile by ID or email (for frontend)
app.get('/api/user/profile', verifyUserToken, async (req, res) => {
  try {
    const decoded = req.decoded;
    
    console.log("\n📡 [/api/user/profile] ═══════════════════════════════════════════");
    console.log("📡 [/api/user/profile] ENDPOINT CALLED");
    console.log("📡 [/api/user/profile] User UUID:", decoded.id);
    console.log("📡 [/api/user/profile] User email:", decoded.email);
    
    // Check if user ID exists
    if (!decoded?.id) {
      console.error("📡 [/api/user/profile] ❌ USER ID NOT FOUND IN TOKEN");
      return res.status(401).json({ message: "Invalid token payload" });
    }
    
    console.log("\n📝 [UPDATE LAST_SEEN] ═══════════════════════════════════════════");
    console.log("📝 [UPDATE LAST_SEEN] Updating last_seen for user:", decoded.id);
    console.log("USER ID USED FOR UPDATE:", decoded.id);
    const startTime = Date.now();

    const updateResult = await prisma.users.update({
      where: { id: decoded.id },
      data: { last_seen: new Date() }
    });

    const updateTime = Date.now() - startTime;
    console.log("✅ [UPDATE LAST_SEEN] last_seen updated for user:", decoded.id);
    console.log("✅ [UPDATE LAST_SEEN] Update took:", updateTime, "ms");
    console.log("✅ last_seen updated:", updateResult.id, updateResult.last_seen);

    // Fetch updated user profile
    console.log("\n📖 [FETCH PROFILE] Fetching user profile from database...");
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        public_id: true,
        email: true,
        display_name: true,
        photo_url: true,
        location: true,
        auth_provider: true,
        created_at: true,
        updated_at: true,
        last_seen: true
      }
    });

    if (!user) {
      console.error("📖 [FETCH PROFILE] ❌ User not found in database!");
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("📖 [FETCH PROFILE] ✓ Profile fetched successfully");
    console.log("📖 [FETCH PROFILE] Email:", user.email);
    console.log("📖 [FETCH PROFILE] Last_seen in DB:", user.last_seen);
    
    console.log("\n✅ [/api/user/profile] ═══════════════════════════════════════════");
    console.log("✅ [/api/user/profile] RESPONSE SUCCESS");
    console.log("✅ [/api/user/profile] Sending response to frontend...\n");
    
    res.json({
      success: true,
      user: {
        id: user.public_id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        location: user.location || null,
        authProvider: user.auth_provider,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastSeen: user.last_seen
      }
    });
  } catch (error) {
    console.error('❌ [/api/user/profile] ERROR:', error.message);
    console.error('❌ [/api/user/profile] Full error:', error);
    console.error('❌ [/api/user/profile] ═══════════════════════════════════════════\n');
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

// ===== GOOGLE OAUTH ROUTES =====

// Get Google OAuth tokens
const getGoogleTokens = async (code) => {
  try {
    // FALLBACK: Support both GOOGLE_REDIRECT_URI and GOOGLE_CALLBACK_URL
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL
    if (!redirectUri) {
      throw new Error('Neither GOOGLE_REDIRECT_URI nor GOOGLE_CALLBACK_URL environment variable is set')
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

// ===== FACEBOOK OAUTH FUNCTIONS =====

// Get Facebook tokens
const getFacebookTokens = async (code) => {
  try {
    const callbackUrl = process.env.FACEBOOK_CALLBACK_URL
    if (!callbackUrl) {
      throw new Error('FACEBOOK_CALLBACK_URL environment variable is not set')
    }
    console.log(`🔐 Exchanging Facebook code with callback_url: ${callbackUrl}`)
    const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: code,
        redirect_uri: callbackUrl
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get tokens: ${response.status} - ${errorText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('❌ Error getting Facebook tokens:', error)
    throw error
  }
}

// Get Facebook user info
const getFacebookUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://graph.facebook.com/v18.0/me?fields=id,name,email,picture', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      picture: data.picture?.data?.url || null
    }
  } catch (error) {
    console.error('❌ Error getting Facebook user info:', error)
    throw error
  }
}

// Search user by ID (short_id field - 8-digit user ID)
app.get('/api/search-user', async (req, res) => {
  try {
    const searchId = req.query.q?.trim();

    console.log('\n🔍 [SEARCH USER] Search request received');
    console.log('  - Query param:', searchId);
    console.log('  - Query type:', typeof searchId);

    if (!searchId || searchId.length === 0) {
      console.log('[SEARCH USER] Empty search query');
      return res.json([]);
    }

    // Search by public_id field (8-digit user ID)
    console.log('[SEARCH USER] Searching database for public_id:', searchId);
    
    const user = await prisma.users.findFirst({
      where: {
        public_id: searchId  // 8-digit ID exact match
      },
      select: {
        id: true,
        email: true,
        display_name: true,
        photo_url: true,
        public_id: true,
        age: true,
        gender: true,
        has_blue_tick: true,
        blue_tick_expires_at: true
      }
    });

    console.log('[SEARCH USER] Search result:', user ? 'Found' : 'Not found');

    if (user) {
      console.log('[SEARCH USER] ✅ User found:', {
        id: user.public_id,
        email: user.email,
        public_id: user.public_id
      });
      return res.json([{
        name: user.display_name || 'User',
        avatar: user.photo_url || '👤',
        email: user.email,
        publicId: user.public_id,
        age: user.age,
        gender: user.gender,
        hasBlueTick: !!(user.has_blue_tick && user.blue_tick_expires_at && new Date(user.blue_tick_expires_at) > new Date())
      }]);
    } else {
      console.log('[SEARCH USER] ❌ No user found with public_id:', searchId);
      return res.json([]);
    }
  } catch (error) {
    console.error('[SEARCH USER] ❌ Search error:', error.message);
    console.error('[SEARCH USER] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Search failed', 
      details: error.message 
    });
  }
})

// ===== FRIEND REQUEST ENDPOINTS =====

// Send friend request
app.post('/api/friends/send', async (req, res) => {
  try {
    const { senderPublicId, receiverPublicId } = req.body

    console.log("FRIEND REQUEST PAYLOAD:", {
      senderPublicId,
      receiverPublicId
    });

    if (!senderPublicId || !receiverPublicId) {
      return res.status(400).json({ error: 'Missing senderPublicId or receiverPublicId' })
    }

    // Fetch sender and receiver UUIDs from database
    const [sender, receiver] = await Promise.all([
      prisma.users.findUnique({ where: { public_id: senderPublicId } }),
      prisma.users.findUnique({ where: { public_id: receiverPublicId } })
    ])

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check for duplicate pending request
    const existingRequest = await pool.query(
      `SELECT id FROM friend_requests 
       WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'
       LIMIT 1`,
      [sender.id, receiver.id]
    )

    if (existingRequest.rows.length > 0) {
      console.log(`⚠️ Duplicate request already exists from ${sender.public_id} to ${receiver.public_id}`)
      return res.status(400).json({ error: 'Friend request already pending' })
    }

    // Insert friend request
    const result = await pool.query(
      `INSERT INTO friend_requests (sender_id, receiver_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, sender_id, receiver_id, status, created_at`,
      [sender.id, receiver.id]
    )

    const request = result.rows[0]
    console.log(`✅ Friend request sent from ${sender.public_id} to ${receiver.public_id}`)

    // 🔔 EMIT REALTIME NOTIFICATION IF RECEIVER IS ONLINE
    // ✅ FIX: Use UUID for lookup, not numeric ID (frontend sends UUID in register_user)
    const receiverUuid = receiver.uuid
    const receiverSocketId = onlineUsers.get(receiverUuid)
    
    console.log(`🔍 [LOOKUP] Looking for receiver UUID: ${receiverUuid.substring(0, 8)}...`)
    console.log(`🔍 [LOOKUP] Found socket ID: ${receiverSocketId ? receiverSocketId.substring(0, 8) + '...' : 'NOT FOUND'}`)
    console.log(`🔍 [LOOKUP] Current online users: ${onlineUsers.size}`)
    
    if (receiverSocketId) {
      const eventPayload = {
        requestId: request.id,
        senderId: sender.id,
        senderPublicId: sender.public_id,
        senderName: sender.display_name || 'User',
        senderProfileImage: sender.photo_url,
        createdAt: request.created_at,
        status: 'pending'
      };
      console.log(`🔥🔥🔥 [BACKEND] EMITTING friend_request_received EVENT 🔥🔥🔥`);
      console.log(`📢 Target Socket ID: ${receiverSocketId.substring(0, 8)}...`);
      console.log(`📢 Target User: ${receiver.public_id}`);
      console.log(`📢 Payload:`, eventPayload);
      
      io.to(receiverSocketId).emit('friend_request_received', eventPayload);
      
      console.log(`✅ Event emitted successfully to ${receiver.public_id}`);
    } else {
      console.log(`⚠️ Receiver ${receiver.public_id} is offline - request saved to DB only`)
    }

    res.status(201).json({
      success: true,
      message: 'Friend request sent',
      requestId: request.id
    })
  } catch (error) {
    console.error('❌ Error sending friend request:', error)
    res.status(500).json({ error: 'Failed to send friend request', details: error.message })
  }
})

// Accept friend request
app.post('/api/friends/accept', async (req, res) => {
  try {
    const { requestId } = req.body

    if (!requestId) {
      return res.status(400).json({ error: 'Missing requestId' })
    }

    // Update request status to accepted
    const result = await pool.query(
      `UPDATE friend_requests
       SET status = 'accepted'
       WHERE id = $1
       RETURNING id, sender_id, receiver_id, status`,
      [requestId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' })
    }

    const request = result.rows[0]
    console.log(`✅ Friend request ${requestId} accepted`)

    // ✅ Emit socket event to BOTH sender and receiver so both see "Now you are friends"
    try {
      const senderId = request.sender_id;
      const receiverId = request.receiver_id;
      
      // Find socket IDs for both users
      for (const [socketId, userId] of userSockets.entries()) {
        if (userId === senderId || userId === receiverId) {
          const sock = io.sockets.sockets.get(socketId);
          if (sock) {
            sock.emit('friend_request_accepted', { senderId, receiverId, requestId });
            console.log(`📨 Sent friend_request_accepted to ${userId.substring(0, 8)}... (socket ${socketId.substring(0, 8)}...)`);
          }
        }
      }
    } catch (socketErr) {
      console.warn('⚠️ Could not emit friend_request_accepted socket event:', socketErr.message);
    }

    res.json({
      success: true,
      message: 'Friend request accepted',
      request
    })
  } catch (error) {
    console.error('❌ Error accepting friend request:', error)
    res.status(500).json({ error: 'Failed to accept friend request', details: error.message })
  }
})

// Reject friend request
app.post('/api/friends/reject', async (req, res) => {
  try {
    const { requestId } = req.body

    if (!requestId) {
      return res.status(400).json({ error: 'Missing requestId' })
    }

    // Delete friend request
    const result = await pool.query(
      `DELETE FROM friend_requests
       WHERE id = $1
       RETURNING id`,
      [requestId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' })
    }

    console.log(`✅ Friend request ${requestId} rejected`)

    res.json({
      success: true,
      message: 'Friend request rejected'
    })
  } catch (error) {
    console.error('❌ Error rejecting friend request:', error)
    res.status(500).json({ error: 'Failed to reject friend request', details: error.message })
  }
})

// Get friend request status between two users
app.get('/api/friends/status', async (req, res) => {
  try {
    const { senderPublicId, receiverPublicId } = req.query

    if (!senderPublicId || !receiverPublicId) {
      return res.status(400).json({ message: 'Missing user IDs' })
    }

    // Fetch user IDs from database
    const [sender, receiver] = await Promise.all([
      prisma.users.findUnique({ where: { public_id: senderPublicId } }),
      prisma.users.findUnique({ where: { public_id: receiverPublicId } })
    ])

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if there's a friend request between them
    const friendRequest = await pool.query(
      `SELECT status FROM friend_requests 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       LIMIT 1`,
      [sender.id, receiver.id]
    )

    if (friendRequest.rows.length > 0) {
      return res.json({ status: friendRequest.rows[0].status })
    }

    res.json({ status: 'none' }) // 'none' | 'pending' | 'accepted'
  } catch (error) {
    console.error('❌ Error checking friend status:', error)
    res.status(500).json({ error: 'Failed to check friend status', details: error.message })
  }
})

// Get incoming friend requests (for notifications)
app.get('/api/friends/requests/incoming', authMiddleware, async (req, res) => {
  try {
    const receiverId = req.user.id // UUID from authMiddleware
    
    console.log('📬 Fetching incoming requests for user:', receiverId)
    
    const result = await pool.query(
      `
      SELECT
        fr.id,
        fr.status,
        fr.created_at,
        u.public_id AS sender_public_id,
        u.display_name AS sender_name,
        u.photo_url AS sender_avatar
      FROM friend_requests fr
      JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = $1
      ORDER BY fr.created_at DESC
      `,
      [receiverId]
    )

    console.log('✅ Found', result.rows.length, 'incoming requests')
    res.json(result.rows)
  } catch (err) {
    console.error('❌ Incoming requests error:', err)
    res.status(500).json({ error: 'Failed to fetch requests' })
  }
})

// Get friend requests (alias for /incoming - for notifications modal)
app.get('/api/friends/requests', authMiddleware, async (req, res) => {
  try {
    const receiverId = req.user.id // UUID from authMiddleware
    const publicId = req.user.publicId
    
    console.log('📬 Fetching friend requests for user:', { receiverId, publicId })
    
    // Query for all friend requests where this user is the receiver
    const result = await pool.query(
      `
      SELECT
        fr.id,
        fr.status,
        fr.created_at,
        u.public_id AS sender_public_id,
        u.display_name AS sender_name,
        u.photo_url AS sender_avatar
      FROM friend_requests fr
      JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = $1
      ORDER BY fr.created_at DESC
      `,
      [receiverId]
    )

    console.log('✅ Found', result.rows.length, 'friend requests for user', publicId)
    res.json(result.rows)
  } catch (err) {
    console.error('❌ Friend requests error:', err)
    res.status(500).json({ error: 'Failed to fetch requests' })
  }
})

// Step 1: Redirect to Google OAuth consent screen
app.get('/auth/google', (req, res) => {
  try {
    // Validate all required env vars with fallback support
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    // FALLBACK: Support both GOOGLE_REDIRECT_URI and GOOGLE_CALLBACK_URL
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL
    
    console.log(`🔗 [/auth/google] GOOGLE_CLIENT_ID exists:`, !!clientId)
    console.log(`🔗 [/auth/google] GOOGLE_CLIENT_SECRET exists:`, !!clientSecret)
    console.log(`🔗 [/auth/google] GOOGLE_REDIRECT_URI exists:`, !!process.env.GOOGLE_REDIRECT_URI)
    console.log(`🔗 [/auth/google] GOOGLE_CALLBACK_URL exists:`, !!process.env.GOOGLE_CALLBACK_URL)
    console.log(`🔗 [/auth/google] Final redirectUri using:`, process.env.GOOGLE_REDIRECT_URI ? 'GOOGLE_REDIRECT_URI' : 'GOOGLE_CALLBACK_URL')
    
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is not set')
    }
    if (!clientSecret) {
      throw new Error('GOOGLE_CLIENT_SECRET environment variable is not set')
    }
    if (!redirectUri) {
      throw new Error('Neither GOOGLE_REDIRECT_URI nor GOOGLE_CALLBACK_URL environment variable is set')
    }
    
    console.log(`🔗 [/auth/google] Google OAuth initiated with redirect_uri: ${redirectUri}`)
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent'
    })
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    console.log(`🔗 [/auth/google] Redirecting to Google consent screen`)
    res.redirect(authUrl)
  } catch (error) {
    console.error('❌ [/auth/google] Error:', error.message)
    console.error('❌ [/auth/google] Full error:', error)
    res.status(500).json({ error: 'Failed to initiate Google login', details: error.message })
  }
})
// Step 2: Handle Google OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query
    
    console.log(`\n🔐 [AUTH/GOOGLE/CALLBACK] Starting Google OAuth callback...`)
    
    if (error) {
      console.error(`❌ [AUTH/GOOGLE/CALLBACK] Google OAuth error: ${error}`)
      const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
      return res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=${error}`)
    }
    
    if (!code) {
      console.error('❌ [AUTH/GOOGLE/CALLBACK] No authorization code received')
      const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
      return res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=no_code`)
    }
    
    console.log(`📝 [AUTH/GOOGLE/CALLBACK] Received authorization code: ${code.substring(0, 10)}...`)
    
    // Verify Prisma is available
    ensurePrismaAvailable()
    
    // Exchange code for tokens
    console.log(`🔐 [AUTH/GOOGLE/CALLBACK] Exchanging code for tokens...`)
    const tokens = await getGoogleTokens(code)
    console.log(`✅ [AUTH/GOOGLE/CALLBACK] Got access token from Google`)
    
    // Get user info
    console.log(`🔐 [AUTH/GOOGLE/CALLBACK] Retrieving user info...`)
    const userInfo = await getGoogleUserInfo(tokens.access_token)
    console.log(`✅ [AUTH/GOOGLE/CALLBACK] Retrieved user info:`, userInfo.email)
    
    // Check if user already exists
    console.log(`🔍 [AUTH/GOOGLE/CALLBACK] Checking if user exists in database...`)
    let existingUser = await prisma.users.findUnique({
      where: { email: userInfo.email }
    })
    console.log(`${existingUser ? '✅' : '📝'} [AUTH/GOOGLE/CALLBACK] User exists: ${!!existingUser}`)
    
    let isNewUser = false
    let user
    
    if (!existingUser) {
      // NEW USER - Generate unique public ID
      console.log(`📝 [AUTH/GOOGLE/CALLBACK] New user detected, creating account...`)
      const publicId = await generateUniquePublicId()
      console.log(`✅ [AUTH/GOOGLE/CALLBACK] Generated public_id:`, publicId)
      
      console.log(`💾 [AUTH/GOOGLE/CALLBACK] Calling prisma.users.create()...`)
      user = await prisma.users.create({
        data: {
          email: userInfo.email,
          display_name: userInfo.name || 'User',
          photo_url: userInfo.picture || null,
          auth_provider: 'google',
          provider_id: userInfo.id,
          google_id: userInfo.id,
          public_id: publicId,
          profileCompleted: false,
          termsAccepted: false
        }
      })
      
      console.log(`✅ [AUTH/GOOGLE/CALLBACK] User created in database:`, user.email)
      console.log(`✅ [AUTH/GOOGLE/CALLBACK] User ID: ${user.id}`)
      console.log(`✅ [AUTH/GOOGLE/CALLBACK] Email: ${user.email}`)
      console.log(`✅ [AUTH/GOOGLE/CALLBACK] Public ID: ${user.public_id}`)
      
      // CRITICAL: Verify user was actually saved before proceeding
      console.log(`🔍 [AUTH/GOOGLE/CALLBACK] Verifying user was saved to database...`)
      const verifyUser = await prisma.users.findUnique({
        where: { id: user.id }
      })
      if (!verifyUser) {
        throw new Error('CRITICAL: User creation failed - user not found after create()')
      }
      console.log(`✅ [AUTH/GOOGLE/CALLBACK] Database verification successful`)
      
      isNewUser = true
    } else {
      // EXISTING USER
      console.log(`✅ [AUTH/GOOGLE/CALLBACK] Existing user found:`, existingUser.email)
      
      // Ensure existing user has a public_id (migrate if needed)
      if (!existingUser.public_id) {
        console.log(`⚠️ [AUTH/GOOGLE/CALLBACK] Existing user missing public_id, generating one...`)
        const publicId = await generateUniquePublicId()
        user = await prisma.users.update({
          where: { id: existingUser.id },
          data: { public_id: publicId }
        })
        console.log(`✅ [AUTH/GOOGLE/CALLBACK] Generated and saved public_id for existing user:`, publicId)
      } else {
        user = existingUser
      }
      isNewUser = false
    }
    
    // Create a proper JWT token (NOT base64)
    const token = jwt.sign({
      id: user.id,
      userId: user.id,
      email: user.email,
      publicId: user.public_id
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log("✅ [AUTH/GOOGLE/CALLBACK] JWT token created with id:", user.id);
    
    // Build response data
    const responseData = {
      isNewUser: isNewUser,
      profileCompleted: user.profileCompleted || false,
      user: {
        uuid: user.id,
        publicId: user.public_id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url
      }
    }
    
    // Encode response data in URL
    const encodedResponse = encodeURIComponent(JSON.stringify(responseData))
    
    // Redirect to frontend with token and response data
    const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3003'
    
    // ✅ SIMPLE APPROACH: Just pass token in URL
    const tokenParam = encodeURIComponent(token);
    
    // ✅ REDIRECT TO OAUTH-SUCCESS PAGE WITH TOKEN
    console.log(`✅ [AUTH/GOOGLE/CALLBACK] Redirecting to /oauth-success with token`)
    
    // Set token as secure httpOnly cookie and redirect
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    // Redirect to oauth-success page with token in URL
    // Use FRONTEND_URL environment variable instead of hardcoded URL
    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3003'
    res.redirect(`${frontendUrl}/oauth-success?token=${tokenParam}`)
  } catch (error) {
    console.error('\n❌ [AUTH/GOOGLE/CALLBACK] CRITICAL ERROR in callback:', error.message)
    console.error('   Stack:', error.stack)
    console.error('   This user signup will FAIL\n')
    const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
    res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=${encodeURIComponent(error.message)}`)
  }
})

// Step 3: Verify token and get user data from database
app.get('/auth-success', async (req, res) => {
  try {
    const token = req.query.token
    
    if (!token) {
      console.error('❌ [AUTH-SUCCESS] No token provided')
      return res.status(400).json({
        success: false,
        error: 'No token provided'
      })
    }
    
    // Verify Prisma is available
    ensurePrismaAvailable()
    
    // Decode JWT token
    console.log(`🔐 [AUTH-SUCCESS] Verifying JWT token: ${token.substring(0, 10)}...`)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`✅ [AUTH-SUCCESS] JWT verified for user: ${decoded.email}`)
      console.log(`   - User ID: ${decoded.id}`)
    } catch (jwtError) {
      console.error('❌ [AUTH-SUCCESS] JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }
    
    // Fetch full user data from database using userId string
    console.log(`🔍 [AUTH-SUCCESS] Fetching user from database...`)
    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    })
    
    if (!user) {
      console.error(`❌ [AUTH-SUCCESS] CRITICAL: User ${decoded.id} not found in database!`)
      console.error(`   Email was: ${decoded.email}`)
      console.error(`   This user was NOT saved during OAuth callback`)
      return res.status(404).json({
        success: false,
        error: 'User not found in database - signup may have failed'
      })
    }
    
    console.log(`✅ [AUTH-SUCCESS] User found in database: ${user.email}`)
    
    // Return user data with profileCompleted and termsAccepted flags
    console.log('[AUTH-SUCCESS] About to return user with:', {
      id_type: typeof user.id,
      id_length: user.id?.length,
      id_value: user.id?.substring(0, 8) + '...'
    })
    res.json({
      success: true,
      token: token,
      user: {
        uuid: user.id,              // ✅ 36-char UUID (for messages & unread count)
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        location: user.location || null,
        profileCompleted: user.profileCompleted,
        termsAccepted: user.termsAccepted
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
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT decoded:', decoded.email)
    
    res.json({
      success: true,
      token: token,
      user: {
        uuid: decoded.id,
        email: decoded.email
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

// ===== FACEBOOK OAUTH ROUTES =====

// Step 1: Initiate Facebook OAuth
app.get('/auth/facebook', (req, res) => {
  try {
    const callbackUrl = process.env.FACEBOOK_CALLBACK_URL
    if (!callbackUrl) {
      throw new Error('FACEBOOK_CALLBACK_URL environment variable is not set')
    }
    console.log(`🔗 Facebook OAuth initiated with callback_url: ${callbackUrl}`)
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      redirect_uri: callbackUrl,
      scope: 'public_profile,email',
      response_type: 'code'
    })
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
    console.log(`🔗 Redirecting to Facebook consent screen`)
    res.redirect(authUrl)
  } catch (error) {
    console.error('❌ Error in /auth/facebook:', error)
    res.status(500).json({ error: 'Failed to initiate Facebook login' })
  }
})

// Step 2: Handle Facebook OAuth callback
app.get('/auth/facebook/callback', async (req, res) => {
  try {
    const { code, error } = req.query
    
    console.log(`\n🔐 [AUTH/FACEBOOK/CALLBACK] Starting Facebook OAuth callback...`)
    
    if (error) {
      console.error(`❌ [AUTH/FACEBOOK/CALLBACK] Facebook OAuth error: ${error}`)
      const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
      return res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=${error}`)
    }
    
    if (!code) {
      console.error('❌ [AUTH/FACEBOOK/CALLBACK] No authorization code received')
      const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
      return res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=no_code`)
    }
    
    console.log(`📝 [AUTH/FACEBOOK/CALLBACK] Received Facebook authorization code: ${code.substring(0, 10)}...`)
    
    // Verify Prisma is available
    ensurePrismaAvailable()
    
    // Exchange code for tokens
    console.log(`🔐 [AUTH/FACEBOOK/CALLBACK] Exchanging code for tokens...`)
    const tokens = await getFacebookTokens(code)
    console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Got access token from Facebook`)
    
    // Get user info
    console.log(`🔐 [AUTH/FACEBOOK/CALLBACK] Retrieving user info...`)
    const userInfo = await getFacebookUserInfo(tokens.access_token)
    console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Retrieved user info:`, userInfo.email)
    
    // Check if user already exists
    console.log(`🔍 [AUTH/FACEBOOK/CALLBACK] Checking if user exists in database...`)
    let existingUser = await prisma.users.findUnique({
      where: { email: userInfo.email }
    })
    console.log(`${existingUser ? '✅' : '📝'} [AUTH/FACEBOOK/CALLBACK] User exists: ${!!existingUser}`)
    
    let isNewUser = false
    let user
    
    if (!existingUser) {
      // NEW USER - Generate unique public ID
      console.log(`📝 [AUTH/FACEBOOK/CALLBACK] New user detected, creating account...`)
      const publicId = await generateUniquePublicId()
      console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Generated public_id:`, publicId)
      
      console.log(`💾 [AUTH/FACEBOOK/CALLBACK] Calling prisma.users.create()...`)
      user = await prisma.users.create({
        data: {
          email: userInfo.email,
          display_name: userInfo.name || 'User',
          photo_url: userInfo.picture || null,
          auth_provider: 'facebook',
          provider_id: userInfo.id,
          public_id: publicId,
          profileCompleted: false,
          termsAccepted: false
        }
      })
      
      console.log(`✅ [AUTH/FACEBOOK/CALLBACK] User created in database:`, user.email)
      console.log(`✅ [AUTH/FACEBOOK/CALLBACK] User ID: ${user.id}`)
      console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Email: ${user.email}`)
      console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Public ID: ${user.public_id}`)
      
      // CRITICAL: Verify user was actually saved before proceeding
      console.log(`🔍 [AUTH/FACEBOOK/CALLBACK] Verifying user was saved to database...`)
      const verifyUser = await prisma.users.findUnique({
        where: { id: user.id }
      })
      if (!verifyUser) {
        throw new Error('CRITICAL: User creation failed - user not found after create()')
      }
      console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Database verification successful`)
      
      isNewUser = true
    } else {
      // EXISTING USER
      console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Existing user found:`, existingUser.email)
      
      // Ensure existing user has a public_id (migrate if needed)
      if (!existingUser.public_id) {
        console.log(`⚠️ [AUTH/FACEBOOK/CALLBACK] Existing user missing public_id, generating one...`)
        const publicId = await generateUniquePublicId()
        user = await prisma.users.update({
          where: { id: existingUser.id },
          data: { public_id: publicId }
        })
        console.log(`✅ Generated and saved public_id for existing user:`, publicId)
      } else {
        user = existingUser
      }
      isNewUser = false
    }
    
    // Create a proper JWT token (NOT base64)
    const token = jwt.sign({
      id: user.id,
      userId: user.id,
      email: user.email,
      publicId: user.public_id
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log("✅ [AUTH/FACEBOOK/CALLBACK] JWT token created with id:", user.id);
    
    // Build response data
    const responseData = {
      isNewUser: isNewUser,
      profileCompleted: user.profileCompleted || false,
      user: {
        uuid: user.id,
        publicId: user.public_id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url
      }
    }
    
    // Encode response data in URL
    const encodedResponse = encodeURIComponent(JSON.stringify(responseData))
    
    // Redirect to frontend with token
    const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3003'
    
    // ✅ SIMPLE APPROACH: Just pass token in URL
    const tokenParam = encodeURIComponent(token);
    
    // Redirect to /oauth-success with token in URL
    const redirectUrl = `${baseUrl}/oauth-success?token=${tokenParam}`;
    
    console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Redirecting to /oauth-success with token`)
    res.redirect(redirectUrl)
  } catch (error) {
    console.error('\n❌ [AUTH/FACEBOOK/CALLBACK] CRITICAL ERROR in callback:', error.message)
    console.error('   Stack:', error.stack)
    console.error('   This user signup will FAIL\n')
    const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL
    res.redirect(`${frontendUrl || 'http://localhost:3003'}?error=${encodeURIComponent(error.message)}`)
  }
})

// Step 4: Get user profile using token (for frontend)
app.get('/api/profile', async (req, res) => {
  try {
    console.log('[PROFILE API] Request received')
    const authHeader = req.headers.authorization
    console.log('[PROFILE API] Auth header:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[PROFILE API] ❌ Missing or invalid Bearer token')
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header'
      })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    console.log('[PROFILE API] Token received, verifying as JWT...')
    
    // Verify JWT token (not base64)
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('[PROFILE API] ✅ JWT token verified for user:', decoded.email, 'userId:', decoded.userId || decoded.id)
    } catch (jwtErr) {
      console.log('[PROFILE API] JWT verification failed, trying base64 decode as fallback...')
      try {
        decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
        console.log('[PROFILE API] ✅ Token decoded (base64) for user:', decoded.email, 'userId:', decoded.userId)
      } catch (b64Err) {
        console.error('[PROFILE API] ❌ Both JWT and base64 decode failed')
        return res.status(401).json({
          success: false,
          error: 'Invalid token format'
        })
      }
    }
    
    // Fetch full user data from database
    const userId = decoded.userId || decoded.id
    console.log('[PROFILE API] Fetching user from database with id:', userId)
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        public_id: true,
        email: true,
        display_name: true,
        photo_url: true,
        gender: true,
        birthday: true,
        location: true,
        profileCompleted: true,
        auth_provider: true,
        has_blue_tick: true,
        blue_tick_expires_at: true,
        created_at: true,
        updated_at: true
      }
    })
    console.log('[PROFILE API] User fetch result:', user ? 'Found' : 'Not found')
    
    if (!user) {
      console.log('[PROFILE API] ❌ User not found in database:', userId)
      return res.status(404).json({
        success: false,
        error: 'User not found in database'
      })
    }
    
    console.log('[PROFILE API] ✅ User found, returning profile')
    // ✅ CRITICAL: Return ONLY uuid (the 36-char ID), never numeric id
    // user.id is the UUID from database, NOT numeric
    console.log('[PROFILE API] About to return user with:', {
      id_type: typeof user.id,
      id_length: user.id?.length,
      id_value: user.id?.substring(0, 8) + '...',
      public_id: user.public_id
    })
    res.json({
      success: true,
      user: {
        uuid: user.id,                    // ✅ 36-char UUID from users.id
        publicId: user.public_id,         // ✅ 8-digit public ID for display
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        gender: user.gender,
        birthday: user.birthday,
        location: user.location || null,
        profileCompleted: user.profileCompleted,
        authProvider: user.auth_provider,
        hasBlueTick: !!(user.has_blue_tick && user.blue_tick_expires_at && new Date(user.blue_tick_expires_at) > new Date())
      }
    })
  } catch (error) {
    console.error('[PROFILE API] ❌ Error in /api/profile:', error.message)
    console.error('[PROFILE API] Stack:', error.stack)
    res.status(400).json({
      success: false,
      error: 'Invalid token',
      details: error.message
    })
  }
})

// ✅ UPDATE USER LOCATION (called from dashboard on mount)
app.post('/api/users/update-location', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Missing authorization' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      try {
        decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      } catch (b64Err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }
    }

    const userId = decoded.userId || decoded.id;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ success: false, error: 'Missing location' });
    }

    console.log(`📍 [LOCATION API] Updating location for user ${userId}: ${location}`);

    await prisma.users.update({
      where: { id: userId },
      data: { location: location }
    });

    console.log(`📍 [LOCATION API] ✅ Location saved successfully`);
    res.json({ success: true, location: location });
  } catch (error) {
    console.error('📍 [LOCATION API] ❌ Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
})

// ✅ GET CHAT HISTORY between two users
app.get('/api/messages', async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ error: 'Missing user IDs' });
  }

  try {
    const result = await pool.query(
      `
      SELECT sender_id, receiver_id, message, created_at
      FROM messages
      WHERE
        (sender_id = $1 AND receiver_id = $2)
        OR
        (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
      `,
      [user1, user2]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching messages:', error.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// WebSocket Events
io.on('connection', (socket) => {
  console.log(`\n✅ [CONNECTION] New socket connection: ${socket.id}`)
  console.log(`📊 [CONNECTION] Total active connections: ${io.engine.clientsCount}`)
  console.log(`📊 [CONNECTION] Current queue length: ${redis ? 'pending redis check' : 0}`)
  
  // Log queue state on each new connection
  redis.lLen('matching_queue').then(queueLen => {
    console.log(`📊 [CONNECTION] Matching queue size: ${queueLen} users waiting`)
  }).catch(err => console.error('Error checking queue on connect:', err))

  // ✅ REGISTER USER (when user comes online)
  socket.on('register_user', async (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id)
      // ✅ JOIN SOCKET TO ROOM WITH USER UUID (CRITICAL for io.to(uuid).emit())
      socket.join(userId)
      console.log(`\n✅ [REGISTER_USER] User registered successfully`)
      console.log(`   User UUID: ${userId.substring(0, 8)}...`)
      console.log(`   Socket ID: ${socket.id.substring(0, 8)}...`)
      console.log(`   Joined room: ${userId.substring(0, 8)}...`)
      console.log(`   Socket rooms: ${JSON.stringify(Array.from(socket.rooms)?.map(r => r.substring(0, 8) + '...'))}`)
      console.log(`👥 [ONLINE USERS] Total connected: ${onlineUsers.size}`)
      console.log(`   UUIDs: ${Array.from(onlineUsers.keys()).map(k => k.substring(0, 8) + '...').join(', ')}`)
      console.log()

      // ✅ Broadcast online status to all friends of this user
      try {
        const friendsResult = await pool.query(
          `SELECT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS friend_id
           FROM friend_requests WHERE (sender_id = $1 OR receiver_id = $1) AND status = 'accepted'`,
          [userId]
        )
        friendsResult.rows.forEach(row => {
          io.to(row.friend_id).emit('friend_status_change', {
            friendId: userId,
            isOnline: true,
            lastSeen: null
          })
        })
      } catch (err) {
        console.error('❌ Error broadcasting online status:', err.message)
      }
    }
  })

  // ✅ HANDLE DISCONNECT
  socket.on('disconnect', async () => {
    // Find and remove the user from onlineUsers map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        console.log(`👤 [DISCONNECT] User ${userId} disconnected`)
        console.log(`👥 [ONLINE USERS] ${onlineUsers.size} users currently online`)

        // ✅ Update last_seen in database and broadcast offline status to friends
        const now = new Date()
        try {
          await pool.query('UPDATE users SET last_seen = $1 WHERE id = $2', [now, userId])
          const friendsResult = await pool.query(
            `SELECT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS friend_id
             FROM friend_requests WHERE (sender_id = $1 OR receiver_id = $1) AND status = 'accepted'`,
            [userId]
          )
          friendsResult.rows.forEach(row => {
            io.to(row.friend_id).emit('friend_status_change', {
              friendId: userId,
              isOnline: false,
              lastSeen: now.toISOString()
            })
          })
          console.log(`✅ [DISCONNECT] last_seen updated & friends notified for ${userId}`)
        } catch (err) {
          console.error('❌ Error updating last_seen on disconnect:', err.message)
        }
        break
      }
    }
  })

  // ✅ CHECK FRIEND STATUS (online/offline + last seen)
  socket.on('check_friend_status', async (friendId, callback) => {
    try {
      const isOnline = onlineUsers.has(friendId)
      let lastSeen = null
      if (!isOnline) {
        const result = await pool.query('SELECT last_seen FROM users WHERE id = $1', [friendId])
        if (result.rows.length > 0 && result.rows[0].last_seen) {
          lastSeen = result.rows[0].last_seen
        }
      }
      if (typeof callback === 'function') {
        callback({ isOnline, lastSeen })
      }
    } catch (err) {
      console.error('❌ Error checking friend status:', err.message)
      if (typeof callback === 'function') {
        callback({ isOnline: false, lastSeen: null })
      }
    }
  })

  // ✅ QUICK INVITE FLOW (Profile icon - direct popup, NOT panel request)
  socket.on('friend:quick-invite', (data) => {
    console.log('\n' + '='.repeat(80))
    console.log('🚀🚀🚀 [QUICK INVITE - BACKEND] Socket event received 🚀🚀🚀')
    console.log('='.repeat(80))
    console.log('📦 [QUICK INVITE - BACKEND] Payload received:', {
      senderPublicId: data?.senderPublicId?.substring(0, 8) + '...',
      senderName: data?.senderName,
      receiverPublicId: data?.receiverPublicId?.substring(0, 8) + '...',
      timestamp: data?.timestamp
    })
    console.log('⚠️  [QUICK INVITE - BACKEND] IMPORTANT: NO DATABASE INSERT WILL HAPPEN!')
    console.log('⚠️  [QUICK INVITE - BACKEND] This is socket-only popup flow')

    // ✅ VALIDATION
    if (!data?.senderPublicId || !data?.receiverPublicId) {
      console.error('❌ [QUICK INVITE - BACKEND] Missing required IDs')
      return
    }

    // ✅ GET RECEIVER'S SOCKET ROOM
    const receiverSocketId = onlineUsers.get(data.receiverPublicId)
    
    if (!receiverSocketId) {
      console.warn('⚠️ [QUICK INVITE - BACKEND] Receiver not online:', data.receiverPublicId)
      console.log('📊 [QUICK INVITE - BACKEND] Available online users:', Array.from(onlineUsers.keys()).map(k => k.substring(0, 8) + '...').join(', '))
      return
    }

    console.log('✅ [QUICK INVITE - BACKEND] Receiver is online - sending popup...')
    console.log('📍 [QUICK INVITE - BACKEND] Emitting to user room:', data.receiverPublicId.substring(0, 8) + '...')

    // ✅ EMIT POPUP EVENT TO RECEIVER (via their user room)
    // Use io.to(userId) to target the specific user room
    console.log('📡 [QUICK INVITE - BACKEND] Emitting "friend:quick-invite-received" event...')
    io.to(data.receiverPublicId).emit('friend:quick-invite-received', {
      senderId: data.senderPublicId,
      senderPublicId: data.senderPublicId,
      senderName: data.senderName,
      senderProfileImage: data.senderProfileImage,
      timestamp: data.timestamp,
      // No requestId, no database entry - just a popup
      isQuickInvite: true
    })

    console.log('✅ [QUICK INVITE - BACKEND] Popup event emitted to receiver')
    console.log('🎯 [QUICK INVITE - BACKEND] RESULT: Direct popup only, NO panel entry created')
    console.log('='.repeat(80) + '\n')
  })

  // ✅ JOIN CHAT ROOM (shared room for sender + receiver)
  socket.on('join_chat', ({ senderId, receiverId }) => {
    // Create deterministic room ID (same for both users)
    const roomId = senderId < receiverId 
      ? `${senderId}_${receiverId}` 
      : `${receiverId}_${senderId}`
    
    socket.join(roomId)
    console.log(`✅ User ${senderId} joined chat room: ${roomId}`)
  })

  // ✅ HANDLE INCOMING CALL (caller initiates call)
  socket.on('init_call', (data) => {
    const { callerId, callerName, callerProfileImage, receiverId, recipientName } = data
    
    console.log('\n' + '='.repeat(80))
    console.log('📞 [INIT_CALL] ====== INCOMING CALL INITIATED ======')
    console.log('='.repeat(80))
    console.log('📞 Caller ID:', callerId?.substring(0, 8) + '...')
    console.log('📞 Caller Name:', callerName)
    console.log('📞 Receiver ID:', receiverId?.substring(0, 8) + '...')
    console.log('📞 Recipient Name:', recipientName)
    console.log('='.repeat(80))

    // ✅ CRITICAL: Check if receiver exists in onlineUsers
    console.log('\n📍 Looking up receiver in onlineUsers map...')
    console.log('   Total online users:', onlineUsers.size)
    console.log('   Available UUIDs:', Array.from(onlineUsers.keys()).map(k => k.substring(0, 8) + '...').join(', '))
    
    const receiverSocket = onlineUsers.get(receiverId)
    console.log(`   Receiver ${receiverId?.substring(0, 8)}... found:`, receiverSocket ? `✅ YES (socket: ${receiverSocket?.substring(0, 8)}...)` : `❌ NO`)
    
    if (!receiverSocket) {
      console.warn(`⚠️  Receiver ${receiverId?.substring(0, 8)}... is NOT online - call will be lost`)
      return
    }
    
    // ✅ Emit to receiver's socket room
    const receiverSocketRoom = receiverId
    console.log(`\n📡 Emitting incoming_call event...`)
    console.log(`   Target room: ${receiverSocketRoom?.substring(0, 8)}...`)
    
    io.to(receiverSocketRoom).emit('incoming_call', {
      callerId,
      callerName,
      callerProfileImage,
      receiverId,
      recipientName
    })

    console.log('✅ Incoming call event emitted to recipient')
    console.log('='.repeat(80) + '\n')
  })

  // ✅ CALL ACCEPTED - Relay acceptance back to caller
  socket.on('call_accepted', (data) => {
    const { callerId, receiverId, callerName } = data

    console.log('\n' + '='.repeat(80))
    console.log('✅ [CALL_ACCEPTED] ====== CALL ACCEPTED BY RECEIVER ======')
    console.log('='.repeat(80))
    console.log('✅ Caller ID:', callerId?.substring(0, 8) + '...')
    console.log('✅ Caller Name:', callerName)
    console.log('✅ Receiver ID:', receiverId?.substring(0, 8) + '...')
    console.log('='.repeat(80))

    // ✅ CRITICAL: Check if caller is still online
    console.log('\n📍 Looking up caller in onlineUsers map...')
    const callerSocket = onlineUsers.get(callerId)
    console.log(`   Caller ${callerId?.substring(0, 8)}... found:`, callerSocket ? `✅ YES` : `❌ NO`)
    
    if (!callerSocket) {
      console.warn(`⚠️  Caller ${callerId?.substring(0, 8)}... is NOT online - call acceptance will be lost`)
      return
    }

    // ✅ Emit to caller's socket room
    const callerSocketRoom = callerId
    console.log(`\n📡 Emitting call_accepted event...`)
    console.log(`   Target room: ${callerSocketRoom?.substring(0, 8)}...`)
    
    io.to(callerSocketRoom).emit('call_accepted', {
      callerId,
      receiverId,
      callerName,
      timestamp: new Date().toISOString()
    })

    console.log('✅ Call acceptance event emitted to caller')
    console.log('='.repeat(80) + '\n')
  })

  // ✅ CALL ENDED - When either user hangs up, notify BOTH users immediately
  socket.on('call_ended', (data) => {
    const { callerId, receiverId } = data
    const senderSocketId = socket.id

    console.log('\n' + '='.repeat(80))
    console.log('❌ [CALL_ENDED] ====== CALL ENDED BY USER ======')
    console.log('='.repeat(80))
    console.log('❌ Event received from socket:', senderSocketId.substring(0, 8) + '...')
    console.log('❌ Caller ID:', callerId?.substring(0, 8) + '...')
    console.log('❌ Receiver ID:', receiverId?.substring(0, 8) + '...')
    console.log('='.repeat(80))

    if (callerId && receiverId) {
      const callEndedData = {
        callerId,
        receiverId,
        timestamp: new Date().toISOString()
      }

      // Get online status
      const callerOnlineSocketId = onlineUsers.get(callerId)
      const receiverOnlineSocketId = onlineUsers.get(receiverId)
      
      console.log(`\n📍 User Online Status:`)
      console.log(`   Caller ${callerId.substring(0, 8)}... → Socket: ${callerOnlineSocketId ? callerOnlineSocketId.substring(0, 8) + '...' : '❌ OFFLINE'}`)
      console.log(`   Receiver ${receiverId.substring(0, 8)}... → Socket: ${receiverOnlineSocketId ? receiverOnlineSocketId.substring(0, 8) + '...' : '❌ OFFLINE'}`)

      // ✅ Check room membership before broadcasting
      console.log(`\n📋 Socket.IO Room Status:`)
      const callerRoom = io.sockets.adapter.rooms.get(callerId)
      const receiverRoom = io.sockets.adapter.rooms.get(receiverId)
      console.log(`   Room "${callerId.substring(0, 8)}..." has ${callerRoom?.size || 0} socket(s)`)
      console.log(`   Room "${receiverId.substring(0, 8)}..." has ${receiverRoom?.size || 0} socket(s)`)

      // ✅ BROADCAST using both room-based and socket-based methods for maximum reliability
      console.log(`\n📡 BROADCASTING call_ended event:`)
      
      // Method 1: Broadcast via UUID-based rooms (this will reach sockets in those rooms)
      console.log(`   📤 Method 1: Broadcasting to room "${callerId.substring(0, 8)}..."`)
      io.to(callerId).emit('call_ended', callEndedData)
      
      console.log(`   📤 Method 2: Broadcasting to room "${receiverId.substring(0, 8)}..."`)
      io.to(receiverId).emit('call_ended', callEndedData)
      
      // Method 2: Direct socket emit for sender as backup (in case they're not in their own room yet)
      console.log(`   📤 Method 3: Direct emit to sender socket`)
      socket.emit('call_ended', callEndedData)
      
      // Method 3: Explicit socket targeting if we have socket IDs
      if (receiverOnlineSocketId && receiverOnlineSocketId !== senderSocketId) {
        console.log(`   📤 Method 4: Direct emit to receiver's socket`)
        io.to(receiverOnlineSocketId).emit('call_ended', callEndedData)
      }
      if (callerOnlineSocketId && callerOnlineSocketId !== senderSocketId) {
        console.log(`   📤 Method 5: Direct emit to caller's socket`)
        io.to(callerOnlineSocketId).emit('call_ended', callEndedData)
      }
      
      console.log('\n✅ call_ended BROADCAST COMPLETE - using 5 delivery methods\n')
    }
    
    console.log('='.repeat(80) + '\n')
  })

  // ✅ DIRECT CALL - WebRTC OFFER (Caller sends offer to Receiver)
  socket.on('direct_call:offer', (data) => {
    const { offer, from, to } = data
    
    console.log('\n' + '='.repeat(80))
    console.log('📋 [DIRECT CALL:OFFER] WebRTC Offer from caller')
    console.log('='.repeat(80))
    console.log('📋 From (Caller):', from?.substring(0, 8) + '...')
    console.log('📋 To (Receiver):', to?.substring(0, 8) + '...')
    console.log('📋 Offer SDP length:', offer?.sdp?.length || 0, 'chars')
    
    if (from && to && offer) {
      const receiverSocketId = onlineUsers.get(to)
      
      if (receiverSocketId) {
        console.log('📤 Receiver online - relaying offer via socket:', receiverSocketId.substring(0, 8) + '...')
        io.to(receiverSocketId).emit('direct_call:offer', {
          offer,
          from
        })
        console.log('✅ Offer relayed to receiver')
      } else {
        console.warn('⚠️ Receiver not online - offer NOT delivered')
      }
    }
    
    console.log('='.repeat(80) + '\n')
  })

  // ✅ DIRECT CALL - WebRTC ANSWER (Receiver sends answer to Caller)
  socket.on('direct_call:answer', (data) => {
    const { answer, from, to } = data
    
    console.log('\n' + '='.repeat(80))
    console.log('📋 [DIRECT CALL:ANSWER] WebRTC Answer from receiver')
    console.log('='.repeat(80))
    console.log('📋 From (Receiver):', from?.substring(0, 8) + '...')
    console.log('📋 To (Caller):', to?.substring(0, 8) + '...')
    console.log('📋 Answer SDP length:', answer?.sdp?.length || 0, 'chars')
    
    if (from && to && answer) {
      const callerSocketId = onlineUsers.get(to)
      
      if (callerSocketId) {
        console.log('📤 Caller online - relaying answer via socket:', callerSocketId.substring(0, 8) + '...')
        io.to(callerSocketId).emit('direct_call:answer', {
          answer,
          from
        })
        console.log('✅ Answer relayed to caller')
      } else {
        console.warn('⚠️ Caller not online - answer NOT delivered')
      }
    }
    
    console.log('='.repeat(80) + '\n')
  })

  // ✅ DIRECT CALL - WebRTC ICE CANDIDATE (Both sides exchange ICE candidates)
  socket.on('direct_call:ice_candidate', (data) => {
    const { candidate, from, to } = data
    
    console.log('🧊 [DIRECT CALL:ICE] Relaying ICE candidate from:', from?.substring(0, 8) + '... to:', to?.substring(0, 8) + '...')
    
    if (from && to && candidate) {
      const peerSocketId = onlineUsers.get(to)
      
      if (peerSocketId) {
        io.to(peerSocketId).emit('direct_call:ice_candidate', {
          candidate,
          from
        })
      } else {
        console.warn('⚠️ Peer not online - ICE candidate NOT delivered')
      }
    }
  })

  // ✅ SEND MESSAGE (friend DM to shared room)
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message, to } = data

    // Case 1: WebRTC Partner Chat (1-to-1 via socket, no DB save)
    if (to) {
      console.log(`💬 Partner message: ${socket.id} → ${to}`)
      io.to(to).emit('receive_message', {
        message
      })
      return
    }

    // Case 2: Friend DM (save to DB + deliver via shared room)
    if (!senderId || !receiverId || !message) {
      console.warn('❌ Missing message data:', { senderId, receiverId, message })
      return
    }

    try {
      // Create deterministic room ID (same for both users)
      const roomId = senderId < receiverId 
        ? `${senderId}_${receiverId}` 
        : `${receiverId}_${senderId}`

      // 1. Save message to database
      await pool.query(
        `
        INSERT INTO messages (sender_id, receiver_id, message, is_read)
        VALUES ($1, $2, $3, false)
        `,
        [senderId, receiverId, message]
      )

      console.log(`💬 Message sent with is_read = false: ${senderId} → ${receiverId}`)

      // 2. Send message to BOTH users in shared room
      io.to(roomId).emit('receive_message', {
        senderId,
        message
      })

      console.log(`📨 Message delivered to shared room: ${roomId}`)
    } catch (err) {
      console.error('❌ Message send error:', err)
      socket.emit('message_error', { error: 'Failed to send message' })
    }
  })

  // Handle finding partner
  socket.on('find_partner', async (userData) => {
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('🔍 [find_partner] EVENT FIRED - STARTING MATCH LOGIC');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`🔌 [find_partner] Current socket.id: ${socket.id}`)
    console.log(`🔌 [find_partner] Socket connected: ${socket.connected}`)
    console.log(`📊 [find_partner] Total active sockets: ${io.engine.clientsCount}`)
    
    // CRITICAL: Get userId from frontend data (NOT generate new UUID)
    const userId = userData?.userId
    
    if (!userId) {
      console.error('❌ [find_partner] No userId provided by frontend')
      socket.emit('error', 'UserId is required')
      return
    }

    // Store the mapping: socket.id -> userId (from frontend)
    userSockets.set(socket.id, userId)
    console.log(`✅ [find_partner] Stored mapping - socket ${socket.id.substring(0, 8)}... → user ${userId}`)
    
    // ✅ CRITICAL: Always use DB location (most up-to-date from IP detection)
    try {
      const dbUser = await prisma.users.findUnique({ where: { id: userId }, select: { location: true } });
      if (dbUser?.location) {
        console.log(`📍 [find_partner] DB location: ${dbUser.location} (frontend sent: ${userData.userLocation})`);
        userData.userLocation = dbUser.location;
      }
      
      // ✅ SERVER-SIDE FALLBACK: If DB location has country name or is missing, detect from IP
      const needsServerDetection = !userData.userLocation || 
        userData.userLocation === 'Unknown' || 
        /\b(India|Pakistan|Bangladesh|Nepal|Sri Lanka|United States|United Kingdom|Canada|Australia)\b/i.test(userData.userLocation);
      
      if (needsServerDetection) {
        console.log(`📍 [find_partner] Location needs server-side detection (current: ${userData.userLocation})`);
        try {
          const clientIP = socket.handshake.headers['x-forwarded-for']?.split(',')[0]?.trim() || socket.handshake.address;
          const ipUrl = clientIP && clientIP !== '::1' && clientIP !== '127.0.0.1' 
            ? `http://ip-api.com/json/${clientIP}?fields=status,city,regionName`
            : `http://ip-api.com/json/?fields=status,city,regionName`;
          
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          const ipRes = await fetch(ipUrl, { signal: controller.signal });
          clearTimeout(timeout);
          const ipData = await ipRes.json();
          console.log(`📍 [find_partner] Server IP detection result:`, JSON.stringify(ipData));
          
          if (ipData.status === 'success' && ipData.city && ipData.regionName) {
            const newLocation = `${ipData.city}, ${ipData.regionName}`;
            userData.userLocation = newLocation;
            // Also update DB with fresh location
            await prisma.users.update({ where: { id: userId }, data: { location: newLocation } });
            console.log(`📍 [find_partner] ✅ Server-side location detected & saved: ${newLocation}`);
          }
        } catch (ipErr) {
          console.log(`📍 [find_partner] Server IP detection failed:`, ipErr.message);
        }
      }
    } catch (e) {
      console.warn(`📍 [find_partner] Could not fetch DB location:`, e.message);
    }
    console.log(`📍 [find_partner] Final userLocation: ${userData?.userLocation || 'Unknown'}`)
    
    // Log queue state BEFORE processing
    const queueLenBefore = await getQueueLength()
    const queueEntriesBefore = await redis.lRange('matching_queue', 0, -1)
    console.log(`\n📊 [find_partner] QUEUE STATE BEFORE`)
    console.log(`   Total users waiting: ${queueLenBefore}`)
    for (let i = 0; i < queueEntriesBefore.length; i++) {
      const parsed = JSON.parse(queueEntriesBefore[i])
      console.log(`   [${i}] User ${parsed.userId} - Socket ${parsed.socketId.substring(0, 8)}...`)
    }
    
    console.log(`\n👤 [find_partner] User ${userId} looking for partner`)
    console.log(`   userName: ${userData?.userName || 'Anonymous'}`)

    // Set user as online in Redis
    await setUserOnline(userId, socket.id)

    // Check if there's someone in the queue, skip if it's the same user
    let waitingUser = await getNextFromQueue()
    
    // CRITICAL: Loop until we find a DIFFERENT user
    let skippedCount = 0
    while (waitingUser && waitingUser.userId === userId) {
      skippedCount++
      console.log(`⚠️ [find_partner] SKIPPING SELF-MATCH #${skippedCount}`)
      console.log(`   Waiting user: ${waitingUser.userId}`)
      console.log(`   Current user: ${userId}`)
      waitingUser = await getNextFromQueue() // Try next user
    }
    
    if (skippedCount > 0) {
      console.log(`✅ [find_partner] Skipped ${skippedCount} self-match attempts`)
    }
    
    if (waitingUser) {
      console.log(`\n🎯 [find_partner] 🎯 MATCH FOUND! 🎯`)
      console.log(`   Current user: ${userId} (socket ${socket.id.substring(0, 8)}...)`)
      console.log(`   Partner user: ${waitingUser.userId} (socket ${waitingUser.socketId.substring(0, 8)}...)`)
      
      // Verify sockets are valid
      const socket1Exists = io.sockets.sockets.has(socket.id)
      const socket2Exists = io.sockets.sockets.has(waitingUser.socketId)
      console.log(`🔌 [find_partner] Socket validity check:`)
      console.log(`   Current socket exists? ${socket1Exists}`)
      console.log(`   Partner socket exists? ${socket2Exists}`)
      
      if (!socket1Exists || !socket2Exists) {
        console.error(`❌ [find_partner] One or both sockets are INVALID!`)
        // Re-add current user to queue and try again
        console.log(`🔄 [find_partner] Re-adding ${userId} to queue...`)
        await addToMatchingQueue(userId, socket.id, userData)
        socket.emit('waiting', { message: 'Waiting for a partner...' })
        return
      }
      
      // Call the bulletproof matching function
      console.log(`\n✅ [find_partner] All checks PASSED - now calling matchUsers()...`)
      console.log(`   socketId1: ${socket.id}`)
      console.log(`   userId1: ${userId}`)
      console.log(`   socketId2: ${waitingUser.socketId}`)
      console.log(`   userId2: ${waitingUser.userId}`)
      
      await matchUsers(socket.id, userId, waitingUser.socketId, waitingUser.userId, userData, waitingUser)
      
      console.log(`✅ [find_partner] matchUsers() completed successfully`)
      console.log(`🎉 [find_partner] Both users should have received partner_found event`)
    } else {
      // Add to waiting queue
      console.log(`\n⏳ [find_partner] NO MATCH FOUND - ADDING USER TO QUEUE`);
      await addToMatchingQueue(userId, socket.id, userData)
      const queueLen = await getQueueLength()
      console.log(`✅ [find_partner] Added user ${userId} to queue. Queue length: ${queueLen}`)
      
      // Log queue state AFTER adding
      const queueEntriesAfter = await redis.lRange('matching_queue', 0, -1)
      console.log(`📊 [find_partner] QUEUE STATE AFTER`)
      console.log(`   Total users waiting: ${queueLen}`)
      for (let i = 0; i < queueEntriesAfter.length; i++) {
        const parsed = JSON.parse(queueEntriesAfter[i])
        console.log(`   [${i}] User ${parsed.userId} - Socket ${parsed.socketId.substring(0, 8)}...`)
      }
      
      // Emit waiting event
      console.log(`📤 [find_partner] Emitting 'waiting' event to socket ${socket.id.substring(0, 8)}...`)
      socket.emit('waiting', { message: 'Waiting for a partner...' })
      console.log(`✅ [find_partner] 'waiting' event emitted`)
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
      // ✅ CRITICAL: Track the partnership for disconnect handling
      partnerSockets.set(socket.id, partnerSocketId)
      partnerSockets.set(partnerSocketId, socket.id)
      console.log('✅ Partner relationship tracked:', socket.id, '↔', partnerSocketId)
      
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
      // ✅ CRITICAL: Also track partnership when answer is sent (in case offer didn't set it)
      partnerSockets.set(socket.id, partnerSocketId)
      partnerSockets.set(partnerSocketId, socket.id)
      console.log('✅ Partner relationship confirmed via answer:', socket.id, '↔', partnerSocketId)
      
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
    
    // ✅ CRITICAL: Also track partnership via ICE candidates (belt and suspenders approach)
    if (partnerSocketId) {
      partnerSockets.set(socket.id, partnerSocketId)
      partnerSockets.set(partnerSocketId, socket.id)
    }
    
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
  // Handle cancel matching - user clicks "Back" or navigates away while waiting
  socket.on('cancel_matching', async (data) => {
    const userId = userSockets.get(socket.id)
    
    if (!userId) {
      console.log(`[cancel_matching] ⚠️ No userId found for socket ${socket.id}`)
      return
    }
    
    console.log(`\n📋 [cancel_matching] User ${userId} cancelled matching`)
    console.log(`[cancel_matching] Socket ID: ${socket.id}`)
    
    // Remove user from matching queue
    const removedCount = await removeUserFromQueue(userId)
    if (removedCount > 0) {
      console.log(`✅ [cancel_matching] Removed ${removedCount} queue entries for user ${userId}`)
    } else {
      console.log(`ℹ️ [cancel_matching] User ${userId} was not in queue`)
    }
    
    // Mark user as offline
    await setUserOffline(userId)
    console.log(`✅ [cancel_matching] User ${userId} marked as offline`)
    
    // Remove socket mapping
    userSockets.delete(socket.id)
    console.log(`✅ [cancel_matching] Removed socket mapping for ${socket.id}`)
  })

  socket.on('skip_user', async (data) => {
    const userId = userSockets.get(socket.id)
    const partnerSocketId = data?.partnerSocketId
    
    if (userId && partnerSocketId) {
      // ===== SKIP LIMIT CHECK (130/day for normal users, unlimited for plan holders) =====
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const { rows: skipRows } = await pool.query(
          `SELECT daily_skip_count, last_skip_reset_date, has_unlimited_skip, unlimited_skip_expires_at FROM users WHERE id = $1`,
          [userId]
        );
        if (skipRows.length > 0) {
          const u = skipRows[0];
          const hasUnlimitedSkip = !!(u.has_unlimited_skip && u.unlimited_skip_expires_at && new Date(u.unlimited_skip_expires_at) > new Date());
          let currentCount = u.daily_skip_count || 0;
          const lastReset = u.last_skip_reset_date ? new Date(u.last_skip_reset_date).toISOString().split('T')[0] : null;

          // Reset count if new day
          if (lastReset !== today) {
            currentCount = 0;
            await pool.query(
              `UPDATE users SET daily_skip_count = 0, last_skip_reset_date = $1 WHERE id = $2`,
              [today, userId]
            );
          }

          if (!hasUnlimitedSkip && currentCount >= 130) {
            console.log(`[skip_user] ⛔ User ${userId} hit daily skip limit (${currentCount}/130)`);
            socket.emit('skip_limit_reached', { message: 'You have reached your daily skip limit (130). Upgrade to Unlimited Skip for no limits!', dailyCount: currentCount, limit: 130 });
            return;
          }

          // Increment skip count
          await pool.query(
            `UPDATE users SET daily_skip_count = daily_skip_count + 1, last_skip_reset_date = $1 WHERE id = $2`,
            [today, userId]
          );
          console.log(`[skip_user] 📊 User ${userId} skip count: ${currentCount + 1}${hasUnlimitedSkip ? ' (unlimited plan)' : '/130'}`)
        }
      } catch (skipErr) {
        console.error(`[skip_user] ⚠️ Error checking skip limit:`, skipErr.message);
        // Don't block skip on error - allow it
      }
      // ===== END SKIP LIMIT CHECK =====

      console.log(`[skip_user] ${userId} skipping ${partnerSocketId}`)
      
      // ✅ CRITICAL: Save match to database when skipping - FOR BOTH USERS
      if (socket.callStartTime && socket.partner) {
        try {
          const durationSeconds = Math.floor(
            (Date.now() - socket.callStartTime) / 1000
          )
          
          console.log(`\n💾 Saving match history for user ${userId} (skip)`)
          console.log(`   Partner: ${socket.partner.id}`)
          console.log(`   Duration: ${durationSeconds}s`)
          
          // Save match for the skipper
          await pool.query(
            `INSERT INTO matches
             (user_id, matched_user_id, matched_user_name, matched_user_country, duration_seconds)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              userId,
              socket.partner.id,
              socket.partner.name,
              socket.partner.country,
              durationSeconds
            ]
          )
          console.log(`✅ Match saved for skipper ${userId}`)
          
          // ✅ Also save match for the PARTNER (reverse)
          const partnerSocket = io.sockets.sockets.get(socket.partner.socketId)
          const partnerUserId = userSockets.get(socket.partner.socketId)
          if (partnerSocket && partnerUserId && partnerSocket.partner) {
            await pool.query(
              `INSERT INTO matches
               (user_id, matched_user_id, matched_user_name, matched_user_country, duration_seconds)
               VALUES ($1, $2, $3, $4, $5)`,
              [
                partnerUserId,
                partnerSocket.partner.id,
                partnerSocket.partner.name,
                partnerSocket.partner.country,
                durationSeconds
              ]
            )
            console.log(`✅ Match saved for partner ${partnerUserId} (skip)`)
            partnerSocket.callStartTime = null
            partnerSocket.partner = null
          }
          
          // Clear tracking
          socket.callStartTime = null
          socket.partner = null
        } catch (error) {
          console.error(`❌ Error saving match to database:`, error)
        }
      }
      
      // Notify partner
      io.to(partnerSocketId).emit('user_skipped')
      
      // Try to find new partner - LOOP UNTIL DIFFERENT USER
      let waitingUser = await getNextFromQueue()
      while (waitingUser && waitingUser.userId === userId) {
        console.log(`[skip_user] ⚠️ Skipping self-match: ${waitingUser.userId} === ${userId}`)
        waitingUser = await getNextFromQueue()
      }
      
      if (waitingUser) {
        console.log(`[skip_user] ✅ Found different partner: ${waitingUser.userId}`)
        matchUsers(socket.id, userId, waitingUser.socketId, waitingUser.userId, {}, waitingUser)
      } else {
        socket.emit('waiting', { message: 'Waiting for a new partner...' })
      }
    } else {
      console.log(`[skip_user] ⚠️ Invalid skip_user request - userId: ${userId}, partnerSocketId: ${partnerSocketId}`)
    }
  })

  // Handle skip profile event from matching page
  socket.on('skip_profile', (data) => {
    const userId = userSockets.get(socket.id)
    console.log(`[skip_profile] User ${userId} skipped profile at index ${data.currentProfileIndex}`)
    
    // Broadcast to all connected clients that this profile was skipped
    io.emit('profile_skipped', {
      skippedUserId: data.skippedUserId,
      currentProfileIndex: data.currentProfileIndex,
      skippedBy: userId
    })
  })

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`\n\n\n========================================`)
    console.log(`❌ USER DISCONNECTED: ${socket.id}`)
    console.log(`⏰ Time: ${new Date().toISOString()}`)
    
    const userId = userSockets.get(socket.id)
    const partnerSocketId = partnerSockets.get(socket.id)
    
    console.log(`📋 Disconnect Details:`)
    console.log(`   userId: ${userId || 'NOT FOUND'}`)
    console.log(`   partnerSocketId: ${partnerSocketId || 'NOT FOUND'}`)
    console.log(`   partnerSockets size: ${partnerSockets.size}`)
    console.log(`   All tracked partners:`, Array.from(partnerSockets.entries()))
    
    // ✅ CRITICAL: Save match to database if call was active - FOR BOTH USERS
    if (userId && socket.callStartTime && socket.partner) {
      try {
        const durationSeconds = Math.floor(
          (Date.now() - socket.callStartTime) / 1000
        )
        
        console.log(`\n💾 Saving match history for user ${userId} (disconnect)`)
        console.log(`   Partner: ${socket.partner.id}`)
        console.log(`   Duration: ${durationSeconds}s`)
        
        // Save match for the disconnecting user
        await pool.query(
          `INSERT INTO matches
           (user_id, matched_user_id, matched_user_name, matched_user_country, duration_seconds)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            socket.partner.id,
            socket.partner.name,
            socket.partner.country,
            durationSeconds
          ]
        )
        console.log(`✅ Match saved for disconnecting user ${userId}`)
        
        // ✅ Also save match for the PARTNER (reverse)
        const partnerSocket = io.sockets.sockets.get(socket.partner.socketId)
        const partnerUserId = userSockets.get(socket.partner.socketId)
        if (partnerSocket && partnerUserId && partnerSocket.partner) {
          await pool.query(
            `INSERT INTO matches
             (user_id, matched_user_id, matched_user_name, matched_user_country, duration_seconds)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              partnerUserId,
              partnerSocket.partner.id,
              partnerSocket.partner.name,
              partnerSocket.partner.country,
              durationSeconds
            ]
          )
          console.log(`✅ Match saved for partner ${partnerUserId} (disconnect)`)
          partnerSocket.callStartTime = null
          partnerSocket.partner = null
        }
      } catch (error) {
        console.error(`❌ Error saving match to database:`, error)
      }
    }
    
    if (userId) {
      // Mark user as offline in Redis
      await setUserOffline(userId)
      
      // CRITICAL: Remove user from matching queue on disconnect
      // This prevents them from matching with their old queue entry when they reconnect
      const removedCount = await removeUserFromQueue(userId)
      if (removedCount > 0) {
        console.log(`🧹 CRITICAL: Removed ${removedCount} queue entries for user ${userId} from matching queue`)
      }
      
      // Remove from socket mapping
      userSockets.delete(socket.id)
      console.log(`✅ Removed userId mapping for socket: ${socket.id}`)
    }
    
    // ✅ CRITICAL: Notify partner about disconnection
    if (partnerSocketId) {
      console.log(`\n🔔 🔔 🔔 NOTIFYING PARTNER ABOUT DISCONNECT 🔔 🔔 🔔`)
      console.log(`🔔 Sending partner_disconnected to: ${partnerSocketId}`)
      console.log(`🔔 From disconnected socket: ${socket.id}`)
      console.log(`🔔 Reason: Partner closed browser/tab`)
      
      // Send disconnect event to partner
      io.to(partnerSocketId).emit('partner_disconnected', {
        reason: 'Partner closed browser/tab',
        disconnectedSocketId: socket.id,
        timestamp: new Date().toISOString()
      })
      
      console.log(`✅ partner_disconnected emitted to socket: ${partnerSocketId}`)
      
      // Clean up partner's mapping
      partnerSockets.delete(partnerSocketId)
      console.log(`✅ Cleaned up partner socket mapping for: ${partnerSocketId}`)
    } else {
      console.warn(`⚠️ No partner found in mapping for socket: ${socket.id}`)
      console.warn(`⚠️ This peer may have never established WebRTC connection`)
      console.warn(`⚠️ partnerSockets has ${partnerSockets.size} entries`)
    }
    
    // Clean up this socket's partner mapping
    partnerSockets.delete(socket.id)
    console.log(`✅ Disconnection cleanup complete for socket: ${socket.id}`)
    console.log(`========================================\n`)
  })
})

// Matching Function - BULLETPROOF VERSION
async function matchUsers(socketId1, userId1, socketId2, userId2, userData1, userData2) {
  console.log('\n\n╔════════════════════════════════════════════════════════════╗')
  console.log('║          🎯 MATCHUSERS - BULLETPROOF MATCHING 🎯           ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  
  // CRITICAL: Prevent self-matching with multiple checks
  
  // Check 1: userId must be different
  if (userId1 === userId2) {
    console.error('❌ CRITICAL: ATTEMPTED SELF-MATCH DETECTED (userId comparison)!')
    console.error('   userId1:', userId1)
    console.error('   userId2:', userId2)
    console.error('   Aborting match...')
    return
  }
  
  // Check 2: socketId must be different
  if (socketId1 === socketId2) {
    console.error('❌ CRITICAL: ATTEMPTED SELF-MATCH DETECTED (socketId comparison)!')
    console.error('   socketId1:', socketId1)
    console.error('   socketId2:', socketId2)
    console.error('   These are the SAME socket!')
    console.error('   Aborting match...')
    return
  }

  // CHECK 3: VERIFY BOTH SOCKET IDS EXIST IN SOCKET.IO
  console.log('\n✓ STEP 1: Validating socket connections exist')
  const socket1Exists = io.sockets.sockets.has(socketId1)
  const socket2Exists = io.sockets.sockets.has(socketId2)
  
  console.log(`   Socket1 (${socketId1}) exists?`, socket1Exists)
  console.log(`   Socket2 (${socketId2}) exists?`, socket2Exists)
  
  if (!socket1Exists || !socket2Exists) {
    console.error('❌ CRITICAL: One or both sockets do NOT exist!')
    console.error(`   Socket1: ${socketId1} = ${socket1Exists}`)
    console.error(`   Socket2: ${socketId2} = ${socket2Exists}`)
    console.error('   Cannot match users - aborting')
    return
  }
  
  console.log(`✅ SELF-MATCH CHECKS PASSED:`)
  console.log(`   userId1: ${userId1} !== userId2: ${userId2}`)
  console.log(`   socketId1: ${socketId1} !== socketId2: ${socketId2}`)
  console.log(`   Both sockets exist in socket.io`)
  
  // ✅ CRITICAL: Fetch location from DATABASE for both users (frontend may send 'Unknown' if IP detection hasn't completed)
  try {
    const [dbUser1, dbUser2] = await Promise.all([
      prisma.users.findUnique({ where: { id: userId1 }, select: { location: true, display_name: true, has_blue_tick: true, blue_tick_expires_at: true } }),
      prisma.users.findUnique({ where: { id: userId2 }, select: { location: true, display_name: true, has_blue_tick: true, blue_tick_expires_at: true } })
    ]);
    
    // Enrich blue tick status (check expiry)
    const now = new Date();
    if (userData1) {
      userData1.hasBlueTick = !!(dbUser1?.has_blue_tick && dbUser1?.blue_tick_expires_at && new Date(dbUser1.blue_tick_expires_at) > now);
    }
    if (userData2) {
      userData2.hasBlueTick = !!(dbUser2?.has_blue_tick && dbUser2?.blue_tick_expires_at && new Date(dbUser2.blue_tick_expires_at) > now);
    }
    
    console.log(`📍 [DB LOCATION] User1 DB location: "${dbUser1?.location || 'null'}", Frontend location: "${userData1?.userLocation || 'null'}"`)
    console.log(`📍 [DB LOCATION] User2 DB location: "${dbUser2?.location || 'null'}", Frontend location: "${userData2?.userLocation || 'null'}"`)
    
    // ✅ ALWAYS use DB location (most up-to-date from IP detection)
    if (userData1) {
      if (dbUser1?.location) {
        userData1.userLocation = dbUser1.location;
      } else if (!userData1.userLocation) {
        userData1.userLocation = 'Unknown';
      }
    }
    if (userData2) {
      if (dbUser2?.location) {
        userData2.userLocation = dbUser2.location;
      } else if (!userData2.userLocation) {
        userData2.userLocation = 'Unknown';
      }
    }
    console.log(`📍 [FINAL] User1 location: "${userData1?.userLocation}", User2 location: "${userData2?.userLocation}"`)
  } catch (dbLocErr) {
    console.warn('⚠️ Could not fetch locations from DB:', dbLocErr.message);
  }

  // Create session
  const sessionId = uuidv4()
  const startedAt = new Date()
  
  console.log('\n✓ STEP 2: Creating session')
  console.log(`   sessionId: ${sessionId}`)
  
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
    console.log(`   ✅ Session stored in Redis`)
  } catch (error) {
    console.error('❌ Error storing session in Redis:', error)
  }

  // CRITICAL: Join both users to a shared room before starting chat
  console.log('\n✓ STEP 3: Joining both users to shared room')
  const roomId = `${sessionId}:chat`
  
  try {
    const socket1Obj = io.sockets.sockets.get(socketId1)
    const socket2Obj = io.sockets.sockets.get(socketId2)
    
    if (!socket1Obj) {
      console.error(`❌ Cannot join room - Socket1 object is null!`)
    } else {
      socket1Obj.join(roomId)
      const roomsForSocket1 = Array.from(socket1Obj.rooms);
      console.log(`✅ Socket1 joined room: ${roomId}`)
      console.log(`   Socket1 is now in ${roomsForSocket1.length} room(s): ${roomsForSocket1.join(', ')}`)
    }
    
    if (!socket2Obj) {
      console.error(`❌ Cannot join room - Socket2 object is null!`)
    } else {
      socket2Obj.join(roomId)
      const roomsForSocket2 = Array.from(socket2Obj.rooms);
      console.log(`✅ Socket2 joined room: ${roomId}`)
      console.log(`   Socket2 is now in ${roomsForSocket2.length} room(s): ${roomsForSocket2.join(', ')}`)
    }
    
    // Verify both are in the same room
    const roomSockets = io.sockets.adapter.rooms.get(roomId)
    console.log(`\n📍 [ROOM CHECK] Room "${roomId}" now contains:`)
    console.log(`   Total sockets in room: ${roomSockets?.size || 0}`)
    if (roomSockets) {
      for (const sockId of roomSockets) {
        console.log(`   - ${sockId}`)
      }
    }
  } catch (roomErr) {
    console.error(`❌ ERROR joining rooms:`, roomErr.message)
    console.error(`   This could prevent partner_found from being received!`)
  }
  console.log(`   ✅ Socket2 joined room: ${roomId}`)

  // CRITICAL: Track partner relationships BEFORE emitting
  console.log('\n✓ STEP 4: Tracking partner relationships')
  partnerSockets.set(socketId1, socketId2)
  partnerSockets.set(socketId2, socketId1)
  console.log(`   ✅ Partner mapping stored:`)
  console.log(`      ${socketId1} <-> ${socketId2}`)
  console.log(`      ${socketId2} <-> ${socketId1}`)
  
  // CRITICAL: Emit partner_found to BOTH users with full data
  console.log('\n✓ STEP 5: Emitting partner_found to BOTH users')
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║              🚀 SENDING PARTNER_FOUND EVENTS 🚀             ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  
  // VERIFY SOCKETS ARE STILL CONNECTED BEFORE EMITTING
  const socket1Connected = io.sockets.sockets.has(socketId1)
  const socket2Connected = io.sockets.sockets.has(socketId2)
  
  console.log(`\n🔌 [EMIT CHECK] Socket connection status:`)
  console.log(`   Socket1 (${socketId1.substring(0, 8)}...) connected? ${socket1Connected}`)
  console.log(`   Socket2 (${socketId2.substring(0, 8)}...) connected? ${socket2Connected}`)
  console.log(`   Total connected sockets on server: ${io.engine.clientsCount}`)
  
  if (!socket1Connected || !socket2Connected) {
    console.error(`❌ [EMIT ERROR] One or both sockets disconnected AFTER partner check!`)
    console.error(`   Socket1 exists: ${socket1Connected}`)
    console.error(`   Socket2 exists: ${socket2Connected}`)
    console.error(`   Cannot emit partner_found - sockets unavailable`)
    return
  }
  
  // Get actual socket objects to verify they're valid
  const actualSocket1 = io.sockets.sockets.get(socketId1)
  const actualSocket2 = io.sockets.sockets.get(socketId2)
  
  console.log(`\n🔍 [SOCKET DETAILS] Verifying socket object properties:`)
  console.log(`   Socket1:`)
  console.log(`     - exists: ${!!actualSocket1}`)
  console.log(`     - connected: ${actualSocket1?.connected || false}`)
  console.log(`     - handshake.auth: ${!!actualSocket1?.handshake?.auth}`)
  console.log(`   Socket2:`)
  console.log(`     - exists: ${!!actualSocket2}`)
  console.log(`     - connected: ${actualSocket2?.connected || false}`)
  console.log(`     - handshake.auth: ${!!actualSocket2?.handshake?.auth}`)
  
  // User 1 receives User 2's info
  const partnerFoundEvent1 = {
    partnerId: userId2,
    sessionId: sessionId,
    socketId: socketId2,
    userName: userData2?.userName || 'Anonymous',
    userAge: userData2?.userAge || 18,
    userLocation: userData2?.userLocation || 'Unknown',
    userPicture: userData2?.userPicture || null,
    hasBlueTick: userData2?.hasBlueTick || false
  }
  
  console.log(`\n📤 [EMIT1] Sending partner_found to User1 socket ${socketId1.substring(0, 8)}...`)
  console.log(`   Partner: ${userId2} (${userData2?.userName || 'Anonymous'})`)
  console.log(`   Event payload:`, JSON.stringify(partnerFoundEvent1, null, 2))
  
  try {
    // Use the actual socket object to emit
    if (actualSocket1) {
      actualSocket1.emit('partner_found', partnerFoundEvent1)
      console.log(`✅ [EMIT1] partner_found emitted via socket object`)
    } else {
      // Fallback to io.to()
      io.to(socketId1).emit('partner_found', partnerFoundEvent1)
      console.log(`✅ [EMIT1] partner_found emitted via io.to()`)
    }
  } catch (emit1Err) {
    console.error(`❌ [EMIT1] CRITICAL ERROR emitting to User1:`, emit1Err.message)
    console.error(`   Stack:`, emit1Err.stack)
  }
  
  // User 2 receives User 1's info
  const partnerFoundEvent2 = {
    partnerId: userId1,
    sessionId: sessionId,
    socketId: socketId1,
    userName: userData1?.userName || 'Anonymous',
    userAge: userData1?.userAge || 18,
    userLocation: userData1?.userLocation || 'Unknown',
    userPicture: userData1?.userPicture || null,
    hasBlueTick: userData1?.hasBlueTick || false
  }
  
  console.log(`\n📤 [EMIT2] Sending partner_found to User2 socket ${socketId2.substring(0, 8)}...`)
  console.log(`   Partner: ${userId1} (${userData1?.userName || 'Anonymous'})`)
  console.log(`   Event payload:`, JSON.stringify(partnerFoundEvent2, null, 2))
  
  try {
    // Use the actual socket object to emit
    if (actualSocket2) {
      actualSocket2.emit('partner_found', partnerFoundEvent2)
      console.log(`✅ [EMIT2] partner_found emitted via socket object`)
    } else {
      // Fallback to io.to()
      io.to(socketId2).emit('partner_found', partnerFoundEvent2)
      console.log(`✅ [EMIT2] partner_found emitted via io.to()`)
    }
  } catch (emit2Err) {
    console.error(`❌ [EMIT2] CRITICAL ERROR emitting to User2:`, emit2Err.message)
    console.error(`   Stack:`, emit2Err.stack)
  }
  
  console.log(`\n✅ [EMIT COMPLETE] Both partner_found events processed`)
  
  // Track call start time and partner info for both users
  console.log('\n✓ STEP 6: Storing call metadata')
  
  try {
    const socket1 = io.sockets.sockets.get(socketId1)
    if (socket1) {
      socket1.callStartTime = Date.now()
      socket1.partner = {
        id: userId2,
        name: userData2?.userName || 'Anonymous',
        country: userData2?.userLocation || 'Unknown',
        socketId: socketId2
      }
      socket1.sessionId = sessionId
      console.log(`   ✅ Socket1 metadata stored`)
    }
  } catch (e) {
    console.error('   ❌ Error storing socket1 metadata:', e.message)
  }
  
  try {
    const socket2 = io.sockets.sockets.get(socketId2)
    if (socket2) {
      socket2.callStartTime = Date.now()
      socket2.partner = {
        id: userId1,
        name: userData1?.userName || 'Anonymous',
        country: userData1?.userLocation || 'Unknown',
        socketId: socketId1
      }
      socket2.sessionId = sessionId
      console.log(`   ✅ Socket2 metadata stored`)
    }
  } catch (e) {
    console.error('   ❌ Error storing socket2 metadata:', e.message)
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║         ✅ MATCH COMPLETE - BOTH USERS NOTIFIED ✅          ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log(`✅ Matched: ${userId1} (${userData1?.userName}) <-> ${userId2} (${userData2?.userName})`)
  console.log(`✅ Session ID: ${sessionId}`)
  console.log(`✅ Room ID: ${roomId}`)
  console.log('\n')
}

// ===== ADMIN ENDPOINTS =====

// Send warning to user
app.post('/api/admin/send-warning', async (req, res) => {
  try {
    const { userId, reason } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    console.log(`\n${'='.repeat(80)}`)
    console.log(`⚠️  [SEND WARNING] ⚠️  SENDING WARNING TO USER ⚠️ `)
    console.log('='.repeat(80))
    console.log(`📍 User ID (UUID): ${userId}`)
    console.log(`📝 Reason: ${reason || 'No reason provided'}`)
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`)

    // Find user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.error(`❌ [SEND WARNING] User not found: ${userId}`)
      return res.status(404).json({ error: 'User not found' })
    }

    console.log(`✅ [SEND WARNING] User found: ${user.email}`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`👤 Public ID: ${user.public_id}`)

    // Update user warning fields in database
    const updatedUser = await pool.query(
      `UPDATE users 
       SET warning_count = COALESCE(warning_count, 0) + 1,
           last_warning_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, warning_count, last_warning_at`,
      [userId]
    )

    const warningData = updatedUser.rows[0]
    console.log(`✅ [SEND WARNING] Database updated - Warning count: ${warningData.warning_count}`)
    console.log(`📊 Updated at: ${warningData.last_warning_at}`)

    // Check active rooms before sending
    const socketsInRoom = io.sockets.adapter.rooms.get(userId)
    const socketsInRoomCount = socketsInRoom ? socketsInRoom.size : 0
    console.log(`\n🔍 [SEND WARNING] Socket room check for userId ${userId}:`)
    console.log(`   📊 Sockets in room: ${socketsInRoomCount}`)
    console.log(`   📊 Total connected clients: ${io.engine.clientsCount}`)
    console.log(`   📊 Online users map size: ${onlineUsers.size}`)
    
    // List all online users
    if (onlineUsers.size > 0) {
      console.log(`   📋 Online users:`)
      for (const [otherUserId, socketId] of onlineUsers.entries()) {
        const marker = otherUserId === userId ? '👈 TARGET USER' : ''
        console.log(`      - ${otherUserId.substring(0, 8)}... (socket: ${socketId.substring(0, 8)}...) ${marker}`)
      }
    } else {
      console.log(`   ⚠️  No online users registered!`)
    }

    // Emit warning event to user via Socket.IO
    console.log(`\n📢 [SEND WARNING] Emitting 'account_warning' event...`)
    
    const warningPayload = {
      type: 'warning',
      message: 'Your account has been warned for violating community standards',
      reason: reason || 'Violation of Premium Community Standards',
      warningCount: warningData.warning_count,
      lastWarningAt: warningData.last_warning_at,
      timestamp: new Date().toISOString()
    }
    
    console.log(`   📦 Payload: ${JSON.stringify(warningPayload, null, 2)}`)
    console.log(`   🎯 Target room: ${userId}`)
    
    io.to(userId).emit('account_warning', warningPayload)

    console.log(`✅ [SEND WARNING] Event emitted via io.to('${userId}').emit()`)
    console.log('='.repeat(80) + '\n')

    // Return success response
    res.json({
      success: true,
      message: 'Warning sent to user',
      socketsInRoom: socketsInRoomCount,
      user: {
        id: user.public_id,
        email: user.email,
        warningCount: warningData.warning_count,
        lastWarningAt: warningData.last_warning_at
      }
    })

  } catch (error) {
    console.error(`❌ [SEND WARNING] Error:`, error.message)
    console.error(`❌ [SEND WARNING] Stack:`, error.stack)
    res.status(500).json({ error: 'Failed to send warning', details: error.message })
  }
})

// ✅ GET USER'S WARNING STATUS (for frontend polling backup)
app.get('/api/user/:userId/warning-status', verifyUserToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    console.log(`\n📊 [GET WARNING STATUS] Checking warning for user: ${userId}`);

    // Get user's warning info
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        warning_count: true,
        last_warning_at: true,
        ban_reason: true
      }
    });

    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ User found - Warning count: ${user.warning_count}`);

    // If user has warnings, return warning data
    if (user.warning_count && user.warning_count > 0) {
      console.log(`⚠️ User has ${user.warning_count} warning(s)`);
      return res.json({
        hasWarning: true,
        warningCount: user.warning_count,
        lastWarningAt: user.last_warning_at,
        banReason: user.ban_reason,
        warning: {
          type: 'warning',
          message: 'Your account has been warned for violating community standards',
          reason: user.ban_reason || 'Violation of Premium Community Standards',
          warningCount: user.warning_count,
          lastWarningAt: user.last_warning_at,
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`✅ No warnings for this user`);
    res.json({ hasWarning: false, warningCount: 0 });

  } catch (error) {
    console.error(`❌ Error getting warning status:`, error.message);
    res.status(500).json({ error: 'Failed to get warning status', details: error.message });
  }
});

// Get user warnings
app.get('/api/admin/user/:userId/warnings', async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    const result = await pool.query(
      `SELECT id, email, public_id, warning_count, last_warning_at, ban_reason
       FROM users 
       WHERE id = $1`,
      [userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    res.json({
      success: true,
      user: {
        id: user.public_id,
        email: user.email,
        warningCount: user.warning_count || 0,
        lastWarningAt: user.last_warning_at,
        banReason: user.ban_reason
      }
    })

  } catch (error) {
    console.error('❌ Error fetching user warnings:', error)
    res.status(500).json({ error: 'Failed to fetch warnings', details: error.message })
  }
})

// Start Server
const PORT = process.env.PORT || 10000;

(async () => {
  console.log("[STARTUP] STEP 0 - Async function started");

  try {
    console.log("[STARTUP] STEP 1.1 - Redis client creating");
    redis = await initializeRedis();
    console.log("[STARTUP] STEP 1.4 - Redis initialization complete");

    console.log("[STARTUP] STEP 2.1 - Database init starting");
    await initializeDatabase();
    console.log("[STARTUP] STEP 2.2 - Database init complete");

    // ✅ AUTO-FIX: Update locations that have country names instead of states
    try {
      const countryPattern = '%, India';
      const result = await pool.query(
        `SELECT id, location FROM users WHERE location ILIKE $1`, [countryPattern]
      );
      if (result.rows.length > 0) {
        console.log(`📍 [STARTUP] Found ${result.rows.length} users with country in location, fixing...`);
        for (const user of result.rows) {
          try {
            const ipRes = await fetch('http://ip-api.com/json/?fields=status,city,regionName', { timeout: 3000 });
            const ipData = await ipRes.json();
            // For localhost, all users share same IP - use city from existing location
            const existingCity = user.location.split(',')[0].trim();
            if (ipData.status === 'success' && ipData.regionName) {
              const newLoc = `${existingCity}, ${ipData.regionName}`;
              await pool.query('UPDATE users SET location = $1 WHERE id = $2', [newLoc, user.id]);
              console.log(`📍 [STARTUP] Fixed: "${user.location}" → "${newLoc}" for user ${user.id.substring(0, 8)}`);
            }
          } catch (ipErr) {
            console.log(`📍 [STARTUP] Could not fix location for user ${user.id.substring(0, 8)}: ${ipErr.message}`);
          }
        }
      }
    } catch (fixErr) {
      console.log('📍 [STARTUP] Location fix query error:', fixErr.message);
    }

    console.log("[STARTUP] STEP 3.1 - Starting server...");
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log("[STARTUP] STEP 3.2 - Server running on PORT:", PORT);
    });

  } catch (err) {
    console.error("[STARTUP ERROR]", err);
    process.exit(1);
  }
})();

