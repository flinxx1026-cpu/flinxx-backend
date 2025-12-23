import { useNavigate } from 'react-router-dom'
import flinxxLogo from '../assets/flinxx-logo.svg'

const Terms = () => {
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
            <h1 className="text-4xl font-black text-white mb-8">Terms & Conditions</h1>

            {/* Scrollable Content */}
            <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90">
              {/* Last Updated */}
              <p className="text-sm text-white/70 italic">
                Last Updated: December 21, 2025
              </p>

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                <p className="text-white/80 leading-relaxed">
                  By accessing and using the Flinxx platform (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">2. Use License</h2>
                <p className="text-white/80 leading-relaxed mb-3">
                  Permission is granted to temporarily download one copy of the materials (information or software) on Flinxx for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for any commercial purpose or for any public display</li>
                  <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
                  <li>Removing any copyright or other proprietary notations from the materials</li>
                  <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                  <li>Violating any laws or regulations applicable to the Service</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">3. Age Restriction</h2>
                <p className="text-white/80 leading-relaxed">
                  You must be at least 18 years of age to use this Service. By using Flinxx, you represent and warrant that you are at least 18 years old and have the legal right to use the platform in your jurisdiction.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">4. Disclaimer</h2>
                <p className="text-white/80 leading-relaxed">
                  The materials on Flinxx are provided on an 'as is' basis. Flinxx makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">5. Limitations</h2>
                <p className="text-white/80 leading-relaxed">
                  In no event shall Flinxx or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Flinxx, even if Flinxx or a Flinxx authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">6. Accuracy of Materials</h2>
                <p className="text-white/80 leading-relaxed">
                  The materials appearing on Flinxx could include technical, typographical, or photographic errors. Flinxx does not warrant that any of the materials on its Service are accurate, complete, or current. Flinxx may make changes to the materials contained on the Service at any time without notice.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">7. User Conduct</h2>
                <p className="text-white/80 leading-relaxed mb-3">
                  You agree that you will not engage in any conduct that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Violates any applicable law or regulation</li>
                  <li>Infringes upon or violates any intellectual property rights</li>
                  <li>Harasses, abuses, or threatens other users</li>
                  <li>Uploads malware, viruses, or other harmful code</li>
                  <li>Impersonates any person or entity</li>
                  <li>Shares non-consensual intimate content</li>
                  <li>Attempts to gain unauthorized access to the Service</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">8. Materials License</h2>
                <p className="text-white/80 leading-relaxed">
                  By posting materials to Flinxx, you grant Flinxx a worldwide, royalty-free license to use, reproduce, modify and publish that material in any form, in any media now known or hereafter discovered. However, this license does not extend to any materials posted by other users.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">9. Limitations of Liability</h2>
                <p className="text-white/80 leading-relaxed">
                  In no event shall Flinxx, its employees, agents, suppliers, or any other affiliated parties be liable to you or any third party for any direct, indirect, consequential, special, or punitive damages whatsoever, including without limitation, damages for loss of profits, loss of use, business interruption, or loss of data, even if Flinxx has been advised of the possibility of such damages.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">10. Privacy Policy</h2>
                <p className="text-white/80 leading-relaxed">
                  Your use of Flinxx is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">11. Termination</h2>
                <p className="text-white/80 leading-relaxed">
                  Flinxx may terminate or suspend your account and access to the Service at any time, for any reason, without notice. Upon termination, your right to use the Service will immediately cease. You remain liable for all charges incurred through the date of termination.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">12. Modifications to Terms</h2>
                <p className="text-white/80 leading-relaxed">
                  Flinxx may revise these terms of service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service. If you do not agree to any of these terms, or any revised terms, please stop using the Service.
                </p>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">13. Governing Law</h2>
                <p className="text-white/80 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Flinxx operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              {/* Section 14 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">14. Contact Information</h2>
                <p className="text-white/80 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us at: support@flinxx.com
                </p>
              </section>

              {/* Footer Spacing */}
              <div className="pt-6 border-t border-white/20">
                <p className="text-sm text-white/70">
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

export default Terms
