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
    // First, check if user data exists in localStorage (from Google OAuth)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const googleUser = JSON.parse(savedUser)
        setUser(googleUser)
        setIsAuthenticated(true)
        setIsLoading(false)
        console.log('✅ Google user loaded from localStorage:', googleUser.name)
        return
      } catch (err) {
        console.error('Error parsing saved user:', err)
      }
    }

    // First, check if user is returning from redirect
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
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('authProvider')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, authPending, setAuthPending }}>
      {children}
    </AuthContext.Provider>
  )
}
