# Friend Request Separation Fix - Complete Implementation ✅

## Problem Statement

Friend requests were being mixed together:
- **Requests sent FROM Search modal** were appearing in the list ✓ (correct)
- **Requests received TO the user** were also appearing in the same list ✗ (should only appear as popup)

This caused incoming requests to:
1. Show in the Search/Friends & Requests panel when they shouldn't
2. Mix with outgoing requests, causing UI confusion
3. Not appear separately as real-time popups on the dashboard

## Solution: Complete Separation

We've separated incoming and sent requests into two completely independent flows:

### Flow 1: Sent Requests (Search Modal) ✅
- **Source**: Requests USER SENDS to others
- **Channel**: AuthContext → API → SearchFriendsModal
- **Display**: Friends & Requests panel (❤️ icon) shows sent requests
- **Polling**: Updates every 5 seconds
- **Actions**: View status (Pending/Accepted), message if accepted

### Flow 2: Incoming Requests (Dashboard Popup) ✅
- **Source**: Requests USER RECEIVES from others
- **Channel**: Backend socket → AuthContext → Chat.jsx popup
- **Display**: Real-time popup on dashboard ONLY (never in search modal)
- **Trigger**: Instant socket event (not polling)
- **Actions**: Accept/Reject buttons
- **Behavior**: Popup closes after action, notifications update in 5 seconds

## Changes Made

### 1. Backend: Added New Endpoint (notifications.js)

**New Endpoint**: `GET /api/sent-requests?userId=UUID`

Returns requests WHERE `sender_id = user_id` (requests user SENT)

```javascript
// SENT REQUESTS - Requests SENT by user
router.get('/sent-requests', async (req, res) => {
  const query = `
    SELECT f.id, f.sender_id, f.receiver_id, f.status, f.created_at,
           u.id as user_id, u.public_id, u.display_name, u.photo_url
    FROM friend_requests f
    JOIN users u ON u.id = f.receiver_id
    WHERE f.sender_id = $1
      AND f.status IN ('pending', 'accepted')
    ORDER BY f.created_at DESC
  `;
  // Returns receiver info (who user sent request to)
});
```

**Existing Endpoint**: `GET /api/notifications?userId=UUID`

Now returns ONLY requests WHERE `receiver_id = user_id` (requests user RECEIVED)

```javascript
// INCOMING REQUESTS - Requests RECEIVED by user (for popup only)
router.get('/notifications', async (req, res) => {
  const query = `
    SELECT f.id, f.sender_id, f.receiver_id, f.status, f.created_at,
           u.id as user_id, u.public_id, u.display_name, u.photo_url
    FROM friend_requests f
    JOIN users u ON u.id = f.sender_id
    WHERE f.receiver_id = $1
      AND f.status IN ('pending', 'accepted')
    ORDER BY f.created_at DESC
  `;
  // Returns sender info (who sent the request)
});
```

### 2. Frontend API Service (api.js)

Added new function alongside existing `getNotifications`:

```javascript
// Fetch sent requests (requests sent BY user)
export const getSentRequests = async (userUUID) => {
  const response = await fetch(
    `${BACKEND_URL}/api/sent-requests?userId=${userUUID}`,
    { method: 'GET', headers: getAuthHeaders() }
  );
  return await response.json();
};

// Update getNotifications() comment as "for popup only"
export const getNotifications = async (userUUID) => {
  // Now labeled as "INCOMING - received by user"
  // Used ONLY for socket listeners (popup display)
};
```

### 3. AuthContext: Separated State Management (AuthContext.jsx)

**Before**: Single `notifications` state for all requests

**After**: Two separate concerns

```javascript
// SENT REQUESTS (for SearchFriendsModal)
const [sentRequests, setSentRequests] = useState([]);
const refreshSentRequests = async () => {
  const data = await getSentRequests(user.uuid);
  setSentRequests(Array.isArray(data) ? data : []);
};

// INCOMING REQUEST POPUP (for dashboard)
const [incomingFriendRequest, setIncomingFriendRequest] = useState(null);
// Updated ONLY by socket listener, NOT by polling

// Export both
return (
  <AuthContext.Provider value={{
    sentRequests,        // ← For SearchFriendsModal
    refreshSentRequests,
    incomingFriendRequest,      // ← For Chat.jsx popup
    setIncomingFriendRequest
  }}>
);
```

**Polling Schedule**:
- `sentRequests`: Every 5 seconds (for search panel auto-refresh)
- `incomingFriendRequest`: Only via socket events (instant)

### 4. SearchFriendsModal: Use Sent Requests Only (SearchFriendsModal.jsx)

**Before**:
```javascript
const { notifications, refreshNotifications } = useContext(AuthContext);
const pendingRequests = notifications || []; // Mixed incoming + outgoing
```

**After**:
```javascript
const { sentRequests, refreshSentRequests } = useContext(AuthContext);
const pendingRequests = sentRequests || []; // ONLY outgoing requests

// Updated display
// 📤 Sent Requests (instead of 📬 Incoming Requests)
// Shows: Users you sent requests to
// Actions: Message (if accepted), status badges
// NO accept/reject buttons (those are for incoming only)
```

**In Likes Mode** (❤️ Requests icon):
- Shows "Sent Requests" section with users you've requested
- Each entry shows receiver name, photo, status
- "Message" button appears when accepted
- Status indicators: ⏳ Pending, ✓ Accepted, ✗ Rejected

### 5. Chat.jsx: Popup Unchanged (Already Correct)

