// ⚡ WebRTC Utility Functions — Omegle-style stable connections

export const logError = (error, context) => {
  console.error(`[${context}]`, error)
}

/**
 * STUN-only servers for default P2P connections.
 * TURN is added as a fallback only when ICE fails.
 */
export const getStunServers = () => [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  { urls: "stun:stun.cloudflare.com:3478" }
];

/**
 * TURN servers — only used as fallback when STUN/P2P fails.
 */
export const getTurnServers = () => [
  // Self-hosted TURN on EC2
  {
    urls: [
      "turn:15.206.146.133:3478?transport=udp",
      "turn:15.206.146.133:3478?transport=tcp"
    ],
    username: "test",
    credential: "test123"
  },
  // Backup: OpenRelay — works in India (Jio, Airtel)
  {
    urls: [
      "turn:openrelay.metered.ca:80?transport=udp",
      "turn:openrelay.metered.ca:443?transport=tcp"
    ],
    username: "openrelayproject",
    credential: "openrelayproject"
  }
];

/**
 * Full ICE servers — STUN + TURN combined.
 * Used when TURN fallback is needed after P2P failure.
 */
export const getIceServers = () => [
  ...getStunServers(),
  ...getTurnServers()
];

export const logIceServers = () => {
  console.log('\n🧊 ═══════════════════════════════════════════════════════════════');
  console.log('🧊 [ICE SERVERS — STUN-first P2P with TURN fallback]');
  console.log('🧊 ═══════════════════════════════════════════════════════════════');
  console.log('🧊 Phase 1 (default): STUN only — direct P2P');
  console.log('🧊   - stun:stun.l.google.com:19302');
  console.log('🧊   - stun:stun.cloudflare.com:3478');
  console.log('🧊 Phase 2 (fallback): STUN + TURN — relay mode');
  console.log('🧊   - turn:15.206.146.133:3478 (self-hosted)');
  console.log('🧊   - turn:openrelay.metered.ca (backup)');
  console.log('🧊 Video: Fixed 480p (640x480) @ 24fps');
  console.log('🧊 ═══════════════════════════════════════════════════════════════\n');
}

/**
 * Media constraints — fixed 480p for consistent quality + low bandwidth.
 */
export const getMediaConstraints = () => {
  return {
    video: {
      width: { ideal: 640, max: 640 },
      height: { ideal: 480, max: 480 },
      frameRate: { ideal: 24, max: 30 }
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
