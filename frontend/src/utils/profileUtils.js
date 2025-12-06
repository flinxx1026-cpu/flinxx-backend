/**
 * Profile Management Utilities
 * Handles profile-related API calls and localStorage operations
 */

/**
 * Reset user profile (for development/debugging)
 * Clears profileCompleted flag and profile data from backend and localStorage
 */
export const resetUserProfile = async () => {
  try {
    console.log('[profileUtils] Starting profile reset...');
    
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.warn('[profileUtils] No user found in localStorage');
      return false;
    }
    
    const user = JSON.parse(userStr);
    const userId = user.id || user.googleId;
    
    console.log('[profileUtils] User ID:', userId);
    console.log('[profileUtils] Calling /api/users/reset-profile endpoint...');
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${BACKEND_URL}/api/users/reset-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    console.log('[profileUtils] Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[profileUtils] ❌ Reset failed:', errorData);
      return false;
    }
    
    const result = await response.json();
    console.log('[profileUtils] ✅ Reset successful:', result);
    
    // Update localStorage with reset data
    const updatedUser = {
      ...user,
      profileCompleted: false,
      isProfileCompleted: false,
      birthday: null,
      gender: null,
      age: null
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('[profileUtils] ✅ localStorage updated with reset data');
    
    return true;
  } catch (error) {
    console.error('[profileUtils] ❌ Error resetting profile:', error);
    return false;
  }
};

/**
 * Check if user profile is completed
 */
export const isProfileCompleted = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    const user = JSON.parse(userStr);
    return user.profileCompleted === true || user.isProfileCompleted === true;
  } catch (error) {
    console.error('[profileUtils] Error checking profile status:', error);
    return false;
  }
};

/**
 * Get user ID from localStorage
 */
export const getUserId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user.id || user.googleId || user.uid;
  } catch (error) {
    console.error('[profileUtils] Error getting user ID:', error);
    return null;
  }
};
