# 🔍 OAuth Flow - Complete Debugging Checklist

## ✅ Components Ready

### Home.jsx ✅
- ✅ "Start Video Chat" button clicks
- ✅ Navigates to `/login`
- ✅ No issues

### Login.jsx ✅
- ✅ Google OAuth button redirects to `/auth/google` 
- ✅ Facebook OAuth button working
- ✅ **NEW**: Token saved to localStorage with keys:
  - `token`
  - `authToken`
- ✅ User saved to localStorage
- ✅ Verification logs added

### OAuthHandler.jsx ✅
- ✅ Receives token + user from URL params
- ✅ Saves to localStorage
- ✅ Redirects to `/chat`

### AuthContext.jsx ✅
- ✅ Fast path checks localStorage first
- ✅ Validates UUID format
- ✅ Sets user immediately if found
- ✅ Sets isLoading = false

### ProtectedChatRoute.jsx ✅
- ✅ Checks authLoading from AuthContext
- ✅ Redirects to `/login` only if no user after loading

---

## 🧪 STEP-BY-STEP TEST

### TEST 1: Landing Page → Login

**Steps**:
1. Go to https://flinxx-backend-frontend.vercel.app
2. Click "Start Video Chat" button

**Expected**:
- ✅ Navigate to `/login` page
- ✅ See login form with Google/Facebook buttons

**Debug if fails**:
```javascript
// In browser console:
console.log(window.location.pathname)  // Should be /login
```

---

### TEST 2: Google OAuth Button Click

**Steps**:
1. On `/login` page
2. Click "Continue with Google"

**Expected**:
- ✅ Redirected to Google OAuth consent screen
- ✅ URL shows: `accounts.google.com/o/oauth2/v2/auth...`

**Debug if fails**:
```javascript
// Check if click handler is working
// In DevTools, click Google button and check Network tab
// Should see redirect to accounts.google.com
```

---

### TEST 3: OAuth Callback → /oauth-handler

**Steps**:
1. Complete Google login (select account, click Continue)

**Expected**:
- ✅ Redirected to: `https://flinxx-backend-frontend.vercel.app/oauth-handler?token=...&user=...`
- ✅ URL has `token` and `user` parameters
- ✅ Browser console shows:
  ```
  🟢 [OAuthHandler] PAGE LOADED
  🟢 [OAuthHandler] URL params: {token: "eyJ...", user: "{...}", provider: "google"}
  🟢 [OAuthHandler] Extracted from URL:
     - token: ✓ Found
     - user: ✓ Found
     - provider: google
  🟢 [OAuthHandler] Parsed user: {uuid: "...", email: "...", name: "..."}
  ✅ [OAuthHandler] Successfully saved to localStorage
  ```

**Debug if fails**:
```javascript
// Check if page is reaching /oauth-handler
console.log(window.location.pathname)  // Should be /oauth-handler
console.log(window.location.search)    // Should have ?token=...&user=...

// If not seeing /oauth-handler, backend redirect is wrong
```

---

### TEST 4: localStorage Populated

**Steps**:
1. After OAuth callback (during /oauth-handler page load)
2. Open DevTools → Application → LocalStorage

**Expected**:
- ✅ Key: `token` → Value: JWT starting with `eyJ...`
- ✅ Key: `user` → Value: `{"uuid":"...", "email":"...", "name":"..."}`
- ✅ Key: `authProvider` → Value: `google` or `facebook`

**Debug in console**:
```javascript
// Check localStorage contents
console.log('token:', localStorage.getItem('token'))
// Expected: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

console.log('user:', localStorage.getItem('user'))
// Expected: {"uuid":"550e8400-e29b-41d4-a716-446655440000","email":"...","name":"..."}

console.log('authProvider:', localStorage.getItem('authProvider'))
// Expected: google
```

---

### TEST 5: AuthContext Loads User

**Steps**:
1. /oauth-handler redirects to `/chat`
2. Check browser console

