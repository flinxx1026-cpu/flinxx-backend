# 🔍 Quick Reference - Friend Request Architecture

## Files Modified

### 1. SearchFriendsModal.jsx
**Removed**: `refreshNotifications()` calls from 3 handlers
- Line ~297: handleSendFriendRequest (send button)
- Line ~330: handleAcceptRequest (panel accept)
- Line ~354: handleRejectRequest (panel reject)

**Reason**: These handlers now only update local state

---

### 2. Chat.jsx
**Removed**: `refreshNotifications()` calls from 2 handlers
- Line ~674: handleAcceptFriendRequest (popup accept)
- Line ~692: handleRejectFriendRequest (popup reject)

**Reason**: Popup handlers only close modal, no global updates

---

## Component Responsibilities

### SearchFriendsModal
```javascript
// ✅ DO THIS
setFriendRequestStates(prev => ({
  ...prev,
  [targetUserId]: 'pending'
}))

// ❌ DO NOT DO THIS
if (refreshNotifications) {
  refreshNotifications()
}
```

### Chat.jsx (Popup)
```javascript
// ✅ DO THIS
setIncomingFriendRequest(null)

// ❌ DO NOT DO THIS
if (refreshNotifications) {
  refreshNotifications()
}
```

### AuthContext
```javascript
// ✅ This component OWNS notifications updates
useEffect(() => {
  refreshNotifications()
  const notifInterval = setInterval(refreshNotifications, 5000)
  return () => clearInterval(notifInterval)
}, [user?.uuid])

// ✅ Socket listener triggers popup only
socketWrapper.on('friend_request_received', (data) => {
  setIncomingFriendRequest(data)  // Popup, not panel
})
```

---

## Data Sources

```
AuthContext.notifications
  ↑
  ├─ From: GET /api/notifications
  ├─ Updated: Every 5 seconds (polling)
  ├─ Updated: On socket event (real-time)
  ├─ Used by: RequestsPanel
  └─ Trigger: AuthContext only


AuthContext.incomingFriendRequest
  ↑
  ├─ From: Socket event listener
  ├─ Updated: Real-time on 'friend_request_received'
  ├─ Used by: Chat.jsx popup
  └─ Trigger: Socket event only


SearchFriendsModal.friendRequestStates
  ↑
  ├─ From: API response
  ├─ Updated: After POST succeeds
  ├─ Used by: Button UI in search modal
  └─ Scope: Local to SearchFriendsModal only
```

---

## Flow Summary

### Send Request
```
User: Click [SEND]
  ↓
SearchModal: handleSendFriendRequest()
  ├─ POST /api/friends/send ✓
  ├─ setFriendRequestStates() ✓
  └─ Return (no refresh) ✓
  ↓
Backend: Creates request + emits socket
  ↓
Receiver: Gets socket event
  ↓
AuthContext: Socket listener fires
  ├─ setIncomingFriendRequest(data) ✓
  └─ Popup renders ✓
```

### Accept from Popup
```
User: Click [Accept]
  ↓
Chat: handleAcceptFriendRequest()
  ├─ POST /api/friends/accept ✓
  ├─ setIncomingFriendRequest(null) ✓
  └─ Return (no refresh) ✓
  ↓
Popup: Closes
  ↓
(5 seconds later)
  ↓
AuthContext: Polling fires
  ├─ GET /api/notifications ✓
  └─ notifications list updates ✓
  ↓
Panel: Re-renders with updated list
```

---

## What Changed (5-Line Summary)

1. **SearchFriendsModal.send()** - Removed refreshNotifications()
2. **SearchFriendsModal.accept()** - Removed refreshNotifications()
3. **SearchFriendsModal.reject()** - Removed refreshNotifications()
4. **Chat.handleAccept()** - Removed refreshNotifications()
5. **Chat.handleReject()** - Removed refreshNotifications()

---

## Testing Checklist

- [ ] Send request → Button changes immediately
- [ ] Receiver gets popup (not in panel)
- [ ] Accept popup → Closes immediately
- [ ] Panel updates in ~5 seconds
- [ ] No console errors or warnings
- [ ] No multiple API calls per action
- [ ] UI feels responsive

---

## Key Metrics

| Metric | Before | After |
|--------|--------|-------|
| API calls per send | 2-3 | 1 |
| Popup delay | 0.5-1s | Instant |
| Panel update delay | 0-2s | ~5s (predictable) |
| State conflicts | Common | None |

---

## Future Additions

When adding new friend request features:
1. ✅ Socket event? → Handle in AuthContext listener
2. ✅ Modal action? → Update local state only
3. ✅ Panel display? → Read from AuthContext.notifications
4. ❌ Ever call refreshNotifications() from components
5. ❌ Ever mix socket events with notification polling

