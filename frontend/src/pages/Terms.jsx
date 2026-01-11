import { useNavigate } from 'react-router-dom'

const Terms = () => {
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
      <nav className="fixed top-0 w-full z-10 glass-panel border-b header-divider" style={{ 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)', 
        border: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
        background: 'rgba(5, 5, 5, 0.8)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
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
          <div className="legal-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 shadow-[0_0_10px_rgba(212,175,55,0.1)]" style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: 'rgb(212, 175, 55)'
          }}>
            <span className="material-symbols-outlined text-base">gavel</span>
            <span className="text-sm font-semibold">Legal Information</span>
          </div>
          <h1 className="font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">
            Terms &amp; <span style={{ 
              background: 'linear-gradient(to right, #FBF5D5, #D4AF37, #B29222)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Conditions</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform. Your access to Flinxx is conditioned on your acceptance of these terms.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto rounded-3xl p-1 shadow-2xl" style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.9)'
        }}>
          <div className="bg-black/80 rounded-2xl h-[900px] overflow-hidden relative backdrop-blur-sm">
            <div className="h-full w-full p-6 md:p-8 overflow-y-auto custom-scrollbar relative bg-gradient-to-br from-black to-[#050505]">
              <div className="max-w-3xl mx-auto space-y-10 pb-16">
                {/* Section 1 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>1. Acceptance of Terms</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    By accessing or using Flinxx, you agree to these Terms & Conditions and the Privacy Policy. If you do not agree, do not use the Service.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>2. Nature of the Service</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx is an anonymous communication platform that allows users to connect with strangers via text, audio, video, live streaming, and recorded interactions.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>3. Anonymity Disclaimer</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx does not require real names; however, anonymity is not guaranteed, and users may reveal their identity at their own risk.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>4. Recording, Streaming & Screenshots</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    By using Flinxx, you acknowledge and agree that other users may record, stream, screenshot, or broadcast interactions without prior notice.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>5. Platform Recording for Promotion</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    You expressly consent that Flinxx may record, store, edit, and use interactions (video, audio, or text) for platform operation, safety, analytics, and promotional purposes, without compensation.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>6. Implied Consent</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Your continued use of Flinxx constitutes implied and irrevocable consent to being recorded or streamed by users or the platform.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>7. No Expectation of Privacy</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Communications on Flinxx are not private or confidential. Content shared may become public.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>8. Age Restriction</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    You must be 18 years or older to use Flinxx. Minors are strictly prohibited.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>9. Prohibited Conduct</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Users must not engage in illegal activity, harassment, hate speech, sexual exploitation, impersonation, or any activity violating applicable laws.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>10. User Responsibility</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    You are solely responsible for your actions, behavior, and content while using the Service, including any recordings or streams you create.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>11. Third-Party Content Disclaimer</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx is not responsible for content recorded, streamed, or shared by users on third-party platforms.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>12. Limitation of Liability</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx shall not be liable for any direct or indirect damages arising from user interactions, recordings, streams, or promotional use of content.
                  </p>
                </div>

                {/* Section 13 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>13. Indemnification</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    You agree to indemnify and hold Flinxx harmless from any claims, losses, or legal actions arising from your use of the Service.
                  </p>
                </div>

                {/* Section 14 */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>14. Termination</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx may suspend or terminate access at any time, with or without notice, for any reason.
                  </p>
                </div>

                {/* Section 15 */}
                <div className="border-t pt-8" style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(212, 175, 55)' }}>15. Contact Information</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    For questions or concerns regarding these terms contact<br/>
                    support@flinxx.com
                  </p>
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
        .header-divider {
          z-index: 1;
        }
        .legal-badge {
          margin-top: 32px;
          position: relative;
          z-index: 20;
        }
        @media (max-width: 768px) {
          .legal-badge {
            margin-top: 40px;
          }
        }
      `}</style>
    </div>
  )
}

export default Terms
