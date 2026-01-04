import React, { useState, useEffect, useContext } from 'react';
import './SearchFriendsModal.css';
import { getFriends, markMessagesAsRead } from '../services/api';
import { MessageContext } from '../context/MessageContext';
import { AuthContext } from '../context/AuthContext';
import { useUnread } from '../context/UnreadContext';
import ChatBox from './ChatBox';
import { joinUserRoom } from '../services/socketService';

const SearchFriendsModal = ({ isOpen, onClose, onUserSelect, mode = 'search' }) => {
  const { markAsRead } = useContext(MessageContext) || {};
  const { user, notifications, refreshNotifications } = useContext(AuthContext) || {};
  const { setUnreadCount, refetchUnreadCount } = useUnread();
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [friendRequestStates, setFriendRequestStates] = useState({});
  const [sendingRequest, setSendingRequest] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    email: '',
    picture: '',
    location: '',
    gender: '',
    tokens: 0,
    gems: 0
  });

  // Flex Plans data for Achievements tab
  const flexItems = [
    {
      id: "blue-tick",
      name: "Blue Tick",
      emoji: "✓",
      price: "₹69",
      features: [
        "Verification badge",
        "Trust boost",
        "Status indicator"
      ]
    },
    {
      id: "chat-themes",
      name: "Chat Themes",
      emoji: "🎨",
      price: "₹49",
      features: [
        "Unlock themes",
        "Custom colors",
        "Personal style"
      ]
    },
    {
      id: "match-boost",
      name: "Match Boost",
      emoji: "⚡",
      price: "₹39",
      features: [
        "30 min visibility boost",
        "Increased reach",
        "More matches"
      ]
    },
    {
      id: "profile-ring",
      name: "Profile Ring",
      emoji: "💍",
      price: "₹79",
      features: [
        "Colored profile ring",
        "Stand out",
        "Eye-catching design"
      ]
    },
    {
      id: "profile-highlight",
      name: "Profile Highlight",
      emoji: "⭐",
      price: "₹99",
      features: [
        "24h highlight",
        "Top search visibility",
        "Premium placement"
      ]
    }
  ];
  
  // ✅ Determine which mode we're in
  const isNotificationMode = mode === 'notifications';
  const isMessageMode = mode === 'message';
  const isProfileMode = mode === 'profile';
  const isSearchMode = mode === 'search';
  const isLikesMode = mode === 'likes';
  const isTrophyMode = mode === 'trophy';
  const isTimerMode = mode === 'timer';

  // DEBUG: Log active mode
  if (isOpen) {
    console.log("📊 MODAL OPEN - Current Mode:", { isProfileMode, isMessageMode, isSearchMode, isLikesMode, isTrophyMode, isTimerMode, mode });
  }
  
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

  // ✅ REFRESH notifications when panel opens (not just on mount)
  useEffect(() => {
    if (!isOpen) return;
    if (!isNotificationMode) return;
    
    if (user?.uuid && user.uuid.length === 36 && refreshNotifications) {
      console.log('🔄 Refreshing notifications when panel opens');
      refreshNotifications();
    }
  }, [isOpen, isNotificationMode, user?.uuid, refreshNotifications]);

  // ✅ Load profile data when profile tab opens
  useEffect(() => {
    if (!isOpen || !isProfileMode) return;
    
    const loadProfileData = async () => {
      setIsProfileLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${BACKEND_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setProfileData({
              id: data.user.id || data.user.userId || '',
              name: data.user.name || 'User',
              email: data.user.email || '',
              picture: data.user.picture || 'https://via.placeholder.com/120',
              location: data.user.location || 'Not set',
              gender: data.user.gender || 'Not set',
              tokens: data.user.tokens || 0,
              gems: data.user.gems || 0
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsProfileLoading(false);
      }
    };
    
    loadProfileData();
  }, [isOpen, isProfileMode, BACKEND_URL]);

  // ✅ Notifications come from centralized AuthContext (single source of truth)
  // No need to fetch here - AuthContext manages it
  const pendingRequests = notifications || [];

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


  // Handle Sign Out click
  const handleSignOut = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('notifications');
      
      // Navigate to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
    }
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

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const friendName = (friend.display_name || '').toLowerCase();
    const friendId = (friend.id || '').toLowerCase();
    
    return friendName.includes(query) || friendId.includes(query);
  });

  return (
    <div className="search-friends-overlay" onClick={onClose}>
      <div className="search-friends-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header - Hidden in Profile Mode */}
        {!isProfileMode && (
          <div className="search-friends-header">
            <h2>
              {isMessageMode ? 'Message' : 
               isNotificationMode ? 'Notifications' : 
               isSearchMode ? 'Search Friends' : 
               isLikesMode ? 'Likes' : 
               isTrophyMode ? 'Achievements' : 
               isTimerMode ? 'History' : 
               'Search Friends'}
            </h2>
            <button className="search-close-btn" onClick={onClose}>✖</button>
          </div>
        )}

        {/* Search Input - Hidden in Notifications, Message, or other side-tab modes */}
        {!isNotificationMode && !isMessageMode && !isProfileMode && !isLikesMode && !isTrophyMode && !isTimerMode && (
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

        {/* Message Mode Search Input */}
        {isMessageMode && !activeChat && (
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search a friend by ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
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
            ) : !notifications ? (
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
                ) : filteredFriends.length === 0 ? (
                  <p
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '40px'
                    }}
                  >
                    No friends match your search
                  </p>
                ) : (
                  filteredFriends.map(friend => (
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

        {/* Profile Tab */}
        {isProfileMode && (
          <div className="profile-panel">
            {/* Profile Header - STICKY */}
            <div className="profile-header">
              <h3>👤 My Profile {isProfileLoading && <span style={{ marginLeft: '8px', fontSize: '16px' }}>⏳</span>}</h3>
              <button 
                onClick={onClose}
                className="search-close-btn"
                style={{ width: '28px', height: '28px' }}
              >
                ✕
              </button>
            </div>

            {/* Profile Body - SCROLLABLE */}
            <div className="profile-body">
              {isProfileLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '14px'
                }}>
                  Loading profile...
                </div>
              ) : (
                <>
                  {/* Profile Avatar */}
                  <div style={{ textAlign: 'center', marginBottom: '25px', marginTop: '0' }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      margin: '0 auto 15px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      border: '3px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <img 
                        src={profileData.picture} 
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                <h3 style={{ color: 'white', margin: '8px 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {profileData.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '8px 0', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', wordBreak: 'break-all' }}>
                  ID: {profileData.id.substring(0, 16)}...
                </p>
              </div>

              {/* Premium Section */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'white', margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold' }}>⭐ Flinxx Premium</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0', fontSize: '13px' }}>Unlock premium features</p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={handleSignOut} style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  transition: 'opacity 0.2s'
                }} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                  🚪 Sign Out
                </button>
              </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Likes Tab */}
        {isLikesMode && (
          <div className="likes-panel">
            {/* Likes Header - STICKY */}
            <div className="likes-header">
              <h3>❤️ Likes</h3>
              <button 
                onClick={onClose}
                className="search-close-btn"
                style={{ width: '28px', height: '28px' }}
              >
                ✕
              </button>
            </div>

            {/* Likes Body - SCROLLABLE */}
            <div className="likes-body">
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                <p>❤️ Likes/Profile Visitors coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Trophy/Achievements Tab - Now shows Flex Plans */}
        {isTrophyMode && (
          <>
            {console.log("🏆 TROPHY/ACHIEVEMENTS JSX RENDERED - isTrophyMode:", isTrophyMode)}
            <div className="achievements-panel">
              {/* Achievements Header - STICKY */}
              <div className="achievements-header">
                <h3>🏆 Achievements</h3>
                <button 
                  onClick={onClose}
                  className="search-close-btn"
                  style={{ width: '28px', height: '28px' }}
                >
                  ✕
                </button>
              </div>

              {/* Achievements Body - SCROLLABLE */}
              <div className="achievements-body" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', paddingBottom: '8px', paddingTop: '0' }}>
                  <h4 style={{ color: 'white', fontSize: '16px', margin: '0 0 8px 0', fontWeight: '600' }}>Flex Plans</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>Choose individual features</p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px 12px', display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  {flexItems.map((item) => (
                    <div key={item.id} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                        <h4 style={{ color: 'white', margin: 0, fontSize: '14px', fontWeight: '600' }}>{item.name}</h4>
                      </div>

                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 'bold' }}>{item.price}</div>

                      <ul style={{ margin: '8px 0', padding: '0 0 0 16px', listStyle: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                        {item.features.map((feature, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            <span style={{ marginRight: '6px' }}>•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        transition: 'opacity 0.2s',
                        marginTop: '4px'
                      }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                        Add Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Timer/History Tab */}
        {isTimerMode && (
          <div className="search-results">
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              <p>⏱️ Call History coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriendsModal;