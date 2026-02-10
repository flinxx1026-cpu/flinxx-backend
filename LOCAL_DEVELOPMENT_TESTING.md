# Local Development Testing Checklist

## Before You Start
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3003
- [ ] Both .env.local files updated with correct ports
- [ ] Browser console open to watch for errors (F12)

---

## Step 1: Verify Backend Configuration

### Run this in backend directory:
```bash
cd backend
echo "=== Backend Configuration ===" 
echo "NODE_ENV: $(grep NODE_ENV .env.local)"
echo "PORT: $(grep 'PORT=' .env.local)"
echo "FRONTEND_URL: $(grep 'FRONTEND_URL=' .env.local)"
echo "GOOGLE_CALLBACK_URL: $(grep GOOGLE_CALLBACK_URL .env.local)"
```

**Expected output:**
```
NODE_ENV: development
PORT: 5000
FRONTEND_URL: http://localhost:3003
GOOGLE_CALLBACK_URL: http://localhost:5000/auth/google/callback
```

---

## Step 2: Verify Frontend Configuration

### Check frontend .env.local:
```bash
cd frontend
grep -E "VITE_BACKEND_URL|VITE_API_URL|VITE_SOCKET_URL" .env.local
```

**Expected output:**
```
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Step 3: Test Backend Connectivity

### Open browser and test these URLs:

1. **Backend is running?**
   - URL: http://localhost:5000
   - Expected: Connection refused or 404 (that's OK, means it's listening)
   
2. **Backend health check:**
   - URL: http://localhost:5000/health (if available)
   - Expected: 200 OK or similar

---

## Step 4: Test Frontend Login Flow

### Make a test change in Dashboard component:
```bash
# File: frontend/src/pages/Chat.jsx
# Find any visible text and add a temporary marker, e.g.:
# Change "Dashboard" to "DASHBOARD-LOCAL-TEST-123"
```

### Test the flow:
1. Navigate to http://localhost:3003
2. Go to http://localhost:3003/login
3. Start browser DevTools (F12)
4. Go to **Console** tab
5. Look for logs like:
   ```
   🔗 [Google] Redirecting to backend OAuth endpoint: http://localhost:5000/auth/google
   ```
6. Click "Login with Google"
7. Watch the console for redirects:
   ```
   ✅ [OAuthSuccess] Token found, decoding JWT...
   ✅ [OAuthSuccess] All data saved successfully - redirecting to /dashboard
   ✅ [OAuthSuccess] NOW REDIRECTING to /dashboard with hard refresh
   ```

---

## Step 5: Verify Dashboard Shows Local Changes

### After successful login:
1. You should see your test marker "DASHBOARD-LOCAL-TEST-123"
2. If you see the marker — **✅ Local development is working!**
3. If you still see "Dashboard" — see troubleshooting below

### To verify further:
1. Ctrl+Shift+Delete → Open DevTools → Application → Storage
2. Check **LocalStorage**:
   - Should have: `authToken`, `user`, `token`
   - Should see your user email
3. Check **Current URL**:
   - Should be: `http://localhost:3003/dashboard`
   - NOT: `https://flinxx.in/dashboard`

---

## Step 6: Network Tab Debugging

### Open DevTools → Network tab, then go through login:

1. **Look for 'google' request:**
   - URL: http://localhost:5000/auth/google
   - Status: 302 or 307 (redirect to Google)

2. **Look for Google OAuth redirect:**
   - URL: accounts.google.com/...
   - Status: 200

3. **Look for callback request:**
   - URL: http://localhost:5000/auth/google/callback?code=...
   - Status: 302 (redirect to /oauth-success)

4. **Look for oauth-success redirect:**
   - URL: http://localhost:3003/oauth-success?token=...
   - Status: 200

5. **Look for dashboard request:**
   - URL: http://localhost:3003/dashboard
   - Status: 200

---

## Troubleshooting

### ❌ Still redirecting to flinxx.in/dashboard?

**Check 1: Backend environment variables**
```bash
# In backend terminal, you should see at startup:
# 📍 FRONTEND_URL will be: http://localhost:3003
# If it shows production URL, this is the issue
```

**Check 2: Backend .env.local is loaded**
```bash
# Restart backend - it should show:
# 📍 NODE_ENV: development
# If it shows "not set", .env.local isn't loading
```

**Check 3: Frontend .env.local is being used**
```bash
# During frontend build/dev, check for:
# Vite should print which mode it's using
# Look in terminal where you ran "npm run dev"
```

**Check 4: Clear cache and restart**
```bash
# Kill both backend and frontend
# Clear browser cache: Ctrl+Shift+Delete
# Select "All time" and "Cookies and cached images/files"
# Restart backend: node server.js
# Restart frontend: npm run dev
```

### ❌ "Invalid redirect URI" from Google?

This means Google OAuth isn't configured for localhost.

**Solution:** 
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Find OAuth 2.0 Credentials used in backend/.env.local
3. Edit it and add: `http://localhost:5000/auth/google/callback`
4. Save and restart backend

### ❌ "Connection refused" on localhost:5000?

**Check if backend is running:**
```bash
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000
```

**If no process on 5000:**
```bash
cd backend
node server.js
```

### ❌ Backend starts but doesn't load environment?

**Make sure you're in the backend directory:**
```bash
pwd  # Should show: .../joi/backend

# Check .env.local exists:
ls -la .env.local

# Should see: .env.local file listed

# Check it has correct content:
cat .env.local | grep "NODE_ENV\|PORT"
# Should show: NODE_ENV=development and PORT=5000
```

---

## Console Logs to Expect

### Frontend (Login page):
```
🔗 [Google] Redirecting to backend OAuth endpoint: http://localhost:5000/auth/google
🔗 [Google] Redirecting to backend OAuth endpoint: http://localhost:5000/auth/facebook
```

### Frontend (OAuth Success Page):
```
🔐 [OAuthSuccess] Page loaded, checking for token in URL...
🔐 [OAuthSuccess] Token found, decoding JWT...
✅ [OAuthSuccess] JWT decoded successfully...
✅ [OAuthSuccess] All data saved successfully...
✅ [OAuthSuccess] NOW REDIRECTING to /dashboard with hard refresh
```

### Backend (During login):
```
📍 Backend initialization starting...
📍 NODE_ENV: development
📍 PORT will be: 5000
🔐 [AUTH/GOOGLE/CALLBACK] Starting Google OAuth callback...
✅ [AUTH/GOOGLE/CALLBACK] Got access token from Google
✅ [AUTH/GOOGLE/CALLBACK] Retrieved user info...
✅ [AUTH/GOOGLE/CALLBACK] Redirecting to /oauth-success with token
```

If you see these logs — **everything is working correctly!**

---

## Quick Test: Edit a Component

1. Open `frontend/src/pages/Chat.jsx`
2. Find a line with visible text and change it:
   ```jsx
   // Change:
   <h1>Dashboard</h1>
   // To:
   <h1>Dashboard - Testing Local Development ✅</h1>
   ```
3. **Reload the page** (browser will auto-refresh or Ctrl+Shift+R)
4. You should see: "Dashboard - Testing Local Development ✅"
5. **Without pushing to production!**

If you see your change — **local development is working perfectly!**

---

## Summary

✅ Backend running on 5000 with NODE_ENV=development
✅ Frontend running on 3003 with .env.local
✅ OAuth redirects to http://localhost:3003
✅ Dashboard shows local changes
✅ **You can now develop without pushing changes to production!**

---

*Last Updated: 2026-02-09*
