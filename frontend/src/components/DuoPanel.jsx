import React, { useState, useEffect, useContext, useRef } from 'react';
import './DuoPanel.css';
import { getFriends, markMessagesAsRead } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MessageContext } from '../context/MessageContext';
import { useUnread } from '../context/UnreadContext';
import ChatBox from './ChatBox';

const DuoPanel = ({ isOpen = true, onClose }) => {
  const { user } = useContext(AuthContext) || {};
  const { markAsRead } = useContext(MessageContext) || {};
  const { refetchUnreadCount } = useUnread() || {};
  const [friends, setFriends] = useState(null); // null = loading, array = loaded (never reset)
  const [activeChat, setActiveChat] = useState(null);
  const hasFetchedRef = useRef(false); // Track if data has been fetched in this render lifecycle
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Debug: Log when DuoPanel mounts
  useEffect(() => {
    console.log("🎯 MyDuoSquad mounted");
  }, []);

  // Fetch accepted friends list only once
  useEffect(() => {
    // If friends are already loaded (not null), don't fetch again
    if (friends !== null) return;
    
    // If already fetching, don't fetch again
    if (hasFetchedRef.current) return;
    
    // Only fetch if modal is open and user is ready
    if (!isOpen || !user?.uuid) return;
    
    const fetchFriendsList = async () => {
      try {
        // getFriends returns only ACCEPTED friends from the API
        const friendsData = await getFriends(user.uuid);
        // Sort by last message time (most recent first)
        const sortedFriends = Array.isArray(friendsData) 
          ? friendsData.sort((a, b) => {
              const timeA = a.last_message_at ? new Date(a.last_message_at) : new Date(0);
              const timeB = b.last_message_at ? new Date(b.last_message_at) : new Date(0);
              return timeB - timeA;
            })
          : [];
        // Set friends - once set, never reset to null again
        setFriends(sortedFriends);
        hasFetchedRef.current = true;
      } catch (error) {
        console.error('❌ Failed to fetch accepted friends:', error);
        // Set to empty array on error - never goes back to null
        setFriends([]);
        hasFetchedRef.current = true;
      }
    };

    fetchFriendsList();
  }, [isOpen, user?.uuid]); // Only depend on isOpen and user?.uuid, NOT friends

  // Update friends list when message is sent
  const updateChatListOnMessage = (friendId, messageTime) => {
    setFriends(prevFriends => {
      const updatedFriends = prevFriends.map(friend =>
        friend.id === friendId
          ? { ...friend, last_message_at: messageTime }
          : friend
      );
      // Re-sort by last message time
      return updatedFriends.sort((a, b) => {
        const timeA = a.last_message_at ? new Date(a.last_message_at) : new Date(0);
        const timeB = b.last_message_at ? new Date(b.last_message_at) : new Date(0);
        return timeB - timeA;
      });
    });
    // Refresh unread count after sending message
    if (refetchUnreadCount) {
      refetchUnreadCount();
    }
  };

  // Handle opening chat with a friend and marking messages as read
  const handleOpenChat = async (friend) => {
    try {
      // Mark messages as read in database
      if (user?.uuid && user.uuid.length === 36 && friend.id) {
        await markMessagesAsRead(user.uuid, friend.id);
      }
      
      // Mark as read in context (same as notifications panel)
      if (markAsRead && friend.id) {
        markAsRead(friend.id);
      }
      
      // Open chat
      setActiveChat(friend);
      
      // Refresh unread count
      if (refetchUnreadCount) {
        refetchUnreadCount();
      }
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
      // Still open chat even if marking as read fails
      setActiveChat(friend);
    }
  };

  return (
    <div className="duo-panel" style={{ backgroundColor: '#131313', border: '1px solid #d9b85f', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Close Button */}
      <button
        className="modal-close-btn"
        onClick={onClose}
        title="Close"
      >
        ✕
      </button>
      
      {/* Header */}
      <div className="w-full mb-6">
        <h3 className="text-2xl font-bold" style={{ color: '#d9b85f' }}>My Duo Squad</h3>
      </div>

      {/* Friends List - Shows Accepted Friends */}
      <div className="duo-friends-list" style={{ flex: 1, width: '100%', overflowY: 'auto' }}>
        {activeChat ? (
          // Chat view
          <ChatBox
            friend={activeChat}
            onBack={() => setActiveChat(null)}
            onMessageSent={updateChatListOnMessage}
          />
        ) : friends === null ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '20px' }}>
            Loading squad...
          </p>
        ) : friends.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '20px' }}>
            <p>No squad members yet</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Add friends to build your duo squad</p>
          </div>
        ) : (
          // Display accepted friends using the same UI as notifications list
          friends.map(friend => (
            <div key={friend.id} className="notification-item" style={{ marginBottom: '0' }}>
              <div className="notification-avatar">
                {friend.photo_url ? (
                  <img src={friend.photo_url} alt={friend.display_name} />
                ) : (
                  <div className="text-avatar">
                    {friend.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="notification-text">
                <strong>{friend.display_name}</strong>
              </div>

              {/* Message button to open chat - same as notifications panel */}
              <div className="message-actions">
                <button
                  className="message-btn"
                  onClick={() => handleOpenChat(friend)}
                  title="Send a message"
                >
                  Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DuoPanel;
