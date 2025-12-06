# ProfileSetupModal Issue - Systematic Debugging Checklist

## Pre-Debugging Setup

- [ ] Rebuild frontend: `npm run build`
- [ ] Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- [ ] Open DevTools: `F12`
- [ ] Go to Console tab
- [ ] Clear existing logs: type `clear()` and press Enter
- [ ] Filter console: search for `[ProtectedChatRoute]` or `[AuthContext]`

## Test Scenario 1: Fresh Login (No Profile)

**Steps:**
1. Log out completely: Clear all localStorage and cookies
2. Go to login page
3. Log in with Google OAuth
4. **Immediately** after login, open DevTools Console

**Look for these logs in order:**

- [ ] `[firebase]` logs about saving user to backend
- [ ] `[AuthContext] Initializing authentication...`
- [ ] `[AuthContext] Stored token: Found`
- [ ] `[AuthContext] 🔍 Attempting to restore Google OAuth user`
- [ ] `[AuthContext] Stored user data: { ... profileCompleted: false ...}`

**If you see these, AuthContext is working.**

- [ ] App navigates to `/chat`
- [ ] `[ProtectedChatRoute] EFFECT RUNNING`
- [ ] `[ProtectedChatRoute] authLoading: false`
- [ ] `[ProtectedChatRoute] authUser: user@example.com`
- [ ] `[ProtectedChatRoute] authUser.profileCompleted = false (type: boolean)`
- [ ] `[ProtectedChatRoute] isProfileComplete (final): false`
- [ ] `[ProtectedChatRoute] ❌ DECISION: Profile NOT completed`
- [ ] `[ProtectedChatRoute] ➜ SHOWING ProfileSetupModal`

**If you see these, ProtectedChatRoute logic is working.**

**Expected Result:**
- ProfileSetupModal should appear in the middle of screen
- Chat should NOT be visible

**If modal doesn't appear:**
Go to "Debugging Steps" section below.

## Test Scenario 2: Refresh After Profile Complete

**Setup:**
1. Complete profile in modal (fill birthday + gender + click Save)
2. Wait for modal to close and camera to reinitialize
3. **Hard refresh browser**: `Ctrl+Shift+R`
4. Open DevTools Console

**Look for:**

- [ ] `[AuthContext]` restoring user from localStorage
- [ ] `[AuthContext] Stored user data: { ... profileCompleted: true ...}`
- [ ] `[ProtectedChatRoute] authUser.profileCompleted = true (type: boolean)`
- [ ] `[ProtectedChatRoute] isProfileComplete (final): true`
- [ ] `[ProtectedChatRoute] ✅ DECISION: Profile IS completed`
- [ ] `[ProtectedChatRoute] ➜ SHOWING Chat page`

**Expected Result:**
- Chat page shows immediately
- No modal appears

**If modal appears after refresh:**
- Your profileCompleted status isn't being persisted correctly
- Check that ProfileSetupModal properly updates localStorage

## Test Scenario 3: Manual Reset

**Steps:**
1. Have a user with completed profile (from Scenario 2)
2. Go to backend terminal
3. Run reset endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/users/reset-profile \
     -H "Content-Type: application/json" \
     -d '{"userId":"YOUR_USER_ID"}'
   ```
4. **Hard refresh browser**: `Ctrl+Shift+R`
5. Open DevTools Console

**Look for:**
- [ ] `[AuthContext]` logs showing restored user
- [ ] `[ProtectedChatRoute] authUser.profileCompleted = false (type: boolean)`
- [ ] Modal appears

**Expected Result:**
- ProfileSetupModal appears immediately after refresh

## Debugging Steps (If Modal Doesn't Appear)

### Step 1: Check if ProtectedChatRoute is Running at All

**Question:** Do you see ANY logs starting with `[ProtectedChatRoute]` in the console?

**If NO:**
- ProtectedChatRoute component is not rendering
- Check: Are you actually navigating to /chat URL?
- Check: Is the route defined correctly in Layout.jsx?
- Try manually going to: `http://localhost:5173/chat`

**If YES:**
- Go to Step 2

