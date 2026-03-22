/**
 * OPTIMIZED Matching Service - Single Global Queue
 */
import { createClient } from 'redis'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class MatchingServiceOptimized {
  constructor(redisClient, prisma = null) {
    // Accept already-connected Redis client from server.js
    this.redis = redisClient
    this.prisma = prisma
    this.QUEUE_KEY = 'queue:global'
    this.WAITING_PREFIX = 'waiting:'
    this.MATCHED_PREFIX = 'matched:'
    this.SKIP_COUNTER_PREFIX = 'skipped:'
    this.SESSION_PREFIX = 'session:'
    this.PREFETCH_PREFIX = 'prefetch:'
    this.luaScripts = { atomicPop: null, skipRequeue: null, cleanup: null }
    this.cleanupInterval = null
  }

  async initializeLuaScripts() {
    try {
      console.log('\n[LUA] ========== STARTING LUA SCRIPT INITIALIZATION ==========');
      console.log('[LUA] 🔌 Starting Lua script initialization...');
      console.log('[LUA] 📂 Current working directory:', process.cwd());
      console.log('[LUA] 📂 __dirname:', __dirname);
      console.log('[LUA] 📂 Looking for Lua files in:', path.join(__dirname, 'redis'));
      
      const luaPath = path.join(__dirname, 'redis')
      console.log('[LUA] ✅ Lua path:', luaPath);
      
      // Check if directory exists
      try {
        const stats = fs.statSync(luaPath);
        console.log('[LUA] ✅ Lua directory exists:', stats.isDirectory());
      } catch (dirErr) {
        console.error('[LUA] ❌ Lua directory not found:', dirErr.message);
        throw new Error(`Lua directory not found at ${luaPath}`);
      }
      
      const atomicPopPath = path.join(luaPath, 'matchingAtomicPop.lua')
      const skipRequeuPath = path.join(luaPath, 'matchingSkipRequeue.lua')
      const cleanupPath = path.join(luaPath, 'matchingCleanup.lua')
      
      console.log('[LUA] 📄 Files to load:');
      console.log('[LUA]    - atomicPop:', atomicPopPath);
      console.log('[LUA]    - skipRequeue:', skipRequeuPath);
      console.log('[LUA]    - cleanup:', cleanupPath);
      
      console.log('[LUA] ✅ Reading Lua files...');
      
      // Check each file exists
      const files = [
        { name: 'atomicPop', path: atomicPopPath },
        { name: 'skipRequeue', path: skipRequeuPath },
        { name: 'cleanup', path: cleanupPath }
      ];
      
      for (const file of files) {
        try {
          fs.statSync(file.path);
          console.log(`[LUA] ✅ File exists: ${file.name}`);
        } catch (err) {
          console.error(`[LUA] ❌ File NOT found: ${file.name} at ${file.path}`);
          throw new Error(`Lua file not found: ${file.name}`);
        }
      }
      
      const atomicPopScript = fs.readFileSync(atomicPopPath, 'utf8')
      console.log('[LUA] ✅ Read atomicPop script:', atomicPopScript.length, 'bytes');
      
      const skipRequeuScript = fs.readFileSync(skipRequeuPath, 'utf8')
      console.log('[LUA] ✅ Read skipRequeue script:', skipRequeuScript.length, 'bytes');
      
      const cleanupScript = fs.readFileSync(cleanupPath, 'utf8')
      console.log('[LUA] ✅ Read cleanup script:', cleanupScript.length, 'bytes');
      
      console.log('[LUA] 📤 Loading scripts to Redis...');
      
      try {
        this.luaScripts.atomicPop = await this.redis.scriptLoad(atomicPopScript)
        console.log('[LUA] ✅ Loaded atomicPop, SHA:', this.luaScripts.atomicPop);
        
        this.luaScripts.skipRequeue = await this.redis.scriptLoad(skipRequeuScript)
        console.log('[LUA] ✅ Loaded skipRequeue, SHA:', this.luaScripts.skipRequeue);
        
        this.luaScripts.cleanup = await this.redis.scriptLoad(cleanupScript)
        console.log('[LUA] ✅ Loaded cleanup, SHA:', this.luaScripts.cleanup);
      } catch (scriptErr) {
        console.error('[LUA] ❌ Failed to load scripts to Redis:', scriptErr.message);
        throw scriptErr;
      }
      
      console.log('[LUA] 🎯 Starting periodic cleanup...');
      this.startPeriodicCleanup()
      
      // ✅ CRITICAL: Clear stale queue on startup to prevent ghost matches
      try {
        const staleQueueSize = await this.redis.lLen(this.QUEUE_KEY);
        if (staleQueueSize > 0) {
          console.log(`[LUA] 🧹 Clearing ${staleQueueSize} stale queue entries from previous session`);
          await this.redis.del(this.QUEUE_KEY);
          console.log('[LUA] ✅ Stale queue cleared');
        }
      } catch (clearErr) {
        console.warn('[LUA] ⚠️ Could not clear stale queue:', clearErr.message);
      }
      
      console.log('[LUA] ========== ALL LUA SCRIPTS LOADED SUCCESSFULLY ==========');
      console.log('[LUA] ✅✅✅ Lua initialization complete ✅✅✅');
    } catch (error) {
      console.error('\n[LUA] ========== LUA INITIALIZATION FAILED ==========');
      console.error('[LUA] ❌ Failed to load Lua scripts:', error.message);
      console.error('[LUA] ❌ Error details:', error);
      console.error('[LUA] ❌ Stack trace:', error.stack);
      console.error('[LUA] ❌ Node.js version:', process.version);
      console.error('[LUA] ❌ Platform:', process.platform);
      console.warn('[LUA] ⚠️ Continuing with inline Lua fallback...');
      console.warn('[LUA] ⚠️ This should still work but performance may be affected');
      console.warn('[LUA] ⚠️ If you see this repeatedly, check:');
      console.warn('[LUA]    1. Redis connection is healthy');
      console.warn('[LUA]    2. File permissions on Lua files');
      console.warn('[LUA]    3. Lua files exist in: backend/services/redis/');
      console.warn('[LUA] ========================================');
      // Don't throw - continue with inline Lua
      this.luaScripts.atomicPop = null; // Mark as not loaded
    }
  }

  async addUserToQueue(userId, userData) {
    try {
      console.log(`\n[QUEUE] ========== ADDUSERTOQUE CALLED ==========`);
      console.log(`[QUEUE] User ID: ${userId}`);
      console.log(`[QUEUE] Socket ID: ${userData?.socketId}`);
      
      // ✅ CRITICAL: Check Redis connection health before proceeding
      try {
        const pingResult = await this.redis.ping();
        console.log(`[QUEUE] ✅ Redis ping result:`, pingResult);
      } catch (pingErr) {
        console.error(`[QUEUE] ❌ CRITICAL: Redis not responding to ping:`, pingErr.message);
        throw new Error(`Redis connection failed: ${pingErr.message}`);
      }
      
      // ✅ CRITICAL: Check if user is already in queue
      const existing = await this.redis.get('waiting:' + userId)
      if (existing) {
        console.log(`[MATCHING] ⚠️ User ${userId} already in queue, skipping duplicate add`);
        const queueSize = await this.redis.lLen(this.QUEUE_KEY)
        return { user: null, partner: null, isMatch: false, queueSize }
      }
      
      const userEntry = JSON.stringify({ userId, socketId: userData.socketId, timestamp: Date.now() })
      const timestamp = Date.now()
      
      console.log(`[QUEUE] 🔥 Checking for existing match...`);
      
      // ⚡ ATOMIC MATCH CHECK: Use Lua to atomically check queue and match
      // This prevents race conditions where multiple users check simultaneously
      const luaScript = `
        local queueKey = KEYS[1]
        local waitingPrefix = KEYS[2]
        local matchedPrefix = KEYS[3]
        local newUserId = ARGV[1]
        local newEntry = ARGV[2]
        local timeout = tonumber(ARGV[3])
        
        -- Get queue length
        local queueLen = redis.call('llen', queueKey)
        local skipSetKey = 'recentSkips:' .. newUserId
        
        if queueLen > 0 then
          -- ✅ SCAN queue for a VALID partner (not self, not recently skipped)
          local matchedEntry = nil
          local fallbackEntry = nil
          
          for i = 0, queueLen - 1 do
            local entry = redis.call('lindex', queueKey, i)
            if entry then
              local success, parseData = pcall(function() return cjson.decode(entry) end)
              if success and parseData and parseData.userId then
                -- ✅ CRITICAL: Skip self-matching (same userId = same account)
                if parseData.userId ~= newUserId then
                  -- Check if this user was recently skipped
                  local wasSkipped = redis.call('sismember', skipSetKey, parseData.userId)
                  if wasSkipped == 0 then
                    -- Perfect match! Not self, not recently skipped
                    matchedEntry = entry
                    break
                  end
                end
              end
            end
          end
          
          if matchedEntry then
            -- Remove the matched entry from queue
            redis.call('lrem', queueKey, 1, matchedEntry)
            
            local partner = {}
            local success2, partnerData = pcall(function() return cjson.decode(matchedEntry) end)
            if success2 and partnerData then
              partner = partnerData
            else
              partner.userId = 'unknown'
              partner.socketId = 'unknown'
            end
            
            -- Mark both as matched
            redis.call('setex', matchedPrefix .. newUserId, timeout, partner.userId)
            redis.call('setex', matchedPrefix .. partner.userId, timeout, newUserId)
            
            -- Remove from waiting
            redis.call('del', waitingPrefix .. newUserId)
            redis.call('del', waitingPrefix .. partner.userId)
            
            return {
              'MATCHED',
              partner.userId,
              partner.socketId,
              tostring(redis.call('time')[1])
            }
          end
        end
        
        -- No valid match found (or only self in queue), add to queue
        -- But first: remove any existing entry for this user to prevent duplicates
        local existingEntries = redis.call('lrange', queueKey, 0, -1)
        for _, entry in ipairs(existingEntries) do
          local ok, d = pcall(function() return cjson.decode(entry) end)
          if ok and d and d.userId == newUserId then
            redis.call('lrem', queueKey, 0, entry)
          end
        end
        
        redis.call('rpush', queueKey, newEntry)
        redis.call('setex', waitingPrefix .. newUserId, timeout, '1')
        
        local newQueueSize = redis.call('llen', queueKey)
        return { 'WAITING', tostring(newQueueSize) }
      `
      
      console.log(`[QUEUE] 📝 Lua script prepared (${luaScript.length} bytes)`);
      console.log(`[QUEUE] 🚀 Executing Lua match check with userId=${userId}`);
      
      let result;
      try {
        result = await this.redis.eval(luaScript, 3, this.QUEUE_KEY, this.WAITING_PREFIX, this.MATCHED_PREFIX, userId, userEntry, 3600)
        console.log(`[QUEUE] 📋 Lua result:`, result);
      } catch (evalErr) {
        console.error(`[QUEUE] ❌ Lua eval failed:`, evalErr.message);
        console.error(`[QUEUE] ❌ Attempting fallback: manual queue check...`);
        
        // FALLBACK: Manual queue operations if Lua fails
        const queueSize = await this.redis.lLen(this.QUEUE_KEY);
        console.log(`[QUEUE] 📊 Queue size (fallback):`, queueSize);
        
        if (queueSize > 0) {
          // Try to pop from queue manually
          const firstEntry = await this.redis.lPop(this.QUEUE_KEY);
          if (firstEntry) {
            try {
              const partner = JSON.parse(firstEntry);
              console.log(`[QUEUE] ✅ FALLBACK: Found partner ${partner.userId}`);
              
              // ✅ Check if partner was recently skipped (anti-rematch)
              try {
                const wasSkipped = await this.redis.sIsMember(`recentSkips:${userId}`, partner.userId);
                if (wasSkipped) {
                  console.log(`[QUEUE] 🚫 FALLBACK: Partner ${partner.userId} was recently skipped, putting back in queue`);
                  await this.redis.rPush(this.QUEUE_KEY, firstEntry);
                  // Add current user to queue instead
                  await this.redis.rPush(this.QUEUE_KEY, userEntry);
                  await this.redis.setEx(`${this.WAITING_PREFIX}${userId}`, 3600, '1');
                  const newQueueSize = await this.redis.lLen(this.QUEUE_KEY);
                  return { isMatch: false, user: { userId }, queueSize: newQueueSize };
                }
              } catch (skipCheckErr) {
                console.warn(`[QUEUE] ⚠️ Could not check recentSkips:`, skipCheckErr.message);
              }
              
              // Mark both as matched
              await this.redis.setEx(`${this.MATCHED_PREFIX}${userId}`, 3600, partner.userId);
              await this.redis.setEx(`${this.MATCHED_PREFIX}${partner.userId}`, 3600, userId);
              await this.redis.del(`${this.WAITING_PREFIX}${userId}`);
              await this.redis.del(`${this.WAITING_PREFIX}${partner.userId}`);
              
              return {
                isMatch: true,
                partner: {
                  userId: partner.userId,
                  socketId: partner.socketId
                },
                matchTime: Date.now(),
                queueSize: 0
              };
            } catch (parseErr) {
              // Put them back if parsing fails
              await this.redis.rPush(this.QUEUE_KEY, firstEntry);
              throw new Error(`Failed to parse partner data: ${parseErr.message}`);
            }
          }
        }
        
        // Add current user to queue (fallback)
        await this.redis.rPush(this.QUEUE_KEY, userEntry);
        await this.redis.setEx(`${this.WAITING_PREFIX}${userId}`, 3600, '1');
        const newQueueSize = await this.redis.lLen(this.QUEUE_KEY);
        
        return { isMatch: false, user: { userId }, queueSize: newQueueSize };
      }
      
      if (result && result[0] === 'MATCHED') {
        console.log(`[MATCHING] 🎉 INSTANT MATCH via Lua: ${userId} ↔️ ${result[1]}`);
        return {
          isMatch: true,
          partner: {
            userId: result[1],
            socketId: result[2]
          },
          matchTime: parseInt(result[3]),
          queueSize: 0
        }
      } else {
        const queueSize = parseInt(result[1]) || 0
        console.log(`[MATCHING] ⏳ User ${userId} added to queue. Queue size: ${queueSize}`);
        return { isMatch: false, user: { userId }, queueSize }
      }
    } catch (error) {
      console.error(`[QUEUE] ❌ Error in addUserToQueue:`, error.message);
      console.error(`[QUEUE] ❌ Error details:`, error);
      console.error(`[QUEUE] ❌ Stack:`, error.stack);
      throw error
    }
  }

  async skipUser(userId, partnerId, userEntry, userData, prisma = null) {
    try {
      console.log(`[SKIP] 🔄 Processing skip for ${userId}, partner: ${partnerId}`)
      
      // Use passed prisma or fall back to this.prisma
      const dbClient = prisma || this.prisma

      const nowMs = Date.now()
      const today = new Date(nowMs)
      today.setHours(0, 0, 0, 0)
      const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      const nextMidnight = new Date(today)
      nextMidnight.setDate(today.getDate() + 1)
      const ttlSeconds = Math.max(1, Math.ceil((nextMidnight.getTime() - nowMs) / 1000))
      const skipCounterKey = `skipped:${userId}:${todayKey}`
      
      // Check if user has unlimited skip (premium feature)
      let hasUnlimitedSkip = false
      if (dbClient) {
        try {
          const user = await dbClient.users.findUnique({
            where: { id: userId },
            select: {
              has_unlimited_skip: true,
              unlimited_skip_expires_at: true
            }
          })
          
          if (user && user.has_unlimited_skip) {
            // Check if subscription hasn't expired
            if (user.unlimited_skip_expires_at && new Date(user.unlimited_skip_expires_at).getTime() > nowMs) {
              hasUnlimitedSkip = true
              console.log(`[SKIP] ✅ User ${userId} has active unlimited skip`)
            } else {
              console.log(`[SKIP] ⏰ User ${userId} unlimited skip has expired at ${user.unlimited_skip_expires_at}`)
            }
          }
        } catch (dbErr) {
          console.error(`[SKIP] ⚠️ Error checking premium status:`, dbErr.message)
          // Continue with normal skip limit if we can't check premium status
        }
      }
      
      // Check skip limit - but skip if user has unlimited skip
      if (!hasUnlimitedSkip) {
        const skipCount = await this.redis.get(skipCounterKey)
        const currentSkips = parseInt(skipCount) || 0
        if (currentSkips >= 5) {
          console.log(`[SKIP] ⛔ Skip limit reached for ${userId} (${currentSkips} skips)`)
          return { success: false, skipCount: currentSkips, limitReached: true }
        }
      } else {
        console.log(`[SKIP] 🎉 Skipping limit check - user has unlimited skip`)
      }

      // ✅ CRITICAL: Delete both users' match keys
      console.log(`[SKIP] 🗑️ Deleting match keys for ${userId} and ${partnerId}`)
      await this.redis.del(`matched:${userId}`)
      await this.redis.del(`matched:${partnerId}`)
      
      // ✅ Clear prefetch cache for both users to prevent stale matches
      await this.redis.del(`prefetch:${userId}`)
      await this.redis.del(`prefetch:${partnerId}`)
      
      // ✅ Requeue BOTH users with new entries
      const currentTime = Date.now()
      const userEntry1 = JSON.stringify({ userId, socketId: userData?.socketId || 'unknown', timestamp: currentTime })
      const userEntry2 = JSON.stringify({ userId: partnerId, socketId: 'pending', timestamp: currentTime })
      
      console.log(`[SKIP] 📥 Requeueing ${userId} to global queue`)
      await this.redis.rPush(this.QUEUE_KEY, userEntry1)
      
      // Increment skip counter (even for unlimited users, for analytics)
      const skipCount = await this.redis.get(skipCounterKey)
      const currentSkips = parseInt(skipCount) || 0
      const newSkipCount = currentSkips + 1
      await this.redis.incr(skipCounterKey)
      await this.redis.expire(skipCounterKey, ttlSeconds)
      
      // Get updated queue size
      const queueSize = await this.redis.lLen(this.QUEUE_KEY)
      console.log(`[SKIP] ✅ Skip successful. Queue size: ${queueSize}`)
      
      // ✅ ANTI-REMATCH: Track recent skips for both users (60s TTL)
      try {
        const skipKeyA = `recentSkips:${userId}`;
        const skipKeyB = `recentSkips:${partnerId}`;
        await this.redis.sAdd(skipKeyA, partnerId);
        await this.redis.expire(skipKeyA, 60);
        await this.redis.sAdd(skipKeyB, userId);
        await this.redis.expire(skipKeyB, 60);
        console.log(`[SKIP] 🚫 Anti-rematch: ${userId} ↔ ${partnerId} blocked for 60s`);
      } catch (skipTrackErr) {
        console.error(`[SKIP] ⚠️ Failed to track recent skip:`, skipTrackErr.message);
        // Non-critical, continue
      }
      
      return { 
        success: true, 
        skipCount: newSkipCount,
        queueSize,
        bothUsersRequeued: true,
        matchKeysDeleted: true,
        prefetchCleared: true,
        hasUnlimitedSkip
      }
    } catch (error) {
      console.error(`[SKIP] ❌ Error during skip:`, error)
      return { success: false, error: error.message }
    }
  }

  async refreshQueue(userId, userEntry) {
    try {
      await this.redis.lRem(this.QUEUE_KEY, 0, userEntry)
      await this.redis.rPush(this.QUEUE_KEY, userEntry)
      return true
    } catch (error) {
      return false
    }
  }

  async prefetchNextCandidate(userId) {
    try {
      const nextUserEntry = await this.redis.lIndex(this.QUEUE_KEY, 0)
      if (nextUserEntry) {
        // ✅ CRITICAL: Validate candidate isn't already matched
        const nextUser = JSON.parse(nextUserEntry)
        const isAlreadyMatched = await this.redis.get(`matched:${nextUser.userId}`)
        
        if (isAlreadyMatched) {
          console.log(`[PREFETCH] ⚠️ Candidate ${nextUser.userId} already matched, skipping prefetch`)
          return null
        }
        
        await this.redis.setEx('prefetch:' + userId, 10, nextUserEntry)
        console.log(`[PREFETCH] ✅ Cached next candidate for ${userId}: ${nextUser.userId}`)
        return nextUserEntry
      }
      return null
    } catch (error) {
      console.error(`[PREFETCH] Error:`, error)
      return null
    }
  }

  async getPrefetchedCandidate(userId) {
    try {
      const prefetched = await this.redis.get('prefetch:' + userId)
      if (prefetched) {
        const candidate = typeof prefetched === 'string' ? JSON.parse(prefetched) : prefetched
        
        // ✅ CRITICAL: Validate prefetched candidate is still valid
        // Check 1: Still in queue
        const stillInQueue = await this.redis.lPos(this.QUEUE_KEY, prefetched)
        if (stillInQueue === null) {
          console.log(`[PREFETCH] ⚠️ Prefetched user no longer in queue, invalidating cache`)
          await this.redis.del('prefetch:' + userId)
          return null
        }
        
        // Check 2: Not already matched to someone else
        const alreadyMatched = await this.redis.get(`matched:${candidate.userId}`)
        if (alreadyMatched) {
          console.log(`[PREFETCH] ⚠️ Prefetched user already matched to ${alreadyMatched}, invalidating cache`)
          await this.redis.del('prefetch:' + userId)
          return null
        }
        
        console.log(`[PREFETCH] ✅ Using valid prefetched candidate for ${userId}: ${candidate.userId}`)
        return candidate
      }
      return null
    } catch (error) {
      console.error(`[PREFETCH] Error retrieving prefetched candidate:`, error)
      return null
    }
  }

  async _createSession(user1, user2) {
    const sessionId = user1.userId + ':' + user2.userId
    await this.redis.setEx('session:' + sessionId, 3600, JSON.stringify({ user1Id: user1.userId, user2Id: user2.userId, startedAt: Date.now(), user1SocketId: user1.socketId, user2SocketId: user2.socketId }))
  }

  startPeriodicCleanup() {
    this.cleanupInterval = setInterval(async () => {
      try {
        const beforeCleanup = await this.redis.dbSize()
      } catch (error) {
        console.error('Cleanup error:', error)
      }
    }, 10000)
  }

  async handleUserDisconnect(userId) {
    try {
      console.log(`[DISCONNECT] 🔌 Cleaning up for user ${userId}`)
      
      // Remove user from queue by searching for their entry
      const items = await this.redis.lRange(this.QUEUE_KEY, 0, -1)
      for (const item of items) {
        const parsed = JSON.parse(item)
        if (parsed.userId === userId) {
          await this.redis.lRem(this.QUEUE_KEY, 1, item)
          console.log(`[DISCONNECT] ✅ Removed ${userId} from queue`)
          break
        }
      }
      
      // ✅ Clean ALL keys associated with this user
      const keysToDelete = [
        `waiting:${userId}`,
        `matched:${userId}`,
        `skipped:${userId}`,
        `prefetch:${userId}`,
        `session:${userId}`
      ]
      
      for (const key of keysToDelete) {
        const deleted = await this.redis.del(key)
        if (deleted) console.log(`[DISCONNECT] 🗑️ Deleted ${key}`)
      }
      
      // Verify queue size after cleanup
      const queueSize = await this.redis.lLen(this.QUEUE_KEY)
      console.log(`[DISCONNECT] ✅ Cleanup complete. Queue size: ${queueSize}`)
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  async getQueueStats() {
    try {
      const total = await this.redis.lLen(this.QUEUE_KEY)
      return { total, waiting: total, description: total + ' users in queue' }
    } catch (error) {
      return { total: 0 }
    }
  }

  async clearAllQueues() {
    try {
      await this.redis.del(this.QUEUE_KEY)
    } catch (error) {
      console.error('Clear error:', error)
    }
  }

  async disconnect() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval)
    await this.redis.disconnect()
  }
}

export default MatchingServiceOptimized
