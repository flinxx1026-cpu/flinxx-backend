import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProfileSetupModal from "../components/ProfileSetupModal";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
          
          // Save token and user data to localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("authProvider", "google");
          localStorage.setItem("userInfo", JSON.stringify(user));

          console.log("✅ User data saved to localStorage");

          // Check if profile is completed
          if (!user.profileCompleted) {
            console.log("ℹ️ Profile not completed, showing setup modal");
            setUserData(user);
            setShowProfileSetup(true);
          } else {
            console.log("✅ Profile completed, redirecting to chat");
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
  }, [searchParams, navigate]);

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
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100"
          >
            Back to Login
          </button>
        </div>
      </div>
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
