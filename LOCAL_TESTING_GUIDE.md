# 🧪 Local Testing Guide - Friend Request Flow

## ✅ Prerequisites Check

### Backend Running?
```
PORT: 5000
URL: http://localhost:5000
Check: Open terminal, see "Server running on PORT: 5000"
```

### Frontend Running?
```
PORT: 3003
URL: http://localhost:3003
Check: Open terminal, see "VITE v5.4.21 ready in ... ms"
```

### Both Running?
```powershell
# Check if processes are alive
Get-Process -Name node
```

---

## 🎯 Test Setup (2 Browser Windows)

### Window A (User 1 - SENDER)
```
Open: http://localhost:3003
Login: Your first Google account
Wait: Profile loads
Action: Keep this window ready to send request
```

### Window B (User 2 - RECEIVER)
```
Open: http://localhost:3003 (new tab or window)
Login: Your second Google account
Wait: Profile loads
DevTools: F12 → Console tab (keep open)
```

---

## 🎬 Test Scenario 1: Send Friend Request

### Step 1: On Window B - Open DevTools Console

Press **F12** and go to **Console** tab. You should see logs like:
```
✅ User ready, fetching notifications: 550e8400...
📢 [AuthContext] Registering user 550e8400... with Socket.IO
✅ [AuthContext] Listener attached
```

### Step 2: On Window A - Send Friend Request

1. Click **Search Icon** (magnifying glass)
2. Type User B's name
3. Click **[SEND FRIEND REQUEST]** button
4. Observe: Button changes to **"🕐 Pending"**

### Step 3: Watch Window B Console

You should see **IMMEDIATELY**:
```
🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT 🔥🔥🔥
📦 [AuthContext] Payload received: {...}
📦 [AuthContext] Sender: [User A Name]
✅ [AuthContext] Setting incomingFriendRequest state
```

### Step 4: Watch Window B Screen

A **POPUP** should appear on the dashboard showing:
```
[Sender's Profile Picture]
"[User A Name] wants to be your friend"
[Accept] [Reject] buttons
```

**✅ SUCCESS** if popup appears on dashboard (NOT in side panel)

---

## 🎬 Test Scenario 2: Accept Request from Popup

### Step 1: On Window B - Click Accept

Click the **[Accept]** button in the popup

### Step 2: Watch Console

You should see:
```
✅ [Chat] Request accepted
✅ [Chat] Request rejected  (or this if you reject)
```

### Step 3: Watch Popup

Popup should **CLOSE IMMEDIATELY**

### Step 4: Wait ~5 Seconds

Requests panel should update showing friend is now "accepted"

**✅ SUCCESS** if popup closes and panel updates

---

## 📋 Console Log Checklist

### Expected Logs - Backend Console

```
✅ Friend request created, request ID: [UUID]
🔥🔥🔥 [friends.js] FRIEND REQUEST EVENT 🔥🔥🔥
📢 Emitting to room: 660e8400... (receiver UUID)
✅ Event emitted successfully
```

### Expected Logs - Frontend Console (Window B)

```
✅ [REGISTER] Socket joined to room: 550e8400...
🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT 🔥🔥🔥
📦 [AuthContext] Payload received: {requestId: "...", senderId: "...", senderName: "..."}
✅ [AuthContext] Setting incomingFriendRequest state
```

---

## ❌ Troubleshooting

### Problem: No Popup Appears

**Check 1: Backend Console**
```
Look for: 🔥🔥🔥 [friends.js] FRIEND REQUEST EVENT 🔥🔥🔥
If missing: Backend didn't emit event
Action: Check if receiver found (search logs for "Receiver not found")
```

**Check 2: Frontend Console (Window B)**
```
Look for: 🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT
If missing: Socket listener not receiving
Action: Verify socket is connected - look for [REGISTER] log
```

**Check 3: Socket Registration**
```
Frontend console should show:
✅ Socket joined to room: 550e8400...
If missing: User not registered with socket
```

### Problem: "Receiver not found" Error

**Solution**:
```
Make sure User B has:
1. Completed profile setup
2. Has valid uuid (36 chars)
3. Is logged in with Google OAuth
```

### Problem: Popup Appears in Side Panel

