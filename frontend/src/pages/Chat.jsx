// DEPLOYMENT VERSION: webrtc-stable-streams - Remote stream fix - 2026-01-05
// Last updated: 2026-01-05 - Chat bottom spacing fixes deployed
// BUILD TIMESTAMP: 2026-01-05T10:20:00Z - CHAT LAYOUT FIXES
console.log('🎯 CHAT BUILD: 2026-01-05T10:20:00Z - Chat layout and spacing fixes');
import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDuoSquad } from '../context/DuoSquadContext';
import socket from '../services/socketService';
import MobileWaitingScreen from './MobileWaitingScreen';
import { getIceServers, getMediaConstraints, formatTime, logIceServers } from '../utils/webrtcUtils';
import PremiumModal from '../components/PremiumModal';
import GenderFilterModal from '../components/GenderFilterModal';
import ProfileModal from '../components/ProfileModal';
import MatchHistory from '../components/MatchHistory';
import SearchFriendsModal from '../components/SearchFriendsModal';
import SubscriptionsPage from '../components/SubscriptionsPage';
import TopActions from '../components/TopActions';
import TermsConfirmationModal from '../components/TermsConfirmationModal';
import logo from '../assets/flinxx-logo.svg';
import './Chat.css';

// ✅ MODULE-LEVEL REF HOLDER - Allows CameraPanel to access the ref without prop drilling
// This prevents prop changes from triggering re-renders of CameraPanel
let sharedVideoRef = null;

