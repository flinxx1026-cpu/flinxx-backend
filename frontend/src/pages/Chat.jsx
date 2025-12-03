// DEPLOYMENT VERSION: 44ee2ae - Socket ID comparison + offerer/answerer logic
// Last updated: 2025-12-02 - Force Vercel rebuild
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import socket from '../services/socketService';
import { getIceServers, getMediaConstraints, formatTime } from '../utils/webrtcUtils';
import PremiumModal from '../components/PremiumModal';
import GenderFilterModal from '../components/GenderFilterModal';
import ProfileModal from '../components/ProfileModal';
import MatchHistory from '../components/MatchHistory';
import logo from '../assets/flinxx-logo.svg';
import './Chat.css';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

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

  // UI state
  const [cameraStarted, setCameraStarted] = useState(false);
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

  // Ensure video stream is attached when camera starts
  useEffect(() => {
    if (cameraStarted && localStreamRef.current && localVideoRef.current) {
      console.log('Attaching stream to video element:', localStreamRef.current);
      console.log('Video element dimensions:', {
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
  useEffect(() => {
    async function startPreview() {
      try {
        console.log('📹 Starting camera preview...');
        const previewStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        
        // Store the stream for later use in chat
        localStreamRef.current = previewStream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = previewStream;
          localVideoRef.current.muted = true;
          
          // Attempt to play video
          try {
            await localVideoRef.current.play();
            console.log('✅ Camera preview playing successfully');
          } catch (err) {
            console.error('❌ Preview play error:', err);
          }
        }
      } catch (err) {
        console.log('📷 Camera preview error (this is OK, user may deny permission):', err.message);
      }
    }

    if (!cameraStarted) {
      startPreview();
    }
  }, [cameraStarted]);

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
        console.log('✅ OFFERER: Sent to socket:', data.socketId);
      } catch (err) {
        console.error('❌ OFFERER: Error in partner_found handler:', err);
        console.error('❌ OFFERER: Stack trace:', err.stack);
      }
    });

    // Receive offer - ANSWERER starts here
    socket.on('webrtc_offer', async (data) => {
      console.log('\n\n');
      console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
      console.log('🎉🎉🎉 ANSWERER HANDLER FIRED 🎉🎉🎉');
      console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
      console.log('📋 ===== ANSWERER RECEIVED OFFER =====');
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
    const res = await fetch("https://flinxx-backend.onrender.com/api/turn");
    const data = await res.json();

    if (!data?.v?.iceServers) {
        throw new Error("Invalid XirSys TURN response");
    }

    const xirsys = data.v.iceServers;

    // Convert XirSys format → WebRTC format
    const iceServers = [
        {
            urls: xirsys.urls,
            username: xirsys.username,
            credential: xirsys.credential
        },
        { urls: "stun:stun.l.google.com:19302" } // fallback
    ];

    return iceServers;
  };

  const createPeerConnection = async () => {
    console.log('🔧 createPeerConnection called');
    console.log('   Current localStreamRef:', localStreamRef.current);
    
    const iceServers = await getTurnServers();

    peerConnection = new RTCPeerConnection({ iceServers });
    console.log('✅ RTCPeerConnection created');

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('🧊 ICE candidate generated:', {
              candidate: event.candidate.candidate,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              sdpMid: event.candidate.sdpMid
            });
            console.log('🔌 Sending ICE candidate to partner socket:', partnerSocketIdRef.current);
            socket.emit("ice-candidate", {
              candidate: event.candidate,
              to: partnerSocketIdRef.current
            });
            console.log('📤 ICE candidate sent to peer');
        } else {
            console.log('🧊 ICE gathering complete (null candidate received)');
        }
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
            remoteVideoRef.current.srcObject = event.streams[0];
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
    // Prevent multiple simultaneous requests
    if (isRequestingCamera || cameraStarted) {
      console.warn('⚠️ Camera request already in progress or camera already started');
      return;
    }

    try {
      console.log('🎬 Starting video chat...');
      setIsRequestingCamera(true);
      setIsLoading(true);

      // CRITICAL: Never call getUserMedia again - always use preview stream
      if (!localStreamRef.current) {
        console.error('❌ CRITICAL: No preview stream available! This should not happen.');
        console.error('localStreamRef.current is:', localStreamRef.current);
        throw new Error('Preview stream not initialized');
      }

      console.log('✅ Using existing preview stream:', localStreamRef.current);
      console.log('📹 Stream tracks count:', localStreamRef.current.getTracks().length);
      console.log('📹 Stream tracks:', localStreamRef.current.getTracks().map(t => ({ 
        kind: t.kind, 
        id: t.id,
        enabled: t.enabled,
        readyState: t.readyState
      })));

      // Set camera started flag
      setCameraStarted(true);
      setIsRequestingCamera(false);
      setIsLoading(false);

      // REMOVED: setupSocketListeners() now runs once on component mount via useEffect
      // Socket listeners are already registered from the useEffect

      // Emit find_partner to start matching
      socket.emit('find_partner', {
        userId: currentUser.googleId || currentUser.id,
        userName: currentUser.name || 'Anonymous',
        userAge: currentUser.age || 18,
        userLocation: currentUser.location || 'Unknown'
      });

    } catch (error) {
      console.error('❌ Error in startVideoChat:', error);
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
    <div className="intro-screen-container flex-1 flex items-center justify-center gap-10 p-8 w-full h-full overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 relative">
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
      <div className="video-box flex items-center justify-center" style={{ width: '520px', height: '620px' }}>
        <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative border border-white/10">
          <video
            ref={localVideoRef}
            autoPlay={true}
            playsInline={true}
            muted={true}
            className="w-full h-full object-cover"
            style={{
              backgroundColor: '#000000',
              transform: 'scaleX(-1)',
              display: 'block'
            }}
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-xl z-10">
            <p className="font-semibold text-sm">You</p>
          </div>
        </div>
      </div>

      {/* Right - Welcome panel with purple gradient */}
      <div className="right-panel flex items-center justify-center" style={{ width: '520px', height: '620px' }}>
        <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-between text-center">
          {/* Top Section - Toggle Buttons */}
          <div className="flex gap-3 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm shadow-md hover:shadow-lg">
              SOLO
            </button>
            <button className="bg-blue-600/30 hover:bg-blue-600/50 text-white font-bold py-2 px-6 rounded-lg transition-all border border-blue-400/50 text-sm">
              DUO
            </button>
          </div>

          {/* Middle Section - Welcome Content */}
          <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="Flinxx" className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Flinxx</h1>
              <p className="text-white/90 text-sm">Make new friends face-to-face</p>
            </div>

            {/* Preference Badge */}
            <button 
              onClick={() => setIsGenderFilterOpen(true)}
              className="bg-purple-400/40 border border-purple-300/60 rounded-full px-4 py-1 hover:bg-purple-400/60 transition-all cursor-pointer text-xs"
            >
              <span className="text-white font-semibold">👥 {selectedGender === 'girls' ? 'Girls Only' : selectedGender === 'guys' ? 'Guys Only' : 'Both'}</span>
            </button>
          </div>

          {/* Bottom Section - Start Button */}
          <button
            onClick={startVideoChat}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm shadow-lg hover:shadow-blue-600/50"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block mr-2">⟳</span> Requesting Access...
              </>
            ) : (
              'Start Video Chat'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Video Chat Screen Component
  const VideoChatScreen = () => (
    <div className="flex-1 flex items-center justify-center gap-4 p-4 w-full h-full overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 relative min-h-0" style={{ flexDirection: 'column' }}>
      {/* Close Button - Round X Icon at Top Right */}
      <button
        onClick={() => {
          cleanup();
          setCameraStarted(false);
          navigate('/chat');
        }}
        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-all duration-200 z-20 shadow-lg flex items-center justify-center"
        style={{ width: '45px', height: '45px', fontSize: '24px' }}
        title="End Chat"
      >
        ✕
      </button>

      {/* Main video container - responsive layout */}
      <div className="flex-1 w-full h-full flex items-center justify-center gap-4 min-h-0 overflow-hidden" style={{ minHeight: 0 }}>
        
        {/* Left - Local camera video */}
        <div className="video-box flex items-center justify-center min-h-0 flex-1" style={{ minWidth: 0, maxWidth: '50%' }}>
          <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative border border-white/10">
            <video
              ref={localVideoRef}
              autoPlay={true}
              playsInline={true}
              muted={true}
              className="w-full h-full object-cover"
              style={{
                backgroundColor: '#000000',
                transform: 'scaleX(-1)',
                display: 'block',
                width: '100%',
                height: '100%'
              }}
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-xl z-10">
              <p className="font-semibold text-sm">You</p>
            </div>
          </div>
        </div>

        {/* Right - Chat panel with proper 3-section layout */}
        <div className="right-panel flex items-center justify-center flex-1" style={{ minWidth: 0, maxWidth: '50%', position: 'relative' }}>
          <div className="w-full h-full bg-black rounded-3xl shadow-2xl flex flex-col overflow-visible relative border border-white/10">
            
            {/* SECTION 1: TOP - Header with partner info */}
            <div className="h-16 px-4 py-3 flex items-center justify-between bg-black/80 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
              {/* Left: Partner Profile */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                  👤
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight truncate">
                    {hasPartner && partnerInfo ? partnerInfo.userName : 'Waiting...'}
                  </p>
                  <p className="text-white/60 text-xs truncate">
                    {hasPartner && partnerInfo ? partnerInfo.userLocation : 'for a partner'}
                  </p>
                </div>
              </div>
              
              {/* Right: Action Icons */}
              <div className="flex gap-2 flex-shrink-0">
                <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-blue-400 text-lg transition-all">
                  ❤️
                </button>
                <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-red-400 text-lg transition-all">
                  🎁
                </button>
              </div>
            </div>

            {/* SECTION 2: MIDDLE - Messages area (scrollable) */}
            <div id="main-container" className="overflow-visible px-4 py-4 flex flex-col relative w-full" style={{ zIndex: 1, backgroundColor: 'transparent', position: 'relative', flex: 1 }}>
              
              {/* Remote video wrapper - ALWAYS on top */}
              <div id="remote-video-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 99999, overflow: 'visible', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {/* Remote video element - RENDER UNCONDITIONALLY */}
                <video
                  id="remote-video"
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
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
                    visibility: 'visible',
                    pointerEvents: 'auto'
                  }}
                />

                {/* Connection status overlay - Top Right */}
                {isConnected && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-500 bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-semibold z-50 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    {formatTime(connectionTime)}
                  </div>
                )}
              </div>

              {/* Waiting for partner - show ONLY when no partner - BELOW video wrapper */}
              {!hasPartner && (
                <div className="flex-1 w-full flex items-center justify-center flex-col bg-black rounded-2xl min-h-0 relative" style={{ zIndex: 1, pointerEvents: 'none' }}>
                  <div className="text-center">
                    <div className="animate-spin mb-4 text-5xl inline-block">⟳</div>
                    <p className="text-white font-semibold text-base">Looking for a partner...</p>
                    <p className="text-white/60 text-xs mt-2">This won't take long</p>
                  </div>
                </div>
              )}

              {/* Chat messages - Display below video when they exist */}
              {messages.length > 0 && hasPartner && (
                <div className="space-y-2 mt-3 relative" style={{ zIndex: 10 }}>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-2xl text-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-purple-500 text-white'
                        }`}
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
          <div className="h-16 px-4 py-3 flex items-center justify-between bg-black/80 backdrop-blur-sm border-t border-white/10 flex-shrink-0">
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
                className="flex-1 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-500/20 bg-white/10 text-white placeholder-white/50 text-xs font-medium"
              />
              <button
                onClick={sendMessage}
                disabled={!hasPartner || messageInput.trim() === ''}
                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-md flex-shrink-0"
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
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 overflow-hidden min-h-0">
      {/* Main content */}
      {!cameraStarted ? <IntroScreen /> : <VideoChatScreen />}
      
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

