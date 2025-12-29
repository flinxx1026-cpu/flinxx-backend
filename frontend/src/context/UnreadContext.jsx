import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUnreadCount } from "../services/api";
import socket from "../services/socketService";

const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ CRITICAL: Only fetch when user?.uuid is available and valid
  useEffect(() => {
    if (!user?.uuid || user.uuid.length !== 36) {
      console.log('⏸ UnreadContext: Skipping fetch – user UUID not ready');
      return;
    }

    const fetchUnread = async () => {
      console.log('✅ UnreadContext: User ready, fetching unread count');
      const count = await getUnreadCount(user.uuid);
      setUnreadCount(count);
    };

    fetchUnread();

    // Poll every 5 seconds
    const interval = setInterval(fetchUnread, 5000);

    return () => clearInterval(interval);
  }, [user?.uuid]);

  // ✅ SOCKET EVENT: Update unread count when new message arrives
  useEffect(() => {
    if (!user?.uuid || user.uuid.length !== 36) {
      return;
    }

    const handleNewMessage = async () => {
      console.log('📬 New message received via socket, refreshing unread count');
      const count = await getUnreadCount(user.uuid);
      setUnreadCount(count);
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [user?.uuid]);

  return (
    <UnreadContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  );
};

export const useUnread = () => {
  const context = useContext(UnreadContext);
  if (!context) {
    throw new Error("useUnread must be used within UnreadProvider");
  }
  return context;
};
