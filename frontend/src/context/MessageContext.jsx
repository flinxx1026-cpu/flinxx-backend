import React, { createContext, useState } from 'react';

// Create Message Context
export const MessageContext = createContext();

// Message Provider Component
export const MessageProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState({}); // { userId: true }

  // Mark a user's messages as unread
  const markAsUnread = (userId) => {
    setUnreadMessages(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  // Mark a user's messages as read
  const markAsRead = (userId) => {
    setUnreadMessages(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  // Get total unread count
  const unreadCount = Object.keys(unreadMessages).length;

  const value = {
    unreadMessages,
    setUnreadMessages,
    markAsUnread,
    markAsRead,
    unreadCount
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};
