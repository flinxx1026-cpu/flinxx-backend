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
    console.log("✅ Firebase persistence set to LOCAL - user will stay logged in after reload");
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
const facebookAppSecret = import.meta.env.VITE_FACEBOOK_APP_SECRET || '9fd35a96cf11e8f070cc856e3625494e'

console.log('🔧 Configuring Facebook Auth Provider:')
console.log('   - App ID:', facebookAppId)
console.log('   - Redirect URL:', import.meta.env.VITE_FIREBASE_REDIRECT_URL)

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

console.log('✅ Facebook Auth Provider initialized with:')
console.log('   - Public Profile scope: ✓')
console.log('   - Email scope: ✓')
console.log('   - Web OAuth redirect enabled: ✓')

// Google Sign-In function - try popup first, fallback to redirect
export const signInWithGoogle = async () => {
  try {
    console.log('📱 Starting Google login via popup...')
    // Try popup first - better UX if it works
    const result = await signInWithPopup(auth, googleProvider)
    console.log('✅ Google popup login successful:', result.user.email)
    
    const provider = result.user.providerData[0]?.providerId
    let providerName = 'google'
    if (provider === 'google.com') {
      providerName = 'google'
    }
    
    return handleLoginSuccess(result.user, providerName)
  } catch (popupError) {
    console.warn('⚠️ Google popup login failed, trying redirect method:', popupError.code)
    
    try {
      console.log('📱 Starting Google login via redirect...')
      // Fallback to redirect if popup fails
      await signInWithRedirect(auth, googleProvider)
      // Note: This will redirect, so code after this won't execute immediately
      return null
    } catch (redirectError) {
      console.error('❌ Google login failed:', redirectError)
      throw redirectError
    }
  }
}

// Handle successful login from both Google and Facebook
const handleLoginSuccess = async (user, provider) => {
  console.log(`📝 Processing ${provider} login for user:`, user.email)
  
  // 🔥 STEP 1: Get Firebase ID token
  let firebaseIdToken = null
  try {
    firebaseIdToken = await user.getIdToken()
    console.log('✅ Firebase ID token obtained')
  } catch (tokenError) {
    console.error('❌ Failed to get Firebase ID token:', tokenError)
    throw new Error('Could not get Firebase ID token')
  }
  
  // 🔥 STEP 2: Send Firebase ID token to backend to get JWT
  console.log('📡 Sending Firebase ID token to backend...')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
  
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
    console.log('✅ Backend authentication successful')
    
    backendJWT = authResponse.token
    userInfo = authResponse.user
    
    if (!backendJWT) {
      throw new Error('No JWT token returned from backend')
    }
    
    console.log('🔐 Backend JWT obtained, user:', userInfo?.email)
  } catch (authError) {
    console.error('❌ Failed to authenticate with backend:', authError)
    throw authError
  }
  
  // 🔥 STEP 3: Save backend JWT to localStorage
  console.log('💾 Saving backend JWT to localStorage...')
  localStorage.setItem('token', backendJWT)
  localStorage.setItem('authToken', backendJWT)
  localStorage.setItem('idToken', firebaseIdToken)
  console.log('✅ JWT and Firebase ID token saved')
  
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
  console.log('✅ User info saved to localStorage')
  
  // 🔥 STEP 5: Save to Firestore (optional)
  try {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      authProvider: provider,
      lastLogin: new Date().toISOString()
    }, { merge: true })
    console.log('✅ User saved to Firestore')
  } catch (firestoreError) {
    console.warn('⚠️ Firestore save failed (non-critical):', firestoreError)
  }
  
  return userToStore
}

// Facebook Sign-In function - try popup first, fallback to redirect
export const signInWithFacebook = async () => {
  try {
    console.log('📱 Starting Facebook login via popup...')
    // Try popup first - better UX if it works
    const result = await signInWithPopup(auth, facebookProvider)
    console.log('✅ Facebook popup login successful:', result.user.email)
    
    const provider = result.user.providerData[0]?.providerId
    let providerName = 'facebook'
    if (provider === 'facebook.com') {
      providerName = 'facebook'
    }
    
    return handleLoginSuccess(result.user, providerName)
  } catch (popupError) {
    console.warn('⚠️ Facebook popup login failed, trying redirect method:', popupError.code)
    
    try {
      console.log('📱 Starting Facebook login via redirect...')
      // Fallback to redirect if popup fails
      await signInWithRedirect(auth, facebookProvider)
      // Note: This will redirect, so code after this won't execute immediately
      return null
    } catch (redirectError) {
      console.error('❌ Facebook login failed:', redirectError)
      throw redirectError
    }
  }
}

// Redirect result handler - call this when component mounts to check for redirect login
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (result?.user) {
      console.log('✅ Redirect login successful:', result.user.email)
      const provider = result.user.providerData[0]?.providerId
      console.log('Provider:', provider)
      
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
