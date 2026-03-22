import React from 'react'

const CommunityStandardsModal = ({ isOpen, onAccept }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ background: 'transparent', pointerEvents: 'none' }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      <div style={{ pointerEvents: 'auto' }}>
      
      <main className="w-full max-w-[480px] rounded-3xl p-8 relative z-10 my-8" style={{
        backgroundImage: 'linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(5,5,5,0.95) 100%)',
        border: '1px solid rgba(100, 100, 100, 0.3)'
      }}>
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold leading-tight text-white tracking-tight">
            Please review our Community Standards before continuing
          </h1>
        </header>

        {/* Content */}
        <div className="space-y-4">
          {/* Not Allowed Section */}
          <div className="group bg-black/40 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons-round text-red-500 text-2xl" style={{ textShadow: '0 0 8px rgba(239,68,68,0.3)' }}>block</span>
              <h2 className="font-bold text-gray-100 text-lg tracking-wide">Not allowed on Flinxx</h2>
            </div>
            <ul className="space-y-3 pl-1">
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" style={{ boxShadow: '0 0 5px rgba(239,68,68,0.5)' }}></span>
                Sexually explicit or adult material of any kind
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" style={{ boxShadow: '0 0 5px rgba(239,68,68,0.5)' }}></span>
                Platform access by individuals below 18 years of age
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" style={{ boxShadow: '0 0 5px rgba(239,68,68,0.5)' }}></span>
                Abusive, threatening, or harmful conduct
              </li>
            </ul>
          </div>

          {/* Expected Section */}
          <div className="group bg-black/40 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <span className="material-icons-round text-green-500 text-base font-bold">check</span>
              </div>
              <h2 className="font-bold text-gray-100 text-lg tracking-wide">What we expect from our community</h2>
            </div>
            <ul className="space-y-3 pl-1">
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" style={{ boxShadow: '0 0 5px rgba(16,185,129,0.5)' }}></span>
                Positive and respectful interactions
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" style={{ boxShadow: '0 0 5px rgba(16,185,129,0.5)' }}></span>
                Responsible and considerate communication
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" style={{ boxShadow: '0 0 5px rgba(16,185,129,0.5)' }}></span>
                Creating a safe experience for everyone
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8">
          <p className="text-xs text-gray-500 text-center mb-6 leading-relaxed px-2 font-medium">
            By proceeding, you acknowledge that you meet the age requirement (18+) and accept Flinxx's <a className="text-blue-400 hover:text-white transition-colors underline" href="/terms" style={{ textDecorationColor: 'rgba(99, 102, 241, 0.3)', textUnderlineOffset: '4px' }}>Terms & Conditions</a> and <a className="text-blue-400 hover:text-white transition-colors underline" href="/privacy-policy" style={{ textDecorationColor: 'rgba(99, 102, 241, 0.3)', textUnderlineOffset: '4px' }}>Privacy Policy</a>.
          </p>
          <button 
            onClick={onAccept}
            className="w-full font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden group transform hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(to right, #3B5BDB, #4F46E5, #3B5BDB)',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)'
            }}
          >
            <span className="relative z-10">Accept & Continue</span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
          </button>
        </footer>
      </main>
      </div>
    </div>
  )
}

export default CommunityStandardsModal
