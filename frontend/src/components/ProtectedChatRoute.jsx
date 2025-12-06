import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileSetupModal from './ProfileSetupModal'

const ProtectedChatRoute = ({ children }) => {
  const navigate = useNavigate()
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        console.log('No user found, redirecting to login')
        navigate('/login', { replace: true })
        return
      }

      const userData = JSON.parse(savedUser)
      setUser(userData)

      // Check if profile is completed (support both field names)
      const profileCompleted = userData.profileCompleted || userData.isProfileCompleted;
      if (!profileCompleted) {
        console.log('[ProtectedChatRoute] Profile not completed, showing setup modal')
        console.log('[ProtectedChatRoute] profileCompleted:', userData.profileCompleted)
        console.log('[ProtectedChatRoute] isProfileCompleted:', userData.isProfileCompleted)
        setShowProfileSetup(true)
      } else {
        console.log('[ProtectedChatRoute] ✓ Profile is already completed, showing chat')
      }
    } catch (error) {
      console.error('Error checking profile:', error)
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
