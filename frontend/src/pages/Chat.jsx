// DEPLOYMENT VERSION: d172a01 - TDZ FIX: Move functions after state - 2025-12-08
// Last updated: 2025-12-08 - Temporal deadzone fix complete
// BUILD TIMESTAMP: 2025-12-08T16:00:00Z - FORCE CLEAN BUILD #3 FINAL
console.log('🎯 CHAT BUILD: 2025-12-08T16:00:00Z - Fresh clean bundle - TDZ error FIXED');
import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import socket from '../services/socketService';
import { getIceServers, getMediaConstraints, formatTime, logIceServers } from '../utils/webrtcUtils';
import PremiumModal from '../components/PremiumModal';
import GenderFilterModal from '../components/GenderFilterModal';
import ProfileModal from '../components/ProfileModal';
import MatchHistory from '../components/MatchHistory';
import TopActions from '../components/TopActions';
import logo from '../assets/flinxx-logo.svg';
import './Chat.css';

const Chat = () => {
  console.log('🎯 CHAT COMPONENT LOADED - BUILD: 895cedd (temporal deadzone fix - useRef(null))');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext) || {};

  // CRITICAL: All computed values MUST be in state, never in component body
  // This prevents temporal deadzone errors with minified variables
  const [viewParam, setViewParam] = useState(null);
  const [shouldStartAsIntro, setShouldStartAsIntro] = useState(false);

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

  // Create a ref to expose camera functions to child components
  const cameraFunctionsRef = useRef(null);

  // Peer connection reference - keep as ref for internal use only
  const peerConnectionRef = useRef(null);
  
  // CRITICAL: Store current user in a ref - initialize in useEffect only
  const currentUserRef = useRef(null);
  const userIdRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

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
      userIdRef.current = userToUse.googleId || userToUse.id;
      console.log('🔐 USER ID INITIALIZED (ONE TIME):', userIdRef.current);
    }
    if (!currentUserRef.current) {
      currentUserRef.current = userToUse;
    }
  }, [user]);

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
  const partnerSocketIdRef = useRef(null);  // CRITICAL: Store partner socket ID for sending offers/answers

  // Log ref initialization
  useEffect(() => {
    console.log('📌 Refs initialized:');
    console.log('   localVideoRef.current exists:', !!localVideoRef.current);
    console.log('   localVideoRef.current in DOM:', localVideoRef.current?.parentElement ? 'YES' : 'NO');
    console.log('   remoteVideoRef.current exists:', !!remoteVideoRef.current);
    console.log('   localStreamRef.current exists:', !!localStreamRef.current);
  }, []);

  // CRITICAL DEBUG: Monitor video ref status
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (localVideoRef.current && remoteVideoRef.current) {
        console.log('🎬 VIDEO REF STATUS CHECK:');
        console.log('   Local video ref:', {
          exists: !!localVideoRef.current,
          inDOM: !!localVideoRef.current.parentElement,
          hasStream: !!localVideoRef.current.srcObject,
          paused: localVideoRef.current.paused,
          playing: !localVideoRef.current.paused,
          readyState: localVideoRef.current.readyState
        });
        console.log('   Remote video ref:', {
          exists: !!remoteVideoRef.current,
          inDOM: !!remoteVideoRef.current.parentElement,
          hasStream: !!remoteVideoRef.current.srcObject,
          paused: remoteVideoRef.current.paused,
          playing: !remoteVideoRef.current.paused,
          readyState: remoteVideoRef.current.readyState
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, []);

  // UI state - MUST BE DECLARED FIRST, BEFORE ANY useEffect THAT USES THEM
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
  const [selectedGender, setSelectedGender] = useState('both');
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // NOW safe to use state in useEffect hooks (state is declared above)
  // CRITICAL: Force attach local stream to video element when partner connects
  useEffect(() => {
    console.log('\n\n🎥 ===== FORCE ATTACH EFFECT TRIGGERED =====');
    console.log('🎥 hasPartner:', hasPartner);
    console.log('🎥 localVideoRef.current:', localVideoRef.current?.tagName, localVideoRef.current ? '✅ EXISTS' : '❌ NULL');
    console.log('🎥 localStreamRef.current:', localStreamRef.current ? '✅ EXISTS' : '❌ NULL');
    
    if (hasPartner && localVideoRef.current && localStreamRef.current) {
      console.log('\n🎥 ===== FORCE ATTACH LOCAL STREAM ON PARTNER FOUND =====');
      console.log('🎥 ALL CONDITIONS MET - Attaching local stream to video element');
      console.log('🎥 localVideoRef.current:', {
        element: localVideoRef.current.tagName,
        id: localVideoRef.current.id,
        muted: localVideoRef.current.muted,
        currentSrcObject: !!localVideoRef.current.srcObject,
        paused: localVideoRef.current.paused
      });
      console.log('🎥 localStreamRef.current:', {
        active: localStreamRef.current.active,
        tracks: localStreamRef.current.getTracks().length,
        trackDetails: localStreamRef.current.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState, id: t.id }))
      });
      
      // Force attachment
      console.log('🎥 STEP 1: Setting srcObject...');
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.muted = true;
      
      console.log('🎥 STEP 2: ✅ Local stream attached to video element');
      console.log('🎥 STEP 2 VERIFICATION:', {
        srcObjectSet: !!localVideoRef.current.srcObject,
        srcObjectActive: localVideoRef.current.srcObject?.active,
        tracksAttached: localVideoRef.current.srcObject?.getTracks().length
      });
      console.log('🎥 STEP 3: Attempting to play video...');
      
      // Force play using requestAnimationFrame for proper DOM timing
      requestAnimationFrame(() => {
        console.log('🎥 STEP 3: requestAnimationFrame fired');
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          try {
            console.log('🎥 STEP 3a: Calling video.play()...');
            localVideoRef.current.play().catch(err => {
              console.error('🎥 STEP 3b: Play error caught:', err);
            });
            console.log('🎥 ✅ STEP 3b: Play command dispatched successfully');
            console.log('🎥 Video element state after play:', {
              paused: localVideoRef.current.paused,
              readyState: localVideoRef.current.readyState,
              networkState: localVideoRef.current.networkState,
              currentTime: localVideoRef.current.currentTime,
              duration: localVideoRef.current.duration
            });
          } catch (err) {
            console.error('🎥 ❌ STEP 3c: Play error:', err.message);
            console.error('🎥 Error details:', { name: err.name, code: err.code });
          }
        } else {
          console.error('🎥 ❌ STEP 3: srcObject not available for play');
          console.error('   localVideoRef.current:', !!localVideoRef.current);
          console.error('   localVideoRef.current.srcObject:', !!localVideoRef.current?.srcObject);
        }
      });
    } else {
      console.log('🎥 ⚠️ CONDITIONS NOT MET for force attach:');
      console.log('   hasPartner:', hasPartner);
      console.log('   localVideoRef.current exists:', !!localVideoRef.current);
      console.log('   localStreamRef.current exists:', !!localStreamRef.current);
    }
  }, [hasPartner]);

  // Track hasPartner state changes
  useEffect(() => {
    console.log('🔄 hasPartner state changed:', hasPartner);
    if (hasPartner) {
      console.log('   ✅ Partner connected!');
      console.log('   Force attach effect should have run above');
    } else {
      console.log('   ❌ Partner disconnected');
    }
  }, [hasPartner]);

  // CRITICAL: Re-attach camera stream when navigating between screens
  // This fixes the black screen issue when going back from WaitingScreen to IntroScreen
  useEffect(() => {
    if (cameraStarted && localStreamRef.current && localVideoRef.current) {
      console.log('🎥 [SCREEN CHANGE] Verifying stream attachment');
      
      // Check if stream is still attached
      if (localVideoRef.current.srcObject !== localStreamRef.current) {
        console.warn('🎥 [SCREEN CHANGE] ⚠️ Stream detached! Re-attaching...');
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.muted = true;
        
        // Ensure video is playing
        try {
          const playPromise = localVideoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('🎥 [SCREEN CHANGE] ✅ Stream re-attached and playing');
            }).catch((error) => {
              console.error('🎥 [SCREEN CHANGE] ❌ Playback error:', error);
            });
          }
        } catch (error) {
          console.error('🎥 [SCREEN CHANGE] ❌ Error playing video:', error);
        }
      } else {
        console.log('🎥 [SCREEN CHANGE] ✅ Stream still attached');
      }
    }
  }, [cameraStarted, isMatchingStarted, hasPartner]);

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
      console.log('🎥 [VIDEO MOUNT DETECTOR] About to attach stream to localVideoRef');
      console.log('   localVideoRef:', {
        exists: !!localVideoRef.current,
        inDOM: !!localVideoRef.current.parentElement,
        element: localVideoRef.current?.tagName,
        id: localVideoRef.current?.id
      });
      console.log('   localStreamRef:', {
        exists: !!localStreamRef.current,
        trackCount: localStreamRef.current?.getTracks().length,
        active: localStreamRef.current?.active
      });

      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.muted = true;
      
      console.log('🎥 [VIDEO MOUNT DETECTOR] ✅ Stream attached to localVideoRef');
      console.log('🎥 [VIDEO MOUNT DETECTOR] Verifying attachment:', {
        srcObject: !!localVideoRef.current.srcObject,
        srcObjectActive: localVideoRef.current.srcObject?.active,
        trackCount: localVideoRef.current.srcObject?.getTracks().length
      });
      console.log('🎥 [VIDEO MOUNT DETECTOR] Stream attached, srcObject set');
      console.log('🎥 [VIDEO MOUNT DETECTOR] Attempting to play video...');
      
      // Attempt to play video with requestAnimationFrame for proper timing
      requestAnimationFrame(() => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          try {
            console.log('🎥 [VIDEO MOUNT DETECTOR] Calling video.play()');
            localVideoRef.current.play().catch(err => {
              console.error('🎥 [VIDEO MOUNT DETECTOR] Play error:', err);
            });
            console.log('🎥 [VIDEO MOUNT DETECTOR] ✅ Play command dispatched');
            console.log('🎥 [VIDEO MOUNT DETECTOR] Video readyState:', localVideoRef.current.readyState);
            console.log('🎥 [VIDEO MOUNT DETECTOR] Video paused:', localVideoRef.current.paused);
          } catch (err) {
            console.error('🎥 [VIDEO MOUNT DETECTOR] ❌ Play error:', err);
            console.error('🎥 [VIDEO MOUNT DETECTOR] Error name:', err.name);
            console.error('🎥 [VIDEO MOUNT DETECTOR] Error message:', err.message);
          }
        }
      });
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

  // ✅ CRITICAL FIX: Dedicated useEffect to attach local stream to video element
  // This runs whenever localStreamRef changes and ALWAYS ensures the stream is attached
  // to localVideoRef, independent of screen transitions or re-renders
  useEffect(() => {
    console.log('\n\n✅ ===== STREAM ATTACHMENT EFFECT RUNNING =====');
    console.log('✅ localVideoRef exists:', !!localVideoRef.current);
    console.log('✅ localStreamRef exists:', !!localStreamRef.current);
    
    if (localVideoRef.current && localStreamRef.current) {
      console.log('✅ ATTACHING STREAM TO VIDEO ELEMENT');
      console.log('   localStreamRef.current:', localStreamRef.current);
      console.log('   Stream tracks:', localStreamRef.current.getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled })));
      
      // Attach the stream to the hidden video element
      localVideoRef.current.srcObject = localStreamRef.current;
      
      console.log('✅ srcObject assigned successfully');
      console.log('✅ Video element now has stream:', !!localVideoRef.current.srcObject);
      
      // Attempt to play
      localVideoRef.current.play().catch(err => {
        console.warn('⚠️ Play error (expected on first setup):', err.name);
      });
      
      console.log('✅ ===== STREAM ATTACHMENT COMPLETE =====\n\n');
    } else {
      console.warn('⚠️ Cannot attach stream - missing ref or stream:', {
        refExists: !!localVideoRef.current,
        streamExists: !!localStreamRef.current
      });
    }
  }, [localStreamRef.current]); // Dependency on localStreamRef to re-attach if stream changes

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
            console.error('\n🔄 Attempting ICE restart...');
            try {
              peerConnection.restartIce();
              console.log('✅ ICE restart requested');
            } catch (err) {
              console.error('❌ ICE restart failed:', err);
            }
            break;
          case 'disconnected':
            console.warn('⚠️ State: DISCONNECTED - Lost connection to peer');
            console.warn('⚠️ Attempting to reconnect...');
            console.warn('🔄 Requesting ICE restart...');
            try {
              peerConnection.restartIce();
              console.log('✅ ICE restart requested due to disconnection');
            } catch (err) {
              console.error('❌ ICE restart failed:', err);
            }
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
        console.log('\n\n🔴🔴🔴 ===== CRITICAL: ONTRACK HANDLER FIRING! =====');
        console.log('🔴 ONTRACK CALLED AT:', new Date().toISOString());
        console.log('🔴 This is the REMOTE TRACK RECEIVER - the most important handler!');
        console.log('\n📥 ===== REMOTE TRACK RECEIVED =====');
        console.log('📥 TIMESTAMP:', new Date().toISOString());
        console.log('📥 Remote track received:', {
          kind: event.track.kind,
          id: event.track.id,
          enabled: event.track.enabled,
          readyState: event.track.readyState,
          muted: event.track.muted
        });
        console.log('📥 Event streams:', event.streams.map(s => ({
          id: s.id,
          active: s.active,
          trackCount: s.getTracks().length,
          tracks: s.getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled, muted: t.muted }))
        })));
        
        // CRITICAL: Verify we're attaching to REMOTE video ref, not local
        console.log('\n📺 ===== CRITICAL VIDEO REF CHECK =====');
        console.log('📺 localVideoRef.current:', {
          exists: !!localVideoRef.current,
          element: localVideoRef.current?.tagName,
          id: localVideoRef.current?.id,
          srcObject: !!localVideoRef.current?.srcObject,
          object: localVideoRef.current
        });
        console.log('📺 remoteVideoRef.current:', {
          exists: !!remoteVideoRef.current,
          element: remoteVideoRef.current?.tagName,
          id: remoteVideoRef.current?.id,
          srcObject: !!remoteVideoRef.current?.srcObject,
          object: remoteVideoRef.current
        });
        console.log('📺 SAME REF?:', localVideoRef.current === remoteVideoRef.current);
        
        if (!remoteVideoRef.current) {
            console.error('❌ CRITICAL ERROR: remoteVideoRef.current is NULL!');
            console.error('   Cannot attach remote track - video element not available');
            console.error('   remoteVideoRef must be attached to the remote-video HTML element');
            console.error('   Check line ~1977: <video id="remote-video" ref={remoteVideoRef} />');
            return;
        }
        
        if (!localVideoRef.current) {
            console.warn('⚠️ WARNING: localVideoRef.current is NULL');
            console.warn('   This is OK if not yet on a screen that uses it');
            console.warn('   localVideoRef should only be used for local stream in left/right panels');
        }
        
        if (localVideoRef.current === remoteVideoRef.current) {
            console.error('❌❌❌ CRITICAL ERROR: localVideoRef and remoteVideoRef are the SAME OBJECT!');
            console.error('   This will OVERWRITE local video with remote track!');
            console.error('   Check JSX ref assignments - they should be TWO DIFFERENT video elements');
            console.error('   localVideoRef should be: <video ref={localVideoRef} className="local-video" /> in left/right panel');
            console.error('   remoteVideoRef should be: <video id="remote-video" ref={remoteVideoRef} /> in remote-video-wrapper');
            return;
        }
        
        console.log('✅ CRITICAL CHECK PASSED - refs are DIFFERENT and valid');
        console.log('📺 localVideoRef points to:', localVideoRef.current?.id || 'no-id', '(class=' + localVideoRef.current?.className + ')');
        console.log('📺 remoteVideoRef points to:', remoteVideoRef.current?.id || 'no-id', '(class=' + remoteVideoRef.current?.className + ')');
        console.log('📺 Proceeding to attach REMOTE stream to remoteVideoRef ONLY...');
        
        if (!event.streams || !event.streams[0]) {
            console.error('❌ No streams available in event');
            return;
        }
        
        // ✅ CRITICAL GUARD: Only attach stream if not already set with valid tracks
        if (remoteVideoRef.current.srcObject && remoteVideoRef.current.srcObject.getTracks().length > 0) {
          console.log('📺 ⚠️ GUARD: Remote stream already attached with tracks, skipping re-attachment');
          console.log('📺 Current stream has', remoteVideoRef.current.srcObject.getTracks().length, 'tracks');
          return;
        }
        
        console.log('📺 STEP 1: Setting remoteVideoRef.current.srcObject = event.streams[0]');
        const stream = event.streams[0];
        remoteVideoRef.current.srcObject = stream;
        console.log('📺 STEP 2: ✅ Remote stream assigned to remoteVideoRef ONLY');
        console.log('📺 LOCAL STREAM UNAFFECTED - localVideoRef still has:', localVideoRef.current?.srcObject ? 'a stream' : 'no stream');
        
        // Debug: Check what was set
        console.log('📺 STEP 3: Verifying remote attachment:', {
          srcObjectExists: !!remoteVideoRef.current.srcObject,
          srcObjectSame: remoteVideoRef.current.srcObject === stream,
          srcObjectActive: remoteVideoRef.current.srcObject?.active,
          srcObjectTracks: remoteVideoRef.current.srcObject?.getTracks().length,
          trackDetails: remoteVideoRef.current.srcObject?.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, muted: t.muted })),
          videoReadyState: remoteVideoRef.current.readyState,
          videoNetworkState: remoteVideoRef.current.networkState,
          videoPaused: remoteVideoRef.current.paused
        });
        
        remoteVideoRef.current.style.display = "block";
        remoteVideoRef.current.style.width = "100%";
        remoteVideoRef.current.style.height = "100%";
        remoteVideoRef.current.style.objectFit = "cover";
        console.log('📺 STEP 4: ✅ CSS styles applied to remoteVideoRef');
        
        // ✅ FIX #6: Handle mobile autoplay restriction - play() with error handling
        console.log('📺 STEP 5: Attempting to play remote video on remoteVideoRef...');
        try {
          const playPromise = remoteVideoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('📺 ✅ Remote video playing successfully on remoteVideoRef');
                // ✅ NOW that video is playing, unmute it for audio
                // (Browsers require muted=true for autoplay, then we can unmute)
                setTimeout(() => {
                  if (remoteVideoRef.current) {
                    remoteVideoRef.current.muted = false;
                    console.log('📺 ✅ Remote video UNMUTED - audio should now play');
                  }
                }, 100);
              })
              .catch((playError) => {
                console.warn('📺 ⚠️ Play error (may be due to mobile autoplay policy):', playError.name, playError.message);
                console.log('📺 NOTE: Remote video element has srcObject set, will play when user interacts');
                // Try to unmute anyway in case autoplay was blocked but we want audio if user interacts
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.muted = false;
                  console.log('📺 Remote video UNMUTED (in case autoplay was blocked)');
                }
              });
          } else {
            console.log('📺 Play promise not returned (older browser), remote video should play automatically');
            // Unmute for older browsers too
            if (remoteVideoRef.current) {
              remoteVideoRef.current.muted = false;
              console.log('📺 Remote video UNMUTED (older browser)');
            }
          }
        } catch (err) {
          console.error('📺 ❌ Play attempt threw error:', err);
          console.log('📺 Continuing - remote stream is attached and ready');
          // Try to unmute even on error
          if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = false;
            console.log('📺 Remote video UNMUTED (after error)');
          }
        }
        
        console.log('✅ ✅ ✅ Remote video srcObject set successfully on remoteVideoRef');
        console.log('📥 ===== REMOTE TRACK SETUP COMPLETE =====\n\n');
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
    socket.off('ice-candidate');
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

    // Receive message
    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'partner',
        text: data.message,
        timestamp: new Date()
      }]);
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
    console.log('🔌 ✅ receive_message listener active');
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
      socket.off('receive_message');
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
      message: messageInput
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
    <div className="intro-screen-container flex flex-row w-full max-w-[1500px] mx-auto gap-12 px-10 mt-20 items-start overflow-visible" style={{ minHeight: '100vh', height: 'auto', backgroundColor: '#0f0f0f', overflow: 'visible' }}>
      {/* Top Icons Bar */}
      <TopActions
        currentUser={currentUser}
        onProfileClick={() => setIsProfileOpen(true)}
        onPremiumClick={() => setIsPremiumOpen(true)}
        onMatchHistoryClick={() => setIsMatchHistoryOpen(true)}
        isFixedPosition={true}
      />

      {/* Left - Live camera preview box */}
      <div className="left-panel flex-1 rounded-3xl shadow-xl" style={{ height: '520px', minHeight: '520px', backgroundColor: 'transparent', border: '1px solid #d9b85f', overflow: 'hidden' }}>
        <video
          ref={localVideoRef}
          className="local-video"
          autoPlay={true}
          playsInline={true}
          muted={true}
        />
        <div className="you-badge">You</div>
      </div>

      {/* Right - Welcome panel with dark theme */}
      <div className="right-panel flex-1 rounded-3xl shadow-xl p-12 pb-16 space-y-6 flex items-center justify-center" style={{ height: '520px', minHeight: '520px', backgroundColor: '#131313', border: '1px solid #d9b85f' }}>
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
              <p className="text-sm" style={{ color: '#d9b85f' }}>Meet new people in real time.</p>
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
    <div className="flex flex-row w-full max-w-[1500px] mx-auto gap-12 px-10 mt-20 items-start overflow-visible" style={{ minHeight: '100vh', height: 'auto', backgroundColor: '#0f0f0f', overflow: 'visible' }}>
      {/* Left - Live camera preview box */}
      <div className="left-panel flex-1 rounded-3xl shadow-xl" style={{ height: '520px', minHeight: '520px', backgroundColor: 'transparent', border: '1px solid #d9b85f', overflow: 'hidden' }}>
        <video
          ref={localVideoRef}
          className="local-video"
          autoPlay={true}
          playsInline={true}
          muted={true}
        />
        <div className="you-badge">You</div>
      </div>

      {/* Right - Dark Waiting Panel with golden accents */}
      <div className="right-panel flex-1 rounded-3xl shadow-xl flex flex-col" style={{ height: '520px', minHeight: '520px', backgroundColor: '#131313', border: '1px solid #d9b85f', padding: 0, overflow: 'visible', position: 'relative', zIndex: 5 }}>
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
    <div className="video-chat-container flex flex-col md:flex-row w-full h-full gap-6 items-start overflow-visible" style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', overflow: 'visible' }}>
        
        {/* LEFT - Chat panel with proper 3-section layout */}
        <div className="right-panel flex-1 rounded-3xl shadow-xl flex flex-col" style={{ height: '520px', backgroundColor: '#131313', border: '1px solid #d9b85f', padding: 0, overflow: 'visible' }}>
          <div className="w-full h-full bg-black rounded-3xl shadow-2xl flex flex-col overflow-visible" style={{ backgroundColor: '#131313', overflow: 'visible' }}>
            
            {/* SECTION 1: TOP - Header with partner info */}
            <div className="px-4 flex items-center justify-between backdrop-blur-sm flex-shrink-0" style={{ height: '56px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: 'rgba(19, 19, 19, 0.8)', borderBottom: '1px solid #d9b85f' }}>
              {/* Left: Partner Profile */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 overflow-hidden">
                  {hasPartner && partnerInfo && partnerInfo.picture ? (
                    <img src={partnerInfo.picture} alt="Partner" className="w-full h-full object-cover" />
                  ) : (
                    '👤'
                  )}
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
            <div id="main-container" className="overflow-visible flex flex-col w-full flex-1" style={{ zIndex: 1, backgroundColor: 'transparent', padding: 0, overflow: 'visible' }}>
              
              {/* Remote video wrapper - ABSOLUTE FULL SIZE */}
              <div id="remote-video-wrapper" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: hasPartner ? 99999 : 1, overflow: 'visible', backgroundColor: hasPartner ? 'black' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {/* CRITICAL FIX: Remote video element ALWAYS exists in DOM
                    This ensures remoteVideoRef is ready when ontrack fires
                    Display is controlled by hasPartner state via CSS
                */}
                <video
                  id="remote-video"
                  ref={remoteVideoRef}
                  autoPlay={true}
                  playsInline={true}
                  muted={true}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backgroundColor: 'black',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 9999,
                    display: hasPartner ? 'block' : 'none',
                    opacity: hasPartner ? 1 : 0,
                    visibility: hasPartner ? 'visible' : 'hidden'
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
                <div className="flex-1 w-full flex items-center justify-center flex-col bg-black rounded-2xl" style={{ zIndex: 1 }}>
                  <div className="text-center">
                    <div className="animate-spin mb-4 text-5xl inline-block">⟳</div>
                    <p className="font-semibold text-base" style={{ color: '#d9b85f' }}>Looking for a partner...</p>
                    <p className="text-xs mt-2" style={{ color: '#d9b85f' }}>This won't take long</p>
                  </div>
                </div>
              )}

              {/* Chat messages - Display below video when they exist */}
              {messages.length > 0 && hasPartner && (
                <div className="space-y-2 mt-3 px-4" style={{ zIndex: 10 }}>
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
          <div className="px-4 flex items-center justify-between backdrop-blur-sm flex-shrink-0" style={{ height: '56px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: 'rgba(19, 19, 19, 0.8)', borderTop: '1px solid #d9b85f' }}>
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

        {/* RIGHT - Local camera video */}
        <div className="left-panel flex-1 rounded-3xl shadow-xl" style={{ height: '520px', minHeight: '520px', backgroundColor: 'transparent', border: '1px solid #d9b85f', overflow: 'hidden' }}>
          <video
            ref={localVideoRef}
            className="local-video"
            autoPlay={true}
            playsInline={true}
            muted={true}
          />
          <div className="you-badge">You</div>
        </div>
    </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-visible min-h-0" style={{ backgroundColor: '#0f0f0f', overflow: 'visible' }}>
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

