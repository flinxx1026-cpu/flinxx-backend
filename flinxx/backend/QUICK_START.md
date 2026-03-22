# ⚡ QUICK START - Integrate Matching in 5 Minutes

## Step 1: Add Imports (top of server.js)

```javascript
import MatchingService from './services/matchingService.js';
import setupMatchingHandlers from './sockets/matchingHandlers.js';
```

---

## Step 2: Initialize After Redis Setup

Find this in server.js (around line 470):
```javascript
// ===== EXPRESS & SOCKET.IO SETUP =====

const app = express()
const httpServer = createServer(app)
```

Add AFTER socket.io creation (around line 550+):

```javascript
// Socket.IO Configuration with CORS
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
})

// ✅ ADD THIS:
// Initialize matching system
const matchingHandlers = setupMatchingHandlers(io, redis);
console.log('✅ [server.js] Matching system initialized');
```

---

## Step 3: Test It!

Run your server:
```bash
cd backend
npm start
```

You should see:
```
✅ [server.js] Matching system initialized
```

---

## Step 4: Frontend - Create Hook

Create `frontend/src/hooks/useVideoMatching.js`:

```javascript
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useVideoMatching(userId, userProfile) {
  const socketRef = useRef(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('match:found', (data) => {
      console.log('✅ Match found!', data);
      setMatchedUser(data);
      setIsWaiting(false);
    });

    socketRef.current.on('match:waiting', (data) => {
      console.log('⏳ Waiting...');
      setIsWaiting(true);
    });

    socketRef.current.on('match:error', (data) => {
      setError(data.message);
    });

    return () => socketRef.current?.disconnect();
  }, []);

  return {
    matchedUser,
    isWaiting,
    error,
    
    startMatching: () => {
      setError(null);
      socketRef.current?.emit('user:start_matching', {
        userId,
        gender: userProfile.gender,
        country: userProfile.country,
        interests: userProfile.interests || [],
        filters: {
          preferGender: true,
          preferCountry: true
        }
      });
    },

    declineMatch: () => {
      socketRef.current?.emit('match:decline', {
        userId,
        rejectedUserId: matchedUser.partnerId
      });
      setMatchedUser(null);
    },

    acceptMatch: () => {
      socketRef.current?.emit('match:accept', {
        userId,
        partnerId: matchedUser.partnerId
      });
    },

    cancelMatching: () => {
      socketRef.current?.emit('match:cancel', { userId });
      setIsWaiting(false);
      setMatchedUser(null);
    }
  };
}
```

---

## Step 5: Use in Component

```jsx
import { useVideoMatching } from '../hooks/useVideoMatching';

export function RandomChatPage() {
  const { user } = useAuth();
  const { matchedUser, isWaiting, error, startMatching, declineMatch, acceptMatch, cancelMatching } = 
    useVideoMatching(user.id, user.profile);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (isWaiting) {
    return (
      <div className="waiting">
        <div className="spinner"></div>
        <p>Finding a match...</p>
        <button onClick={cancelMatching}>Cancel</button>
      </div>
    );
  }

  if (matchedUser) {
    return (
      <div className="match-card">
        <h2>Match Found!</h2>
        <p>Gender: {matchedUser.partnerGender}</p>
        <p>Country: {matchedUser.partnerCountry}</p>
        
        <div className="buttons">
          <button onClick={declineMatch} className="decline-btn">
            Pass
          </button>
          <button onClick={acceptMatch} className="accept-btn">
            Accept & Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={startMatching} className="start-btn">
      🎬 Start Random Chat
    </button>
  );
}
```

---

## Flow Diagram

```
User Clicks "Start" 
         ↓
emit('user:start_matching')
         ↓
    Match Found?
     ↙        ↘
   YES        NO
    ↓          ↓
Match      Waiting
Alert      Spinner
    ↓
Users See Match Card
    ↓
Click Accept/Decline
    ↓
Start Video Chat
(Use your existing WebRTC code)
```

---

## Real-Time Queue Monitoring (Optional)

Add this to your admin dashboard:

```jsx
function QueueStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    // Get stats every 2 seconds
    const interval = setInterval(() => {
      socket.emit('admin:get_queue_stats', {});
    }, 2000);

    socket.on('admin:queue_stats', (data) => {
      setStats(data);
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats">
      <h3>📊 Queue Stats</h3>
      <p>Total Waiting: {stats?.totalWaiting || 0}</p>
      <p>Male: {stats?.waitingMale || 0}</p>
      <p>Female: {stats?.waitingFemale || 0}</p>
    </div>
  );
}
```

---

## Test It Locally

### Terminal 1: Start Backend
```bash
cd backend
npm start
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```

### Terminal 3: Open Two Browser Windows

**Window 1:**
- Go to `http://localhost:3003`
- Login as User A
- Click "Start Random Chat"
- You'll see "Waiting..."

**Window 2:**
- Go to `http://localhost:3003` (different user)
- Login as User B
- Click "Start Random Chat"
- Both should see match found! ✨

---

## Verify It's Working

Check server console, you should see:
```
[SOCKET] 🔗 New connection: socket_id_1
[SOCKET] ✅ Matching handlers setup for socket_id_1

[MATCHING_EVENT] 🟢 user_a started matching
[MATCHING_WAITING] ⏳ User user_a is waiting

[SOCKET] 🔗 New connection: socket_id_2
[SOCKET] ✅ Matching handlers setup for socket_id_2

[MATCHING_EVENT] 🟢 user_b started matching
[MATCHING] 👥 Found FIFO partner: user_a from queue
[MATCHING_SUCCESS] ✅ Match created!
[MATCHING_SUCCESS] 📤 Sent match notifications
```

---

## Next Steps

1. ✅ Test matching works locally
2. ⬜ Add user blocking (prevent matching with blocked users)
3. ⬜ Add interest-based matching
4. ⬜ Deploy to production
5. ⬜ Monitor queue performance
6. ⬜ Add analytics dashboard

---

## Common Errors & Fixes

### Error: "Cannot find module 'matchingService'"
**Fix**: Make sure the file path is correct:
```javascript
// Wrong:
import MatchingService from './matchingService.js'

// Right:
import MatchingService from './services/matchingService.js'
```

### Error: "io is not defined"
**Fix**: Make sure io is created before using it:
```javascript
// First create io
const io = new Server(httpServer, { ... })

// THEN initialize matching
setupMatchingHandlers(io, redis);
```

### Error: Match never found
**Fix**: Check Redis is working:
```javascript
// In server console, you should see:
✅ [server.js] Redis connection established
✅ [server.js] Matching system initialized
```

---

## Performance Tuning

### Reduce Match Timeout
If matches should happen faster:
```javascript
// In matchingService.js, line 35:
this.MATCH_TIMEOUT = 15; // 15 seconds (was 30)
```

### Increase Connection Limit
If you have 10k+ users:
```javascript
// In .env
REDIS_MAX_CONNECTIONS=100
NODE_OPTIONS=--max-old-space-size=4096
```

---

That's it! You now have a **blazing fast matching system**. 🚀
