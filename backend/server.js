import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
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
import MatchingServiceOptimized from './services/matchingServiceOptimized.js'
import setupMatchingHandlers from './sockets/matchingHandlers.js'
import { validateSkipLimit } from './services/skipLimitValidator.js'

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

// ===== GLOBAL CRASH PROTECTION =====
// Prevent server from crashing on unhandled errors
process.on('uncaughtException', (err) => {
  console.error('🚨 ═══════════════════════════════════════════════════════')
  console.error('🚨 UNCAUGHT EXCEPTION - Server recovery activated')
  console.error('🚨 ═══════════════════════════════════════════════════════')
  console.error('🚨 Error:', err.message)
  console.error('🚨 Stack:', err.stack)
  console.error('🚨 ═══════════════════════════════════════════════════════')
  // Continue running instead of crashing
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 ═══════════════════════════════════════════════════════')
  console.error('🚨 UNHANDLED REJECTION - Server recovery activated')
  console.error('🚨 ═══════════════════════════════════════════════════════')
  console.error('🚨 Promise:', promise)
  console.error('🚨 Reason:', reason)
  if (reason && reason.stack) {
    console.error('🚨 Stack:', reason.stack)
  }
  console.error('🚨 ═══════════════════════════════════════════════════════')
  // Continue running instead of crashing
})

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

// ✅ GLOBAL RESET HANDLER — Midnight date-change reset (IST)
// Triggered on every user fetch. Resets daily_skip_count to 0 when IST calendar date changes (12:00 AM IST).
// Free users get 120 skips/day. Premium users are unlimited.
const DAILY_SKIP_LIMIT = 120;

// Convert any Date to IST (Asia/Kolkata) Date object
function toIST(date) {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
}

function shouldResetSkips(lastReset) {
  const nowIST = toIST(new Date());
  if (!lastReset) return true;
  const last = new Date(lastReset);
  if (Number.isNaN(last.getTime())) return true;
  const lastIST = toIST(last);
  // Reset if the IST calendar date has changed
  return nowIST.toDateString() !== lastIST.toDateString();
}

async function ensureDailySkipReset(user) {
  if (!user || !user.id) return user;

  if (shouldResetSkips(user.last_skip_reset_date)) {
    console.log('🔄 [RESET] BEFORE RESET:', {
      skip: user.daily_skip_count,
      lastReset: user.last_skip_reset_date
    });

    if (prisma) {
      const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: {
          daily_skip_count: 0,
          last_skip_reset_date: new Date()
        }
      });
      console.log('🔄 [RESET] AFTER RESET (DB updated):', {
        skip: updatedUser.daily_skip_count,
        lastReset: updatedUser.last_skip_reset_date
      });
      return updatedUser;
    } else {
      user.daily_skip_count = 0;
      user.last_skip_reset_date = new Date();
      return user;
    }
  }

  return user;
}

// ===== DATABASE CONFIGURATION =====

// PostgreSQL (AWS RDS) Connection
const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false
  }
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
      ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS accepted_guidelines BOOLEAN DEFAULT false;
      ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
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

    // Create blocks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blocks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(blocker_id, blocked_id)
      );
      CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks(blocker_id);
    `)

    // Create payments table for Cashfree transactions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(50) DEFAULT 'created',
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Add Cashfree columns if they don't exist (for existing tables)
    await pool.query(`
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS cashfree_order_id VARCHAR(255);
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS cashfree_payment_id VARCHAR(255);
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS cashfree_session_id VARCHAR(255);
    `)

    // Create indexes for payments table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `)

    // Create index on cashfree_order_id (after column is guaranteed to exist)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(cashfree_order_id);
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
      ALTER TABLE users ADD COLUMN IF NOT EXISTS has_seen_premium_popup BOOLEAN DEFAULT false;
    `)

    console.log('✅ PostgreSQL tables initialized')
  } catch (error) {
    console.error('❌ Error initializing database tables:', error)
  }
}

// Redis Connection
let redis = null

// ===== IN-MEMORY QUEUE FALLBACK (when Redis is unavailable) =====
let inMemoryMatchingQueue = {}; // For sorted sets by key: { 'matching_queue': [{score, value}, ...] }
let inMemoryUserStatus = new Map();
let inMemoryOnlineUsers = new Set();
let inMemorySets = {}; // For Redis sets: { 'online_males': Set, 'online_females': Set, 'active_users': Set }

// Function to safely initialize Redis
async function initializeRedis() {
  const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
  const USE_MEMORY_FALLBACK = process.env.REDIS_FALLBACK === 'true' || process.env.NODE_ENV === 'development';

  try {
    console.log(`\n[REDIS] 🔴 Attempting to connect to Redis...`);
    console.log(`[REDIS] URL: ${REDIS_URL}`);

    const redisClient = createClient({
      url: REDIS_URL,
      socket: {
        connectTimeout: 5000,
        // ✅ ALWAYS reconnect — disabling this causes silent matching failures
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
        keepAlive: 30000
      }
    });

    // Handle connection events
    redisClient.on('connect', () => {
      console.log('✅ [REDIS] 🟢 Connected to Redis successfully!');
    });

    redisClient.on('error', (err) => {
      console.error('❌ [REDIS] Connection error:', err.message);
      if (USE_MEMORY_FALLBACK) {
        console.log('[REDIS] Switching to in-memory fallback...');
      }
    });

    redisClient.on('ready', () => {
      console.log('✅ [REDIS] Ready for commands');
    });

    // Try to connect
    await redisClient.connect();
    console.log('✅ [REDIS] ⚡ Redis initialized - All operations will use real Redis!');

    return redisClient;
  } catch (error) {
    console.error('❌ [REDIS] Connection failed:', error.message);

    if (!USE_MEMORY_FALLBACK) {
      console.error('❌ [REDIS] CRITICAL: Redis required but connection failed');
      console.error('Set REDIS_FALLBACK=true or provide valid REDIS_URL');
      throw error;
    }

    console.log('[REDIS] ⚠️  Using in-memory fallback (development mode)');
    console.log('[REDIS] NOTE: This will NOT persist data and will lose data on restart!\n');

    // In-memory list storage for Redis list commands
    const inMemoryLists = {};

    // Return in-memory fallback
    return {
      // ===== SORTED SET OPERATIONS =====
      zAdd: async (key, items) => {
        if (!inMemoryMatchingQueue[key]) inMemoryMatchingQueue[key] = [];
        const itemsArr = Array.isArray(items) ? items : [items];
        for (const item of itemsArr) {
          const { score, value } = item;
          inMemoryMatchingQueue[key] = inMemoryMatchingQueue[key].filter(e => e.value !== value);
          inMemoryMatchingQueue[key].push({ score, value });
          inMemoryMatchingQueue[key].sort((a, b) => a.score - b.score);
        }
        return itemsArr.length;
      },
      zRange: async (key, start, end) => {
        const queue = inMemoryMatchingQueue[key] || [];
        const endIdx = end === -1 ? undefined : end + 1;
        return queue.slice(start, endIdx).map(e => e.value);
      },
      zRem: async (key, value) => {
        if (!inMemoryMatchingQueue[key]) return 0;
        const before = inMemoryMatchingQueue[key].length;
        inMemoryMatchingQueue[key] = inMemoryMatchingQueue[key].filter(e => e.value !== value);
        return before - inMemoryMatchingQueue[key].length;
      },
      zCard: async (key) => (inMemoryMatchingQueue[key] || []).length,

      // ===== LIST OPERATIONS (required by matchingServiceOptimized.js) =====
      rPush: async (key, value) => {
        if (!inMemoryLists[key]) inMemoryLists[key] = [];
        inMemoryLists[key].push(value);
        return inMemoryLists[key].length;
      },

      lPop: async (key) => {
        if (!inMemoryLists[key] || inMemoryLists[key].length === 0) return null;
        return inMemoryLists[key].shift();
      },

      lIndex: async (key, index) => {
        const list = inMemoryLists[key] || [];
        if (index < 0) index = list.length + index;
        return list[index] || null;
      },
      lRem: async (key, count, value) => {
        if (!inMemoryLists[key]) return 0;
        let removed = 0;
        const absCount = Math.abs(count) || inMemoryLists[key].length;
        inMemoryLists[key] = inMemoryLists[key].filter(item => {
          if (removed >= absCount) return true;
          if (item === value) { removed++; return false; }
          return true;
        });
        return removed;
      },
      lLen: async (key) => (inMemoryLists[key] || []).length,
      lPos: async (key, value) => {
        const list = inMemoryLists[key] || [];
        const idx = list.indexOf(value);
        return idx === -1 ? null : idx;
      },
      lRange: async (key, start, end) => {
        const list = inMemoryLists[key] || [];
        const endIdx = end === -1 ? list.length : end + 1;
        return list.slice(start, endIdx);
      },

      // ===== KEY-VALUE OPERATIONS =====
      setEx: async (key, ttl, value) => {
        inMemoryUserStatus.set(key, value);
        // In fallback, we don't actually expire keys, but would need a timer for production
        if (ttl && ttl > 0) {
          // Schedule deletion after TTL seconds
          setTimeout(() => inMemoryUserStatus.delete(key), ttl * 1000);
        }
        return 'OK';
      },

      get: async (key) => inMemoryUserStatus.get(key) || null,
      set: async (key, value) => { inMemoryUserStatus.set(key, value); return 'OK'; },
      del: async (key) => {
        let deleted = 0;
        if (inMemoryUserStatus.delete(key)) deleted = 1;
        if (inMemoryLists[key]) { delete inMemoryLists[key]; deleted = 1; }
        return deleted;
      },
      sAdd: async (key, value) => {
        if (key === 'online_users') { inMemoryOnlineUsers.add(value); return 1; }
        if (!inMemorySets[key]) inMemorySets[key] = new Set();
        inMemorySets[key].add(value);
        return 1;
      },
      sRem: async (key, value) => {
        if (key === 'online_users') return inMemoryOnlineUsers.delete(value) ? 1 : 0;
        if (inMemorySets[key]) return inMemorySets[key].delete(value) ? 1 : 0;
        return 0;
      },
      sMembers: async (key) => {
        if (key === 'online_users') return Array.from(inMemoryOnlineUsers);
        return inMemorySets[key] ? Array.from(inMemorySets[key]) : [];
      },
      sCard: async (key) => {
        if (key === 'online_users') return inMemoryOnlineUsers.size;
        return inMemorySets[key] ? inMemorySets[key].size : 0;
      },
      expire: async (key, seconds) => 1,
      keys: async (pattern) => Array.from(inMemoryUserStatus.keys()).filter(k => k.match(pattern.replace('*', '.*'))),
      exists: async (key) => inMemoryUserStatus.has(key) ? 1 : 0,
      scriptLoad: async (script) => 'fallback_script',
      evalSHA: async () => null,

      // ===== LUA SCRIPT EXECUTION (fallback) =====
      eval: async (script, numKeys, ...args) => {
        // Simple fallback for matching Lua script
        // Expects: eval(script, 3, queueKey, waitingPrefix, matchedPrefix, userId, userEntry, timeout)
        const queueKey = args[0];
        const waitingPrefix = args[1];
        const matchedPrefix = args[2];
        const newUserId = args[3];
        const newEntry = args[4];
        const timeout = parseInt(args[5]);

        console.log('[REDIS_FALLBACK] eval() called - simulating Lua matching');
        console.log('[REDIS_FALLBACK]   queueKey:', queueKey);
        console.log('[REDIS_FALLBACK]   newUserId:', newUserId);

        try {
          // Get first user in queue
          const list = inMemoryLists[queueKey] || [];
          if (list.length > 0) {
            // Match found - pop from queue
            const firstEntry = list.shift();
            const partner = JSON.parse(firstEntry);

            // Mark both as matched
            inMemoryUserStatus.set(`${matchedPrefix}${newUserId}`, partner.userId);
            inMemoryUserStatus.set(`${matchedPrefix}${partner.userId}`, newUserId);
            inMemoryUserStatus.delete(`${waitingPrefix}${newUserId}`);
            inMemoryUserStatus.delete(`${waitingPrefix}${partner.userId}`);

            console.log('[REDIS_FALLBACK] MATCHED:', newUserId, '↔️', partner.userId);
            return ['MATCHED', partner.userId, partner.socketId, String(Date.now())];
          } else {
            // No match - add to queue
            if (!inMemoryLists[queueKey]) inMemoryLists[queueKey] = [];
            inMemoryLists[queueKey].push(newEntry);
            inMemoryUserStatus.set(`${waitingPrefix}${newUserId}`, '1');

            const queueSize = inMemoryLists[queueKey].length;
            console.log('[REDIS_FALLBACK] WAITING: added to queue, size:', queueSize);
            return ['WAITING', String(queueSize)];
          }
        } catch (err) {
          console.error('[REDIS_FALLBACK] eval() error:', err.message);
          throw err;
        }
      },

      ping: async () => 'PONG',

      dbSize: async () => inMemoryUserStatus.size + inMemoryOnlineUsers.size
    };
  }
}

// ===== INITIALIZE REDIS ON STARTUP =====
redis = await initializeRedis();

// ===== EXPRESS & SOCKET.IO SETUP =====

const app = express()
const httpServer = createServer(app)

// ===== SECURITY HEADERS & CORS CONFIGURATION =====

// Get the frontend URL from environment or default to localhost:3000
const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
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
  "https://flinxx.in",
  "https://www.flinxx.in",
  "https://d1pphanrf0qsx7.cloudfront.net",
  "https://flinxx-admin-panel.vercel.app"
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

  // Security Headers
  // COOP: allow-popups needed for OAuth popup flow (Google/Facebook login)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  // NOTE: Cross-Origin-Embedder-Policy: require-corp REMOVED
  // It was blocking third-party resources (Cashfree SDK, Google Fonts, Google Sign-In)

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

// ✅ INITIALIZE MATCHING SYSTEM
console.log('\n🚀 [server.js] ==================== INITIALIZING MATCHING SYSTEM ====================');
console.log('[server.js] 📞 Calling setupMatchingHandlers...');
setupMatchingHandlers(io, redis, prisma)
console.log('✅ [server.js] setupMatchingHandlers() returned - Lua scripts loading async in background');
console.log('[server.js] 💡 TIP: Check server logs for "[LUA]" prefix to see script loading progress');
console.log('[server.js] ==================== MATCHING SYSTEM READY FOR CONNECTIONS ====================\n');

// ===== HTTP SERVER ERROR HANDLERS =====
httpServer.on('error', (err) => {
  console.error('🚨 [HTTP_SERVER_ERROR] HTTP server error:', err.message)
  console.error('   Code:', err.code)
  console.error('   Stack:', err.stack)
})

io.on('error', (err) => {
  console.error('🚨 [IO_ERROR] Socket.IO error:', err.message)
  console.error('   Stack:', err.stack)
})

// Middleware - Enable CORS for all routes
app.use(cors(corsOptions))

// CRITICAL: Handle preflight requests (OPTIONS) for all routes
app.options('*', cors(corsOptions))

app.use(express.json())

// ===== FRONTEND ERROR LOGGING ENDPOINT =====
// Receives silent error reports from production frontend (replaces console.error)
// Rate-limited to prevent abuse: max 20 requests/min per IP, payload capped at 2KB
const _errorLogRateMap = new Map(); // IP -> { count, resetTime }
const ERROR_LOG_MAX_PER_MIN = 20;
const ERROR_LOG_MAX_PAYLOAD = 2048; // 2KB max

app.post('/api/logs/error', (req, res) => {
  try {
    // Rate limiting per IP
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
    const now = Date.now();
    const rateEntry = _errorLogRateMap.get(clientIP) || { count: 0, resetTime: now + 60000 };

    if (now > rateEntry.resetTime) {
      rateEntry.count = 0;
      rateEntry.resetTime = now + 60000;
    }

    rateEntry.count++;
    _errorLogRateMap.set(clientIP, rateEntry);

    if (rateEntry.count > ERROR_LOG_MAX_PER_MIN) {
      return res.status(429).json({ received: false, error: 'Rate limited' });
    }

    // Payload size check
    const rawBody = JSON.stringify(req.body || {});
    if (rawBody.length > ERROR_LOG_MAX_PAYLOAD) {
      return res.status(413).json({ received: false, error: 'Payload too large' });
    }

    const { error, timestamp, source } = req.body || {};

    // Sanitize: strip any tokens/secrets from the logged payload
    const sanitized = rawBody
      .replace(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[JWT_REDACTED]')
      .replace(/(token|password|secret|credential|authorization)["\s:=]+["']?[^"',\s}{]+/gi, '$1=[REDACTED]');

    console.error(`[FRONTEND_ERROR] [${source || 'unknown'}] [${clientIP}] [${timestamp || new Date().toISOString()}]`, sanitized);
    res.status(200).json({ received: true });
  } catch (e) {
    res.status(200).json({ received: true });
  }
});

// Periodic cleanup of rate limit map (every 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of _errorLogRateMap) {
    if (now > entry.resetTime + 60000) _errorLogRateMap.delete(ip);
  }
}, 300000);

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
      // Try JWT verification
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔐 [verifyUserToken] ✓ JWT VERIFIED SUCCESSFULLY");
      console.log("DECODED TOKEN:", decoded);
      console.log("🔐 [verifyUserToken] DECODED USER:", JSON.stringify(decoded, null, 2));
    } catch (jwtError) {
      console.error("🔐 [verifyUserToken] JWT Error:", jwtError.name, "-", jwtError.message);

      // Handle specific JWT errors
      if (jwtError.name === "TokenExpiredError") {
        console.warn("🔐 [verifyUserToken] ⚠️ TOKEN EXPIRED");
        return res.status(401).json({
          error: 'Token expired, please login again',
          code: 'TOKEN_EXPIRED'
        });
      }

      // For other JWT errors (invalid signature, malformed, etc.)
      console.error("🔐 [verifyUserToken] ❌ JWT verification failed:", jwtError.message);
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
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

    // Check if user is banned using Raw Query (bypasses Prisma schema generation requirement)
    try {
      const rawUser = await prisma.$queryRaw`SELECT is_banned FROM users WHERE id = ${userId}::uuid`;
      if (rawUser && rawUser.length > 0 && rawUser[0].is_banned) {
        console.error("🔐 [verifyUserToken] ❌ USER IS BANNED");
        return res.status(403).json({
          error: 'ACCOUNT_BANNED',
          message: 'Your account has been banned due to violations of our community guidelines.'
        });
      }
    } catch (err) {
      console.error("🔐 [verifyUserToken] Error checking ban status:", err);
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
io._partnerSockets = partnerSockets // ✅ Export to be used by matchingHandlers.js
const activeChats = new Set() // Track users currently in active chats to prevent duplicate matches

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
    console.log(`📝 [QUEUE] Incoming userData:`, JSON.stringify(userData, null, 2))

    // ✅ CRITICAL: Check if user is already in an active chat session
    if (activeChats.has(userId)) {
      console.warn(`⚠️ [QUEUE] User ${userId} is already in active chat - BLOCKING re-add to queue`)
      return // Prevent matched users from being added back to queue
    }

    // ✅ CRITICAL: VALIDATE userData BEFORE storing to Redis
    // If userData is missing key fields, fetch from DB immediately
    const needsDBFetch = !userData ||
      !userData.userName ||
      userData.userName === 'Anonymous' ||
      !userData.userLocation ||
      userData.userLocation === 'Unknown'

    if (needsDBFetch) {
      console.log(`⚠️ [QUEUE] userData incomplete - fetching from DB`)
      try {
        const dbUser = await prisma.users.findUnique({
          where: { id: userId },
          select: { display_name: true, location: true, age: true, profile_picture_url: true }
        })

        if (dbUser) {
          console.log(`✅ [QUEUE] Fetched from DB: ${dbUser.display_name} from ${dbUser.location}`)
          userData = {
            userId: userId,
            userName: dbUser.display_name || 'Anonymous',
            userAge: dbUser.age || 18,
            userLocation: dbUser.location || 'Unknown',
            userPicture: dbUser.profile_picture_url || null
          }
        } else {
          console.warn(`⚠️ [QUEUE] User not found in DB - using defaults`)
          userData = {
            userId: userId,
            userName: 'Anonymous',
            userAge: 18,
            userLocation: 'Unknown',
            userPicture: null
          }
        }
      } catch (dbErr) {
        console.warn(`⚠️ [QUEUE] DB fetch failed:`, dbErr.message)
        userData = userData || {
          userId: userId,
          userName: 'Anonymous',
          userAge: 18,
          userLocation: 'Unknown',
          userPicture: null
        }
      }
    }

    console.log(`✅ [QUEUE] Validated userData for storage:`, JSON.stringify(userData, null, 2))

    // CRITICAL: Check if this user is already in the queue (e.g., from a previous session)
    const existingMembers = await redis.zRange('matching_queue', 0, -1)
    let removedCount = 0

    for (const entry of existingMembers) {
      try {
        const queuedUser = JSON.parse(entry)
        if (queuedUser.userId === userId) {
          console.warn(`⚠️ DUPLICATE ENTRY FOUND: User ${userId} already in queue`)
          console.warn(`   Old socket: ${queuedUser.socketId}`)
          console.warn(`   New socket: ${socketId}`)
          console.warn(`   Removing old entry...`)
          await redis.zRem('matching_queue', entry)
          removedCount++
        }
      } catch (parseErr) {
        console.error(`❌ Failed to parse existing queue entry: ${parseErr.message}`)
        // Continue instead of crashing
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

    // Dynamic matching score initialization
    // 70% chance to get boost advantage if they have boost
    let boostAdvantage = 0;
    if (hasMatchBoost) {
      if (Math.random() < 0.70) {
        // 4000 to 6000 dynamic advantage
        boostAdvantage = Math.floor(Math.random() * 2000) + 4000;
      }
    }

    const joinTime = Date.now();

    const queueData = JSON.stringify({
      userId,
      socketId,
      userName: userData?.userName || 'Anonymous',
      userAge: userData?.userAge || 18,
      userLocation: userData?.userLocation || 'Unknown',
      userPicture: userData?.userPicture || null,
      connectionScore: userData?.connectionScore || 100,
      hasMatchBoost,
      joinTime,
      boostAdvantage,
      timestamp: joinTime // Keep for backwards compatibility
    })

    console.log(`📋 [QUEUE] Final entry to store: { userId: "${userData?.userId}", userName: "${userData?.userName}", location: "${userData?.userLocation}", age: ${userData?.userAge} })`)

    // Lower score = higher priority in Redis
    const score = joinTime - boostAdvantage;
    await redis.zAdd('matching_queue', { score, value: queueData })
    console.log(`✅ [QUEUE] User ${userId} added with socket ${socketId} ${hasMatchBoost ? '🚀 (MATCH BOOST - DYNAMIC PRIORITY)' : '(normal)'}`)

    // Verify it was added and log full queue state
    const queueLen = await redis.zCard('matching_queue')
    const allEntries = await redis.zRange('matching_queue', 0, -1)
    console.log(`📊 [QUEUE] After ADD - Total users in queue: ${queueLen}`)
    for (let i = 0; i < allEntries.length; i++) {
      const entry = JSON.parse(allEntries[i])
      console.log(`   [${i}] User ${entry.userId} - Socket ${entry.socketId.substring(0, 8)}... ${entry.hasMatchBoost ? '🚀 BOOST' : ''}`)
    }

    // ✅ TRIGGER INSTANT MATCH if queue has 2+ users
    console.log(`\n🎯 [CRITICAL] ABOUT TO CALL triggerInstantMatch()`)
    console.log(`   Queue length at this moment: ${queueLen}`)
    console.log(`   Should proceed? ${queueLen >= 2 ? 'YES ✅' : 'NO - need 2+ users'}`)

    await triggerInstantMatch()

    console.log(`✅ [CRITICAL] triggerInstantMatch() COMPLETED`)
  } catch (error) {
    console.error('❌ Error adding to queue:', error)
    console.error('   Stack:', error.stack)
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
      let parsed
      try {
        parsed = JSON.parse(data)
      } catch (parseErr) {
        console.error(`❌ Failed to parse queue entry in getNextFromQueue: ${parseErr.message}`)
        return null
      }
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
      try {
        const queuedUser = JSON.parse(entry)
        if (queuedUser.userId === userId) {
          await redis.zRem('matching_queue', entry)
          removedCount++
          console.log(`✅ Removed user ${userId} from queue (${removedCount} entry)`)
        }
      } catch (parseErr) {
        console.error(`❌ Failed to parse queue entry for removal: ${parseErr.message}`)
        // Continue to next entry instead of crashing
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

/**
 * ✅ CHECK IF TWO USERS RECENTLY MATCHED (cooldown mechanism)
 * Prevents same users from matching again within 25-30 seconds
 */
async function areRecentPartners(userId1, userId2) {
  try {
    // Check both directions (user1:user2 and user2:user1)
    const key1 = `recent:${userId1}:${userId2}`
    const key2 = `recent:${userId2}:${userId1}`

    const exists1 = await redis.exists(key1)
    const exists2 = await redis.exists(key2)

    const isRecent = exists1 > 0 || exists2 > 0

    if (isRecent) {
      console.log(`⏸️ [COOLDOWN] Users ${userId1} and ${userId2} recently matched - skipping`)
    }

    return isRecent
  } catch (error) {
    console.error('❌ Error checking recent partners:', error)
    return false // On error, allow match to be safe
  }
}

/**
 * ✅ SET RECENT PARTNER COOLDOWN (25-30 seconds)
 * Called when users disconnect, skip, or end call
 */
async function setRecentPartnerCooldown(userId1, userId2, ttlSeconds = 25) {
  try {
    const key1 = `recent:${userId1}:${userId2}`
    const key2 = `recent:${userId2}:${userId1}`

    await Promise.all([
      redis.setEx(key1, ttlSeconds, '1'),
      redis.setEx(key2, ttlSeconds, '1')
    ])

    console.log(`✅ [COOLDOWN] Set ${ttlSeconds}s cooldown between ${userId1} and ${userId2}`)
  } catch (error) {
    console.error('❌ Error setting recent partner cooldown:', error)
  }
}

/**
 * ✅ GET SKIP-BASED COOLDOWN DURATION
 * Returns cooldown duration based on skip count between two users
 * More skips = longer cooldown (30s → 120s → 600s)
 */
async function getSkipBasedCooldownDuration(userId1, userId2) {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  try {
    // Try to get from database (if migration is done)
    const record = await prisma.user_pair_skip_history.findUnique({
      where: {
        user1_id_user2_id: {
          user1_id: userId1,
          user2_id: userId2
        }
      }
    }).catch(() => null); // Silently fail if table doesn't exist

    if (!record) {
      console.log(`📊 [Skip Cooldown] No skip history found for ${userId1} vs ${userId2}`);
      return 25; // Default cooldown
    }

    // Check if reset date passed (new day)
    const lastResetDate = new Date(record.reset_at_time).toISOString().split('T')[0]
    if (lastResetDate !== today) {
      // Reset skip count for new day
      try {
        await prisma.user_pair_skip_history.update({
          where: {
            user1_id_user2_id: {
              user1_id: userId1,
              user2_id: userId2
            }
          },
          data: {
            skip_count: 0,
            reset_at_time: new Date()
          }
        }).catch(() => null);
      } catch (e) {
        console.warn(`⚠️ Could not reset skip count (table may not exist yet)`);
      }
      return 25; // Default cooldown
    }

    // Calculate cooldown based on skip count
    const skipCount = record.skip_count || 0;
    let cooldownSeconds = 25; // Default

    if (skipCount >= 5) {
      cooldownSeconds = 600; // 10 minutes
      console.log(`🔴 [Skip Cooldown] User ${userId1} vs ${userId2}: ${skipCount} skips → 10 MINUTES cooldown`);
    } else if (skipCount >= 3) {
      cooldownSeconds = 120; // 2 minutes
      console.log(`🟡 [Skip Cooldown] User ${userId1} vs ${userId2}: ${skipCount} skips → 2 MINUTES cooldown`);
    } else if (skipCount >= 1) {
      cooldownSeconds = 30; // 30 seconds
      console.log(`🟢 [Skip Cooldown] User ${userId1} vs ${userId2}: ${skipCount} skips → 30 SECONDS cooldown`);
    } else {
      cooldownSeconds = 25; // Default
      console.log(`🟢 [Skip Cooldown] User ${userId1} vs ${userId2}: ${skipCount} skips → 25 SECONDS cooldown`);
    }

    return cooldownSeconds;

  } catch (error) {
    console.error('❌ Error getting skip-based cooldown:', error.message);
    return 25; // Default safe duration
  }
}

/**
 * ✅ INCREMENT SKIP COUNT & SET DYNAMIC COOLDOWN
 * Called when users skip each other
 * Tracks skip history per user pair
 */
async function incrementSkipCountAndSetCooldown(userId1, userId2) {
  const today = new Date().toISOString().split('T')[0]

  try {
    // For both directions (user1→user2 and user2→user1)
    for (const [u1, u2] of [[userId1, userId2], [userId2, userId1]]) {
      try {
        const record = await prisma.user_pair_skip_history.upsert({
          where: {
            user1_id_user2_id: {
              user1_id: u1,
              user2_id: u2
            }
          },
          update: {
            skip_count: {
              increment: 1
            },
            last_skip_time: new Date()
          },
          create: {
            user1_id: u1,
            user2_id: u2,
            skip_count: 1,
            reset_at_time: new Date()
          }
        }).catch(() => null);

        if (record) {
          console.log(`📊 [Skip Count] ${u1.substring(0, 8)}... vs ${u2.substring(0, 8)}...: Skip count = ${record.skip_count}`);
        }
      } catch (e) {
        console.warn(`⚠️ Could not update skip count (table may not exist yet)`);
      }
    }

    // Get cooldown duration based on skip count
    const cooldownSeconds = await getSkipBasedCooldownDuration(userId1, userId2);

    // Set Redis cooldown with dynamic duration
    await setRecentPartnerCooldown(userId1, userId2, cooldownSeconds);

  } catch (error) {
    console.error('❌ Error incrementing skip count:', error);
  }
}

/**
 * ✅ ALLOW RE-MATCH IF QUEUE IS TOO LOW
 * Override cooldown when very few users available
 * For better UX when user base is small
 */
async function shouldAllowEmergencyReMatch(userId1, userId2, queueLength) {
  try {
    // If more than 3 users waiting, enforce cooldown normally
    if (queueLength > 3) {
      return false; // Use normal cooldown
    }

    // If queue < 3, check time since last match
    const key1 = `recent:${userId1}:${userId2}`
    const key2 = `recent:${userId2}:${userId1}`

    // Get remaining TTL (time-to-live) in seconds
    const ttl1 = await redis.ttl(key1).catch(() => -2);
    const ttl2 = await redis.ttl(key2).catch(() => -2);

    const maxTtl = Math.max(ttl1, ttl2);

    // maxTtl > 0 means cooldown is still active
    // For emergency matching with queue < 3:
    // - If only 2 users total and cooldown > 60 seconds remaining, allow after 60 seconds minimum
    if (queueLength === 2 && maxTtl > 0 && maxTtl <= 65) {
      console.log(`🚨 [EMERGENCY RE-MATCH] Queue has only 2 users + cooldown ${maxTtl}s remaining → ALLOW RE-MATCH`);
      return true; // Allow despite cooldown
    }

    return false; // Normal cooldown enforcement

  } catch (error) {
    console.error('❌ Error checking emergency re-match:', error);
    return false; // Safe: enforce cooldown
  }
}

/**
 * ✅ GET NEXT PARTNER FROM QUEUE (with cooldown filtering)
 * - Checks sorted queue (lowest score = highest priority)
 * - Filters out users in cooldown
 * - Filters out user's own ID to prevent self-match
 * - Returns safely if no valid match found
 */
async function getNextFromQueueOptimized(currentUserId, currentUserScore = 100) {
  try {
    const maxAttempts = 50 // Limit iterations to prevent infinite loops
    let attempts = 0

    while (attempts < maxAttempts) {
      attempts++

      const queueLen = await redis.zCard('matching_queue')
      console.log(`\n🔍 [QUEUE-GET] Attempt #${attempts} - Queue length: ${queueLen}`)

      if (queueLen === 0) {
        console.log(`⏳ [QUEUE-GET] Queue is empty - no users available`)
        return null
      }

      // Get user with lowest score (highest priority)
      const members = await redis.zRange('matching_queue', 0, 0)
      if (!members || members.length === 0) {
        console.log(`⏳ [QUEUE-GET] Queue check returned empty`)
        return null
      }

      const data = members[0]
      let parsed
      try {
        parsed = JSON.parse(data)
      } catch (parseErr) {
        console.error(`❌ Failed to parse queue entry: ${parseErr.message}`)
        await redis.zRem('matching_queue', data)
        continue
      }

      console.log(`🔍 [QUEUE-GET] Retrieved from Redis:`)
      console.log(`   User ID: ${parsed.userId}`)
      console.log(`   User Name: ${parsed.userName}`)
      console.log(`   Socket: ${parsed.socketId.substring(0, 8)}...`)

      // ✅ FILTER 1: Skip if it's the same user (self-match)
      if (parsed && parsed.userId === currentUserId) {
        console.log(`🔄 [QUEUE-GET] User ${parsed.userId} is same as current user - removing from queue`)
        await redis.zRem('matching_queue', data)
        continue // Try next user
      }

      // ✅ FILTER 1.5: CRITICAL - Skip if user is already in activeChats (already matched!)
      const isInActiveChat = activeChats.has(parsed.userId)
      console.log(`🔐 [QUEUE-GET] Is user ${parsed.userId} in activeChats? ${isInActiveChat}`)
      console.log(`   (Total in activeChats: ${activeChats.size})`)

      if (isInActiveChat) {
        console.warn(`⚠️ [QUEUE-GET] CRITICAL: User ${parsed.userId} is already in an active chat!`)
        console.warn(`   This user should NOT be in the queue - removing them now`)
        await redis.zRem('matching_queue', data)
        continue // Try next user
      }

      // ✅ FILTER 2: Skip if users recently matched (cooldown)
      const isRecent = await areRecentPartners(currentUserId, parsed.userId)
      if (isRecent) {
        // Check if emergency re-match allowed
        const allowEmergency = await shouldAllowEmergencyReMatch(
          currentUserId,
          parsed.userId,
          queueLen
        );

        if (!allowEmergency) {
          // Normal cooldown: move to back
          console.log(`🔄 [QUEUE-GET] User ${parsed.userId} is in cooldown - returning to queue (low priority)`);
          await redis.zRem('matching_queue', data);
          const newScore = Date.now();
          await redis.zAdd('matching_queue', { score: newScore, value: data });
          continue; // Try next user
        } else {
          // Emergency: override cooldown
          console.log(`🚨 [EMERGENCY OVERRIDE] Ignoring cooldown due to low queue (${queueLen} users)`);
          // Fall through to match this user despite cooldown
        }
      }

      // ✅ FILTER 3: Connection Score priority matchmaking
      const partnerScore = parsed.connectionScore || 100;
      let scoreCompatible = true;
      if (currentUserScore >= 80 && partnerScore < 50) scoreCompatible = false;
      if (currentUserScore < 50 && partnerScore >= 50) scoreCompatible = false;

      if (!scoreCompatible) {
        console.log(`🔄 [QUEUE-GET] Incompatible connection scores (${currentUserScore} vs ${partnerScore}) - returning to back of queue`);
        await redis.zRem('matching_queue', data);
        const newScore = Date.now() + 1000;
        await redis.zAdd('matching_queue', { score: newScore, value: data });
        continue;
      }

      // ✅ ALL CHECKS PASSED - Remove from queue and return
      console.log(`\n✅ [QUEUE-GET] User passed all filters - removing from queue...`)
      const removalResult = await redis.zRem('matching_queue', data)
      console.log(`✅ [QUEUE-GET] Removal result: ${removalResult} (1 = removed, 0 = not found)`)

      const newQueueLen = await redis.zCard('matching_queue')
      console.log(`✅ [QUEUE-GET] Matched user ${parsed.userId} - "${parsed.userName}" (${parsed.userAge}) from "${parsed.userLocation}"`)
      console.log(`✅ [QUEUE-GET] Queue length after retrieval: ${newQueueLen}`)
      return parsed
    }

    console.warn(`⚠️ [QUEUE-GET] Exceeded max attempts (${maxAttempts}) - returning null`)
    return null
  } catch (error) {
    console.error('❌ Error optimizing queue retrieval:', error)
    console.error('   Stack:', error.stack)
    return null
  }
}

/**
 * ✅ TRIGGER INSTANT MATCH (called when new user joins queue)
 * Performs server-side matching if queue has 2+ users
 */
async function triggerInstantMatch() {
  console.log(`\n🔔 [INSTANT-MATCH] 🔔 FUNCTION CALLED 🔔 - This should be logged every time a user joins!`)
  try {
    const queueLen = await redis.zCard('matching_queue')
    console.log(`📊 [INSTANT-MATCH] Queue length check: ${queueLen} users in queue`)

    if (queueLen >= 2) {
      console.log(`\n🚀 [INSTANT-MATCH] Queue has ${queueLen} users - PROCEEDING WITH INSTANT MATCH 🚀`)
      console.log(`🔐 [INSTANT-MATCH] Current activeChats: ${activeChats.size} users`)
      console.log(`   Users in activeChats:`, Array.from(activeChats))

      // ✅ CRITICAL: Get first two users from queue and match them directly
      const firstTwoUsers = await redis.zRange('matching_queue', 0, 1)
      console.log(`📥 [INSTANT-MATCH] Retrieved users from Redis:`)
      console.log(`   Count: ${firstTwoUsers?.length || 0}`)
      console.log(`   Expected: 2`)

      if (firstTwoUsers && firstTwoUsers.length === 2) {
        let user1, user2

        try {
          user1 = JSON.parse(firstTwoUsers[0])
          user2 = JSON.parse(firstTwoUsers[1])
          console.log(`✅ [INSTANT-MATCH] Successfully parsed both users`)
          console.log(`   User1: ${user1.userId} - ${user1.userName}`)
          console.log(`   User2: ${user2.userId} - ${user2.userName}`)
        } catch (parseErr) {
          console.error(`❌ [INSTANT-MATCH] Failed to parse queue entries:`, parseErr.message)
          return
        }

        // ✅ CRITICAL SAFETY CHECK: Verify neither user is already in activeChats
        const user1InChat = activeChats.has(user1.userId)
        const user2InChat = activeChats.has(user2.userId)

        console.log(`🔐 [INSTANT-MATCH] activeChats safety check:`)
        console.log(`   User1 (${user1.userId}) in activeChats? ${user1InChat}`)
        console.log(`   User2 (${user2.userId}) in activeChats? ${user2InChat}`)

        if (user1InChat || user2InChat) {
          console.error(`❌ [INSTANT-MATCH] CRITICAL ERROR: One or both users already in activeChats!`)
          console.error(`   This means they're already matched - cannot re-match!`)
          console.error(`   User1 in chat: ${user1InChat}`)
          console.error(`   User2 in chat: ${user2InChat}`)
          console.error(`   Removing invalid users from queue...`)

          if (user1InChat) {
            await redis.zRem('matching_queue', firstTwoUsers[0])
            console.log(`   ✅ Removed invalid user1 from queue`)
          }
          if (user2InChat) {
            await redis.zRem('matching_queue', firstTwoUsers[1])
            console.log(`   ✅ Removed invalid user2 from queue`)
          }

          return // Don't proceed with match
        }

        // Apply Connection Score Rule for instant match check
        const score1 = user1.connectionScore || 100;
        const score2 = user2.connectionScore || 100;
        let scoreCompatible = true;
        if (score1 >= 80 && score2 < 50) scoreCompatible = false;
        if (score1 < 50 && score2 >= 50) scoreCompatible = false;

        if (!scoreCompatible) {
          console.log(`🔄 [INSTANT-MATCH] Incompatible connection scores (${score1} vs ${score2}) - skipping instant match for these two`);
          // Push one to the back slightly so we don't infinitely retry these exact two
          await redis.zRem('matching_queue', firstTwoUsers[0]);
          await redis.zAdd('matching_queue', { score: Date.now() + 500, value: firstTwoUsers[0] });
          // Recursively trigger next match
          setTimeout(() => triggerInstantMatch(), 100);
          return;
        }

        console.log(`✅ [INSTANT-MATCH] Found 2 users to match:`)
        console.log(`   User1: ${user1.userId} (${user1.userName})`)
        console.log(`   User2: ${user2.userId} (${user2.userName})`)

        // Verify sockets exist before matching
        const socket1Exists = io.sockets.sockets.has(user1.socketId)
        const socket2Exists = io.sockets.sockets.has(user2.socketId)

        console.log(`🔌 [INSTANT-MATCH] Socket verification:`)
        console.log(`   Socket1 exists? ${socket1Exists}`)
        console.log(`   Socket2 exists? ${socket2Exists}`)

        if (socket1Exists && socket2Exists) {
          console.log(`✅ [INSTANT-MATCH] Both sockets are valid - executing match...`)
          console.log(`\n⚠️ [CRITICAL] NOW CALLING matchUsers() WITH:`)
          console.log(`   socketId1: ${user1.socketId}`)
          console.log(`   userId1: ${user1.userId}`)
          console.log(`   socketId2: ${user2.socketId}`)
          console.log(`   userId2: ${user2.userId}`)

          // Call matchUsers directly
          try {
            await matchUsers(
              user1.socketId,
              user1.userId,
              user2.socketId,
              user2.userId,
              user1,
              user2
            )
            console.log(`✅ [INSTANT-MATCH] ✅ MATCH SUCCESSFUL - Both users connected`)

            // Recursively trigger next match if more users in queue
            const remainingQueueLen = await redis.zCard('matching_queue')
            if (remainingQueueLen >= 2) {
              console.log(`\n📊 [INSTANT-MATCH] Queue still has ${remainingQueueLen} users - triggering next match...`)
              setTimeout(() => triggerInstantMatch(), 100) // Small delay to avoid blocking
            }
          } catch (matchErr) {
            console.error(`❌ [INSTANT-MATCH] Error executing match:`, matchErr.message)
            console.error(`   Stack:`, matchErr.stack)
          }
        } else {
          console.warn(`⚠️ [INSTANT-MATCH] One or both sockets are no longer connected`)
          console.warn(`   User1 socket (${user1.socketId.substring(0, 8)}...): ${socket1Exists}`)
          console.warn(`   User2 socket (${user2.socketId.substring(0, 8)}...): ${socket2Exists}`)

          // Try to remove invalid sockets from queue
          if (!socket1Exists) {
            await redis.zRem('matching_queue', firstTwoUsers[0])
            console.log(`✅ Removed disconnected user1 from queue`)
          }
          if (!socket2Exists) {
            await redis.zRem('matching_queue', firstTwoUsers[1])
            console.log(`✅ Removed disconnected user2 from queue`)
          }
        }
      } else {
        console.log(`⏳ [INSTANT-MATCH] Expected 2+ users but got ${firstTwoUsers?.length || 0}`)
        console.log(`   This might indicate a timing issue or users disconnecting`)
      }
    } else {
      console.log(`⏳ [INSTANT-MATCH] Queue has ${queueLen} users - need 2+ for match (cannot proceed)`)
    }
  } catch (error) {
    console.error('❌ Error triggering instant match:', error.message)
    console.error('   Stack:', error.stack)
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
    const queueLength = await redis.zCard('matching_queue')
    const queueEntries = await redis.zRange('matching_queue', 0, -1)
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
          profileCompleted: false,
          accepted_guidelines: false
        }
      })

      console.log('✅ New user created:', user.email)
      // Check if user is banned using Raw Query
      try {
        const rawUser = await prisma.$queryRaw`SELECT is_banned FROM users WHERE email = ${email}`;
        if (rawUser && rawUser.length > 0 && rawUser[0].is_banned) {
          console.error('❌ User login blocked - ACCOUNT_BANNED')
          return res.status(403).json({
            error: 'ACCOUNT_BANNED',
            message: 'Your account has been banned due to violations of our community guidelines.'
          })
        }
      } catch (err) {
        console.error("❌ Error checking ban status at login:", err);
      }

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
      { expiresIn: '365d' }
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
        profileCompleted: user.profileCompleted,
        is_banned: user.is_banned
      }
    })

  } catch (error) {
    console.error('❌ Firebase authentication error:', error)
    console.error('📍 Error details:', error.message)
    return res.status(500).json({ error: 'Authentication failed', details: error.message })
  }
})

