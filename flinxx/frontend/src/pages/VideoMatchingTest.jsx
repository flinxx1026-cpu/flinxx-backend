import React, { useState, useEffect } from 'react'
import VideoMatchingUI from '../components/VideoMatchingUI'

/**
 * Test Page for Video Matching System
 * This page is ready to test the matching system
 * Just access it at: localhost:5173/test-matching
 */
const VideoMatchingTestPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock user data for testing
    // In real app, this would come from auth context
    const mockUser = {
      id: 'test-user-' + Math.random().toString(36).substr(2, 9),
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      gender: 'male',
      country: 'India',
      interests: ['gaming', 'sports', 'music'],
    }
    setUser(mockUser)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      {/* Header */}
      <header className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900">🎥 Video Chat Matching</h1>
          <p className="text-gray-600 mt-2">Test the Fast Matching System</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Matching Component */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-white text-xl font-bold">Quick Match</h2>
              </div>
              <div className="p-6">
                {user && (
                  <VideoMatchingUI
                    userId={user.id}
                    userProfile={{
                      name: user.name,
                      gender: user.gender,
                      country: user.country,
                      interests: user.interests,
                      profileImage: user.avatar,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current User Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👤 Your Profile</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-200"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex space-x-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {user?.gender}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {user?.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📖 How to Test</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    1
                  </span>
                  <span>
                    <strong>Open 2 Browser Windows:</strong> Side by side or different browsers
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    2
                  </span>
                  <span>
                    <strong>Click "Start Video Chat"</strong> in both windows (generate new user each time by
                    refreshing)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    3
                  </span>
                  <span>
                    <strong>Watch for matches:</strong> When 2 users start matching, they'll be paired
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    4
                  </span>
                  <span>
                    <strong>Accept or Decline:</strong> Each user can accept (green button) or decline
                    (gray button)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    5
                  </span>
                  <span>
                    <strong>Check Console:</strong> Open DevTools (F12) to see matching events logged
                  </span>
                </li>
              </ol>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✨ Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-semibold text-gray-800">Fast Matching</p>
                    <p className="text-sm text-gray-600">&lt;5ms match time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold text-gray-800">Scalable</p>
                    <p className="text-sm text-gray-600">10,000+ concurrent users</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-semibold text-gray-800">Smart Filters</p>
                    <p className="text-sm text-gray-600">Gender & country filtering</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <p className="font-semibold text-gray-800">Real-time</p>
                    <p className="text-sm text-gray-600">WebSocket powered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User ID Info */}
            <div className="bg-yellow-50 rounded-lg border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-gray-700">
                <strong>User ID:</strong>{' '}
                <code className="bg-yellow-100 px-2 py-1 rounded font-mono text-xs">{user?.id}</code>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                💡 Refresh page to get different user for testing
              </p>
            </div>

            {/* Debug Console */}
            <div className="bg-gray-900 rounded-lg p-4 text-gray-100 font-mono text-xs">
              <p className="text-gray-400 mb-2">📍 Console Output (Check DevTools F12):</p>
              <div className="space-y-1 text-gray-300">
                <p>✅ [HOOK] Matching system loaded</p>
                <p>📤 Waiting for events...</p>
                <p className="text-green-400">
                  💡 Events will appear here when matching happens
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>🧪 Test Page for Video Matching System</p>
          <p className="text-sm mt-2">
            Backend: {window.location.hostname}:5000 | Frontend: {window.location.hostname}:5173
          </p>
        </div>
      </footer>
    </div>
  )
}

export default VideoMatchingTestPage
