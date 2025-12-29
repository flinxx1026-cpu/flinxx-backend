import React, { useContext, useEffect, useState } from 'react';
import { MessageContext } from '../context/MessageContext';
import { AuthContext } from '../context/AuthContext';
import { getUnreadCount } from '../services/api';

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
  const { unreadCount } = useContext(MessageContext) || { unreadCount: 0 };
  const { user } = useContext(AuthContext) || {};
  const [dbUnreadCount, setDbUnreadCount] = useState(0);

  // ✅ Fetch unread count from database - ONLY when user UUID is available from AuthContext
  useEffect(() => {
    // ✅ STRICT VALIDATION: Check if user UUID exists and is valid
    if (!user?.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
      console.warn('⛔ TopActions: Invalid UUID, blocking unread count fetch');
      return;
    }

    console.log('✅ TopActions: Valid UUID available, fetching unread count:', user.uuid.substring(0, 8) + '...');

    const fetchUnreadCount = async () => {
      const count = await getUnreadCount(); // ✅ getUnreadCount reads from localStorage
      setDbUnreadCount(count);
    };

    // Fetch immediately
    fetchUnreadCount();

    // Poll every 5 seconds for new messages
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, [user?.uuid]);

  // Use database count as source of truth
  const displayUnreadCount = dbUnreadCount > 0 ? dbUnreadCount : unreadCount;

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
        // Refresh unread count immediately
        if (user?.uuid && user.uuid.length === 36) {
          const count = await getUnreadCount();
          setDbUnreadCount(count);
        }
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

      {/* Requests Heart Icon */}
      <div 
        className="icon-circle" 
        title="Requests"
        onClick={onRequestsClick}
        style={{ cursor: 'pointer' }}
      >
        ❤️
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
        {displayUnreadCount > 0 && (
          <span className="badge">{displayUnreadCount}</span>
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
