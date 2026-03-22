import { useNavigate } from 'react-router-dom'

const CommunityGuidelines = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-y-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #080808;
          color: #ffffff;
        }

        .gold-gradient-text {
          background: linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #080808;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>

      {/* Header */}
      <header className="w-full border-b border-zinc-800/50 py-4 px-6 md:px-12 flex items-center justify-between bg-black sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <img src="/favicon.png" alt="Flinxx Logo" className="w-8 h-8 object-contain" />
          {/* Logo Text */}
          <span className="text-2xl font-bold tracking-tight text-white">Flinxx</span>
        </div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 pb-24 px-6">
        {/* Legal Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-600/40 bg-yellow-600/5 mb-8">
          <span style={{ color: '#D4AF37' }}>⚖️</span>
          <span className="text-yellow-600 text-sm font-medium uppercase tracking-wider">Legal Information</span>
        </div>

        {/* Page Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center gold-gradient-text">
          Community Guidelines
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-center max-w-2xl mb-12 text-lg leading-relaxed">
          Please read our Community Guidelines carefully before using Flinxx. By continuing, you agree to follow these guidelines and help keep the platform safe and respectful for everyone.
        </p>

        {/* Content Container */}
        <div className="w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 md:p-12 shadow-2xl">
          <div className="space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
            {/* Paragraph 1 - Welcome and Core Values */}
            <p>
              Welcome to Flinxx! Our goal is to create a safe, respectful, and enjoyable environment where people can connect through random video and text chats. By using Flinxx, you agree to follow these community guidelines. All users must treat others with respect, and any form of harassment, bullying, threats, or abusive language is strictly prohibited. Flinxx is only intended for users who are 18 years or older, and anyone under 18 is not allowed to use the platform. Nudity, sexually explicit behavior, or any inappropriate adult content is not permitted. We also strictly prohibit hate speech or content that promotes discrimination or violence based on race, religion, gender, nationality, or sexual orientation.
            </p>

            {/* Paragraph 2 - User Conduct and Safety */}
            <p>
              Users must not engage in illegal activities such as scams, fraud, or sharing illegal content on the platform. For your safety, never share personal information like phone numbers, home addresses, passwords, or financial details with strangers. Spamming, advertising services, or repeatedly sharing promotional links is also not allowed. Anyone who violates these guidelines may face actions such as warnings, temporary restrictions, suspension, or permanent bans from Flinxx. If you encounter behavior that violates these rules, please use the Report feature so our moderation team can review and take appropriate action to keep the community safe.
            </p>
          </div>
        </div>
      </main>


    </div>
  )
}

export default CommunityGuidelines
