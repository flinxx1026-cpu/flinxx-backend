# 🔴 CRITICAL: OAuth Callback Configuration Fix

## The Problem

Your `backend/.env` currently has:
```
GOOGLE_CALLBACK_URL=https://flinxx.in/auth/google/callback
GOOGLE_REDIRECT_URI=https://flinxx.in/auth/google/callback
```

**This is WRONG** - these point to the frontend domain.

OAuth callback URLs **MUST** point to the backend server where the callback will be handled.

---

## The Solution

Change `backend/.env` to:
```
GOOGLE_CALLBACK_URL=https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
GOOGLE_REDIRECT_URI=https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
```

**These point to the backend CloudFront domain.**

---

## Why This Matters

### Current Flow (BROKEN) ❌

```
1. User clicks "Sign in with Google"
   ↓
2. Frontend redirects to: https://d1pphanrf0qsx7.cloudfront.net/auth/google (backend)
   ↓
3. Backend tells Google: "redirect back to https://flinxx.in/auth/google/callback"
   ↓
4. User approves on Google
   ↓
5. Google tries to redirect to: https://flinxx.in/auth/google/callback (frontend)
   ↓
6. But Google Cloud Console says: Backend URL should be https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
   ↓
7. ❌ Google rejects: "invalid_client" error
```

### Correct Flow (FIXED) ✅

```
1. User clicks "Sign in with Google"
   ↓
2. Frontend redirects to: https://d1pphanrf0qsx7.cloudfront.net/auth/google (backend)
   ↓
3. Backend tells Google: "redirect back to https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback"
   ↓
4. User approves on Google
   ↓
5. Google redirects to: https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback (backend) ✅
   ↓
6. Backend /auth/google/callback route handles it:
   - Exchanges code for tokens
   - Creates/finds user in database
   - Generates JWT
   ↓
7. Backend redirects to: https://flinxx.in/oauth-success?token=JWT (frontend)
   ↓
8. Frontend receives token and stores in localStorage
   ↓
9. ✅ User logged in!
```

---

## What to Change

### In `backend/.env`

Find these lines:
```env
GOOGLE_CALLBACK_URL=https://flinxx.in/auth/google/callback
GOOGLE_REDIRECT_URI=https://flinxx.in/auth/google/callback
```

Change to:
```env
GOOGLE_CALLBACK_URL=https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
GOOGLE_REDIRECT_URI=https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
```

### In Google Cloud Console (Verify)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (373922547944-gm8fgpgjebnraruomkpajoa7s3nqusp0)
3. Click Edit
4. Under "Authorized redirect URIs", verify it has:
   ```
   https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
   ```
5. Remove any `https://flinxx.in/auth/google/callback` entry if present
6. Save changes

---

## Backend Architecture (Already Correct)

✅ Your backend **already has** these routes:

### Route 1: `/auth/google`
**Location:** `backend/server.js` (around line 1910)

Initiates Google OAuth:
```javascript
app.get('/auth/google', (req, res) => {
  // Build Google OAuth consent URL
  // Redirect to Google's OAuth endpoint
})
```

### Route 2: `/auth/google/callback`
**Location:** `backend/server.js` (around line 1945)

Handles Google's callback:
```javascript
app.get('/auth/google/callback', async (req, res) => {
  // Receive code from Google
  // Exchange code for tokens
  // Get user info from Google
  // Create/find user in database
  // Generate JWT
  // Redirect to frontend with JWT
})
```

### Route 3: `/oauth-success`
**Location:** `backend/server.js` (around line 2090)

Frontend receives the JWT and user data

---

## Frontend Architecture (Already Correct)

✅ Your frontend **already does** this:

### Login Page
**File:** `frontend/src/pages/Login.jsx`

```javascript
const triggerGoogleLogin = () => {
  const BACKEND_URL = 'https://d1pphanrf0qsx7.cloudfront.net'  // or localhost:5000
  window.location.href = `${BACKEND_URL}/auth/google`  // ✅ Correct
}
```

Frontend correctly:
- ✅ Does NOT handle OAuth callback
- ✅ Only initiates the flow to backend
- ✅ Waits for backend to redirect back with JWT

---

## The Complete Correct Flow

