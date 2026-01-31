import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * GoogleCallback Page
 * 
 * Purpose: Handle Google OAuth callback
 * Backend redirects here with token in URL
 * This page saves token to localStorage and redirects to /chat
 */
export default function GoogleCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    try {
      console.log('\n\n🟢 [GoogleCallback] PAGE LOADED');
      console.log('🟢 [GoogleCallback] URL params:', Object.fromEntries(searchParams));

      const token = searchParams.get('token')
      const error = searchParams.get('error')

      // If there's an error from Google
      if (error) {
        console.error('❌ [GoogleCallback] Error from OAuth:', error)
        navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true })
        return
      }

      console.log('🟢 [GoogleCallback] Extracted from URL:');
      console.log('🟢 [GoogleCallback]   - token:', token ? '✓ Found' : '✗ Missing');

      if (!token) {
        console.error('❌ [GoogleCallback] Missing token in URL');
        navigate('/login?error=no_token', { replace: true });
        return;
      }

      try {
        // Save token to localStorage
        console.log('🟢 [GoogleCallback] Saving token to localStorage...');
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('authProvider', 'google');
        console.log('✅ [GoogleCallback] Successfully saved token to localStorage');

        // Clean up URL
        console.log('🟢 [GoogleCallback] Cleaning up URL and redirecting to /chat');
        window.history.replaceState({}, document.title, '/auth/google/callback');

        // Redirect to chat - AuthContext will load user from backend
        navigate('/chat', { replace: true });
      } catch (err) {
        console.error('❌ [GoogleCallback] Error saving token:', err);
        navigate('/login?error=storage_error', { replace: true });
      }
    } catch (error) {
      console.error('❌ [GoogleCallback] Unexpected error:', error);
      navigate('/login?error=unknown', { replace: true });
    }
  }, [searchParams, navigate]);

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
        <h1>Signing you in...</h1>
        <p>Please wait while we complete your authentication</p>
      </div>
    </div>
  );
}
