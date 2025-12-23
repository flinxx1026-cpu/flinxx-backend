import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileSetupModal from "../components/ProfileSetupModal";
import TermsConfirmationModal from "../components/TermsConfirmationModal";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { setAuthToken, logout } = useContext(AuthContext) || {};
  const [searchParams] = useSearchParams();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get("token");
        
        if (!token) {
          setError("No authentication token received");
          setLoading(false);
          return;
        }

        console.log("🔐 Auth Success - Token received:", token.substring(0, 10) + "...");

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
          
          // Use the AuthContext setAuthToken to store token and user persistently
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

          console.log("✅ User data saved to localStorage");

          // Check if terms are accepted - if not, show terms modal
          if (!user.termsAccepted) {
            console.log("📋 Terms not accepted, showing terms confirmation modal");
            setUserData(user);
            setShowTermsModal(true);
          } else if (!user.profileCompleted) {
            console.log("ℹ️ Profile not completed, showing setup modal");
            setUserData(user);
            setShowProfileSetup(true);
          } else {
            console.log("✅ Profile completed and terms accepted, redirecting to chat");
            setTimeout(() => {
              navigate("/chat");
            }, 500);
          }
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
    try {
      console.log("📋 User accepted terms");
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      // Save terms acceptance to backend
      const response = await fetch(`${BACKEND_URL}/api/users/accept-terms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userData.id })
      });

      if (!response.ok) {
        throw new Error(`Failed to save terms acceptance: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Terms accepted and saved to backend");

      // Update user data with termsAccepted flag
      const updatedUser = { ...userData, termsAccepted: true };
      setUserData(updatedUser);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Close terms modal
      setShowTermsModal(false);

      // Check if profile is completed
      if (!updatedUser.profileCompleted) {
        console.log("ℹ️ Showing profile setup modal");
        setShowProfileSetup(true);
      } else {
        console.log("✅ Profile already completed, redirecting to chat");
        setTimeout(() => {
          navigate("/chat");
        }, 500);
      }
    } catch (err) {
      console.error("❌ Error accepting terms:", err);
      setError(err.message || "Failed to accept terms");
    }
  };

  const handleTermsCancel = async () => {
    try {
      console.log("❌ User cancelled terms - logging out");
      
      // Logout user
      if (logout) {
        logout();
      } else {
        // Fallback: clear localStorage manually
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("authProvider");
        localStorage.removeItem("userInfo");
      }

      // Redirect to login
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 500);
    } catch (err) {
      console.error("❌ Error cancelling terms:", err);
      navigate("/login");
    }
  };

  const handleProfileComplete = (completedUser) => {
    console.log("✅ Profile completed, redirecting to chat");
    setShowProfileSetup(false);
    setTimeout(() => {
      navigate("/chat");
    }, 500);
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

  if (showTermsModal && userData) {
    return (
      <TermsConfirmationModal
        user={userData}
        onContinue={handleTermsContinue}
        onCancel={handleTermsCancel}
      />
    );
  }

  if (showProfileSetup && userData) {
    return (
      <ProfileSetupModal
        user={userData}
        onProfileComplete={handleProfileComplete}
        isOpen={true}
      />
    );
  }

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
