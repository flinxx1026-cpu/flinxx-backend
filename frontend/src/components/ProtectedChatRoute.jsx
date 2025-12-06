import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ProfileSetupModal from './ProfileSetupModal'

const ProtectedChatRoute = ({ children }) => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const authUser = authContext?.user
  const authLoading = authContext?.isLoading
  
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log('\n[ProtectedChatRoute] 🟢 RENDER CALLED');
  console.log('[ProtectedChatRoute]   - isLoading:', isLoading);
  console.log('[ProtectedChatRoute]   - showProfileSetup:', showProfileSetup);
  console.log('[ProtectedChatRoute]   - authLoading:', authLoading);
  console.log('[ProtectedChatRoute]   - authUser:', authUser ? authUser.email : 'null');

  useEffect(() => {
    console.log('\n\n🔴 [ProtectedChatRoute] ═══════════════════════════════════════════');
    console.log('🔴 [ProtectedChatRoute] EFFECT RUNNING - PROFILE CHECK');
    console.log('🔴 [ProtectedChatRoute] ═══════════════════════════════════════════');
    console.log('🔴 [ProtectedChatRoute] Effect dependencies changed:');
    console.log('🔴 [ProtectedChatRoute]   - authLoading:', authLoading);
    console.log('🔴 [ProtectedChatRoute]   - authUser:', authUser ? authUser.email : 'null');
    
    try {
      // CRITICAL: Check if AuthContext is still loading
      if (authLoading === true) {
        console.log('🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext is still initializing (isLoading=true)');
        setIsLoading(true);
        return;
      }

      if (authLoading === undefined) {
        console.log('🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext loading state is undefined');
        setIsLoading(true);
        return;
      }

      console.log('🔴 [ProtectedChatRoute] ✓ AuthContext finished loading (isLoading=false)');

      // If AuthContext finished loading but no user, redirect to login
      if (!authUser) {
        console.log('🔴 [ProtectedChatRoute] ❌ AuthContext finished loading but NO USER found');
        console.log('🔴 [ProtectedChatRoute] Redirecting to /login');
        setIsLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      console.log('🔴 [ProtectedChatRoute] ✅ AuthContext loaded with user:', authUser.email);
      console.log('🔴 [ProtectedChatRoute] authUser object:', {
        id: authUser.id,
        email: authUser.email,
        profileCompleted: authUser.profileCompleted,
        birthday: authUser.birthday,
        gender: authUser.gender
      });
      console.log('🔴 [ProtectedChatRoute]   - authUser.profileCompleted type:', typeof authUser.profileCompleted);
      console.log('🔴 [ProtectedChatRoute]   - authUser.profileCompleted value:', authUser.profileCompleted);
      console.log('🔴 [ProtectedChatRoute]   - authUser.profileCompleted === true?', authUser.profileCompleted === true);
      
      // Check localStorage as well
      const savedUser = localStorage.getItem('user');
      console.log('🔴 [ProtectedChatRoute] Checking localStorage:');
      console.log('🔴 [ProtectedChatRoute]   - user key exists:', !!savedUser);
      if (savedUser) {
        try {
          const userFromStorage = JSON.parse(savedUser);
          console.log('🔴 [ProtectedChatRoute] localStorage user:', {
            id: userFromStorage.id,
            email: userFromStorage.email,
            profileCompleted: userFromStorage.profileCompleted
          });
          console.log('🔴 [ProtectedChatRoute]   - localStorage.profileCompleted type:', typeof userFromStorage.profileCompleted);
          console.log('🔴 [ProtectedChatRoute]   - localStorage.profileCompleted value:', userFromStorage.profileCompleted);
          console.log('🔴 [ProtectedChatRoute]   - localStorage.profileCompleted === true?', userFromStorage.profileCompleted === true);
        } catch (e) {
          console.error('[ProtectedChatRoute] Failed to parse localStorage user:', e);
        }
      } else {
        console.log('[ProtectedChatRoute] ⚠️ No user in localStorage');
      }
      
      setUser(authUser);

      // CRITICAL: Check profile completion status from multiple sources
      console.log('\n🔴 [ProtectedChatRoute] PROFILE COMPLETION CHECK:');
      
      // Source 1: authUser object
      const profileCompletedAuth = authUser?.profileCompleted;
      console.log('🔴 [ProtectedChatRoute]   Source 1 (AuthContext):');
      console.log('🔴 [ProtectedChatRoute]     authUser.profileCompleted =', profileCompletedAuth);
      console.log('🔴 [ProtectedChatRoute]     typeof =', typeof profileCompletedAuth);
      console.log('🔴 [ProtectedChatRoute]     === true?', profileCompletedAuth === true);
      
      // Source 2: localStorage
      let profileCompletedStorage = null;
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        profileCompletedStorage = parsed.profileCompleted;
        console.log('🔴 [ProtectedChatRoute]   Source 2 (localStorage):');
        console.log('🔴 [ProtectedChatRoute]     localStorage.profileCompleted =', profileCompletedStorage);
        console.log('🔴 [ProtectedChatRoute]     typeof =', typeof profileCompletedStorage);
        console.log('🔴 [ProtectedChatRoute]     === true?', profileCompletedStorage === true);
      } else {
        console.log('🔴 [ProtectedChatRoute]   Source 2 (localStorage): not available');
      }
      
      // Final decision - profile is complete if EITHER source says true
      const isProfileComplete = profileCompletedAuth === true || profileCompletedStorage === true;
      
      console.log('\n🔴 [ProtectedChatRoute] FINAL DECISION:');
      console.log('🔴 [ProtectedChatRoute]   profileCompletedAuth === true?', profileCompletedAuth === true);
      console.log('🔴 [ProtectedChatRoute]   profileCompletedStorage === true?', profileCompletedStorage === true);
      console.log('🔴 [ProtectedChatRoute]   isProfileComplete (final):', isProfileComplete);
      
      if (!isProfileComplete) {
        console.log('\n🔴 [ProtectedChatRoute] ❌ DECISION: Profile NOT completed');
        console.log('🔴 [ProtectedChatRoute] ➜ SHOWING ProfileSetupModal\n');
        setShowProfileSetup(true);
      } else {
        console.log('\n🔴 [ProtectedChatRoute] ✅ DECISION: Profile IS completed');
        console.log('🔴 [ProtectedChatRoute] ➜ SHOWING Chat page\n');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('[ProtectedChatRoute] ❌ ERROR in profile check:', error);
      console.error('[ProtectedChatRoute] Stack:', error.stack);
      setIsLoading(false);
      navigate('/login', { replace: true });
    }
  }, [navigate, authUser, authLoading]);

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
      {!showProfileSetup && children}
    </>
  )
}

export default ProtectedChatRoute
