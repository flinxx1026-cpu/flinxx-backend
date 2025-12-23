import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProfileSetupModal from "../components/ProfileSetupModal";

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    try {
      const token = searchParams.get("token");
      const userString = searchParams.get("user");
      const error = searchParams.get("error");

      console.log("🔐 Callback - Token:", token);
      console.log("👤 Callback - User:", userString);

      if (error) {
        console.error("❌ OAuth Error:", error);
        navigate("/login?error=" + encodeURIComponent(error), { replace: true });
        return;
      }

      if (token && userString) {
        try {
          const user = JSON.parse(userString);

          // Save token to localStorage with both keys for compatibility
          localStorage.setItem("token", token);
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("authProvider", "google");
          localStorage.setItem("userInfo", JSON.stringify(user));

          console.log("✅ User data saved:", user);

          // Check if profile is completed
          if (!user.isProfileCompleted) {
            console.log("ℹ️ Profile not completed, showing setup modal");
            setUserData(user);
            setShowProfileSetup(true);
          } else {
            console.log("✅ Profile completed, redirecting to chat...");
            setTimeout(() => {
              navigate("/chat");
            }, 500);
          }
        } catch (parseError) {
          console.error("❌ Error parsing user data:", parseError);
          navigate("/login?error=invalid_user_data", { replace: true });
        }
      } else {
        console.error("❌ Missing token or user data");
        navigate("/login?error=missing_data", { replace: true });
      }
    } catch (error) {
      console.error("❌ Callback error:", error);
      navigate("/login?error=" + encodeURIComponent(error.message), { replace: true });
    }
  }, [searchParams, navigate]);

  const handleProfileComplete = (completedUser) => {
    console.log("✅ Profile completed, redirecting to chat");
    setShowProfileSetup(false);
    setTimeout(() => {
      navigate("/chat");
    }, 500);
  };

  if (showProfileSetup && userData) {
    return <ProfileSetupModal user={userData} onProfileComplete={handleProfileComplete} isOpen={true} />;
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
