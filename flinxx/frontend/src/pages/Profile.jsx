import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import flinxxLogo from '../assets/flinxx-logo.svg'

const Profile = ({ isModal = false, onClose = null, onOpenPremium = null }) => {
  const navigate = useNavigate()
  const { user: contextUser } = useContext(AuthContext) || {}

  // First, try to get user from localStorage (Google OAuth), then from context
  const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  const user = localUser || contextUser || {
    name: 'Guest User',
    email: 'guest@flinxx.local',
    picture: null,
    googleId: 'N/A'
  }

  console.log('👤 Profile Component - Loaded User:', user)

  // Use Google user data or defaults
  const [profile, setProfile] = useState({
    username: user?.name || 'User',
    age: user?.age || 24,
    country: user?.location || 'Unknown',
    bio: 'Welcome to my profile',
    avatar: '👨',
    gender: 'Not specified',
    status: 'Looking to chat',
    email: user?.email || '',
    displayName: user?.name || '',
    photoURL: user?.picture || '',
    userId: user?.userId || 'N/A',
  })

  const [loading, setLoading] = useState(true)

  // Fetch user profile from backend on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.email) {
          console.log('⚠️ No user email found, using localStorage data only')
          console.log('📋 Profile from localStorage:', {
            name: user?.name,
            email: user?.email,
            picture: user?.picture,
            googleId: user?.googleId
          })
          setLoading(false)
          return
        }

        const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
        console.log(`📋 Profile Component - Fetching from: ${API_URL}/api/user/profile?email=${user.email}`)

        const response = await fetch(`${API_URL}/api/user/profile?email=${encodeURIComponent(user.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'  // ✅ Send cookies with request
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Profile data fetched from backend:', data.profile)

        // Update profile with backend data and current user data
        if (data.profile) {
          setProfile(prev => ({
            ...prev,
            email: data.profile.email || user.email || prev.email,
            displayName: data.profile.name || user.name || prev.displayName,
            photoURL: data.profile.picture || user.picture || prev.photoURL,
            userId: data.profile.id || prev.userId,
          }))
        } else {
          // Fallback to localStorage user data if backend doesn't have it
          setProfile(prev => ({
            ...prev,
            email: user.email || prev.email,
            displayName: user.name || prev.displayName,
            photoURL: user.picture || prev.photoURL,
            userId: user.userId || prev.userId,
          }))
        }
      } catch (error) {
        console.error('❌ Error fetching profile:', error)
        // Fallback to localStorage data
        setProfile(prev => ({
          ...prev,
          email: user.email || prev.email,
          displayName: user.name || prev.displayName,
          photoURL: user.picture || prev.photoURL,
          userId: user.userId || prev.userId,
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.email])

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }))
  }

  const handleSaveProfile = () => {
    setProfile(formData)
    setIsEditing(false)
    // Here you would typically send this to backend
    console.log('Profile saved:', formData)
  }

  const avatarOptions = ['👨', '👩', '👦', '👧', '🧑', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲']

  return (
    <>
      {isModal ? (
        // Modal View - Dark background with centered card
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/95 backdrop-blur-md rounded-3xl p-8 border border-white/10 w-full max-w-sm shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold transition"
            >
              ✕
            </button>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              {profile.photoURL ? (
                <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl shadow-purple-400/30 mb-4 border-4 border-purple-400/40 overflow-hidden">
                  <img 
                    src={profile.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-purple-600/50 mb-4 border-4 border-purple-400/40">
                  {profile.avatar}
                </div>
              )}
            </div>

            {/* Display Name with Verified Badge */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-white">{profile.displayName}</h2>
                <span className="text-blue-400">✓</span>
              </div>
              {profile.userId && profile.userId !== 'N/A' && (
                <p className="text-white/60 text-sm flex items-center justify-center gap-1">
                  ID: {profile.userId}
                  <button
                    onClick={() => navigator.clipboard.writeText(profile.userId)}
                    className="ml-1"
                    title="Copy ID"
                  >
                    📋
                  </button>
                </p>
              )}
            </div>

            {/* Flinxx Premium Button */}
            <button 
              onClick={() => {
                if (onOpenPremium) {
                  onOpenPremium()
                } else {
                  // Navigate to chat and let it open subscriptions
                  navigate('/chat')
                }
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 rounded-full transition-all transform hover:scale-105 mb-6 flex items-center justify-center gap-2">
              <span>🔒</span>
              <span>Flinxx Premium</span>
            </button>

            {/* Info Grid */}
            <div className="space-y-4 mb-6 border-t border-white/10 pt-4">
              {/* Location */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70">
                  <span>📍</span>
                  <span className="text-sm">Location</span>
                </div>
                <span className="text-white font-semibold">{profile.country}</span>
              </div>

              {/* Gender */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70">
                  <span>♂️</span>
                  <span className="text-sm">Gender</span>
                </div>
                <span className="text-white font-semibold">{profile.gender}</span>
              </div>

              {/* Birthday */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70">
                  <span>🎂</span>
                  <span className="text-sm">Birthday</span>
                </div>
                <span className="text-white font-semibold">January 1, 2002</span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                localStorage.removeItem('user')
                localStorage.removeItem('accessToken')
                navigate('/login')
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all transform hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        // Full Page View
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
      {/* Header */}
      <div className="relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={flinxxLogo} alt="Flinxx" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-white">Flinxx</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-white font-semibold hover:text-white/80 transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              {profile.photoURL && !isEditing ? (
                // Show Google profile picture if available
                <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/50 mb-6 border-4 border-white/30 overflow-hidden">
                  <img 
                    src={profile.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Show emoji avatar in edit or when no Google picture
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-7xl shadow-2xl shadow-blue-600/50 mb-6 border-4 border-white/30">
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-2 p-4">
                      {avatarOptions.map((avatar) => (
                        <button
                          key={avatar}
                          onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                          className={`text-3xl p-2 rounded-lg transition-all ${
                            formData.avatar === avatar
                              ? 'bg-white/30 border-2 border-white scale-110'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  ) : (
                    profile.avatar
                  )}
                </div>
              )}
              {!isEditing && (
                <p className="text-white/70 text-sm">Click Edit to change avatar</p>
              )}
            </div>

            {/* Profile Info */}
            {!isEditing ? (
              <div className="space-y-6">
                {/* Display Name */}
                {profile.displayName && (
                  <div>
                    <label className="text-white/70 text-sm font-semibold">Full Name</label>
                    <p className="text-white font-bold text-2xl mt-2">{profile.displayName}</p>
                  </div>
                )}

                {/* Email */}
                {profile.email && (
                  <div>
                    <label className="text-white/70 text-sm font-semibold">Email</label>
                    <p className="text-white font-normal text-base mt-2">{profile.email}</p>
                  </div>
                )}

                {/* User ID */}
                {profile.userId && profile.userId !== 'N/A' && (
                  <div>
                    <label className="text-white/70 text-sm font-semibold">User ID</label>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-white font-mono text-sm">{profile.userId}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(profile.userId)}
                        className="text-white/70 hover:text-white transition"
                        title="Copy ID"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}

                {/* Username */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Username</label>
                  <p className="text-white font-bold text-2xl mt-2">{profile.username}</p>
                </div>

                {/* Age & Country */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/70 text-sm font-semibold">Age</label>
                    <p className="text-white font-bold text-xl mt-2">{profile.age} years old</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-semibold">Country</label>
                    <p className="text-white font-bold text-xl mt-2">🌍 {profile.country}</p>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Gender</label>
                  <p className="text-white font-bold text-lg mt-2">{profile.gender}</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Bio</label>
                  <p className="text-white/90 text-base mt-2">{profile.bio}</p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-white font-semibold">{profile.status}</p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            ) : (
              /* Edit Form */
              <div className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                    placeholder="Enter your email"
                  />
                </div>

                {/* User ID - Read Only */}
                {formData.userId && formData.userId !== 'N/A' && (
                  <div>
                    <label className="text-white/70 text-sm font-semibold">User ID (Read-only)</label>
                    <input
                      type="text"
                      value={formData.userId}
                      disabled
                      className="w-full mt-2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"
                    />
                  </div>
                )}

                {/* Username */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-white/70 text-sm font-semibold">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60"
                  >
                    <option value="Looking to chat">Looking to chat</option>
                    <option value="Making friends">Making friends</option>
                    <option value="Just browsing">Just browsing</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData(profile)
                    }}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-white/70 text-sm mb-2">Matches</p>
              <p className="text-white font-black text-3xl">24</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-white/70 text-sm mb-2">Chats</p>
              <p className="text-white font-black text-3xl">8</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-white/70 text-sm mb-2">Time Online</p>
              <p className="text-white font-black text-3xl">42h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  )
}

export default Profile
