import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUnreadCount } from "../services/api";

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
