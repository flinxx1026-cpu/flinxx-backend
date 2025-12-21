import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import flinxxLogo from '../assets/flinxx-logo.svg'
import googleIcon from '../assets/google-icon.svg'
import { signInWithGoogle, signInWithFacebook, checkRedirectResult } from '../config/firebase'

// Custom Google Login Button Component
const GoogleCustomButton = ({ isSigningIn }) => {
  const handleGoogleClick = () => {
    // Get backend URL from environment or use fallback
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    console.log('🔗 Redirecting to Google OAuth:', `${BACKEND_URL}/auth/google`)
    window.location.href = `${BACKEND_URL}/auth/google`
  }

  return (
    <button
      onClick={handleGoogleClick}
      disabled={isSigningIn}
      className={`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${
        isSigningIn
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-white hover:bg-gray-50 text-black shadow-lg hover:shadow-xl transform hover:scale-105'
      }`}
    >
      <img src={googleIcon} alt="Google" className="w-6 h-6" />
      Continue with Google
    </button>
  )
}

const Login = () => {
  const navigate = useNavigate()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState(null)

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
            profileCompleted: dbResponse.user.profileCompleted,
            isProfileCompleted: dbResponse.user.profileCompleted
          }
          console.log('[LOGIN] 🎯 Merged user data with profile status:', {
            profileCompleted: userDataToStore.profileCompleted,
            isProfileCompleted: userDataToStore.isProfileCompleted
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-4">Welcome to Flinxx</h1>
          <p className="text-lg text-white/80">Connect with strangers instantly</p>
          <p className="text-sm text-white/70 mt-2">Sign up to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Sign In / Login Buttons */}
        <div className="space-y-4">
          {/* Signing In Button (when loading) */}
          {isSigningIn && (
            <button
              disabled
              className="w-full bg-gray-400 cursor-not-allowed text-gray-700 font-bold py-3 px-6 rounded-full transition-all text-lg flex items-center justify-center gap-2"
            >
              <span className="animate-spin">⟳</span> Signing in...
            </button>
          )}

          {/* Custom Google Login Button */}
          <GoogleCustomButton 
            isSigningIn={isSigningIn}
          />

          {/* Facebook Login Button */}
          <button
            onClick={handleFacebookLogin}
            disabled={isSigningIn}
            className={`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${
              isSigningIn
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <span className="text-xl">f</span> Continue with Facebook
          </button>
        </div>

        {/* Terms */}
        <div className="text-center mt-8">
          <p className="text-xs text-white/60">
            By signing in, you agree to our{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white underline"
            >
              TERMS & CONDITIONS
            </a>
            {' '}and{' '}
            <a href="#" className="text-white/80 hover:text-white underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-10 flex flex-col items-center gap-3 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <p>Instant connection with strangers</p>
          </div>

          <div className="flex items-center gap-2">
            <span>👤</span>
            <p>100% Anonymous & Safe</p>
          </div>

          <div className="flex items-center gap-2">
            <span>🎥</span>
            <p>High-quality Video Chat</p>
          </div>

          <div className="flex items-center gap-2">
            <span>🌍</span>
            <p>Connect Worldwide</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
