# Profile Setup Architecture & Flow Diagrams

## 📐 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layout.jsx                                                      │
│  ├─ Routes                                                       │
│  │  ├─ /chat → ProtectedChatRoute → Chat.jsx                   │
│  │  └─ /callback → Callback.jsx                                │
│  │                                                              │
│  ProtectedChatRoute.jsx                                         │
│  ├─ Check localStorage user                                     │
│  ├─ Check isProfileCompleted                                    │
│  └─ Show ProfileSetupModal if needed                           │
│                                                                  │
│  Callback.jsx                                                    │
│  ├─ Receive user from OAuth redirect                           │
│  ├─ Check isProfileCompleted                                    │
│  └─ Show ProfileSetupModal if needed                           │
│                                                                  │
│  ProfileSetupModal.jsx                                          │
│  ├─ Display profile photo                                       │
│  ├─ Show name (read-only)                                       │
│  ├─ Get birthday input                                          │
│  ├─ Get gender dropdown                                         │
│  ├─ Calculate age real-time                                     │
│  ├─ Validate age >= 18                                          │
│  └─ POST to /api/users/complete-profile                        │
│                                                                  │
└────────┬──────────────────────────────────────────────────────┬─┘
         │                                                       │
         │ HTTP Requests                                        │
         │ (JWT/Session)                                        │
         │                                                       │
         ▼                                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Backend (Node.js)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  server.js                                                       │
│  ├─ GET /auth/google                                            │
│  │  └─ Redirect to Google OAuth                               │
│  │                                                              │
│  ├─ GET /auth/google/callback                                  │
│  │  ├─ Exchange code for tokens                               │
│  │  ├─ Fetch user info                                         │
│  │  ├─ Query DB for user                                       │
│  │  ├─ Insert/Update user                                      │
│  │  └─ Return isProfileCompleted flag                         │
│  │                                                              │
│  ├─ POST /api/users/complete-profile                          │
│  │  ├─ Validate userId, birthday, gender                      │
│  │  ├─ Calculate age                                           │
│  │  ├─ Check age >= 18                                         │
│  │  │  └─ Return error if < 18                               │
│  │  ├─ Update users table                                      │
│  │  │  ├─ Set birthday                                         │
│  │  │  ├─ Set gender                                           │
│  │  │  ├─ Set age                                              │
│  │  │  └─ Set is_profile_completed = TRUE                     │
│  │  └─ Return user object                                      │
│  │                                                              │
│  └─ GET /api/users/:userId                                     │
│     └─ Return all user fields (including profile)              │
│                                                                  │
└────────┬──────────────────────────────────────────────────────┬─┘
         │                                                       │
         │ SQL Queries                                          │
         │ (Connection Pool)                                    │
         │                                                       │
         ▼                                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  users table                                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ id (UUID PK)                                           │    │
│  │ email (VARCHAR UNIQUE)                                 │    │
│  │ display_name (VARCHAR)                                 │    │
│  │ photo_url (TEXT)                                       │    │
│  │ auth_provider (VARCHAR)                                │    │
│  │ provider_id (VARCHAR)                                  │    │
│  │ google_id (VARCHAR) ← NEW                              │    │
│  │ birthday (DATE) ← NEW                                  │    │
│  │ gender (VARCHAR) ← NEW                                 │    │
│  │ age (INTEGER) ← NEW                                    │    │
│  │ is_profile_completed (BOOLEAN) ← NEW                   │    │
│  │ created_at (TIMESTAMP)                                 │    │
│  │ updated_at (TIMESTAMP)                                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Indexes:                                                        │
│  - idx_users_email                                               │
│  - idx_users_provider                                            │
│  - idx_users_profile_completed ← NEW                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Authentication Flow - Detailed

```
STEP 1: User Initiates Login
┌──────────────┐
│ User clicks  │
│ "Sign in     │
│  with Google"│
└──────┬───────┘
       │
       ▼
   Browser redirects to:
   GET /auth/google

STEP 2: Google OAuth Consent
┌──────────────────────────┐
│  Google OAuth            │
│  Consent Screen          │
│  [user@gmail.com]        │
│  Grant Permissions?      │
│  ✓ Profile ✓ Email       │
│                          │
│  [Cancel] [Allow]        │
└──────────┬───────────────┘
           │ User clicks [Allow]
           ▼
    Google redirects to:
    GET /auth/google/callback?code=...

STEP 3: Backend Exchange Code
┌───────────────────────────────────┐
│ Backend receives code             │
│ 1. POST to Google token endpoint  │
│ 2. Receive access_token           │
│ 3. GET user info from Google API  │
│ 4. Parse email, name, picture     │
└───────────┬─────────────────────────┘
            │
            ▼
    Check if user in DB:
    SELECT * FROM users 
    WHERE email = 'user@gmail.com'

STEP 4: Insert or Update User
┌────────────────────────────────────────────┐
│ User exists? Insert or Update              │
│                                            │
│ INSERT INTO users (                        │
│   id, email, display_name,                 │
│   photo_url, auth_provider,                │
│   provider_id, google_id                   │
│ ) VALUES (...)                             │
│ ON CONFLICT(email) DO UPDATE ...           │
│                                            │
│ RETURNING *                                │
│ → User object with                         │
│   is_profile_completed = FALSE             │
└────────────┬─────────────────────────────┘
             │
             ▼
    Redirect to frontend:
    /callback?token=...&user={
      "id": "550e8400-...",
      "email": "user@gmail.com",
      "name": "John Doe",
      "picture": "https://...",
      "googleId": "1183653...",
      "isProfileCompleted": false  ← KEY!
    }

STEP 5: Frontend Callback Handler
┌──────────────────────────────────┐
│ Callback.jsx receives params     │
│                                  │
│ Parse user object                │
│ Save to localStorage             │
│                                  │
│ Check user.isProfileCompleted    │
└────────┬───────────────┬─────────┘
         │               │
    FALSE│               │TRUE
         │               │
         ▼               ▼
    SHOW MODAL      REDIRECT
    (Required!)     to /chat

STEP 6: Profile Setup Modal
┌─────────────────────────────────────┐
│ ProfileSetupModal.jsx               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Complete Your Profile           │ │
│ │                                 │ │
│ │ [Profile Photo]                 │ │
│ │ Name: John Doe (readonly)       │ │
│ │ Birthday: [Date Picker]         │ │
│ │ Age: 34 years old (calculated)  │ │
│ │ Gender: [Dropdown ▼]            │ │
│ │         - Male                  │ │
│ │         - Female                │ │
│ │         - Other                 │ │
│ │         - Prefer not to say      │ │
│ │                                 │ │
│ │ [Save Profile Button]           │ │
│ │ (Enabled only if age >= 18)     │ │
│ │                                 │ │
│ │ Birthday and gender are locked  │ │
│ │ after saving.                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Real-time validation:               │
│ - Age < 18: RED text, button disabled│
│ - Age >= 18: GREEN text, button enabled
│                                     │
└────────┬────────────────────────────┘
         │ User fills & clicks Save
         ▼
    POST /api/users/complete-profile
    {
      "userId": "550e8400-...",
      "birthday": "1990-01-15",
      "gender": "male",
      "googleId": "1183653..."
    }

STEP 7: Backend Profile Completion
┌──────────────────────────────────────────┐
│ /api/users/complete-profile endpoint     │
│                                          │
│ 1. Receive birthday, gender, userId      │
│ 2. Calculate age from birthday:          │
│    age = today.year - birth.year         │
│    (with month/day adjustment)           │
│ 3. Check: age >= 18?                     │
│    ├─ NO: Return 400 error               │
│    │      {                              │
│    │        "error": "You must be 18+    │
│    │                  to use this app",  │
│    │        "code": "UNDERAGE_USER"      │
│    │      }                              │
│    └─ YES: Continue                      │
│ 4. UPDATE users SET                      │
│      birthday = $1,                      │
│      gender = $2,                        │
│      age = $3,                           │
│      is_profile_completed = TRUE,        │
│      updated_at = NOW()                  │
│    WHERE id = $4                         │
│ 5. RETURNING * → user object             │
└────────┬──────────────────────────────────┘
         │
    Age >= 18?
         │
    YES  │  NO
        │  │
        │  ▼
        │ Show error modal
        │ "You must be 18+"
        │
        ▼
    Return 200 OK
    {
      "success": true,
      "user": {
        "id": "550e8400-...",
        "birthday": "1990-01-15",
        "gender": "male",
        "age": 34,
        "isProfileCompleted": true
      }
    }

STEP 8: Frontend Update & Redirect
┌─────────────────────────────────────────┐
│ ProfileSetupModal receives response      │
│                                         │
│ 1. Check response.ok                    │
│ 2. Update localStorage:                 │
│    user.isProfileCompleted = true       │
│    user.birthday = "1990-01-15"         │
│    user.gender = "male"                 │
│    user.age = 34                        │
│ 3. Call onProfileComplete() callback    │
│ 4. Close modal                          │
│ 5. Navigate to /chat                    │
└────────┬──────────────────────────────────┘
         │
         ▼
    STEP 9: Protected Route Check
    ┌─────────────────────────────┐
    │ ProtectedChatRoute.jsx      │
    │                             │
    │ 1. Check localStorage.user  │
    │ 2. Check isProfileCompleted │
    │    └─ If TRUE: Show chat ✓  │
    │    └─ If FALSE: Show modal  │
    │ 3. Load Chat component      │
    └────────┬────────────────────┘
             │
             ▼
        STEP 10: Success! 🎉
        User in Chat Room
        Profile setup complete
        Birthday & gender locked
        isProfileCompleted = TRUE
        Database persisted
```

## 🔐 Age Validation Double-Check

```
┌─────────────────────────────────────────────────────────┐
│  Age Validation: Two-Layer Defense                      │
└─────────────────────────────────────────────────────────┘

LAYER 1: Frontend (React Component)
┌────────────────────────────────────────────────────────┐
│ ProfileSetupModal.jsx                                  │
│                                                        │
│ User selects birthday:                                 │
│ const [birthday, setBirthday] = useState('')          │
│                                                        │
│ useEffect(() => {                                      │
│   if (birthday) {                                      │
│     const birthDate = new Date(birthday)              │
│     const today = new Date()                          │
│     let age = today.getFullYear() -                   │
│             birthDate.getFullYear()                   │
│     const monthDiff = today.getMonth() -              │
│                    birthDate.getMonth()               │
│     if (monthDiff < 0 ||                              │
│         (monthDiff === 0 &&                           │
│          today.getDate() <                            │
│          birthDate.getDate())) {                       │
│       age--                                            │
│     }                                                  │
│     setAge(age)                                       │
│   }                                                    │
│ }, [birthday])                                         │
│                                                        │
│ Real-time display:                                     │
│ Age: <span className={                                 │
│   age < 18 ?                                           │
│   'text-red-600' :                                     │
│   'text-green-600'                                     │
│ }>                                                     │
│   {age} years old                                      │
│ </span>                                                │
│                                                        │
│ Save button logic:                                     │
│ const isSaveDisabled = !birthday || !gender ||        │
│                      loading || age < 18              │
│                                                        │
│ Result: ✅ User cannot click Save if age < 18        │
│        ✅ User sees clear visual feedback             │
│        ✅ User knows immediately if rejected          │
└────────────────────────────────────────────────────────┘

LAYER 2: Backend (Server.js)
┌────────────────────────────────────────────────────────┐
│ /api/users/complete-profile endpoint                  │
│                                                        │
│ app.post('/api/users/complete-profile',               │
│   async (req, res) => {                               │
│     const { userId, birthday, gender } = req.body    │
│                                                        │
│     // Calculate age on backend                        │
│     const birthDate = new Date(birthday)              │
│     const today = new Date()                          │
│     let age = today.getFullYear() -                   │
│              birthDate.getFullYear()                  │
│     const monthDiff = today.getMonth() -              │
│                   birthDate.getMonth()                │
│     if (monthDiff < 0 ||                              │
│         (monthDiff === 0 &&                           │
│          today.getDate() <                            │
│          birthDate.getDate())) {                       │
│       age--                                            │
│     }                                                  │
│                                                        │
│     // CRITICAL: Check age >= 18                       │
│     if (age < 18) {                                    │
│       return res.status(400).json({                   │
│         error: 'You must be 18+ to use this app',     │
│         code: 'UNDERAGE_USER'                        │
│       })                                               │
│     }                                                  │
│                                                        │
│     // Update database                                 │
│     const result = await pool.query(                  │
│       `UPDATE users SET                               │
│        birthday = $1,                                 │
│        gender = $2,                                   │
│        age = $3,                                      │
│        is_profile_completed = TRUE                    │
│        WHERE id = $4                                  │
│        RETURNING *`,                                  │
│       [birthday, gender, age, userId]                 │
│     )                                                  │
│                                                        │
│     return res.json({                                 │
│       success: true,                                  │
│       user: result.rows[0]                            │
│     })                                                 │
│   })                                                  │
│                                                        │
│ Result: ✅ Age recalculated server-side              │
│        ✅ Cannot bypass with tampered request         │
│        ✅ Cannot edit birthday to younger age         │
│        ✅ Returns clear error to user                 │
└────────────────────────────────────────────────────────┘

Why Both Layers Needed?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend Only: ✅ Good UX, ❌ Can be bypassed
  - User can modify JavaScript
  - User can send request directly to API
  - Missing security

Backend Only: ✅ Secure, ❌ Poor UX
  - User submits, waits for error
  - Frustrating experience
  - Not professional

Both Together: ✅ Great UX + ✅ Secure
  - Immediate feedback (frontend)
  - Cannot be bypassed (backend)
  - Professional experience
  - Enterprise-grade solution
```

