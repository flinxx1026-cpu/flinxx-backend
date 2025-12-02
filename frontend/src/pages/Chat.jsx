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

// Utility function to safely stop all media tracks
const stopAllTracks = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => {
      console.log(`🛑 Stopping ${track.kind} track`);
      track.stop();
    });
  }
};

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  // Use actual user or provide defaults
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
    let previewStream = null;
    
    async function startPreview() {
      try {
        console.log('📹 Starting camera preview...');
        previewStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        
        if (localVideoRef.current && !cameraStarted) {
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

    startPreview();
    
    // Cleanup preview stream only if camera hasn't been started for full chat
    return () => {
      if (previewStream && !cameraStarted) {
        console.log('🧹 Cleaning up preview stream');
        stopAllTracks(previewStream);
      }
    };
  }, [cameraStarted]);

  // Only cleanup tracks when component unmounts
  useEffect(() => {
    return () => {
      console.log('🧹 Chat component unmounting - cleaning up all streams');
      
      // Stop all tracks from main stream
      if (localStreamRef.current) {
        stopAllTracks(localStreamRef.current);
        localStreamRef.current = null;
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, []);

  const createPeerConnection = async () => {
    try {
      console.log('\n\n🎥 ===== PEER CONNECTION CREATION STARTING =====\n');
      const res = await fetch("https://flinxx-backend.onrender.com/api/get-turn-credentials", {
        method: "POST"
      });
      const data = await res.json();

      console.log('🔄 TURN credentials response (RAW):', data);
      console.log('✅ apiKey:', data.apiKey, '(type:', typeof data.apiKey, ')');
      console.log('✅ username:', data.username, '(type:', typeof data.username, ')');
      console.log('✅ password:', data.password, '(type:', typeof data.password, ')');
      console.log('✅ iceServers:', data.iceServers, '(length:', data.iceServers?.length, ')');

      // Validate TURN credentials exist
      if (!data.apiKey || !data.username || !data.password) {
        console.error('❌ MISSING CREDENTIALS:');
        console.error('   - apiKey:', data.apiKey);
        console.error('   - username:', data.username);
        console.error('   - password:', data.password);
        throw new Error(`Missing TURN credentials from backend. Response: ${JSON.stringify(data)}`);
      }

      const iceServers = [
        {
          urls: [
            `stun:${data.apiKey}.metered.live:3478`,
            `turn:${data.apiKey}.metered.live:3478`
          ],
          username: data.username,
          credential: data.password
        }
      ];

      console.log('📋 Constructed iceServers:', JSON.stringify(iceServers, null, 2));
      console.log('✅ iceServers[0].username:', iceServers[0].username);
      console.log('✅ iceServers[0].credential:', iceServers[0].credential);

      const config = {
        iceServers: iceServers,
        iceCandidatePoolSize: 10,
        sdpSemantics: "unified-plan"
      };

      console.log('🔧 RTCPeerConnection config:', config);
      const peerConnection = new RTCPeerConnection(config);

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          console.log('📤 Sending ICE candidate');
          socket.emit('ice_candidate', {
            candidate: event.candidate
          });
        }
      };

      peerConnection.ontrack = (event) => {
        console.log('\n\n🎥 ===== REMOTE TRACK RECEIVED ===== 🎥\n');
        console.log("🎬 ===== ONTRACK FIRED =====");
        console.log("STREAM EVENT:", event);
        console.log("REMOTE STREAM ARRIVED:", event.streams);
        console.log("Track kind:", event.track.kind);
        console.log("Track enabled:", event.track.enabled);

        const remoteStream = event.streams[0];
        console.log("Final remote stream:", remoteStream);

        if (remoteVideoRef.current) {
          console.log("✅ remoteVideoRef exists, attaching stream");
          remoteVideoRef.current.srcObject = remoteStream;
          console.log("✅ srcObject set:", remoteVideoRef.current.srcObject);
          remoteVideoRef.current.style.display = "block";
          console.log("✅ display set to block");

          remoteVideoRef.current.play().catch((err) => {
            console.error("Error playing remote video:", err);
          });

          console.log("✅ Attaching remote stream to video element - COMPLETE");
        } else {
          console.error("❌ remoteVideoRef is null - CANNOT ATTACH");
        }
        console.log("🎬 ===== ONTRACK COMPLETE =====");
        console.log('\n🎥 ===== REMOTE TRACK ATTACHMENT COMPLETE ===== 🎥\n');
      };

      // Disable unnecessary negotiation events
      peerConnection.onnegotiationneeded = () => {
        console.log('ℹ️ Negotiation needed event (ignored)');
      };

      peerConnection.onremotetrack = (event) => {
        console.log('🎬 ===== ONREMOTETRACK FIRED (BACKUP) =====');
        console.log('Remote track event:', event);
      };

      peerConnection.onconnectionstatechange = () => {
        console.log('\n\n📡 ======= CONNECTION STATE CHANGED =======');
        console.log('🔗 Connection state:', peerConnection.connectionState);
        console.log('🔗 ICE connection state:', peerConnection.iceConnectionState);
        console.log('🔗 Signaling state:', peerConnection.signalingState);
        console.log('📡 ======= CONNECTION STATE CHANGED END =======\n\n');
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed' ||
                   peerConnection.connectionState === 'closed') {
          setIsConnected(false);
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('🧊 ICE connection state changed:', peerConnection.iceConnectionState);
      };

      console.log('✅ Peer connection created with ontrack handler:', peerConnection);
      console.log('🎯 ontrack handler attached:', peerConnection.ontrack !== null);
      console.log('\n🎥 ===== PEER CONNECTION CREATION COMPLETE =====\n');
      return peerConnection;
    } catch (err) {
      console.error('❌ Error creating peer connection:', err);
      throw err;
    }
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

      // Stop any existing preview stream first
      if (localStreamRef.current) {
        console.log('🛑 Stopping existing stream before requesting new one');
        stopAllTracks(localStreamRef.current);
      }

      // Small delay to ensure old stream is released
      await new Promise(resolve => setTimeout(resolve, 200));

      // Request camera and microphone access with simple constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });

      console.log('✅ Camera stream received:', stream);
      console.log('📹 Stream tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));

      // Store stream reference
      localStreamRef.current = stream;

      // Attach stream to video element immediately
      if (localVideoRef.current) {
        console.log('📹 Setting srcObject on video element');
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        
        // Small delay to ensure srcObject is processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('📹 Attempting to play video');
        try {
          await localVideoRef.current.play();
          console.log('✅ Video is now playing');
        } catch (err) {
          console.error('❌ Play error:', err);
          // Video may still play, don't fail
        }
      }

      // Set camera started flag
      setCameraStarted(true);
      setIsRequestingCamera(false);
      setIsLoading(false);

      // Setup socket listeners after camera is ready
      setupSocketListeners();

      // Emit find_partner to start matching
      socket.emit('find_partner', {
        userId: currentUser.googleId || currentUser.id,
        userName: currentUser.name || 'Anonymous',
        userAge: currentUser.age || 18,
        userLocation: currentUser.location || 'Unknown'
      });

    } catch (error) {
      console.error('❌ Error accessing camera:', error);
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

  const setupSocketListeners = () => {
    // Partner found
    socket.on('partner_found', async (data) => {
      console.log('👥 Partner found:', data);
      setHasPartner(true);
      setPartnerInfo(data);

      // Create peer connection and send offer
      try {
        console.log('🔧 Creating peer connection for offerer');
        const pc = await createPeerConnection();
        peerConnectionRef.current = pc;

        // Add local stream tracks to peer connection
        if (localStreamRef.current) {
          const tracks = localStreamRef.current.getTracks();
          console.log('📹 Local Tracks:', tracks);
          console.log(`📹 Adding ${tracks.length} local tracks to peer connection`);
          tracks.forEach(track => {
            console.log(`  - Adding ${track.kind} track:`, track);
            const sender = pc.addTrack(track, localStreamRef.current);
            console.log(`  - addTrack returned sender:`, sender);
          });
          console.log('✅ All tracks added to peer connection');
          const senders = pc.getSenders();
          console.log('📤 OFFERER senders count:', senders.length);
          console.log('📤 RTCPeerConnection senders after addTrack:', senders.map((s, i) => ({ 
            index: i,
            kind: s.track?.kind, 
            id: s.track?.id,
            trackExists: !!s.track
          })));
          console.log('🚀 OFFERER: Ready to send offer with', tracks.length, 'tracks');
        } else {
          console.warn('⚠️ No local stream available');
        }

        // Create and send offer
        console.log('\n\n📋 ===== CREATING AND SENDING OFFER =====');
        console.log('🎬 Creating WebRTC offer');
        const offer = await pc.createOffer();
        console.log('✅ Offer created:', offer);
        
        await pc.setLocalDescription(offer);
        console.log('✅ Local description set');
        
        console.log('📤 SENDING OFFER with tracks:', pc.getSenders().map(s => s.track?.kind));
        socket.emit('webrtc_offer', {
          offer: peerConnectionRef.current.localDescription
        });
        console.log('📤 Offer sent to peer');
        console.log('📋 ===== OFFER SENT COMPLETE =====\n\n');
      } catch (err) {
        console.error('❌ Error in partner_found handler:', err);
      }
    });

    // Receive offer
    socket.on('webrtc_offer', async (data) => {
      console.log('📨 Received WebRTC offer');
      try {
        if (!peerConnectionRef.current) {
          console.log('📍 Creating new peer connection for answerer');
          const pc = await createPeerConnection();
          peerConnectionRef.current = pc;

          // Add local stream tracks
          if (localStreamRef.current) {
            const tracks = localStreamRef.current.getTracks();
            console.log('📹 Local Tracks:', tracks);
            console.log(`📹 Adding ${tracks.length} local tracks to peer connection`);
            tracks.forEach(track => {
              console.log(`  - Adding ${track.kind} track:`, track);
              const sender = pc.addTrack(track, localStreamRef.current);
              console.log(`  - addTrack returned sender:`, sender);
            });
            console.log('✅ All tracks added to peer connection');
            const senders = pc.getSenders();
            console.log('📤 ANSWERER senders count:', senders.length);
            console.log('📤 RTCPeerConnection senders after addTrack:', senders.map((s, i) => ({ 
              index: i,
              kind: s.track?.kind, 
              id: s.track?.id,
              trackExists: !!s.track
            })));
            console.log('🚀 ANSWERER: Ready to send answer with', tracks.length, 'tracks');
          } else {
            console.warn('⚠️ No local stream available to add tracks');
          }
        }

        console.log('🔄 Setting remote description (offer)');
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        console.log('✅ Remote description set successfully');

        console.log('🎬 Creating answer');
        const answer = await peerConnectionRef.current.createAnswer();
        console.log('✅ Answer created:', answer);
        
        console.log('🔄 Setting local description (answer)');
        await peerConnectionRef.current.setLocalDescription(answer);
        console.log('✅ Local description set successfully');

        console.log('\n\n📋 ===== CREATING AND SENDING ANSWER =====');
        console.log('📤 SENDING ANSWER with tracks:', peerConnectionRef.current.getSenders().map(s => s.track?.kind));
        socket.emit('webrtc_answer', {
          answer: peerConnectionRef.current.localDescription
        });
        console.log('📤 Answer sent to peer');
        console.log('📋 ===== ANSWER SENT COMPLETE =====\n\n');
      } catch (err) {
        console.error('❌ Error handling offer:', err);
      }
    });

    // Receive answer
    socket.on('webrtc_answer', async (data) => {
      console.log('📨 Received WebRTC answer');
      try {
        if (!peerConnectionRef.current) {
          console.error('❌ No peer connection available to handle answer');
          return;
        }
        console.log('🔄 Setting remote description (answer)');
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        console.log('✅ Remote description (answer) set successfully');
      } catch (err) {
        console.error('❌ Error handling answer:', err);
      }
    });

    // ICE candidate
    socket.on('ice_candidate', async (data) => {
      try {
        if (peerConnectionRef.current) {
          console.log('🧊 Adding ICE candidate');
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
          console.log('✅ ICE candidate added successfully');
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
    
    // Stop all media tracks
    if (localStreamRef.current) {
      stopAllTracks(localStreamRef.current);
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
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
    <div className="flex-1 flex items-center justify-center gap-10 p-8 w-full h-full overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 relative min-h-0">
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

      {/* Left - Local camera video */}
      <div className="video-box flex items-center justify-center min-h-0" style={{ width: '520px', height: '620px' }}>
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

      {/* Right - Chat panel with proper 3-section layout */}
      <div className="right-panel flex items-center justify-center min-h-0" style={{ width: '520px', height: '620px' }}>
        <div className="w-full h-full bg-black rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border border-white/10 min-h-0">
          
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
          <div id="main-container" className="flex-1 overflow-y-auto bg-black px-4 py-4 flex flex-col min-h-0" style={{ minHeight: '400px' }}>
            {/* Partner video or waiting screen - ALWAYS show in messages area */}
            {hasPartner && partnerInfo ? (
              <div id="remote-video-wrapper" className="relative flex-1 min-h-0 w-full bg-black overflow-hidden rounded-2xl" style={{ minHeight: '350px' }}>
                {/* Partner video */}
                <video
                  id="remoteVideo"
                  ref={remoteVideoRef}
                  autoPlay={true}
                  playsInline={true}
                  muted={false}
                  className="w-full h-full object-cover"
                  style={{
                    backgroundColor: '#000000',
                    display: 'block'
                  }}
                />

                {/* Connection status overlay - Top Right */}
                {isConnected && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-500 bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    {formatTime(connectionTime)}
                  </div>
                )}
              </div>
            ) : (
              /* Waiting for partner - show in message area */
              <div className="flex-1 w-full flex items-center justify-center flex-col bg-black rounded-2xl min-h-0">
                <div className="text-center">
                  <div className="animate-spin mb-4 text-5xl inline-block">⟳</div>
                  <p className="text-white font-semibold text-base">Looking for a partner...</p>
                  <p className="text-white/60 text-xs mt-2">This won't take long</p>
                </div>
              </div>
            )}

            {/* Chat messages - Display below video when they exist */}
            {messages.length > 0 && hasPartner && (
              <div className="space-y-2 mt-3">
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

