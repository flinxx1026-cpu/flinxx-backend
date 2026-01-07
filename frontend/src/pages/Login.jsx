import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import flinxxLogo from '../assets/flinxx-logo.svg'
import googleIcon from '../assets/google-icon.svg'
import { signInWithGoogle, signInWithFacebook, checkRedirectResult } from '../config/firebase'
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

  useEffect(() => {
    // Check if user was redirected back from OAuth
    const checkLogin = async () => {
      try {
        const result = await checkRedirectResult()
        if (result) {
          console.log('✅ Login successful:', result.email)
          navigate('/chat')
        }
      } catch (err) {
        console.error('❌ Login check failed:', err)
      }
    }
    
    checkLogin()
  }, [navigate])

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
      const API_URL = import.meta.env.VITE_API_URL || 'https://flinxx-backend.onrender.com'
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
        
        // CRITICAL: Merge database response with googleUser to get profileCompleted status
        if (dbResponse.user) {
          userDataToStore = {
            ...googleUser,
            ...dbResponse.user,
            // Ensure both field names are present for compatibility
            id: dbResponse.user.id,
            uuid: dbResponse.user.uuid,
            profileCompleted: dbResponse.user.profileCompleted,
            isProfileCompleted: dbResponse.user.profileCompleted
          }
          console.log('[LOGIN] 🎯 Merged user data with profile status:', {
            profileCompleted: userDataToStore.profileCompleted,
            isProfileCompleted: userDataToStore.isProfileCompleted,
            uuid: userDataToStore.uuid
          })
        }
      } catch (dbError) {
        console.error('⚠️ Error saving user to backend:', dbError)
        // Continue anyway - data is in localStorage
        console.log('[LOGIN] ⚠️ Using Google JWT data only (profile status unavailable)')
      }
      
      // Save user profile to localStorage
      console.log('[LOGIN] Storing user to localStorage:', userDataToStore)
      localStorage.setItem('user', JSON.stringify(userDataToStore))
      localStorage.setItem('authProvider', 'google')
      localStorage.setItem('userInfo', JSON.stringify(userDataToStore))
      console.log('✅ User data stored in localStorage with profileCompleted status')
      
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
    <div className="login-container">
      {/* Card Section */}
      <div className="login-card">
        <h1>Welcome to <span>Flinxx</span></h1>
        <p className="login-subtitle">Connect with strangers instantly</p>
        <p className="login-signup">SIGN UP TO GET STARTED</p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="login-error">{error}</p>
      )}

      {/* Signing In Button */}
      {isSigningIn && (
        <button
          disabled
          className="login-btn"
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        >
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Signing in...
        </button>
      )}

      {/* Google Login Button */}
      {!isSigningIn && (
        <GoogleCustomButton 
          isSigningIn={isSigningIn}
          onShowTermsModal={handleShowTermsModal}
        />
      )}

      {/* Facebook Login Button */}
      {!isSigningIn && (
        <button
          onClick={handleFacebookLogin}
          disabled={isSigningIn}
          className="login-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Facebook
        </button>
      )}

      {/* Terms & Conditions */}
      <p className="login-terms">
        By signing in, you agree to our
        <span onClick={(e) => { e.preventDefault(); window.location.href = '/terms'; }}> Terms & Conditions</span> and
        <span onClick={(e) => { e.preventDefault(); window.location.href = '/privacy-policy'; }}> Privacy Policy</span>
      </p>

      {/* Features */}
      <div className="login-features">
        <div>⚡ Fast connection</div>
        <div>✨ Clean & modern design</div>
        <div>👤 Smart matching with real users</div>
      </div>

      {/* Terms Confirmation Modal */}
      {showTermsModal && (
        <TermsConfirmationModal
          onCancel={handleTermsCancel}
          onContinue={handleTermsContinue}
        />
      )}
    </div>
  )
}

export default Login
