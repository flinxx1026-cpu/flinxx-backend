# Google Login Fix - Database Migration Guide

## ⚠️ Problem Description

The Google login redirect error was happening because:
1. The main backend's database users table was missing required OAuth fields
2. The migration was accidentally applied to the admin-panel backend instead of the main website backend
3. The OAuth upsert logic was using `email` as the conflict key instead of `google_id`

## ✅ Solution Overview

### What Was Fixed

1. **Backend Google OAuth Callback** (`backend/server.js`)
   - Changed upsert pattern from `ON CONFLICT (email)` to `ON CONFLICT (google_id)`
   - Now properly recognizes returning users via their Google ID instead of email
   - Ensures OAuth idempotency - same Google account always maps to same user

2. **Database Schema** (`backend/server.js` - `initializeDatabase()`)
   - Added `UNIQUE` constraint to `google_id` field
   - Added index on `google_id` for query optimization
   - Schema now matches user requirements:
     ```
     google_id VARCHAR(255) UNIQUE
     birthday DATE
     gender VARCHAR(50)
     age INTEGER
     is_profile_completed BOOLEAN DEFAULT FALSE
     ```

3. **Frontend Callback Logic** (`frontend/src/pages/callback.jsx`)
   - Already correctly checks `isProfileCompleted` flag
   - Shows ProfileSetupModal if `isProfileCompleted === false` (MANDATORY)
   - Redirects to `/chat` if `isProfileCompleted === true` (FAST PATH)

## 🔧 Migration Steps for Production Database

### Step 1: Add Missing Constraints (If Not Already Present)

If your production database doesn't have the UNIQUE constraint on `google_id`, run this SQL:

```sql
-- Add UNIQUE constraint to google_id if it doesn't exist
ALTER TABLE users 
ADD CONSTRAINT users_google_id_unique UNIQUE (google_id);

-- Add index for performance (if not already created by the constraint)
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
```

### Step 2: Handle Duplicate google_id Values (If Any)

If you have duplicate `google_id` values from the old email-based conflict logic:

```sql
-- Find duplicates
SELECT google_id, COUNT(*) as count 
FROM users 
WHERE google_id IS NOT NULL 
GROUP BY google_id 
HAVING COUNT(*) > 1;

-- If duplicates exist, you may need to merge them manually or delete old entries
-- Example: Keep most recent user, delete duplicates
DELETE FROM users 
WHERE id IN (
  SELECT id FROM users u1 
  WHERE google_id IS NOT NULL 
  AND id NOT IN (
    SELECT id FROM users u2 
    WHERE u2.google_id = u1.google_id 
    ORDER BY u2.updated_at DESC 
    LIMIT 1
  )
);
```

### Step 3: Verify Schema

Check that your users table has all required fields:

```sql
-- Verify all required columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Should include:
-- - id (UUID, PRIMARY KEY)
-- - email (VARCHAR, UNIQUE, NOT NULL)
-- - google_id (VARCHAR, UNIQUE)
-- - birthday (DATE)
-- - gender (VARCHAR)
-- - age (INTEGER)
-- - is_profile_completed (BOOLEAN)
-- - display_name (VARCHAR)
-- - photo_url (TEXT)
-- - auth_provider (VARCHAR)
-- - provider_id (VARCHAR)
-- - created_at (TIMESTAMP)
-- - updated_at (TIMESTAMP)
```

### Step 4: Test the Flow Locally

Before deploying to production:

```bash
# 1. Start the backend
cd backend
npm start

# 2. Start the frontend
cd frontend
npm run dev

# 3. Test Google login flow:
# - Click "Login with Google"
# - Should redirect to Google OAuth
# - After approval, should show profile setup modal (if first login)
# - Fill in birthday + gender
# - Click Save
# - Should redirect to /chat
# - Profile should be locked (birthday + gender non-editable)

# 4. Test returning user flow:
# - Logout
# - Login with same Google account
# - Should skip modal and go directly to /chat
```

## 📋 Verification Checklist

- [ ] Database has `UNIQUE` constraint on `google_id`
- [ ] No duplicate `google_id` values in production database
- [ ] Backend deployed with updated `server.js` (commit `b09e602`)
- [ ] Frontend deployed with ProfileSetupModal
- [ ] Google OAuth callback properly redirects with `isProfileCompleted` flag
- [ ] Profile setup modal shows for first-time users
- [ ] Returning users skip modal and go directly to chat
- [ ] Age validation works (18+ check blocks underage users)
- [ ] Profile data is locked after first save
- [ ] localStorage contains correct `isProfileCompleted` flag

## 🚀 Deployment Order

1. **Database Migration** - Run SQL scripts above on production database
2. **Backend Deployment** - Deploy updated `server.js` with new callback logic
3. **Frontend Deployment** - Deploy frontend with ProfileSetupModal
4. **Testing** - Run verification scenarios above

## 📝 Important Notes

- The database schema is now defined in `backend/server.js` `initializeDatabase()` function
- New tables are created automatically on first backend startup
- The migration runs every time the backend starts (uses `CREATE TABLE IF NOT EXISTS`)
- For existing databases, you need to manually apply the constraints

## 🐛 Troubleshooting

### Issue: "duplicate key value violates unique constraint"

**Solution**: You have duplicate `google_id` values. Run the duplicate resolution SQL above.

### Issue: Users stuck in infinite redirect loop

**Solution**: Check that `isProfileCompleted` flag is being set correctly in database and returned by backend.

### Issue: Profile modal not showing for first-time users

**Solution**: Verify that backend is returning `isProfileCompleted: false` in the callback response.

### Issue: Returning users see modal again

**Solution**: Check that `localStorage` contains the updated user data with `isProfileCompleted: true` after profile save.

## 📚 Related Files

- `backend/server.js` - OAuth callback and profile endpoints
- `frontend/src/pages/callback.jsx` - OAuth callback handler
- `frontend/src/components/ProfileSetupModal.jsx` - Profile setup form
- `frontend/src/components/ProtectedChatRoute.jsx` - Emergency fallback protection

## 🔗 Reference Links

- Commit with fixes: `b09e602`
- Previous implementation commit: `7384dcf`
