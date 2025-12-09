# Backend WebRTC Relay Code - Complete Reference

## Location: backend/server.js

### Match Users Function (Lines 1259-1315)

This function is called when two users are matched. It sends the partner's socket ID to each user.

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

  // ⭐ SEND partner_found TO USER 1
  // User 1 receives socketId of User 2
  console.log('\n🎯 MATCHING COMPLETE - SENDING partner_found TO BOTH PEERS')
  console.log('📤 Sending partner_found to socketId1:', socketId1)
  console.log('📤 Sending partner_found to socketId2:', socketId2)
  
  io.to(socketId1).emit('partner_found', {
    partnerId: userId2,
    sessionId: sessionId,
    socketId: socketId2,  // ← USER 2's SOCKET ID sent to USER 1
    userName: userData2?.userName || 'Anonymous',
    userAge: userData2?.userAge || 18,
    userLocation: userData2?.userLocation || 'Unknown',
    userPicture: userData2?.userPicture || null
  })
  console.log('✅ partner_found emitted to socketId1:', socketId1)
  
  // ⭐ SEND partner_found TO USER 2
  // User 2 receives socketId of User 1
  io.to(socketId2).emit('partner_found', {
    partnerId: userId1,
    sessionId: sessionId,
    socketId: socketId1,  // ← USER 1's SOCKET ID sent to USER 2
    userName: userData1?.userName || 'Anonymous',
    userAge: userData1?.userAge || 18,
    userLocation: userData1?.userLocation || 'Unknown',
    userPicture: userData1?.userPicture || null
  })
  console.log('✅ partner_found emitted to socketId2:', socketId2)

  console.log(`✅ Matched: ${userId1} <-> ${userId2}`)
}
```

### WebRTC Offer Relay (Lines 1145-1175)

Relays the offer from User A to User B.

```javascript
socket.on('webrtc_offer', (data) => {
  console.log('\n\n');
  console.log('📨📨📨 SERVER RECEIVED webrtc_offer 📨📨📨');
  console.log('📨 Sender socket ID:', socket.id);
  console.log('📨 Incoming data:', JSON.stringify(data, null, 2));
  console.log('📨 data.to value:', data.to);
  console.log('📨 Is data.to empty?', !data.to);
  console.log('📨 Is data.to undefined?', data.to === undefined);
  console.log('📨 Is data.to null?', data.to === null);
  
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to  // ← Get recipient socket ID from data
  
  console.log('📨 userSockets.get(socket.id):', userId);
  console.log('📨 partnerSocketId extracted from data.to:', partnerSocketId);
  console.log('📨 TARGET: Will send to socket:', partnerSocketId);
  
  if (userId && partnerSocketId) {
    console.log('✅ SERVER: Conditions met - sending webrtc_offer');
    console.log('✅ SERVER: FROM socket:', socket.id, '→ TO socket:', partnerSocketId);
    
    // ⭐ RELAY OFFER TO PARTNER
    io.to(partnerSocketId).emit('webrtc_offer', {
      offer: data.offer,
      from: socket.id  // ← Tell recipient who this came from
    })
    
    console.log('✅ SERVER: webrtc_offer emitted successfully to:', partnerSocketId)
  } else {
    console.error('❌ SERVER: Cannot send webrtc_offer - conditions failed');
    console.error('   userId exists?', !!userId);
    console.error('   partnerSocketId exists?', !!partnerSocketId);
  }
})
```

**Critical Points:**
- ✅ Server receives `data.to` = recipient's socket ID
- ✅ Server emits to that socket ID using `io.to(partnerSocketId).emit()`
- ✅ Server includes `from: socket.id` so recipient knows who sent it
- ⚠️ If `data.to` is null/undefined, relay fails

---

### WebRTC Answer Relay (Lines 1177-1191)

Relays the answer from User B back to User A.

```javascript
socket.on('webrtc_answer', (data) => {
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to  // ← Get recipient socket ID from data
  
  console.log('📨 SERVER: Received webrtc_answer from socket:', socket.id)
  console.log('📨 SERVER: Target partner socket ID:', partnerSocketId)
  
  if (userId && partnerSocketId) {
    console.log('✅ SERVER: Sending webrtc_answer from', socket.id, 'to', partnerSocketId)
    
    // ⭐ RELAY ANSWER TO PARTNER
    io.to(partnerSocketId).emit('webrtc_answer', {
      answer: data.answer,
      from: socket.id  // ← Tell recipient who this came from
    })
    
    console.log('✅ SERVER: webrtc_answer sent successfully')
  } else {
    console.error('❌ SERVER: Cannot send webrtc_answer - userId or partnerSocketId missing')
  }
})
```

**Critical Points:**
- ✅ Server receives `data.to` = recipient's socket ID
- ✅ Server relays answer to that socket
- ✅ Includes `from` so recipient knows it's the answer
- ⚠️ If `data.to` is null/undefined, relay fails

---

### ICE Candidate Relay (Lines 1193-1208)

Relays ICE candidates from User A to User B and vice versa (called many times).

```javascript
socket.on('ice_candidate', (data) => {
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to  // ← Get recipient socket ID from data
  
  console.log('🧊 SERVER: Received ICE candidate from socket:', socket.id)
  console.log('🧊 SERVER: Target partner socket ID:', partnerSocketId)
  
  if (userId && partnerSocketId) {
    console.log('✅ SERVER: Sending ICE candidate from', socket.id, 'to', partnerSocketId)
    
    // ⭐ RELAY ICE CANDIDATE TO PARTNER
    io.to(partnerSocketId).emit('ice_candidate', {
      candidate: data.candidate,
      from: socket.id  // ← Tell recipient who this came from
    })
  } else {
    console.error('❌ SERVER: Cannot send ICE candidate - userId or partnerSocketId missing')
  }
})
```

**Critical Points:**
- ✅ This handler fires MANY times (10-50 times per connection)
- ✅ Server receives `data.to` = recipient's socket ID
- ✅ Server relays each candidate immediately
- ⚠️ If `data.to` is null, ALL ICE candidates are lost!
- ⚠️ If this fires before `partner_found`, relay fails

---

### User Socket Mapping (Line ~150)

Stores which socket ID belongs to which user:

```javascript
const userSockets = new Map()  // socket.id → userId

