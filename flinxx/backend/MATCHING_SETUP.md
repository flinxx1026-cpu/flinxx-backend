# ⚡ Quick Setup Guide - Redis Matching System

## 🚀 5-Minute Deployment

### Step 1: Enable Real Redis (Production)
```bash
# In `.env.local` or environment
REDIS_URL=redis://your-redis-host:6379
NODE_ENV=production
```

### Step 2: Or Use Docker Redis (Development)
```bash
# Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Set environment
export REDIS_URL=redis://localhost:6379
```

### Step 3: Start Server
```bash
cd backend
npm install  # If needed
node server.js
```

✅ **Server should log:**
```
[REDIS] 🔴 Attempting to connect to Redis...
[REDIS] 🟢 Connected to Redis successfully!
✅ [REDIS] ⚡ Redis initialized - All operations will use real Redis!
✅ Matching handlers initialized
```

---

## 🧪 Test Matching

### Terminal 1: Start Server
```bash
cd backend
REDIS_URL=redis://localhost:6379 node server.js
```

### Terminal 2: Test Client (Node.js)
```javascript
// save as test-matching.js
const io = require('socket.io-client');

const user1 = io('http://localhost:10000');
const user2 = io('http://localhost:10000');

console.log('Testing matching system...\n');

user1.on('connect', () => {
  console.log('✅ User 1 connected');
  user1.emit('user:start_matching', {
    userId: 'user-001',
    gender: 'male',
    country: 'India',
    interests: ['gaming'],
    filters: {}
  });
});

user2.on('connect', () => {
  console.log('✅ User 2 connected');
  setTimeout(() => {
    user2.emit('user:start_matching', {
      userId: 'user-002',
      gender: 'female',
      country: 'India',
      interests: ['gaming'],
      filters: {}
    });
  }, 100);
});

user1.on('match:found', (data) => {
  console.log('🎉 USER 1: MATCH FOUND!', data);
  user1.emit('match:accept', {
    userId: 'user-001',
    partnerId: data.partnerId
  });
});

user2.on('match:found', (data) => {
  console.log('🎉 USER 2: MATCH FOUND!', data);
  user2.emit('match:accept', {
    userId: 'user-002',
    partnerId: data.partnerId
  });
});

user1.on('match:waiting', (data) => {
  console.log('⏳ USER 1: Waiting...', data);
});

user2.on('match:waiting', (data) => {
  console.log('⏳ USER 2: Waiting...', data);
});

user1.on('webrtc:prepare', (data) => {
  console.log('🧊 USER 1: WebRTC prepare', data.message);
});

user2.on('webrtc:prepare', (data) => {
  console.log('🧊 USER 2: WebRTC prepare', data.message);
});

user1.on('match:accepted', (data) => {
  console.log('✅ USER 1: Match accepted', data);
});

user2.on('match:accepted', (data) => {
  console.log('✅ USER 2: Match accepted', data);
});
```

### Run Test
```bash
npm install socket.io-client  # If not installed
node test-matching.js
```

---

## 📊 Monitor Queue Stats

```javascript
// In another terminal/script
const io = require('socket.io-client');

const socket = io('http://localhost:10000');

socket.on('connect', () => {
  // Get stats every 2 seconds
  setInterval(() => {
    socket.emit('admin:get_queue_stats', {});
  }, 2000);
});

socket.on('admin:queue_stats', (stats) => {
  console.log('\n📊 QUEUE STATS:');
  console.log(`Total waiting: ${stats.total}`);
  console.log(`Male: ${stats.male}`);
  console.log(`Female: ${stats.female}`);
  console.log(`Countries:`, stats.countries);
  console.log('---');
});
```

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `Can't connect to Redis` | Check `REDIS_URL` env var, ensure Redis is running |
| `Match not found` | Check queue with `admin:get_queue_stats` |
| `Match slowness` | Verify Lua scripts loaded (check server logs) |
| `High memory` | Run `admin:clear_queue` to reset |

---

## 📊 Performance Expectations

| Metric | Value |
|--------|-------|
| Matching latency (users online) | < 50ms |
| Lua operation latency | ~ 5ms |
| WebRTC ICE pre-connect | 0.5-1s |
| Skip + requeue | Instant |
| Max concurrent users | 1000+ |

---

## 🔄 Deployment Checklist

- [ ] Redis instance running (production or Docker)
- [ ] `REDIS_URL` environment variable set
- [ ] `NODE_ENV=production` (if production)
- [ ] Backend server started
- [ ] Socket.IO connection working
- [ ] Test matching works
- [ ] Queue stats accessible
- [ ] Monitor service running

---

## 📞 Next Steps

1. **Test with real users**: Use the socket events in your frontend
2. **Monitor performance**: Use `admin:get_queue_stats`
3. **Tune parameters**: Adjust timeouts in `matchingServiceOptimized.js` if needed
4. **Scale**: Add more Redis replicas/shards if needed

---

**All set!** Your matching system is now optimized for speed and scale. 🚀

