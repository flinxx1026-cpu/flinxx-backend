import React, { useEffect } from 'react'

const TermsConfirmationModal = ({ onContinue, onCancel }) => {

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') e.preventDefault()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = (e) => {
      e.preventDefault()
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleContinue = () => {
    localStorage.setItem('termsAccepted', 'true')
    onContinue?.()
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="relative w-full max-w-lg rounded-2xl p-8 border shadow-2xl" style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.15)',
          background: 'rgba(5, 5, 5, 0.8)'
        }}>
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Before you continue
            </h2>
            
            <div className="space-y-4 text-zinc-300 font-light text-base leading-relaxed">
              <p>
                By continuing, you confirm that you are 18 years or older and agree to Flinxx's{' '}
                <a 
                  href="/terms-and-conditions" 
                  className="transition-colors underline" 
                  style={{ color: 'rgb(212, 175, 55)', textDecorationColor: 'rgba(212, 175, 55, 0.3)', textUnderlineOffset: '4px' }}
                  onMouseOver={(e) => e.target.style.color = 'rgb(217, 170, 29)'}
                  onMouseOut={(e) => e.target.style.color = 'rgb(212, 175, 55)'}
                  onClick={(e) => { e.preventDefault(); window.location.href = '/terms-and-conditions'; }}
                >
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a 
                  href="/privacy-policy" 
                  className="transition-colors underline" 
                  style={{ color: 'rgb(212, 175, 55)', textDecorationColor: 'rgba(212, 175, 55, 0.3)', textUnderlineOffset: '4px' }}
                  onMouseOver={(e) => e.target.style.color = 'rgb(217, 170, 29)'}
                  onMouseOut={(e) => e.target.style.color = 'rgb(212, 175, 55)'}
                  onClick={(e) => { e.preventDefault(); window.location.href = '/privacy-policy'; }}
                >
                  Privacy Policy
                </a>.
              </p>
              
              <p>
                You understand that Flinxx is a live interaction platform and you use it at your own responsibility.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 rounded-xl border transition-all duration-300 font-medium text-sm"
                style={{
                  borderColor: 'rgba(212, 175, 55, 0.2)',
                  background: 'rgba(139, 107, 0, 0.1)',
                  color: 'rgb(200, 170, 100)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 107, 0, 0.3)'
                  e.currentTarget.style.color = 'rgb(220, 180, 120)'
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 107, 0, 0.1)'
                  e.currentTarget.style.color = 'rgb(200, 170, 100)'
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'
                }}
              >
                Decline
              </button>
              
              <button
                onClick={handleContinue}
                className="flex-1 px-6 py-3 rounded-xl text-black font-bold shadow-lg transition-all duration-300 text-sm"
                style={{
                  background: 'linear-gradient(135deg, #DEB72B 0%, #B29222 100%)',
                  boxShadow: 'rgba(212, 175, 55, 0.2) 0px 0px 20px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.1)'
                  e.currentTarget.style.boxShadow = 'rgba(212, 175, 55, 0.4) 0px 0px 40px'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)'
                  e.currentTarget.style.boxShadow = 'rgba(212, 175, 55, 0.2) 0px 0px 20px'
                }}
              >
                Accept & Proceed
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </>
  )
}

export default TermsConfirmationModal
