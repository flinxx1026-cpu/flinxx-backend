import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration for Flinxx project
const firebaseConfig = {
  apiKey: "AIzaSyCIqpOl5nT3VH149xISPqyLgkjyIiMWPb8",
  authDomain: "flinx-8a05e.firebaseapp.com",
  projectId: "flinx-8a05e",
  storageBucket: "flinx-8a05e.firebasestorage.app",
  messagingSenderId: "977393893446",
  appId: "1:977393893446:web:308db5f232f7c5558cca47",
  measurementId: "G-N0LW13KMNJ"
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Initialize Analytics (optional - works only in production with HTTPS)
let analytics
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.log('Analytics initialization skipped (local development)')
  }
}

// Initialize Firebase Authentication
export const auth = getAuth(app)

// ✅ SET FIREBASE PERSISTENCE - MOST IMPORTANT!
// This ensures user stays logged in after page reload
setPersistence(auth, browserLocalPersistence)
  .then(() => {

  })
  .catch((err) => {
    console.error("❌ Firebase persistence error:", err);
  });

// Initialize Firestore Database
export const db = getFirestore(app)

// Create Google Auth Provider with your OAuth Client ID
export const googleProvider = new GoogleAuthProvider()
// Set proper scopes for Google - include profile, email, and openid
googleProvider.addScope('profile')
googleProvider.addScope('email')
googleProvider.addScope('openid')

// Create Facebook Auth Provider with App ID and permissions
export const facebookProvider = new FacebookAuthProvider()

// Configure Facebook Provider with App ID from environment
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '863917229498555'
// NOTE: Facebook App Secret must NEVER be in frontend code — it belongs on the backend only




// Set Facebook custom parameters for OAuth
facebookProvider.setCustomParameters({
  app_id: facebookAppId,
  display: 'popup',
  auth_type: 'rerequest',
  scope: 'public_profile,email'
})

// Add required Facebook permissions
facebookProvider.addScope('public_profile')
facebookProvider.addScope('email')





// Google Sign-In function - try popup first, fallback to redirect
export const signInWithGoogle = async () => {
  try {

    // Try popup first - better UX if it works
    const result = await signInWithPopup(auth, googleProvider)

    const provider = result.user.providerData[0]?.providerId
    let providerName = 'google'
    if (provider === 'google.com') {
      providerName = 'google'
    }
    
    const userResult = await handleLoginSuccess(result.user, providerName)

    return userResult
  } catch (popupError) {

    try {

      // Fallback to redirect if popup fails
      // 🔥 CRITICAL: Set a flag to trigger redirect after page reloads
      sessionStorage.setItem('pendingRedirectAfterAuth', 'true')

      await signInWithRedirect(auth, googleProvider)
      // Note: This will redirect/reload, so code after this won't execute immediately
      return null
    } catch (redirectError) {
      console.error('❌ Google login failed:', redirectError)
      sessionStorage.removeItem('pendingRedirectAfterAuth')
      throw redirectError
    }
  }
}

// Handle successful login from both Google and Facebook
const handleLoginSuccess = async (user, provider) => {

  // 🔥 STEP 1: Get Firebase ID token
  let firebaseIdToken = null
  try {
    firebaseIdToken = await user.getIdToken()

  } catch (tokenError) {
    console.error('❌ Failed to get Firebase ID token:', tokenError)
    throw new Error('Could not get Firebase ID token')
  }
  
  // 🔥 STEP 2: Send Firebase ID token to backend to get JWT

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  
  let backendJWT = null
  let userInfo = null
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseIdToken}`
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Backend auth failed: ${response.status} - ${errorText}`)
    }
    
    const authResponse = await response.json()

    backendJWT = authResponse.token
    userInfo = authResponse.user
    
    if (!backendJWT) {
      throw new Error('No JWT token returned from backend')
    }
    

  } catch (authError) {
    console.error('❌ Failed to authenticate with backend:', authError)
    throw authError
  }
  
  // 🔥 STEP 3: Save backend JWT to localStorage

  localStorage.setItem('token', backendJWT)
  localStorage.setItem('authToken', backendJWT)
  localStorage.setItem('idToken', firebaseIdToken)

  // 🔥 STEP 4: Save user info to localStorage
  const userToStore = {
    uid: user.uid,
    email: user.email,
    name: user.displayName || 'User',
    picture: user.photoURL || null,
    authProvider: provider,
    ...(userInfo && {
      uuid: userInfo.uuid,
      id: userInfo.id,
      profileCompleted: userInfo.profileCompleted
    })
  }
  
  localStorage.setItem('user', JSON.stringify(userToStore))
  localStorage.setItem('authProvider', provider)
  localStorage.setItem('userInfo', JSON.stringify(userToStore))

  // 🔥 STEP 5: Save to Firestore (optional)
  try {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      authProvider: provider,
      lastLogin: new Date().toISOString()
    }, { merge: true })

  } catch (firestoreError) {
    console.warn('⚠️ Firestore save failed (non-critical):', firestoreError)
  }
  
  return userToStore
}

// Facebook Sign-In function - try popup first, fallback to redirect
export const signInWithFacebook = async () => {
  try {

    // Try popup first - better UX if it works
    const result = await signInWithPopup(auth, facebookProvider)

    const provider = result.user.providerData[0]?.providerId
    let providerName = 'facebook'
    if (provider === 'facebook.com') {
      providerName = 'facebook'
    }
    
    const userResult = await handleLoginSuccess(result.user, providerName)

    return userResult
  } catch (popupError) {

    try {

      // Fallback to redirect if popup fails
      // 🔥 CRITICAL: Set a flag to trigger redirect after page reloads
      sessionStorage.setItem('pendingRedirectAfterAuth', 'true')

      await signInWithRedirect(auth, facebookProvider)
      // Note: This will redirect/reload, so code after this won't execute immediately
      return null
    } catch (redirectError) {
      console.error('❌ Facebook login failed:', redirectError)
      sessionStorage.removeItem('pendingRedirectAfterAuth')
      throw redirectError
    }
  }
}

// Redirect result handler - call this when component mounts to check for redirect login
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (result?.user) {

      const provider = result.user.providerData[0]?.providerId

      // Extract provider name (google.com, facebook.com, etc.)
      let providerName = 'unknown'
      if (provider === 'google.com') {
        providerName = 'google'
      } else if (provider === 'facebook.com') {
        providerName = 'facebook'
      }
      
      return handleLoginSuccess(result.user, providerName)
    }
  } catch (error) {
    console.error('Redirect result error:', error)
    // Handle specific error codes
    if (error.code === 'auth/account-exists-with-different-credential') {
      console.error('Account exists with different credential')
    } else if (error.code === 'auth/auth-domain-config-required') {
      console.error('Auth domain config required')
    }
  }
  return null
}

// Sign out function
export const signOutUser = async () => {
  try {
    await auth.signOut()
    localStorage.removeItem('authToken')
    localStorage.removeItem('authProvider')
    localStorage.removeItem('userInfo')
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Get current user
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

export default app
