import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * OAuthHandler Page
 * 
 * Purpose: Handle OAuth callbacks from backend
 * The backend redirects to /oauth-handler with token and user in URL params
 * 
 * TWO MODES:
 * 1. POPUP MODE (popup=true in URL): Save to localStorage + set completion flag, then close popup
 * 2. NORMAL MODE: Save to localStorage, navigate to /chat
 * 
 * NOTE: We use localStorage events (not postMessage) because window.opener 
 * gets nullified after cross-origin navigation through Google OAuth.
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
      const isPopup = searchParams.get('popup') === 'true' || localStorage.getItem('is_oauth_popup') === 'true'

      console.log('🟢 [OAuthHandler] Extracted from URL:');
      console.log('🟢 [OAuthHandler]   - token:', token ? '✓ Found' : '✗ Missing');
      console.log('🟢 [OAuthHandler]   - user:', userJson ? '✓ Found' : '✗ Missing');
      console.log('🟢 [OAuthHandler]   - provider:', provider);
      console.log('🟢 [OAuthHandler]   - isPopup:', isPopup);
      console.log('🟢 [OAuthHandler]   - window.opener:', window.opener ? 'EXISTS' : 'NULL');

      if (!token || !userJson) {
        console.error('❌ [OAuthHandler] Missing token or user data in URL');
        if (isPopup) {
          // Signal error to parent via localStorage
          localStorage.removeItem('is_oauth_popup');
          localStorage.setItem('oauth_error', 'Missing token or user data');
          localStorage.setItem('oauth_complete', Date.now().toString());
          setTimeout(() => window.close(), 300);
        } else {
          navigate('/login', { replace: true });
        }
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

        // Save to localStorage (both modes need this)
        console.log('🟢 [OAuthHandler] Saving to localStorage...');
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authProvider', provider);
        console.log('✅ [OAuthHandler] Successfully saved to localStorage');

        if (isPopup) {
          // ✅ POPUP MODE: Set completion flag in localStorage
          // The parent window (Login.jsx) listens for the 'storage' event on this key
          // This works even when window.opener is null (after cross-origin Google redirect)
          console.log('🟢 [OAuthHandler] POPUP MODE - setting oauth_complete flag');
          
          // Remove any previous error and the temporary popup flag
          localStorage.removeItem('oauth_error');
          localStorage.removeItem('is_oauth_popup');
          
          // ✅ Set completion flag - parent window will detect this via 'storage' event
          localStorage.setItem('oauth_complete', Date.now().toString());
          
          console.log('✅ [OAuthHandler] oauth_complete flag set! Parent should detect it.');
          console.log('✅ [OAuthHandler] Closing popup window...');
          
          // Close the popup window
          setTimeout(() => {
            window.close();
            // Fallback: if window.close() doesn't work, show message
            setTimeout(() => {
              console.log('⚠️ [OAuthHandler] window.close() may not have worked');
            }, 500);
          }, 300);
        } else {
          // ✅ NORMAL MODE: Standard redirect to /chat
          console.log('🟢 [OAuthHandler] NORMAL MODE - redirecting to /chat');
          window.history.replaceState({}, document.title, '/oauth-handler');
          navigate('/chat', { replace: true });
        }
      } catch (parseErr) {
        console.error('❌ [OAuthHandler] Error parsing user data:', parseErr);
        if (isPopup) {
          localStorage.removeItem('is_oauth_popup');
          localStorage.setItem('oauth_error', parseErr.message);
          localStorage.setItem('oauth_complete', Date.now().toString());
          setTimeout(() => window.close(), 300);
        } else {
          navigate('/login', { replace: true });
        }
      }
    } catch (error) {
      console.error('❌ [OAuthHandler] Unexpected error:', error);
      localStorage.removeItem('is_oauth_popup');
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
        <p>This window will close automatically...</p>
      </div>
    </div>
  );
}
