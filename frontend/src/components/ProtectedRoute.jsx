import React, { useContext, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext)
  const location = useLocation()

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
            width: '64px',
            height: '64px',
            marginBottom: '1rem',
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
