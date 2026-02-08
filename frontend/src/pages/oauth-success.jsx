import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  console.error('🔥🔥🔥 [OAuthSuccess PAGE LOADED] 🔥🔥🔥');

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get token from URL (backend should have set it)
        let token = searchParams.get("token");
        
        console.log("🔐 [OAuthSuccess] Page loaded, checking for token in URL...");
        console.log("🔐 [OAuthSuccess] Token from URL:", token ? token.substring(0, 20) + "..." : "NOT FOUND");

        // CRITICAL: If no token in URL params, the backend redirect might have failed
        if (!token) {
          console.error("❌ [OAuthSuccess] No token in URL - backend OAuth callback issue");
          setError("No authentication token received. Please try logging in again.");
          // Wait 2 seconds then redirect to login
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        console.log("✅ [OAuthSuccess] Token found, decoding JWT...");

        // Decode the token to extract user data
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT format - token must have 3 parts');
        }

        let decoded = {};
        try {
          decoded = JSON.parse(atob(parts[1]));
          console.log("🔐 [OAuthSuccess] JWT decoded successfully:", {
            id: decoded.id,
            email: decoded.email,
            iat: decoded.iat
          });
        } catch (e) {
          throw new Error('Failed to decode JWT token: ' + e.message);
        }

        // Now try to fetch full user data from backend for additional fields
        // But don't fail if this doesn't work - we have what we need from the JWT
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        console.log("📡 [OAuthSuccess] Attempting to fetch full user profile from backend...");
        
        let userFromBackend = null;
        try {
          const response = await fetch(`${BACKEND_URL}/auth-success?token=${encodeURIComponent(token)}`, {
            timeout: 5000
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              userFromBackend = data.user;
              console.log("✅ [OAuthSuccess] Backend provided additional user data:", userFromBackend.email);
            }
          } else {
            console.warn("⚠️ [OAuthSuccess] Backend response not OK:", response.status);
          }
        } catch (fetchErr) {
          console.warn("⚠️ [OAuthSuccess] Backend fetch failed, using JWT data only:", fetchErr.message);
        }

        // Build normalized user object from either backend data or JWT
        let validUUID;
        let normalizedUser;

        if (userFromBackend) {
          validUUID = userFromBackend.uuid || userFromBackend.id;
          console.log('🔍 [OAuthSuccess] Checking backend UUID:', {
            uuid_value: validUUID,
            uuid_type: typeof validUUID,
            uuid_length: validUUID ? validUUID.toString().length : 'null'
          });
          
          if (validUUID && typeof validUUID === 'string' && validUUID.length === 36) {
            normalizedUser = {
              uuid: validUUID,
              id: validUUID,
              name: userFromBackend.name || userFromBackend.display_name || 'User',
              email: userFromBackend.email,
              picture: userFromBackend.picture || userFromBackend.photo_url,
              profileCompleted: userFromBackend.profileCompleted || false
            };
            console.log('✅ [OAuthSuccess] ✓ Valid UUID from backend, using backend user data', validUUID.substring(0, 8) + '...');
          } else {
            console.warn('⚠️ [OAuthSuccess] Backend UUID invalid or wrong format, falling back to JWT:', {
              received: validUUID,
              length: validUUID ? validUUID.toString().length : 0
            });
            userFromBackend = null;
          }
        }

        // If no valid backend user, use JWT data
        if (!userFromBackend) {
          // Generate a valid UUID if needed (use the id from JWT)
          validUUID = decoded.id;
          console.log('🔍 [OAuthSuccess] Checking JWT UUID:', {
            uuid_value: validUUID,
            uuid_type: typeof validUUID,
            uuid_length: validUUID ? validUUID.toString().length : 'null'
          });
          
          if (!validUUID || typeof validUUID !== 'string' || validUUID.length !== 36) {
            console.error('❌ [OAuthSuccess] Invalid UUID in JWT:', {
              received: validUUID,
              type: typeof validUUID,
              length: validUUID ? validUUID.toString().length : 0
            });
            setError('Authentication failed: Invalid user ID in token');
            return;
          }

          normalizedUser = {
            uuid: validUUID,
            id: validUUID,
            name: decoded.name || 'User',
            email: decoded.email,
            picture: decoded.picture || null,
            profileCompleted: decoded.profileCompleted || false
          };
          console.log('✅ [OAuthSuccess] ✓ Valid UUID from JWT, using JWT user data', validUUID.substring(0, 8) + '...');
        }

        console.log('✅ [OAuthSuccess] Saving to localStorage - user:', normalizedUser.email);
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("authProvider", decoded.provider || "google");

        // Verify storage was successful
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        console.log('✅ [OAuthSuccess] Verification after save:');
        console.log('   - token saved:', !!storedToken);
        console.log('   - user saved:', !!storedUser);

        if (!storedToken || !storedUser) {
          throw new Error('Failed to save authentication data to localStorage');
        }

        // Verify localStorage is persisted correctly
        const verifyToken = localStorage.getItem('token');
        const verifyUser = localStorage.getItem('user');
        
        if (!verifyToken || !verifyUser) {
          throw new Error('Failed to verify localStorage persistence after save');
        }

        // Force reload with hard refresh to ensure AuthContext gets fresh data
        console.log('✅ [OAuthSuccess] All data saved successfully - redirecting to /dashboard with page reload');
        setTimeout(() => {
          console.log('✅ [OAuthSuccess] NOW REDIRECTING to /dashboard with hard refresh');
          // Use absolute URL and force page reload
          window.location.href = '/dashboard';
        }, 300);
      } catch (err) {
        console.error("❌ [OAuthSuccess] Error:", err.message);
        setError(err.message || "An error occurred during authentication");
      }
    };

    handleAuthSuccess();
  }, [searchParams]);

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

  // ✅ Show loading screen while redirecting to /chat
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
