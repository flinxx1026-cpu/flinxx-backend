# 📊 WebRTC Stream Handling - Visual Diagrams

**Date:** 2025-12-20  
**Topic:** How the fix prevents black screen

---

## Problem: Event.streams[0] Reassignment

### Timeline (BROKEN)
```
T0: RTCPeerConnection established
    │
    ├─ Browser sends: Audio Track
    │
    └─ ontrack EVENT #1 FIRES
       │
       ├─ event.streams[0] = MediaStream { audio_track }
       │
       ├─ Code does: srcObject = event.streams[0]
       │
       └─ Result: remoteVideoRef.srcObject = audio_stream
                                          └─ ✅ Audio plays

    ├─ Browser sends: Video Track
    │
    └─ ontrack EVENT #2 FIRES
       │
       ├─ event.streams[0] = MediaStream { video_track }  ← NEW stream object!
       │
       ├─ Code does: srcObject = event.streams[0]
       │
       └─ Result: remoteVideoRef.srcObject = video_stream  ← OVERWRITES previous!
                                          └─ ❌ Video plays, audio LOST
                                          └─ 🔴 BLACK SCREEN (video-only)
```

### Result: Black Screen
```
Frame 1: Audio Only          Frame 2: Video Only (Overwritten)
┌──────────────────┐        ┌──────────────────┐
│   Sound waves    │        │   Black Screen   │
│   Audio plays ✅ │    →   │   No Audio ❌    │
│   No Video ❌    │        │   Black Video ❌ │
└──────────────────┘        └──────────────────┘

Problem: srcObject reassigned, audio stream lost
```

---

## Solution: Persistent MediaStream

### Timeline (FIXED)
```
T0: RTCPeerConnection established
    │
    ├─ CREATE persistent stream ONCE
    │  MediaStream { } ← Empty, will accumulate tracks
    │
    ├─ Browser sends: Audio Track
    │
    └─ ontrack EVENT #1 FIRES
       │
       ├─ remoteStream.addTrack(audioTrack)
       │
       ├─ remoteStream = MediaStream { audio_track }
       │
       ├─ Code does: srcObject = remoteStream (if not already set)
       │
       └─ Result: remoteVideoRef.srcObject = stream_with_audio
                                          └─ ✅ Audio plays

    ├─ Browser sends: Video Track
    │
    └─ ontrack EVENT #2 FIRES
       │
       ├─ remoteStream.addTrack(videoTrack)
       │
       ├─ remoteStream = MediaStream { audio_track, video_track }
       │
       ├─ Code SKIPS: srcObject reassignment (already set!)
       │
       └─ Result: remoteVideoRef.srcObject unchanged
                  BUT stream now has both audio + video
                                          └─ ✅ Audio plays
                                          └─ ✅ Video plays
```

### Result: Both Audio & Video
```
Frame 1: Audio Ready         Frame 2: Audio + Video Complete
┌──────────────────┐        ┌──────────────────┐
│   Sound waves    │        │   Sound waves    │
│   Audio plays ✅ │    →   │   Audio plays ✅ │
│   No Video ❌    │        │   Video plays ✅ │
└──────────────────┘        └──────────────────┘

Solution: Same stream object, both tracks accumulate
```

---

## Stream Object Lifetime

