# WebRTC Black Screen - Diagnostic Guide

## 🚨 ONE OF THESE IS THE PROBLEM:

### 1️⃣ TURN Server is DOWN ❌
Check if your TURN server (15.206.146.133:3478) is running:

```bash
ssh -i webrtc-server-key.pem ubuntu@15.206.146.133
sudo systemctl status coturn
# Should show "active (running)"
```

**If STOPPED, start it:**
```bash
sudo systemctl start coturn
sudo systemctl enable coturn
```

**Check TURN logs:**
```bash
sudo tail -f /var/log/coturn.log
```

---

### 2️⃣ ICE Candidates Not Being Exchanged 📡
Open **Browser Console (F12)** and search for:

- ✅ `"🧊 ICE Connection State: connected"` → Good, ICE working
- ❌ `"🧊 ICE Connection State: failed"` → ICE FAILED, means:
  - TURN server unreachable
  - ISP/Firewall blocking port 3478

**What to do if FAILED:**
- Try different WiFi or mobile hotspot
- If still fails, need to:
  1. Check TURN server is running
  2. Check firewall rules:
     ```bash
     sudo ufw status
     sudo ufw allow 3478/tcp
     sudo ufw allow 3478/udp
     ```

---

### 3️⃣ Remote Track Not Arriving 📹
In console, search for: `"🚨🚨🚨 [ONTRACK HANDLER] REMOTE TRACK ARRIVED!"`

- ✅ If FOUND → Tracks arriving, problem is video display
- ❌ If NOT FOUND → Offer/Answer not released properly

**If NOT found:**
1. Check for "ANSWERER: Answer SUCCESSFULLY emitted to socket"
2. Check for "OFFERER: webrtc_offer emitted successfully"
3. If either is MISSING → signaling issue, not WebRTC

---

### 4️⃣ Remote Video Element Not Showing 🎬
If you see "REMOTE TRACK ARRIVED" but still black screen:

The fix is in Chat.jsx - ensure remote video element has proper attachment:
- remoteVideoRef.current.srcObject should be set
- remoteVideoRef.current.play() should be called

---

## 🔧 TEMPORARY FIX: Use Public TURN Servers

Edit `/frontend/src/utils/webrtcUtils.js`:

```javascript
export const getIceServers = () => {
  return [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
    // ADD THESE FREE PUBLIC TURN SERVERS as backup
    {
      urls: ["turn:numb.viagee.com:3478", "turn:numb.viagee.com:3479"],
      username: "webrtc",
      credential: "webrtc123"
    },
    {
      urls: ["turn:openrelay.metered.ca:80", "turn:openrelay.metered.ca:443"],
      username: "openrelayproject",
      credential: "openrelayproject"
    }
  ]
}
```

---

## 📊 CONSOLE LOG CHECKLIST

Run this in browser console to diagnose:

```javascript
// Check if both users see their own video (should be YES)
console.log('Local video playing?', !!document.querySelector('video[autoplay][muted]')?.srcObject?.getTracks().length);

// Check remote video element exists
console.log('Remote video ref exists?', !!document.querySelector('video:not([muted])')?.srcObject);

// Search console for these success messages:
// 1. "🎯 CHAT BUILD:" - Chat component loaded
// 2. "👥 SELF-MATCH CHECK PASSED" - Partner is different user
// 3. "🚨🚨🚨 [ONTRACK HANDLER]" - Remote tracks received ← MOST IMPORTANT
// 4. "🧊 ICE Connection State: connected" - Connection established
```

---

## 🛠️ ACTION PLAN

1. **SSH to TURN server** and check if it's running
2. **Open browser console** and provide these messages:
   - Any RED errors?
   - What's the ICE Connection State?
   - Do you see "REMOTE TRACK ARRIVED"?
3. **If TURN server is down:**
   - Start it: `sudo systemctl start coturn`
   - Then test again
4. **If ICE fails:**
   - Try different network (WiFi vs mobile)
   - If still fails, implement public TURN servers above

---

## 💡 IMPORTANT NOTES

- **Both users need** to see their OWN camera ✅
- **Remote video stays BLACK** = tracks not arriving to the video element
- **Common ISP issue** = Jio/Airtel blocks port 3478
- **Solution if blocked** = Use public TURN servers (free ones above work fine)

