# Code Changes - Exact Modifications Made

## 📄 File 1: `frontend/src/pages/Login.jsx`

### Change 1.1: Added Import
**Location**: Top of file after existing imports

```javascript
import TermsConfirmationModal from '../components/TermsConfirmationModal'
```

---

### Change 1.2: Added Helper Functions
**Location**: Before `GoogleCustomButton` component (after imports)

```javascript
// Helper function to check if terms are accepted
const isTermsAccepted = () => {
  try {
    const termsAccepted = localStorage.getItem('termsAccepted')
    return termsAccepted === 'true'
  } catch (error) {
    console.error('❌ Error checking terms acceptance:', error)
    return false
  }
}

// Helper function to mark terms as accepted
const acceptTerms = () => {
  try {
    localStorage.setItem('termsAccepted', 'true')
    console.log('✅ Terms accepted and saved to localStorage')
  } catch (error) {
    console.error('❌ Error saving terms acceptance:', error)
  }
}
```

---

### Change 1.3: Modified GoogleCustomButton
**Location**: In `GoogleCustomButton` component

**BEFORE**:
```javascript
const GoogleCustomButton = ({ isSigningIn }) => {
  const handleGoogleClick = () => {
    // Get backend URL from environment or use fallback
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    console.log('🔗 Redirecting to Google OAuth:', `${BACKEND_URL}/auth/google`)
    window.location.href = `${BACKEND_URL}/auth/google`
  }
  // ... rest of component
}
```

**AFTER**:
```javascript
const GoogleCustomButton = ({ isSigningIn, onShowTermsModal }) => {
  const handleGoogleClick = () => {
    console.log('🔐 Google login clicked - checking terms acceptance')
    
    // Check if terms are already accepted
    if (isTermsAccepted()) {
      console.log('✅ Terms already accepted - proceeding with Google login')
      triggerGoogleLogin()
    } else {
      console.log('⚠️ Terms not accepted - showing modal first')
      onShowTermsModal('google')
    }
  }

  const triggerGoogleLogin = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    console.log('🔗 Redirecting to Google OAuth:', `${BACKEND_URL}/auth/google`)
    window.location.href = `${BACKEND_URL}/auth/google`
  }
  // ... rest of component
}
```

---

### Change 1.4: Updated GoogleCustomButton Props
**Location**: In GoogleCustomButton JSX

**BEFORE**:
```javascript
<GoogleCustomButton 
  isSigningIn={isSigningIn}
/>
```

**AFTER**:
```javascript
<GoogleCustomButton 
  isSigningIn={isSigningIn}
  onShowTermsModal={handleShowTermsModal}
/>
```

---

### Change 1.5: Added State to Login Component
**Location**: Inside `const Login = () => {` function body, after other state declarations

```javascript
const [showTermsModal, setShowTermsModal] = useState(false)
const [pendingLoginProvider, setPendingLoginProvider] = useState(null)
```

---

### Change 1.6: Added New Handler Functions
**Location**: Inside `const Login = () => {` function body, after useEffect

