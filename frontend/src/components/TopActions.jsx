import React from 'react';

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

      {/* Messages Icon */}
      <div 
        className="icon-circle" 
        title="Messages"
        onClick={onMessageClick}
        style={{ cursor: 'pointer' }}
      >
        💬
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
