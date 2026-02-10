const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Get auth token from localStorage
 * ✅ Used by ALL protected API endpoints
 */
const getToken = () => localStorage.getItem('token');

/**
 * Create headers with Authorization token
 * ✅ Use this for consistency across all API calls
 */
const getAuthHeaders = (customHeaders = {}) => ({
  'Authorization': `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
  ...customHeaders
});

/**
 * Fetch accepted friends for the message panel
 * ✅ Accept UUID as parameter from AuthContext
 */
export const getFriends = async (userUUID) => {
  try {
    // ✅ STRICT VALIDATION: UUID must be 36-char string
    if (!userUUID || typeof userUUID !== 'string' || userUUID.length !== 36) {
      console.warn('⛔ getFriends blocked – invalid UUID:', userUUID);
      return [];
    }

    const response = await fetch(
      `${BACKEND_URL}/api/friends?userId=${userUUID}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching friends:', err);
    return [];
  }
};

/**
 * Fetch all friend request notifications (INCOMING - received by user)
 * ✅ Accept UUID as parameter from AuthContext
 */
export const getNotifications = async (userUUID) => {
  try {
    // ✅ STRICT VALIDATION: UUID must be 36-char string
    if (!userUUID || typeof userUUID !== 'string' || userUUID.length !== 36) {
      console.warn('⛔ getNotifications blocked – invalid UUID:', userUUID);
      return [];
    }

    console.log('📬 Fetching INCOMING notifications for user');

    const response = await fetch(
      `${BACKEND_URL}/api/notifications?userId=${userUUID}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    console.log('✅ Incoming notifications loaded:', data.length, 'items');
    return data;
  } catch (err) {
    console.error('❌ Error fetching incoming notifications:', err);
    return [];
  }
};

/**
 * Fetch sent friend requests (requests SENT by user)
 * ✅ Accept UUID as parameter from AuthContext
 * Used by SearchFriendsModal to show requests user has sent
 */
export const getSentRequests = async (userUUID) => {
  try {
    // ✅ STRICT VALIDATION: UUID must be 36-char string
    if (!userUUID || typeof userUUID !== 'string' || userUUID.length !== 36) {
      console.warn('⛔ getSentRequests blocked – invalid UUID:', userUUID);
      return [];
    }

    console.log('📤 Fetching SENT requests from user');

    const response = await fetch(
      `${BACKEND_URL}/api/sent-requests?userId=${userUUID}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    console.log('✅ Sent requests loaded:', data.length, 'items');
    return data;
  } catch (err) {
    console.error('❌ Error fetching sent requests:', err);
    return [];
  }
};

/**
 * Unfriend a user (remove from friends)
 * ✅ Accept UUID as parameter from AuthContext
 */
export const unfriendUser = async (userUUID, friendId) => {
  try {
    // ✅ STRICT VALIDATION: Both UUIDs must be 36-char strings
    if (!userUUID || typeof userUUID !== 'string' || userUUID.length !== 36) {
      console.warn('⛔ unfriendUser blocked – invalid user UUID:', userUUID);
      return { success: false, error: 'Invalid user' };
    }

    if (!friendId || typeof friendId !== 'string' || friendId.length !== 36) {
      console.warn('⛔ unfriendUser blocked – invalid friend UUID:', friendId);
      return { success: false, error: 'Invalid friend ID' };
    }

    const response = await fetch(
      `${BACKEND_URL}/api/friends/unfriend`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ friendId })
      }
    );

    if (!response.ok) {
      return { success: false, error: 'Failed to unfriend user' };
    }

    const data = await response.json();
    console.log('✅ Unfriended user');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error unfriending user:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Get unread message count for a user
 * ✅ Accept UUID as parameter from AuthContext (source of truth)
 * ✅ NEVER read from localStorage – use only the UUID parameter
 * ⚠️  SAFETY: Returns 0 silently if UUID not available
 * 
 * THIS FUNCTION MUST ALWAYS RECEIVE userId AS PARAMETER
 * DO NOT READ FROM localStorage INSIDE THIS FUNCTION
 */
export const getUnreadCount = async (userUUID) => {
  // ✅ CRITICAL: STRICT VALIDATION – UUID must be 36 chars
  if (!userUUID || typeof userUUID !== 'string' || userUUID.length !== 36) {
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
      return 0;
    }

    const data = await response.json();
    return data.unreadCount ?? 0;
  } catch (err) {
    return 0;
  }
};

/**
 * Mark messages as read.
 * Accepts either a `chatId` ("uuid1_uuid2") as second arg, or builds from userUUID + otherId.
 * ✅ Accept userUUID as parameter from AuthContext
 * Calls new PUT /api/messages/mark-read/:chatId endpoint and returns { success, unreadCount }.
 */
export const markMessagesAsRead = async (userUUID, senderOrChatId, receiverId) => {
  try {
    let chatId = null;

    // If only one argument provided and it contains underscore, treat it as chatId
    if (!senderOrChatId && !receiverId && typeof userUUID === 'string' && userUUID.includes('_')) {
      chatId = userUUID;
    }
    // If caller provided already a chatId like 'uuid1_uuid2'
    else if (typeof senderOrChatId === 'string' && senderOrChatId.includes('_')) {
      chatId = senderOrChatId;
    } else {
      // Build chatId from userUUID + senderOrChatId
      const otherId = senderOrChatId;
      const myId = userUUID; // ✅ ONLY UUID - NO FALLBACK, NO localStorage

      if (!myId || myId.length !== 36) {
        console.error('❌ Invalid UUID in markMessagesAsRead:', myId);
        return { success: false };
      }

      if (!otherId || otherId.length !== 36) {
        console.error('❌ Invalid other user UUID in markMessagesAsRead:', otherId);
        return { success: false };
      }

      chatId = myId < otherId ? `${myId}_${otherId}` : `${otherId}_${myId}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/messages/mark-read/${encodeURIComponent(chatId)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
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

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (requestId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/friends/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ requestId })
    });

    if (!response.ok) {
      console.error('❌ Accept request API error:', response.status);
      return { success: false };
    }

    const data = await response.json();
    console.log('✅ Friend request accepted', data);
    return { success: true, data };
  } catch (err) {
    console.error('Error accepting friend request:', err);
    return { success: false };
  }
};

/**
 * Reject a friend request
 */
export const rejectFriendRequest = async (requestId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/friends/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ requestId })
    });

    if (!response.ok) {
      console.error('❌ Reject request API error:', response.status);
      return { success: false };
    }

    const data = await response.json();
    console.log('✅ Friend request rejected', data);
    return { success: true, data };
  } catch (err) {
    console.error('Error rejecting friend request:', err);
    return { success: false };
  }
};

/**
 * Send a friend request to a user
 */
export const sendFriendRequest = async (senderPublicId, receiverPublicId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/friends/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ senderPublicId, receiverPublicId })
    });

    if (!response.ok) {
      console.error('❌ Send friend request API error:', response.status);
      return { success: false };
    }

    const data = await response.json();
    console.log('✅ Friend request sent', data);
    return { success: true, data };
  } catch (err) {
    console.error('Error sending friend request:', err);
    return { success: false };
  }
};
