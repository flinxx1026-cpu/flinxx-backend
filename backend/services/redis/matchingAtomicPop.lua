-- ⚡ ATOMIC MATCHING OPERATION
-- Single operation to find and match 2 users
-- Returns: {user1, user2} or {user1} if only 1 available
--
-- KEYS[1] = main queue name (e.g., 'matching_queue')
-- KEYS[2] = waiting prefix (e.g., 'waiting:')
-- KEYS[3] = matched prefix (e.g., 'matched:')
-- ARGV[1] = timeout seconds (e.g., 30)

local queueKey = KEYS[1]
local waitingPrefix = KEYS[2]
local matchedPrefix = KEYS[3]
local timeout = tonumber(ARGV[1]) or 30

-- Get queue size
local queueSize = redis.call('zcard', queueKey)

if queueSize >= 2 then
  -- ✅ 2+ users available - INSTANT MATCH
  local user1Entry = redis.call('zrange', queueKey, 0, 0)[1]
  local user2Entry = redis.call('zrange', queueKey, 1, 1)[1]
  
  if user1Entry and user2Entry then
    -- Remove both from queue
    redis.call('zrem', queueKey, user1Entry)
    redis.call('zrem', queueKey, user2Entry)
    
    -- Parse user data
    local user1 = cjson.decode(user1Entry)
    local user2 = cjson.decode(user2Entry)
    
    -- Mark as matched
    redis.call('setex', matchedPrefix .. user1.userId, timeout, user2.userId)
    redis.call('setex', matchedPrefix .. user2.userId, timeout, user1.userId)
    
    -- Remove from waiting
    redis.call('del', waitingPrefix .. user1.userId)
    redis.call('del', waitingPrefix .. user2.userId)
    
    return {
      user1Entry,
      user2Entry,
      matched = true,
      matchTime = redis.call('time')[1]
    }
  end
end

-- ❌ Not enough users - return nil
return nil
