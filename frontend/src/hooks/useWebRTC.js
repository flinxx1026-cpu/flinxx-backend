import { useEffect, useRef, useState } from 'react'
import socket from '../services/socketService'

export const useWebRTC = (socketId, onRemoteStream) => {
  const [error, setError] = useState(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      })
      localStreamRef.current = stream
      return stream
    } catch (error) {
      setError('Failed to access media devices')
      throw error
    }
  }

  const createPeerConnection = async () => {
    const res = await fetch("https://flinxx-backend.onrender.com/api/get-turn-credentials", {
      method: "POST"
    });
    const data = await res.json();
    
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
      ...(data.iceServers || []) // Add servers from API as backup
    ];
    
    const config = {
      iceServers,
      iceTransportPolicy: "all",  // change to "relay" if mobile still disconnects
      iceCandidatePoolSize: 10
    };
    console.log('🔧 RTCPeerConnection config:', config);
    const peerConnection = new RTCPeerConnection(config)

    // ✅ SEND ICE CANDIDATE THROUGH SOCKET
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate;
        console.log('🧊 ICE Candidate generated:', {
          candidate: candidate.candidate,
          type: candidate.type,
          protocol: candidate.protocol,
          port: candidate.port
        });
        
        if (candidate.type === 'relay') {
          console.log('🔄 RELAY (TURN) candidate - TURN server reachable, Protocol:', candidate.protocol, 'Port:', candidate.port);
        }
        
        socket.emit("ice_candidate", {
          to: socketId,
          candidate: candidate
        });
      } else {
        console.log('🧊 ICE gathering complete');
      }
    }

    // ✅ MONITOR ICE CONNECTION STATE
    peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState;
      console.log('🧊 ICE Connection State:', state);
      
      if (state === 'failed') {
        console.error('❌ ICE failed, attempting restart');
        try {
          peerConnection.restartIce();
          console.log('✅ ICE restart requested');
        } catch (err) {
          console.error('❌ ICE restart failed:', err);
        }
      } else if (state === 'disconnected') {
        console.warn('⚠️ ICE disconnected, attempting restart');
        try {
          peerConnection.restartIce();
          console.log('✅ ICE restart requested');
        } catch (err) {
          console.error('❌ ICE restart failed:', err);
        }
      } else if (state === 'connected' || state === 'completed') {
        console.log('✅ ICE Connection established');
      }
    }

    peerConnection.ontrack = (event) => {
      console.log('\n📥 ===== REMOTE TRACK RECEIVED =====' );
      console.log('📥 Track:', event.track.kind, 'ID:', event.track.id);
      console.log('📥 Streams count:', event.streams.length);
      
      if (!event.streams || event.streams.length === 0) {
        console.error('❌ No streams in ontrack');
        return;
      }
      
      const stream = event.streams[0];
      console.log('✅ Remote stream ready, calling callback');
      onRemoteStream(stream);
      console.log('✅ onRemoteStream callback invoked');
    }

    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getTracks();
      console.log('🎤 Adding', tracks.length, 'local tracks');
      tracks.forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
        console.log('✅ Added', track.kind, 'track');
      });
    } else {
      console.warn('⚠️ Local stream not ready');
    }

    return peerConnection
  }

  // ✅ CREATE AND SEND OFFER
  const sendOffer = async () => {
    try {
      if (!peerConnectionRef.current) {
        peerConnectionRef.current = await createPeerConnection();
      }
      
      const pc = peerConnectionRef.current;
      console.log('📤 Creating WebRTC offer...');
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      console.log('📤 Sending offer to peer:', socketId);
      socket.emit("offer", { 
        to: socketId, 
        offer: offer
      });
    } catch (error) {
      console.error('❌ Error sending offer:', error);
      setError('Failed to send offer');
    }
  }

  // ✅ RECEIVE OFFER AND SEND ANSWER
  useEffect(() => {
    const handleOffer = async ({ offer, from }) => {
      try {
        console.log('📥 Received offer from:', from);
        
        if (!peerConnectionRef.current) {
          peerConnectionRef.current = await createPeerConnection();
        }
        
        const pc = peerConnectionRef.current;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        
        console.log('📝 Creating WebRTC answer...');
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        console.log('📤 Sending answer to peer:', from);
        socket.emit("answer", { 
          to: from, 
          answer: answer
        });
      } catch (error) {
        console.error('❌ Error handling offer:', error);
        setError('Failed to handle offer');
      }
    }

    socket.on("offer", handleOffer);
    return () => socket.off("offer", handleOffer);
  }, [socketId])

  // ✅ RECEIVE ANSWER
  useEffect(() => {
    const handleAnswer = async ({ answer, from }) => {
      try {
        console.log('📥 Received answer from:', from);
        
        if (!peerConnectionRef.current) {
          console.error('❌ No peer connection to set answer on');
          return;
        }
        
        const pc = peerConnectionRef.current;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        
        console.log('✅ Answer set successfully, WebRTC connection established');
      } catch (error) {
        console.error('❌ Error handling answer:', error);
        setError('Failed to handle answer');
      }
    }

    socket.on("answer", handleAnswer);
    return () => socket.off("answer", handleAnswer);
  }, [socketId])

  // ✅ RECEIVE ICE CANDIDATE
  useEffect(() => {
    const handleIceCandidate = async ({ candidate, from }) => {
      try {
        // ✅ FILTER: Mobile Chrome sends incomplete ICE candidates with null sdpMid and sdpMLineIndex
        // These must be ignored to avoid errors
        if (!candidate || (candidate.sdpMid == null && candidate.sdpMLineIndex == null)) {
          console.warn('⚠️ Ignoring invalid ICE candidate (empty sdpMid and sdpMLineIndex)');
          return;
        }
        
        if (!peerConnectionRef.current) {
          console.warn('⚠️ Received ICE candidate but no peer connection');
          return;
        }
        
        console.log('🧊 Received ICE candidate from:', from);
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('✅ ICE candidate added successfully');
      } catch (error) {
        console.error('❌ Error adding ICE candidate:', error);
        // Don't set error state for ICE failures, they're not critical
      }
    }

    socket.on("ice_candidate", handleIceCandidate);
    return () => socket.off("ice_candidate", handleIceCandidate);
  }, [socketId])

  return {
    error,
    getLocalStream,
    createPeerConnection,
    sendOffer,
    localStreamRef,
    peerConnectionRef
  }
}
