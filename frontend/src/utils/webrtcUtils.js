// Utility functions for WebRTC

export const logError = (error, context) => {
  console.error(`[${context}]`, error)
}

export const logIceServers = () => {
  console.log('\n🧊 ═══════════════════════════════════════════════════════════════');
  console.log('🧊 [ICE SERVERS CONFIGURATION]');
  console.log('🧊 ═══════════════════════════════════════════════════════════════');
  const config = getIceServers();
  console.log('🧊 STUN Server:');
  console.log('🧊   - stun:global.xirsys.net');
  console.log('🧊     Purpose: NAT detection, find public IP');
  console.log('🧊     Status: Should work on all networks');
  console.log('🧊 ');
  console.log('🧊 TURN Servers (for relaying if P2P blocked):');
  console.log('🧊   - turn:global.xirsys.net:3478?transport=udp');
  console.log('🧊     Status: Blocked if ISP blocks UDP port 3478');
  console.log('🧊   - turn:global.xirsys.net:3478?transport=tcp');
  console.log('🧊     Status: Blocked if ISP blocks TCP port 3478');
  console.log('🧊   - turns:global.xirsys.net:5349?transport=tcp');
  console.log('🧊     Status: Blocked if ISP blocks TLS port 5349');
  console.log('🧊 ');
  console.log('🧊 Credentials:');
  console.log('🧊   - Username: nkhlydv');
  console.log('🧊   - Credential: a8e244b8-cf5b-11f0-8771-0242ac140002');
  console.log('🧊 ');
  console.log('🧊 If all TURN candidates fail with error 701:');
  console.log('🧊   ✓ Configuration is CORRECT');
  console.log('🧊   ✓ STUN works (can find your IP)');
  console.log('🧊   ✗ ISP/Network is blocking TURN ports');
  console.log('🧊   → Try VPN or different network to test');
  console.log('🧊 ═══════════════════════════════════════════════════════════════\n');
}

export const getIceServers = () => {
  // CRITICAL: Return array directly, not wrapped in object
  // RTCPeerConnection expects: { iceServers: [...] } where ... is an array
  return [
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
