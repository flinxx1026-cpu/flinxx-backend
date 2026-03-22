# 📋 4-User Test Scenario - Step by Step

This document provides exact steps to reproduce and verify the fix for the matching queue imbalance issue.

## Test Setup

### Prerequisites
- 4 browser windows or tabs open
- Backend running: `npm start` (from backend folder)
- Frontend running: `npm run dev` (from frontend folder)
- Redis running: `redis-server` or Docker Redis
- Test users: TestA, TestB, TestC, TestD

### Monitors
Have these commands ready in separate terminal windows:

```bash
# Terminal 1: Watch queue size
watch -n 1 'redis-cli LLEN queue:global'

# Terminal 2: Watch match keys
watch -n 1 'redis-cli KEYS matched:\*'

# Terminal 3: Watch waiting keys
watch -n 1 'redis-cli KEYS waiting:\*'

# Terminal 4: Backend logs
tail -f backend.log
```

---

## Test Scenario: A ↔ B Match, Then Skip

### Phase 1: Initial Setup (Users A and B Match)

**Step 1**: Open 2 browser windows
- Browser 1: Login as TestA
- Browser 2: Login as TestB

**Step 2**: Start matching
- In both browsers, click "Find Match" button
- Should see matching animation in both

**Step 3**: Verify match
- **Expected**: Both users see each other on video chat
- **Check logs**: Backend should show:
  ```
  [MATCHING] ⚡ INSTANT MATCH!
     TestA ↔️ TestB
  ```
- **Check Redis**:
  ```bash
  # Terminal should show:
  matched:TestA → TestB
  matched:TestB → TestA
  queue:global = [] (empty)
  ```

---

### Phase 2: User A Skips (The Critical Test)

**Step 4**: User A initiates skip
- In Browser 1 (TestA), click "Skip" button
- Watch backend logs closely

**Expected backend output**:
```
[MATCH_SKIP] 👉 TestA skipped current partner TestB
[MATCH_SKIP] 📊 Queue size BEFORE skip: 0
[MATCH_SKIP] ✅ TestA skip successful!
[MATCH_SKIP] 📊 Match keys deleted: true
[MATCH_SKIP] 📊 Both users requeued: true
[MATCH_SKIP] 📊 Queue size AFTER skip: 2
[MATCH_SKIP] 📥 Requeuing partner TestB...
[MATCH_SKIP] ✅ Partner requeued. Queue size now: 2
[MATCH_SKIP] 📢 Notifying partner TestB via socket
```

**Step 5**: Verify both users are requeued
- **Browser 1 (TestA)**: Should show "Back in queue! Finding next match..."
- **Browser 2 (TestB)**: Should show message about partner skipping and return to waiting
- **Check logs**: Should see:
  ```
  [MATCH_SKIP] 📊 Queue size AFTER skip: 2
  ```
  - This means BOTH users are back in queue (count = 2)

**Redis verification**:
```bash
# Terminal 1 should show: 2
# Terminal 2 should show: [] (no matched keys)
# Terminal 3 should show: waiting:TestA, waiting:TestB
```

✅ **If you see queue size = 2 after skip, VERIFICATION POINT #2 and #3 PASSED!**

---

### Phase 3: New Match (Users C and D)

**Step 6**: Open 2 more browsers
- Browser 3: Login as TestC
- Browser 4: Login as TestD

**Step 7**: Start matching for C and D
- Click "Find Match" in both browsers
- **Expected**: C should match with D (not with A or B yet)
- **Check logs**: Should show:
  ```
  [MATCHING] ⚡ INSTANT MATCH!
     TestC ↔️ TestD
  ```

**Redis state should now be**:
```bash
matched:TestC → TestD
matched:TestD → TestC
queue:global = [ TestA_entry, TestB_entry ]
```

---

### Phase 4: Verify No Queue Imbalance

**Step 8**: Check that A and B are still waiting
- Both Browser 1 and Browser 2 should still show "Finding next match..."
- Queue size should be 2 (A and B waiting)

✅ **If A and B are still in queue waiting, VERIFICATION POINT #1 PASSED!**

---

### Phase 5: C Skips (Second Skip Operation)

**Step 9**: C initiates skip
- In Browser 3 (TestC), click "Skip"
- Watch backend logs

**Expected output**:
```
[MATCH_SKIP] 👉 TestC skipped current partner TestD
[MATCH_SKIP] 📊 Queue size BEFORE skip: 2
[MATCH_SKIP] ✅ TestC skip successful!
[MATCH_SKIP] 📊 Queue size AFTER skip: 3
[MATCH_SKIP] 📥 Requeuing partner TestD...
[MATCH_SKIP] ✅ Partner requeued. Queue size now: 4
```

