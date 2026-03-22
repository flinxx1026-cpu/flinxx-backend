# 🧪 Production Testing Guide - 4 Concurrent Users

**Time Required:** 10-15 minutes  
**Difficulty:** Beginner-friendly  
**Goal:** Verify all 6 core features work in real-world scenario

---

## 🎯 Quick Start - 3 Steps

```bash
# Terminal 1: Start Backend
cd flinxx/backend
npm start

# Terminal 2: Start Frontend (wait 5 seconds for backend to be ready)
cd flinxx/frontend
npm run dev

# Browser: Open 4 windows
http://localhost:5173  (4 times, in different browsers/incognito)
```

---

## 📋 Pre-Test Checklist

### System Checks
```bash
# 1. Verify Redis is running (should show stats)
node -e "import('redis').then(({createClient})=>{const r=createClient({url:process.env.REDIS_URL});r.connect().then(()=>r.ping()).then(p=>console.log('PING:',p)).catch(e=>console.log('Error:',e.message))})"

# Expected: PING: PONG ✅

# 2. Check database
psql postgresql://... -c "SELECT COUNT(*) FROM users;"
# Expected: number > 0 ✅

# 3. Verify env variables
cat .env.local | grep -E "REDIS_URL|DATABASE_URL"
# Expected: Both present ✅
```

### Browser Setup
For each of 4 windows:
1. Open DevTools (F12)
2. Go to Console tab
3. Filter for emoji logs: 🟢 🔮 ⚡ ✅ 🧊 ⏳

---

## 🧑‍💻 Test Plan (15 Steps)

### Phase 1: Setup (2 min)

**Step 1: Login with 4 Different Accounts**
```
User A: nikhilydv1026@gmail.com (or Google Sign-in)
User B: different email (or different Google account)
User C: different email
User D: different email

Each should:
  ✅ See your profile
  ✅ See home/matching page
  ✅ Profile shows correctly
```

**Step 2: Verify Backend is Receiving Connections**
```bash
# Check backend logs for:
[SOCKET] 🔗 New connection: socket-123abc...
[SOCKET] 🔗 New connection: socket-456def...
[SOCKET] 🔗 New connection: socket-789ghi...
[SOCKET] 🔗 New connection: socket-000jkl...

Expected: 4 separate socket connections
```

---

### Phase 2: Basic Matching (3-4 min)

**Step 3: Start Matching (All 4 Users)**
```
Timing:
  T=0s:  User A: Click "Start Matching" → Watch console
  T=1s:  User B: Click "Start Matching" → Watch console
  T=2s:  User C: Click "Start Matching" → Watch console
  T=3s:  User D: Click "Start Matching" → Watch console
```

**Expected Logs in Console:**
```
User A Console:
  🟢 webrtc:prepare received
  🧠 ICE gathering starting...
  ⏳ Waiting for match...
  
After 1-5 seconds:
  ✅ Connected to User B!
  🧠 ICE gathering complete
  ✅ Video ready

User B Console:
  🟢 webrtc:prepare received
  🧠 ICE gathering starting...
  ⏳ Waiting for match...
  
After 1-5 seconds:
  ✅ Connected to User A!  (same time as A)
  🧠 ICE gathering complete
  ✅ Video ready
```

**What Should Happen:**
```
✅ A ↔ B should connect (video streams visible)
✅ C ↔ D should connect
✅ Total time: 0.5-1.5 seconds per pair
✅ If > 2s, check: Are STUN/TURN servers reachable?
```

**Backend Logs:**
```
[MATCHING] 🔮 Added User A to queue
[MATCHING] 🔮 Added User B to queue
[MATCHING] 💥 MATCH FOUND: A ↔ B
[MATCHING] 🔮 Prefetch next for A
[MATCHING] 🔮 Prefetch next for B
[MATCHING] 💥 MATCH FOUND: C ↔ D
```

**Step 4: Verify Video Quality**
```
In each chat window:
  ☑ Self video playing
  ☑ Peer video playing  
  ☑ Audio working (speak, hear response)
  ☑ No lag/freezing (should be smooth)

If video frozen:
  ❌ Check: Browser camera permissions
  ❌ Check: Network | WebRTC in DevTools > Network
  ❌ Check: Try different STUN server (fallback to IP)
```

---

### Phase 3: Skip Optimization (5-6 min)

**Step 5: User A Skips (Prefetch Hit Test)**
```
User A clicks "Skip" button
  ↓
What happens:
  🔮 PREFETCH HIT! (in console)
  OR
  ⚡ RPOP fallback (in console)
  
Expected within:
  30-50ms if 🔮 PREFETCH HIT
  50-100ms if ⚡ RPOP
```

**Expected Console Logs:**
```
User A Console:
  🔮 PREFETCH HIT! (instant match)
  [Reconnecting...]
  ✅ Connected to User C!
  🧠 ICE gathering complete

User B Console:
  👻 User disconnected
  ⏳ Back to queue...
  ⏳ Waiting for match...
```

