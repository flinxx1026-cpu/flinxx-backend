# 🎬 DEPLOYMENT ACTION STEPS (Copy-Paste Ready)

**Estimated Time: 15 minutes**

---

## ✅ STEP 1: Verify Changes Are Made

### Check that files have been updated:

```bash
# Terminal 1: Check frontend .env files
cat frontend/.env | grep VITE_SOCKET_URL
# Should show: VITE_SOCKET_URL=https://d1pphanrf0qsx7.cloudfront.net

cat frontend/.env.production | grep VITE_SOCKET_URL  
# Should show: VITE_SOCKET_URL=https://d1pphanrf0qsx7.cloudfront.net
```

**Status**: ✅ Both files already updated

---

## ✅ STEP 2: Commit and Push Frontend Changes

```bash
# Terminal: From workspace root
cd frontend

# Stage the .env files
git add .env .env.production

# Commit with meaningful message
git commit -m "fix: Replace socket URL from ws:// IP to wss:// CloudFront domain

- Change VITE_SOCKET_URL from http://13.203.157.116:5000 to https://d1pphanrf0qsx7.cloudfront.net
- Fixes mixed content error (HTTPS page cannot use HTTP WebSocket)
- Enables secure WSS connection
- Fixes CORS by using same origin (CloudFront domain)"

# Push to main branch
git push origin main

# Wait 1 second...
# Should see: "Branch 'main' set up to track remote branch 'main' from 'origin'"
```

**Status**: ✅ Changes pushed to GitHub

---

## ✅ STEP 3: Watch Amplify Build

**Go to AWS Console:**

