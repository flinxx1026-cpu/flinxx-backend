import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileSetupModal from './ProfileSetupModal'
import { isProfileCompleted } from '../utils/profileUtils'

const ProtectedChatRoute = ({ children }) => {
  const navigate = useNavigate()
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      console.log('\n\n[ProtectedChatRoute] Checking profile status...');
      
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        console.log('[ProtectedChatRoute] ❌ No user found in localStorage, redirecting to login')
        navigate('/login', { replace: true })
        return
      }

      const userData = JSON.parse(savedUser)
      console.log('[ProtectedChatRoute] ✓ User loaded from localStorage:', userData.email);
      console.log('[ProtectedChatRoute] User data:', {
        id: userData.id,
        email: userData.email,
        profileCompleted: userData.profileCompleted,
        isProfileCompleted: userData.isProfileCompleted,
        birthday: userData.birthday,
        gender: userData.gender
      });
      
      setUser(userData)

      // Check if profile is completed (support both field names)
      const profileCompleted = userData.profileCompleted || userData.isProfileCompleted;
      
      console.log('[ProtectedChatRoute] Profile status check:');
      console.log('  - profileCompleted field:', userData.profileCompleted);
      console.log('  - isProfileCompleted field:', userData.isProfileCompleted);
      console.log('  - Final result (profileCompleted):', profileCompleted);
      
      if (!profileCompleted) {
        console.log('[ProtectedChatRoute] ⚠️ Profile NOT completed - showing ProfileSetupModal');
        setShowProfileSetup(true)
      } else {
        console.log('[ProtectedChatRoute] ✅ Profile IS completed - showing chat page');
      }
    } catch (error) {
      console.error('[ProtectedChatRoute] ❌ Error checking profile:', error)
      navigate('/login', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const handleProfileComplete = (completedUser) => {
    console.log('Profile completed:', completedUser)
    setShowProfileSetup(false)
    setUser(completedUser)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
          <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showProfileSetup && user && (
        <ProfileSetupModal user={user} onProfileComplete={handleProfileComplete} isOpen={true} />
      )}
      {children}
    </>
  )
}

export default ProtectedChatRoute