**Expected**:
- ✅ Console shows:
  ```
  🔵 [AuthContext] INITIALIZATION STARTED
  🔵 [AuthContext] STEP 1: Quick check for stored token/user
  🔵 [AuthContext]   - token: ✓ Found
  🔵 [AuthContext]   - user: ✓ Found
  🔵 [AuthContext] FAST PATH: Both token and user found in localStorage
  🔵 [AuthContext] ✅ Valid UUID found in localStorage: [first 8 chars]...
  🔵 [AuthContext] Setting user from localStorage without backend validation
  🔵 [AuthContext] ✅ FAST PATH COMPLETE - User loaded from localStorage
  ```

**Debug if fails**:
```javascript
// Check if fast path is being reached
// Look for "[AuthContext]" messages in console

// If not seeing them, AuthContext initialization might be skipped
// Check browser console for any JavaScript errors
```

---

### TEST 6: ProtectedChatRoute Allows Access

**Steps**:
1. AuthContext loads from localStorage
2. ProtectedChatRoute checks authentication

**Expected**:
- ✅ Console shows:
  ```
  🔴 [ProtectedChatRoute] RENDER CALLED
  🔴 [ProtectedChatRoute] ✓ AuthContext finished loading (isLoading=false)
  🔴 [ProtectedChatRoute] ✅ AuthContext loaded with user: [email]
  🔴 [ProtectedChatRoute] authUser object: {id: "...", email: "...", ...}
  ```
- ✅ NO redirect message (no `Redirecting to /login`)

**Debug if still redirecting**:
```javascript
// Check if AuthContext user is loaded
// Look for "[ProtectedChatRoute] ❌ AuthContext finished loading but NO USER found"
// This means localStorage is empty or AuthContext fast path didn't work

// Check localStorage again:
localStorage.getItem('token')   // Should exist
localStorage.getItem('user')    // Should exist

// If empty, /oauth-handler didn't save properly
```

---

### TEST 7: Chat Page Renders

**Steps**:
1. ProtectedChatRoute allows access
2. Chat component mounts

**Expected**:
- ✅ See Chat page with:
  - Video area
  - "SoloX" and "DuoX" buttons
  - Match controls
- ✅ No more landing page "/"

**Debug if still on landing page**:
```javascript
// Check current URL
console.log(window.location.pathname)  // Should be /chat

// Check if redirect happened:
// Look in console for any redirect messages
```

---

### TEST 8: last_seen Updates

**Steps**:
1. Chat page loads
2. Check backend logs

**Expected**:
- ✅ Backend logs show:
  ```
  [PROFILE API] Request received
  [PROFILE API] Auth header: Present
  [PROFILE API] ✅ JWT token verified for user: [email]
  ✅ last_seen updated: [uuid] [timestamp]
  ```

**Debug if not updating**:
```javascript
// Check if /api/user/profile is being called
// DevTools → Network → Look for GET request to /api/user/profile
// Response status should be 200
// Response body should have: {success: true, ...}

// If no request made, Chat.jsx isn't calling it
// Check Chat.jsx useEffect logs
```

---

### TEST 9: Database Verification

**Steps**:
1. After Chat loads and /api/user/profile is called
2. Check database

**Expected**:
```sql
SELECT COUNT(*) FROM users 
WHERE last_seen > NOW() - INTERVAL '5 minutes';
-- Should return: 1 or more

SELECT email, last_seen FROM users 
ORDER BY updated_at DESC LIMIT 1;
-- Should show your email with recent last_seen timestamp
```

**Debug if count is 0**:
- /api/user/profile call failed
- Check backend logs for JWT verification errors
- Verify token in localStorage has correct format

---

## 🔴 Common Issues & Fixes

### Issue 1: Stuck on Landing Page

**Symptoms**:
- Click "Start Video Chat" but stays on home page

**Cause**: Home.jsx button not linked

**Fix**:
```javascript
// Home.jsx button should have:
onClick={handleStartChat}  // ✅ or navigate("/login")
```

---

### Issue 2: Login Page Doesn't Load

**Symptoms**:
- Click button, then page stays blank or errors

**Cause**: 
- Navigation not working
- Login.jsx has errors

**Debug**:
```javascript
// In console:
console.log(window.location.pathname)  // Should be /login after click
```

---

### Issue 3: OAuth Button Click Does Nothing

