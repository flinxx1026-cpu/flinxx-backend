import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * OAuth Success Page
 * 
 * Backend redirects here after OAuth: /oauth-success?token=JWT
 * This page extracts token from URL, saves to localStorage, fetches user profile, redirects to dashboard
 */
export default function OAuthSuccess() {
  const navigate = useNavigate()
  const { setAuthToken } = useAuth()

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        console.log('\n🟢 [OAuthSuccess] PAGE LOADED')
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        
        console.log('🟢 [OAuthSuccess] Checking URL parameters...')
        console.log('🟢 [OAuthSuccess] token:', token ? '✓ Found (length: ' + token.length + ')' : '✗ Missing')

        if (!token) {
          console.error('❌ [OAuthSuccess] No token in URL - redirecting to login')
          navigate('/login', { replace: true })
          return
        }

        // ✅ STEP 1: Save token to localStorage FIRST
        console.log('🟢 [OAuthSuccess] STEP 1: Saving token to localStorage...')
        localStorage.setItem('authToken', token)
        localStorage.setItem('token', token)
        console.log('✅ [OAuthSuccess] Token saved to localStorage')
        
        // ✅ STEP 2: Fetch user profile from backend using the token
        console.log('🟢 [OAuthSuccess] STEP 2: Fetching user profile from backend...')
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
        
        const profileResponse = await fetch(`${BACKEND_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('🟢 [OAuthSuccess] Profile response status:', profileResponse.status)

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          console.log('✅ [OAuthSuccess] User profile fetched:', profileData.user?.email)
          
          if (profileData.user) {
            // ✅ STEP 3: Save user data to localStorage
            const userData = {
              uuid: profileData.user.uuid,
              id: profileData.user.id,
              email: profileData.user.email,
              name: profileData.user.name || profileData.user.display_name || 'User',
              picture: profileData.user.picture || profileData.user.photo_url,
              profileCompleted: profileData.user.profileCompleted || false
            }
            
            console.log('🟢 [OAuthSuccess] STEP 3: Saving user data to localStorage...')
            localStorage.setItem('user', JSON.stringify(userData))
            console.log('✅ [OAuthSuccess] User data saved')
            
            // Call setAuthToken to trigger AuthContext update
            setAuthToken(token, userData)
          }
        } else {
          console.warn('⚠️ [OAuthSuccess] Profile fetch failed, continuing anyway')
          // Continue without user profile - AuthContext will handle it
        }
        
        // ✅ STEP 4: Clean up URL
        console.log('🟢 [OAuthSuccess] STEP 4: Cleaning URL...')
        window.history.replaceState({}, document.title, '/oauth-success')
        
        // ✅ STEP 5: Redirect to dashboard
        console.log('🟢 [OAuthSuccess] STEP 5: Redirecting to /chat...')
        setTimeout(() => {
          console.log('🟢 [OAuthSuccess] Navigating to /chat now')
          navigate('/chat', { replace: true })
        }, 500)
      } catch (error) {
        console.error('❌ [OAuthSuccess] Error:', error)
        navigate('/login', { replace: true })
      }
    }
    
    handleOAuthSuccess()
  }, [navigate, setAuthToken])

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
