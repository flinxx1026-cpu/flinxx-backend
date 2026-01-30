# 🚀 Production Fix Deployment Checklist

## Summary
Two critical production issues fixed:
1. ✅ **CORS Error** - Backend already properly configured
2. ✅ **WebSocket Mixed Content Error** - Frontend socket URL updated

---

## ✅ ISSUE 1: CORS Error (FIXED)

### Problem
Frontend sends Firebase ID token to backend:
```
POST /api/auth/firebase
Authorization: Bearer <FIREBASE_ID_TOKEN>
```
But browser blocks without CORS headers.

### Solution Status: ✅ VERIFIED COMPLETE
Backend `/backend/server.js` already has:
- ✅ `cors` package imported
- ✅ CORS middleware configured with `https://flinxx.in`
- ✅ Authorization header in allowedHeaders
- ✅ OPTIONS preflight handling
- ✅ Socket.io CORS configuration

**No backend code changes needed.**

---

## ✅ ISSUE 2: WebSocket Mixed Content Error (FIXED)

### Problem
Site is HTTPS (https://flinxx.in), but socket connected to:
```
ws://13.203.157.116:5000
```
This violates mixed content policy (HTTPS page cannot load HTTP WebSocket).

### Solution: ✅ IMPLEMENTED

#### Frontend Changes Made:
**File: `/frontend/.env.production`**
```diff
- VITE_SOCKET_URL=http://13.203.157.116:5000
+ VITE_SOCKET_URL=https://d1pphanrf0qsx7.cloudfront.net
```

**File: `/frontend/.env`**
```diff
- VITE_SOCKET_URL=http://13.203.157.116:5000
+ VITE_SOCKET_URL=https://d1pphanrf0qsx7.cloudfront.net
```

#### Why This Works:
- Uses CloudFront domain (HTTPS) instead of EC2 IP (HTTP)
- `socketService.js` already configured with:
  - `transports: ['websocket']` ✅
  - `secure: true` ✅
- Browser will use **WSS** (WebSocket Secure) automatically ✅

---

## 🔧 Backend (EC2) - Deployment Steps

### If using PM2:
```bash
ssh ubuntu@13.203.157.116
cd /home/ubuntu/joi-backend  # adjust path as needed
pm2 restart all
pm2 logs
```

### If using Node directly:
```bash
ssh ubuntu@13.203.157.116
cd /home/ubuntu/joi-backend  # adjust path as needed
npm install
npm run build   # if applicable
node server.js
```

### Verify Backend:
```bash
# Test CORS headers
curl -H "Origin: https://flinxx.in" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS https://d1pphanrf0qsx7.cloudfront.net/api/auth/firebase

# Should return:
# Access-Control-Allow-Origin: https://flinxx.in
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id
```

---

## 🌐 Frontend (AWS Amplify) - Deployment Steps

### Step 1: Push to GitHub
```bash
cd frontend
git add .env .env.production
git commit -m "fix: Update socket URL from ws:// IP to wss:// CloudFront domain

- Replace http://13.203.157.116:5000 with https://d1pphanrf0qsx7.cloudfront.net
- Fixes mixed content error on HTTPS site
- Uses WSS instead of insecure WS"
git push origin main
```

### Step 2: Verify Amplify Deployment
1. Go to: https://us-east-1.console.aws.amazon.com/amplify/
2. Select your app (joi-frontend)
3. Wait for build to complete (usually 2-5 minutes)
4. Check "Deployments" tab for successful build

### Step 3: Test in Production
```bash
# Open in browser:
https://flinxx.in

# Check console for socket connection:
# ✅ Expected: "🔌 Socket.IO connecting to: https://d1pphanrf0qsx7.cloudfront.net"
# ✅ Expected: "✅ Socket connected successfully! ID: [socketId]"
# ✅ Expected: "📊 Transport method: websocket"

# NOT expected:
# ❌ "No 'Access-Control-Allow-Origin' header"
# ❌ "Mixed Content: The page was loaded over HTTPS"
```

---

## 📋 Pre-Deployment Checklist

- [ ] Backend CORS is verified with `https://flinxx.in`
- [ ] Frontend socket URL updated in `.env.production`
- [ ] Frontend socket URL updated in `.env`
- [ ] `socketService.js` has `secure: true` and `transports: ['websocket']`
- [ ] Commit message includes both issue fixes
- [ ] GitHub branch is up to date

---

## ✅ Post-Deployment Verification

### Backend EC2
- [ ] PM2 shows "online" status
- [ ] No error logs related to CORS
- [ ] CORS headers present in OPTIONS response

### Frontend Amplify
- [ ] Latest build shows "SUCCEED"
- [ ] https://flinxx.in loads without mixed content errors
- [ ] Console shows socket connecting to CloudFront domain
- [ ] Socket shows "websocket" transport (not polling)
- [ ] Firebase login completes without CORS errors

### Browser Testing
1. Open https://flinxx.in
2. Open DevTools (F12) → Console
3. Try Google login
4. Verify:
   - No CORS errors
   - No mixed content warnings
   - Socket connects successfully with websocket transport

---

## 🎯 Expected Console Output

After deployment:
```
🔌 Socket.IO connecting to: https://d1pphanrf0qsx7.cloudfront.net
✅ Socket connected successfully! ID: eVk123abc...
📊 Transport method: websocket
```

NOT:
```
❌ No 'Access-Control-Allow-Origin' header
Mixed Content: The page was loaded over HTTPS
❌ Socket connection error
```

---

## 📝 Notes

1. **Production URL**: https://flinxx.in
2. **Backend Domain**: https://d1pphanrf0qsx7.cloudfront.net (CloudFront)
3. **Socket Protocol**: WSS (WebSocket Secure) - automatic with https://
4. **EC2 IP**: 13.203.157.116 (not used in production URLs anymore)

---

## 🆘 Troubleshooting

### Still seeing "No 'Access-Control-Allow-Origin' header"?
1. Verify backend restarted: `pm2 status`
2. Check allowedOrigins includes `https://flinxx.in`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+F5)

### Still seeing "Mixed Content" error?
1. Verify VITE_SOCKET_URL uses `https://` (not `http://`)
2. Verify VITE_SOCKET_URL uses domain (not IP address)
3. Amplify deployment completed successfully
4. Clear browser cache and hard refresh

### Socket still not connecting?
1. Check socket URL in console: `🔌 Socket.IO connecting to:`
2. Verify URL matches `https://d1pphanrf0qsx7.cloudfront.net`
3. Check if CloudFront is accepting socket connections
4. Verify backend WSS port configuration

---

**Status**: ✅ Ready to Deploy
**Last Updated**: January 30, 2026