// Internal Webhook for Admin Panel to kick banned users
app.post('/api/internal/kick-user', express.json(), async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    // Broadcast the ban event to all sockets connected as this user
    console.log(`🔌 [WEBHOOK] Broadcasting user_banned to room: ${userId}`)
    io.to(userId).emit('user_banned')

    // Find specific socket ID to forcefully disconnect it
    const socketId = onlineUsers.get(userId)
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId)
      if (socket) {
        console.log(`🔌 [WEBHOOK] Force disconnecting socket: ${socketId} for user ${userId}`)
        setTimeout(() => socket.disconnect(true), 1500)
      }
    }

    // Update online status in Redis if configured
    if (redis) {
      await redis.sRem('online_users', String(userId))
      await redis.sRem('online_males', String(userId))
      await redis.sRem('online_females', String(userId))
    }

    res.json({ success: true, socketFound: !!socketId })
  } catch (error) {
    console.error('❌ Error in /api/internal/kick-user:', error)
    res.status(500).json({ error: error.message })
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
// Handle preflight for TURN endpoints
app.options("/api/turn", cors(corsOptions));
app.options("/api/get-turn-credentials", cors(corsOptions));

// ===== EPHEMERAL TURN CREDENTIALS =====
// Generates time-limited HMAC-SHA1 credentials for coturn
// Requires coturn configured with: use-auth-secret + static-auth-secret
const TURN_SECRET = process.env.TURN_SECRET || 'test123';
const TURN_CREDENTIAL_TTL = parseInt(process.env.TURN_CREDENTIAL_TTL || '86400', 10); // 24h default
const TURN_SERVER_URLS = (process.env.TURN_URLS || 'turn:52.66.99.85:3478').split(',').map(u => u.trim());

function generateEphemeralTurnCredentials() {
  const unixExpiry = Math.floor(Date.now() / 1000) + TURN_CREDENTIAL_TTL;
  // coturn expects username format: "<unix-expiry>:<arbitrary-id>"
  const username = `${unixExpiry}:flinxx`;
  const hmac = crypto.createHmac('sha1', TURN_SECRET);
  hmac.update(username);
  const credential = hmac.digest('base64');
  return { username, credential, ttl: TURN_CREDENTIAL_TTL };
}

// ===== TURN CREDENTIALS ENDPOINT (POST) =====
app.post("/api/get-turn-credentials", async (req, res) => {
  try {
    const { username, credential, ttl } = generateEphemeralTurnCredentials();

    const iceServers = [
      { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
      { urls: "stun:stun.cloudflare.com:3478" },
      {
        urls: TURN_SERVER_URLS.flatMap(server => [
          `${server}?transport=udp`,
          `${server}?transport=tcp`
        ]),
        username,
        credential
      }
    ];

    console.log(`✅ [TURN CREDENTIALS] Generated ephemeral credentials for user: ${username}`);
    console.log(`   TURN URLs: ${JSON.stringify(iceServers[2].urls)}`);
    console.log(`   TTL: ${ttl}s`);

    res.json({ iceServers, ttl });
  } catch (err) {
    console.error("❌ [TURN CREDENTIALS] Error:", err.message);
    // STUN-only fallback — P2P will still work for most connections
    res.status(200).json({
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
        { urls: "stun:stun.cloudflare.com:3478" }
      ],
      ttl: 0
    });
  }
});

// ===== TURN ENDPOINT (GET version) =====
app.get("/api/turn", async (req, res) => {
  try {
    const { username, credential, ttl } = generateEphemeralTurnCredentials();

    const iceServers = [
      { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
      { urls: "stun:stun.cloudflare.com:3478" },
      {
        urls: TURN_SERVER_URLS.flatMap(server => [
          `${server}?transport=udp`,
          `${server}?transport=tcp`
        ]),
        username,
        credential
      }
    ];

    res.json({ iceServers, ttl });
  } catch (err) {
    console.error("❌ [TURN API] Error:", err.message);
    res.status(200).json({
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
        { urls: "stun:stun.cloudflare.com:3478" }
      ],
      ttl: 0
    });
  }
});

// ===== TURN CONNECTIVITY DEBUG ENDPOINT =====
app.get("/api/debug/turn-test", async (req, res) => {
  try {
    const { username, credential, ttl } = generateEphemeralTurnCredentials();
    const turnUrls = TURN_SERVER_URLS.flatMap(server => [
      `${server}?transport=udp`,
      `${server}?transport=tcp`
    ]);

    res.json({
      status: 'OK',
      turnConfig: {
        secret: TURN_SECRET ? '***SET***' : '***MISSING***',
        urls: turnUrls,
        credentialTTL: TURN_CREDENTIAL_TTL,
        generatedUsername: username,
        generatedCredential: credential.substring(0, 8) + '...',
      },
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] },
        { urls: turnUrls, username, credential }
      ],
      instructions: 'Test these credentials at https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
          termsAccepted: false,
          accepted_guidelines: false
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

// Accept Community Guidelines endpoint
// Get current authenticated user profile
app.get('/api/users/profile', verifyUserToken, async (req, res) => {
  try {
    console.log('[GET PROFILE] Fetching profile for user:', req.decoded?.id);

    const userId = req.decoded?.id;

    if (!userId) {
      console.error('[GET PROFILE] ❌ User ID not found in token');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error('[GET PROFILE] ❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('[GET PROFILE] ✅ User profile fetched:', user.email);

    res.json({
      uuid: user.id,
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
      termsAccepted: user.termsAccepted,
      accepted_guidelines: user.accepted_guidelines,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  } catch (error) {
    console.error('[GET PROFILE] ❌ Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
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
      termsAccepted: user.termsAccepted,
      accepted_guidelines: user.accepted_guidelines,
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
      termsAccepted: user.termsAccepted,
      accepted_guidelines: user.accepted_guidelines,
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
        gender: true,
        birthday: true,
        auth_provider: true,
        has_seen_premium_popup: true,
        created_at: true,
        updated_at: true,
        last_seen: true,
        is_premium: true,
        premium_expiry: true,
        has_unlimited_skip: true,
        unlimited_skip_expires_at: true,
        daily_skip_count: true,
        last_skip_reset_date: true
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

    // ✅ UNIFIED RESET: Use the global ensureDailySkipReset that writes to DB
    const resetUser = await ensureDailySkipReset(user);
    // Merge reset fields back
    if (resetUser) {
      user.daily_skip_count = resetUser.daily_skip_count;
      user.last_skip_reset_date = resetUser.last_skip_reset_date;
    }
    const computedSkipCount = user.daily_skip_count || 0;

    res.json({
      success: true,
      user: {
        id: user.public_id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        location: user.location || null,
        gender: user.gender,
        birthday: user.birthday,
        authProvider: user.auth_provider,
        hasSeenPremiumPopup: !!user.has_seen_premium_popup,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastSeen: user.last_seen,
        isPremium: !!(user.is_premium && (!user.premium_expiry || new Date(user.premium_expiry) > new Date())),
        hasUnlimitedSkip: !!(user.has_unlimited_skip && (!user.unlimited_skip_expires_at || new Date(user.unlimited_skip_expires_at) > new Date())),
        daily_skip_count: computedSkipCount,
        lastSkipResetDate: user.last_skip_reset_date
      }
    });
  } catch (error) {
    console.error('❌ [/api/user/profile] ERROR:', error.message);
    console.error('❌ [/api/user/profile] Full error:', error);
    console.error('❌ [/api/user/profile] ═══════════════════════════════════════════\n');
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

// Accept Community Guidelines endpoint
app.post('/api/user/accept-guidelines', verifyUserToken, async (req, res) => {
  try {
    const decoded = req.decoded;

    console.log('\n\n📋 ===== ACCEPT-GUIDELINES ENDPOINT CALLED =====');
    console.log('[ACCEPT GUIDELINES] User ID from token:', decoded?.id);

    if (!decoded?.id) {
      console.error('[ACCEPT GUIDELINES] ❌ VALIDATION ERROR: Missing user ID from token');
      return res.status(401).json({ error: 'Invalid or missing authentication token' });
    }

    // Find user
    console.log('[ACCEPT GUIDELINES] Finding user with id:', decoded.id);
    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      console.error('[ACCEPT GUIDELINES] ❌ User not found:', decoded.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('[ACCEPT GUIDELINES] ✓ User found:', user.email);
    console.log('[ACCEPT GUIDELINES] Current accepted_guidelines status:', user.accepted_guidelines);

    // Update accepted_guidelines to true
    console.log('[ACCEPT GUIDELINES] Setting accepted_guidelines to true...');
    const updatedUser = await prisma.users.update({
      where: { id: decoded.id },
      data: {
        accepted_guidelines: true
      }
    });

    console.log('[ACCEPT GUIDELINES] ✅ GUIDELINES ACCEPTED SUCCESSFULLY');
    console.log('[ACCEPT GUIDELINES] User email:', updatedUser.email);
    console.log('[ACCEPT GUIDELINES] Updated user data:', {
      id: updatedUser.id,
      email: updatedUser.email,
      accepted_guidelines: updatedUser.accepted_guidelines
    });

    res.json({
      success: true,
      message: 'Community guidelines accepted successfully',
      user: {
        uuid: updatedUser.id,
        email: updatedUser.email,
        accepted_guidelines: updatedUser.accepted_guidelines
      }
    });
  } catch (error) {
    console.error('[ACCEPT GUIDELINES] ❌ ERROR:', error.message);
    console.error('[ACCEPT GUIDELINES] Stack:', error.stack);
    res.status(500).json({ error: 'Failed to accept guidelines', details: error.message });
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
    const receiverUuid = receiver.id
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

      // Find both users to get their UUIDs for the socket lookup
      const [sender, receiver] = await Promise.all([
        prisma.users.findUnique({ where: { id: senderId } }),
        prisma.users.findUnique({ where: { id: receiverId } })
      ]);

      if (sender && receiver) {
        // Force emit to BOTH room and direct socket if found in onlineUsers
        const sSockId = onlineUsers.get(sender.id);
        const rSockId = onlineUsers.get(receiver.id);

        console.log(`[FRIEND_ACCEPT] senderId: ${sender.id}, room socket: ${sSockId ? 'found' : 'not found in map'}`);

        // Emit event to BOTH sender and receiver automatically via their UUID room
        io.to(sender.id).emit('friend_request_accepted', { senderId: sender.id, receiverId: receiver.id, requestId });
        io.to(receiver.id).emit('friend_request_accepted', { senderId: sender.id, receiverId: receiver.id, requestId });

        // Fallback: emit directly to socket.id if mapped
        if (sSockId) {
          console.log(`[FRIEND_ACCEPT] Direct emit to sender socket ${sSockId.substring(0, 8)}...`);
          io.to(sSockId).emit('friend_request_accepted', { senderId: sender.id, receiverId: receiver.id, requestId });
        }
        if (rSockId) {
          io.to(rSockId).emit('friend_request_accepted', { senderId: sender.id, receiverId: receiver.id, requestId });
        }

        console.log(`📨 Sent friend_request_accepted to sender ${sender.public_id} and receiver ${receiver.public_id}`);
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

// Submit user report
app.post('/api/report-user', authMiddleware, async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;
    const reporterId = req.user.id; // From authMiddleware (UUID string)

    if (!reportedUserId || !reason) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if report already exists
    const existing = await pool.query(
      `SELECT id FROM reports WHERE reporter_id = $1 AND reported_user_id = $2 LIMIT 1`,
      [reporterId, reportedUserId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already reported this user.' });
    }

    // Insert new report
    await pool.query(
      `INSERT INTO reports (reporter_id, reported_user_id, reason, status)
       VALUES ($1, $2, $3, 'pending')`,
      [reporterId, reportedUserId, reason]
    );

    console.log(`✅ User ${reporterId} reported user ${reportedUserId} for: ${reason}`);

    // Check if user has 5+ unique reports
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT reporter_id) as count FROM reports WHERE reported_user_id = $1`,
      [reportedUserId]
    );

    if (parseInt(countResult.rows[0].count) >= 5) {
      console.log(`🚨 Auto-Banning User ${reportedUserId} due to 5+ reports.`);

      // Update users table
      await pool.query(
        `UPDATE users SET is_banned = true WHERE id = $1`,
        [reportedUserId]
      );

      // Update all their pending reports to banned
      await pool.query(
        `UPDATE reports SET status = 'banned' WHERE reported_user_id = $1 AND status = 'pending'`,
        [reportedUserId]
      );
    }

    res.json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting report:', error);
    res.status(500).json({ success: false, message: 'Error submitting report', error: error.message });
  }
});

app.post('/api/block-user', authMiddleware, async (req, res) => {
  try {
    const { blockedUserId } = req.body;
    const blockerId = req.user.id;

    if (!blockedUserId) {
      return res.status(400).json({ success: false, message: 'Missing blockedUserId' });
    }

    // Insert into blocks table
    await pool.query(
      `INSERT INTO blocks (blocker_id, blocked_id)
       VALUES ($1, $2)
       ON CONFLICT (blocker_id, blocked_id) DO NOTHING`,
      [blockerId, blockedUserId]
    );

    console.log(`🚫 User ${blockerId} blocked user ${blockedUserId}`);
    res.json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    console.error('❌ Error blocking user:', error);
    res.status(500).json({ success: false, message: 'Error blocking user', error: error.message });
  }
});

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

    // ✅ Pass popup flag through to callback via state parameter
    const isPopup = req.query.popup === 'true'
    const stateData = JSON.stringify({ popup: isPopup })
    const stateEncoded = Buffer.from(stateData).toString('base64')

    console.log(`🔗 [/auth/google] Google OAuth initiated with redirect_uri: ${redirectUri}, popup: ${isPopup}`)
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent',
      state: stateEncoded
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
    }, process.env.JWT_SECRET, { expiresIn: '365d' });

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
        picture: user.photo_url,
        birthday: user.birthday,
        gender: user.gender
      }
    }

    // Encode response data in URL
    const encodedResponse = encodeURIComponent(JSON.stringify(responseData))

    // Redirect to frontend with token and response data
    const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3003'

    // ✅ SIMPLE APPROACH: Just pass token in URL
    const tokenParam = encodeURIComponent(token);

    // ✅ REDIRECT TO OAUTH-SUCCESS PAGE WITH TOKEN
    console.log(`✅ [AUTH/GOOGLE/CALLBACK] Redirecting to /oauth-handler with token`)

    // Set token as secure httpOnly cookie and redirect
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // ✅ Check if this was a popup request (via state parameter)
    let isPopup = false
    try {
      const stateParam = req.query.state
      if (stateParam) {
        const stateData = JSON.parse(Buffer.from(stateParam, 'base64').toString())
        isPopup = stateData.popup === true
      }
    } catch (e) {
      console.warn('⚠️ Could not parse state parameter:', e.message)
    }

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3003'
    const userEncoded = encodeURIComponent(JSON.stringify(responseData.user))
    const tokenEncoded = encodeURIComponent(token)

    console.log('🔍 [AUTH/GOOGLE/CALLBACK] Auth complete:')
    console.log('   - FRONTEND_URL:', frontendUrl)
    console.log('   - isPopup:', isPopup)

    // ✅ Always redirect to frontend /oauth-handler - it handles both popup and normal mode
    const popupParam = isPopup ? '&popup=true' : ''
    console.log(`✅ [AUTH/GOOGLE/CALLBACK] Redirecting to /oauth-handler (popup=${isPopup})`)
    res.redirect(`${frontendUrl}/oauth-handler?token=${tokenEncoded}&user=${userEncoded}${popupParam}`)
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
    let user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        display_name: true,
        photo_url: true,
        location: true,
        birthday: true,
        gender: true,
        profileCompleted: true,
        termsAccepted: true,
        daily_skip_count: true,
        last_skip_reset_date: true
      }
    })

    if (user) {
      user = await ensureDailySkipReset(user);
    }

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
        birthday: user.birthday,
        gender: user.gender,
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

    // ✅ Pass popup flag through to callback via state parameter
    const isPopup = req.query.popup === 'true'
    const stateData = JSON.stringify({ popup: isPopup })
    const stateEncoded = Buffer.from(stateData).toString('base64')

    console.log('🔗 [/auth/facebook] Facebook OAuth Configuration:')
    console.log('   - FACEBOOK_CALLBACK_URL env:', process.env.FACEBOOK_CALLBACK_URL)
    console.log('   - NODE_ENV:', process.env.NODE_ENV)
    console.log('   - popup:', isPopup)
    console.log(`🔗 [/auth/facebook] Facebook OAuth initiated with callback_url: ${callbackUrl}`)

    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      redirect_uri: callbackUrl,
      scope: 'public_profile,email',
      response_type: 'code',
      state: stateEncoded
    })

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
    console.log(`🔗 [/auth/facebook] Redirecting to Facebook consent screen`)
    res.redirect(authUrl)
  } catch (error) {
    console.error('❌ [/auth/facebook] Error in /auth/facebook:', error)
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
    }, process.env.JWT_SECRET, { expiresIn: '365d' });

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
        picture: user.photo_url,
        birthday: user.birthday,
        gender: user.gender
      }
    }

    // Encode response data in URL
    const encodedResponse = encodeURIComponent(JSON.stringify(responseData))

    // Redirect to frontend with token
    const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3003'

    // ✅ SIMPLE APPROACH: Just pass token in URL
    const tokenParam = encodeURIComponent(token);

    // 🔍 DEBUG: Log which URL is being used
    console.log('🔍 [AUTH/FACEBOOK/CALLBACK] Redirecting to frontend:')
    console.log('   - FRONTEND_URL env:', process.env.FRONTEND_URL)
    console.log('   - CLIENT_URL env:', process.env.CLIENT_URL)
    console.log('   - Using URL:', baseUrl)

    // Set token as secure httpOnly cookie
    res.cookie('authToken', tokenParam, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // ✅ Check if this was a popup request (via state parameter)
    let isPopup = false
    try {
      const stateParam = req.query.state
      if (stateParam) {
        const stateData = JSON.parse(Buffer.from(stateParam, 'base64').toString())
        isPopup = stateData.popup === true
      }
    } catch (e) {
      console.warn('⚠️ Could not parse Facebook state parameter:', e.message)
    }

    const userEncoded = encodeURIComponent(JSON.stringify(responseData.user))

    console.log('🔍 [AUTH/FACEBOOK/CALLBACK] Auth complete:')
    console.log('   - isPopup:', isPopup)

    // ✅ Always redirect to frontend /oauth-handler - it handles both popup and normal mode
    const popupParam = isPopup ? '&popup=true' : ''
    console.log(`✅ [AUTH/FACEBOOK/CALLBACK] Redirecting to /oauth-handler (popup=${isPopup})`)
    res.redirect(`${baseUrl}/oauth-handler?token=${tokenParam}&user=${userEncoded}${popupParam}`)
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
    console.log('[PROFILE API] Headers debug:', {
      authorizationPresent: !!authHeader,
      authorizationPrefix: authHeader ? authHeader.slice(0, 12) : null,
      cookiePresent: !!req.headers.cookie
    })

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[PROFILE API] ❌ Missing or invalid Bearer token')
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid authorization header'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    console.log('[PROFILE API] Token received, trying Firebase verification first...')

    // Premium/skip logic depends on DB state, so we MUST reliably resolve the user from the token.
    // Frontend sends Firebase ID token in `Authorization: Bearer <idToken>`.
    const userSelect = {
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
      has_seen_premium_popup: true,
      created_at: true,
      updated_at: true,
      is_premium: true,
      premium_expiry: true,
      has_unlimited_skip: true,
      unlimited_skip_expires_at: true,
      daily_skip_count: true,
      last_skip_reset_date: true
    }

    let user = null
    let authType = 'unknown'
    let decodedFirebase = null
    let decodedJwt = null

    // 1) Firebase token path
    decodedFirebase = await verifyFirebaseToken(token)
    if (decodedFirebase?.uid) {
      authType = 'firebase'
      const googleIdUsed = decodedFirebase.uid
      console.log('[PROFILE API] ✅ Firebase token verified', {
        google_id: googleIdUsed,
        email: decodedFirebase.email
      })

      console.log(`[PROFILE API] Fetching user by google_id: ${googleIdUsed}`)
      user = await prisma.users.findFirst({
        where: { google_id: googleIdUsed },
        select: userSelect
      })

      if (!user) {
        console.log(`[PROFILE API] User not found by google_id, trying provider_id fallback: ${googleIdUsed}`)
        user = await prisma.users.findFirst({
          where: { provider_id: googleIdUsed },
          select: userSelect
        })
      }
    } else {
      console.log('[PROFILE API] Firebase verification failed/null. Trying JWT verification...')
      // 2) JWT token path (legacy/other flows)
      try {
        decodedJwt = jwt.verify(token, process.env.JWT_SECRET)
        authType = 'jwt'
        const userId = decodedJwt.userId || decodedJwt.id
        console.log('[PROFILE API] ✅ JWT token verified', { userId })

        user = await prisma.users.findUnique({
          where: { id: userId },
          select: userSelect
        })
      } catch (jwtErr) {
        console.log('[PROFILE API] ❌ JWT token invalid:', jwtErr.message)
        return res.status(400).json({ success: false, error: 'Invalid token' })
      }
    }

    console.log('[PROFILE API] User fetch result:', user ? 'FOUND' : 'NOT FOUND', {
      authType,
      has_unlimited_skip: user?.has_unlimited_skip,
      unlimited_skip_expires_at: user?.unlimited_skip_expires_at
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found in database'
      })
    }

    // ✅ AUTO-DETERMINE profileCompleted
    let profileCompleted = user.profileCompleted === true
    if (!profileCompleted && user.birthday && user.gender) {
      profileCompleted = true
    }

    // ✅ PRODUCTION-SAFE PREMIUM LOGIC
    const isPremium = user.has_unlimited_skip === true && (
      !user.unlimited_skip_expires_at ||
      new Date(user.unlimited_skip_expires_at).getTime() > Date.now()
    );

    // ==========================================
    // ✅ LOGICAL DAY RESET CHECK FOR PROFILE API
    // ==========================================
    user = await ensureDailySkipReset(user);
    const skipCount = user.daily_skip_count || 0;

    console.log(`[PROFILE FINAL] userId: ${user.id}, isPremium: ${isPremium}, skipCount: ${skipCount} (DB: ${user.daily_skip_count || 0})`)

    return res.json({
      success: true,
      user: {
        uuid: user.id,
        id: user.id,
        isPremium: isPremium,
        has_unlimited_skip: user.has_unlimited_skip || false,
        unlimited_skip_expires_at: user.unlimited_skip_expires_at || null,
        daily_skip_count: skipCount,

        // Essential profile fields
        publicId: user.public_id,
        public_id: user.public_id,
        email: user.email,
        name: user.display_name,
        picture: user.photo_url,
        gender: user.gender,
        birthday: user.birthday,
        location: user.location || null,
        profileCompleted: profileCompleted,
        authProvider: user.auth_provider,
        hasBlueTick: !!(user.has_blue_tick && user.blue_tick_expires_at && new Date(user.blue_tick_expires_at) > new Date()),
        hasSeenPremiumPopup: !!user.has_seen_premium_popup,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        last_skip_reset_date: user.last_skip_reset_date
      }
    })
  } catch (error) {
    console.error('[PROFILE API] CRITICAL ERROR:', error.message)
    // Return 400 for token errors, 500 only for unexpected failures
    const status = (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') ? 400 : 500
    return res.status(status).json({
      success: false,
      error: 'Profile fetch failed',
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

// ✅ MARK PREMIUM POPUP AS SEEN
app.post('/api/users/premium-popup-seen', async (req, res) => {
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
    console.log(`🛡️ [PREMIUM POPUP API] Marking popup as seen for user ${userId}`);

    await prisma.users.update({
      where: { id: userId },
      data: { has_seen_premium_popup: true }
    });

    console.log(`🛡️ [PREMIUM POPUP API] ✅ Status updated successfully`);
    res.json({ success: true });
  } catch (error) {
    console.error('🛡️ [PREMIUM POPUP API] ❌ Error:', error.message);
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
      SELECT id, sender_id, receiver_id, message, message_type, created_at, is_deleted, reply_to_id, deleted_for
      FROM messages
      WHERE
        (sender_id = $1 AND receiver_id = $2)
        OR
        (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
      `,
      [user1, user2]
    );

    // Filter: hide messages deleted_for this user, replace content for is_deleted
    const rows = result.rows
      .filter(row => !(row.deleted_for && row.deleted_for.includes(user1)))
      .map(row => ({
        ...row,
        message: row.is_deleted ? 'This message was deleted' : row.message
      }));

    res.json(rows);
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
  }).catch(err => {
    console.error('❌ [CONNECTION] Error checking queue:', err.message)
    // Continue anyway - don't let queue check crash connection
  })

  // ✅ REGISTER USER (when user comes online)
  socket.on('register_user', async (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id)
      // ✅ JOIN SOCKET TO ROOM WITH USER UUID (CRITICAL for io.to(uuid).emit())
      socket.join(userId)

      // ✅ Store userId on socket for disconnect cleanup
      socket.userId = userId

      console.log(`\n✅ [REGISTER_USER] User registered successfully`)
      console.log(`   User UUID: ${userId.substring(0, 8)}...`)
      console.log(`   Socket ID: ${socket.id.substring(0, 8)}...`)
      console.log(`   Joined room: ${userId.substring(0, 8)}...`)
      console.log(`   Socket rooms: ${JSON.stringify(Array.from(socket.rooms)?.map(r => r.substring(0, 8) + '...'))}`)
      console.log(`👥 [ONLINE USERS] Total connected: ${onlineUsers.size}`)
      console.log(`   UUIDs: ${Array.from(onlineUsers.keys()).map(k => k.substring(0, 8) + '...').join(', ')}`)
      console.log()

      // ✅ REDIS: Track active user by gender (online_males / online_females)
      try {
        const userRecord = await prisma.users.findUnique({
          where: { id: userId },
          select: { gender: true }
        })
        const gender = userRecord?.gender?.toLowerCase() || null
        socket.userGender = gender // Store on socket for disconnect cleanup

        // Add to active_users set
        await redis.sAdd('active_users', userId)

        // Add to gender-specific set
        if (gender === 'male') {
          await redis.sAdd('online_males', userId)
          console.log(`👤 [REDIS] Added ${userId.substring(0, 8)}... to online_males`)
        } else if (gender === 'female') {
          await redis.sAdd('online_females', userId)
          console.log(`👤 [REDIS] Added ${userId.substring(0, 8)}... to online_females`)
        }

        // Set heartbeat key with 30s TTL
        await redis.setEx(`heartbeat:${userId}`, 30, '1')

        const maleCount = await redis.sCard('online_males')
        const femaleCount = await redis.sCard('online_females')
        const activeCount = await redis.sCard('active_users')
        console.log(`📊 [REDIS] Active: ${activeCount} | Males: ${maleCount} | Females: ${femaleCount}`)
      } catch (err) {
        console.error('❌ [REDIS] Error tracking active user:', err.message)
      }

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

  // ✅ HANDLE SOCKET ERRORS
  socket.on('error', (error) => {
    console.error(`🚨 [SOCKET_ERROR] Socket ${socket.id.substring(0, 8)}... encountered error:`, error.message)
    console.error('   Error stack:', error.stack)
  })

  socket.on('connect_error', (error) => {
    console.error(`🚨 [CONNECT_ERROR] Socket connection error:`, error.message)
    console.error('   Error data:', error)
  })

  // ✅ HEARTBEAT - Frontend sends this every 20s to keep user alive in Redis
  // Also auto-registers user in Redis sets if not already present (fallback for missed register_user)
  socket.on('heartbeat', async (data) => {
    const userId = socket.userId || data?.userId
    if (userId) {
      try {
        await redis.setEx(`heartbeat:${userId}`, 30, '1')

        // Auto-register in Redis if not already tracked
        const isTracked = await redis.sIsMember('active_users', userId)
        if (!isTracked) {
          console.log(`🔄 [HEARTBEAT] Auto-registering user ${userId.substring(0, 8)}... (missed register_user)`)

          // Store userId on socket
          socket.userId = userId
          onlineUsers.set(userId, socket.id)
          socket.join(userId)

          // Add to active_users
          await redis.sAdd('active_users', userId)

          // Fetch gender and add to gender set
          try {
            const userRecord = await prisma.users.findUnique({
              where: { id: userId },
              select: { gender: true }
            })
            const gender = userRecord?.gender?.toLowerCase() || null
            socket.userGender = gender

            if (gender === 'male') {
              await redis.sAdd('online_males', userId)
              console.log(`👤 [HEARTBEAT] Added ${userId.substring(0, 8)}... to online_males`)
            } else if (gender === 'female') {
              await redis.sAdd('online_females', userId)
              console.log(`👤 [HEARTBEAT] Added ${userId.substring(0, 8)}... to online_females`)
            }
          } catch (dbErr) {
            console.error('❌ [HEARTBEAT] Error fetching gender:', dbErr.message)
          }

          const maleCount = await redis.sCard('online_males')
          const femaleCount = await redis.sCard('online_females')
          const activeCount = await redis.sCard('active_users')
          console.log(`📊 [HEARTBEAT] Active: ${activeCount} | Males: ${maleCount} | Females: ${femaleCount}`)
        }
      } catch (err) {
        // Silent - heartbeat failures should not spam logs
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

        // ✅ REDIS: Remove from active user sets
        try {
          await redis.sRem('active_users', userId)

          const gender = socket.userGender
          if (gender === 'male') {
            await redis.sRem('online_males', userId)
            console.log(`👤 [REDIS] Removed ${userId.substring(0, 8)}... from online_males`)
          } else if (gender === 'female') {
            await redis.sRem('online_females', userId)
            console.log(`👤 [REDIS] Removed ${userId.substring(0, 8)}... from online_females`)
          } else {
            // Safety: remove from both sets if gender unknown
            await redis.sRem('online_males', userId)
            await redis.sRem('online_females', userId)
            console.log(`👤 [REDIS] Removed ${userId.substring(0, 8)}... from both gender sets (gender unknown)`)
          }

          // Delete heartbeat key
          await redis.del(`heartbeat:${userId}`)

          const maleCount = await redis.sCard('online_males')
          const femaleCount = await redis.sCard('online_females')
          const activeCount = await redis.sCard('active_users')
          console.log(`📊 [REDIS] After disconnect - Active: ${activeCount} | Males: ${maleCount} | Females: ${femaleCount}`)
        } catch (err) {
          console.error('❌ [REDIS] Error removing active user on disconnect:', err.message)
        }

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

  // ✅ CALL NO ANSWER - Save TWO messages: missed_call for receiver, outgoing_call for caller
  socket.on('call_no_answer', async (data) => {
    const { callerId, receiverId, callerName } = data

    console.log('\n' + '='.repeat(80))
    console.log('📵 [CALL_NO_ANSWER] ====== SAVING CALL MESSAGES TO DB ======')
    console.log('='.repeat(80))
    console.log('📵 Caller ID:', callerId?.substring(0, 8) + '...')
    console.log('📵 Receiver ID:', receiverId?.substring(0, 8) + '...')
    console.log('📵 Caller Name:', callerName)
    console.log('='.repeat(80))

    if (!callerId || !receiverId) {
      console.warn('❌ [CALL_NO_ANSWER] Missing callerId or receiverId')
      return
    }

    try {
      // ✅ DEDUP CHECK: Don't insert if call messages already exist in last 30 seconds
      const dupeCheck = await pool.query(
        `SELECT id FROM messages 
         WHERE sender_id = $1 AND receiver_id = $2 
         AND message_type IN ('missed_call', 'outgoing_call')
         AND created_at > NOW() - INTERVAL '30 seconds'
         LIMIT 1`,
        [callerId, receiverId]
      )

      if (dupeCheck.rows.length > 0) {
        console.log('⚠️ [CALL_NO_ANSWER] Duplicate call messages detected within 30s - skipping')
      } else {
        // ✅ MESSAGE 1: "Missed call" for RECEIVER (sender_id = caller, receiver_id = receiver)
        await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, message, message_type, is_read)
           VALUES ($1, $2, $3, $4, false)`,
          [callerId, receiverId, 'Missed call', 'missed_call']
        )
        console.log('✅ [CALL_NO_ANSWER] Missed call message saved (for receiver)')

        // ✅ MESSAGE 2: "Video call" for CALLER (sender_id = caller, receiver_id = receiver)
        await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, message, message_type, is_read)
           VALUES ($1, $2, $3, $4, true)`,
          [callerId, receiverId, 'Video call', 'outgoing_call']
        )
        console.log('✅ [CALL_NO_ANSWER] Outgoing call message saved (for caller)')
      }

      // ✅ Emit targeted real-time events so each user sees the correct bubble
      const roomId = callerId < receiverId
        ? `${callerId}_${receiverId}`
        : `${receiverId}_${callerId}`

      // Emit missed_call to RECEIVER only
      io.to(receiverId).emit('receive_message', {
        senderId: callerId,
        message: 'Missed call',
        message_type: 'missed_call'
      })

      // Emit outgoing_call to CALLER only
      io.to(callerId).emit('receive_message', {
        senderId: callerId,
        message: 'Video call',
        message_type: 'outgoing_call'
      })

      console.log('✅ [CALL_NO_ANSWER] Targeted call notifications emitted')
    } catch (err) {
      console.error('❌ [CALL_NO_ANSWER] Error saving call messages:', err.message)
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

  // ✅ TYPING INDICATOR - Relay typing status to partner in shared room
  socket.on('typing', (data) => {
    const { senderId, receiverId } = data
    if (!senderId || !receiverId) return
    const roomId = senderId < receiverId
      ? `${senderId}_${receiverId}`
      : `${receiverId}_${senderId}`
    socket.to(roomId).emit('typing', { senderId })
  })

  socket.on('stop_typing', (data) => {
    const { senderId, receiverId } = data
    if (!senderId || !receiverId) return
    const roomId = senderId < receiverId
      ? `${senderId}_${receiverId}`
      : `${receiverId}_${senderId}`
    socket.to(roomId).emit('stop_typing', { senderId })
  })

  // ✅ SEND MESSAGE (friend DM to shared room)
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message, to, replyToId } = data

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

      // 1. Save message to database (with optional reply_to_id)
      const insertResult = await pool.query(
        `
        INSERT INTO messages (sender_id, receiver_id, message, is_read, reply_to_id)
        VALUES ($1, $2, $3, false, $4)
        RETURNING id
        `,
        [senderId, receiverId, message, replyToId || null]
      )

      const messageId = insertResult.rows[0]?.id

      console.log(`💬 Message sent with is_read = false: ${senderId} → ${receiverId} (id: ${messageId})`)

      // 2. If this is a reply, fetch the original message text for preview
      let replyPreview = null
      if (replyToId) {
        const replyResult = await pool.query(
          `SELECT message, sender_id FROM messages WHERE id = $1`,
          [replyToId]
        )
        if (replyResult.rows[0]) {
          replyPreview = {
            id: replyToId,
            text: replyResult.rows[0].message,
            senderId: replyResult.rows[0].sender_id
          }
        }
      }

      // 3. Send message to BOTH users in shared room
      io.to(roomId).emit('receive_message', {
        id: messageId,
        senderId,
        message,
        replyToId: replyToId || null,
        replyPreview
      })

      console.log(`📨 Message delivered to shared room: ${roomId}`)
    } catch (err) {
      console.error('❌ Message send error:', err)
      socket.emit('message_error', { error: 'Failed to send message' })
    }
  })

  // ✅ DELETE FOR EVERYONE (sender deletes → both sides see "This message was deleted")
  socket.on('delete_for_everyone', async (data) => {
    const { messageId, senderId, receiverId } = data

    if (!messageId || !senderId) {
      console.warn('❌ Missing delete_for_everyone data:', { messageId, senderId })
      return
    }

    try {
      // Only the sender can delete for everyone
      const result = await pool.query(
        `UPDATE messages SET is_deleted = true WHERE id = $1 AND sender_id = $2 RETURNING id, sender_id, receiver_id`,
        [messageId, senderId]
      )

      if (result.rows.length === 0) {
        console.warn('❌ Message not found or not sender:', messageId)
        socket.emit('message_error', { error: 'Cannot delete this message' })
        return
      }

      const msg = result.rows[0]
      console.log(`🗑️ [DELETE FOR EVERYONE] Message ${messageId} deleted by sender ${senderId}`)

      // Build room ID
      const roomId = msg.sender_id < msg.receiver_id
        ? `${msg.sender_id}_${msg.receiver_id}`
        : `${msg.receiver_id}_${msg.sender_id}`

      // Notify BOTH users → show "This message was deleted"
      const payload = { messageId, type: 'everyone' }
      io.to(roomId).emit('message_deleted', payload)
      io.to(msg.sender_id).emit('message_deleted', payload)
      io.to(msg.receiver_id).emit('message_deleted', payload)

      console.log(`🗑️ Delete-for-everyone notification sent to room: ${roomId}`)
    } catch (err) {
      console.error('❌ Delete for everyone error:', err)
      socket.emit('message_error', { error: 'Failed to delete message' })
    }
  })

  // ✅ DELETE FOR ME (receiver deletes → only hides from their side)
  socket.on('delete_for_me', async (data) => {
    const { messageId, userId } = data

    if (!messageId || !userId) {
      console.warn('❌ Missing delete_for_me data:', { messageId, userId })
      return
    }

    try {
      // Add userId to deleted_for array
      const result = await pool.query(
        `UPDATE messages SET deleted_for = array_append(deleted_for, $2) WHERE id = $1 AND NOT ($2 = ANY(deleted_for)) RETURNING id`,
        [messageId, userId]
      )

      if (result.rows.length === 0) {
        console.warn('❌ Message not found or already deleted for user:', messageId)
        return
      }

      console.log(`🗑️ [DELETE FOR ME] Message ${messageId} hidden for user ${userId}`)

      // Only notify THIS user → remove from their UI
      socket.emit('message_deleted_for_me', { messageId })

    } catch (err) {
      console.error('❌ Delete for me error:', err)
      socket.emit('message_error', { error: 'Failed to delete message' })
    }
  })

  // Handle finding partner
  socket.on('find_partner', async (userData) => {
    try {
      console.log('\n\n═══════════════════════════════════════════════════════════════');
      console.log('🔍 [find_partner] EVENT FIRED - STARTING MATCH LOGIC');
      console.log('═══════════════════════════════════════════════════════════════');

      // LOG INCOMING DATA IMMEDIATELY
      console.log('📥 [find_partner] RECEIVED RAW DATA:');
      console.log('   Type:', typeof userData);
      console.log('   Is null/undefined?', userData == null);
      console.log('   Keys:', userData ? Object.keys(userData) : 'N/A');
      console.log('   Full data:', JSON.stringify(userData, null, 2));

      console.log(`🔌 [find_partner] Current socket.id: ${socket.id}`)
      console.log(`🔌 [find_partner] Socket connected: ${socket.connected}`)
      console.log(`📊 [find_partner] Total active sockets: ${io.engine.clientsCount}`)

      // CRITICAL: Get userId from frontend data (NOT generate new UUID)
      const userId = userData?.userId
      console.log(`🔑 [find_partner] userId extracted: "${userId}" (type: ${typeof userId})`)

      if (!userId) {
        console.error('❌ [find_partner] No userId provided by frontend')
        socket.emit('error', 'UserId is required')
        return
      }

      // Store the mapping: socket.id -> userId (from frontend)
      userSockets.set(socket.id, userId)
      console.log(`✅ [find_partner] Stored mapping - socket ${socket.id.substring(0, 8)}... → user ${userId}`)

      // ✅ Run explicit global global reset check on "Start video chat click"
      try {
        let dbUser = await prisma.users.findUnique({ where: { id: userId } });
        if (dbUser) {
          await ensureDailySkipReset(dbUser);
        }
      } catch (err) {
        console.error('⚠️ [find_partner] Error during ensureDailySkipReset:', err.message);
      }

      // 🛑 STRICT BACKEND VALIDATION FOR START VIDEO CHAT (limit check)
      try {
        const limitCheck = await validateSkipLimit({
          userId,
          prisma,
          redis,
          increment: false,
          source: 'find_partner_backend'
        });

        if (!limitCheck.canSkip) {
          console.warn(`[find_partner] 🚫 Hard block! User ${userId} hit skip limit. Emitting skip_limit_reached to socket.`);

          if (socket.connected) {
            socket.emit('skip_limit_reached', {
              limit: limitCheck.limit,
              skipCount: limitCheck.skipCount,
              reason: limitCheck.reason
            });
            // Don't just emit error, this is a business logic block
          }
          return; // STOP EXECUTION HERE! NO QUEUE ENTRY!
        }
      } catch (limitErr) {
        console.error(`[find_partner] ⚠️ limit check failed, proceeding anyway for stability:`, limitErr.message);
      }

      // ✅ CLEANUP: Remove stale activeChats entry if user is reconnecting
      // This handles cases where a previous connection left a stale entry
      if (activeChats.has(userId)) {
        console.log(`🧹 [find_partner] CLEANUP: User ${userId} had stale activeChats entry - removing it`)
        console.log(`   This can happen when:`)
        console.log(`   1. Browser tab was closed without proper disconnect`)
        console.log(`   2. Network connection was lost abruptly`)
        console.log(`   3. Previous socket cleanup didn't fully complete`)
        activeChats.delete(userId)
        console.log(`   ✅ Stale entry removed - user can now search for partner`)
      }

      // ✅ CRITICAL: Always use DB location + userName (most up-to-date from IP detection and DB)
      try {
        const dbUser = await prisma.users.findUnique({ where: { id: userId }, select: { location: true, display_name: true, age: true, profile_picture_url: true } });

        // ✅ Enrich userName from database display_name
        if (dbUser?.display_name && (!userData.userName || userData.userName === 'Anonymous')) {
          console.log(`📝 [find_partner] Enriching userName from DB: ${dbUser.display_name} (frontend sent: ${userData.userName})`);
          userData.userName = dbUser.display_name;
        }

        // ✅ Enrich other fields from database
        if (dbUser?.age && (!userData.userAge || userData.userAge === 18)) {
          userData.userAge = dbUser.age;
        }
        if (dbUser?.profile_picture_url && !userData.userPicture) {
          userData.userPicture = dbUser.profile_picture_url;
        }

        // ✅ LOCATION PRIORITY:
        // 1. Frontend-detected location (from user's actual device IP via ipapi.co) — MOST ACCURATE
        // 2. DB saved location (may be stale)
        // 3. Server-side IP detection (uses x-forwarded-for header)
        
        const frontendLocation = userData.userLocation;
        const hasValidFrontendLocation = frontendLocation && 
          frontendLocation !== 'Unknown' && 
          frontendLocation.includes(','); // Valid format: "City, Region"
        
        if (hasValidFrontendLocation) {
          // Frontend already detected a valid city,region — use it and update DB
          console.log(`📍 [find_partner] Using frontend-detected location: ${frontendLocation}`);
          userData.userLocation = frontendLocation;
          // Update DB with this fresh location
          try {
            await prisma.users.update({ where: { id: userId }, data: { location: frontendLocation } });
            console.log(`📍 [find_partner] ✅ DB updated with frontend location: ${frontendLocation}`);
          } catch (dbUpdateErr) {
            console.warn(`📍 [find_partner] DB update failed:`, dbUpdateErr.message);
          }
        } else if (dbUser?.location && dbUser.location !== 'Unknown' && dbUser.location.includes(',')) {
          // Frontend didn't detect — use DB saved location
          console.log(`📍 [find_partner] Using DB location: ${dbUser.location} (frontend sent: ${frontendLocation})`);
          userData.userLocation = dbUser.location;
        } else {
          // Last resort: Server-side IP detection using user's real IP from x-forwarded-for
          console.log(`📍 [find_partner] No valid location available, trying server-side IP detection...`);
          try {
            const clientIP = socket.handshake.headers['x-forwarded-for']?.split(',')[0]?.trim() || socket.handshake.address;
            console.log(`📍 [find_partner] Client IP from headers: ${clientIP}`);
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

      const userConnectionScore = userData?.connectionScore !== undefined ? userData.connectionScore : 100;

      // ✅ HARD BLOCK RULE: Very poor connections wait intentionally before queue entry
      if (userConnectionScore < 20) {
        console.log(`⚠️ [find_partner] Very poor connection score (${userConnectionScore}). Enforcing Hard Block Rule (4s delay).`);
        await new Promise(resolve => setTimeout(resolve, 4000));
      }

      // Log queue state BEFORE processing
      console.log('\n📊 [find_partner] QUEUE STATE AT START...');
      let queueLenBefore;
      let queueEntriesBefore;

      try {
        console.log('   ℹ️ Calling getQueueLength()...');
        queueLenBefore = await getQueueLength()
        console.log(`   ✅ Got queue length: ${queueLenBefore}`);
      } catch (queueErr) {
        console.error('   ❌ Error getting queue length:', queueErr.message);
        queueLenBefore = 0;
      }

      try {
        console.log('   ℹ️ Calling redis.zRange()...');
        queueEntriesBefore = await redis.zRange('matching_queue', 0, -1)
        console.log(`   ✅ Got queue entries: ${queueEntriesBefore.length} items`);
      } catch (rangeErr) {
        console.error('   ❌ Error getting queue entries:', rangeErr.message);
        queueEntriesBefore = [];
      }

      console.log(`📊 [find_partner] QUEUE STATE BEFORE PROCESSING`)
      console.log(`   Total users in queue: ${queueLenBefore}`)
      console.log(`   Total users in activeChats: ${activeChats.size}`)
      console.log(`🔐 [find_partner] Users in activeChats:`, Array.from(activeChats))
      for (let i = 0; i < queueEntriesBefore.length; i++) {
        try {
          const parsed = JSON.parse(queueEntriesBefore[i])
          const inActiveChat = activeChats.has(parsed.userId) ? '⚠️ ALREADY IN CHAT' : '✓'
          console.log(`   [${i}] User ${parsed.userId} ${inActiveChat} - Socket ${parsed.socketId.substring(0, 8)}...`)
        } catch (parseErr) {
          console.error(`   ❌ [${i}] Failed to parse queue entry:`, parseErr.message)
        }
      }

      console.log(`\n👤 [find_partner] User ${userId} looking for partner`)
      console.log(`   userName: ${userData?.userName || 'Anonymous'}`)

      // ✅ CRITICAL: Check if user is already in activeChats - if so, they shouldn't be here!
      const userAlreadyInChat = activeChats.has(userId)
      console.log(`\n🔐 [find_partner] CRITICAL PRE-CHECK:`)
      console.log(`   Is user ${userId} already in activeChats? ${userAlreadyInChat}`)
      console.log(`   Total users in activeChats: ${activeChats.size}`)
      console.log(`   Current activeChats:`, Array.from(activeChats))

      if (userAlreadyInChat) {
        console.error(`❌ [find_partner] ERROR: User is already in an active chat!`)
        console.error(`   They should NOT be calling find_partner`)
        console.error(`   Aborting to prevent duplicate matching`)
        socket.emit('error', { message: 'You are already in an active chat' })
        return
      }

      // ✅ VERIFY USER IS NOT INCORRECTLY IN activeChats
      const isInActiveChats = activeChats.has(userId)
      console.log(`\n🔐 [find_partner] activeChats status:`)
      console.log(`   Is ${userId} in activeChats? ${isInActiveChats}`)
      console.log(`   Total users in activeChats: ${activeChats.size}`)
      if (isInActiveChats) {
        console.warn(`⚠️  [find_partner] WARNING: User is in activeChats! They should not be looking for a partner!`)
        console.warn(`   This might indicate a previous call didn't cleanup properly`)
      }

      // Set user as online in Redis
      console.log(`\n🔵 [find_partner] SETTING USER ONLINE...`);
      try {
        await setUserOnline(userId, socket.id)
        console.log(`   ✅ User set as online in Redis`);
      } catch (onlineErr) {
        console.error(`   ❌ Error setting user online:`, onlineErr.message);
        console.error(`       But continuing anyway...`);
      }

      // ✅ USE OPTIMIZED QUEUE RETRIEVAL WITH COOLDOWN FILTERING
      console.log(`\n🎯 [find_partner] ATTEMPTING TO GET NEXT FROM QUEUE...`);
      let waitingUser;
      try {
        waitingUser = await getNextFromQueueOptimized(userId, userConnectionScore)
        console.log(`   ✅ Got next from queue:`, waitingUser ? 'MATCH FOUND' : 'No match');
      } catch (queueErr) {
        console.error(`   ❌ Error getting next from queue:`, queueErr.message);
        throw queueErr; // Re-throw so it's caught by main catch
      }

      if (waitingUser) {
        console.log(`\n🎯 [find_partner] 🎯 MATCH FOUND! 🎯`)
        console.log(`═════════════════════════════════════════════`)
        console.log(`   Current user: ${userId} (socket ${socket.id.substring(0, 8)}...)`)
        console.log(`   Partner user: ${waitingUser.userId} (socket ${waitingUser.socketId.substring(0, 8)}...)`)
        console.log(`   This user was RETRIEVED from queue (not adding current user to queue)`)
        console.log(`═════════════════════════════════════════════`)

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
          try {
            await addToMatchingQueue(userId, socket.id, userData)
            console.log(`   ✅ User re-added to queue`);
          } catch (readdErr) {
            console.error(`   ❌ Error re-adding to queue:`, readdErr.message);
          }
          try {
            socket.emit('waiting', { message: 'Waiting for a partner...' })
            console.log(`   ✅ Waiting event emitted`);
          } catch (emitErr) {
            console.error(`   ❌ Error emitting waiting event:`, emitErr.message);
          }
          return
        }

        // Call the bulletproof matching function
        console.log(`\n✅ [find_partner] All checks PASSED - now calling matchUsers()...`)
        console.log(`   socketId1: ${socket.id}`)
        console.log(`   userId1: ${userId}`)
        console.log(`   socketId2: ${waitingUser.socketId}`)
        console.log(`   userId2: ${waitingUser.userId}`)
        console.log(`📊 [find_partner] Data being passed to matchUsers:`)
        console.log(`   Frontend user (userData1): { userName: "${userData?.userName}", userAge: ${userData?.userAge}, location: "${userData?.userLocation}" }`)
        console.log(`   Queue user (userData2): { userName: "${waitingUser?.userName}", userAge: ${waitingUser?.userAge}, location: "${waitingUser?.userLocation}" }`)

        try {
          console.log(`   ℹ️ Calling matchUsers()...`);
          await matchUsers(socket.id, userId, waitingUser.socketId, waitingUser.userId, userData, waitingUser)
          console.log(`   ✅ matchUsers() completed successfully`);
        } catch (matchErr) {
          console.error(`   ❌ Error in matchUsers():`, matchErr.message);
          throw matchErr; // Re-throw to be caught by main catch
        }

        console.log(`✅ [find_partner] matchUsers() completed successfully`)
        console.log(`🎉 [find_partner] Both users should have received partner_found event`)
      } else {
        // Add to waiting queue
        console.log(`\n⏳ [find_partner] NO MATCH FOUND - ADDING USER TO QUEUE`);
        console.log(`═════════════════════════════════════════════`)
        console.log(`   No existing waiting user found`)
        console.log(`   Adding current user ${userId} to matching queue`)
        console.log(`   Reason: getNextFromQueueOptimized() returned null`)
        console.log(`═════════════════════════════════════════════`);

        try {
          console.log(`   ℹ️ Calling addToMatchingQueue(${userId}, ${socket.id.substring(0, 8)}...)`);
          await addToMatchingQueue(userId, socket.id, userData)
          console.log(`   ✅ User added to queue successfully`);
        } catch (addErr) {
          console.error(`   ❌ Error adding to queue:`, addErr.message);
          throw addErr; // Re-throw to be caught by main catch
        }

        let queueLen;
        try {
          console.log(`   ℹ️ Calling getQueueLength()...`);
          queueLen = await getQueueLength()
          console.log(`✅ [find_partner] Added user ${userId} to queue. Queue length: ${queueLen}`)
        } catch (lenErr) {
          console.error(`   ❌ Error getting queue length:`, lenErr.message);
          queueLen = 0;
        }

        // Log queue state AFTER adding
        let queueEntriesAfter;
        try {
          console.log(`   ℹ️ Calling redis.zRange() for final state...`);
          queueEntriesAfter = await redis.zRange('matching_queue', 0, -1)
          console.log(`   ✅ Got queue entries`);
        } catch (rangeErr) {
          console.error(`   ❌ Error getting queue entries:`, rangeErr.message);
          queueEntriesAfter = [];
        }

        console.log(`📊 [find_partner] QUEUE STATE AFTER`)
        console.log(`   Total users waiting: ${queueLen}`)
        for (let i = 0; i < queueEntriesAfter.length; i++) {
          try {
            const parsed = JSON.parse(queueEntriesAfter[i])
            console.log(`   [${i}] User ${parsed.userId} - Socket ${parsed.socketId.substring(0, 8)}...`)
          } catch (parseErr) {
            console.error(`   ❌ [${i}] Failed to parse queue entry:`, parseErr.message)
          }
        }

        // Emit waiting event (check socket is still connected)
        console.log(`📤 [find_partner] Emitting 'waiting' event to socket ${socket.id.substring(0, 8)}...`)
        if (socket.connected) {
          socket.emit('waiting', { message: 'Waiting for a partner...' })
          console.log(`✅ [find_partner] 'waiting' event emitted`)
        } else {
          console.warn(`⚠️ [find_partner] Socket disconnected before 'waiting' event could be sent`)
        }
      }
    } catch (error) {
      console.error('\n\n🚨 🚨 🚨 FIND_PARTNER HANDLER ERROR 🚨 🚨 🚨');
      console.error('═══════════════════════════════════════════════════════════════');
      console.error('🚨 [find_partner] ERROR TYPE:', error?.constructor?.name || 'Unknown');
      console.error('🚨 [find_partner] ERROR MESSAGE:', error?.message || 'No message');
      console.error('🚨 [find_partner] ERROR STACK:');
      console.error(error?.stack || 'No stack');
      console.error('🚨 [find_partner] FULL ERROR OBJECT:');
      console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('═══════════════════════════════════════════════════════════════');

      // Safely emit error to client without crashing
      try {
        if (socket && socket.connected) {
          socket.emit('error', { message: 'An error occurred while finding a partner. Please try again.' })
        }
      } catch (emitErr) {
        console.error('🚨 [find_partner] Could not emit error to socket:', emitErr.message)
      }
      // Continue running - don't crash server
    }
  })

  socket.on('webrtc_offer', (data) => {
    try {
      console.log('\n\n');
      console.log('📨📨📨 SERVER RECEIVED webrtc_offer 📨📨📨');
      console.log('📨 Sender socket ID:', socket.id);
      console.log('📨 data.to value:', data.to);

      const partnerSocketId = data.to

      // ✅ FIX: Don't require userId from userSockets - just relay based on target socket ID
      // userSockets is only populated by find_partner, but user:start_matching uses matchingHandlers.js maps
      if (partnerSocketId) {
        // Track the partnership for disconnect handling
        partnerSockets.set(socket.id, partnerSocketId)
        partnerSockets.set(partnerSocketId, socket.id)
        console.log('✅ Partner relationship tracked:', socket.id, '↔', partnerSocketId)

        // Also populate userSockets if we have join data
        const userId = userSockets.get(socket.id)
        console.log('📨 userId from userSockets:', userId || 'NOT SET (using matchingHandlers path)');

        console.log('✅ SERVER: Sending webrtc_offer FROM:', socket.id, '→ TO:', partnerSocketId);
        io.to(partnerSocketId).emit('webrtc_offer', {
          offer: data.offer,
          from: socket.id
        })
        console.log('✅ SERVER: webrtc_offer emitted successfully to:', partnerSocketId)
      } else {
        console.error('❌ SERVER: Cannot send webrtc_offer - no target socket ID (data.to is missing)');
      }
    } catch (error) {
      console.error('🚨 [webrtc_offer] Error:', error.message)
      console.error('   Stack:', error.stack)
    }
  })

  // Handle WebRTC answer
  socket.on('webrtc_answer', (data) => {
    try {
      const partnerSocketId = data.to
      console.log('📨 SERVER: Received webrtc_answer from socket:', socket.id)
      console.log('📨 SERVER: Target partner socket ID:', partnerSocketId)

      // ✅ FIX: Don't require userId - just relay based on target socket ID
      if (partnerSocketId) {
        // Track partnership
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
        console.error('❌ SERVER: Cannot send webrtc_answer - no target socket ID')
      }
    } catch (error) {
      console.error('🚨 [webrtc_answer] Error:', error.message)
      console.error('   Stack:', error.stack)
    }
  })

  // Handle ICE Candidate
  socket.on('ice_candidate', (data) => {
    try {
      const partnerSocketId = data.to

      // ✅ FIX: Don't require userId - just relay ICE candidates based on target socket ID
      if (partnerSocketId) {
        partnerSockets.set(socket.id, partnerSocketId)
        partnerSockets.set(partnerSocketId, socket.id)

        io.to(partnerSocketId).emit('ice_candidate', {
          candidate: data.candidate,
          from: socket.id
        })
      } else {
        console.error('❌ SERVER: Cannot send ICE candidate - no target socket ID')
      }
    } catch (error) {
      console.error('🚨 [ice_candidate] Error:', error.message)
      console.error('   Stack:', error.stack)
    }
  })

  // ✅ SKIP USER - Notify partner when user skips (server.js handler with partnerSockets access)
  socket.on('skip_user', async (data, callback) => {
    try {
      const partnerSocketId = data?.partnerSocketId
      const userId = data?.userId || userSockets.get(socket.id)

      console.log('\n⏭️ [SKIP_USER - server.js] Skip request received')
      console.log('   From socket:', socket.id)
      console.log('   UserId:', userId)
      console.log('   Target partner socket:', partnerSocketId)
      console.log('   partnerSockets map size:', partnerSockets.size)

      // ✅ Try data.partnerSocketId first, then fall back to partnerSockets map
      let targetSocketId = partnerSocketId
      if (!targetSocketId) {
        targetSocketId = partnerSockets.get(socket.id)
        console.log('   Looked up partner from partnerSockets map:', targetSocketId)
      }

      if (!targetSocketId) {
        console.error('❌ [SKIP_USER - server.js] No partner found for socket:', socket.id)
        if (typeof callback === 'function') {
          callback({ success: true, canSkip: true })
        }
        return
      }

      // ✅ SKIP LIMIT VALIDATION: Check & increment daily skip count in DB
      let skipResult = { canSkip: true, isPremium: false, skipCount: 0, limit: 1 };
      if (userId) {
        try {
          // ✅ Run explicit global reset check on skip click
          let dbUser = await prisma.users.findUnique({ where: { id: userId } });
          if (dbUser) {
            await ensureDailySkipReset(dbUser);
          }

          skipResult = await validateSkipLimit({
            userId,
            prisma,
            redis,
            increment: true,
            source: 'skip_user_socket'
          });
          console.log('📊 [SKIP_USER] validateSkipLimit result:', skipResult);
        } catch (validateErr) {
          console.error('⚠️ [SKIP_USER] validateSkipLimit error (allowing skip):', validateErr.message);
          // On validation error, still allow the skip to prevent stuck state
        }
      }

      // 📤 CRITICAL: Always notify partner that they were skipped
      // (Even if skip limit was reached, partner must be notified to avoid stuck state)
      console.log('📢 [SKIP_USER - server.js] Emitting user_skipped to:', targetSocketId)
      io.to(targetSocketId).emit('user_skipped', {
        message: 'Your partner skipped you.',
        skippedBy: userId || socket.id
      })
      console.log('✅ [SKIP_USER - server.js] user_skipped event SENT to partner')

      // 🧹 Clean up partnerSockets mapping
      partnerSockets.delete(socket.id)
      partnerSockets.delete(targetSocketId)
      console.log('🧹 [SKIP_USER - server.js] Cleaned partnerSockets mapping')

      // 🧹 Clean up activeChats
      const partnerUserId = userSockets.get(targetSocketId)
      if (userId && activeChats.has(userId)) {
        activeChats.delete(userId)
        console.log('🧹 [SKIP_USER - server.js] Removed', userId, 'from activeChats')
      }
      if (partnerUserId && activeChats.has(partnerUserId)) {
        activeChats.delete(partnerUserId)
        console.log('🧹 [SKIP_USER - server.js] Removed', partnerUserId, 'from activeChats')
      }

      // 🧹 Clean up timers if any
      if (socket.autoSkipTimer) clearTimeout(socket.autoSkipTimer);
      const targetSockObj = io.sockets.sockets.get(targetSocketId);
      if (targetSockObj && targetSockObj.autoSkipTimer) clearTimeout(targetSockObj.autoSkipTimer);

      // 🧹 Clean up Redis active_sessions + DB on skip
      const sessionId = socket.sessionId
      if (sessionId) {
        try {
          await redis.sRem('active_sessions', sessionId)
          await redis.del(`session:${sessionId}`)
          activeSessions.delete(sessionId)
          console.log('🧹 [SKIP_USER] Session removed from Redis:', sessionId)

          // ✅ Emit real-time event to admin panel
          io.emit('session:removed', {
            sessionId: sessionId,
            endedBy: 'skip',
            endedAt: new Date().toISOString()
          })

          // Also update DB
          const durationSeconds = socket.callStartTime
            ? Math.floor((Date.now() - socket.callStartTime) / 1000)
            : 0
          await prisma.sessions.update({
            where: { id: sessionId },
            data: { ended_at: new Date(), duration_seconds: durationSeconds }
          }).catch(e => console.error('DB session update error:', e.message))
        } catch (redisErr) {
          console.error('⚠️ [SKIP_USER] Redis cleanup error:', redisErr.message)
        }
      }

      // ✅ Return skip validation result to frontend
      if (typeof callback === 'function') {
        callback({
          success: true,
          canSkip: skipResult.canSkip,
          isPremium: skipResult.isPremium,
          skipCount: skipResult.skipCount,
          limit: skipResult.limit
        })
      }

    } catch (error) {
      console.error('🚨 [SKIP_USER - server.js] Error:', error.message)
      if (typeof callback === 'function') {
        callback({ success: false, canSkip: false, error: 'Internal server error' })
      }
    }
  })

  // ═══════════════════════════════════════════════════════════════
  // 🎯 OMEGLE-STYLE: Handle user inactivity/tab close disconnect
  // ═══════════════════════════════════════════════════════════════
  socket.on('user_inactive_disconnect', (data) => {
    try {
      const { userId, partnerId, reason } = data || {}
      console.log('\n🚪 [INACTIVE_DISCONNECT] Reason:', reason, '| User:', userId || socket.id)

      // Find partner socket
      let targetSocketId = partnerSockets.get(socket.id)
      if (!targetSocketId && partnerId) {
        for (const [sockId, uId] of userSockets.entries()) {
          if (uId === partnerId) { targetSocketId = sockId; break }
        }
      }

      if (targetSocketId) {
        io.to(targetSocketId).emit('user_skipped', {
          message: 'Your partner disconnected.',
          skippedBy: userId || socket.id
        })
        console.log('📢 [INACTIVE_DISCONNECT] Partner notified:', targetSocketId)
      }

      // Cleanup
      partnerSockets.delete(socket.id)
      if (targetSocketId) partnerSockets.delete(targetSocketId)
      const socketUserId = userSockets.get(socket.id)
      const partnerUserId = targetSocketId ? userSockets.get(targetSocketId) : null
      if (socketUserId) activeChats.delete(socketUserId)
      if (partnerUserId) activeChats.delete(partnerUserId)
      console.log('✅ [INACTIVE_DISCONNECT] Cleanup complete')
    } catch (error) {
      console.error('🚨 [INACTIVE_DISCONNECT] Error:', error.message)
    }
  })

  // ═════════════════════════════════════════════════════════════
  // 👁️ ADMIN SPECTATOR MODE — Hidden 3rd Peer
  // Admin connects as receive-only. Users silently send streams.
  // ═════════════════════════════════════════════════════════════

  // Admin clicks "View" → connects here and asks to spectate
  socket.on('admin:spectate', (data) => {
    try {
      const { sessionId } = data
      const spectatorSocketId = socket.id

      console.log('\n👁️ [ADMIN SPECTATE] Admin requesting to spectate session:', sessionId)
      console.log('   Admin socket ID:', spectatorSocketId)

      // Look up the session from in-memory activeSessions map
      const session = activeSessions.get(sessionId)
      if (!session) {
        console.error('❌ [ADMIN SPECTATE] Session not found in activeSessions:', sessionId)
        socket.emit('spectator:error', { message: 'Session not found or already ended' })
        return
      }

      const { socketId1, socketId2 } = session
      console.log('   User 1 socket:', socketId1)
      console.log('   User 2 socket:', socketId2)

      // Verify both sockets are still connected
      const sock1 = io.sockets.sockets.get(socketId1)
      const sock2 = io.sockets.sockets.get(socketId2)

      if (!sock1 && !sock2) {
        console.error('❌ [ADMIN SPECTATE] Both users disconnected')
        socket.emit('spectator:error', { message: 'Both users have disconnected' })
        return
      }

      console.log('✅ [ADMIN SPECTATE] Telling users to send streams to admin spectator')

      // Tell each connected user to create a send-only PeerConnection to the spectator
      // This event is handled SILENTLY on the client — no UI indication
      if (sock1) {
        sock1.emit('spectator:send_stream', {
          spectatorSocketId: spectatorSocketId,
          sessionId: sessionId,
          participantLabel: 'user1'
        })
        console.log('   → Told user1 (', socketId1, ') to send stream')
      }

      if (sock2) {
        sock2.emit('spectator:send_stream', {
          spectatorSocketId: spectatorSocketId,
          sessionId: sessionId,
          participantLabel: 'user2'
        })
        console.log('   → Told user2 (', socketId2, ') to send stream')
      }

      // Confirm to admin that spectator mode is initiated
      socket.emit('spectator:ready', {
        sessionId,
        user1Connected: !!sock1,
        user2Connected: !!sock2
      })

    } catch (error) {
      console.error('🚨 [admin:spectate] Error:', error.message)
      socket.emit('spectator:error', { message: error.message })
    }
  })

  // User created an offer for the spectator — relay to admin
  socket.on('spectator:offer', (data) => {
    try {
      const { offer, to, sessionId, participantLabel } = data
      console.log('👁️ [SPECTATOR] Offer from user', socket.id, '→ admin', to, '| label:', participantLabel)
      if (to && offer) {
        const targetSocket = io.sockets.sockets.get(to)
        if (targetSocket) {
          io.to(to).emit('spectator:offer', {
            offer,
            from: socket.id,
            sessionId,
            participantLabel
          })
          console.log('✅ [SPECTATOR] Offer relayed successfully to admin', to)
        } else {
          console.error('❌ [SPECTATOR] Admin socket NOT FOUND:', to)
        }
      } else {
        console.error('❌ [SPECTATOR] Missing to or offer in spectator:offer')
      }
    } catch (error) {
      console.error('🚨 [spectator:offer] Error:', error.message)
    }
  })

  // Admin sends answer back to user — relay
  socket.on('spectator:answer', (data) => {
    try {
      const { answer, to, sessionId } = data
      console.log('👁️ [SPECTATOR] Answer from admin', socket.id, '→ user', to)
      if (to && answer) {
        const targetSocket = io.sockets.sockets.get(to)
        if (targetSocket) {
          io.to(to).emit('spectator:answer', {
            answer,
            from: socket.id,
            sessionId
          })
          console.log('✅ [SPECTATOR] Answer relayed successfully to user', to)
        } else {
          console.error('❌ [SPECTATOR] User socket NOT FOUND:', to)
        }
      } else {
        console.error('❌ [SPECTATOR] Missing to or answer in spectator:answer')
      }
    } catch (error) {
      console.error('🚨 [spectator:answer] Error:', error.message)
    }
  })

  // ICE candidate relay for spectator connections
  socket.on('spectator:ice_candidate', (data) => {
    try {
      const { candidate, to, sessionId } = data
      if (to && candidate) {
        io.to(to).emit('spectator:ice_candidate', {
          candidate,
          from: socket.id,
          sessionId
        })
      }
    } catch (error) {
      console.error('🚨 [spectator:ice_candidate] Error:', error.message)
    }
  })

  // Handle skip user
  // Handle cancel matching - user clicks "Back" or navigates away while waiting
  socket.on('cancel_matching', async (data) => {
    try {
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
    } catch (error) {
      console.error('🚨 [cancel_matching] Error:', error.message)
      console.error('   Stack:', error.stack)
      // Continue without crashing
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

    // 🧹 Clean up timer
    if (socket.autoSkipTimer) clearTimeout(socket.autoSkipTimer);

    // ✅ UPDATE SESSION IN DATABASE - Mark as ended
    if (socket.sessionId) {
      try {
        const durationSeconds = socket.callStartTime
          ? Math.floor((Date.now() - socket.callStartTime) / 1000)
          : 0

        await prisma.sessions.update({
          where: { id: socket.sessionId },
          data: {
            ended_at: new Date(),
            duration_seconds: durationSeconds
          }
        })
        console.log(`✅ Session ${socket.sessionId} marked as ended in database (duration: ${durationSeconds}s)`)
      } catch (error) {
        console.error(`❌ Error updating session in database:`, error.message)
      }

      // ✅ CRITICAL: Remove session from Redis active_sessions
      try {
        await redis.sRem('active_sessions', socket.sessionId)
        await redis.del(`session:${socket.sessionId}`)
        activeSessions.delete(socket.sessionId)
        console.log(`✅ Session ${socket.sessionId} removed from Redis active_sessions`)

        // ✅ Emit real-time event to admin panel
        io.emit('session:removed', {
          sessionId: socket.sessionId,
          endedBy: 'disconnect',
          endedAt: new Date().toISOString()
        })
      } catch (redisErr) {
        console.error(`❌ Error removing session from Redis:`, redisErr.message)
      }
    }

    // ✅ CRITICAL: Save match to database if call was active - FOR BOTH USERS
    let partnerUserId = null
    if (userId && socket.callStartTime && socket.partner) {
      try {
        const durationSeconds = Math.floor(
          (Date.now() - socket.callStartTime) / 1000
        )

        console.log(`\n💾 Saving match history for user ${userId} (disconnect)`)
        console.log(`   Partner: ${socket.partner.id}`)
        console.log(`   Duration: ${durationSeconds}s`)

        partnerUserId = socket.partner.id

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
        const realPartnerUserId = userSockets.get(socket.partner.socketId)
        if (partnerSocket && realPartnerUserId && partnerSocket.partner) {
          await pool.query(
            `INSERT INTO matches
             (user_id, matched_user_id, matched_user_name, matched_user_country, duration_seconds)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              realPartnerUserId,
              partnerSocket.partner.id,
              partnerSocket.partner.name,
              partnerSocket.partner.country,
              durationSeconds
            ]
          )
          console.log(`✅ Match saved for partner ${realPartnerUserId} (disconnect)`)
          partnerSocket.callStartTime = null
          partnerSocket.partner = null
        }
      } catch (error) {
        console.error(`❌ Error saving match to database:`, error)
      }
    }

    // ✅ SET COOLDOWN between users when call ends (25-30 seconds)
    if (userId && partnerUserId) {
      await setRecentPartnerCooldown(userId, partnerUserId, 25)
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

      // ✅ CRITICAL: Remove user from activeChats when they disconnect
      if (activeChats.has(userId)) {
        activeChats.delete(userId)
        console.log(`✅ [ACTIVE-CHATS] Removed user ${userId} from active chats`)
        console.log(`   Total active chats now: ${activeChats.size}`)
      }
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
  console.log('║          🎯 MATCHUSERS CALLED 🎯 - CRITICAL LOG 🎯           ║')
  console.log('║     This means matching is ABOUT TO HAPPEN                    ║')
  console.log('╚════════════════════════════════════════════════════════════╝')

  // ✅ LOG THE INCOMING DATA
  console.log('\n📥 [FUNCTION INPUT] matchUsers() called with:')
  console.log(`   userId1: "${userId1}"`)
  console.log(`   userId2: "${userId2}"`)
  console.log(`   socketId1: "${socketId1.substring(0, 8)}..."`)
  console.log(`   socketId2: "${socketId2.substring(0, 8)}..."`)
  console.log(`   userData1:`, JSON.stringify(userData1, null, 2))
  console.log(`   userData2:`, JSON.stringify(userData2, null, 2))
  console.log(`   userData1.userName: "${userData1?.userName}" (CRITICAL TO TRACK!)`)
  console.log(`   userData2.userName: "${userData2?.userName}" (CRITICAL TO TRACK!)`)

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

  // ✅ CRITICAL: Fetch user data from DATABASE (display_name, location, age, photo_url, etc)
  let dbUser1, dbUser2;
  try {
    [dbUser1, dbUser2] = await Promise.all([
      prisma.users.findUnique({ where: { id: userId1 }, select: { location: true, display_name: true, age: true, photo_url: true, has_blue_tick: true, blue_tick_expires_at: true } }),
      prisma.users.findUnique({ where: { id: userId2 }, select: { location: true, display_name: true, age: true, photo_url: true, has_blue_tick: true, blue_tick_expires_at: true } })
    ]);

    console.log(`\n🔍 [DB FETCH RESULTS]:`)
    console.log(`   dbUser1 complete object:`, JSON.stringify(dbUser1, null, 2))
    console.log(`   dbUser2 complete object:`, JSON.stringify(dbUser2, null, 2))
    console.log(`   dbUser1.display_name value: "${dbUser1?.display_name}" (null? ${dbUser1?.display_name === null}, undefined? ${dbUser1?.display_name === undefined})`)
    console.log(`   dbUser2.display_name value: "${dbUser2?.display_name}" (null? ${dbUser2?.display_name === null}, undefined? ${dbUser2?.display_name === undefined})`)

    // Enrich blue tick status (check expiry)
    const now = new Date();
    if (userData1) {
      userData1.hasBlueTick = !!(dbUser1?.has_blue_tick && dbUser1?.blue_tick_expires_at && new Date(dbUser1.blue_tick_expires_at) > now);
    }
    if (userData2) {
      userData2.hasBlueTick = !!(dbUser2?.has_blue_tick && dbUser2?.blue_tick_expires_at && new Date(dbUser2.blue_tick_expires_at) > now);
    }

    console.log(`👤 [DB DATA] User1 - name: "${dbUser1?.display_name || 'null'}", location: "${dbUser1?.location || 'null'}", age: ${dbUser1?.age || 'null'}`)
    console.log(`👤 [DB DATA] User2 - name: "${dbUser2?.display_name || 'null'}", location: "${dbUser2?.location || 'null'}", age: ${dbUser2?.age || 'null'}`)

    // ✅ Map display_name -> userName, location -> userLocation, age -> userAge, profile_picture_url -> userPicture
    if (userData1) {
      if (dbUser1?.display_name) {
        userData1.userName = dbUser1.display_name;
        console.log(`✅ [MAPPING] User1 name: ${dbUser1.display_name}`);
      }
      if (dbUser1?.location) {
        userData1.userLocation = dbUser1.location;
      } else if (!userData1.userLocation) {
        userData1.userLocation = 'Unknown';
      }
      if (dbUser1?.age) {
        userData1.userAge = dbUser1.age;
      }
      if (dbUser1?.photo_url && !userData1.userPicture) {
        userData1.userPicture = dbUser1.photo_url;
      }
    }
    if (userData2) {
      if (dbUser2?.display_name) {
        userData2.userName = dbUser2.display_name;
        console.log(`✅ [MAPPING] User2 name: ${dbUser2.display_name}`);
      }
      if (dbUser2?.location) {
        userData2.userLocation = dbUser2.location;
      } else if (!userData2.userLocation) {
        userData2.userLocation = 'Unknown';
      }
      if (dbUser2?.age) {
        userData2.userAge = dbUser2.age;
      }
      if (dbUser2?.photo_url && !userData2.userPicture) {
        userData2.userPicture = dbUser2.photo_url;
      }
    }
    console.log(`✅ [FINAL] User1: ${userData1?.userName || 'Anonymous'} (${userData1?.userAge || 'unknown age'}) from ${userData1?.userLocation}`)
    console.log(`✅ [FINAL] User2: ${userData2?.userName || 'Anonymous'} (${userData2?.userAge || 'unknown age'}) from ${userData2?.userLocation}`)
  } catch (dbLocErr) {
    console.warn('⚠️ Could not fetch locations from DB:', dbLocErr.message);
  }

  // ✅ CRITICAL: Clean up any OLD sessions from previous matches for BOTH sockets
  // This prevents stale/duplicate sessions from appearing in admin Live Sessions
  try {
    const socket1Obj = io.sockets.sockets.get(socketId1)
    const socket2Obj = io.sockets.sockets.get(socketId2)
    const oldSessionIds = new Set()

    if (socket1Obj?.sessionId) oldSessionIds.add(socket1Obj.sessionId)
    if (socket2Obj?.sessionId) oldSessionIds.add(socket2Obj.sessionId)

    for (const oldSessionId of oldSessionIds) {
      console.log(`🧹 [MATCH CLEANUP] Removing old session: ${oldSessionId}`)
      await redis.sRem('active_sessions', oldSessionId)
      await redis.del(`session:${oldSessionId}`)
      activeSessions.delete(oldSessionId)

      // Mark old session as ended in DB
      try {
        await prisma.sessions.update({
          where: { id: oldSessionId },
          data: {
            ended_at: new Date(),
            duration_seconds: socket1Obj?.callStartTime
              ? Math.floor((Date.now() - socket1Obj.callStartTime) / 1000) : 0
          }
        })
      } catch (e) { /* session may already be ended */ }

      // Notify admin panel to remove stale session
      io.emit('session:removed', {
        sessionId: oldSessionId,
        endedBy: 'rematch',
        endedAt: new Date().toISOString()
      })
    }

    // Clear old session references from both sockets
    if (socket1Obj) { socket1Obj.sessionId = null; socket1Obj.callStartTime = null; socket1Obj.partner = null; }
    if (socket2Obj) { socket2Obj.sessionId = null; socket2Obj.callStartTime = null; socket2Obj.partner = null; }
  } catch (cleanupErr) {
    console.error('⚠️ [MATCH CLEANUP] Error cleaning old sessions:', cleanupErr.message)
  }

  // Create session
  const sessionId = uuidv4()
  const startedAt = new Date()

  console.log(`\n✓ STEP 2: Creating session`)
  console.log(`   sessionId: ${sessionId}`)

  // ✅ CRITICAL ORDER: Remove from queue FIRST, then add to activeChats
  // This prevents another match from grabbing them while we're processing

  console.log(`\n✓ STEP 2A: Removing matched users from queue (PRIORITY 1)`)
  try {
    // Build the queue entries to remove
    const queueEntries = await redis.zRange('matching_queue', 0, -1)
    let removed1 = false, removed2 = false

    for (const entry of queueEntries) {
      try {
        const queuedUser = JSON.parse(entry)
        if (queuedUser.userId === userId1) {
          const removalResult = await redis.zRem('matching_queue', entry)
          removed1 = true
          console.log(`   ✅ Removed user1 (${userId1}) from queue - result: ${removalResult}`)
        } else if (queuedUser.userId === userId2) {
          const removalResult = await redis.zRem('matching_queue', entry)
          removed2 = true
          console.log(`   ✅ Removed user2 (${userId2}) from queue - result: ${removalResult}`)
        }
      } catch (parseErr) {
        console.error(`   ❌ Error parsing queue entry:`, parseErr.message)
      }
    }

    if (!removed1) console.warn(`   ⚠️ User1 (${userId1}) not found in queue`)
    if (!removed2) console.warn(`   ⚠️ User2 (${userId2}) not found in queue`)

    const queueLenAfterRemoval = await redis.zCard('matching_queue')
    console.log(`   📊 Queue length after removal: ${queueLenAfterRemoval}`)
  } catch (error) {
    console.error('❌ Error removing users from queue:', error.message)
  }

  // ✅ STEP 2B: NOW add both users to activeChats AFTER removal
  console.log(`\n✓ STEP 2B: Adding users to activeChats (PRIORITY 2)`)
  activeChats.add(userId1)
  activeChats.add(userId2)
  console.log(`✅ [ACTIVE-CHATS] Added users to active chats:`)
  console.log(`   ${userId1} -> activeChats`)
  console.log(`   ${userId2} -> activeChats`)
  console.log(`   Total active chats: ${activeChats.size}`)
  console.log(`   All activeChat users:`, Array.from(activeChats))

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

    // ✅ Emit real-time event to admin panel
    io.emit('session:live', {
      sessionId: sessionId,
      userId1: userId1,
      userId2: userId2,
      startedAt: startedAt.toISOString()
    })
  } catch (error) {
    console.error('❌ Error storing session in Redis:', error)
  }

  // Store session in PostgreSQL database for admin panel visibility
  try {
    const dbSession = await prisma.sessions.create({
      data: {
        id: sessionId,
        user1_id: userId1,
        user2_id: userId2,
        started_at: startedAt,
        ended_at: null,
        duration_seconds: 0,
        quality: 'good'
      }
    })
    console.log(`   ✅ Session stored in PostgreSQL database`)
  } catch (error) {
    console.error('❌ Error storing session in database:', error.message)
    // Continue anyway - Redis session is stored
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

  // ✅ CRITICAL: Before building partner events, ensure userData has all required fields from DB
  console.log(`\n🔍 [DATA CHECK] Verifying userData before building partner events:`)
  console.log(`   userData1.userName: "${userData1?.userName}" (from DB: "${dbUser1?.display_name}")`)
  console.log(`   userData2.userName: "${userData2?.userName}" (from DB: "${dbUser2?.display_name}")`)

  // Ensure userData1 has correct userName from DB
  if (!userData1 || !userData1.userName || userData1.userName === 'Anonymous') {
    if (dbUser1?.display_name) {
      if (!userData1) userData1 = {}
      userData1.userName = dbUser1.display_name
      console.log(`⚠️ [DATA FIX] Set userData1.userName from DB: ${dbUser1.display_name}`)
    }
  }

  // Ensure userData2 has correct userName from DB
  if (!userData2 || !userData2.userName || userData2.userName === 'Anonymous') {
    if (dbUser2?.display_name) {
      if (!userData2) userData2 = {}
      userData2.userName = dbUser2.display_name
      console.log(`⚠️ [DATA FIX] Set userData2.userName from DB: ${dbUser2.display_name}`)
    }
  }

  console.log(`\n✅ [FINAL] Building partner events with confirmed data:`)
  console.log(`   userData1: { userName: "${userData1?.userName}", userAge: ${userData1?.userAge}, userLocation: "${userData1?.userLocation}" }`)
  console.log(`   userData2: { userName: "${userData2?.userName}", userAge: ${userData2?.userAge}, userLocation: "${userData2?.userLocation}" }`)

  // ✅ CRITICAL: Verify what came from DB for each user
  console.log(`\n🔍 [DB COMPARISON] What we got from database:`)
  console.log(`   dbUser1.display_name: "${dbUser1?.display_name}" → userData1.userName: "${userData1?.userName}"`)
  console.log(`   dbUser2.display_name: "${dbUser2?.display_name}" → userData2.userName: "${userData2?.userName}"`)

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

  console.log(`\n📤 [EMIT1] BEFORE sending - partner_found event to User1:`)
  console.log(`   ⚠️ CRITICAL - What we're sending:`)
  console.log(`   userData2 object:`, JSON.stringify(userData2, null, 2))
  console.log(`   → userName field: "${userData2?.userName}"`)
  console.log(`   → Result in event: "${partnerFoundEvent1.userName}"`)
  console.log(`   Full payload being sent:`, JSON.stringify(partnerFoundEvent1, null, 2))

  try {
    // Use the actual socket object to emit
    if (actualSocket1) {
      actualSocket1.sessionId = sessionId // Store sessionId on socket for later
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

  console.log(`\n📤 [EMIT2] BEFORE sending - partner_found event to User2:`)
  console.log(`   ⚠️ CRITICAL - What we're sending:`)
  console.log(`   userData1 object:`, JSON.stringify(userData1, null, 2))
  console.log(`   → userName field: "${userData1?.userName}"`)
  console.log(`   → Result in event: "${partnerFoundEvent2.userName}"`)
  console.log(`   Full payload being sent:`, JSON.stringify(partnerFoundEvent2, null, 2))

  try {
    // Use the actual socket object to emit
    if (actualSocket2) {
      actualSocket2.sessionId = sessionId // Store sessionId on socket for later
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

  // 🎯 SILENT 30-MINUTE AUTO SKIP SYSTEM (28-32 min)
  console.log('\n⏱️ [AUTO-SKIP] Setting up silent session timeout for:', sessionId)
  const SESSION_TIMEOUT = Math.floor((28 + Math.random() * 4) * 60 * 1000);
  console.log("SESSION TIMEOUT:", SESSION_TIMEOUT);
  console.log(`⏱️ [AUTO-SKIP] Timeout set for ${Math.floor(SESSION_TIMEOUT / 60000)}m ${Math.floor((SESSION_TIMEOUT % 60000) / 1000)}s`);

  const sock1 = io.sockets.sockets.get(socketId1);
  const sock2 = io.sockets.sockets.get(socketId2);

  if (sock1 && sock1.autoSkipTimer) clearTimeout(sock1.autoSkipTimer);
  if (sock2 && sock2.autoSkipTimer) clearTimeout(sock2.autoSkipTimer);

  const timerId = setTimeout(() => {
    try {
      console.log(`\n⏳ [AUTO-SKIP] Timer executed for session: ${sessionId}!`);

      const s1 = io.sockets.sockets.get(socketId1);
      const s2 = io.sockets.sockets.get(socketId2);

      // Ensure users are still mathematically in the same active session
      if ((s1 && s1.sessionId !== sessionId) || (s2 && s2.sessionId !== sessionId)) {
        console.log(`⏳ [AUTO-SKIP] Aborted: Users are no longer in this session.`);
        return;
      }

      console.log(`⏳ [AUTO-SKIP] Disconnecting socket ${socketId1} and ${socketId2}...`);

      // Emit connection lost (network issue feel)
      if (s1) s1.emit('partner_disconnected', { reason: 'connection_lost' });
      else io.to(socketId1).emit('partner_disconnected', { reason: 'connection_lost' });

      if (s2) s2.emit('partner_disconnected', { reason: 'connection_lost' });
      else io.to(socketId2).emit('partner_disconnected', { reason: 'connection_lost' });

      // Backend Cleanup
      partnerSockets.delete(socketId1);
      partnerSockets.delete(socketId2);

      if (userId1) activeChats.delete(userId1);
      if (userId2) activeChats.delete(userId2);

      console.log(`✅ [AUTO-SKIP] Both users silently disconnected as 'network issue'`);
    } catch (err) {
      console.error(`❌ [AUTO-SKIP] Error during auto-skip execution:`, err);
    }
  }, SESSION_TIMEOUT);

  if (sock1) sock1.autoSkipTimer = timerId;
  if (sock2) sock2.autoSkipTimer = timerId;

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

    // ✅ CRITICAL: Cleanup orphaned sessions from previous server run
    // When server restarts, all socket connections are lost but Redis still has stale sessions
    console.log("[STARTUP] STEP 3.0 - Cleaning up orphaned sessions from previous run...");
    try {
      const staleSessionIds = await redis.sMembers('active_sessions')
      if (staleSessionIds.length > 0) {
        console.log(`🧹 [STARTUP] Found ${staleSessionIds.length} orphaned sessions in Redis — cleaning up`)
        for (const sid of staleSessionIds) {
          await redis.sRem('active_sessions', sid)
          await redis.del(`session:${sid}`)
          // Mark as ended in DB
          try {
            await prisma.sessions.update({
              where: { id: sid },
              data: { ended_at: new Date() }
            })
          } catch (e) { /* session may not exist or already ended */ }
        }
        // Also notify any connected admin panels
        io.emit('session:removed', { sessionId: 'all', endedBy: 'server_restart', endedAt: new Date().toISOString() })
        console.log(`✅ [STARTUP] Cleared ${staleSessionIds.length} orphaned sessions`)
      } else {
        console.log("✅ [STARTUP] No orphaned sessions found")
      }
    } catch (cleanupErr) {
      console.error("⚠️ [STARTUP] Session cleanup error:", cleanupErr.message)
    }

    // ✅ STARTUP: Clear stale active user sets from previous server run
    try {
      await redis.del('online_males')
      await redis.del('online_females')
      await redis.del('active_users')
      console.log('✅ [STARTUP] Cleared stale online_males, online_females, active_users sets')
    } catch (cleanupErr) {
      console.error('⚠️ [STARTUP] Active user cleanup error:', cleanupErr.message)
    }

    console.log("[STARTUP] STEP 3.1 - Starting server...");
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log("[STARTUP] STEP 3.2 - Server running on PORT:", PORT);

      // ═══════════════════════════════════════════════════════════
      // ✅ HEARTBEAT CLEANUP: Remove stale users from Redis sets (every 15 seconds)
      // If heartbeat key expired (30s TTL), user is gone — remove from active sets
      // ═══════════════════════════════════════════════════════════
      setInterval(async () => {
        try {
          // Check online_males
          const males = await redis.sMembers('online_males')
          for (const userId of males) {
            const alive = await redis.get(`heartbeat:${userId}`)
            if (!alive) {
              await redis.sRem('online_males', userId)
              await redis.sRem('active_users', userId)
              console.log(`🧹 [HEARTBEAT_CLEANUP] Removed stale male: ${userId.substring(0, 8)}...`)
            }
          }

          // Check online_females
          const females = await redis.sMembers('online_females')
          for (const userId of females) {
            const alive = await redis.get(`heartbeat:${userId}`)
            if (!alive) {
              await redis.sRem('online_females', userId)
              await redis.sRem('active_users', userId)
              console.log(`🧹 [HEARTBEAT_CLEANUP] Removed stale female: ${userId.substring(0, 8)}...`)
            }
          }
        } catch (err) {
          // Silent - don't spam logs on cleanup errors
        }
      }, 15000) // Every 15 seconds

      // ═══════════════════════════════════════════════════════════
      // ✅ DYNAMIC PRIORITY MATCHER UPDATE (every 1 second)
      // Updates scores in queue: Normal protection & Force matches
      // ═══════════════════════════════════════════════════════════
      setInterval(async () => {
        try {
          const queueLen = await redis.zCard('matching_queue')
          if (queueLen === 0) return

          const members = await redis.zRange('matching_queue', 0, -1)
          let changed = false;

          for (const entry of members) {
            try {
              const parsed = JSON.parse(entry)
              if (!parsed.joinTime) continue; // Skip legacy entries

              const waitTime = Date.now() - parsed.joinTime;

              // Recalculate dynamic score: Lower score is better in Redis sorted sets
              let currentScore = parsed.joinTime - (parsed.boostAdvantage || 0);

              // Normal protection: After 7 sec -> +3000 priority (subtract 3000 from score)
              if (waitTime >= 7000 && !parsed.hasMatchBoost) {
                currentScore -= 3000;
              }

              // After 10 sec -> force match priority (subtract 100000 from score)
              if (waitTime >= 10000) {
                currentScore -= 100000;
              }

              // Update the member score in Redis
              await redis.zAdd('matching_queue', { score: currentScore, value: entry });
              changed = true;
            } catch (err) { }
          }

          if (changed && queueLen >= 2) {
            await triggerInstantMatch();
          }
        } catch (err) { }
      }, 1000)

      // ═══════════════════════════════════════════════════════════
      // ✅ BULLETPROOF: Periodic session validator (every 15 seconds)
      // Checks if session sockets are still connected. If not, clean up.
      // This catches ALL edge cases that disconnect handlers miss.
      // ═══════════════════════════════════════════════════════════
      setInterval(async () => {
        try {
          if (activeSessions.size === 0) return

          for (const [sessionId, session] of activeSessions.entries()) {
            const sock1Connected = io.sockets.sockets.has(session.socketId1)
            const sock2Connected = io.sockets.sockets.has(session.socketId2)

            // If BOTH sockets are gone, session is dead — clean it up
            if (!sock1Connected && !sock2Connected) {
              console.log(`🧹 [SESSION VALIDATOR] Dead session detected: ${sessionId}`)
              console.log(`   Socket1 ${session.socketId1}: disconnected`)
              console.log(`   Socket2 ${session.socketId2}: disconnected`)

              // Remove from in-memory
              activeSessions.delete(sessionId)

              // Remove from Redis
              try {
                await redis.sRem('active_sessions', sessionId)
                await redis.del(`session:${sessionId}`)
              } catch (e) { }

              // Mark as ended in DB
              try {
                const duration = session.startedAt
                  ? Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000) : 0
                await prisma.sessions.update({
                  where: { id: sessionId },
                  data: { ended_at: new Date(), duration_seconds: duration }
                })
              } catch (e) { }

              // Notify admin panel
              io.emit('session:removed', {
                sessionId: sessionId,
                endedBy: 'validator_cleanup',
                endedAt: new Date().toISOString()
              })

              console.log(`✅ [SESSION VALIDATOR] Cleaned dead session: ${sessionId}`)
            }
          }
        } catch (err) {
          // Silent fail for periodic validator
        }
      }, 15000) // Every 15 seconds

      // ═══════════════════════════════════════════════════════════
      // ✅ PREMIUM AUTO-EXPIRY (Runs every hour)
      // Automatically removes Premium status from users whose duration expired
      // ═══════════════════════════════════════════════════════════
      setInterval(async () => {
        try {
          // Double check prisma exists since it might fail init
          if (!prisma) return;

          const result = await prisma.users.updateMany({
            where: {
              is_premium: true,
              premium_expiry: {
                lt: new Date()
              }
            },
            data: {
              is_premium: false,
              premium_type: null,
              premium_expiry: null
            }
          });

          if (result.count > 0) {
            console.log(`💎 [PREMIUM AUTO-EXPIRY] Cleaned up expired premium status for ${result.count} users.`);
          }
        } catch (err) {
          console.error('❌ [PREMIUM AUTO-EXPIRY] Error:', err.message);
        }
      }, 3600000); // 1 Hour
    });

  } catch (err) {
    console.error("[STARTUP ERROR]", err);
    process.exit(1);
  }
})();

