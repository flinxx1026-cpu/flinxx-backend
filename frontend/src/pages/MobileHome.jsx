import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import React from 'react'
import { FaUser, FaSearch, FaHeart, FaComment, FaTrophy, FaClock } from 'react-icons/fa'
import ProfileModal from '../components/ProfileModal'
import SearchFriendsModal from '../components/SearchFriendsModal'
import SubscriptionsPage from '../components/SubscriptionsPage'
import MatchHistory from '../components/MatchHistory'
import { useUnread } from '../context/UnreadContext'
import { useAuth } from '../context/AuthContext'

/**
 * MobileHome - Mobile Dashboard Component (New Clean UI)
 * Simplified mobile interface with gold/brass theme
 */
const MobileHome = ({ user, onStartChat, onModeChange, localStreamRef, cameraStarted }) => {
  const navigate = useNavigate()
  const { unreadCount } = useUnread()
  const { incomingRequests } = useAuth()
  const [gameMode, setGameMode] = useState('solo')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showFriendsRequestsModal, setShowFriendsRequestsModal] = useState(false)
  const [showMessagesModal, setShowMessagesModal] = useState(false)
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false)
  const [isMatchHistoryOpen, setIsMatchHistoryOpen] = useState(false)

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat(gameMode)
    } else {
      navigate('/matching', { replace: true })
    }
  }

  const handleModeChange = (mode) => {
    setGameMode(mode)
    if (onModeChange) {
      onModeChange(mode)
    }
  }

  // Navigation Handlers
  const handleProfileClick = () => {
    console.log('📱 Profile clicked - opening modal');
    setShowProfileModal(true)
  }

  const handleSearchClick = () => {
    console.log('📱 Search clicked - opening modal');
    setShowSearchModal(true)
  }

  const handleFavoritesClick = () => {
    console.log('📱 Friends & Requests clicked - opening modal');
    setShowFriendsRequestsModal(true)
  }

  const handleMessagesClick = () => {
    console.log('📱 Messages clicked - opening modal');
    setShowMessagesModal(true)
  }

  const handleAwardsClick = () => {
    console.log('📱 Awards clicked - opening modal');
    setShowSubscriptionsModal(true)
  }

  const handleMatchHistoryClick = () => {
    console.log('📱 Match History clicked - opening modal');
    setIsMatchHistoryOpen(true)
  }

  // 🚀 Ref to store video element for polling
  const videoElRef = React.useRef(null);

  const handleVideoRef = React.useCallback((videoElement) => {
    if (!videoElement) return;
    videoElRef.current = videoElement;
    
    // Immediately try to attach if stream is ready
    if (localStreamRef?.current) {
      if (videoElement.srcObject !== localStreamRef.current) {
        console.log('📱 [MOBILE HOME] handleVideoRef: Attaching stream immediately');
        videoElement.srcObject = localStreamRef.current;
        videoElement.muted = true;
      }
      // Always ensure it's playing
      videoElement.play().catch(err => console.warn('📱 [MOBILE HOME] play error:', err));
    }
  }, [localStreamRef]);

  // 🚀 AGGRESSIVE STREAM ATTACHMENT: Ensure stream is attached and video is playing
  React.useEffect(() => {
    let pollInterval = null;

    const ensureStreamPlaying = () => {
      const videoElement = videoElRef.current || document.getElementById('preview-video');
      if (!videoElement || !localStreamRef?.current) return false;
      
      let needsPlay = false;

      // 1. Check if srcObject is correct
      if (videoElement.srcObject !== localStreamRef.current) {
        console.log('📱 [MOBILE HOME] Stream attached via polling');
        videoElement.srcObject = localStreamRef.current;
        videoElement.muted = true;
        needsPlay = true;
      }

      // 2. Check if video is paused when it should be playing
      if (videoElement.paused) {
        console.log('📱 [MOBILE HOME] Video paused, enforcing play');
        needsPlay = true;
      }

      // 3. Play if needed
      if (needsPlay) {
        videoElement.play().catch(err => {
          // Play might fail if DOM not fully interacting, ignore silently to avoid console spam
        });
      }
      return true;
    };

    // Run immediately
    ensureStreamPlaying();

    // Poll every 500ms (keeps checking even after first attach in case stream changes or pauses)
    pollInterval = setInterval(ensureStreamPlaying, 500);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [cameraStarted, localStreamRef]);

  return (
    <div className="mobile-home-container" style={{ background: '#000', margin: 0, padding: 0 }}>
      <style>{`
        html {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #000;
          overflow: hidden;
        }

        body {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #000;
          overflow: hidden;
        }

        #root {
          height: 100%;
          margin: 0;
          overflow: hidden;
        }

        .mobile-home-container {
          width: 100%;
          height: 100dvh;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        /* NAVBAR */
        .top-icons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          padding: 20px 16px 12px;
          width: 100%;
          overflow: visible;
        }

        .top-icons > div {
          position: relative;
          overflow: visible;
        }

        .top-icons .icon {
          width: 40px;
          height: 40px;
          border: 1.5px solid #d4af37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 18px;
        }

        .top-icons .icon:hover {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
          transform: scale(1.05);
        }

        /* Badge styling for mobile icons */
        .top-icons span[style*="backgroundColor: #EF4444"],
        .top-icons span[style*="backgroundColor: rgb(239, 68, 68)"] {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 50 !important;
        }

        /* PROFILE IMAGE */
        .profile {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #d4af37;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile:hover {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }

        /* TITLE */
        .logo {
          text-align: center;
          color: #d4af37;
          font-size: 60px;
          margin: 16px 0 12px 0;
          font-weight: 700;
          font-family: 'Playfair Display', 'Georgia', serif;
          letter-spacing: -1px;
        }

        /* BUTTON */
        .start-video-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 85%;
          max-width: 340px;
          height: 56px;
          margin: 24px auto 32px auto;
          font-size: 18px;
          font-weight: 700;
          color: black;
          background: linear-gradient(to bottom, #fcd34d, #f59e0b);
          border: none;
          border-radius: 50px;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .start-video-btn:hover {
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.6);
          transform: translateY(-2px);
        }

        .start-video-btn:active {
          transform: scale(0.98);
        }

        /* CAMERA ICON */
        .video-icon {
          width: 24px;
          height: 24px;
          background: black;
          mask: url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/camera-video-fill.svg') no-repeat center;
          mask-size: contain;
          -webkit-mask: url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/camera-video-fill.svg') no-repeat center;
          -webkit-mask-size: contain;
        }

        /* VIDEO CONTAINER */
        .video-container {
          position: relative;
          width: 92%;
          max-width: 360px;
          margin: 0 auto 16px auto;
          aspect-ratio: 4 / 5;
          border-radius: 60px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: inset 0 0 0 1px rgba(212, 175, 55, 0.2);
          max-height: calc(100dvh - 280px);
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* YOU LABEL */
        .you-label {
          position: absolute;
          bottom: 24px;
          left: 24px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Inter', sans-serif;
        }

        .you-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        /* SHIMMER LOADING */
        .camera-shimmer {
          position: absolute;
          inset: 0;
          background: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 5;
          overflow: hidden;
        }

        .camera-shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(212, 175, 55, 0.05) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite linear;
        }

        @keyframes shimmer {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }

        .camera-loading-icon {
          width: 40px;
          height: 40px;
          background: #444;
          mask: url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/camera-video.svg') no-repeat center;
          mask-size: contain;
          -webkit-mask: url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/camera-video.svg') no-repeat center;
          -webkit-mask-size: contain;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .camera-loading-text {
          color: #888;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        /* MOBILE SCROLL - Only on mobile devices */
        @media (max-width: 768px) {
          .mobile-home-container {
            height: 100dvh;
            padding-top: 0;
          }

          .top-icons {
            gap: 10px;
          }

          .start-video-btn {
            height: 52px;
            font-size: 16px;
          }
        }

        /* DESKTOP - Optimized for small screens */
        @media (min-width: 769px) {
          .mobile-home-container {
            height: 100vh;
            max-width: 430px;
            margin: 0 auto;
          }

          .top-icons {
            gap: 14px;
          }
        }
      `}</style>

      {/* Top Navigation Icons */}
      <div className="top-icons">
        {/* Profile Picture */}
        {user?.picture ? (
          <img 
            src={user.picture} 
            alt="Profile" 
            className="profile"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <div className="icon" onClick={handleProfileClick} title="Profile">
            <FaUser size={20} />
          </div>
        )}
        
        {/* Search Icon */}
        <div className="icon" onClick={handleSearchClick} title="Search" style={{ cursor: 'pointer' }}>
          <FaSearch size={20} />
        </div>
        
        {/* Heart Icon */}
        <div style={{ position: 'relative', overflow: 'visible' }}>
          <div className="icon" onClick={handleFavoritesClick} title="Likes" style={{ cursor: 'pointer' }}>
            <FaHeart size={20} />
          </div>
          {incomingRequests && incomingRequests.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#EF4444',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                border: '2px solid white',
                zIndex: 50,
                pointerEvents: 'none'
              }}
            >
              {incomingRequests.length > 9 ? '9+' : incomingRequests.length}
            </span>
          )}
        </div>
        
        {/* Message Icon */}
        <div style={{ position: 'relative', overflow: 'visible' }}>
          <div className="icon" onClick={handleMessagesClick} title="Messages" style={{ cursor: 'pointer' }}>
            <FaComment size={20} />
          </div>
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#EF4444',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                border: '2px solid white',
                zIndex: 50,
                pointerEvents: 'none'
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        
        {/* Trophy Icon */}
        <div className="icon" onClick={handleAwardsClick} title="Awards" style={{ cursor: 'pointer' }}>
          <FaTrophy size={20} />
        </div>
        
        {/* Timer Icon */}
        <div className="icon" onClick={handleMatchHistoryClick} title="History" style={{ cursor: 'pointer' }}>
          <FaClock size={20} />
        </div>
      </div>

      {/* Logo */}
      <h1 className="logo">Flinxx</h1>

      {/* Start Chat Button */}
      <button 
        onClick={handleStartChat}
        className="start-video-btn"
      >
        <span className="video-icon"></span>
        Start Video Chat
      </button>

      {/* Video Container */}
      <div className="video-container">
        
        {/* Loading Shimmer (Shows until camera starts) */}
        {(!cameraStarted || !localStreamRef?.current) && (
          <div className="camera-shimmer" style={{ background: '#0a0a0a' }}>
            {/* Blank sleek placeholder */}
          </div>
        )}

        {/* Video Element */}
        <video
          ref={handleVideoRef}
          autoPlay
          muted
          playsInline
          id="preview-video"
          style={{ 
            backgroundColor: 'transparent',
            display: (cameraStarted && localStreamRef?.current) ? 'block' : 'none',
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 10,
            objectFit: 'cover',
            imageRendering: 'auto',
            WebkitTransform: 'scaleX(-1) translateZ(0)',
            transform: 'scaleX(-1)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            filter: 'none',
            WebkitFilter: 'none'
          }}
        />

        {/* User Badge - YOU */}
        <div className="you-label">
          <div className="you-dot"></div>
          YOU
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onOpenPremium={() => {
            setShowProfileModal(false)
            setTimeout(() => setShowSubscriptionsModal(true), 100)
          }}
        />
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <SearchFriendsModal 
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          mode="search"
        />
      )}

      {/* Friends & Requests Modal */}
      {showFriendsRequestsModal && (
        <SearchFriendsModal 
          isOpen={showFriendsRequestsModal}
          onClose={() => setShowFriendsRequestsModal(false)}
          mode="likes"
        />
      )}

      {/* Messages Modal */}
      {showMessagesModal && (
        <SearchFriendsModal 
          isOpen={showMessagesModal}
          onClose={() => setShowMessagesModal(false)}
          mode="message"
        />
      )}

      {/* Subscriptions/Awards Modal */}
      {showSubscriptionsModal && (
        <SubscriptionsPage 
          onClose={() => setShowSubscriptionsModal(false)}
        />
      )}

      {/* Match History Modal */}
      {isMatchHistoryOpen && (
        <MatchHistory 
          isOpen={isMatchHistoryOpen}
          onClose={() => setIsMatchHistoryOpen(false)}
        />
      )}
    </div>
  )
}

export default MobileHome
