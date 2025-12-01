import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    try {
      const token = searchParams.get('token')
      const userString = searchParams.get('user')
      const error = searchParams.get('error')

      console.log('🔐 Auth Callback - Token:', token)
      console.log('👤 Auth Callback - User:', userString)

      if (error) {
        console.error('❌ OAuth Error:', error)
        // Redirect to login with error
        navigate('/login?error=' + encodeURIComponent(error))
        return
      }

      if (token && userString) {
        try {
          const user = JSON.parse(userString)
          
          // Save token to localStorage
          localStorage.setItem('authToken', token)
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('authProvider', 'google')
          localStorage.setItem('userInfo', JSON.stringify(user))

          console.log('✅ User data saved:', user)
          console.log('✅ Redirecting to chat...')

          // Redirect to chat
          setTimeout(() => {
            navigate('/chat')
          }, 500)
        } catch (parseError) {
          console.error('❌ Error parsing user data:', parseError)
          navigate('/login?error=invalid_user_data')
        }
      } else {
        console.error('❌ Missing token or user data')
        navigate('/login?error=missing_data')
      }
    } catch (error) {
      console.error('❌ Auth callback error:', error)
      navigate('/login?error=' + encodeURIComponent(error.message))
    }
  }, [searchParams, navigate])

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

export default AuthCallback
