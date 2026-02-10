import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './FriendRequestToast.css';

const FriendRequestToast = ({ request, onAccept, onReject, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);

  // Setup portal root on mount
  useEffect(() => {
    console.log('📍 [Toast] Setting up portal root to document.body');
    setPortalRoot(document.body);
  }, []);

  // Auto-dismiss after 10 seconds if no action taken
  useEffect(() => {
    if (!request) return;
    
    console.log('⏱️ [Toast] Setting 10 second auto-dismiss timer');
    const timer = setTimeout(() => {
      console.log('⏱️ Toast auto-dismissing after 10 seconds');
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [request, onClose]);

  if (!request || !portalRoot) {
    return null;
  }

  console.log('🎨 [Toast] Rendering toast for:', request.senderName);

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

  const toastContent = (
    <div className="friend-request-toast-container">
      {/* Profile Image */}
      <div className="toast-profile-image">
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
          className="toast-profile-fallback"
          style={{ display: request.senderProfileImage ? 'none' : 'flex' }}
        >
          {request.senderName?.charAt(0)?.toUpperCase() || '?'}
        </div>
      </div>

      {/* Request Info */}
      <div className="toast-info">
        <p className="toast-username">{request.senderName || 'User'}</p>
        <p className="toast-message">Wants to be your friend</p>
      </div>

      {/* Action Buttons */}
      <div className="toast-actions">
        <button
          className="toast-btn-reject"
          onClick={handleReject}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Reject'}
        </button>
        <button
          className="toast-btn-accept"
          onClick={handleAccept}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Accept'}
        </button>
      </div>
    </div>
  );

  // Render using React Portal to document.body
  return ReactDOM.createPortal(toastContent, portalRoot);
};

export default FriendRequestToast;
