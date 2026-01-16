import React, { createContext, useState, useEffect, useContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { checkRedirectResult } from '../config/firebase'
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
        console.log('🔵 [AuthContext] Current path:', window.location.pathname);
        
        // ⚠️ CRITICAL: Check URL query params for OAuth token (backup method)
        // OAuth callbacks pass token as ?token=... if localStorage fails
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const urlUser = urlParams.get('user');
        const urlProvider = urlParams.get('provider');
        const isOAuthRedirect = urlParams.get('oauth') === 'true';
        
        if (isOAuthRedirect && urlToken && urlUser) {
          console.log('🔵 [AuthContext] 🔗 OAUTH REDIRECT detected via URL parameters');
          console.log('🔵 [AuthContext] Saving OAuth data from URL to localStorage');
          try {
            localStorage.setItem('token', urlToken);
            localStorage.setItem('authToken', urlToken);
            localStorage.setItem('user', urlUser);
            if (urlProvider) localStorage.setItem('authProvider', urlProvider);
            console.log('✅ [AuthContext] OAuth data saved from URL to localStorage');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (e) {
            console.error('❌ [AuthContext] Error saving URL oauth data to localStorage:', e);
          }
        }
        
        // ⚠️ CRITICAL: Skip auth check if we're on /auth-success page
        // The /auth-success page will save token to localStorage and trigger a re-render
        if (window.location.pathname === '/auth-success') {
          console.log('🔵 [AuthContext] ⏸ On /auth-success page - waiting for token to be saved');
          // Still need to set isLoading to false but don't return early
          // We'll skip the full auth flow but set up listeners below
          setIsLoading(false);
          // Don't return - continue to set up listeners
        } else {
          console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
          
          // ✅ FAST PATH: Check localStorage FIRST before any backend calls
          const storedToken = localStorage.getItem('token')
          const storedUser = localStorage.getItem('user')
          
          console.log('🔵 [AuthContext] STEP 1: Quick check for stored token/user');
          console.log('🔵 [AuthContext]   - token:', storedToken ? '✓ Found' : '✗ Not found')
          console.log('🔵 [AuthContext]   - user:', storedUser ? '✓ Found' : '✗ Not found')
          
          // If we have BOTH token and user in localStorage, try to use them immediately
          if (storedToken && storedUser) {
            try {
              console.log('\n🔵 [AuthContext] FAST PATH: Both token and user found in localStorage');
              const user = JSON.parse(storedUser);
              
              // Validate UUID format first
              if (user.uuid && typeof user.uuid === 'string' && user.uuid.length === 36) {
                console.log('🔵 [AuthContext] ✅ Valid UUID found in localStorage:', user.uuid.substring(0, 8) + '...');
                console.log('🔵 [AuthContext] Setting user from localStorage without backend validation');
                setUser(user)
                setIsAuthenticated(true)
                setIsLoading(false)
                console.log('🔵 [AuthContext] ✅ FAST PATH COMPLETE - User loaded from localStorage')
                return
              } else {
                console.warn('🧹 [AuthContext] Invalid UUID in localStorage:', {
                  uuid: user.uuid,
                  length: user.uuid?.length,
                  type: typeof user.uuid
                });
                localStorage.removeItem('user');
                localStorage.removeItem('token');
              }
            } catch (err) {
              console.error('🔵 [AuthContext] Error parsing localStorage user:', err);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } else {
            console.log('🔵 [AuthContext] Skipping fast path (missing token or user from localStorage)');
          }
          
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
        
        // If we have a token, validate it and restore user data
        if (storedToken && storedUser) {
          try {
            console.log('\n🔵 [AuthContext] STEP 2: Parse localStorage user');
            const user = JSON.parse(storedUser)
            console.log('🔵 [AuthContext]   - Parsed user email:', user.email)
            console.log('🔵 [AuthContext]   - profileCompleted from localStorage:', user.profileCompleted, '(type:', typeof user.profileCompleted + ')')
            console.log('🔵 [AuthContext] 🔍 Attempting to restore Google OAuth user from localStorage:', user.email)
            console.log('🔵 [AuthContext] User data from localStorage:', {
              id: user.id,
              email: user.email,
              profileCompleted: user.profileCompleted,
              isProfileCompleted: user.isProfileCompleted
            })
            
            // Optionally validate token with backend
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
            console.log('\n🔵 [AuthContext] STEP 3: Validate token with backend');
            console.log('🔵 [AuthContext]   - Backend URL:', BACKEND_URL)
            console.log('🔵 [AuthContext]   - Making request to /api/profile...')
            
            const response = await fetch(`${BACKEND_URL}/api/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              }
            })
            
            console.log('🔵 [AuthContext]   - Response status:', response.status)
            
            if (response.ok) {
              const data = await response.json()
              console.log('🔵 [AuthContext]   - Response OK, parsing data...')
              console.log('🔵 [AuthContext]   - data.success:', data.success)
              console.log('🔵 [AuthContext]   - data.user available:', !!data.user)
              
              if (data.success && data.user) {
                console.log('🔵 [AuthContext] ✅ Token validated, user restored from backend')
                console.log('🔵 [AuthContext] Backend user data:', {
                  id: data.user.id,
                  email: data.user.email,
                  profileCompleted: data.user.profileCompleted,
                  birthday: data.user.birthday,
                  gender: data.user.gender
                })
                
                // ✅ CRITICAL: Create CLEAN user object with ONLY needed fields
                // ❌ DO NOT spread data.user (it contains numeric id)
                const normalizedUser = {
                  uuid: data.user.uuid,           // ✅ ONLY 36-char UUID
                  name: data.user.name || 'User',
                  email: data.user.email,
                  picture: data.user.picture,
                  profileCompleted: data.user.profileCompleted || false
                };
                
                // ✅ STRICT VALIDATION: UUID must be exactly 36 chars
                if (!normalizedUser.uuid || typeof normalizedUser.uuid !== 'string' || normalizedUser.uuid.length !== 36) {
                  console.error('❌ INVALID UUID FROM BACKEND:', normalizedUser.uuid);
                  console.error('   Expected 36-char UUID, got:', normalizedUser.uuid?.length || 'undefined');
                  // Don't set user if UUID is invalid
                  setIsLoading(false);
                  return;
                }
                
                console.log('🔵 [AuthContext] Setting user state with UUID-only:', { 
                  uuid: normalizedUser.uuid.substring(0, 8) + '...', 
                  email: normalizedUser.email 
                });
                setUser(normalizedUser);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                setIsAuthenticated(true);
                setIsLoading(false);
                console.log('🔵 [AuthContext] ✅ COMPLETE - UUID-only user set');
                return;
              } else {
                console.log('🔵 [AuthContext] ⚠️  Response OK but data.success or data.user missing')
              }
            } else {
              console.log('🔵 [AuthContext] ⚠️ Token validation response not OK:', response.status)
              const errorText = await response.text()
              console.log('🔵 [AuthContext] Error response:', errorText)
            }
          } catch (err) {
            console.error('🔵 [AuthContext] ❌ Error validating token:', err)
          }
        } else {
          console.log('\n🔵 [AuthContext] STEP 2: Skip token validation (missing token or user)')
          console.log('🔵 [AuthContext]   - Skipping /api/profile call')
        }
        
        // Fall back to checking localStorage user without token validation
        if (storedUser) {
          try {
            console.log('\n🔵 [AuthContext] STEP 3: Restore from localStorage (no token validation)');
            console.log('🔵 [AuthContext] Raw stored user string:', storedUser);
            const user = JSON.parse(storedUser);
            console.log('🔵 [AuthContext] Parsed user object:', user);
            console.log('🔵 [AuthContext] User keys:', Object.keys(user));
            console.log('🔵 [AuthContext] user.uuid value:', user.uuid);
            console.log('🔵 [AuthContext] user.uuid type:', typeof user.uuid);
            console.log('🔵 [AuthContext] user.uuid length:', user.uuid?.length);
            
            // ✅ STRICT VALIDATION: UUID must be 36-char string
            if (!user.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
              console.warn('🧹 [AuthContext] Invalid UUID in localStorage, removing:', user.uuid?.length);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setIsLoading(false);
              return;
            }
            
            console.log('🔵 [AuthContext]   - Email:', user.email);
            console.log('🔵 [AuthContext]   - UUID:', user.uuid.substring(0, 8) + '...');
            console.log('🔵 [AuthContext] ✅ User loaded from localStorage (UUID valid):', user.email);
            setUser(user)
            setIsAuthenticated(true)
            setIsLoading(false)
            console.log('🔵 [AuthContext] ✅ COMPLETE - Returning from localStorage fallback path')
            return
          } catch (err) {
            console.error('[AuthContext] Error parsing saved user:', err)
          }
        }
        
        console.log('\n🔵 [AuthContext] STEP 3: No stored token or user, checking Firebase...');
        
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
              const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
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
        } // End of else block - Firebase auth check only if NOT on /auth-success
      } catch (err) {
        console.error('[AuthContext] Error initializing auth:', err)
        setIsLoading(false)
      }
    }
    
    initializeAuth()

    // ✅ CRITICAL: Listen for localStorage changes
    // When /auth-success page saves the token, this will trigger
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('🔵 [AuthContext] Storage changed:', e.key);
        console.log('🔵 [AuthContext] Reinitializing due to storage event');
        // Reinitialize to pick up the new token/user
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
