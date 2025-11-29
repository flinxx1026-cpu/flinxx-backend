# Guest Mode Restrictions Implementation

## Overview
Implemented strict guest mode limitations to prevent fake accounts and encourage real authentication with Google or Facebook.

## Features Implemented

### 1. **One-Time Use Restriction**
- **localStorage Flag**: `guest_used` flag is set to `'true'` when guest mode is first used
- **Reuse Prevention**: If user attempts to click "Continue as Guest" again, modal appears
- **Persistent**: Flag persists across browser sessions via localStorage

### 2. **2-Minute Session Timeout**
- **Session Creation**: When guest clicks login, stores `guestSession` object with:
  - `startTime`: current timestamp
  - `expiresAt`: current time + 2 minutes (120,000 ms)
  - User data (uid, displayName, etc.)

- **Timeout Mechanism**: Interval timer checks every 5 seconds if session expired
  - Runs in Auth.jsx (before redirect) via `startGuestSessionTimer()`
  - Continues monitoring in Chat.jsx during active session

### 3. **Automatic Forced Login Popup**
- **On Timeout (Auth Page)**: Shows modal forcing choice between Google or Facebook
  - Modal cannot be dismissed
  - No "skip" or "close" option
  - Requires authentication to proceed

- **On Timeout (Chat Page)**: Redirects to /auth with timeout modal
  - Session data automatically cleared
  - 2-second loading state before redirect
  - Shows informative message

## Code Structure

### Auth.jsx Changes
```jsx
// New state for guest modals
const [showGuestTimeoutModal, setShowGuestTimeoutModal] = useState(false)
const [showGuestReuseModal, setShowGuestReuseModal] = useState(false)
const guestTimerRef = useRef(null)

// Enhanced handleGuestLogin()
const handleGuestLogin = async () => {
  // Check if guest_used flag exists
  if (localStorage.getItem('guest_used') === 'true') {
    setShowGuestReuseModal(true)
    return
  }

  // Set flag to prevent reuse
  localStorage.setItem('guest_used', 'true')
  
  // Create session with expiresAt timestamp
  const guestSessionData = {
    ...userData,
    startTime: Date.now(),
    expiresAt: Date.now() + (2 * 60 * 1000) // 2 minutes
  }
  
  // Start timer monitoring
  startGuestSessionTimer()
}

// Timer monitoring function
const startGuestSessionTimer = () => {
  guestTimerRef.current = setInterval(() => {
    const session = JSON.parse(localStorage.getItem('guestSession'))
    if (Date.now() >= session.expiresAt) {
      // Clear session data
      // Show timeout modal
      navigate('/auth')
    }
  }, 5000)
}
```

### Chat.jsx Changes
```jsx
// Monitor guest session on mount
useEffect(() => {
  if (user?.authProvider !== 'guest') return
  
  guestSessionTimerRef.current = setInterval(() => {
    const session = JSON.parse(localStorage.getItem('guestSession'))
    if (Date.now() >= session.expiresAt) {
      // Clear session and redirect
      setShowGuestTimeoutModal(true)
      navigate('/auth')
    }
  }, 5000)
}, [user, navigate])
```

## localStorage Structure

### New Keys Added:
```javascript
{
  'guest_used': 'true',           // Prevents reuse
  'guestSession': {
    uid: 'guest_RANDOM_ID',
    email: 'guest@flinxx.com',
    displayName: 'Guest User',
    photoURL: null,
    authProvider: 'guest',
    startTime: 1234567890,        // When session started
    expiresAt: 1234568010         // When session expires
  }
}
```

## User Experience Flow

### First-Time Guest Access
1. User clicks "Continue as Guest"
2. System sets `guest_used = true`
3. Creates `guestSession` with 2-minute expiration
4. Redirects to /chat
5. Timer starts monitoring

### 2-Minute Countdown
- Guest can use the app freely for 2 minutes
- No countdown display (silent timeout)
- Timer checks every 5 seconds

### When 2 Minutes Expire
**If on Auth page:**
- Timeout modal appears
- "Time's Up!" message shown
- Forced choice: Google or Facebook login only
- No dismiss option

**If on Chat page:**
- Timeout modal appears briefly
- Session data cleared
- Redirects to /auth after 2 seconds
- Modal shows loading spinner

### Second Login Attempt
1. User tries "Continue as Guest" again
2. System checks `guest_used` flag
3. Reuse modal appears
4. Shows: "Guest preview already used"
5. Forces Google or Facebook login
6. Can click "Go Back" to dismiss this modal only

## Modals Created

### 1. Guest Timeout Modal (`showGuestTimeoutModal`)
- Appears when 2-minute session expires
- Title: "⏱️ Time's Up!"
- Shows loading spinner
- Two forced login buttons (no close option)
- Auto-redirects if on Chat page

### 2. Guest Reuse Modal (`showGuestReuseModal`)
- Appears when user tries guest again
- Title: "🔒 Guest Preview Used"
- Explains guest preview already used
- Two login button options
- "Go Back" button to return to login screen
- Can be dismissed via Go Back

## Technical Details

### Timer Interval
- Checks every **5 seconds** (configurable via `5000` ms)
- Trade-off between accuracy and performance
- Low CPU impact (simple localStorage check)

### Session Validation
- Uses `Date.now()` for accuracy
- Stores both `startTime` and `expiresAt` for debugging
- Gracefully handles missing data

### Cleanup
- Clears interval on component unmount
- Removes all session data when expired
- Resets localStorage flags only on timeout (not logout)

## Configuration

### To Adjust Timeout Duration
Edit in `Auth.jsx` line ~103:
```javascript
expiresAt: new Date().getTime() + (2 * 60 * 1000) // Change 2 to desired minutes
```

### To Adjust Check Frequency
Edit in `Auth.jsx` line ~129 and `Chat.jsx` line ~55:
```javascript
}, 5000) // Change 5000 to desired milliseconds
```

## Security Considerations

### localStorage Limitations
- ✅ Prevents reuse on same browser/profile
- ✅ Persistent across sessions
- ❌ Can be cleared by user manually
- ❌ Different browser = new guest access

### Improvement Options
1. **Server-side Tracking**: Store guest IPs/fingerprints on backend
2. **Device ID**: Use device fingerprinting library
3. **Email Verification**: Require email for second guest attempt
4. **Rate Limiting**: Backend IP-based rate limiting

## Testing Checklist

- [ ] Click "Continue as Guest" first time → works
- [ ] Wait 2 minutes in chat → timeout modal appears
- [ ] Click timeout modal → forced to Google/Facebook login
- [ ] Clear localStorage and try guest again → reuse modal appears
- [ ] Click reuse modal login buttons → redirects correctly
- [ ] Click "Go Back" on reuse modal → returns to login
- [ ] Refresh page during guest session → still in chat
- [ ] Guest session expires mid-chat → sees timeout modal
- [ ] Navigate away from chat → session still expires on return

## Files Modified

1. **`src/pages/Auth.jsx`**
   - Added guest timeout logic
   - Added 2 modal components
   - Enhanced handleGuestLogin()
   - Added startGuestSessionTimer()

2. **`src/pages/Chat.jsx`**
   - Added guest session monitoring
   - Added timeout modal display
   - Added useEffect for session monitoring

## Future Enhancements

- [ ] Add countdown timer display in chat
- [ ] Server-side guest tracking
- [ ] Analytics for guest conversion rates
- [ ] A/B test different timeout durations
- [ ] Add guest feature preview tooltip
- [ ] Device fingerprinting for stronger one-time use

---
**Status**: ✅ Implementation Complete
**Deployment**: Ready for testing
