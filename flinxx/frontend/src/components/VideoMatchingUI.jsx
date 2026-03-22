import React, { useState } from 'react'
import { useVideoMatching } from '../hooks/useVideoMatching'

/**
 * Video Matching UI Component
 * Displays matching interface with start, accept, decline buttons
 * After accept, shows video call connecting status
 * 
 * Props:
 * - userId: Current user's ID
 * - userProfile: User profile object with details
 */
const VideoMatchingUI = ({ userId, userProfile }) => {
  const {
    startMatching,
    acceptMatch,
    declineMatch,
    cancelMatching,
    matchedUser,
    isWaiting,
    loading,
    error,
    webrtcConnectData,  // 📡 Signal to start WebRTC connection
  } = useVideoMatching(userId, userProfile)

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    preferGender: false,
    preferCountry: false,
    genderFilter: null,
    countryFilter: null,
  })

  const handleStartMatching = () => {
    startMatching(filters)
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // 📡 If WebRTC connection data is available, show connecting status
  if (webrtcConnectData) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quick Videos</h2>
          <p className="text-gray-600 text-sm">Connecting to video call...</p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          {/* Animated Connection Icon */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">📹</span>
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center space-y-2">
            <p className="text-gray-700 font-semibold">Setting up video connection...</p>
            <p className="text-sm text-gray-600">
              {webrtcConnectData.isInitiator ? '📤 Sending offer...' : '📥 Waiting for offer...'}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Connected to: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{webrtcConnectData.partnerId?.substring(0, 8)}...</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            <p>💡 WebRTC connection is being established. This usually takes a few seconds.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quick Videos</h2>
        <p className="text-gray-600 text-sm">Find random video chat partners</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Idle State - Show Start Button */}
      {!matchedUser && !isWaiting && (
        <div className="space-y-4">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.preferGender}
                  onChange={(e) =>
                    handleFilterChange('preferGender', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Prefer opposite gender
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.preferCountry}
                  onChange={(e) =>
                    handleFilterChange('preferCountry', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Same country only
                </span>
              </label>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStartMatching}
            disabled={loading}
            className={`w-full py-3 px-4 font-bold rounded-lg transition ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Starting...' : 'Start Video Chat'}
          </button>
        </div>
      )}

      {/* Waiting State */}
      {isWaiting && !matchedUser && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 text-center">
              Searching for a match...
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              Usually takes a few seconds
            </p>
          </div>

          <button
            onClick={cancelMatching}
            className="w-full py-3 px-4 font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition active:scale-95"
          >
            Cancel Search
          </button>
        </div>
      )}

      {/* Match Found State */}
      {matchedUser && (
        <div className="space-y-4">
          {/* Match Card */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center space-x-4 mb-4">
              {matchedUser.profileImage && (
                <img
                  src={matchedUser.profileImage}
                  alt={matchedUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-bold text-gray-800">{matchedUser.name}</p>
                <p className="text-sm text-gray-600">
                  {matchedUser.country && matchedUser.country}
                </p>
              </div>
            </div>

            {matchedUser.interests && matchedUser.interests.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Interests
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchedUser.interests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={acceptMatch}
              className="w-full py-3 px-4 font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition active:scale-95"
            >
              ✓ Accept & Start Chat
            </button>

            <button
              onClick={declineMatch}
              className="w-full py-3 px-4 font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition active:scale-95"
            >
              ✗ Next Match
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Be respectful and follow community guidelines
        </p>
      </div>
    </div>
  )
}

export default VideoMatchingUI
