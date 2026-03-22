# 🧪 REAL TEST GUIDE - 2-5 Concurrent Users

## ⚡ Quick Start (5 Minutes)

### Step 1: Start Redis (1 min)
```bash
cd c:\Users\nikhi\Downloads\joi\flinxx
docker-compose up redis
# Wait for: redis_1  | * Ready to accept connections
```

### Step 2: Start Backend (1 min)
```bash
# NEW TERMINAL
cd c:\Users\nikhi\Downloads\joi\flinxx\backend
npm start

# Expected logs:
# Server running on port 5000
# Redis connected
# Lua scripts loaded
```

### Step 3: Start Frontend (1 min)
```bash
# NEW TERMINAL
cd c:\Users\nikhi\Downloads\joi\flinxx\frontend

# If not built:
npm run build

# Serve or deploy (for testing, use local dev server)
npm run dev
# Should show: http://localhost:5173 (or similar)
```

### Step 4: Open Test Windows (1 min)
```
Open in Browsers:
- Chrome Window 1: localhost:5173 (User A)
- Chrome Window 2: localhost:5173 (User B)
- Chrome Window 3: localhost:5173 (User C) [optional]
- etc...

Max 5 windows for this test
```

### Step 5: Open DevTools (1 min)
```
Each browser window:
F12 → Console tab
→ Filter by emoji (🔮, ⚡, 🧊) to track ICE
```

---

## 🎬 Test Scenario (10 Minutes)

### **Scenario 1: Basic Match + WebRTC Connection**

**User A - Steps:**
1. Click "Start Matching" button
   - Console should show: `🔮 [ICE] Preparing peer connection...`
   - Wait 1s for: `🔮 [ICE] Gathering complete`

2. Wait for match (< 100ms or up to 30s)
   - Should see: `[HOOK] Match found: {partnerId: "User B", ...}`
   - WebRTC should connect within 0.5-1s

**User B - Steps:**
1. Click "Start Matching" button
   - Same ICE gathering as User A

2. Match should appear automatically
   - Both users should see video

**Verification:**
- ✅ Both users connected within 1.5s total
- ✅ Video/audio streaming works
- ✅ No console errors

---

### **Scenario 2: Skip Optimization (Prefetch Test)**

**User A - Steps:**
1. While connected to User B, click "Skip" button
   - Backend logs should show ONE of:
     - `[MATCH_SKIP] 🔮 PREFETCH HIT!` (prefetch worked!)
     - `[MATCH_SKIP] 🔍 No prefetch` (fallback to queue)
   - Frontend console should show: `match:requeued`

2. Should see new user almost instantly (< 50ms)

**User C - Steps:**
1. Already waiting in queue from Scenario 1
2. When User A skips, User A should match with User C
3. Connection should be fast (because prefetch!)

**Verification:**
- ✅ Skip completes in < 100ms
- ✅ See "PREFETCH HIT" message at least once
- ✅ New user matches instantly

---

### **Scenario 3: Cleanup Test (8 Second Timeout)**

**User A - Steps:**
1. Click "Start Matching"
   - Console: `🔮 [ICE] Pre-connected PC ready`

2. DO NOT interact for 8 seconds
   - After 8s: Console should show: `🔮 [ICE] Cleanup: Closing unused PC`

3. Then click match
   - Should see: `🔮 [ICE] Pre-connected PC ready` (new one created)
   - Matches should still work

**Verification:**
- ✅ Cleanup message appears after 8s
- ✅ No memory buildup (check Task Manager)
- ✅ New PC created, matching still works

---

### **Scenario 4: Multiple Users (Max Stress Test)**

**User A, B, C, D, E - Steps:**
1. All open start-matching page
2. Press "Start Matching" in sequence (2 sec apart)
   - A: Start
   - Wait 2s
   - B: Start
   - Wait 2s
   - C: Start
   - etc...

3. Observe in backend logs:
   ```
   Prefetch count = ✅ Seen
   Match count = ✅ All matched
   Cleanup = ✅ Unused PCs cleaned
   ```

4. Each pair matches and connects

**Verification:**
- ✅ All 5 users matched
- ✅ No errors or crashes
- ✅ Backend CPU stable
- ✅ Memory not growing

---

## 📊 Live Monitoring Dashboard

### **Terminal 1 - Backend Logs**
```bash
npm start

Watch for patterns:
- 🟢 "started matching" - User joined
- ⚡ "INSTANT MATCH" - Users matched
- 🔮 "PREFETCH" - Cache working
- 🧊 "ICE" - ICE gathering
- 🗑️ "Cleanup" - PC closing
```

