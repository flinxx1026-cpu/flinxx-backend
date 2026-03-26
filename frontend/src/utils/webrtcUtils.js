// ⚡ WebRTC Utility Functions — Omegle-style stable connections

const BACKEND_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_BACKEND_URL;

export const logError = (error, context) => {
  console.error(`[${context}]`, error)
}

/**
 * STUN-only servers for initial P2P connections.
 * Used as Phase 1 — fast direct connection attempt.
 */
export const getStunServers = () => [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  { urls: "stun:stun.cloudflare.com:3478" }
];

/**
 * Fetch ephemeral TURN credentials from backend.
 * The backend generates HMAC-SHA1 time-limited credentials.
 * Returns full ICE servers array (STUN + TURN) from the API.
 * Falls back to STUN-only if the API call fails.
 */
let _cachedTurnServers = null;
let _cachedTurnExpiry = 0;

export const fetchTurnServers = async () => {
  // Return cached credentials if still valid (refresh 5 min before expiry)
  const now = Math.floor(Date.now() / 1000);
  if (_cachedTurnServers && now < _cachedTurnExpiry - 300) {
    return _cachedTurnServers;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/get-turn-credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.iceServers && data.iceServers.length > 0) {
      _cachedTurnServers = data.iceServers;
      _cachedTurnExpiry = now + (data.ttl || 86400);
      return data.iceServers;
    }
  } catch (err) {
    // API failed — return STUN-only (P2P will still work for many users)
  }

  return getStunServers();
};

/**
 * Get full ICE servers (STUN + TURN) via backend API.
 * This is the primary function all WebRTC code should use.
 * Returns a Promise.
 */
export const getIceServers = async () => {
  return fetchTurnServers();
};

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
