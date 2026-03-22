import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext)

  // 🔥 CRITICAL: Still initializing auth → wait
  if (isLoading) {
    return null
  }

  // 🔥 CRITICAL: Authenticated but user not hydrated yet → wait
  if (isAuthenticated && !user) {
    return null
  }

  // Not authenticated → redirect
  if (!isAuthenticated) {
    console.log('🔐 Access denied - User not authenticated. Redirecting to /login')
    return <Navigate to="/login" replace />
  }

  // User is authenticated and hydrated, allow access
  return children
}
