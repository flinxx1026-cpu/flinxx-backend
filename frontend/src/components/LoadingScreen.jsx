import React from 'react'
import './LoadingScreen.css'

function LoadingScreen() {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center bg-deep-black text-white font-sans overflow-hidden">
      <div className="mb-8">
        <div className="w-16 h-16 loader-circle animate-spin-loader"></div>
      </div>
      <div className="text-center space-y-3 px-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Completing your login...
        </h1>
        <p className="text-sm md:text-base font-normal text-vibrant-gold/80">
          Please wait while we set up your session
        </p>
      </div>
    </main>
  )
}

export default LoadingScreen
