import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * OAuth Success Page
 * 
 * Backend redirects here after OAuth: /oauth-success?token=JWT
 * This page extracts token from URL, saves to localStorage, redirects to dashboard
 */
export default function OAuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    try {
      console.log('\n🟢 [OAuthSuccess] PAGE LOADED')
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      
      console.log('🟢 [OAuthSuccess] Checking URL parameters...')
      console.log('🟢 [OAuthSuccess] token:', token ? '✓ Found' : '✗ Missing')

      if (!token) {
        console.error('❌ [OAuthSuccess] No token in URL - redirecting to login')
        navigate('/login', { replace: true })
        return
      }

      // Save token to localStorage
      console.log('🟢 [OAuthSuccess] Saving token to localStorage...')
      localStorage.setItem('authToken', token)
      localStorage.setItem('token', token)
      console.log('✅ [OAuthSuccess] Token saved to localStorage')
      
      // Optional: Fetch user profile from backend if needed
      // For now, let AuthContext handle it when it initializes
      
      // Clean up URL
      console.log('🟢 [OAuthSuccess] Cleaning URL...')
      window.history.replaceState({}, document.title, '/oauth-success')
      
      // Redirect to dashboard
      console.log('🟢 [OAuthSuccess] Redirecting to /chat...')
      setTimeout(() => {
        navigate('/chat', { replace: true })
      }, 100)
    } catch (error) {
      console.error('❌ [OAuthSuccess] Error:', error)
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Logging in...</h1>
        <p>Redirecting to dashboard</p>
      </div>
    </div>
  )
}