// ✅ CAMERA PANEL - Defined at MODULE LEVEL with NO PROPS
// React.memo ensures it never re-renders after first render
// Add logging to track mounting/unmounting
const CameraPanel = React.memo(() => {
  // Use useCallback to ensure ref callback is stable and doesn't recreate element
  const videoRefCallback = React.useCallback(el => {
    if (el) {
      sharedVideoRef = el;
    }
  }, []);
  
  // Log mount/unmount to catch if component is being destroyed
  React.useEffect(() => {
    console.log('📹 CameraPanel mounted');
    return () => {
      console.error('❌ CameraPanel unmounting - THIS BREAKS THE STREAM');
    };
  }, []);
  
  return (
    <main className="w-full lg:flex-1 relative bg-refined rounded-3xl overflow-hidden shadow-2xl border-2 border-primary group shadow-glow">
      {/* Camera Frame with Video */}
      <div className="camera-frame w-full h-full">
        {/* Camera Video - Stable element thanks to module-level component */}
        <video
          ref={videoRefCallback}
          className="camera-video"
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#000"
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10"></div>

      {/* You Badge */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
          <span className="text-xs font-semibold tracking-wider text-white/90 uppercase">You</span>
        </div>
      </div>
    </main>
  );
});

// ✅ INTRO SCREEN - Defined at MODULE LEVEL to prevent recreation
// Wrapped with React.memo to ensure it never re-renders unnecessarily
const IntroScreen = React.memo(({ 
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
  children
}) => {
  console.log("Dashboard render");
  
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 769);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop version
  if (!isMobile) {
    return (
      <div className="w-full h-[90vh] flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 relative z-10 p-4 sm:p-6 lg:p-8">
        {/* LEFT PANEL - Flinxx Heading + Buttons */}
        <aside className="w-full lg:flex-1 h-full flex flex-col bg-refined border-2 border-primary rounded-3xl shadow-glow relative transition-all duration-300">
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
                <i className="material-icons-round">person</i>
              )}
            </button>

            {/* Search Icon */}
            <button 
              onClick={() => setActiveTab(activeTab === 'search' ? null : 'search')}
              className="icon-btn"
              title="Search"
            >
              <i className="material-icons-round">search</i>
            </button>

            {/* Likes Icon */}
            <button 
              onClick={() => setActiveTab(activeTab === 'likes' ? null : 'likes')}
              className="icon-btn" 
              title="Likes"
            >
              <i className="material-icons-round">favorite</i>
            </button>

            {/* Messages Icon */}
            <button 
              onClick={() => setActiveTab(activeTab === 'messages' ? null : 'messages')}
              className="icon-btn"
              title="Messages"
            >
              <i className="material-icons-round">chat_bubble</i>
            </button>

            {/* Trophy/Achievements Icon */}
            <button 
              onClick={() => setActiveTab(activeTab === 'trophy' ? null : 'trophy')}
              className="icon-btn"
              title="Achievements"
            >
              <i className="material-icons-round">emoji_events</i>
            </button>

            {/* History/Timer Icon */}
            <button 
              onClick={() => setIsMatchHistoryOpen(!isMatchHistoryOpen)}
              className="icon-btn"
              title="History"
            >
              <i className="material-icons-round">timer</i>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-start space-y-12 relative z-10 pt-8">
            {/* Flinxx Title */}
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-primary tracking-tight drop-shadow-sm select-none">
              Flinxx
            </h1>

            {/* Mode Toggle Buttons */}
            <div className="flex items-center gap-6">
              <button 
                className={`px-8 py-3 rounded-xl font-semibold text-lg shadow-glow transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${activeMode === 'solo' ? 'bg-primary text-black hover:shadow-glow-hover hover:bg-primary-hover' : 'border border-primary text-primary hover:bg-primary/10'}`}
                onClick={() => setActiveMode('solo')}
              >
                SoloX
              </button>
              <button 
                className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${activeMode === 'duo' ? 'bg-primary text-black hover:shadow-glow-hover hover:bg-primary-hover shadow-glow' : 'border border-primary text-primary hover:bg-primary/10'}`}
                onClick={() => {
                  setActiveMode('duo');
                  openDuoSquad();
                }}
              >
                DuoX
              </button>
            </div>

            {/* Start Video Chat Button */}
            <button 
              onClick={startVideoChat}
              disabled={isLoading}
              className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-primary via-[#E5C558] to-primary text-black font-bold text-lg shadow-lg hover:shadow-glow-hover transition-all transform hover:scale-105 overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -translate-x-full"></span>
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-2xl">🎬</span>
                <span>{isLoading ? 'Loading...' : 'Start Video Chat'}</span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="w-full text-center py-4 z-10 mt-auto">
            <p className="text-xs text-gray-500 dark:text-gray-600 font-medium">Premium Video Experience</p>
          </div>
        </aside>

        {/* RIGHT PANEL - Camera Feed (always visible) */}
        {children}
      </div>
    );
  }

  // Mobile version with new design
  return (
    <div className="relative w-full h-screen bg-background-light dark:bg-background-dark flex flex-col transition-colors duration-300 font-body">
      <style>{`
        .text-metallic {
          background: linear-gradient(to bottom, #FDE047, #EAB308, #CA8A04);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-metallic {
          background: linear-gradient(135deg, #b47d04 0%, #EAB308 20%, #FDE047 50%, #EAB308 80%, #b47d04 100%);
          background-size: 200% 200%;
          animation: shine 4s ease-in-out infinite;
        }
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .grid-bg {
          background-size: 24px 24px;
        }
        .shadow-glow-gold {
          box-shadow: 0 0 15px rgba(234, 179, 8, 0.3);
        }
        .shadow-inner-gold {
          box-shadow: inset 0 0 12px rgba(234, 179, 8, 0.1);
        }
      `}</style>

      <div className="absolute inset-0 bg-subtle-grain opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark grid-bg opacity-20 pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none z-0"></div>
      
      <div className="h-6 w-full z-10"></div>

      {/* Header Navigation */}
      <header className="relative z-10 px-6 pt-6 pb-2">
        <nav className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">person</span>
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'search' ? null : 'search')}
            className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">search</span>
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'likes' ? null : 'likes')}
            className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">favorite</span>
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'messages' ? null : 'messages')}
            className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">chat_bubble</span>
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'trophy' ? null : 'trophy')}
            className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">emoji_events</span>
          </button>
          <button 
            onClick={() => setIsMatchHistoryOpen(!isMatchHistoryOpen)}
            className="w-10 h-10 rounded-full border border-gray-400 dark:border-primary/40 flex items-center justify-center text-gray-700 dark:text-[#EAB308] hover:bg-gradient-to-b hover:from-primary hover:to-gold-dark hover:text-black hover:border-transparent hover:shadow-glow-gold transition-all duration-300 shrink-0 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-10">timer</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 pt-8 pb-6 overflow-y-auto no-scrollbar">
        {/* Flinxx Logo */}
        <div className="mb-10 text-center relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
          <h1 className="font-display text-5xl text-metallic drop-shadow-sm tracking-wide relative z-10">Flinxx</h1>
        </div>

        {/* Mode Selection Buttons */}
        <div className="flex gap-4 w-full justify-center mb-10 max-w-[280px]">
          <button 
            onClick={() => setActiveMode('solo')}
            className={`flex-1 ${activeMode === 'solo' ? 'btn-metallic text-gray-900' : 'bg-transparent border border-primary/50 text-gray-800 dark:text-[#EAB308] hover:bg-primary/5 hover:border-primary/80'} font-bold py-3 px-4 rounded-xl shadow-[0_4px_15px_rgba(234,179,8,0.3)] border border-yellow-300/50 transform active:scale-95 transition-all relative overflow-hidden`}
          >
            <span className="relative z-10">SoloX</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          <button 
            onClick={() => {
              setActiveMode('duo');
              openDuoSquad();
            }}
            className={`flex-1 ${activeMode === 'duo' ? 'btn-metallic text-gray-900' : 'bg-transparent border border-primary/50 text-gray-800 dark:text-[#EAB308] hover:bg-primary/5 hover:border-primary/80'} font-bold py-3 px-4 rounded-xl shadow-inner-gold backdrop-blur-sm transform active:scale-95 transition-all`}
          >
            DuoX
          </button>
        </div>

        {/* Start Video Chat Button */}
        <button 
          onClick={startVideoChat}
          disabled={isLoading}
          className="w-full max-w-[280px] btn-metallic text-gray-950 font-bold text-lg py-4 px-6 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] border-t border-yellow-200/50 flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all mb-8 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
          <span className="material-symbols-outlined text-gray-900 text-3xl relative z-10">movie</span>
          <span className="relative z-10">{isLoading ? 'Loading...' : 'Start Video Chat'}</span>
        </button>

        {/* Camera Preview */}
        <div className="w-full flex-1 min-h-[220px] rounded-3xl overflow-hidden relative border border-gray-300 dark:border-primary/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] group">
          {children}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white/90 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-2 border border-white/10 shadow-lg ring-1 ring-white/5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            YOU
          </div>
        </div>
      </main>
    </div>
  );
});

// ✅ WAITING SCREEN - Module-level component (memoized) to prevent recreation on every Chat render
// This prevents the video ref callback from firing repeatedly, which causes flickering
const WaitingScreen = React.memo(({ onCancel, localStreamRef, cameraStarted }) => {
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
  // ✅ Ref callback to attach stream - fires when element mounts, not on every render
  // Module-level component + memoization ensures this fires only once
  const handleWaitingVideoRef = React.useCallback((videoElement) => {
    if (!videoElement) return;
    
    console.log('📺 [WAITING SCREEN] Video element ref callback fired');
    
    // Only attach if stream exists and not already attached
    if (localStreamRef.current && videoElement.srcObject !== localStreamRef.current) {
      console.log('📺 [WAITING SCREEN] ✅ Attaching stream via ref callback');
      videoElement.srcObject = localStreamRef.current;
      videoElement.muted = true;
      
      // Try to play - some browsers require user interaction
      videoElement.play().catch(err => {
        console.warn('📺 [WAITING SCREEN] Play warning:', err.message);
      });
    }
  }, []);  // ✅ EMPTY dependency array - localStreamRef is accessed via closure, not as dependency

  // Force dark mode when visible
  React.useEffect(() => {
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
        <div className="container mx-auto max-w-7xl z-10 w-full h-[85vh] flex flex-col md:flex-row gap-8 items-center">
          {/* Left panel - Camera preview */}
          <div className="w-full md:w-1/2 h-full flex flex-col relative group">
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
                  backgroundColor: '#000'
                }}
              />
              {/* Fallback placeholder if no camera */}
              {!cameraStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
                  <div className="text-zinc-600 dark:text-zinc-700 flex flex-col items-center gap-2">
                    <span className="material-icons-outlined text-6xl opacity-20">videocam_off</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-6 left-6">
                <div className="px-4 py-1.5 rounded-full border border-primary/50 bg-black/60 text-primary text-sm font-medium backdrop-blur-sm shadow-lg">
                  You
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Waiting screen */}
          <div className="w-full md:w-1/2 h-full flex flex-col relative group">
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
                <h1 className="text-3xl md:text-4xl font-bold text-primary gold-text-glow tracking-tight">
                  Looking for a partner...
                </h1>
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
});

const Chat = () => {
  console.log("RENDER START");

  // ✅ Get DuoSquad context (manages state at Layout level to prevent remounting)
  const { activeMode, setActiveMode, handleModeChange, openDuoSquad } = useDuoSquad();

  // ✅ ALL HOOKS FIRST - BEFORE ANY LOGIC OR RETURNS
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext) || {};

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
  const [connectionTime, setConnectionTime] = useState(0);
  const [isSearching, setIsSearching] = useState(false); // 👈 IMPORTANT: Default FALSE
  const [partnerFound, setPartnerFound] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isGenderFilterOpen, setIsGenderFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMatchHistoryOpen, setIsMatchHistoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // 'notification' | 'message' | null
  const [selectedGender, setSelectedGender] = useState('both');
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [isLocalCameraReady, setIsLocalCameraReady] = useState(false);
  
  // ✅ Unified tab state for all side panels
  const [activeTab, setActiveTab] = useState(null); // 'profile' | 'search' | 'likes' | 'messages' | 'trophy' | 'timer' | null

  // Chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create a ref to expose camera functions to child components
  const cameraFunctionsRef = useRef(null);

  // Peer connection reference - keep as ref for internal use only
  const peerConnectionRef = useRef(null);
  
  // CRITICAL: Store current user in a ref - initialize in useEffect only
  const currentUserRef = useRef(null);
  const userIdRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Video and stream refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const streamRef = useRef(null);  // 🔥 Keep track of stream for cleanup
  const partnerSocketIdRef = useRef(null);  // CRITICAL: Store partner socket ID for sending offers/answers

  // Monitor guest session timeout
  const guestSessionTimerRef = useRef(null);
  const [showGuestTimeoutModal, setShowGuestTimeoutModal] = useState(false);

  // 🧪 DEBUG TEST - Check if both "RENDER START" and "HOOKS DONE" appear in console
  console.log("HOOKS DONE");

  // ✅ HARD BLOCK: Don't render anything until auth is ready
  if (!user?.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
    console.log('⏳ Chat: Waiting for valid user UUID from AuthContext...');
    return null;
  }
  // ✅ CAMERA INIT - MOVE THIS TO FIRST useEffect SO IT RUNS IMMEDIATELY
  useEffect(() => {
    let isMounted = true;
    
    const startCamera = async () => {
      try {
        // ✅ STEP 1: Stream ko useRef me lock karo - sirf pehli baar
        if (!localStreamRef.current) {
          console.log('📹 [CAMERA INIT] Requesting camera permissions from browser...');
          
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: true
          });
          
          if (!isMounted) {
            console.log('📹 [CAMERA INIT] Component unmounted, cleaning up stream');
            stream.getTracks().forEach(t => t.stop());
            return;
          }
          
          localStreamRef.current = stream;
          streamRef.current = stream;
          console.log('📹 [CAMERA INIT] ✅ Camera stream obtained');
          console.log('📹 [CAMERA INIT] Active tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
        } else {
          console.log('📹 [CAMERA INIT] Stream already exists - reusing existing stream');
        }

        // ✅ Wait a tick to ensure ref is attached
        await new Promise(resolve => setTimeout(resolve, 0));
        
        if (!isMounted) return;
        
        // ✅ STEP 4: Attach stream to video element
        // Wait for sharedVideoRef to be available (CameraPanel must render first)
        let attempts = 0;
        const attachStream = () => {
          if (sharedVideoRef && localStreamRef.current) {
            console.log('📹 [CAMERA INIT] Attaching stream to video element...');
            sharedVideoRef.srcObject = localStreamRef.current;
            sharedVideoRef.muted = true;
            
            console.log('📹 [CAMERA INIT] Calling play() on video element');
            
            // Call play() directly without waiting for metadata
            sharedVideoRef.play()
              .then(() => {
                if (isMounted) {
                  console.log('📹 [CAMERA INIT] ✅ Video stream is now playing');
                  setCameraStarted(true);
                  setIsLocalCameraReady(true);
                }
              })
              .catch(playErr => {
                if (isMounted) {
                  console.warn('📹 [CAMERA INIT] ⚠️ Play error (stream may still display):', playErr.name, playErr.message);
                  // Still mark as ready - stream might display even with play error
                  setCameraStarted(true);
                  setIsLocalCameraReady(true);
                }
              });
          } else if (attempts < 50) {
            // Retry waiting for ref to be available
            attempts++;
            setTimeout(attachStream, 50);
          } else {
            console.error('📹 [CAMERA INIT] ❌ Video ref never became available');
            console.error('   sharedVideoRef:', !!sharedVideoRef);
            console.error('   localStreamRef.current:', !!localStreamRef.current);
            setIsLocalCameraReady(true);
          }
        };
        
        attachStream();
      } catch (err) {
        if (isMounted) {
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
      }
    };

    startCamera();
    
    return () => {
      isMounted = false;
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
    
    setCurrentUser(userToUse);
    
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
  const reinitializeCamera = React.useCallback(async () => {
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

  // 🔥 Camera start function - ONLY called on button click, NOT auto-called
  const startCamera = async () => {
    try {
      console.log('📹 [START CAMERA] User clicked to start camera');
      console.log('📹 [START CAMERA] Checking DOM state...');
      console.log('   localVideoRef.current:', !!localVideoRef.current);
      console.log('   localVideoRef.current in DOM:', localVideoRef.current?.parentElement ? 'YES' : 'NO');
      console.log('   All videos in DOM:', document.querySelectorAll('video').length);
      
      if (!localVideoRef.current) {
        console.error('📹 [START CAMERA] ❌ Video element not in DOM - cannot proceed');
        return;
      }
      
      console.log('📹 [START CAMERA] Requesting camera from browser...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;
      localStreamRef.current = stream;
      console.log('📹 [START CAMERA] ✅ Stream obtained:', stream);
      console.log('📹 [START CAMERA] Stream tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, id: t.id })));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('📹 [START CAMERA] ✅ Stream attached to video element');
        
        // 🔥 CRITICAL: Wait for video to actually start playing before marking ready
        localVideoRef.current.onloadedmetadata = () => {
          console.log('📹 [START CAMERA] ✅ Video metadata loaded, calling play()');
          
          localVideoRef.current.play().then(() => {
            console.log('📹 [START CAMERA] ✅ Video playing - setting isLocalCameraReady=true');
            setIsLocalCameraReady(true);
          }).catch((playErr) => {
            console.warn('📹 [START CAMERA] ⚠️ Play warning (but video loaded):', playErr.message);
            // Still mark as ready since video loaded successfully
            setIsLocalCameraReady(true);
          });
        };
      }
    } catch (error) {
      console.error('📹 [START CAMERA] ❌ CRITICAL ERROR:', error);
      console.error('   Error name:', error.name);
      console.error('   Error message:', error.message);
      
      // Handle specific error types
      if (error.name === 'NotAllowedError') {
        console.error('❌ Camera permission DENIED by user - User clicked deny in browser prompt');
      } else if (error.name === 'NotFoundError') {
        console.error('❌ No camera device found - Check if device has a camera');
      } else if (error.name === 'NotReadableError') {
        console.error('❌ Camera is already in use by another app - Close other apps using camera');
      } else if (error.name === 'SecurityError') {
        console.error('❌ Camera access blocked by security policy - Must use HTTPS');
      }
    }
  };
  
  // 🔥 Cleanup: Do NOT stop camera on dashboard unmount
  // Camera stays ON for stream reuse across navigation
  useEffect(() => {
    return () => {
      console.log('📹 [DASHBOARD CLEANUP] Component unmounting');
      console.log('📹 [DASHBOARD CLEANUP] ⚠️ NOT stopping camera - will be reused on return');
      // ❌ ye mat rakho: stopLocalCamera();
      // Camera sirf logout / app close par stop ho
    };
  }, []);

  // ✅ STEP 2: getUserMedia sirf pehli baar - MOVED TO TOP (line 160+) FOR IMMEDIATE EXECUTION
  // Camera starts once when component mounts and runs continuously
  
  // Duplicate removed - see camera init useEffect at top


  // ✅ ONE-TIME VERIFICATION: Check after 1 second that stream is properly attached
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sharedVideoRef && localStreamRef.current) {
        console.log('📹 [VERIFY] Stream attached:', {
          srcObject: !!sharedVideoRef.srcObject,
          paused: sharedVideoRef.paused,
          tracks: localStreamRef.current.getTracks().length,
          readyState: sharedVideoRef.readyState,
          networkState: sharedVideoRef.networkState
        });
        
        // If not playing, try to play
        if (sharedVideoRef.paused) {
          console.log('📹 [VERIFY] Video is paused, attempting play...');
          sharedVideoRef.play().catch(err => {
            console.warn('📹 [VERIFY] Play failed:', err.message);
          });
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // CRITICAL: Define createPeerConnection BEFORE socket listeners
  // This function is called inside socket event handlers
  // Must be declared before the socket listener setup to avoid TDZ error
  // When minified, this function gets named 'g', and if not declared before
  // the socket listeners that reference it, we get:
  // "Cannot access 'g' before initialization"
  // ========================================
  const createPeerConnection = async () => {
    console.log('🔧 createPeerConnection called');
    console.log('   Current localStreamRef:', localStreamRef.current);
    
    // ✅ CRITICAL FIX: If local stream is missing, attempt to reacquire it
    if (!localStreamRef.current) {
      console.warn('⚠️ CRITICAL: localStreamRef.current is null - attempting to reacquire camera stream');
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
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
    
    // Log ICE server configuration for diagnostics
    logIceServers();
    
    const turnServers = await getTurnServers();
    
    // ✅ Enhanced TURN configuration to force TURN when STUN fails
    // Include explicit STUN + TURN servers with username/credential
    const iceServers = [
      {
        urls: [
          "stun:global.xirsys.net",
          "turn:global.xirsys.net:3478?transport=udp",
          "turn:global.xirsys.net:3478?transport=tcp"
        ],
        username: "nkhlvdv",
        credential: "a8e244b8-cf5b-11f0-8771-0242ac140002"
      },
      ...turnServers // Add servers from API as backup
    ];
    
    console.log('🔧 ICE Servers Configuration:', {
      count: iceServers.length,
      servers: iceServers.map(s => ({
        urls: s.urls,
        username: s.username ? '***' : undefined,
        credential: s.credential ? '***' : undefined
      }))
    });

    const peerConnection = new RTCPeerConnection({ 
      iceServers,
      iceTransportPolicy: "all"  // Use "relay" only if mobile still disconnects
    });
    peerConnectionRef.current = peerConnection;  // ✅ Store immediately for use in event handlers
    console.log('✅ RTCPeerConnection created with iceTransportPolicy: all');

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
            socket.emit("ice_candidate", {
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
        console.log('\n🧊 ===== ICE CONNECTION STATE CHANGED =====');
        console.log('🧊 New ICE Connection State:', state);
        
        switch(state) {
          case 'new':
            console.log('🧊 State: NEW - Gathering ICE candidates');
            break;
          case 'checking':
            console.log('🧊 State: CHECKING - Testing ICE candidate pairs');
            console.log('🧊 Connection in progress - waiting for connectivity');
            break;
          case 'connected':
            console.log('✅ State: CONNECTED - Found working ICE candidate pair');
            console.log('🧊 Peer-to-peer communication established');
            break;
          case 'completed':
            console.log('✅ State: COMPLETED - ICE checks completed, ready for media');
            console.log('🧊 All connectivity checks passed');
            break;
          case 'failed':
            console.error('❌ State: FAILED - All ICE candidate pairs failed');
            console.error('❌ Could not establish peer-to-peer connection');
            console.error('❌ TURN server may be unreachable or blocked by ISP');
            console.error('🔍 Troubleshooting:');
            console.error('   - Check console for TURN error details');
            console.error('   - TURN error 701 = Network/ISP blocking ports 3478, 5349');
            console.error('   - Solutions: Try VPN, different WiFi, or mobile hotspot');
            console.error('   - User can retry with a retry button (do NOT auto-restart ICE)');
            break;
          case 'disconnected':
            console.warn('⚠️ State: DISCONNECTED - Lost connection to peer');
            console.warn('   Note: ICE restart is manual only to prevent stream loss');
            break;
          case 'closed':
            console.log('🛑 State: CLOSED - Connection closed');
            break;
        }
        
        console.log('📊 Full connection states:');
        console.log('   Signaling State:', peerConnection.signalingState);
        console.log('   Connection State:', peerConnection.connectionState);
        console.log('   ICE Gathering State:', peerConnection.iceGatheringState);
    };

    // ✅ FIX #1: Create persistent remote MediaStream ONCE per peer connection
    if (!peerConnectionRef.current._remoteStream) {
      peerConnectionRef.current._remoteStream = new MediaStream();
      console.log('✅ PERSISTENT REMOTE STREAM CREATED - will accumulate all incoming tracks');
    }

    peerConnection.ontrack = (event) => {
        console.log('\n\n🔴🔴🔴 ===== CRITICAL: ONTRACK HANDLER FIRING! =====');
        console.log('🔴 ONTRACK CALLED AT:', new Date().toISOString());
        console.log('🔴 Track received:', { kind: event.track.kind, id: event.track.id, enabled: event.track.enabled });
        
        // ✅ FIX #1: Use persistent remote MediaStream
        const remoteStream = peerConnectionRef.current._remoteStream;
        console.log('🔴 Using persistent remote stream ID:', remoteStream.id);
        
        // Add track to persistent stream
        remoteStream.addTrack(event.track);
        console.log('✅ Track added to persistent remote stream');
        console.log('📥 Remote stream now has', remoteStream.getTracks().length, 'track(s)');
        console.log('📥 Tracks:', remoteStream.getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled })));
        
        if (!remoteVideoRef.current) {
            console.error('❌ CRITICAL ERROR: remoteVideoRef.current is NULL!');
            console.error('   Cannot attach remote track - video element not available');
            return;
        }
        
        // ✅ FIX #1: Attach srcObject ONLY ONCE, never overwrite
        if (remoteVideoRef.current.srcObject !== remoteStream) {
          console.log('📺 ATTACHING PERSISTENT STREAM to remoteVideoRef');
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.muted = false;
          
          console.log('📺 srcObject attached, attempting play()...');
          remoteVideoRef.current.play().catch(() => {
            console.log('ℹ️ Autoplay blocked - will play on user interaction');
          });
        } else {
          console.log('📺 STREAM ALREADY ATTACHED - skipping re-attachment');
          console.log('   Stream has', remoteStream.getTracks().length, 'tracks now');
        }
        
        console.log('✅ ✅ ✅ ONTRACK COMPLETE - Remote stream persisted and attached\n\n');
    };

    peerConnection.onconnectionstatechange = () => {
        console.log("\n🔌 ===== CONNECTION STATE CHANGED =====");
        console.log("🔌 New Connection State:", peerConnection.connectionState);
        console.log("   ICE Connection State:", peerConnection.iceConnectionState);
        console.log("   ICE Gathering State:", peerConnection.iceGatheringState);
        console.log("   Signaling State:", peerConnection.signalingState);
        
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
          console.log('✅ WebRTC connection ESTABLISHED');
          
          // ✅ FIX #5: Debug check after connection - log receivers
          setTimeout(() => {
            console.log('\n📊 ===== RECEIVER DEBUG CHECK (after connected) =====');
            const receivers = peerConnection.getReceivers();
            console.log('📊 Total receivers:', receivers.length);
            receivers.forEach((receiver, i) => {
              console.log(`📊 Receiver ${i}:`, {
                kind: receiver.track?.kind,
                enabled: receiver.track?.enabled,
                readyState: receiver.track?.readyState,
                id: receiver.track?.id,
                muted: receiver.track?.muted
              });
            });
            
            console.log('📊 Audio and video tracks should be present above');
            
            // Also log senders for verification
            const senders = peerConnection.getSenders();
            console.log('\n📊 Total senders:', senders.length);
            senders.forEach((sender, i) => {
              console.log(`📊 Sender ${i}:`, {
                kind: sender.track?.kind,
                enabled: sender.track?.enabled,
                readyState: sender.track?.readyState,
                id: sender.track?.id
              });
            });
          }, 1000);
        } else if (peerConnection.connectionState === 'disconnected') {
          setIsConnected(false);
          console.log('⚠️ WebRTC connection DISCONNECTED');
        } else if (peerConnection.connectionState === 'failed') {
          setIsConnected(false);
          console.log('❌ WebRTC connection FAILED');
        } else if (peerConnection.connectionState === 'closed') {
          setIsConnected(false);
          console.log('❌ WebRTC connection CLOSED');
        }
    };

    // CRITICAL: Verify stream still exists before adding tracks
    if (!localStreamRef.current) {
      console.error('❌ CRITICAL ERROR: localStreamRef.current is null/undefined in createPeerConnection!');
      throw new Error('Local stream lost before createPeerConnection');
    }

    return peerConnection;
  };

  // ========================================
  // CRITICAL: Setup socket listeners ONCE on component mount
  // This must run only once, NOT every time startVideoChat is called
  // ========================================
  useEffect(() => {
    console.log('\n\n🔌 ===== SOCKET LISTENERS SETUP (COMPONENT MOUNT) =====');
    console.log('🔌 Setting up socket listeners - runs ONCE on component load');
    console.log('🔌 Socket ID:', socket.id);
    console.log('🔌 Socket connected:', socket.connected);
    console.log('🔌 🔐 Using userIdRef.current for ALL ID comparisons:', userIdRef.current);
    
    // Clean up old listeners to prevent duplicates
    socket.off('partner_found');
    socket.off('webrtc_offer');
    socket.off('webrtc_answer');
    socket.off('ice_candidate');
    socket.off('receive_message');
    socket.off('partner_disconnected');
    socket.off('disconnect');
    console.log('🔌 Removed old listeners (if any existed)');
    
    // Partner found - fires for BOTH offerer AND answerer
    socket.on('partner_found', async (data) => {
      console.log('\n\n📋 ===== PARTNER FOUND EVENT RECEIVED =====');
      console.log('👥 RAW DATA from server:', JSON.stringify(data, null, 2));
      console.log('👥 My socket ID:', socket.id);
      console.log('👥 currentUser object:', JSON.stringify(currentUser, null, 2));
      console.log('👥 userIdRef.current (SHOULD USE THIS):', userIdRef.current);
      console.log('👥 currentUser.googleId:', currentUser?.googleId);
      console.log('👥 currentUser.id:', currentUser?.id);
      console.log('👥 data.socketId:', data.socketId);
      console.log('👥 data.partnerId:', data.partnerId);
      console.log('👥 data.userName:', data.userName);
      
      // ✅ UPDATE STATE: Partner found - hide waiting screen, show video chat
      setIsSearching(false);
      setPartnerFound(true);
      setIsLoading(false);
      
      // CRITICAL: PREVENT SELF-MATCHING
      console.log('\n👥 SELF-MATCH CHECK - START');
      const myUserId = userIdRef.current;  // USE REF FOR CONSISTENT ID
      const partnerUserId = data.partnerId;
      
      console.log('👥 COMPARISON VALUES:');
      console.log('   myUserId type:', typeof myUserId, 'value:', myUserId);
      console.log('   partnerUserId type:', typeof partnerUserId, 'value:', partnerUserId);
      console.log('   Are they EQUAL?', myUserId === partnerUserId);
      console.log('   String comparison:', String(myUserId) === String(partnerUserId));
      
      if (myUserId === partnerUserId) {
        console.error('\n❌❌❌ CRITICAL ERROR: SELF-MATCH DETECTED! ❌❌❌');
        console.error('   My user ID:', myUserId, 'type:', typeof myUserId);
        console.error('   Partner user ID:', partnerUserId, 'type:', typeof partnerUserId);
        console.error('   Match IDs:', myUserId === partnerUserId);
        console.error('   These should be DIFFERENT!');
        
        // Reject this match and look for another partner
        setIsLoading(true);
        console.error('   Emitting skip_user...');
        socket.emit('skip_user', {
          partnerSocketId: data.socketId
        });
        console.error('   Emitting find_partner...');
        socket.emit('find_partner', {
          userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
          userName: currentUser.name || 'Anonymous',
          userAge: currentUser.age || 18,
          userLocation: currentUser.location || 'Unknown'
        });
        console.error('   Returning - match REJECTED');
        return;
      }
      
      console.log('✅ SELF-MATCH CHECK PASSED - partner is different user');
      console.log('   Accepting match and proceeding with WebRTC setup');
      console.log('👥 SELF-MATCH CHECK - END\n');
      
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
        userAge: data.userAge || data.age || 18
      };
      setPartnerInfo(partnerData);
      console.log('🎬 ✅ setPartnerInfo CALLED with data:', partnerData);

      // CRITICAL: Determine who should send the offer
      // The peer with the LOWER socket ID (lexicographically) is the OFFERER
      const mySocketId = socket.id;
      const partnerSocketId = data.socketId;
      const amIOfferer = mySocketId < partnerSocketId;
      
      console.log('🔍 SOCKET ID COMPARISON:');
      console.log('   My socket ID:', mySocketId);
      console.log('   Partner socket ID:', partnerSocketId);
      console.log('   Am I offerer? (myID < partnerID):', amIOfferer);
      
      // ✅ CRITICAL DEFENSIVE CHECK: Verify local stream exists before proceeding
      console.log('\n🔐 ===== CRITICAL STREAM VERIFICATION =====');
      console.log('🔐 Checking localStreamRef.current status:');
      console.log('   exists:', !!localStreamRef.current);
      console.log('   tracks:', localStreamRef.current?.getTracks().length || 0);
      console.log('   video element srcObject:', !!localVideoRef.current?.srcObject);
      
      if (!localStreamRef.current) {
        console.error('🔐 ❌ CRITICAL: localStreamRef.current is NULL - cannot proceed to WebRTC');
        console.error('   This means the camera stream was never acquired or was lost');
        console.error('   Attempting emergency camera reacquisition...');
        
        try {
          const emergencyStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: true
          });
          localStreamRef.current = emergencyStream;
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = emergencyStream;
            localVideoRef.current.muted = true;
            try {
              await localVideoRef.current.play();
            } catch (e) {
              console.warn('⚠️ Play error in emergency reacquisition');
            }
          }
          
          console.log('🔐 ✅ EMERGENCY: Camera stream re-acquired');
        } catch (emergencyErr) {
          console.error('🔐 ❌ EMERGENCY FAILED: Could not reacquire camera -', emergencyErr.message);
          console.error('   User must allow camera permission to continue');
          return;
        }
      }
      
      console.log('🔐 ✅ STREAM VERIFICATION PASSED - proceeding with WebRTC\n');
      
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

        console.log('📊 OFFERER Stream status after peer connection creation:', {
          exists: !!localStreamRef.current,
          trackCount: localStreamRef.current?.getTracks().length,
          tracks: localStreamRef.current?.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, state: t.readyState }))
        });

        // Add local stream tracks to peer connection BEFORE creating offer
        if (localStreamRef.current) {
          console.log('\n👤 OFFERER localStream:', localStreamRef.current);
          const allTracks = localStreamRef.current.getTracks();
          console.log('👤 OFFERER: All available tracks:', allTracks);
          console.log('📹 OFFERER tracks detail:', allTracks.map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled, state: t.readyState })));
          
          // ✅ CRITICAL: Check if tracks already added to avoid duplicate senders
          const existingSenders = pc.getSenders();
          console.log('📤 OFFERER: Existing senders count:', existingSenders.length);
          if (existingSenders.length > 0) {
            console.warn('⚠️ OFFERER WARNING: Tracks already added! Senders:', existingSenders.map(s => ({ kind: s.track?.kind, id: s.track?.id })));
            console.warn('   Not adding tracks again to avoid duplicates');
          } else {
            console.log(`\n📹 OFFERER: Adding ${allTracks.length} local tracks to peer connection`);
            
            allTracks.forEach((track, index) => {
              console.log(`  [${index}] Adding ${track.kind} track (id: ${track.id}, enabled: ${track.enabled})`);
              try {
                const sender = pc.addTrack(track, localStreamRef.current);
                console.log(`  [${index}] ✅ addTrack succeeded, sender:`, sender);
              } catch (addTrackErr) {
                console.error(`  [${index}] ❌ addTrack failed:`, addTrackErr);
              }
            });
          
            console.log('\n✅ OFFERER: All tracks added to peer connection');
            const senders = pc.getSenders();
            console.log('📤 OFFERER senders count:', senders.length);
            console.log('📤 OFFERER senders after addTrack:', senders.map((s, i) => ({ 
              index: i,
              kind: s.track?.kind, 
              id: s.track?.id,
              trackExists: !!s.track,
              trackEnabled: s.track?.enabled
            })));
            console.log('🚀 OFFERER: Ready to send offer with', allTracks.length, 'tracks\n');
          }
        } else {
          console.error('❌ OFFERER: No local stream available - TRACKS WILL NOT BE SENT!');
          console.error('❌ OFFERER: localStreamRef.current is:', localStreamRef.current);
        }

        // Create and send offer
        console.log('\n📋 ===== OFFERER CREATING AND SENDING OFFER =====');
        console.log('🎬 OFFERER: Creating WebRTC offer with offerToReceiveVideo/Audio');
        
        // ✅ CRITICAL: Add offerToReceiveVideo and offerToReceiveAudio to force SDP direction
        // This tells the remote peer that we can receive video/audio
        // Without this, some browsers send recvonly instead of sendrecv
        const offer = await pc.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true
        });
        console.log('✅ OFFERER: Offer created with receive constraints:', offer);
        console.log('📋 OFFERER SDP CHECK - Looking for a=sendrecv:');
        const offerSdpLines = offer.sdp.split('\n').filter(line => line.includes('sendrecv') || line.includes('recvonly') || line.includes('sendonly'));
        console.log('   Media direction lines:');
        offerSdpLines.forEach(line => console.log('   ', line));
        
        console.log('🔄 OFFERER: Setting local description (offer)');
        await pc.setLocalDescription(offer);
        console.log('✅ OFFERER: Local description set');
        
        console.log('\n📤 OFFERER: Sending offer with tracks:', pc.getSenders().map(s => ({
          kind: s.track?.kind,
          id: s.track?.id,
          enabled: s.track?.enabled
        })));
        console.log('📤 OFFERER: Partner socket ID from data:', data.socketId);
        console.log('📤 OFFERER: partnerSocketIdRef.current value:', partnerSocketIdRef.current);
        console.log('🔌🔌🔌 CRITICAL: About to emit webrtc_offer with to:', data.socketId);
        console.log('🔌🔌🔌 CRITICAL: Is to value empty/null/undefined?', !data.socketId);
        
        socket.emit('webrtc_offer', {
          offer: peerConnectionRef.current.localDescription,
          to: data.socketId
        });
        console.log('✅ OFFERER: webrtc_offer emitted successfully');
        console.log('✅ OFFERER: webrtc_offer sent to socket ID:', data.socketId);
        console.log('✅ OFFERER: webrtc_offer contains', peerConnectionRef.current.getSenders().length, 'senders');
        console.log('✅ OFFERER: Sent to socket:', data.socketId);
      } catch (err) {
        console.error('❌ OFFERER: Error in partner_found handler:', err);
        console.error('❌ OFFERER: Stack trace:', err.stack);
      }
    });

    // Receive offer - ANSWERER starts here
    socket.on('webrtc_offer', async (data) => {
      console.log('\n\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
      console.log('🎉🎉🎉 ⭐️ ANSWERER HANDLER FIRED ⭐️ 🎉🎉🎉');
      console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
      console.log('📋 ===== ANSWERER RECEIVED OFFER =====');
      console.log('⭐️ ANSWERER: WEBRTC_OFFER EVENT FIRED - OFFER WAS RECEIVED');
      console.log('📨 ANSWERER: Received WebRTC offer from offerer');
      console.log('📨 ANSWERER: My socket ID:', socket.id);
      console.log('📨 ANSWERER: Offer from:', data.from);
      console.log('📨 ANSWERER: Full data:', data);
      console.log('📨 ANSWERER: data.from (offerer socket ID):', data.from);
      
      // CRITICAL: Store offerer socket ID for sending answer back
      partnerSocketIdRef.current = data.from;
      console.log('🔌 CRITICAL: Stored offerer socket ID:', partnerSocketIdRef.current);
      
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
        console.log('👤 ANSWERER localStreamRef.current:', localStreamRef.current);
        console.log('👤 ANSWERER localStreamRef.current === null?', localStreamRef.current === null);
        console.log('👤 ANSWERER localStreamRef.current === undefined?', localStreamRef.current === undefined);
        
        // ✅ CRITICAL DEFENSIVE CHECK: Verify and reacquire stream if missing
        if (!localStreamRef.current) {
          console.warn('⚠️ ANSWERER: localStreamRef.current is NULL - attempting emergency reacquisition');
          try {
            const emergencyStream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 640 }, height: { ideal: 480 } },
              audio: true
            });
            localStreamRef.current = emergencyStream;
            
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = emergencyStream;
              localVideoRef.current.muted = true;
              try {
                await localVideoRef.current.play();
              } catch (e) {
                console.warn('⚠️ Play error in answerer emergency reacquisition');
              }
            }
            
            console.log('✅ ANSWERER: Emergency stream acquisition successful');
          } catch (emergencyErr) {
            console.error('❌ ANSWERER: Emergency stream acquisition failed:', emergencyErr.message);
            throw new Error('ANSWERER: Cannot reacquire camera stream - ' + emergencyErr.message);
          }
        }
        
        if (localStreamRef.current) {
          console.log('\n✅ ANSWERER: localStream EXISTS - will add tracks');
          console.log('📊 ANSWERER localStream object:', localStreamRef.current);
          const allTracks = localStreamRef.current.getTracks();
          console.log('👤 ANSWERER: getAllTracks() returned:', allTracks);
          console.log('👤 ANSWERER: Track array length:', allTracks.length);
          
          if (allTracks.length > 0) {
            console.log('👤 ANSWERER: Tracks detail:', allTracks.map(t => ({ 
              kind: t.kind, 
              id: t.id,
              enabled: t.enabled,
              readyState: t.readyState
            })));
          } else {
            console.warn('⚠️ ANSWERER: WARNING - localStream exists but getTracks() returned empty array!');
          }
          
          // ✅ CRITICAL: Check if tracks already added to avoid duplicate senders
          const existingSenders = peerConnectionRef.current.getSenders();
          console.log('📤 ANSWERER: Existing senders count:', existingSenders.length);
          if (existingSenders.length > 0) {
            console.warn('⚠️ ANSWERER WARNING: Tracks already added! Senders:', existingSenders.map(s => ({ kind: s.track?.kind, id: s.track?.id })));
            console.warn('   Not adding tracks again to avoid duplicates');
          } else {
            console.log(`\n📹 ANSWERER: Attempting to add ${allTracks.length} local tracks to peer connection`);
            let successCount = 0;
            let failureCount = 0;
            
            allTracks.forEach((track, idx) => {
              console.log(`  [${idx}] About to add ${track.kind} track (id: ${track.id}, enabled: ${track.enabled})`);
              try {
                const sender = peerConnectionRef.current.addTrack(track, localStreamRef.current);
                console.log(`  [${idx}] ✅ addTrack SUCCEEDED`);
                console.log(`  [${idx}] Sender:`, sender);
                successCount++;
              } catch (addTrackErr) {
                console.error(`  [${idx}] ❌ addTrack FAILED`);
                console.error(`  [${idx}] Error:`, addTrackErr.message);
                failureCount++;
              }
            });
            
            console.log(`\n✅ ANSWERER: Track addition complete (${successCount} succeeded, ${failureCount} failed)`);
            const senders = peerConnectionRef.current.getSenders();
            console.log('📤 ANSWERER: Final senders count:', senders.length);
            console.log('📤 ANSWERER: Senders:', senders.map((s, i) => ({ 
              index: i,
              kind: s.track?.kind, 
              id: s.track?.id,
              trackExists: !!s.track,
              trackEnabled: s.track?.enabled
            })));
          }
        } else {
          console.error('\n❌ ANSWERER: CRITICAL ERROR - localStreamRef.current is NULL!');
          console.error('❌ ANSWERER: Cannot add tracks - stream does not exist');
          throw new Error('ANSWERER: No local stream - cannot add tracks');
        }

        console.log('\n🔄 ANSWERER: Setting remote description (offer from offerer)');
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        console.log('✅ ANSWERER: Remote description set successfully');

        console.log('🎬 ANSWERER: Creating answer');
        // ✅ CRITICAL: Answer also needs offerToReceiveVideo constraints!
        // The answerer MUST confirm they can receive media too
        const answer = await peerConnectionRef.current.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true
        });
        console.log('✅ ANSWERER: Answer created with receive constraints');
        console.log('📋 ANSWERER SDP CHECK - Looking for a=sendrecv:');
        const sdpLines = answer.sdp.split('\n').filter(line => line.includes('sendrecv') || line.includes('recvonly') || line.includes('sendonly'));
        console.log('   Media direction lines:');
        sdpLines.forEach(line => console.log('   ', line));
        
        console.log('🔄 ANSWERER: Setting local description (answer)');
        await peerConnectionRef.current.setLocalDescription(answer);
        console.log('✅ ANSWERER: Local description set successfully');

        console.log('\n📋 ===== ANSWERER SENDING ANSWER =====');
        const finalSenders = peerConnectionRef.current.getSenders();
        console.log('📤 ANSWERER: Final senders count:', finalSenders.length);
        console.log('📤 ANSWERER: Sending answer with tracks:', finalSenders.map(s => ({
          kind: s.track?.kind,
          id: s.track?.id,
          enabled: s.track?.enabled
        })));
        console.log('🔌 CRITICAL: Offerer socket ID from offer:', data.from);
        console.log('🔌 SERVER sending ANSWER to:', data.from);
        socket.emit('webrtc_answer', {
          answer: peerConnectionRef.current.localDescription,
          to: data.from
        });
        console.log('📤 ANSWERER: Answer emitted to offerer via socket:', data.from);
        console.log('📋 ===== ANSWERER ANSWER SENT =====\n\n');
      } catch (err) {
        console.error('\n❌ ANSWERER: ERROR in webrtc_offer handler:', err);
        console.error('❌ ANSWERER: Error message:', err.message);
        console.error('❌ ANSWERER: Stack trace:', err.stack);
      }
    });

    // Receive answer - OFFERER receives answer back
    socket.on('webrtc_answer', async (data) => {
      console.log('\n\n📋 ===== OFFERER RECEIVED ANSWER =====');
      console.log('📨 OFFERER: Received WebRTC answer from answerer');
      console.log('📨 OFFERER: data.from (answerer socket ID):', data.from);
      console.log('📨 OFFERER: Answer SDP:', data.answer);
      
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
        candidate: data.candidate,
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
          console.log('🧊 Adding ICE candidate to peer connection');
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
          console.log('✅ ICE candidate added successfully\n');
        } else {
          console.warn('⚠️ No peer connection available for ICE candidate');
        }
      } catch (err) {
        console.error('❌ Error adding ICE candidate:', err);
      }
    });

    // ✅ CRITICAL: Partner disconnected handler
    socket.on('partner_disconnected', (data) => {
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
      // DO NOT clear localVideoRef.current.srcObject here
      // The local camera should stay active when partner disconnects
      // User can go back to WaitingScreen or IntroScreen and camera will still be there
      
      console.log('🔴 Calling endChat() to reset UI');
      endChat();
      console.log('🔴🔴🔴 Cleanup complete - ready for new partner');
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
    console.log('🔌 ✅ partner_disconnected listener active (CRITICAL FOR DISCONNECT)');
    console.log('🔌 ✅ disconnect listener active');
    console.log('🔌 Ready to receive WebRTC signaling messages\n\n');
    
    // Cleanup function to remove listeners on unmount
    return () => {
      console.log('🧹 Removing socket listeners on component unmount');
      socket.off('partner_found');
      socket.off('webrtc_offer');
      socket.off('webrtc_answer');
      socket.off('ice_candidate');
      socket.off('partner_disconnected');
      socket.off('disconnect');
    };
  }, []); // Empty dependency array - runs ONCE on component mount

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
        socket.emit('cancel_matching', {
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

  const getTurnServers = async () => {
    try {
      console.log('🔄 Fetching TURN servers from Xirsys via backend API...');
      const res = await fetch("https://flinxx-backend.onrender.com/api/turn");
      const data = await res.json();

      console.log('📡 Xirsys API Response:', data);

      if (data?.v?.iceServers && Array.isArray(data.v.iceServers)) {
        console.log('✅ TURN servers fetched from Xirsys API');
        console.log('✅ iceServers is an array with', data.v.iceServers.length, 'entries');
        console.log('📋 ICE Servers:', data.v.iceServers);
        
        // data.v.iceServers is already the correct array format for RTCPeerConnection
        return data.v.iceServers;
      } else {
        console.warn('⚠️ Invalid Xirsys TURN response format');
        console.log('   Expected: data.v.iceServers as array');
        console.log('   Received:', data);
        throw new Error("Invalid Xirsys TURN response format");
      }
    } catch (error) {
      console.error('❌ Error fetching TURN servers from Xirsys:', error.message);
      console.log('🔄 Falling back to static STUN/TURN configuration');
      
      // Fallback to static configuration - returns array directly
      const fallbackServers = getIceServers();
      console.log('📋 Using fallback ICE servers:', fallbackServers);
      return fallbackServers;
    }
  };

  const startVideoChat = async () => {
    console.log('🎬 [BUTTON CLICK] "Start Video Chat" button clicked');
    console.log('🎬 [BUTTON CLICK] Current state - cameraStarted:', cameraStarted, 'isSearching:', isSearching);
    
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
      
      console.log('🎬 [STATE BEFORE] isSearching:', isSearching, 'partnerFound:', partnerFound);
      
      // EMIT SOCKET EVENT FIRST (synchronous, immediate)
      socket.emit('find_partner', {
        userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
        userName: currentUser.name || 'Anonymous',
        userAge: currentUser.age || 18,
        userLocation: currentUser.location || 'Unknown',
        userPicture: currentUser.picture || null  // Include picture so partner can display it
      });
      
      console.log('🎬 [SEARCHING] ✅ find_partner event emitted immediately');
      
      // THEN UPDATE STATE (allow batching)
      setIsSearching(true);
      setPartnerFound(false);
      setIsLoading(true);
      
      console.log('🎬 [STATE AFTER] Calling setIsSearching(true)');
      console.log('STATE AFTER START SEARCH:', { isStarting: true, isSearching: true, partnerFound: false });
    }
  };

  // ✅ Stable cancel search handler - memoized to prevent unnecessary re-renders
  const handleCancelSearch = useCallback(() => {
    console.log('🛑 [CANCEL] User cancelled search');
    console.log('STATE BEFORE CANCEL:', { isSearching, partnerFound });
    
    // Emit socket event
    socket.emit("cancel_matching", { userId: userIdRef.current });
    
    // Reset state
    setIsSearching(false);
    setPartnerFound(false);
    setIsLoading(false);
    
    console.log('STATE AFTER CANCEL:', { isSearching: false, partnerFound: false, isLoading: false });
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
    socket.emit('send_message', {
      message: messageInput,
      to: partnerSocketIdRef.current   // 🔥 CRITICAL - Route to partner socket
    });
    setMessageInput('');
  }, [messageInput, hasPartner]);

  const skipUser = useCallback(() => {
    socket.emit('skip_user', {
      partnerSocketId: partnerSocketIdRef.current
    });
    endChat();
  }, []);

  const endChat = () => {
    setHasPartner(false);
    setIsConnected(false);
    setPartnerInfo(null);
    setMessages([]);
    setConnectionTime(0);

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Look for new partner (do NOT stop camera - reuse same stream)
    socket.emit('find_partner', {
      userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
      userName: currentUser.name || 'Anonymous',
      userAge: currentUser.age || 18,
      userLocation: currentUser.location || 'Unknown'
    });
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

  const VideoChatScreen = React.memo(() => {
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
              padding: 1rem !important;
              gap: 1rem !important;
              overflow: hidden !important;
            }
            .panel-top, .panel-bottom {
              flex: 1 1 50% !important;
              height: 50% !important;
              width: 100% !important;
              min-height: 0;
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
              display: none !important;
            }
            .panel-bottom .user-header {
              display: flex !important;
            }
          }
        `}</style>
        
        <div className="main-layout flex h-full w-full p-8 gap-8 overflow-visible" style={{ backgroundColor: '#000000' }}>
          {/* TOP PANEL - Video Feed */}
          <div className="panel-top flex-1 flex flex-col premium-panel-container">
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
                      <h2 style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: 500, margin: '0' }}>
                        {partnerInfo?.userName || 'Partner'}
                      </h2>
                      <span style={{ color: '#c8ba93', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0' }}>
                        {partnerInfo?.userLocation || 'Online'}
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

                {/* Video Container */}
                <div style={{ flex: '1 1 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  <div className="chat-messages md:flex flex-col items-center justify-center opacity-10 pointer-events-none hidden">
                    <span className="material-symbols-outlined" style={{ fontSize: '100px', color: '#c8ba93' }}>chat_bubble_outline</span>
                  </div>
                  {/* Remote Video - Desktop */}
                  <video
                    ref={(el) => {
                      if (el && peerConnectionRef.current?._remoteStream) {
                        // Attach stream immediately when video element is available
                        const remoteStream = peerConnectionRef.current._remoteStream;
                        if (el.srcObject !== remoteStream) {
                          el.srcObject = remoteStream;
                          el.muted = false;
                          el.play().catch(() => {});
                          console.log('📹 [VIDEO REF CALLBACK] Remote stream attached via ref callback');
                        }
                      }
                      // Always update the ref
                      remoteVideoRef.current = el;
                    }}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#000',
                      display: hasPartner ? 'block' : 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  />
                  {/* Placeholder when no partner */}
                  {!hasPartner && (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }}>
                      <span style={{ color: '#999', fontSize: '14px' }}>Waiting for partner video...</span>
                    </div>
                  )}
                </div>

                {/* Skip Button - Bottom Right */}
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 20 }}>
                  <button
                    onClick={skipUser}
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
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>skip_next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM PANEL - Chat/Local Video */}
          <div className="panel-bottom flex-1 flex flex-col premium-panel-container">
            <div className="flex-1 flex flex-col bg-background-dark rounded-2xl premium-gold-panel relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
              <div className="flex-1 w-full h-full relative inner-content-radius overflow-hidden flex flex-col">
                {/* Header for Mobile */}
                <header className="user-header hidden items-center justify-between p-6 border-b border-white/5 z-20" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                  <div className="flex items-center gap-4">
                    <div className="size-10 md:size-12 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {partnerInfo?.picture ? (
                        <img src={partnerInfo.picture} alt="Partner" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '18px' }}>D</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h2 style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: 500, margin: '0' }}>
                        {partnerInfo?.userName || 'Partner'}
                      </h2>
                      <span style={{ color: '#c8ba93', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0' }}>
                        {partnerInfo?.userLocation || 'Online'}
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
                    ref={(el) => {
                      if (el && localStreamRef.current) {
                        // Attach stream immediately when video element is available
                        if (el.srcObject !== localStreamRef.current) {
                          el.srcObject = localStreamRef.current;
                          el.muted = true;
                          el.play().catch(() => {});
                          console.log('📹 [VIDEO REF CALLBACK] Local stream attached via ref callback');
                        }
                      }
                      // Always update the ref
                      localVideoRef.current = el;
                    }}
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
                      left: 0
                    }}
                  />
                  {!isLocalCameraReady && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '12px', top: 0, left: 0, width: '100%', height: '100%' }}>
                      Camera loading...
                    </div>
                  )}
                  {/* YOU Badge */}
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 20, pointerEvents: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)', animation: 'pulse 2s infinite' }}></span>
                      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f5f5f5' }}>You</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Area for Mobile */}
                <div className="chat-messages flex-1 relative flex items-center justify-center md:hidden">
                  <div style={{ opacity: 0.1, pointerEvents: 'none' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '60px', color: '#c8ba93' }}>chat_bubble_outline</span>
                  </div>
                </div>

                {/* Message Input */}
                <div style={{ marginTop: 'auto', width: '100%', padding: '16px', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(17, 17, 17, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', height: '56px', paddingLeft: '12px', paddingRight: '12px' }}>
                    <input
                      type="text"
                      placeholder="Send Message"
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
                        fontWeight: 300,
                        outline: 'none'
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={sendMessage}
                        style={{
                          backgroundColor: '#d4af37',
                          color: '#000',
                          paddingLeft: '24px',
                          paddingRight: '24px',
                          paddingTop: '8px',
                          paddingBottom: '8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => { e.target.style.opacity = '0.9'; }}
                        onMouseLeave={(e) => { e.target.style.opacity = '1'; }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }, [partnerInfo, currentUser, hasPartner, isLocalCameraReady, messageInput, skipUser, sendMessage]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, overflow: 'hidden', zIndex: 9999 }}>
      {/* 🧪 DEBUG: Log UI state and which screen should render */}
      {console.log('🎨 [RENDER] UI STATE →', { isSearching, partnerFound }, 'Should show:', isSearching && !partnerFound ? 'WAITING SCREEN' : partnerFound ? 'VIDEO CHAT' : 'DASHBOARD')}

      {/* ✅ CRITICAL FIX: ALWAYS keep IntroScreen mounted (with Camera) */}
      {/* The camera panel is inside IntroScreen, never unmounted */}
      {/* Other screens overlay on top with absolute positioning */}
      {!partnerFound && (
        <div className="w-full h-screen overflow-hidden bg-black relative">
          {/* Dashboard with Camera - ALWAYS MOUNTED in background */}
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
          >
            {/* ✅ Pass CameraPanel as children - prevents unmounting on prop changes */}
            <CameraPanel />
          </IntroScreen>

          {/* WAITING SCREEN - overlays on top (absolute positioning) */}
          {isSearching && !partnerFound && (
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
      )}

      {/* VIDEO CHAT - FULL SCREEN (absolute positioning) */}
      {partnerFound && (
        <div className="absolute inset-0 z-50 w-full h-full">
          <VideoChatScreen />
        </div>
      )}

      {/* ⛔ Modals and extras - Only show when NOT in video chat mode */}
      {!partnerFound && (
        <>
          {/* ✅ Terms modal – SAFE (no hook violation) */}
          {showTermsModal && (
            <TermsConfirmationModal
              onCancel={handleDashboardTermsCancel}
              onContinue={handleDashboardTermsAccept}
            />
          )}

          {/* Premium Modal */}
          <PremiumModal 
            isOpen={isPremiumOpen} 
            onClose={() => setIsPremiumOpen(false)} 
          />

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
            onOpenPremium={() => setIsPremiumOpen(true)}
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
        </>
      )}
    </div>
  );
};

export default Chat;

