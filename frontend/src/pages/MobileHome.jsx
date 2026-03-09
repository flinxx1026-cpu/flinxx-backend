import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import React from 'react'
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

  const handleVideoRef = React.useCallback((videoElement) => {
    if (!videoElement) {
      console.log('📱 [MOBILE HOME] Video element not available');
      return;
    }
    
    if (localStreamRef?.current) {
      console.log('📱 [MOBILE HOME] Attaching stream to video element');
      videoElement.srcObject = localStreamRef.current;
      videoElement.muted = true;
      
      videoElement.play().then(() => {
        console.log('📱 [MOBILE HOME] ✅ Video playing');
      }).catch(err => {
        console.warn('📱 [MOBILE HOME] Play warning:', err.name, err.message);
      });
    }
  }, [localStreamRef]);

  // Attach stream when it becomes available or when camera starts
  React.useEffect(() => {
    const videoElement = document.getElementById('preview-video');
    if (!videoElement) {
      console.log('📱 [MOBILE HOME] useEffect: Video element not found');
      return;
    }
    
    console.log('📱 [MOBILE HOME] useEffect triggered - cameraStarted:', cameraStarted, 'hasStream:', !!localStreamRef?.current);
    
    if (localStreamRef?.current) {
      console.log('📱 [MOBILE HOME] useEffect: Attaching stream to video element');
      videoElement.srcObject = localStreamRef.current;
      videoElement.muted = true;
      
      // Ensure play is called
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('📱 [MOBILE HOME] useEffect: ✅ Video playing');
        }).catch(err => {
          console.warn('📱 [MOBILE HOME] useEffect: Play warning:', err.name, err.message);
        });
      }
    }
  }, [cameraStarted, localStreamRef]);

  return (
    <div className="mobile-home-container" style={{ background: '#000', margin: 0, padding: 0 }}>
      <style>{`
        html {
          margin: 0;
          padding: 0;
          background: #000;
        }

        body {
          margin: 0;
          padding: 0;
          background: #000;
          overflow-x: hidden;
          overflow-y: auto;
          min-height: 100vh;
        }

        .mobile-home-container {
          width: 100%;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100%;
        }

        /* NAVBAR */
        .top-icons {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding-top: 15px;
          width: 100%;
          overflow: visible;
        }

        .top-icons > div {
          position: relative;
          overflow: visible;
        }

        .top-icons .icon {
          width: 42px;
          height: 42px;
          border: 2px solid #f4b400;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .top-icons .icon:hover {
          box-shadow: 0 0 15px rgba(244, 180, 0, 0.6);
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
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #f4b400;
        }

        /* TITLE */
        .logo {
          text-align: center;
          color: #d4af37;
          font-size: 48px;
          margin-top: 10px;
          font-weight: bold;
          margin-bottom: 0;
        }

        /* BUTTON */
        .start-video-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 85%;
          height: 65px;
          margin: 20px auto 25px auto;
          font-size: 20px;
          font-weight: 600;
          color: black;
          background: linear-gradient(180deg, #ffd54f, #f4a300);
          border: none;
          border-radius: 40px;
          box-shadow: 0 0 25px rgba(255, 180, 0, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .start-video-btn:hover {
          box-shadow: 0 0 35px rgba(255, 180, 0, 0.9);
          transform: scale(1.02);
        }

        /* CAMERA ICON */
        .video-icon {
          width: 22px;
          height: 22px;
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
          margin: 40px auto 0 auto;
          aspect-ratio: 3 / 4;
          border-radius: 25px;
          overflow: hidden;
          background: #111;
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* YOU LABEL */
        .you-label {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: #1c1c1c;
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 10;
        }

        .you-dot {
          width: 8px;
          height: 8px;
          background: #00ff66;
          border-radius: 50%;
        }

        /* MOBILE SCROLL - Only on mobile devices */
        @media (max-width: 768px) {
          body {
            min-height: 100vh;
            height: auto;
            overflow-y: auto !important;
          }

          .mobile-home-container {
            min-height: auto;
            overflow: visible;
          }
        }

        /* DESKTOP - No scroll */
        @media (min-width: 769px) {
          body {
            height: 100vh;
            overflow: hidden;
          }

          .mobile-home-container {
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            width: 100% !important;
            max-width: 430px !important;
            margin: 0 auto !important;
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
            <i className="material-icons-round">person</i>
          </div>
        )}
        
        {/* Search Icon */}
        <div className="icon" onClick={handleSearchClick} title="Search" style={{ cursor: 'pointer' }}>
          <i className="material-icons-round">search</i>
        </div>
        
        {/* Heart Icon */}
        <div style={{ position: 'relative', overflow: 'visible' }}>
          <div className="icon" onClick={handleFavoritesClick} title="Likes" style={{ cursor: 'pointer' }}>
            <i className="material-icons-round">favorite</i>
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
            <i className="material-icons-round">mail</i>
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
          <i className="material-icons-round">emoji_events</i>
        </div>
        
        {/* Timer Icon */}
        <div className="icon" onClick={handleMatchHistoryClick} title="History" style={{ cursor: 'pointer' }}>
          <i className="material-icons-round">timer</i>
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
        {/* Loading Spinner - Show ONLY while camera initializing */}
        {!cameraStarted && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            zIndex: 20,
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(212, 175, 55, 0.2)',
              borderTop: '3px solid #d4af37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
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
            backgroundColor: '#000',
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 10,
            objectFit: 'cover',
            imageRendering: 'auto',
            WebkitTransform: 'translateZ(0)',
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
