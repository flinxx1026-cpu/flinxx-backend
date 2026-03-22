import React from 'react'
import TermsConsentModal from './TermsConsentModal'

/**
 * TermsConfirmationModal - Wrapper around TermsConsentModal
 * Used in Chat.jsx dashboard with onCancel/onContinue props.
 * Always shown when rendered (no isOpen prop needed - parent controls visibility).
 */
const TermsConfirmationModal = ({ onCancel, onContinue }) => {
  return (
    <TermsConsentModal
      isOpen={true}
      onAccept={onContinue}
      onDecline={onCancel}
    />
  )
}

export default TermsConfirmationModal
