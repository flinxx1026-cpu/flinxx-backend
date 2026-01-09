import React from 'react'
import './DesktopWaitingScreen.css'

function DesktopWaitingScreen({ onCancelSearch }) {
  return (
    <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      <div className="container mx-auto max-w-7xl z-10 w-full h-[85vh] flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side - Your Video */}
        <div className="w-full md:w-1/2 h-full flex flex-col relative group">
          <div className="relative w-full h-full border-2 border-primary/60 dark:border-primary/80 rounded-3xl overflow-hidden bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-primary">
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
              <div className="text-zinc-600 dark:text-zinc-700 flex flex-col items-center gap-2">
                <span className="material-icons-outlined text-6xl opacity-20">videocam_off</span>
              </div>
            </div>
            <div className="absolute bottom-6 left-6">
              <div className="px-4 py-1.5 rounded-full border border-primary/50 bg-black/60 text-primary text-sm font-medium backdrop-blur-sm shadow-lg">
                You
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Matching Screen */}
        <div className="w-full md:w-1/2 h-full flex flex-col relative group">
          <div className="relative w-full h-full border-2 border-primary/60 dark:border-primary/80 rounded-3xl overflow-hidden bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-primary flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
              <div className="relative z-10 transform transition-transform duration-700 hover:scale-110">
                <div className="text-6xl md:text-8xl filter drop-shadow-lg animate-bounce-slow" style={{ animationDuration: '3s' }}>
                  🔍
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-primary gold-text-glow tracking-tight">
                Looking for a partner...
              </h1>
              <p className="text-primary/70 text-lg md:text-xl font-light">
                Matching you with someone nearby
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 py-4">
              <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
              <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
              <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
            </div>
            <div className="pt-8 w-full max-w-xs">
              <button 
                onClick={onCancelSearch}
                className="w-full group relative px-8 py-3.5 bg-transparent overflow-hidden rounded-full border border-primary/40 hover:border-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-black"
              >
                <div className="absolute inset-0 w-0 bg-primary/10 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                <span className="relative text-primary/90 font-semibold tracking-wide group-hover:text-primary">
                  Cancel Search
                </span>
              </button>
            </div>
            <div className="absolute bottom-4 text-xs text-zinc-600 dark:text-zinc-700 max-w-md mx-auto">
              <p>By connecting, you agree to our Terms of Service & Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DesktopWaitingScreen
