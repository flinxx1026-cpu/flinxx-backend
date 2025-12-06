import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ProfileSetupModal from './ProfileSetupModal'
import { isProfileCompleted } from '../utils/profileUtils'

const ProtectedChatRoute = ({ children }) => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const authUser = authContext?.user
  const authLoading = authContext?.isLoading
  
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      console.log('\n\n[ProtectedChatRoute] ====== PROTECTED ROUTE CHECK STARTED ======');
      console.log('[ProtectedChatRoute] AuthContext.isLoading:', authLoading);
      console.log('[ProtectedChatRoute] AuthContext.user:', authUser ? authUser.email : 'null');
      
      // Wait for AuthContext to finish loading
      if (authLoading) {
        console.log('[ProtectedChatRoute] ⏳ Waiting for AuthContext to finish loading...');
        setIsLoading(true);
        return;
      }
      
      // If AuthContext says no user, redirect to login
      if (!authUser) {
        console.log('[ProtectedChatRoute] ❌ No user in AuthContext, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }

      console.log('[ProtectedChatRoute] ✓ User loaded from AuthContext:', authUser.email);
      
      // Also check localStorage for profile completion status
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        console.log('[ProtectedChatRoute] ⚠️ No user in localStorage (this is ok for first-time OAuth)');
      } else {
        const userFromStorage = JSON.parse(savedUser)
        console.log('[ProtectedChatRoute] User from localStorage:', {
          id: userFromStorage.id,
          email: userFromStorage.email,
          profileCompleted: userFromStorage.profileCompleted,
          isProfileCompleted: userFromStorage.isProfileCompleted,
          birthday: userFromStorage.birthday,
          gender: userFromStorage.gender
        });
      }
      
      // Use AuthContext user as primary source
      setUser(authUser)

      // Check if profile is completed - try multiple sources
      const profileCompletedFromAuth = authUser.profileCompleted === true;
      const profileCompletedFromStorage = savedUser ? JSON.parse(savedUser).profileCompleted === true : false;
      const profileCompleted = profileCompletedFromAuth || profileCompletedFromStorage;
      
      console.log('[ProtectedChatRoute] Profile completion check:');
      console.log('  - From AuthContext (authUser.profileCompleted):', profileCompletedFromAuth);
      console.log('  - From localStorage:', profileCompletedFromStorage);
      console.log('  - Final decision (show chat?):', profileCompleted);
      
      if (!profileCompleted) {
        console.log('[ProtectedChatRoute] 🔴 RESULT: Profile NOT completed - SHOWING ProfileSetupModal');
        setShowProfileSetup(true)
      } else {
        console.log('[ProtectedChatRoute] 🟢 RESULT: Profile IS completed - showing Chat page');
      }
    } catch (error) {
      console.error('[ProtectedChatRoute] ❌ Error checking profile:', error)
      navigate('/login', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }, [navigate, authUser, authLoading])

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
