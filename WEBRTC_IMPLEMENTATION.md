# Enhanced WebRTC Chat Component

This is an enhanced version of Chat.jsx with complete WebRTC implementation

```javascript
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../services/socketService'
import { getIceServers, getMediaConstraints, formatTime } from '../utils/webrtcUtils'

const Chat = () => {
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false)
  const [hasPartner, setHasPartner] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [connectionTime, setConnectionTime] = useState(0)
  const [error, setError] = useState(null)
  
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    initializeWebRTC()
    setupSocketListeners()
    
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (hasPartner) {
      timerRef.current = setInterval(() => {
        setConnectionTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setConnectionTime(0)
    }
    
    return () => clearInterval(timerRef.current)
  }, [hasPartner])

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(getMediaConstraints())
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      setIsConnected(true)
      socket.connect()
    } catch (error) {
      console.error('Error accessing media:', error)
      setError('Unable to access camera/microphone. Please check permissions.')
      alert('Please allow camera and microphone access')
    }
  }

  const setupSocketListeners = () => {
    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('find_partner')
    })

    socket.on('partner_found', async (data) => {
      console.log('Partner found:', data)
      setHasPartner(true)
      await createPeerConnection()
      
      // Initiator creates offer
      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)
      socket.emit('webrtc_offer', { offer: offer.toJSON() })
    })

    socket.on('webrtc_offer', async (data) => {
      console.log('Received offer')
      if (!peerConnectionRef.current) {
        await createPeerConnection()
      }
      
      const offer = new RTCSessionDescription(data.offer)
      await peerConnectionRef.current.setRemoteDescription(offer)
      
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)
      socket.emit('webrtc_answer', { answer: answer.toJSON() })
    })

    socket.on('webrtc_answer', async (data) => {
      console.log('Received answer')
      const answer = new RTCSessionDescription(data.answer)
      await peerConnectionRef.current.setRemoteDescription(answer)
    })

    socket.on('ice_candidate', async (data) => {
      try {
        if (data.candidate) {
          const candidate = new RTCIceCandidate(data.candidate)
          await peerConnectionRef.current.addIceCandidate(candidate)
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error)
      }
    })

    socket.on('user_skipped', () => {
      endChat()
      socket.emit('find_partner')
    })

    socket.on('partner_disconnected', () => {
      endChat()
      socket.emit('find_partner')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      setHasPartner(false)
    })
  }

  const createPeerConnection = async () => {
    const peerConnection = new RTCPeerConnection(getIceServers())

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice_candidate', { candidate: event.candidate })
      }
    }

    peerConnection.ontrack = (event) => {
      console.log('Remote stream received')
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
      remoteStreamRef.current = event.streams[0]
    }

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState)
      if (peerConnection.connectionState === 'failed' || 
          peerConnection.connectionState === 'disconnected') {
        endChat()
      }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current)
      })
    }

    peerConnectionRef.current = peerConnection
  }

  const endChat = () => {
    setHasPartner(false)
    setConnectionTime(0)
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsAudioOn(!isAudioOn)
    }
  }

  const skipUser = () => {
    socket.emit('skip_user')
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    clearInterval(timerRef.current)
    socket.disconnect()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
          Flinxx
        </h1>
        <button
          onClick={() => {
            cleanup()
            navigate('/')
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
        >
          Exit Chat
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Main Video Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Local Video */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-[400px] object-cover bg-black"
          />
          <div className="absolute bottom-4 left-4 text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 bg-black flex items-center justify-center relative">
          {hasPartner ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute top-4 right-4 text-white text-sm font-semibold bg-green-600 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Connected
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-lg">Connecting to stranger...</p>
            </div>
          )}
        </div>
      </div>

      {/* Timer */}
      {hasPartner && (
        <div className="flex justify-center mb-8">
          <div className="text-center text-indigo-300 font-semibold">
            Chat Duration: {formatTime(connectionTime)}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all transform hover:scale-110 ${
            isVideoOn
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/50'
              : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50'
          }`}
        >
          <span className="text-2xl">{isVideoOn ? '📹' : '🚫'}</span>
        </button>

        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-all transform hover:scale-110 ${
            isAudioOn
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/50'
              : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50'
          }`}
        >
          <span className="text-2xl">{isAudioOn ? '🎤' : '🔇'}</span>
        </button>

        {hasPartner && (
          <button
            onClick={skipUser}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-full font-bold text-white transition-all transform hover:scale-105 shadow-lg shadow-orange-500/50"
          >
            Skip User →
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex justify-center gap-3 text-sm">
        <div className={`px-4 py-2 rounded-full ${isConnected ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
          {isConnected ? '✓ Connected' : '⟳ Connecting'}
        </div>
        <div className={`px-4 py-2 rounded-full ${hasPartner ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
          {hasPartner ? '✓ In Chat' : '⟳ Finding Partner'}
        </div>
      </div>
    </div>
  )
}

export default Chat
```

Replace the content of `frontend/src/pages/Chat.jsx` with the above code for full WebRTC implementation.
