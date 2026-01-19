import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext)

  // Show nothing while loading (prevents flash)
  if (isLoading) {
    return null
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log('🔐 Access denied - User not authenticated. Redirecting to /login')
    return <Navigate to="/login" replace />
  }

  // User is authenticated, allow access
  return children
}
