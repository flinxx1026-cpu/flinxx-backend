# 🎯 Testing Guide - Friend Request Real-Time Popup

## ✅ Server Status

- **Backend**: http://localhost:5000 ✅ Running
- **Frontend**: http://localhost:3003 ✅ Running
- **Database Error**: ✅ FIXED (no more "column 'uuid' does not exist")

---

## 📋 Test Setup

### Step 1: Open Two Browser Windows/Tabs

**Window A (User 1 - Sender)**:
- http://localhost:3003
- Login with your first Google account
- Profile should complete
- You'll be on the dash board/chat page

**Window B (User 2 - Receiver)**:
- http://localhost:3003
- Login with your second Google account  
- Profile should complete
- You'll be on the dashboard/chat page

---

## 🧪 Test Case 1: Real-Time Popup Flow

### On Window B (Receiver - Keep This Window Active)

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for these logs**:
   - `✅ [REGISTER] Socket joined to room: [UUID first 8 chars]...`
   - `👥 [ONLINE USERS] All UUIDs: ...`

### On Window A (Sender)

1. **Click Search icon** (magnifying glass)
2. **Search for the receiver's name** (from User 2 profile)
3. **Click "SEND FRIEND REQUEST" button** (usually a heart or + icon)
4. **Watch Window B immediately!**

### Expected Results on Window B

**Backend Console** (your server terminal):
```
🔥🔥🔥 [friends.js] FRIEND REQUEST EVENT 🔥🔥🔥
📢 Emitting to room: 550e8400e29b... (receiver's UUID)
📢 Payload: {requestId: ..., senderId: ..., senderName: "..."}
✅ Event emitted successfully
```

**Frontend Console** (Browser DevTools):
```
🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT 🔥🔥🔥
📦 [AuthContext] Payload received: {...}
📦 [AuthContext] Sender: [User 1 Name]
📦 [AuthContext] Request ID: [UUID]
✅ [AuthContext] Setting incomingFriendRequest state
✅ [AuthContext] State updated - Component should re-render NOW!
```

**Visual**:
- ✅ Modal/Popup appears on **dashboard** (NOT in side panel)
- ✅ Shows sender's profile image (or letter fallback)
- ✅ Shows message: "[Sender Name] wants to be your friend"
- ✅ Has "Accept" and "Reject" buttons

---

## 🧪 Test Case 2: Accept Friend Request

### On Window B (Receiver)

1. **Click "Accept" button** in the popup
2. **Watch console for**:
   ```
   ✅ [Chat] Request accepted
   ```
3. **Popup should close**
4. **User should appear in friends list**

---

## 🧪 Test Case 3: Reject Friend Request

### Toggle Test (Do this in reverse)

1. **Close popup** (click X or wait)
2. **Request should stay in notifications**
3. **On Window A, search again**
4. **Status should show different button** (usually "Send Request" or "Friends")

---

## 🔍 Debugging - What To Look For

### If Popup Doesn't Appear

**Check Backend Console**:
```
❌ Receiver not found: [ID]
```
→ **Fix**: Verify receiver's public_id is correct

**Check Backend Console**:
```
📢 Emitting to room: undefined
```
→ **Fix**: receiver.id is undefined - database query failed

**Check Frontend Console**:
```
⚠️ [AuthContext] Invalid event - missing requestId
```
→ **Fix**: Check socket emission payload in backend

### If Popup Appears in Notifications Panel Instead of Dashboard

✅ **Already Fixed!** - GlobalFriendRequestPopup is now disabled

### If No "FRIEND REQUEST RECEIVED" Log

**Backend Check**:
1. Is socket.join(userId) being called?
2. Is io.to(receiver.id).emit() being called?
3. Check for errors: `io is undefined`

**Frontend Check**:
1. Is socket listener attached? Check: `✅ [AuthContext] Listener attached`
2. Is user.uuid 36 chars? Check: `✅ Socket joined to room: ...`

---

## 📊 Complete Data Flow Verification

### Step 1: Verify Backend /api/profile

**Frontend Console**, after login:
```javascript
// Open DevTools Console and run:
fetch('http://localhost:5000/api/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(d => console.log('User object:', d.user))
```

