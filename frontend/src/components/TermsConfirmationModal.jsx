import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TermsConfirmationModal = ({ user, onContinue, onCancel }) => {
  const navigate = useNavigate()

  // Prevent scroll on document when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Prevent ESC key from closing modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Prevent history back navigation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = (e) => {
      e.preventDefault()
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleContinue = async () => {
    try {
      if (onContinue) {
        await onContinue()
      }
    } catch (error) {
      console.error('❌ Error in handleContinue:', error)
    }
  }

  const handleCancel = async () => {
    try {
      if (onCancel) {
        await onCancel()
      }
    } catch (error) {
      console.error('❌ Error in handleCancel:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container - non-dismissible */}
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8"
        onClick={(e) => e.stopPropagation()} // Prevent outside click
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Before you continue
        </h2>

        {/* Body text */}
        <div className="mb-8">
          <p className="text-gray-700 text-center leading-relaxed">
            Please take a moment to review and agree to our Platform Rules and Privacy Notice.
          </p>
          <p className="text-gray-700 text-center leading-relaxed mt-4">
            By clicking Continue, you confirm that you are 18 years or older and meet the legal age requirements in your region.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsConfirmationModal
