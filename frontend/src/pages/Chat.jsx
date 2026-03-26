// DEPLOYMENT VERSION: webrtc-stable-streams - Remote stream fix - 2026-01-05
// Last updated: 2026-01-05 - Chat bottom spacing fixes deployed
// BUILD TIMESTAMP: 2026-01-05T10:20:00Z - CHAT LAYOUT FIXES
console.log('🎯 CHAT BUILD: 2026-01-05T10:20:00Z - Chat layout and spacing fixes');
import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDuoSquad } from '../context/DuoSquadContext';
import { useUnreadSafe } from '../context/UnreadContext';
// ✅ DEFERRED: Socket is now imported dynamically to avoid TDZ during lazy loading
// import socket from '../services/socketService';
import socketWrapper from '../services/socketService';
import MobileWaitingScreen from './MobileWaitingScreen';
import MobileHome from './MobileHome';
import { getIceServers, getStunServers, fetchTurnServers, getMediaConstraints, formatTime } from '../utils/webrtcUtils';

import GenderFilterModal from '../components/GenderFilterModal';
import ProfileModal from '../components/ProfileModal';
import FriendRequestPopup from '../components/FriendRequestPopup';
import PremiumPopup from '../components/PremiumPopup';
import SkipLimitPopup from '../components/SkipLimitPopup';
import WarningModal from '../components/WarningModal';
import AnimatedWaitingText from '../components/AnimatedWaitingText';
import MatchHistory from '../components/MatchHistory';
import SearchFriendsModal from '../components/SearchFriendsModal';
import SubscriptionsPage from '../components/SubscriptionsPage';
import TopActions from '../components/TopActions';
import TermsConfirmationModal from '../components/TermsConfirmationModal';
import logo from '../assets/flinxx-logo.svg';
import './Chat.css';

// ✅ CAMERA PANEL - Plain function (no React.memo) to avoid TDZ in production builds
const CameraPanel = ({ videoRef }) => {
  // ✅ CRITICAL: Ref callback should NOT have videoRef in deps - it's never recreated
  // This prevents TDZ issues from dependency updates
  const videoRefCallback = useCallback(el => {
    if (el && videoRef) {
      videoRef.current = el;
    }
  }, []);

  // Log mount
  useEffect(() => {
    console.log('📹 CameraPanel mounted');
    return () => {
      console.log('🔄 CameraPanel unmounted (expected on mobile view)');
    };
  }, []);

  return (
    <main className="w-full relative bg-refined rounded-3xl overflow-hidden shadow-2xl border-2 border-primary group shadow-glow flex flex-col items-center justify-center" style={{ flex: 'none', width: '35%', height: '100%' }}>
      {/* Camera Frame with Video */}
      <div className="camera-frame w-full h-full relative flex items-center justify-center">
        {/* Camera Video - Stable element thanks to module-level component */}
        <video
          ref={videoRefCallback}
          className="camera-video absolute inset-0"
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#000",
            transform: "scaleX(-1)"
          }}
        />
        {/* YOU Badge */}
        <div className="absolute bottom-4 left-4 z-10">
          <div style={{
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }}></span>
            YOU
          </div>
        </div>
      </div>
    </main>
  );
};

// ✅ INTRO SCREEN - Plain function (no React.memo) to avoid TDZ in production builds
const IntroScreen = ({
  user,
  isLoading,
  activeMode,
  setActiveMode,
  openDuoSquad,
  startVideoChat,
  isProfileOpen,
  setIsProfileOpen,
  activeTab,
  setActiveTab,
  isMatchHistoryOpen,
  setIsMatchHistoryOpen,
  unreadCount,
  incomingRequests = [],
  setIncomingRequests,
  localStreamRef,
  cameraStarted,
  children
}) => {
  console.log("Dashboard render");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop version
  if (!isMobile) {
    return (
      <>
      <div className="w-full h-[82vh] flex flex-col lg:flex-row items-end justify-center gap-6 lg:gap-8 relative z-10 p-4 sm:p-6 lg:p-8" style={{ paddingBottom: '0' }}>
        {/* LEFT PANEL - Flinxx Heading + Buttons */}
        <aside className="w-full h-full flex flex-col bg-refined border-2 border-primary rounded-3xl shadow-glow relative transition-all duration-300" style={{ flex: 'none', width: '35%' }}>
          {/* Top Icons Header - Circular icon buttons */}
          <div className="icon-row p-6 sm:p-8">
            {/* Profile Icon - Show profile photo or fallback to user icon */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="icon-btn"
              title="Profile"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              )}
            </button>

            {/* Search Icon */}
            <button
              onClick={() => setActiveTab(activeTab === 'search' ? null : 'search')}
              className="icon-btn"
              title="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            </button>

            {/* Likes Icon with Friend Request Badge */}
            <div style={{ position: 'relative', overflow: 'visible' }}>
              <button
                onClick={() => {
                  setActiveTab(activeTab === 'likes' ? null : 'likes');
                  if (setIncomingRequests) setIncomingRequests([]);
                }}
                className="icon-btn"
                title="Likes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              </button>
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

            {/* Messages Icon */}
            <div style={{ position: 'relative', overflow: 'visible' }}>
              <button
                onClick={() => setActiveTab(activeTab === 'messages' ? null : 'messages')}
                className="icon-btn"
                title="Messages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
              </button>
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

            {/* Trophy/Achievements Icon */}
            <button
              onClick={() => setActiveTab(activeTab === 'trophy' ? null : 'trophy')}
              className="icon-btn"
              title="Achievements"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" /></svg>
            </button>

            {/* History/Timer Icon */}
            <button
              onClick={() => setIsMatchHistoryOpen(!isMatchHistoryOpen)}
              className="icon-btn"
              title="History"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center relative z-10">
            {/* Spacer above logo */}
            <div className="flex-[0.55]"></div>

            {/* Flinxx Title - centered */}
            <h1 className="font-display text-7xl sm:text-8xl font-bold text-primary tracking-wide drop-shadow-sm select-none">
              Flinxx
            </h1>

            {/* Spacer between logo and button */}
            <div className="flex-[0.8]"></div>

            {/* Start Video Chat Button */}
            <button
              onClick={startVideoChat}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 44px',
                borderRadius: '999px',
                backgroundColor: '#d4af37',
                color: '#000',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '0.3px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                whiteSpace: 'nowrap',
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(212, 175, 55, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.3)';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
              <span>{isLoading ? 'Loading...' : 'Start Video Chat'}</span>
            </button>

            {/* Spacer below */}
            <div className="flex-[1.2]"></div>
          </div>
        </aside>

        {/* RIGHT PANEL - Camera Feed (always visible) */}
        {children}
      </div>

      {/* WIDE BOTTOM BANNER */}
      <div className="w-full flex justify-center mt-6 pb-6 px-4 z-20 relative max-w-[1400px] mx-auto">
        {/* Flinxx Plus Promotional Banner */}
        <div 
          onClick={() => setActiveTab && setActiveTab('trophy')}
          className="relative w-full max-w-5xl mx-auto rounded-xl bg-gradient-to-r from-[#0a0f12] via-[#1a1710] to-[#0a0f12] border border-[#2a2410] overflow-hidden p-3 sm:p-4 flex items-center justify-between shadow-2xl group cursor-pointer hover:border-yellow-500/40 transition-colors duration-300"
        >
          
          {/* Subtle background glow effect */}
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

          {/* Left Section */}
          <div className="flex flex-col min-w-[140px] z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-yellow-500 text-sm shadow-black drop-shadow-md">👑</span>
              <span className="text-yellow-500 text-[10px] font-bold tracking-[0.15em] uppercase shadow-black drop-shadow-md">Elite Access</span>
            </div>
            <div className="text-white font-bold text-xl sm:text-2xl leading-none">
              Flinxx <span className="text-yellow-500">Plus</span>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center px-4 z-10">
            <div className="text-white font-semibold text-sm sm:text-base mb-1">
              Upgrade to Flinxx <span className="text-yellow-500 font-bold">Plus</span> 🚀
            </div>
            <div className="text-gray-400 text-[11px] sm:text-xs font-normal">
              Unlimited skips, faster matches & verified badge
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-5 pr-2 z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-white font-bold text-lg sm:text-xl">₹69</span>
              <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium tracking-wide">/ START</span>
            </div>
            <button 
              onClick={() => setActiveTab && setActiveTab('trophy')}
              className="bg-gradient-to-r from-[#e5c058] to-[#d4af37] hover:from-[#f3ce66] hover:to-[#e5c058] text-black font-extrabold py-2 px-4 sm:px-6 rounded-lg text-sm transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Mobile view - return MobileHome
  return (
    <MobileHome
      user={user}
      onStartChat={startVideoChat}
      localStreamRef={localStreamRef}
      cameraStarted={cameraStarted}
    />
  );
};

// ✅ WAITING SCREEN - Plain function (no React.memo) to avoid TDZ in production builds
// This prevents the video ref callback from firing repeatedly, which causes flickering
const WaitingScreen = ({ onCancel, localStreamRef, cameraStarted }) => {
  // Check if mobile device
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ MOBILE VIEW: Show mobile waiting screen on mobile devices
  if (isMobile) {
    return <MobileWaitingScreen onCancel={onCancel} localStreamRef={localStreamRef} cameraStarted={cameraStarted} />;
  }

  // ✅ DESKTOP VIEW: Show desktop waiting screen
  // ✅ Ref callback to attach stream with retry logic
  const handleWaitingVideoRef = useCallback((videoElement) => {
    if (!videoElement) return;

    console.log('📺 [WAITING SCREEN] Video element ref callback fired');
    console.log('📺 [WAITING SCREEN] Stream available:', !!localStreamRef.current);

    const attachStreamWithRetry = () => {
      // Check if stream exists
      if (!localStreamRef.current) {
        console.log('📺 [WAITING SCREEN] ⏳ Stream not ready yet, retrying in 100ms...');
        setTimeout(attachStreamWithRetry, 100);
        return;
      }

      // Only attach if not already attached
      if (videoElement.srcObject !== localStreamRef.current) {
        console.log('📺 [WAITING SCREEN] ✅ Attaching stream to video element');
        videoElement.srcObject = localStreamRef.current;
        videoElement.muted = true;

        // Try to play
        videoElement.play().catch(err => {
          console.warn('📺 [WAITING SCREEN] Play warning:', err.message);
        });
      } else {
        console.log('📺 [WAITING SCREEN] Stream already attached, ensuring play()');
        videoElement.play().catch(err => {
          console.warn('📺 [WAITING SCREEN] Play warning:', err.message);
        });
      }
    };

    // Start the attachment process
    attachStreamWithRetry();
  }, []);  // ✅ EMPTY dependency array - localStreamRef is accessed via closure

  // Force dark mode when visible
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <style>{`
        .gold-glow {
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.15);
        }
        .gold-text-glow {
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }
        .loading-dot {
          animation: dot-pulse 1.4s infinite ease-in-out both;
        }
        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative w-full h-screen bg-black">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {/* Main container */}
        <div className="container mx-auto max-w-7xl z-10 w-full h-[85vh] flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Left panel - Camera preview */}
          <div className="w-full h-full flex flex-col relative group" style={{ flex: 'none', width: '35%' }}>
            <div className="relative w-full h-full border-2 border-primary/60 dark:border-primary/80 rounded-3xl overflow-hidden bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-primary">
              {/* Video element for camera stream - use ref callback to prevent flickering */}
              <video
                ref={handleWaitingVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                  imageRendering: 'auto',
                  WebkitTransform: 'scaleX(-1) translateZ(0)',
                  transform: 'scaleX(-1)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  filter: 'none',
                  WebkitFilter: 'none'
                }}
              />
              <div className="absolute bottom-6 left-6">
                <div className="px-4 py-1.5 rounded-full border border-primary/50 bg-black/60 text-primary text-sm font-medium backdrop-blur-sm shadow-lg">
                  You
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Waiting screen */}
          <div className="w-full h-full flex flex-col relative group" style={{ flex: 'none', width: '35%' }}>
            <div className="relative w-full h-full border-2 border-primary/60 dark:border-primary/80 rounded-3xl overflow-visible bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-primary flex flex-col items-center justify-center text-center space-y-8">

              {/* Animated search icon */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
                <div className="relative z-10 transform transition-transform duration-700 hover:scale-110">
                  <div className="text-6xl md:text-8xl filter drop-shadow-lg animate-bounce-slow" style={{ animationDuration: '3s' }}>
                    🔍
                  </div>
                </div>
              </div>

              {/* Waiting text */}
              <div className="space-y-3">
                <AnimatedWaitingText
                  as="h1"
                  className="text-3xl md:text-4xl font-bold text-primary gold-text-glow tracking-tight"
                />
                <p className="text-primary/70 text-lg md:text-xl font-light">
                  Matching you with someone nearby
                </p>
              </div>

              {/* Loading dots */}
              <div className="flex items-center justify-center space-x-3 py-4">
                <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
                <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
                <div className="w-3 h-3 bg-primary rounded-full loading-dot"></div>
              </div>

              {/* Cancel button */}
              <div className="pt-8 w-full max-w-xs">
                <button
                  onClick={() => {
                    console.log('🛑 [CANCEL] User clicked cancel - calling onCancel handler');
                    if (onCancel) {
                      onCancel();
                    }
                  }}
                  className="w-full group relative px-8 py-3.5 bg-transparent overflow-hidden rounded-full border border-primary/40 hover:border-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <div className="absolute inset-0 w-0 bg-primary/10 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                  <span className="relative text-primary/90 font-semibold tracking-wide group-hover:text-primary">
                    Cancel Search
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading, refreshNotifications, incomingFriendRequest, setIncomingFriendRequest, refreshSentRequests, incomingRequests = [], setIncomingRequests, markPremiumPopupAsSeen, incrementSkipCount, refreshProfile } = useContext(AuthContext) || {};
  const { activeMode, setActiveMode, handleModeChange, openDuoSquad } = useDuoSquad();

  // ✅ CRITICAL: Define BACKEND_URL at component level so sendQuickInvite & sendFriendRequest can use it
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL);

  console.log("RENDER START");

  // ✅ UPDATE LAST SEEN - MUST BE FIRST - Call immediately on mount
  useEffect(() => {
    const userToken = localStorage.getItem("token") || localStorage.getItem("authToken");

    console.log("USER TOKEN:", userToken);

    if (!userToken) {
      console.error("NO USER TOKEN FOUND");
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL);

    fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => {
        console.log("PROFILE STATUS:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("PROFILE SUCCESS", data);
      })
      .catch((err) => {
        console.error("PROFILE ERROR", err);
      });
  }, []);

  // CRITICAL: Terms acceptance state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsCheckComplete, setTermsCheckComplete] = useState(false);

  // CRITICAL: All computed values MUST be in state, never in component body
  // This prevents temporal deadzone errors with minified variables
  const [viewParam, setViewParam] = useState(null);
  const [shouldStartAsIntro, setShouldStartAsIntro] = useState(false);

  // Video and stream state
  const [cameraStarted, setCameraStarted] = useState(false);
  const [isMatchingStarted, setIsMatchingStarted] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [isPartnerFriend, setIsPartnerFriend] = useState(false); // ✅ Track if current partner is already a friend
  const [connectionTime, setConnectionTime] = useState(0);
  const [isSearching, setIsSearching] = useState(false); // 👈 IMPORTANT: Default FALSE
  const [partnerFound, setPartnerFound] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [premiumPopupMessage, setPremiumPopupMessage] = useState(""); // Track message for skip limit
  const [isGenderFilterOpen, setIsGenderFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // For 'Request Sent' and 'Now you are friends' toasts
  const [isMatchHistoryOpen, setIsMatchHistoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // 'notification' | 'message' | null
  const [selectedGender, setSelectedGender] = useState('both');
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [isLocalCameraReady, setIsLocalCameraReady] = useState(false);
  const [streamsReadyTrigger, setStreamsReadyTrigger] = useState(0); // ✅ Triggers component re-render when streams ready

  // ✅ Unified tab state for all side panels
  const [activeTab, setActiveTab] = useState(null); // 'profile' | 'search' | 'likes' | 'messages' | 'trophy' | 'timer' | null

  // ✅ AUTO-OPEN subscriptions modal after payment redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success')) {
      // Auto-open subscriptions modal so SubscriptionsPage can read the query param and show success
      setActiveTab('trophy');
    }
  }, []);

  // 🛡️ REACTIVE RESET FIX: Automatically close the limit popup if daily skip count drops below 120 (e.g. after midnight reset via /api/profile)
  useEffect(() => {
    const count = user?.daily_skip_count ?? 0;
    if (count < 120 && showPremiumPopup && premiumPopupMessage === "skip_limit") {
      console.log('🛡️ [RESET] User skip count is below limit after reset, dismissing Skip Limit Popup dynamically');
      setShowPremiumPopup(false);
      setPremiumPopupMessage("");
    }
  }, [user?.daily_skip_count, showPremiumPopup, premiumPopupMessage]);
  const { unreadCount } = useUnreadSafe();

  // 🚀 QUICK INVITE POPUP STATE - Real-time popup for profile icon invites
  const [quickInvite, setQuickInvite] = useState(null); // { inviteId, senderId, senderName, senderProfileImage }

  // ⚠️ REPORT MODAL STATE
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  // 🛡️ PASSIVE RESET SYNC: Handle cases where the user leaves the page open across midnight IST
  const userRefForReset = useRef(user);
  const lastCheckedDateRef = useRef(
    new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toDateString()
  );

  useEffect(() => {
    userRefForReset.current = user;
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const currentDateStr = nowIST.toDateString();

      // If the IST calendar date has changed since last check, trigger a backend sync
      if (currentDateStr !== lastCheckedDateRef.current) {
        lastCheckedDateRef.current = currentDateStr;
        console.log("🕛 [PASSIVE RESET] Midnight IST date change detected. Auto-syncing with backend...");
        if (typeof refreshProfile === 'function') {
          refreshProfile(); // Calls /api/profile which triggers ensureDailySkipReset
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []); // Empty array ensures this single interval is immortal unless unmounted


  // REPORT HANDLER
  const handleReport = async (reason) => {
    console.log("REPORT CLICKED:", reason);
    setSelectedReason(reason);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      console.log("PARTNER INFO:", partnerInfo);

      // The socket event provides 'partnerId', not 'userId' for the partner
      const reportedUserId = partnerInfo?.partnerId || partnerInfo?.userId || partnerInfo?.id || partnerInfo?.uuid || partnerInfo?.publicId;
      const reportedBy = user?.uuid || user?.id;

      console.log("REPORT PAYLOAD:", { reportedUserId, reason, reportedBy });

      if (!reportedUserId) {
        setToastMessage('Error: Cannot identify partner to report');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/report-user`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reportedBy, reportedUserId, reason })
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setShowReportModal(false);
        setSelectedReason(null);

        if (data.success) {
          setToastMessage('Report submitted successfully');
        } else {
          setToastMessage(data.message || 'Failed to submit report');
        }
      } else {
        setShowReportModal(false);
        setSelectedReason(null);
        setToastMessage('Report submitted (Non-JSON response)');
      }
    } catch (err) {
      console.error('Report API error:', err);
      setShowReportModal(false);
      setSelectedReason(null);
      setToastMessage('Error submitting report');
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // ✅ BUY NOW HANDLER for Skip Limit Popup
  const handleBuyNow = () => {
    console.log('💎 [SKIP LIMIT] Buy Now clicked - opening subscriptions');
    setShowPremiumPopup(false);
    setPremiumPopupMessage("");
    setActiveTab('trophy'); // Open subscriptions page
  };

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Timer Ref to prevent toast race conditions
  const toastTimeoutRef = useRef(null);
  
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 4000);
  }, []);

  // Create a ref to expose camera functions to child components
  const cameraFunctionsRef = useRef(null);

  // Peer connection reference - keep as ref for internal use only
  const peerConnectionRef = useRef(null);

  // ✅ Socket ref - loaded dynamically after component mounts
  const socketRef = useRef(null);

  // CRITICAL: Store current user in a ref - initialize in useEffect only
  const currentUserRef = useRef(null);
  const userIdRef = useRef(null);
  const userLocationRef = useRef(null);  // ✅ Persist detected location across re-renders
  const [currentUser, setCurrentUser] = useState(null);

  // Video and stream refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const sharedVideoRef = useRef(null);  // ✅ React-safe ref for CameraPanel video element
  const localStreamRef = useRef(null);
  const streamRef = useRef(null);  // 🔥 Keep track of stream for cleanup
  const partnerSocketIdRef = useRef(null);  // CRITICAL: Store partner socket ID for sending offers/answers
  const skipInFlightRef = useRef(false);
  const lastSkipTimeRef = useRef(0);  // 📱 MOBILE FIX: Debounce skip button (1200ms) to prevent camera freeze
  const searchCancelledRef = useRef(false);  // 🛑 Tracks if user explicitly cancelled search
  const requeueTimerRef = useRef(null);      // 🛑 Tracks pending requeue setTimeout so it can be cleared
  const connectionScoreRef = useRef(100);    // 📡 Global Connection Score

  // Monitor guest session timeout
  const guestSessionTimerRef = useRef(null);
  const [showGuestTimeoutModal, setShowGuestTimeoutModal] = useState(false);

  // 🧪 DEBUG TEST - Check if both "RENDER START" and "HOOKS DONE" appear in console
  console.log("HOOKS DONE");



  // ✅ LAZY LOAD SOCKET - Dynamically import socket to avoid TDZ during module initialization
  useEffect(() => {
    const loadSocket = async () => {
      try {
        const socketModule = await import('../services/socketService');
        socketRef.current = socketModule.default;
        console.log('✅ Socket module loaded');

        // 🔥 CRITICAL: Explicitly call connect() to trigger socket.io initialization
        console.log('🔌 TRIGGERING SOCKET INITIALIZATION via connect()...');
        const actualSocket = socketRef.current.connect();

        // Check if we got a real socket or a mock
        const isMock = !actualSocket?.io?.engine;
        console.log('🔌 Socket initialization result:', {
          hasSocket: !!actualSocket,
          isMock: isMock,
          id: actualSocket?.id || 'null',
          connected: actualSocket?.connected || false,
          transport: actualSocket?.io?.engine?.transport?.name || 'unknown'
        });

        if (isMock) {
          console.error('❌ WARNING: Got mock socket instead of real socket!');
        }

        // Give socket time to connect
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterWait = socketRef.current.getSocket();
        console.log('✅ Socket state after 500ms wait:', {
          connected: afterWait?.connected || false,
          id: afterWait?.id || 'null'
        });
      } catch (error) {
        console.error('❌ Failed to load socket:', error.message);
        console.error('❌ Stack:', error.stack);
        // Create a mock socket for safety
        socketRef.current = {
          on: () => { },
          off: () => { },
          emit: () => { },
          id: null,
          connected: false
        };
      }
    };

    loadSocket();
  }, []);

  // ✅ DEFINE startCamera as a proper function (not inside useEffect)
  // This allows it to be used by both the useEffect and startVideoChat
  const startCamera = useCallback(async () => {
    try {
      // ✅ STEP 1: Stream ko useRef me lock karo - sirf pehli baar
      if (!localStreamRef.current) {
        const isMobileDevice = window.innerWidth < 769;
        console.log('📹 [CAMERA INIT] Requesting camera permissions from browser...', isMobileDevice ? '(MOBILE - fast path)' : '(DESKTOP)');

        // 🚀 MOBILE OPTIMIZATION: Use lower constraints for faster hardware init
        const videoConstraints = isMobileDevice
          ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
          : { width: { ideal: 1280 }, height: { ideal: 720 } };

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: true
        });

        localStreamRef.current = stream;
        streamRef.current = stream;
        console.log('📹 [CAMERA INIT] ✅ Camera stream obtained');
        console.log('📹 [CAMERA INIT] Active tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));

        // 🚀 MOBILE: Set cameraStarted IMMEDIATELY after stream is obtained
        // Don't wait for video element attachment - MobileHome will handle that
        if (isMobileDevice) {
          console.log('📱 [CAMERA INIT] Mobile - setting cameraStarted=true IMMEDIATELY after stream obtained');
          setCameraStarted(true);
          setIsLocalCameraReady(true);
          setStreamsReadyTrigger(prev => prev + 1);
          return;
        }
      } else {
        console.log('📹 [CAMERA INIT] Stream already exists - reusing existing stream');
        // 🚀 If stream already exists on mobile, just mark ready immediately
        if (window.innerWidth < 769) {
          setCameraStarted(true);
          setIsLocalCameraReady(true);
          setStreamsReadyTrigger(prev => prev + 1);
          return;
        }
      }

      // ✅ Wait a tick to ensure ref is attached
      await new Promise(resolve => setTimeout(resolve, 0));

      // ✅ Desktop: Attach stream to video element
      // Wait for sharedVideoRef to be available (CameraPanel must render first)
      let attempts = 0;
      const attachStream = () => {
        if (sharedVideoRef.current && localStreamRef.current) {
          console.log('📹 [CAMERA INIT] Attaching stream to video element...');
          sharedVideoRef.current.srcObject = localStreamRef.current;
          sharedVideoRef.current.muted = true;

          console.log('📹 [CAMERA INIT] Calling play() on video element');

          // Call play() directly without waiting for metadata
          sharedVideoRef.current.play()
            .then(() => {
              console.log('📹 [CAMERA INIT] ✅ Video stream is now playing');
              setCameraStarted(true);
              setIsLocalCameraReady(true);
              setStreamsReadyTrigger(prev => prev + 1); // ✅ Trigger video render
            })
            .catch(playErr => {
              console.warn('📹 [CAMERA INIT] ⚠️ Play error (stream may still display):', playErr.name, playErr.message);
              // Still mark as ready - stream might display even with play error
              setCameraStarted(true);
              setIsLocalCameraReady(true);
              setStreamsReadyTrigger(prev => prev + 1); // ✅ Trigger video render
            });
        } else if (attempts < 50) {
          // Retry waiting for ref to be available
          attempts++;
          setTimeout(attachStream, 50);
        } else {
          console.error('📹 [CAMERA INIT] ❌ Video ref never became available');
          console.error('   sharedVideoRef:', !!sharedVideoRef.current);
          console.error('   localStreamRef.current:', !!localStreamRef.current);
          setIsLocalCameraReady(true);
          setStreamsReadyTrigger(prev => prev + 1); // ✅ Trigger video render
        }
      };

      attachStream();
    } catch (err) {
      console.error('📹 [CAMERA INIT] ❌ Error:', err.name, err.message);

      if (err.name === 'NotAllowedError') {
        console.error('   → User denied camera permission');
      } else if (err.name === 'NotFoundError') {
        console.error('   → No camera device found');
      } else if (err.name === 'NotReadableError') {
        console.error('   → Camera is in use by another app');
      }

      setIsLocalCameraReady(true);
    }
  }, []);

  // 📱 MOBILE CAMERA FREEZE FIX: Properly stop old stream + get fresh camera
  // This is called on every skip/disconnect on mobile to prevent the local camera from freezing
  const refreshLocalStream = useCallback(async () => {
    const isMobileDevice = window.innerWidth < 769;
    if (!isMobileDevice) return; // Desktop reuses streams fine

    console.log('📱 [REFRESH STREAM] Starting fresh camera acquisition for mobile...');

    try {
      // STEP 1: Save old stream reference, do NOT touch video elements yet!
      // Keeping the old srcObject on video elements prevents the black flash.
      // The browser will show the last frozen frame instead of black.
      const oldStream = localStreamRef.current;
      const oldStreamRef = streamRef.current;

      // STEP 2: Stop ALL tracks on the old stream to release the camera hardware
      // Video element still holds the old srcObject (shows last frozen frame, NOT black)
      if (oldStream) {
        const oldTracks = oldStream.getTracks();
        console.log(`📱 [REFRESH STREAM] Stopping ${oldTracks.length} old tracks`);
        oldTracks.forEach(track => {
          track.stop();
          console.log(`📱 [REFRESH STREAM] Stopped track: ${track.kind} (${track.id.substring(0, 8)})`);
        });
      }
      if (oldStreamRef && oldStreamRef !== oldStream) {
        oldStreamRef.getTracks().forEach(track => track.stop());
      }

      // STEP 3: Brief delay to let mobile browser release camera hardware
      await new Promise(resolve => setTimeout(resolve, 200));

      // STEP 4: Get a completely fresh camera stream
      console.log('📱 [REFRESH STREAM] Requesting fresh getUserMedia...');
      let freshStream;
      try {
        freshStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
      } catch (firstErr) {
        console.warn('📱 [REFRESH STREAM] First attempt failed, retrying after 500ms:', firstErr.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        freshStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
      }

      // STEP 5: Verify tracks are live
      const liveTracks = freshStream.getTracks().filter(t => t.readyState === 'live');
      if (liveTracks.length === 0) {
        console.error('📱 [REFRESH STREAM] ❌ All tracks dead! Retrying...');
        freshStream.getTracks().forEach(t => t.stop());
        await new Promise(resolve => setTimeout(resolve, 500));
        freshStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
      }

      // STEP 6: ATOMIC SWAP — Update refs first, then video elements
      // This ensures minimum time between old stream dying and new stream showing
      localStreamRef.current = freshStream;
      streamRef.current = freshStream;
      console.log('📱 [REFRESH STREAM] ✅ Fresh stream obtained:', freshStream.getTracks().map(t => ({ kind: t.kind, state: t.readyState })));

      // STEP 7: Swap srcObject on video element (old frozen frame → new live stream)
      // No black flash because we go directly from frozen → live
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = freshStream;
        localVideoRef.current.muted = true;
        try {
          await localVideoRef.current.play();
          console.log('📱 [REFRESH STREAM] ✅ Video playing after swap');
        } catch (playErr) {
          console.warn('📱 [REFRESH STREAM] Play warning:', playErr.message);
          setTimeout(() => {
            localVideoRef.current?.play().catch(() => {});
          }, 200);
        }
      }

      // STEP 8: Trigger re-render so MobileWaitingScreen picks up new stream
      setStreamsReadyTrigger(prev => prev + 1);
      console.log('📱 [REFRESH STREAM] ✅ Complete - zero black flash swap');

    } catch (err) {
      console.error('📱 [REFRESH STREAM] ❌ Failed to refresh camera:', err.message);
    }
  }, []);

  // ✅ CAMERA INIT + LOCATION DETECTION - Runs on dashboard mount
  // NOTE: Auth validation is handled by ProtectedChatRoute - NO NEED to duplicate here
  useEffect(() => {
    let isMounted = true;

    startCamera();

    // ✅ LOCATION DETECTION via IP (silent, no browser permission popup needed)
    const detectAndSaveLocation = async () => {
      try {
        let detectedLocation = null;

        // Try primary API (ipapi.co — HTTPS, avoids Mixed Content errors)
        try {
          const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
          const data = await response.json();
          console.log('📍 [LOCATION] ipapi.co response:', JSON.stringify(data));
          if (data.city && data.region) {
            detectedLocation = `${data.city}, ${data.region}`;
          } else if (data.city && data.country_name) {
            detectedLocation = `${data.city}, ${data.country_name}`;
          }
        } catch (e) {
          console.log('📍 [LOCATION] Primary API (ipapi.co) failed:', e.message);
        }

        // Fallback: ipinfo.io (HTTPS, free tier)
        if (!detectedLocation) {
          try {
            const response3 = await fetch('https://ipinfo.io/json', { signal: AbortSignal.timeout(5000) });
            const data3 = await response3.json();
            console.log('📍 [LOCATION] ipinfo.io response:', JSON.stringify(data3));
            if (data3.city && data3.region) {
              detectedLocation = `${data3.city}, ${data3.region}`;
            }
          } catch (e3) {
            console.log('📍 [LOCATION] ipinfo.io also failed:', e3.message);
          }
        }

        if (!isMounted || !detectedLocation) return;
        console.log('📍 [LOCATION] Detected via IP:', detectedLocation);

        // ✅ Store in ref so it survives re-renders and user effect overwrites
        userLocationRef.current = detectedLocation;

        // Save to currentUser state
        setCurrentUser(prev => prev ? { ...prev, location: detectedLocation } : prev);

        // ✅ Also update localStorage so it's fresh on next page load
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            parsed.location = detectedLocation;
            localStorage.setItem('user', JSON.stringify(parsed));
            console.log('📍 [LOCATION] Updated localStorage user location:', detectedLocation);
          }
        } catch (lsErr) { /* ignore */ }

        // Save to backend
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token) {
          const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL);
          fetch(`${API_BASE_URL}/api/users/update-location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ location: detectedLocation })
          }).then(res => {
            console.log('📍 [LOCATION] Saved to backend, status:', res.status);
          }).catch(err => {
            console.warn('📍 [LOCATION] Backend save error:', err);
          });
        }
      } catch (err) {
        console.log('📍 [LOCATION] Detection error:', err);
      }
    };

    detectAndSaveLocation();

    return () => {
      isMounted = false;
    };
  }, [startCamera]);

  // ✅ CHECK IF PARTNER IS ALREADY A FRIEND when partnerInfo changes
  useEffect(() => {
    const checkIfPartnerIsFriend = async () => {
      if (!partnerInfo || !user?.uuid) {
        setIsPartnerFriend(false);
        return;
      }

      const partnerPublicId = partnerInfo?.partnerId || partnerInfo?.id || partnerInfo?.uuid || partnerInfo?.publicId;
      if (!partnerPublicId) {
        setIsPartnerFriend(false);
        return;
      }

      try {
        const { getFriends } = await import('../services/api');
        const friends = await getFriends(user.uuid);
        
        if (Array.isArray(friends)) {
          const isFriend = friends.some(f => 
            f.friendId === partnerPublicId || 
            f.uuid === partnerPublicId || 
            f.publicId === partnerPublicId ||
            f.id === partnerPublicId
          );
          setIsPartnerFriend(isFriend);
          console.log(`👥 [FRIEND CHECK] Partner ${partnerPublicId?.substring(0, 8)}... is ${isFriend ? 'ALREADY a friend ✅' : 'NOT a friend'}`);
        }
      } catch (err) {
        console.warn('⚠️ [FRIEND CHECK] Error checking friend status:', err.message);
        setIsPartnerFriend(false);
      }
    };

    checkIfPartnerIsFriend();
  }, [partnerInfo, user?.uuid]);

  // ✅ AUTO-DISMISS friend request popup if partner is already a friend
  // This prevents the popup from showing when already-friends reconnect
  useEffect(() => {
    if (isPartnerFriend && incomingFriendRequest) {
      console.log('🛡️ [FRIEND CHECK] Partner is already a friend — auto-dismissing friend request popup');
      setIncomingFriendRequest(null);
    }
  }, [isPartnerFriend, incomingFriendRequest, setIncomingFriendRequest]);

  // ✅ GLOBAL FRIEND ACCEPTED LISTENER - Shows "Now you are friends" toast for BOTH users
  // AuthContext listens for 'friend_request_accepted' socket event and dispatches
  // a 'global_friend_accepted' window event. This useEffect catches that event
  // so the SENDER also sees the toast (not just the receiver who clicked Accept).
  useEffect(() => {
    const handleGlobalFriendAccepted = (event) => {
      console.log('🎉🎉🎉 [Chat.jsx] global_friend_accepted window event received!', event.detail);
      setIsPartnerFriend(true);
      showToast('Now you are friends! 🎉');
    };

    window.addEventListener('global_friend_accepted', handleGlobalFriendAccepted);
    return () => {
      window.removeEventListener('global_friend_accepted', handleGlobalFriendAccepted);
    };
  }, []);

  // ✅ Attach local stream to localVideoRef when in video chat mode
  useEffect(() => {
    console.log('📹 [LOCAL STREAM ATTACH] Checking conditions:', {
      partnerFound,
      localVideoRefExists: !!localVideoRef.current,
      localStreamRefExists: !!localStreamRef.current,
      localVideoInDOM: localVideoRef.current?.parentElement ? 'YES' : 'NO',
      localVideoDisplay: localVideoRef.current?.style?.display,
      localVideoSize: localVideoRef.current ? {
        width: localVideoRef.current.offsetWidth,
        height: localVideoRef.current.offsetHeight
      } : null
    });

    if (partnerFound && localVideoRef.current && localStreamRef.current) {
      console.log('📹 [VIDEO CHAT] Attaching local stream to localVideoRef');

      if (localVideoRef.current.srcObject !== localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.muted = true;

        console.log('📹 [VIDEO CHAT] srcObject set, stream has', localStreamRef.current.getTracks().length, 'tracks');

        localVideoRef.current.play().catch(err => {
          console.warn('📹 [VIDEO CHAT] Local video play warning:', err.message);
        });

        console.log('📹 [VIDEO CHAT] ✅ Local stream attached to localVideoRef');
      } else {
        console.log('📹 [VIDEO CHAT] Stream already attached');
      }
    }
  }, [partnerFound]);

  // ✅ Monitor if stream gets lost (but only log, don't re-attach)
  useEffect(() => {
    if (!partnerFound || !localVideoRef.current) return;

    const interval = setInterval(() => {
      if (localVideoRef.current?.srcObject === null) {
        console.warn('⚠️ [MONITOR] Local video srcObject is null - memoization may not be working');
      }

      if (localStreamRef.current) {
        const tracks = localStreamRef.current.getTracks();
        const allEnabled = tracks.every(t => t.enabled && t.readyState === 'live');
        if (!allEnabled) {
          console.warn('⚠️ [MONITOR] Some local tracks are disabled or ended:',
            tracks.map(t => ({ kind: t.kind, enabled: t.enabled, state: t.readyState }))
          );
        }
      }
    }, 3000); // Check every 3 seconds (less frequent)

    return () => clearInterval(interval);
  }, [partnerFound]);

  // ✅ Debug remote video ref
  useEffect(() => {
    console.log('📹 [REMOTE STREAM DEBUG] Remote video ref status:', {
      remoteVideoRefExists: !!remoteVideoRef.current,
      remoteVideoInDOM: remoteVideoRef.current?.parentElement ? 'YES' : 'NO',
      remoteVideoDisplay: remoteVideoRef.current?.style?.display,
      remoteVideoSize: remoteVideoRef.current ? {
        width: remoteVideoRef.current.offsetWidth,
        height: remoteVideoRef.current.offsetHeight
      } : null,
      remoteVideoSrcObject: remoteVideoRef.current?.srcObject ? 'HAS STREAM' : 'NO STREAM'
    });
  }, [partnerFound]);
  console.log('🎯 CHAT COMPONENT LOADED - BUILD: 895cedd (temporal deadzone fix - move hooks to top)');

  // ✅ Camera should ALWAYS be available - removed blocking logic
  // The camera feeds the IntroScreen which is always mounted in background
  // WaitingScreen overlays on top and the camera shows through
  useEffect(() => {
    console.log('STATE:', { isSearching, partnerFound });
    console.log('✅ [CAMERA] Camera available for all screens');
  }, [isSearching, partnerFound]);

  // Check terms acceptance when component mounts - MUST BE FIRST useEffect
  useEffect(() => {
    console.log('🔐 [TERMS CHECK] Checking if terms are accepted...');

    try {
      const termsAccepted = localStorage.getItem('termsAccepted') === 'true';
      console.log('📋 [TERMS CHECK] termsAccepted from localStorage:', termsAccepted);

      if (!termsAccepted) {
        console.log('⚠️ [TERMS CHECK] User has not accepted terms - showing modal');
        setShowTermsModal(true);
      } else {
        console.log('✅ [TERMS CHECK] User has accepted terms - allowing access');
        setTermsCheckComplete(true);
      }
    } catch (error) {
      console.error('❌ [TERMS CHECK] Error checking terms:', error);
      // Allow access on error
      setTermsCheckComplete(true);
    }
  }, []);

  // Handle terms acceptance from modal on dashboard
  const handleDashboardTermsAccept = () => {
    console.log('✅ User accepted terms on dashboard');
    localStorage.setItem('termsAccepted', 'true');
    setShowTermsModal(false);
    setTermsCheckComplete(true);
  }

  // Handle terms cancellation - redirect to login
  const handleDashboardTermsCancel = () => {
    console.log('❌ User cancelled terms on dashboard - redirecting to login');
    setShowTermsModal(false);
    navigate('/login', { replace: true });
  }

  // Initialize view params from location ONLY in useEffect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    setViewParam(view);
    setShouldStartAsIntro(view === 'home');

    console.log('[Chat] Location search params:', location.search);
    console.log('[Chat] view parameter:', view);
    console.log('[Chat] shouldStartAsIntro:', view === 'home');
  }, [location.search]);

  // CRITICAL: Initialize currentUser from context ONLY in useEffect
  // This prevents temporal deadzone errors with minified variables
  useEffect(() => {
    const userToUse = user || {
      googleId: "guest_" + Math.random().toString(36).substring(2, 9),
      name: "Guest User",
      email: "guest@flinxx.local",
      picture: null
    };

    // ✅ Preserve detected location when user context changes
    setCurrentUser(prev => {
      const preserved = prev?.location || userLocationRef.current || null;
      return { ...userToUse, location: userToUse.location || preserved };
    });

    if (!userIdRef.current) {
      // ✅ Use UUID only - NEVER fallback to googleId or any other field
      userIdRef.current = userToUse.uuid;
      if (!userIdRef.current || userIdRef.current.length !== 36) {
        console.error('❌ CRITICAL: Invalid or missing UUID from localStorage:', userIdRef.current);
      } else {
        console.log('🔐 USER UUID INITIALIZED (ONE TIME):', userIdRef.current);
      }
    }
    if (!currentUserRef.current) {
      currentUserRef.current = userToUse;
    }
  }, [user]);

  // Monitor guest session timeout
  useEffect(() => {
    // Skip guest session monitoring since authentication is removed
    return () => {
      if (guestSessionTimerRef.current) {
        clearInterval(guestSessionTimerRef.current);
      }
    };
  }, []);

  // Monitor activeMode state changes for debugging
  useEffect(() => {
    console.log(`👁️ [ACTIVE MODE MONITOR] Current activeMode: "${activeMode}"`);
  }, [activeMode]);

  // Log ref initialization
  useEffect(() => {
    console.log('📌 Refs initialized:');
    console.log('   localVideoRef.current exists:', !!localVideoRef.current);
    console.log('   localVideoRef.current in DOM:', localVideoRef.current?.parentElement ? 'YES' : 'NO');
    console.log('   remoteVideoRef.current exists:', !!remoteVideoRef.current);
    console.log('   localStreamRef.current exists:', !!localStreamRef.current);
  }, []);

  // ========================================
  // CRITICAL: Camera attachment happens ONLY in startPreview() useEffect
  // Do NOT re-attach in hasPartner useEffect - causes DOM thrashing
  // ========================================

  // CRITICAL: Define functions AFTER state declarations to avoid TDZ
  // Expose camera re-initialization function that can be called from ProfileModal
  const reinitializeCamera = useCallback(async () => {
    console.log('\n\n🎥 ===== CAMERA RE-INITIALIZATION STARTED =====');
    console.log('🎥 [REINIT] Camera re-initialization requested');
    console.log('🎥 [REINIT] Current state:');
    console.log('  - localStreamRef.current exists:', !!localStreamRef.current);
    console.log('  - localVideoRef.current exists:', !!localVideoRef.current);
    console.log('  - cameraStarted:', cameraStarted);

    try {
      // CRITICAL: Ensure video element is in document
      if (!localVideoRef.current) {
        console.error('🎥 [REINIT] ❌ CRITICAL: localVideoRef.current is null/undefined - video element not in DOM');
        return false;
      }

      // Check if video element is actually mounted
      if (!localVideoRef.current.parentElement) {
        console.error('🎥 [REINIT] ❌ CRITICAL: Video element is not attached to DOM');
        return false;
      }

      console.log('🎥 [REINIT] ✓ Video element exists in DOM');

      // Check if we already have a stream
      if (localStreamRef.current) {
        console.log('🎥 [REINIT] Stream exists, checking if tracks are active...');
        const tracks = localStreamRef.current.getTracks();
        console.log('🎥 [REINIT] Stream has', tracks.length, 'tracks');
        tracks.forEach((track, i) => {
          console.log(`  Track ${i}:`, { kind: track.kind, enabled: track.enabled, readyState: track.readyState });
        });

        if (tracks.length === 0) {
          console.warn('🎥 [REINIT] ⚠️ Stream exists but has no active tracks - will request new stream');
          localStreamRef.current = null;
        } else {
          console.log('🎥 [REINIT] ✓ Stream has active tracks, reattaching to video element');
          localVideoRef.current.srcObject = localStreamRef.current;
          localVideoRef.current.muted = true;

          console.log('🎥 [REINIT] srcObject set, waiting for play()...');

          try {
            const playPromise = localVideoRef.current.play();
            if (playPromise !== undefined) {
              await playPromise;
            }
            console.log('🎥 [REINIT] ✅ Camera preview reattached and playing');
            console.log('🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====\n\n');
            return true;
          } catch (err) {
            console.error('🎥 [REINIT] ❌ Error playing video:', err);
            console.error('🎥 [REINIT] Error name:', err.name);
            console.error('🎥 [REINIT] Error message:', err.message);
            return false;
          }
        }
      }

      // Request new stream if none exists
      console.log('🎥 [REINIT] No existing stream or tracks inactive, requesting new preview stream');
      const previewStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true
      });

      localStreamRef.current = previewStream;
      console.log('🎥 [REINIT] ✅ New camera stream obtained:', previewStream);
      console.log('🎥 [REINIT] New stream tracks:', previewStream.getTracks().map(t => ({ kind: t.kind, id: t.id })));

      localVideoRef.current.srcObject = previewStream;
      localVideoRef.current.muted = true;

      console.log('🎥 [REINIT] srcObject set to new stream, calling play()...');

      // Use requestAnimationFrame to ensure video element is ready
      requestAnimationFrame(() => {
        localVideoRef.current?.play().catch(err => {
          console.log('🎥 [REINIT] Video play blocked:', err);
        });
        console.log('🎥 [REINIT] ✅ New camera preview play command dispatched');
      });

      setCameraStarted(true);
      console.log('🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====\n\n');
      return true;
    } catch (err) {
      console.error('🎥 [REINIT] ❌ Error reinitializing camera:', err);
      console.error('🎥 [REINIT] Error name:', err.name);
      console.error('🎥 [REINIT] Error message:', err.message);
      console.error('🎥 ===== CAMERA RE-INITIALIZATION FAILED =====\n\n');
      return false;
    }
  }, [cameraStarted]); // Now depends on cameraStarted which is declared above

  // Assign reinitializeCamera to ref so it can be accessed from ProfileModal
  useEffect(() => {
    cameraFunctionsRef.current = {
      reinitializeCamera
    };
  }, [reinitializeCamera]);

  // Timer effect for connection time
  useEffect(() => {
    if (!isConnected) return;

    const timer = setInterval(() => {
      setConnectionTime(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnected]);

  // When a partner is found, transition from home screen to video chat screen
  useEffect(() => {
    if (hasPartner && cameraStarted) {
      console.log('🎬 [PARTNER FOUND] Transitioning to video chat screen');
      // VideoChatScreen will now render because hasPartner is true
    }
  }, [hasPartner, cameraStarted]);

  // ✅ ONE-TIME VERIFICATION: Check after 1 second that stream is properly attached
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sharedVideoRef.current && localStreamRef.current) {
        console.log('📹 [VERIFY] Stream attached:', {
          srcObject: !!sharedVideoRef.current.srcObject,
          paused: sharedVideoRef.current.paused,
          tracks: localStreamRef.current.getTracks().length,
          readyState: sharedVideoRef.current.readyState,
          networkState: sharedVideoRef.current.networkState
        });

        // If not playing, try to play
        if (sharedVideoRef.current.paused) {
          console.log('📹 [VERIFY] Video is paused, attempting play...');
          sharedVideoRef.current.play().catch(err => {
            console.warn('📹 [VERIFY] Play failed:', err.message);
          });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ========================================
  // CRITICAL: Buffer for ICE candidates that arrive before peer connection
  // ========================================
  const iceCandidateBufferRef = useRef([]);

  // CRITICAL: Define createPeerConnection BEFORE socket listeners
  // This function is called inside socket event handlers
  // Must be declared before the socket listener setup to avoid TDZ error
  const createPeerConnection = async () => {
    console.log('🔧 createPeerConnection called');
    console.log('   Current localStreamRef:', localStreamRef.current);

    // ✅ CRITICAL FIX: If local stream is missing, attempt to reacquire it
    if (!localStreamRef.current) {
      console.warn('⚠️ CRITICAL: localStreamRef.current is null - attempting to reacquire camera stream');
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640, max: 640 }, height: { ideal: 480, max: 480 }, frameRate: { ideal: 24, max: 30 } },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
        localStreamRef.current = newStream;

        // Attach to video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
          localVideoRef.current.muted = true;
          try {
            await localVideoRef.current.play();
          } catch (playErr) {
            console.warn('⚠️ Play error during reacquisition:', playErr);
          }
        }

        console.log('✅ LOCAL STREAM RE-ACQUIRED SUCCESSFULLY');
        console.log('   Tracks:', newStream.getTracks().map(t => ({ kind: t.kind, id: t.id })));
      } catch (reacqErr) {
        console.error('❌ FATAL: Could not reacquire camera stream:', reacqErr.message);
        throw new Error('Cannot proceed: local camera stream unavailable - ' + reacqErr.message);
      }
    }


    // ✅ PHASE 1: Start with STUN-only for fast P2P (TURN added on ICE failure)
    const iceServers = getStunServers();
    console.log('🧊 Phase 1: STUN-only P2P mode');

    const peerConnection = new RTCPeerConnection({
      iceServers,
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      iceCandidatePoolSize: 4
    });
    peerConnectionRef.current = peerConnection;
    console.log('✅ RTCPeerConnection created — STUN-only P2P');

    // Track ICE restart attempts (max 2)
    peerConnection._iceRestartCount = 0;
    const MAX_ICE_RESTARTS = 2;

    // ✅ Initialize remote stream immediately (will be populated by ontrack events)
    peerConnectionRef.current._remoteStream = new MediaStream();
    console.log('✅ Remote MediaStream initialized, ID:', peerConnectionRef.current._remoteStream.id);

    // ─── SILENT HEALTH MONITOR (15 SECONDS AUTO SKIP) ───
    let issueTimer = null;
    let lastVideoPackets = 0;
    let lastAudioPackets = 0;
    let connectionStartTime = Date.now();
    let isSkipping = false;
    let healthInterval = null;
    
    // Silent auto skip mimicking Omegle's backend-enforced clean skip
    const silentAutoSkip = async () => {
      console.log('🔇 [HEALTH MONITOR] Connection failed to recover within 15s, silently auto-skipping');
      
      // Prevent other skips or user interactions
      if (partnerSocketIdRef.current && socketRef.current) {
        socketRef.current.emit('skip_user', {
          partnerSocketId: partnerSocketIdRef.current,
          userId: userIdRef.current
        });
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      setHasPartner(false);
      setPartnerFound(false);
      setIsConnected(false);
      setPartnerInfo(null);
      setMessages([]);
      setConnectionTime(0);
      if (setIncomingFriendRequest) setIncomingFriendRequest(null);
      
      if (document.visibilityState === 'hidden' || searchCancelledRef.current) {
         setIsSearching(false);
         return;
      }

      // ✅ Show waiting screen IMMEDIATELY to prevent dashboard flash
      setIsSearching(true);

      // 📱 MOBILE CAMERA FREEZE FIX: Refresh local stream before re-queuing
      if (window.innerWidth < 769) {
        try {
          await refreshLocalStream();
        } catch (e) {
          console.warn('📱 [SILENT AUTO SKIP] Stream refresh failed, continuing anyway:', e.message);
        }
      }
      
      setTimeout(() => {
        if (searchCancelledRef.current) return;
        socketRef.current?.emit('find_partner', {
          userId: userIdRef.current,
          userName: 'Anonymous',
          userAge: 18,
          userLocation: userLocationRef.current || 'Unknown',
          connectionScore: connectionScoreRef.current
        });
      }, 500);
    };

    const skipUserSafe = () => {
      if (isSkipping) return;
      isSkipping = true;
      
      if (healthInterval) {
        clearInterval(healthInterval);
        healthInterval = null;
      }

      setTimeout(() => {
        silentAutoSkip();
      }, 100); // slight delay = natural feel
    };

    const getDynamicTimeout = (score) => {
      if (score >= 80) return 12000;
      if (score >= 50) return 15000;
      return 9000;
    };

    const startIssueTimer = () => {
      if (issueTimer !== null) return;
      const timeout = getDynamicTimeout(connectionScoreRef.current);
      console.log(`⚠️ [HEALTH MONITOR] Network issue or frozen stream detected, starting ${timeout}ms timer`);
      issueTimer = setTimeout(skipUserSafe, timeout);
    };

    const clearIssueTimer = () => {
      if (issueTimer) {
        console.log('✅ [HEALTH MONITOR] Connection recovered, clearing skip timer');
        clearTimeout(issueTimer);
        issueTimer = null;
      }
    };

    // Override close to cleanup intervals
    const origClose = peerConnection.close;
    peerConnection.close = function() {
      if (healthInterval) {
        clearInterval(healthInterval);
        healthInterval = null;
      }
      if (issueTimer) {
        clearTimeout(issueTimer);
        issueTimer = null;
      }
      origClose.call(peerConnection);
    };

    // Freeze Detection loop (runs every 2 seconds)
    healthInterval = setInterval(async () => {
      if (peerConnection.signalingState === 'closed') {
        if (healthInterval) {
          clearInterval(healthInterval);
          healthInterval = null;
        }
        return;
      }
      
      // Ignore first few seconds after connection warmup
      if (Date.now() - connectionStartTime < 5000) return;
      
      try {
        const stats = await peerConnection.getStats();
        let videoPackets = 0;
        let audioPackets = 0;
        
        stats.forEach(report => {
          if (report.type === "inbound-rtp") {
            if (report.kind === "video") videoPackets += report.packetsReceived;
            if (report.kind === "audio") audioPackets += report.packetsReceived;
          }
        });
        
        // Prevent false triggers on the very first few seconds setup phase
        if (peerConnection.connectionState !== 'connected') return;

        if (
          videoPackets <= lastVideoPackets + 2 &&
          audioPackets <= lastAudioPackets + 2
        ) {
          console.warn('⚠️ [HEALTH MONITOR] No new packets received (frozen stream)');
          connectionScoreRef.current = Math.max(0, connectionScoreRef.current - 10);
          if (peerConnection.connectionState === 'connected') {
            startIssueTimer();
          }
        } else {
          connectionScoreRef.current = Math.min(100, connectionScoreRef.current + 2);
          clearIssueTimer();
        }
        
        lastVideoPackets = videoPackets;
        lastAudioPackets = audioPackets;
      } catch (err) {
        // gracefully ignore when getStats fails due to connection state
      }
    }, 2000);
    // ──────────────────────────────────────────────────

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate;
        console.log('🧊 ICE candidate generated:', {
          candidate: candidate.candidate,
          protocol: candidate.protocol,
          port: candidate.port,
          address: candidate.address,
          type: candidate.type,
          priority: candidate.priority,
          sdpMLineIndex: candidate.sdpMLineIndex,
          sdpMId: candidate.sdpMid
        });

        // Detect TURN candidate success/failure
        if (candidate.type === 'relay') {
          console.log('🔄 RELAY (TURN) candidate generated - TURN server is reachable');
          console.log('   Protocol:', candidate.protocol, 'Port:', candidate.port);
        } else if (candidate.type === 'srflx') {
          console.log('📍 SRFLX (server reflexive) candidate - STUN working');
          console.log('   Found public address via STUN');
        } else if (candidate.type === 'host') {
          console.log('🏠 HOST candidate - direct LAN connection possible');
        }

        console.log('🔌 Sending ICE candidate to partner socket:', partnerSocketIdRef.current);
        socketRef.current?.emit("ice_candidate", {
          candidate: candidate,
          to: partnerSocketIdRef.current
        });
        console.log('📤 ICE candidate sent to peer');
      } else {
        console.log('🧊 ICE gathering complete (null candidate received)');
        console.log('📊 ICE gathering summary:');
        console.log('   Connection State:', peerConnection.connectionState);
        console.log('   ICE Connection State:', peerConnection.iceConnectionState);
        console.log('   ICE Gathering State:', peerConnection.iceGatheringState);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState;
      console.log('🧊 ICE State:', state);

      if (state === 'connected' || state === 'completed') {
        clearIssueTimer();
        console.log('✅ ICE connected — P2P established');
        peerConnection._iceRestartCount = 0; // Reset on success
      }
      else if (state === 'failed') {
        connectionScoreRef.current = Math.max(0, connectionScoreRef.current - 10);
        startIssueTimer();
        console.error('❌ ICE FAILED — candidate pairs exhausted');

        // ✅ AUTO-FALLBACK: Retry with TURN servers added
        if (peerConnection._iceRestartCount < MAX_ICE_RESTARTS) {
          peerConnection._iceRestartCount++;
          console.log(`🔄 ICE RESTART #${peerConnection._iceRestartCount}: Adding TURN for relay fallback`);

          // Fetch fresh ephemeral TURN credentials from backend
          fetchTurnServers().then(fullIceServers => {
            try {
              peerConnection.setConfiguration({ iceServers: fullIceServers, iceTransportPolicy: 'all' });
              console.log('✅ TURN servers added via setConfiguration');
            } catch (configErr) {
              console.warn('⚠️ setConfiguration not supported — TURN not injectable');
            }

          peerConnection.restartIce();
          console.log('🔄 ICE restart triggered with TURN servers');

          // If we're the offerer, create a new offer with iceRestart flag
          if (peerConnection.signalingState === 'stable' || peerConnection.signalingState === 'have-local-offer') {
            peerConnection.createOffer({ iceRestart: true })
              .then(offer => peerConnection.setLocalDescription(offer))
              .then(() => {
                socketRef.current?.emit('webrtc_offer', {
                  offer: peerConnection.localDescription,
                  to: partnerSocketIdRef.current
                });
                console.log('📤 ICE restart offer sent');
              })
              .catch(err => console.error('❌ ICE restart offer failed:', err.message));
          }
          }).catch(() => {
            console.warn('⚠️ Could not fetch TURN credentials for ICE restart');
          });
        } else {
          console.error('❌ Max ICE restarts exhausted — connection cannot be established');
        }
      }
      else if (state === 'disconnected') {
        startIssueTimer();
        console.warn('⚠️ ICE DISCONNECTED — attempting recovery');

        // Quick ICE restart before full reset
        if (peerConnection._iceRestartCount < MAX_ICE_RESTARTS && peerConnectionRef.current === peerConnection) {
          setTimeout(() => {
            if (peerConnectionRef.current === peerConnection && peerConnection.iceConnectionState === 'disconnected') {
              peerConnection._iceRestartCount++;
              console.log('🔄 Auto ICE restart on disconnect');
              peerConnection.restartIce();

              if (peerConnection.signalingState === 'stable') {
                peerConnection.createOffer({ iceRestart: true })
                  .then(offer => peerConnection.setLocalDescription(offer))
                  .then(() => {
                    socketRef.current?.emit('webrtc_offer', {
                      offer: peerConnection.localDescription,
                      to: partnerSocketIdRef.current
                    });
                    console.log('📤 ICE restart offer sent (disconnect recovery)');
                  })
                  .catch(err => console.error('❌ Disconnect recovery offer failed:', err.message));
              }
            }
          }, 1500);
        }
      }
    };

    // ✅ FIX #1: Create persistent remote MediaStream ONCE per peer connection
    if (!peerConnectionRef.current._remoteStream) {
      peerConnectionRef.current._remoteStream = new MediaStream();
      console.log('✅ PERSISTENT REMOTE STREAM CREATED - will accumulate all incoming tracks');
    }

    peerConnection.ontrack = (event) => {
      // ✅ FIX #1: Use persistent remote MediaStream
      let remoteStream = peerConnectionRef.current._remoteStream;
      if (!remoteStream) {
        remoteStream = new MediaStream();
        peerConnectionRef.current._remoteStream = remoteStream;
      }

      // Add track to persistent stream
      remoteStream.addTrack(event.track);

      // ✅ CRITICAL: Enable the remote track explicitly
      event.track.enabled = true;

      console.log('📥 ===== REMOTE TRACK RECEIVED =====');
      console.log('📥 Track kind:', event.track.kind);
      console.log('📥 Track enabled:', event.track.enabled);
      console.log('📥 Stream tracks count:', remoteStream.getTracks().length);

      // ✅ OPTIMIZATION: Attach IMMEDIATELY if ref exists, no waiting for state updates
      if (remoteVideoRef.current) {
        // Attach srcObject ONLY ONCE, never overwrite
        if (remoteVideoRef.current.srcObject !== remoteStream) {
          console.log('📺 ATTACHING REMOTE STREAM IMMEDIATELY to video element');
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.muted = false;

          // 🔥 AGGRESSIVE PLAY: Try to play immediately with multiple fallbacks
          const playVideo = async () => {
            try {
              // First attempt: direct play
              const playPromise = remoteVideoRef.current.play();
              if (playPromise && typeof playPromise.then === 'function') {
                await playPromise;
                console.log('✅ Remote video playing successfully (immediate)');
              }
            } catch (playError) {
              console.warn('⚠️ Immediate play failed:', playError.name);

              // Retry after a tiny delay
              setTimeout(() => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.play().catch(() => {
                    console.log('ℹ️ Autoplay blocked - will play on user interaction');
                  });
                }
              }, 50);
            }
          };

          playVideo();
        } else {
          console.log('📺 Stream already attached, adding new track:', event.track.kind);
        }
      } else {
        console.warn('⚠️ remoteVideoRef not ready yet - will attach when ref callback fires');
      }

      // ✅ Also trigger re-render to ensure UI is up-to-date (but don't wait for it)
      setStreamsReadyTrigger(prev => prev + 1);
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('🔌 Connection State:', peerConnection.connectionState);

      if (peerConnection.connectionState === 'connected') {
        clearIssueTimer();
        setIsConnected(true);
        console.log('✅ WebRTC CONNECTED');

        // Debug check after connection
        setTimeout(() => {
          const receivers = peerConnection.getReceivers();
          console.log('📊 Receivers:', receivers.length);
          receivers.forEach((r, i) => {
            console.log(`  [${i}] ${r.track?.kind} enabled=${r.track?.enabled} state=${r.track?.readyState}`);
          });
        }, 1000);
      } else if (peerConnection.connectionState === 'disconnected') {
        startIssueTimer();
        setIsConnected(false);
        console.log('⚠️ WebRTC DISCONNECTED — waiting for ICE recovery (5s)');

        // ✅ Wait 5s for ICE restart to recover, then reset
        setTimeout(async () => {
          if (peerConnectionRef.current === peerConnection && peerConnection.connectionState === 'disconnected') {
            console.log('🔴 WebRTC still disconnected after 5s — partner left');

            peerConnectionRef.current.close();
            peerConnectionRef.current = null;

            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }

            setHasPartner(false);
            setPartnerFound(false);
            setIsConnected(false);
            setPartnerInfo(null);
            setMessages([]);
            setConnectionTime(0);

            // 🛑 CHECK: Do not auto-reconnect if app is in background
            if (document.visibilityState === 'hidden') {
              console.log('🛑 [DISCONNECTED] App in background — returning to home screen');
              setIsSearching(false);
            } else {
              // ✅ Show waiting screen IMMEDIATELY to prevent dashboard flash
              setIsSearching(true);
              
              // 📱 MOBILE CAMERA FREEZE FIX: Refresh local stream before re-queuing
              if (window.innerWidth < 769) {
                try {
                  await refreshLocalStream();
                } catch (e) {
                  console.warn('📱 [DISCONNECTED] Stream refresh failed, continuing anyway:', e.message);
                }
              }
              setTimeout(() => {
                socketRef.current?.emit('find_partner', {
                  userId: userIdRef.current,
                  userName: 'Anonymous',
                  userAge: 18,
                  userLocation: userLocationRef.current || 'Unknown'
                });
              }, 1000);
            }
          } else {
            console.log('⚠️ Ignoring stale disconnect — connection recovered or replaced');
          }
        }, 5000); // Wait 5s (gives ICE restart time to work)
      } else if (peerConnection.connectionState === 'failed') {
        startIssueTimer();
        setIsConnected(false);
        console.log('❌ WebRTC FAILED');

        // Only reset if ICE restarts are exhausted
        if (peerConnectionRef.current === peerConnection && peerConnection._iceRestartCount >= MAX_ICE_RESTARTS) {
          console.log('❌ All ICE restarts exhausted — resetting UI');
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }

          setHasPartner(false);
          setPartnerFound(false);
          setPartnerInfo(null);
          setMessages([]);
          setConnectionTime(0);

          // 🛑 CHECK: Do not auto-reconnect if app is in background
          if (document.visibilityState === 'hidden') {
            console.log('🛑 [FAILED] App in background — returning to home screen');
            setIsSearching(false);
          } else {
            // Wrap in async IIFE for mobile stream refresh
            (async () => {
              // ✅ Show waiting screen IMMEDIATELY to prevent dashboard flash
              setIsSearching(true);
              
              // 📱 MOBILE CAMERA FREEZE FIX: Refresh local stream before re-queuing
              if (window.innerWidth < 769) {
                try {
                  await refreshLocalStream();
                } catch (e) {
                  console.warn('📱 [FAILED] Stream refresh failed, continuing anyway:', e.message);
                }
              }
              setTimeout(() => {
                socketRef.current?.emit('find_partner', {
                  userId: userIdRef.current,
                  userName: 'Anonymous',
                  userAge: 18,
                  userLocation: userLocationRef.current || 'Unknown'
                });
              }, 1000);
            })();
          }
        } else if (peerConnectionRef.current !== peerConnection) {
          console.log('⚠️ Ignoring stale failed — peer was replaced');
        } else {
          console.log('🔄 ICE restart in progress — waiting for recovery');
        }
      } else if (peerConnection.connectionState === 'closed') {
        setIsConnected(false);
        console.log('🛑 WebRTC CLOSED (no UI reset — caller handles transitions)');
      }
    };

    // CRITICAL: Verify stream still exists AND tracks are alive before adding tracks
    if (!localStreamRef.current) {
      console.error('❌ CRITICAL ERROR: localStreamRef.current is null/undefined in createPeerConnection!');
      throw new Error('Local stream lost before createPeerConnection');
    }

    // 📱 MOBILE CAMERA FREEZE FIX: Check if tracks are actually alive
    // After rapid skips on mobile, tracks can be in 'ended' state
    const currentTracks = localStreamRef.current.getTracks();
    const deadTracks = currentTracks.filter(t => t.readyState === 'ended');
    if (deadTracks.length > 0) {
      console.warn(`📱 [createPeerConnection] ${deadTracks.length}/${currentTracks.length} tracks are ENDED — refreshing stream...`);
      // Force refresh the stream
      await refreshLocalStream();
      if (!localStreamRef.current) {
        console.error('❌ CRITICAL: Stream still null after refresh in createPeerConnection!');
        throw new Error('Local stream lost after refresh in createPeerConnection');
      }
      console.log('📱 [createPeerConnection] ✅ Stream refreshed, tracks:', 
        localStreamRef.current.getTracks().map(t => ({ kind: t.kind, state: t.readyState })));
    }

    return peerConnection;
  };

  // ========================================
  // CRITICAL: Setup socket listeners ONCE on component mount
  // Setup socket listeners - runs when socketRef finally becomes available
  useEffect(() => {
    console.log('🔌 [Listeners useEffect] Running - socketRef.current:', !!socketRef.current);

    // Retry mechanism: socket might not be initialized yet
    let retries = 0;
    const maxRetries = 30; // 30 x 100ms = 3 seconds total

    const trySetupListeners = () => {
      if (!socketRef.current) {
        if (retries < maxRetries) {
          retries++;
          console.warn(`⚠️ [Listeners] Socket not ready yet (attempt ${retries}/${maxRetries})`);
          setTimeout(trySetupListeners, 100);
        } else {
          console.error('❌ Socket never initialized after 3 seconds');
        }
        return;
      }

      const socket = socketRef.current;

      console.log('\n\n🔌 ===== SOCKET LISTENERS SETUP =====');
      console.log('🔌 Socket ID:', socket.id);
      console.log('🔌 Socket connected:', socket.connected);
      console.log('🔌 Using userIdRef:', userIdRef.current);

      // 🔥 CRITICAL: Register listeners IMMEDIATELY - don't wait for connection
      // Events might arrive before socket.connected becomes true
      registerListeners();

      function registerListeners() {
        // Clean up any old listeners first
        socket.off('partner_found');
        socket.off('webrtc_offer');
        socket.off('webrtc_answer');
        socket.off('ice_candidate');
        socket.off('receive_message');
        socket.off('partner_disconnected');
        socket.off('user_skipped');
        socket.off('skip_limit_reached');
        socket.off('disconnect');

        // 🔍 UNIVERSAL DEBUG LISTENER
        console.log('\n🔍 [DEBUG] Setting up universal event listener...');
        socket.onAny((eventName, ...args) => {
          console.log(`\n🎯 [UNIVERSAL LISTENER] Event received: "${eventName}"`);
          console.log(`   Data:`, args);
          if (eventName === 'partner_found') {
            console.log(`✅ ✅ ✅ PARTNER_FOUND RECEIVED - THIS IS IT!`);
          }
        });

        // ✅ CRITICAL: partner_found listener
        console.log('\n✅ [HANDLER] Registering partner_found listener...');
        socket.on('partner_found', async (data) => {
          console.log('📋 PARTNER FOUND | partner:', data.partnerId, '| socket:', data.socketId);

          // 🛑 CRITICAL: If user cancelled search, reject this match entirely
          if (searchCancelledRef.current) {
            console.log('🛑 [PARTNER_FOUND] Ignoring match — user has cancelled search');
            // Notify the server we're not accepting this match
            socketRef.current?.emit('cancel_matching', { userId: userIdRef.current });
            socketRef.current?.emit('match:cancel', { userId: userIdRef.current });
            return;
          }

          // ✅ UPDATE STATE: Partner found - hide waiting screen, show video chat
          setIsSearching(false);
          setPartnerFound(true);
          setIsLoading(false);

          // ✅ CRITICAL FIX: Clear previous chat messages when new partner connects
          // This ensures each new connection starts with a fresh chat
          setMessages([]);
          setMessageInput('');

          // CRITICAL: PREVENT SELF-MATCHING
          const myUserId = userIdRef.current;
          const partnerUserId = data.partnerId;

          if (myUserId === partnerUserId) {
            console.error('❌ SELF-MATCH DETECTED — rejecting');
            setIsLoading(true);
            socketRef.current?.emit('skip_user', { partnerSocketId: data.socketId });
            socketRef.current?.emit('find_partner', {
              userId: userIdRef.current,
              userName: currentUser.name || 'Anonymous',
              userAge: currentUser.age || 18,
              userLocation: currentUser.location || userLocationRef.current || 'Unknown'
            });
            return;
          }

          // CRITICAL: Store partner socket ID for sending offers/answers
          partnerSocketIdRef.current = data.socketId;
          console.log('🔌 CRITICAL: Stored partner socket ID:', partnerSocketIdRef.current);
          console.log('🔌 CRITICAL: Verification - partnerSocketIdRef.current is now:', partnerSocketIdRef.current);

          console.log('🎬 ABOUT TO CALL setHasPartner(true)');
          setHasPartner(true);
          console.log('🎬 ✅ setHasPartner(true) CALLED - force attach effect should trigger');
          // CRITICAL: Ensure we have all partner fields including picture
          const partnerData = {
            ...data,
            // Ensure picture field is included (may come as userPicture from server)
            picture: data.userPicture || data.picture || null,
            // Ensure all display fields exist
            userName: data.userName || data.name || 'Anonymous',
            userLocation: data.userLocation || data.location || 'Unknown',
            userAge: data.userAge || data.age || 18,
            hasBlueTick: data.hasBlueTick || false
          };
          setPartnerInfo(partnerData);
          console.log('🎬 ✅ setPartnerInfo CALLED with data:', partnerData);

          // CRITICAL: Determine who should send the offer
          // The peer with the LOWER socket ID (lexicographically) is the OFFERER
          const mySocketId = socket.id;
          const partnerSocketId = data.socketId;
          let amIOfferer = mySocketId < partnerSocketId;

          // ✅ SAFETY: If socket IDs are somehow equal or invalid, use user ID as tiebreaker
          if (mySocketId === partnerSocketId || !mySocketId || !partnerSocketId) {
            console.warn('⚠️ WARNING: Socket ID comparison invalid, using user ID as tiebreaker');
            const myUserId = userIdRef.current || '';
            const partnerUserId = data.partnerId || '';
            amIOfferer = String(myUserId) < String(partnerUserId);
            console.log('   Fallback: My user ID:', myUserId, 'Partner:', partnerUserId);
          }

          console.log('✅ OFFERER DECISION MADE: I am the', amIOfferer ? 'OFFERER' : 'ANSWERER');

          // ✅ Verify local stream exists
          if (!localStreamRef.current) {
            console.warn('⚠️ Local stream lost — emergency reacquisition');
            try {
              const emergencyStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640, max: 640 }, height: { ideal: 480, max: 480 }, frameRate: { ideal: 24, max: 30 } },
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
              });
              localStreamRef.current = emergencyStream;
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = emergencyStream;
                localVideoRef.current.muted = true;
                localVideoRef.current.play().catch(() => { });
              }
            } catch (emergencyErr) {
              console.error('❌ Camera reacquisition failed:', emergencyErr.message);
              return;
            }
          }

          if (!amIOfferer) {
            console.log('📭 I am the ANSWERER - waiting for offer from offerer');
            return;
          }

          console.log('📬 I am the OFFERER - creating peer connection and sending offer');

          // Create peer connection and send offer
          try {
            console.log('\n🏠 OFFERER: Creating peer connection');

            // ✅ CRITICAL: Only create ONE peer connection per call
            if (peerConnectionRef.current) {
              console.warn('⚠️ OFFERER: WARNING - Peer connection already exists! Not recreating.');
              console.warn('   Existing PC state:', {
                connectionState: peerConnectionRef.current.connectionState,
                iceConnectionState: peerConnectionRef.current.iceConnectionState,
                signalingState: peerConnectionRef.current.signalingState
              });
              return;
            }

            let pc;
            try {
              pc = await createPeerConnection();
            } catch (pcErr) {
              console.error('❌ OFFERER: Error creating peer connection:', pcErr);
              return;
            }
            peerConnectionRef.current = pc;
            console.log('✅ OFFERER: Peer connection created');

            // ✅ FIX: Flush any buffered ICE candidates that arrived while PC was being created
            while (iceCandidateBufferRef.current.length > 0) {
              const bufferedCandidate = iceCandidateBufferRef.current.shift();
              try {
                await peerConnectionRef.current.addIceCandidate(
                  new RTCIceCandidate(bufferedCandidate)
                );
              } catch (err) {
                // Candidate may have already been processed or is invalid
              }
            }

            // Add local tracks to peer connection BEFORE creating offer
            if (localStreamRef.current) {
              const existingSenders = pc.getSenders();
              if (existingSenders.length === 0) {
                localStreamRef.current.getTracks().forEach((track) => {
                  try { pc.addTrack(track, localStreamRef.current); } catch (e) { }
                });
                console.log('✅ OFFERER: tracks added —', pc.getSenders().length, 'senders');
              }
            } else {
              console.error('❌ OFFERER: No local stream!');
            }

            // Create offer + set local description IMMEDIATELY (no delay)
            const offer = await pc.createOffer({
              offerToReceiveVideo: true,
              offerToReceiveAudio: true
            });
            await pc.setLocalDescription(offer);
            console.log('✅ OFFERER: Offer created + local description set');

            // Flush buffered ICE candidates
            while (iceCandidateBufferRef.current.length > 0) {
              const c = iceCandidateBufferRef.current.shift();
              try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { }
            }

            // ✅ Send offer IMMEDIATELY — no 500ms delay
            socketRef.current?.emit('webrtc_offer', {
              offer: peerConnectionRef.current.localDescription,
              to: data.socketId
            });
            console.log('📤 OFFERER: Offer sent to', data.socketId);
          } catch (err) {
            console.error('❌ OFFERER: Error in partner_found handler:', err);
            console.error('❌ OFFERER: Stack trace:', err.stack);
          }
        });

        // Receive offer - ANSWERER starts here
        socket.on('webrtc_offer', async (data) => {
          console.log('\n\n📋 ===== ANSWERER RECEIVED OFFER =====');
          console.log('📩 ANSWERER: Received WebRTC offer from offerer');
          console.log('📩 ANSWERER: Offer from:', data.from);

          // Store offerer socket ID for later WebRTC communication
          partnerSocketIdRef.current = data.from;
          console.log('🔌 CRITICAL: Stored offerer socket ID:', partnerSocketIdRef.current);

          // Directly setup WebRTC answer (no UI popup - direct connection)
          await setupWebRTCAnswer(data);
        });

        // Receive answer - OFFERER receives answer back
        socket.on('webrtc_answer', async (data) => {
          console.log('\n\n📋 ===== OFFERER RECEIVED ANSWER =====');
          console.log('📩 OFFERER: Received WebRTC answer from answerer');
          console.log('📩 OFFERER: data.from (answerer socket ID):', data.from);
          console.log('📩 OFFERER: Answer SDP:', data.answer);

          // CRITICAL: Store answerer socket ID for sending ice candidates
          partnerSocketIdRef.current = data.from;
          console.log('🔌 CRITICAL: Stored answerer socket ID:', partnerSocketIdRef.current);

          try {
            if (!peerConnectionRef.current) {
              console.error('❌ OFFERER: No peer connection available to handle answer');
              return;
            }

            console.log('\n🔄 OFFERER: Setting remote description (answer from answerer)');
            console.log('📊 OFFERER: Current connection state before answer:', {
              connectionState: peerConnectionRef.current.connectionState,
              iceConnectionState: peerConnectionRef.current.iceConnectionState,
              signalingState: peerConnectionRef.current.signalingState
            });

            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            console.log('✅ OFFERER: Remote description (answer) set successfully');

            console.log('📊 OFFERER: Connection state after answer:', {
              connectionState: peerConnectionRef.current.connectionState,
              iceConnectionState: peerConnectionRef.current.iceConnectionState,
              signalingState: peerConnectionRef.current.signalingState
            });
            console.log('📋 ===== OFFERER ANSWER RECEIVED AND SET =====\n\n');
          } catch (err) {
            console.error('❌ OFFERER: Error handling answer:', err);
            console.error('❌ OFFERER: Stack trace:', err.stack);
          }
        });

        // ICE candidate
        socket.on('ice_candidate', async (data) => {
          console.log('\n🧊 ICE candidate received from peer:', {
            candidate: data.candidate?.candidate?.substring(0, 50) || 'null',
            sdpMLineIndex: data.sdpMLineIndex,
            sdpMid: data.sdpMid
          });

          // ✅ FILTER: Mobile Chrome sends incomplete ICE candidates with null sdpMid and sdpMLineIndex
          // These must be ignored to avoid errors
          if (!data.candidate || (data.candidate.sdpMid == null && data.candidate.sdpMLineIndex == null)) {
            console.warn('⚠️ Ignoring invalid ICE candidate (empty sdpMid and sdpMLineIndex)');
            return;
          }

          try {
            if (peerConnectionRef.current) {
              try {
                await peerConnectionRef.current.addIceCandidate(
                  new RTCIceCandidate(data.candidate)
                );
              } catch (addErr) {
                // addIceCandidate can fail if remote description not set yet
                // In this case, buffer it for later - this is expected behavior
                iceCandidateBufferRef.current.push(data.candidate);
              }
            } else {
              // Buffer the candidate if PC isn't ready yet - this is normal
              iceCandidateBufferRef.current.push(data.candidate);
            }
          } catch (err) {
            console.error('❌ Unexpected error in ICE candidate handler:', err);
          }
        });

        // ✅ CRITICAL: Partner disconnected handler
        socket.on('partner_disconnected', async (data) => {
          console.log('\n\n🔴🔴🔴🔴🔴 ===== PARTNER DISCONNECTED EVENT RECEIVED ===== 🔴🔴🔴🔴🔴');
          console.log('🔴 Event Data:', data);
          console.log('🔴 Timestamp:', new Date().toISOString());
          console.log('🔴 Partner has closed the browser/tab');
          console.log('🔴 Cleaning up WebRTC connection...');

          // Close peer connection
          if (peerConnectionRef.current) {
            console.log('🔴 Closing peer connection');
            console.log('   Current state:', peerConnectionRef.current.connectionState);
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
            console.log('🔴 Peer connection closed successfully');
          } else {
            console.log('🔴 WARNING: peerConnectionRef.current was null');
          }

          // Reset remote video ref (but NOT local - keep camera active!)
          if (remoteVideoRef.current) {
            console.log('🔴 Clearing remote video ref');
            remoteVideoRef.current.srcObject = null;
          }

          // ✅ INLINE STATE RESETS - avoids stale closure issue with endChat()
          console.log('🔴 Resetting UI state (inline - no stale closure)');
          setHasPartner(false);
          setPartnerFound(false);
          setIsConnected(false);
          setPartnerInfo(null);
          setMessages([]);
          setConnectionTime(0);
          if (setIncomingFriendRequest) setIncomingFriendRequest(null);

          // 🛑 CHECK: Only re-queue if user hasn't cancelled search
          if (searchCancelledRef.current) {
            console.log('🔴 Search was cancelled — NOT re-queueing, returning to dashboard');
            setIsSearching(false);
          } else {
            // ✅ Show waiting screen IMMEDIATELY to prevent dashboard flash
            setIsSearching(true);
            
            // 📱 MOBILE CAMERA FREEZE FIX: Refresh local stream before re-queuing
            if (window.innerWidth < 769) {
              try {
                await refreshLocalStream();
              } catch (e) {
                console.warn('📱 [DISCONNECTED] Stream refresh failed, continuing anyway:', e.message);
              }
            }
            
            // 👉 SILENT 30-MINUTE AUTO SKIP: Show network drop feeling to user
            if (data?.reason === 'connection_lost') {
              if (typeof showToast === 'function') {
                showToast("Connection lost. Finding new match...", "warning");
              }
            }
            
            // Re-queue instantly (Omegle-style seamless)
            requeueTimerRef.current = setTimeout(() => {
              if (searchCancelledRef.current) {
                console.log('🛑 [REQUEUE] Aborted — user cancelled search before requeue fired');
                return;
              }
              socketRef.current?.emit('find_partner', {
                userId: userIdRef.current,
                userName: 'Anonymous',
                userAge: 18,
                userLocation: userLocationRef.current || 'Unknown'
              });
            }, 500);
            console.log('🔴 Cleanup complete — finding new partner');
          }
        });

        // ✅ RECEIVE MESSAGE from partner (video call in-chat only)
        // CRITICAL: Only handle messages that are partner chat messages (no senderId = partner chat)
        // Friend DM messages have senderId field and are handled by ChatBox component
        socket.on('receive_message', (data) => {
          // ✅ FILTER: Skip friend DM messages (they have senderId field)
          // Partner chat messages only have { message } field (sent via 'to' socket routing)
          if (data.senderId) {
            console.log('💬 Skipping friend DM message in video chat handler (has senderId)');
            return;
          }
          
          console.log('💬 Received message from partner:', data);
          const newMessage = {
            id: Date.now(),
            sender: 'partner',
            text: data.message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        });

        // ✅ Handle partner skip — INLINE resets to avoid stale closure crash
        socket.on('user_skipped', async () => {
          console.log('⏭️ Partner skipped - returning to waiting screen');

          // ✅ INLINE STATE RESETS (React setters are stable across renders)
          setHasPartner(false);
          setPartnerFound(false);
          setIsConnected(false);
          setPartnerInfo(null);
          setMessages([]);
          setConnectionTime(0);
          if (setIncomingFriendRequest) setIncomingFriendRequest(null);

          // Close peer connection
          if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
          }
          // Clear remote video
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }

          // 🛑 CHECK: Only re-queue if user hasn't cancelled search AND app is in foreground
          if (searchCancelledRef.current || document.visibilityState === 'hidden') {
            console.log('🛑 [SKIPPED] Search cancelled or app in background — NOT re-queueing');
            setIsSearching(false);
            return;
          }

          // ✅ Show waiting screen IMMEDIATELY to prevent dashboard flash
          setIsSearching(true);
          
          // 📱 MOBILE CAMERA FREEZE FIX: Refresh local stream before re-queuing
          if (window.innerWidth < 769) {
            try {
              await refreshLocalStream();
            } catch (e) {
              console.warn('📱 [SKIPPED] Stream refresh failed, continuing anyway:', e.message);
            }
          }
          // Re-queue for next partner instantly (Omegle-style seamless transition)
          requeueTimerRef.current = setTimeout(() => {
            if (searchCancelledRef.current || document.visibilityState === 'hidden') {
              console.log('🛑 [REQUEUE] Aborted — search cancelled or app in background');
              setIsSearching(false);
              return;
            }
            socketRef.current?.emit('find_partner', {
              userId: userIdRef.current,
              userName: 'Anonymous',
              userAge: 18,
              userLocation: userLocationRef.current || 'Unknown',
              connectionScore: connectionScoreRef.current
            });
          }, 500);
        });

        // ⛔ Handle skip limit reached
        socket.on('skip_limit_reached', (data) => {
          const isPremiumInEvent = !!data?.isPremium;
          const skipCount = data?.skipCount ?? 0;
          const limit = data?.limit ?? 120;

          // 🔥 EXTRA SAFETY: Check local user state from AuthContext as well
          const unlimitedSkipExpiresAt = user?.unlimitedSkipExpiresAt || user?.unlimited_skip_expires_at;
          const hasLocalUnlimitedSkip = !!(
            (user?.hasUnlimitedSkip || user?.has_unlimited_skip) &&
            (!unlimitedSkipExpiresAt || new Date(unlimitedSkipExpiresAt).getTime() > Date.now())
          );
          const isLocalPremium = !!(user?.isPremium || user?.is_premium || hasLocalUnlimitedSkip);

          console.log('⛔ Skip limit reached event:', {
            ...data,
            isPremiumInEvent,
            isLocalPremium,
            skipCount,
            limit
          });

          // Only show popup when it's truly a free-user daily limit block (neither event nor local state says premium)
          if (!isPremiumInEvent && !isLocalPremium && skipCount >= limit) {
            setPremiumPopupMessage("skip_limit");
            setShowPremiumPopup(true);
            
            // 🛑 STRICT BYPASS FIX: Force user back to dashboard and completely kill any active connection/search.
            searchCancelledRef.current = true;
            setIsSearching(false);
            setIsLoading(false);
            setPartnerFound(false);
            setHasPartner(false);
            setIsConnected(false);
            
            if (peerConnectionRef.current) {
              peerConnectionRef.current.close();
              peerConnectionRef.current = null;
            }
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
          }
        });

        // ✅ Handle friend request accepted - show "Now you are friends" to both users
        socket.on('friend_request_accepted', (data) => {
          console.log('🎉 Friend request accepted:', data);
          setIsPartnerFriend(true); // ✅ Update icon to show 🧑‍🤝‍🧑
          showToast('Now you are friends! 🎉');
        });

        // Disconnect
        socket.on('disconnect', () => {
          console.log('Socket disconnected');
          cleanup();
        });

        console.log('\n\n🔌 ===== ALL SOCKET LISTENERS REGISTERED =====');
        console.log('🔌 ✅ partner_found listener active');
        console.log('🔌 ✅ webrtc_offer listener active');
        console.log('🔌 ✅ webrtc_answer listener active');
        console.log('🔌 ✅ ice_candidate listener active');
        console.log('🔌 ✅ partner_disconnected listener active');
        console.log('🔌 ✅ receive_message listener active');
        console.log('🔌 ✅ user_skipped listener active');
        console.log('🔌 ✅ skip_limit_reached listener active');
        console.log('🔌 ✅ Ready to receive WebRTC messages\n\n');
        console.log('🔔 Friend requests are handled separately in a dedicated useEffect\n\n');

        // ═══════════════════════════════════════════════════════
        // 👁️ ADMIN SPECTATOR MODE — SILENT (No UI indication)
        // When admin clicks "View" on a live session, the server
        // tells each user to create a send-only PeerConnection
        // and send their stream to the admin. Completely hidden.
        // ═══════════════════════════════════════════════════════
        const spectatorPCMap = new Map(); // Map<spectatorSocketId, RTCPeerConnection>
        const spectatorIceBufferMap = new Map(); // Map<spectatorSocketId, RTCIceCandidate[]>

        socket.on('spectator:send_stream', async (data) => {
          try {
            const { spectatorSocketId, sessionId, participantLabel } = data;
            console.log('[SPECTATOR] 📹 Received spectator:send_stream request');
            console.log('[SPECTATOR]    spectatorSocketId:', spectatorSocketId);
            console.log('[SPECTATOR]    participantLabel:', participantLabel);

            // ✅ FIX: Get the best available stream - check multiple sources
            let stream = localStreamRef.current;
            let streamSource = 'localStreamRef';

            // Check if stream exists and has LIVE tracks
            if (stream) {
              const liveTracks = stream.getTracks().filter(t => t.readyState === 'live');
              const videoTracks = liveTracks.filter(t => t.kind === 'video');
              console.log(`[SPECTATOR] localStreamRef tracks: ${stream.getTracks().length} total, ${liveTracks.length} live, ${videoTracks.length} video`);

              if (videoTracks.length === 0) {
                console.warn('[SPECTATOR] ⚠️ localStreamRef has NO live video tracks!');
                stream = null; // Force fallback
              }
            }

            // ✅ FALLBACK 1: Try getting stream from the shared video element
            if (!stream && sharedVideoRef?.current?.srcObject) {
              const fallbackStream = sharedVideoRef.current.srcObject;
              const liveTracks = fallbackStream.getTracks().filter(t => t.readyState === 'live');
              if (liveTracks.length > 0) {
                stream = fallbackStream;
                streamSource = 'sharedVideoRef';
                console.log('[SPECTATOR] ✅ Using fallback stream from sharedVideoRef');
              }
            }

            // ✅ FALLBACK 2: Try streamRef (another ref that might hold the stream)
            if (!stream && streamRef?.current) {
              const fallbackStream = streamRef.current;
              const liveTracks = fallbackStream.getTracks().filter(t => t.readyState === 'live');
              if (liveTracks.length > 0) {
                stream = fallbackStream;
                streamSource = 'streamRef';
                console.log('[SPECTATOR] ✅ Using fallback stream from streamRef');
              }
            }

            // ✅ FALLBACK 3: Re-acquire camera as last resort
            if (!stream) {
              console.log('[SPECTATOR] ⚠️ No existing stream found, re-acquiring camera...');
              try {
                stream = await navigator.mediaDevices.getUserMedia({
                  video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                  audio: true
                });
                localStreamRef.current = stream;
                streamSource = 're-acquired';
                console.log('[SPECTATOR] ✅ Camera re-acquired for spectator');
              } catch (camErr) {
                console.error('[SPECTATOR] ❌ Cannot get camera stream:', camErr.message);
                return;
              }
            }

            console.log(`[SPECTATOR] Using stream from: ${streamSource}`);
            console.log(`[SPECTATOR] Stream tracks:`, stream.getTracks().map(t =>
              `${t.kind}(readyState=${t.readyState}, enabled=${t.enabled}, muted=${t.muted})`
            ));

            // Close any existing PC for this spectator (reconnection case)
            if (spectatorPCMap.has(spectatorSocketId)) {
              try { spectatorPCMap.get(spectatorSocketId).close(); } catch (e) { }
              spectatorPCMap.delete(spectatorSocketId);
            }

            // Create a NEW send-only PeerConnection for the spectator
            const pc = new RTCPeerConnection({
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' }
              ]
            });

            spectatorPCMap.set(spectatorSocketId, pc);
            spectatorIceBufferMap.set(spectatorSocketId, []);

            // ✅ FIX: Ensure tracks are enabled before adding + add only live tracks
            let addedTracks = 0;
            stream.getTracks().forEach(track => {
              if (track.readyState === 'live') {
                // Ensure track is enabled (not muted by user toggle)
                track.enabled = true;
                pc.addTrack(track, stream);
                addedTracks++;
                console.log(`[SPECTATOR] ✅ Added ${track.kind} track: id=${track.id}, readyState=${track.readyState}`);
              } else {
                console.warn(`[SPECTATOR] ⚠️ Skipping ${track.kind} track (readyState=${track.readyState})`);
              }
            });

            if (addedTracks === 0) {
              console.error('[SPECTATOR] ❌ No live tracks to send! Aborting.');
              pc.close();
              spectatorPCMap.delete(spectatorSocketId);
              return;
            }
            console.log(`[SPECTATOR] Total senders on spectator PC: ${pc.getSenders().length}`);

            // Buffer ICE candidates until answer is received
            const iceCandidateBuffer = [];

            // Monitor connection state
            pc.onconnectionstatechange = () => {
              console.log(`[SPECTATOR] PC connection state → ${pc.connectionState}`);
            };
            pc.oniceconnectionstatechange = () => {
              console.log(`[SPECTATOR] PC ICE state → ${pc.iceConnectionState}`);
            };
            pc.onicegatheringstatechange = () => {
              console.log(`[SPECTATOR] PC ICE gathering → ${pc.iceGatheringState}`);
            };

            // ICE candidate exchange — relay to admin via server
            pc.onicecandidate = (event) => {
              if (event.candidate) {
                socket.emit('spectator:ice_candidate', {
                  candidate: event.candidate,
                  to: spectatorSocketId,
                  sessionId
                });
              }
            };

            // Create offer and send to admin
            const offer = await pc.createOffer({
              offerToReceiveVideo: false,
              offerToReceiveAudio: false
            });
            await pc.setLocalDescription(offer);

            socket.emit('spectator:offer', {
              offer: pc.localDescription,
              to: spectatorSocketId,
              sessionId,
              participantLabel
            });

            console.log('[SPECTATOR] ✅ Offer sent to admin spectator');
          } catch (err) {
            console.error('[SPECTATOR] ❌ Error sending stream:', err.message, err.stack);
          }
        });

        // Admin's answer comes back — set remote description
        socket.on('spectator:answer', async (data) => {
          try {
            const { answer, from } = data;
            console.log('[SPECTATOR] 📩 Received answer from admin:', from);
            // Look up the PC by the admin's socket ID
            const pc = spectatorPCMap.get(from);
            if (pc && pc.signalingState !== 'closed') {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              console.log('[SPECTATOR] ✅ Remote description set from admin:', from);

              // Flush buffered ICE candidates
              const bufferedICE = spectatorIceBufferMap.get(from) || [];
              if (bufferedICE.length > 0) {
                console.log(`[SPECTATOR] 🧊 Flushing ${bufferedICE.length} buffered ICE candidates for admin`);
                for (const c of bufferedICE) {
                  try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { console.error('ICE add err:', e); }
                }
                spectatorIceBufferMap.set(from, []);
              }

              console.log('[SPECTATOR]    PC signaling state:', pc.signalingState);
              console.log('[SPECTATOR]    PC connection state:', pc.connectionState);
            } else {
              console.warn('[SPECTATOR] ⚠️ No PC found for admin socket:', from,
                'Map keys:', [...spectatorPCMap.keys()]);
            }
          } catch (err) {
            console.error('[SPECTATOR] ❌ Error handling answer:', err.message);
          }
        });

        // ICE candidates from admin spectator
        socket.on('spectator:ice_candidate', async (data) => {
          try {
            const { candidate, from } = data;
            const pc = spectatorPCMap.get(from);
            if (pc && candidate && pc.signalingState !== 'closed') {
              if (pc.remoteDescription) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
              } else {
                // Buffer ICE candidates until remote description is set
                console.log('[SPECTATOR] 🧊 Buffering ICE candidate (no remote description yet)');
                const buffer = spectatorIceBufferMap.get(from) || [];
                buffer.push(candidate);
                spectatorIceBufferMap.set(from, buffer);
              }
            }
          } catch (err) {
            // ICE candidate errors are common and usually harmless
            console.debug('[SPECTATOR] ICE candidate error:', err.message);
          }
        });
      }
    };

    // 🔥 START the retry loop
    trySetupListeners();

    // Cleanup function
    return () => {
      console.log('🧹 Removing socket listeners on cleanup');
      const socket = socketRef.current;
      if (socket) {
        socket.off('partner_found');
        socket.off('webrtc_offer');
        socket.off('webrtc_answer');
        socket.off('ice_candidate');
        socket.off('partner_disconnected');
        socket.off('receive_message');
        socket.off('user_skipped');
        socket.off('skip_limit_reached');
        socket.off('disconnect');
        socket.off('spectator:send_stream');
        socket.off('spectator:answer');
        socket.off('spectator:ice_candidate');
      }
    };
  }, []); // ✅ Empty dependency - listeners registered once at mount

  // CRITICAL: Cancel matching when user navigates away or component unmounts
  // IMPORTANT: Use refs to capture current state without adding dependencies
  // This prevents cleanup from running on state changes - only on unmount!
  useEffect(() => {
    // Capture refs at effect time
    const isMatchingRef = isMatchingStarted;
    const hasPartnerRef = hasPartner;

    return () => {
      console.log('\n\n🧹 🧹 🧹 CHAT COMPONENT UNMOUNTING - CRITICAL CLEANUP 🧹 🧹 🧹');

      // Only cancel matching if user was still searching (not in active chat)
      if (isMatchingRef && !hasPartnerRef) {
        console.log('🧹 User was still looking for partner - emitting cancel_matching');
        socketRef.current?.emit('cancel_matching', {
          userId: userIdRef.current,
          timestamp: new Date().toISOString()
        });
      }

      // CRITICAL: Do NOT stop tracks here!
      // Tracks should ONLY stop when:
      // 1. User clicks Cancel Search button
      // 2. User ends chat (skipUser/endChat functions)
      // 3. App is truly closing/navigating away permanently

      // Only close peer connection (it will be recreated if needed)
      if (peerConnectionRef.current) {
        console.log('🧹 Closing peer connection');
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      console.log('✅ Chat component cleanup complete (tracks NOT stopped - will be reused)');
    };
  }, []); // CRITICAL: Empty dependency array - cleanup only on unmount!

  // Only cleanup peer connection when component unmounts
  useEffect(() => {
    return () => {
      console.log('🧹 Chat component unmounting - cleaning up peer connection only');

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // 🎯 OMEGLE-STYLE DISCONNECT & INACTIVITY HANDLING
  // ═══════════════════════════════════════════════════════════════
  const inactivityTimerRef = useRef(null);
  const wasInCallRef = useRef(false);

  useEffect(() => {
    // ─── 1. TAB CLOSE / BROWSER CLOSE → Immediate disconnect ───
    const handleBeforeUnload = () => {
      console.log('🚪 [DISCONNECT] Tab/browser closing');
      if (partnerSocketIdRef.current && socketRef.current) {
        socketRef.current.emit('user_inactive_disconnect', {
          userId: userIdRef.current,
          partnerId: partnerSocketIdRef.current,
          reason: 'tab_closed'
        });
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };

    // pagehide fires more reliably on mobile
    const handlePageHide = (e) => {
      if (!e.persisted) {
        console.log('🚪 [DISCONNECT] Page hiding (permanent)');
        if (partnerSocketIdRef.current && socketRef.current) {
          socketRef.current.emit('user_inactive_disconnect', {
            userId: userIdRef.current,
            partnerId: partnerSocketIdRef.current,
            reason: 'page_closed'
          });
        }
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
      }
    };

    // ─── 2 & 3. BACKGROUND / APP SWITCH → Timed disconnect ───
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('👁️ [VISIBILITY] Tab went to background');
        wasInCallRef.current = !!partnerSocketIdRef.current;

        if (wasInCallRef.current) {
          // Mobile (phone call interruption) → 10s grace
          // Desktop (tab switch) → 6s timeout
          const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
          const timeout = isMobile ? 10000 : 6000;
          console.log(`⏱️ [VISIBILITY] ${timeout / 1000}s timer started (${isMobile ? 'mobile' : 'desktop'})`);

          inactivityTimerRef.current = setTimeout(() => {
            console.log('⏱️ [VISIBILITY] Timer expired — auto-disconnecting');

            // Notify backend → partner gets moved to waiting
            if (socketRef.current && partnerSocketIdRef.current) {
              socketRef.current.emit('user_inactive_disconnect', {
                userId: userIdRef.current,
                partnerId: partnerSocketIdRef.current,
                reason: 'inactive_timeout'
              });
            }

            // Close peer connection
            if (peerConnectionRef.current) {
              peerConnectionRef.current.close();
              peerConnectionRef.current = null;
            }
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }

            // Reset UI → Home screen instead of reconnecting while in background
            setHasPartner(false);
            setPartnerFound(false);
            setIsConnected(false);
            setPartnerInfo(null);
            setMessages([]);
            setConnectionTime(0);
            setIsSearching(false); // 🛑 DO NOT auto-search while in background
            wasInCallRef.current = false;
          }, timeout);
        }
      } else if (document.visibilityState === 'visible') {
        // User came back — cancel timer if still running
        console.log('👁️ [VISIBILITY] Tab returned to foreground');
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
          console.log('✅ [VISIBILITY] Timer cleared — call continues');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  const startVideoChat = useCallback(async (isForced = false) => {
    // 🛑 DEBUG USER DATA (Requested by user)
    console.log("USER DATA:", user);

    // 🔄 FRESH PROFILE CHECK: Always get latest premium status from backend
    // This prevents stale localStorage cache from blocking premium users
    let freshUser = user;
    let profileFetchOk = false;
    if (refreshProfile) {
      try {
        console.log('🔄 [FRESH CHECK] Fetching latest profile before skip limit check...');
        const result = await refreshProfile();
        if (result?.success && result?.user) {
          freshUser = result.user;
          profileFetchOk = true;
          console.log('🔄 [FRESH CHECK] Got fresh data:', {
            isPremium: freshUser.isPremium,
            hasUnlimitedSkip: freshUser.hasUnlimitedSkip,
            daily_skip_count: freshUser.daily_skip_count
          });
        }
        if (result?.status === 400) {
          console.warn('🔄 [FRESH CHECK] /api/profile returned 400. Disabling client-side skip limit popup.', result);
        }
      } catch (err) {
        console.warn('🔄 [FRESH CHECK] Failed (using cached data):', err.message);
      }
    }

    // 🛑 SKIP LIMIT ENFORCEMENT - Uses fresh data from backend
    const skipLimit = 120;
    // Safety: If /api/profile fails, do NOT treat the user as free/premium on the client.
    // Backend will always enforce limits and will NEVER emit `skip_limit_reached` for premium users.

    // ✅ CRITICAL FIX: Properly check for "Unlimited Skip" plan in fresh user data
    const freshUnlimitedSkipExpiresAt = freshUser?.unlimitedSkipExpiresAt || freshUser?.unlimited_skip_expires_at;
    const isPremiumUser = !!(
      freshUser?.isPremium ||
      freshUser?.is_premium ||
      (freshUser?.hasUnlimitedSkip || freshUser?.has_unlimited_skip) &&
      (!freshUnlimitedSkipExpiresAt || new Date(freshUnlimitedSkipExpiresAt).getTime() > Date.now())
    );

    // ✅ Premium/Unlimited Skip users bypass skip limit check entirely
    if (isPremiumUser) {
      console.log('💎 [PREMIUM] Bypassing skip limit check for premium/unlimited user');
    } else {
      // ❌ Only free users check skip limit
      const skipCount = freshUser?.daily_skip_count || 0;
      if (freshUser && skipCount >= skipLimit) {
        console.log('🚫 [LIMIT] Free user reached skip limit (Block on Start Matching).', { skipCount, skipLimit });
        setPremiumPopupMessage("skip_limit");
        setShowPremiumPopup(true);
        return; // STOP STARTCHAT FROM EXECUTING
      }
    }

    // ✅ Premium Popup Logic - Show only once per user account (database-backed)
    // DO NOT show this promotional popup if the user is already premium!
    if (!isForced && !isPremiumUser && user && user.hasSeenPremiumPopup !== true) {
      console.log('🛡️ [PREMIUM POPUP] Showing modal (condition: user && user.hasSeenPremiumPopup !== true)');
      setShowPremiumPopup(true);
      return;
    }

    console.log('🎬 [BUTTON CLICK] "Start Video Chat" button clicked (PROCEEDING TO CHAT)');

    // First click: Initialize camera only (no matching yet)
    if (!cameraStarted) {
      console.log('🎬 [BUTTON CLICK] First click - initializing camera');
      console.log('🎬 [BUTTON CLICK] Checking if camera request already in progress...');

      // Prevent multiple simultaneous requests
      if (isRequestingCamera) {
        console.warn('⚠️ Camera request already in progress');
        return;
      }

      try {
        setIsRequestingCamera(true);
        setIsLoading(true);
        console.log('🎬 [BUTTON CLICK] isRequestingCamera=true, isLoading=true, calling startCamera()...');

        // Call the new startCamera function
        await startCamera();
        console.log('🎬 [BUTTON CLICK] startCamera() completed successfully');

        // Set camera started flag - shows preview on home screen
        console.log('🎬 [START] Setting cameraStarted = true (camera preview now showing)');
        setCameraStarted(true);
        setIsRequestingCamera(false);
        setIsLoading(false);

        console.log('🎬 [START] ✅ Camera initialized - user is still on home screen, matching NOT started yet');
      } catch (error) {
        console.error('❌ Error initializing camera:', error);
        setIsRequestingCamera(false);
        setIsLoading(false);

        // Handle specific error types
        if (error.name === 'NotAllowedError') {
          console.warn('⚠️ Camera permission denied by user');
        } else if (error.name === 'NotFoundError') {
          console.warn('⚠️ No camera device found');
        } else if (error.name === 'NotReadableError') {
          console.warn('⚠️ Camera device is already in use by another application');
        }
      }
    }
    // Second click: Start searching ONLY (do NOT touch camera)
    else if (cameraStarted && !isSearching) {
      console.log('🎬 [SEARCHING] User clicked "Start Video Chat" again - starting search');
      console.log('🎬 [SEARCHING] ⚠️ NOT reinitializing camera - stream already active');
      console.log('CLICKED Start Video Chat'); // 🧪 DEBUG: Confirm handler runs

      // 🛑 DOUBLE-CHECK: Re-verify skip limit using latest user state
      // This catches cases where the user's skip count was incremented AFTER the initial check
      const currentSkipCount = freshUser?.daily_skip_count || 0;
      if (!isPremiumUser && freshUser && currentSkipCount >= skipLimit) {
        console.log('🚫 [LIMIT] Free user reached skip limit (Block on 2nd click Start Matching).', { currentSkipCount, skipLimit });
        setPremiumPopupMessage("skip_limit");
        setShowPremiumPopup(true);
        return; // BLOCK EXECUTION
      }

      // 🛑 CRITICAL: Reset cancelled flag for fresh search session
      searchCancelledRef.current = false;

      console.log('🎬 [STATE BEFORE] isSearching:', isSearching, 'partnerFound:', partnerFound);

      // EMIT SOCKET EVENT FIRST (synchronous, immediate)
      socketRef.current?.emit('find_partner', {
        userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
        userName: currentUser.name || 'Anonymous',
        userAge: currentUser.age || 18,
        userLocation: currentUser.location || userLocationRef.current || 'Unknown',
        userPicture: currentUser.picture || null,  // Include picture so partner can display it
        connectionScore: connectionScoreRef.current
      });

      console.log('🎬 [SEARCHING] ✅ find_partner event emitted immediately');

      // THEN UPDATE STATE (allow batching)
      setIsSearching(true);
      setPartnerFound(false);
      setIsLoading(true);
      // ✅ Clear any leftover messages from previous chat session
      setMessages([]);
      setMessageInput('');

      console.log('🎬 [STATE AFTER] Calling setIsSearching(true)');
      console.log('STATE AFTER START SEARCH:', { isStarting: true, isSearching: true, partnerFound: false });
    }
  }, [cameraStarted, isSearching, isRequestingCamera, startCamera, setShowPremiumPopup, user?.hasSeenPremiumPopup, user?.isPremium, user?.hasUnlimitedSkip, user?.daily_skip_count, user]);

  // ✅ Stable cancel search handler - memoized to prevent unnecessary re-renders
  const handleCancelSearch = useCallback(() => {
    console.log('🛑 [CANCEL] User cancelled search');

    // 🛑 CRITICAL: Set cancelled flag FIRST to prevent any pending requeue from firing
    searchCancelledRef.current = true;

    // 🛑 Clear any pending requeue timer
    if (requeueTimerRef.current) {
      clearTimeout(requeueTimerRef.current);
      requeueTimerRef.current = null;
      console.log('🛑 [CANCEL] Cleared pending requeue timer');
    }

    // 1. Emit socket event to remove from backend queue (BOTH queue systems)
    socketRef.current?.emit("cancel_matching", { userId: userIdRef.current });
    // Also emit match:cancel for the matchingHandlers.js queue system
    socketRef.current?.emit("match:cancel", { userId: userIdRef.current });

    // 2. CRITICAL: Reset searching/matching state → return to dashboard
    //    But do NOT stop camera — keep it running for the dashboard preview
    setIsSearching(false);
    setIsLoading(false);
    setPartnerFound(false);
    setHasPartner(false);
    setIsConnected(false);
    setPartnerInfo(null);
    setMessages([]);
    setConnectionTime(0);

    // 3. Close any active peer connection (but keep camera stream alive)
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // 4. Clear remote video only (NOT local camera)
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // 5. Reset skip in-flight guard
    skipInFlightRef.current = false;

    // NOTE: Camera stays running (cameraStarted stays true, localStreamRef untouched)
    // User can click "Start Video Chat" again to re-enter search immediately
    console.log('✅ [CANCEL] Search cancelled — returned to dashboard (camera still active)');
  }, []);


  const sendMessage = useCallback(() => {
    if (messageInput.trim() === '' || !hasPartner) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    socketRef.current?.emit('send_message', {
      message: messageInput,
      to: partnerSocketIdRef.current   // 🔥 CRITICAL - Route to partner socket
    });
    setMessageInput('');
  }, [messageInput, hasPartner]);

  const endChat = useCallback(async (shouldRequeue = true) => {
    // 📱 CRITICAL: Set isSearching FIRST so waiting screen overlay is visible
    // BEFORE we remove the video chat overlay (partnerFound=false).
    // This prevents the 1-2 second dashboard flash on mobile.
    if (shouldRequeue) {
      setIsSearching(true);
    }

    setHasPartner(false);
    setPartnerFound(false);  // ✅ Hide video chat screen (waiting screen already visible above)
    setIsConnected(false);
    setPartnerInfo(null);
    setMessages([]);
    setConnectionTime(0);

    if (setIncomingFriendRequest) setIncomingFriendRequest(null);  // ✅ Null-safe

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear remote video
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // 📱 MOBILE CAMERA FREEZE FIX: Refresh local stream on mobile before re-queue
    // This prevents the local camera from freezing after 3-4 skips
    if (shouldRequeue && window.innerWidth < 769) {
      await refreshLocalStream();
    }

    if (shouldRequeue) {
      // Look for new partner (do NOT stop camera - reuse same stream)
      socketRef.current?.emit('find_partner', {
        userId: userIdRef.current,
        userName: currentUser?.name || 'Anonymous',
        userAge: currentUser?.age || 18,
        userLocation: currentUser?.location || userLocationRef.current || 'Unknown'
      });
    } else {
      setIsSearching(false);
      setIsLoading(false);
      // Effectively "Redirect to Dashboard"
      console.log('🏠 [DASHBOARD] Redirecting to home state (IntroScreen)');
    }
  }, [currentUser, setIncomingFriendRequest, refreshLocalStream]);

  const skipUser = useCallback(() => {
    // 📱 MOBILE FIX: Debounce skip button (1200ms on mobile, 500ms on desktop)
    // Mobile browsers need more time to release and reacquire camera hardware
    const now = Date.now();
    const isMobileDevice = window.innerWidth < 769;
    const debounceMs = isMobileDevice ? 1200 : 500;
    if (now - lastSkipTimeRef.current < debounceMs) {
      console.log(`⏳ [SKIP] Debounced — too fast (${debounceMs}ms), ignoring (mobile stability)`);
      return;
    }
    lastSkipTimeRef.current = now;

    // 🛑 Client-side skip limit check
    const skipLimit = 120;

    const unlimitedSkipExpiresAtMs = (() => {
      const expiresAt =
        user?.unlimitedSkipExpiresAt ||
        user?.unlimited_skip_expires_at;
      if (!expiresAt) return null; // NULL means potentially perpetual or manually set
      const ms = new Date(expiresAt).getTime();
      return Number.isNaN(ms) ? null : ms;
    })();

    // ✅ CRITICAL FIX: Allow null expiry date for unlimited skip (matches backend logic)
    const isUnlimitedSkipActive = !!(
      (user?.hasUnlimitedSkip || user?.has_unlimited_skip) &&
      (unlimitedSkipExpiresAtMs === null || unlimitedSkipExpiresAtMs > Date.now())
    );

    const isPremiumUser = !!(user?.isPremium || user?.is_premium || isUnlimitedSkipActive);
    const skipCount = user?.daily_skip_count || 0;
    const reachedLimit = !!(user && !isPremiumUser && skipCount >= skipLimit);

    if (reachedLimit) {
      console.log('🚫 [SKIP] Client-side limit reached for free user.', { skipCount, skipLimit });
      setPremiumPopupMessage("skip_limit");
      setShowPremiumPopup(true);

      // 🛑 CRITICAL: Still notify partner they were skipped, even if limit reached!
      // Without this, the partner stays stuck in video chat forever
      if (partnerSocketIdRef.current) {
        socketRef.current?.emit('skip_user', {
          partnerSocketId: partnerSocketIdRef.current,
          userId: userIdRef.current
        });
        console.log('📢 [SKIP] Notified partner before ending (limit reached)');
      }

      endChat(false); // stop re-queueing
      return;
    }

    if (skipInFlightRef.current) {
      console.log('⏳ [SKIP] Skip request already in-flight, ignoring extra click');
      return;
    }
    skipInFlightRef.current = true;

    // Emit skip event (use server ack to avoid race/UI mismatch)
    socketRef.current?.emit(
      'skip_user',
      { partnerSocketId: partnerSocketIdRef.current, userId: userIdRef.current },
      (resp) => {
        skipInFlightRef.current = false;
        const canSkip = !!resp?.canSkip;
        const isPremium = !!resp?.isPremium;
        const backendSkipCount = resp?.skipCount ?? skipCount;
        const backendLimit = resp?.limit ?? skipLimit;

        if (!canSkip) {
          // Only show popup when it's truly a free-user limit block
          const shouldShow = !isPremium && backendSkipCount >= backendLimit;
          if (shouldShow) {
            setPremiumPopupMessage("skip_limit");
            setShowPremiumPopup(true);
            endChat(false); // stop re-queueing
          }
          return;
        }

        // Successful skip: consume local counter (best-effort)
        if (incrementSkipCount) incrementSkipCount();
        
        // 🛑 CHECK: After incrementing, has the user now reached the limit?
        // If so, show popup and DON'T re-queue
        const newSkipCount = (user?.daily_skip_count || 0) + 1; // predicted count after increment
        const isStillPremium = !!(user?.isPremium || user?.is_premium || isUnlimitedSkipActive);
        if (!isStillPremium && newSkipCount >= skipLimit) {
          console.log('🚫 [SKIP] Free user has now used their last skip. Showing popup.', { newSkipCount, skipLimit });
          setPremiumPopupMessage("skip_limit");
          setShowPremiumPopup(true);
          endChat(false); // go to dashboard, DON'T re-queue
        } else {
          endChat(true); // re-queue for next match
        }
      }
    );
  }, [user, incrementSkipCount, endChat]);

  // ✅ SEND FRIEND REQUEST in video mode - Uses AuthContext directly (NOT currentUser state)
  // ⚠️ THIS IS THE OLD HTTP-BASED FLOW - DO NOT USE FROM PROFILE ICON
  // Profile icon should call sendQuickInvite() ONLY, NOT this function
  const sendFriendRequest = useCallback(async () => {
    console.log('\n' + '='.repeat(80));
    console.log('⚠️ ⚠️ ⚠️ [OLD HTTP FRIEND REQUEST] FUNCTION TRIGGERED ⚠️ ⚠️ ⚠️');
    console.log('='.repeat(80));
    console.log('📍 [OLD HTTP FR] This is the SEARCH MODAL flow (HTTP-based)');
    console.log('📍 [OLD HTTP FR] Profile icon should NEVER trigger this function!');

    // ✅ Get sender from AuthContext user (NOT currentUser state which can be null)
    const senderPublicId = user?.publicId || user?.uuid;

    // ✅ Get receiver from partnerInfo - check all possible field names
    console.log('📊 [OLD HTTP FR] Partner Info full object:', JSON.stringify(partnerInfo, null, 2));
    const receiverPublicId = partnerInfo?.partnerId || partnerInfo?.id || partnerInfo?.uuid || partnerInfo?.publicId;

    console.log('📊 [OLD HTTP FR] ========== IDs EXTRACTED ==========');
    console.log('   Friend request sender:', senderPublicId);
    console.log('   Friend request receiver:', receiverPublicId);
    console.log('   Sender source: AuthContext.user');
    console.log('   Receiver source: partnerInfo');
    console.log('📊 [DEBUG] AuthContext user:', {
      uuid: user?.uuid,
      publicId: user?.publicId,
      name: user?.name
    });
    console.log('📊 [DEBUG] Partner Info object keys:', partnerInfo ? Object.keys(partnerInfo) : 'null');

    // ✅ VALIDATION - Don't check currentUser anymore
    if (!senderPublicId) {
      console.error('❌ [VIDEO FR] Sender ID missing - user.uuid/publicId not in AuthContext');
      console.error('   AuthContext user:', user);
      alert('Error: Could not get your user ID from auth');
      return;
    }

    if (!receiverPublicId) {
      console.error('❌ [VIDEO FR] Receiver ID missing - partnerInfo does not have ID fields');
      console.error('   Available partnerInfo fields:', partnerInfo ? Object.keys(partnerInfo) : 'partnerInfo is null');
      console.error('   Full partnerInfo:', partnerInfo);
      alert('Error: Could not get partner ID');
      return;
    }

    const payload = {
      senderPublicId: String(senderPublicId),
      receiverPublicId: String(receiverPublicId)
    };

    console.log('\n📤 [VIDEO FR] ========== API REQUEST ==========');
    console.log('   Endpoint:', `${BACKEND_URL}/api/friends/send`);
    console.log('   Method: POST');
    console.log('   Payload:', payload);
    console.log('   Token exists:', !!localStorage.getItem('token'));

    try {
      const response = await fetch(`${BACKEND_URL}/api/friends/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      console.log('\n📥 [VIDEO FR] ========== API RESPONSE ==========');
      console.log('   Status Code:', response.status);
      console.log('   Status Text:', response.statusText);
      console.log('   OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [VIDEO FR] SUCCESS (200)');
        console.log('   Response Data:', data);
        console.log('✅ [VIDEO FR] Friend request sent successfully!');
      } else {
        const error = await response.json().catch(() => ({}));
        console.error('❌ [VIDEO FR] ERROR (' + response.status + ')');
        console.error('   Error Data:', error);
      }
    } catch (error) {
      console.error('❌ [VIDEO FR] NETWORK ERROR');
      console.error('   Error Name:', error.name);
      console.error('   Error Message:', error.message);
      console.error('   Full Error:', error);
    }

    console.log('='.repeat(80) + '\n');
  }, [user, partnerInfo]);

  // ✅ QUICK INVITE FLOW - Creates REAL friend request via API
  // Shows popup on receiver's screen via socket event
  // Creates database entry so it appears in Friends & Requests panel
  const sendQuickInvite = useCallback(async () => {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 [QUICK INVITE] ========== PROFILE ICON FRIEND REQUEST ==========');
    console.log('='.repeat(80));

    // ✅ Cooldown check for 15 seconds
    if (connectionTime < 15) {
      const remainingSeconds = 15 - connectionTime;
      setToastMessage(`⏳ Wait ${remainingSeconds}s to add friend`);
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }

    // ✅ Get sender from AuthContext user
    const senderPublicId = user?.publicId || user?.uuid;

    // ✅ Get receiver from partnerInfo
    const receiverPublicId = partnerInfo?.partnerId || partnerInfo?.id || partnerInfo?.uuid || partnerInfo?.publicId;

    console.log('📊 [QUICK INVITE] IDs:');
    console.log('   Sender:', senderPublicId?.substring(0, 8) + '...');
    console.log('   Receiver:', receiverPublicId?.substring(0, 8) + '...');

    // ✅ VALIDATION
    if (!senderPublicId) {
      console.error('❌ Sender ID missing');
      alert('Error: Could not get your user ID');
      return;
    }

    if (!receiverPublicId) {
      console.error('❌ Receiver ID missing');
      alert('Error: Could not get partner ID');
      return;
    }

    try {
      // ✅ CALL API TO CREATE REAL FRIEND REQUEST (database entry)
      console.log('\n📤 [QUICK INVITE] Calling /api/friends/send...');
      console.log('   Type: PERSISTENT request (WITH database entry)');

      const response = await fetch(`${BACKEND_URL}/api/friends/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          senderPublicId: String(senderPublicId),
          receiverPublicId: String(receiverPublicId)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [QUICK INVITE] API Error:', errorData);
        // Show error as toast instead of alert
        const msg = errorData.error || 'Could not send request';
        if (msg.includes('already accepted') || msg.includes('already friends')) {
          setIsPartnerFriend(true); // ✅ They are already friends
          setToastMessage('Already friends! 💛');
        } else if (msg.includes('already') || msg.includes('pending')) {
          setToastMessage('Request already sent');
        } else {
          setToastMessage(msg);
        }
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }

      const data = await response.json();
      console.log('✅ [QUICK INVITE] Request created:', data);
      console.log('   Request ID:', data.requestId);
      console.log('   Status: SAVED TO DATABASE');
      console.log('   Will appear in Friends & Requests panel');

      // ✅ Show "Request Sent" toast for 3 seconds
      setToastMessage('Request Sent');
      setTimeout(() => setToastMessage(null), 3000);

      // ✅ CRITICAL FIX: Refresh sent requests immediately after sending
      // This ensures the request appears in Friends & Requests modal right away
      // Instead of waiting for the 5-second polling interval
      console.log('🔄 [QUICK INVITE] Refreshing sent requests to show new request immediately...');
      if (refreshSentRequests) {
        await refreshSentRequests();
        console.log('✅ [QUICK INVITE] Sent requests refreshed - new request should now appear in Friends & Requests');
      } else {
        console.warn('⚠️ [QUICK INVITE] refreshSentRequests not available in AuthContext');
      }

    } catch (error) {
      console.error('❌ [QUICK INVITE] Error:', error.message);
    }

    console.log('='.repeat(80) + '\n');
  }, [user, partnerInfo, BACKEND_URL, refreshSentRequests, connectionTime]);

  // ✅ FRIEND REQUEST POPUP HANDLERS - Shown ONLY on video chat screen
  const handleAcceptFriendRequest = async (requestId) => {
    console.log('✅ [Chat] Accepting friend request:', requestId);
    try {
      const { acceptFriendRequest } = await import('../services/api');
      await acceptFriendRequest(requestId);
      console.log('✅ [Chat] Request accepted');
      setIncomingFriendRequest(null);

      // ✅ Show "Now you are friends" toast for both users
      showToast('Now you are friends! 🎉');
      // ✅ DO NOT call refreshNotifications() here
      // AuthContext polling will update her notifications in 5 seconds
      // Popup is local to video chat screen only
    } catch (error) {
      console.error('❌ [Chat] Error accepting request:', error);
    }
  };

  const handleRejectFriendRequest = async (requestId) => {
    console.log('✅ [Chat] Rejecting friend request:', requestId);
    try {
      const { rejectFriendRequest } = await import('../services/api');
      await rejectFriendRequest(requestId);
      console.log('✅ [Chat] Request rejected');
      setIncomingFriendRequest(null);
      // ✅ DO NOT call refreshNotifications() here
      // AuthContext polling will update her notifications in 5 seconds
      // Popup is local to video chat screen only
    } catch (error) {
      console.error('❌ [Chat] Error rejecting request:', error);
    }
  };

  // ✅ FRIEND REQUESTS NOW HANDLED GLOBALLY
  // Removed polling function, handlers, and inline modal
  // GlobalFriendRequestPopup handles all incoming requests via socket events
  // and displays them as a non-blocking toast notification from any screen

  // ✅ Setup WebRTC Answer for Answerer
  const setupWebRTCAnswer = async (data) => {
    console.log('📞 [setupWebRTCAnswer] Starting WebRTC answer setup');

    try {
      // CRITICAL: Create peer connection if it doesn't exist
      if (!peerConnectionRef.current) {
        console.log('📍 ANSWERER: Creating new peer connection for the first time');
        let pc;
        try {
          pc = await createPeerConnection();
        } catch (pcErr) {
          console.error('❌ ANSWERER: Error creating peer connection:', pcErr);
          return;
        }
        peerConnectionRef.current = pc;
        console.log('✅ ANSWERER: Peer connection created');
      } else {
        console.log('⚠️ ANSWERER: WARNING - peerConnectionRef already exists (should be null for answerer)');
      }

      // ========================================
      // CRITICAL: ALWAYS add tracks - NOT conditional
      // ========================================
      console.log('\n🔍 ANSWERER: ALWAYS executing track addition logic');
      console.log('👤 ANSWERER: Checking localStreamRef.current...');

      // ✅ CRITICAL DEFENSIVE CHECK: Verify and reacquire stream if missing
      if (!localStreamRef.current) {
        console.warn('⚠️ ANSWERER: localStreamRef.current is NULL - attempting emergency reacquisition');
        try {
          const emergencyStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640, max: 640 }, height: { ideal: 480, max: 480 }, frameRate: { ideal: 24, max: 30 } },
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
          });
          localStreamRef.current = emergencyStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = emergencyStream;
            localVideoRef.current.muted = true;
            localVideoRef.current.play().catch(() => { });
          }
          console.log('✅ ANSWERER: Emergency stream acquired');
        } catch (emergencyErr) {
          console.error('❌ ANSWERER: Emergency stream failed:', emergencyErr.message);
          throw new Error('ANSWERER: Cannot reacquire camera - ' + emergencyErr.message);
        }
      }

      if (localStreamRef.current) {
        console.log('\n✅ ANSWERER: localStream EXISTS - will add tracks');
        const allTracks = localStreamRef.current.getTracks();
        console.log('👤 ANSWERER: getAllTracks() returned:', allTracks);
        console.log('👤 ANSWERER: Track array length:', allTracks.length);

        // ✅ CRITICAL: Check if tracks already added to avoid duplicate senders
        const existingSenders = peerConnectionRef.current.getSenders();
        console.log('📤 ANSWERER: Existing senders count:', existingSenders.length);
        if (existingSenders.length > 0) {
          console.warn('⚠️ ANSWERER WARNING: Tracks already added! Senders:', existingSenders.map(s => ({ kind: s.track?.kind, id: s.track?.id })));
        } else {
          console.log(`\n📹 ANSWERER: Attempting to add ${allTracks.length} local tracks to peer connection`);
          let successCount = 0;
          let failureCount = 0;

          allTracks.forEach((track, idx) => {
            console.log(`  [${idx}] About to add ${track.kind} track (id: ${track.id}, enabled: ${track.enabled})`);
            try {
              const sender = peerConnectionRef.current.addTrack(track, localStreamRef.current);
              console.log(`  [${idx}] ✅ addTrack SUCCEEDED`);
              successCount++;
            } catch (addTrackErr) {
              console.error(`  [${idx}] ❌ addTrack FAILED`);
              console.error(`  [${idx}] Error:`, addTrackErr.message);
              failureCount++;
            }
          });

          console.log(`\n✅ ANSWERER: Track addition complete (${successCount} succeeded, ${failureCount} failed)`);
        }
      } else {
        console.error('\n❌ ANSWERER: CRITICAL ERROR - localStreamRef.current is NULL!');
        throw new Error('ANSWERER: No local stream - cannot add tracks');
      }

      console.log('\n🔄 ANSWERER: Setting remote description (offer from offerer)');
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      console.log('✅ ANSWERER: Remote description set successfully');

      // ✅ NOW it's safe to flush buffered ICE candidates
      while (iceCandidateBufferRef.current.length > 0) {
        const bufferedCandidate = iceCandidateBufferRef.current.shift();
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(bufferedCandidate)
          );
        } catch (err) {
          // Candidate may have already been processed or is invalid
        }
      }

      console.log('🎬 ANSWERER: Creating answer');
      const answer = await peerConnectionRef.current.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      });
      console.log('✅ ANSWERER: Answer created with receive constraints');

      console.log('🔄 ANSWERER: Setting local description (answer)');
      await peerConnectionRef.current.setLocalDescription(answer);
      console.log('✅ ANSWERER: Local description set successfully');

      // ✅ CRITICAL: Flush buffered ICE candidates after local description is set
      while (iceCandidateBufferRef.current.length > 0) {
        const bufferedCandidate = iceCandidateBufferRef.current.shift();
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(bufferedCandidate)
          );
        } catch (err) {
          // Candidate may have already been processed or is invalid
        }
      }

      console.log('\n📋 ===== ANSWERER SENDING ANSWER =====');
      const finalSenders = peerConnectionRef.current.getSenders();
      console.log('📤 ANSWERER: Final senders count:', finalSenders.length);
      console.log('📤 ANSWERER: Sending answer with tracks:', finalSenders.map(s => ({
        kind: s.track?.kind,
        id: s.track?.id,
        enabled: s.track?.enabled
      })));

      socketRef.current?.emit('webrtc_answer', {
        answer: peerConnectionRef.current.localDescription,
        to: data.from
      });
      console.log('📤 ANSWERER: Answer emitted to offerer via socket:', data.from);
      console.log('📋 ===== ANSWERER ANSWER SENT =====\n\n');
    } catch (err) {
      console.error('\n❌ ANSWERER: ERROR in setupWebRTCAnswer:', err);
      console.error('❌ ANSWERER: Error message:', err.message);
      console.error('❌ ANSWERER: Stack trace:', err.stack);
      setHasPartner(false);
    }
  };


  // Stop camera tracks - ONLY called when user explicitly ends session or logs out
  const stopCameraStream = () => {
    console.log('🎥 Stopping camera stream - user ended session');
    if (localStreamRef.current) {
      console.log('🎥 Stopping all local media tracks');
      localStreamRef.current.getTracks().forEach(track => {
        console.log('🎥 Stopping track:', track.kind);
        track.stop();
      });
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setIsLocalCameraReady(false);  // Reset camera ready state
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up chat session');

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset state
    setCameraStarted(false);
    setHasPartner(false);
    setIsConnected(false);
    setMessages([]);
    setConnectionTime(0);
  };

  // Waiting Screen Component - Premium Design with animations
  // ✅ WAITING SCREEN - Normal component (not memoized) to receive state updates
  // ✅ STEP 4: Video element STABLE rakho - Already in Dashboard component
  // Video element is in the camera-frame div (lines ~1680)
  // No need for GlobalLocalVideo - video is already properly placed

  // ✅ Create stable ref callbacks to prevent blinking
  const localVideoRefCallback = useCallback((el) => {
    if (el && localStreamRef.current) {
      // 📱 MOBILE FIX: Always check if stream tracks are still live
      // After refreshLocalStream(), the old srcObject's tracks are stopped
      const currentSrc = el.srcObject;
      const needsReattach = !currentSrc ||
        currentSrc !== localStreamRef.current ||
        currentSrc.getTracks().some(t => t.readyState === 'ended');

      if (needsReattach) {
        console.log('🎥 LOCAL VIDEO: Attaching fresh local stream to ref');
        el.srcObject = localStreamRef.current;
        el.muted = true;
        el.play().catch(() => { });
      }
    }
    localVideoRef.current = el;
    console.log('📍 LOCAL VIDEO REF: Set, srcObject:', el?.srcObject?.id || 'null');
  }, []);

  const remoteVideoRefCallback = useCallback((el) => {
    if (!el) {
      remoteVideoRef.current = null;
      return;
    }

    // Store the ref
    remoteVideoRef.current = el;

    // ✅ CRITICAL FIX: If stream already exists on peerConnection, attach it IMMEDIATELY
    const remoteStream = peerConnectionRef.current?._remoteStream;
    if (remoteStream && remoteStream.getTracks().length > 0) {
      if (el.srcObject !== remoteStream) {
        console.log('📺 REF CALLBACK: Attaching remote stream immediately');
        el.srcObject = remoteStream;
        el.muted = false;

        // 🔥 AGGRESSIVE PLAY: Try multiple times to play
        const attemptPlay = async () => {
          try {
            const playPromise = el.play();
            if (playPromise && typeof playPromise.then === 'function') {
              await playPromise;
              console.log('✅ Remote video playing from ref callback');
            }
          } catch (err) {
            console.warn('⚠️ Play from ref callback failed:', err.name);
            // Retry once more
            setTimeout(() => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.play().catch(() => { });
              }
            }, 100);
          }
        };

        attemptPlay();
      } else {
        console.log('📺 REF CALLBACK: Stream already attached');
      }
    }
  }, []);

  // ✅ Monitor remote video srcObject changes
  useEffect(() => {
    if (!remoteVideoRef.current) {
      return;
    }

    const checkInterval = setInterval(() => {
      const video = remoteVideoRef.current;
      if (!video) return;

      // Silently monitor without logging every 2 seconds
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [hasPartner]);

  // ✅ REMOVED useMemo - use direct conditional render to avoid TDZ in minified code
  const renderVideoChatScreen = () => {
    // CRITICAL DEBUG: Log partnerInfo to diagnose display issue
    console.log('🎬 VideoChatScreen rendering - partnerInfo:', {
      exists: !!partnerInfo,
      userName: partnerInfo?.userName,
      userLocation: partnerInfo?.userLocation,
      picture: !!partnerInfo?.picture,
      fullObject: partnerInfo
    });
    console.log('🎬 currentUser for comparison:', {
      name: currentUser?.name,
      location: currentUser?.location,
      picture: !!currentUser?.picture
    });

    // ✅ AUTH CHECK (after all hooks) - Don't render chat until auth is ready
    if (!user?.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
      console.log('⏳ Chat: Waiting for valid user UUID from AuthContext...');
      return (
        <div style={{ width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: '18px', marginBottom: '16px' }}>Loading...</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Initializing authentication...</div>
          </div>
        </div>
      );
    }

    return (
      <>
        <style>{`
          :root {
            --luxury-gold: #c5a059;
            --gold-glow: rgba(197, 160, 89, 0.25);
          }
          body {
            font-family: 'Inter', sans-serif;
            background-color: #000000;
          }
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          }
          .premium-panel-container {
            overflow: visible !important;
            position: relative;
          }
          .premium-gold-panel {
            border: 2px solid var(--luxury-gold);
            box-shadow: 0 0 12px 1px var(--gold-glow);
            z-index: 10;
          }
          .inner-content-radius {
            border-radius: calc(1rem - 2px);
          }
          @media (max-width: 768px) {
            .main-layout {
              flex-direction: column !important;
              padding: 0.5rem !important;
              gap: 0.5rem !important;
              overflow: hidden !important;
            }
            .panel-top {
              flex: 1 1 40% !important;
              height: 40% !important;
              width: 100% !important;
              min-height: 0;
            }
            .panel-bottom {
              flex: 1 1 40% !important;
              height: 40% !important;
              width: 100% !important;
              min-height: 0;
            }
            .user-header {
              padding: 0.75rem !important;
              gap: 0.5rem !important;
            }
            .user-header h2 {
              font-size: 13px !important;
            }
            .user-header span {
              font-size: 9px !important;
            }
            .user-header button {
              width: 28px !important;
              height: 28px !important;
            }
            .user-header button .material-symbols-outlined {
              font-size: 16px !important;
            }
            .size-10 {
              width: 28px !important;
              height: 28px !important;
            }
            .panel-top {
              order: 1;
            }
            .panel-bottom {
              order: 2;
            }
            .panel-top .video-container {
              display: block !important;
            }
            .panel-top .chat-messages {
              display: none !important;
            }
            .panel-bottom .chat-messages {
              display: flex !important;
            }
            .panel-bottom .video-container {
              display: none !important;
            }
            .panel-top .user-header {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              height: auto !important;
              padding: 16px 24px !important;
              margin: 0 !important;
              border: none !important;
              overflow: visible !important;
              visibility: visible !important;
              z-index: 20 !important;
              background: rgba(0, 0, 0, 0.4) !important;
              backdrop-filter: blur(8px) !important;
            }
            .panel-bottom .user-header {
              display: none !important;
            }
            @media (min-width: 769px) {
              .panel-bottom .user-header {
                height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                overflow: hidden !important;
                visibility: collapse !important;
              }
            }
          }
        `}</style>

        <div className="main-layout flex h-full w-full p-8 gap-8 overflow-visible" style={{ backgroundColor: '#000000', justifyContent: 'center' }}>
          {/* TOP PANEL - Video Feed */}
          <div className="panel-top flex flex-col premium-panel-container" style={{ flex: 'none', width: '40%' }}>
            <div className="flex-1 flex flex-col bg-background-dark rounded-2xl premium-gold-panel relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
              <div className="flex-1 flex flex-col inner-content-radius overflow-hidden relative">
                {/* Header with Partner Info */}
                <header className="user-header flex items-center justify-between p-6 border-b border-white/5 z-20" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                  <div className="flex items-center gap-4">
                    <div className="size-10 md:size-12 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {partnerInfo?.picture ? (
                        <img src={partnerInfo.picture} alt="Partner" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '18px' }}>D</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <h2 style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: 500, margin: '0', lineHeight: '1' }}>
                          {partnerInfo?.userName || 'Partner'}
                        </h2>
                        {partnerInfo?.hasBlueTick && (
                          <img src="/bluetick.png" alt="Verified" style={{ width: '38px', height: '38px', marginLeft: '6px', marginTop: '3px', flexShrink: 0, objectFit: 'contain', verticalAlign: 'middle', display: 'block' }} />
                        )}
                      </div>
                      <span style={{ color: '#c8ba93', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0' }}>
                        {partnerInfo?.userLocation || 'Online'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); if (!isPartnerFriend) sendQuickInvite(); }}
                      title={isPartnerFriend ? 'Already Friends' : 'Add Friend'}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isPartnerFriend ? 'rgba(76, 175, 80, 0.5)' : 'rgba(212, 175, 55, 0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPartnerFriend ? '#4CAF50' : '#d4af37', backgroundColor: isPartnerFriend ? 'rgba(76, 175, 80, 0.1)' : 'transparent', cursor: isPartnerFriend ? 'default' : 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { if (!isPartnerFriend) { e.currentTarget.style.backgroundColor = '#d4af37'; e.currentTarget.style.color = '#000'; } }}
                      onMouseLeave={(e) => { if (!isPartnerFriend) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d4af37'; } else { e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.1)'; e.currentTarget.style.color = '#4CAF50'; } }}
                    >
                      {isPartnerFriend ? (
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>🧑‍🤝‍🧑</span>
                      ) : (
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                      )}
                    </button>
                    <button
                      onClick={() => setShowReportModal(true)}
                      title="Report User"
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4af37'; e.currentTarget.style.color = '#000'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d4af37'; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ pointerEvents: 'none' }}><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
                    </button>
                  </div>
                </header>

                {/* Video Container */}
                <div style={{ flex: '1 1 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  <div className="chat-messages md:flex flex-col items-center justify-center opacity-10 pointer-events-none hidden">
                    <span className="material-symbols-outlined" style={{ fontSize: '100px', color: '#c8ba93' }}>chat_bubble_outline</span>
                  </div>
                  {/* 🛡️ EXPLICIT CSS ENFORCEMENT for Remote Video */}
                  <style>{`
                    .remote-video-feed {
                      transform: scaleX(1) !important;
                      -webkit-transform: scaleX(1) !important;
                      -moz-transform: scaleX(1) !important;
                    }
                  `}</style>
                  {/* Remote Video - Desktop */}
                  <video
                    ref={remoteVideoRefCallback}
                    className="remote-video-feed"
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#000',
                      display: 'block',  // ✅ OPTIMIZATION: Always show - let ontrack control visibility via opacity/visibility
                      opacity: hasPartner ? 1 : 0,  // ✅ Fade in/out without DOM remount
                      visibility: hasPartner ? 'visible' : 'hidden',
                      transition: 'opacity 0.3s ease-in-out',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  />
                  {/* Placeholder when no partner or video loading */}
                  {!hasPartner && (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }}>
                      <span style={{ color: '#999', fontSize: '14px' }}>Waiting for partner video...</span>
                    </div>
                  )}
                </div>

                {/* Skip Button - Bottom Right */}
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 20 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowReportModal(false); skipUser(); }}
                    title="Skip"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d4af37',
                      backgroundColor: '#000000',
                      cursor: 'pointer',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.4)';
                      e.currentTarget.style.borderColor = '#d4af37';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.8)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                  </button>
                </div>

                {/* Branding Logo with Text - Bottom Left Corner */}
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 20, pointerEvents: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    padding: '6px 10px'
                  }}>
                    {/* Logo */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <img
                        src="/favicon.png"
                        alt="Flinxx Logo"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          opacity: 0.9
                        }}
                      />
                    </div>

                    {/* Text Branding */}
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#d4af37',
                      opacity: 0.85,
                      letterSpacing: '0.3px',
                      whiteSpace: 'nowrap'
                    }}>
                      flinxx.in
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM PANEL - Chat/Local Video */}
          <div className="panel-bottom flex flex-col premium-panel-container" style={{ flex: 'none', width: '40%' }}>
            <div className="flex-1 flex flex-col bg-background-dark rounded-2xl premium-gold-panel relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
              <div className="flex-1 w-full h-full relative inner-content-radius overflow-hidden flex flex-col">
                {/* Header for Mobile */}
                <header className="user-header hidden items-center justify-between p-6 border-b border-white/5 z-20" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                  <div className="flex items-center gap-4">
                    <div className="size-10 md:size-12 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {user?.picture ? (
                        <img src={user.picture} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '18px' }}>Y</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h2 style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: 500, margin: '0' }}>
                        {user?.name || 'You'}
                      </h2>
                      <span style={{ color: '#c8ba93', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0' }}>
                        You
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#d4af37'; e.target.style.color = '#000'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#d4af37'; }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                    </button>
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#d4af37'; e.target.style.color = '#000'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#d4af37'; }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>warning</span>
                    </button>
                  </div>
                </header>

                {/* Local Video for Desktop */}
                <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', display: 'block', width: '100%', height: '100%' }}>
                  <video
                    ref={localVideoRefCallback}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#000',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: 'scaleX(-1)'
                    }}
                  />
                  {!isLocalCameraReady && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '12px', top: 0, left: 0, width: '100%', height: '100%' }}>
                      Camera loading...
                    </div>
                  )}
                </div>

                {/* Chat Messages Area */}
                {messages.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '0',
                    right: '0',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 15,
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%)'
                  }}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          padding: '8px 14px',
                          borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          backgroundColor: msg.sender === 'user' ? 'rgba(212, 175, 55, 0.9)' : 'rgba(30, 30, 30, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: msg.sender === 'user' ? '#000' : '#f5f5f5',
                          fontSize: '13px',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input - Clean Transparent Floating Pill */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  zIndex: 20, padding: '0 12px 12px 12px',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '28px',
                    height: '44px',
                    paddingLeft: '18px',
                    paddingRight: '5px',
                    pointerEvents: 'auto'
                  }}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#f5f5f5',
                        fontSize: '14px',
                        fontWeight: 400,
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      style={{
                        width: '36px', height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: messageInput.trim() ? 'rgba(212, 175, 55, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                        color: messageInput.trim() ? '#000' : 'rgba(255, 255, 255, 0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: messageInput.trim() ? 'pointer' : 'default',
                        transition: 'all 0.25s ease',
                        flexShrink: 0
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ FRIEND REQUEST POPUP - Now handled globally by GlobalFriendRequestPopup as a toast */}
        {/* No longer rendering inline modal here - toast shows on top */}

      </>
    );
  };

  return (
    <div style={{ width: '100%', height: '100dvh', position: 'fixed', top: 0, left: 0, overflow: 'hidden', zIndex: 9999 }}>
      {/* 🛡️ Premium Popup Logic */}
      {showPremiumPopup && (
        premiumPopupMessage === "skip_limit" ? (
          <SkipLimitPopup
            isOpen={true}
            onClose={() => {
              setShowPremiumPopup(false);
              setPremiumPopupMessage("");
            }}
            onConfirm={handleBuyNow}
          />
        ) : (
          <PremiumPopup
            isOpen={true}
            message={premiumPopupMessage}
            onClose={async () => {
              console.log('🛡️ [PREMIUM POPUP] Popup closed');
              setShowPremiumPopup(false);
              if (user) await markPremiumPopupAsSeen();
              startVideoChat(true);
            }}
            onConfirm={async () => {
              console.log('🛡️ [PREMIUM POPUP] Popup confirmed');
              setShowPremiumPopup(false);
              if (user) await markPremiumPopupAsSeen();
              startVideoChat(true);
            }}
          />
        )
      )}
      {/* RENDER UI STATE */}

      {/* ✅ CRITICAL FIX: ALWAYS keep IntroScreen mounted (with Camera) */}
      {/* The camera panel is inside IntroScreen, never unmounted */}
      {/* Other screens overlay on top with absolute positioning */}

      {/* Dashboard with Camera - ALWAYS MOUNTED in background */}
      <div className="w-full" style={{ height: '100dvh', overflow: 'hidden', position: 'relative' }}>
        {console.log('🎨 [RENDER] Showing DASHBOARD')}
        <IntroScreen
          user={user}
          isLoading={isLoading}
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          openDuoSquad={openDuoSquad}
          startVideoChat={startVideoChat}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMatchHistoryOpen={isMatchHistoryOpen}
          setIsMatchHistoryOpen={setIsMatchHistoryOpen}
          unreadCount={unreadCount}
          incomingRequests={incomingRequests}
          setIncomingRequests={setIncomingRequests}
          localStreamRef={localStreamRef}
          cameraStarted={cameraStarted}
        >
          {/* ✅ CameraPanel as children - prevents unmounting on prop changes */}
          <CameraPanel videoRef={sharedVideoRef} />
        </IntroScreen>

        {/* WAITING SCREEN - overlays on top (absolute positioning) */}
        {isSearching && (
          <div className="absolute inset-0 z-50">
            {console.log('🎨 [RENDER] Showing WAITING SCREEN')}
            <WaitingScreen
              onCancel={handleCancelSearch}
              localStreamRef={localStreamRef}
              cameraStarted={cameraStarted}
            />
          </div>
        )}
      </div>

      {/* VIDEO CHAT - FULL SCREEN (absolute positioning) */}
      {partnerFound && (
        <div className="absolute inset-0 z-50 w-full h-full">
          {renderVideoChatScreen()}

          {/* ✅ FRIEND REQUEST POPUP - Show ONLY on video chat screen AND NOT if already friends */}
          {incomingFriendRequest && !isPartnerFriend && (
            <FriendRequestPopup
              request={incomingFriendRequest}
              onAccept={handleAcceptFriendRequest}
              onReject={handleRejectFriendRequest}
              onClose={() => setIncomingFriendRequest(null)}
            />
          )}

          {/* ⚠️ REPORT MODAL - Rendered via Portal to document.body */}
          {showReportModal && ReactDOM.createPortal(
            <div
              style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                animation: 'reportFadeIn 0.3s ease-out forwards'
              }}
              onClick={() => setShowReportModal(false)}
            >
              <style>{`
                @keyframes reportFadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes reportSlideUp {
                  from { transform: translateY(20px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
              `}</style>
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '420px',
                  margin: '0 16px',
                  padding: '32px 28px',
                  borderRadius: '24px',
                  background: 'rgba(18, 18, 18, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                  animation: 'reportSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  overflow: 'hidden'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedReason(null);
                  }}
                  style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'none', border: 'none',
                    color: '#9ca3af', fontSize: '22px',
                    cursor: 'pointer', padding: '8px',
                    transition: 'color 0.2s', lineHeight: 1
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  ✕
                </button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>⚠️</div>
                  <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                    Choose a reason to report
                  </h2>
                </div>

                {/* Report Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: '🔞', label: 'Inappropriate Content' },
                    { icon: '🔫', label: 'Violent / Graphic Content' },
                    { icon: '👶', label: 'Underage User' },
                    { icon: '🧑‍🤝‍🧑', label: 'Fake Profile / Gender' },
                    { icon: '😡', label: 'Hate Speech / Abuse' },
                    { icon: '🚫', label: 'Spam / Scam' }
                  ].map((option, idx) => {
                    const isSelected = selectedReason === option.label;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleReport(option.label)}
                        style={{
                          display: 'flex', alignItems: 'center',
                          width: '100%', padding: '14px 20px',
                          backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.15)' : '#1A1A1A',
                          border: `1px solid ${isSelected ? '#d4af37' : '#2a2a2a'}`,
                          borderRadius: '12px',
                          color: isSelected ? '#d4af37' : '#fff',
                          fontSize: '15px', fontWeight: isSelected ? '600' : '500',
                          cursor: 'pointer', transition: 'all 0.2s',
                          textAlign: 'left', gap: '12px',
                          boxShadow: isSelected ? '0 0 12px rgba(212, 175, 55, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#222222';
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                            e.currentTarget.style.boxShadow = '0 0 8px rgba(212, 175, 55, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#1A1A1A';
                            e.currentTarget.style.borderColor = '#2a2a2a';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <span style={{ fontSize: '18px', opacity: isSelected ? 1 : 0.8 }}>{option.icon}</span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {/* Footer Note */}
                <p style={{
                  color: '#9ca3af', fontSize: '12px',
                  textAlign: 'center', marginTop: '20px', marginBottom: 0,
                  padding: '0 16px', lineHeight: '1.5'
                }}>
                  Your report is anonymous. We will review the profile against our community guidelines.
                </p>

                {/* Gold Accent Glow at bottom */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '25%',
                  width: '50%', height: '2px',
                  background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.4), transparent)'
                }} />
              </div>
            </div>,
            document.body
          )}
        </div>
      )}

      {!partnerFound && (
        <>
          {/* ✅ Terms modal – SAFE (no hook violation) */}
          {showTermsModal && (
            <TermsConfirmationModal
              onCancel={handleDashboardTermsCancel}
              onContinue={handleDashboardTermsAccept}
            />
          )}


          {/* Gender Filter Modal */}
          <GenderFilterModal
            isOpen={isGenderFilterOpen}
            onClose={() => setIsGenderFilterOpen(false)}
            currentGender={selectedGender}
            onOpenPremium={() => setIsPremiumOpen(true)}
          />

          {/* Profile Modal */}
          <ProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onOpenPremium={() => setActiveTab('trophy')}
            onReinitializeCamera={async () => {
              if (cameraFunctionsRef.current?.reinitializeCamera) {
                return await cameraFunctionsRef.current.reinitializeCamera();
              }
              return false;
            }}
          />

          {/* Match History Modal */}
          <MatchHistory
            isOpen={isMatchHistoryOpen}
            onClose={() => setIsMatchHistoryOpen(false)}
          />

          {/* ✅ Unified Side Panel for all tabs */}
          <SearchFriendsModal
            isOpen={activeTab !== null && activeTab !== 'trophy'}
            onClose={() => setActiveTab(null)}
            mode={
              activeTab === 'profile' ? 'profile' :
                activeTab === 'search' ? 'search' :
                  activeTab === 'likes' ? 'likes' :
                    activeTab === 'messages' ? 'message' :
                      activeTab === 'timer' ? 'timer' :
                        'notifications'
            }
            onUserSelect={(user) => {
              console.log('Selected user from search:', user);
              // TODO: Navigate to user profile or open chat
            }}
          />

          {/* ✅ Full-Page Subscriptions Modal */}
          {activeTab === 'trophy' && (
            <SubscriptionsPage
              onClose={() => setActiveTab(null)}
            />
          )}

          {/* Guest Session Timeout Modal */}
          {showGuestTimeoutModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">⏱️ Time's Up!</h3>
                <p className="text-white/90 text-center mb-4">
                  Your 2-minute guest preview has ended. Redirecting to login...
                </p>
                <div className="flex items-center justify-center">
                  <div className="animate-spin text-4xl">⟳</div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ FRIEND REQUESTS - Shown as popup ONLY on video chat screen */}
          {/* Popup appears on top of video chat when incoming request arrives */}

        </>
      )}

      {/* ✅ Toast for "Request Sent" / "Now you are friends" - MOVED OUTSIDE OF VIDEO CHAT */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999999,
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1d2b 0%, #2d1f4e 100%)',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.3px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.3)',
            border: '1px solid rgba(212,175,55,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }} onClick={() => {
            setToastMessage(null);
            if(toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          }}>
            {toastMessage.includes('friends') ? '💛' : toastMessage.includes('Wait') ? '' : '✓'} {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
