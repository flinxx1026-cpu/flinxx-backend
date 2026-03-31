import { useEffect, useRef, useState } from 'react'
import socket from '../services/socketService'
import { fetchTurnServers, getStunServers } from '../utils/webrtcUtils'

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
    // ✅ P2P-FIRST: Start with STUN-only for fast direct connection
    const iceServers = getStunServers();
    console.log('🧊 [useWebRTC] P2P direct mode (TURN pre-warmed for fallback)');

    // Pre-warm TURN in background (cached for instant fallback if P2P fails)
    fetchTurnServers().then(() => {
      console.log('✅ [useWebRTC] TURN credentials cached for fallback');
    }).catch(() => {});

    const config = {
      iceServers,
      iceTransportPolicy: "all",
      iceCandidatePoolSize: 10
    };
    const peerConnection = new RTCPeerConnection(config)

    // Track ICE restart attempts
    peerConnection._iceRestartCount = 0;
    const MAX_ICE_RESTARTS = 2;

    // ✅ SEND ICE CANDIDATE THROUGH SOCKET
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          to: socketId,
          candidate: event.candidate
        });
      }
    }

    // ✅ MONITOR ICE CONNECTION STATE + TURN FALLBACK
    peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState;

      if (state === 'failed') {
        // ✅ TURN FALLBACK: If P2P fails, retry with TURN
        if (peerConnection._iceRestartCount < MAX_ICE_RESTARTS) {
          peerConnection._iceRestartCount++;
          console.log(`🔄 [useWebRTC] ICE RESTART #${peerConnection._iceRestartCount}: Adding TURN fallback`);
          
          fetchTurnServers().then(fullIceServers => {
            try {
              peerConnection.setConfiguration({ iceServers: fullIceServers, iceTransportPolicy: 'all' });
              console.log('✅ [useWebRTC] TURN servers injected');
            } catch (e) {
              console.warn('⚠️ [useWebRTC] setConfiguration not supported');
            }
            peerConnection.restartIce();
          }).catch(() => {
            console.error('❌ [useWebRTC] ICE Connection failed - TURN fetch also failed');
          });
        } else {
          console.error('❌ [useWebRTC] ICE Connection failed - Max restarts exhausted');
        }
      }
    }

    peerConnection.ontrack = (event) => {
      if (!event.streams || event.streams.length === 0) {
        return;
      }

      const stream = event.streams[0];

      // ✅ CRITICAL ARCHITECTURE: Hook ONLY sends stream to parent via callback
      // Hook does NOT touch video DOM - that's Chat.jsx's responsibility
      onRemoteStream(stream);
    }

    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getTracks();
      tracks.forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
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

      const offer = await pc.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      });
      await pc.setLocalDescription(offer);

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
        if (!peerConnectionRef.current) {
          peerConnectionRef.current = await createPeerConnection();
        }

        const pc = peerConnectionRef.current;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true
        });

        await pc.setLocalDescription(answer);

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
        if (!peerConnectionRef.current) {
          return;
        }

        const pc = peerConnectionRef.current;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
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
        // ✅ FILTER: Mobile Chrome sends incomplete ICE candidates
        if (!candidate || (candidate.sdpMid == null && candidate.sdpMLineIndex == null)) {
          return;
        }

        if (!peerConnectionRef.current) {
          return;
        }

        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        // Non-critical — don't set error state for ICE failures
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
