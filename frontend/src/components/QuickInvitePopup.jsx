import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './QuickInvitePopup.css';

const QuickInvitePopup = ({ quickInvite, onAccept, onReject, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [autoClosing, setAutoClosing] = useState(false);

  if (!quickInvite) return null;

  // ✅ Auto-close after 8 seconds if no action taken
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoClosing(true);
      setTimeout(() => {
        onClose();
      }, 300); // Allow animation
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      // For quick invites, directly establish friendship with 'accepted' status
      // This is a real-time action, not a normal request acceptance
      await onAccept(quickInvite.senderId, quickInvite);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      // Quick invites don't create DB records, so just dismiss
      await onReject(quickInvite);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Use React Portal to render outside the Chat component DOM
  const popupContent = (
    <div 
      className={`quick-invite-popup-overlay ${autoClosing ? 'closing' : ''}`}
      onClick={onClose}
    >
      <div 
        className="quick-invite-popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="quick-invite-close-btn" 
          onClick={onClose} 
          aria-label="Close"
          title="Dismiss"
        >
          ✕
        </button>

        {/* Profile Section */}
        <div className="quick-invite-profile-section">
          {/* Animated Background */}
          <div className="quick-invite-glow-bg"></div>

          {/* Profile Image */}
          <div className="quick-invite-profile-image">
            {quickInvite.senderProfileImage ? (
              <img 
                src={quickInvite.senderProfileImage} 
                alt={quickInvite.senderName}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="quick-invite-profile-fallback"
              style={{ display: quickInvite.senderProfileImage ? 'none' : 'flex' }}
            >
              {quickInvite.senderName?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>

          {/* Message */}
          <div className="quick-invite-message">
            <h3 className="quick-invite-sender-name">{quickInvite.senderName || 'User'}</h3>
            <p className="quick-invite-text">sent you a quick invite!</p>
            <p className="quick-invite-subtext">👋 Ready to connect?</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="quick-invite-actions">
          <button
            className="quick-invite-btn-reject"
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Not Now'}
          </button>
          <button
            className="quick-invite-btn-accept"
            onClick={handleAccept}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Connect'}
          </button>
        </div>

        {/* Auto-close indicator */}
        <div className="quick-invite-timer">
          <div className="quick-invite-timer-bar"></div>
        </div>
      </div>
    </div>
  );

  // Render to portal
  const portalRoot = document.getElementById('modal-root');
  if (!portalRoot) {
    console.error('❌ No modal-root element found');
    return null;
  }

  return ReactDOM.createPortal(popupContent, portalRoot);
};

export default QuickInvitePopup;
