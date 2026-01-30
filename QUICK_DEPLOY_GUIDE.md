# ⚡ QUICK DEPLOY GUIDE (30 minutes)

## The 2 Issues - FIXED

### Issue 1: CORS on Backend ✅
**Status**: Already fixed in code
**Action**: Just restart EC2 server

### Issue 2: WebSocket Mixed Content ✅  
**Status**: Just fixed
**Action**: Push to GitHub, Amplify auto-deploys

---

## 🏃 FASTEST PATH TO DEPLOY (6 steps)

### Step 1: Deploy Backend (2 minutes)
```bash
ssh ubuntu@13.203.157.116
cd joi-backend
pm2 restart all
pm2 logs | grep -i "listening\|error"
# Wait for: ✅ listening on port 10000
```

### Step 2: Push Frontend to GitHub (2 minutes)
```bash
cd frontend
git add .env .env.production
git commit -m "fix: Socket URL wss:// CloudFront domain instead of ws:// IP"
git push origin main
```

### Step 3: Wait for Amplify (3 minutes)
Go to AWS Amplify Console:
- Click app "joi"
- Wait for green checkmark ✅ in Deployments
- See "SUCCEED" status

### Step 4: Clear Browser Cache (1 minute)
```bash
# In browser: Ctrl+Shift+Delete
# Clear: Cookies and cached files
# Time range: All time
```

### Step 5: Test Firebase Login (1 minute)
1. Open https://flinxx.in
2. Click "Google Login"
3. Check console (F12): 
   - ✅ See "🔌 Socket.IO connecting to: https://d1pphanrf0qsx7.cloudfront.net"
   - ✅ See "✅ Socket connected successfully!"
   - ❌ NO "No 'Access-Control-Allow-Origin'" error
   - ❌ NO "Mixed Content" error

### Step 6: Verify Both Issues Fixed ✅
- [ ] Socket connects with WSS (websocket transport)
- [ ] CORS headers present (no cross-origin errors)
- [ ] User can complete Google login
- [ ] Can start a match/call

---

## 🐛 What Changed?

### Backend (NO CHANGES NEEDED)
Already configured in `/backend/server.js`:
- CORS headers for `https://flinxx.in` ✅
- Authorization header support ✅
- OPTIONS preflight handling ✅

### Frontend (2 FILES CHANGED)
```
/frontend/.env.production
/frontend/.env
```

Changed:
```diff
- VITE_SOCKET_URL=http://13.203.157.116:5000
+ VITE_SOCKET_URL=https://d1pphanrf0qsx7.cloudfront.net
```

---

## ✅ BEFORE/AFTER

### ❌ BEFORE (BROKEN)
```
Browser: https://flinxx.in (HTTPS)
Socket: ws://13.203.157.116:5000 (HTTP)
Result: 
  ❌ Mixed content error
  ❌ Connection blocked
  ❌ CORS error (sometimes)
```

### ✅ AFTER (FIXED)
```
Browser: https://flinxx.in (HTTPS)
Socket: https://d1pphanrf0qsx7.cloudfront.net (HTTPS → WSS)
Result:
  ✅ Same origin (same domain)
  ✅ Secure connection (WSS)
  ✅ CORS allowed
  ✅ Connects successfully
```

---

## 📱 Testing Commands

### Backend is running?
```bash
curl https://d1pphanrf0qsx7.cloudfront.net/api/health
# Should return: {"status":"Server is running"}
```

### CORS headers present?
```bash
curl -i -X OPTIONS https://d1pphanrf0qsx7.cloudfront.net/api/auth/firebase \
  -H "Origin: https://flinxx.in" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization"

# Should show:
# Access-Control-Allow-Origin: https://flinxx.in
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### Frontend is deployed?
```bash
curl https://flinxx.in/index.html | grep -i "socket\|VITE_SOCKET_URL"
```

### Socket connects in browser?
```javascript
// Open https://flinxx.in, then in console (F12):
console.log(socket.connected)  // Should be: true or "CONNECTING"
console.log(socket.io.engine.transport.name)  // Should be: "websocket"
```

---

## ⏱️ Timeline

| Step | Time | Status |
|------|------|--------|
| Backend restart | 2 min | Quick ✅ |
| Git push | 2 min | Quick ✅ |
| Amplify build | 3-5 min | Auto ✅ |
| Cache clear | 1 min | Manual |
| Test | 1-2 min | Verify |
| **Total** | **10-15 min** | **Ready** ✅ |

---

## 🎯 Success Criteria

After deployment, ALL of these must be true:

1. https://flinxx.in loads without errors
2. Console shows socket connecting to CloudFront domain (not IP)
3. Socket transport is "websocket" (not "polling")
4. Google login completes without CORS errors
5. User can pair and start a call with another user
6. No mixed content warnings in console
7. No cross-origin errors in console

---

## 🚨 If Something Goes Wrong

### Socket shows "polling" instead of "websocket"?
- CloudFront/ALB might not have WebSocket enabled
- Fallback is OK (polling still works, just slower)
- Verify: Amplify build succeeded

### Still seeing "No 'Access-Control-Allow-Origin'"?
- Backend not restarted: `pm2 restart all`
- Backend logs: `pm2 logs`
- Check if error mentions port 10000

### Still seeing "Mixed Content"?
- Browser cache not cleared (Ctrl+Shift+Delete)
- Amplify build not complete (check AWS console)
- Frontend .env files not updated

### Socket URL shows old IP in console?
- Amplify cache not cleared (happens sometimes)
- Force rebuild: AWS Amplify → Deployments → Redeploy

---

## 📞 Need Help?

Check these files:
- Backend CORS: `/backend/server.js` (lines 210-290)
- Frontend socket: `/frontend/src/services/socketService.js`
- Frontend config: `/frontend/.env` and `/frontend/.env.production`

All ready ✅ Just deploy!
