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
        console.log('[AuthContext] Initializing authentication...')
        
        // Check for stored JWT token from Google OAuth
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        console.log('[AuthContext] Stored token:', storedToken ? 'Found' : 'Not found')
        console.log('[AuthContext] Stored user:', storedUser ? 'Found' : 'Not found')
        
        // If we have a token, validate it and restore user data
        if (storedToken && storedUser) {
          try {
            const user = JSON.parse(storedUser)
            console.log('[AuthContext] ✅ Restoring Google OAuth user from localStorage:', user.email)
            
            // Optionally validate token with backend
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
            const response = await fetch(`${BACKEND_URL}/api/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.user) {
                console.log('[AuthContext] ✅ Token validated, user restored')
                setUser(data.user)
                setIsAuthenticated(true)
                setIsLoading(false)
                return
              }
            } else {
              console.warn('[AuthContext] ⚠️ Token validation failed:', response.status)
            }
          } catch (err) {
            console.error('[AuthContext] ❌ Error validating token:', err)
          }
        }
        
        // Fall back to checking localStorage user without token validation
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            console.log('[AuthContext] ✅ User loaded from localStorage (no token validation):', user.email)
            setUser(user)
            setIsAuthenticated(true)
            setIsLoading(false)
            return
          } catch (err) {
            console.error('[AuthContext] Error parsing saved user:', err)
          }
        }
        
        // Check if user is returning from redirect
        checkRedirectResult()
        
        // Check Firebase authentication state
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // User is logged in via Firebase (Google or Facebook)
            const authProvider = firebaseUser.providerData[0]?.providerId || 'unknown'
            const userInfo = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              authProvider: authProvider
            }
            
            // Get Firebase ID token for Socket.IO authentication
            try {
              const idToken = await firebaseUser.getIdToken()
              localStorage.setItem('idToken', idToken)
              console.log('🔐 Firebase ID token stored for Socket.IO')
            } catch (error) {
              console.error('❌ Failed to get Firebase ID token:', error)
            }
            
            setUser(userInfo)
            setIsAuthenticated(true)
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            localStorage.setItem('authProvider', authProvider)
          } else {
            // Check for local auth token (legacy support for guest login)
            const authToken = localStorage.getItem('authToken')
            const authProvider = localStorage.getItem('authProvider')
            
            if (authToken && authProvider === 'guest') {
              const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
              setUser(userInfo)
              setIsAuthenticated(true)
            } else {
              // No auth found, redirect to login
              console.log('[AuthContext] No authentication found, user will be redirected to login')
              setUser(null)
              setIsAuthenticated(false)
            }
          }
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
    setUser(userData)
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, authPending, setAuthPending, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}
