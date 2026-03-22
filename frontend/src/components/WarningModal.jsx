import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const WarningModal = ({ isOpen, onClose, warningData }) => {
  const [isClosing, setIsClosing] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // New states for the appeal modal
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false)
  const [appealMessage, setAppealMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appealSuccess, setAppealSuccess] = useState(false)
  const [appealError, setAppealError] = useState('')

  const charCount = appealMessage.length;

  // Decide if this is a ban or a warning
  const isBanned = warningData?.type === 'banned' || user?.isBanned;

  useEffect(() => {
    if (!isOpen) return;
    console.log('\n' + '='.repeat(80))
    console.log('🔍 [WarningModal] Component rendered with:')
    console.log(`   isOpen: ${isOpen}`)
    console.log(`   isClosing: ${isClosing}`)
    console.log(`   warningData: ${warningData ? JSON.stringify(warningData).substring(0, 100) + '...' : 'null'}`)
    console.log('='.repeat(80) + '\n')
  }, [isOpen, isClosing, warningData])

  if (!isOpen) {
    return null
  }

  const handleClose = () => {
    console.log('🔄 [WarningModal] Close animation started')
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
      console.log('✅ [WarningModal] Close animation completed')
    }, 300)
  }

  const handleUnderstand = () => {
    console.log('✅ [WarningModal] User acknowledged warning')
    if (isBanned) {
      console.log('🚪 [WarningModal] Banned user clicking Return to Login - Logging out...')
      logout()
    } else {
      handleClose()
    }
  }

  const handleViewGuidelines = () => {
    console.log('📖 [WarningModal] Opening community guidelines')
    onClose() // Close modal first
    navigate('/community-guidelines') // Then navigate
  }

  const handleSubmitAppeal = async () => {
    if (charCount < 30) {
      setAppealError('Please enter at least 30 characters.')
      return
    }
    if (charCount > 1000) {
      setAppealError('Maximum 1000 characters allowed.')
      return
    }

    setIsSubmitting(true)
    setAppealError('')

    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : import.meta.env.VITE_BACKEND_URL // Since user specified accessing the admin backend for the user api endpoint
      const res = await fetch(`${apiUrl}/api/appeals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: appealMessage })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setAppealSuccess(true)
        setTimeout(() => {
          setIsAppealModalOpen(false)
        }, 2000)
      } else {
        setAppealError(data.message || 'Failed to submit appeal. Please try again.')
      }
    } catch (err) {
      setAppealError('Network error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  console.log('✨ [WarningModal] Rendering modal - SHOULD BE VISIBLE NOW!')

  return (
    <>
      {/* Backdrop - No blur or dim overlay per user request */}
      <div
        className="fixed bg-transparent"
        style={{ top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999998 }}
        onClick={isBanned ? undefined : handleClose}
      />

      {/* Modal */}
      <div
        className="fixed flex items-center justify-center px-4 pointer-events-none"
        style={{ top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999 }}
      >
        <div
          className={`relative w-full max-w-[480px] glass-bg modal-border rounded-xl gold-glow overflow-hidden transform transition-all duration-300 pointer-events-auto ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          style={{
            background: 'rgba(18, 17, 10, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(242, 185, 13, 0.3)',
            boxShadow: '0 0 25px rgba(242, 185, 13, 0.15)'
          }}
        >
          {/* Subtle Gold Top Edge */}
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-60"></div>

          <div className="p-8 pt-10 flex flex-col items-center text-center">
            {/* Glowing Gold Warning Icon */}
            <div className="relative mb-6">
              <div
                className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-20"
                style={{ backgroundColor: '#f2b90d' }}
              ></div>
              <div
                className="relative flex items-center justify-center w-20 h-20 rounded-full border"
                style={{
                  backgroundColor: 'rgba(242, 185, 13, 0.1)',
                  borderColor: 'rgba(242, 185, 13, 0.2)'
                }}
              >
                <span
                  className="material-icons text-5xl"
                  style={{ color: '#f2b90d' }}
                >
                  warning
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
              {isAppealModalOpen ? (appealSuccess ? 'Appeal Submitted' : 'Submit an Appeal') : (isBanned ? 'Account Suspended' : 'Account Warning')}
            </h2>

            {isAppealModalOpen ? (
              <div className="w-full flex flex-col gap-4 text-left">
                {appealSuccess ? (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center text-green-400">
                    <span className="material-icons mb-2 text-4xl">check_circle</span>
                    <p>Your appeal has been submitted successfully.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-300 mb-2 text-center">
                      Please explain why you believe your account suspension was a mistake. We will review your case shortly.
                    </p>
                    {appealError && (
                      <div className="p-3 text-sm rounded bg-red-500/10 border border-red-500/20 text-red-400">
                        {appealError}
                      </div>
                    )}
                    <textarea
                      value={appealMessage}
                      onChange={(e) => {
                        const newText = e.target.value;
                        if (newText.length <= 1000 || newText.length < appealMessage.length) {
                          setAppealMessage(newText);
                          if (appealError) setAppealError('');
                        } else {
                          setAppealError('Maximum 1000 characters allowed.');
                        }
                      }}
                      placeholder="Enter your appeal reason here (min 30, max 1000 characters)..."
                      className="w-full h-32 p-3 rounded-lg bg-black/40 border border-yellow-500/30 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-yellow-500/70 transition-colors resize-none"
                      disabled={isSubmitting}
                      required
                    ></textarea>

                    <div className={`text-right text-xs mt-1 ${charCount > 1000 ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
                      {charCount} / 1000 chars
                    </div>
                    
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => setIsAppealModalOpen(false)}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 border border-slate-600 text-slate-300 hover:bg-slate-800"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitAppeal}
                        className="flex-1 py-3 px-4 rounded-lg font-bold text-sm text-gray-900 transition-all duration-300"
                        style={{
                          backgroundImage: 'linear-gradient(to bottom right, #f2b90d, #d9a50b, #c2930a)',
                          opacity: isSubmitting ? 0.7 : 1,
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Appeal'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Main Message */}
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  {isBanned ? (
                    <>Your account has been permanently suspended due to severe or repeated violations of our&nbsp;
                      <span
                        onClick={handleViewGuidelines}
                        className="font-semibold transition-all hover:underline cursor-pointer"
                        style={{ color: '#f2b90d' }}
                      >
                        Community Guidelines
                      </span>.</>
                  ) : (
                    <>Our system has detected activity that violates our&nbsp;
                      <span
                        onClick={handleViewGuidelines}
                        className="font-semibold transition-all hover:underline cursor-pointer"
                        style={{ color: '#f2b90d' }}
                      >
                        Community Guidelines
                      </span>.
                      Continued use of automated tools or third-party scripts is strictly prohibited.</>
                  )}
                </p>

                {/* Subtext Violation Warning */}
                <div
                  className="flex items-start gap-3 p-4 rounded-lg mb-10 w-full"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <span
                    className="material-icons text-sm mt-0.5"
                    style={{ color: '#ef4444', flexShrink: 0 }}
                  >
                    error_outline
                  </span>
                  <p className="text-sm text-left leading-snug" style={{ color: '#f87171' }}>
                    <strong>Important:</strong> {warningData?.type === 'banned'
                      ? "Your account has been permanently disabled. You can submit an appeal if you believe this was a mistake."
                      : "Repeated violations of these terms may lead to permanent account suspension and forfeiture of your premium subscription status."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col w-full gap-4">
                  <button
                    onClick={warningData?.type === 'banned' ? () => { window.location.href = '/login'; localStorage.clear(); } : handleUnderstand}
                    className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-gray-900"
                    style={{
                      backgroundImage: 'linear-gradient(to bottom right, #f2b90d, #d9a50b, #c2930a)',
                      boxShadow: 'rgba(242, 185, 13, 0.3) 0px 0px 20px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = 'rgba(242, 185, 13, 0.5) 0px 0px 25px'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = 'rgba(242, 185, 13, 0.3) 0px 0px 20px'
                    }}
                  >
                    {isBanned ? 'Return to Login' : 'I Understand'}
                  </button>

                  <button
                    onClick={isBanned
                      ? (appealSuccess ? null : () => setIsAppealModalOpen(true))
                      : handleViewGuidelines}
                    className="w-full py-4 px-6 rounded-lg font-semibold text-base transition-colors duration-200"
                    style={{
                      borderColor: 'rgba(242, 185, 13, 0.4)',
                      border: '1px solid rgba(242, 185, 13, 0.4)',
                      color: appealSuccess && isBanned ? 'rgba(242, 185, 13, 0.5)' : '#f2b90d',
                      cursor: appealSuccess && isBanned ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!appealSuccess || !isBanned) e.target.style.backgroundColor = 'rgba(242, 185, 13, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      if (!appealSuccess || !isBanned) e.target.style.backgroundColor = 'transparent'
                    }}
                    disabled={appealSuccess && isBanned}
                  >
                    {isBanned ? (appealSuccess ? 'Appeal Submitted' : 'Appeal') : 'View Community Guidelines'}
                  </button>
                </div>
              </>
            )}

            {/* Subtle Brand Tag */}
            <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale pointer-events-none">
              <div className="h-[1px] w-8" style={{ backgroundColor: '#f2b90d' }}></div>
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-bold"
                style={{ color: '#f2b90d' }}
              >
                Flinxx Security
              </span>
              <div className="h-[1px] w-8" style={{ backgroundColor: '#f2b90d' }}></div>
            </div>
          </div>

          {/* Modal Decorative Corner Elements */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 blur-2xl"
            style={{
              backgroundColor: 'rgba(242, 185, 13, 0.05)'
            }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full -ml-16 -mb-16 blur-3xl"
            style={{
              backgroundColor: 'rgba(242, 185, 13, 0.05)'
            }}
          ></div>
        </div>
      </div>

      {/* Add Tailwind dark mode styles if not already present */}
      <style jsx global>{`
        .glass-bg {
          background: rgba(18, 17, 10, 0.95);
          backdrop-filter: blur(12px);
        }

        .modal-border {
          border: 1px solid rgba(242, 185, 13, 0.3);
        }

        .gold-glow {
          box-shadow: 0 0 25px rgba(242, 185, 13, 0.15);
        }
      `}</style>
    </>
  )
}

export default WarningModal
