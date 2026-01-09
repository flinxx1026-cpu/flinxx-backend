import React from 'react'
import './LoadingScreen.css'

function LoadingScreen() {
  return (
    <main style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="w-16 h-16 loader-circle animate-spin-loader"></div>
      </div>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: '600', color: 'white' }}>
          Completing your login...
        </h1>
        <p style={{ fontSize: 'clamp(0.875rem, 3vw, 1rem)', fontWeight: '400', color: 'rgba(255, 215, 0, 0.8)' }}>
          Please wait while we set up your session
        </p>
      </div>
    </main>
  )
}

export default LoadingScreen