**Expected response**:
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",  // 36-char UUID
  "publicId": "abc12345",                           // 8-char ID
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "profileCompleted": true
}
```

### Step 2: Verify Socket Registration

**Frontend Console**:
```javascript
// Check if socket registered user
// Look for: ✅ [REGISTER] Socket joined to room: 550e8400... (first 8 chars of UUID)
```

### Step 3: Verify Database - No Errors

**Backend Console** - Should see:
- ✅ Prisma Client initialized
- ✅ Database init complete
- ✅ Tables initialized
- ❌ NO errors about "column 'uuid' does not exist"

---

## 🎮 Quick Test Buttons

### Send Friend Request
```
Window A → Search → User 2 Name → Click [FRIEND] button
         ↓
     Payload sent: {senderPublicId: "abc12345", receiverPublicId: "xyz98765"}
         ↓
Window B → Gets real-time socket event → AuthContext state updates
         ↓
       Popup renders on Chat.jsx (dashboard)
```

### Accept/Reject
```
Window B → Click [Accept] or [Reject]
         ↓
API call to /api/friends/accept or /reject
         ↓
Popup closes (setIncomingFriendRequest(null))
         ↓
New friend appears in friends list
```

---

## 📝 Log Reference

### Good Logs (What You Want To See)

**Backend**:
```
✅ [friends.js] Socket.IO instance set
✅ [server.js] Socket.IO passed to friends routes
✅ [REGISTER] Socket joined to room: 550e8400...
📬 Sending friend request: {senderPublicId: "...", receiverPublicId: "..."}
✅ Friend request created, request ID: [UUID]
🔥🔥🔥 [friends.js] FRIEND REQUEST EVENT 🔥🔥🔥
📢 Emitting to room: 550e8400... (receiver's UUID)
✅ Event emitted successfully
```

**Frontend**:
```
📢 [AuthContext] Registering user 550e8400... with Socket.IO
✅ [AuthContext] Listener attached
🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT 🔥🔥🔥
📦 [AuthContext] Sender: John Doe
✅ [AuthContext] Setting incomingFriendRequest state
✅ [Chat] Request accepted
```

### Red Flags (Errors To Investigate)

```
❌ column "uuid" does not exist
❌ Receiver not found
❌ io is undefined
❌ Socket.IO not initialized
⚠️ Missing requestId
⚠️ Invalid event
```

---

## 🚀 How To Test Different Scenarios

### Scenario 1: Two Devices on Same Wi-Fi

Replace `localhost` with your machine IP:
- Backend: `http://192.168.1.100:5000`
- Frontend: `http://192.168.1.100:3003`

Use your phone + computer

### Scenario 2: Rapid Requests

Send multiple requests quickly to test race conditions

### Scenario 3: Network Connection Loss

Disconnect network → Reconnect → Verify reconnection

### Scenario 4: Tab In Background

Send request → Tab in background → Watch for notification indicator

---

## ✅ Success Criteria

- [ ] No "column 'uuid' does not exist" errors
- [ ] Backend logs show Friend request event
- [ ] Frontend logs show received event
- [ ] Popup appears on dashboard (not side panel)
- [ ] Popup shows sender info correctly
- [ ] Accept button works
- [ ] Reject button works
- [ ] Popup closes after action
- [ ] New friend appears in friends list

---

## 🆘 If Still Not Working

1. **Kill all node processes**:
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Check for typos in fixed code**:
   - Search for `receiver.uuid` - should be `receiver.id`
   - Search for `SELECT.*uuid` - should NOT exist

3. **Verify files were edited**:
   ```
   backend/routes/friends.js - Lines 155, 164, 216, 217
   ```

4. **Restart both servers fresh**:
   - Close both terminal windows
   - Start backend fresh
   - Start frontend fresh

5. **Check database**:
   ```sql
   SELECT column_name FROM information_schema.columns WHERE table_name = 'users';
   ```
   Should show: `id`, `email`, `public_id`, `display_name`, etc.
   Should NOT show: `uuid`

---

## 📞 Contact & Debug Info

**Backend Running**:
- Port: 5000
- Environment: development
- Database: PostgreSQL (Neon)
- Socket.IO: Enabled

**Frontend Running**:
- Port: 3003
- Build Tool: Vite 5.4.21
- Framework: React 18

**Critical Files Changed**:
- ✅ backend/routes/friends.js (uuid → id)
- ✅ No other files needed changes

Status: **READY FOR TESTING** 🎉

