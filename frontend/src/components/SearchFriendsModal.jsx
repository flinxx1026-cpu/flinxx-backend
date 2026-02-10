import React, { useState, useEffect, useContext } from 'react';
import './SearchFriendsModal.css';
import { getFriends, markMessagesAsRead, getNotifications } from '../services/api';
import { MessageContext } from '../context/MessageContext';
import { AuthContext } from '../context/AuthContext';
import { useUnread } from '../context/UnreadContext';
import ChatBox from './ChatBox';

const SearchFriendsModal = ({ isOpen, onClose, onUserSelect, mode = 'search' }) => {
  const { markAsRead } = useContext(MessageContext) || {};
  const { user, sentRequests, refreshSentRequests } = useContext(AuthContext) || {};
  const { setUnreadCount, refetchUnreadCount } = useUnread();
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [friendRequestStates, setFriendRequestStates] = useState({});
  const [sendingRequest, setSendingRequest] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  
  const isNotificationMode = mode === 'notifications';
  const isMessageMode = mode === 'message';
  const isLikesMode = mode === 'likes';
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

      // Normalize publicId and id from all possible sources
      return {
        ...storedUser,
        publicId: storedUser.publicId || storedUser.public_id || storedUser.id,
        id: storedUser.uuid || storedUser.id || storedUser.publicId || storedUser.public_id
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

  // Ensure current user is in localStorage when modal opens
  useEffect(() => {
    if (!isOpen) return;
    // Call ensureCurrentUser to refresh user data if needed
    ensureCurrentUser();
  }, [isOpen]);

  // ✅ ALWAYS load friends when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    if (user?.uuid && user.uuid.length === 36) {
      console.log('📨 Loading friends for message mode');
      getFriends(user.uuid).then(data => {
        const sorted = Array.isArray(data) ? data.sort((a, b) => {
          const timeA = a.last_message_at ? new Date(a.last_message_at) : new Date(0);
          const timeB = b.last_message_at ? new Date(b.last_message_at) : new Date(0);
          return timeB - timeA;
        }) : [];
        setFriends(sorted);
      }).catch(err => {
        console.error('❌ Error loading friends:', err);
        setFriends([]);
      });
    }
  }, [isOpen, user?.uuid]);

  // ✅ REFRESH sent requests when panel opens (not just on mount)
  useEffect(() => {
    if (!isOpen) return;
    // Refresh in both notification and likes modes
    if (!isNotificationMode && !isLikesMode) return;
    
    if (user?.uuid && user.uuid.length === 36 && refreshSentRequests) {
      console.log('🔄 Refreshing sent requests when panel opens');
      refreshSentRequests();
    }
  }, [isOpen, isNotificationMode, isLikesMode, user?.uuid, refreshSentRequests]);

  // ✅ FETCH INCOMING REQUESTS when Likes mode opens
  useEffect(() => {
    if (!isOpen || !isLikesMode) return;
    
    const fetchIncomingRequests = async () => {
      if (!user?.uuid || user.uuid.length !== 36) {
        console.warn('⛔ Cannot fetch incoming requests - invalid user UUID');
        return;
      }
      
      setNotificationsLoading(true);
      try {
        console.log('📥 Fetching incoming friend requests...');
        const data = await getNotifications(user.uuid);
        console.log('✅ Incoming requests loaded:', data.length, 'items');
        setIncomingRequests(data || []);
      } catch (err) {
        console.error('❌ Error fetching incoming requests:', err);
        setIncomingRequests([]);
      } finally {
        setNotificationsLoading(false);
      }
    };
    
    fetchIncomingRequests();
  }, [isOpen, isLikesMode, user?.uuid]);

  // ✅ Sent requests come from centralized AuthContext (single source of truth)
  // These are requests sent BY the user to others (shown in Friends & Requests list)
  // Incoming requests are handled ONLY via socket popup event
  const pendingRequests = sentRequests || [];
  
  // 🔍 DEBUG: Log what we're displaying
  useEffect(() => {
    if (isLikesMode && pendingRequests.length > 0) {
      console.log(`🔍 [SearchFriendsModal] Displaying ${pendingRequests.length} requests in Likes mode:`);
      pendingRequests.forEach((req, idx) => {
        console.log(`   ${idx + 1}. "${req.display_name}" - Status: ${req.status}`);
        console.log(`      sender_id: ${req.sender_id?.substring(0, 8)}...`);
        console.log(`      receiver_id: ${req.receiver_id?.substring(0, 8)}...`);
      });
    }
  }, [pendingRequests, isLikesMode]);

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
      
      // Update local state to clear the unread badge for this friend
      setFriends(prevFriends =>
        prevFriends.map(f =>
          f.id === friend.id ? { ...f, unreadCount: 0 } : f
        )
      );
      
      // 🔥 CRITICAL FIX: Refetch global unread count after marking as read
      // This ensures badge resets to 0 when all chats are opened
      await refetchUnreadCount();
    }
    
    // Mark this friend's messages as read in local context
    if (markAsRead && friend.id) {
      markAsRead(friend.id);
    }
    
    // ✅ Decrement unread count locally (no API call needed)
    setUnreadCount(prev => Math.max(prev - 1, 0));
    
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

      // Use uuid or publicId for sender - try multiple possible fields
      const senderId = currentUserData?.uuid || currentUserData?.id || currentUserData?.publicId || currentUserData?.public_id;
      
      if (!senderId) {
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
          senderPublicId: String(senderId),
          receiverPublicId: String(targetUserId)
        })
      });

      if (response.ok) {
        // ✅ Update UI state ONLY - button state change
        setFriendRequestStates(prev => ({
          ...prev,
          [targetUserId]: 'pending'
        }));
        console.log('Friend request sent to:', targetUserId);
        
        // ✅ CRITICAL FIX: Refresh sent requests immediately after sending
        // This ensures the request appears in Friends & Requests modal right away
        if (refreshSentRequests) {
          console.log('🔄 Refreshing sent requests after search modal friend request...');
          refreshSentRequests();
        }
        
        // ✅ DO NOT call refreshNotifications() here
        // Backend will emit socket event to receiver
        // AuthContext socket listener will update real-time popup
        // Notifications polling will catch this request in 5 seconds
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
        console.log('✅ Friend request accepted:', requestId);
        
        // ✅ Remove from incoming requests list
        setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
        
        // ✅ Update friend state if senderId exists
        if (senderId) {
          setFriendRequestStates(prev => ({
            ...prev,
            [senderId]: 'accepted'
          }));
        }
      } else {
        console.error('Failed to accept friend request:', response.status);
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
        console.log('❌ Friend request rejected:', requestId);
        
        // ✅ Remove from incoming requests list immediately
        setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        console.error('Failed to reject friend request:', response.status);
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
          <h2>
            {isMessageMode ? 'Messages' : 
             isNotificationMode ? 'Friend Requests' : 
             isLikesMode ? '❤️ Friends & Requests' :
             'Search Friends'}
          </h2>
          <button className="search-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Search Input - Hidden in Notifications, Message, or Likes Mode */}
        {!isNotificationMode && !isMessageMode && !isLikesMode && (
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
        {!isNotificationMode && !isMessageMode && !isLikesMode && (
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
                  <p className="tap-to-chat">
                    {friendRequestStates[user.publicId] === 'accepted' && user.unreadCount > 0 ? 'New message' : 'Tap to chat'}
                  </p>
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
                        <p className="tap-to-chat">
                          {friend.unreadCount > 0 ? 'New message' : 'Tap to chat'}
                        </p>
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

        {/* Likes Container - Shows Friend Requests + Friends List */}
        {isLikesMode && (
          <div className="message-panel-body">
            {activeChat ? (
              // CHAT VIEW in likes mode
              <ChatBox
                friend={activeChat}
                onBack={() => setActiveChat(null)}
                onMessageSent={updateChatListOnMessage}
              />
            ) : (
              <div className="search-results">
                {/* SECTION 1: Incoming Friend Requests (Received by User) */}
                {notificationsLoading ? (
                  <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '20px' }}>
                    Loading requests...
                  </p>
                ) : incomingRequests && incomingRequests.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      margin: '0'
                    }}>
                      💚 {incomingRequests.length} Incoming Request{incomingRequests.length !== 1 ? 's' : ''}
                    </h3>
                    {incomingRequests.map(req => (
                      <div key={req.id} className="notification-item" style={{ marginTop: '10px' }}>
                        <div className="notification-avatar">
                          {req.photo_url ? (
                            <img src={req.photo_url} alt={req.display_name} />
                          ) : (
                            <div className="text-avatar">
                              {req.display_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                        </div>

                        <div className="notification-text">
                          <strong>{req.display_name}</strong>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            {req.status === 'pending' ? '⏳ Wants to be your friend' : req.status === 'accepted' ? '✓ Friends' : '❌ Rejected'}
                          </p>
                        </div>

                        {req.status === 'pending' && (
                          <div className="message-actions">
                            <button
                              className="accept-btn"
                              onClick={() => handleAcceptRequest(req.id, req.sender_id)}
                              style={{ backgroundColor: '#10b981', color: '#fff' }}
                              title="Accept"
                            >
                              ✓
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleRejectRequest(req.id)}
                              style={{ backgroundColor: '#ef4444', color: '#fff' }}
                              title="Reject"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* SECTION 2: Friend Requests (Sent by User) */}
                {pendingRequests && pendingRequests.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ 
                      color: '#fff', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      📤 {pendingRequests.length} Sent Request{pendingRequests.length !== 1 ? 's' : ''}
                    </h3>
                    {pendingRequests.map(req => (
                      <div key={req.id} className="notification-item" style={{ marginTop: '10px' }}>
                        <div className="notification-avatar">
                          {req.photo_url ? (
                            <img src={req.photo_url} alt={req.display_name} />
                          ) : (
                            <div className="text-avatar">
                              {req.display_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                        </div>

                        <div className="notification-text">
                          <strong>{req.display_name}</strong>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            {req.status === 'pending' ? '⏳ Request sent' : req.status === 'accepted' ? '✓ Friends' : 'Request rejected'}
                          </p>
                        </div>

                        {req.status === 'accepted' && (
                          <button
                            className="message-btn"
                            onClick={() => {
                              console.log('Opening chat with:', req);
                              // Use req.id if it's a valid UUID (36 chars), otherwise fallback to receiver_id
                              const friendId = (req.user_id && typeof req.user_id === 'string' && req.user_id.length === 36) 
                                ? req.user_id 
                                : req.receiver_id;
                              const chatUser = {
                                ...req,
                                id: friendId
                              };
                              setActiveChat(chatUser);
                            }}
                          >
                            Message
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {(!pendingRequests || pendingRequests.length === 0) && (
                  <p
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '40px',
                      padding: '20px'
                    }}
                  >
                    No sent requests yet
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriendsModal;