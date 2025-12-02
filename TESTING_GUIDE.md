# 2-Device WebRTC Video Chat Testing Guide

## Setup
1. Open **Laptop**: https://flinxx-backend-frontend.vercel.app
2. Open **Phone**: https://flinxx-backend-frontend.vercel.app (or open in different browser)
3. Open **DevTools** on BOTH devices:
   - Laptop: Press `F12` or `Ctrl+Shift+I`
   - Phone: Use Safari DevTools or Chrome DevTools remote debugging

## Testing Procedure

### Step 1: Start Video on Both Devices
- Click "Start Video Chat" on both devices
- Wait for local video to appear

### Step 2: Wait for Partner Match
- Wait for "Looking for a partner..." message
- Once partner is found, you should see "Partner found" message

### Step 3: Check Console Logs

Open the **Console** tab and look for these EXACT logs:

---

## LAPTOP Console (OFFERER)

### Expected Log 1: Peer Connection Created
```
✅ Peer connection created with ontrack handler: RTCPeerConnection {...}
🎯 ontrack handler attached: true
```

### Expected Log 2: Local Tracks
```
📹 Local Tracks: [MediaStreamTrack(video), MediaStreamTrack(audio)]
📹 Adding 2 local tracks to peer connection
  - Adding video track: MediaStreamTrack {...}
  - addTrack returned sender: RTCRtpSender {...}
  - Adding audio track: MediaStreamTrack {...}
  - addTrack returned sender: RTCRtpSender {...}
✅ All tracks added to peer connection
📤 OFFERER senders count: 2
📤 RTCPeerConnection senders after addTrack: [
  { index: 0, kind: 'video', id: '...', trackExists: true },
  { index: 1, kind: 'audio', id: '...', trackExists: true }
]
🚀 OFFERER: Ready to send offer with 2 tracks
```

### Expected Log 3: Offer/Answer Exchange
```
🎬 Creating WebRTC offer
✅ Offer created: RTCSessionDescription {...}
✅ Local description set
📤 SENDING OFFER with tracks: ['video', 'audio']
📤 Offer sent to peer
```

### Expected Log 4: Connection State
```
🧊 ICE connection state changed: checking
🧊 ICE connection state changed: connected
🔗 Connection state: connecting
🔗 ICE connection state: connected
🔗 Signaling state: stable
```

### Expected Log 5: Remote Track Received ⭐ MOST IMPORTANT
```
🎬 ===== ONTRACK FIRED =====
STREAM EVENT: RTCTrackEvent {...}
REMOTE STREAM ARRIVED: [MediaStream]
Track kind: video
Track enabled: true
Final remote stream: MediaStream {id: "...", active: true}
✅ remoteVideoRef exists, attaching stream
✅ srcObject set: MediaStream {...}
✅ display set to block
✅ Attaching remote stream to video element - COMPLETE
🎬 ===== ONTRACK COMPLETE =====
```

---

## PHONE Console (ANSWERER)

### Expected Log 1: Receive Offer
```
📨 Received WebRTC offer
📍 Creating new peer connection for answerer
✅ Peer connection created with ontrack handler: RTCPeerConnection {...}
🎯 ontrack handler attached: true
```

### Expected Log 2: Local Tracks
```
📹 Local Tracks: [MediaStreamTrack(video), MediaStreamTrack(audio)]
📹 Adding 2 local tracks to peer connection
  - Adding video track: MediaStreamTrack {...}
  - addTrack returned sender: RTCRtpSender {...}
  - Adding audio track: MediaStreamTrack {...}
  - addTrack returned sender: RTCRtpSender {...}
✅ All tracks added to peer connection
📤 ANSWERER senders count: 2
📤 RTCPeerConnection senders after addTrack: [
  { index: 0, kind: 'video', id: '...', trackExists: true },
  { index: 1, kind: 'audio', id: '...', trackExists: true }
]
🚀 ANSWERER: Ready to send answer with 2 tracks
```

### Expected Log 3: Answer Creation
```
🔄 Setting remote description (offer)
✅ Remote description set successfully
🎬 Creating answer
✅ Answer created: RTCSessionDescription {...}
🔄 Setting local description (answer)
✅ Local description set successfully
📤 SENDING ANSWER with tracks: ['video', 'audio']
📤 Answer sent to peer
```

### Expected Log 4: Connection State
```
🧊 ICE connection state changed: checking
🧊 ICE connection state changed: connected
🔗 Connection state: connecting
🔗 ICE connection state: connected
🔗 Signaling state: stable
```

### Expected Log 5: Remote Track Received ⭐ MOST IMPORTANT
```
🎬 ===== ONTRACK FIRED =====
STREAM EVENT: RTCTrackEvent {...}
REMOTE STREAM ARRIVED: [MediaStream]
Track kind: video
Track enabled: true
Final remote stream: MediaStream {id: "...", active: true}
✅ remoteVideoRef exists, attaching stream
✅ srcObject set: MediaStream {...}
✅ display set to block
✅ Attaching remote stream to video element - COMPLETE
🎬 ===== ONTRACK COMPLETE =====
```

---

## Diagnostic Results

### If You See All Logs Above ✅
Remote video should display! If it doesn't, it's a CSS/rendering issue.

### If You DON'T See "ONTRACK FIRED" ❌
**Problem**: Remote stream never received
- **Check**: Senders count on BOTH devices
  - If `0` → addTrack failing
  - If `2` → Issue is connection/offer/answer

### If Senders Show 2 but ONTRACK Never Fires ❌
**Problem**: Remote track never sent over the connection
- Check: ICE connection state
  - If `failed` → Network/TURN issue
  - If `checking` → Still connecting
  - If `connected` → Should receive track soon

### If "ONREMOTETRACK FIRED" Appears ❌
**Problem**: Different API being used
- Fix: ontrack not being called, but onremotetrack is
- Solution: Update to use onremotetrack instead

### If Connection State = "failed" ❌
**Problem**: WebRTC connection failed
- Possible causes:
  - TURN credentials not working
  - Firewall blocking
  - ICE candidate collection failed

---

## How to Copy Console Logs

### On Chrome/Edge:
1. Right-click in Console
2. Select "Save as..."
3. Save to file

### On Safari:
1. Select all logs (Cmd+A)
2. Copy (Cmd+C)
3. Paste in text editor

### On Firefox:
1. Click console settings (gear icon)
2. Select "Export visible messages"

---

## What to Share

Please provide:
1. **Laptop Console Output** - All logs from start to "ONTRACK COMPLETE"
2. **Phone Console Output** - All logs from start to "ONTRACK COMPLETE"
3. **Screenshot** - Show if remote video is displaying (black or visible?)
4. **Notes** - Which logs are missing?

---

## Commands to Help Debug

Paste these in console to check current state:

```javascript
// Check peer connection status
if (peerConnection) {
  console.log('Connection State:', peerConnection.connectionState);
  console.log('ICE State:', peerConnection.iceConnectionState);
  console.log('Senders:', peerConnection.getSenders().length);
  console.log('Receivers:', peerConnection.getReceivers().length);
  console.log('Ontrack:', peerConnection.ontrack !== null);
}
```

---

## Next Steps

Run the test above, collect the console logs from BOTH devices, and share them so I can diagnose the exact issue!
