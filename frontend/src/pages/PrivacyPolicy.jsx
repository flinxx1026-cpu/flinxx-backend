import { useNavigate } from 'react-router-dom'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-black text-zinc-200 min-h-screen font-sans antialiased selection:bg-gold-500 selection:text-black relative overflow-hidden" style={{ background: '#000000' }}>
      {/* Background Blur Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-900/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] left-[40%] w-[30vw] h-[30vw] bg-amber-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b" style={{ 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)', 
        border: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
        background: 'rgba(5, 5, 5, 0.8)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ 
                background: 'linear-gradient(135deg, #DEB72B 0%, #B29222 100%)',
                boxShadow: 'rgb(212, 175, 55) 0px 0px 20px'
              }}>
                <span className="material-symbols-outlined text-black text-xl font-bold">videocam</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Flinxx
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h1 className="font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">
            Privacy <span style={{ 
              background: 'linear-gradient(to right, #FBF5D5, #D4AF37, #B29222)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Policy</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Your privacy is paramount. Experience Flinxx with confidence, knowing how we protect your luxury of connection.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto rounded-3xl p-1 shadow-2xl" style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.9)'
        }}>
          <div className="bg-black/80 rounded-2xl overflow-hidden relative backdrop-blur-sm">
            <div className="w-full p-8 md:p-12 overflow-y-auto custom-scrollbar relative bg-gradient-to-br from-black to-[#050505] max-h-[70vh]">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Introduction */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                    <span className="w-1 h-8 rounded-full block" style={{ background: 'linear-gradient(135deg, #DEB72B 0%, #B29222 100%)' }}></span>
                    Introduction
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    By accessing or using <strong className="font-semibold" style={{ color: 'rgb(212, 175, 55)' }}>Flinxx</strong>, you agree to this Privacy Policy. Flinxx is a premium live interaction platform. Due to the inherent nature of live streaming, we emphasize that absolute privacy in public rooms cannot be guaranteed.
                  </p>
                </div>

                {/* Live Content Warning */}
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: 'rgb(212, 175, 55)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'rgb(222, 183, 43)' }}>warning_amber</span>
                    Live Content Warning
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx hosts live interactions. You understand that other users may record, capture, or share interactions without your explicit consent on external platforms. Please exercise discretion.
                  </p>
                </div>

                {/* User Responsibility */}
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">User Responsibility</h3>
                  <p className="text-zinc-300 leading-relaxed mb-4 text-base font-light">
                    You are the guardian of your own privacy. Flinxx assumes no liability for recordings made by third parties.
                  </p>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Your interactions may be monitored for quality assurance, safety, and compliance with our premium community standards.
                  </p>
                </div>

                {/* Liability */}
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">Liability</h3>
                  <ul className="space-y-4 list-none pl-0">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 text-lg" style={{ color: 'rgb(222, 183, 43)' }}>check_circle</span>
                      <span className="text-zinc-300 font-light">Flinxx is not liable for content distributed outside the platform.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 text-lg" style={{ color: 'rgb(222, 183, 43)' }}>check_circle</span>
                      <span className="text-zinc-300 font-light">Usage of the platform constitutes acceptance of these risks.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 text-lg" style={{ color: 'rgb(222, 183, 43)' }}>check_circle</span>
                      <span className="text-zinc-300 font-light">We do not endorse user-generated content.</span>
                    </li>
                  </ul>
                </div>

                {/* Footer with Buttons */}
                <div className="border-t pt-8 mt-10" style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <p className="text-sm text-zinc-500 italic mb-6">
                    If you have questions regarding this policy, please contact our concierge support.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => navigate('/', { replace: true })}
                      className="px-8 py-3 text-black rounded-xl font-bold transition-all shadow-lg active:scale-95"
                      style={{ 
                        background: 'linear-gradient(to right, #AA8C2C, #D4AF37, #AA8C2C)',
                        filter: 'brightness(1)'
                      }}
                      onMouseOver={(e) => e.target.style.filter = 'brightness(1.1)'}
                      onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
                    >
                      Accept Policy
                    </button>
                    <button 
                      onClick={() => navigate('/', { replace: true })}
                      className="px-8 py-3 rounded-xl font-medium transition-colors border"
                      style={{ 
                        background: 'transparent',
                        color: 'rgb(212, 175, 55)',
                        borderColor: 'rgba(212, 175, 55, 0.3)'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(212, 175, 55, 0.05)'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(222, 183, 43, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #594911;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D4AF37;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default PrivacyPolicy
