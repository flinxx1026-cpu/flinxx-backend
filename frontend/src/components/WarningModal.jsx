import React, { useState, useEffect } from 'react'

const WarningModal = ({ isOpen, onClose, warningData }) => {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    console.log('\n' + '='.repeat(80))
    console.log('🔍 [WarningModal] Component rendered with:')
    console.log(`   isOpen: ${isOpen}`)
    console.log(`   isClosing: ${isClosing}`)
    console.log(`   warningData: ${warningData ? JSON.stringify(warningData).substring(0, 100) + '...' : 'null'}`)
    console.log('='.repeat(80) + '\n')
  }, [isOpen, isClosing, warningData])

  if (!isOpen) {
    console.log('📭 [WarningModal] Not rendering - isOpen is false')
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
    handleClose()
  }

  const handleViewGuidelines = () => {
    console.log('📖 [WarningModal] Opening community guidelines')
    // Open guidelines in new tab or modal
    window.open('https://flinxx.in/guidelines', '_blank')
  }

  console.log('✨ [WarningModal] Rendering modal - SHOULD BE VISIBLE NOW!')

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen && !isClosing ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'}`} onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div
          className={`relative w-full max-w-[480px] glass-bg modal-border rounded-xl gold-glow overflow-hidden transform transition-all duration-300 pointer-events-auto ${
            isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
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
              Account Warning
            </h2>

            {/* Main Message */}
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              Our system has detected activity that violates our&nbsp;
              <span className="font-semibold" style={{ color: '#f2b90d' }}>
                Premium Community Standards
              </span>
              . Continued use of automated tools or third-party scripts is strictly prohibited.
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
                <strong>Important:</strong> Repeated violations of these terms may lead to permanent account suspension
                and forfeiture of your premium subscription status.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col w-full gap-4">
              <button
                onClick={handleUnderstand}
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
                I Understand
              </button>

              <button
                onClick={handleViewGuidelines}
                className="w-full py-4 px-6 rounded-lg font-semibold text-base transition-colors duration-200"
                style={{
                  borderColor: 'rgba(242, 185, 13, 0.4)',
                  border: '1px solid rgba(242, 185, 13, 0.4)',
                  color: '#f2b90d'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(242, 185, 13, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                View Community Guidelines
              </button>
            </div>

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
