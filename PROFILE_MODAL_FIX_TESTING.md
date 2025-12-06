# Profile Modal & Camera Permission Fix - Testing Guide

## What Was Fixed

### Issue 1: Profile Modal Not Showing
**Problem:** When `profileCompleted = false`, the ProfileSetupModal was not appearing. Chat rendered directly without blocking.

**Root Cause:** ProtectedChatRoute was rendering both the Modal AND the Chat component simultaneously. Chat would mount, initialize camera, and override the profile check.

**Solution:** Modified ProtectedChatRoute to only render children (Chat) when `!showProfileSetup`:
```jsx
// Before: Always rendered Chat
return (
  <>
    {showProfileSetup && <ProfileSetupModal ... />}
    {children}  // ❌ Always rendered, even when modal should show
  </>
)

// After: Only render Chat when profile complete
return (
  <>
    {showProfileSetup && <ProfileSetupModal ... />}
    {!showProfileSetup && children}  // ✅ Only render when modal dismissed
  </>
)
```

### Issue 2: Camera Permission Popup Before Modal
**Problem:** When you clicked "Allow" on camera permission popup, the modal wasn't visible.

**Root Cause:** Chat component called `navigator.mediaDevices.getUserMedia()` in `useEffect(() => {}, [])` on mount. This happened immediately, before AuthContext finished checking `profileCompleted`.

**Solution:** Added 100ms delay to camera initialization:
```jsx
// Before: Immediate permission request
useEffect(() => {
  startPreview();  // ❌ Requests permission immediately
}, []);

// After: Delayed permission request
useEffect(() => {
  const timer = setTimeout(() => {
    startPreview();  // ✅ Waits for DOM to settle & modal to render first
  }, 100);
  return () => clearTimeout(timer);
}, []);
```

---

## Testing Procedure

### Prerequisites
- Backend deployed and running
- Frontend deployed or locally running
- User profile in database has `profileCompleted = false`

### Step 1: Clear Local Storage
Open browser DevTools (F12) and run:
```javascript
localStorage.clear()
```

Or manually delete these keys:
- `user`
- `token`
- `authUser`
- `idToken`

### Step 2: Hard Refresh
Press **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac) to clear cache.

### Step 3: Navigate to Login
Go to: `http://localhost:5173/login` (or your deployed URL)

### Step 4: Login with Test Account
Use a test account that has `profileCompleted = false`:
- Email: `itsgaming808@gmail.com`
- Or any test account you reset earlier

### Step 5: Watch Console for Logs
Open DevTools Console (F12 → Console tab)

**Expected Log Sequence:**

#### Phase 1: AuthContext Initialization (🔵 Blue Logs)
```
🔵 [AuthContext] ═══════════════════════════════════════════
🔵 [AuthContext] INITIALIZATION STARTED
🔵 [AuthContext] STEP 1: Check localStorage
🔵 [AuthContext]   - token: ✗ Not found
🔵 [AuthContext]   - user: ✗ Not found
🔵 [AuthContext] STEP 3: No stored token or user, checking Firebase...
```

#### Phase 2: Firebase Authentication
```
🔵 [AuthContext] Firebase onAuthStateChanged fired
🔵 [AuthContext]   - firebaseUser: <your email>
🔵 [AuthContext] Getting Firebase ID token...
🔵 [AuthContext] Calling /api/profile with ID token...
🔵 [AuthContext] /api/profile response OK
🔵 [AuthContext]   - user.profileCompleted: false  ← KEY: Should be false
```

#### Phase 3: ProtectedChatRoute Check (🔴 Red Logs)
```
🔴 [ProtectedChatRoute] ═══════════════════════════════════════════
🔴 [ProtectedChatRoute] EFFECT RUNNING - PROFILE CHECK
🔴 [ProtectedChatRoute] ✓ AuthContext finished loading (isLoading=false)
🔴 [ProtectedChatRoute] authUser.profileCompleted value: false
🔴 [ProtectedChatRoute] PROFILE COMPLETION CHECK:
🔴 [ProtectedChatRoute]   Source 1 (AuthContext):
🔴 [ProtectedChatRoute]     authUser.profileCompleted = false
🔴 [ProtectedChatRoute]     === true? false  ← CRITICAL: Says false
🔴 [ProtectedChatRoute] ❌ DECISION: Profile NOT completed
🔴 [ProtectedChatRoute] ➜ SHOWING ProfileSetupModal  ← ✅ Should show modal
```

