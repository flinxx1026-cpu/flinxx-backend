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
  const [authCheckTimeout, setAuthCheckTimeout] = useState(false)

  // Add a flag to track if we've already redirected to avoid infinite loops
  const [redirectedToLogin, setRedirectedToLogin] = useState(false)

  console.log('\n[ProtectedChatRoute] 🟢 RENDER CALLED');
  console.log('[ProtectedChatRoute]   - isLoading:', isLoading);
  console.log('[ProtectedChatRoute]   - showProfileSetup:', showProfileSetup);
  console.log('[ProtectedChatRoute]   - authLoading:', authLoading);
  console.log('[ProtectedChatRoute]   - authUser:', authUser ? authUser.email : 'null');
  console.log('[ProtectedChatRoute]   - redirectedToLogin:', redirectedToLogin);
  console.log('[ProtectedChatRoute]   - authCheckTimeout:', authCheckTimeout);

  useEffect(() => {
    console.log('\n\n🔴 [ProtectedChatRoute] ═══════════════════════════════════════════');
    console.log('🔴 [ProtectedChatRoute] EFFECT RUNNING - PROFILE CHECK');
    console.log('🔴 [ProtectedChatRoute] ═══════════════════════════════════════════');
    console.log('🔴 [ProtectedChatRoute] Effect dependencies changed:');
    console.log('🔴 [ProtectedChatRoute]   - authLoading:', authLoading);
    console.log('🔴 [ProtectedChatRoute]   - authUser:', authUser ? authUser.email : 'null');
    console.log('🔴 [ProtectedChatRoute]   - authCheckTimeout:', authCheckTimeout);
    
    // Set a timeout to fallback to localStorage if AuthContext takes too long
    const timeoutId = setTimeout(() => {
      console.log('🔴 [ProtectedChatRoute] ⏰ AuthContext timeout - checking localStorage fallback');
      setAuthCheckTimeout(true);
    }, 3000);
    
    try {
      // CRITICAL: Check if AuthContext is still loading
      if (authLoading === true) {
        console.log('🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext is still initializing (isLoading=true)');
        setIsLoading(true);
        return () => clearTimeout(timeoutId);
      }

      if (authLoading === undefined) {
        console.log('🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext loading state is undefined');
        setIsLoading(true);
        return () => clearTimeout(timeoutId);
      }

      console.log('🔴 [ProtectedChatRoute] ✓ AuthContext finished loading (isLoading=false)');

      // If AuthContext finished loading but no user, check localStorage before redirecting
      if (!authUser) {
        console.log('🔴 [ProtectedChatRoute] ❌ AuthContext finished loading but NO USER in context');
        console.log('🔴 [ProtectedChatRoute] Checking localStorage for recovery...');
        
        // Fallback: Check if token exists in localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        console.log('🔴 [ProtectedChatRoute] localStorage check:');
        console.log('🔴 [ProtectedChatRoute]   - token:', !!storedToken);
        console.log('🔴 [ProtectedChatRoute]   - authToken:', !!authToken);
        console.log('🔴 [ProtectedChatRoute]   - user:', !!storedUser);
        
        if ((storedToken || authToken) && storedUser) {
          console.log('🔴 [ProtectedChatRoute] ✅ FOUND - Token and user in localStorage!');
          console.log('🔴 [ProtectedChatRoute] Parsing localStorage user...');
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('🔴 [ProtectedChatRoute] Parsed user:', {
              email: parsedUser?.email,
              uuid: parsedUser?.uuid?.substring(0, 8) + '...',
              profileCompleted: parsedUser?.profileCompleted
            });
            
            if (parsedUser && parsedUser.uuid && typeof parsedUser.uuid === 'string' && parsedUser.uuid.length > 0) {
              console.log('🔴 [ProtectedChatRoute] ✅ RECOVERY: Using user from localStorage:', parsedUser.email);
              setUser(parsedUser);
              
              // Check profile completion
              const isProfileComplete = parsedUser.profileCompleted === true;
              console.log('🔴 [ProtectedChatRoute] Profile complete?', isProfileComplete);
              
              if (!isProfileComplete) {
                setShowProfileSetup(true);
              }
              
              setIsLoading(false);
              return () => clearTimeout(timeoutId);
            } else {
              console.error('🔴 [ProtectedChatRoute] ❌ Parsed user but UUID invalid:', parsedUser?.uuid?.length);
            }
          } catch (e) {
            console.error('🔴 [ProtectedChatRoute] Failed to parse stored user:', e);
          }
        }
        
        console.log('🔴 [ProtectedChatRoute] No valid token/user found - redirecting to /login');
        if (!redirectedToLogin) {
          setRedirectedToLogin(true);
          setIsLoading(false);
          navigate('/login', { replace: true });
        }
        return () => clearTimeout(timeoutId);
      }

      console.log('🔴 [ProtectedChatRoute] ✅ AuthContext loaded with user:', authUser.email);
      
      setUser(authUser);

      // Check profile completion
      const isProfileComplete = authUser?.profileCompleted === true;
      console.log('🔴 [ProtectedChatRoute] Profile complete?', isProfileComplete);
      
      if (!isProfileComplete) {
        console.log('🔴 [ProtectedChatRoute] ➜ SHOWING ProfileSetupModal');
        setShowProfileSetup(true);
      }
      
      setIsLoading(false);
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('[ProtectedChatRoute] ❌ ERROR:', error);
      setIsLoading(false);
      if (!redirectedToLogin) {
        setRedirectedToLogin(true);
        navigate('/login', { replace: true });
      }
      return () => clearTimeout(timeoutId);
    }
  }, [navigate, authUser, authLoading, redirectedToLogin, authCheckTimeout]);

  const handleProfileComplete = (completedUser) => {
    console.log('Profile completed:', completedUser)
    setShowProfileSetup(false)
    setUser(completedUser)
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 1rem',
            border: '2px solid rgba(255, 215, 0, 0.1)',
            borderTopColor: '#FFD700',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
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
