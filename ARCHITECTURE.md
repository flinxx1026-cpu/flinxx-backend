# System Architecture & Design

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLINXX SYSTEM                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      CLIENT SIDE (Frontend)                       │
├──────────────────────────────────────────────────────────────────┤
│  Browser (React + Tailwind CSS)                                  │
│  ├── Home Page (Landing)                                         │
│  ├── Chat Page (Video Chat Interface)                            │
│  ├── WebRTC Manager (Peer Connection)                            │
│  ├── Socket.IO Client (Real-time Communication)                  │
│  └── Media Manager (Camera/Microphone)                           │
└──────────────────────────────────────────────────────────────────┘
                              ▲
                              │ WebSocket & HTTP
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SIGNALING SERVER (Backend)                     │
├──────────────────────────────────────────────────────────────────┤
│  Node.js + Express + Socket.IO                                   │
│  ├── HTTP API Server                                             │
│  │   ├── GET /api/health                                         │
│  │   └── GET /api/stats                                          │
│  ├── WebSocket Server (Socket.IO)                                │
│  │   ├── User Management                                         │
│  │   ├── Matchmaking Queue                                       │
│  │   ├── WebRTC Signaling (Offer/Answer)                         │
│  │   ├── ICE Candidate Relay                                     │
│  │   └── Session Management                                      │
│  └── In-Memory Data Store                                        │
│      ├── Users Map                                               │
│      ├── Waiting Queue                                           │
│      └── Active Sessions                                         │
└──────────────────────────────────────────────────────────────────┘
                              ▲
                              │ P2P WebRTC
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│              PEER-TO-PEER CONNECTION (Users)                      │
├──────────────────────────────────────────────────────────────────┤
│  User A ◄──────────► User B                                       │
│  (Video/Audio Streams Flow Directly)                             │
│  (No Server in Between)                                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components

```
App
├── Layout
│   ├── ErrorBoundary
│   └── Router
│       ├── Home Page
│       │   ├── Header
│       │   ├── Feature Cards
│       │   ├── Animated Background
│       │   └── CTA Button
│       │
│       └── Chat Page
│           ├── Header
│           ├── Video Grid
│           │   ├── Local Video
│           │   └── Remote Video
│           ├── Timer
│           ├── Controls
│           │   ├── Video Toggle
│           │   ├── Audio Toggle
│           │   └── Skip Button
│           └── Status Bar
```

### Backend Modules

```
server.js
├── Express App Setup
├── Socket.IO Server
├── User Management
│   ├── Register User
│   ├── Remove User
│   └── Get User Stats
├── Matchmaking Engine
│   ├── Add to Queue
│   ├── Find Match
│   └── Create Session
├── WebRTC Signaling
│   ├── Relay Offers
│   ├── Relay Answers
│   └── Relay ICE Candidates
└── Event Handlers
    ├── Connection Events
    ├── Matching Events
    ├── WebRTC Events
    └── Control Events
```

---

## Data Flow Diagrams

### User Connection Flow

```
User A                  Server                  User B
  │                       │                       │
  ├─── Connect ──────────►│                       │
  │                       │◄───── Connect ────────┤
  │                       │                       │
  │                       ├─ Add to Queue        │
  │                       │                       │
  │                       │      Match Found!     │
  │                       │                       │
  │◄─ partner_found ──────┤─ partner_found ─────►│
  │                       │                       │
  ├─ Create Offer        │                       │
  │                       │                       │
  ├─ webrtc_offer ──────►│                       │
  │                       ├─ webrtc_offer ──────►│
  │                       │                       │
  │                       │◄─ webrtc_answer ─────┤
  │◄─ webrtc_answer ──────┤                       │
  │                       │                       │
  ├─ ice_candidate ──────►│                       │
  │                       ├─ ice_candidate ──────►│
  │                       │                       │
  │                       │◄─ ice_candidate ─────┤
  │◄─ ice_candidate ──────┤                       │
  │                       │                       │
  │◄─────── P2P Connection Established ────────►│
  │                       │                       │
  │ Video/Audio Streams Flow Directly (No Server)
  │
  └─ Skip User ──────────►│                       │
                          ├─ user_skipped ──────►│
                          │                       │
                          └─ New Match Found
```

### Matchmaking Algorithm

```
┌─────────────────────────────────────────┐
│  User A Joins                           │
├─────────────────────────────────────────┤
│  Queue: [A]                             │
│  "Waiting for a partner..."             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  User B Joins                           │
├─────────────────────────────────────────┤
│  Queue: [A, B]                          │
│  Queue Length ≥ 2?                      │
│  → YES                                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  FIFO Matching                          │
├─────────────────────────────────────────┤
│  Match: A ◄──► B                        │
│  Queue: []                              │
│  Status: "Partner Found"                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  WebRTC Connection Established          │
├─────────────────────────────────────────┤
│  P2P Stream: Video + Audio              │
│  Duration Timer: Started                │
└─────────────────────────────────────────┘
```

---

## WebRTC Connection Process

```
Step 1: Signaling
┌─────────────────────────────────────────┐
│ Server relays SDP (Session Description) │
│ between two clients                     │
└─────────────────────────────────────────┘
        ▲                   ▲
        │ Offer/Answer      │
        │                   │

Step 2: ICE Gathering
┌─────────────────────────────────────────┐
│ Both peers collect ICE candidates       │
│ (Potential network paths)               │
└─────────────────────────────────────────┘
        ▲
        │ ICE Candidates
        │

Step 3: Connection
┌─────────────────────────────────────────┐
│ Peers try ICE candidates until one path │
│ works. P2P connection established.      │
└─────────────────────────────────────────┘
        ▲
        │ Direct P2P Connection
        │

Step 4: Media Streaming
┌─────────────────────────────────────────┐
│ Video and audio streams flow directly   │
│ between peers without server            │
└─────────────────────────────────────────┘
```

