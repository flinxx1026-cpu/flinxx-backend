import React from 'react'
import './TermsConsentModal.css'

const TermsConsentModal = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="terms-consent-overlay">
      <div className="terms-consent-modal">
        {/* Header */}
        <h2 className="terms-consent-title">Before you continue</h2>

        {/* Content */}
        <div className="terms-consent-content">
          <p className="terms-consent-text">
            By continuing, you confirm that you are 18 years or older and agree to Flinxx's{' '}
            <a href="/terms" className="terms-consent-link">Terms & Conditions</a>
            {' '}and{' '}
            <a href="/privacy-policy" className="terms-consent-link">Privacy Policy</a>.
          </p>

          <p className="terms-consent-text">
            You understand that Flinxx is a live interaction platform and users are responsible for their actions.
          </p>
        </div>

        {/* Buttons */}
        <div className="terms-consent-buttons">
          <button
            className="terms-consent-btn decline-btn"
            onClick={onDecline}
            type="button"
          >
            Decline
          </button>
          <button
            className="terms-consent-btn accept-btn"
            onClick={onAccept}
            type="button"
          >
            Accept & Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsConsentModal
