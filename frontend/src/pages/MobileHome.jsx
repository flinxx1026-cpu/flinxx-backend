import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import React from 'react'
import './MobileHome.css'

/**
 * MobileHome - Mobile Dashboard Component
 * This component displays the dashboard UI for mobile devices (< 769px)
 * It should be used ONLY in the chat/dashboard area after user login
 * NOT on the home landing page
 */
const MobileHome = ({ user, onStartChat, onModeChange, localStreamRef, cameraStarted }) => {
  const navigate = useNavigate()
  const [gameMode, setGameMode] = useState('solo')

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat(gameMode)
    } else {
      navigate('/matching', { replace: true })
    }
  }

  const handleModeChange = (mode) => {
    setGameMode(mode)
    if (onModeChange) {
      onModeChange(mode)
    }
  }

  const handleVideoRef = React.useCallback((videoElement) => {
    if (!videoElement) return;
    
    if (localStreamRef?.current && videoElement.srcObject !== localStreamRef.current) {
      videoElement.srcObject = localStreamRef.current;
      videoElement.muted = true;
      videoElement.play().catch(err => {
        console.warn('📱 [MOBILE HOME] Play warning:', err.message);
      });
    }
  }, [localStreamRef]);

  return (
    <div className="mobile-home-container">
      <style>{`
        .text-metallic {
          background: linear-gradient(to bottom, #FDE047, #EAB308, #CA8A04);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-metallic {
          background: linear-gradient(135deg, #b47d04 0%, #EAB308 20%, #FDE047 50%, #EAB308 80%, #b47d04 100%);
          background-size: 200% 200%;
          animation: shine 4s ease-in-out infinite;
        }
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .grid-bg {
          background-size: 24px 24px;
        }
        .shadow-glow-gold {
          box-shadow: 0 0 15px rgba(234, 179, 8, 0.3);
        }
        .shadow-inner-gold {
          box-shadow: inset 0 0 12px rgba(234, 179, 8, 0.1);
        }
      `}</style>

      <div className="absolute inset-0 bg-subtle-grain opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark grid-bg opacity-20 pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none z-0"></div>
      
      <div className="h-6 w-full z-10"></div>

      {/* Header Navigation */}
      <header className="relative z-10 px-6 pt-6 pb-2">
        <nav className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
          <button className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden" title="Profile">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">person</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden" title="Search">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">search</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden" title="Favorites">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">favorite</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden" title="Messages">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">chat_bubble</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden" title="Awards">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">emoji_events</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden" title="Activity">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">timer</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 pt-8 pb-6 overflow-y-auto no-scrollbar">
        {/* Flinxx Logo */}
        <div className="mb-10 text-center relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
          <h1 className="font-display text-5xl text-metallic drop-shadow-sm tracking-wide relative z-10">Flinxx</h1>
        </div>

        {/* Mode Selection Buttons */}
        <div className="flex gap-4 w-full justify-center mb-10 max-w-[280px]">
          <button 
            onClick={() => handleModeChange('solo')}
            className={`flex-1 ${gameMode === 'solo' ? 'btn-metallic text-gray-900' : 'bg-transparent border border-primary/50 text-gray-800 dark:text-[#EAB308] hover:bg-primary/5 hover:border-primary/80'} font-bold py-3 px-4 rounded-xl shadow-[0_4px_15px_rgba(234,179,8,0.3)] border border-yellow-300/50 transform active:scale-95 transition-all relative overflow-hidden`}
          >
            <span className="relative z-10">SoloX</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          <button 
            onClick={() => handleModeChange('duo')}
            className={`flex-1 ${gameMode === 'duo' ? 'btn-metallic text-gray-900' : 'bg-transparent border border-primary/50 text-gray-800 dark:text-[#EAB308] hover:bg-primary/5 hover:border-primary/80'} font-bold py-3 px-4 rounded-xl shadow-inner-gold backdrop-blur-sm transform active:scale-95 transition-all`}
          >
            DuoX
          </button>
        </div>

        {/* Start Video Chat Button */}
        <button 
          onClick={handleStartChat}
          className="w-full max-w-[280px] btn-metallic text-gray-950 font-bold text-lg py-4 px-6 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] border-t border-yellow-200/50 flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all mb-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
          <span className="material-symbols-outlined text-gray-900 text-3xl relative z-10">movie</span>
          <span className="relative z-10">Start Video Chat</span>
        </button>

        {/* Camera Preview */}
        <div className="w-full flex-1 min-h-[220px] rounded-3xl overflow-hidden relative border border-gray-300 dark:border-primary/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] group">
          <video
            ref={handleVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundColor: '#000' }}
          />
          {!cameraStarted && (
            <img 
              alt="Your video preview" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL4aKLR9wxfBpOGbKDML1uPyd01j-nlKQUaqncv8UO0XQPazYIC3UxkLOsQ4PDgqjrzEOT2AXaVO8JyUTprnRNeO1s8ky1zRy097myCLuEQj6BzJU2uGebRocr0ujkDGF_qnErXShu-bOwzbtNyoS-EVw7Zf9SHFx8rC9VEXDImgNPGP33R7AA7N8hdWRucQ4Ml5tRNRrTmvf0GFlkLXU4IzZB9rMakuwP1Qh4f5LtWrFeCFObJe-vYlID5UbKBIxWK75ldAkZvw"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white/90 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-2 border border-white/10 shadow-lg ring-1 ring-white/5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            YOU
          </div>
        </div>
      </main>
    </div>
  )
}

export default MobileHome