```javascript
// Handle showing terms modal before login
const handleShowTermsModal = (provider) => {
  console.log(`📋 Showing Terms modal for ${provider}`)
  setPendingLoginProvider(provider)
  setShowTermsModal(true)
}

// Handle terms modal cancellation
const handleTermsCancel = () => {
  console.log('❌ User cancelled terms modal')
  setShowTermsModal(false)
  setPendingLoginProvider(null)
}

// Handle terms acceptance and trigger login
const handleTermsContinue = async () => {
  console.log('✅ User accepted terms')
  
  // Save consent to localStorage
  acceptTerms()
  
  // Close modal
  setShowTermsModal(false)
  
  // Trigger the pending login provider
  if (pendingLoginProvider === 'google') {
    console.log('🔐 Proceeding with Google login after terms acceptance')
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${BACKEND_URL}/auth/google`
  } else if (pendingLoginProvider === 'facebook') {
    console.log('🔐 Proceeding with Facebook login after terms acceptance')
    try {
      await signInWithFacebook()
    } catch (err) {
      console.error('❌ Facebook login error:', err)
      setError('Facebook login failed. Please try again.')
    }
  }
  
  setPendingLoginProvider(null)
}
```

---

### Change 1.7: Modified handleFacebookLogin
**Location**: Inside `const Login = () => {` function body

**BEFORE**:
```javascript
const handleFacebookLogin = async () => {
  setIsSigningIn(true)
  setError(null)
  try {
    console.log('📱 Starting Facebook login...')
    console.log('Facebook App ID:', import.meta.env.VITE_FACEBOOK_APP_ID)
    console.log('Redirect URL:', import.meta.env.VITE_FIREBASE_REDIRECT_URL)
    
    await signInWithFacebook()
  } catch (err) {
    console.error('❌ Facebook login error:', err)
    setError('Facebook login failed. Please try again.')
    setIsSigningIn(false)
  }
}
```

**AFTER**:
```javascript
const handleFacebookLogin = async () => {
  console.log('🔐 Facebook login clicked - checking terms acceptance')
  
  // Check if terms are already accepted
  if (isTermsAccepted()) {
    console.log('✅ Terms already accepted - proceeding with Facebook login')
    setIsSigningIn(true)
    setError(null)
    try {
      console.log('📱 Starting Facebook login...')
      console.log('Facebook App ID:', import.meta.env.VITE_FACEBOOK_APP_ID)
      console.log('Redirect URL:', import.meta.env.VITE_FIREBASE_REDIRECT_URL)
      
      await signInWithFacebook()
    } catch (err) {
      console.error('❌ Facebook login error:', err)
      setError('Facebook login failed. Please try again.')
      setIsSigningIn(false)
    }
  } else {
    console.log('⚠️ Terms not accepted - showing modal first')
    handleShowTermsModal('facebook')
  }
}
```

---

### Change 1.8: Added Modal to Return JSX
**Location**: At the very end of return statement, before closing </div>

```javascript
{/* Terms Confirmation Modal */}
{showTermsModal && (
  <TermsConfirmationModal
    onCancel={handleTermsCancel}
    onContinue={handleTermsContinue}
  />
)}
```

---

## 📄 File 2: `frontend/src/pages/Chat.jsx`

### Change 2.1: Added Import
**Location**: Top of file, with other imports

```javascript
import TermsConfirmationModal from '../components/TermsConfirmationModal'
```

---

### Change 2.2: Added State Variables
**Location**: Inside `const Chat = () => {` function body, at the very beginning (before all other state)

```javascript
// CRITICAL: Terms acceptance state
const [showTermsModal, setShowTermsModal] = useState(false)
const [termsCheckComplete, setTermsCheckComplete] = useState(false)

// Check terms acceptance when component mounts - MUST BE FIRST useEffect
useEffect(() => {
  console.log('🔐 [TERMS CHECK] Checking if terms are accepted...')
  
  try {
    const termsAccepted = localStorage.getItem('termsAccepted') === 'true'
    console.log('📋 [TERMS CHECK] termsAccepted from localStorage:', termsAccepted)
    
    if (!termsAccepted) {
      console.log('⚠️ [TERMS CHECK] User has not accepted terms - showing modal')
      setShowTermsModal(true)
    } else {
      console.log('✅ [TERMS CHECK] User has accepted terms - allowing access')
      setTermsCheckComplete(true)
    }
  } catch (error) {
    console.error('❌ [TERMS CHECK] Error checking terms:', error)
    // Allow access on error
    setTermsCheckComplete(true)
  }
}, [])

// Handle terms acceptance from modal on dashboard
const handleDashboardTermsAccept = () => {
  console.log('✅ User accepted terms on dashboard')
  localStorage.setItem('termsAccepted', 'true')
  setShowTermsModal(false)
  setTermsCheckComplete(true)
}

// Handle terms cancellation - redirect to login
const handleDashboardTermsCancel = () => {
  console.log('❌ User cancelled terms on dashboard - redirecting to login')
  setShowTermsModal(false)
  navigate('/login')
}

// If terms modal is shown and user hasn't completed check, don't render chat
if (showTermsModal || !termsCheckComplete) {
  return (
    <>
      {showTermsModal && (
        <TermsConfirmationModal
          onCancel={handleDashboardTermsCancel}
          onContinue={handleDashboardTermsAccept}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Loading...</p>
        </div>
      </div>
    </>
  )
}
```

---

## 🎯 Summary of Changes

### Login.jsx Changes:
- ✅ Added 1 import (TermsConfirmationModal)
- ✅ Added 2 helper functions (isTermsAccepted, acceptTerms)
- ✅ Modified GoogleCustomButton component (added terms check)
- ✅ Added 2 new state variables
- ✅ Added 3 new handler functions
- ✅ Modified handleFacebookLogin function
- ✅ Added Modal JSX rendering
- ✅ Updated GoogleCustomButton prop

### Chat.jsx Changes:
- ✅ Added 1 import (TermsConfirmationModal)
- ✅ Added 2 new state variables
- ✅ Added 1 useEffect (terms check on mount)
- ✅ Added 2 new handler functions
- ✅ Added conditional render (early return if terms not accepted)

---

## 📊 Total Lines Modified

| File | Type | Count |
|------|------|-------|
| Login.jsx | Imports | 1 |
| Login.jsx | Functions | 2 |
| Login.jsx | State vars | 2 |
| Login.jsx | Handlers | 3 |
| Login.jsx | Modified functions | 2 |
| Login.jsx | JSX additions | 1 |
| Chat.jsx | Imports | 1 |
| Chat.jsx | State vars | 2 |
| Chat.jsx | useEffect | 1 |
| Chat.jsx | Handlers | 2 |
| Chat.jsx | Conditional render | 1 |

---

## ✅ No Files Deleted

All existing functionality preserved. Only additions and modifications.

