# Testing Guide - User ID Display Fix

## Quick Test (2 minutes)

### Step 1: Restart Backend
```bash
cd backend
npm stop
npm start
```

Wait for: `🔵 Server running on http://localhost:5000`

### Step 2: Test in Browser
1. Open http://localhost:3003 in a fresh incognito window
2. Click "Login with Google" or "Login with Facebook"
3. Complete authentication
4. Go to Profile page (gear icon or `/profile` route)
5. Look for "User ID" section

**Expected Result:**
- User ID field shows: 8-digit number (e.g., `87654321`)
- Can click 📋 to copy the ID

### Step 3: Check Backend Logs
Look for these logs confirming the fix works:

```
✅ Profile fetched for user: your-email@gmail.com
```

The user should have a `public_id` assigned.

## Detailed Test (10 minutes)

### Test Case 1: New Gmail Login
1. Log out completely
2. Clear localStorage: Press F12 → Application → Storage → Clear All
3. Log in with new Gmail account
4. Check Profile page for User ID
5. Copy ID and verify it's an 8-digit number

**Expected:** User ID shows correctly ✅

### Test Case 2: Returning User
1. Log in with an existing Gmail account
2. Check Profile page
3. Verify User ID displays

**Expected:** User ID shows (should be same as before) ✅

### Test Case 3: Check Console
Open DevTools (F12) → Console, then navigate to Profile.

You should see:
```
✅ Profile data fetched from backend: {
  profile: {
    id: "87654321",    // ← This should NOT be undefined/N/A
    email: "...",
    name: "...",
    picture: "..."
  }
}
```

## Troubleshooting

### Still Showing "N/A"?
1. **Browser Cache:** Clear browser cache + localStorage
   - F12 → Application → Storage → Clear All
2. **Backend not restarted:** Kill any lingering Node processes
   ```bash
   # Windows PowerShell
   Get-Process node | Stop-Process -Force
   # Then restart npm start
   ```
3. **Wrong endpoint:** Check Network tab in DevTools
   - Should see: `GET /api/user/profile?email=...`
   - Response should include `"id": "12345678"`

### Still Broken?
1. Check backend logs for errors
2. Verify public_id exists in database:
   ```bash
   # Run in backend directory
   node fix-missing-public-ids.js
   ```
3. Check if `user.public_id` is null in database

## Success Indicators
- ✅ User ID displays on Profile page
- ✅ Can copy User ID
- ✅ Backend logs show successful fetch
- ✅ Network response includes valid 8-digit ID

## Files Changed
- `backend/server.js` - Added `public_id` to SQL query
- `backend/fix-missing-public-ids.js` - New maintenance script
- `USER_ID_FIX_COMPLETE.md` - Documentation
- `ISSUE_DIAGNOSIS.md` - Root cause analysis
