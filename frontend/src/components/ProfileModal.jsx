import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, onOpenPremium }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
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

  const loadUserProfile = () => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || 'User',
        email: user.email || '',
        picture: user.picture || '',
        googleId: user.googleId || ''
      }));
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
      // Save to Firebase Firestore
      // This would require getFirestore and setDoc
      console.log('Saving profile:', profileData);
      
      // Update local storage for now
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userProfile');
      navigate('/login');
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

          <p className="profile-uid">ID: {profileData.googleId || 'N/A'}</p>
        </div>

        {/* Monkey Plus Section */}
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
                  value={profileData.birthday}
                  onChange={handleInputChange}
                  className="profile-input-small"
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