### **Terminal 2 - Redis Monitor**
```bash
redis-cli
MONITOR

Watch for patterns:
- RPUSH queue:global - Users added to queue
- SETEX prefetch:* - Prefetch cache set
- DEL queue:global - Queue operations
- LLEN queue:global - Queue size
```

### **Terminal 3 - Network Monitor (Optional)**
```bash
# Right-click browser → Inspect → Network tab
# Watch for WebRTC connection establishment
# Should see ICE candidates flowing
```

---

## ✅ Success Checklist

During test, confirm ALL of these:

- [ ] **Redis**: Connected without errors
- [ ] **Backend**: Running on port 5000
- [ ] **Frontend**: Loaded in browser
- [ ] **ICE Pre-Gather**: Console shows `[ICE] Preparing...`
- [ ] **Match Found**: Users matched in < 100ms
- [ ] **WebRTC Connect**: Connected in 0.5-1s
- [ ] **Prefetch Hit**: Saw `PREFETCH HIT` at least once
- [ ] **Skip Latency**: Skip responded in < 100ms
- [ ] **Cleanup**: Saw `Cleanup: Closing` after 8s timeout
- [ ] **No Crashes**: Server stayed running
- [ ] **No Console Errors**: Frontend had no red errors
- [ ] **Video Works**: Could see/hear other user

---

## 🚨 If Something Goes Wrong

### Problem: "Redis connection failed"
```bash
# Fix: Make sure Redis is running
docker-compose ps
# Should show redis running

docker-compose up redis
```

### Problem: "PREFETCH cached/using not shown in logs"
```bash
# This is OK if skips are failing
# But likely means:
# 1. No one is skipping yet
# 2. Go to Scenario 2 (Skip Test)
```

### Problem: "WebRTC not connecting"
```bash
# Check browser console for ICE errors
# Check firewall/network (might block STUN/TURN)
# Manually refresh page and retry
```

### Problem: "Server crashed after ~1 minute"
```bash
# Check error message
# Likely Redis timeout or memory issue
# Restart: npm start
# Check docker: docker-compose logs redis
```

### Problem: "PC cleanup not showing"
```bash
# Normal if users keep pressing buttons
# Cleanup only happens if PC unused for 8s
# Test: Press Start Matching, wait 10s without clicking
# Should see cleanup message
```

---

## 📈 Performance Targets (For Reference)

| Operation | Target | Status |
|-----------|--------|--------|
| Start → ICE Prepare | <5ms | ✅ Backend instant |
| ICE Gathering | 0.5-1s | ✅ Typical for 10 candidates |
| Match Found | <100ms | ✅ Queue lookup + atomic ops |
| Prefetch Hit Match | 30-50ms | ✅ Redis lookup only |
| Prefetch Miss Match | 50ms | ✅ Queue fallback |
| WebRTC Connection | 0.5-1s | ✅ ICE + handshake |
| Total Time (Start → Talking) | 1-2s | ✅ Acceptable |

---

## 🎯 Key Things to Watch For

1. **Prefetch Hit Rate** - Count logs:
   ```bash
   grep "PREFETCH HIT" backend_logs.txt | wc -l
   grep "match:skip" backend_logs.txt | wc -l
   Hit_Rate = (hits / total_skips) * 100
   Target: 80-90%
   ```

2. **Connection Time Progression**
   - 1st match: ~1s (gathering from scratch)
   - 2nd match: ~0.5s (prefetched candidates)
   - 3rd+ matches: ~0.5s (consistent)

3. **Server Stability**
   - CPU should stay low (<30%)
   - Memory should not grow (prefetch TTL clears old keys)
   - No Redis errors

4. **Consistency Across Users**
   - All users should experience similar timing
   - No one user stuck waiting

---

## 📝 Test Report Template

After test, fill this out:

```
Test Date: ___________
Total Users Tested: ___
Test Duration: _____ minutes

RESULTS:
Match Count: ___
Skip Count: ___
Prefetch Hits: ___
Prefetch Misses: ___
Avg Connection Time: ___ ms
Max Connection Time: ___ ms
Min Connection Time: ___ ms

Issues Found:
- [ ] None
- [ ] Minor (video lag)
- [ ] Major (crash)
  Details: ___________

Ready for Production: YES / NO
```

---

## 🚀 When Ready to Deploy

After successful test:

1. Commit code: `git add -A && git commit -m "Skip + ICE optimization live test passed"`
2. Push: `git push origin main`
3. Deploy to production environment
4. Monitor: Alert on CPU > 50% or prefetch TTL failures

---

**Good luck! You've got this.** 🎬✨
