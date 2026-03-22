import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './GuidelinesPopup.css'

const GuidelinesPopup = ({ isOpen, onAccept, isLoading = false }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleGuidelinesClick = () => {
    navigate('/community-guidelines')
  }

  return (
    <div className="guidelines-overlay">
      <div className="guidelines-modal">
        {/* Title */}
        <h1 className="guidelines-modal-title">Please review our Community Standards before continuing</h1>

        {/* Guidelines Sections */}
        <div className="guidelines-sections">
          {/* Not Allowed */}
          <div className="guideline-box not-allowed-box">
            <h3 className="box-title not-allowed-title">NOT ALLOWED ON FLINXX</h3>
            <div className="box-items">
              <div className="rule-item">
                <span className="rule-icon red-icon">⊘</span>
                <span className="rule-text">Sexually explicit or adult material of any kind</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon red-icon">⊘</span>
                <span className="rule-text">Platform access by individuals below 18 years of age</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon red-icon">⊘</span>
                <span className="rule-text">Abusive, threatening, or harmful conduct</span>
              </div>
            </div>
          </div>

          {/* Expected Behavior */}
          <div className="guideline-box expected-box">
            <h3 className="box-title expected-title">WHAT WE EXPECT FROM OUR COMMUNITY</h3>
            <div className="box-items">
              <div className="rule-item">
                <span className="rule-icon green-icon">✓</span>
                <span className="rule-text">Positive and respectful interactions</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon green-icon">✓</span>
                <span className="rule-text">Responsible and considerate communication</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon green-icon">✓</span>
                <span className="rule-text">Creating a safe experience for everyone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="guidelines-footer-text">
          By proceeding, you acknowledge that you meet the age requirement (18+) and accept our <span className="community-link" onClick={handleGuidelinesClick}>Community Guidelines</span>.
        </p>

        {/* Accept Button */}
        <button 
          className="guidelines-accept-btn"
          onClick={onAccept}
          disabled={isLoading}
          type="button"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  )
}

export default GuidelinesPopup
