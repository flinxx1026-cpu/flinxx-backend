# Development Notes

## Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Key Components

### Home.jsx
- Landing page with call-to-action
- Features showcase
- Animated background
- Start chat button

### Chat.jsx
- Main video chat interface
- Local and remote video streams
- Control buttons (video, audio, skip)
- Connection status display
- Responsive grid layout

### socketService.js
- Socket.IO client initialization
- Handles connection to backend
- Configures reconnection logic

### server.js (Backend)
- Express HTTP server
- Socket.IO WebSocket server
- User management
- Matchmaking queue
- WebRTC signaling

## WebRTC Flow

1. User allows camera/mic access
2. Local stream is created and displayed
3. User clicks "Start Video Chat"
4. Sent to matchmaking queue via Socket.IO
5. When partner found, both emit `partner_found` event
6. User A creates WebRTC offer
7. User B receives offer, creates answer
8. Both exchange ICE candidates
9. P2P connection established
10. Video streams flow directly between peers

## Socket.IO Events Implementation

Add these to Chat.jsx component:

```javascript
// Find partner
socket.emit('find_partner')

// Send WebRTC offer
socket.on('partner_found', async () => {
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  socket.emit('webrtc_offer', { offer })
})

// Handle WebRTC answer
socket.on('webrtc_answer', async (data) => {
  const answer = new RTCSessionDescription(data.answer)
  await peerConnection.setRemoteDescription(answer)
})

// Handle ICE candidates
socket.on('ice_candidate', (data) => {
  const candidate = new RTCIceCandidate(data.candidate)
  peerConnection.addIceCandidate(candidate)
})
```

## Browser Testing

- Open http://localhost:3000 in two different browser windows
- Click "Start Video Chat" in both
- Allow camera/microphone access
- Both should be matched and see each other's video

## Debugging WebRTC

Chrome DevTools:
1. Go to `chrome://webrtc-internals`
2. See connection stats
3. View ICE candidates
4. Check video codec

## Production Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to static hosting (Vercel, Netlify, etc.)
```

### Backend
- Deploy to Node.js hosting (Heroku, Railway, AWS, DigitalOcean, etc.)
- Set environment variables in production
- Ensure HTTPS for secure WebRTC
- Configure CORS with production domain
- Use proper STUN/TURN servers for NAT traversal

## Future Enhancements

1. Add text chat feature alongside video
2. Implement chat history storage
3. Add user filtering by interests
4. Screen sharing capability
5. Video recording
6. Sound effects and notifications
7. Admin dashboard
8. User reporting and moderation
9. Performance analytics
10. Mobile app with React Native

## Common Issues & Solutions

### WebRTC not working
- Ensure both users are on same network or have proper STUN servers
- Check Chrome DevTools for connection issues
- Verify firewall isn't blocking connections

### Audio/Video not showing
- Check browser permissions
- Ensure getUserMedia is working
- Verify stream is being added to peer connection

### Matching not working
- Check Socket.IO is connected
- Verify backend is running
- Check browser console for errors
- Verify CORS configuration

### Performance issues
- Reduce video resolution
- Lower frame rate
- Check CPU usage
- Monitor network bandwidth