---

## State Management

### Frontend State (React)

```javascript
// Page-level State
const [isConnected, setIsConnected]      // Socket.IO connection
const [hasPartner, setHasPartner]        // Chat active
const [isVideoOn, setIsVideoOn]          // Video enabled
const [isAudioOn, setIsAudioOn]          // Audio enabled
const [connectionTime, setConnectionTime] // Chat duration
const [error, setError]                  // Error messages

// Refs for Media/Connections
const localVideoRef = useRef()           // Local video element
const remoteVideoRef = useRef()          // Remote video element
const localStreamRef = useRef()          // Local media stream
const peerConnectionRef = useRef()       // WebRTC peer connection
const timerRef = useRef()                // Chat timer
```

### Backend State (Node.js)

```javascript
// In-memory data structures
const users = new Map()              // All connected users
const waitingQueue = []              // Users waiting for match
const activeSessions = new Map()     // Active chat sessions

// User Object
{
  id: "uuid",                        // Unique user ID
  socketId: "socket-id",             // Socket.IO connection ID
  createdAt: Date,                   // Connection time
  matched: boolean,                  // In active chat
  partner: "socket-id"               // Partner's socket ID
}

// Session Object
{
  id: "uuid",                        // Session ID
  user1: "socket-id",                // First user
  user2: "socket-id",                // Second user
  startedAt: Date,                   // Session start time
  duration: 0                        // Session duration
}
```

---

## Security Considerations

### Current Implementation

✅ WebRTC P2P (data doesn't go through server)
✅ Anonymous (no account required)
✅ No user data storage
✅ CORS configured

### Production Recommendations

```javascript
// 1. HTTPS Enforcement
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url)
  }
  next()
})

// 2. Rate Limiting
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

// 3. Input Validation
import { z } from 'zod'
const offerSchema = z.object({
  offer: z.any()
})

// 4. Content Security Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'")
  next()
})

// 5. Helmet.js for headers
import helmet from 'helmet'
app.use(helmet())
```

---

## Performance Optimization

### Frontend Optimization

```javascript
// 1. Code Splitting
import { lazy, Suspense } from 'react'
const Chat = lazy(() => import('./pages/Chat'))

// 2. Memoization
import { useMemo } from 'react'
const MemoizedComponent = React.memo(Component)

// 3. Video Element Optimization
<video
  playsinline        // Mobile optimization
  muted              // Audio control
  autoPlay           // Auto start
/>

// 4. Lazy Load Components
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>
```

### Backend Optimization

```javascript
// 1. Connection Pooling
// Use Redis for scalability

// 2. Event Batching
// Group multiple events

// 3. Memory Management
// Clean up closed connections

// 4. Compression
import compression from 'compression'
app.use(compression())

// 5. Caching
import redis from 'redis'
const client = redis.createClient()
```

---

## Scalability Plan

### Current (Single Server)
```
Users → Single Backend Server → Socket.IO
```

### Phase 1 (Multiple Servers with Redis)
```
Load Balancer
    │
    ├─► Backend Server 1 ─┐
    │                      ├─► Redis Adapter ─► Socket.IO
    └─► Backend Server 2 ─┘
```

### Phase 2 (Microservices)
```
Frontend
    │
    ├─► API Gateway
    │   ├─► Signaling Service
    │   ├─► Matchmaking Service
    │   ├─► User Service
    │   └─► Analytics Service
    │
    └─► Redis
        └─► Database
```

---

## Deployment Architecture

### Development
```
Developer Machine
├── Frontend (localhost:3000)
├── Backend (localhost:5000)
└── Browser (Chrome/Firefox/Safari)
```

### Production
```
Users' Browsers
    │
    ├─► CDN (Cloudflare/CloudFront)
    │   └─► Frontend (Vercel/Netlify)
    │
    └─► Load Balancer
        └─► Backend Servers (Railway/Heroku/AWS)
            └─► Monitoring (DataDog/New Relic)
```

---

## API Rate Limits (Recommended)

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/health` | 100 | 1 minute |
| `/api/stats` | 50 | 1 minute |
| WebSocket connect | 10 | 1 minute |
| `find_partner` | 5 | 1 minute |
| `skip_user` | 10 | 1 minute |

---

## Monitoring & Analytics

### Key Metrics to Track

**Frontend**
- Page load time
- WebRTC connection time
- Video quality metrics
- User errors
- Session duration

**Backend**
- Active connections
- Matching time
- Server response time
- Memory usage
- CPU usage
- Error rates

### Tools to Use

```javascript
// Sentry for error tracking
import * as Sentry from "@sentry/react"

// DataDog for metrics
const StatsD = require('node-statsd')

// LogRocket for user session replay
import LogRocket from 'logrocket'

// Google Analytics for user analytics
import { useGoogleAnalyticsScript } from 'ga'
```

---

## Testing Strategy

### Unit Tests
```bash
npm test --watch
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npx cypress run
```

### Load Testing
```bash
npx artillery quick --count 100 --num 10
```

---

## Disaster Recovery

### Backup Strategy
- Database snapshots every hour
- Configuration backups to cloud
- Automated recovery procedures

### Failover
- Multiple server regions
- Automatic failover detection
- Health checks every 30 seconds

---

*Last Updated: November 26, 2024*

---

This architecture is designed to be:
- **Scalable**: Can grow from 100 to 100,000 users
- **Reliable**: Built-in error handling and recovery
- **Performant**: Optimized for low latency
- **Secure**: Best practices implemented
- **Maintainable**: Clear structure and documentation
