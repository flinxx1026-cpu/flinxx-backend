# Last Seen Debug Logs Added ✅

## Changes Made to `backend/server.js`

### 1. Enhanced verifyUserToken Middleware (Lines 260-330)

Added these debug logs to track token verification:

```javascript
console.log("AUTH HEADER:", req.headers.authorization);
console.log("DECODED TOKEN:", decoded);  // After JWT verification
console.log("DECODED TOKEN:", decoded);  // After base64 fallback decode
```

### 2. Enhanced last_seen Update in /api/user/profile (Lines 1207-1222)

Added critical debug logs:

```javascript
console.log("USER ID USED FOR UPDATE:", decoded.id);
console.log("✅ last_seen updated:", updateResult.id, updateResult.last_seen);
```

## Debug Flow

When a user makes a request to `/api/user/profile`:

1. **Middleware Phase** - verifyUserToken logs:
   - ✅ `AUTH HEADER: Bearer <token>`
   - ✅ `DECODED TOKEN: { id: "uuid", email: "...", ... }`
   - ✅ `USER ID USED FOR UPDATE: <uuid>`

2. **Update Phase** - Prisma logs:
   - ✅ `✅ last_seen updated: <uuid> <datetime>`

## What These Logs Will Reveal

If `last_seen` is NOT updating, we'll see one of:

### Issue 1: Token ID Mismatch
- `DECODED TOKEN` shows `id: "xyz"` (JWT id)
- `USER ID USED FOR UPDATE: xyz`
- But users.id in database is different
- **Fix:** Check JWT generation - ensure it uses correct user.id

### Issue 2: Prisma Update Failing Silently
- `✅ last_seen updated:` log DOES NOT appear
- Means update() threw an error caught silently
- **Fix:** Check error logs for Prisma exceptions

### Issue 3: Token Not Decoding
- `DECODED TOKEN:` log missing or shows wrong structure
- **Fix:** Check token encoding on frontend

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add backend/server.js
   git commit -m "Add last_seen debug logs - track token ID and Prisma update"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to Render dashboard
   - Clear build cache: Settings → Build cache → Clear
   - Manual deploy → Deploy
   - Wait for build complete

3. **Test**
   - Make API request to `/api/user/profile`
   - Check Render logs for the new debug outputs
   - Verify `✅ last_seen updated:` appears

4. **Monitor Backend Logs**
   - Watch for:
     - `DECODED TOKEN: { id: "..." }`
     - `USER ID USED FOR UPDATE: ...`
     - `✅ last_seen updated: ... ...`

If any of these logs are MISSING, the root cause is identified.

## Expected Console Output

```
AUTH HEADER: Bearer eyJhbGc...
DECODED TOKEN: { id: "550e8400-e29b-41d4-a716-446655440000", email: "user@example.com" }
USER ID USED FOR UPDATE: 550e8400-e29b-41d4-a716-446655440000

✅ last_seen updated: 550e8400-e29b-41d4-a716-446655440000 2026-01-16T10:30:45.123Z
```

Without this output, last_seen stays NULL.
