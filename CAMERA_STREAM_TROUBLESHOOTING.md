# Camera Stream Not Available - Complete Troubleshooting Guide

## Issue Summary
```
❌ Problem: localStream available: false
❌ Impact: Users stuck on waiting screen, cannot connect
❌ Root Cause: Browser camera permission or hardware issue
```

---

## STEP 1: Check Browser Console for Detailed Error

Open DevTools (F12) and look for these patterns:

### If you see: `❌ ❌ ❌ CAMERA ERROR ❌ ❌ ❌`
This is good - read the error type below to fix it.

### Error Types & Solutions:

#### 1️⃣ NotAllowedError = Permission Denied
```
⚠️ CAMERA PERMISSION DENIED!
→ Check your browser: Look for permission prompt at top of screen
→ Or go to Settings → Privacy → Camera/Microphone and enable for localhost
```

**FIX:**
- **Chrome**: Settings → Privacy & Security → Site Settings → Camera → localhost:3003 → Allow
- **Firefox**: Preferences → Privacy & Security → Permissions → Camera → localhost → Allow
- **Safari**: Safari → Settings → Websites → Camera → localhost → Allow
- **Edge**: Settings → Privacy → Camera → localhost:3003 → Allow

#### 2️⃣ NotFoundError = No Camera Hardware
```
⚠️ NO CAMERA HARDWARE FOUND!
→ Make sure your computer has a webcam connected
```

**FIX:**
- Check if webcam is plugged in
- Try `lsusb` (Linux) or Device Manager (Windows) to see if camera is detected
- Try different USB port
- Restart computer

#### 3️⃣ NotReadableError = Camera In Use
```
⚠️ CAMERA IN USE BY ANOTHER APPLICATION!
→ Close other apps using camera (Zoom, Teams, OBS, etc.)
```

**FIX:**
- Close all browser tabs using webcam
- Close Zoom, Microsoft Teams, Google Meet, Discord, OBS Studio, Skype, etc.
- Check Task Manager: Search for any process using camera
- Restart browser
- Kill and restart any conflicting applications

#### 4️⃣ SecurityError = HTTPS/Protocol Issue
```
⚠️ HTTPS/SECURITY ERROR!
→ Camera only works on HTTPS or localhost
```

**FIX:**
- Ensure application is running on `localhost` (development)
- OR ensure application is on `https://` domain (production)
- NOT on regular `http://` (unless localhost)

#### 5️⃣ TypeError = Browser Not Supported
```
⚠️ BROWSER DOES NOT SUPPORT getUserMedia!
→ Make sure you're using a modern browser
```

**FIX:**
- Update to latest browser version
- Try: Chrome, Firefox, Safari, or Edge (all modern versions support WebRTC)
- NOT: Internet Explorer, Opera (older versions)

---

## STEP 2: Test Camera in Browser

Go to: **https://www.aboutwebcam.com/**
- Click "Test Camera"
- Check if camera works here
- If NOT working here, it's a system/browser issue, NOT application issue

---

## STEP 3: Check Console for Success Messages

If camera initializes successfully, you should see these logs (in order):

```javascript
🚀🚀🚀 [STARTCAMERA] FUNCTION CALLED 🚀🚀🚀
📹 [CAMERA INIT] Requesting camera permissions from browser...
📹 [CAMERA INIT] ⏳ Waiting for user permission dialog...
✅ ✅ ✅ CAMERA PERMISSION GRANTED ✅ ✅ ✅
📹 [CAMERA INIT] ✅ Camera stream obtained with 2 tracks
     Track 0: VIDEO, enabled: true, readyState: live
     Track 1: AUDIO, enabled: true, readyState: live
📹 [CAMERA INIT] 🟢 CAMERA IS FULLY READY AND DISPLAYING VIDEO
```

If you DON'T see these messages, the camera failed to initialize.

---

## STEP 4: If Still Broken - Check Windows Settings

### Windows 10/11

**Method 1: Camera Settings**
1. Start Menu → Settings (⚙️)
2. Privacy & Security → Camera
3. Ensure "Camera access" is ON
4. Scroll down → Find your browser (Chrome, Firefox, etc.)
5. Toggle it to the ON position

**Method 2: Microphone Settings**
1. Start Menu → Settings
2. Privacy & Security → Microphone
3. Ensure "Microphone access" is ON
4. Toggle on your browser

**Method 3: Check Device Manager**
1. Right-click Start Menu → Device Manager
2. Find "Imaging devices" or "Cameras"
3. Expand it
4. Check if your camera is listed
5. If it has a ❌ or ⚠️, right-click → Update driver

---

## STEP 5: Try These Fixes (In Order)

### Fix 1: Hard Refresh Browser
```
Ctrl + Shift + R (Windows/Linux)
OR
Cmd + Shift + R (Mac)
```

### Fix 2: Clear Browser Cache
```
Chrome:
  Settings → Privacy & Security → Clear browsing data
  ✓ Cookies and other site data
  ✓ Cached images and files
  → Clear data
```

### Fix 3: Disable Browser Extensions
Some extensions block camera access:
1. Open DevTools (F12)
2. Three dots → More tools → Extensions
3. Disable all extensions temporarily
4. Refresh page
5. Test camera
6. Re-enable one by one to find culprit

### Fix 4: Try Incognito/Private Mode
```
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
Cmd + Shift + P (Safari)
```
This disables most extensions and runs with fresh permissions.

### Fix 5: Restart Browser & Computer
```
Close ALL browser windows
Restart your computer
Open browser
Go to app
Check camera
```

### Fix 6: Update Camera Driver (Windows)
1. Device Manager → Cameras
2. Right-click your camera → Update driver
3. Select "Search automatically for drivers"
4. Wait for update
5. Restart computer

---

## STEP 6: Debug Mode - Get Detailed Logs

The application now logs EVERYTHING about camera initialization. To enable maximum logging:

1. Open DevTools (F12)
2. Go to Console tab
3. Filter by: `CAMERA` or `STARTCAMERA`
4. Look for all messages related to camera

Share these logs with support if needed:
- Exact error message
- Error type (NotAllowedError, NotFoundError, etc.)
- When it occurs (on page load, when clicking "Start")
- Browser & OS version
- Output of aboutwebcam.com test

---

## STEP 7: If Camera Works But Still No Connection

If camera is green ✅ but you still can't connect:

1. **Check Socket Connection**: Look for `🔌 [SOCKET]` messages
2. **Check Partner Stream**: Look for `📹 [REMOTE STREAM]` messages
3. **Check WebRTC Offer/Answer**: Look for `🎯 [OFFER]` and `🎯 [ANSWER]` messages

These are different issues from camera access.

---

## Common Causes By OS

### Windows 10/11
- [ ] Camera permission denied in Settings → Privacy & Security
- [ ] Another app using camera (check Task Manager)
- [ ] Camera driver outdated (Device Manager → Update driver)
- [ ] Antivirus blocking camera (check security software)

### macOS
- [ ] Camera not allowed in System Preferences → Security & Privacy
- [ ] Chrome/Firefox not in allowed apps (may be under "Screen Recording")
- [ ] System restart needed after permission change

### Linux
- [ ] Camera permissions: `sudo usermod -a -G video $USER`
- [ ] libcamera or v4l2 driver missing: `sudo apt install libcamera-tools`
- [ ] Another app using /dev/video0: `sudo fuser /dev/video0`

---

## Still Stuck? Provide These Logs

Open DevTools → Console → Search for "CAMERA" → Copy all messages that contain:
- CAMERA ERROR
- STARTCAMERA
- Camera stream obtained
- Video element
- Your browser console output

Send these to support with:
1. Your OS (Windows 10, macOS 12, etc.)
2. Browser & version (Chrome 120, Firefox 121, etc.)
3. Your camera model (if known)
4. Output from aboutwebcam.com test
5. Steps you've tried
