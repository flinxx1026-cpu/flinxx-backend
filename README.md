# Flinxx - Premium Video Chat Application

A modern, premium-looking anonymous video chat application built with React, Tailwind CSS, Node.js, Express, WebSocket, and WebRTC.

## Features

✅ **HD Video Chat** - Crystal clear 720p video quality
✅ **Anonymous & Secure** - Complete privacy, no registration required
✅ **Instant Matching** - Connect with strangers in seconds
✅ **WebRTC P2P** - Peer-to-peer connection for low latency
✅ **Real-time Controls** - Mute audio, turn off video, skip users
✅ **Premium UI** - Modern gradient design with smooth animations
✅ **Mobile Responsive** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Peer-to-peer video/audio

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **UUID** - Unique ID generation

## Project Structure

```
flinxx/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Landing page
│   │   │   └── Chat.jsx      # Video chat interface
│   │   ├── services/
│   │   │   └── socketService.js  # Socket.IO client
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # App styles
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── postcss.config.js     # PostCSS configuration
│   └── package.json          # Dependencies
│
└── backend/
    ├── server.js             # Express server & Socket.IO
    ├── .env                  # Environment variables
    └── package.json          # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
VITE_SOCKET_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```
Application runs on `http://localhost:3000`

## How It Works

### User Connection Flow

1. **User Connects** - User visits the home page and clicks "Start Video Chat"
2. **WebRTC Initialization** - Application requests camera & microphone access
3. **Matching** - Server finds an available partner from waiting queue
4. **Peer Connection** - WebRTC establishes P2P connection via offer/answer
5. **Video Chat** - Users can now see and hear each other
6. **Controls** - Users can toggle video/audio or skip to next partner
7. **Disconnect** - Connection closes when either user disconnects

### Matchmaking Algorithm

- Users are added to a waiting queue when they request a partner
- First user in queue is matched with new incoming user
- If no one is waiting, new user joins the queue
- Matched users are notified via Socket.IO events

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Statistics
- `GET /api/stats` - Get server statistics
  - activeUsers: Number of connected users
  - activeSessions: Number of active chat sessions
  - waitingUsers: Users in matching queue

## WebSocket Events

### Client → Server
- `find_partner` - Find a chat partner
- `webrtc_offer` - Send WebRTC offer
- `webrtc_answer` - Send WebRTC answer
- `ice_candidate` - Send ICE candidate
- `skip_user` - Skip current partner and find new one

### Server → Client
- `user_registered` - User successfully registered
- `waiting` - Waiting for a partner
- `partner_found` - Partner found, ready to connect
- `webrtc_offer` - Receive WebRTC offer
- `webrtc_answer` - Receive WebRTC answer
- `ice_candidate` - Receive ICE candidate
- `user_skipped` - Partner skipped you
- `partner_disconnected` - Partner disconnected

## Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (.env.local)**
```
VITE_SOCKET_URL=http://localhost:5000
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development (with auto-reload)
```bash
cd backend
npm run dev  # Requires nodemon
```

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

## Features to Add (Future)

- [ ] Text chat alongside video
- [ ] Screen sharing
- [ ] Chat history
- [ ] User profiles with interests/tags
- [ ] Reporting & moderation
- [ ] Analytics dashboard
- [ ] Browser notifications
- [ ] Reconnection handling
- [ ] Video recording
- [ ] Filters & effects

## Security Considerations

- All connections are P2P (except for matching)
- No user data is stored
- Anonymous by default
- CORS configuration in production
- Rate limiting for API endpoints
- User session timeouts

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari (iOS 11+)
- Edge

## Troubleshooting

### Camera/Microphone Access Issues
- Ensure HTTPS in production (WebRTC requires secure context)
- Check browser permissions
- Verify getUserMedia support

### Connection Issues
- Check firewall settings
- Verify Socket.IO connection
- Check CORS configuration
- Verify both frontend and backend URLs

### Performance Issues
- Monitor WebRTC stats
- Check network bandwidth
- Reduce video resolution if needed
- Check for CPU-intensive operations

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ - Flinxx Video Chat**
