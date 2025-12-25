# Friend Request API Specification

## Overview
This document outlines the backend APIs required to support the friend request flow with FRIEND/SENT/MESSAGE states.

## Database Schema

### friend_requests Collection/Table

```sql
CREATE TABLE friend_requests (
  id VARCHAR(36) PRIMARY KEY,
  senderId VARCHAR(36) NOT NULL,
  receiverId VARCHAR(36) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(id),
  FOREIGN KEY (receiverId) REFERENCES users(id),
  UNIQUE KEY unique_request (senderId, receiverId)
);
```

Or for Firebase/Firestore:

```javascript
// Collection: friend_requests
// Document structure:
{
  id: string,
  senderId: string,
  receiverId: string,
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## API Endpoints

### 1. Send Friend Request

**Endpoint:** `POST /api/friends/send`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "targetUserId": "user-id-string"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Friend request sent",
  "requestId": "request-id-string",
  "status": "pending"
}
```

**Response (Conflict - 409):**
```json
{
  "success": false,
  "message": "Friend request already exists",
  "status": "pending"
}
```

**Business Logic:**
- Check if users are already friends (status = 'accepted')
- Check if a pending request already exists
- Create new friend_request with status = 'pending'
- Return error if already friends or request exists

---

### 2. Check Friend Request Status

**Endpoint:** `GET /api/friends/status/:userId`

**Authentication:** Required (Bearer token)

**Response (200):**
```json
{
  "userId": "user-id-string",
  "status": "none" | "pending" | "accepted" | "rejected"
}
```

**Business Logic:**
- Check relationship between current user and targetUser
- Return status based on:
  - If already friends (status = 'accepted') → return "accepted"
  - If pending request from current user → return "pending"
  - If pending request to current user → return "request_received"
  - Otherwise → return "none"

---

### 3. Get Pending Friend Requests (for Notifications)

**Endpoint:** `GET /api/friends/requests`

**Authentication:** Required (Bearer token)

**Response (200):**
```json
{
  "requests": [
    {
      "id": "request-id-1",
      "senderId": "sender-id",
      "senderName": "John Doe",
      "senderAvatar": "https://...",
      "createdAt": "2025-12-25T10:30:00Z",
      "status": "pending"
    },
    {
      "id": "request-id-2",
      "senderId": "sender-id-2",
      "senderName": "Jane Smith",
      "senderAvatar": "https://...",
      "createdAt": "2025-12-25T09:15:00Z",
      "status": "pending"
    }
  ]
}
```

**Business Logic:**
- Fetch all friend_requests where receiverId = current user AND status = 'pending'
- Include sender user details (name, avatar)
- Sort by createdAt descending

---

### 4. Accept Friend Request

**Endpoint:** `POST /api/friends/accept`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "requestId": "request-id-string"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Friend request accepted",
  "status": "accepted"
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "message": "Friend request not found"
}
```

**Business Logic:**
- Fetch friend_request with given requestId
- Verify current user is the receiver
- Update request status to 'accepted'
- (Optional) Create reverse entry or flag in users table
- Return success response

---

### 5. Reject Friend Request

**Endpoint:** `POST /api/friends/reject`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "requestId": "request-id-string"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Friend request rejected",
  "status": "rejected"
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "message": "Friend request not found"
}
```

**Business Logic:**
- Fetch friend_request with given requestId
- Verify current user is the receiver
- Update request status to 'rejected'
- Delete or mark as deleted (soft delete recommended)
- Return success response

---

### 6. Get Friends List (Future Use)

**Endpoint:** `GET /api/friends`

**Authentication:** Required (Bearer token)

**Response (200):**
```json
{
  "friends": [
    {
      "userId": "friend-id-1",
      "name": "John Doe",
      "avatar": "https://...",
      "status": "accepted",
      "friendSince": "2025-12-20T14:30:00Z"
    }
  ]
}
```

---

## Frontend Integration Points

### State Flow

1. **User Searches for Friend**
   - Frontend calls `GET /api/search-user?q=...`
   - For each result, calls `GET /api/friends/status/{userId}`
   - Button displays: FRIEND (new), SENT (pending), or MESSAGE (accepted)

2. **User Clicks FRIEND Button**
   - Frontend calls `POST /api/friends/send`
   - On success, updates local state: status = 'pending'
   - Button changes to: SENT (disabled)

3. **Receiver Views Notifications**
   - Frontend calls `GET /api/friends/requests`
   - Displays pending requests with Accept/Reject buttons

4. **Receiver Accepts Request**
   - Frontend calls `POST /api/friends/accept`
   - On success:
     - Sender's button changes to: MESSAGE
     - Receiver sees: MESSAGE option
     - Request removed from notifications

5. **Receiver Rejects Request**
   - Frontend calls `POST /api/friends/reject`
   - On success:
     - Sender's button reverts to: FRIEND
     - Request removed from notifications

---

## Error Handling

All endpoints should return appropriate HTTP status codes:

- **200:** Success
- **400:** Bad Request (invalid data)
- **401:** Unauthorized (missing/invalid token)
- **404:** Not Found (resource doesn't exist)
- **409:** Conflict (request already exists, already friends)
- **500:** Server Error

Example error response:
```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "ERROR_CODE"
}
```

---

## Security Considerations

1. **Authentication:** All endpoints require valid Bearer token
2. **Authorization:** 
   - Users can only accept/reject requests addressed to them
   - Users can only send requests if not already friends
3. **Rate Limiting:** Implement to prevent spam
4. **Input Validation:** Validate userId format, check if user exists
5. **Uniqueness:** Prevent duplicate requests (database constraint)

---

## Implementation Priority

1. ✅ **Completed (Frontend):** Button state logic, UI for notifications
2. ⏳ **Next (Backend):** Implement all 6 endpoints
3. 🔄 **Optional:** Real-time updates with WebSocket/Socket.io
4. 📱 **Future:** Friends list, mutual friends, blocking features

---

## Testing Checklist

- [ ] Send friend request to valid user
- [ ] Try to send duplicate request (should fail)
- [ ] Try to send request to already-friend (should fail)
- [ ] Fetch pending requests
- [ ] Accept request
- [ ] Reject request
- [ ] Verify button states update correctly
- [ ] Test with invalid tokens
- [ ] Test with non-existent users
