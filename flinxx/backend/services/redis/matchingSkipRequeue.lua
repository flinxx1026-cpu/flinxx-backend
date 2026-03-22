-- ⚡ ATOMIC SKIP + REQUEUE OPERATION
-- User skips current match, instantly requeue for next match
-- 
-- KEYS[1] = main queue name
-- KEYS[2] = skip counter key
-- KEYS[3] = waiting prefix
-- ARGV[1] = user entry (JSON)
-- ARGV[2] = score (timestamp)
-- ARGV[3] = timeout seconds

local queueKey = KEYS[1]
local skipCounterKey = KEYS[2]
local waitingPrefix = KEYS[3]

local userEntry = ARGV[1]
local score = tonumber(ARGV[2]) or redis.call('time')[1][1] * 1000
local timeout = tonumber(ARGV[3]) or 30

-- Parse user to get userId
local user = cjson.decode(userEntry)
local userId = user.userId

-- Check skip limit (max 5 skips per session)
local skipCount = tonumber(redis.call('incr', skipCounterKey)) or 0

if skipCount > 5 then
  -- ⛔ Too many skips, reject requeue
  redis.call('del', skipCounterKey)
  return {
    requeued = false,
    reason = "skip_limit_exceeded",
    skipCount = skipCount
  }
end

-- ✅ Requeue user INSTANTLY
redis.call('zadd', queueKey, score, userEntry)
redis.call('setex', waitingPrefix .. userId, timeout, 'true')

return {
  requeued = true,
  skipCount = skipCount,
  queueSize = redis.call('zcard', queueKey)
}
