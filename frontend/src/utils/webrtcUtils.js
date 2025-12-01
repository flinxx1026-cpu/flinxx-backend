// Utility functions for WebRTC

export const logError = (error, context) => {
  console.error(`[${context}]`, error)
}

export const getIceServers = () => {
  return {
    iceServers: [
      // Google STUN servers
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      // Fallback STUN servers
      { urls: 'stun:stun.stunprotocols.org:3478' },
      { urls: 'stun:stun.ekiga.net:3478' },
      // TURN server for relaying through firewalls/NAT
      {
        urls: 'turn:relay1.expressturn.com:3478',
        username: 'efr5yJsjCj7J8kYxZR',
        credential: 'jP6eE8sFvYdWwA2kFh'
      }
    ]
  }
}

export const getMediaConstraints = () => {
  return {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  }
}

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}
