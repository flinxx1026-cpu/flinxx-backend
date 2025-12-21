import React, { useContext, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to /auth with location state for reference
  if (!isAuthenticated || !user) {
    console.log('🔐 Access denied - User not authenticated. Redirecting to /auth', { 
      isAuthenticated, 
      user,
      attemptedPath: location.pathname 
    })
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  // Check if user has accepted terms (if they have the termsAccepted field)
  if (user.termsAccepted === false || user.termsAccepted === null || user.termsAccepted === undefined) {
    console.log('🔐 Access denied - User has not accepted terms. Redirecting to /auth', { 
      termsAccepted: user.termsAccepted,
      attemptedPath: location.pathname 
    })
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  console.log('✅ Access granted - User authenticated and terms accepted:', user)
