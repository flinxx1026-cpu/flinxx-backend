import React, { createContext, useState, useEffect, useContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { getNotifications } from '../services/api'

// Create Auth Context
export const AuthContext = createContext()

// ✅ Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPending, setAuthPending] = useState(false)
  
  // ✅ KEEP NOTIFICATIONS in AuthContext (needed for SearchFriendsModal)
  const [notifications, setNotifications] = useState([])

  // ✅ REFRESH NOTIFICATIONS (unread moved to UnreadContext)
  const refreshNotifications = async () => {
    if (!user?.uuid || user.uuid.length !== 36) {
      console.warn('⏸ refreshNotifications skipped: user UUID not ready');
      return;
    }
    const data = await getNotifications(user.uuid);
    setNotifications(Array.isArray(data) ? data : []);
  };

  // ✅ CRITICAL: Only fetch notifications when USER UUID is ready
  // This dependency ensures we NEVER call APIs before user is loaded
  useEffect(() => {
    // MUST wait for authLoading to be FALSE first
    if (isLoading === true) {
      console.log('⏸ Skipping notifications fetch – authLoading is true');
      return;
    }

    if (!user?.uuid || user.uuid.length !== 36) {
      console.log('⏸ Skipping notifications fetch – user UUID not ready');
      return;
    }

    console.log('✅ User ready, fetching notifications:', user.uuid.substring(0, 8) + '...');
    
    // Fetch immediately
    refreshNotifications();

    // Poll every 5 seconds
    const notifInterval = setInterval(refreshNotifications, 5000);

    return () => {
      clearInterval(notifInterval);
    };
  }, [isLoading, user?.uuid]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('\n\n🔵 [AuthContext] ═══════════════════════════════════════════');
        console.log('🔵 [AuthContext] INITIALIZATION STARTED');
        console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
        
        // ✅ CLEANUP STEP: Remove invalid users from old builds (numeric IDs)
        const storedUserRaw = localStorage.getItem('user');
        if (storedUserRaw) {
          try {
            const parsed = JSON.parse(storedUserRaw);
            
            // ❌ Remove if UUID is invalid or numeric
            if (!parsed.uuid || (typeof parsed.uuid === 'string' && parsed.uuid.length !== 36)) {
              console.warn('🧹 [AuthContext] Removing invalid user from localStorage:', {
                uuid: parsed.uuid,
                id: parsed.id,
                email: parsed.email
              });
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch (e) {
            console.warn('🧹 [AuthContext] Invalid JSON in localStorage user, removing');
            localStorage.removeItem('user');
          }
        }
        
        // 🚨 CRITICAL: Check for stored JWT token from Google OAuth FIRST
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        console.log('🔵 [AuthContext] STEP 1: Check localStorage');
        console.log('🔵 [AuthContext]   - token:', storedToken ? '✓ Found' : '✗ Not found')
        console.log('🔵 [AuthContext]   - user:', storedUser ? '✓ Found' : '✗ Not found')
        
        // 🚨 CRITICAL: JWT AUTH TAKES PRIORITY - NO FIREBASE IF JWT EXISTS
        if (storedToken && storedUser) {
          try {
            console.log('\n🔵 [AuthContext] ✅ JWT found in localStorage');
            const user = JSON.parse(storedUser);
            
            // ✅ STRICT VALIDATION: UUID must be exactly 36 chars
            if (!user.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
              console.warn('🧹 [AuthContext] Invalid UUID in localStorage, clearing auth');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setIsLoading(false);
              return;
            }
            
            console.log('🔵 [AuthContext] ✅ User restored from JWT:', user.email);
            console.log('🔵 [AuthContext] ✅ profileCompleted:', user.profileCompleted);
            console.log('🔵 [AuthContext] ✅ Firebase auth SKIPPED — using JWT only');
            
            setUser(user);
            setIsAuthenticated(true);
            setIsLoading(false);
            console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
            console.log('🔵 [AuthContext] INITIALIZATION COMPLETE (JWT) - isLoading=false');
            console.log('🔵 [AuthContext] ═══════════════════════════════════════════\n');
            
            // 🚨 RETURN EARLY - DO NOT CONTINUE TO FIREBASE
            return;
          } catch (err) {
            console.error('🔵 [AuthContext] ❌ Error parsing JWT user:', err);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setIsLoading(false);
            return;
          }
        }
        
        console.log('\n🔵 [AuthContext] STEP 2: No JWT found, will check Firebase...');
        
        // Check Firebase authentication state
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log('\n🔵 [AuthContext] Firebase onAuthStateChanged fired');
          console.log('🔵 [AuthContext]   - firebaseUser:', firebaseUser ? firebaseUser.email : 'null');
          
          if (firebaseUser) {
            // User is logged in via Firebase (Google or Facebook)
            const authProvider = firebaseUser.providerData[0]?.providerId || 'unknown'
            console.log('🔵 [AuthContext] User authenticated via Firebase');
            console.log('🔵 [AuthContext]   - Email:', firebaseUser.email);
            console.log('🔵 [AuthContext]   - Provider:', authProvider);
            
            // CRITICAL: Get the full user profile from our database
            try {
              console.log('🔵 [AuthContext] Getting Firebase ID token...');
              const idToken = await firebaseUser.getIdToken()
              console.log('🔵 [AuthContext] ✓ ID token obtained');
              localStorage.setItem('idToken', idToken)
              console.log('🔐 Firebase ID token stored for Socket.IO')
              
              // Fetch full profile from backend
              const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
              console.log('🔵 [AuthContext] Calling /api/profile with ID token...');
              const profileResponse = await fetch(`${BACKEND_URL}/api/profile`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${idToken}`,
                  'Content-Type': 'application/json'
                }
              })
              
              console.log('🔵 [AuthContext] /api/profile response status:', profileResponse.status);
              
              if (profileResponse.ok) {
                const profileData = await profileResponse.json()
                console.log('🔵 [AuthContext] /api/profile response OK');
                console.log('🔵 [AuthContext]   - success:', profileData.success);
                console.log('🔵 [AuthContext]   - user.profileCompleted:', profileData.user?.profileCompleted);
                
                if (profileData.success && profileData.user) {
                  console.log('🔵 [AuthContext] ✅ Fetched full user profile from database:', {
                    email: profileData.user.email,
                    profileCompleted: profileData.user.profileCompleted
                  })
                  console.log('🔵 [AuthContext] Setting user state with profileCompleted:', profileData.user.profileCompleted);
                  
                  // Ensure publicId and uuid are included in user object
                  const userWithIds = {
                    ...profileData.user,
                    publicId: profileData.user.public_id || profileData.user.publicId,
                    uuid: profileData.user.uuid // ✅ Use UUID from backend ONLY
                  }
                  
                  // Safe error check - DO NOT auto-fill
                  if (!userWithIds.uuid) {
                    console.error('❌ UUID missing from backend user object');
                  }
                  
                  setUser(userWithIds)
                  setIsAuthenticated(true)
                  setIsLoading(false)
                  return
                }
              } else {
                console.log('🔵 [AuthContext] ⚠️ /api/profile response not OK:', profileResponse.status);
              }
            } catch (error) {
              console.warn('[AuthContext] ⚠️ Failed to fetch profile from database:', error)
              // Fall back to minimal user info
            }
            
            // Fallback: Create minimal userInfo if profile fetch failed
            const userInfo = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              publicId: firebaseUser.uid, // Use UID as temporary publicId
              authProvider: authProvider,
              profileCompleted: false  // Default to false if not found
            }
            
            console.log('[AuthContext] Using fallback userInfo (database fetch failed):', userInfo.email)
            console.log('[AuthContext] ⚠️ WARNING: profileCompleted not loaded from database, defaulting to false');
            setUser(userInfo)
            setIsAuthenticated(true)
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            localStorage.setItem('authProvider', authProvider)
          } else {
            console.log('🔵 [AuthContext] Firebase user is null/logged out');
            
            // Check for local auth token (legacy support for guest login)
            const authToken = localStorage.getItem('authToken')
            const authProvider = localStorage.getItem('authProvider')
            
            console.log('🔵 [AuthContext]   - authToken:', authToken ? 'Found' : 'Not found');
            console.log('🔵 [AuthContext]   - authProvider:', authProvider);
            
            if (authToken && authProvider === 'guest') {
              const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
              
              // Ensure publicId exists
              if (!userInfo.publicId && userInfo.public_id) {
                userInfo.publicId = userInfo.public_id
              }
              
              console.log('🔵 [AuthContext] Restoring guest login');
              setUser(userInfo)
              setIsAuthenticated(true)
            } else {
              // No auth found, redirect to login
              console.log('🔵 [AuthContext] ❌ No authentication found, user will be redirected to login')
              setUser(null)
              setIsAuthenticated(false)
            }
          }
          console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
          console.log('🔵 [AuthContext] INITIALIZATION COMPLETE - Setting isLoading=false');
          console.log('🔵 [AuthContext] ═══════════════════════════════════════════\n');
          setIsLoading(false)
        })

        return unsubscribe
      } catch (err) {
        console.error('[AuthContext] Error initializing auth:', err)
        setIsLoading(false)
      }
    }
    
    initializeAuth()
  }, [])

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('authProvider')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const setAuthToken = (token, userData) => {
    console.log('[AuthContext] ⚠️ setAuthToken called with userData:', {
      email: userData?.email,
      has_uuid: !!userData?.uuid,
      uuid: userData?.uuid,
      uuid_length: userData?.uuid?.length,
      all_keys: Object.keys(userData || {})
    })
    
    // ✅ CRITICAL: Create CLEAN user object with ONLY needed fields
    // ❌ DO NOT spread userData (it contains numeric id)
    const normalizedUserData = {
      uuid: userData?.uuid,
      name: userData?.name || 'User',
      email: userData?.email,
      picture: userData?.picture,
      profileCompleted: userData?.profileCompleted || false
    }
    
    // Safe error check: UUID must be exactly 36 chars
    if (!normalizedUserData.uuid || typeof normalizedUserData.uuid !== 'string' || normalizedUserData.uuid.length !== 36) {
      console.error('❌ Invalid or missing UUID in setAuthToken:', {
        uuid_received: userData?.uuid,
        uuid_type: typeof userData?.uuid,
        uuid_length: userData?.uuid?.length
      })
      return
    }
    
    console.log('[AuthContext] ✅ setAuthToken storing user with UUID:', normalizedUserData.uuid.substring(0, 8) + '...')
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(normalizedUserData))
    localStorage.setItem('authProvider', 'google')
    setUser(normalizedUserData)
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      logout, 
      authPending, 
      setAuthPending, 
      setAuthToken,
      // ✅ NOTIFICATIONS (unread moved to UnreadContext)
      notifications,
      refreshNotifications
    }}>
      {children}
    </AuthContext.Provider>
  )
}
