import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Callback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userString = params.get('user')
    const error = params.get('error')

    console.log('🔐 Auth Callback - Token:', token)
    console.log('👤 Auth Callback - User:', userString)

    if (error) {
      console.error('❌ OAuth Error:', error)
      navigate('/login?error=' + encodeURIComponent(error), { replace: true })
      return
    }

    if (token) {
      try {
        // Save token to localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('authToken', token)
        console.log('✅ Token saved to localStorage')

        // Parse user data if available
        let userData = null
        if (userString) {
          userData = JSON.parse(userString)
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('userInfo', JSON.stringify(userData))
          localStorage.setItem('authProvider', 'google')
          console.log('✅ User data saved:', userData)
        }

        // Fetch user profile from backend using token
        console.log('📡 Fetching user profile...')
        fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`API error: ${res.status}`)
            }
            return res.json()
          })
          .then(data => {
            console.log('✅ Profile fetched successfully:', data)
            // Update user data with profile info
            const completeUserData = {
              ...userData,
              ...data
            }
            localStorage.setItem('user', JSON.stringify(completeUserData))
            localStorage.setItem('userInfo', JSON.stringify(completeUserData))
            
            // Redirect to chat
            console.log('✅ Redirecting to chat...')
            setTimeout(() => {
              navigate('/chat')
            }, 500)
          })
          .catch(err => {
            console.error('⚠️ Profile fetch failed:', err)
            // Still redirect even if profile fetch fails (user data from URL params is sufficient)
            console.log('✅ Redirecting to chat with URL-provided user data...')
            setTimeout(() => {
              navigate('/chat')
            }, 500)
          })
      } catch (parseError) {
        console.error('❌ Error processing callback:', parseError)
        navigate('/login?error=invalid_data', { replace: true })
      }
    } else {
      console.error('❌ Missing token')
      navigate('/login?error=missing_token', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
        <p className="mt-4 text-white text-lg font-semibold">Completing your login...</p>
        <p className="text-white/70 text-sm mt-2">Please wait while we set up your session</p>
      </div>
    </div>
  )
}

export default Callback