## 📊 State Management Flow

```
React Component Hierarchy
═════════════════════════════════════════════════════════

App.jsx
  └─ Layout.jsx
      └─ Router
          ├─ Home
          ├─ Login
          ├─ Callback.jsx
          │  └─ State:
          │     ├─ showProfileSetup: boolean
          │     ├─ userData: object
          │     ├─ isLoading: boolean
          │     └─ Effects:
          │        └─ Check profile on mount
          │
          ├─ ProtectedChatRoute
          │  └─ State:
          │     ├─ showProfileSetup: boolean
          │     ├─ user: object
          │     ├─ isLoading: boolean
          │     └─ Effects:
          │        └─ Verify profile before showing chat
          │
          └─ Chat.jsx
             └─ Shown only if profile complete
                (Protected by ProtectedChatRoute)

ProfileSetupModal Component
═════════════════════════════════════════════════════════
State:
  - birthday: string (YYYY-MM-DD)
  - gender: string (male/female/other/prefer_not_to_say)
  - age: number | null
  - error: string | null
  - loading: boolean

Props:
  - user: object (from parent)
  - onProfileComplete: function (callback)
  - isOpen: boolean

Effects:
  - Calculate age when birthday changes
  - Update localStorage on success
  - Navigate to /chat on success

Events:
  - handleSaveProfile (submit form)
  - POST to /api/users/complete-profile
  - Check response.ok
  - Update localStorage
  - Call onProfileComplete()
  - Navigate


localStorage Sync
═════════════════════════════════════════════════════════

Before Login:
localStorage = {}

After Login (Callback):
localStorage = {
  token: "base64_encoded_session_token",
  authToken: "same_token",
  authProvider: "google",
  user: {
    id: "550e8400-...",
    email: "user@gmail.com",
    name: "John Doe",
    picture: "https://...",
    googleId: "1183653...",
    isProfileCompleted: false  ← KEY FLAG
  },
  userInfo: {...same as user...}
}

After Profile Setup:
localStorage = {
  ...same...
  user: {
    id: "550e8400-...",
    email: "user@gmail.com",
    name: "John Doe",
    picture: "https://...",
    googleId: "1183653...",
    isProfileCompleted: true  ← UPDATED
    birthday: "1990-01-15",   ← NEW
    gender: "male",            ← NEW
    age: 34                     ← NEW
  }
}

Database Sync:
users table
├─ Before: is_profile_completed = FALSE
└─ After: is_profile_completed = TRUE
          birthday = "1990-01-15"
          gender = "male"
          age = 34
```

## 🔄 Complete State Diagram

```
STATE TRANSITIONS
═════════════════════════════════════════════════════════

┌─ NOT_LOGGED_IN
│  (No user in localStorage)
│  │
│  ├─ User clicks "Sign in with Google"
│  │  │
│  │  ▼
│  │
│  └─ REDIRECTED_TO_GOOGLE
│     │
│     ├─ User authorizes app
│     │  │
│     │  ▼
│     │
│     └─ OAUTH_CALLBACK
│        │
│        ├─ Backend validates & saves user
│        │  │
│        │  ▼
│        │
│        └─ FRONTEND_CHECKS_PROFILE
│           │
│           ├─ Check isProfileCompleted
│           │
│           ├─ FALSE: PROFILE_INCOMPLETE ◄──────┐
│           │  │                                  │
│           │  ├─ User can see ProfileSetupModal │
│           │  │                                  │
│           │  ├─ User selects birthday & gender │
│           │  │  │                               │
│           │  │  ├─ Age < 18: REJECTED ────────┐│
│           │  │  │  │ User sees error message  ││
│           │  │  │  │ Save button disabled     ││
│           │  │  │  │ Cannot proceed          ││
│           │  │  │  │                         ││
│           │  │  │  └─ User must try again    ││
│           │  │  │     (Maybe different DOB)  ││
│           │  │  │                            ││
│           │  │  ├─ Age >= 18: POST request  ││
│           │  │  │  │ Backend validates      ││
│           │  │  │  │ Backend saves to DB    ││
│           │  │  │  │ Backend returns 200    ││
│           │  │  │  │                        ││
│           │  │  │  └─ UPDATE_PROFILE ◄──────┘│
│           │  │  │     │                       │
│           │  │  │     ├─ Update localStorage │
│           │  │  │     ├─ Set isProfile... = true
│           │  │  │     ├─ Save birthday/gender
│           │  │  │     ├─ Save age           │
│           │  │  │     │                      │
│           │  │  │     └─ NAVIGATE_TO_CHAT    │
│           │  │  │        │                   │
│           │  │  │        ▼                   │
│           │  │  │
│           │  └─ PROFILE_COMPLETE ──────────┐
│           │     │                           │
│           │     ├─ User redirected to /chat│
│           │     ├─ ProtectedChatRoute      │
│           │     │   ├─ Checks localStorage │
│           │     │   ├─ Verifies profile    │
│           │     │   └─ Shows Chat.jsx      │
│           │     │                          │
│           │     └─ IN_CHAT_ROOM ✅ Final state
│           │
│           └─ TRUE: PROFILE_COMPLETE (returning user)
│              │
│              ├─ Skip modal
│              ├─ Direct to /chat
│              └─ IN_CHAT_ROOM ✅ Final state
│
└─ IN_CHAT_ROOM ✅
   │
   ├─ User can use all chat features
   ├─ Birthday & gender locked in DB
   ├─ Can logout (goes back to NOT_LOGGED_IN)
   │
   └─ Next login (returning user):
      └─ Callback checks isProfileCompleted = TRUE
         └─ Skips modal
            └─ Directly to IN_CHAT_ROOM
```

---

**Last Updated**: December 5, 2025  
**Version**: 1.0  
**Status**: ✅ Complete
