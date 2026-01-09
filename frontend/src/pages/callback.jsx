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
      const dataString = searchParams.get("data");
      const error = searchParams.get("error");

      console.log("🔐 Callback - Token:", token);
      console.log("📦 Callback - Data:", dataString);

      if (error) {
        console.error("❌ OAuth Error:", error);
        navigate("/login?error=" + encodeURIComponent(error), { replace: true });
        return;
      }

      if (token && dataString) {
        try {
          // Decode the response data
          const responseData = JSON.parse(decodeURIComponent(dataString));
          const user = responseData.user;

          console.log("✅ User data extracted:", user);

          // Save token to localStorage with both keys for compatibility
          localStorage.setItem("token", token);
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("authProvider", "google");
          localStorage.setItem("userInfo", JSON.stringify(user));

          console.log("✅ User data saved:", user);

          // Check if profile is completed
          if (!user.profileCompleted) {
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
          console.error("❌ Error parsing response data:", parseError);
          navigate("/login?error=invalid_user_data", { replace: true });
        }
      } else {
        console.error("❌ Missing token or data");
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
