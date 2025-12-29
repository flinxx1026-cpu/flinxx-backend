import React, { useState, useEffect, useContext } from 'react';
import './SearchFriendsModal.css';
import { getFriends, getNotifications, markMessagesAsRead } from '../services/api';
import { MessageContext } from '../context/MessageContext';
import { AuthContext } from '../context/AuthContext';
import ChatBox from './ChatBox';
import { joinUserRoom } from '../services/socketService';

const SearchFriendsModal = ({ isOpen, onClose, onUserSelect, mode = 'search' }) => {
  const { markAsRead } = useContext(MessageContext) || {};
  const { user } = useContext(AuthContext) || {};
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsCached, setNotificationsCached] = useState(false);
  const [friendRequestStates, setFriendRequestStates] = useState({}); // Track request status by userId
  const [pendingRequests, setPendingRequests] = useState([]); // For notifications mode
  const [sendingRequest, setSendingRequest] = useState(null); // Track which request is being sent
  const [currentUser, setCurrentUser] = useState(null); // Load once when modal opens
  const [friends, setFriends] = useState([]); // For message mode
  const [activeChat, setActiveChat] = useState(null); // null = friends list, object = open chat
  
  const isNotificationMode = mode === 'notifications';
  const isMessageMode = mode === 'message';
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  // Fetch current user from backend and store in localStorage
  const ensureCurrentUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) return null;

      const data = await res.json();

      if (data?.user) {
        const user = {
          ...data.user,
          publicId: data.user.public_id
        };

        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }

      return null;
    } catch (e) {
      console.error('Failed to ensure current user', e);
      return null;
    }
  };

  // Get current user fresh from localStorage - synchronous
  const getCurrentUser = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) return null;

      // Normalize publicId from all possible sources
      return {
        ...storedUser,
        publicId: storedUser.publicId || storedUser.public_id || storedUser.id
      };
    } catch (e) {
      return null;
    }
  };

  // Fetch friend request status for a user
  const checkFriendRequestStatus = async (userId) => {
    try {
      const currentUserData = getCurrentUser();

      if (!currentUserData || !currentUserData.id) {
        console.warn('Current user not available for status check');
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/friends/status?senderPublicId=${currentUserData.id}&receiverPublicId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

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
      console.log('📬 Fetching notifications...');
      setNotificationsLoading(true);
      if (!user?.uuid || user.uuid.length !== 36) {
        console.warn('UUID not ready for notifications');
        return;
      }
      const data = await getNotifications(user.uuid);
      setPendingRequests(Array.isArray(data) ? data : []);
      setNotificationsCached(true); // Mark as cached for next time
      console.log('✅ Notifications updated:', data.length, 'items');
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Ensure current user is in localStorage when modal opens
  useEffect(() => {
    if (!isOpen) return;
    // Call ensureCurrentUser to refresh user data if needed
    ensureCurrentUser();
  }, [isOpen]);

  // Load pending requests when switching to notifications mode
  useEffect(() => {
    if (isOpen && isNotificationMode && !notificationsCached) {
      // Fetch in background, don't block modal open
      fetchPendingRequests();
    }
  }, [isOpen, isNotificationMode]);

  // Load friends when switching to message mode
  useEffect(() => {
    if (isOpen && isMessageMode) {
      if (!user?.uuid || user.uuid.length !== 36) {
        console.warn('UUID not ready for friends');
        return;
      }
      getFriends(user.uuid).then(data => {
        // Sort friends by last message time (newest first)
        const sorted = Array.isArray(data) ? data.sort((a, b) => {
          const timeA = a.last_message_at ? new Date(a.last_message_at) : new Date(0);
          const timeB = b.last_message_at ? new Date(b.last_message_at) : new Date(0);
          return timeB - timeA;
        }) : [];
        setFriends(sorted);
      });
    }
  }, [isOpen, isMessageMode, user?.uuid]);

  // ✅ Update chat list when message is sent or received
  const updateChatListOnMessage = (friendId, messageTime) => {
    setFriends(prevFriends => {
      // Find the friend and update their last_message_at
      const updatedFriends = prevFriends.map(friend =>
        friend.id === friendId
          ? { ...friend, last_message_at: messageTime }
          : friend
      );

      // Re-sort by last message time (newest first)
      return updatedFriends.sort((a, b) => {
        const timeA = a.last_message_at ? new Date(a.last_message_at) : new Date(0);
        const timeB = b.last_message_at ? new Date(b.last_message_at) : new Date(0);
        return timeB - timeA;
      });
    });
  };
  // Open chat handler
  const openChat = async (friend) => {
    // Mark this friend's messages as read in database
    if (friend?.id && user?.uuid && user.uuid.length === 36) {
      await markMessagesAsRead(user.uuid, friend.id);
    }
    
    // Mark this friend's messages as read in local context
    if (markAsRead && friend.id) {
      markAsRead(friend.id);
    }
    
    // Just set the active chat - ChatBox component will handle socket room joining
    setActiveChat(friend);
  };

  if (!isOpen) return null;

  const handleSearch = async (value) => {
    // Optional safety check: prevent accidental wrong search requests
    if (!value || typeof value !== 'string') return;
    
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
          checkFriendRequestStatus(user.publicId);
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
    // Prevent duplicate friend request
    const friendStatus = friendRequestStates[targetUserId];
    if (friendStatus === 'pending' || friendStatus === 'accepted') {
      console.log('Friend request already sent or accepted');
      return;
    }

    setSendingRequest(targetUserId);
    try {
      const currentUserData = getCurrentUser();

      if (!currentUserData?.id) {
        console.error('Current user id not found', currentUserData);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/friends/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          senderPublicId: String(currentUserData.id),
          receiverPublicId: String(targetUserId)
        })
      });

      if (response.ok) {
        // Update UI state immediately after success
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
        // Update states - update status instead of filtering out
        setFriendRequestStates(prev => ({
          ...prev,
          [senderId]: 'accepted'
        }));
        setPendingRequests(prev =>
          prev.map(req =>
            req.id === requestId ? { ...req, status: 'accepted' } : req
          )
        );
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
          <h2>{isMessageMode ? 'Message' : isNotificationMode ? 'Notifications' : 'Search Friends'}</h2>
          <button className="search-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Search Input - Hidden in Notifications or Message Mode */}
        {!isNotificationMode && !isMessageMode && (
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
        {!isNotificationMode && !isMessageMode && (
          <div className="search-results">
            {results.length === 0 ? (
              <div className="search-empty-state">
                <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', marginTop: '40px' }}>
                  {search ? 'No users found' : ''}
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
                      disabled={friendRequestStates[user.publicId] === 'pending'}
                      onClick={(e) => {
                        e.stopPropagation();
                        sendFriendRequest(user.publicId);
                      }}
                    >
                      <span className="friend-emoji" aria-hidden="true">{getButtonEmoji(user.publicId)}</span>
                      <span className="friend-text">{getButtonText(user.publicId)}</span>
                    </button>
                  </div>
                  <p className="tap-to-chat">Tap to chat</p>
                </div>
              </div>
              ))
            )}
          </div>
        )}

        {/* Notifications Container - Notifications Mode */}
        {isNotificationMode && (
          <div className="search-results">
            {activeChat ? (
              // CHAT VIEW in notifications mode
              <ChatBox
                friend={activeChat}
                onBack={() => setActiveChat(null)}
                onMessageSent={updateChatListOnMessage}
              />
            ) : notificationsLoading ? (
              <p
                style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                  marginTop: '40px'
                }}
              >
                Loading notifications...
              </p>
            ) : pendingRequests.length === 0 ? (
              <p
                style={{
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: '40px'
                }}
              >
                No notifications
              </p>
            ) : (
              pendingRequests.map(req => (
                <div key={req.id} className="notification-item">
                  <div className="notification-avatar">
                    {req.photo_url ? (
                      <img src={req.photo_url} alt={req.display_name} />
                    ) : (
                      <div className="text-avatar">
                        {req.display_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="notification-text">
                    <strong>{req.display_name}</strong>
                  </div>

                  {req.status === 'accepted' && (
                    <div className="message-actions">
                      <button
                        className="message-btn"
                        onClick={async () => {
                          // Mark as read in database
                          if (user?.uuid && user.uuid.length === 36 && req.user_id) {
                            await markMessagesAsRead(user.uuid, req.user_id);
                          }
                          
                          // Mark as read in context
                          if (markAsRead && req.user_id) {
                            markAsRead(req.user_id);
                          }
                          // Open chat with this user
                          // Ensure friend object has 'id' field for ChatBox
                          const chatUser = {
                            ...req,
                            id: req.user_id // Map user_id to id for ChatBox
                          };
                          console.log('Opening chat from notification:', chatUser);
                          setActiveChat(chatUser);
                        }}
                      >
                        Message
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Message Container - Message Mode */}
        {isMessageMode && (
          <div className="message-panel-body">
            {!activeChat ? (
              // FRIEND LIST VIEW
              <div className="search-results">
                {friends.length === 0 ? (
                  <p
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '40px'
                    }}
                  >
                    No friends yet
                  </p>
                ) : (
                  friends.map(friend => (
                    <div 
                      key={friend.id}
                      className="search-result-item friend-row"
                      onClick={() => openChat(friend)}
                    >
                      <div className="result-avatar">
                        {friend.photo_url ? (
                          <img 
                            src={friend.photo_url} 
                            alt={friend.display_name}
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
                        <p className="result-name">{friend.display_name}</p>
                        <p className="tap-to-chat">Tap to chat</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // CHAT VIEW
              <ChatBox
                friend={activeChat}
                onBack={() => setActiveChat(null)}
                onMessageSent={updateChatListOnMessage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriendsModal;