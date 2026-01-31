import ErrorBoundary from './ErrorBoundary'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Chat from '../pages/Chat'
import Matching from '../pages/Matching'
import Profile from '../pages/Profile'
import AuthCallback from '../pages/AuthCallback'
import Callback from '../pages/callback'
import AuthSuccess from '../pages/auth-success'
import GoogleCallback from '../pages/GoogleCallback'
import FacebookCallback from '../pages/FacebookCallback'
import OAuthHandler from '../pages/OAuthHandler'
import OAuthSuccess from '../pages/oauth-success'
import Terms from '../pages/Terms'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import ProtectedChatRoute from './ProtectedChatRoute'
import DuoPanel from './DuoPanel'
import { DuoSquadProvider, useDuoSquad } from '../context/DuoSquadContext'
import './Layout.css'

function LayoutContent() {
  const { isDuoSquadOpen, closeDuoSquad } = useDuoSquad();
  
  console.log('🔍 [LAYOUT] isDuoSquadOpen:', isDuoSquadOpen);

  return (
    <>
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
          <DuoPanel isOpen={isDuoSquadOpen} onClose={closeDuoSquad} />
        </div>
      )}

      {/* Main Router */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
          <Route path="/oauth-handler" element={<OAuthHandler />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/chat" element={<ProtectedChatRoute><Chat /></ProtectedChatRoute>} />
          <Route path="/matching" element={<Matching />} />
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
