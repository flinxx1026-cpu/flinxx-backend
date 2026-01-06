import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MobileWaitingScreen.css'

/**
 * MobileWaitingScreen - Mobile Waiting/Matching Screen
 * Displays when user is searching for a match
 * Only for mobile devices (< 769px)
 */
const MobileWaitingScreen = ({ onCancel }) => {
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(true)

  const handleCancel = () => {
    setIsSearching(false)
    if (onCancel) {
      onCancel()
    } else {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="mobile-waiting-container">
      {/* Content Container */}
      <div className="waiting-content">
        {/* Top Half - Your Camera Section */}
        <div className="camera-section">
          <div className="camera-placeholder">
            <span className="material-symbols-outlined">desktop_windows</span>
          </div>
          <div className="you-badge">
            <span>You</span>
          </div>
        </div>

        {/* Bottom Half - Matching Section */}
        <div className="matching-section">
          <div className="matching-content">
            {/* Animated Icon */}
            <div className="icon-container">
              <div className="glow-pulse"></div>
              <svg className="glass-icon" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="handleGradient" x1="75" x2="110" y1="75" y2="110">
                    <stop offset="0%" stopColor="#A78BFA"></stop>
                    <stop offset="50%" stopColor="#8B5CF6"></stop>
                    <stop offset="100%" stopColor="#7C3AED"></stop>
                  </linearGradient>
                  <linearGradient id="rimGradient" x1="10" x2="90" y1="10" y2="90">
                    <stop offset="0%" stopColor="#F3E8FF"></stop>
                    <stop offset="100%" stopColor="#6D28D9"></stop>
                  </linearGradient>
                  <radialGradient id="glassGradient" cx="50%" cy="50%" r="35">
                    <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.9"></stop>
                    <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.85"></stop>
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.95"></stop>
                  </radialGradient>
                </defs>
                <line stroke="url(#handleGradient)" strokeLinecap="round" strokeWidth="14" x1="72" x2="108" y1="72" y2="108"></line>
                <circle cx="50" cy="50" r="38" stroke="url(#rimGradient)" strokeWidth="6" fill="none"></circle>
                <circle cx="50" cy="50" fill="url(#glassGradient)" r="35"></circle>
                <ellipse cx="35" cy="35" fill="white" fillOpacity="0.35" rx="18" ry="10" transform="rotate(-45 35 35)"></ellipse>
                <circle cx="28" cy="28" fill="white" fillOpacity="0.8" r="3"></circle>
                <path d="M 22 52 A 30 30 0 0 1 52 22" fill="none" stroke="white" strokeLinecap="round" strokeOpacity="0.4" strokeWidth="2"></path>
              </svg>
            </div>

            {/* Text Content */}
            <div className="text-content">
              <h2 className="matching-title">Looking for a partner...</h2>
              <p className="matching-subtitle">Matching you with someone nearby</p>
            </div>

            {/* Loading Dots */}
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>

            {/* Cancel Button */}
            <button className="cancel-button" onClick={handleCancel}>
              Cancel Search
            </button>
          </div>
        </div>
      </div>

      {/* Border Accent */}
      <div className="border-accent"></div>
    </div>
  )
}

export default MobileWaitingScreen