### Step 2: Check AuthContext Status

**Look for this log:**
```
[ProtectedChatRoute] authLoading: false
```

**If you see `true` or `undefined`:**
- AuthContext is still loading
- ProtectedChatRoute will wait and re-run
- The issue might be that /api/profile is slow or failing
- Go to Step 2a

**If you see `false`:**
- Go to Step 3

### Step 2a: Check if /api/profile is Responding

**In DevTools Network tab:**
1. Filter by "profile"
2. Look for `/api/profile` request
3. Check the response status
4. **If no request appears:**
   - AuthContext is not calling /api/profile
   - Check AuthContext code to verify the fetch is happening
5. **If request shows error (4xx, 5xx):**
   - Backend endpoint is failing
   - Check backend logs
   - Verify token is valid
6. **If request shows 200 OK:**
   - Check the response JSON
   - Should include: `profileCompleted: true/false`
   - If missing: Backend needs fixing

### Step 3: Check Profile Status Value

**Look for this log:**
```
authUser.profileCompleted = ??? (type: ???)
```

**If you see `undefined`:**
- User object from AuthContext doesn't have profileCompleted
- The /api/profile fetch either failed or wasn't called
- Check Step 2a above

**If you see `true`:**
- Profile is marked as complete in database
- Modal should NOT appear (which is correct)
- If you expected modal to appear:
  - Use reset endpoint to set it to false
  - Try test scenario 3 above

**If you see `false`:**
- Go to Step 4

### Step 4: Check Final Decision

**Look for this log:**
```
[ProtectedChatRoute] isProfileComplete (final): ???
```

**If you see `false`:**
- ProtectedChatRoute decided to show modal
- But modal didn't appear?
- Problem is in ProfileSetupModal component itself
- Check ProfileSetupModal.jsx:
  - Is it being passed `isOpen={true}`?
  - Is it being passed the correct `user` object?
  - Check browser inspector to see if modal HTML is in DOM

**If you see `true`:**
- ProtectedChatRoute decided to show chat
- Is chat page showing? Yes → Issue is resolved
- Is chat page not showing? → Different issue

### Step 5: Check localStorage

**In DevTools:**
1. Go to Application tab → Storage → localStorage
2. Find the `user` entry
3. Click it and look at the data
4. **Check if these exist:**
   - [ ] `"id"` field
   - [ ] `"email"` field
   - [ ] `"profileCompleted"` field (should be `false`)
   - [ ] `"isProfileCompleted"` field (should be `false`)

**If any are missing:**
- Login path isn't storing complete data
- Check Login.jsx and firebase.js
- Verify `/api/users/save` returns all these fields

**If all exist and show false:**
- localStorage is correct
- Issue is in AuthContext or ProtectedChatRoute logic
- Go back to Step 2-4

## Quick Diagnosis Matrix

Use this to quickly narrow down the issue:

| Log Check | Result | Next Step |
|-----------|--------|-----------|
| See `[ProtectedChatRoute]` logs? | NO | Is route configured? Is URL correct? |
| authLoading is false? | NO | Wait, AuthContext still loading. Check /api/profile. |
| authLoading is false? | YES | ✅ Continue to next check |
| authUser has profileCompleted? | NO | /api/profile failed. Check network tab. |
| authUser.profileCompleted? | undefined | Backend not returning field. Check /api/profile response. |
| authUser.profileCompleted? | false | ✅ Should show modal |
| Modal appears? | YES | ✅ Issue resolved! |
| Modal appears? | NO | ProfileSetupModal component issue. Check DOM inspector. |

## After Each Change

- [ ] Rebuild: `npm run build`
- [ ] Hard refresh: `Ctrl+Shift+R`
- [ ] Clear console: `clear()`
- [ ] Test again

## If You Find the Issue

Please report:
1. Which step failed (e.g., "Step 2a: /api/profile returns 404")
2. What the console log showed
3. What the expected log should have been
4. Any error messages

This will help identify the exact fix needed.

---

**Current Commit:** a84fedf - Enhanced debugging with comprehensive logging
