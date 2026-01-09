import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { setAuthToken } = useContext(AuthContext) || {};
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get("token");
        const data_param = searchParams.get("data");
        
        if (!token) {
          setError("No authentication token received");
          setLoading(false);
          return;
        }

        console.log("🔐 Auth Success - Token received:", token.substring(0, 10) + "...");

        // Parse the data parameter if available (from Google callback redirect)
        let responseData = null;
        if (data_param) {
          try {
            responseData = JSON.parse(decodeURIComponent(data_param));
            console.log("✅ Response data from backend:", responseData);
          } catch (e) {
            console.warn("⚠️ Could not parse response data:", e);
          }
        }

        // Token contains all user data (encoded by backend)
        // Decode the token to get user info (using browser's atob instead of Node.js Buffer)
        const decoded = JSON.parse(atob(token));
        
        // Fetch full user data from backend using the decoded token
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${BACKEND_URL}/auth-success?token=${token}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ User data received:", data.user.email);

        if (data.success && data.user) {
          const user = data.user;

          // ✅ CRITICAL: Extract ONLY valid 36-char UUID for localStorage
          // Backend returns: { id: "8-digit", uuid: "36-char-uuid", ... }
          let validUUID = null;
          
          // Check for valid UUID (36 chars with hyphens)
          if (user.uuid && typeof user.uuid === 'string' && user.uuid.length === 36) {
            validUUID = user.uuid;
            console.log('✅ Valid UUID found in user.uuid:', validUUID.substring(0, 8) + '...');
          } else if (user.id && typeof user.id === 'string' && user.id.length === 36) {
            // Fallback: if uuid is missing, try id (may contain UUID from some endpoints)
            validUUID = user.id;
            console.log('✅ Valid UUID found in user.id (fallback):', validUUID.substring(0, 8) + '...');
          } else {
            console.error('❌ CRITICAL: No valid 36-char UUID found in backend response');
            console.error('   user.uuid:', user.uuid, '(type:', typeof user.uuid + ', length:', user.uuid?.length + ')');
            console.error('   user.id:', user.id, '(type:', typeof user.id + ', length:', user.id?.length + ')');
            console.error('   Full response:', user);
            setError('Authentication failed: Invalid UUID from server');
            setLoading(false);
            return;
          }
          
          // ✅ Store ONLY UUID - NO numeric id at all
          const normalizedUser = {
            uuid: validUUID,           // ✅ ONLY the 36-char UUID
            name: user.name || user.display_name || 'User',
            email: user.email,
            picture: user.picture || user.photo_url,
            profileCompleted: user.profileCompleted || false
          };
          
          console.log('✅ User data normalized for storage (UUID ONLY):', { 
            uuid: normalizedUser.uuid.substring(0, 8) + '...',
            email: normalizedUser.email 
          });
          
          // Store user data and token
          if (setAuthToken) {
            console.log('[AuthSuccess] Storing token and user via AuthContext');
            setAuthToken(token, normalizedUser);
          } else {
            // Fallback: save directly to localStorage
            console.log('[AuthSuccess] AuthContext not available, saving to localStorage directly');
            localStorage.setItem("token", token);
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(normalizedUser));
            localStorage.setItem("authProvider", "google");
          }

          // ✅ VERIFY: Confirm what was stored in localStorage
          const stored = JSON.parse(localStorage.getItem('user') || '{}');
          console.log('✅ VERIFICATION - localStorage.user contents:', {
            has_uuid: !!stored.uuid,
            uuid_length: stored.uuid?.length,
            has_id: !!stored.id,
            has_email: !!stored.email
          });

          setUserData(user);

          // ✅ UNIFIED ROUTING: All users go to /chat (new unified dashboard)
          console.log("🔗 Routing all users to /chat (unified dashboard)");
          setTimeout(() => {
            navigate("/chat");
          }, 500);
        } else {
          setError(data.error || "Failed to authenticate");
        }
      } catch (err) {
        console.error("❌ Auth Success Error:", err);
        setError(err.message || "An error occurred during authentication");
      } finally {
        setLoading(false);
      }
    };

    handleAuthSuccess();
  }, [searchParams, navigate, setAuthToken]);

  const handleTermsContinue = async () => {
    // Unified routing: this should never be called
    console.log("⚠️ Terms handler called but not needed with unified routing");
    navigate("/chat");
  };

  const handleTermsCancel = async () => {
    // Unified routing: this should never be called
    console.log("⚠️ Terms cancel handler called but not needed with unified routing");
    navigate("/login", { replace: true });
  };

  const handleProfileComplete = (completedUser) => {
    // Unified routing: this should never be called
    console.log("⚠️ Profile complete handler called but not needed with unified routing");
    navigate("/chat");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">❌ Authentication Error</div>
          <p className="text-white/70 text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Unified routing: Show loading screen while redirecting all users to /chat
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
  );
}
