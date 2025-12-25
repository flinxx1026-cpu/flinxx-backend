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

        // Fetch user data from backend using token
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${BACKEND_URL}/auth-success?token=${token}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ User data received:", data.user.email);

        if (data.success && data.user) {
          const user = data.user;
          
          // Store user data and token
          if (setAuthToken) {
            console.log('[AuthSuccess] Storing token and user via AuthContext');
            setAuthToken(token, user);
          } else {
            // Fallback: save directly to localStorage
            console.log('[AuthSuccess] AuthContext not available, saving to localStorage directly');
            localStorage.setItem("token", token);
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("authProvider", "google");
            localStorage.setItem("userInfo", JSON.stringify(user));
          }

          console.log("✅ User data saved");
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
        <p className="mt-4 text-white text-lg font-semibold">Completing your login...</p>
        <p className="text-white/70 text-sm mt-2">Please wait while we set up your session</p>
      </div>
    </div>
  );
}
