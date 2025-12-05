import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BirthdayPicker from './BirthdayPicker'

const ProfileSetupModal = ({ user, onProfileComplete, isOpen }) => {
  const [birthday, setBirthday] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
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
      
      // Get the user ID from various possible sources
      const userId = user.id || user.uid || user.googleId
      
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
      
      // Update localStorage with completed profile data
      const updatedUser = {
        ...user,
        id: data.user.id,
        birthday: data.user.birthday,
        gender: data.user.gender,
        age: data.user.age,
        profileCompleted: data.user.profileCompleted,
        isProfileCompleted: true
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Call the callback to update auth context
      if (onProfileComplete) {
        onProfileComplete(updatedUser)
      }

      // Redirect to chat
      setTimeout(() => {
        navigate('/chat')
      }, 500)
    } catch (err) {
      console.error('❌ Error saving profile:', err)
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 my-8">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600 text-sm">Just a few more details to get started</p>
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center mb-6">
            {user.picture || user.photoURL ? (
              <img
                src={user.picture || user.photoURL}
                alt={user.name || user.displayName}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-500">
                <span className="text-gray-600 text-2xl">👤</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Name Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={user.name || user.displayName || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Birthday Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthday <span className="text-red-500">*</span>
              </label>
              <BirthdayPicker
                value={birthday}
                onChange={setBirthday}
                maxDate={new Date()}
              />
              {age !== null && (
                <p className="text-xs text-gray-600 mt-1">
                  Age: <span className={age < 18 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{age} years old</span>
                </p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaveDisabled}
              className={`w-full py-3 px-4 rounded-lg font-medium transition mt-6 ${
                isSaveDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Saving...
                </span>
              ) : (
                'Save Profile'
              )}
            </button>
          </form>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Your birthday and gender cannot be changed after saving.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetupModal
