# Friend Request Separation - Local Testing Guide 🧪

## ✅ Servers Status

- **Backend**: http://localhost:5000 ✅ Running
  - API endpoints active
  - Socket.IO ready
  - [SENT-REQUESTS API] working ✅
  
- **Frontend**: http://localhost:3003 ✅ Running 
  - React app loaded
  - Ready for testing

---

## 🎯 Testing Scenario: Two Accounts

You'll test with **2 browser windows/tabs** using 2 different Google accounts.

### Account A (Sender)
- Will send friend request
- Should see request in ❤️ Requests panel

### Account B (Receiver)  
- Will receive request
- Should see popup instantly (not in ❤️ panel)
- Will accept/reject request

---

## 📋 Step-by-Step Testing

### STEP 1: Open Two Browser Windows

**Window A & Window B**
```
Window A: Chrome (Account A - Sender)
Window B: Chrome (Account B - Receiver)

Both navigate to: http://localhost:3003
```

### STEP 2: Login with Two Different Google Accounts

**Window A:**
- Click "Login with Google" or social login button
- Login with **Account A** (e.g., youremail@gmail.com)
- Wait for dashboard to load

**Window B:**
- In separate window, go to http://localhost:3003
- Click "Login with Google"
- Login with **Account B** (different Google account)
- Wait for dashboard to load

✅ Both windows should show the main dashboard

---

### STEP 3: Account A Sends Friend Request

**In Window A (Sender):**

1. Click 🔍 **Search icon** (top-right)
2. Type Account B's **public_id** (8-character ID, e.g., "abcd1234")
   - Find this in Account B's profile or copy from Account B's dashboard
3. Account B should appear in search results
4. Click 🤝 **FRIEND button** next to Account B
5. Button should change to ⏳ **SENT** (disabled)

**Console Check (Window A):**
```
✅ Friend request sent to: [Account B public_id]
```

---

### STEP 4: Account B Receives Popup (THE CRITICAL TEST)

**In Window B (Receiver):**

Watch for popup appearing on the **main dashboard** (NOT in search modal)

✅ **Incoming Request Popup** should appear with:
- Account A's profile picture
- Account A's name
- Message: "New Friend Request"
- ✅ **Accept** button (green)
- ❌ **Reject** button (red)

**Important**: 
- Popup should appear **instantly** (socket event)
- Should NOT open the search modal
- Should appear OVER the dashboard

**Console Check (Window B):**
```
🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT 🔥🔥🔥
✅ [AuthContext] Setting incomingFriendRequest state
```

---

### STEP 5: Verify ❤️ Requests Panel (The Key Test)

**In Window B (Receiver):**

While popup is still showing:

1. Click ❤️ **Requests icon** (heart, top-right)
2. SearchFriendsModal opens with "Likes" tab
3. Look for "Sent Requests" section

**✅ EXPECTED**: Shows "No sent requests yet"
**❌ WRONG**: If it shows Account A's incoming request here

**This is the main fix verification!**

---

### STEP 6: Accept Request from Popup

**In Window B:**

1. With popup still visible, click ✅ **Accept** button
2. Popup should **close immediately**
3. Dashboard should still be visible

```
Console output:
✅ Friend request accepted
✅ [Chat] Request accepted
```

---

### STEP 7: Wait ~5 Seconds for Notifications to Update

**In Window B:**

After accepting, wait 5 seconds for the polling cycle to complete.

Then click ❤️ **Requests icon** again.

**✅ EXPECTED**: 
- "Sent Requests" section shows Account A
- Status shows ✓ **Accepted**
- **Message** button is visible (clickable)

---

### STEP 8: Verify Window A Sees Update

**In Window A (Sender):**

1. Click ❤️ **Requests icon**
2. Should see "Sent Requests" section
3. Account B should be listed
4. Status should show ✓ **Accepted** (after 5-10 seconds)

---

### STEP 9: Test Messaging

**In Window B:**

1. In ❤️ Requests panel, find Account A (now showing ✓ Accepted)
2. Click **Message** button
3. Chat should open with Account A

**In Window A:**

1. In ❤️ Requests panel, find Account B  
2. Click **Message** button
3. Chat should open with Account B

✅ Both can now message each other

---

## 🔍 Browser Console Checks

### Account A (Sender) - Expected Console Logs

```
📤 Fetching SENT requests from user
✅ Sent requests loaded: X items
Friend request sent to: [Account B ID]
```