**Symptoms**:
- Click "Continue with Google" but nothing happens

**Cause**:
- Backend URL incorrect
- onClick handler not bound

**Debug**:
```javascript
// Click button and check Network tab
// Should see redirect to backend /auth/google endpoint
// If not, check VITE_BACKEND_URL env variable

// In frontend .env:
VITE_BACKEND_URL=https://flinxx-backend.onrender.com
```

---

### Issue 4: /oauth-handler URL params missing

**Symptoms**:
- Redirected to `/oauth-handler` but no `?token=...` in URL

**Cause**:
- Backend not encoding/passing parameters

**Debug**:
```javascript
// In backend server.js, /auth/google callback should have:
const redirectUrl = `${baseUrl}/oauth-handler?token=${tokenParam}&user=${userParam}&provider=${providerParam}`;
res.redirect(redirectUrl)  // ✅ MUST BE res.redirect(), not res.send()

// Check backend logs:
✅ [AUTH/GOOGLE/CALLBACK] Redirecting to /oauth-handler with token
// This message means backend is redirecting correctly
```

---

### Issue 5: localStorage empty after /oauth-handler

**Symptoms**:
- /oauth-handler page loads but token not in localStorage
- Console shows no errors

**Cause**:
- URL params not being parsed correctly
- OAuthHandler.jsx not saving properly

**Debug**:
```javascript
// In /oauth-handler page, check:
const token = searchParams.get('token')
console.log('Token from URL:', token)  // Should NOT be null

// If null, check raw URL:
console.log(window.location.search)  // Should be: ?token=...&user=...

// If empty, backend redirect was wrong
```

---

### Issue 6: AuthContext Not Loading User

**Symptoms**:
- localStorage has token+user but AuthContext can't find it
- Console shows: "❌ AuthContext finished loading but NO USER found"

**Cause**:
- UUID validation failing
- User object missing uuid field

**Debug**:
```javascript
// Check user object in localStorage:
const user = JSON.parse(localStorage.getItem('user'))
console.log('UUID:', user.uuid)
console.log('UUID length:', user.uuid?.length)
// Should be 36 characters (UUID format)

// If missing or wrong length, backend returned wrong format
```

---

## 📋 Pre-Deployment Checklist

Before each deployment:

- [ ] Home.jsx has `onClick={handleStartChat}` or `onClick={() => navigate("/login")}`
- [ ] Login.jsx saves token to both `token` and `authToken` keys
- [ ] Login.jsx logs verification logs
- [ ] Backend OAuth callbacks redirect to `/oauth-handler` (not `/chat`)
- [ ] Backend encodes token+user in URL params
- [ ] Frontend has `/oauth-handler` route in Layout.jsx
- [ ] AuthContext has fast path that checks localStorage
- [ ] ProtectedChatRoute checks authLoading properly
- [ ] OAuthHandler.jsx parses and saves to localStorage

---

## 🚀 Quick Test Command

```javascript
// In browser console, after login:

// 1. Check localStorage
console.log({
  token: localStorage.getItem('token') ? '✓ FOUND' : '✗ MISSING',
  user: localStorage.getItem('user') ? '✓ FOUND' : '✗ MISSING',
  authProvider: localStorage.getItem('authProvider')
});

// 2. Parse and check user
const user = JSON.parse(localStorage.getItem('user'));
console.log({ uuid: user?.uuid?.substring(0, 8) + '...', email: user?.email });

// 3. Check current page
console.log('Current page:', window.location.pathname);  // Should be /chat
```

**Expected Output**:
```
{token: "✓ FOUND", user: "✓ FOUND", authProvider: "google"}
{uuid: "550e8400...", email: "user@example.com"}
"Current page: /chat"
```

---

## 📞 If Still Issues

1. **Take screenshot** of:
   - Browser console (with all logs)
   - DevTools Application tab showing localStorage
   - URL bar showing current path

2. **Share logs** for:
   - Backend (Render dashboard logs)
   - Frontend (browser console)

3. **Test sequence**:
   - Did you reach `/oauth-handler` page?
   - Did localStorage get populated?
   - Did AuthContext load the user?
   - Are you on `/chat` or still on `/`?
