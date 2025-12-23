import React, { useState, useEffect } from 'react'
import Layout from './components/Layout'
import TermsConfirmationModal from './components/TermsConfirmationModal'
import './App.css'

function App() {
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    // Check authentication and terms acceptance on mount and when storage changes
    const checkTermsModal = () => {
      const isAuthenticated = !!localStorage.getItem('authToken')
      const termsAccepted = localStorage.getItem('termsAccepted') === 'true'

      // Show modal ONLY if NOT authenticated AND terms NOT accepted
      setShowTermsModal(!isAuthenticated && !termsAccepted)
    }

    // Check on mount
    checkTermsModal()

    // Listen for storage changes
    window.addEventListener('storage', checkTermsModal)
    return () => window.removeEventListener('storage', checkTermsModal)
  }, [])

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true')
    setShowTermsModal(false)
  }

  const handleTermsCancel = () => {
    // Redirect to home or login
    window.location.href = '/'
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* Show Terms modal ONLY before login */}
      {showTermsModal && (
        <TermsConfirmationModal
          onContinue={handleTermsAccept}
          onCancel={handleTermsCancel}
        />
      )}
      <Layout />
    </div>
  )
}

export default App