// When user connects:
socket.on('connection', (socket) => {
  const userId = uuidv4()
  userSockets.set(socket.id, userId)  // Map socket to user
  console.log(`✅ User connected: ${socket.id}`)
})
```

This is used to verify `userId` exists before relaying:
```javascript
const userId = userSockets.get(socket.id)  // Check if socket is valid
if (userId && partnerSocketId) {
  // Safe to relay
}
```

---

## The Complete WebRTC Signal Flow

```
User A                          Backend Server                      User B
  |                                   |                               |
  |--- find_partner ----------------->|                               |
  |                                   |--- find_partner (User B) ----->|
  |                               (matching)                           |
  |<--------- partner_found ----------|<------- partner_found ---------|
  |           {socketId: B}           |         {socketId: A}         |
  |                                   |                               |
  |--- webrtc_offer ---------->|       |                               |
  |   {to: B, offer: {...}}   |       |--- io.to(B).emit() ---------->|
  |                           |       |                               |
  |                           |       |<-- webrtc_offer received ------|
  |                           |       |   {from: A}                    |
  |                           |       |                               |
  |<--------- webrtc_answer <---------|---- webrtc_answer ----------|
  |{from: B}                  |       |    {to: A, answer: {...}}  |
  |                           |       |                           |
  |-- ice_candidate X1 ------>|       |                            |
  |  {to: B, candidate: ...}  |       |--- io.to(B).emit() ------->|
  |                           |       |                            |
  |<-- ice_candidate X1 <------------|---- ice_candidate ---------|
  |  {from: B, candidate: ...}|       |   {to: A, candidate: ...}|
  |                           |       |                           |
  | [Repeat ICE exchange 10-50 times] |
  |                           |       |
  |--- ice_candidate XN ------>|       |
  |  {to: B, candidate: ...}  |       |--- io.to(B).emit() ------->|
  |                           |       |                            |
  |<-- ice_candidate XN <------------|---- ice_candidate ---------|
  |  {from: B}                |       |                           |
  |                           |       |                           |
  | [WebRTC Connection Established]   |
  |                           |       |
  |<===== P2P Video Stream ==========>|
  |                           |       |
```

---

## Troubleshooting Checklist

### Question 1: Are `to` Fields Correct?

**Frontend sends:**
```javascript
socket.emit('webrtc_offer', {
  offer: {...},
  to: socketId  // Partner's socket ID
})
```

**Backend receives:**
```javascript
const partnerSocketId = data.to  // Should NOT be null
console.log('🧊 SERVER: Target partner socket ID:', partnerSocketId)
```

✅ If you see a socket ID (like `"xyz123"`): **GOOD**
❌ If you see `null` or `undefined`: **BUG**

### Question 2: Does Backend Successfully Relay?

**Good logs:**
```
✅ SERVER: Sending ICE candidate from socket_a to socket_b
```

**Bad logs:**
```
❌ SERVER: Cannot send ICE candidate - userId or partnerSocketId missing
```

### Question 3: Does Recipient Receive the Signal?

**Good logs (other browser):**
```
🧊 Received ICE candidate from peer
🧊 Adding ICE candidate to peer connection
✅ ICE candidate added successfully
```

**Bad logs:**
```
⚠️ Received ICE candidate but no peer connection
```

---

## Summary

**Backend relay code is CORRECT** ✅

The issue is likely in one of these:

1. **Frontend not sending `to` field** ❌
   - Check: Is `to: partnerSocketIdRef.current` being sent?
   - If `partnerSocketIdRef.current` is null, ICE candidates fail

2. **`partnerSocketIdRef` not set before ICE fires** ❌
   - Check: Is `partnerSocketIdRef` set BEFORE `createPeerConnection()`?
   - Currently it should be, but verify timing

3. **Backend not receiving/relaying properly** ❌
   - Check backend logs for relay success messages
   - If they show `❌ Cannot send`, then the `to` field is null

**Next:** Run test with both users and share console logs!
