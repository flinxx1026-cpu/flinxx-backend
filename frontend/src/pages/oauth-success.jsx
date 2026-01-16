import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * OAuth Success Page - CRITICAL FIX
 * 
 * Backend redirects here after OAuth: /oauth-success?token=JWT
 * This page MUST save token and user data to localStorage immediately
 * Then redirect to /chat so AuthContext can find the saved data
 */
export default function OAuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const processOAuthSuccess = async () => {
      try {
        console.log('\n🟢 [OAuthSuccess] PAGE LOADED')
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        
        console.log('🟢 [OAuthSuccess] Token from URL:', token ? '✓ Found (length: ' + token.length + ')' : '✗ Missing')

        if (!token) {
          console.error('❌ [OAuthSuccess] No token in URL - redirecting to login')
          navigate('/login', { replace: true })
          return
        }

        // ✅ STEP 1: Save token to localStorage IMMEDIATELY
        console.log('🟢 [OAuthSuccess] STEP 1: Saving token to localStorage...')
        localStorage.setItem('token', token)
        localStorage.setItem('authToken', token)
        console.log('✅ [OAuthSuccess] Token saved:', token.substring(0, 20) + '...')
        
        // ✅ STEP 2: Fetch user profile from backend
        console.log('🟢 [OAuthSuccess] STEP 2: Fetching user profile from backend...')
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
        
        try {
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
              console.log('✅ [OAuthSuccess] User data saved:', userData.email)
            }
          } else {
            console.warn('⚠️ [OAuthSuccess] Profile fetch failed with status:', profileResponse.status)
          }
        } catch (profileError) {
          console.warn('⚠️ [OAuthSuccess] Could not fetch user profile, but continuing with token:', profileError.message)
        }
        
        // ✅ VERIFY what we saved
        console.log('✅ [OAuthSuccess] VERIFICATION:')
        console.log('   - token in localStorage:', localStorage.getItem('token') ? '✓ YES' : '✗ NO')
        console.log('   - user in localStorage:', localStorage.getItem('user') ? '✓ YES' : '✗ NO')
        
        // ✅ STEP 4: Clean up URL
        console.log('🟢 [OAuthSuccess] STEP 4: Cleaning URL...')
        window.history.replaceState({}, document.title, '/oauth-success')
        
        // ✅ STEP 5: Redirect to chat
        console.log('🟢 [OAuthSuccess] STEP 5: Redirecting to /chat in 1 second...')
        setTimeout(() => {
          console.log('🟢 [OAuthSuccess] Now navigating to /chat')
          navigate('/chat', { replace: true })
        }, 1000)
      } catch (error) {
        console.error('❌ [OAuthSuccess] Unexpected error:', error)
        navigate('/login', { replace: true })
      }
    }
    
    processOAuthSuccess()
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
