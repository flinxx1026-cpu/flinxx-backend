import { useState, useCallback, useEffect, useRef } from 'react'
import { socketWrapper } from '../utils/socketWrapper'
import { getIceServers, getStunServers, fetchTurnServers } from '../utils/webrtcUtils'

/**
 * Combined hook for video matching + WebRTC connection
 * Handles both matching and establishing peer connection
 */
export const useVideoMatchingWithWebRTC = (userId, userProfile) => {
  const [matchedUser, setMatchedUser] = useState(null)
  const [isWaiting, setIsWaiting] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [connectionState, setConnectionState] = useState('idle') // idle, matching, accepted, connecting, connected
  const [webrtcConnectData, setWebrtcConnectData] = useState(null)
  const peerConnectionRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const localStreamRef = useRef(null)

  const socket = socketWrapper

  // Start matching
  const startMatching = useCallback((filters = {}) => {
    if (!userId) {
      setError('User ID is required')
      return
    }

    // Cancel any existing match first
    if (matchedUser) {
      console.log('🚨 Cancelling existing match before starting new one')
      socket?.emit('match:cancel', { userId })
    }

    setLoading(true)
    setError(null)
    setIsWaiting(true)
    setMatchedUser(null)
    setConnectionState('matching')

    const matchData = {
      userId,
      ...userProfile,
      preferGender: filters.preferGender || false,
      preferCountry: filters.preferCountry || false,
      genderFilter: filters.genderFilter || null,
      countryFilter: filters.countryFilter || null,
    }

    socket?.emit('user:start_matching', matchData)
  }, [userId, userProfile, socket, matchedUser])

  // Accept match
  const acceptMatch = useCallback(() => {
    if (!matchedUser) return

    console.log('🎊 [WEBRTC] Accepting match, will establish WebRTC connection')
    socket?.emit('match:accept', {
      userId,
      partnerId: matchedUser.userId,
    })
    setConnectionState('accepted')
  }, [userId, matchedUser, socket])

  // Decline match
  const declineMatch = useCallback(() => {
    if (!matchedUser) return

    socket?.emit('match:decline', {
      userId,
      partnerId: matchedUser.userId,
    })

    setMatchedUser(null)
    setIsWaiting(true)
    setConnectionState('matching')
  }, [userId, matchedUser, socket])

  // Cancel matching
  const cancelMatching = useCallback(() => {
    socket?.emit('match:cancel', {
      userId,
    })

    setIsWaiting(false)
    setMatchedUser(null)
    setLoading(false)
    setConnectionState('idle')
    setWebrtcConnectData(null)
    
    // Close peer connection if exists
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
  }, [userId, socket])

  // 🎊 Listen for match found
  useEffect(() => {
    if (!socket) return

    socket.on('match:found', (data) => {
      console.log('✅ [WEBRTC HOOK] Match found:', data)
      setMatchedUser(data)
      setIsWaiting(false)
      setLoading(false)
      setError(null)
      setConnectionState('matched')
    })

    return () => socket.off('match:found')
  }, [socket])

  // 📡 Listen for WebRTC connection signal (after match is accepted)
  useEffect(() => {
    if (!socket) return

    socket.on('match:accepted_start_webrtc', async (data) => {
      console.log('🎊 [WEBRTC HOOK] Match accepted - Starting WebRTC:', data)
      setConnectionState('connecting')
      
      try {
        // Initialize WebRTC connection
        await initializeWebRTC(data)
      } catch (err) {
        console.error('❌ [WEBRTC HOOK] Failed to initialize WebRTC:', err)
        setError('Failed to establish video connection: ' + err.message)
        setConnectionState('error')
      }
    })

    return () => socket.off('match:accepted_start_webrtc')
  }, [socket])

  // ✅ Initialize WebRTC peer connection
  const initializeWebRTC = async (connectData) => {
    try {
      console.log('🧊 [WEBRTC] Creating peer connection...')

      // ✅ P2P-FIRST: Start with STUN-only for fast direct connection
      const iceServers = getStunServers();
      console.log('🧊 [WEBRTC] P2P direct mode (TURN pre-warmed for fallback)');

      // Pre-warm TURN in background (cached for instant fallback if P2P fails)
      fetchTurnServers().then(() => {
        console.log('✅ [WEBRTC] TURN credentials cached for fallback');
      }).catch(() => {});

      const config = {
        iceServers,
        iceTransportPolicy: 'all',
        iceCandidatePoolSize: 10,
      }

      const peerConnection = new RTCPeerConnection(config)
      peerConnectionRef.current = peerConnection

      // Track ICE restart attempts
      peerConnection._iceRestartCount = 0;
      const MAX_ICE_RESTARTS = 2;

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('🧊 [WEBRTC] Sending ICE candidate')
          socket.emit('ice_candidate', {
            to: connectData.partnerSocketId,
            candidate: event.candidate,
          })
        }
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('📹 [WEBRTC] Received remote track:', event.track.kind)
        if (event.streams && event.streams.length > 0) {
          remoteStreamRef.current = event.streams[0]
        }
      }

      // Get local media
      console.log('📹 [WEBRTC] Getting local media...')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      localStreamRef.current = stream

      // Add local tracks
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
        console.log('✅ [WEBRTC] Added local track:', track.kind)
      })

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('🧊 [WEBRTC] Connection state:', peerConnection.connectionState)
        if (peerConnection.connectionState === 'connected') {
          setConnectionState('connected')
        } else if (peerConnection.connectionState === 'failed') {
          // ✅ TURN FALLBACK: If P2P fails, retry with TURN
          if (peerConnection._iceRestartCount < MAX_ICE_RESTARTS) {
            peerConnection._iceRestartCount++;
            console.log(`🔄 [WEBRTC] ICE RESTART #${peerConnection._iceRestartCount}: Adding TURN fallback`);
            
            fetchTurnServers().then(fullIceServers => {
              try {
                peerConnection.setConfiguration({ iceServers: fullIceServers, iceTransportPolicy: 'all' });
                console.log('✅ [WEBRTC] TURN servers injected via setConfiguration');
              } catch (e) {
                console.warn('⚠️ [WEBRTC] setConfiguration not supported');
              }
              peerConnection.restartIce();
            }).catch(() => {
              console.warn('⚠️ [WEBRTC] Could not fetch TURN for fallback');
              setError('WebRTC connection failed')
              setConnectionState('error')
            });
          } else {
            setError('WebRTC connection failed')
            setConnectionState('error')
          }
        }
      }

      // If initiator, create and send offer
      if (connectData.isInitiator) {
        console.log('📤 [WEBRTC] Creating offer...')
        const offer = await peerConnection.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        })
        await peerConnection.setLocalDescription(offer)

        console.log('📤 [WEBRTC] Sending offer to partner')
        socket.emit('offer', {
          to: connectData.partnerSocketId,
          offer: offer,
        })
      }

      setWebrtcConnectData(connectData)
    } catch (error) {
      console.error('❌ [WEBRTC] Error initializing:', error)
      throw error
    }
  }

  // 📥 Listen for incoming offer
  useEffect(() => {
    if (!socket || !peerConnectionRef.current) return

    const handleOffer = async ({ offer, from }) => {
      try {
        console.log('📥 [WEBRTC] Received offer from:', from)
        const pc = peerConnectionRef.current

        await pc.setRemoteDescription(new RTCSessionDescription(offer))

        // Create answer
        console.log('📝 [WEBRTC] Creating answer...')
        const answer = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        })
        await pc.setLocalDescription(answer)

        // Send answer
        console.log('📤 [WEBRTC] Sending answer')
        socket.emit('answer', {
          to: from,
          answer: answer,
        })
      } catch (error) {
        console.error('❌ [WEBRTC] Error handling offer:', error)
        setError('Failed to handle incoming offer')
      }
    }

    socket.on('offer', handleOffer)
    return () => socket.off('offer', handleOffer)
  }, [socket])

  // 📥 Listen for incoming answer
  useEffect(() => {
    if (!socket || !peerConnectionRef.current) return

    const handleAnswer = async ({ answer, from }) => {
      try {
        console.log('📥 [WEBRTC] Received answer from:', from)
        const pc = peerConnectionRef.current
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
        console.log('✅ [WEBRTC] WebRTC connection established')
      } catch (error) {
        console.error('❌ [WEBRTC] Error handling answer:', error)
        setError('Failed to handle incoming answer')
      }
    }

    socket.on('answer', handleAnswer)
    return () => socket.off('answer', handleAnswer)
  }, [socket])

  // 🧊 Listen for ICE candidates
  useEffect(() => {
    if (!socket || !peerConnectionRef.current) return

    const handleIceCandidate = async ({ candidate }) => {
      try {
        if (candidate) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          )
        }
      } catch (error) {
        console.error('❌ [WEBRTC] Error adding ICE candidate:', error)
      }
    }

    socket.on('ice_candidate', handleIceCandidate)
    return () => socket.off('ice_candidate', handleIceCandidate)
  }, [socket])

  // Listen for other match events
  useEffect(() => {
    if (!socket) return

    socket.on('match:waiting', (data) => {
      console.log('⏳ [WEBRTC HOOK] Waiting for match:', data)
      setIsWaiting(true)
      setLoading(false)
    })

    socket.on('match:partner_skipped', (data) => {
      console.log('⏭️ [WEBRTC HOOK] Partner skipped')
      cancelMatching()
    })

    socket.on('match:error', (data) => {
      console.error('🚨 [WEBRTC HOOK] Matching error:', data)
      setError(data.message)
      setIsWaiting(false)
      setLoading(false)
    })

    return () => {
      socket.off('match:waiting')
      socket.off('match:partner_skipped')
      socket.off('match:error')
    }
  }, [socket, cancelMatching])

  return {
    // Matching functions
    startMatching,
    acceptMatch,
    declineMatch,
    cancelMatching,

    // Matching state
    matchedUser,
    isWaiting,
    loading,
    error,
    connectionState,

    // WebRTC state and refs
    peerConnectionRef,
    localStreamRef,
    remoteStreamRef,
    webrtcConnectData,
  }
}
