# ⚡ QUICK REFERENCE - What to Do Now

**TL;DR**: Black screen fix deployed. Test it. Monitor for 24h. Done.

---

## 🎯 IMMEDIATE (Next 30 min)

### Step 1: Deploy Backend
```
1. Go to: https://dashboard.render.com
2. Find your backend service
3. Click: "Deploy Latest Commit" button
4. Wait for: Status = "Live" (green)
```

### Step 2: Test Connection
```
1. Open your app
2. Allow camera ✅
3. Click "Start Video Chat"
4. Check: Videos appear? (NOT BLACK)
5. Open console (F12)
6. Look for: "STREAM VERIFICATION PASSED"
```

### Step 3: Test Mobile
```
1. Repeat on iPhone (iOS Safari)
2. Repeat on Android (Chrome)
3. Both should show videos (NOT BLACK)
```

---

## ✅ Success Signs

You'll see in console:
```
🔐 ✅ STREAM VERIFICATION PASSED - proceeding with WebRTC ✅
```

And videos will show (NOT BLACK) ✅

---

## ⚠️ If It's Still Black

1. **Check console for**:
   - `CRITICAL: localStreamRef.current is NULL` (means trying emergency recovery)
   - `EMERGENCY: Camera stream re-acquired` (means it worked)
   - `EMERGENCY FAILED` (means something's wrong)

2. **If you see "FAILED"**:
   - Check if you allowed camera permission
   - Try clearing browser cache
   - Try different browser
   - Try mobile hotspot

---

## 📊 Monitoring (24 Hours)

| Time | Frequency |
|------|-----------|
| 0-1h | Every 15 min |
| 1-4h | Every 30 min |
| 4-24h | Every 1-2 hours |

Just open app, allow camera, start matching. Check if videos appear.

---

## 🔄 If Something's Wrong

### Rollback (1 minute)
```bash
cd your-repo
git revert 76a6463
git push origin main
```

Both Render and Vercel will auto-deploy in 2-5 minutes.

---

## 📚 Full Docs

- **CRITICAL_FIX_STREAM_NULL.md** - What changed and why
- **TESTING_CRITICAL_FIX.md** - How to test it
- **DEPLOYMENT_SUMMARY_STREAM_FIX.md** - Complete details
- **STATUS_REPORT_CRITICAL_FIX.md** - Executive summary

---

## 🚀 Bottom Line

1. Deploy backend ✅
2. Test on desktop + mobile ✅
3. Monitor for 24h ✅
4. Done! 🎉

Videos should show (NOT BLACK) and connection should work smoothly.