### Account B (Receiver) - Expected Console Logs

```
🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT 🔥🔥🔥
✅ [AuthContext] Setting incomingFriendRequest state
✅ Friend request accepted
```

### Backend Console - Expected Logs

```
[SENT-REQUESTS API] Fetching SENT requests from user: [UUID]
[SENT-REQUESTS API] ✅ Found X sent requests
🔥🔥🔥 [friends.js] FRIEND REQUEST EVENT 🔥🔥🔥
📢 Emitting to room: [receiver UUID]
✅ Event emitted successfully
```

---

## ✅ Success Criteria (All Must Pass)

- [ ] Account A can send friend request from Search modal
- [ ] Account B receives popup **instantly** (not delayed)
- [ ] Account B's ❤️ Requests panel shows "No sent requests yet"
- [ ] **Incoming request does NOT appear in Account B's requests list**
- [ ] Popup closes when Account B clicks Accept
- [ ] After ~5 seconds, both panels show "Accepted" status
- [ ] Can message in chat after accepting
- [ ] No "column 'uuid' does not exist" errors
- [ ] No React errors in console

---

## 🚨 Troubleshooting

### Popup Not Appearing

**Problem**: Popup doesn't show in Window B

**Check**:
```
1. Backend logs show: "Event emitted successfully"?
2. Account B registered with socket: "socket joined to room"?
3. Browser console shows socket event received?
4. Try refreshing Window B dashboard
5. Check browser console for JavaScript errors
```

### Incoming Request in ❤️ Panel (Wrong!)

**Problem**: Account B sees incoming request in SearchFriendsModal

**Check**:
```
1. Frontend using sentRequests (not notifications)?
2. Backend returning correct query (receiver_id = user)?
3. AuthContext exporting sentRequests (not notifications)?
4. Hard refresh browser cache (Ctrl+Shift+Delete)
```

### "Accept" Button Not Working

**Problem**: Click Accept, nothing happens

**Check**:
```
1. Backend shows: "Friend request accepted"?
2. Console shows: "POST /api/friends/accept" 200?
3. Try rejecting instead
4. Check for network errors in Network tab
```

### Popup Appears But Icon Shows Wrong Name

**Problem**: Sender name is wrong in popup

**Check**:
```
1. Backend logs show correct senderName in payload
2. Account A's profile display_name is set
3. Try sending from different account
```

---

## 📊 Test Variations

**Test A: Reject Request**
- Account A sends request
- Account B receives popup
- Click ❌ **Reject** button
- Popup closes
- Request should disappear from list

**Test B: Multiple Requests**
- Account A sends to multiple accounts
- Check ❤️ panel shows all in sent requests
- No incoming requests should appear

**Test C: Switching Tabs**
- Account B sends request
- Account A has it in sent list
- Account B receives popup
- Close and reopen ❤️ panel
- Request should still be there

---

## 🎬 Real-Time Observation Points

Watch the **Browser Dev Tools**:

1. **Network Tab**
   - ✅ GET /api/sent-requests → 200
   - ✅ GET /api/friends/send → 200
   - ✅ POST /api/friends/accept → 200

2. **Console Tab**
   - ✅ Socket events: [AuthContext - Listener]
   - ✅ API calls logging
   - ❌ No errors about 'uuid' column

3. **Applications Tab**
   - Check localStorage still has valid token
   - Check user UUID (36 characters)

4. **Backend Terminal**
   - Watch for [SENT-REQUESTS API] logs
   - Watch for 🔥 FRIEND REQUEST EVENT logs
   - Watch socket.join() confirmation

---

## 📝 Quick Reference

| Action | Window | Expected Result |
|--------|--------|-----------------|
| Send Request | A | Button → SENT ⏳ |
| Receive | B | Popup appears instantly |
| Check panel | B | "No sent requests yet" |
| Accept | B | Popup closes |
| Refresh panel | B | Shows "✓ Accepted" |
| Check panel | A | Shows "✓ Accepted" after 5sec |
| Message | A→B | Chat opens |
| Message | B→A | Chat opens |

---

## 🎯 Main Verification: The Critical Test

**This is what proves the fix works:**

```
Account B opens ❤️ Requests panel
     ↓
Should show NOTHING from Account A
(No incoming request row)
     ↓
✅ FIX IS WORKING!

If it shows Account A's request here:
     ↓
❌ Something is wrong - check console
```

---

Start testing now! Open two browser windows at http://localhost:3003 🚀