**Backend Logs:**
```
[MATCH_SKIP] User A skipped
[MATCH_SKIP] 🔮 PREFETCH HIT! Rematching...
[MATCHING] 💥 MATCH FOUND: A ↔ C
[MATCHING] 🔮 Prefetch next for A
[MATCHING] 🔮 Prefetch next for C
[MATCHING] ⏳ B back to waiting queue
```

**Step 6: Multiple Skips in Sequence**
```
Timing (Stress Test):
  T=0s:  User A: Skip → Should rematch (30-50ms)
  T=1s:  User C: Skip → Should rematch (30-50ms)
  T=2s:  User D: Skip → Should rematch (30-50ms)
  T=3s:  User B: Skip → Should rematch (30-50ms)
  T=4s:  User A: Skip (2nd) → Should rematch (30-50ms)

All users should NEVER be stuck in "Waiting" state.
```

**What to Count:**
```
Out of 5 skips:
  
  Count 🔮 PREFETCH HIT messages → Target: 4-5 (80%+ hit rate)
  Count ⚡ RPOP fallback messages → Target: 0-1 (20% miss rate)
  
  Measure latency (open DevTools Timing):
    Skip click → Remote user receives disconnect
    Expected: < 100ms
    
    Disconnect received → New match offer
    Expected: 30-100ms
```

**Step 7: Verify Skip Limits**
```
User A taps Skip 5 times rapidly:
  Skip 1: ✅ Success (Rematch)
  Skip 2: ✅ Success (Rematch)
  Skip 3: ✅ Success (Rematch)
  Skip 4: ✅ Success (Rematch)
  Skip 5: ✅ Success (Rematch)
  Skip 6: ❌ "5 skip limit reached"
  
Expected:
  ✅ Modal says "Come back later to skip again"
  ✅ No button available for 6th skip
```

---

### Phase 4: Connection Stability (3-4 min)

**Step 8: Keep Connection for 30 Seconds**
```
A ↔ B connected
  ↓
Leave running for 30 seconds
  ↓
Expected:
  ✅ Video still playing
  ✅ Audio still working
  ✅ No disconnects
  ✅ No "Connection lost" errors
```

**Step 9: Check Cleanup on Disconnect**
```
User A: Closes browser tab
  ↓
What happens:
  User B console:
    👻 Peer disconnected
    ⏳ Back to waiting...
    
  Backend logs:
    🧊 Cleaning up connection for User A
    User A disconnected gracefully
    
  User A data cleared from Redis:
    waiting:UserA → deleted
    matched:UserA → deleted
    prefetch:UserA → deleted
    
Expected: Within 1-2 seconds
```

---

### Phase 5: Stress Test (2-3 min)

**Step 10: Rapid Matching Cycle**
```
Timeline:
  T=0s:   All 4 users in queue
  T=1s:   Start matching
  T=2s:   A ↔ B, C ↔ D (matches complete)
  T=3s:   A skips
  T=4s:   C skips  
  T=5s:   B skips
  T=6s:   D skips
  
Expected:
  ✅ All skips succeed within 50-100ms
  ✅ No users stuck
  ✅ CPU usage stable (< 50%)
  ✅ Memory stable (no leak)
```

**Monitoring:**
```bash
# Terminal: Watch backend CPU/Memory
watch 'ps aux | grep "node.*npm start"'

Expected:
  CPU: 10-30% (not spiking to 100%)
  MEM: ~100-200mb (not growing continuously)
```

---

### Phase 6: Verification Summary (1-2 min)

**Step 11: Check All Logs**

Backend Terminal - Copy these logs:
```bash
npm start 2>&1 | tail -100 | grep -E "MATCHING|PREFETCH|✅|🔮|⚡"

Expected lines:
  ✅ [MATCHING] Lua scripts loaded successfully
  [MATCHING] 💥 MATCH FOUND: A ↔ B
  [MATCH_SKIP] 🔮 PREFETCH HIT!
  [MATCHING] 🔮 Prefetch next for A
```

**Frontend Console (Each User) - Screenshot:**
```
☑ Take screenshot of each browser console
☑ Highlight:
  - 🟢 webrtc:prepare ← Pre-gathering started
  - 🧠 ICE gathering complete ← Candidates ready
  - ✅ Connected ← Peer connection established
  - 🔮 PREFETCH HIT (if skips happened)
```

**Each Browser Should Show:**
```
User A: ✅ Connected to User X | 🔮 PREFETCH HIT (maybe)
User B: ✅ Connected to User Y | ⚡ RPOP fallback (maybe)
User C: ✅ Connected to User Z | 🔮 PREFETCH HIT (maybe)
User D: ✅ Connected to User W | ⚡ RPOP fallback (maybe)
```

---

## ✅ Success Criteria (Check All)

### Performance Metrics
- [ ] First match within 0.5-1.5s
- [ ] Skip rematch within 30-100ms
- [ ] Prefetch hit rate ≥ 75%
- [ ] WebRTC stabilizes within 2s
- [ ] No connection drops during 30s test
- [ ] CPU stays < 50%

