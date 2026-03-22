# ✅ PRE-TEST CHECKLIST (Before Running)

## File Integrity (3 min)

- [ ] **matchingServiceOptimized.js** - No syntax errors
  ```bash
  # Verify:
  grep -n "prefetchNextCandidate\|getPrefetchedCandidate" backend/services/matchingServiceOptimized.js
  # Should return 2 hits
  ```

- [ ] **matchingHandlers.js** - Integrations in place
  ```bash
  # Verify:
  grep -n "prefetchNextCandidate\|getPrefetchedCandidate\|webrtc:prepare" backend/sockets/matchingHandlers.js
  # Should return 5 hits
  ```

- [ ] **useVideoMatching.js** - Frontend listener ready
  ```bash
  # Verify:
  grep -n "webrtc:prepare\|preconnectedPC\|iceGatheringComplete" frontend/src/hooks/useVideoMatching.js
  # Should return 10+ hits
  ```

## Environment Setup (2 min)

- [ ] **.env** configured
  ```
  - REDIS_URL set (or default localhost:6379)
  - NODE_ENV=development (for testing)
  - TURN_SERVER=true (for mobile testing later)
  ```

- [ ] **Redis running locally**
  ```bash
  redis-cli ping
  # Should return: PONG
  ```

- [ ] **package.json** has all deps
  ```bash
  npm list | grep redis
  npm list | grep socket.io
  # Both should be listed
  ```

## Build Status (2 min)

- [ ] **Backend compiles**
  ```bash
  npm install  # (if needed)
  npm run build  # (if build step exists)
  ```

- [ ] **Frontend builds**
  ```bash
  cd frontend && npm install  # (if needed)
  npm run build  # Or npm run dev for testing
  ```

## Startup Tests (5 min)

### Test 1: Backend Startup
```bash
cd backend
npm start

Expected output:
✅ Server running on port 5000
✅ Redis connected
✅ Lua scripts loaded successfully
❌ Stop any errors before testing
```

### Test 2: Frontend Load
```bash
# Open browser: localhost:5173 (or http://localhost:3000)
Expected:
✅ Page loads without errors
✅ "Start Matching" button visible
✅ DevTools Console shows no red errors
```

### Test 3: WebSocket Connection
```bash
# Browser Console:
> socket.connected
true  ← Should return true
```

## Redis Verification (2 min)

```bash
redis-cli
> PING
PONG  ← ✅

> SELECT 0
> KEYS *
(empty list or existing keys)  ← ✅

> FLUSHDB  (optional - clears old test data)
OK

> DBSIZE
(integer) 0  ← ✅ Ready for fresh test
```

## Log Preparation (1 min)

```bash
# Create log capture (optional but recommended):

# Terminal 1 - Capture backend logs:
npm start > backend_test_logs.txt 2>&1

# Terminal 2 - Monitor Redis:
redis-cli MONITOR > redis_monitor.txt 2>&1

# Later analyze:
grep "PREFETCH" backend_test_logs.txt
```

## Browser Preparation (2 min)

- [ ] **Chrome/Firefox Dev Tools Ready**
  - F12 → Console tab open
  - Filter enabled for emojis

- [ ] **Multiple browser windows opened**
  - Window 1: localhost:5173 (User A)
  - Window 2: localhost:5173 (User B) - Use different profile/private window
  - Window 3 (optional): User C
  - Etc. up to 5 total

- [ ] **Permissions granted**
  - Microphone: Allow
  - Camera: Allow
  - These may not be needed for signaling test, but good to have

## Final Checks (1 min)

- [ ] System has minimum resources:
  - CPU: < 50% idle
  - RAM: > 500MB free
  - Network: Stable internet connection

- [ ] No conflicting processes running:
  ```bash
  lsof -i :5000  # Should be only our backend
  lsof -i :6379  # Should be only our Redis
  ```

- [ ] Clear understanding of test scenarios:
  - [ ] Scenario 1: Basic match (✅ See both users connect)
  - [ ] Scenario 2: Skip + Prefetch (✅ See "PREFETCH HIT")
  - [ ] Scenario 3: Cleanup (✅ See PC close after 8s)
  - [ ] Scenario 4: Multi-user (✅ 5 users stress test)

---

## GO / NO-GO DECISION

### ✅ PROCEED IF:
- [ ] All file integrity checks passed
- [ ] Backend starts without errors
- [ ] Frontend loads without errors
- [ ] Redis connected and responding
- [ ] All emojis in console showing as expected
- [ ] System resources available

### ⛔ DO NOT PROCEED IF:
- [ ] Any file has syntax errors
- [ ] Backend crash on startup
- [ ] Redis not responding
- [ ] Frontend blank page
- [ ] System under 100MB RAM available

---

## Quick Command Summary

```bash
# Terminal 1 - Redis
docker-compose up redis

# Terminal 2 - Backend
cd c:\Users\nikhi\Downloads\joi\flinxx\backend
npm install  # if needed
npm start

# Terminal 3 - Frontend (Dev)
cd c:\Users\nikhi\Downloads\joi\flinxx\frontend
npm run dev

# Browser Windows
Chrome: localhost:5173 (User A, B, C, D, E)
DevTools F12: Console tab
```

---

## Estimated Timeline

- Checklist completion: **5 min**
- Startup all systems: **3 min**
- Run Scenario 1: **2 min**
- Run Scenario 2: **3 min**
- Run Scenario 3: **2 min**
- Run Scenario 4: **5 min**

**Total: ~20 minutes start to finish**

---

**When✅ ALL boxes checked: START TEST**

```
npm start (terminal 2)
↓
Browser: localhost:5173 (5 windows)
↓
Press "Start Matching" (User A)
↓
Press "Start Matching" (User B)
↓
✅ Connection → Video → Skip → Cleanup
↓
🎉 SUCCESS
```

---

## 🚨 If You Get Stuck

1. **Redis connect error**: `docker-compose up redis` (new terminal)
2. **Port 5000 in use**: `lsof -i :5000` + kill process
3. **Port 6379 in use**: `lsof -i :6379` + kill process
4. **Module not found**: `npm install` in that directory
5. **Can't see console logs**: Press F12 in browser, click Console tab

---

**Ready? Let's test!** 🚀
