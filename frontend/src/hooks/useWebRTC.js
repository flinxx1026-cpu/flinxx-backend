import { useEffect, useRef, useState } from 'react'

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

  const createPeerConnection = () => {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' }
      ],
      iceCandidatePoolSize: 10
    };
    console.log('🔧 RTCPeerConnection config:', config);
    const peerConnection = new RTCPeerConnection(config)

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Emit ICE candidate through socket
        console.log('ICE Candidate:', event.candidate)
      }
    }

    peerConnection.ontrack = (event) => {
      console.log('Remote stream received:', event.streams[0])
      onRemoteStream(event.streams[0])
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current)
      })
    }

    return peerConnection
  }

  return {
    error,
    getLocalStream,
    createPeerConnection,
    localStreamRef,
    peerConnectionRef
  }
}