```
Timeline:

T0:   User on https://flinxx.in/login clicks "Sign in with Google"
      ↓
T1:   Frontend: window.location.href = https://d1pphanrf0qsx7.cloudfront.net/auth/google
      ↓
T2:   Backend /auth/google endpoint runs
      - Builds Google OAuth consent URL
      - Uses GOOGLE_REDIRECT_URI from .env
      - Redirects to Google
      ↓
T3:   Google shows consent screen to user
      ↓
T4:   User approves
      ↓
T5:   Google redirects to: https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback?code=XXX
      (This comes from GOOGLE_REDIRECT_URI in your backend .env)
      ↓
T6:   Backend /auth/google/callback endpoint runs
      - Receives code from Google
      - Exchanges code for tokens
      - Fetches user info from Google
      - Finds or creates user in database
      - Generates JWT token
      - Redirects to: https://flinxx.in/oauth-success?token=JWT
      ↓
T7:   Frontend /oauth-success route runs
      - Receives JWT from URL
      - Stores in localStorage
      - Redirects to /chat
      ↓
T8:   App loads, AuthContext initializes
      - Finds JWT in localStorage
      - Loads user
      - Sets isAuthenticated = true
      ↓
T9:   User sees chat or profile modal
      ✅ SUCCESS
```

---

## Action Required

### IMMEDIATE (Before testing)

1. **Edit `backend/.env`**
   ```
   GOOGLE_CALLBACK_URL=https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
   GOOGLE_REDIRECT_URI=https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
   ```

2. **Restart backend**
   ```bash
   cd backend
   npm start
   ```

3. **Verify Google Cloud Console**
   - Check that redirect URI is: `https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback`

### THEN TEST

1. Visit: https://flinxx.in
2. Click: "Sign in with Google"
3. Expected: Google consent screen (NOT error)
4. After approval: Logged in to chat

---

## Debugging If It Still Doesn't Work

### Check 1: Verify Backend .env
```bash
grep GOOGLE_CALLBACK_URL backend/.env
# Should show: https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback
```

### Check 2: Check Backend Logs
When you click login, you should see in backend console:
```
🔵 [/auth/google] Request received
🔵 [/auth/google] Redirecting to Google OAuth
🔐 [AUTH/GOOGLE/CALLBACK] Starting Google OAuth callback...
✅ [AUTH/GOOGLE/CALLBACK] Received authorization code
✅ [AUTH/GOOGLE/CALLBACK] Exchanging code for tokens
✅ [AUTH/GOOGLE/CALLBACK] Retrieved user info
✅ [AUTH/GOOGLE/CALLBACK] Redirecting to /oauth-success with token
```

### Check 3: Browser Console
In DevTools Console, you should see:
```
✅ [Login useEffect] Google OAuth callback received!
✅ [Login useEffect] OAuth credentials stored, redirecting to /chat
```

### Check 4: Network Tab
- `/auth/google` → should redirect to accounts.google.com
- Google OAuth → user approves
- `/auth/google/callback?code=XXX` → should redirect to `/oauth-success?token=...`
- `/oauth-success` → should redirect to `/chat`

---

## Key Principle

**OAuth Callback URL Rule:**

The domain where the OAuth **callback is handled** must be the **callback URL registered with the OAuth provider**.

✅ **Correct:**
- Backend handles callback at: `https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback`
- Google registered with: `https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback`
- ✅ They match!

❌ **Incorrect:**
- Backend tells Google: `https://d1pphanrf0qsx7.cloudfront.net/auth/google/callback`
- But .env says: `https://flinxx.in/auth/google/callback`
- Frontend tries to handle at: `https://flinxx.in/...`
- ❌ Nothing matches!

---

## Summary

| Component | Current | Correct | Status |
|-----------|---------|---------|--------|
| Backend /auth/google | ✅ Exists | ✅ Working | Ready |
| Backend /auth/google/callback | ✅ Exists | ✅ Working | Ready |
| Frontend triggers OAuth | ✅ Correct | ✅ Correct | Ready |
| Backend .env callback URL | ❌ Wrong (flinxx.in) | ✅ Should be (CloudFront) | **NEEDS FIX** |
| Google Cloud Console | Needs verify | ✅ Should be CloudFront | **VERIFY** |

**Action:** Update `backend/.env` and restart backend server.

