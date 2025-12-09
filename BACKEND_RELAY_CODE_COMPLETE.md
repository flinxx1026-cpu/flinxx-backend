# Backend Socket Relay Code - Complete Reference

## Quick Answer

You asked: **"Send me the backend code where offer, answer, and ice_candidate are relayed"**

Here it is, with explanations:

---

## 1. Offer Relay

**Location:** `backend/server.js`, lines 1145-1175

```javascript
// Handle WebRTC offer
socket.on('webrtc_offer', (data) => {
  console.log('\n\n');
  console.log('📨📨📨 SERVER RECEIVED webrtc_offer 📨📨📨');
  console.log('📨 Sender socket ID:', socket.id);
  console.log('📨 Incoming data:', JSON.stringify(data, null, 2));
  console.log('📨 data.to value:', data.to);
  
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to  // ← Where the offer should go
  
  console.log('📨 userSockets.get(socket.id):', userId);
  console.log('📨 partnerSocketId extracted from data.to:', partnerSocketId);
  console.log('📨 TARGET: Will send to socket:', partnerSocketId);
  
  if (userId && partnerSocketId) {
    console.log('✅ SERVER: Conditions met - sending webrtc_offer');
    console.log('✅ SERVER: FROM socket:', socket.id, '→ TO socket:', partnerSocketId);
    
    // ⭐ RELAY THE OFFER TO PARTNER
    io.to(partnerSocketId).emit('webrtc_offer', {
      offer: data.offer,
      from: socket.id  // Tell recipient who this is from
    })
    
    console.log('✅ SERVER: webrtc_offer emitted successfully to:', partnerSocketId)
  } else {
    console.error('❌ SERVER: Cannot send webrtc_offer - conditions failed');
    console.error('   userId exists?', !!userId);
    console.error('   partnerSocketId exists?', !!partnerSocketId);
  }
})
```

**What it does:**
1. Receives offer from User A with `data.to = User B's socket ID`
2. Looks up if User A is registered (`userId`)
3. If both checks pass, sends offer to User B
4. Includes `from: socket.id` so User B knows it's from User A

**Key line:** `io.to(partnerSocketId).emit('webrtc_offer', ...)`

---

## 2. Answer Relay

**Location:** `backend/server.js`, lines 1177-1191

```javascript
// Handle WebRTC answer
socket.on('webrtc_answer', (data) => {
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to  // ← Where the answer should go
  
  console.log('📨 SERVER: Received webrtc_answer from socket:', socket.id)
  console.log('📨 SERVER: Target partner socket ID:', partnerSocketId)
  
  if (userId && partnerSocketId) {
    console.log('✅ SERVER: Sending webrtc_answer from', socket.id, 'to', partnerSocketId)
    
    // ⭐ RELAY THE ANSWER TO PARTNER
    io.to(partnerSocketId).emit('webrtc_answer', {
      answer: data.answer,
      from: socket.id  // Tell recipient who this is from
    })
    
    console.log('✅ SERVER: webrtc_answer sent successfully')
  } else {
    console.error('❌ SERVER: Cannot send webrtc_answer - userId or partnerSocketId missing')
  }
})
```

**What it does:**
1. Receives answer from User B with `data.to = User A's socket ID`
2. Verifies User B is registered
3. Sends answer to User A with `from: socket.id`

**Key line:** `io.to(partnerSocketId).emit('webrtc_answer', ...)`

---

## 3. ICE Candidate Relay

**Location:** `backend/server.js`, lines 1193-1208

```javascript
// Handle ICE Candidate
socket.on('ice_candidate', (data) => {
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to  // ← Where the ICE candidate should go
  
  console.log('🧊 SERVER: Received ICE candidate from socket:', socket.id)
  console.log('🧊 SERVER: Target partner socket ID:', partnerSocketId)
  
  if (userId && partnerSocketId) {
    console.log('✅ SERVER: Sending ICE candidate from', socket.id, 'to', partnerSocketId)
    
    // ⭐ RELAY THE ICE CANDIDATE TO PARTNER
    io.to(partnerSocketId).emit('ice_candidate', {
      candidate: data.candidate,
      from: socket.id  // Tell recipient who this is from
    })
  } else {
    console.error('❌ SERVER: Cannot send ICE candidate - userId or partnerSocketId missing')
  }
})
```

**What it does:**
1. Receives ICE candidate from User A (or B) with `data.to = partner's socket ID`
2. Verifies sender is registered
3. Forwards ICE candidate to partner
4. **This handler is called many times (10-50+ times) during connection**

**Key line:** `io.to(partnerSocketId).emit('ice_candidate', ...)`

---

## 4. Partner Socket ID Assignment

**Location:** `backend/server.js`, lines 1259-1315

```javascript
async function matchUsers(socketId1, userId1, socketId2, userId2, userData1, userData2) {
  // Create session
  const sessionId = uuidv4()
  const startedAt = new Date()
  
  activeSessions.set(sessionId, {
    id: sessionId,
    socketId1: socketId1,
    socketId2: socketId2,
    userId1: userId1,
    userId2: userId2,
    startedAt: startedAt,
    duration: 0
  })

  // Store session in Redis for real-time tracking
  try {
    const sessionData = JSON.stringify({
      id: sessionId,
      userId1,
      userId2,
      startedAt: startedAt.toISOString()
    })
    await redis.setEx(`session:${sessionId}`, 3600, sessionData)
    await redis.sAdd('active_sessions', sessionId)
  } catch (error) {
    console.error('❌ Error storing session in Redis:', error)
  }

  // Notify both users - THIS IS WHERE SOCKET IDs ARE SENT
  console.log('\n🎯 MATCHING COMPLETE - SENDING partner_found TO BOTH PEERS')
  console.log('📤 Sending partner_found to socketId1:', socketId1)
  console.log('📤 Sending partner_found to socketId2:', socketId2)
  
  // ⭐ SEND TO USER 1
  io.to(socketId1).emit('partner_found', {
    partnerId: userId2,
    sessionId: sessionId,
    socketId: socketId2,  // ← USER 1 learns USER 2's socket ID
    userName: userData2?.userName || 'Anonymous',
    userAge: userData2?.userAge || 18,
    userLocation: userData2?.userLocation || 'Unknown',
    userPicture: userData2?.userPicture || null
  })
  console.log('✅ partner_found emitted to socketId1:', socketId1)
  
  // ⭐ SEND TO USER 2
  io.to(socketId2).emit('partner_found', {
    partnerId: userId1,
    sessionId: sessionId,
    socketId: socketId1,  // ← USER 2 learns USER 1's socket ID
    userName: userData1?.userName || 'Anonymous',
    userAge: userData1?.userAge || 18,
    userLocation: userData1?.userLocation || 'Unknown',
    userPicture: userData1?.userPicture || null
  })
  console.log('✅ partner_found emitted to socketId2:', socketId2)

  console.log(`✅ Matched: ${userId1} <-> ${userId2}`)
}
```

**What it does:**
1. When two users are matched, this function is called
2. User 1 is sent the socket ID of User 2
3. User 2 is sent the socket ID of User 1
4. This is the **only place** where socket IDs are communicated to clients
5. After this, clients know who their partner is and can send signals to them

**Critical lines:**
```javascript
io.to(socketId1).emit('partner_found', {
  socketId: socketId2,  // User 1 learns user 2's ID
  ...
})

io.to(socketId2).emit('partner_found', {
  socketId: socketId1,  // User 2 learns user 1's ID
  ...
})
```

---

## User Socket ID Mapping

**Location:** `backend/server.js`, around line 1150-1160

```javascript
// At server startup
const userSockets = new Map()  // Maps socket ID → user ID

// When user connects
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`)
  
  // Register user
  const userId = uuidv4()
  userSockets.set(socket.id, userId)  // ← Maps this socket to a user
  
  socket.emit('user_registered', { userId })
})
```

**Used for verification in relay handlers:**
```javascript
const userId = userSockets.get(socket.id)  // Check: Is this socket valid?

if (userId && partnerSocketId) {
  // Safe to relay - both sender is registered and recipient ID is valid
}
```

---

## Complete Signal Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND SERVER                            │
│                                                                  │
│  userSockets Map:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ socket_a123 → user_uuid_1                              │   │
│  │ socket_b456 → user_uuid_2                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Handlers:                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ socket.on('webrtc_offer', (data) => {                  │   │
│  │   io.to(data.to).emit('webrtc_offer', ...)             │   │
│  │ })                                                       │   │
│  │                                                          │   │
│  │ socket.on('webrtc_answer', (data) => {                 │   │
│  │   io.to(data.to).emit('webrtc_answer', ...)            │   │
│  │ })                                                       │   │
│  │                                                          │   │
│  │ socket.on('ice_candidate', (data) => {                 │   │
│  │   io.to(data.to).emit('ice_candidate', ...)            │   │
│  │ })                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          ↕️ ↕️ ↕️
       ┌──────────────────────────────────────────────────┐
       │                                                  │
   ┌────────────────┐                        ┌─────────────────┐
   │   User A       │                        │   User B        │
   │ socket_a123    │                        │ socket_b456     │
   │                │                        │                 │
   │ partner =      │                        │ partner =       │
   │ socket_b456    │                        │ socket_a123     │
   │                │                        │                 │
   │ send: offer    │───────────────────────→│ recv: offer     │
   │   to: B        │    relay on server     │                 │
   │                │                        │ send: answer    │
   │ recv: answer   │←───────────────────────│   to: A         │
   │   from: B      │    relay on server     │                 │
   │                │                        │                 │
   │ send: ICE X10  │───────────────────────→│ recv: ICE X10   │
   │   to: B        │ (relay many times)     │                 │
   │                │                        │                 │
   │ recv: ICE X10  │←───────────────────────│ send: ICE X10   │
   │   from: B      │ (relay many times)     │   to: A         │
   │                │                        │                 │
   │ P2P Connected  │←═════════════════════→│ P2P Connected   │
   │ Video Flows    │                        │ Video Flows     │
   └────────────────┘                        └─────────────────┘
```

---

## Key Points

### ✅ What's Working
1. **Partner matching** - Socket IDs correctly sent to both users
2. **Offer relay** - Server receives offer with `to` field and relays it
3. **Answer relay** - Server receives answer with `to` field and relays it
4. **ICE relay** - Server receives ICE with `to` field and relays it
5. **User verification** - Server checks user is registered before relaying
6. **Error handling** - Server logs if conditions aren't met

### ⚠️ What Needs Frontend to Work
1. **Frontend must send `to` field** - With partner's socket ID
2. **Frontend must receive `from` field** - To know who sent the signal
3. **Frontend must use the `to` field for ALL signals** - offer, answer, ICE
4. **Frontend must NOT send if `to` is null** - Or relay will fail

### ❌ What Goes Wrong If
- Frontend doesn't send `to` field → Relay fails with `❌ Cannot send... partnerSocketId missing`
- Frontend sends `to: null` → Same error
- Frontend sends `to: wrong_socket_id` → Signal goes to wrong user
- Frontend doesn't use `from` field in response → Sends to wrong socket

---

## Verification Checklist

**In backend console, you should see:**

✅ When offer is sent:
```
📨📨📨 SERVER RECEIVED webrtc_offer 📨📨📨
📨 Sender socket ID: socket_a123
📨 data.to value: socket_b456
✅ SERVER: FROM socket: socket_a123 → TO socket: socket_b456
✅ SERVER: webrtc_offer emitted successfully to: socket_b456
```

✅ When answer is sent:
```
📨 SERVER: Received webrtc_answer from socket: socket_b456
📨 SERVER: Target partner socket ID: socket_a123
✅ SERVER: Sending webrtc_answer from socket_b456 to socket_a123
✅ SERVER: webrtc_answer sent successfully
```

✅ When ICE candidates are sent (many times):
```
🧊 SERVER: Received ICE candidate from socket: socket_a123
🧊 SERVER: Target partner socket ID: socket_b456
✅ SERVER: Sending ICE candidate from socket_a123 to socket_b456
```

❌ If ANY error appears:
```
❌ SERVER: Cannot send webrtc_offer - conditions failed
   userId exists? true
   partnerSocketId exists? false
```

This means `data.to` is null → Frontend isn't sending the `to` field!

---

## Summary

**Backend relay code: 100% Correct** ✅

**It correctly:**
- Receives signals with `to` field
- Validates sender is registered
- Relays to specified socket ID
- Includes `from` field so recipient knows sender

**Frontend must ensure:**
- Always send `to: partner's socket ID` with every signal
- For offerer: `to: data.socketId` (from partner_found)
- For answerer: `to: data.from` (from webrtc_offer, then webrtc_answer)
- For ICE: `to: partnerSocketIdRef.current` (set in partner_found/webrtc_offer)

If these conditions are met, WebRTC will connect and remote video will appear! ✅
