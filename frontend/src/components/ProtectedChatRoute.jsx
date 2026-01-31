import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileSetupModal from './ProfileSetupModal'

const ProtectedChatRoute = ({ children }) => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  console.log('[ProtectedChatRoute] Render:');
  console.log('  - isLoading:', isLoading);
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - user:', user?.email || 'null');
  console.log('  - profileCompleted:', user?.profileCompleted);

  // ✅ Step 1: Wait for AuthContext to finish loading
  if (isLoading) {
    console.log('[ProtectedChatRoute] ⏳ Waiting for AuthContext...');
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 1rem',
            border: '2px solid rgba(255, 215, 0, 0.1)',
            borderTopColor: '#FFD700',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // ✅ Step 2: Check if user is authenticated
  if (!isAuthenticated || !user) {
    console.log('[ProtectedChatRoute] ❌ Not authenticated, redirecting to /login');
    navigate('/login', { replace: true });
    return null;
  }

  // ✅ Step 3: Check if profile is complete
  if (!user.profileCompleted) {
    console.log('[ProtectedChatRoute] ⚠️  Profile incomplete, showing setup modal');
    return (
      <>
        {!showProfileSetup ? (
          <ProfileSetupModal
            user={user}
            onProfileComplete={() => setShowProfileSetup(false)}
            isOpen={true}
          />
        ) : null}
      </>
    );
  }

  // ✅ Step 4: Profile complete, render children
  console.log('[ProtectedChatRoute] ✅ All checks passed, rendering chat');
  return children;
}

export default ProtectedChatRoute