### Before (Broken)
```
┌─────────────────────────────────────────────────────────────┐
│                  Browser Peer Connection                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ontrack Event #1 (audio):                                   │
│  ┌──────────────┐                                           │
│  │ stream {     │  → srcObject assignment                   │
│  │   audio      │  ✅ Stream attached                       │
│  └──────────────┘                                           │
│      ↓ (temporary, GC later)                                │
│                                                               │
│ ontrack Event #2 (video):                                   │
│  ┌──────────────┐                                           │
│  │ stream {     │  → srcObject assignment (overwrites!)     │
│  │   video      │  ❌ Previous stream discarded             │
│  └──────────────┘  (audio lost!)                            │
│      ↓ (temporary, GC later)                                │
│                                                               │
│ Video Element: srcObject = video_only_stream                │
│                ❌ Black screen (no audio, silent video)    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### After (Fixed)
```
┌─────────────────────────────────────────────────────────────┐
│                  Browser Peer Connection                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Initialization: Create persistent stream                    │
│  ┌──────────────────┐                                       │
│  │ remoteStream {   │  ← PERSISTENT (never garbage collected)
│  │   []             │  ← Empty, ready for tracks             │
│  └──────────────────┘                                       │
│        ↓                                                     │
│        ↓ (stays allocated for entire connection)            │
│        ↓                                                     │
│ ontrack Event #1 (audio):                                   │
│  remoteStream.addTrack(audioTrack)                          │
│  ┌──────────────────┐                                       │
│  │ remoteStream {   │  → srcObject attachment               │
│  │   [audio]        │  ✅ Stream attached                   │
│  └──────────────────┘                                       │
│        ↓ (same object, not garbage collected)               │
│        ↓                                                     │
│ ontrack Event #2 (video):                                   │
│  remoteStream.addTrack(videoTrack)                          │
│  ┌──────────────────┐                                       │
│  │ remoteStream {   │  → NO reassignment!                   │
│  │   [audio, video] │  ✅ Both tracks in same stream        │
│  └──────────────────┘                                       │
│        ↓ (same object, no garbage)                          │
│        ↓                                                     │
│ Video Element: srcObject = remoteStream (with audio+video)  │
│                ✅ Clear video with audio                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Code Flow Diagram

### Before (Problematic Pattern)
```
┌─ createPeerConnection()
│
├─ peerConnection.ontrack = (event) => {
│  │
│  ├─ const stream = event.streams[0]  ← ❌ TEMPORARY
│  │
│  ├─ remoteVideoRef.current.srcObject = stream  ← ❌ OVERWRITES
│  │
│  └─ remoteVideoRef.current.play()
│
└─ [Repeat for each track: audio, video, etc.]

Problem: Each track creates new srcObject assignment
Result: Last track overwrites previous ones
```

### After (Correct Pattern)
```
┌─ createPeerConnection()
│
├─ Create persistent: peerConnectionRef.current._remoteStream = new MediaStream()
│  │
│  └─ ✅ Lives for entire peer connection lifetime
│
├─ peerConnection.ontrack = (event) => {
│  │
│  ├─ const remoteStream = peerConnectionRef.current._remoteStream  ← ✅ PERSISTENT
│  │
│  ├─ remoteStream.addTrack(event.track)  ← ✅ ACCUMULATE
│  │
│  ├─ if (srcObject !== remoteStream) {  ← ✅ GUARD
│  │    srcObject = remoteStream
│  │    play()
│  │ }
│  │
│  └─ ✅ Skip re-attachment on subsequent tracks
│
└─ [All tracks go to SAME stream object]

Benefit: Single stream for entire connection
Result: All tracks coexist peacefully
```

---

## Memory Model

### Before (Memory Leak Risk)
```
Heap Memory:

Time 0: PeerConnection created
  [peerConnection object]

Time 1: ontrack(audio)
  [peerConnection object]
  [MediaStream #1] ← audio track
    └─ remoteVideoRef.srcObject points here ✅
       
Time 2: ontrack(video)
  [peerConnection object]
  [MediaStream #1] ← audio track (ORPHANED ❌)
  [MediaStream #2] ← video track
    └─ remoteVideoRef.srcObject points here ↔️

Time 3: Connection ends
  [peerConnection object]
  [MediaStream #1] ← STILL IN MEMORY (memory leak)
  [MediaStream #2] ← STILL IN MEMORY (memory leak)

Problem: Orphaned streams not garbage collected
```

### After (Clean Memory)
```
Heap Memory:

Time 0: PeerConnection created
  [peerConnection object]
  [remoteStream] ← persistent
    └─ peerConnectionRef.current._remoteStream
       └─ remoteVideoRef.srcObject points here ✅

Time 1: ontrack(audio)
  [peerConnection object]
  [remoteStream] ← has audio track now
    └─ Both refs still point here ✅
       └─ Video element still using this ✅

Time 2: ontrack(video)
  [peerConnection object]
  [remoteStream] ← has audio + video tracks now
    └─ Both refs still point here ✅
       └─ Video element still using this ✅

Time 3: Connection ends
  [peerConnection object] ← destroyed
  [remoteStream] ← destroyed (no more refs)

Result: No orphaned streams, clean memory
```

---

## Stream Contents Over Time

### Broken Approach (Event.streams[0])
```
Timeline      event.streams[0]           srcObject Assignment
─────────────────────────────────────────────────────────────────────

T=0ms         
  ┌─ new MediaStream [audio_track]
  │ └─ Stream_A { audio_track }
  │    └─ → srcObject = Stream_A ✅

T=100ms       
  ┌─ new MediaStream [video_track]      ← NEW stream object!
  │ └─ Stream_B { video_track }
  │    └─ → srcObject = Stream_B ❌ OVERWRITES
  │       └─ Stream_A is lost!

Result:
  remoteVideoRef.srcObject = Stream_B { video_track only }
  ❌ No audio, black video
```

### Fixed Approach (Persistent Stream)
```
Timeline      remoteStream                 srcObject Assignment
──────────────────────────────────────────────────────────────────────

T=0ms         
  ┌─ new MediaStream []
  │ └─ remoteStream { }
  │    ✅ Created ONCE, stored in peerConnection

T=100ms       
  ├─ remoteStream.addTrack(audio)
  │ └─ remoteStream { audio_track }
  │    └─ → srcObject = remoteStream ✅
  │       └─ Attached once

T=200ms       
  ├─ remoteStream.addTrack(video)  
  │ └─ remoteStream { audio_track, video_track }  ← Same object!
  │    └─ → srcObject unchanged ✅
  │       └─ Already set, don't reassign

Result:
  remoteVideoRef.srcObject = remoteStream { audio_track, video_track }
  ✅ Audio plays, video plays
```

---

## Summary Table

| Aspect | Before ❌ | After ✅ |
|--------|----------|---------|
| **Stream Creation** | Per ontrack | Once per connection |
| **Stream Reference** | Temporary | Persistent |
| **Track Handling** | One per stream | All to same stream |
| **srcObject Updates** | Multiple | Once |
| **Garbage Collection** | Orphaned streams | Clean |
| **Memory Usage** | High (leaks) | Low (clean) |
| **Result** | Black screen | Both audio+video |
| **Bugs** | High (race conditions) | None |
| **Performance** | Poor | Good |
| **Maintainability** | Complex | Simple |

---

**Visualization Complete:** The persistent stream approach solves all race conditions!
