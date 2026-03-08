# ✅ Local Development Environment Setup Checklist

## Before Testing OAuth Login Locally

### Backend Setup

- [ ] **Backend `.env.local` exists** with these exact values:
  ```env
  BACKEND_URL=http://localhost:5000
  FRONTEND_URL=http://localhost:3003
  CLIENT_URL=http://localhost:3003
  CLIENT_URL_PROD=http://localhost:3003
  NODE_ENV=development
  PORT=5000
  
  GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
  GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
  FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
  ```

- [ ] **Google OAuth App** has `http://localhost:5000/auth/google/callback` in authorized redirect URIs
  - Go to: Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs
  - Edit OAuth consent screen
  - Add `http://localhost:5000/auth/google/callback` to redirect URIs

- [ ] **Facebook OAuth App** has `http://localhost:5000/auth/facebook/callback` in valid redirect URLs
  - Go to: Facebook Developers → Your App → Settings → Basic/Advanced
  - Add redirect URLs

### Frontend Setup

- [ ] **Check vite.config.js** has proxy configured:
  ```javascript
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
  ```

- [ ] **Check firebase.js** is configured for the correct Firebase project

### Running Locally

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   # Should show: [STARTUP] STEP 3.2 - Server running on PORT: 5000
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Should show: ➜  Local:   http://localhost:3003/
   ```

3. **Browser:**
   - Open http://localhost:3003
   - Click "Start Video Chat"
   - Click Google/Facebook Login
   - Approve the OAuth consent

### Expected Flow

```
User clicks "Login with Google"
  ↓
Redirects to: http://localhost:5000/auth/google
  ↓  
Redirects to: https://accounts.google.com/o/oauth2/v2/auth?...
  ↓
User approves
  ↓
Google redirects to: http://localhost:5000/auth/google/callback?code=...
  ↓
Backend exchanges code for token
  ↓
Backend redirects to: http://localhost:3003/oauth-success?token=...
  ↓
oauth-success page loads & saves token to localStorage
  ↓
Redirects to: http://localhost:3003/dashboard
  ↓
✅ User logged in!
```

## Troubleshooting

### ❌ Stuck on OAuth consent screen (doesn't redirect back)
- **Problem:** OAuth app redirect URI mismatch
- **Fix:** 
  1. Go to Google Cloud Console
  2. Check OAuth Consent Screen → Authorized redirect URIs
  3. Make sure `http://localhost:5000/auth/google/callback` is there
  4. Allow HTTP for localhost (Google requires HTTPS for production)

### ❌ Redirects to login page instead of dashboard
- **Problem:** Token not saved to localStorage
- **Fix:**
  1. Open F12 → Application → Cookies
  2. Check if authToken cookie is there
  3. Open F12 → Console during login
  4. Look for these logs:
     - `🔐 [OAuthSuccess] Page loaded`
     - `✅ [OAuthSuccess] Saving to localStorage`
  5. If logs missing, oauth-success page is not being reached

### ❌ "No token in URL" error
- **Problem:** Backend redirect URL is wrong
- **Fix:**
  1. Check backend logs: `pm2 logs flinxx-backend`
  2. Look for `FRONTEND_URL` resolution logs
  3. Make sure backend has `.env.local` with `FRONTEND_URL=http://localhost:3003`

### ❌ CORS error when calling backend
- **Problem:** Frontend can't reach backend API
- **Fix:**
  1. Check if backend is running on port 5000
  2. Check frontend proxy config in vite.config.js
  3. Make sure `.env` or `.env.local` has correct BACKEND_URL

### ❌ Firebase user is null (no localStorage token)
- **Problem:** User not authenticated at all
- **Fix:**
  1. Complete the OAuth login flow first
  2. Check browser storage for `token` and `user` keys
  3. If still null, OAuth callback failed completely

## Quick Test Command

After setup, run this to verify backend is accessible from frontend:

```bash
# From any terminal
curl -X GET http://localhost:5000/health

# Should return 404 or JSON response (not connection error)
```

If ECONNREFUSED, backend is not running!
