import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle, signInWithFacebook } from '../config/firebase'
import { AuthContext } from '../context/AuthContext'
import flinxxLogo from '../assets/flinxx-logo.svg'

const Auth = () => {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState(null)
  const [error, setError] = useState(null)

  // ✅ Redirect to /chat if user is already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('✅ User already authenticated, redirecting to /chat')
      navigate('/chat', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleGoogleLogin = async () => {
    // Redirect to backend OAuth instead of Firebase
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    console.log('🔗 Redirecting to Google OAuth:', `${BACKEND_URL}/auth/google`)
    window.location.href = `${BACKEND_URL}/auth/google`
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    setAuthMethod('facebook')
    setError(null)
    // ⚠️ DO NOT set authPending here - Firebase popup must complete without interference
    // Firebase will handle window.closed() check internally
    
    try {
      console.log('📱 Starting Facebook login popup...')
      const userInfo = await signInWithFacebook()
      console.log('✅ Facebook login successful:', userInfo)
      
      // Navigate after successful login
      navigate('/chat')
    } catch (error) {
      console.error('❌ Facebook login failed:', error)
      
      let errorMessage = 'Facebook login failed. Please try again.'
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Login popup was blocked. Please allow popups and try again.'
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login was cancelled. Please try again.'
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Login was cancelled. Please try again.'
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Try a different sign-in method.'
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Facebook login is not available at this time.'
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Facebook login.'
      } else if (error.message && error.message.includes('popup')) {
        errorMessage = 'Login popup issue. Please check your browser settings and try again.'
      }
      
      setError(errorMessage)
      setIsLoading(false)
      setAuthMethod(null)
    }
  }

  const handleGuestLogin = () => {
    // Set guest session with 2-minute expiration
    const guestSession = {
      startedAt: new Date().getTime(),
      expiresAt: new Date().getTime() + 120000 // 2 minutes
    }
    
    // Store guest session info
    localStorage.setItem('isGuest', 'true')
    localStorage.setItem('guestSession', JSON.stringify(guestSession))
    localStorage.setItem('authProvider', 'guest')
    localStorage.setItem('userInfo', JSON.stringify({
      uid: 'guest-' + Date.now(),
      displayName: 'Guest User',
      authProvider: 'guest'
    }))
    
    // Redirect to chat - guest timer will run there
    window.location.href = '/chat'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex flex-col">
      {/* Header */}
      <div className="relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={flinxxLogo} alt="Flinxx" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white">Flinxx</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-white font-semibold hover:text-white/80 transition"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-4">Welcome to Flinxx</h2>
            <p className="text-white/80 text-lg mb-2">Connect with strangers instantly</p>
            <p className="text-white/70 text-base">Sign up to get started</p>
          </div>

          {/* Login Options */}
          <div className="space-y-4 mb-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur mb-4">
                {error}
              </div>
            )}
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl ${
                isLoading && authMethod === 'google'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              {isLoading && authMethod === 'google' ? (
                <>
                  <span className="animate-spin">⟳</span> Signing in...
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-gray-900">G</span>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Facebook Login */}
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-4 px-6 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl ${
                isLoading && authMethod === 'facebook'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading && authMethod === 'facebook' ? (
                <>
                  <span className="animate-spin">⟳</span> Signing in...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/70 text-sm font-semibold">OR</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Guest Login */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className={`w-full px-6 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
              isLoading && authMethod === 'guest'
                ? 'bg-gray-500/30 cursor-not-allowed text-gray-400'
                : 'bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white'
            }`}
          >
            {isLoading && authMethod === 'guest' ? (
              <>
                <span className="animate-spin">⟳</span> Starting...
              </>
            ) : (
              <>
                👤 Continue as Guest
              </>
            )}
          </button>

          {/* Info Text */}
          <p className="text-white/70 text-xs text-center mt-8">
            By signing in, you agree to our{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline"
            >
              TERMS & CONDITIONS
            </a>
            {' '}and Privacy Policy
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <span className="text-2xl">⚡</span>
              <span className="text-sm">Instant connection with strangers</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <span className="text-2xl">🔐</span>
              <span className="text-sm">100% Anonymous & Safe</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <span className="text-2xl">🌍</span>
              <span className="text-sm">Connect with people worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Session Timeout Popup - REMOVED: Guest timer logic moved to Chat component */}

      {/* Already Used Popup - REMOVED: Guest restrictions moved to Chat component */}
    </div>
  )
}

export default Auth
