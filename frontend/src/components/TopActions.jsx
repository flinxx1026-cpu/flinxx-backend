import React, { useContext } from 'react';
import { MessageContext } from '../context/MessageContext';

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
        onClick={onMessageClick}
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
