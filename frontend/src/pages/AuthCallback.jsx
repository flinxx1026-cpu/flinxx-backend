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
        navigate('/login?error=' + encodeURIComponent(error), { replace: true })
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
          navigate('/login?error=invalid_user_data', { replace: true })
        }
      } else {
        console.error('❌ Missing token or user data')
        navigate('/login?error=missing_data', { replace: true })
      }
    } catch (error) {
      console.error('❌ Auth callback error:', error)
      navigate('/login?error=' + encodeURIComponent(error.message), { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '48px',
          height: '48px',
          border: '2px solid rgba(255, 215, 0, 0.1)',
          borderTopColor: '#FFD700',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600', marginTop: '1rem' }}>Completing your login...</p>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Please wait while we set up your session</p>
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

export default AuthCallback
