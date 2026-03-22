import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Copy } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';
import { auth } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, onOpenPremium, onReinitializeCamera }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [isEditing, setIsEditing] = useState(false);

  // Initialize with user data from context immediately
  const getInitialProfileData = () => {
    if (user) {
      return {
        id: user.publicId || '',
        name: user.name || 'User',
        email: user.email || '',
        picture: user.picture || '',
        googleId: user.googleId || '',
        location: user.location || 'Not set',
        gender: user.gender ? user.gender.toLowerCase() : 'Not set',
        birthday: user.birthday || 'Not set',
        birthdayRaw: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        tokens: user.tokens || 0,
        gems: user.gems || 0
      };
    }
    return {
      id: '',
      name: '',
      email: '',
      picture: '',
      googleId: '',
      location: '',
      gender: '',
      birthday: '',
      birthdayRaw: '',
      tokens: 0,
      gems: 0
    };
  };

  const [profileData, setProfileData] = useState(getInitialProfileData());
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Update profileData immediately when user context changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        id: user.publicId || '',
        name: user.name || 'User',
        email: user.email || '',
        picture: user.picture || '',
        googleId: user.googleId || '',
        location: user.location || prev.location || 'Not set'
      }));
    }
  }, [user?.publicId, user?.name, user?.email, user?.picture]);

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setDataLoading(true);
      loadUserProfile().finally(() => setDataLoading(false));
    }
  }, [isOpen, user]);

  // ✅ Location is now detected on dashboard mount (Chat.jsx) via IP — no browser popup needed
  // Profile will use the location already stored in user profile data

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
        id: user.publicId || '',
        name: user.name || 'User',
        email: user.email || '',
        picture: user.picture || '',
        googleId: user.googleId || '',
        location: user.location || prev.location || 'Not set',
        gender: user.gender ? user.gender.toLowerCase() : 'Not set',
        birthday: contextBirthdayFormatted,
        birthdayRaw: contextBirthdayRaw
      }));

      // Then fetch fresh data from backend
      const token = localStorage.getItem('token');
      if (token) {
        console.log('[ProfileModal] Fetching fresh user profile from backend');
        console.log('[ProfileModal] Token present: YES');
        const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;

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
              id: data.user.publicId || '',
              name: data.user.name || 'User',
              email: data.user.email || '',
              picture: data.user.picture || '',
              googleId: data.user.googleId || '',
              location: data.user.location || prev.location || 'Not set',
              gender: genderValue,
              birthday: formattedBirthday,
              birthdayRaw: rawBirthday,
              hasBlueTick: data.user.hasBlueTick || false
            }));

            // Set locationData state from backend profile
            if (data.user.location) {
              setLocationData(data.user.location);
            }
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
      const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Refresh page to clear all context and state
      window.location.href = '/login';
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (!isOpen) return null;

  // Show loader while initial data is loading
  if (!profileData.id || (dataLoading && !profileData.name)) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] animate-fade-in" onClick={onClose}>
        <div
          className="fixed top-1/2 w-[90vw] sm:w-[360px] max-w-[360px] bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[85vh] animate-slide-in-left flex flex-col items-center justify-center"
          style={{ left: '40px', transform: 'translateY(-50%)', minHeight: '300px' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] animate-fade-in" onClick={onClose}>
      <div
        className="fixed top-1/2 w-[90vw] sm:w-[360px] max-w-[360px] bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[85vh] animate-slide-in-left flex flex-col"
        style={{ left: '40px', transform: 'translateY(-50%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Copied Toast - Positioned at top center */}
        {copyFeedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-black/75 backdrop-blur text-white text-[11px] font-medium px-4 py-1.5 rounded-full shadow-xl border border-white/10 flex items-center justify-center translate-y-[-140px]">
              Copied
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:text-white dark:hover:text-white/80 transition-colors z-10 focus:outline-none"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-9 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-[3px] border-purple-500 overflow-hidden bg-slate-400 dark:bg-slate-600 flex items-center justify-center shadow-[0_0_15px_1px_rgba(139,92,246,0.4)]">
              {profileData.picture ? (
                <img
                  src={profileData.picture}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-4xl font-semibold select-none">
                  {profileData.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>

          {/* Name and ID */}
          <div className="text-center mb-6">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ margin: 0, lineHeight: '1' }}>
                {profileData.name}
              </h2>
              {profileData.hasBlueTick && (
                <img src="/bluetick.png" alt="Verified" style={{ width: '38px', height: '38px', marginLeft: '6px', marginTop: '3px', flexShrink: 0, objectFit: 'contain', verticalAlign: 'middle', display: 'block' }} />
              )}
            </div>
            <div className="flex items-center justify-center space-x-1 text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-medium tracking-wide">ID: {profileData.id || (dataLoading ? 'Loading...' : '')}</span>
              {profileData.id && (
                <>
                  <button
                    onClick={() => handleCopyId(profileData.id)}
                    className="hover:text-purple-500 transition-colors focus:outline-none p-1 rounded"
                    title="Copy ID"
                  >
                    <Copy size={14} />
                  </button>
                  {copyFeedback && <span className="copied-msg">Copied!</span>}
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-6"></div>

          {/* Premium Section */}
          <div
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mb-6 text-white flex flex-col items-center text-center shadow-md transform hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => {
              onClose(); // Close profile modal first
              setTimeout(() => onOpenPremium(), 100); // Then open premium modal
            }}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="material-icons-round text-yellow-300 text-sm">stars</span>
              <span className="font-bold text-sm">Flinxx Premium</span>
            </div>
            <p className="text-white/80 text-[10px] leading-tight">Unlock premium features and custom themes</p>
          </div>

          {/* Profile Details */}
          <div className="w-full space-y-4 mb-7">
            {/* Location */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-2">
                <span className="material-icons-round text-rose-500 text-sm group-hover:scale-110 transition-transform">location_on</span>
                <span className="text-slate-600 dark:text-slate-400 text-[12px] font-medium">Location</span>
              </div>
              <span className="text-slate-900 dark:text-white text-[12px] font-semibold">
                {profileData.location || 'Not set'}
              </span>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-2">
                <span className="material-icons-round text-blue-500 text-sm group-hover:scale-110 transition-transform">transgender</span>
                <span className="text-slate-600 dark:text-slate-400 text-[12px] font-medium">Gender</span>
              </div>
              <span className="text-slate-900 dark:text-white text-[12px] font-semibold capitalize">
                {profileData.gender || 'Not set'}
              </span>
            </div>

            {/* Birthday */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-2">
                <span className="material-icons-round text-amber-500 text-sm group-hover:scale-110 transition-transform">cake</span>
                <span className="text-slate-600 dark:text-slate-400 text-[12px] font-medium">Birthday</span>
              </div>
              <span className="text-slate-900 dark:text-white text-[12px] font-semibold">
                {profileData.birthday || 'Not set'}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-500/30"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default ProfileModal;
