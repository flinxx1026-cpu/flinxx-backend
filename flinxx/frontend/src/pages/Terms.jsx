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
                {/* Section 1 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    By accessing or using Flinxx, you agree to comply with and be bound by these Terms & Conditions and our Privacy Policy. Flinxx is operated and owned by Nikhil Yadav, who is the legal owner and operator of the platform. If you do not agree with any part of these terms, you must immediately discontinue using the service. For any questions, concerns, or support requests regarding the platform, users may contact us through our official email <a href="mailto:contact.flinxx@gmail.com" className="text-white hover:underline">contact.flinxx@gmail.com</a> using the Contact Us option available on the website.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx is an online communication platform that allows users to interact with random strangers through text, audio, or video conversations over the internet. The platform is designed solely for social communication and entertainment purposes. Flinxx is not a dating website or dating service, and the platform does not promote matchmaking, romantic relationships, or partner finding. Users are connected randomly with other users and any interaction that occurs between users is solely the responsibility of the participating individuals.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Users must be 18 years of age or older to access or use the Flinxx platform. By continuing to use the website, you confirm that you are legally an adult according to the laws applicable in your jurisdiction. Individuals under the age of 18 are strictly prohibited from accessing the service. If it is discovered that a minor is using the platform, Flinxx reserves the right to immediately restrict, suspend, or permanently ban access.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx allows users to communicate without mandatory identity verification, and users may choose to remain anonymous or use pseudonyms. However, anonymity cannot be guaranteed. Users assume full responsibility for any personal information they choose to share during conversations. Any information disclosed during sessions may become visible to other users and Flinxx is not responsible for any consequences resulting from such disclosure.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    By using Flinxx, you acknowledge and consent that other users may record, stream, capture screenshots, or broadcast interactions without prior notice or permission. Such recordings may be shared on external platforms including social media or other websites. Your use of Flinxx constitutes full and irrevocable consent to the possibility of such actions, and Flinxx is not responsible for the distribution, editing, or reuse of any recordings made by other users.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    You further acknowledge and agree that Flinxx may record, store, review, edit, and use interactions including video, audio, or text communications for purposes such as platform operations, safety monitoring, moderation, analytics, marketing, or promotional activities. By continuing to use the service, you grant Flinxx permission to use such interactions without compensation or additional notice.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Your continued use of the platform after viewing or being notified of these terms constitutes implied, voluntary, and irrevocable consent to the possibility of being recorded, streamed, or shared by other users or by the platform itself. Users who do not agree with these conditions must discontinue use of the service.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Users should understand that there is no expectation of privacy while using Flinxx. Communications, video sessions, audio conversations, and text messages may be recorded or shared by other participants or third parties. Content shared on the platform may become public and may be redistributed without the control of Flinxx.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Flinxx is not responsible for the actions, conduct, or content of other users on the platform. Users interact at their own risk. Flinxx does not endorse any content, statements, or actions made by other users and is not liable for any harm, defamation, harassment, or other negative consequences resulting from user interactions.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    Users agree to comply with all applicable laws and regulations while using Flinxx. Any use of the platform for illegal activities, harassment, abuse, exploitation, or violation of others' rights is strictly prohibited. Flinxx reserves the right to investigate, suspend, or permanently ban users who violate these terms or engage in harmful behavior.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    These Terms & Conditions may be updated or modified at any time without prior notice. Continued use of the platform after updates indicates your acceptance of the revised terms. Users are responsible for regularly reviewing these terms to stay informed of any changes.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <p className="text-zinc-300 leading-relaxed text-base font-light">
                    By using Flinxx, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you have any questions or concerns about these terms, please contact us at <a href="mailto:contact.flinxx@gmail.com" className="text-white hover:underline">contact.flinxx@gmail.com</a>.
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
