# 🧭 REDIRECT SYSTEM - MAINTENANCE GUIDE

## 📌 Architecture After Fix

```
┌─────────────────────────────────────────────────────────┐
│                    USER LOGIN/AUTH                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Login.jsx / Auth.jsx                                    │
│  ├─ Handles: Firebase login                             │
│  ├─ Action: Save token + user to localStorage           │
│  └─ NEVER: Calls navigate() or window.location.href     │
│                                                          │
│  ↓↓↓ STORAGE CHANGED ↓↓↓                                │
│                                                          │
│  AuthContext.jsx (THE ONLY REDIRECT SOURCE)             │
│  ├─ Watches: isLoading, isAuthenticated, user           │
│  ├─ Logic: If (loaded AND authenticated AND user)       │
│  └─ Action: navigate('/chat', { replace: true })        │
│                                                          │
│  ↓↓↓ REDIRECT HAPPENS ↓↓↓                               │
│                                                          │
│  ProtectedRoute.jsx (FALLBACK GUARD)                     │
│  ├─ Checks: isAuthenticated && user                     │
│  ├─ If False: Redirect to /login                        │
│  └─ If True: Allow access                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## ⚠️ IMPORTANT RULES

### ❌ FORBIDDEN
```jsx
// ❌ DO NOT add redirects to Login.jsx
// ❌ DO NOT add redirects to Auth.jsx
// ❌ DO NOT add navigate() in login handlers
// ❌ DO NOT add window.location.href in login handlers
// ❌ DO NOT add setTimeout(() => redirect) anywhere
// ❌ DO NOT use multiple sources for redirect
```

### ✅ ALLOWED
```jsx
// ✅ Only add redirect logic to AuthContext.jsx
// ✅ Only modify AuthProvider useEffect for redirects
// ✅ ProtectedRoute can redirect (guard logic)
// ✅ Login.jsx/Auth.jsx can trigger login only
```

## 🔄 If You Need to Modify Redirect Logic

### Location: `src/context/AuthContext.jsx`
```jsx
// Find this useEffect in AuthProvider:
useEffect(() => {
  // Skip redirect if:
  if (isLoading) return
  
  // Skip if on auth pages:
  const currentPath = window.location.pathname
  if (currentPath === '/login' || currentPath === '/auth' || currentPath === '/oauth-success') {
    return
  }
  
  // Redirect when authenticated:
  if (!isLoading && isAuthenticated && user) {
    navigate('/chat', { replace: true })
  }
}, [isLoading, isAuthenticated, user, navigate])
```

### Common Modifications:

**1. Change redirect destination:**
```jsx
// ❌ OLD:
navigate('/chat', { replace: true })

// ✅ NEW:
navigate('/dashboard', { replace: true })
```

**2. Add additional pages to skip:**
```jsx
// ❌ OLD:
if (currentPath === '/login' || currentPath === '/auth' || currentPath === '/oauth-success') {
  return
}

// ✅ NEW:
if (currentPath === '/login' || currentPath === '/auth' || currentPath === '/oauth-success' || currentPath === '/terms') {
  return
}
```

**3. Add conditional logic:**
```jsx
// ✅ Example: Redirect based on profile completion
if (!isLoading && isAuthenticated && user) {
  if (user.profileCompleted) {
    navigate('/chat', { replace: true })
  } else {
    navigate('/profile/complete', { replace: true })
  }
}
```

## 📍 Related Files

```
src/
├── pages/
│   ├── Login.jsx          (handles login only, NO redirect)
│   ├── Auth.jsx           (handles login only, NO redirect)
│   └── Chat.jsx           (uses ProtectedRoute to guard)
├── context/
│   └── AuthContext.jsx    (ONLY place with redirect logic)
├── components/
│   └── ProtectedRoute.jsx (guard layer, fallback redirect)
└── config/
    └── firebase.js        (Firebase init, not involved in redirect)
```

## 🧪 Testing After Modifications

```javascript
// 1. Test fresh login
// → Should see: "🚀 [AuthContext REDIRECT] User authenticated"
// → Result: End up on /chat

// 2. Test refresh while logged in
// → Should NOT see redirect logs
// → Result: Stay on /chat

// 3. Test access without login
// → Should see: "[ProtectedRoute] Access denied"
// → Result: Redirect to /login by ProtectedRoute

// 4. Check console
// → Count redirect messages
// → Should be EXACTLY 1 after login
// → Should be 0 on refresh when already logged in
```

## 🚨 Debug Checklist

If users are having redirect issues:

1. **Check AuthContext console logs:**
   ```
   🔄 [AuthContext] Still loading?
   🔵 [AuthContext] On auth page?
   🚀 [AuthContext REDIRECT]?
   ```

2. **Verify localStorage:**
   ```javascript
   // In browser console:
   localStorage.getItem('token')      // Should exist after login
   localStorage.getItem('user')       // Should exist after login
   ```

3. **Check isLoading state:**
   ```javascript
   // AuthContext should set isLoading = false
   // After that, redirect should happen (if authenticated)
   ```

4. **Check for multiple redirects:**
   ```javascript
   // Count "REDIRECT" logs in console
   // Should be exactly 1 per login
   // Should be 0 on page refresh
   ```

5. **Verify no other redirects:**
   ```javascript
   // Search for "navigate(" in Login.jsx - should be 0
   // Search for "navigate(" in Auth.jsx - should be 0
   // Search for "window.location" in Login.jsx - should be 0
   ```

## 📝 Common Mistakes to Avoid

```jsx
// ❌ MISTAKE 1: Adding navigate to Login handler
const handleLogin = async () => {
  await signInWithGoogle()
  navigate('/chat')  // ❌ WRONG! Remove this
  // ✅ AuthContext will redirect
}

// ❌ MISTAKE 2: Adding useEffect redirect in Auth
useEffect(() => {
  if (user) {
    navigate('/chat')  // ❌ WRONG! Remove this
    // ✅ AuthContext will redirect
  }
}, [user])

// ❌ MISTAKE 3: Multiple navigation sources
// Login handler calls navigate()
// Auth useEffect calls navigate()
// AuthContext useEffect calls navigate()
// → RACE CONDITION!

// ✅ CORRECT: Only AuthContext redirects
// Everything else just updates state/localStorage
// AuthContext watches the state and redirects when ready
```

## 🎯 TL;DR - Quick Rules

| Action | Where | How |
|--------|-------|-----|
| Login | Login.jsx / Auth.jsx | Firebase login + save to localStorage |
| Redirect | AuthContext.jsx | useEffect watches state, calls navigate() |
| Guard | ProtectedRoute.jsx | Checks auth, redirects if needed |

**The golden rule:** 
> If you're tempted to add a `navigate()` call outside of AuthContext, STOP. That's causing the race condition. Let AuthContext handle it.

---

## 📞 Questions?

If redirect behavior is unexpected:
1. Check AuthContext redirect useEffect
2. Check console logs for "REDIRECT" messages
3. Verify no other files are calling navigate()
4. Verify localStorage has token + user
5. Check that isLoading becomes false

**Remember:** One redirect source = no race conditions ✅
