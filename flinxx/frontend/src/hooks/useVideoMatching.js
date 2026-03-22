import { useState, useCallback, useEffect } from 'react'
import { socketWrapper } from '../utils/socketWrapper'

/**
 * Hook for video chat matching system
 * Handles matching, accepting, declining, and cancelling
 * 
 * Usage:
 * const { startMatching, cancelMatching, acceptMatch, declineMatch, matchedUser, isWaiting, error } = useVideoMatching(userId, userProfile)
 */
export const useVideoMatching = (userId, userProfile) => {
  const [matchedUser, setMatchedUser] = useState(null)
  const [isWaiting, setIsWaiting] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preconnectedPC, setPreconnectedPC] = useState(null)  // 🧊 Pre-gathered peer connection
  const [iceGatheringComplete, setIceGatheringComplete] = useState(false)
  const [webrtcConnectData, setWebrtcConnectData] = useState(null) // 📡 Data to trigger WebRTC connection

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

    socket?.emit('match:accept', {
      userId,
      partnerId: matchedUser.userId,
    })
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
  }, [userId, matchedUser, socket])

  // Cancel matching
  const cancelMatching = useCallback(() => {
    socket?.emit('match:cancel', {
      userId,
    })

    setIsWaiting(false)
    setMatchedUser(null)
    setLoading(false)
  }, [userId, socket])

  // Listen for match found
  useEffect(() => {
    if (!socket) return

    socket.on('partner_found', (data) => {
      console.log('✅ [HOOK] Match found:', data)
      setMatchedUser(data)
      setIsWaiting(false)
      setLoading(false)
      setError(null)
    })

    return () => {
      socket.off('partner_found')
    }
  }, [socket])

  // 🔮 Listen for WebRTC pre-connection setup (ICE pre-gathering)
  useEffect(() => {
    if (!socket) return

    socket.on('webrtc:prepare', async (data) => {
      console.log('🔮 [ICE] Preparing peer connection with config:', data.peerConnectionConfig)
      
      try {
        // Create RTCPeerConnection with optimized ICE config
        const peerConnection = new RTCPeerConnection({
          iceServers: data.iceServers || [],
          ...data.peerConnectionConfig
        })

        // Track ICE gathering
        let candidateCount = 0
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            candidateCount++
            console.log(`🔮 [ICE] Gathered candidate ${candidateCount}`)
          } else {
            console.log(`🔮 [ICE] Gathering complete (${candidateCount} candidates)`)
            setIceGatheringComplete(true)
          }
        }

        // Store the pre-connected PC
        setPreconnectedPC(peerConnection)
        console.log('🔮 [ICE] Pre-connected PC ready')

        // Auto-cleanup after 8s if no match accepted
        const cleanupTimer = setTimeout(() => {
          if (peerConnection && peerConnection.connectionState !== 'connected') {
            console.log('🔮 [ICE] Cleanup: Closing unused PC')
            peerConnection.close()
            setPreconnectedPC(null)
          }
        }, 8000)

        return () => clearTimeout(cleanupTimer)
      } catch (error) {
        console.error('🔮 [ICE] Error creating peer connection:', error)
      }
    })

    return () => {
      socket.off('webrtc:prepare')
    }
  }, [socket])

  // Listen for waiting status
  useEffect(() => {
    if (!socket) return

    socket.on('match:waiting', (data) => {
      console.log('⏳ [HOOK] Waiting for match:', data)
      setIsWaiting(true)
      setLoading(false)
    })

    return () => {
      socket.off('match:waiting')
    }
  }, [socket])

  // Listen for match declined
  useEffect(() => {
    if (!socket) return

    socket.on('match:declined', (data) => {
      console.log('❌ [HOOK] Match declined:', data)
      setMatchedUser(null)
      setIsWaiting(true)
    })

    return () => {
      socket.off('match:declined')
    }
  }, [socket])

  // Listen for partner skip
  useEffect(() => {
    if (!socket) return

    socket.on('match:partner_skipped', (data) => {
      console.log('⏭️ [HOOK] Partner skipped:', data)
      console.log(`[HOOK] Partner ${data.userId} skipped us, returning to waiting...`)
      setMatchedUser(null)
      setIsWaiting(true)
      setError(null)
    })

    return () => {
      socket.off('match:partner_skipped')
    }
  }, [socket])

  // Listen for match accepted
  useEffect(() => {
    if (!socket) return

    socket.on('match:accepted', (data) => {
      console.log('🎉 [HOOK] Match accepted:', data)
      setMatchedUser(data)
      setIsWaiting(false)
    })

    return () => {
      socket.off('match:accepted')
    }
  }, [socket])

  // Listen for requeue after skip
  useEffect(() => {
    if (!socket) return

    socket.on('match:requeued', (data) => {
      console.log('🔄 [HOOK] Requeued after skip:', data)
      console.log(`[HOOK] Back in queue at position ${data.queueSize}, skip count: ${data.skipCount}`)
      setMatchedUser(null)
      setIsWaiting(true)
      setError(null)
    })

    return () => {
      socket.off('match:requeued')
    }
  }, [socket])

  // Listen for errors
  useEffect(() => {
    if (!socket) return

    // Listen for match:error events
    socket.on('match:error', (data) => {
      console.error('🚨 [HOOK] Matching error:', data)
      const errorMessage = data.message || 'An error occurred during matching'
      setError(errorMessage)
      setIsWaiting(false)
      setLoading(false)

      // If already in active chat, just cancel and show message
      if (errorMessage.includes('already in an active chat')) {
        console.log('📞 User already in active chat - cancelling...')
        socket?.emit('match:cancel', { userId })
      }
    })

    // Listen for generic socket errors
    const errorHandler = (error) => {
      if (typeof error === 'string' && error.includes('already in an active chat')) {
        console.error('🚨 [HOOK] Already in active chat error:', error)
        setError(error)
        setIsWaiting(false)
        setLoading(false)
        socket?.emit('match:cancel', { userId })
      }
    }

    socket.on('error', errorHandler)

    return () => {
      socket.off('match:error')
      socket.off('error', errorHandler)
    }
  }, [socket, userId])

  // 📡 Listen for WebRTC connection signal (after match is accepted)
  useEffect(() => {
    if (!socket) return

    socket.on('match:accepted_start_webrtc', (data) => {
      console.log('🎊 [HOOK] Match accepted - Starting WebRTC connection:', data)
      console.log(`   Partner ID: ${data.partnerId}`)
      console.log(`   Partner Socket ID: ${data.partnerSocketId}`)
      console.log(`   Is Initiator: ${data.isInitiator}`)
      
      // Store connection data to pass to WebRTC hook
      setWebrtcConnectData(data)
    })

    return () => {
      socket.off('match:accepted_start_webrtc')
    }
  }, [socket])

  return {
    startMatching,
    acceptMatch,
    declineMatch,
    cancelMatching,
    matchedUser,
    isWaiting,
    loading,
    error,
    preconnectedPC,        // 🔮 Pre-gathered RTCPeerConnection
    iceGatheringComplete,   // 🔮 ICE gathering status
    webrtcConnectData       // 📡 WebRTC connection signal (when match accepted)
  }
}

export default useVideoMatching
