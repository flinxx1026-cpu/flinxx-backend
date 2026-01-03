// DEPLOYMENT VERSION: webrtc-stable-streams - Remote stream fix - 2025-12-20
// Last updated: 2025-12-20 - WebRTC remote black screen fix with persistent stream
// BUILD TIMESTAMP: 2025-12-20T00:00:00Z - STABLE REMOTE STREAM FIX
console.log('🎯 CHAT BUILD: 2025-12-20T00:00:00Z - WebRTC stable remote stream handling');
import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDuoSquad } from '../context/DuoSquadContext';
import socket from '../services/socketService';
import { getIceServers, getMediaConstraints, formatTime, logIceServers } from '../utils/webrtcUtils';
import PremiumModal from '../components/PremiumModal';
import GenderFilterModal from '../components/GenderFilterModal';
import ProfileModal from '../components/ProfileModal';
import MatchHistory from '../components/MatchHistory';
import SearchFriendsModal from '../components/SearchFriendsModal';
import TopActions from '../components/TopActions';
import TermsConfirmationModal from '../components/TermsConfirmationModal';
import logo from '../assets/flinxx-logo.svg';
import './Chat.css';

const Chat = () => {
  // 🧪 DEBUG TEST - Check if this log appears first
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

  // ✅ NOW CONSOLE LOG AND LOGIC AFTER ALL HOOKS
  console.log('🎯 CHAT COMPONENT LOADED - BUILD: 895cedd (temporal deadzone fix - move hooks to top)');

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
  
  // 🔥 Cleanup: Stop camera on unmount
  useEffect(() => {
    return () => {
      console.log('📹 [CLEANUP] Component unmounting - stopping camera');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log('📹 [CLEANUP] Stopping track:', track.kind);
          track.stop();
        });
        streamRef.current = null;
      }
    };
  }, []);

  // Auto-start camera preview on page load (lobby screen)
  // CRITICAL: Delayed initialization - only start after a short delay to ensure DOM is ready
  // IMPORTANT: Skip if coming from profile completion (view=home) - camera starts when user clicks "Start Video Chat"
  useEffect(() => {
    console.log('[Camera] ⏳ Auto-start useEffect triggered, shouldStartAsIntro:', shouldStartAsIntro);
    
    // Skip camera initialization if user just completed profile
    if (shouldStartAsIntro) {
      console.log('[Camera] ⏭️ Skipping auto camera init - user just completed profile (view=home)');
      console.log('[Camera] Camera will start when user clicks "Start Video Chat" button');
      console.log('[Camera] User must click button to start camera manually');
      return;
    }

    async function startPreview() {
      try {
        console.log('📹 [AUTO-START] Starting camera preview automatically...');
        console.log('📹 [AUTO-START] Chat component mounted, attempting to initialize camera');
        
        // Verify video element exists in DOM
        if (!localVideoRef.current) {
          console.error('📹 [AUTO-START] ❌ Video element not in DOM yet, cannot initialize camera');
          return;
        }
        
        console.log('📹 [AUTO-START] ✓ Video element found in DOM, requesting camera permissions');
        
        const previewStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        
        // Store the stream for later use in chat
        localStreamRef.current = previewStream;
        streamRef.current = previewStream;
        console.log('📹 [AUTO-START] ✅ Camera stream obtained:', previewStream);
        console.log('📹 [AUTO-START] Stream tracks:', previewStream.getTracks().map(t => ({ kind: t.kind, id: t.id })));
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = previewStream;
          localVideoRef.current.muted = true;
          
          // 🔥 CRITICAL: Wait for video to actually render frames before hiding loading
          localVideoRef.current.onloadedmetadata = () => {
            console.log('📹 [AUTO-START] ✅ Video metadata loaded, calling play()');
            
            localVideoRef.current.play().then(() => {
              console.log('📹 [AUTO-START] ✅ Video playing - setting isLocalCameraReady=true');
              setCameraStarted(true);
              setIsLocalCameraReady(true);
            }).catch((playErr) => {
              console.warn('📹 [AUTO-START] ⚠️ Play warning (but video loaded):', playErr.message);
              setCameraStarted(true);
              setIsLocalCameraReady(true);
            });
          };
        }
      } catch (err) {
        console.error('📹 [AUTO-START] ❌ Camera error:', err.message);
        console.error('📹 [AUTO-START] Error name:', err.name);
        console.error('📹 [AUTO-START] Error code:', err.code);
        
        // CRITICAL: Always hide loading placeholder even on error
        // User will need to click button manually if auto-start fails
        setIsLocalCameraReady(true);
      }
    }

    // CRITICAL FIX: Delay camera initialization slightly to ensure:
    // 1. Video element is mounted in DOM
    // 2. ProfileSetupModal has already been checked/dismissed
    // 3. Permission popup appears in correct context
    console.log('[Camera] Chat component useEffect triggered, scheduling camera init with delay');
    const timer = setTimeout(() => {
      console.log('[Camera] Delay complete, now calling startPreview()');
      startPreview();
    }, 100);

    return () => {
      console.log('[Camera] Chat component unmounting, clearing camera init timer');
      clearTimeout(timer);
    };
  }, [shouldStartAsIntro]);

  // ========================================
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
    console.log('🎬 [BUTTON CLICK] Current state - cameraStarted:', cameraStarted, 'isMatchingStarted:', isMatchingStarted);
    
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
    // Second click: Start matching ONLY (do NOT touch camera)
    else if (cameraStarted && !isMatchingStarted) {
      console.log('🎬 [MATCHING] User clicked "Start Video Chat" again - starting matching');
      console.log('🎬 [MATCHING] ⚠️ NOT reinitializing camera - stream already active');
      console.log('🎬 [MATCHING] Emitting find_partner event to server');
      
      setIsMatchingStarted(true);
      setIsLoading(true);

      // Emit find_partner to start matching - ONLY THIS, NO CAMERA CODE
      socket.emit('find_partner', {
        userId: userIdRef.current,  // USE REF FOR CONSISTENT ID
        userName: currentUser.name || 'Anonymous',
        userAge: currentUser.age || 18,
        userLocation: currentUser.location || 'Unknown',
        userPicture: currentUser.picture || null  // Include picture so partner can display it
      });

      console.log('🎬 [MATCHING] ✅ find_partner event emitted - now waiting for a partner');
    }
  };

  const sendMessage = () => {
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
  };

  const skipUser = () => {
    socket.emit('skip_user', {
      partnerSocketId: partnerSocketIdRef.current
    });
    endChat();
  };

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

  // Intro Screen Component
  const IntroScreen = () => {
    console.log("Dashboard render");
    
    return (
    <div className="dashboard">
      {/* LEFT PANEL - Flinxx Heading + Button */}
      <div className="left-panel">
        <h1 className="logo-text">Flinxx</h1>

        {/* Mode Toggle Buttons - SoloX / DuoX */}
        <div className="mode-switch">
          <button
            className={`mode-btn ${activeMode === 'solo' ? 'active' : ''}`}
            onClick={() => setActiveMode('solo')}
          >
            SoloX
          </button>

          <button
            className={`mode-btn ${activeMode === 'duo' ? 'active' : ''}`}
            onClick={() => {
              setActiveMode('duo');
              openDuoSquad();
            }}
          >
            DuoX
          </button>
        </div>

        <button
          onClick={startVideoChat}
          disabled={isLoading}
          className="start-btn"
        >
          {isLoading ? '⟳ Loading...' : '🎬 Start Video Chat'}
        </button>

        {/* Top Icons - Header Bar */}
        <div className="top-icons">
          {/* Profile Icon */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="icon"
            title="Profile"
          >
            👤
          </button>

          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="icon"
            title="Search"
          >
            🔍
          </button>

          {/* Heart Icon */}
          <button
            className="icon"
            title="Likes"
          >
            ❤️
          </button>

          {/* Chat Icon */}
          <button
            onClick={() => setActivePanel(activePanel === 'message' ? null : 'message')}
            className="icon"
            title="Messages"
          >
            💬
          </button>

          {/* Premium Icon */}
          <button
            onClick={() => setIsPremiumOpen(true)}
            className="icon"
            title="Premium"
          >
            👑
          </button>

          {/* History Icon */}
          <button
            onClick={() => setIsMatchHistoryOpen(true)}
            className="icon"
            title="History"
          >
            ⏱️
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - Camera Feed + Icons + You Badge */}
      <div className="right-panel">
        {/* RIGHT PANEL INNER WRAPPER - This is where the border goes */}
        <div className="right-panel-inner">
          {/* Inner Camera Wrapper */}
          <div className="camera-inner">
            {/* Camera Placeholder - Rendered BEFORE video so it sits below */}
            {!isLocalCameraReady && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#000',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '12px',
                zIndex: 1,
                pointerEvents: 'none'
              }}>
                Camera loading...
              </div>
            )}
          </div>

          {/* "You" Badge - Always render */}
          <div className="you-label">You</div>
        </div>
      </div>
    </div>
    );
  };

  // Waiting Screen Component - Shows when matching is in progress
  const WaitingScreen = () => {
    // Diagnostic logging for stream attachment issue
    useEffect(() => {
      console.log('\n\n🎬 ===== WAITING SCREEN DIAGNOSTIC CHECK =====\n');
      
      // Check 1: Video element
      const videoExists = !!localVideoRef.current;
      console.log('✅ CHECK 1: Video element found?', videoExists ? 'YES' : 'NO', localVideoRef.current);
      
      // Check 2: Local stream
      const streamExists = !!localStreamRef.current;
      console.log('✅ CHECK 2: Local stream valid?', streamExists ? 'YES' : 'NO', localStreamRef.current);
      
      // Check 3: Video track
      if (streamExists) {
        const videoTracks = localStreamRef.current.getVideoTracks();
        console.log('✅ CHECK 3: Does stream have video track?', videoTracks.length > 0 ? 'YES' : 'NO');
        if (videoTracks.length > 0) {
          const videoTrack = videoTracks[0];
          console.log('   - kind:', videoTrack.kind);
          console.log('   - enabled:', videoTrack.enabled);
          console.log('   - readyState:', videoTrack.readyState);
          console.log('   - id:', videoTrack.id);
        }
      }
      
      // Check 4: Stream attached to video
      if (videoExists && streamExists) {
        const isAttached = localVideoRef.current.srcObject === localStreamRef.current;
        console.log('✅ CHECK 4: Stream attached to video element?', isAttached ? 'YES' : 'NO');
        
        // If not attached, attach it now
        if (!isAttached) {
          console.log('   → Attaching stream to video element NOW...');
          localVideoRef.current.srcObject = localStreamRef.current;
          localVideoRef.current.muted = true;
          console.log('   → Stream attached!');
        }
      }
      
      console.log('\n🎬 ===== END DIAGNOSTIC CHECK =====\n\n');
    }, [isMatchingStarted]);

    return (
    <div className="dashboard">
      {/* Left - Live camera preview box */}
      <div className="left-panel">
        {/* Camera Placeholder - Shows while loading */}
        {!isLocalCameraReady && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '12px',
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            Camera loading...
          </div>
        )}
        
        {/* You Badge */}
        <div className="you-badge">You</div>
      </div>

      {/* Right - Dark Waiting Panel with golden accents */}
      <div className="right-panel">
        <div className="flex flex-col items-center justify-center text-center gap-8 py-20">
          {/* Animated Waiting Icon */}
          <div className="animate-pulse text-6xl">
            🔍
          </div>

          {/* Waiting Text */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold" style={{ color: '#d9b85f' }}>Looking for a partner...</h2>
            <p className="text-sm" style={{ color: '#d9b85f' }}>Matching you with someone nearby</p>
          </div>

          {/* Animated dots */}
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d9b85f', animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d9b85f', animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d9b85f', animationDelay: '0.4s' }}></div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => {
              console.log('🔙 Cancel matching - emitting cancel_matching event');
              // CRITICAL: Remove from queue on server before changing UI
              socket.emit('cancel_matching', {
                userId: userIdRef.current,
                timestamp: new Date().toISOString()
              });
              setIsMatchingStarted(false);
              setIsLoading(false);
            }}
            className="w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm shadow-lg mt-4"
            style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}
          >
            Cancel Search
          </button>
        </div>
      </div>
    </div>
    );
  };

  // Video Chat Screen Component
  // 🔥 GLOBAL LOCAL VIDEO - NEVER UNMOUNTS
  // Persistent video element that stays mounted across all screens
  const GlobalLocalVideo = () => {
    return (
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="global-local-video"
      />
    );
  };

  const VideoChatScreen = () => {
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
    <div className="dashboard">
        
        {/* DUAL CAMERA LAYOUT - Side by Side */}
        <div className="w-full max-w-5xl flex gap-6 flex-1">
          
          {/* LEFT CAMERA - Remote Video */}
          <div className="flex-1 rounded-2xl shadow-2xl overflow-hidden relative" style={{ backgroundColor: '#000', border: '1px solid #d9b85f', minHeight: '400px', aspectRatio: '16/9' }}>
            {/* Remote video wrapper */}
            <div id="remote-video-wrapper" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Remote video element */}
              <video
                id="remote-video-singleton"
                ref={remoteVideoRef}
                autoPlay={true}
                playsInline={true}
                muted={true}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: 'black',
                  display: hasPartner ? 'block' : 'none',
                  zIndex: 10
                }}
              />
              
              {/* Placeholder shown when no partner */}
              {!hasPartner && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}>
                  <p style={{ color: '#d9b85f', fontSize: '14px' }}>Waiting for partner video...</p>
                </div>
              )}

              {/* Partner info overlay - Top Left */}
              {hasPartner && (
                <div className="absolute top-4 left-4 flex items-center gap-3 z-50 backdrop-blur-sm px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 overflow-hidden">
                    {partnerInfo && partnerInfo.picture ? (
                      <img src={partnerInfo.picture} alt="Partner" className="w-full h-full object-cover" />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#d9b85f' }}>
                      {partnerInfo ? partnerInfo.userName : 'Partner'}
                    </p>
                    <p className="text-xs" style={{ color: '#d9b85f' }}>
                      {partnerInfo ? partnerInfo.userLocation : 'Online'}
                    </p>
                  </div>
                </div>
              )}

              {/* Connection status overlay - Top Right */}
              {isConnected && hasPartner && (
                <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold z-50 shadow-lg px-3 py-2 rounded-full" style={{ backgroundColor: 'rgba(217, 184, 95, 0.9)', color: '#0f0f0f' }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0f0f0f' }}></span>
                  {formatTime(connectionTime)}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CAMERA - Local Video Placeholder */}
          <div className="flex-1 rounded-2xl shadow-2xl overflow-hidden relative" style={{ backgroundColor: '#000', border: '1px solid #d9b85f', minHeight: '400px', aspectRatio: '16/9' }}>
            {/* Placeholder - actual video element is in root */}
            {!isLocalCameraReady && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '12px',
                zIndex: 0
              }}>
                Camera loading...
              </div>
            )}
            
            {/* You badge */}
            <div className="you-badge" style={{ zIndex: 2 }}>You</div>
          </div>
        </div>

        {/* BOTTOM CONTROLS - Center aligned */}
        <div className="w-full max-w-5xl flex items-center justify-center gap-4 pb-4" style={{ backgroundColor: 'transparent' }}>
          {/* Skip Button */}
          <button
            onClick={() => {
              console.log('Skip pressed');
              // Skip logic handled by parent
            }}
            className="px-6 py-3 rounded-xl font-bold transition-all text-sm"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #d9b85f',
              color: '#d9b85f',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(217, 184, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ⏭ Skip
          </button>

          {/* Next Button */}
          <button
            onClick={() => {
              console.log('Next pressed');
              // Next logic handled by parent
            }}
            className="px-6 py-3 rounded-xl font-bold transition-all text-sm"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #d9b85f',
              color: '#d9b85f',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(217, 184, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ⏭ Next
          </button>

          {/* Report Button */}
          <button
            onClick={() => {
              console.log('Report pressed');
              // Report logic handled by parent
            }}
            className="px-6 py-3 rounded-xl font-bold transition-all text-sm"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #d9b85f',
              color: '#d9b85f',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(217, 184, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ⚠️ Report
          </button>
        </div>
    </div>
    );
  };

  return (
    <>
      {/* ✅ Terms modal – SAFE (no hook violation) */}
      {showTermsModal && (
        <TermsConfirmationModal
          onCancel={handleDashboardTermsCancel}
          onContinue={handleDashboardTermsAccept}
        />
      )}

      {/* ✅ Loading state or chat UI */}
      {!termsCheckComplete ? (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center">
          <div className="text-center text-white">
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen w-screen overflow-visible min-h-0" style={{ backgroundColor: '#0f0f0f', overflow: 'visible', position: 'relative' }}>
          
          {/* 🔥 GLOBAL LOCAL VIDEO (NEVER UNMOUNTS) */}
          <GlobalLocalVideo />

          {/* Screens */}
          {hasPartner ? (
            // Partner found: Show video chat (includes remote video inside)
            <VideoChatScreen />
          ) : isMatchingStarted ? (
            // Matching in progress: Show waiting screen
            <WaitingScreen />
          ) : (
            // Initial state: Show intro screen
            <IntroScreen />
          )}

          {/* Premium Modal */}
          <PremiumModal 
            isOpen={isPremiumOpen} 
            onClose={() => setIsPremiumOpen(false)} 
          />

          {/* Profile Modal */}
          <ProfileModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)}
            onOpenPremium={() => setIsPremiumOpen(true)}
            onReinitializeCamera={cameraFunctionsRef.current?.reinitializeCamera}
          />

          {/* Match History Modal */}
          <MatchHistory 
            isOpen={isMatchHistoryOpen} 
            onClose={() => setIsMatchHistoryOpen(false)}
          />

          {/* Search Friends Modal */}
          <SearchFriendsModal 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)}
            mode="search"
            onUserSelect={(user) => {
              console.log('Selected user from search:', user);
              // TODO: Navigate to user profile or open chat
            }}
          />

          {/* Top Panel (Notifications or Messages) */}
          <SearchFriendsModal 
            isOpen={activePanel !== null} 
            onClose={() => setActivePanel(null)}
            mode={activePanel === 'message' ? 'message' : 'notifications'}
          />

          {/* Gender Filter Modal */}
          <GenderFilterModal 
            isOpen={isGenderFilterOpen} 
            onClose={() => setIsGenderFilterOpen(false)}
            currentGender={selectedGender}
            onOpenPremium={() => setIsPremiumOpen(true)}
          />

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
        </div>
      )}
    </>
  );
};

export default Chat;

