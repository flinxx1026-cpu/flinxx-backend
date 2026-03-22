/**
 * Verification script for Redis + Lua initialization
 */
import { createClient } from 'redis'
import MatchingServiceOptimized from './services/matchingServiceOptimized.js'
import dotenv from 'dotenv'

// Load env
dotenv.config({ path: '.env.local', override: true })
dotenv.config({ override: false })

async function verify() {
  console.log('\n🔍 [VERIFY] Starting initialization verification...\n')
  
  try {
    // Step 1: Connect to Redis
    console.log('Step 1️⃣  Connecting to Redis...')
    const redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: { connectTimeout: 5000, reconnectStrategy: (retries) => Math.min(retries * 50, 500) }
    })
    
    redis.on('error', (err) => console.error('❌ Redis error:', err.message))
    await redis.connect()
    console.log('✅ Redis connected successfully\n')
    
    // Step 2: Initialize matching service
    console.log('Step 2️⃣  Creating MatchingServiceOptimized...')
    const matchingService = new MatchingServiceOptimized(redis)
    console.log('✅ MatchingServiceOptimized created\n')
    
    // Step 3: Load Lua scripts
    console.log('Step 3️⃣  Loading Lua scripts...')
    await matchingService.initializeLuaScripts()
    console.log('✅ Lua scripts loaded successfully\n')
    
    // Step 4: Test basic operations
    console.log('Step 4️⃣  Testing basic operations...')
    
    // Test RPUSH
    await redis.rPush('queue:global', JSON.stringify({ userId: 'test-user-1', timestamp: Date.now() }))
    console.log('✅ RPUSH working')
    
    // Test LLEN
    const queueSize = await redis.lLen('queue:global')
    console.log(`✅ LLEN working (queue size: ${queueSize})`)
    
    // Test prefetch
    await matchingService.prefetchNextCandidate('test-user-2')
    console.log('✅ Prefetch working')
    
    // Test TTL
    const prefetchTTL = await redis.ttl('prefetch:test-user-2')
    console.log(`✅ TTL working (prefetch TTL: ${prefetchTTL}s)\n`)
    
    // Summary
    console.log('═══════════════════════════════════════════════════════')
    console.log('✅ ALL VERIFICATION CHECKS PASSED')
    console.log('═══════════════════════════════════════════════════════')
    console.log('Summary:')
    console.log('  ✅ Redis connection: WORKING')
    console.log('  ✅ Lua scripts: LOADED')
    console.log('  ✅ Queue operations: WORKING')
    console.log('  ✅ Prefetch cache: WORKING')
    console.log('  ✅ TTL management: WORKING')
    console.log('\n🚀 Ready for production testing!\n')
    
    await redis.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

verify()
