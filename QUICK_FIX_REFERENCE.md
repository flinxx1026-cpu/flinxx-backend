# Quick Reference - Socket.IO Token Auth Fix

## What Was Fixed

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Socket connection rejected | No token passed | Socket initialized AFTER login with token from localStorage |
| Token unavailable at module load | Firebase auth async | Moved socket init to AuthContext after Firebase completes |
| Backend rejected connection | No auth middleware | Added `io.use()` middleware to validate token |
| Frontend socket usage broken | Direct import | Changed to `getSocket()` function calls |

---

## How It Works Now

### 1. User Logs In
```
[User clicks Google/Facebook login]
         ↓
[Firebase authentication completes]
         ↓
[AuthContext.useEffect onAuthStateChanged fires]
```

### 2. Token is Extracted & Stored
```javascript
// In AuthContext.jsx
const idToken = await firebaseUser.getIdToken()
localStorage.setItem('idToken', idToken)
```

### 3. Socket Initializes with Token
```javascript
// In socketService.js  
initializeSocket()
// Reads token from localStorage
const token = localStorage.getItem('idToken')
// Passes to Socket.IO
const socket = io(URL, { auth: { token } })
```

### 4. Backend Validates Token
```javascript
// In server.js
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Not authenticated'))
  next() // Connection allowed
})
```

---

## Key Changes Summary

### socketService.js
- ❌ OLD: `const socket = io(...)` at module level
- ✅ NEW: Export `initializeSocket()` and `getSocket()` functions

### AuthContext.jsx  
- ✅ NEW: Import `initializeSocket`
- ✅ NEW: Call `initializeSocket()` after storing idToken

### Chat.jsx & Matching.jsx
- ❌ OLD: `import socket from '../services/socketService'`
- ✅ NEW: `import { getSocket } from '../services/socketService'`
- ✅ NEW: `const socket = getSocket()` at component level

### server.js
- ✅ NEW: Added auth middleware:
```javascript
io.use((socket, next) => {
  if (!socket.handshake.auth.token) 
    return next(new Error('Not authenticated'))
  next()
})
```

---

## Verification Checklist

- [ ] Backend running: `npm start` in backend folder
- [ ] Frontend running: `npm run dev` in frontend folder  
- [ ] Browser: Navigate to `http://localhost:3003`
- [ ] Login: Sign in with Google or Facebook
- [ ] Console: See `✅ Socket connected successfully!`
- [ ] Backend console: See `✅ Socket authenticated with token`
- [ ] Proceed to matching/chat screen: Should work now

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Socket not initialized" error | Make sure you're logged in first |
| "Not authenticated - no token provided" | Wait a moment after login, token might not be stored yet |
| Socket connects then immediately disconnects | Check that token is actually in localStorage |
| Backend says "connection attempt without token" | Frontend Socket.IO not sending auth handshake |

---

## Files to Check

✅ **frontend/src/services/socketService.js** - Socket initialization logic
✅ **frontend/src/context/AuthContext.jsx** - Token extraction & storage
✅ **frontend/src/pages/Chat.jsx** - Socket event handlers
✅ **frontend/src/pages/Matching.jsx** - Socket event handlers  
✅ **backend/server.js** - Auth middleware

---

## Testing Socket Connection

### Browser Console (F12)
```javascript
// Check if token is stored
localStorage.getItem('idToken')

// Should return: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4..."
```

### Backend Console
```
✅ Socket authenticated with token for [socket-id]
✅ User connected: [socket-id]
📊 Active connections: 1
```

### Backend Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```
