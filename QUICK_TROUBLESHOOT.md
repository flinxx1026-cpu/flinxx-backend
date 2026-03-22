# ⚡ Quick Troubleshooting - Prefetch vs Queue Issue

## Issue: User A Stuck Waiting

Check backend logs for:

---

## Scenario 1: PREFETCH HIT Log Dikha ❌

### Example Log:
```
[MATCH_SKIP] ✅ UserA skip successful!
[MATCH_SKIP] 📊 Queue size AFTER skip: 2
[MATCH_SKIP] 🔮 PREFETCH HIT! Candidate available for UserA
```

### Problem Location:
**File**: `backend/services/matchingServiceOptimized.js`  
**Method**: `getPrefetchedCandidate()`  
**Issue**: Prefetch returning invalid/stale user

### Quick Fix:
```javascript
// Verify both checks are running in getPrefetchedCandidate()

// CHECK 1: Is user still in queue?
const stillInQueue = await this.redis.lPos(this.QUEUE_KEY, prefetched)
if (stillInQueue === null) {
  console.log(`[PREFETCH] ⚠️ NOT IN QUEUE anymore - invalidating`)
  await this.redis.del('prefetch:' + userId)
  return null  // ← Should return null here
}

// CHECK 2: Is user already matched?
const alreadyMatched = await this.redis.get(`matched:${candidate.userId}`)
if (alreadyMatched) {
  console.log(`[PREFETCH] ⚠️ ALREADY MATCHED - invalidating`)
  await this.redis.del('prefetch:' + userId)
  return null  // ← Should return null here
}

console.log(`[PREFETCH] ✅ Using valid prefetched candidate`)
return candidate  // ← Only return if BOTH checks pass
```

### Logs You Should See Instead:
```
[PREFETCH] ⚠️ Prefetched user no longer in queue, invalidating cache
OR
[PREFETCH] ⚠️ Prefetched user already matched to UserX, invalidating cache
THEN
[MATCH_SKIP] 🔍 No prefetch, standard queue
```

---

## Scenario 2: Standard Requeue But Queue Size Not Growing ❌

### Example Log:
```
[MATCH_SKIP] ✅ UserA skip successful!
[MATCH_SKIP] 📊 Queue size AFTER skip: 2  ⚠️ Should be 4!
[MATCH_SKIP] 🔍 No prefetch, standard queue
```

### Problem Location:
**File**: `backend/sockets/matchingHandlers.js`  
**Lines**: Around 280-290  
**Issue**: Partner not being requeued

### Quick Fix:
Check if this code is running:

```javascript
// ✅ After skip, requeue partner explicitly
if (partnerQueueData) {
  console.log(`[MATCH_SKIP] 📥 Requeuing partner ${partnerId}...`)
  await redis.rPush('queue:global', partnerQueueData.entry)
  const queueSizeAfterPartner = await redis.lLen('queue:global')
  console.log(`[MATCH_SKIP] ✅ Partner requeued. Queue size now: ${queueSizeAfterPartner}`)
} else {
  console.log(`[MATCH_SKIP] ⚠️ Partner queue data not available`)
}
```

### Logs You Should See:
```
[MATCH_SKIP] 📊 Queue size AFTER skip: 2
[MATCH_SKIP] 📥 Requeuing partner UserB...
[MATCH_SKIP] ✅ Partner requeued. Queue size now: 4  ← This should be 4!
```

### If You Don't See "Partner requeued" Message:
Check: Is `partnerQueueData` null?

```javascript
// Earlier in skip handler, store partner data
const partnerQueueData = userQueueData.get(partnerId)
if (!partnerQueueData) {
  console.log(`[MATCH_SKIP] ⚠️ Partner data missing!`)
}
```

---

## Redis Commands to Debug

### Check: Is queue growing properly?
```bash
redis-cli LLEN queue:global
# Should show: 2 → 4 → 2 → 4 (as users skip)
```

### Check: Are matched keys getting deleted?
```bash
redis-cli KEYS matched:*
# Should be EMPTY after skip
# If shows users: problem in deletion
```

### Check: Is partner in queue?
```bash
redis-cli LRANGE queue:global 0 -1 | grep UserB
# Should find partner's entry
```

---

## 2-Minute Diagnostic

Run this **while** doing the skip:

```bash
# Terminal 1: Watch queue size
watch -n 0.5 'redis-cli LLEN queue:global'

# Terminal 2: Watch matched keys
watch -n 0.5 'redis-cli KEYS matched:* | wc -l'

# Terminal 3: Stream backend logs
tail -f backend.log | grep -E "\[MATCH_SKIP\]|Queue size|Partner requeue|PREFETCH"
```

**Timeline**:
1. Before skip: queue=2, matched=2
2. During skip: Queue size AFTER skip should show 2 or 4
3. After partner requeue: matched=0, queue should grow

---

## Most Common Issues

### Issue 1: Prefetch returning stale user
**Sign**: PREFETCH HIT but A never matches  
**Location**: `getPrefetchedCandidate()` missing validations  
**Fix**: Add both checks (in queue + not matched)

### Issue 2: Partner not requeued
**Sign**: Queue size stays 2 after skip  
**Location**: Partner requeue code not executing  
**Fix**: Verify `partnerQueueData` exists and `rPush` is called

### Issue 3: Matched keys not deleted
**Sign**: B matches with C while A waiting  
**Location**: Match key deletion in `skipUser()`  
**Fix**: Add explicit delete for both users before requeue

---

## Copy-Paste: Add Detailed Logging

If you don't see these logs, add them:

```javascript
// In skipUser() - add at start
console.log(`[SKIP] Processing skip for ${userId}, partner: ${partnerId}`)

// Before skip limit check
console.log(`[SKIP] Current skips: ${currentSkips}`)

// After deleting matches
console.log(`[SKIP] 🗑️ Deleted matched:${userId} and matched:${partnerId}`)

// At the end
console.log(`[SKIP] ✅ Skip complete. Queue size now: ${queueSize}`)
```

---

## Status Check

Answer these to diagnose:

**Q1**: Do you see `Queue size AFTER skip` in logs?
- YES → Go to Q2
- NO → `skipUser()` not completing or not logging

**Q2**: Does queue size increase by 2?
- YES → Both users requeued ✅
- NO → Partner not requeued → Add partner requeue logging

**Q3**: Do you see `PREFETCH HIT`?
- YES → Check prefetch validations
- NO → Normal queue working

---

## Generated: 2026-03-12
## Use this for quick diagnosis 🚀
