import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Copy } from 'lucide-react';
import { auth } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, onOpenPremium, onReinitializeCamera }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    email: '',
    picture: '',
    googleId: '',
    location: '',
    gender: '',
    birthday: '',
    tokens: 0,
    gems: 0
  });
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadUserProfile();
    }
  }, [isOpen, user]);

  // Auto-detect location
  useEffect(() => {
    if (!locationData && isOpen) {
      detectLocation();
    }
  }, [isOpen]);

  const detectLocation = async () => {
    try {
      // Try geolocation API first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const city = data.address?.city || data.address?.town || 'Unknown';
              const country = data.address?.country || 'Unknown';
              setLocationData(`${city}, ${country}`);
              setProfileData(prev => ({
                ...prev,
                location: `${city}, ${country}`
              }));
            } catch (err) {
              console.log('Reverse geocoding error:', err);
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
            // Fallback to IP API
            fetchLocationFromIP();
          }
        );
      } else {
        fetchLocationFromIP();
      }
    } catch (err) {
      console.log('Location detection error:', err);
    }
  };

  const fetchLocationFromIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const location = `${data.city}, ${data.country_name}`;
      setLocationData(location);
      setProfileData(prev => ({
        ...prev,
        location: location
      }));
    } catch (err) {
      console.log('IP API error:', err);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      // First set data from context
      setProfileData(prev => ({
        ...prev,
        id: user.id || user.uuid || '',
        name: user.name || 'User',
        email: user.email || '',
        picture: user.picture || '',
        googleId: user.googleId || '',
        gender: user.gender || 'Not set',
        birthday: user.birthday || 'Not set'
      }));

      // Then fetch fresh data from backend
      const token = localStorage.getItem('token');
      if (token) {
        console.log('[ProfileModal] Fetching fresh user profile from backend');
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        const response = await fetch(`${BACKEND_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[ProfileModal] ✅ Fetched profile data from backend:', data.user?.email);
          console.log('[ProfileModal] User gender:', data.user?.gender);
          console.log('[ProfileModal] User birthday:', data.user?.birthday);
          
          if (data.success && data.user) {
            // Format birthday for display
            let formattedBirthday = 'Not set';
            if (data.user.birthday) {
              try {
                const dateObj = new Date(data.user.birthday);
                formattedBirthday = dateObj.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
              } catch (e) {
                formattedBirthday = data.user.birthday;
              }
            }

            setProfileData(prev => ({
              ...prev,
              id: data.user.uuid || data.user.id || data.user.userId || '',
              name: data.user.name || 'User',
              email: data.user.email || '',
              picture: data.user.picture || '',
              googleId: data.user.googleId || '',
              gender: data.user.gender || 'Not set',
              birthday: formattedBirthday
            }));
          }
        } else {
          console.warn('[ProfileModal] ⚠️ Failed to fetch profile from backend:', response.status);
        }
      } else {
        console.log('[ProfileModal] ⚠️ No token found in localStorage');
      }
    } catch (err) {
      console.error('[ProfileModal] ❌ Error loading user profile:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          picture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      console.log('[PROFILE SAVE] Starting profile save process');
      console.log('[PROFILE SAVE] Profile data:', profileData);
      
      // Get user ID from context or localStorage
      const userId = user?.googleId || localStorage.getItem('userId');
      console.log('[PROFILE SAVE] User ID:', userId);
      
      if (!userId) {
        console.error('[PROFILE SAVE] Error: No user ID found');
        alert('Error: User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      // Prepare data for API call
      const profilePayload = {
        userId: userId,
        birthday: profileData.birthday || new Date().toISOString().split('T')[0],
        gender: profileData.gender || 'Not set'
      };

      console.log('[PROFILE SAVE] Request body:', JSON.stringify(profilePayload));
      console.log('[PROFILE SAVE] Required fields check:');
      console.log('  - userId:', !!profilePayload.userId);
      console.log('  - birthday:', !!profilePayload.birthday);
      console.log('  - gender:', !!profilePayload.gender);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('[PROFILE SAVE] Token present:', !!token);

      if (!token) {
        console.warn('[PROFILE SAVE] Warning: No auth token found');
      }

      // Call backend API to save profile
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      console.log('[PROFILE SAVE] Backend URL:', BACKEND_URL);
      console.log('[PROFILE SAVE] Making API call to /api/users/complete-profile');

      const response = await fetch(`${BACKEND_URL}/api/users/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(profilePayload)
      });

      console.log('[PROFILE SAVE] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PROFILE SAVE] Error response:', errorData);
        alert(`Failed to save profile: ${errorData.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('[PROFILE SAVE] ✅ Profile saved successfully:', result);

      // Update local storage as backup
      localStorage.setItem('userProfile', JSON.stringify(profilePayload));
      setIsEditing(false);
      
      // 🎥 CRITICAL: Close modal first, then reinitialize camera
      console.log('[PROFILE SAVE] Profile saved successfully');
      console.log('[PROFILE SAVE] Closing ProfileModal...');
      onClose(); // IMPORTANT: Close the modal immediately
      
      // Alert after closing
      alert('Profile updated successfully!');
      
      // Then schedule camera re-init with delay to allow modal to fully unmount
      console.log('🎥 [ProfileModal] Scheduling camera re-init with 500ms delay to allow modal unmount');
      if (typeof onReinitializeCamera === 'function') {
        setTimeout(() => {
          console.log('\n🎥 [ProfileModal] 500ms delay complete, reinitializing camera now');
          console.log('🎥 [ProfileModal] Calling onReinitializeCamera()');
          onReinitializeCamera()
            .then((success) => {
              if (success) {
                console.log('🎥 [ProfileModal] ✅ Camera reinitialized successfully after profile save');
              } else {
                console.warn('🎥 [ProfileModal] ⚠️ Camera reinitialization returned false');
              }
            })
            .catch((err) => {
              console.error('🎥 [ProfileModal] ❌ Error calling reinitializeCamera:', err);
            });
        }, 500);
      } else {
        console.warn('🎥 [ProfileModal] ⚠️ onReinitializeCamera callback not provided');
      }
    } catch (err) {
      console.error('[PROFILE SAVE] Error:', err);
      console.error('[PROFILE SAVE] Error message:', err.message);
      console.error('[PROFILE SAVE] Error stack:', err.stack);
      alert('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userProfile');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="profile-modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-picture-container">
            <img
              src={profileData.picture || 'https://via.placeholder.com/120'}
              alt="Profile"
              className="profile-picture"
            />
            {isEditing && (
              <label className="photo-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                📷
              </label>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="profile-input-name"
              placeholder="Name"
            />
          ) : (
            <h2 className="profile-name">{profileData.name}</h2>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginTop: "6px",
              opacity: 0.8
            }}
          >
            <span>ID: {profileData.id || 'N/A'}</span>

            {profileData.id && (
              <button
                onClick={() => handleCopyId(profileData.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                title="Copy ID"
              >
                📋
              </button>
            )}
          </div>
        </div>

        {/* Premium Section */}
        <div 
          className="profile-premium-section" 
          onClick={onOpenPremium}
          style={{ cursor: 'pointer' }}
        >
          <div className="premium-badge">⭐ Flinxx Premium</div>
          <p className="premium-description">Unlock premium features</p>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">💰 Tokens</span>
            <span className="detail-value">{profileData.tokens}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">💎 Gems</span>
            <span className="detail-value">{profileData.gems}</span>
          </div>

          {isEditing ? (
            <>
              <div className="detail-row">
                <span className="detail-label">📍 Location</span>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="profile-input-small"
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">⚧ Gender</span>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className="profile-input-small"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="detail-row">
                <span className="detail-label">🎂 Birthday</span>
                <input
                  type="date"
                  name="birthday"
                  value={profileData.birthday ? profileData.birthday.slice(0, 10) : ''}
                  onChange={handleInputChange}
                  className="profile-input-small text-black focus:text-black !text-black [&::-webkit-datetime-edit]:text-black [&::-webkit-datetime-edit-year-field]:text-black [&::-webkit-datetime-edit-month-field]:text-black [&::-webkit-datetime-edit-day-field]:text-black"
                />
              </div>
            </>
          ) : (
            <>
              <div className="detail-row">
                <span className="detail-label">📍 Location</span>
                <span className="detail-value">{profileData.location || 'Not set'}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">⚧ Gender</span>
                <span className="detail-value">{profileData.gender || 'Not set'}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">🎂 Birthday</span>
                <span className="detail-value">{profileData.birthday || 'Not set'}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button
                className="btn-save"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setIsEditing(false);
                  loadUserProfile();
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
              <button className="btn-more">
                ⋮ More
              </button>
            </>
          )}
        </div>

        {/* Sign Out Button */}
        <button className="btn-sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
