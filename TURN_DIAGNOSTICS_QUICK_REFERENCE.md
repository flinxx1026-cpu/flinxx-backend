# Quick Reference: TURN Diagnostics Logging

## Console Output Decoder

### ✅ What You Want to See (TURN Working)

```
🧊 [ICE SERVERS CONFIGURATION]
🧊 STUN Server: stun:global.xirsys.net
🧊 TURN (UDP): turn:global.xirsys.net:3478?transport=udp
🧊 TURN (TCP): turn:global.xirsys.net:3478?transport=tcp
🧊 TURN (TLS): turns:global.xirsys.net:5349?transport=tcp

🧊 ICE candidate generated: { type: "srflx", ... }
📍 SRFLX (server reflexive) candidate - STUN working
   Found public address via STUN

🧊 ICE candidate generated: { type: "relay", protocol: "udp", port: 3478 }
🔄 RELAY (TURN) candidate generated - TURN server is reachable
   Protocol: udp Port: 3478

✅ State: COMPLETED - ICE checks completed, ready for media
```

**Meaning**: TURN server is reachable, peer-to-peer will work ✅

---

### ❌ What You DON'T Want to See (ISP Blocking)

```
🧊 [ICE SERVERS CONFIGURATION]
🧊 STUN Server: stun:global.xirsys.net
🧊 TURN (UDP): turn:global.xirsys.net:3478?transport=udp
🧊 TURN (TCP): turn:global.xirsys.net:3478?transport=tcp
🧊 TURN (TLS): turns:global.xirsys.net:5349?transport=tcp
🧊 If error 701: ISP blocking TURN ports

🧊 ICE candidate generated: { type: "srflx", ... }
📍 SRFLX (server reflexive) candidate - STUN working  ← Works
   Found public address via STUN

🧊 ===== ICE CONNECTION STATE CHANGED =====
❌ State: FAILED - All ICE candidate pairs failed
❌ Could not establish peer-to-peer connection
❌ TURN server may be unreachable or blocked by ISP
🔍 Troubleshooting:
   - Check console for TURN error details
   - TURN error 701 = Network/ISP blocking ports 3478, 5349
   - Solutions: Try VPN, different WiFi, or mobile hotspot
```

**Meaning**: STUN works but TURN is blocked by ISP ❌

---

## Quick Diagnostics Checklist

### 🔍 Is TURN working?

1. **Open DevTools** (F12 or Right-click → Inspect → Console tab)
2. **Navigate to Chat page**
3. **Start a call** (click "Allow Camera & Continue", then "Start Video Chat")
4. **Look for these exact phrases** in console:

| What to Look For | Found? | Meaning |
|---|---|---|
| `🔄 RELAY (TURN) candidate generated` | ✅ YES | **TURN works** - peer-to-peer will work |
| ✅ `State: COMPLETED` | ✅ YES | **Success** - connection established |
| `❌ State: FAILED` | ❌ YES | **TURN blocked** - ISP blocking |
| `TURN error 701` | ❌ YES | **ISP blocking** - ports 3478, 5349 closed |

---

## Solutions by Symptom

### Symptom: "TURN error 701" in Console

**Problem**: ISP is blocking TURN ports 3478 and 5349

**Solutions** (in order of ease):
1. **Use VPN** (easiest)
   - Enable any VPN service
   - Refresh page
   - TURN should work now ✅

2. **Switch WiFi**
   - Connect to different WiFi network
   - Use hotspot, cafe WiFi, different ISP, etc.
   - Refresh page
   - TURN should work now ✅

3. **Use Mobile Hotspot**
   - Enable phone hotspot
   - Connect browser to hotspot
   - Refresh page
   - TURN should work now ✅

4. **Contact ISP** (if stuck at home)
   - Ask to unblock ports 3478 and 5349
   - Or UDP/TCP traffic on those ports
   - Or just unblock XirSys TURN service
   - Note: Usually not necessary - VPN works fine

---

## Console Output Breakdown

### Candidate Types

```javascript
// This is what the type: field means

type: "host"
  → Your local IP (192.168.x.x)
  → Direct connection if both peers on same network
  → Always present

type: "srflx" (server reflexive)
  → Your public IP (found by STUN)
  → NAT traversal working
  → STUN server is reachable ✅
  → Should see this almost always

type: "relay"
  → Your IP through TURN server
  → Relayed peer-to-peer connection
  → TURN server is reachable ✅
  → TURN is working - best for restrictive networks

type: "prflx" (peer reflexive)
  → Discovered through peer
  → Rare, usually not needed
```

### Connection States

```javascript
// This is what the connectionState progression means

'new'
  → Just created
  → Not gathering candidates yet

'checking'
  → Testing candidate pairs
  → Trying to connect
  → This is where the action happens

'connected' or 'completed'
  → Success! ✅
  → Peers can communicate
  → Video/audio should work

'disconnected'
  → Lost connection temporarily
  → Will attempt to reconnect

'failed'
  → All candidate pairs failed ❌
  → Cannot establish connection
  → Usually means TURN is blocked

'closed'
  → Connection closed intentionally
  → Normal when user ends call
```

---

## Testing TURN at Different Locations

### Test 1: Home Network (Likely Blocked)
```
Expected: STUN works, TURN fails
Console: "SRFLX candidate" but no "RELAY candidate"
Result: Cannot connect to peers from home
```

### Test 2: On VPN (Should Work)
```
Expected: Both STUN and TURN work
Console: "SRFLX candidate" AND "RELAY candidate"
Result: Can connect to peers on VPN ✅
```

### Test 3: Different WiFi (Should Work)
```
Expected: Both STUN and TURN work
Console: "SRFLX candidate" AND "RELAY candidate"  
Result: Can connect to peers on different WiFi ✅
```

### Test 4: Mobile Hotspot (Should Work)
```
Expected: Both STUN and TURN work
Console: "SRFLX candidate" AND "RELAY candidate"
Result: Can connect to peers on hotspot ✅
```

**Conclusion**: If TURN works on VPN/different-WiFi but not home, it's your ISP blocking it.

---

## If You See "TURN error 701"

This specific error means:

| Code | ISP/Network | Ports Blocked | Solution |
|------|---|---|---|
| 701 | STUN works, TURN fails | 3478, 5349 | Try VPN or different network |

**Important**: Error 701 is EXPECTED on your home network. It just confirms our diagnosis - ISP is blocking TURN relay. This is fine because:
1. STUN still works (your public IP is found)
2. VPN completely fixes it (tested ✅)
3. Different networks work fine (tested ✅)
4. Application configuration is correct ✅

---

## Console Log Locations

When you test, look in these sections of Console:

### 1. **At Page Load**
```
[Chat] Location search params: ?view=home
[Chat] shouldStartAsIntro: true
```
→ Shows profile completion status

### 2. **When Clicking "Allow Camera"**
```
📹 [INIT] Requesting camera permission from browser...
📹 [INIT] Chat component useEffect triggered
[Camera] Chat component useEffect triggered
🎥 [CAMERA START] Attaching stream to video element
```
→ Shows camera initialization

### 3. **When Clicking "Start Video Chat"**
```
🎬 [MATCHING] User clicked "Start Video Chat"
🎬 [MATCHING] ✅ find_partner event emitted
```
→ Shows matching started

### 4. **When Partner Found**
```
📋 ===== PARTNER FOUND EVENT RECEIVED =====
👥 Partner found: {...}
🔧 createPeerConnection called
🧊 [ICE SERVERS CONFIGURATION]
🧊 STUN Server: stun:global.xirsys.net
🧊 TURN (UDP): turn:global.xirsys.net:3478
🧊 TURN (TCP): turn:global.xirsys.net:3478
🧊 TURN (TLS): turns:global.xirsys.net:5349
```
→ Shows ICE configuration and peer connection creation

### 5. **ICE Gathering (The Important Part)**
```
🧊 ICE candidate generated: { type: "srflx", ... }
📍 SRFLX (server reflexive) candidate - STUN working

🧊 ICE candidate generated: { type: "relay", ... }
🔄 RELAY (TURN) candidate generated - TURN server reachable

🧊 ICE connection state: checking
🧊 ICE connection state: completed
✅ State: COMPLETED - ICE checks completed
```
→ Shows candidates being gathered and TURN status

---

## Quick Copy-Paste for Testing

### To View Console in Most Browsers:
```
Windows:    F12 or Ctrl+Shift+I
Mac:        Cmd+Option+I
Linux:      F12 or Ctrl+Shift+I
```

### To Clear Console:
```javascript
console.clear()
```

### To Filter Console (shows only ICE logs):
```
Type this in filter box: 🧊
This will show only ICE-related messages
```

---

## FAQ

**Q: I see "RELAY candidate" - does that mean it's working?**  
A: Yes! Relay candidates mean TURN server is reachable and can relay traffic. ✅

**Q: I only see "SRFLX candidate" - is that bad?**  
A: It means STUN works but TURN is blocked. You need TURN for peer-to-peer through restrictive networks. Try VPN.

**Q: I see "FAILED" state - what do I do?**  
A: First, check if you see "error 701" in console. If yes, use VPN or try different WiFi. If no other errors, check that both peers are trying to connect.

**Q: Why is my ISP blocking TURN?**  
A: TURN uses ports 3478 (UDP/TCP) and 5349 (TLS). Some ISPs block these by default, or block ports above 1024 on residential connections.

**Q: Will using VPN slow down my video?**  
A: Only if the VPN server is far away. Local VPN servers typically add minimal latency. The alternative is not being able to connect at all.

**Q: Can I unblock the ports on my router?**  
A: Ports 3478/5349 are outbound to XirSys. Your router probably doesn't block outbound traffic. It's the ISP's network equipment that's blocking it. You'd need to contact your ISP or use VPN.

---

## For Developers

### Relevant Code Sections

**webrtcUtils.js**:
- `logIceServers()` - Shows ICE configuration (32 lines)

**Chat.jsx**:
- `createPeerConnection()` - Creates peer connection + calls `logIceServers()`
- `peerConnection.onicecandidate` - Logs each ICE candidate (40+ lines)
- `peerConnection.oniceconnectionstatechange` - Logs connection state changes (48 lines)

### To Debug in Development

```javascript
// In Chat.jsx or anywhere with peerConnection object:

// Check current ICE state
console.log(peerConnection.iceConnectionState);

// Check all stats
const stats = await peerConnection.getStats();
stats.forEach(report => {
  if (report.type === 'candidate-pair') {
    console.log(report);
  }
});

// Check current configuration
console.log(peerConnection.getConfiguration());
```

---

**Last Updated**: 2025-12-02  
**Version**: Diagnostics v1.0
