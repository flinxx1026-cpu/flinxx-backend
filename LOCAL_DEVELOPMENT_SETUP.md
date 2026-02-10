# Local Development Environment Setup Guide

## Issue: Dashboard Not Reflecting Local Changes

**Problem:** Changes made during local development are visible on:
- ✅ Landing page (http://localhost:3003)
- ✅ Login page (http://localhost:3003/login)
- ❌ Dashboard page (was loading from production flinxx.in/dashboard)

**Root Cause:** The backend OAuth callback was redirecting to production FRONTEND_URL instead of the local development URL.

---

## ✅ Fixed Configuration

### Backend Configuration
**File:** `backend/.env.local`

```
# Local Development
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3003
CLIENT_URL=http://localhost:3003
CLIENT_URL_PROD=http://localhost:3003
BACKEND_URL=http://localhost:5000

# Google OAuth (for localhost testing)
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# Facebook OAuth (for localhost testing)
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
```

**Changes Made:**
- ✅ Updated `GOOGLE_CALLBACK_URL` from `localhost:10000` to `localhost:5000`
- ✅ Updated `GOOGLE_REDIRECT_URI` from `localhost:10000` to `localhost:5000`
- ✅ Updated `FACEBOOK_CALLBACK_URL` from `localhost:10000` to `localhost:5000`
- ✅ Set `NODE_ENV=development` to ensure development mode is active
- ✅ Added `CLIENT_URL_PROD` for fallback redirects

### Frontend Configuration
**File:** `frontend/.env.local`

Currently correct:
```
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:3003
```

### Backend Code Update
**File:** `backend/server.js`

Updated dotenv configuration to load `.env.local` first in development:

```javascript
// Load environment variables - prioritize .env.local for development
if (process.env.NODE_ENV !== 'production') {
  // Try to load .env.local first (development)
  dotenv.config({ path: '.env.local' })
}
// Always load .env as fallback
dotenv.config()
```

---

## 🔄 OAuth Flow (Local Development)

```
1. User clicks "Login with Google" on http://localhost:3003/login
   ↓
2. Frontend redirects to: http://localhost:5000/auth/google
   ↓
3. Backend redirects to: Google OAuth consent screen
   ↓
4. Google redirects back to: http://localhost:5000/auth/google/callback
   ↓
5. Backend redirects to: http://localhost:3003/oauth-success?token=...
   ↓
6. Frontend (oauth-success.jsx) stores token and redirects to: http://localhost:3003/dashboard
   ↓
7. ✅ Dashboard loads with local changes!
```

---

## 📋 Steps to Test Local Development

### 1. Verify Backend is Running on Port 5000
```bash
cd backend
node server.js
```

Check output for:
```
📍 Backend initialization starting...
📍 NODE_ENV: development
📍 PORT will be: 5000
```

### 2. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

Frontend should be accessible at: http://localhost:3003

### 3. Test Login Flow
1. Navigate to http://localhost:3003/login
2. Click "Login with Google"
3. Complete Google OAuth
4. Should redirect to http://localhost:3003/oauth-success
5. Should redirect to http://localhost:3003/dashboard
6. Dashboard should be from localhost (showing your local changes)

### 4. Verify Local Changes
Make a change in `frontend/src/pages/Chat.jsx` (or any dashboard component)
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- **Without redeploying**, the change should appear in your local dashboard

---

## ⚠️ Important: Google OAuth Configuration

### For Local Testing with Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (flinx-8a05e)
3. Go to OAuth 2.0 Credentials
4. Edit the Credentials used in `backend/.env.local`
5. Add these Authorized Redirect URIs:
   ```
   http://localhost:5000/auth/google/callback
   http://localhost:3003
   http://localhost:3003/oauth-success
   ```

### Note:
- The current Google OAuth credentials in `.env.local` may only work with production URLs
- For proper local testing, you might need to create separate OAuth credentials for development
- Alternatively, contact your OAuth provider administrator to add localhost URLs

---

## 🚀 Quick Start Checklist

- [x] Backend PORT set to 5000 in `.env.local`
- [x] Backend FRONTEND_URL set to http://localhost:3003
- [x] Google OAuth callbacks set to localhost:5000
- [x] Frontend VITE_BACKEND_URL set to http://localhost:5000
- [ ] **Manual:** Add localhost:5000 to Google OAuth authorized redirect URIs
- [ ] Restart backend server (if running)
- [ ] Start frontend with `npm run dev`
- [ ] Test login flow → dashboard

---

## 🔍 Troubleshooting

### Issue: "localhost refused to connect"
**Solution:** 
- Ensure backend is running on port 5000
- Run: `netstat -ano | findstr :5000` (Windows) or `lsof -i :5000` (Mac/Linux)
- Kill any process using port 5000 and restart backend

### Issue: Dashboard redirects to flinxx.in
**Solutions:**
- Verify backend.env.local has NODE_ENV=development
- Verify FRONTEND_URL=http://localhost:3003
- Restart backend server to reload environment variables
- Check browser console for redirect URLs being used

### Issue: "Invalid redirect URI" from Google OAuth
**Solution:**
- Add http://localhost:5000/auth/google/callback to Google Cloud Console authorized URIs
- Or create new OAuth2 credentials specifically for localhost testing

### Issue: Cannot connect to backend from frontend
**Solutions:**
- Verify both are running on correct ports:
  - Backend: http://localhost:5000
  - Frontend: http://localhost:3003
- Check CORS settings in `backend/server.js` - ensure http://localhost:3003 is allowed
- Clear browser cache and localStorage
- Open browser DevTools → Network tab to see actual requests

---

## 📝 Environment Variable Reference

| Variable | Backend | Frontend | Local Value | Production Value |
|----------|---------|----------|-------------|------------------|
| PORT | ✓ | | 5000 | (N/A) |
| NODE_ENV | ✓ | | development | production |
| FRONTEND_URL | ✓ | | http://localhost:3003 | https://flinxx.in |
| VITE_BACKEND_URL | | ✓ | http://localhost:5000 | https://d1pphanrf0qsx7.cloudfront.net |
| GOOGLE_CALLBACK_URL | ✓ | | http://localhost:5000/auth/google/callback | https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback |

---

## 🎯 Next Steps

1. **Test the setup** following the "Steps to Test Local Development" section
2. **Report any issues** with error messages from browser console or backend logs
3. **Google OAuth:** If needed, set up separate localhost credentials for seamless testing
4. **Happy coding!** Changes are now visible immediately in dashboard without redeployment

---

*Generated: 2026-02-09*
*Issue: Dashboard not reflecting local changes during development*
