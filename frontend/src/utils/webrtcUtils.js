// Utility functions for WebRTC

export const logError = (error, context) => {
  console.error(`[${context}]`, error)
}

export const getIceServers = () => {
  return {
    iceServers: [
      // XirSys STUN server
      {
        urls: ["stun:global.xirsys.net"],
      },
      // XirSys TURN server for relaying through firewalls/NAT
      {
        urls: [
          "turn:global.xirsys.net:3478?transport=udp",
          "turn:global.xirsys.net:3478?transport=tcp",
          "turns:global.xirsys.net:5349?transport=tcp"
        ],
        username: "nkhlydv",
        credential: "a8e244b8-cf5b-11f0-8771-0242ac140002"
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
