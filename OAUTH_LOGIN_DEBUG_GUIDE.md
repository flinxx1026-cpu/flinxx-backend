# 🔧 OAuth Login Debugging Guide

## Problem
Users log in successfully but get redirected to landing page instead of dashboard. The token is not being saved to localStorage.

## Root Cause
When the OAuth callback happens, the backend redirects users to `/oauth-success?token=...`. But if this redirect URL is wrong, users never reach the oauth-success page, so the token is never saved.

## Debugging Steps

### Step 1: Check Environment Variables on Backend

The backend needs `FRONTEND_URL` to be correctly set:

**Production (EC2):**
```env
FRONTEND_URL=https://flinxx.in
CLIENT_URL=https://flinxx.in
```

**Local Development:**
```env
FRONTEND_URL=http://localhost:3003
CLIENT_URL=http://localhost:3003
```

Make sure `.env.local` in the backend folder has the **correct localhost URLs** for development!

### Step 2: Check Browser Console Logs During Login

When you click "Login with Google/Facebook", watch the console for:

**✅ Expected logs:**
```
🔗 [/auth/google] Google OAuth initiated with redirect_uri: http://localhost:5000/auth/google/callback
🔗 [/auth/google] Redirecting to Google consent screen
```

**❌ Problem logs:**
```
🔍 [AUTH/GOOGLE/CALLBACK] FRONTEND URL RESOLUTION:
   - FRONTEND_URL env: null  ← PROBLEM!
   - Using URL: http://localhost:3003
```

### Step 3: Verify OAuth-Success Page is Reached

After you approve the login:

1. **Check URL bar:** Should show `http://localhost:3003/oauth-success?token=eyJ...`
2. **Check console:** Should show:
   ```
   🔐 [OAuthSuccess] Page loaded, checking for token in URL...
   🔐 [OAuthSuccess] Token from URL: eyJ...
   ```

If you DON'T see the oauth-success page, the redirect URL is wrong!

### Step 4: Backend Logs (SSH to EC2)

```bash
ssh -i flinxx-key.pem ec2-user@13.203.157.116
pm2 logs flinxx-backend --lines 50
```

Look for:
```
🔐 [AUTH/GOOGLE/CALLBACK] Starting Google OAuth callback...
✅ [AUTH/GOOGLE/CALLBACK] Retrieved user info: user@email.com
🔍 [AUTH/GOOGLE/CALLBACK] FRONTEND URL RESOLUTION:
   - FRONTEND_URL env: http://localhost:3003
   - Using URL: http://localhost:3003
✅ [AUTH/GOOGLE/CALLBACK] Redirecting to /oauth-success with token
```

## Solution Checklist

- [ ] **Ensure backend has correct .env.local with FRONTEND_URL**
  
  ```bash
  # backend/.env.local (for local development)
  FRONTEND_URL=http://localhost:3003
  CLIENT_URL=http://localhost:3003
  GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
  FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
  ```

- [ ] **Restart backend after updating env vars**
  
  ```bash
  pm2 restart flinxx-backend
  # OR
  pm2 delete flinxx-backend && npm start
  ```

- [ ] **Make sure you're testing on the correct URL**
  - Local: `http://localhost:3003`
  - Production: `https://flinxx.in`

- [ ] **Clear browser cache and cookies**
  - Press F12 → Application → Clear Site Data → Clear

- [ ] **Check browser console during login**
  - Should see OAuth redirect logs
  - Should see oauth-success page loading

## Common Issues

### Issue 1: Redirect to wrong URL
**Symptom:** OAuth-success page never loads
**Fix:** Check FRONTEND_URL in backend .env.local

### Issue 2: Token not in URL
**Symptom:** oauth-success page loads but says "No token in URL"
**Fix:** Backend redirect failed - check backend logs for errors

### Issue 3: Token saves but Firebase still null
**Symptom:** Token in localStorage but Firebase user is null
**Fix:** This is normal! With JWT token, Firebase auth is skipped. AuthContext should authenticate with JWT instead.

### Issue 4: localStorage not persisting
**Symptom:** oauth-success saves token but next page reload it's gone
**Fix:** 
- Check browser privacy settings
- Make sure localhost is allowed to use localStorage
- Clear all cookies/cache

## Testing OAuth Flow Locally

1. **Start frontend (separate terminal):**
   ```bash
   cd frontend
   npm run dev
   # Opens on http://localhost:3003
   ```

2. **Start backend (separate terminal):**
   ```bash
   cd backend
   npm start
   # Ensure .env.local is present with correct URLs
   ```

3. **Click Login → Choose Google/Facebook → Approve**

4. **Watch developer console (F12) for these logs:**

   **Google Auth:**
   ```
   🔗 [/auth/google] Google OAuth initiated...
   🔐 [AUTH/GOOGLE/CALLBACK] Retrieved user info...
   🔍 [AUTH/GOOGLE/CALLBACK] FRONTEND URL RESOLUTION...
   🔐 [OAuthSuccess] Page loaded...
   ✅ [OAuthSuccess] Saving to localStorage...
   ```

## Still Having Issues?

1. **Share backend logs:** `pm2 logs flinxx-backend`
2. **Share browser console logs:** F12 → Console → Screenshot
3. **Check env vars:** `echo $FRONTEND_URL` (on EC2)
4. **Verify OAuth app config:** Make sure redirect URIs match in Google/Facebook console

---

**Updated:** March 8, 2026  
**Version:** With Enhanced OAuth Debugging
