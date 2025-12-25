import React, { useState, useEffect } from 'react';
import './SearchFriendsModal.css';

const SearchFriendsModal = ({ isOpen, onClose, onUserSelect, mode = 'search' }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendRequestStates, setFriendRequestStates] = useState({}); // Track request status by userId
  const [pendingRequests, setPendingRequests] = useState([]); // For notifications mode
  const [sendingRequest, setSendingRequest] = useState(null); // Track which request is being sent
  
  const isNotificationMode = mode === 'notifications';
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Fetch friend request status for a user
  const checkFriendRequestStatus = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/friends/status/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFriendRequestStates(prev => ({
          ...prev,
          [userId]: data.status // 'none', 'pending', 'accepted', 'rejected'
        }));
      }
    } catch (error) {
      console.error('Error checking friend status:', error);
    }
  };

  // Fetch pending friend requests for notifications
  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/friends/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingRequests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  // Load pending requests when switching to notifications mode
  useEffect(() => {
    if (isOpen && isNotificationMode) {
      fetchPendingRequests();
    }
  }, [isOpen, isNotificationMode]);

  if (!isOpen) return null;

  const handleSearch = async (value) => {
    setSearch(value);
    
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
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
      
      // Check friend request status for each result
      if (Array.isArray(data)) {
        data.forEach(user => {
          checkFriendRequestStatus(user.id || user.publicId);
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = (userId) => {
    const status = friendRequestStates[userId];
    if (status === 'pending') return 'SENT';
    if (status === 'accepted') return 'MESSAGE';
    return 'FRIEND';
  };

  const getButtonEmoji = (userId) => {
    const status = friendRequestStates[userId];
    if (status === 'pending') return '⏳';
    if (status === 'accepted') return '💬';
    return '🤝';
  };

  const sendFriendRequest = async (targetUserId) => {
    setSendingRequest(targetUserId);
    try {
      const response = await fetch(`${BACKEND_URL}/api/friends/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ targetUserId })
      });

      if (response.ok) {
        // Update local state to show SENT
        setFriendRequestStates(prev => ({
          ...prev,
          [targetUserId]: 'pending'
        }));
        console.log('Friend request sent to:', targetUserId);
      } else {
        console.error('Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setSendingRequest(null);
    }
  };

  const handleAcceptRequest = async (requestId, senderId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/friends/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ requestId })
      });

      if (response.ok) {
        // Update states
        setFriendRequestStates(prev => ({
          ...prev,
          [senderId]: 'accepted'
        }));
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        console.log('Friend request accepted');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/friends/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ requestId })
      });

      if (response.ok) {
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        console.log('Friend request rejected');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
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

        {/* Results Container - Search Mode */}
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
                      title={getButtonText(user.id || user.publicId)}
                      onClick={(e) => {
                        e.stopPropagation();
                        sendFriendRequest(user.id || user.publicId);
                      }}
                      disabled={friendRequestStates[user.id || user.publicId] === 'pending' || sendingRequest === (user.id || user.publicId)}
                    >
                      <span className="friend-emoji" aria-hidden="true">{getButtonEmoji(user.id || user.publicId)}</span>
                      <span className="friend-text">{getButtonText(user.id || user.publicId)}</span>
                    </button>
                  </div>
                  <p className="result-id">ID: {user.publicId}</p>
                </div>
              </div>
              ))
            )}
          </div>
        )}

        {/* Notifications Mode - Pending Friend Requests */}
        {isNotificationMode && (
          <div className="search-results">
            {pendingRequests.length === 0 ? (
              <div className="search-empty-state">
                <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', marginTop: '40px' }}>
                  No pending friend requests
                </p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="notification-request-item"
                >
                <div className="request-avatar">
                  {request.senderAvatar && request.senderAvatar.startsWith('http') ? (
                    <img
                      src={request.senderAvatar}
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
                <div className="request-info">
                  <p className="request-name">{request.senderName}</p>
                  <p className="request-id">ID: {request.senderId}</p>
                </div>
                <div className="request-actions">
                  <button
                    className="accept-btn"
                    title="Accept"
                    onClick={() => handleAcceptRequest(request.id, request.senderId)}
                  >
                    ✔️
                  </button>
                  <button
                    className="reject-btn"
                    title="Reject"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    ❌
                  </button>
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
