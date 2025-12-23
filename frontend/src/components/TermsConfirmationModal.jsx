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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Before you continue
        </h2>

        <p className="text-gray-700 text-center text-sm">
          By continuing, you confirm that you are 18 years or older and agree to Flinxx's{' '}
          <a href="/terms-and-conditions" className="text-blue-600 underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </a>.
        </p>

        <p className="text-gray-700 text-center text-sm mt-4">
          You understand that Flinxx is a live interaction platform and you use it at your own responsibility.
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Accept & Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsConfirmationModal
