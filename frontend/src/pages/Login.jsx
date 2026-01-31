import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import flinxxLogo from '../assets/flinxx-logo.svg'
import googleIcon from '../assets/google-icon.svg'
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

const Login = () => {
  const navigate = useNavigate()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState(null)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [pendingLoginProvider, setPendingLoginProvider] = useState(null)

  useEffect(() => {
    // 🔥 PRIORITY 1: Handle Google OAuth callback from URL
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')
    const userFromUrl = params.get('user')

    console.log('🔵 [Login useEffect] Checking OAuth callback:')
    console.log('   - tokenFromUrl:', !!tokenFromUrl)
    console.log('   - userFromUrl:', !!userFromUrl)

    // Handle Google OAuth callback
    if (tokenFromUrl && userFromUrl) {
      console.log('✅ [Login useEffect] Google OAuth callback received!')
      try {
        // Decode user if it's base64 or URL-encoded
        const decodedUser = typeof userFromUrl === 'string' ? JSON.parse(decodeURIComponent(userFromUrl)) : userFromUrl
        localStorage.setItem('token', tokenFromUrl)
        localStorage.setItem('user', JSON.stringify(decodedUser))
        console.log('✅ [Login useEffect] OAuth credentials stored, redirecting to /chat')
        navigate('/chat', { replace: true })
        return
      } catch (err) {
        console.error('❌ [Login useEffect] Error handling OAuth callback:', err)
      }
    }

    // 🔥 PRIORITY 2: Check if user already logged in (normal case)
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    console.log('🔵 [Login useEffect] Checking stored authentication:')
    console.log('   - token:', !!storedToken)
    console.log('   - user:', !!storedUser)
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser)
        console.log('✅ [Login useEffect] User already authenticated, redirecting to /chat:', user.email)
        // Redirect after a small delay
        setTimeout(() => {
          navigate('/chat', { replace: true })
        }, 300)
      } catch (err) {
        console.error('Error parsing stored user:', err)
      }
    }
  }, [navigate])

  // Trigger Google OAuth via backend
  const triggerGoogleLogin = () => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    console.log('🔗 [Google] Redirecting to backend OAuth endpoint:', `${BACKEND_URL}/auth/google`)
    setIsSigningIn(true)
    window.location.href = `${BACKEND_URL}/auth/google`
  }

  // Trigger Facebook OAuth via backend
  const triggerFacebookLogin = () => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    console.log('🔗 [Facebook] Redirecting to backend OAuth endpoint:', `${BACKEND_URL}/auth/facebook`)
    setIsSigningIn(true)
    window.location.href = `${BACKEND_URL}/auth/facebook`
  }

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
  const handleTermsContinue = () => {
    console.log('✅ User accepted terms')
    acceptTerms()
    setShowTermsModal(false)
    
    if (pendingLoginProvider === 'google') {
      console.log('🔐 Proceeding with Google login after terms acceptance')
      triggerGoogleLogin()
    } else if (pendingLoginProvider === 'facebook') {
      console.log('🔐 Proceeding with Facebook login after terms acceptance')
      triggerFacebookLogin()
    }
    
    setPendingLoginProvider(null)
  }

  const handleGoogleClick = () => {
    console.log('🔐 Google login clicked - checking terms acceptance')
    
    if (isTermsAccepted()) {
      console.log('✅ Terms already accepted - proceeding with Google login')
      triggerGoogleLogin()
    } else {
      console.log('⚠️ Terms not accepted - showing modal first')
      handleShowTermsModal('google')
    }
  }

  const handleFacebookClick = () => {
    console.log('🔐 Facebook login clicked - checking terms acceptance')
    
    if (isTermsAccepted()) {
      console.log('✅ Terms already accepted - proceeding with Facebook login')
      triggerFacebookLogin()
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

        {error && (
          <div className="w-full max-w-xs mx-auto mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="w-full space-y-4 mb-11">
          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
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
            <span className="pl-2 tracking-wide">
              {isSigningIn ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          {/* Facebook Login Button */}
          <button
            type="button"
            onClick={handleFacebookClick}
            disabled={isSigningIn}
            className="w-full group relative flex items-center justify-center bg-[#0F0F0F] hover:bg-[#141414] text-white font-semibold py-4 px-7 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 gold-border hover:border-gold-400/60 hover:shadow-gold-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="absolute left-7 flex items-center text-[#1877F2] group-hover:text-white transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </span>
            <span className="pl-2 tracking-wide">
              {isSigningIn ? 'Signing in...' : 'Continue with Facebook'}
            </span>
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