The incoming friend request popup in Chat.jsx was already correctly connected:

```javascript
const { incomingFriendRequest, setIncomingFriendRequest } = useContext(AuthContext);

// In render:
{incomingFriendRequest && (
  <FriendRequestPopup
    request={incomingFriendRequest}
    onAccept={handleAcceptFriendRequest}
    onReject={handleRejectFriendRequest}
    onClose={() => setIncomingFriendRequest(null)}
  />
)}
```

✅ This component continues to show incoming requests as a real-time popup

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRIEND REQUESTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER A (Sender)                       USER B (Receiver)        │
│  ├─ Sends request                       ├─ Receives request    │
│  │  via Search modal                    │  via socket           │
│  │                                       │                       │
│  └─ Stored in sent_requests             └─ Popup appears       │
│      │                                       │                   │
│      ├─ AuthContext                         ├─ AuthContext      │
│      │  sentRequests state                  │  incomingFriendReq │
│      │  (polling 5sec)                      │  (socket event)    │
│      │                                       │                   │
│      └─ SearchFriendsModal                  └─ Chat.jsx popup   │
│         Friends & Requests                    Dashboard         │
│         Shows: "Sent Requests"             Shows: "New Request" │
│         Actions: View/Message                Actions: Accept    │
│                                                        Reject    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flows

### Sending a Friend Request (Search Modal)
```
User A types public_id in Search
  → Search Modal.sendFriendRequest()
  → POST /api/friends/send
  → Backend: INSERT into friend_requests
  → Backend: io.to(receiver.id).emit('friend_request_received', {...})
  → AuthContext updatesSentRequests (next polling cycle, 5sec)
  → SearchFriendsModal shows updated list

User B receives:
  → Socket event received
  → AuthContext: setIncomingFriendRequest(data)
  → Chat.jsx re-renders
  → FriendRequestPopup appears instantly
```

### Accepting a Friend Request (Popup)
```
User B clicks Accept in popup
  → Chat.handleAcceptFriendRequest()
  → POST /api/friends/accept
  → Popup closes: setIncomingFriendRequest(null)
  → Next polling cycle: AuthContext updates sentRequests
  → User A's SearchFriendsModal shows "Accepted"
  → User B's notifications panel (SearchModal likes) updates next cycle
```

## API Endpoints Summary

| Endpoint | Direction | Returns | Purpose |
|----------|-----------|---------|---------|
| GET /api/sent-requests | User SENDING | sent requests | For search modal list |
| GET /api/notifications | User RECEIVING | incoming requests | For socket-triggered popup |
| POST /api/friends/send | - | - | Create request |
| POST /api/friends/accept | - | - | Accept request |
| POST /api/friends/reject | - | - | Reject request |

## Database Queries

### Sent Requests
```sql
SELECT * FROM friend_requests 
WHERE sender_id = $1 
AND status IN ('pending', 'accepted')
```

### Incoming Requests
```sql
SELECT * FROM friend_requests 
WHERE receiver_id = $1 
AND status IN ('pending', 'accepted')
```

## Testing Checklist

- [ ] Open browser with 2 accounts (Account A & Account B)
- [ ] Account A: Search for Account B, click Send Request
- [ ] Account A: Open ❤️ Requests panel → sees "Sent Requests" → Account B listed
- [ ] Account B: Popup appears instantly with Account A's info
- [ ] Account B: No incoming requests in SearchFriendsModal ❤️ panel
- [ ] Account B: Click Accept in popup → closes immediately
- [ ] Account B: Open ❤️ Requests panel → now shows accepted request
- [ ] Both: Can open chat and message each other
- [ ] No console errors about "column 'uuid' does not exist"
- [ ] Popup doesn't interfere with search modal
- [ ] SearchFriendsModal lists only sent requests

## Files Modified

1. **backend/routes/notifications.js** - Split into sent/incoming endpoints
2. **frontend/src/services/api.js** - Added getSentRequests()
3. **frontend/src/context/AuthContext.jsx** - Separated sentRequests and incomingFriendRequest
4. **frontend/src/components/SearchFriendsModal.jsx** - Use sentRequests instead of notifications

## Files NOT Modified

- ✓ Chat.jsx - Already correct
- ✓ FriendRequestPopup.jsx - Already correct
- ✓ backend/routes/friends.js - Already correct
- ✓ backend/server.js - Already correct

## Key Architectural Principles

1. **Single Responsibility**: Each component handles one type of request
2. **Separate Data Sources**: Sent vs Incoming are independent states
3. **Different Update Mechanisms**: Sent = polling, Incoming = socket
4. **No Cross-Contamination**: SearchFriendsModal never shows incoming requests
5. **Instant Feedback**: Popups appear immediately via socket, not delayed by polling

## Troubleshooting

**Incoming requests still showing in search panel?**
- Check that SearchFriendsModal is using `sentRequests` not `notifications`
- Verify backend is returning correct requests for each endpoint
- Check AuthContext is exporting `sentRequests` not `notifications`

**Popup not appearing?**
- Check socket connection is established
- Verify `register_user` event is being emitted
- Check socket.join(userId) is called in backend
- Verify friend_request_received event is being emitted to correct room

**Sent requests not updating?**
- Check polling interval (should be 5 seconds)
- Verify AuthContext useEffect has correct dependencies
- Check API is returning data correctly

---

## Deployment Notes

When deploying:
1. Update backend first (new endpoint)
2. Update frontend (API + context + components)
3. No database migration needed (uses existing table)
4. No breaking changes to existing APIs
5. Fully backward compatible
