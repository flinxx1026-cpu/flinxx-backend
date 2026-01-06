import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../services/socketService'
import flinxxLogo from '../assets/flinxx-logo.svg'
import MobileWaitingScreen from './MobileWaitingScreen'

const Matching = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769)
  const [countdown, setCountdown] = useState(5)
  const [isAutoNext, setIsAutoNext] = useState(true)
  const [userProfiles, setUserProfiles] = useState([
    { id: 1, username: 'Alex_24', name: 'Alex', age: 24, country: 'USA', avatar: '👨', status: 'Online' },
    { id: 2, username: 'Jordan_22', name: 'Jordan', age: 22, country: 'UK', avatar: '👩', status: 'Online' },
    { id: 3, username: 'Casey_25', name: 'Casey', age: 25, country: 'Canada', avatar: '🧑', status: 'Online' },
    { id: 4, username: 'Morgan_23', name: 'Morgan', age: 23, country: 'Australia', avatar: '👩‍🦱', status: 'Online' },
    { id: 5, username: 'Taylor_26', name: 'Taylor', age: 26, country: 'Germany', avatar: '👨‍🦲', status: 'Online' },
    { id: 6, username: 'Alex_27', name: 'Alex', age: 27, country: 'France', avatar: '👨', status: 'Online' },
    { id: 7, username: 'Sam_21', name: 'Sam', age: 21, country: 'Canada', avatar: '👩', status: 'Online' },
    { id: 8, username: 'Chris_28', name: 'Chris', age: 28, country: 'Japan', avatar: '👨‍🦱', status: 'Online' },
  ])
  const [currentIndex, setCurrentIndex] = useState(0)
  const countdownRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Countdown timer for auto-next
  useEffect(() => {
    if (isAutoNext && countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (isAutoNext && countdown === 0) {
      handleNext()
      setCountdown(5)
    }

    return () => clearTimeout(countdownRef.current)
  }, [countdown, isAutoNext])

  const handleNext = () => {
    if (currentIndex < userProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setCountdown(5)
      setIsAutoNext(true)
    } else {
      // Loop back to start
      setCurrentIndex(0)
      setCountdown(5)
      setIsAutoNext(true)
    }
  }

  // Show mobile waiting screen on mobile
  if (isMobile) {
    return <MobileWaitingScreen onCancel={() => navigate('/login', { replace: true })} />
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleConnect = () => {
    // Emit event to backend to initiate connection
    socket.emit('connect_user', { targetUserId: userProfiles[currentIndex].id })
    // Navigate to chat
    navigate('/chat')
  }

  const currentUser = userProfiles[currentIndex]
  const nextUser = userProfiles[(currentIndex + 1) % userProfiles.length]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex flex-col">
      {/* Header */}
      <div className="relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={flinxxLogo} alt="Flinxx" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-white">Flinxx</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-white font-semibold hover:text-white/80 transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Profile Card Stack */}
          <div className="relative h-[600px] mb-8">
            {/* Background card (next user) */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 transform scale-95 translate-y-4 opacity-50">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    {nextUser.name}, {nextUser.age}
                  </h3>
                  <p className="text-white/70 text-sm mb-6">📍 {nextUser.country}</p>
                </div>
                <div className="text-center opacity-50">
                  <p className="text-white/50 text-sm">Next up...</p>
                </div>
              </div>
            </div>

            {/* Front card (current user) */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md rounded-3xl border-2 border-white/30 p-8 flex flex-col justify-between shadow-2xl hover:border-white/50 transition-all duration-300">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-blue-600/50 border-4 border-white/40 text-white">
                  {currentUser.avatar}
                </div>
              </div>

              {/* User Profile Content */}
              <div>
                <h2 className="text-white font-black text-3xl mb-1">
                  {currentUser.name}
                </h2>
                <p className="text-white/90 text-2xl font-bold mb-2">{currentUser.age}</p>
                <p className="text-white/80 text-base mb-2">📍 {currentUser.country}</p>
                <p className="text-white/70 text-sm mb-6">@{currentUser.username}</p>
                
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                    <p className="text-white/70 text-xs">Status</p>
                    <p className="text-white font-bold text-sm">🟢 {currentUser.status}</p>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      opacity="0.2"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray={`${(5 - countdown) / 5 * 226.2} 226.2`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-2xl">{countdown}</span>
                  </div>
                </div>
              </div>

              {/* Auto-Next Status */}
              {isAutoNext && (
                <div className="text-center">
                  <p className="text-blue-400 text-sm font-semibold animate-pulse">
                    ⚡ Auto-next in {countdown}s
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-4 bg-white/20 hover:bg-white/30 border-2 border-white/40 hover:border-white/60 rounded-full font-bold text-white transition-all transform hover:scale-105 backdrop-blur"
            >
              👉 Skip
            </button>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xl shadow-blue-600/30 transition-all transform hover:scale-105"
            >
              💬 Connect
            </button>
          </div>

          {/* Toggle Auto-Next */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsAutoNext(!isAutoNext)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                isAutoNext
                  ? 'bg-blue-600/30 text-blue-200 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 border border-white/20'
              }`}
            >
              {isAutoNext ? '⚡ Auto-Next ON' : '⏸️ Auto-Next OFF'}
            </button>
          </div>

          {/* Profile Counter */}
          <div className="mt-4 text-center">
            <p className="text-white/70 text-sm">
              Showing {currentIndex + 1} of {userProfiles.length} profiles
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Matching
