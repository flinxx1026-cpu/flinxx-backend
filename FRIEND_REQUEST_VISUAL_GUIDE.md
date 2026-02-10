# Friend Request Flow - Visual Guide

## 📌 Three Different Screens, Three Different Places

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER'S DASHBOARD                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📷 Video Chat Screen - Partner View                             │
│  ┌──────────────────────────────────────┐                        │
│  │                                      │   ← GREEN ICON HERE     │
│  │     Video of Partner          👤   ⚠️  │   (Profile Icon)      │
│  │                                      │   ← CLICK = Send FR     │
│  │                                      │                        │
│  └──────────────────────────────────────┘                        │
│                                                                  │
│ ACTION: Click green icon → Sends REAL friend request             │
│ RESULT: Creates database entry → Other user gets POPUP           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Friends & Requests Panel (When You Click ❤️ Icon)

```
┌──────────────────────────────────┐
│  ❤️ Friends & Requests           │
├──────────────────────────────────┤
│                                  │
│  💚 Incoming Requests (1)        │  ← SECTION 1: NEW!
│  ────────────────────────        │     Requests FROM others
│  👤 User A                        │
│     ⏳ Wants to be your friend    │
│     [✓ Accept] [✕ Reject]        │
│                                  │
│  📤 Sent Requests (2)            │  ← SECTION 2: Your requests
│  ────────────────────────        │     Requests TO others
│  👤 User B                        │
│     ⏳ Request sent              │
│                                  │
└──────────────────────────────────┘
```

---

## 3️⃣ Popup When Receiving Request

```
┌────────────────────────────────┐
│           [X]                  │  ← Close button
│                                │
│        👤                       │  ← Sender's avatar
│                                │
│    User A                      │
│    wants to be your friend     │
│                                │
│  [Reject]          [Accept]    │
│                                │
└────────────────────────────────┘

When appears: When someone sends you a request
Appears on: Your dashboard screen (any screen)
```

---

## 🔄 Complete Request Lifecycle

### SENDER'S PERSPECTIVE:

```
STEP 1: In Video Chat
   Video Chat Screen
   └─ Click 🟢 Profile Icon
   
STEP 2: Send Request
   sendQuickInvite() 
   └─ Calls /api/friends/send
   
STEP 3: In Friends & Requests
   ❤️ Panel opens
   └─ Section 2: "📤 Sent Requests"
   └─ Shows "User X - Request sent"
   └─ Status: ⏳ Request sent (until accepted)

STEP 4: After Accepted
   └─ Status changes to: "✓ Friends"
   └─ Can click Message button
```

### RECEIVER'S PERSPECTIVE:

```
STEP 1: Other User Sends Request
   [Anywhere on their dashboard]
   
STEP 2: You GET POPUP
   🔔 Popup appears (wherever you are)
   ┌─────────────────────┐
   │ User X              │
   │ wants to be friend  │
   │ [✓] [✕]           │
   └─────────────────────┘
   
STEP 3: You Accept/Reject from Popup
   Click ✓ Accept
   └─ Popup closes
   └─ Request becomes "accepted"
   
STEP 4: View in Friends & Requests
   Click ❤️ icon
   └─ Section 1: "💚 Incoming Requests"
   └─ Shows "User X - ✓ Friends"
   └─ Can now Message them
   
OR

STEP 3 ALT: Ignore Popup, Check Panel Later
   Click ❤️ icon
   └─ Section 1: "💚 Incoming Requests"
   └─ Shows "User X - Wants to be friend"
   └─ Can Accept/Reject from panel
```

---

## 📍 Key Locations

| Location | Icon | What Shows | API Used |
|----------|------|-----------|----------|
| **Video Chat Screen** | 🟢 Profile | Send friend request button | `/api/friends/send` |
| **Friends Panel - Section 1** | 💚 Incoming | Requests FROM others | `/api/notifications` |
| **Friends Panel - Section 2** | 📤 Sent | Requests TO others | AuthContext |
| **Popup (Anywhere)** | 🔔 Toast | Real-time notification | Socket event |

---

## ✅ Important Rules

### DO:
- ✅ Send requests from profile icon (creates database entry)
- ✅ Show popup when receiving request (real-time)
- ✅ Display incoming requests in Friends & Requests panel
- ✅ Keep search modal SEPARATE (no friend requests there)

### DON'T:
- ❌ Send socket-only ephemeral requests
- ❌ Mix requests with search results
- ❌ Show incoming requests in search modal
- ❌ Use multiple notification refresh calls

---

## 🚀 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ SENDER: Clicks 🟢 Profile Icon in Video Chat              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │ sendQuickInvite()        │
        │ Calls:                   │
        │ /api/friends/send        │
        └──────────────┬───────────┘
                       │
        ┌──────────────┴───────────┐
        │                          │
        ▼                          ▼
    SENDER             RECEIVER
    Send Side          Receive Side
    ┌─────────────────────┐
    │ Backend Creates:    │
    │ • DB Entry          │
    │ • Socket Event      │
    │ • "friend_request"  │
    └─────────┬───────────┘
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
    SENDER      RECEIVER
    View in     See
    Panel ❤️    Popup 🔔
    
    Section 2:      "User wants to
    "Sent X"        be your friend"
    
    Next: Can       Next: Can
    Accept/Reject   Accept/Reject
    from panel      from popup
```

---

## 🎯 Test Scenarios

### Test 1: Send from Profile Icon
1. Start video chat with someone
2. Click 🟢 profile icon
3. ✅ Should see send request button
4. Click to send
5. Other person should SEE POPUP

### Test 2: View in Friends Panel
1. Click ❤️ hearts icon
2. ✅ Should see "💚 Incoming Requests"
3. ✅ Should see "📤 Sent Requests"
4. Try Accept/Reject buttons
5. Status should update

### Test 3: Accept Request
- From POPUP: Click Accept → Popup closes
- From PANEL: Click Accept button → Status updates
- Both should work the same way

### Test 4: Check Not in Search
1. Open search modal
2. ✅ Should NOT show friend requests
3. Search results should be SEPARATE
4. Friend requests are ONLY in:
   - Popup 🔔
   - Friends & Requests panel ❤️

---

**Last Updated:** February 10, 2025
**Status:** ✅ Ready for Testing
