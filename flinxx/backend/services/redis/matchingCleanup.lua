-- ⚡ CLEANUP EXPIRED/GHOST USERS
-- Remove users whose TTL has expired
-- Prevents ghost users from staying in queue indefinitely
--
-- KEYS[1] = waiting prefix
-- KEYS[2] = matched prefix
-- KEYS[3] = main queue
-- ARGV[1] = timeout seconds

local waitingPrefix = KEYS[1]
local matchedPrefix = KEYS[2]
local queueKey = KEYS[3]
local timeout = tonumber(ARGV[1]) or 30

-- Find all waiting user keys
local cursorAndKeys = redis.call('scan', 0, 'match', waitingPrefix .. '*', 'count', 100)
local cursor = cursorAndKeys[1]
local waitingKeys = cursorAndKeys[2]

local cleanedCount = 0

for _, key in ipairs(waitingKeys) do
  -- Check TTL
  local ttl = redis.call('ttl', key)
  
  if ttl == -1 then
    -- ❌ No TTL set - this is a ghost user, remove it
    redis.call('del', key)
    cleanedCount = cleanedCount + 1
  elseif ttl < 5 then
    -- ⏰ TTL expiring soon (< 5 sec) - let it expire
    -- No action needed
  end
end

-- Also clean matching keys
local matchCursorAndKeys = redis.call('scan', 0, 'match', matchedPrefix .. '*', 'count', 100)
local matchKeys = matchCursorAndKeys[2]

for _, key in ipairs(matchKeys) do
  local ttl = redis.call('ttl', key)
  if ttl == -1 then
    redis.call('del', key)
    cleanedCount = cleanedCount + 1
  end
end

return {
  cleaned = cleanedCount,
  timestamp = redis.call('time')[1]
}
