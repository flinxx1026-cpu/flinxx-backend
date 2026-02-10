# Friend Request Separation - Debugging Checklist 🔍

## Issue: Incoming requests still appearing in Friends & Requests panel

If you're seeing incoming requests in the ❤️ Requests panel, follow this debugging checklist.

---

## STEP 1: Hard Refresh Browser (Critical!)

The frontend code has changed. Your browser might be caching old code.

**Hard Refresh (all browsers):**
- Press: **Ctrl + Shift + R** (Windows/Linux)
- Or: **Cmd + Shift + R** (Mac)
- Or: **F12 → Network → Disable cache → Refresh**

**Then:**
1. Close all other tabs from http://localhost:3003
2. Clear browser cache entirely
3. Open new tab and go to http://localhost:3003
4. Login again

---

## STEP 2: Check Browser Console Logs

Open **Developer Tools** (F12) → **Console** tab

### Expected Logs When Panel Opens:

**Account A (Sender) - should see:**
```
📤 Fetching SENT requests from user
📤 [AuthContext] refreshSentRequests - fetched X requests
[SENT-REQUESTS API] ✅ Found X sent requests
🔍 [SearchFriendsModal] Displaying X requests in Likes mode:
   1. "ReceiverName" - Status: pending
      sender_id: [YOUR-UUID]...
      receiver_id: [RECEIVER-UUID]...
```

**Account B (Receiver) - should see:**
```
📤 Fetching SENT requests from user
📤 [AuthContext] refreshSentRequests - fetched 0 requests
No sent requests found (or empty list)
🔍 [SearchFriendsModal] Displaying 0 requests (if section appears)
```

**If you see WRONG output:**
```
❌ [NOTIFICATIONS API] Found X incoming requests
❌ Showing requests where sender_id != your-id
```

Then scroll to **STEP 4** below.

---

## STEP 3: Check Network Requests

Open **Developer Tools** (F12) → **Network** tab

**Filter:** Type `/api/` in the search box

### Looking for:

1. **GET /api/sent-requests?userId=...** 
   - ✅ Status: 200
   - ✅ Response shows: `sender_id` = Your UUID
   - Click response to view the returned data

2. **NOT seeing /api/notifications?userId=...**
   - ❌ If this appears, old code is running
   - Do a hard refresh (Step 1 again)

### What the Response Should Look Like:

```json
[
  {
    "id": "request-uuid",
    "sender_id": "your-uuid-here",          // ← Should be YOUR ID
    "receiver_id": "their-uuid-here",       // ← Should be RECEIVER ID
    "status": "pending",
    "display_name": "Their Name",           // ← Receiver's name
    "photo_url": "..."
  }
]
```

If `sender_id` is NOT your ID, then the API is returning wrong data.

---

## STEP 4: Verify Frontend Code

### Check that api.js is using correct endpoint:

Open file: `frontend/src/services/api.js`

Search for `getSentRequests` function (around line 90):

```javascript
export const getSentRequests = async (userUUID) => {
  const response = await fetch(
    `${BACKEND_URL}/api/sent-requests?userId=${userUUID}`,  // ← Must be /api/sent-requests
    ...
  );
};
```

✅ If it says `/api/sent-requests` → Correct
❌ If it says `/api/notifications` → WRONG, needs fix

---

### Check AuthContext is using correct function:

Open file: `frontend/src/context/AuthContext.jsx`

Search for `refreshSentRequests`:

**Line 4 should import**:
```javascript
import { getSentRequests } from '../services/api'  // ← NOT getNotifications
```

**Line 80 should call**:
```javascript
const data = await getSentRequests(user.uuid);  // ← NOT getNotifications
```

✅ If you see `getSentRequests` → Correct
❌ If you see `getNotifications` → WRONG, needs fix

---

### Check SearchFriendsModal is using correct state:

Open file: `frontend/src/components/SearchFriendsModal.jsx`

Search for line 11:

```javascript
const { user, sentRequests, refreshSentRequests } = useContext(AuthContext) || {};
```

✅ If it says `sentRequests` → Correct  
❌ If it says `notifications` → WRONG, needs fix

And check line 147:

```javascript
const pendingRequests = sentRequests || [];  // ← Must be sentRequests
```

✅ If it says `sentRequests` → Correct
❌ If it says `notifications` → WRONG, needs fix

---

## STEP 5: Check Backend is Running Correctly

### Look at backend terminal output

When you click ❤️ Requests panel, you should see:

```
[SENT-REQUESTS API] Fetching SENT requests from user: [UUID]
[SENT-REQUESTS API] ✅ Found X sent requests
```

**NOT:**
```
❌ [NOTIFICATIONS API] Fetching INCOMING requests
❌ SELECT...FROM friend_requests WHERE receiver_id = ...
```

If you see NOTIFICATIONS API instead of SENT-REQUESTS API:
1. The frontend is calling wrong endpoint
2. Go to Step 4 and verify the code

---

## STEP 6: Verify Backend Endpoint Code

Open: `backend/routes/notifications.js`

### Check `/api/sent-requests` endpoint exists and is correct:

**Endpoint location:** Around line 60

**Query should say:**
```javascript
WHERE f.sender_id = $1          // ← Current user is SENDER
  AND f.status IN ('pending', 'accepted')
```

**Join should say:**
```javascript
JOIN users u ON u.id = f.receiver_id    // ← Join with RECEIVER info
```

✅ Both correct → Can proceed
❌ Either wrong → Backend code needs fix

### Check `/api/notifications` endpoint only gets INCOMING:

**Endpoint location:** Around line 17

**Query should say:**
```javascript
WHERE f.receiver_id = $1        // ← Current user is RECEIVER
  AND f.status IN ('pending', 'accepted')
```

**Join should say:**
```javascript
JOIN users u ON u.id = f.sender_id      // ← Join with SENDER info
```

✅ Both correct → Good
❌ Either wrong → Backend code needs fix

---

## STEP 7: Test Data Check

### To verify data separation is working:

1. **Login as Account A**
2. **Open console** (F12)
3. Click ❤️ **Requests**
4. Check console logs

**If you see:**
```
📤 [AuthContext] refreshSentRequests - fetched 3 requests
🔍 [SearchFriendsModal] Displaying 3 requests in Likes mode:
   1. "Bob" - Status: pending
      sender_id: account-a-uuid
      receiver_id: bob-uuid
```

✅ **CORRECT** - Account A sent request to Bob

**If you see:**
```
❌ sender_id: bob-uuid
❌ receiver_id: account-a-uuid
```

❌ **WRONG** - Showing INCOMING requests instead of SENT

---

## STEP 8: Restart Servers If Code Was Wrong

If you found code issues in Step 4-6, fix them, then:

```bash
# Kill all node processes
Get-Process -Name node | Stop-Process -Force

# Restart backend
cd C:\Users\nikhi\Downloads\joi\backend
node server.js

# NEW TERMINAL:
cd C:\Users\nikhi\Downloads\joi\frontend
npm run dev
```

Then return to Step 1 (hard refresh).

---

## Quick Verification Checklist

Copy this and verify each item:

- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Console shows `📤 Fetching SENT requests`
- [ ] Network tab shows `/api/sent-requests` (not `/api/notifications`)
- [ ] API response has `sender_id` = Your UUID
- [ ] api.js line 90: `getSentRequests` exists
- [ ] AuthContext line 4: imports `getSentRequests`
- [ ] AuthContext line 80: calls `getSentRequests`
- [ ] SearchFriendsModal line 11: destructures `sentRequests`
- [ ] SearchFriendsModal line 147: `sentRequests || []`
- [ ] Backend terminal shows `[SENT-REQUESTS API]`
- [ ] Backend notifications.js has correct WHERE clause

✅ All checked ✓ → System should be working!
❌ Any unchecked ✗ → Find and fix that item

---

## Still Not Working?

If you've gone through all steps and it's still showing incoming requests:

1. **Screenshot the console logs** (F12 → Console)
2. **Screenshot the Network request/response** (F12 → Network)
3. **Check if backend.js also needs restart**
4. **Try a complete browser cache clear**:
   - F12 → Application → Clear Storage → Clear All

The most common fix is simply a **hard refresh** or **browser cache clear**.
