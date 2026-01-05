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
    birthdayRaw: '', // Store raw YYYY-MM-DD format for editing
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
    
    // Console check for user data
    console.log("USER PROFILE DATA:", user);
    
    try {
      // First set data from context
      console.log('[ProfileModal] Setting initial data from context user:', {
        id: user.id,
        uuid: user.uuid,
        publicId: user.publicId,
        gender: user.gender,
        birthday: user.birthday
      });
      
      // Format birthday from context if it exists
      let contextBirthdayRaw = '';
      let contextBirthdayFormatted = user.birthday || 'Not set';
      if (user.birthday) {
        try {
          const dateObj = new Date(user.birthday);
          if (!isNaN(dateObj.getTime())) {
            contextBirthdayRaw = dateObj.toISOString().split('T')[0];
            contextBirthdayFormatted = dateObj.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          }
        } catch (e) {
          console.error('[ProfileModal] Error formatting context birthday:', e);
        }
      }
      
      setProfileData(prev => ({
        ...prev,
        id: user.publicId || user.id || user.uuid || '',
        name: user.name || 'User',
        email: user.email || '',
        picture: user.picture || '',
        googleId: user.googleId || '',
        gender: user.gender ? user.gender.toLowerCase() : 'Not set',
        birthday: contextBirthdayFormatted,
        birthdayRaw: contextBirthdayRaw
      }));

      // Then fetch fresh data from backend
      const token = localStorage.getItem('token');
      if (token) {
        console.log('[ProfileModal] Fetching fresh user profile from backend');
        console.log('[ProfileModal] Token present: YES');
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        const response = await fetch(`${BACKEND_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('[ProfileModal] API Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[ProfileModal] ✅ Fetched profile data from backend:', data);
          console.log('[ProfileModal] User gender:', data.user?.gender);
          console.log('[ProfileModal] User birthday:', data.user?.birthday);
          console.log('[ProfileModal] User publicId:', data.user?.publicId);
          console.log('[ProfileModal] Full user object:', data.user);
          
          if (data.success && data.user) {
            // Store raw birthday for editing
            let rawBirthday = '';
            let formattedBirthday = 'Not set';
            
            if (data.user.birthday) {
              try {
                const dateObj = new Date(data.user.birthday);
                // Check if it's a valid date
                if (!isNaN(dateObj.getTime())) {
                  // For YYYY-MM-DD format (used in date input)
                  rawBirthday = dateObj.toISOString().split('T')[0];
                  // For display in non-edit mode
                  formattedBirthday = dateObj.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                } else {
                  rawBirthday = data.user.birthday;
                  formattedBirthday = data.user.birthday;
                }
              } catch (e) {
                console.error('[ProfileModal] Error formatting birthday:', e);
                rawBirthday = data.user.birthday;
                formattedBirthday = data.user.birthday;
              }
            }

            const genderValue = data.user.gender ? data.user.gender.toLowerCase() : 'Not set';
            
            console.log('[ProfileModal] Setting profile data with:', {
              gender: genderValue,
              birthday: formattedBirthday,
              birthdayRaw: rawBirthday,
              publicId: data.user.publicId,
              uuid: data.user.uuid
            });

            setProfileData(prev => ({
              ...prev,
              id: data.user.publicId || data.user.uuid || data.user.id || data.user.userId || '',
              name: data.user.name || 'User',
              email: data.user.email || '',
              picture: data.user.picture || '',
              googleId: data.user.googleId || '',
              gender: genderValue,
              birthday: formattedBirthday,
              birthdayRaw: rawBirthday
            }));
          }
        } else {
          console.warn('[ProfileModal] ⚠️ Failed to fetch profile from backend:', response.status);
          const errorText = await response.text();
          console.log('[ProfileModal] Response text:', errorText);
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
    
    // Special handling for birthday - update both birthdayRaw and birthday
    if (name === 'birthday') {
      let formattedDate = 'Not set';
      if (value) {
        try {
          const dateObj = new Date(value + 'T00:00:00Z');
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          }
        } catch (e) {
          console.error('[ProfileModal] Error formatting date:', e);
        }
      }
      setProfileData(prev => ({
        ...prev,
        birthdayRaw: value,
        birthday: formattedDate
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      const userId = user?.id || user?.uuid || user?.googleId || localStorage.getItem('userId');
      console.log('[PROFILE SAVE] User ID:', userId);
      
      if (!userId) {
        console.error('[PROFILE SAVE] Error: No user ID found');
        alert('Error: User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      // Use birthdayRaw (YYYY-MM-DD format) for the API call
      const birthdayValue = profileData.birthdayRaw || new Date().toISOString().split('T')[0];
      const genderValue = profileData.gender && profileData.gender !== 'Not set' ? profileData.gender : '';

      // Prepare data for API call
      const profilePayload = {
        userId: userId,
        birthday: birthdayValue,
        gender: genderValue
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

        {/* Sign Out Button */}
        <button className="btn-sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