### Step 6: Verify Modal Appears
**Expected:** ProfileSetupModal should now be visible on screen with:
- Birthday picker
- Gender selector
- Save button

**This means the fix is working!** ✅

### Step 7: Watch Console for Camera Init
**Important:** Camera permission popup should NOT appear yet. 

When you look at the Chat component logs, you should see:
```
[Camera] Chat component useEffect triggered, scheduling camera init with delay
[Camera] Delay complete, now calling startPreview()
```

The delay ensures the modal renders BEFORE the permission popup.

### Step 8: Fill Profile and Save
1. Select a birthday (e.g., 2000-01-01 or any date 18+)
2. Select a gender
3. Click "Save"

**Expected Logs:**
```
✅ Profile saved successfully: { ... profileCompleted: true ... }
Profile completed: { ... }
[ProtectedChatRoute] Profile completed callback triggered
```

### Step 9: Observe Modal Closes and Chat Loads
After saving:
1. Modal should close automatically
2. ProtectedChatRoute rerenders
3. Chat component finally mounts
4. Camera permission popup appears (if you haven't allowed it)

### Step 10: Allow Camera Permission
When browser asks for camera permission:
- Click "Allow while visiting the site"
- Camera preview should appear in the video element
- Chat lobby should load with camera showing

**Expected Logs:**
```
📹 Starting camera preview...
📹 [INIT] Chat component mounted, attempting to initialize camera
📹 [INIT] ✓ Video element found in DOM, requesting camera permissions
[Camera] ✅ Camera stream obtained
✅ Camera preview playing successfully
```

### Step 11: Test Closing and Reopening Chat
1. Click the X button to close/minimize chat
2. Click to reopen it
3. Camera preview should reappear (not black screen)

**Expected:** reinitializeCamera() function reattaches the existing stream.

---

## Success Criteria

✅ **Profile Modal Shows When `profileCompleted = false`**
- Should appear immediately after login
- Should block access to chat

✅ **Camera Permission Popup Timing**
- Should appear AFTER modal is visible
- Should appear AFTER profile is saved
- Should NOT appear before modal

✅ **Modal Closes After Profile Save**
- Should transition smoothly
- No black screen between modal and chat

✅ **Camera Works After Permission**
- Preview plays in video element
- No black screen

✅ **Camera Reattaches on Chat Close/Reopen**
- Closing chat: stream stops
- Reopening: reinitializeCamera reattaches stream
- No permanent black screen

---

## Debugging If Issues Persist

### If Modal Still Doesn't Show
1. Check logs for: `authUser.profileCompleted value: ???`
   - Should be `false` for the modal to show
   - If it's `undefined`, check `/api/profile` endpoint

2. Verify database: User should have `profileCompleted = false`
   - Run reset script if needed

3. Check ProtectedChatRoute logs for DECISION:
   - Should show: `❌ DECISION: Profile NOT completed`
   - If it shows `✅ DECISION: Profile IS completed`, database is wrong

### If Camera Permission Before Modal
1. Check `[Camera] Chat component useEffect triggered` log
   - Should show delay timer is set
   - Should show `[Camera] Delay complete` after 100ms

2. If Camera init happens immediately, the Chat component was rendered too early
   - Check ProtectedChatRoute return statement: should have `{!showProfileSetup && children}`

### If Camera Shows Black After Save
1. Verify `getCameraStream()` or `reinitializeCamera()` is called
2. Check logs for: `Stream has active tracks`
   - If 0 tracks, stream was lost
   - May need to request new stream

### Check Network Tab
1. Open DevTools → Network tab
2. Filter for `/api/profile` requests
3. Verify response includes: `"profileCompleted": false` or `true`

---

## Key Files Modified

- `frontend/src/components/ProtectedChatRoute.jsx` - Changed render logic
- `frontend/src/pages/Chat.jsx` - Added delay to camera init

## Commits
```
bf104a5 CRITICAL FIX: Profile modal not showing + camera permission timing
```

---

## Questions?

If the modal still doesn't appear:
1. Share console logs starting from login
2. Share Network tab response for `/api/profile`
3. Confirm database has `profileCompleted = false`
