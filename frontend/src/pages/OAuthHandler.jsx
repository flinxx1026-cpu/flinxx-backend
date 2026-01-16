import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * OAuthHandler Page
 * 
 * Purpose: Handle OAuth callbacks from backend
 * The backend redirects to /oauth-handler with token and user in URL params
 * This page saves them to localStorage and redirects to /chat
 * 
 * Flow:
 * 1. OAuth callback: /auth/google?code=... → Backend processes → /oauth-handler?token=...&user=...
 * 2. This page executes
 * 3. Saves token and user to localStorage
 * 4. Redirects to /chat
 * 5. AuthContext loads from localStorage immediately (fast path)
 */
export default function OAuthHandler() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    try {
      console.log('\n\n🟢 [OAuthHandler] PAGE LOADED');
      console.log('🟢 [OAuthHandler] URL params:', Object.fromEntries(searchParams));

      const token = searchParams.get('token')
      const userJson = searchParams.get('user')
      const provider = searchParams.get('provider') || 'unknown'

      console.log('🟢 [OAuthHandler] Extracted from URL:');
      console.log('🟢 [OAuthHandler]   - token:', token ? '✓ Found' : '✗ Missing');
      console.log('🟢 [OAuthHandler]   - user:', userJson ? '✓ Found' : '✗ Missing');
      console.log('🟢 [OAuthHandler]   - provider:', provider);

      if (!token || !userJson) {
        console.error('❌ [OAuthHandler] Missing token or user data in URL');
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Parse user data
        const user = JSON.parse(userJson);
        console.log('🟢 [OAuthHandler] Parsed user:', {
          uuid: user.uuid?.substring(0, 8) + '...',
          email: user.email,
          name: user.name
        });

        // Validate UUID
        if (!user.uuid || user.uuid.length !== 36) {
          throw new Error('Invalid UUID format');
        }

        // Save to localStorage
        console.log('🟢 [OAuthHandler] Saving to localStorage...');
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authProvider', provider);
        console.log('✅ [OAuthHandler] Successfully saved to localStorage');

        // Clean up URL
        console.log('🟢 [OAuthHandler] Cleaning up URL and redirecting to /chat');
        window.history.replaceState({}, document.title, '/oauth-handler');

        // Redirect to chat
        navigate('/chat', { replace: true });
      } catch (parseErr) {
        console.error('❌ [OAuthHandler] Error parsing user data:', parseErr);
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('❌ [OAuthHandler] Unexpected error:', error);
      navigate('/login', { replace: true });
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
        <h1>Logging in...</h1>
        <p>Redirecting to dashboard</p>
      </div>
    </div>
  );
}
