// ⚡ WebRTC Utility Functions — Omegle-style stable connections

const BACKEND_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_BACKEND_URL;

export const logError = (error, context) => {
  console.error(`[${context}]`, error)
}

/**
 * STUN-only servers for initial P2P connections.
 * Used as primary — fast direct connection attempt.
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
let _fetchInFlight = null; // Prevent duplicate fetches

export const fetchTurnServers = async () => {
  // Return cached credentials if still valid (refresh 5 min before expiry)
  const now = Math.floor(Date.now() / 1000);
  if (_cachedTurnServers && now < _cachedTurnExpiry - 300) {
    console.log('🧊 [ICE] Using cached TURN credentials (valid for', _cachedTurnExpiry - now, 'seconds)');
    return _cachedTurnServers;
  }

  // Deduplicate in-flight requests
  if (_fetchInFlight) {
    console.log('🧊 [ICE] TURN fetch already in-flight, waiting...');
    return _fetchInFlight;
  }

  _fetchInFlight = (async () => {
    try {
      console.log('🧊 [ICE] Fetching TURN credentials from backend...');
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
        
        // Log TURN server details for debugging
        const turnEntry = data.iceServers.find(s => s.username);
        if (turnEntry) {
          console.log('✅ [ICE] TURN credentials received:', {
            urls: turnEntry.urls,
            username: turnEntry.username,
            ttl: data.ttl
          });
        }
        
        return data.iceServers;
      }
    } catch (err) {
      console.warn('⚠️ [ICE] Failed to fetch TURN credentials:', err.message);
      console.warn('⚠️ [ICE] Falling back to STUN-only — users behind NAT may have connection issues');
    } finally {
      _fetchInFlight = null;
    }

    return getStunServers();
  })();

  return _fetchInFlight;
};

/**
 * 🔥 PRE-WARM TURN credentials in background on app load.
 * This ensures when P2P fails, TURN is already cached for INSTANT fallback.
 * No delay = faster recovery for mobile/CGNAT users.
 */
export const prewarmTurnCredentials = () => {
  fetchTurnServers()
    .then(servers => {
      const hasTurn = servers.some(s => s.username);
      console.log(`✅ [ICE PRE-WARM] TURN credentials ${hasTurn ? 'cached' : 'NOT available'} (${servers.length} entries)`);
    })
    .catch(() => {
      console.warn('⚠️ [ICE PRE-WARM] Could not pre-warm TURN — fallback will be slower on first failure');
    });
};

// Auto pre-warm on module load — TURN will be cached before any connection
prewarmTurnCredentials();

/**
 * Get full ICE servers (STUN + TURN) via backend API.
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
