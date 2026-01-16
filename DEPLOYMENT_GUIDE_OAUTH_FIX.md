# Deployment Guide: OAuth Redirect Fix

## Prerequisites
- Render account with access to backend deployment
- Vercel account with access to frontend deployment
- Git access to repository

## Step 1: Deploy Backend to Render (CRITICAL)

The backend changes are **CRITICAL** - without them, the OAuth flow won't work.

### Option A: Automatic Deployment (Recommended)
Render is configured to auto-deploy on git push. The changes have already been pushed, so:

1. Go to https://dashboard.render.com/
2. Click on "flinxx-backend" service
3. Check the "Deploys" tab
4. Look for a deployment with commit message: "Add fast path in AuthContext..."
5. Wait for deployment to complete (shows "Live" status)

### Option B: Manual Deployment
1. In Render dashboard, click "flinxx-backend" service
2. Click "Manual Deploy" button
3. In the dropdown, select "main" branch
4. Click "Deploy latest commit"
5. **IMPORTANT**: This will clear build cache. Wait for full rebuild (~5-10 minutes)

### Verify Backend Deployment
1. After deployment is "Live", test the backend:
   ```bash
   curl https://flinxx-backend.onrender.com/health
   # Should return 200 OK or similar
   ```
2. Check backend logs in Render for messages like:
   - "✅ [AUTH/GOOGLE/CALLBACK] Token saved, redirecting to /chat"
   - "[PROFILE API] ✅ JWT token verified"

## Step 2: Deploy Frontend to Vercel

### Automatic Deployment
Vercel is configured to auto-deploy on git push. The changes should already be deploying:

1. Go to https://vercel.com/dashboard
2. Click "flinxx-backend-frontend" project
3. Check the "Deployments" tab
4. Look for deployment with commit: "Add fast path in AuthContext..."
5. Wait for status to show "Ready"

### Manual Deployment
```bash
# From project root
cd frontend
npm run build
vercel --prod
```

### Verify Frontend Deployment
1. Navigate to https://flinxx-backend-frontend.vercel.app
2. Open browser DevTools → Console
3. Log in with Google/Facebook
4. Watch console for messages:
   - "[AuthContext] FAST PATH COMPLETE"
   - "[ProtectedChatRoute] ✅ AuthContext loaded with user"

## Step 3: End-to-End Testing

### Test Google OAuth Login
1. Go to https://flinxx-backend-frontend.vercel.app
2. Click "Login with Google"
3. Sign in with Google account
4. Click "Continue"

**Expected Results**:
- ✅ Redirected to `/chat` (dashboard page)
- ✅ Should see "SoloX" and "DuoX" buttons
- ✅ NO redirect to landing page
- ✅ Browser console shows "[AuthContext] FAST PATH COMPLETE"

