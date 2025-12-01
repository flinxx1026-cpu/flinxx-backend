import ErrorBoundary from './ErrorBoundary'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Chat from '../pages/Chat'
import Matching from '../pages/Matching'
import Profile from '../pages/Profile'
import AuthCallback from '../pages/AuthCallback'
import Callback from '../pages/auth/callback'
import './Layout.css'

function Layout() {
  return (
    <ErrorBoundary>
      <Router>
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-indigo-400 mb-4">404</h1>
      <p className="text-gray-300 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold">
        Go Home
      </a>
    </div>
  </div>
)

export default Layout
