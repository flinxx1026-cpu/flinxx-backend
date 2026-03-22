# 🔍 DIAGNOSTIC GUIDE - Skip Operation Logs

## Scenario: User A Waiting Me Tha (A was stuck waiting after skip)

Check backend logs for these patterns:

---

## Pattern 1: PREFETCH HIT - Problem In Prefetch Validation ❌

### Logs Should Show:
```
[MATCH_SKIP] 👉 UserA skipped current partner UserB
[MATCH_SKIP] 📊 Queue size BEFORE skip: 2
[MATCH_SKIP] ✅ UserA skip successful!
[MATCH_SKIP] 📊 Queue size AFTER skip: 2
[MATCH_SKIP] 🔮 PREFETCH HIT! Candidate available for UserA
```

### What This Means:
- ⚠️ Prefetch returned a user
- User was told to wait for prefetch candidate
- **Problem**: Prefetch candidate might have been:
  - Already matched to someone else
  - Not actually in the queue
  - Invalid/stale

### Debug: Check
```javascript
// In getPrefetchedCandidate() - is this user REALLY valid?
const stillInQueue = await this.redis.lPos(this.QUEUE_KEY, prefetched)
const alreadyMatched = await this.redis.get(`matched:${candidate.userId}`)
```

---

## Pattern 2: Standard Requeue - Problem In Queue Operations ❌

### Logs Should Show:
```
[MATCH_SKIP] 👉 UserA skipped current partner UserB
[MATCH_SKIP] 📊 Queue size BEFORE skip: 2
[MATCH_SKIP] ✅ UserA skip successful!
[MATCH_SKIP] 📊 Queue size AFTER skip: 2
[MATCH_SKIP] 🔍 No prefetch, waiting for next available user
```

### What This Means:
- No prefetch available
- User goes to normal queue waiting
- **Problem**: Queue size should be 4 (both users) but shows 2:
  - Check: Did partner get requeued?
  - Check: Is `redis.rPush('queue:global', partnerQueueData.entry)` executing?

### Debug: Check
```javascript
// After skip, did partner requeue?
if (partnerQueueData) {
  await redis.rPush('queue:global', partnerQueueData.entry);
  const queueSizeAfterPartner = await redis.lLen('queue:global');
  // ^ Should show 4 now, not 2!
}
```

---

## Pattern 3: GOOD - Both Users Requeued ✅

### Logs Should Show:
```
[MATCH_SKIP] 👉 UserA skipped current partner UserB
[MATCH_SKIP] 📊 Queue size BEFORE skip: 2
[MATCH_SKIP] ✅ UserA skip successful!
[MATCH_SKIP] 📊 Queue size AFTER skip: 2
[MATCH_SKIP] 📥 Requeuing partner UserB...
[MATCH_SKIP] ✅ Partner requeued. Queue size now: 4
```

### What This Means:
- ✅ Both users properly requeued
- Queue size increased from 2 to 4 (both users added)
- This is GOOD - no problem here
- A will be matched with next available user

---

## Redis Commands to Check State

```bash
# See current queue size
redis-cli LLEN queue:global

# See who's in queue
redis-cli LRANGE queue:global 0 -1

# Check if UserA still has match key (shouldn't if skipped)
redis-cli GET matched:UserA  # Should be NULL

# Check if UserB has match key (shouldn't if skipped)
redis-cli GET matched:UserB  # Should be NULL

# Check prefetch cache
redis-cli GET prefetch:UserA  # Should be NULL if used or expired
```

---

## Log Analysis Flowchart

```
Start
  ↓
See [MATCH_SKIP] logs?
  ├─ NO  → Skip didn't happen or logs filtered
  │        → Check socket connection
  │
  └─ YES → Continue
           ↓
     See "Queue size AFTER skip: X"?
       ├─ NO → Skip method didn't get queue size
       │        → Likely crash in skipUser()
       │
       └─ YES → Continue
                ↓
          Is queue size X = queue before + 2?
            ├─ NO → Queue size didn't increase properly
            │        → Check redis.rPush() for partner
            │        → Check if both users in memory
            │
            └─ YES → Good! Continue
                     ↓
                See "PREFETCH HIT"?
                  ├─ YES → Prefetch being used
                  │         → Check prefetch validation
                  │         → Verify candidate is valid
                  │
                  └─ NO  → Standard queue
                           → Both users should find match
                           → Check waiting time
```

