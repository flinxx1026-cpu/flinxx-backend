const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

/**
 * Fetch accepted friends for the message panel
 */
export const getFriends = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.uuid; // ✅ ONLY UUID - NO FALLBACK

    // ✅ STRICT validation (must be 36 chars with hyphens)
    if (!userId || userId.length !== 36) {
      console.error('❌ Invalid UUID in localStorage:', userId);
      console.error('   Expected 36-char UUID, got:', userId?.length || 'undefined');
      return [];
    }

    const response = await fetch(
      `${BACKEND_URL}/api/friends?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Friends API error:', response.status, response.statusText);
      return [];
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching friends:', err);
    return [];
  }
};

/**
 * Fetch all friend request notifications (pending + accepted)
 */
export const getNotifications = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.uuid; // ✅ ONLY UUID - NO FALLBACK

    // ✅ STRICT validation (must be 36 chars with hyphens)
    if (!userId || userId.length !== 36) {
      console.error('❌ Invalid UUID in notifications:', userId);
      return [];
    }

    console.log('📬 Fetching notifications for user:', userId);

    const response = await fetch(
      `${BACKEND_URL}/api/notifications?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Notifications API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('✅ Notifications loaded:', data.length, 'items');
    return data;
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    return [];
  }
};

/**
 * Unfriend a user (remove from friends)
 */
export const unfriendUser = async (friendId) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.uuid; // ✅ ONLY UUID - NO FALLBACK

    // ✅ STRICT validation
    if (!userId || userId.length !== 36) {
      console.error('❌ Invalid UUID in unfriend:', userId);
      return { success: false, error: 'Invalid user' };
    }

    if (!friendId || friendId.length !== 36) {
      console.error('❌ Invalid friend UUID:', friendId);
      return { success: false, error: 'Invalid friend ID' };
    }

    const response = await fetch(
      `${BACKEND_URL}/api/friends/unfriend`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId })
      }
    );

    if (!response.ok) {
      console.error('❌ Unfriend error:', response.status, response.statusText);
      return { success: false, error: 'Failed to unfriend user' };
    }

    const data = await response.json();
    console.log('✅ Unfriended user:', friendId);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error unfriending user:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Get unread message count for a user
 * ✅ Accept UUID as parameter (from AuthContext, not localStorage)
 * ✅ AuthContext is the source of truth for user UUID
 */
export const getUnreadCount = async (userUUID) => {
  // ✅ UUID must be passed from AuthContext
  if (!userUUID || userUUID.length !== 36) {
    console.warn('⏳ Skipping unread count, UUID not ready:', userUUID);
    return 0;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/messages/unread-count/${userUUID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Unread count API error:', response.status, response.statusText);
      return 0;
    }

    const data = await response.json();
    console.log('✅ Unread count:', data.unreadCount);
    return data.unreadCount || 0;
  } catch (err) {
    console.error('Error fetching unread count:', err);
    return 0;
  }
};

/**
 * Mark messages as read between two users
 */
/**
 * Mark messages as read.
 * Accepts either a `chatId` ("uuid1_uuid2") as first arg, or (senderId, receiverId).
 * Calls new PUT /api/messages/mark-read/:chatId endpoint and returns { success, unreadCount }.
 */
export const markMessagesAsRead = async (senderOrChatId, receiverId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token in markMessagesAsRead');
      return { success: false };
    }

    let chatId = null;

    // If caller provided already a chatId like 'uuid1_uuid2'
    if (typeof senderOrChatId === 'string' && senderOrChatId.includes('_')) {
      chatId = senderOrChatId;
    } else {
      // Try to build chatId from senderId + receiverId
      const otherId = senderOrChatId;
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const myId = currentUser.uuid || currentUser.id;

      if (!myId || !otherId) {
        console.error('❌ Invalid args for markMessagesAsRead');
        return { success: false };
      }

      chatId = myId < otherId ? `${myId}_${otherId}` : `${otherId}_${myId}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/messages/mark-read/${encodeURIComponent(chatId)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('❌ Mark read API error:', response.status, response.statusText);
      return { success: false };
    }

    const data = await response.json();
    console.log('✅ Messages marked as read', data);
    return data;
  } catch (err) {
    console.error('Error marking messages as read:', err);
    return { success: false };
  }
};
