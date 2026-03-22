# ⚡ FAST MATCHING VISUAL GUIDE

## Simple Architecture Diagram

```
                        USER STARTS MATCHING
                        socket.emit('user:start_matching')
                                    ↓
                        ┌───────────────────────┐
                        │   webrtc:prepare      │  (ICE starts)
                        │     (sent instantly)  │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  Lua: atomicPop       │  (~5ms)
                        │  Check queue:global   │
                        └───────────┬───────────┘
                                    ↓
                            ┌───────┴────────┐
                            │                │
                    ┌─────────────────┐  ┌────────────────┐
                    │  2+ USERS FOUND │  │  0-1 USERS     │
                    │      ✅         │  │  WAITING       │
                    └────────┬────────┘  └────────┬───────┘
                             │                    │
                    ┌────────────────┐    ┌───────────────┐
                    │  match:found   │    │ match:waiting │
                    │   (< 50ms)     │    │  (Searching)  │
                    └────────┬────────┘    └───────┬───────┘
                             │                    │
                             │            ┌───────┴────────┐
                             │            │                │
                             │    ┌───────────────┐  ┌─────────────┐
                             │    │ Retry #1 @ 2s │  │ Retry #2 ... │
                             │    │ Check matched?│  │ every 2s     │
                             │    └───────┬───────┘  └─────────────┘
                             │            │                │
                             │            ├─ R#1 @ 2s ────┤
                             │            ├─ R#2 @ 4s ────┤
                             │            ├─ R#3 @ 6s ────┤
                             │            ├─ R#4 @ 8s ────┤
                             │            ├─ R#5 @ 10s ───┤
                             │            │                │
                             │            │         ┌──────────────┐
                             │            │         │AUTO-REFRESH  │
                             │            │         │After 10 retries
                             │            │         │Reconnect user
                             │            │         │(new attempt)
                             │            │         └──────┬───────┘
                             │            │                │
                             └─────────────────────────────┘
                                         ↓
                        ┌───────────────────────────┐
                        │  WebRTC Connection Ready  │
                        │     (0.5 - 1 second)      │
                        └───────────────────────────┘
                                    ↓
                        ┌───────────────────────────┐
                        │   VIDEO CHAT ACTIVE 🎥    │
                        └───────────────────────────┘
```

---

## Queue State Over Time (2 Users)

```
TIMELINE:

0ms   │  User A: start_matching
      │    └─ webrtc:prepare
      │    └─ queue:global = [User A]
      │
0ms   │  User B: start_matching
      │    └─ webrtc:prepare
      │    └─ queue:global = [User A, User B]
      │
5ms   │  Lua atomicPop runs
      │    └─ queue:global >= 2 ✓
      │    └─ Pop User A + User B
      │    └─ Send match:found (both)
      │
500ms │  WebRTC connection negotiation
      │
1000ms│  ✅ VIDEO CHAT ACTIVE
```

---

## Queue State Over Time (1 User)

```
TIMELINE:

0s    │  User A: start_matching
      │    └─ queue:global = [User A]
      │    └─ match:waiting (Searching...)
      │
2s    │  Retry #1: match check
      │    └─ queue:global = [User A]
      │    └─ No match yet
      │
3s    │  User B: start_matching
      │    └─ queue:global = [User A, User B]
      │    └─ Lua atomicPop runs instantly
      │    └─ match:found sent immediately
      │
3.5s  │  ✅ INSTANT MATCH (after retry)
      │
```

---

## Skip Flow

```
BEFORE:
┌─────────────┐     ┌─────────────┐
│  User A     │────→│  User B     │  (ChatBox)
│  matched    │     │  matched    │
└─────────────┘     └─────────────┘

↓ User A clicks "Skip"

User A: socket.emit('match:skip', {
  userId: 'user-A',
  partnerId: 'user-B'
})

↓ [1ms - Lua skipRequeue atomic operation]

AFTER:
┌──────────┐         ┌──────────────┐
│ User A   │         │ User B       │
│ REQUEUED │         │ Still matched│
│ (Back in │         │ [no change]  │
│  queue)  │         │              │
└──────────┘         └──────────────┘

↓ [~50ms]

User C: socket.emit('user:start_matching')

↓ [2ms - Lua atomicPop finds A + C]

FINAL:
┌─────────────┐     ┌─────────────┐
│  User A     │────→│  User C     │  (ChatBox)
│  matched    │     │  matched    │
└─────────────┘     └─────────────┘

⏱️  Total time from skip to new match: ~52ms
```

---

## Redis Queue Visualization

```
queue:global (Sorted Set)

Timestamp    User Entry
────────────────────────────────────────
1234567890   {"userId":"user-001","socketId":"sock-1"}
1234567891   {"userId":"user-002","socketId":"sock-2"}
1234567892   {"userId":"user-003","socketId":"sock-3"}
1234567893   {"userId":"user-004","socketId":"sock-4"}

RPOP twice → Gets user-001, user-002
Remaining → [user-003, user-004]
```

---

## Low User Scenario: 10-Second Refresh

