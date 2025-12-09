# Console Logging Guide - How to Capture ICE Candidate Flow

## What to Look For

When two users connect for video chat, your browser console should show this sequence:

### Step 1: Partner Found ✅

**Both browsers should log:**
```
📋 ===== PARTNER FOUND EVENT RECEIVED =====
👥 My socket ID: socket_a123
👥 data.socketId: socket_b456
🔌 CRITICAL: Stored partner socket ID: socket_b456
```

### Step 2: Offerer Sends Offer ✅

**Browser A (Offerer) should log:**
```
📬 I am the OFFERER - creating peer connection and sending offer
✅ OFFERER: Peer connection created
🔧 RTCPeerConnection created
📤 OFFERER: Sending offer with tracks: [...]
✅ OFFERER: webrtc_offer emitted successfully
✅ OFFERER: webrtc_offer sent to socket ID: socket_b456
```

**Browser B (Answerer) should log:**
```
📭 I am the ANSWERER - waiting for offer from offerer
📋 ===== ANSWERER RECEIVED OFFER =====
📥 ANSWERER: Received WebRTC offer from offerer
🔌 CRITICAL: Stored offerer socket ID: socket_a123
✅ ANSWERER: Peer connection created
```

### Step 3: Answerer Sends Answer ✅

**Browser B should log:**
```
📝 Creating WebRTC answer...
✅ ANSWERER: Local description set successfully
📤 ANSWERER: Sending answer with tracks: [...]
socket.emit('webrtc_answer', {...})
📤 ANSWERER: Answer emitted to offerer via socket: socket_a123
```

**Browser A should log:**
```
📋 ===== OFFERER RECEIVED ANSWER =====
📨 OFFERER: Received WebRTC answer from answerer
🔄 OFFERER: Setting remote description (answer from answerer)
✅ OFFERER: Remote description (answer) set successfully
```

### Step 4: ICE Candidates Exchanged ⚠️ THIS IS WHERE IT BREAKS

**Both browsers should log (MANY TIMES):**
```
🧊 ICE candidate generated: {
  candidate: "candidate:2999999 1 udp ...",
  type: "srflx",
  ...
}
🔌 Sending ICE candidate to partner socket: socket_b456
📤 ICE candidate sent to peer
```

**If you see:**
```
🔌 Sending ICE candidate to partner socket: null
```

**THAT'S THE BUG!** The `partnerSocketIdRef` is not set!

---

### Step 5: ICE Connection Established ✅

**Both browsers should eventually log:**
```
🧊 ===== ICE CONNECTION STATE CHANGED =====
🧊 New ICE Connection State: checking
🧊 ===== ICE CONNECTION STATE CHANGED =====
🧊 New ICE Connection State: connected
✅ State: CONNECTED - Found working ICE candidate pair
🧊 Peer-to-peer communication established
```

### Step 6: Remote Stream Received ✅

**Both browsers should log:**
```
✅ ontrack fired!
📥 REMOTE TRACK RECEIVED
Remote stream received: MediaStream
```

Then the remote video appears on screen!

---

## How to Capture Logs

### Method 1: Copy from Console

1. Open Developer Tools: **F12** or **Right-click → Inspect → Console**
2. Right-click in console area
3. Click **"Save as"** or select all with **Ctrl+A**
4. Copy and paste into a text file

### Method 2: Use Console Copy Function

```javascript
// Paste this in console:
copy(document.querySelector('.cm-content').innerText)
```

---

## Errors to Watch For

### ❌ Error 1: Wrong Partner Socket ID
```
🔌 Sending ICE candidate to partner socket: null
```
**Cause:** `partnerSocketIdRef.current` not set before ICE fires
**Solution:** Check when `partnerSocketIdRef` is set

### ❌ Error 2: Backend Not Relaying
```
// Browser logs show ICE sent
🔌 Sending ICE candidate to partner socket: socket_b456

// But OTHER browser doesn't log receiving it
// (should show: 🧊 Received ICE candidate from peer)
```
**Cause:** Backend not forwarding ICE candidates
**Solution:** Check backend logs

### ❌ Error 3: No Peer Connection When ICE Arrives
```
⚠️ Received ICE candidate but no peer connection
```
**Cause:** ICE arrives before peer connection is created
**Solution:** Create peer connection earlier

### ❌ Error 4: addIceCandidate Fails
```
❌ Error adding ICE candidate: [error message]
```
**Cause:** Invalid ICE candidate format
**Solution:** Verify candidate object structure

---

## Backend Logs to Capture

Start backend with:
```bash
npm run dev  # Or your start command
```

Watch for these logs (in backend console):

### When Offer is Sent
```
📨📨📨 SERVER RECEIVED webrtc_offer 📨📨📨
📨 Sender socket ID: socket_a123
📨 Incoming data: {"offer": {...}, "to": "socket_b456"}
✅ SERVER: Conditions met - sending webrtc_offer
✅ SERVER: FROM socket: socket_a123 → TO socket: socket_b456
✅ SERVER: webrtc_offer emitted successfully to: socket_b456
```

### When Answer is Sent
```
📨 SERVER: Received webrtc_answer from socket: socket_b456
📨 SERVER: Target partner socket ID: socket_a123
✅ SERVER: Sending webrtc_answer from socket_b456 to socket_a123
✅ SERVER: webrtc_answer sent successfully
```

### When ICE Candidate is Sent
```
🧊 SERVER: Received ICE candidate from socket: socket_a123
🧊 SERVER: Target partner socket ID: socket_b456
✅ SERVER: Sending ICE candidate from socket_a123 to socket_b456
```

### If There's an Error
```
❌ SERVER: Cannot send ice_candidate - userId or partnerSocketId missing
   userId exists? true
   partnerSocketId exists? false
```

This means the `to` field was not sent!

---

## What to Send to Developer

1. **Browser Console Logs (Both Users):**
   - User A (Offerer) full console output
   - User B (Answerer) full console output

2. **Backend Console Logs:**
   - Full console output while test was running

3. **Screenshots:**
   - Any red errors you see
   - The "Remote stream received" message (if it appears)

4. **Specific Info:**
   - Did you see `✅ CONNECTED` in ICE state?
   - Did you see `📥 REMOTE TRACK RECEIVED`?
   - Did you see any `❌` errors?

---

## Quick Test Checklist

- [ ] Open two browsers or two incognito windows
- [ ] Click "Start Video Chat" in both
- [ ] Allow camera/microphone in both
- [ ] Wait 10 seconds
- [ ] Look for `✅ CONNECTED` in console
- [ ] Look for `📥 REMOTE TRACK RECEIVED` in console
- [ ] Check if remote video appears
- [ ] If not, check backend logs

**Then send all console logs!**
