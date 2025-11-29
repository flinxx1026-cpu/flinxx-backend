# 🚀 QUICK START GUIDE - Flinxx

## Get Started in 5 Minutes

### Prerequisites
- Node.js v16+ installed
- npm installed
- A modern web browser (Chrome, Firefox, Safari, Edge)

---

## Method 1: Local Development (Easiest)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start Backend Server

In terminal 1:
```bash
cd backend
npm start
```

You should see:
```
🚀 Flinxx Server running on port 5000
```

### Step 3: Start Frontend Server

In terminal 2:
```bash
cd frontend
npm run dev
```

You should see:
```
Local:  http://localhost:3000
```

### Step 4: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Start Video Chat"
3. Allow camera & microphone access
4. Open another browser tab and repeat steps 2-3
5. Both should match and see each other's video!

---

## Method 2: Docker (One Command)

### Prerequisites
- Docker and Docker Compose installed

### Start Everything
```bash
docker-compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Method 3: Production Deployment

### Deploy Backend

Choose one of these platforms:

**Railway** (Recommended for beginners)
1. Go to https://railway.app
2. Create new project
3. Deploy from GitHub
4. Set environment variables:
   - `PORT=5000`
   - `CLIENT_URL=https://your-frontend-url.com`

**Heroku**
```bash
cd backend
heroku create your-app-name
git push heroku main
```

**AWS/DigitalOcean/Linode**
- Follow platform-specific deployment guides
- Upload backend folder
- Install dependencies
- Set environment variables
- Start with `npm start`

### Deploy Frontend

**Vercel** (Easiest for React)
1. Go to https://vercel.com
2. Connect GitHub repository
3. Set environment variable:
   - `VITE_SOCKET_URL=https://your-backend-url.com`
4. Deploy!

**Netlify**
1. Go to https://netlify.com
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_SOCKET_URL=...`

---

## Configuration

### Frontend Environment Variables

Create `frontend/.env.local`:
```
VITE_SOCKET_URL=http://localhost:5000
```

For production:
```
VITE_SOCKET_URL=https://your-backend-domain.com
```

### Backend Environment Variables

Edit `backend/.env`:
```
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

For production:
```
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

---

## Troubleshooting

### "Cannot GET /chat"
- Make sure both frontend and backend are running
- Backend should be on port 5000
- Frontend should be on port 3000

### Camera/Microphone Not Working
- Check browser permissions
- Grant camera & microphone access when prompted
- Try incognito/private window
- Works best on HTTPS in production

### No Connection Between Users
- Make sure both tabs are on same network
- Check browser console for errors
- Verify SOCKET_URL is correct
- Try refreshing the page

### Backend Running But Frontend Can't Connect
- Check that backend is really running on port 5000
- Check `VITE_SOCKET_URL` in frontend `.env.local`
- Check browser console for connection errors
- Make sure CORS is configured correctly

### "npm: command not found"
- Install Node.js from https://nodejs.org
- Restart terminal after installation

### Slow Video/Audio Lag
- Check your internet connection
- Reduce video resolution in settings
- Close other applications using bandwidth
- Try different browser

---

## Next Steps

### Customize the Design
- Edit `frontend/src/pages/Home.jsx` for landing page
- Edit `frontend/src/pages/Chat.jsx` for chat interface
- Edit `frontend/tailwind.config.js` for colors

### Add Features
- Text chat: See `DEVELOPMENT.md`
- Screen sharing: Add WebRTC screen capture
- Chat history: Add database
- User profiles: Add authentication

### Deploy to Production
- Follow steps in `DEPLOYMENT.md`
- Set up proper domains
- Enable HTTPS
- Configure STUN/TURN servers

---

## Project Structure

```
flinxx/
├── frontend/              # React + Tailwind app
│   ├── src/
│   │   ├── pages/        # Home and Chat pages
│   │   ├── components/   # Reusable components
│   │   ├── services/     # Socket.IO client
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main component
│   └── package.json
│
├── backend/              # Node.js + Express server
│   ├── server.js         # Main server file
│   ├── .env              # Environment variables
│   └── package.json
│
├── README.md             # Full documentation
├── DEVELOPMENT.md        # Development guide
└── DEPLOYMENT.md         # Deployment guide
```

---

## Commands Reference

### Backend Commands
```bash
npm install              # Install dependencies
npm start               # Start server
npm run dev             # Start with auto-reload (needs nodemon)
```

### Frontend Commands
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

### Docker Commands
```bash
docker-compose up       # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
```

---

## API Endpoints

- `GET /api/health` - Check server status
- `GET /api/stats` - Get server statistics

## Socket.IO Events

### Client Emits
- `find_partner` - Find a chat partner
- `webrtc_offer` - Send WebRTC offer
- `webrtc_answer` - Send WebRTC answer
- `ice_candidate` - Send ICE candidate
- `skip_user` - Skip current partner

### Client Receives
- `user_registered` - Registration successful
- `waiting` - Waiting for partner
- `partner_found` - Partner found!
- `webrtc_offer` - Receive offer
- `webrtc_answer` - Receive answer
- `ice_candidate` - Receive ICE candidate
- `user_skipped` - Partner skipped
- `partner_disconnected` - Partner left

---

## Support & Help

### Common Issues
1. **Can't find partner** - Open second browser tab and try again
2. **No video** - Check browser permissions and allow camera
3. **Connection errors** - Check console logs and backend status
4. **Slow performance** - Close other tabs and applications

### Debugging
- Check browser console: F12 → Console tab
- Check backend logs: Terminal where you ran `npm start`
- Check network tab: F12 → Network tab

### Getting Help
- Check `DEVELOPMENT.md` for detailed setup
- Check `DEPLOYMENT.md` for production issues
- Review `README.md` for complete documentation

---

## Tips for Best Experience

✅ Use a wired internet connection
✅ Allow camera and microphone permissions
✅ Use a modern browser (Chrome recommended)
✅ Close other bandwidth-heavy applications
✅ Test with another person on same network first
✅ For production, use HTTPS

---

**Happy Coding! 🎉**

**Questions?** Check the documentation files or review the code comments.