```
TIME:    0s        2s        4s        6s        8s        10s       12s

User A:  ☐─────────○─────────○─────────○─────────○─────────■─────────○
         start    R#1      R#2      R#3      R#4      R#5    REFRESH  R#6


         ☐ = start_matching
         ○ = retry (no match)
         ■ = auto-refresh happens here
         
Waiting:  ┌─ Searching (0-10s) ─────┬─ Reconnecting ─┬─ Searching again ─
          └─────────────────────────┘               └─────────────────
          
After 10s: User re-queued with new timestamp = potentially better position

If User B joins within 0-10s → match found during retry
If User B joins after 10s → matches User A after refresh
```

---

## Matching Latency Breakdown

```
Instant Match Scenario (2+ users online):

                0ms ────── 5ms ────── 50ms
                │          │          │
    Start        ↓          ↓          ↓
    │     Lua atomicPop  match:found  ✅
    │     runs      sent          Match
    ▼     (~5ms)    (instant)      established
    ●─────────────────────────────→●

Total: < 50ms ⚡


Low User Scenario (only 1 waiting):

                0s ────── 2s ────── 4s ────── 6s ────── ...
                │        │        │        │
    Start        ↓        ↓        ↓        ↓
    │     match:waiting  Retry R#1  Retry R#2  Retry R#3  ...
    │     (~0ms)         (~2s)      (~4s)      (~6s)
    ▼     ●────────────────○────────────○────────────○
                                              ↓
                                         If B joins here
                                         → match found ~2s later
                                         ✅

Max wait: 10s (auto-refresh)
```

---

## Event Flow Diagram

```
CLIENT                          SERVER                          REDIS
┌──────┐                       ┌──────┐                        ┌─────┐
│User A│                       │      │                        │queue│
└──┬───┘                       └──┬───┘                        └──┬──┘
   │                             │                              │
   │─ user:start_matching ┐      │                              │
   │                      └─→    │─ webrtc:prepare ────→ User A│
   │                             │                              │
   │                             │─ Lua atomicPop ──────────────│
   │                             │                        [add A]│
   │                             │─────────────────────────────→│
   │                             │◄─────────────────────────────│
   │← match:waiting              │
   │ (queue size = 1)            │
   │                             │
   │                        [2 second timer]
   │                             │
   │                             │─ Check matched ──────────────│
   │                             │◄──────────────────────────────│
   │                             │  [Not matched yet]           │
   │                             │
   │                             │
┌──────┐                       ┌──────┐                        ┌─────┐
│User B│                       │      │                        │queue│
└──┬───┘                       └──┬───┘                        └──┬──┘
   │                             │                              │
   │─ user:start_matching ┐      │                              │
   │                      └─→    │─ webrtc:prepare ────→ User B│
   │                             │                              │
   │                             │─ Lua atomicPop ──────────────│
   │                             │                   [found A+B]│
   │                             │◄─────────────────────────────│
   │← match:found       ←─────────│                              │
   │ (partnerId: B)      ────────→│                              │
   │                             │
   │                        (WebRTC negotiation ~0.5-1s)
   │                             │
   │────────────────────────────💬 VIDEO/AUDIO ──────────────→ │
   │                             │                              │
```

---

## Skip Event Flow

```
CLIENT (A)                  SERVER                    REDIS         CLIENT (B)
┌────────┐                ┌──────┐                  ┌─────┐         ┌────────┐
│ User A │                │      │                  │     │         │ User B │
└────┬───┘                └──┬───┘                  └──┬──┘         └────┬───┘
     │                       │                        │                 │
     │─ match:skip ─────┐    │                        │                 │
     │                  └─→  │─ Lua skipRequeue ──────│                 │
     │                       │  (atomic)              │                 │
     │                       │  • Remove A from queue │                 │
     │                       │  • Re-add A (new time) │                 │
     │                       │                 [A added]                │
     │                       │◄─────────────────────│                  │
     │                       │                        │                 │
     │← match:requeued       │                        │ ◄─ emit: partner_skipped─
     │  (delay: 0)           │                        │                 │
     │                       │                        │                 │
     │                       │ [A immediately available for next match]
     │                       │
     │                   [If User C joins < 50ms] ──→│
     │                       │─ Lua atomicPop ────────│
     │                       │          [A + C found] │
     │                       │
     │← match:found ←────────│
     │  (partnerId: C)       │
     │
     ├──────────────────💬──→  (WebRTC with C)
```

---

## Admin Queue Stats Response

```javascript
// Request
socket.emit('admin:get_queue_stats');

// Response
{
  total: 5,              // 5 users currently waiting
  waiting: 5,            // Same as total (simplified)
  description: "5 user(s) in queue",
  timestamp: 1710394800000
}

// Other Response (Different Times)
{
  total: 0,
  waiting: 0,
  description: "0 user(s) in queue"  // Everyone matched!
}

{
  total: 127,
  waiting: 127,
  description: "127 user(s) in queue"  // Busy time
}
```

---

## Speed Comparison

```
BEFORE (Complex Multi-Queue):
├─ Scan gender queues        5ms
├─ Scan region queues       10ms
├─ Apply filters            8ms
├─ Find match               7ms
└─ Total                    30ms  ⚠️

AFTER (Single Queue):
├─ Lua atomicPop
│   ├─ Check queue (O(1))    2ms
│   ├─ Pop users (O(1))      1ms
│   ├─ Verify & mark        2ms
│   └─ Return result
└─ Total                     ~5ms  ⚡⚡⚡
```

---

**This visual guide helps you understand the flow instantly!** 🎨