1. Open: https://us-east-1.console.aws.amazon.com/amplify/
2. Login if needed
3. Click on your app: **joi** (or whatever it's named)
4. Go to **Deployments** tab
5. Watch the new build:
   - Should see "In progress..." with a spinning circle
   - Wait 3-5 minutes
   - Should change to 🟢 **SUCCEED** (green checkmark)

**What to look for:**
```
Status: SUCCEED ✅
Duration: ~3-5 minutes
Build logs: Should show "Deployment succeeded"
```

**⏰ WAIT: Don't proceed until you see green SUCCEED checkmark**

---

## ✅ STEP 4: Restart Backend on EC2

### Terminal: SSH to EC2 and restart

```bash
# SSH into EC2 instance
ssh -i "your-key.pem" ubuntu@13.203.157.116

# Change to backend directory (adjust path if needed)
cd /home/ubuntu/joi/backend
# OR wherever your backend is deployed

# Restart with PM2
pm2 restart all

# Watch the logs (Ctrl+C to exit)
pm2 logs

# Look for these lines:
# ✅ "📍 Backend initialization starting..."
# ✅ "✅ Prisma Client initialized"
# ✅ "✅ listening on port 10000"
# ✅ "✅ PostgreSQL connected from pool"
# ✅ "✅ Socket.IO server initialized"

# Once you see these, backend is ready
# Press Ctrl+C to exit logs
```

**Status**: ✅ Backend restarted

---

## ✅ STEP 5: Clear Browser Cache

### In Your Browser:

1. **Press**: `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. **Select**: "All time" (time range)
3. **Check**: 
   - ✅ Cookies
   - ✅ Cached images and files
4. **Click**: "Clear data"
5. **Wait**: 2 seconds for cache to clear
6. **Close**: The dialog

**Status**: ✅ Browser cache cleared

---

## ✅ STEP 6: Test in Browser

### Open Production Site:

```bash
# In browser address bar, go to:
https://flinxx.in

# Wait for site to load (should be quick)
```

### Open Developer Tools:

```bash
# Press: F12
# Go to: Console tab
# You should see lines appearing in real-time
```

### Look for These Messages:

```javascript
✅ Should see:
"🔌 Socket.IO connecting to: https://d1pphanrf0qsx7.cloudfront.net"
"✅ Socket connected successfully! ID: [something like eVk123...]"
"📊 Transport method: websocket"

❌ Should NOT see:
"No 'Access-Control-Allow-Origin' header"
"Mixed Content: The page was loaded over HTTPS..."
"❌ Socket connection error"
```

**Status**: ✅ Socket is connecting with correct URL

---

## ✅ STEP 7: Test Google Login

### Click Google Login Button:

1. Find the **"Login with Google"** button (or similar)
2. **Click** it
3. **Wait**: 1-2 seconds for Google popup
4. **Login**: With your test Google account
5. **Watch Console**: Look for Firebase auth messages

### What Should Happen:

```javascript
✅ Console should show:
"🔐 [/api/auth/firebase] Firebase authentication request"
"✅ Firebase token verified successfully"
"✅ User created: [your email]"
OR
"👤 User found, updating last login..."

✅ Page should show:
- Your profile picture
- Your name
- Profile completion screen

❌ Should NOT show:
"No 'Access-Control-Allow-Origin' header"
"CORS error"
"Connection refused"
```

**Status**: ✅ Login successful without CORS errors

---

## ✅ STEP 8: Verify Network Security

### Open DevTools Network Tab:

1. **Press**: F12
2. **Go to**: Network tab
3. **Reload**: Page (F5)
4. **Look for**:
   - WebSocket connection (look for "ws" or "socket.io")
   - Click on it to see details

### Check WebSocket Details:

```
Request URL: wss://d1pphanrf0qsx7.cloudfront.net/socket.io/?...
Status Code: 101 Switching Protocols
Headers:
  Upgrade: websocket
  Connection: Upgrade

✅ Should be:
- wss:// (not ws://)
- d1pphanrf0qsx7.cloudfront.net (not IP address)
- Status 101 (successful upgrade)
```

**Status**: ✅ WebSocket using secure WSS connection

---

## ✅ STEP 9: Full Functional Test

### Test Complete User Flow:

1. **Login**: Google login (already tested above)
2. **Profile**: Complete profile if needed
3. **Find Partner**: Click "Find Partner" or "Start Call"
4. **Check Console**: 
   - Should see WebSocket events
   - Should see user matching messages
   - No CORS errors
5. **Wait for Match**: Wait for another user or test user
6. **Call**: Try to start video call

### Expected Results:

```
✅ Profile loads without errors
✅ Can search for partners
✅ WebSocket updates show in console
✅ Video call initiates without errors
✅ No "Access-Control-Allow-Origin" errors
✅ No "Mixed Content" warnings
```

**Status**: ✅ Full application working

---

## ✅ STEP 10: Verification Checklist

### Before Declaring Success, Verify:

```bash
☑️ Frontend socket URL is https://d1pphanrf0qsx7.cloudfront.net
☑️ Backend has restarted successfully
☑️ Amplify shows "SUCCEED" status
☑️ Browser console shows WSS connection
☑️ Transport method is "websocket" (not "polling")
☑️ Google login completes without CORS errors
☑️ Socket connects to CloudFront domain (not EC2 IP)
☑️ No mixed content warnings in console
☑️ No cross-origin errors in console
☑️ User can complete full app flow
```

**Status**: ✅ All checks passed - Deployment successful!

---

## 🆘 If Something Goes Wrong

### Socket shows wrong URL in console?

```bash
# Check if Amplify actually deployed
1. Go to AWS Amplify console
2. Look at Deployments tab
3. Is status "SUCCEED"? (green checkmark)
4. If not succeeded: Wait 5 more minutes

# If still wrong:
1. Force clear browser cache: Ctrl+Shift+Delete (select "All time")
2. Hard refresh: Ctrl+F5 (not just F5)
3. Open DevTools: F12
4. Go to Application → Storage
5. Click "Clear site data"
6. Reload page
```

### Still seeing "No 'Access-Control-Allow-Origin'"?

```bash
# Check backend logs
ssh -i "your-key.pem" ubuntu@13.203.157.116
pm2 logs | grep -i "cors\|origin\|error"

# If no error, backend is working
# Clear browser cache again and retry

# If error in logs:
1. Kill backend: pm2 kill
2. Check server.js has CORS configured
3. Restart: pm2 start server.js
4. Check logs: pm2 logs
```

### WebSocket transport shows "polling" instead of "websocket"?

```javascript
// This is OK - polling is a fallback
// But verify:
console.log(socket.io.engine.transports)
// Should show: ["websocket", "polling"]
// Websocket should be first and preferred

// If websocket not available:
// CloudFront might not support WebSocket
// Polling still works but slower
// Verify CloudFront/ALB config supports WSS
```

### Backend won't restart?

```bash
# Check if there's an error
pm2 logs | tail -50

# Look for errors like:
# - Port already in use
# - Database connection failed
# - Missing environment variables

# Try manual restart:
pm2 kill
cd /home/ubuntu/joi/backend
npm install  # Just in case
node server.js  # Should see "listening on port 10000"
# Press Ctrl+C to stop
pm2 start server.js --name backend
```

---

## 📊 Success Indicators

### If you see all of these: ✅ SUCCESS

```javascript
// In Browser Console (F12):
✅ "🔌 Socket.IO connecting to: https://d1pphanrf0qsx7.cloudfront.net"
✅ "✅ Socket connected successfully! ID: [something]"
✅ "📊 Transport method: websocket"
✅ Google login completed
✅ Profile loads
✅ No red error messages
✅ No "CORS" or "Mixed Content" warnings

// In Network Tab (F12 → Network):
✅ WebSocket Status: 101 Switching Protocols
✅ URL: wss://d1pphanrf0qsx7.cloudfront.net/...
✅ Headers: Connection: Upgrade
```

### If you see these: ❌ FAILED (Troubleshoot)

```javascript
// In Browser Console:
❌ "No 'Access-Control-Allow-Origin' header"
❌ "Mixed Content: The page was loaded over HTTPS..."
❌ "ws://13.203.157.116:5000" (old IP address)
❌ "Connection refused"
❌ "Transport method: polling" (fallback to slow method)

// In Network Tab:
❌ WebSocket URL shows IP address
❌ WebSocket URL shows ws:// (not wss://)
❌ Status: 403 or 4XX (not 101)
```

---

## 🎯 Final Checklist

Before considering deployment complete:

- [ ] Git push completed successfully
- [ ] Amplify shows green ✅ SUCCEED status
- [ ] Backend restarted with `pm2 restart all`
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Console shows socket connecting to HTTPS domain
- [ ] Console shows websocket transport (not polling)
- [ ] Google login completes without errors
- [ ] No CORS errors in console
- [ ] No mixed content warnings in console
- [ ] Full app flow works (login → profile → find partner)

**When all checkboxes are done: 🎉 Deployment is successful!**

---

## ⏱️ Time Tracking

| Step | Time | Status |
|------|------|--------|
| 1. Verify changes | 1 min | ✅ |
| 2. Git push | 1 min | ✅ |
| 3. Amplify build | 5 min | ⏳ |
| 4. Backend restart | 1 min | ✅ |
| 5. Clear cache | 1 min | ✅ |
| 6. Test socket | 1 min | ✅ |
| 7. Test login | 2 min | ✅ |
| 8. Verify security | 1 min | ✅ |
| 9. Full test | 2 min | ✅ |
| **TOTAL** | **~15 min** | ✅ |

---

## 🚀 You're Ready!

All changes have been made. Follow these 10 steps and you'll have a fully deployed, working production fix!

Questions? Check these reference docs:
- `QUICK_DEPLOY_GUIDE.md` - Overview
- `PRODUCTION_FIXES_SUMMARY.md` - Technical details
- `VISUAL_DEPLOYMENT_GUIDE.md` - Network diagrams
- `EXACT_CHANGES_MADE.md` - What changed

**Deploy with confidence!** ✅
