import React, { useState } from 'react';
import './SearchFriendsModal.css';

const SearchFriendsModal = ({ isOpen, onClose, onUserSelect, mode = 'search' }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const isNotificationMode = mode === 'notifications';

  if (!isOpen) return null;

  const handleSearch = async (value) => {
    setSearch(value);
    
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${BACKEND_URL}/api/search-user?q=${encodeURIComponent(value)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Search error:', response.status);
        setResults([]);
        return;
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = (targetUserId) => {
    console.log('Friend request sent to:', targetUserId);
    // API call will be added here later
  };

  return (
    <div className="search-friends-overlay" onClick={onClose}>
      <div className="search-friends-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="search-friends-header">
          <h2>{isNotificationMode ? 'Notifications' : 'Search Friends'}</h2>
          <button className="search-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Search Input - Hidden in Notifications Mode */}
        {!isNotificationMode && (
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search a friend by ID"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
              autoFocus
            />
            <span className="search-icon">🔍</span>
          </div>
        )}

        {/* Results Container */}
        {!isNotificationMode && (
          <div className="search-results">
            {results.length === 0 ? (
              <div className="search-empty-state">
                <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', marginTop: '40px' }}>
                  {search ? 'No users found' : 'Start typing to search'}
                </p>
              </div>
            ) : (
              results.map((user, index) => (
                <div 
                  key={`user-${user.shortId}-${index}`} 
                  className="search-result-item"
                  onClick={() => {
                    if (onUserSelect) {
                      onUserSelect(user);
                    }
                    onClose();
                  }}
                >
                <div className="result-avatar">
                  {user.avatar && user.avatar.startsWith('http') ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="result-info">
                  <div className="result-name-row">
                    <p className="result-name">{user.name}</p>
                    <button
                      className="friend-badge-btn"
                      title="Send Friend Request"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendFriendRequest(user.id || user.publicId);
                      }}
                    >
                      <span className="friend-emoji">�</span>
                      <span className="friend-text">FRIEND</span>
                    </button>
                  </div>
                  <p className="result-id">ID: {user.publicId}</p>
                </div>
              </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriendsModal;
