import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import flinxxPremiumLogo from '../assets/flinxx-premium-logo.svg'

// VERCEL DEPLOYMENT: 2026-01-03 final home page update
const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartChat = () => {
    setIsLoading(true)
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex flex-col">
      {/* Header Navigation */}
      <div className="relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={flinxxPremiumLogo} alt="Flinxx" className="h-10" style={{ width: 'auto' }} />
            <span className="text-sm text-white/90">🟢 3,247 online</span>
          </div>
          
          <button 
            onClick={handleStartChat}
            className="text-white font-bold px-8 py-2 rounded-lg transition transform hover:scale-105 shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #FFB31A, #FF8A00)',
              boxShadow: '0 0 20px rgba(255, 139, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(90deg, #FF9900, #FF6A00)'}
            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(90deg, #FFB31A, #FF8A00)'}
          >
            Start Now
          </button>
        </div>
      </div>

      {/* Hero Section - Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
          Meet New People<br />Around the World
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-2xl">
          Connect instantly with strangers through video chat
        </p>
        <button 
          onClick={handleStartChat}
          disabled={isLoading}
          className="px-12 py-4 rounded-full bg-yellow-500 text-black font-bold text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? '⟳ Loading...' : 'Start Video Chat'}
        </button>

        {/* Quick Features Below Button */}
        <p className="text-white/70 text-sm mt-8">
          Fast, simple video chats • Real users, real time
        </p>
      </div>

      {/* Feature Cards Section - Compact at bottom */}
      <div className="relative z-10 px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Card - Instant Connection */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all inline-block w-full">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                ⚡
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-xl mb-1">Instant Connection</h3>
                <p className="text-white/80 text-sm">Connect with random strangers in seconds. No waiting, no hassle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Contact Us Button - Bottom Right */}
      <button
        onClick={() => window.location.href = '/contact'}
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-800 font-bold rounded-full shadow-lg transition-all transform hover:scale-110 hover:shadow-2xl"
        style={{ zIndex: 9999 }}
      >
        <span className="text-lg">💬</span>
        Contact Us
      </button>
    </div>
  )
}

export default Home
