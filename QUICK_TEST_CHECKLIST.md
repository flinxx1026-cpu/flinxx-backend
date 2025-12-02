# Quick Test Checklist - Bidirectional Media

## ✅ Pre-Test Setup

- [ ] Clear browser cache or use incognito mode
- [ ] Open DevTools (F12) on BOTH browsers
- [ ] Go to Console tab on both
- [ ] Both machines have camera/mic enabled
- [ ] https://flinxx.vercel.app loaded on both

## 🚀 Test Steps

### Browser 1 (OFFERER)
1. [ ] Click "Start Camera" → See local video preview
2. [ ] Click "Find Partner"
3. [ ] Watch console for: `📋 ===== OFFERER FOUND PARTNER =====`

### Browser 2 (ANSWERER)  
1. [ ] Click "Start Camera" → See local video preview
2. [ ] Click "Find Partner"
3. [ ] Should match with Browser 1

## 📊 Check These Console Logs

### CRITICAL Signs of Success

✅ **OFFERER should show:**
```
👤 OFFERER localStream: MediaStream
📹 OFFERER tracks detail: [{kind: "video", ...}, {kind: "audio", ...}]
📤 OFFERER senders count: 2
📤 OFFERER: Sending offer with tracks: [video, audio]
🧊 ICE candidate generated (multiple times)
📥 REMOTE TRACK RECEIVED (from answerer)
✅ WebRTC connection ESTABLISHED
```

✅ **ANSWERER should show:**
```
👤 ANSWERER localStream: MediaStream
📹 ANSWERER tracks detail: [{kind: "video", ...}, {kind: "audio", ...}]
📤 ANSWERER senders count: 2
📤 ANSWERER: Sending answer with tracks: [video, audio]
🧊 ICE candidate generated (multiple times)
📥 REMOTE TRACK RECEIVED (from offerer)
✅ WebRTC connection ESTABLISHED
```

### 🔴 Signs of Failure

❌ **ANSWERER shows:**
- "ANSWERER senders count: 0" → Tracks not added!
- "No local stream available" → localStreamRef is null!
- No "REMOTE TRACK RECEIVED" → ICE or SDP issue

❌ **Either side shows:**
- "Connection State: failed" → TURN server not working
- No ICE candidates → NAT/firewall issue
- Connection stuck on "connecting" → ICE gathering failed

## 🎥 Visual Checks

| Expected | Browser 1 | Browser 2 |
|----------|-----------|----------|
| **Local Video** | ✅ Shows | ✅ Shows |
| **Remote Video** | ✅ Shows Browser 2's camera | ✅ Shows Browser 1's camera |
| **Both working** | Videos play smoothly | Videos play smoothly |

## 🔧 If It's Broken

### Q: "ANSWERER senders count: 0"
A: localStreamRef.current is null. Check why localStream isn't being reused from preview.

### Q: "ICE candidates not generated"
A: TURN server not returning valid credentials. Check /api/turn endpoint on Render.

### Q: "No REMOTE TRACK RECEIVED"
A: Either:
1. Remote peer not sending tracks (senders = 0)
2. ICE not established (candidates not exchanged)
3. SDP mismatch (media lines missing)

### Q: "Connection stuck on 'connecting'"
A: Wait 10+ seconds. If still connecting → Check ICE logs. If 60+ seconds → TURN/network issue.

## 📋 Console Filter Tips

1. **Only see errors**: Filter by `❌`
2. **Track the flow**: Ctrl+F and search `OFFERER` or `ANSWERER`
3. **Find ICE issues**: Filter by `🧊`
4. **Find remote track**: Filter by `📥 REMOTE`
5. **Find state changes**: Filter by `Connection State`

## 💾 Save Console

If it's broken:
1. Right-click console → Save as... → save_console.log
2. Share that file with the developer
3. Include: Browser you were on (1 or 2), What you expected, What you got

## 🔄 Full Console Expected Order

```
OFFERER side:
1. 👤 OFFERER localStream: ...
2. 📤 OFFERER senders count: 2
3. 📤 OFFERER: Sending offer
4. 🧊 ICE candidate generated (x N)
5. 📨 OFFERER: Received WebRTC answer
6. 🧊 ICE candidate received (x N)
7. 📥 REMOTE TRACK RECEIVED
8. 🔄 Connection State Changed: connected

ANSWERER side:
1. 👤 ANSWERER localStream: ...
2. 📤 ANSWERER senders count: 2
3. 📤 ANSWERER: Sending answer
4. 🧊 ICE candidate generated (x N)
5. 🧊 ICE candidate received (x N)
6. 📥 REMOTE TRACK RECEIVED
7. 🔄 Connection State Changed: connected
```

## ⏱️ Expected Timing

- **Offer sent**: ~100-500ms after "Find Partner"
- **Answer sent**: ~500-1000ms after offer received
- **ICE candidates**: ~100-2000ms continuously
- **Connection established**: ~2-5 seconds total
- **Remote video appears**: ~3-10 seconds

If it takes longer than 30 seconds → likely network issue

## 📚 Full Debug Guides

- See: `BIDIRECTIONAL_MEDIA_FIX_DEBUG_GUIDE.md` - Detailed console reference
- See: `BIDIRECTIONAL_MEDIA_COMPLETE_FIX.md` - Complete fix explanation
