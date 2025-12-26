const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

/**
 * Fetch accepted friends for the message panel
 */
export const getFriends = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id;
    
    if (!userId) {
      console.error('User ID not found in localStorage');
      return [];
    }

    const response = await fetch(`${BACKEND_URL}/api/friends?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        'X-User-Id': userId
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch friends:', response.status);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
};
