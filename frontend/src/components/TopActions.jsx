import React, { useContext } from 'react';
import { useUnread } from '../context/UnreadContext';
import { AuthContext } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const TopActions = ({ 
  currentUser, 
  onProfileClick, 
  onPremiumClick, 
  onMatchHistoryClick,
  onSearchClick,
  onRequestsClick,
  onMessageClick,
  isFixedPosition = false 
}) => {
  const { unreadCount } = useUnread();
  const { incomingRequests = [] } = useContext(AuthContext);

  // Safety guard - ensure UUID is ready
  if (!currentUser?.uuid) {
    console.warn("⚠️ TopActions: UUID not ready, skipping render");
    return null;
  }

  // Handle message panel open - mark all messages as read
  const handleMessageClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No auth token, skipping mark-all-read');
        onMessageClick?.();
        return;
      }

      // Mark all messages as read in database
      const response = await fetch(`${BACKEND_URL}/api/messages/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('✅ All messages marked as read');
      }
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }

    // Open message panel regardless of API result
    onMessageClick?.();
  };

  const containerStyle = isFixedPosition 
    ? { position: 'fixed', top: '12px', right: '24px', zIndex: 999999 }
    : {};

  const className = isFixedPosition 
    ? 'flex items-center gap-4' 
    : 'top-right-icons';

  return (
    <div className={className} style={containerStyle}>
      {/* User Profile Icon */}
      <div 
        className="icon-circle" 
        title="Profile"
        onClick={onProfileClick}
        style={{ cursor: 'pointer' }}
      >
        {currentUser?.picture ? (
          <img src={currentUser.picture} alt="Profile" />
        ) : (
          '👤'
        )}
      </div>

      {/* Search Icon */}
      <div 
        className="icon-circle" 
        title="Search"
        onClick={onSearchClick}
        style={{ cursor: 'pointer' }}
      >
        🔍
      </div>

      {/* Requests Heart Icon with Badge */}
      <div 
        className="icon-wrapper" 
        title="Requests"
        onClick={onRequestsClick}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div className="icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ❤️
        </div>
        {incomingRequests && incomingRequests.length > 0 && (
          <span 
            className="badge"
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: '#EF4444',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: '900',
              width: '24px',
              height: '24px',
              minWidth: '24px',
              minHeight: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1',
              zIndex: '50',
              border: '2.5px solid white',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)'
            }}
          >
            {incomingRequests.length}
          </span>
        )}
      </div>

      {/* Messages Icon with Badge */}
      <div 
        className="icon-wrapper" 
        title="Messages"
        onClick={handleMessageClick}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div className="icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          💬
        </div>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>

      {/* Flinx Premium Icon */}
      <div 
        className="icon-circle" 
        title="Flinx Premium"
        onClick={onPremiumClick}
      >
        👑
      </div>

      {/* Match History Icon */}
      <div 
        className="icon-circle" 
        title="Match History"
        onClick={onMatchHistoryClick}
      >
        ⏱️
      </div>
    </div>
  );
};

export default TopActions;
