# API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-backend-domain.com`

---

## HTTP REST Endpoints

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "Server is running"
}
```

---

### Server Statistics
```
GET /api/stats
```

**Response:**
```json
{
  "activeUsers": 5,
  "activeSessions": 2,
  "waitingUsers": 1
}
```

---

## WebSocket Events

### Connection/Disconnection

#### `connect`
Fired when client connects to server.

```javascript
socket.on('connect', () => {
  console.log('Connected!')
})
```

#### `disconnect`
Fired when client disconnects.

```javascript
socket.on('disconnect', () => {
  console.log('Disconnected!')
})
```

---

### User Registration

#### `user_registered` (Server → Client)
Sent when user successfully registers.

**Data:**
```javascript
{
  userId: "uuid-string"
}
```

**Example:**
```javascript
socket.on('user_registered', (data) => {
  console.log('User ID:', data.userId)
})
```

---

### Matchmaking

#### `find_partner` (Client → Server)
Request to find a chat partner.

```javascript
socket.emit('find_partner')
```

#### `waiting` (Server → Client)
Server responds that user is waiting for a partner.

**Data:**
```javascript
{
  message: "Waiting for a partner..."
}
```

**Example:**
```javascript
socket.on('waiting', (data) => {
  console.log(data.message)
})
```

#### `partner_found` (Server → Client)
Server found a partner! Ready to establish P2P connection.

**Data:**
```javascript
{
  partnerId: "uuid-string",
  sessionId: "uuid-string"
}
```

**Example:**
```javascript
socket.on('partner_found', async (data) => {
  console.log('Partner found!', data.partnerId)
  // Initiate WebRTC connection here
})
```

---

### WebRTC Signaling

#### `webrtc_offer` (Bidirectional)

**Client → Server:**
```javascript
socket.emit('webrtc_offer', {
  offer: rtcSessionDescription.toJSON()
})
```

**Server → Client (to partner):**
```javascript
socket.on('webrtc_offer', (data) => {
  const offer = new RTCSessionDescription(data.offer)
  // Handle offer
})
```

---

#### `webrtc_answer` (Bidirectional)

**Client → Server:**
```javascript
socket.emit('webrtc_answer', {
  answer: rtcSessionDescription.toJSON()
})
```

**Server → Client (to partner):**
```javascript
socket.on('webrtc_answer', (data) => {
  const answer = new RTCSessionDescription(data.answer)
  // Handle answer
})
```

---

#### `ice_candidate` (Bidirectional)

**Client → Server:**
```javascript
socket.emit('ice_candidate', {
  candidate: rtcIceCandidate
})
```

**Server → Client (to partner):**
```javascript
socket.on('ice_candidate', (data) => {
  const candidate = new RTCIceCandidate(data.candidate)
  peerConnection.addIceCandidate(candidate)
})
```

---

### Chat Control

#### `skip_user` (Client → Server)
Skip current partner and find new one.

```javascript
socket.emit('skip_user')
```

#### `user_skipped` (Server → Client)
Partner skipped you.

```javascript
socket.on('user_skipped', () => {
  // End current chat and find new partner
  endChat()
  socket.emit('find_partner')
})
```

---

### Disconnection

#### `partner_disconnected` (Server → Client)
Partner disconnected from chat.

```javascript
socket.on('partner_disconnected', () => {
  // End chat and show offline message
  endChat()
})
```

---

## Error Handling

### `error` (Server → Client)
Server sends error message.

**Data:**
```javascript
{
  message: "Error description"
}
```

**Example:**
```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data.message)
})
```

---

## Complete WebRTC Flow Example

```javascript
// 1. User connects
socket.on('connect', () => {
  socket.emit('find_partner')
})

// 2. Waiting for partner
socket.on('waiting', (data) => {
  console.log('Status:', data.message)
})

// 3. Partner found
socket.on('partner_found', async (data) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  })

  // 4. Add local stream
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream)
  })

  // 5. Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice_candidate', { candidate: event.candidate })
    }
  }

  // 6. Handle remote stream
  peerConnection.ontrack = (event) => {
    remoteVideoElement.srcObject = event.streams[0]
  }

  // 7. Create and send offer
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  socket.emit('webrtc_offer', { offer: offer.toJSON() })
})

// 8. Receive answer
socket.on('webrtc_answer', async (data) => {
  const answer = new RTCSessionDescription(data.answer)
  await peerConnection.setRemoteDescription(answer)
})

// 9. Receive ICE candidates
socket.on('ice_candidate', async (data) => {
  const candidate = new RTCIceCandidate(data.candidate)
  await peerConnection.addIceCandidate(candidate)
})

// 10. Handle disconnection
socket.on('partner_disconnected', () => {
  peerConnection.close()
  socket.emit('find_partner')
})
```

---

## Rate Limiting

Current implementation has no rate limiting. For production, add:

```javascript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use(limiter)
```

---

## CORS Configuration

Current CORS allows origin from `CLIENT_URL` env variable.

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
```

For production, ensure proper domain configuration.

---

## Authentication (Future Enhancement)

Current implementation has no authentication. Consider adding:

```javascript
// JWT example
socket.on('connect', (socket) => {
  const token = socket.handshake.auth.token
  // Verify JWT token
})
```

---

## Database Integration (Future Enhancement)

For storing messages, user profiles, and chat history:

```javascript
import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  session_id: String,
  user1_id: String,
  user2_id: String,
  duration: Number,
  createdAt: Date,
  messages: [{
    from: String,
    text: String,
    timestamp: Date
  }]
})
```

---

## Performance Metrics

To monitor performance:

```javascript
socket.on('stats', (stats) => {
  console.log({
    videoBitrate: stats.videoBitrate,
    audioBitrate: stats.audioBitrate,
    latency: stats.latency,
    packetLoss: stats.packetLoss
  })
})
```

---

## Troubleshooting API Calls

### Connection Issues
- Verify `CLIENT_URL` matches frontend domain
- Check CORS settings
- Ensure Socket.IO is properly initialized
- Check browser console for connection errors

### Signaling Issues
- Verify offer/answer format is correct
- Ensure ICE candidates are being exchanged
- Check for network firewalls blocking WebRTC

### Performance Issues
- Monitor network bandwidth
- Check CPU usage
- Reduce video resolution
- Enable video codec optimization

---

## Testing the API

### Using cURL for REST API
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/stats
```

### Using Socket.IO Client for WebSocket
```bash
npm install -g socket.io-client
```

Then use in Node.js or browser console.

---

## API Versioning

Future updates will maintain backward compatibility. If breaking changes are needed, a v2 API will be created:
- `/api/v1/*` (current)
- `/api/v2/*` (future)

---

Last Updated: November 2024
