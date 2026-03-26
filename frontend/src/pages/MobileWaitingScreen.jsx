import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './MobileWaitingScreen.css'
import AnimatedWaitingText from '../components/AnimatedWaitingText'

/**
 * MobileWaitingScreen - Mobile Waiting/Matching Screen
 * Displays when user is searching for a match
 * Only for mobile devices (< 769px)
 */
const MobileWaitingScreen = ({ onCancel, localStreamRef, cameraStarted }) => {
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(true)
  const videoElementRef = useRef(null) // 📱 Track the video element for stream refresh

  // 📱 MOBILE CAMERA FREEZE FIX: Periodically check if stream tracks are still alive
  // After refreshLocalStream(), the old tracks are stopped but the video element
  // still holds the old srcObject. This effect detects that and re-attaches.
  useEffect(() => {
    if (!cameraStarted) return;

    const checkInterval = setInterval(() => {
      const videoEl = videoElementRef.current;
      if (!videoEl || !localStreamRef?.current) return;

      // Check if current srcObject has ended tracks or is different from localStreamRef
      const currentSrc = videoEl.srcObject;
      const needsReattach = !currentSrc ||
        currentSrc !== localStreamRef.current ||
        currentSrc.getTracks().some(t => t.readyState === 'ended');

      if (needsReattach) {
        console.log('📱 [MOBILE WAITING SCREEN] 🔄 Stream changed or ended — re-attaching fresh stream');
        videoEl.srcObject = localStreamRef.current;
        videoEl.muted = true;
        videoEl.play().catch(err => {
          console.warn('📱 [MOBILE WAITING SCREEN] Re-attach play warning:', err.message);
        });
      }
    }, 300); // Check every 300ms for faster stream change detection on mobile

    return () => clearInterval(checkInterval);
  }, [cameraStarted, localStreamRef]);

  const handleCameraRef = (videoElement) => {
    if (!videoElement) return;
    
    // 📱 Store ref for the periodic stream check
    videoElementRef.current = videoElement;

    console.log('📱 [MOBILE WAITING SCREEN] Video element ref callback fired');
    console.log('📱 [MOBILE WAITING SCREEN] Stream available:', !!(localStreamRef?.current));
    
    const attachStreamWithRetry = () => {
      // Check if stream exists
      if (!localStreamRef || !localStreamRef.current) {
        console.log('📱 [MOBILE WAITING SCREEN] ⏳ Stream not ready yet, retrying in 100ms...');
        setTimeout(attachStreamWithRetry, 100);
        return;
      }
      
      // Only attach if not already attached or tracks ended
      const currentSrc = videoElement.srcObject;
      const needsAttach = !currentSrc ||
        currentSrc !== localStreamRef.current ||
        currentSrc.getTracks().some(t => t.readyState === 'ended');

      if (needsAttach) {
        console.log('📱 [MOBILE WAITING SCREEN] ✅ Attaching stream to video element');
        videoElement.srcObject = localStreamRef.current;
        videoElement.muted = true;
        
        // Try to play
        videoElement.play().catch(err => {
          console.warn('📱 [MOBILE WAITING SCREEN] Play warning:', err.message);
        });
      } else {
        console.log('📱 [MOBILE WAITING SCREEN] Stream already attached, ensuring play()');
        videoElement.play().catch(err => {
          console.warn('📱 [MOBILE WAITING SCREEN] Play warning:', err.message);
        });
      }
    };
    
    // Start the attachment process
    attachStreamWithRetry();
  };

  const handleCancel = () => {
    setIsSearching(false)
    if (onCancel) {
      onCancel()
    } else {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="mobile-waiting-container">
      {/* Content Container */}
      <div className="waiting-content">
        {/* Top Half - Your Camera Section */}
        <div className="camera-section">
          <video
            ref={handleCameraRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#000'
            }}
          />
          {!cameraStarted && (
            <div className="camera-placeholder">
              <span className="material-symbols-outlined">desktop_windows</span>
            </div>
          )}
          <div className="you-badge">
            <span>You</span>
          </div>
        </div>

        {/* Bottom Half - Matching Section */}
        <div className="matching-section">
          <div className="matching-content">
            {/* Animated Icon */}
            <div className="icon-container">
              <div className="glow-pulse"></div>
              <svg className="glass-icon" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="handleGradient" x1="75" x2="110" y1="75" y2="110">
                    <stop offset="0%" stopColor="#A78BFA"></stop>
                    <stop offset="50%" stopColor="#8B5CF6"></stop>
                    <stop offset="100%" stopColor="#7C3AED"></stop>
                  </linearGradient>
                  <linearGradient id="rimGradient" x1="10" x2="90" y1="10" y2="90">
                    <stop offset="0%" stopColor="#F3E8FF"></stop>
                    <stop offset="100%" stopColor="#6D28D9"></stop>
                  </linearGradient>
                  <radialGradient id="glassGradient" cx="50%" cy="50%" r="35">
                    <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.9"></stop>
                    <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.85"></stop>
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.95"></stop>
                  </radialGradient>
                </defs>
                <line stroke="url(#handleGradient)" strokeLinecap="round" strokeWidth="14" x1="72" x2="108" y1="72" y2="108"></line>
                <circle cx="50" cy="50" r="38" stroke="url(#rimGradient)" strokeWidth="6" fill="none"></circle>
                <circle cx="50" cy="50" fill="url(#glassGradient)" r="35"></circle>
                <ellipse cx="35" cy="35" fill="white" fillOpacity="0.35" rx="18" ry="10" transform="rotate(-45 35 35)"></ellipse>
                <circle cx="28" cy="28" fill="white" fillOpacity="0.8" r="3"></circle>
                <path d="M 22 52 A 30 30 0 0 1 52 22" fill="none" stroke="white" strokeLinecap="round" strokeOpacity="0.4" strokeWidth="2"></path>
              </svg>
            </div>

            {/* Text Content */}
            <div className="text-content">
              <AnimatedWaitingText 
                as="h2"
                className="matching-title"
              />
              <p className="matching-subtitle">Matching you with someone nearby</p>
            </div>

            {/* Loading Dots */}
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>

            {/* Cancel Button */}
            <button className="cancel-button" onClick={handleCancel}>
              Cancel Search
            </button>
          </div>
        </div>
      </div>

      {/* Border Accent */}
      <div className="border-accent"></div>
    </div>
  )
}

export default MobileWaitingScreen
