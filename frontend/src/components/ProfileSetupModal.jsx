import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CommunityStandardsModal from './CommunityStandardsModal'

const ProfileSetupModal = ({ user, onProfileComplete, isOpen }) => {
  const [birthday, setBirthday] = useState('2002-01-01')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showCommunityStandards, setShowCommunityStandards] = useState(false)
  const [updatedUserData, setUpdatedUserData] = useState(null)
  const navigate = useNavigate()

  // Calculate age from birthday
  useEffect(() => {
    if (birthday) {
      // Parse YYYY-MM-DD format
      const [year, month, day] = birthday.split('-').map(Number)
      const birthDate = new Date(year, month - 1, day)
      const today = new Date()
      let calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--
      }
      setAge(calculatedAge)
    } else {
      setAge(null)
    }
  }, [birthday])

  // Check if save button should be disabled
  const isSaveDisabled = !birthday || !gender || loading

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    if (!birthday || !gender) {
      setError('Please fill in all required fields')
      return
    }

    // Age validation happens on backend, but we can show warning here
    if (age && age < 18) {
      setError('You must be 18+ to use this app')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      
      // Get the user ID from the user object (uuid from AuthContext)
      const userId = user.uuid || user.id || user.uid || user.googleId
      
      if (!userId) {
        throw new Error('Unable to determine user ID')
      }

      const response = await fetch(`${BACKEND_URL}/api/users/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          birthday: birthday || null,
          gender
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'UNDERAGE_USER') {
          setError('You must be 18+ to use this app')
          return
        }
        setError(data.error || 'Failed to save profile')
        return
      }

      console.log('✅ Profile saved successfully:', data)
      
      // Mark profile as completed locally
      const updatedUser = {
        ...user,
        profileCompleted: true,
        isProfileCompleted: true,
        birthday,
        gender,
        age
      }

      localStorage.setItem('profileCompleted', 'true')
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Store updated user data for later use after Community Standards acceptance
      setUpdatedUserData(updatedUser)

      // Show Community Standards screen instead of redirecting immediately
      setLoading(false)
      setShowCommunityStandards(true)
    } catch (err) {
      console.error('❌ Error saving profile:', err)
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCommunityStandardsAccept = () => {
    // Notify parent component AFTER user accepts community standards
    if (onProfileComplete && updatedUserData) {
      onProfileComplete(updatedUserData)
    }
    // ✅ CRITICAL: Reload the page to ensure AuthContext reads the updated user data from localStorage
    // This ensures profileCompleted is properly reflected when ProtectedChatRoute checks it
    console.log('✅ Profile completed - reloading page to sync AuthContext');
    setTimeout(() => {
      window.location.href = '/chat?view=home'
    }, 300);
  }

  if (!isOpen && !showCommunityStandards || !user) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-6">
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(1.2);
          opacity: 0.8;
          cursor: pointer;
          margin-right: 4px;
        }
      `}</style>
      <div className="w-full max-w-2xl bg-[#0f172a] rounded-3xl shadow-2xl border-2 border-[#D4AF37] relative overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60"></div>
        
        {/* Profile Form - Hidden when showing community standards */}
        {!showCommunityStandards && (
        <div className="p-8 md:p-12 pt-32">
          {/* Header with Avatar */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8 border-b border-[#334155] border-opacity-40 pb-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-[#1e293b] border border-[#D4AF37] border-opacity-30 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-[#0f172a] overflow-hidden flex items-center justify-center">
                  {user.picture || user.photoURL ? (
                    <img
                      src={user.picture || user.photoURL}
                      alt={user.name || user.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-[#D4AF37] font-display">
                      {(user.name || user.displayName || 'J').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="font-display text-3xl font-semibold text-[#f8fafc] tracking-tight">My Profile</h1>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-40 rounded-lg">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveProfile} className="space-y-8 mt-10">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#D4AF37] text-opacity-90 ml-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user.name || user.displayName || ''}
                  disabled
                  className="block w-full px-4 py-3.5 bg-black border border-[#334155] rounded-lg text-[#f8fafc] placeholder-[#94a3b8] placeholder-opacity-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm cursor-not-allowed opacity-60"
                />
              </div>
            </div>

            {/* Grid for Gender and Birthday */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Gender Field with Radio Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#D4AF37] text-opacity-90 ml-1">
                  Gender
                </label>
                <div className="flex bg-black rounded-lg p-1 border border-[#334155] h-[50px] items-center">
                  <label className="flex-1 relative cursor-pointer h-full">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-full h-full flex items-center justify-center gap-2 rounded text-sm text-[#94a3b8] hover:text-white transition-all peer-checked:bg-[#1e293b] peer-checked:text-[#D4AF37] peer-checked:shadow-sm peer-checked:font-medium">
                      <span>👨</span>
                      <span>Male</span>
                    </div>
                  </label>
                  <div className="w-px h-4 bg-[#334155] mx-1"></div>
                  <label className="flex-1 relative cursor-pointer h-full">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-full h-full flex items-center justify-center gap-2 rounded text-sm text-[#94a3b8] hover:text-white transition-all peer-checked:bg-[#1e293b] peer-checked:text-[#D4AF37] peer-checked:shadow-sm peer-checked:font-medium">
                      <span>👩</span>
                      <span>Female</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Birthday Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#D4AF37] text-opacity-90 ml-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-lg">🎂</span>
                  </div>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3.5 bg-black border border-[#334155] rounded-lg text-[#f8fafc] placeholder-[#94a3b8] placeholder-opacity-50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
                    required
                  />
                </div>
                {age !== null && (
                  <p className="text-xs mt-2">
                    Age: <span className={age < 18 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{age} years old</span>
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 border-t border-[#334155] border-opacity-40 mt-8">
              <button
                type="submit"
                disabled={isSaveDisabled}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center ${
                  isSaveDisabled
                    ? 'bg-[#334155] text-[#94a3b8] cursor-not-allowed opacity-60'
                    : 'bg-[#D4AF37] hover:bg-[#B5952F] text-[#0f172a] hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Saving...
                  </span>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </form>

          {/* Info Text */}
          <p className="text-xs text-[#94a3b8] text-center mt-6">
            Your birthday and gender cannot be changed after saving.
          </p>
        </div>
        )}
      </div>

      {/* Community Standards Modal - Shows after profile is saved */}
      <CommunityStandardsModal 
        isOpen={showCommunityStandards} 
        onAccept={handleCommunityStandardsAccept}
      />
    </div>
  )
}

export default ProfileSetupModal