**Status**: This was already fixed - shouldn't happen
Check: Is Layout.jsx rendering GlobalFriendRequestPopup? (should be disabled)

### Problem: Multiple Popups or Flashing

**Status**: This was already fixed by removing refreshNotifications()
Check: Make sure you have latest code

---

## 🔍 Advanced Testing

### Test: Reject Request

```
1. Send request (Window A → B)
2. On Window B, click [Reject] in popup
3. Popup should close
4. Panel updates in 5 seconds
```

### Test: Multiple Requests

```
1. Open 3+ Google accounts
2. Send requests from User B and C to User A
3. Verify multiple popups don't stack
4. Each should require separate action
```

### Test: Rapid Requests

```
1. Send 3 requests quickly
2. Verify backend handles all
3. Check no crashes or errors
4. All should eventually reach receiver
```

---

## 📊 Success Criteria

All tests must pass:

- [ ] Send request → Button changes immediately ✅
- [ ] Receiver gets real-time popup (not delayed) ✅
- [ ] Accept button works → Popup closes ✅
- [ ] Reject button works → Popup closes ✅
- [ ] Panel updates in ~5 seconds ✅
- [ ] No console errors (warnings OK) ✅
- [ ] Two requests don't conflict ✅
- [ ] Can accept/reject same person again ✅

---

## 🎮 Quick Commands

### Reset for New Test
```powershell
# Kill all - start fresh
Get-Process -Name node | Stop-Process -Force
Start-Sleep -Seconds 3

# Start backend
cd C:\Users\nikhi\Downloads\joi\backend
node server.js
```

### Start Frontend (new terminal)
```powershell
cd C:\Users\nikhi\Downloads\joi\frontend
npm run dev
```

### Monitor Backend Logs
```
Watch the backend terminal for:
🔥🔥🔥 [friends.js] FRIEND REQUEST EVENT
```

### Monitor Frontend Logs
```
DevTools Console (F12) shows:
🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT
```

---

## 📝 Test Report Template

```
TEST DATE: [DATE]
TESTER: [NAME]

✅ Test 1: Send Request
   Button state: [PASS/FAIL]
   Backend logs: [PASS/FAIL]
   Frontend logs: [PASS/FAIL]
   
✅ Test 2: Real-Time Popup
   Popup appears: [PASS/FAIL]
   Location (dashboard): [PASS/FAIL]
   User info displayed: [PASS/FAIL]
   
✅ Test 3: Accept from Popup
   Closes immediately: [PASS/FAIL]
   No errors: [PASS/FAIL]
   Panel updates: [PASS/FAIL]
   
✅ Test 4: Reject from Popup
   Closes immediately: [PASS/FAIL]
   No errors: [PASS/FAIL]
   Panel updates: [PASS/FAIL]

SUMMARY: [PASS/FAIL]
ISSUES: [List any]
```

---

## ⏱️ Expected Timeline

```
T+0s:  User A sends request
T+0-1s: Button changes (instant feedback)
T+0-2s: Receiver sees popup (socket delivery)
T+2-3s: User B clicks accept
T+3s:   Popup closes (immediate)
T+3-8s: Requests panel detects change
T+8s:   Panel shows "accepted" (auto-update)

Total flow: ~8 seconds
```

---

## 🚀 Ready to Test?

1. ✅ Have 2 Google accounts ready?
2. ✅ Backend running?
3. ✅ Frontend running?
4. ✅ DevTools console open (Window B)?
5. ✅ Read success criteria?

**GO!** → Open Window A + Window B and start testing

---

## 💡 Pro Tips

1. **Keep DevTools open** for logs - don't close between tests
2. **Check timestamps** - logs show when events happen
3. **Screenshot errors** - useful for debugging
4. **Try waiting** - some updates take 5 seconds (polling)
5. **Refresh if needed** - Ctrl+R to restart connection

---

## 📞 Common Issues

| Issue | Solution |
|-------|----------|
| Popup in side panel | Should not happen (UI fix applied) |
| No popup | Check backend logs for "Receiver not found" |
| Popup takes 5+ seconds | Check socket connection (REGISTER log) |
| Multiple popups stack | Should not happen (one per request) |
| Errors in console | Screenshot and check backend logs |

---

**Status**: Ready for Testing ✅

