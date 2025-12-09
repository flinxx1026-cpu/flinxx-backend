# WebRTC Debugging Analysis - December 9, 2025

## Summary

Remote video is not appearing because `ontrack` is never firing. This means the RTCPeerConnection is never reaching a connected state where remote streams can be received.

## Root Cause Analysis

### Backend Relay Code ✅ (WORKING)

The backend `server.js` correctly relays all WebRTC signals:

**Offer Relay (Lines 1145-1175):**
```javascript
socket.on('webrtc_offer', (data) => {
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to
  
  if (userId && partnerSocketId) {
    io.to(partnerSocketId).emit('webrtc_offer', {
      offer: data.offer,
      from: socket.id
    })
  }
})
```

**Answer Relay (Lines 1177-1191):**
```javascript
socket.on('webrtc_answer', (data) => {
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to
  
  if (userId && partnerSocketId) {
    io.to(partnerSocketId).emit('webrtc_answer', {
      answer: data.answer,
      from: socket.id
    })
  }
})
```

**ICE Candidate Relay (Lines 1193-1208):**
```javascript
socket.on('ice_candidate', (data) => {
  const userId = userSockets.get(socket.id)
  const partnerSocketId = data.to
  
  if (userId && partnerSocketId) {
    io.to(partnerSocketId).emit('ice_candidate', {
      candidate: data.candidate,
      from: socket.id
    })
  }
})
```

**Partner Matching (Lines 1259-1315):**
```javascript
async function matchUsers(socketId1, userId1, socketId2, userId2, userData1, userData2) {
  // ... creates session ...
  
  io.to(socketId1).emit('partner_found', {
    partnerId: userId2,
    sessionId: sessionId,
    socketId: socketId2,  // ← PARTNER'S SOCKET ID
    userName: userData2?.userName || 'Anonymous',
    ...
  })
  
  io.to(socketId2).emit('partner_found', {
    partnerId: userId1,
    sessionId: sessionId,
    socketId: socketId1,  // ← PARTNER'S SOCKET ID
    userName: userData1?.userName || 'Anonymous',
    ...
  })
}
```

### Frontend Event Flow ⚠️ (NEEDS VERIFICATION)

**In Chat.jsx:**

1. **Partner Found** (Line 813-993):
   ```javascript
   socket.on('partner_found', async (data) => {
     // data.socketId = partner's socket ID
     partnerSocketIdRef.current = data.socketId;  // ← SET HERE
     
     // Determine offerer (socket ID comparison)
     const amIOfferer = socket.id < data.socketId;
     
     if (!amIOfferer) return; // Answerer waits
     
     // Offerer creates peer connection
     const pc = await createPeerConnection();
     peerConnectionRef.current = pc;
     
     // Send offer
     socket.emit('webrtc_offer', {
       offer: peerConnectionRef.current.localDescription,
       to: data.socketId  // ← CORRECT: Use partner's socket ID
     });
   })
   ```

2. **Send Offer** (Line 975-982):
   ```javascript
   socket.emit('webrtc_offer', {
     offer: peerConnectionRef.current.localDescription,
     to: data.socketId  // ← Correct
   });
   ```

3. **Receive Offer** (Line 993-1120):
   ```javascript
   socket.on('webrtc_offer', async (data) => {
     // data.from = offerer's socket ID
     partnerSocketIdRef.current = data.from;  // ← SET HERE
     
     const pc = await createPeerConnection();
     peerConnectionRef.current = pc;
     
     await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
     
     const answer = await pc.createAnswer();
     await pc.setLocalDescription(answer);
     
     socket.emit('webrtc_answer', {
       answer: peerConnectionRef.current.localDescription,
       to: data.from  // ← CORRECT: Use offerer's socket ID
     });
   })
   ```

4. **Receive Answer** (Line 1122-1160):
   ```javascript
   socket.on('webrtc_answer', async (data) => {
     // data.from = answerer's socket ID
     partnerSocketIdRef.current = data.from;  // ← SET HERE
     
     await peerConnectionRef.current.setRemoteDescription(
       new RTCSessionDescription(data.answer)
     );
   })
   ```