---

## Exact Log Lines by Issue

### Issue: A Stuck Waiting, B Matched to Someone Else

**What Logs Show**:
```
[MATCH_SKIP] 👉 UserA skipped UserB
[MATCH_SKIP] ✅ Skip successful
[MATCH_SKIP] 📊 Queue size AFTER skip: 2 ⚠️ SHOULD BE 4!
```

**Problem**: 
- Partner (B) wasn't requeued
- B shows matched to C instead
- A shows waiting, no match

**Fix to Check**:
```javascript
// In matchingHandlers.js around line 280
if (partnerQueueData) {
  await redis.rPush('queue:global', partnerQueueData.entry);  // Is this running?
}
```

---

### Issue: A Stuck on PREFETCH, No Match Coming

**What Logs Show**:
```
[MATCH_SKIP] 🔮 PREFETCH HIT! Candidate available
```

Then A just waits forever...

**Problem**:
- Prefetch candidate not actually valid
- Likely:
  - User removed from queue between prefetch and use
  - User already matched to someone else

**Fix to Check**:
```javascript
// In getPrefetchedCandidate() - these validations
const stillInQueue = await this.redis.lPos(this.QUEUE_KEY, prefetched)
if (stillInQueue === null) return null  // User no longer in queue!

const alreadyMatched = await this.redis.get(`matched:${candidate.userId}`)
if (alreadyMatched) return null  // User already paired!
```

---

## Search Backend Logs

```bash
# Find all skip operations
grep -n "\[MATCH_SKIP\]" backend.log | head -20

# Find queue size after skip
grep -n "Queue size AFTER skip" backend.log

# Find prefetch operations
grep -n "PREFETCH" backend.log

# Find partner requeue operations
grep -n "Partner requeued" backend.log

# See what happened for specific user
grep "UserA" backend.log | grep -i skip
```

---

## Quick Diagnostic Checklist

When A is stuck waiting:

- [ ] See `[MATCH_SKIP]` log? 
  - NO → Skip event never reached backend
  
- [ ] See "Queue size AFTER skip"?
  - NO → skipUser() crashed or didn't return
  
- [ ] Queue size increased by 2?
  - NO → Partner wasn't requeued → Check `redis.rPush()`
  
- [ ] See "PREFETCH HIT"?
  - YES → Problem in prefetch validation (checks 1 & 2)
  - NO → Problem in regular queue (partner requeue)
  
- [ ] Check Redis:
  ```bash
  redis-cli GET matched:UserA  # Should be NULL
  redis-cli LRANGE queue:global 0 -1  # A should be here
  ```

---

## Sample Complete Good Skip Log

```
[MATCH_SKIP] 👉 UserA skipped current partner UserB
[MATCH_SKIP] 📊 Queue size BEFORE skip: 2
[MATCH_SKIP] ✅ UserA skip successful!
[MATCH_SKIP] 📊 Match keys deleted: true
[MATCH_SKIP] 📊 Prefetch cleared: true
[MATCH_SKIP] 📊 Queue size AFTER skip: 2
[MATCH_SKIP] 📥 Requeuing partner UserB...
[MATCH_SKIP] ✅ Partner requeued. Queue size now: 4
[MATCH_SKIP] 📢 Notifying partner UserB via socket
[MATCH_SKIP] 🔍 No prefetch, waiting for next available user
[MATCH_SKIP] ✅ UserA requeued successfully
```

---

## Commands to Run in Terminal

```bash
# Start monitoring logs in real-time
tail -f backend.log | grep -E "\[MATCH_SKIP\]|Queue size"

# Or for more detail
tail -f backend.log | grep -E "\[MATCH_SKIP\]|PREFETCH|Partner requeue"

# Watch Redis queue in real-time
watch -n 1 'redis-cli LLEN queue:global; echo "---"; redis-cli LRANGE queue:global 0 -1 | head -5'
```

---

## Generated: 2026-03-12
## Use this to diagnose where skip is failing ✅
