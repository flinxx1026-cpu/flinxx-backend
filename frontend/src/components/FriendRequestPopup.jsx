import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './FriendRequestPopup.css';

const FriendRequestPopup = ({ request, onAccept, onReject, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!request) return null;

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(request.requestId);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onReject(request.requestId);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Use React Portal to render outside the Chat component DOM
  const popupContent = (
    <div className="friend-request-popup-overlay" onClick={onClose}>
      <div className="friend-request-popup-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="popup-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Profile Section */}
        <div className="popup-profile-section">
          {/* Profile Image */}
          <div className="popup-profile-image">
            {request.senderProfileImage ? (
              <img 
                src={request.senderProfileImage} 
                alt={request.senderName}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="popup-profile-fallback"
              style={{ display: request.senderProfileImage ? 'none' : 'flex' }}
            >
              {request.senderName?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>

          {/* Message */}
          <div className="popup-message">
            <h3 className="popup-sender-name">{request.senderName || 'User'}</h3>
            <p className="popup-text">wants to be your friend</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="popup-actions">
          <button
            className="popup-btn-reject"
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Reject'}
          </button>
          <button
            className="popup-btn-accept"
            onClick={handleAccept}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );

  // Render using React Portal to avoid z-index issues
  return ReactDOM.createPortal(popupContent, document.body);
};

export default FriendRequestPopup;
