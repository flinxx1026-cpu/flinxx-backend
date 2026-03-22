import { useNavigate } from 'react-router-dom'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-black text-zinc-200 font-sans antialiased selection:bg-gold-500 selection:text-black relative" style={{ background: '#000000' }}>
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
              <img 
                src="/favicon.png" 
                alt="Flinxx Logo" 
                className="w-10 h-10 rounded-xl shadow-lg ring-2 ring-yellow-400/40 object-cover"
              />
              <span className="font-bold text-2xl tracking-tight text-white">
                Flinxx
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 max-w-3xl mx-auto flex flex-col items-center">
          <div className="legal-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 shadow-[0_0_10px_rgba(212,175,55,0.1)]" style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: 'rgb(212, 175, 55)'
          }}>
            <span className="material-symbols-outlined text-base">privacy_tip</span>
            <span className="text-sm font-semibold">Legal Information</span>
          </div>
          <h1 className="font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">
            Privacy <span style={{ 
              background: 'linear-gradient(to right, #FBF5D5, #D4AF37, #B29222)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Policy</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Please read this privacy policy carefully to understand how Flinxx handles your information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-black/40 border border-amber-700/30 rounded-2xl p-8">
          <div className="terms-content">
                {/* Section 1 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    This Privacy Policy explains how Flinxx handles user information when you access or use the platform. Flinxx is owned and operated by Nikhil Yadav and provides a platform where users can interact with strangers through random text, audio, or video conversations online. By using Flinxx, you agree to this Privacy Policy. If you do not agree with this policy, you should discontinue using the website.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx is a live interaction platform and because of the nature of real-time communication, complete privacy cannot be guaranteed. Users may record, screenshot, stream, or share interactions on external platforms without notice. Flinxx does not control or monitor every user interaction and cannot guarantee that content shared during a session will remain private.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx does not require users to reveal their real identity. Users may remain anonymous or use pseudonyms. If a user voluntarily shares personal information such as their real name, social media accounts, contact details, or identity during conversations, they do so entirely at their own risk. Flinxx does not encourage the sharing of personal identity information and is not responsible for any consequences that arise from such disclosure.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    For safety, moderation, and service improvement, Flinxx may monitor certain interactions or technical data related to the use of the platform. This helps maintain community standards, detect misuse, and improve the service. However, monitoring does not guarantee that all content or interactions are reviewed.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx is not responsible for any recordings, screenshots, or content that users may distribute outside the platform on social media or other websites. Any content shared externally is the responsibility of the user who created or shared it. By continuing to use Flinxx, users acknowledge and accept the risks associated with live online interactions.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx may update this Privacy Policy from time to time to reflect changes in platform features or legal requirements. Continued use of the platform after updates indicates acceptance of the revised policy. For any privacy-related questions or support requests, please contact us at <a href="mailto:contact.flinxx@gmail.com" className="text-white hover:underline">contact.flinxx@gmail.com</a>.
                  </p>
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
        .terms-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: auto;
          overflow: visible;
        }
        .terms-content p {
          margin-bottom: 10px;
          line-height: 1.6;
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

export default PrivacyPolicy