**Step 10**: Verify queue growth
- Queue size should be: 2 (A, B from before) + 1 (C) + 1 (D) = 4
- **This shows BOTH C and D are in queue!**

✅ **If queue size is 4, VERIFICATION POINT #2 PASSED AGAIN!**

---

### Phase 6: Expected Rematch Scenario

**Step 11**: Wait for new matches
- With 4 users in queue, matching should happen automatically
- **Expected**: Either A↔C & B↔D, or A↔D & B↔C

**Check logs for**:
```
[MATCHING] ⚡ INSTANT MATCH!
   TestA ↔️ TestC

[MATCHING] ⚡ INSTANT MATCH!
   TestB ↔️ TestD
```

✅ **If rematches happen correctly, ALL VERIFICATION POINTS PASSED!**

---

## Verification Checklist

|#|Verification Point|Expected|Actual|Status|
|---|---|---|---|---|
|1|Old match keys deleted|`matched:*` keys empty after skip|?|[ ]|
|2|Both users requeued|Queue size +2 after skip|?|[ ]|
|3|No users stuck in busy state|Both users show "Finding match..." message|?|[ ]|
|4|Prefetch safe|No double matches from prefetch|?|[ ]|
|5|Queue size correct|LLEN queue:global matches actual users|?|[ ]|

---

## Advanced Verification

### Redis Commands to Run

Between each phase, run these commands to verify state:

```bash
# Phase 1 - After A↔B match
redis-cli GET matched:TestA
redis-cli GET matched:TestB
redis-cli LLEN queue:global
redis-cli LRANGE queue:global 0 -1

# Phase 2 - After A skips
redis-cli KEYS matched:\*
redis-cli LLEN queue:global
redis-cli LRANGE queue:global 0 -1

# Phase 3 - After C↔D match
redis-cli LLEN queue:global
redis-cli GET matched:TestC

# Phase 4 - After C skips
redis-cli LLEN queue:global
redis-cli KEYS matched:\*
```

### Expected Output Progression

```
Phase 1: matched:TestA→TestB, matched:TestB→TestA, queue size = 0
Phase 2: matched:* empty, queue size = 2 (A, B)
Phase 3: matched:TestC→TestD, queue size = 2 (A, B waiting)
Phase 4: matched:* empty, queue size = 4 (A, B, C, D)
Phase 5: matched:TestA→TestC (or other pairing), queue size = 2
```

---

## Common Issues & Diagnostics

### Issue: Queue size stuck at 1 after skip
**Problem**: Only one user requeued (likely the skipping user)
**Check**: `[MATCH_SKIP] 📊 Queue size AFTER skip:` line in logs
**Fix**: Ensure partner is being explicitly requeued

### Issue: Matched keys not deleted after skip
**Problem**: Users have `matched:*` keys but queue size increases
**Check**: 
```bash
redis-cli KEYS matched:*
redis-cli GET matched:TestA  # Should be nil
```
**Fix**: Verify `await redis.del()` calls are working

### Issue: User sees "Finding next match..." but doesn't match with others
**Problem**: User might be in orphaned state
**Check**: 
```bash
redis-cli LRANGE queue:global 0 -1 | grep TestX
```
**If missing**: User wasn't properly added to queue
**Fix**: Manually add to development queue for debugging

### Issue: Prefetch is causing double matches
**Problem**: User appears in two matches simultaneously
**Check**: Backend logs don't show validation
**Fix**: Ensure `getPrefetchedCandidate()` validates all checks

---

## Success Criteria

✅ **Test passes if ALL of these are true**:

1. After A skips from B: backend logs show "Queue size AFTER skip: 2"
2. After C skips from D: backend logs show "Queue size AFTER skip: 4"
3. Redis `KEYS matched:*` shows zero keys between skips
4. All 4 users are eventually matched with each other (in different pairings)
5. No user is stuck on "Finding match..." screen forever
6. No console errors in any browser

---

## Test Duration

- Full test should take: ~2-3 minutes
- Per phase: ~30 seconds
- Hotspot: Phase 2-5 (after skips)

---

## Log Parser Script

For automated verification, create a simple log parser:

```bash
# Find all skip operations
grep "\[MATCH_SKIP\]" backend.log | grep "Queue size AFTER"

# Expected output:
# [MATCH_SKIP] 📊 Queue size AFTER skip: 2
# [MATCH_SKIP] 📊 Queue size AFTER skip: 4
```

---

## Regression Test

After deploying to production, run this weekly:

1. Have 4 test accounts
2. Run through all phases
3. Check no "user stuck" reports in metrics
4. Verify average match time is < 500ms
5. Check Redis key count doesn't balloon

---

## Generated: 2026-03-12
## Next Steps: Follow this test, then deploy ✅
