const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

/**
 * Fetch accepted friends for the message panel
 */
export const getFriends = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id; // MUST be UUID

    if (!userId) return [];

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

    if (!response.ok) return [];

    return await response.json();
  } catch (err) {
    console.error('Error fetching friends:', err);
    return [];
  }
};