**Actual Result** (what you reported):
- ❌ Redirected to landing page (image #2 from your screenshots)

### Test Facebook OAuth Login
Same steps as Google, but click "Login with Facebook"

**Expected Results**: Same as Google

### Test Active Users Count
1. After logging in successfully, go to Chat page
2. Backend should call `/api/user/profile` to update `last_seen`
3. Check database:
   ```sql
   SELECT 
     COUNT(*) as active_users_5min,
     MAX(last_seen) as latest_last_seen
   FROM users 
   WHERE last_seen > NOW() - INTERVAL '5 minutes';
   ```
4. Should show:
   - `active_users_5min`: > 0
   - `latest_last_seen`: Current timestamp

**Current Issue**: Always shows 0 (because users aren't redirected to dashboard)

## Step 4: Debugging If Issues Persist

### Scenario 1: Still redirected to landing page

**Debug Steps**:
1. Open DevTools Console (F12 → Console)
2. Clear console
3. Log in with Google/Facebook
4. Look for console messages starting with "[AuthContext]" or "[ProtectedChatRoute]"

**Expected Output**:
```
[AuthContext] INITIALIZATION STARTED
[AuthContext] Current path: /
[AuthContext] STEP 1: Quick check for stored token/user
[AuthContext]   - token: ✓ Found
[AuthContext]   - user: ✓ Found
[AuthContext] FAST PATH: Both token and user found in localStorage
[AuthContext] ✅ Valid UUID found in localStorage: [first 8 chars]...
[AuthContext] ✅ FAST PATH COMPLETE - User loaded from localStorage

[ProtectedChatRoute] 🟢 RENDER CALLED
[ProtectedChatRoute] ✅ AuthContext loaded with user: [your-email]
```

**If INSTEAD you see**:
```
[ProtectedChatRoute] ❌ AuthContext finished loading but NO USER found
[ProtectedChatRoute] Redirecting to /login
```

**Cause**: localStorage is not being populated. Check:
- Backend callback is returning HTML (not redirecting)
- Frontend receives HTML and runs JavaScript
- localStorage.token should be visible

**Check localStorage**:
```javascript
// In DevTools Console:
console.log('token:', localStorage.getItem('token'))
console.log('user:', localStorage.getItem('user'))
console.log('authProvider:', localStorage.getItem('authProvider'))
```

### Scenario 2: Token format errors

**Error Message**: "Invalid token format" or "JWT verification failed"

**Debug Steps**:
1. In browser DevTools, copy token from localStorage:
   ```javascript
   // In DevTools Console:
   copy(localStorage.getItem('token'))
   ```
2. Go to https://jwt.io
3. Paste token in "Encoded" field
4. Check "Decoded" shows:
   - `id`: [36-char UUID]
   - `userId`: [same UUID]
   - `email`: [your email]
   - `publicId`: [some value]
   - `exp`: [future timestamp]

5. If verification fails, check backend logs for:
   - "[AUTH/GOOGLE/CALLBACK] JWT token created"
   - Check JWT_SECRET environment variable is set

### Scenario 3: Redirect works, but last_seen not updating

**Debug Steps**:
1. In browser DevTools Network tab
2. Look for request to `/api/user/profile`
3. Should show status 200
4. Response should have `success: true`
5. Check backend logs for:
   - "[PROFILE API] ✅ JWT token verified"
   - "✅ last_seen updated: [uuid] [timestamp]"

**If Request Returns 401**:
- Token is not being sent in Authorization header
- Check Chat.jsx retrieves token: `localStorage.getItem("token")`
- Verify token is included: `Authorization: Bearer ${token}`

## Rollback Plan

If deployment causes issues:

### Rollback Backend
```bash
# In Render dashboard:
# 1. Click "flinxx-backend" service
# 2. Click "Deployments"
# 3. Find previous successful deployment
# 4. Click "..." menu → "Redeploy"
```

### Rollback Frontend
```bash
# In Vercel dashboard:
# 1. Click "flinxx-backend-frontend" project
# 2. Click "Deployments"
# 3. Find previous successful deployment
# 4. Click "..." menu → "Redeploy"
```

## Monitoring

After deployment, monitor:

1. **Backend Logs** (Render Dashboard → Logs):
   - Look for OAuth callback errors
   - Look for `/api/profile` errors
   - Look for database update failures

2. **Frontend Console**:
   - Test login and check for [AuthContext] messages
   - Check for React errors or warnings

3. **Database**:
   - Monitor `users.last_seen` being updated
   - Monitor active user count increasing

4. **Error Tracking** (if configured):
   - Set up Sentry or similar to track OAuth errors
   - Monitor client-side redirects and routing issues

## Next Steps

1. ✅ Deploy backend to Render (auto-deployed)
2. ✅ Deploy frontend to Vercel (auto-deployed)
3. 🔄 Test OAuth login with Google account
4. 🔄 Verify active users count updates
5. 🔄 Test with multiple accounts
6. 🔄 Monitor for 24 hours

## Support

If issues persist after deployment:

1. Check that BOTH backend and frontend are fully deployed
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache and localStorage:
   ```javascript
   localStorage.clear()
   // Then refresh page
   ```
4. Check that backends are running:
   - Backend: https://flinxx-backend.onrender.com/health
   - Frontend: https://flinxx-backend-frontend.vercel.app

## Summary of Changes

**Backend (`server.js`)**:
- OAuth callbacks (Google/Facebook) now return HTML with JavaScript
- `/api/profile` endpoint now validates JWT tokens (not base64)

**Frontend (`AuthContext.jsx`)**:
- Added fast path to load user from localStorage immediately
- Prevents ProtectedChatRoute from redirecting prematurely

**Result**:
- Users redirect to `/chat` (dashboard) after OAuth login
- `last_seen` gets updated on Chat page load
- Active users count will show > 0
