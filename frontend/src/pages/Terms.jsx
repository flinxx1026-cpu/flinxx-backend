import { useNavigate } from 'react-router-dom'

const Terms = () => {
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

        <div className="max-w-4xl mx-auto bg-black/40 border border-amber-700/30 rounded-2xl p-8">
          <div className="terms-content">
                {/* Introduction */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    By accessing or using Flinxx, you agree to comply with and be bound by these Terms & Conditions and our Privacy Policy. Flinxx is operated and owned by Nikhil Yadav. If you do not agree with any part of these terms, you must immediately discontinue using the service. Official contact: <a href="mailto:contact.flinxx@gmail.com" className="text-white hover:underline">contact.flinxx@gmail.com</a>.
                  </p>
                </div>

                {/* User Safety & Moderation */}
                <div className="mt-8 border-l-2 border-emerald-500/50 pl-6">
                  <h3 className="text-emerald-400 font-bold text-xl mb-3">User Safety & Moderation</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx prioritizes user safety above all else. We maintain active moderation systems, including real-time reporting tools and user blocking features, to prevent any form of misuse. 
                    <strong> Any user found engaging in inappropriate behavior, harassment, or illegal activity will be immediately suspended or permanently banned from the platform.</strong>
                  </p>
                </div>

                {/* Content Policy */}
                <div className="mt-8 border-l-2 border-red-500/50 pl-6">
                  <h3 className="text-red-400 font-bold text-xl mb-3">Content Policy</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light mb-3">
                    Flinxx maintains a zero-tolerance policy regarding prohibited content. The following are strictly forbidden:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 font-light ml-4">
                    <li><strong className="text-zinc-100">Adult or Explicit Content:</strong> Any form of nudity, sexual behavior, or sexually suggestive content is strictly prohibited.</li>
                    <li><strong className="text-zinc-100">Harassment or Abuse:</strong> We do not tolerate bullying, hate speech, or offensive language targeting any individual or group.</li>
                    <li><strong className="text-zinc-100">Illegal Activity:</strong> Any use of the platform for unlawful purposes or to promote illegal acts is forbidden.</li>
                  </ul>
                </div>

                {/* Nature of Service */}
                <div className="mt-8 border-l-2 border-blue-500/50 pl-6">
                  <h3 className="text-blue-400 font-bold text-xl mb-3">Nature of Service</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx is a social communication platform designed for entertainment and video chatting with people globally. 
                    <strong> It is NOT a dating platform, NOT an adult service, and DOES NOT facilitate adult-oriented interactions.</strong> 
                    Our goal is to provide a clean, safe, and fun environment for random video communication.
                  </p>
                </div>

                {/* Eligibility */}
                <div className="mt-8 border-l-2 border-amber-500/50 pl-6">
                  <h3 className="text-amber-400 font-bold text-xl mb-3">Eligibility (18+)</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Use of Flinxx is strictly restricted to individuals aged 18 and older. By using this platform, you represent and warrant that you meet this age requirement. Underage users will be banned immediately upon discovery.
                  </p>
                </div>

                {/* Legal Compliance */}
                <div className="mt-8 border-l-2 border-zinc-500/50 pl-6">
                  <h3 className="text-zinc-100 font-bold text-xl mb-3">Legal Compliance</h3>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Users MUST comply with all applicable local, national, and international laws while using Flinxx. We reserve the right to cooperate with legal authorities and provide necessary information if required by law to address illegal activities on the platform.
                  </p>
                </div>

                {/* Final Agreement */}
                <div className="mt-8 pt-6 border-t border-amber-700/20">
                  <p className="text-zinc-400 leading-relaxed text-sm font-light italic">
                    By using Flinxx, you acknowledge that you have read and understood these terms. We may update these policies periodically to reflect service improvements or legal updates. Continued use of Flinxx constitutes acceptance of the latest Terms & Conditions.
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

export default Terms
