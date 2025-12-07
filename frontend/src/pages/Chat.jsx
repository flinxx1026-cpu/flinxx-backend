// DEPLOYMENT VERSION: fd2deed - Dark theme with golden accents (#0f0f0f bg, #d9b85f borders/text) - 2025-12-07
// Last updated: 2025-12-02 - Force Vercel rebuild
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import socket from '../services/socketService';
import { getIceServers, getMediaConstraints, formatTime, logIceServers } from '../utils/webrtcUtils';
import PremiumModal from '../components/PremiumModal';
import GenderFilterModal from '../components/GenderFilterModal';
import ProfileModal from '../components/ProfileModal';
import MatchHistory from '../components/MatchHistory';
import logo from '../assets/flinxx-logo.svg';
import './Chat.css';

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext) || {};

  // Check if we should start on home/intro screen (after profile completion)
  const params = new URLSearchParams(location.search);
  const viewParam = params.get('view');
  const shouldStartAsIntro = viewParam === 'home';

  console.log('[Chat] Location search params:', location.search);
  console.log('[Chat] view parameter:', viewParam);
  console.log('[Chat] shouldStartAsIntro:', shouldStartAsIntro);

  // Create a ref to expose camera functions to child components
  const cameraFunctionsRef = useRef(null);

  // Peer connection reference
  let peerConnection = null;
  const currentUser = user || {
    googleId: "guest_" + Math.random().toString(36).substring(2, 9),
    name: "Guest User",
    email: "guest@flinxx.local",
    picture: null
  };

  // Monitor guest session timeout
  const guestSessionTimerRef = useRef(null);
  const [showGuestTimeoutModal, setShowGuestTimeoutModal] = useState(false);

  useEffect(() => {
    // Skip guest session monitoring since authentication is removed
    return () => {
      if (guestSessionTimerRef.current) {
        clearInterval(guestSessionTimerRef.current);
      }
    };
  }, []);

  // Video and stream state
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const partnerSocketIdRef = useRef(null);  // CRITICAL: Store partner socket ID for sending offers/answers

  // Log ref initialization
  useEffect(() => {
    console.log('📌 Refs initialized - localVideoRef:', localVideoRef.current);
  }, []);

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
      
      try {
        const playPromise = localVideoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        console.log('🎥 [REINIT] ✅ New camera preview playing successfully');
        setCameraStarted(true);
        console.log('🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====\n\n');
        return true;
      } catch (err) {
        console.error('🎥 [REINIT] ❌ Error playing new video:', err);
        return false;
      }
    } catch (err) {
      console.error('🎥 [REINIT] ❌ Error reinitializing camera:', err);
      console.error('🎥 [REINIT] Error name:', err.name);
      console.error('🎥 [REINIT] Error message:', err.message);
      console.error('🎥 ===== CAMERA RE-INITIALIZATION FAILED =====\n\n');
      return false;
    }
  }, []); // Empty dependency array - function doesn't depend on state

  // Assign reinitializeCamera to ref so it can be accessed from ProfileModal
  useEffect(() => {
    cameraFunctionsRef.current = {
      reinitializeCamera
    };
  }, [reinitializeCamera]);

  // UI state
  const [cameraStarted, setCameraStarted] = useState(false);
  const [isMatchingStarted, setIsMatchingStarted] = useState(false);  // NEW: Separate state for matching
  const [hasPartner, setHasPartner] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [connectionTime, setConnectionTime] = useState(0);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isGenderFilterOpen, setIsGenderFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMatchHistoryOpen, setIsMatchHistoryOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState('both');
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // CRITICAL: Monitor video element mounting and auto-attach stream when element is ready
  useEffect(() => {
    console.log('🎥 [VIDEO MOUNT DETECTOR] Checking video element mount status');
    console.log('   localVideoRef.current exists:', !!localVideoRef.current);
    console.log('   localStreamRef.current exists:', !!localStreamRef.current);
    console.log('   cameraStarted:', cameraStarted);
    
    if (localVideoRef.current && localStreamRef.current && cameraStarted) {
      console.log('🎥 [VIDEO MOUNT DETECTOR] ✅ Video element is mounted on DOM');
      console.log('🎥 [VIDEO MOUNT DETECTOR] Attaching stream to video element:', localStreamRef.current);
      console.log('🎥 [VIDEO MOUNT DETECTOR] Video element dimensions:', {
        width: localVideoRef.current.clientWidth,
        height: localVideoRef.current.clientHeight,
        offsetWidth: localVideoRef.current.offsetWidth,
        offsetHeight: localVideoRef.current.offsetHeight,
        displayStyle: localVideoRef.current.style.display,
        computedDisplay: window.getComputedStyle(localVideoRef.current).display
      });
      
      // Attach stream to video element
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.muted = true;
      
      console.log('🎥 [VIDEO MOUNT DETECTOR] Stream attached, srcObject set');
      console.log('🎥 [VIDEO MOUNT DETECTOR] Attempting to play video...');
      
      // Attempt to play video with proper error handling
      setTimeout(async () => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          try {
            console.log('🎥 [VIDEO MOUNT DETECTOR] Calling video.play()');
            await localVideoRef.current.play();
            console.log('🎥 [VIDEO MOUNT DETECTOR] ✅ Video playing successfully');
            console.log('🎥 [VIDEO MOUNT DETECTOR] Video readyState:', localVideoRef.current.readyState);
            console.log('🎥 [VIDEO MOUNT DETECTOR] Video paused:', localVideoRef.current.paused);
          } catch (err) {
            console.error('🎥 [VIDEO MOUNT DETECTOR] ❌ Play error:', err);
            console.error('🎥 [VIDEO MOUNT DETECTOR] Error name:', err.name);
            console.error('🎥 [VIDEO MOUNT DETECTOR] Error message:', err.message);
          }
        }
      }, 100);
    } else {
      console.warn('🎥 [VIDEO MOUNT DETECTOR] ⚠️ Cannot attach stream - missing:');
      if (!localVideoRef.current) console.warn('   - localVideoRef.current (DOM element)');
      if (!localStreamRef.current) console.warn('   - localStreamRef.current (media stream)');
      if (!cameraStarted) console.warn('   - cameraStarted flag is false');
    }
  }, [localVideoRef, localStreamRef, cameraStarted]);

  // Ensure video stream is attached when camera starts (original effect)
  useEffect(() => {
    if (cameraStarted && localStreamRef.current && localVideoRef.current) {
      console.log('🎥 [CAMERA START] Attaching stream to video element:', localStreamRef.current);
      console.log('🎥 [CAMERA START] Video element dimensions:', {
        width: localVideoRef.current.clientWidth,
        height: localVideoRef.current.clientHeight,
        offsetWidth: localVideoRef.current.offsetWidth,
        offsetHeight: localVideoRef.current.offsetHeight
      });
      
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.muted = true;
      
      // Attempt to play video
      setTimeout(async () => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          try {
            await localVideoRef.current.play();
            console.log('✅ Video playing successfully');
          } catch (err) {
            console.error('❌ Play error:', err);
          }
        }
      }, 100);
    }
  }, [cameraStarted]);

  // Auto-start camera preview on page load (lobby screen)
  // CRITICAL: Delayed initialization - only start after a short delay to ensure DOM is ready
  // IMPORTANT: Skip if coming from profile completion (view=home) - camera starts when user clicks "Start Video Chat"
  useEffect(() => {
    // Skip camera initialization if user just completed profile
    if (shouldStartAsIntro) {
      console.log('[Camera] ⏭️ Skipping auto camera init - user just completed profile (view=home)');
      console.log('[Camera] Camera will start when user clicks "Start Video Chat" button');
      return;
    }

    async function startPreview() {
      try {
        console.log('📹 Starting camera preview...');
        console.log('📹 [INIT] Chat component mounted, attempting to initialize camera');
        
        // Verify video element exists in DOM
        if (!localVideoRef.current) {
          console.error('📹 [INIT] ❌ Video element not in DOM yet, cannot initialize camera');
          return;
        }
        
        console.log('📹 [INIT] ✓ Video element found in DOM, requesting camera permissions');
        
        const previewStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        
        // Store the stream for later use in chat
        localStreamRef.current = previewStream;
        console.log('[Camera] ✅ Camera stream obtained');
        console.log('[Camera] Stream tracks:', previewStream.getTracks().map(t => ({ kind: t.kind, id: t.id })));
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = previewStream;
          localVideoRef.current.muted = true;
          
          // Attempt to play video
          try {
            await localVideoRef.current.play();
            console.log('✅ Camera preview playing successfully');
            setCameraStarted(true);
          } catch (err) {
            console.error('❌ Preview play error:', err);
          }
        }
      } catch (err) {
        console.log('📷 Camera preview error (this is OK, user may deny permission):', err.message);
        console.log('📷 Error name:', err.name);
        console.log('📷 Error code:', err.code);
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

  // Debug: Monitor wrapper element when partner connects
  useEffect(() => {
    if (hasPartner) {
      setTimeout(() => {
        const wrapper = document.getElementById('remote-video-wrapper');
        const video = document.getElementById('remote-video');
        if (wrapper && video) {
          const wrapperRect = wrapper.getBoundingClientRect();
          const videoRect = video.getBoundingClientRect();
          const wrapperComputed = window.getComputedStyle(wrapper);
          const videoComputed = window.getComputedStyle(video);
          
          console.log('\n\n🎥 ===== WRAPPER & VIDEO DEBUG (AFTER PARTNER FOUND) =====');
          console.log('📦 Remote video wrapper dimensions:', {
            width: wrapperRect.width,
            height: wrapperRect.height,
            top: wrapperRect.top,
            left: wrapperRect.left,
            display: wrapperComputed.display,
            position: wrapperComputed.position,
            zIndex: wrapperComputed.zIndex,
            overflow: wrapperComputed.overflow,
            backgroundColor: wrapperComputed.backgroundColor
          });
          console.log('🎬 Video element dimensions:', {
            width: videoRect.width,
            height: videoRect.height,
            top: videoRect.top,
            left: videoRect.left,
            display: videoComputed.display,
            position: videoComputed.position,
            zIndex: videoComputed.zIndex,
            objectFit: videoComputed.objectFit
          });
          console.log('🎬 Video element properties:', {
            srcObject: !!video.srcObject,
            srcObjectTracks: video.srcObject?.getTracks().length,
            readyState: video.readyState,
            networkState: video.networkState,
            currentTime: video.currentTime,
            duration: video.duration,
            paused: video.paused,
            volume: video.volume
          });
          console.log('📦 Wrapper visible in viewport:', wrapperRect.height > 0 && wrapperRect.width > 0);
          console.log('🎬 Video visible in viewport:', videoRect.height > 0 && videoRect.width > 0);
        }
      }, 500);
    }
  }, [hasPartner]);

  // ========================================
  // CRITICAL: Setup socket listeners ONCE on component mount
  // This must run only once, NOT every time startVideoChat is called
  // ========================================
  useEffect(() => {
    console.log('\n\n🔌 ===== SOCKET LISTENERS SETUP (COMPONENT MOUNT) =====');
    console.log('🔌 Setting up socket listeners - runs ONCE on component load');
    console.log('🔌 Socket ID:', socket.id);
    console.log('🔌 Socket connected:', socket.connected);
    
    // Clean up old listeners to prevent duplicates
    socket.off('partner_found');
    socket.off('webrtc_offer');
    socket.off('webrtc_answer');
    socket.off('ice-candidate');
    socket.off('receive_message');
    socket.off('partner_disconnected');
    socket.off('disconnect');
    console.log('🔌 Removed old listeners (if any existed)');
    
    // Partner found - fires for BOTH offerer AND answerer
    socket.on('partner_found', async (data) => {
      console.log('\n\n📋 ===== PARTNER FOUND EVENT RECEIVED =====');
      console.log('👥 Partner found:', data);
      console.log('👥 My socket ID:', socket.id);
      console.log('👥 Partner socket ID:', data.socketId);
      console.log('📊 Stream status before peer connection:', {
        exists: !!localStreamRef.current,
        trackCount: localStreamRef.current?.getTracks().length,
        tracks: localStreamRef.current?.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, state: t.readyState }))
      });
      
      // CRITICAL: Store partner socket ID for sending offers/answers
      partnerSocketIdRef.current = data.socketId;
      console.log('🔌 CRITICAL: Stored partner socket ID:', partnerSocketIdRef.current);
      console.log('🔌 CRITICAL: Verification - partnerSocketIdRef.current is now:', partnerSocketIdRef.current);
      
      setHasPartner(true);
      setPartnerInfo(data);

      // CRITICAL: Determine who should send the offer
      // The peer with the LOWER socket ID (lexicographically) is the OFFERER
      const mySocketId = socket.id;
      const partnerSocketId = data.socketId;
      const amIOfferer = mySocketId < partnerSocketId;
      
      console.log('🔍 SOCKET ID COMPARISON:');
      console.log('   My socket ID:', mySocketId);
      console.log('   Partner socket ID:', partnerSocketId);
      console.log('   Am I offerer? (myID < partnerID):', amIOfferer);
      
      if (!amIOfferer) {
        console.log('📭 I am the ANSWERER - waiting for offer from offerer');
        return;
      }
      
      console.log('📬 I am the OFFERER - creating peer connection and sending offer');

      // Create peer connection and send offer
      try {
        console.log('\n🏠 OFFERER: Creating peer connection');
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
        } else {
          console.error('❌ OFFERER: No local stream available - TRACKS WILL NOT BE SENT!');
          console.error('❌ OFFERER: localStreamRef.current is:', localStreamRef.current);
        }

        // Create and send offer
        console.log('\n📋 ===== OFFERER CREATING AND SENDING OFFER =====');
        console.log('🎬 OFFERER: Creating WebRTC offer');
        const offer = await pc.createOffer();
        console.log('✅ OFFERER: Offer created:', offer);
        
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
        const answer = await peerConnectionRef.current.createAnswer();
        console.log('✅ ANSWERER: Answer created');
        
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
    socket.on('ice-candidate', async (data) => {
      console.log('\n🧊 ICE candidate received from peer:', {
        candidate: data.candidate,
        sdpMLineIndex: data.sdpMLineIndex,
        sdpMid: data.sdpMid
      });
      try {
        if (peerConnectionRef.current) {
          console.log('🧊 Adding ICE candidate to peer connection');
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data)
          );
          console.log('✅ ICE candidate added successfully\n');
        } else {
          console.warn('⚠️ No peer connection available for ICE candidate');
        }
      } catch (err) {
        console.error('❌ Error adding ICE candidate:', err);
      }
    });

    // Receive message
    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'partner',
        text: data.message,
        timestamp: new Date()
      }]);
    });

    // Partner disconnected
    socket.on('partner_disconnected', () => {
      console.log('Partner disconnected');
      endChat();
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      cleanup();
    });
    
    console.log('🔌 ===== ALL SOCKET LISTENERS REGISTERED =====');
    console.log('🔌 Listeners registered for: partner_found, webrtc_offer, webrtc_answer, ice-candidate, receive_message, partner_disconnected, disconnect');
    console.log('🔌 Ready to receive WebRTC signaling messages\n\n');
    
    // Cleanup function to remove listeners on unmount
    return () => {
      console.log('🧹 Removing socket listeners on component unmount');
      socket.off('partner_found');
      socket.off('webrtc_offer');
      socket.off('webrtc_answer');
      socket.off('ice-candidate');
      socket.off('receive_message');
      socket.off('partner_disconnected');
      socket.off('disconnect');
    };
  }, []); // Empty dependency array - runs ONCE on component mount

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
      // Try to fetch TURN servers from backend (XirSys API)
      const res = await fetch("https://flinxx-backend.onrender.com/api/turn");
      const data = await res.json();

      if (data?.v?.iceServers) {
        console.log('✅ TURN servers fetched from backend API');
        
        // Convert XirSys format → WebRTC format
        const iceServers = data.v.iceServers;
        return iceServers;
      } else {
        console.warn('⚠️ Invalid XirSys TURN response from backend, using fallback');
        throw new Error("Invalid XirSys TURN response");
      }
    } catch (error) {
      console.error('❌ Error fetching TURN servers from backend:', error.message);
      console.log('🔄 Using fallback TURN configuration from getIceServers()');
      
      // Fallback to static configuration - returns array directly
      return getIceServers();
    }
  };

  const createPeerConnection = async () => {
    console.log('🔧 createPeerConnection called');
    console.log('   Current localStreamRef:', localStreamRef.current);
    
    // Log ICE server configuration for diagnostics
    logIceServers();
    
    const iceServers = await getTurnServers();

    peerConnection = new RTCPeerConnection({ iceServers });
    console.log('✅ RTCPeerConnection created');

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('🧊 ICE candidate generated:', {
              candidate: event.candidate.candidate,
              protocol: event.candidate.protocol,
              port: event.candidate.port,
              address: event.candidate.address,
              type: event.candidate.type,
              priority: event.candidate.priority,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              sdpMid: event.candidate.sdpMid
            });
            
            // Detect TURN candidate success/failure
            if (event.candidate.type === 'relay') {
              console.log('🔄 RELAY (TURN) candidate generated - TURN server is reachable');
              console.log('   Protocol:', event.candidate.protocol, 'Port:', event.candidate.port);
            } else if (event.candidate.type === 'srflx') {
              console.log('📍 SRFLX (server reflexive) candidate - STUN working');
              console.log('   Found public address via STUN');
            } else if (event.candidate.type === 'host') {
              console.log('🏠 HOST candidate - direct LAN connection possible');
            }
            
            console.log('🔌 Sending ICE candidate to partner socket:', partnerSocketIdRef.current);
            socket.emit("ice-candidate", {
              candidate: event.candidate,
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
            break;
          case 'disconnected':
            console.warn('⚠️ State: DISCONNECTED - Lost connection to peer');
            console.warn('⚠️ Will attempt to reconnect');
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

    peerConnection.ontrack = (event) => {
        console.log('\n\n📥 ===== REMOTE TRACK RECEIVED =====');
        console.log('📥 Remote track received:', {
          kind: event.track.kind,
          id: event.track.id,
          enabled: event.track.enabled,
          readyState: event.track.readyState
        });
        console.log('📥 Event streams:', event.streams.map(s => ({
          id: s.id,
          active: s.active,
          trackCount: s.getTracks().length,
          tracks: s.getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled }))
        })));
        
        if (remoteVideoRef.current) {
            console.log('📺 Setting remote video srcObject');
            const stream = event.streams[0];
            remoteVideoRef.current.srcObject = stream;
            
            // Debug: Check what was set
            console.log('📺 srcObject set, checking video element:', {
              srcObject: remoteVideoRef.current.srcObject,
              srcObjectActive: remoteVideoRef.current.srcObject?.active,
              srcObjectTracks: remoteVideoRef.current.srcObject?.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })),
              videoReadyState: remoteVideoRef.current.readyState,
              videoNetworkState: remoteVideoRef.current.networkState,
              videoCurrentTime: remoteVideoRef.current.currentTime
            });
            
            remoteVideoRef.current.style.display = "block";
            remoteVideoRef.current.style.width = "100%";
            remoteVideoRef.current.style.height = "100%";
            remoteVideoRef.current.style.objectFit = "cover";
            console.log('✅ Remote video srcObject set successfully');
            console.log('📥 ===== REMOTE TRACK SETUP COMPLETE =====\n\n');
        } else {
            console.error('❌ remoteVideoRef.current is not available!');
        }
    };

    peerConnection.onconnectionstatechange = () => {
        console.log("🔄 Connection State Changed:", peerConnection.connectionState);
        console.log("   ICE Connection State:", peerConnection.iceConnectionState);
        console.log("   ICE Gathering State:", peerConnection.iceGatheringState);
        console.log("   Signaling State:", peerConnection.signalingState);
        
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
          console.log('✅ WebRTC connection ESTABLISHED');
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

  const startVideoChat = async () => {
    // First click: Initialize camera only (no matching yet)
    if (!cameraStarted) {
      console.log('🎬 [START] User clicked "Allow Camera & Continue" - requesting camera permission');
      
      // Prevent multiple simultaneous requests
      if (isRequestingCamera) {
        console.warn('⚠️ Camera request already in progress');
        return;
      }

      try {
        setIsRequestingCamera(true);
        setIsLoading(true);

        console.log('📹 [INIT] Requesting camera permission from browser...');
        
        // First time: Request camera permission and get stream
        const previewStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        
        // Store the stream for later use
        localStreamRef.current = previewStream;
        console.log('[Camera] ✅ Camera stream obtained');
        console.log('[Camera] Stream tracks:', previewStream.getTracks().map(t => ({ kind: t.kind, id: t.id })));
        
        // Attach stream to video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = previewStream;
          localVideoRef.current.muted = true;
          
          try {
            await localVideoRef.current.play();
            console.log('✅ Camera preview playing successfully');
          } catch (err) {
            console.error('❌ Play error:', err);
          }
        }

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
        userId: currentUser.googleId || currentUser.id,
        userName: currentUser.name || 'Anonymous',
        userAge: currentUser.age || 18,
        userLocation: currentUser.location || 'Unknown'
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
      message: messageInput
    });
    setMessageInput('');
  };

  const skipUser = () => {
    socket.emit('skip_user');
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

    // Look for new partner
    socket.emit('find_partner', {
      userId: currentUser.googleId || currentUser.id,
      userName: currentUser.name || 'Anonymous',
      userAge: currentUser.age || 18,
      userLocation: currentUser.location || 'Unknown'
    });
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
  const IntroScreen = () => (
    <div className="intro-screen-container flex flex-row w-full max-w-[1500px] mx-auto gap-12 px-10 mt-20 items-start relative overflow-hidden" style={{ minHeight: '100vh', height: 'auto', backgroundColor: '#0f0f0f' }}>
      {/* Top-Right Icon Navigation Bar */}
      <div className="top-right-icons">
        {/* User Profile Icon - 1 */}
        <div 
          className="icon-circle" 
          title="Profile"
          onClick={() => setIsProfileOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          {currentUser?.picture ? (
            <img src={currentUser.picture} alt="Profile" />
          ) : (
            '👤'
          )}
        </div>

        {/* Search Icon - 2 */}
        <div 
          className="icon-circle" 
          title="Search"
          onClick={() => console.log('Search clicked')}
        >
          🔍
        </div>

        {/* Messages Icon - 3 */}
        <div 
          className="icon-circle" 
          title="Messages"
          onClick={() => console.log('Messages clicked')}
        >
          💬
        </div>

        {/* Flinx Premium Icon - 4 */}
        <div 
          className="icon-circle" 
          title="Flinx Premium"
          onClick={() => setIsPremiumOpen(true)}
        >
          👑
        </div>

        {/* Match History Icon - 5 */}
        <div 
          className="icon-circle" 
          title="Match History"
          onClick={() => setIsMatchHistoryOpen(true)}
        >
          ⏱️
        </div>
      </div>

      {/* Left - Live camera preview box */}
      <div className="video-box flex-1 rounded-3xl shadow-xl flex items-center justify-center" style={{ height: '520px', backgroundColor: 'transparent', border: '1px solid #d9b85f' }}>
        <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative" style={{ border: '1px solid #d9b85f' }}>
          <video
            ref={localVideoRef}
            autoPlay={true}
            playsInline={true}
            muted={true}
            className="w-full h-full object-cover"
            style={{
              backgroundColor: '#000000',
              transform: 'none',
              zoom: 1,
              display: 'block'
            }}
          />
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: '1px solid #d9b85f' }}>
            <p className="font-semibold text-sm" style={{ color: '#d9b85f' }}>You</p>
          </div>
        </div>
      </div>

      {/* Right - Welcome panel with dark theme */}
      <div className="right-panel flex-1 rounded-3xl shadow-xl p-12 pb-16 space-y-6 flex items-center justify-center" style={{ height: '520px', backgroundColor: '#131313', border: '1px solid #d9b85f' }}>
        <div className="w-full h-full rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-between text-center">
          {/* Top Section - Toggle Buttons */}
          <div className="flex gap-3 justify-center">
            <button className="text-white font-bold py-2 px-6 rounded-lg transition-all text-sm shadow-md hover:shadow-lg" style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}>
              SOLO
            </button>
            <button className="text-white font-bold py-2 px-6 rounded-lg transition-all text-sm" style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}>
              DUO
            </button>
          </div>

          {/* Middle Section - Welcome Content */}
          <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="Flinxx" className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-black mb-2" style={{ color: '#d9b85f' }}>Flinxx</h1>
              <p className="text-sm" style={{ color: '#d9b85f' }}>Make new friends face-to-face</p>
            </div>

            {/* Preference Badge */}
            <button 
              onClick={() => setIsGenderFilterOpen(true)}
              className="rounded-full px-4 py-1 transition-all cursor-pointer text-xs"
              style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}
            >
              <span className="font-semibold">👥 {selectedGender === 'girls' ? 'Girls Only' : selectedGender === 'guys' ? 'Guys Only' : 'Both'}</span>
            </button>
          </div>

          {/* Bottom Section - Start Button */}
          <button
            onClick={startVideoChat}
            disabled={isLoading}
            className="w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm shadow-lg"
            style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block mr-2">⟳</span> {cameraStarted ? 'Starting Match...' : 'Requesting Access...'}
              </>
            ) : (
              cameraStarted ? 'Start Video Chat' : 'Allow Camera & Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Waiting Screen Component - Shows when matching is in progress
  const WaitingScreen = () => (
    <div className="flex flex-row w-full max-w-[1500px] mx-auto gap-12 px-10 mt-20 items-start relative overflow-hidden" style={{ minHeight: '100vh', height: 'auto', backgroundColor: '#0f0f0f' }}>
      {/* Top-Right Icon Navigation Bar */}
      <div className="top-right-icons">
        {/* User Profile Icon - 1 */}
        <div 
          className="icon-circle" 
          title="Profile"
          onClick={() => setIsProfileOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          {currentUser?.picture ? (
            <img src={currentUser.picture} alt="Profile" />
          ) : (
            '👤'
          )}
        </div>

        {/* Search Icon - 2 */}
        <div 
          className="icon-circle" 
          title="Search"
          onClick={() => console.log('Search clicked')}
        >
          🔍
        </div>

        {/* Messages Icon - 3 */}
        <div 
          className="icon-circle" 
          title="Messages"
          onClick={() => console.log('Messages clicked')}
        >
          💬
        </div>

        {/* Flinx Premium Icon - 4 */}
        <div 
          className="icon-circle" 
          title="Flinx Premium"
          onClick={() => setIsPremiumOpen(true)}
        >
          👑
        </div>

        {/* Match History Icon - 5 */}
        <div 
          className="icon-circle" 
          title="Match History"
          onClick={() => setIsMatchHistoryOpen(true)}
        >
          ⏱️
        </div>
      </div>

      {/* Left - Live camera preview box */}
      <div className="video-box flex-1 rounded-3xl shadow-xl flex items-center justify-center" style={{ height: '520px', backgroundColor: 'transparent', border: '1px solid #d9b85f' }}>
        <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative" style={{ border: '1px solid #d9b85f' }}>
          <video
            ref={localVideoRef}
            autoPlay={true}
            playsInline={true}
            muted={true}
            className="w-full h-full object-cover"
            style={{
              backgroundColor: '#000000',
              transform: 'none',
              zoom: 1,
              display: 'block'
            }}
          />
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: '1px solid #d9b85f' }}>
            <p className="font-semibold text-sm" style={{ color: '#d9b85f' }}>You</p>
          </div>
        </div>
      </div>

      {/* Right - Dark Waiting Panel with golden accents */}
      <div className="right-panel flex-1 rounded-3xl shadow-xl flex flex-col" style={{ height: '520px', position: 'relative', backgroundColor: '#131313', border: '1px solid #d9b85f', padding: 0 }}>
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
              console.log('🔙 Cancel matching');
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

  // Video Chat Screen Component
  const VideoChatScreen = () => (
    <div className="flex flex-row w-full max-w-[1500px] mx-auto gap-12 px-10 mt-20 items-start relative overflow-hidden" style={{ minHeight: '100vh', height: 'auto', backgroundColor: '#0f0f0f' }}>
      {/* Close Button - Round X Icon at Top Right */}
      <button
        onClick={() => {
          cleanup();
          setCameraStarted(false);
          navigate('/chat');
        }}
        className="absolute top-5 right-5 font-bold rounded-full transition-all duration-200 z-20 shadow-lg flex items-center justify-center"
        style={{ width: '45px', height: '45px', fontSize: '24px', backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}
        title="End Chat"
      >
        ✕
      </button>

      {/* Main video container - responsive layout */}
      <div className="flex flex-col md:flex-row w-full gap-10 items-stretch justify-center" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
        
        {/* Left - Local camera video */}
        <div className="video-box flex-1 rounded-3xl shadow-xl flex items-center justify-center" style={{ height: '520px', backgroundColor: 'transparent', border: '1px solid #d9b85f' }}>
          <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative" style={{ border: '1px solid #d9b85f' }}>
            <video
              ref={localVideoRef}
              autoPlay={true}
              playsInline={true}
              muted={true}
              className="w-full h-full object-cover"
              style={{
                backgroundColor: '#000000',
                transform: 'none',
                zoom: 1,
                display: 'block',
                width: '100%',
                height: '100%'
              }}
            />
            <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: '1px solid #d9b85f' }}>
              <p className="font-semibold text-sm" style={{ color: '#d9b85f' }}>You</p>
            </div>
          </div>
        </div>

        {/* Right - Chat panel with proper 3-section layout */}
        <div className="right-panel flex-1 rounded-3xl shadow-xl flex flex-col" style={{ height: '520px', position: 'relative', backgroundColor: '#131313', border: '1px solid #d9b85f', padding: 0 }}>
          <div className="w-full h-full bg-black rounded-3xl shadow-2xl flex flex-col overflow-hidden relative" style={{ backgroundColor: '#131313' }}>
            
            {/* SECTION 1: TOP - Header with partner info */}
            <div className="h-16 px-4 py-3 flex items-center justify-between backdrop-blur-sm flex-shrink-0" style={{ backgroundColor: 'rgba(19, 19, 19, 0.8)', borderBottom: '1px solid #d9b85f', minHeight: '64px' }}>
              {/* Left: Partner Profile */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                  👤
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-tight truncate" style={{ color: '#d9b85f' }}>
                    {hasPartner && partnerInfo ? partnerInfo.userName : 'Waiting...'}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#d9b85f' }}>
                    {hasPartner && partnerInfo ? partnerInfo.userLocation : 'for a partner'}
                  </p>
                </div>
              </div>
              
              {/* Right: Action Icons */}
              <div className="flex gap-2 flex-shrink-0">
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all" style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}>
                  ❤️
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all" style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}>
                  🎁
                </button>
              </div>
            </div>

            {/* SECTION 2: MIDDLE - Messages area with remote video */}
            <div id="main-container" className="overflow-hidden flex flex-col relative w-full flex-1" style={{ zIndex: 1, backgroundColor: 'transparent', position: 'relative', padding: 0 }}>
              
              {/* Remote video wrapper - ABSOLUTE FULL SIZE */}
              <div id="remote-video-wrapper" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: hasPartner ? 99999 : 1, overflow: 'hidden', backgroundColor: hasPartner ? 'black' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {/* Remote video element */}
                {hasPartner && (
                  <video
                    id="remote-video"
                    ref={remoteVideoRef}
                    autoPlay={true}
                    playsInline={true}
                    muted={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: 'black',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 9999,
                      display: 'block',
                      opacity: 1,
                      visibility: 'visible'
                    }}
                  />
                )}

                {/* Connection status overlay - Top Right */}
                {isConnected && hasPartner && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 text-xs font-semibold z-50 shadow-lg px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(217, 184, 95, 0.9)', color: '#0f0f0f' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0f0f0f' }}></span>
                    {formatTime(connectionTime)}
                  </div>
                )}
              </div>

              {/* Waiting for partner - show ONLY when no partner */}
              {!hasPartner && (
                <div className="flex-1 w-full flex items-center justify-center flex-col bg-black rounded-2xl relative" style={{ zIndex: 1 }}>
                  <div className="text-center">
                    <div className="animate-spin mb-4 text-5xl inline-block">⟳</div>
                    <p className="font-semibold text-base" style={{ color: '#d9b85f' }}>Looking for a partner...</p>
                    <p className="text-xs mt-2" style={{ color: '#d9b85f' }}>This won't take long</p>
                  </div>
                </div>
              )}

              {/* Chat messages - Display below video when they exist */}
              {messages.length > 0 && hasPartner && (
                <div className="space-y-2 mt-3 relative px-4" style={{ zIndex: 10 }}>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-2xl text-xs ${
                          msg.sender === 'user'
                            ? 'text-white'
                            : 'text-white'
                        }`}
                        style={{
                          backgroundColor: msg.sender === 'user' ? '#d9b85f' : 'rgba(217, 184, 95, 0.6)',
                          color: msg.sender === 'user' ? '#0f0f0f' : '#d9b85f'
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* SECTION 3: BOTTOM - Message input box */}
          <div className="h-16 px-4 py-3 flex items-center justify-between backdrop-blur-sm flex-shrink-0" style={{ backgroundColor: 'rgba(19, 19, 19, 0.8)', borderTop: '1px solid #d9b85f', minHeight: '64px' }}>
            {/* Left: Username avatar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
            </div>

            {/* Right: Message input and button */}
            <div className="flex items-center gap-2 flex-1 ml-2 flex-shrink-0">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Send Message"
                disabled={!hasPartner}
                className="flex-1 px-3 py-2 rounded-lg focus:outline-none disabled:bg-gray-500/20 text-xs font-medium"
                style={{ backgroundColor: 'rgba(217, 184, 95, 0.1)', borderColor: '#d9b85f', border: '1px solid #d9b85f', color: '#d9b85f' }}
              />
              <button
                onClick={sendMessage}
                disabled={!hasPartner || messageInput.trim() === ''}
                className="w-8 h-8 font-bold rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-md flex-shrink-0"
                style={{ backgroundColor: 'transparent', border: '1px solid #d9b85f', color: '#d9b85f' }}
              >
                💰
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden min-h-0" style={{ backgroundColor: '#0f0f0f' }}>
      {/* Main content - Show correct screen based on state */}
      {hasPartner ? (
        // Partner found: Show video chat
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
  );
};

export default Chat;

