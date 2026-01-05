import React, { useState, useEffect, useContext } from 'react';
import './MessagesModal.css';
import { getFriends } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useUnread } from '../context/UnreadContext';
import ChatBox from './ChatBox';

const MessagesModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext) || {};
  const { setUnreadCount, refetchUnreadCount } = useUnread();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load friends list
  useEffect(() => {
    if (!isOpen || !user?.uuid) return;

    const loadFriends = async () => {
      try {
        setIsLoading(true);
        const data = await getFriends();
        setFriends(data || []);
        refetchUnreadCount();
      } catch (error) {
        console.error('Error loading friends:', error);
        setFriends([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFriends();
  }, [isOpen, user?.uuid, refetchUnreadCount]);

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => {
    const query = searchQuery.toLowerCase();
    return (
      friend.display_name?.toLowerCase().includes(query) ||
      friend.id?.toLowerCase().includes(query) ||
      friend.shortId?.toLowerCase().includes(query)
    );
  });

  const openChat = (friend) => {
    setActiveChat(friend);
  };

  const closeChat = () => {
    setActiveChat(null);
    refetchUnreadCount();
  };

  if (!isOpen) return null;

  // If chat is active, show ChatBox
  if (activeChat) {
    return (
      <div className="messages-modal-overlay" onClick={onClose}>
        <div className="messages-modal-container" onClick={e => e.stopPropagation()}>
          <div className="messages-modal-header">
            <button 
              className="messages-modal-back"
              onClick={closeChat}
              title="Back to friends"
            >
              ← Back
            </button>
            <h2>{activeChat.display_name}</h2>
            <button className="messages-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="messages-modal-body">
            <ChatBox 
              friend={activeChat} 
              onBack={closeChat}
              onMessageSent={() => refetchUnreadCount()}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show friends list
  return (
    <div className="messages-modal-overlay" onClick={onClose}>
      <div className="messages-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="messages-modal-header">
          <h2>Messages</h2>
          <button className="messages-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="messages-search-container">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="messages-search-input"
          />
          <span className="messages-search-icon">🔍</span>
        </div>

        {/* Friends List */}
        <div className="messages-modal-body">
          {isLoading ? (
            <div className="messages-loading">
              <p>Loading friends...</p>
            </div>
          ) : friends.length === 0 ? (
            <div className="messages-empty-state">
              <p style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '40px'
              }}>
                No friends yet
              </p>
              <p style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.9rem',
                marginTop: '10px'
              }}>
                Start matching to add friends!
              </p>
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="messages-empty-state">
              <p style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '40px'
              }}>
                No friends match your search
              </p>
            </div>
          ) : (
            <div className="messages-friends-list">
              {filteredFriends.map(friend => (
                <div
                  key={friend.id}
                  className="messages-friend-item"
                  onClick={() => openChat(friend)}
                >
                  {/* Avatar */}
                  <div className="messages-friend-avatar">
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
                      <div className="messages-friend-avatar-fallback">
                        {friend.display_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Friend Info */}
                  <div className="messages-friend-info">
                    <p className="messages-friend-name">{friend.display_name}</p>
                    {friend.location && (
                      <p className="messages-friend-location">📍 {friend.location}</p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="messages-friend-arrow">
                    →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