5. **Send ICE Candidate** (Line 618-625):
   ```javascript
   peerConnection.onicecandidate = (event) => {
     if (event.candidate) {
       socket.emit("ice_candidate", {
         candidate: event.candidate,
         to: partnerSocketIdRef.current  // ← Uses the ref
       });
     }
   }
   ```

6. **Receive ICE Candidate** (Line 1165-1185):
   ```javascript
   socket.on('ice_candidate', async (data) => {
     if (peerConnectionRef.current) {
       await peerConnectionRef.current.addIceCandidate(
         new RTCIceCandidate(data.candidate)
       );
     }
   })
   ```

## Critical Questions to Answer

### 1. **Are ICE Candidates Being Sent with Correct `to` Field?**

**What to check in console logs:**
- When `onicecandidate` fires, does it log: `🔌 Sending ICE candidate to partner socket: [SOCKET_ID]`?
- Or does it log: `🔌 Sending ICE candidate to partner socket: null`?

**If null:** The ICE candidates are being sent with `to: null`, which means:
- Backend receives them but `partnerSocketId = data.to` is null
- The `if (userId && partnerSocketId)` check fails
- Backend logs error: `❌ SERVER: Cannot send ICE candidate - userId or partnerSocketId missing`

### 2. **Timing Issue: When Does `partnerSocketIdRef` Get Set?**

The reference is set at different times:
- Offerer: Set in `partner_found` (line 866), before creating peer connection (line 907) ✅
- Answerer: Set in `webrtc_offer` handler (line 1005), after receiving offer ✅

Both should have `partnerSocketIdRef.current` populated by the time `onicecandidate` fires.

### 3. **Are ICE Candidates Reaching the Backend?**

Check backend logs for:
```
🧊 SERVER: Received ICE candidate from socket: [SOCKET_A]
🧊 SERVER: Target partner socket ID: [SOCKET_B]
✅ SERVER: Sending ICE candidate from [SOCKET_A] to [SOCKET_B]
```

### 4. **Are Both Peers Creating RTCPeerConnections Before ICE Candidates Arrive?**

If ICE candidate arrives before peer connection exists on answerer side:
```
⚠️ Received ICE candidate but no peer connection
```

This could happen if answer is being set but peer connection isn't created yet.

## What Needs to be Verified

**Run the application and send:**

1. **Full Browser Console Logs for Both Users:**
   - Filter for `🔌` emoji (socket send/receive)
   - Filter for `🧊` emoji (ICE candidates)
   - Filter for `❌` errors

2. **Backend Console Logs:**
   - Offer relay logs
   - Answer relay logs  
   - ICE candidate relay logs
   - Any error messages

3. **Specific Questions:**
   - Is `partnerSocketIdRef.current` showing correct socket ID when ICE candidate fires?
   - Does the backend successfully relay the ICE candidates?
   - Does the answerer receive the ICE candidates?
   - Does `addIceCandidate()` succeed or fail?

## Likely Issues

### Issue A: ICE Candidates Sent with Wrong/Null `to` Field
**Symptom:** Backend logs `❌ Cannot send ICE candidate - userId or partnerSocketId missing`
**Fix:** Ensure `partnerSocketIdRef.current` is set before ICE candidates fire

### Issue B: Race Condition with Peer Connection Creation
**Symptom:** `⚠️ Received ICE candidate but no peer connection`
**Fix:** Ensure peer connection is created synchronously in partner_found/webrtc_offer handlers

### Issue C: Wrong Event Name Mismatch
**Already Fixed:** Changed `ice-candidate` to `ice_candidate` ✅

## Next Steps

1. Run the app with both users in different browser windows
2. Check browser console for the logs mentioned above
3. Check backend logs for successful/failed ICE relay
4. Send all logs to identify the exact failure point
