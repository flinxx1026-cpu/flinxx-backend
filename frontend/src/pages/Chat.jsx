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
import { getIceServers, getMediaConstraints, formatTime, logIceServers } from '../utils/webrtcUtils';
import PremiumModal from '../components/PremiumModal';
import GenderFilterModal from '../components/GenderFilterModal';
import ProfileModal from '../components/ProfileModal';
import FriendRequestPopup from '../components/FriendRequestPopup';
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
  
  // Log mount/unmount to catch if component is being destroyed
  useEffect(() => {
    console.log('📹 CameraPanel mounted');
    return () => {
      console.error('❌ CameraPanel unmounting - THIS BREAKS THE STREAM');
    };
  }, []);
  
  return (
    <main className="w-full lg:flex-1 relative bg-refined rounded-3xl overflow-hidden shadow-2xl border-2 border-primary group shadow-glow flex flex-col items-center justify-center">
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
            backgroundColor: "#000"
          }}
        />
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
                <i className="material-icons-round">favorite</i>
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
                <i className="material-icons-round">chat_bubble</i>
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
              className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-primary via-[#E5C558] to-primary text-black font-bold text-lg shadow-lg hover:shadow-glow-hover transition-all transform hover:scale-105 overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -translate-x-full"></span>
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-2xl">🎬</span>
                <span>{isLoading ? 'Loading...' : 'Start Video Chat'}</span>
              </div>
            </button>

            {/* Spacer below */}
            <div className="flex-[1.2]"></div>
          </div>
        </aside>

        {/* RIGHT PANEL - Camera Feed (always visible) */}
        {children}
      </div>
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
                  backgroundColor: '#000',
                  imageRendering: 'auto',
                  WebkitTransform: 'translateZ(0)',
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
};

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading, refreshNotifications, incomingFriendRequest, setIncomingFriendRequest, refreshSentRequests, incomingRequests = [], setIncomingRequests } = useContext(AuthContext) || {};
  const { activeMode, setActiveMode, handleModeChange, openDuoSquad } = useDuoSquad();

  console.log("RENDER START");

  // ✅ UPDATE LAST SEEN - MUST BE FIRST - Call immediately on mount
  useEffect(() => {
    const userToken = localStorage.getItem("token") || localStorage.getItem("authToken");

    console.log("USER TOKEN:", userToken);

    if (!userToken) {
      console.error("NO USER TOKEN FOUND");
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://flinxx-backend.onrender.com';

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
  const [connectionTime, setConnectionTime] = useState(0);
  const [isSearching, setIsSearching] = useState(false); // 👈 IMPORTANT: Default FALSE
  const [partnerFound, setPartnerFound] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
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

  // ✅ Get unread count for message badge
  const { unreadCount } = useUnreadSafe();

  // 🚀 QUICK INVITE POPUP STATE - Real-time popup for profile icon invites
  const [quickInvite, setQuickInvite] = useState(null); // { inviteId, senderId, senderName, senderProfileImage }

  // ✅ BACKEND URL - Declare once to avoid repetition
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          on: () => {},
          off: () => {},
          emit: () => {},
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
        console.log('📹 [CAMERA INIT] Requesting camera permissions from browser...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        });
        
        localStreamRef.current = stream;
        streamRef.current = stream;
        console.log('📹 [CAMERA INIT] ✅ Camera stream obtained');
        console.log('📹 [CAMERA INIT] Active tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
      } else {
        console.log('📹 [CAMERA INIT] Stream already exists - reusing existing stream');
      }

      // ✅ Wait a tick to ensure ref is attached
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // ✅ STEP 4: Attach stream to video element
      // Skip on mobile - MobileHome handles its own camera attachment via callback
      if (window.innerWidth < 769) {
        console.log('📱 [CAMERA INIT] Mobile detected - skipping desktop video attachment (MobileHome handles camera)');
        setCameraStarted(true);
        setIsLocalCameraReady(true);
        setStreamsReadyTrigger(prev => prev + 1);
        return;
      }
      
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

  // ✅ CAMERA INIT + LOCATION DETECTION - Runs on dashboard mount
  // NOTE: Auth validation is handled by ProtectedChatRoute - NO NEED to duplicate here
  useEffect(() => {
    let isMounted = true;
    
    startCamera();

    // ✅ LOCATION DETECTION via IP (silent, no browser permission popup needed)
    const detectAndSaveLocation = async () => {
      try {
        let detectedLocation = null;
        
        // Try primary API (ip-api.com - NOTE: free tier only supports HTTP, not HTTPS)
        try {
          const response = await fetch('http://ip-api.com/json/?fields=status,city,regionName,country', { signal: AbortSignal.timeout(5000) });
          const data = await response.json();
          console.log('📍 [LOCATION] ip-api.com response:', JSON.stringify(data));
          if (data.status === 'success' && data.city && data.regionName) {
            detectedLocation = `${data.city}, ${data.regionName}`;
          }
        } catch (e) {
          console.log('📍 [LOCATION] Primary API (ip-api.com) failed:', e.message);
        }
        
        // Fallback 1: ipapi.co (HTTPS, but rate-limited)
        if (!detectedLocation) {
          try {
            const response2 = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
            const data2 = await response2.json();
            console.log('📍 [LOCATION] ipapi.co response:', JSON.stringify(data2));
            if (data2.city && data2.region) {
              detectedLocation = `${data2.city}, ${data2.region}`;
            } else if (data2.city && data2.country_name) {
              detectedLocation = `${data2.city}, ${data2.country_name}`;
            }
          } catch (e2) {
            console.log('📍 [LOCATION] ipapi.co failed:', e2.message);
          }
        }

        // Fallback 2: ipinfo.io (HTTPS, free tier)
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
          const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://flinxx-backend.onrender.com';
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
  const turnServersCacheRef = useRef(null);
  const turnServersFetchingRef = useRef(false);

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
        username: "nkhlydv",
        credential: "a8e244b8-cf5b-11f0-8771-0242ac140002"
      },
      ...turnServers // Add servers from API as backup
    ];
    


    const peerConnection = new RTCPeerConnection({ 
      iceServers,
      iceTransportPolicy: "all"  // Use "relay" only if mobile still disconnects
    });
    peerConnectionRef.current = peerConnection;  // ✅ Store immediately for use in event handlers
    console.log('✅ RTCPeerConnection created with iceTransportPolicy: all');

    // ✅ Initialize remote stream immediately (will be populated by ontrack events)
    peerConnectionRef.current._remoteStream = new MediaStream();
    console.log('✅ Remote MediaStream initialized, ID:', peerConnectionRef.current._remoteStream.id);

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
        socketRef.current?.emit('skip_user', {
          partnerSocketId: data.socketId
        });
        console.error('   Emitting find_partner...');
        socketRef.current?.emit('find_partner', {
          userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
          userName: currentUser.name || 'Anonymous',
          userAge: currentUser.age || 18,
          userLocation: currentUser.location || userLocationRef.current || 'Unknown'
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
        
        // ✅ CRITICAL: Flush buffered ICE candidates after local description is set
        while (iceCandidateBufferRef.current.length > 0) {
          const bufferedCandidate = iceCandidateBufferRef.current.shift();
          try {
            await pc.addIceCandidate(
              new RTCIceCandidate(bufferedCandidate)
            );
          } catch (err) {
            // Candidate may have already been processed or is invalid
          }
        }
        
        console.log('\n📤 OFFERER: Sending offer with tracks:', pc.getSenders().map(s => ({
          kind: s.track?.kind,
          id: s.track?.id,
          enabled: s.track?.enabled
        })));
        console.log('📤 OFFERER: Partner socket ID from data:', data.socketId);
        console.log('📤 OFFERER: partnerSocketIdRef.current value:', partnerSocketIdRef.current);
        console.log('🔌🔌🔌 CRITICAL: About to emit webrtc_offer with to:', data.socketId);
        console.log('🔌🔌🔌 CRITICAL: Is to value empty/null/undefined?', !data.socketId);
        
        // ✅ CRITICAL FIX: Wait a moment for answerer to mount Chat component and register listeners
        // This prevents race condition where webrtc_offer is sent before answerer is ready
        console.log('⏳ OFFERER: Waiting 500ms for answerer to be ready...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        socketRef.current?.emit('webrtc_offer', {
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
      console.log('\n\n📋 ===== ANSWERER RECEIVED OFFER =====');
      console.log('📨 ANSWERER: Received WebRTC offer from offerer');
      console.log('📨 ANSWERER: Offer from:', data.from);
      
      // Store offerer socket ID for later WebRTC communication
      partnerSocketIdRef.current = data.from;
      console.log('🔌 CRITICAL: Stored offerer socket ID:', partnerSocketIdRef.current);
      
      // Directly setup WebRTC answer (no UI popup - direct connection)
      await setupWebRTCAnswer(data);
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

    // ✅ RECEIVE MESSAGE from partner
    socket.on('receive_message', (data) => {
      console.log('💬 Received message from partner:', data);
      const newMessage = {
        id: Date.now(),
        sender: 'partner',
        text: data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    });

    // ✅ Handle partner skip
    socket.on('user_skipped', () => {
      console.log('⏭️ Partner skipped - returning to waiting screen');
      endChat();
    });

    // ⛔ Handle skip limit reached
    socket.on('skip_limit_reached', (data) => {
      console.log('⛔ Skip limit reached:', data);
      alert(data.message || 'You have reached your daily skip limit (130). Upgrade to Unlimited Skip!');
    });

    // ✅ Handle friend request accepted - show "Now you are friends" to both users
    socket.on('friend_request_accepted', (data) => {
      console.log('🎉 Friend request accepted:', data);
      setToastMessage('Now you are friends! 🎉');
      setTimeout(() => setToastMessage(null), 3000);
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

  const getTurnServers = async () => {
    // ✅ Return cached servers immediately if available
    if (turnServersCacheRef.current) {
      return turnServersCacheRef.current;
    }

    // ✅ If already fetching, wait for it to complete instead of fetching again
    if (turnServersFetchingRef.current) {
      // Wait up to 5 seconds for the fetch to complete
      const startTime = Date.now();
      while (turnServersFetchingRef.current && Date.now() - startTime < 5000) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (turnServersCacheRef.current) {
          return turnServersCacheRef.current;
        }
      }
      // If fetch took too long, return fallback
      return getIceServers();
    }

    // ✅ Mark that we're fetching to prevent parallel requests
    turnServersFetchingRef.current = true;

    try {
      // Fetch with a 3-second timeout to avoid hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch("https://flinxx-admin-backend.onrender.com/api/turn", {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await res.json();

      // Try multiple possible response formats
      let iceServers = null;
      
      // Format 1: data.v.iceServers as array (expected format)
      if (Array.isArray(data?.v?.iceServers)) {
        iceServers = data.v.iceServers;
      }
      // Format 2: data.iceServers as array (direct)
      else if (Array.isArray(data?.iceServers)) {
        iceServers = data.iceServers;
      }
      // Format 3: data.v is the array itself
      else if (Array.isArray(data?.v)) {
        iceServers = data.v;
      }
      // Format 4: data.v.iceServers is an OBJECT with urls array (ACTUAL FORMAT FROM XIRSYS)
      else if (data?.v?.iceServers && typeof data.v.iceServers === 'object' && !Array.isArray(data.v.iceServers)) {
        // The actual structure from Xirsys: { username: "...", urls: [...], credential: "..." }
        // We need to convert this to RTCPeerConnection format
        if (Array.isArray(data.v.iceServers.urls)) {
          // Convert { username, urls, credential } to RTCIceServer format
          iceServers = [{
            urls: data.v.iceServers.urls,
            username: data.v.iceServers.username,
            credential: data.v.iceServers.credential
          }];
        }
        // Check if it has nested iceServers array
        else if (Array.isArray(data.v.iceServers.iceServers)) {
          iceServers = data.v.iceServers.iceServers;
        }
        // Check if it has a v property with an array
        else if (Array.isArray(data.v.iceServers.v)) {
          iceServers = data.v.iceServers.v;
        }
        // Check if it has a servers property
        else if (Array.isArray(data.v.iceServers.servers)) {
          iceServers = data.v.iceServers.servers;
        }
      }
      // Format 5: Check if response is wrapped differently
      else if (Array.isArray(data?.servers)) {
        iceServers = data.servers;
      }
      // Format 6: Check if v is an object with servers
      else if (Array.isArray(data?.v?.servers)) {
        iceServers = data.v.servers;
      }

      if (iceServers && iceServers.length > 0) {
        // ✅ Cache the servers for future peer connections
        turnServersCacheRef.current = iceServers;
        turnServersFetchingRef.current = false;
        return iceServers;
      } else {
        throw new Error("Invalid Xirsys TURN response format - iceServers array not found");
      }
    } catch (error) {
      // Silently fail - the static TURN servers will be used as fallback
      // This is expected and normal behavior
      
      // Fallback to static configuration - returns array directly
      const fallbackServers = getIceServers();
      // ✅ Cache the fallback servers too
      turnServersCacheRef.current = fallbackServers;
      turnServersFetchingRef.current = false;
      return fallbackServers;
    }
  };

  const startVideoChat = useCallback(async () => {
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
      socketRef.current?.emit('find_partner', {
        userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
        userName: currentUser.name || 'Anonymous',
        userAge: currentUser.age || 18,
        userLocation: currentUser.location || userLocationRef.current || 'Unknown',
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
  }, [cameraStarted, isSearching, isRequestingCamera, startCamera]);

  // ✅ Stable cancel search handler - memoized to prevent unnecessary re-renders
  const handleCancelSearch = useCallback(() => {
    console.log('🛑 [CANCEL] User cancelled search');
    console.log('STATE BEFORE CANCEL:', { isSearching, partnerFound });
    
    // Emit socket event
    socketRef.current?.emit("cancel_matching", { userId: userIdRef.current });
    
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
    socketRef.current?.emit('send_message', {
      message: messageInput,
      to: partnerSocketIdRef.current   // 🔥 CRITICAL - Route to partner socket
    });
    setMessageInput('');
  }, [messageInput, hasPartner]);

  const skipUser = useCallback(() => {
    socketRef.current?.emit('skip_user', {
      partnerSocketId: partnerSocketIdRef.current
    });
    endChat();
  }, []);

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
  }, [user, partnerInfo, BACKEND_URL, refreshSentRequests]);

  // ✅ FRIEND REQUEST POPUP HANDLERS - Shown ONLY on video chat screen
  const handleAcceptFriendRequest = async (requestId) => {
    console.log('✅ [Chat] Accepting friend request:', requestId);
    try {
      const { acceptFriendRequest } = await import('../services/api');
      await acceptFriendRequest(requestId);
      console.log('✅ [Chat] Request accepted');
      setIncomingFriendRequest(null);
      
      // ✅ Show "Now you are friends" toast for both users
      setToastMessage('Now you are friends! 🎉');
      setTimeout(() => setToastMessage(null), 3000);
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

  // ✅ END: Incoming Call Screen Handlers and WebRTC Setup

  const endChat = () => {
    setHasPartner(false);
    setPartnerFound(false);  // ✅ Hide video chat screen
    setIsConnected(false);
    setPartnerInfo(null);
    setMessages([]);
    setConnectionTime(0);
    setIsSearching(true);  // ✅ Return to waiting screen
    setIncomingFriendRequest(null);  // ✅ Clear any pending friend request notification

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Look for new partner (do NOT stop camera - reuse same stream)
    socketRef.current?.emit('find_partner', {
      userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
      userName: currentUser.name || 'Anonymous',
      userAge: currentUser.age || 18,
      userLocation: currentUser.location || userLocationRef.current || 'Unknown'
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

  // ✅ Create stable ref callbacks to prevent blinking
  const localVideoRefCallback = useCallback((el) => {
    if (el && localStreamRef.current) {
      if (el.srcObject !== localStreamRef.current) {
        console.log('🎥 LOCAL VIDEO: Attaching local stream to ref');
        el.srcObject = localStreamRef.current;
        el.muted = true;
        el.play().catch(() => {});
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
                remoteVideoRef.current.play().catch(() => {});
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
        <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
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
            .panel-top, .panel-bottom {
              flex: 1 1 45% !important;
              height: 45% !important;
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
                      onClick={sendQuickInvite}
                      title="Send Quick Invite"
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} 
                      onMouseEnter={(e) => { e.target.style.backgroundColor = '#d4af37'; e.target.style.color = '#000'; }} 
                      onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#d4af37'; }}
                    >
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
                    ref={remoteVideoRefCallback}
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
                    onClick={skipUser}
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
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>skip_next</span>
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
          <div className="panel-bottom flex-1 flex flex-col premium-panel-container">
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
                      left: 0
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

        {/* ✅ FRIEND REQUEST POPUP - Now handled globally by GlobalFriendRequestPopup as a toast */}
        {/* No longer rendering inline modal here - toast shows on top */}

        {/* ✅ Toast for "Request Sent" / "Now you are friends" */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
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
              whiteSpace: 'nowrap'
            }}>
              {toastMessage.includes('friends') ? '💛' : '✓'} {toastMessage}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, overflow: 'hidden', zIndex: 9999 }}>
      {/* 🧪 DEBUG: Log UI state and which screen should render */}
      {console.log('🎨 [RENDER] UI STATE →', { isSearching, partnerFound }, 'Should show:', isSearching && !partnerFound ? 'WAITING SCREEN' : partnerFound ? 'VIDEO CHAT' : 'DASHBOARD')}

      {/* ✅ CRITICAL FIX: ALWAYS keep IntroScreen mounted (with Camera) */}
      {/* The camera panel is inside IntroScreen, never unmounted */}
      {/* Other screens overlay on top with absolute positioning */}

      {/* Dashboard with Camera - ALWAYS MOUNTED in background */}
      <div className="w-full h-screen overflow-hidden relative">
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
          
          {/* ✅ FRIEND REQUEST POPUP - Show ONLY on video chat screen */}
          {incomingFriendRequest && (
            <FriendRequestPopup
              request={incomingFriendRequest}
              onAccept={handleAcceptFriendRequest}
              onReject={handleRejectFriendRequest}
              onClose={() => setIncomingFriendRequest(null)}
            />
          )}
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

          {/* ✅ FRIEND REQUESTS - Shown as popup ONLY on video chat screen */}
          {/* Popup appears on top of video chat when incoming request arrives */}
        </>
      )}
    </div>
  );
};

export default Chat;

