import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * OAuth Callback Handler
 * Receives token and user from backend OAuth callback
 * Stores credentials and redirects to dashboard
 */
const OAuthCallbackHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract token and user from URL params
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const userStr = params.get('user')

        console.log('🔐 [OAuthCallbackHandler] Processing callback...')
        console.log('  - Has token:', !!token)
        console.log('  - Has user:', !!userStr)

        if (!token || !userStr) {
          console.error('❌ [OAuthCallbackHandler] Missing token or user data')
          navigate('/login?error=invalid_callback')
          return
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userStr))
        
        // Save to localStorage
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        console.log('✅ [OAuthCallbackHandler] Credentials saved')
        console.log('  - User email:', user.email)
        console.log('  - Redirecting to /dashboard...')

        // Redirect to dashboard
        navigate('/dashboard', { replace: true })
      } catch (err) {
        console.error('❌ [OAuthCallbackHandler] Error:', err.message)
        navigate('/login?error=callback_error')
      }
    }

    handleCallback()
  }, [navigate])

  // Show loading message while processing
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000000',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          margin: '0 auto 1rem',
          border: '2px solid rgba(255, 215, 0, 0.1)',
          borderTopColor: '#FFD700',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Completing authentication...
        </h2>
        <p style={{ color: '#999999' }}>Redirecting to dashboard</p>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default OAuthCallbackHandler
