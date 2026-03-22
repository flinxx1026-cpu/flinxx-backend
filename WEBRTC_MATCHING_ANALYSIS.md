# Video Chat Matching & WebRTC Implementation Analysis

## Overview
The system implements a complete video chat platform with real-time matching, WebRTC peer connections, and spectator mode. Users are matched via Redis queues, then establish WebRTC connections for video/audio communication.

---

## 1. SOCKET.IO SIGNALING HANDLERS (Matching Events)

### Backend Location
- **Primary**: [flinxx/backend/sockets/matchingHandlers.js](flinxx/backend/sockets/matchingHandlers.js)
- **Fallback**: [flinxx/backend/server.js](flinxx/backend/server.js)

### Key Socket Events

#### A. `user:start_matching` - User Enters Queue
**File**: [matchingHandlers.js](flinxx/backend/sockets/matchingHandlers.js#L105)

**Purpose**: User initiates video chat matching
- Adds user to Redis queue
- Sends ICE servers configuration to frontend
- Emits `webrtc:prepare` with peer connection config
- Pre-gathers ICE candidates (8-second timeout)

**Payload Sent**:
```javascript
socket.emit('webrtc:prepare', {
  message: 'Preparing WebRTC connection...',
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: process.env.TURN_SERVER, username, credential },
    { urls: 'turn:numb.viagee.com:3478', ... },
    { urls: 'turn:openrelay.metered.ca:80', ... }
  ],
  peerConnectionConfig: {
    iceTransportPolicy: 'all',
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  },
  preGatherICE: true,
  preGatherTimeout: 8000
});
```

#### B. `match:found` or `partner_found` - Instant Match
**File**: [matchingHandlers.js](flinxx/backend/sockets/matchingHandlers.js#L200-280)

**Purpose**: Match found instantly from queue (< 50ms)
- Fetches partner user profile from database
- Sends partner data to both matched users

**Payload Sent**:
```javascript
socket.emit('partner_found', {
  partnerId: result.partner.userId,
  socketId: result.partner.socketId,
  matchTime: result.matchTime,
  connectedAt: Date.now(),
  // Partner profile data
  userName: partnerProfile?.display_name || 'Anonymous',
  userLocation: partnerProfile?.location || 'Unknown',
  userPicture: partnerProfile?.photo_url || null,
  userAge: partnerProfile?.age || 18,
  hasBlueTick: partnerProfile?.has_blue_tick || false
});
```

#### C. `match:accept` - User Accepts Match
**File**: [matchingHandlers.js](flinxx/backend/sockets/matchingHandlers.js#L459)

**Purpose**: Both users accept match, initiates WebRTC connection
- Designates first user as **offer initiator**
- Designates second user as **answer responder**

**Payload Sent**:
```javascript
socket.emit('match:accepted_start_webrtc', {
  partnerId: partnerId,
  partnerSocketId: partnerSocketId,
  isInitiator: true/false,  // Who sends offer vs answer
  message: 'Connection accepted! Starting video...'
});
```

#### D. `match:skip` - User Skips Match
**File**: [matchingHandlers.js](flinxx/backend/sockets/matchingHandlers.js#L361)

**Purpose**: User rejects matched partner, returns to queue
- Deletes match keys for both users
- Clears prefetch cache
- Requeues both users
- Increments skip counter (limit: 5)

**Payload Received**:
```javascript
socket.emit('match:skip', {
  userId: userId,
  partnerId: partnerId
});
```

#### E. `match:cancel` - User Cancels Matching
**File**: [matchingHandlers.js](flinxx/backend/sockets/matchingHandlers.js#L509)

**Purpose**: User stops waiting for match
- Removes from queue
- Cleans up session data

#### F. WebRTC Signaling Events
**File**: [server.js](flinxx/backend/server.js#L4026-L4700)

**`webrtc_offer`** - Sends SDP offer from initiator to peer
```javascript
socket.on('webrtc_offer', (data) => {
  // data: { offer: RTCSessionDescription, to: socketId }
  io.to(data.to).emit('webrtc_offer', {
    offer: data.offer,
    from: socket.id
  });
});
```

**`webrtc_answer`** - Sends SDP answer from responder to peer
```javascript
socket.on('webrtc_answer', (data) => {
  // data: { answer: RTCSessionDescription, to: socketId }
  io.to(data.to).emit('webrtc_answer', {
    answer: data.answer,
    from: socket.id
  });
});
```

**`ice_candidate`** - Exchanges ICE candidates for NAT traversal
```javascript
socket.on('ice_candidate', (data) => {
  // data: { candidate: RTCIceCandidate, to: socketId }
  io.to(data.to).emit('ice_candidate', {
    candidate: data.candidate,
    from: socket.id
  });
});
```

---

## 2. MATCHING LOGIC (User Pairing)

### Backend Service
**File**: [flinxx/backend/services/matchingServiceOptimized.js](flinxx/backend/services/matchingServiceOptimized.js)

### Core Algorithm

#### Queue Structure
- **Key**: `queue:global` (Redis list)
- **Entry Format**: JSON `{ userId, socketId, timestamp }`
- **Strategy**: FIFO (First-In-First-Out) for instant matching

#### Matching Process

**1. Add User to Queue**
```javascript
async addUserToQueue(userId, userData) {
  // Check if already waiting
  const existing = await this.redis.get('waiting:' + userId);
  if (existing) return { isMatch: false };
  
  // Get first user from queue (if exists)
  const firstEntry = await this.redis.lIndex(this.QUEUE_KEY, 0);
  
  if (firstEntry) {
    // INSTANT MATCH: Both users available
    const partner = JSON.parse(firstEntry);
    await this.redis.lRem(this.QUEUE_KEY, 1, firstEntry); // Remove partner from queue
    
    // Mark both as matched
    await this.redis.setEx('matched:' + userId, 3600, partner.userId);
    await this.redis.setEx('matched:' + partner.userId, 3600, userId);
    
    return { isMatch: true, partner: { userId, socketId } };
  }
  
  // No match available - add to queue
  await this.redis.rPush(this.QUEUE_KEY, JSON.stringify({ userId, socketId, timestamp }));
  await this.redis.setEx('waiting:' + userId, 30, '1'); // Mark as waiting (30s TTL)
  
  return { isMatch: false, queueSize };
}
```

**2. Skip User (Return to Queue)**
```javascript
async skipUser(userId, partnerId, userEntry, userData) {
  // Check skip limit (max 5 skips)
  const skipCount = await this.redis.get('skipped:' + userId);
  if (skipCount >= 5) return { success: false };
  
  // DELETE matched keys for both users
  await this.redis.del(`matched:${userId}`);
  await this.redis.del(`matched:${partnerId}`);
  
  // CLEAR prefetch cache
  await this.redis.del(`prefetch:${userId}`);
  await this.redis.del(`prefetch:${partnerId}`);
  
  // Requeue current user
  await this.redis.rPush(this.QUEUE_KEY, JSON.stringify({ userId, socketId, timestamp }));
  
  // Increment skip counter
  await this.redis.incr('skipped:' + userId);
  
  return { success: true, skipCount: skipCount + 1 };
}
```

#### Prefetching (Performance Optimization)
- Prefetches next candidate after match
- Enables instant skip-and-match
- Stored in Redis: `prefetch:{userId}`

---

## 3. USER PROFILE/DATA TRANSMISSION

### Profile Data Sent to Matched Peers

**Source**: [matchingHandlers.js Line 200-280](flinxx/backend/sockets/matchingHandlers.js#L200)

**Profile Fetch Function**:
```javascript
async function getUserProfile(userId, prisma) {
  return await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      display_name: true,
      location: true,
      photo_url: true,
      age: true,
      has_blue_tick: true
    }
  });
}
```

**Data Sent in `partner_found` Event**:
```javascript
{
  partnerId: result.partner.userId,
  socketId: result.partner.socketId,
  matchTime: result.matchTime,
  connectedAt: Date.now(),
  
  // User profile fields
  userName: partnerProfile?.display_name || 'Anonymous',
  userLocation: partnerProfile?.location || 'Unknown',
  userPicture: partnerProfile?.photo_url || null,
  userAge: partnerProfile?.age || 18,
  hasBlueTick: partnerProfile?.has_blue_tick || false
}
```

### When Sent
- **Timing**: Immediately after match found
- **Recipients**: Both matched users
- **Delivery**: Via socket.io `partner_found` event

---

## 4. WebRTC PEER CONNECTION SETUP

### Frontend Implementation

#### Main Chat Component
**File**: [flinxx/frontend/src/pages/Chat.jsx](flinxx/frontend/src/pages/Chat.jsx#L1410)

**Peer Connection Creation**:
```javascript
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'turn:15.206.146.133:3478?transport=udp', username: 'test', credential: 'test123' },
    // ... additional TURN servers
  ],
  iceTransportPolicy: 'all',  // Use both STUN and TURN
  iceCandidatePoolSize: 10
});
```

#### Matching + WebRTC Hook
**File**: [flinxx/frontend/src/hooks/useVideoMatchingWithWebRTC.js](flinxx/frontend/src/hooks/useVideoMatchingWithWebRTC.js#L134)

**Setup Flow**:
1. Listen for `match:accepted_start_webrtc` event
2. Create RTCPeerConnection with ICE servers
3. Set up event handlers (onicecandidate, ontrack, onconnectionstatechange)
4. Get local media stream
5. Add local tracks to peer connection
6. If initiator: create and send offer
7. If responder: wait for offer

**Code Snippet**:
```javascript
socket.on('match:accepted_start_webrtc', async (data) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    iceTransportPolicy: 'all',
    iceCandidatePoolSize: 10
  });
  
  peerConnectionRef.current = peerConnection;
  
  // Get local media
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: { ideal: 1280 }, height: { ideal: 720 } }
  });
  localStreamRef.current = stream;
  
  // Add local tracks
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
  
  // If initiator, create offer
  if (data.isInitiator) {
    const offer = await peerConnection.createOffer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true
    });
    await peerConnection.setLocalDescription(offer);
    socket.emit('webrtc_offer', { offer, to: data.partnerSocketId });
  }
});
```

#### Direct Call WebRTC Hook
**File**: [flinxx/frontend/src/hooks/useDirectCallWebRTC.js](flinxx/frontend/src/hooks/useDirectCallWebRTC.js#L54-L151)

**Specialized for direct user-to-user calls** (not matching-based)
- Creates peer connection
- Handles offer generation/answer
- Manages ICE candidate buffering

---

## 5. STREAM HANDLING

### Local Stream Acquisition

**File**: [Chat.jsx Lines 832-900](flinxx/frontend/src/pages/Chat.jsx#L832)

```javascript
// Request camera/microphone from browser
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 }
  },
  audio: true
});

localStreamRef.current = stream;

// Attach to video element
sharedVideoRef.current.srcObject = localStreamRef.current;
sharedVideoRef.current.muted = true;
await sharedVideoRef.current.play();
```

### Adding Local Tracks to Peer Connection

**File**: [Chat.jsx Lines 1930-1970](flinxx/frontend/src/pages/Chat.jsx#L1930)

```javascript
// OFFERER: Add tracks before sending offer
const allTracks = localStreamRef.current.getTracks();
console.log('Adding', allTracks.length, 'tracks');

allTracks.forEach((track, index) => {
  console.log(`Adding ${track.kind} track (${track.id})`);
  try {
    const sender = peerConnection.addTrack(track, localStreamRef.current);
    console.log(`✅ addTrack succeeded`);
  } catch (err) {
    console.error(`❌ addTrack failed: ${err.message}`);
  }
});
```

**Critical Checks**:
- Verify tracks not already added (check `peerConnection.getSenders()`)
- Ensure stream is active before adding
- Both parties add tracks: offerer before offer, answerer before answer

### Remote Track Handling

**File**: [Chat.jsx Lines 1540-1560](flinxx/frontend/src/pages/Chat.jsx#L1540)

```javascript
peerConnection.ontrack = (event) => {
  console.log('📥 Remote track received:', event.track.kind);
  
  const remoteStream = peerConnectionRef.current._remoteStream;
  
  // Add received track to remote stream
  remoteStream.addTrack(event.track);
  console.log('Remote stream now has', remoteStream.getTracks().length, 'tracks');
  
  // Enable track explicitly
  event.track.enabled = true;
  
  // Attach to video element IMMEDIATELY
  if (remoteVideoRef.current) {
    if (remoteVideoRef.current.srcObject !== remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.muted = false;
      console.log('✅ Remote stream attached to video element');
    }
  }
};
```

**Key Points**:
- Remote tracks arrive via `ontrack` event (not during SDP exchange)
- Create persistent `MediaStream` object to collect tracks
- Attach to video element immediately
- Enable tracks explicitly for mobile compatibility

### Global Stream Context

**File**: [flinxx/frontend/src/context/AuthContext.jsx Lines 52-53, 783-784](flinxx/frontend/src/context/AuthContext.jsx)

```javascript
const [localStream, setLocalStream] = useState(null);

// Shared across components
<AuthContext.Provider value={{ ..., localStream, setLocalStream, ... }}>
```

---

## 6. ICE CANDIDATE EXCHANGE

### ICE Server Configuration

**Primary Servers**:
1. **STUN** (Session Traversal Utilities for NAT)
   - `stun:stun.l.google.com:19302` (Google)
   - `stun:stun1.l.google.com:19302` (Google backup)
   - Purpose: Discover public IP & port

2. **TURN** (Traversal Using Relays around NAT)
   - Self-hosted: `turn:15.206.146.133:3478?transport=udp/tcp`
   - Public backup: `turn:numb.viagee.com:3478`
   - Public backup: `turn:openrelay.metered.ca:80`
   - Purpose: Relay media when direct connection fails

### ICE Gathering

**File**: [Chat.jsx Lines 1410-1425](flinxx/frontend/src/pages/Chat.jsx#L1410)

```javascript
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    const candidate = event.candidate;
    console.log('🧊 ICE Candidate generated:', {
      type: candidate.type,        // host, srflx (STUN), relay (TURN)
      protocol: candidate.protocol, // udp, tcp
      port: candidate.port
    });
    
    // Send to peer via socket.io
    socket.emit('ice_candidate', {
      to: partnerSocketId,
      candidate: candidate
    });
  } else {
    console.log('🧊 ICE gathering complete');
  }
};
```

### ICE Candidate Reception

**File**: [useWebRTC.js Lines 253-290](flinxx/frontend/src/hooks/useWebRTC.js#L253)

```javascript
socket.on('ice_candidate', async ({ candidate, from }) => {
  // FILTER: Ignore invalid candidates (mobile Chrome bug)
  if (!candidate || (candidate.sdpMid == null && candidate.sdpMLineIndex == null)) {
    console.warn('⚠️ Ignoring invalid ICE candidate');
    return;
  }
  
  if (!peerConnectionRef.current) {
    console.warn('⚠️ Received ICE candidate but no peer connection');
    return;
  }
  
  try {
    console.log('🧊 Adding ICE candidate from:', from);
    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    console.log('✅ ICE candidate added successfully');
  } catch (error) {
    console.error('❌ Error adding ICE candidate:', error);
    // Don't fail - ICE failures are not critical
  }
});
```

### Pre-gathering ICE (Performance Optimization)

**File**: [matchingHandlers.js Lines 160-180](flinxx/backend/sockets/matchingHandlers.js#L160)

**Backend sends config**:
```javascript
socket.emit('webrtc:prepare', {
  peerConnectionConfig: {
    iceTransportPolicy: 'all',
    iceCandidatePoolSize: 10,  // Pre-gather up to 10 candidates
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  },
  preGatherICE: true,
  preGatherTimeout: 8000  // 8 seconds to gather before offer
});
```

**Frontend creates pre-connected PC**:
```javascript
socket.on('webrtc:prepare', (data) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: data.iceServers,
    ...data.peerConnectionConfig
  });
  
  let candidateCount = 0;
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      candidateCount++;
      console.log(`🔮 Gathered candidate ${candidateCount}`);
    } else {
      console.log(`🔮 ICE gathering complete (${candidateCount} candidates)`);
    }
  };
  
  // Store pre-gathered PC for later use
  setPreconnectedPC(peerConnection);
  
  // Auto-cleanup if no match within 8s
  setTimeout(() => {
    if (peerConnection.connectionState !== 'connected') {
      peerConnection.close();
    }
  }, 8000);
});
```

---

## 7. SPECTATOR MODE (Admin Viewing)

### Spectator WebRTC Flow

**File**: [SessionMonitoring.jsx Lines 48-120](flinxx/admin-panel/admin-panel/frontend/src/components/SessionMonitoring.jsx#L48)

**Admin receives offers from both participants**:
```javascript
socket.on('spectator:offer', async (data) => {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  });
  
  // Handle incoming video tracks
  pc.ontrack = (event) => {
    const stream = event.streams[0];
    
    // Assign to correct video element based on which is empty
    if (!user1VideoRef.current?.srcObject) {
      user1VideoRef.current.srcObject = stream;
    } else if (!user2VideoRef.current?.srcObject) {
      user2VideoRef.current.srcObject = stream;
    }
  };
  
  // Set remote description from participant's offer
  await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
  
  // Send answer (receive-only for admin)
  const answer = await pc.createAnswer({
    offerToReceiveVideo: true,
    offerToReceiveAudio: true
  });
  
  await pc.setLocalDescription(answer);
  
  socket.emit('spectator:answer', {
    sessionId: session.id,
    answer: answer,
    to: data.from
  });
});
```

---

## 8. CONNECTION STATE MONITORING

### Connection States

**File**: [Chat.jsx](flinxx/frontend/src/pages/Chat.jsx)

```javascript
peerConnection.onconnectionstatechange = () => {
  const state = peerConnection.connectionState;
  console.log('🔌 Connection state:', state);
  
  switch(state) {
    case 'new':
      console.log('🆕 Connection created');
      break;
    case 'connecting':
      console.log('🔗 Attempting connection...');
      break;
    case 'connected':
      console.log('✅ Connection established - video flowing');
      setIsConnected(true);
      break;
    case 'disconnected':
      console.warn('⚠️ Connection lost - ICE candidates still being gathered');
      break;
    case 'failed':
      console.error('❌ Connection failed - no viable path found');
      break;
    case 'closed':
      console.log('🛑 Connection closed');
      break;
  }
};
```

### ICE Connection State

```javascript
peerConnection.oniceconnectionstatechange = () => {
  const state = peerConnection.iceConnectionState;
  console.log('🧊 ICE connection state:', state);
  
  if (state === 'connected' || state === 'completed') {
    console.log('✅ ICE established');
  } else if (state === 'failed') {
    console.error('❌ ICE failed - no TURN relay available');
  }
};
```

---

## SUMMARY TABLE

| Component | Location | Purpose |
|-----------|----------|---------|
| **Matching Queue** | matchingServiceOptimized.js | Redis-backed user queue & pairing |
| **Socket Handlers** | matchingHandlers.js | Matching events (start, accept, skip) |
| **WebRTC Signaling** | server.js | Offer/answer/ICE relay |
| **Peer Connection** | useVideoMatchingWithWebRTC.js | RTCPeerConnection setup |
| **Stream Management** | Chat.jsx | Local/remote stream handling |
| **Direct Calls** | useDirectCallWebRTC.js | User-to-user calls (non-matching) |
| **Spectator Mode** | SessionMonitoring.jsx | Admin viewing live sessions |
| **ICE Config** | matchingHandlers.js | STUN/TURN server configuration |

---

## KEY ARCHITECTURAL POINTS

1. **ICE Pre-gathering**: Backend sends ICE config early to start gathering while user waits for match
2. **Profile Sharing**: Partner data sent in `partner_found` event (includes photo, name, location, age, blue tick status)
3. **Asymmetric Roles**: First user to accept becomes **offerer**, second becomes **answerer**
4. **Track Addition Timing**: Local tracks added BEFORE SDP exchange (offer/answer)
5. **Remote Stream Assembly**: Remote tracks collected via `ontrack` events and added to persistent MediaStream
6. **Prefetch Optimization**: Next candidates pre-cached for instant skip-and-rematch
7. **Mobile Considerations**: 
   - Pre-gathering ICE with 8s timeout
   - Filtering invalid ICE candidates (sdpMid/sdpMLineIndex check)
   - No automatic ICE restart (manual retry only)
   - Global stream context for permission sharing