### Functionality
- [ ] A ↔ B matching works
- [ ] C ↔ D matching works
- [ ] Skip results in instant rematch
- [ ] Skip limit (5) is enforced
- [ ] Disconnect cleanup works
- [ ] All 4 users can see each other

### Logs & Errors
- [ ] No "ClientClosedError" in logs
- [ ] No "Lua script failed" errors
- [ ] No orphaned connections (🧊 cleanup shows)
- [ ] No memory leaks (MEM stays stable)
- [ ] Backend logs show 🔮 PREFETCH HIT
- [ ] Frontend logs show all 6 expected emoji

### Backend Verification
```bash
# Run final verification
node verify-initialization.js

# Expected output:
# ✅ ALL VERIFICATION CHECKS PASSED
# Summary:
#   ✅ Redis connection: WORKING
#   ✅ Lua scripts: LOADED
#   ✅ Queue operations: WORKING
#   ✅ Prefetch cache: WORKING
#   ✅ TTL management: WORKING
```

---

## 🎯 Go/No-Go Decision

### ✅ GO to Production If:
```
✅ All performance metrics met
✅ All 4 users connected successfully
✅ Skips > 75% PREFETCH HIT
✅ No errors in logs
✅ Connection stable 30s+
✅ All 9 verification points PASS
```

### ❌ NO-GO If:
```
❌ Match takes > 2s per pair
❌ Skip latency > 200ms
❌ Any "ClientClosedError"
❌ Users stuck in waiting
❌ Video freezing/laggy
❌ Memory continuously growing
```

---

## 🐛 Troubleshooting

### Issue: Videos Not Showing
```
Possible Causes:
  1. Camera permission not granted
     → Check browser camera settings
     → Reload page and grant permission
     
  2. STUN servers not reachable (🔴 Network issue)
     → Check Internet connection
     → Check firewall settings
     → Add fallback TURN server IP
     
  3. ICE gathering timeout
     → Check: Are candidates being gathered? (🧠 log)
     → Increase timeout in config
```

### Issue: Skips Taking > 100ms
```
Possible Causes:
  1. Redis latency high
     → Check: redis-cli ping (should be < 5ms)
     → Check: Network to Redis server
     
  2. Prefetch cache expired
     → Normal behavior - logs show ⚡ RPOP fallback
     → Increasing TTL if needed (currently 10s)
     
  3. Queue empty
     → Wait for more users to join
     → Skip will just put you back in queue
```

### Issue: PREFETCH HIT Not Showing
```
This is NORMAL for:
  1. First few skips (cache may not be warmed)
  2. When queue has only 1 user
  3. When skip happens after 10s (TTL expired)

Monitor over 5+ skips to see 80%+ hit rate pattern.
```

### Issue: Users Stuck in "Waiting"
```
Causes:
  1. Only 1 user in queue (nothing to match with)
     → Add more users
     
  2. Redis key deletion failed
     → Check: Redis connection
     → Run: redis-cli FLUSHDB (clear test data)
     → Restart backend
     
  3. Matching service not initialized
     → Check backend logs for: ✅ [MATCHING] Lua scripts loaded
     → If missing: Restart backend
```

### Issue: Backend Crashes
```
Check these files first:
  1. backend/.env.local → REDIS_URL correct?
  2. backend/services/matchingServiceOptimized.js → Syntax error?
  3. backend/sockets/matchingHandlers.js → Handler error?
  
Debug:
  npm start 2>&1 | head -50
  → Check for actual error messages
```

---

## 📊 Monitoring Commands (Copy-Paste Ready)

### Terminal 1: Backend with Filtering
```bash
cd flinxx/backend
npm start 2>&1 | grep -E "MATCHING|PREFETCH|REDIS|✅|❌|🔮"
```

### Terminal 2: Redis Monitor (Optional)
```bash
redis-cli -u rediss://default:gQAA...@dynamic-monarch-68931.upstash.io:6379 MONITOR | grep -E "queue|prefetch"
```

### Terminal 3: Performance Check
```bash
watch -n 1 'ps aux | grep node | grep -v grep | awk "{print \$3, \$6}" | column -t'
# Shows: CPU% MEM(kb) every 1 second
```

---

## ⏱️ Timing Guide

```
Total Test Time: 15 minutes
├─ Setup (2 min)
├─ Basic Matching (4 min)
├─ Skip Optimization (5 min)
├─ Stability (3 min)
└─ Verification (1 min)

Go/No-Go Decision: < 1 minute
```

---

## 🚀 After Testing

If all checks pass:
1. Stop backend (`Ctrl+C`)
2. Stop frontend (`Ctrl+C`)
3. Document results in TESTING_RESULTS.md
4. Ready for production deployment

If any check fails:
1. Check troubleshooting section above
2. Fix issue
3. Run test again from Phase 1
