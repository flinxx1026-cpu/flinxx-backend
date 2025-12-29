import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUnreadCount } from "../services/api";
import socket from "../services/socketService";

const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ CRITICAL: Wait until authLoading is FALSE before attempting any API calls
  // This prevents race conditions on hard refresh
  useEffect(() => {
    // Step 1: Wait for AuthContext to finish loading
    if (authLoading === true) {
      console.log('⏸ UnreadContext: Waiting for AuthContext to load...');
      return;
    }

    // Step 1.5: Extra guard - user must exist
    if (!user) {
      console.log('⏸ UnreadContext: Skipping fetch – user is null');
      return;
    }

    // Step 2: Check if user is ready (not just loading state)
    if (!user?.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
      console.log('⏸ UnreadContext: Skipping fetch – user UUID not valid:', user?.uuid?.length);
      return;
    }

    // Step 3: Now we can safely fetch unread count
    const fetchUnread = async () => {
      console.log('✅ UnreadContext: Auth ready, user valid, fetching unread count');
      try {
        const result = await getUnreadCount(user.uuid);
        const count = typeof result === 'number' ? result : result?.unreadCount || 0;
        setUnreadCount(count);
      } catch (err) {
        console.error('❌ UnreadContext: Error fetching unread count:', err);
        setUnreadCount(0);
      }
    };

    fetchUnread();

    // Poll every 5 seconds for updates
    const interval = setInterval(fetchUnread, 5000);

    return () => clearInterval(interval);
  }, [authLoading, user?.uuid]);

  // ✅ SOCKET EVENT: Update unread count when new message arrives
  // Only attach listener when user is fully ready
  useEffect(() => {
    if (authLoading === true) return;
    if (!user) return;
    if (!user?.uuid || user.uuid.length !== 36) return;

    const handleNewMessage = async () => {
      console.log('📬 UnreadContext: New message received, refreshing count');
      try {
        const result = await getUnreadCount(user.uuid);
        const count = typeof result === 'number' ? result : result?.unreadCount || 0;
        setUnreadCount(count);
      } catch (err) {
        console.error('❌ UnreadContext: Error updating unread count:', err);
      }
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [authLoading, user?.uuid]);

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
