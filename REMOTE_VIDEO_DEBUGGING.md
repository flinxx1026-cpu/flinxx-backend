# Remote Video Not Showing - Debugging Guide

Your camera works but partner's camera shows black? Follow these steps:

## Step 1: Open Browser Console
Press `F12` on your browser → Click **Console** tab

## Step 2: Start a Chat Session
Go to flinxx.in and match with someone

## Step 3: Look for These Messages in Console (in order)

### ✅ If you see this - Offer/Answer Exchange Worked:
```
✅✅✅ [LISTENER FIRED] partner_found event received!
========== PARTNER FOUND INITIATED ==========
Creating OFFER
✅ OFFER SENT
✅ ANSWER RECEIVED
```

### ✅ After ~3 seconds, look for Diagnostic Check:
```
📊 [3-SECOND REMOTE STREAM CHECK]
🔍 Remote stream exists? true
   Track count: 2
   [0] video: enabled=true, state=live
   [1] audio: enabled=true, state=live
🔍 Receivers count: 2
🔍 Peer connection state: connected
```

---

## If You See These Issues:

### ❌ Problem 1: Remote stream exists? FALSE
**Reason:** Remote tracks are not arriving
**Fix Needed:** Check ICE connection

### ❌ Problem 2: Receivers count: 0
**Reason:** Remote peer didn't send any tracks
**Fix Needed:** Check if remote peer's camera/mic are enabled

### ❌ Problem 3: Track count: 1 (only audio, no video)
**Reason:** Partner's camera is off or blocked
**Solution:** Ask partner to enable camera

---

## Critical Console Messages to Check

### Look for this (means connection working):
```
✅ State: CONNECTED - Found working ICE candidate pair
```

### Or this (also good):
```
✅ State: COMPLETED - ICE checks completed, ready for media
```

### If you see this (connection failed):
```
❌ State: FAILED - All ICE candidate pairs failed
```

---

## What to Report if Problem Persists

Copy these from console and share:

1. **Search for:** `ONTRACK HANDLER` - should appear when remote video arrives
2. **Search for:** `ICE Connection State` - track the state progression
3. **Search for:** `3-SECOND REMOTE STREAM CHECK` - the diagnostic summary
4. **Search for:** `CONNECTION STATE FAILED` - if connection fails

---

## Quick Fix Attempts

1. **Refresh and retry** - Sometimes helps WebRTC reset
2. **Check partner's camera** - Ask if they can see YOUR video
3. **Check internet** - Try WiFi if on mobile, or vice versa
4. **Check camera permissions** - Ensure browser has camera access

