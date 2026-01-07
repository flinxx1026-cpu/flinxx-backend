import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import flinxxLogo from '../assets/flinxx-logo.svg'
import googleIcon from '../assets/google-icon.svg'
import { signInWithGoogle, signInWithFacebook, checkRedirectResult } from '../config/firebase'
import TermsConfirmationModal from '../components/TermsConfirmationModal'

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
      className={`w-full py-2.5 md:py-3 px-8 md:px-10 rounded-2xl md:rounded-3xl transition-all text-base md:text-lg font-semibold flex items-center justify-center gap-3 ${
        isSigningIn
          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
          : 'bg-white hover:bg-gray-50 text-black shadow-lg hover:shadow-xl transform hover:scale-105'
      }`}
    >
      <img src={googleIcon} alt="Google" className="w-5 h-5 md:w-6 md:h-6" />
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Main Container */}
        <div className="text-center">
          {/* Logo Section */}
          <div className="mb-8 md:mb-10">
            <img src={flinxxLogo} alt="Flinxx" className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome to Flinxx</h1>
            <p className="text-sm md:text-base text-white/70">Connect with strangers instantly</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 md:p-4 bg-red-500/20 border border-red-500/50 rounded-2xl md:rounded-3xl">
              <p className="text-red-200 text-xs md:text-sm">{error}</p>
            </div>
          )}

          {/* Authentication Buttons */}
          <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
            {/* Signing In Button (when loading) */}
            {isSigningIn && (
              <button
                disabled
                className="w-full bg-gray-600 cursor-not-allowed text-gray-300 font-semibold py-2.5 md:py-3 px-8 md:px-10 rounded-2xl md:rounded-3xl transition-all text-base md:text-lg flex items-center justify-center gap-2"
              >
                <span className="animate-spin">⟳</span> Signing in...
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
                className="w-full py-2.5 md:py-3 px-8 md:px-10 rounded-2xl md:rounded-3xl transition-all text-base md:text-lg font-semibold flex items-center justify-center gap-3 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            )}
          </div>

          {/* Features */}
          <div className="mb-8 md:mb-10 space-y-3 md:space-y-4">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
              </svg>
              <span className="text-sm md:text-base text-white/80">Instant connection with strangers</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1"/><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22z"/>
              </svg>
              <span className="text-sm md:text-base text-white/80">100% Anonymous & Safe</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <span className="text-sm md:text-base text-white/80">High-quality Video Chat</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="text-center text-xs md:text-sm">
            <p className="text-white/70 mb-2">
              By signing in, you agree to our
            </p>
            <p>
              <a
                href="/terms"
                className="text-[#D4AF37] hover:text-[#E3C55D] underline transition-colors font-semibold"
                onClick={(e) => { e.preventDefault(); window.location.href = '/terms'; }}
              >
                Terms & Conditions
              </a>
              <span className="text-white/70"> and </span>
              <a
                href="/privacy-policy"
                className="text-[#D4AF37] hover:text-[#E3C55D] underline transition-colors font-semibold"
                onClick={(e) => { e.preventDefault(); window.location.href = '/privacy-policy'; }}
              >
                Privacy Policy
              </a>
            </p>
          </div>
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
  )
}

export default Login
