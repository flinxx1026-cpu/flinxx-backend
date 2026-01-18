import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { getRedirectResult } from 'firebase/auth'
import { auth } from '../config/firebase'
import flinxxLogo from '../assets/flinxx-logo.svg'
import googleIcon from '../assets/google-icon.svg'
import { signInWithGoogle, signInWithFacebook } from '../config/firebase'
import TermsConfirmationModal from '../components/TermsConfirmationModal'
import './Login.css'

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

// Custom Google Login Button Component
const GoogleCustomButton = ({ isSigningIn, onShowTermsModal, onGoogleLogin }) => {
  const handleGoogleClick = () => {
    console.log('🔐 Google login clicked - checking terms acceptance')
    
    // Check if terms are already accepted
    if (isTermsAccepted()) {
      console.log('✅ Terms already accepted - proceeding with Google login')
      onGoogleLogin()
    } else {
      console.log('⚠️ Terms not accepted - showing modal first')
      onShowTermsModal('google')
    }
  }

  return (
    <button
      onClick={handleGoogleClick}
      disabled={isSigningIn}
      className="login-btn"
    >
      <img src={googleIcon} alt="Google" />
      Continue with Google
    </button>
  )
}

const Login = () => {
  const navigate = useNavigate()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState(null)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [pendingLoginProvider, setPendingLoginProvider] = useState(null)

  // ✅ Check for redirect login result when page loads
  // This handles cases where Firebase redirect login happened
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("✅ Redirect login success:", result.user.email);
          console.log("🔐 Firebase user authenticated, navigating to /chat");
          // Firebase persistence will handle auth state, just navigate
          navigate('/chat', { replace: true });
        }
      })
      .catch((error) => {
        console.error("❌ Redirect login error:", error.code, error.message);
        // Only show error if it's not a popup/redirect dismissal
        if (error.code !== 'auth/popup-closed-by-user' && 
            error.code !== 'auth/cancelled-popup-request') {
          setError(`Authentication error: ${error.message}`);
        }
      });
  }, [navigate]);

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
      setIsSigningIn(true)
      try {
        await signInWithGoogle()
      } catch (err) {
        console.error('❌ Google login error:', err)
        setError('Google login failed. Please try again.')
        setIsSigningIn(false)
      }
    } else if (pendingLoginProvider === 'facebook') {
      console.log('🔐 Proceeding with Facebook login after terms acceptance')
      setIsSigningIn(true)
      try {
        await signInWithFacebook()
      } catch (err) {
        console.error('❌ Facebook login error:', err)
        setError('Facebook login failed. Please try again.')
        setIsSigningIn(false)
      }
    }
    
    setPendingLoginProvider(null)
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsSigningIn(true)
    setError(null)
    try {
      console.log('📱 Google credential response received:', credentialResponse)
      
      // For custom button, we get the credential from the response
      const credential = credentialResponse.credential || credentialResponse.id_token
      
      // Check if credential exists
      if (!credential) {
        throw new Error('No credential received from Google')
      }

      // Decode the JWT credential from Google
      const decoded = jwtDecode(credential)
      console.log('🔐 Decoded Google JWT:', decoded)
      
      const googleUser = {
        name: decoded.name || 'User',
        email: decoded.email || '',
        picture: decoded.picture || null,
        googleId: decoded.sub || '',
        token: credential
      }
      
      console.log('✅ Extracted Google User Data:', googleUser)
      console.log('   - Name:', googleUser.name)
      console.log('   - Email:', googleUser.email)
      console.log('   - Picture:', googleUser.picture)
      console.log('   - GoogleID:', googleUser.googleId)
      
      // Save user to backend database
      const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://13.203.157.116:5000'
      console.log(`🔗 Saving user to backend at: ${API_URL}`)
      
      let userDataToStore = googleUser;
      
      try {
        const saveResponse = await fetch(`${API_URL}/api/users/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',  // ✅ Send cookies with request
          body: JSON.stringify({
            uid: decoded.sub,
            email: decoded.email,
            displayName: decoded.name || 'User',
            photoURL: decoded.picture || null,
            authProvider: 'google'
          })
        })

        if (!saveResponse.ok) {
          const errorText = await saveResponse.text()
          throw new Error(`Failed to save user: ${saveResponse.status} - ${errorText}`)
        }

        const dbResponse = await saveResponse.json()
        console.log('✅ User saved to backend:', dbResponse.user)
        
        // CRITICAL: Create CLEAN user object with ONLY needed fields
        if (dbResponse.user) {
          userDataToStore = {
            uuid: dbResponse.user.uuid,
            name: dbResponse.user.name || googleUser.name || 'User',
            email: dbResponse.user.email || googleUser.email,
            picture: dbResponse.user.picture || googleUser.picture,
            profileCompleted: dbResponse.user.profileCompleted || false,
            token: googleUser.token
          }
          console.log('[LOGIN] 🎯 Cleaned user data with profile status:', {
            profileCompleted: userDataToStore.profileCompleted,
            uuid: userDataToStore.uuid.substring(0, 8) + '...'
          })
        }
      } catch (dbError) {
        console.error('⚠️ Error saving user to backend:', dbError)
        // Continue anyway - data is in localStorage
        console.log('[LOGIN] ⚠️ Using Google JWT data only (profile status unavailable)')
      }
      
      // Save user profile to localStorage
      console.log('[LOGIN] 🔥 SAVING TOKEN AND USER TO LOCALSTORAGE');
      console.log('[LOGIN] Token to save:', userDataToStore.token ? userDataToStore.token.substring(0, 20) + '...' : 'MISSING');
      
      // 🔥 MANDATORY: Save token with standard keys
      localStorage.setItem('token', userDataToStore.token || credential)
      localStorage.setItem('authToken', userDataToStore.token || credential)
      console.log('✅ [LOGIN] Token saved to localStorage');
      
      // ✅ CLEAN USER: Create CLEAN object with ONLY needed fields
      const cleanUser = {
        uuid: userDataToStore.uuid,
        name: userDataToStore.name || 'User',
        email: userDataToStore.email,
        picture: userDataToStore.picture,
        profileCompleted: userDataToStore.profileCompleted || false
      }
      
      // Save CLEAN user profile
      localStorage.setItem('user', JSON.stringify(cleanUser))
      localStorage.setItem('authProvider', 'google')
      localStorage.setItem('userInfo', JSON.stringify(cleanUser))
      console.log('✅ [LOGIN] CLEAN user data stored in localStorage with profileCompleted status')
      
      // 🔥 VERIFICATION
      console.log('🔥 [LOGIN] VERIFICATION - Check localStorage:');
      console.log('   - token:', localStorage.getItem('token') ? '✓ FOUND' : '✗ MISSING');
      console.log('   - authToken:', localStorage.getItem('authToken') ? '✓ FOUND' : '✗ MISSING');
      console.log('   - user:', localStorage.getItem('user') ? '✓ FOUND' : '✗ MISSING');
      console.log('   - authProvider:', localStorage.getItem('authProvider'));
      
      // Redirect to chat after a brief delay
      setTimeout(() => {
        setIsSigningIn(false)
        navigate('/chat')
      }, 1000)
    } catch (err) {
      console.error('❌ Google login error:', err)
      setError(`Google login failed: ${err.message}`)
      setIsSigningIn(false)
    }
  }

  const handleGoogleLoginError = () => {
    console.log('❌ Google Login Failed')
    setError('Google login failed. Please try again.')
    setIsSigningIn(false)
  }

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
        // Note: signInWithFacebook uses redirect, so page will reload after authentication
        // The checkRedirectResult in useEffect will handle the response
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

  return (
    <div className="login-page-wrapper">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="w-full rounded-3xl p-10 sm:p-12 mb-9 text-center bg-surface gold-border shadow-gold backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-shimmer opacity-30 pointer-events-none"></div>
        <h1 className="text-4xl sm:text-4xl font-bold mb-3 tracking-tight text-gradient-gold drop-shadow-sm">
          Welcome to Flinxx
        </h1>
        <p className="text-gray-300 text-lg font-normal mb-2 tracking-wide">
          Connect with strangers instantly
        </p>
        <p className="text-gold-200/60 text-xs font-medium uppercase tracking-widest mb-0">
          Sign up to get started
        </p>
      </div>

      <div className="w-full space-y-4 mb-11">
        {/* Google Login Button */}
        <button
          type="button"
          onClick={async () => {
            console.log('🔐 Google login clicked - checking terms acceptance')
            if (isTermsAccepted()) {
              console.log('✅ Terms already accepted - proceeding with Google login')
              setIsSigningIn(true)
              try {
                await signInWithGoogle()
              } catch (err) {
                console.error('❌ Google login error:', err?.message || err)
                setError(err?.message || 'Google login failed. Please try again.')
                setIsSigningIn(false)
              }
            } else {
              console.log('⚠️ Terms not accepted - showing modal first')
              handleShowTermsModal('google')
            }
          }}
          disabled={isSigningIn}
          className="w-full group relative flex items-center justify-center bg-[#0F0F0F] hover:bg-[#141414] text-white font-semibold py-4 px-7 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 gold-border hover:border-gold-400/60 hover:shadow-gold-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="absolute left-7 flex items-center opacity-90 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
          </span>
          <span className="pl-2 tracking-wide">Continue with Google</span>
        </button>

        {/* Facebook Login Button */}
        <button
          type="button"
          onClick={async () => {
            console.log('🔐 Facebook login clicked - checking terms acceptance')
            if (isTermsAccepted()) {
              console.log('✅ Terms already accepted - proceeding with Facebook login')
              setIsSigningIn(true)
              try {
                await signInWithFacebook()
              } catch (err) {
                console.error('❌ Facebook login error:', err?.message || err)
                setError(err?.message || 'Facebook login failed. Please try again.')
                setIsSigningIn(false)
              }
            } else {
              console.log('⚠️ Terms not accepted - showing modal first')
              handleShowTermsModal('facebook')
            }
          }}
          disabled={isSigningIn}
          className="w-full group relative flex items-center justify-center bg-[#0F0F0F] hover:bg-[#141414] text-white font-semibold py-4 px-7 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 gold-border hover:border-gold-400/60 hover:shadow-gold-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="absolute left-7 flex items-center text-[#1877F2] group-hover:text-white transition-colors duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </span>
          <span className="pl-2 tracking-wide">Continue with Facebook</span>
        </button>
      </div>

      <p className="text-xs text-center text-gray-500 mb-11 max-w-xs mx-auto leading-relaxed">
        By signing in, you agree to our 
        <a href="/terms" className="text-gold-400 hover:text-white transition-colors underline decoration-gold-400/30 underline-offset-4"> Terms &amp; Conditions</a> and 
        <a href="/privacy-policy" className="text-gold-400 hover:text-white transition-colors underline decoration-gold-400/30 underline-offset-4"> Privacy Policy</a>
      </p>

      <div className="space-y-4 flex flex-col items-start w-full max-w-xs mx-auto text-sm text-gray-300 font-medium">
        <div className="flex items-center space-x-4 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold-400/10 gold-border-subtle group-hover:border-gold-400/40 group-hover:bg-gold-400/20 transition-all duration-300 flex-shrink-0">
            <span className="material-icons-round text-gold-400 text-sm">bolt</span>
          </span>
          <span className="group-hover:text-white transition-colors">Fast connection</span>
        </div>
        <div className="flex items-center space-x-4 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold-400/10 gold-border-subtle group-hover:border-gold-400/40 group-hover:bg-gold-400/20 transition-all duration-300 flex-shrink-0">
            <span className="material-icons-round text-gold-400 text-sm">auto_awesome</span>
          </span>
          <span className="group-hover:text-white transition-colors">Clean &amp; modern design</span>
        </div>
        <div className="flex items-center space-x-4 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold-400/10 gold-border-subtle group-hover:border-gold-400/40 group-hover:bg-gold-400/20 transition-all duration-300 flex-shrink-0">
            <span className="material-icons-round text-gold-400 text-sm">person</span>
          </span>
          <span className="group-hover:text-white transition-colors">Smart matching with real users</span>
        </div>
      </div>

      {/* Terms Confirmation Modal */}
      {showTermsModal && (
        <TermsConfirmationModal
          onCancel={handleTermsCancel}
          onContinue={handleTermsContinue}
        />
      )}
      </div>
    </div>
  )
}

export default Login
