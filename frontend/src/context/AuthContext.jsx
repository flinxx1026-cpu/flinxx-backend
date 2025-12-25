import React, { createContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { checkRedirectResult } from '../config/firebase'

// Create Auth Context
export const AuthContext = createContext()

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPending, setAuthPending] = useState(false) // Flag to prevent interruptions during Firebase login

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('\n\n🔵 [AuthContext] ═══════════════════════════════════════════');
        console.log('🔵 [AuthContext] INITIALIZATION STARTED');
        console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
        
        // Check for stored JWT token from Google OAuth
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        console.log('🔵 [AuthContext] STEP 1: Check localStorage');
        console.log('🔵 [AuthContext]   - token:', storedToken ? '✓ Found' : '✗ Not found')
        console.log('🔵 [AuthContext]   - user:', storedUser ? '✓ Found' : '✗ Not found')
        
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
                
                console.log('🔵 [AuthContext] Setting user state with:', { email: data.user.email, profileCompleted: data.user.profileCompleted })
                const normalizedUser = {
                  ...data.user,
                  id: data.user.id || data.user.public_id
                }
                setUser(normalizedUser)
                setIsAuthenticated(true)
                setIsLoading(false)
                console.log('🔵 [AuthContext] ✅ COMPLETE - Returning from token validation path')
                return
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
            const user = JSON.parse(storedUser)
            console.log('🔵 [AuthContext]   - Email:', user.email)
            console.log('🔵 [AuthContext]   - profileCompleted:', user.profileCompleted, '(type:', typeof user.profileCompleted + ')')
            console.log('🔵 [AuthContext] ✅ User loaded from localStorage (no token validation):', user.email)
            console.log('🔵 [AuthContext] User data from localStorage:', {
              id: user.id,
              email: user.email,
              profileCompleted: user.profileCompleted,
              isProfileCompleted: user.isProfileCompleted
            })
            console.log('🔵 [AuthContext] Setting user state with profileCompleted:', user.profileCompleted)
            const normalizedUser = {
              ...user,
              id: user.id || user.public_id
            }
            setUser(normalizedUser)
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
                  const normalizedUser = {
                    ...profileData.user,
                    id: profileData.user.id || profileData.user.public_id
                  }
                  setUser(normalizedUser)
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
              authProvider: authProvider,
              profileCompleted: false  // Default to false if not found
            }
            
            console.log('[AuthContext] Using fallback userInfo (database fetch failed):', userInfo.email)
            console.log('[AuthContext] ⚠️ WARNING: profileCompleted not loaded from database, defaulting to false');
            const normalizedUser = {
              ...userInfo,
              id: userInfo.id || userInfo.uid
            }
            setUser(normalizedUser)
            setIsAuthenticated(true)
            localStorage.setItem('userInfo', JSON.stringify(normalizedUser))
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
              console.log('🔵 [AuthContext] Restoring guest login');
              const normalizedUser = {
                ...userInfo,
                id: userInfo.id || userInfo.public_id
              }
              setUser(normalizedUser)
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
    console.log('[AuthContext] Storing token and user data:', userData?.email)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('authProvider', 'google')
    const normalizedUser = {
      ...userData,
      id: userData.id || userData.public_id
    }
    setUser(normalizedUser)
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, authPending, setAuthPending, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}
