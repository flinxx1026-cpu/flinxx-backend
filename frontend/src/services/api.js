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
