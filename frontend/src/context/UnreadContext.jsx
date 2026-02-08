import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUnreadCount } from "../services/api";

const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ CRITICAL: Wait until authLoading is FALSE before attempting any API calls
  // This prevents race conditions on hard refresh
  useEffect(() => {
    // Step 1: Wait for AuthContext to finish loading
    if (authLoading === true) {
      return;
    }

    // Step 1.5: Extra guard - user must exist
    if (!user) {
      return;
    }

    // Step 2: Check if user is ready (not just loading state)
    if (!user?.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
      return;
    }

    // Step 3: Now we can safely fetch unread count
    let cancelled = false;

    const fetchUnread = async () => {
      // ✅ CRITICAL DEBUG: Log UUID before calling getUnreadCount
      console.log('📊 UnreadContext: Calling getUnreadCount with UUID:', user.uuid?.substring(0, 8) + '...');
      const result = await getUnreadCount(user.uuid);
      if (!cancelled) {
        const count = typeof result === 'number' ? result : result?.unreadCount || 0;
        setUnreadCount(count);
      }
    };

    // Initial fetch
    fetchUnread();

    // Poll every 5 seconds for updates
    const interval = setInterval(fetchUnread, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [authLoading, user?.uuid]);

  // ✅ SOCKET EVENT: Update unread count when new message arrives
  // Only attach listener when user is fully ready
  // Lazy-load socket inside useEffect to avoid TDZ during module initialization
  useEffect(() => {
    if (authLoading === true) return;
    if (!user) return;
    if (!user?.uuid || user.uuid.length !== 36) return;

    const handleNewMessage = async () => {
      console.log('📬 New message received, fetching updated count for UUID:', user.uuid?.substring(0, 8) + '...');
      const result = await getUnreadCount(user.uuid);
      const count = typeof result === 'number' ? result : result?.unreadCount || 0;
      setUnreadCount(count);
    };

    // Lazy-load socket inside async IIFE - safe from TDZ
    const setupSocketListener = async () => {
      try {
        const socketModule = await import("../services/socketService");
        const socket = socketModule.default;
        
        if (socket && typeof socket.on === 'function') {
          socket.on('receive_message', handleNewMessage);
          
          return () => {
            if (socket && typeof socket.off === 'function') {
              socket.off('receive_message', handleNewMessage);
            }
          };
        }
      } catch (error) {
        console.warn('⚠️ Failed to load socket in UnreadContext:', error.message);
      }
      return undefined;
    };

    let cleanup;
    setupSocketListener().then(cleanupFn => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [authLoading, user?.uuid]);

  // ✅ REFETCH FUNCTION: Manually refresh unread count (called after marking messages as read)
  const refetchUnreadCount = async () => {
    if (!user?.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
      return;
    }

    const result = await getUnreadCount(user.uuid);
    const count = typeof result === 'number' ? result : result?.unreadCount || 0;
    setUnreadCount(count);
  };

  return (
    <UnreadContext.Provider value={{ unreadCount, setUnreadCount, refetchUnreadCount }}>
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

// Safe version that returns default values instead of throwing
export const useUnreadSafe = () => {
  try {
    const context = useContext(UnreadContext);
    if (!context) {
      return {
        unreadCount: 0,
        setUnreadCount: () => {},
        refetchUnreadCount: async () => {}
      };
    }
    return context;
  } catch (error) {
    console.warn('![UnreadContext]Failed to access useUnread:', error.message);
    return {
      unreadCount: 0,
      setUnreadCount: () => {},
      refetchUnreadCount: async () => {}
    };
  }
};
