# Profile Setup Feature - Quick Reference

## 🎯 What Changed

After Google/Facebook login, users MUST complete a profile setup modal with:
- **Birthday** (required) - Age calculated automatically
- **Gender** (required) - Select from 4 options
- Age validation blocks users under 18

## 📝 Key Files

| File | Purpose | Changes |
|------|---------|---------|
| `backend/server.js` | Database + API | Added profile fields, new `/api/users/complete-profile` endpoint |
| `frontend/src/components/ProfileSetupModal.jsx` | Modal UI | NEW component for profile setup |
| `frontend/src/components/ProtectedChatRoute.jsx` | Route protection | NEW wrapper to enforce profile completion |
| `frontend/src/pages/callback.jsx` | OAuth callback | Shows modal if profile incomplete |
| `frontend/src/components/Layout.jsx` | Router | Wrapped Chat route with ProtectedChatRoute |

## 🔧 API Endpoints

### Complete Profile
```
POST /api/users/complete-profile

Request:
{
  "userId": "uuid",
  "birthday": "1990-01-15",
  "gender": "male",
  "googleId": "optional"
}

Response (Success):
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "...",
    "birthday": "1990-01-15",
    "gender": "male",
    "age": 34,
    "isProfileCompleted": true
  }
}

Response (Error - Under 18):
{
  "error": "You must be 18+ to use this app",
  "code": "UNDERAGE_USER"
}
```

## 📊 Database

### New Fields in `users` table
- `google_id` - Google user ID
- `birthday` - User's date of birth
- `gender` - Selected gender
- `age` - Calculated age
- `is_profile_completed` - Boolean flag

### Query to Add Fields
```sql
ALTER TABLE users ADD COLUMN
  google_id VARCHAR(255),
  birthday DATE,
  gender VARCHAR(50),
  age INTEGER,
  is_profile_completed BOOLEAN DEFAULT FALSE;
```

## 🔄 User Flow

1. **User logs in** with Google/Facebook
2. **Callback page** checks `isProfileCompleted` flag
3. **If FALSE** → Show ProfileSetupModal (MANDATORY)
4. **User fills** birthday + gender
5. **Age < 18** → Error message, blocked from proceeding
6. **Age >= 18** → Submit to `/api/users/complete-profile`
7. **Backend** validates age, saves to database
8. **Redirect** to /chat
9. **Returning users** skip modal (isProfileCompleted = TRUE)

## 🛡️ Security

### Age Gating (Two-Layer)
- **Frontend**: Real-time validation, user-friendly
- **Backend**: Server-side validation, cannot be bypassed

### Data Locking
- Birthday and gender locked after first save
- Database prevents modifications
- `is_profile_completed` acts as single-source-of-truth

## ✅ Testing

```javascript
// Test 1: First-time login
1. Click Google login
2. Modal appears ✓
3. Select birthday (under 18) → Red text + can't save ✓
4. Select birthday (18+) → Green text + can save ✓
5. Select gender → Save button enabled ✓
6. Click Save → Saves to database ✓
7. Redirects to /chat ✓

// Test 2: Returning user
1. Login again
2. Modal skipped ✓
3. Direct to /chat ✓

// Test 3: Force profile check
1. In chat, open DevTools
2. Clear `isProfileCompleted` from user object
3. Refresh page
4. ProtectedChatRoute shows modal again ✓
```

## 🚀 Deployment

1. **Database**: Run migration to add profile fields
2. **Backend**: Deploy updated `server.js`
3. **Frontend**: Build & deploy new components
4. **Test**: Run through login flow with test account

## 📝 Example User Record

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "google_id": "118365379799...",
  "birthday": "1990-05-15",
  "gender": "male",
  "age": 34,
  "isProfileCompleted": true,
  "authProvider": "google"
}
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal not showing | Check `isProfileCompleted` in localStorage |
| Age calculation wrong | Verify birthday is in correct format (YYYY-MM-DD) |
| Backend error 400 | Age < 18 - user rejected, show age error message |
| Save button stuck disabled | Ensure both birthday AND gender are selected |
| Redirect not working | Check `onProfileComplete` callback in ProtectedChatRoute |

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Verify backend database fields exist
3. Test with age >= 18 first
4. Check network tab for API response
5. Review logs in `/PROFILE_SETUP_IMPLEMENTATION.md`

---

**Last Updated**: December 5, 2025  
**Status**: ✅ Ready for Production
