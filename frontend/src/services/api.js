const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

/**
 * Fetch accepted friends for the message panel
 */
export const getFriends = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.uuid || currentUser.id; // UUID from backend

    // ✅ UUID validation (must be 36 chars with hyphens)
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
    const userId = currentUser.uuid || currentUser.id; // UUID from backend

    // ✅ UUID validation (must be 36 chars with hyphens)
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
    const userId = currentUser.uuid || currentUser.id; // UUID from backend

    // ✅ UUID validation
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
