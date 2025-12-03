import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import flinxxLogo from '../assets/flinxx-logo.svg'

const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartChat = () => {
    setIsLoading(true)
    setTimeout(() => {
      navigate('/login')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
      {/* Header Navigation */}
      <div className="relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6 flex justify-between items-center max-w-full">
          <div className="flex items-center gap-3">
            <img src={flinxxLogo} alt="Flinxx" className="w-10 h-10" />
            <h2 className="text-2xl font-bold text-white">Flinxx</h2>
            <span className="text-sm text-white/90 ml-4">🟢 3,247 online</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleStartChat}
              className="text-white font-bold px-6 py-2 rounded-lg transition transform hover:scale-105 shadow-lg"
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[500px] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-3xl">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Meet New People<br />Around the World
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/90 mb-10">
            Connect instantly with strangers through video chat
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStartChat}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-lg transition-all transform hover:scale-105 mb-12 ${
              isLoading
                ? 'cursor-not-allowed text-gray-700'
                : 'text-white'
            }`}
            style={isLoading ? { backgroundColor: '#9CA3AF' } : {
              background: 'linear-gradient(90deg, #FFB31A, #FF8A00)',
              boxShadow: '0 0 30px rgba(255, 139, 0, 0.4)'
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.background = 'linear-gradient(90deg, #FF9900, #FF6A00)')}
            onMouseLeave={(e) => !isLoading && (e.target.style.background = 'linear-gradient(90deg, #FFB31A, #FF8A00)')}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⟳</span> Starting Chat...
              </>
            ) : (
              <>
                <span>⚡</span> Start Chatting Now
              </>
            )}
          </button>

          {/* Info Text */}
          <p className="text-white/80 text-sm">
            Fast, simple video chats • Real users, real time
          </p>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-10 px-4 py-16 bg-gradient-to-b from-transparent via-purple-600/50 to-purple-700">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Card 1 - Instant Connection */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-lg">
                ⚡
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-2xl mb-2">Instant Connection</h3>
                <p className="text-white/80 text-base">Connect with random strangers in seconds. No waiting, no hassle.</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Global Community */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-pink-400 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                👥
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-2xl mb-2">Global Community</h3>
                <p className="text-white/80 text-base">Meet people from all over the world. Make international friends.</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Safe & Verified */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                ✓
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-2xl mb-2">Safe & Verified</h3>
                <p className="text-white/80 text-base">Verified users, moderated content, and privacy protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 px-4 py-20 bg-gradient-to-b from-purple-700 via-purple-600 to-purple-500">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-black text-white text-center mb-16">How It Works</h2>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Sign Up</h3>
                <p className="text-white/80 text-base">Create your free account in seconds</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Start Video Chat</h3>
                <p className="text-white/80 text-base">Get matched with random strangers instantly</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Make Friends</h3>
                <p className="text-white/80 text-base">Chat, connect, and meet awesome people</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="relative z-10 px-4 py-20 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-black text-white text-center mb-16">Smart Matching Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* One-Click Connect */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                ⚡
              </div>
              <h3 className="text-white font-bold text-2xl mb-4">One-Click Connect</h3>
              <p className="text-white/80 text-base mb-4">Connect with strangers instantly with just one click. No complicated setup needed.</p>
              <div className="inline-block bg-blue-600/20 text-blue-200 px-4 py-1 rounded-full text-sm font-semibold">
                Free
              </div>
            </div>

            {/* Auto-Matching */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                🤖
              </div>
              <h3 className="text-white font-bold text-2xl mb-4">Auto-Matching</h3>
              <p className="text-white/80 text-base mb-4">Our intelligent algorithm matches you with compatible users based on interests and preferences.</p>
              <div className="inline-block bg-blue-600/20 text-blue-200 px-4 py-1 rounded-full text-sm font-semibold">
                Free
              </div>
            </div>

            {/* Gender Preference Filter */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all md:col-span-2">
              <div className="w-14 h-14 bg-purple-400 rounded-xl flex items-center justify-center text-3xl mb-6">
                👥
              </div>
              <h3 className="text-white font-bold text-2xl mb-4">Gender Preference Filter</h3>
              <p className="text-white/80 text-base mb-4">Fine-tune your matching experience with optional gender preferences. Available in Premium.</p>
              <div className="inline-block bg-purple-400/30 text-purple-200 px-4 py-1 rounded-full text-sm font-semibold border border-purple-400/50">
                💎 Premium Feature
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 px-4 py-20 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Meet New People?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of users connecting right now
          </p>
          <button
            onClick={handleStartChat}
            disabled={isLoading}
            className={`inline-flex items-center gap-3 px-10 py-4 text-xl font-bold rounded-lg transition-all transform hover:scale-105 ${
              isLoading
                ? 'cursor-not-allowed text-gray-700'
                : 'text-white'
            }`}
            style={isLoading ? { backgroundColor: '#9CA3AF' } : {
              background: 'linear-gradient(90deg, #FFB31A, #FF8A00)',
              boxShadow: '0 0 30px rgba(255, 139, 0, 0.4)'
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.background = 'linear-gradient(90deg, #FF9900, #FF6A00)')}
            onMouseLeave={(e) => !isLoading && (e.target.style.background = 'linear-gradient(90deg, #FFB31A, #FF8A00)')}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⟳</span> Starting Chat...
              </>
            ) : (
              <>
                <span>📹</span> Get Started Free
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
