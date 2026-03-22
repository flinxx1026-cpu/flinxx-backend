import ErrorBoundary from './ErrorBoundary'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Matching from '../pages/Matching'
import Profile from '../pages/Profile'
import AuthCallback from '../pages/AuthCallback'
import Callback from '../pages/callback'
import AuthSuccess from '../pages/auth-success'
import GoogleCallback from '../pages/GoogleCallback'
import FacebookCallback from '../pages/FacebookCallback'
import OAuthHandler from '../pages/OAuthHandler'
import OAuthSuccess from '../pages/oauth-success'
import OAuthCallbackHandler from '../pages/OAuthCallbackHandler'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Terms from '../pages/Terms'
import CommunityGuidelines from '../pages/CommunityGuidelines'
import About from '../pages/About'
import Contact from '../pages/Contact'
import PaymentSuccessHandler from './PaymentSuccessHandler'
import ProtectedChatRoute from './ProtectedChatRoute'
import VideoMatchingTestPage from '../pages/VideoMatchingTest'
import { DuoSquadProvider, useDuoSquad } from '../context/DuoSquadContext'
import GlobalFriendRequestPopup from './GlobalFriendRequestPopup'
import GlobalCallPopup from './GlobalCallPopup'
import WarningModal from './WarningModal'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

// Lazy load Chat component to avoid TDZ errors during module initialization
const Chat = lazy(() => import('../pages/Chat'))

// Lazy load DuoPanel to delay initialization
const DuoPanel = lazy(() => import('./DuoPanel'))

function LayoutContent() {
  const { isDuoSquadOpen, closeDuoSquad } = useDuoSquad();
  const { isAuthenticated, accountWarning, setAccountWarning, user } = useAuth();
  const location = useLocation();
  
  // ✅ Route visibility logic
  const isBanned = user?.isBanned || accountWarning?.type === 'banned';
  const isPublicPage = ['/', '/login', '/community-guidelines'].includes(location.pathname);
  
  // Modal sirf logged-in banned/warned users ko hi protected routes pe dikhna chahiye
  const showWarningModal = isAuthenticated && (!!accountWarning || isBanned) && !isPublicPage;

  console.log('🔍 [LAYOUT] isBanned:', isBanned);
  console.log('🔍 [LAYOUT] showWarningModal:', showWarningModal);

  const handleCloseWarning = () => {
    console.log('✅ [LAYOUT] Closing warning modal');
    console.log('🗑️ [LAYOUT] Clearing localStorage warning backup');
    setAccountWarning(null);
    // Clear the localStorage backup so it doesn't persist
    localStorage.removeItem('flinx_pending_warning');
  };

  return (
    <>
      {/* 🔔 GLOBAL FRIEND REQUEST POPUP - DISABLED (now handled in Chat.jsx directly) */}
      {/* <div style={{ position: 'relative', zIndex: 999999 }}>
        <GlobalFriendRequestPopup />
      </div> */}

      {/* 📞 GLOBAL INCOMING CALL POPUP - Shows on ANY screen */}
      <div style={{ position: 'relative', zIndex: 999999 }}>
        <GlobalCallPopup />
      </div>

      {/* ⚠️ ACCOUNT WARNING MODAL */}
      <WarningModal 
        isOpen={showWarningModal} 
        onClose={handleCloseWarning}
        warningData={accountWarning}
      />

      {/* DuoSquad Modal - Fixed positioning at Layout level to prevent remounting */}
      {isDuoSquadOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            visibility: 'visible',
            opacity: 1,
            pointerEvents: 'auto'
          }}
        >
          <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#000' }} />}>
            <DuoPanel isOpen={isDuoSquadOpen} onClose={closeDuoSquad} />
          </Suspense>
        </div>
      )}

      {/* Main Router */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
          <Route path="/oauth-handler" element={<OAuthHandler />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/oauth-callback-handler" element={<OAuthCallbackHandler />} />
          <Route path="/payment-success" element={<PaymentSuccessHandler />} />
          <Route path="/subscription-success" element={<PaymentSuccessHandler />} />
          <Route path="/chat" element={<ProtectedChatRoute><Suspense fallback={<div style={{ width: '100%', minHeight: '100vh', background: '#000' }} />}><Chat /></Suspense></ProtectedChatRoute>} />
          <Route path="/dashboard" element={<ProtectedChatRoute><Suspense fallback={<div style={{ width: '100%', minHeight: '100vh', background: '#000' }} />}><Chat /></Suspense></ProtectedChatRoute>} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/test-matching" element={<VideoMatchingTestPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function Layout() {
  return (
    <ErrorBoundary>
      <DuoSquadProvider>
        <Router>
          <LayoutContent />
        </Router>
      </DuoSquadProvider>
    </ErrorBoundary>
  )
}

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-indigo-400 mb-4">404</h1>
      <p className="text-gray-300 mb-8">Page not found</p>
      <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold cursor-pointer">
        Go Home
      </button>
    </div>
  </div>
)

export default Layout
