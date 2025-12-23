import { useNavigate } from 'react-router-dom'
import flinxxLogo from '../assets/flinxx-logo.svg'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
      {/* Header Navigation */}
      <div className="relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-4 flex justify-start items-center max-w-full">
          <div className="flex items-center gap-3">
            <img src={flinxxLogo} alt="Flinxx" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white">Flinxx</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <h1 className="text-4xl font-black text-white mb-8">Privacy Policy</h1>

            {/* Scrollable Content */}
            <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90">
              {/* Introduction */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  By accessing or using Flinxx, you agree to this Privacy Policy.
                </p>
              </section>

              {/* Live Interaction Platform */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  Flinxx is a live interaction platform where users and streamers communicate in real time. Due to the nature of live content, complete privacy cannot be guaranteed.
                </p>
              </section>

              {/* Recording and Uploads */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  Flinxx hosts multiple streamers and users. You understand that any user or streamer may record video, audio, or interactions without your consent and may upload or share such content on external platforms. You are solely responsible for your own privacy and actions. Flinxx provides no guarantee or control over such recordings or uploads.
                </p>
              </section>

              {/* Data Collection and Use */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  Your video, audio, messages, and interactions may also be recorded, stored, reviewed, or used by Flinxx for safety, moderation, legal compliance, marketing, promotional, or platform improvement purposes. By continuing, you give your full consent.
                </p>
              </section>

              {/* Liability Disclaimer */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  Flinxx is not responsible or liable for screenshots, screen recordings, re-uploads, misuse, or distribution of content by users or streamers outside the platform. You agree that you use Flinxx at your own risk.
                </p>
              </section>

              {/* User Conduct */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  We do not guarantee the behavior, conduct, or content of any user or streamer. Flinxx shall not be held liable for any loss, damage, harassment, or misuse arising from live interactions.
                </p>
              </section>

              {/* Data Collection */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  Basic information such as device data, usage activity, and login details may be collected to operate, secure, and improve the platform.
                </p>
              </section>

              {/* Acceptance */}
              <section>
                <p className="text-white/80 leading-relaxed">
                  If you do not agree with this Privacy Policy, please discontinue use of Flinxx immediately.
                </p>
              </section>

              {/* Footer */}
              <div className="text-sm text-white/50 italic pt-6 border-t border-white/20">
                <p>
                  © 2025 Flinxx. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
