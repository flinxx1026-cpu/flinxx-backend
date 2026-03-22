# Deployment Guide

## Quick Start with Docker

### Using Docker Compose (Recommended)

1. Install Docker and Docker Compose
2. Navigate to project root:
```bash
cd flinxx
```

3. Build and start all services:
```bash
docker-compose up --build
```

4. Access:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Production Deployment

### Frontend Deployment (Vercel, Netlify, or similar)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Set environment variable:
```
VITE_SOCKET_URL=https://your-backend-domain.com
```

### Backend Deployment (Railway, Heroku, AWS, DigitalOcean, etc.)

1. Create a new application on your hosting service
2. Set environment variables:
```
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

3. Deploy the backend folder
4. Your service provider will run `npm install` and `npm start`

## Deployment Checklist

- [ ] Set correct CORS URL in backend
- [ ] Set correct Socket.IO URL in frontend env
- [ ] Enable HTTPS for WebRTC (required in production)
- [ ] Configure STUN/TURN servers for NAT traversal
- [ ] Set up SSL/TLS certificates
- [ ] Monitor server logs and errors
- [ ] Set up backup and recovery procedures
- [ ] Configure rate limiting
- [ ] Add logging and monitoring
- [ ] Test WebRTC connection in production

## STUN/TURN Configuration

For production with users behind NAT/firewalls, update `backend/server.js`:

```javascript
const iceServers = {
  iceServers: [
    // Google Public STUN
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    
    // Twilio TURN (requires credentials)
    {
      urls: 'turn:your-turn-server.com',
      username: 'your-username',
      credential: 'your-credential'
    }
  ]
}
```

## Monitoring and Logging

### Backend Logging
```javascript
// Add to server.js for better logging
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

### Frontend Error Tracking
Add error boundary and error reporting service (Sentry, LogRocket, etc.)

## Performance Optimization

### Frontend
- Lazy load components
- Optimize images
- Code splitting with Vite
- Minimize bundle size

### Backend
- Connection pooling
- Caching strategies
- Load balancing with multiple instances
- Database indexing (if using database)

## Security Considerations

1. **HTTPS Only** - Always use HTTPS in production
2. **CORS** - Properly configure allowed origins
3. **Rate Limiting** - Prevent abuse
4. **Input Validation** - Validate all user inputs
5. **Content Security Policy** - Set CSP headers
6. **CSRF Protection** - Implement CSRF tokens if needed

## Scaling Strategy

### Horizontal Scaling

For multiple backend instances:

1. Use a load balancer (nginx, HAProxy)
2. Use Redis for Socket.IO adapter:
```javascript
import { createAdapter } from '@socket.io/redis-adapter'

io.adapter(createAdapter(pubClient, subClient))
```

3. Share session state across servers

### Database (If Adding Features)

- Use PostgreSQL or MongoDB
- Implement connection pooling
- Set up replication for HA

## Troubleshooting Deployment

### WebRTC Not Working
- Verify STUN/TURN servers
- Check firewall rules
- Test in Chrome DevTools chrome://webrtc-internals

### Socket.IO Connection Issues
- Check CORS configuration
- Verify frontend/backend URL matching
- Check for proxy issues (nginx, CloudFlare)
- Enable Socket.IO debug logging

### Slow Performance
- Check network bandwidth
- Monitor CPU/memory usage
- Optimize video codec
- Reduce video resolution

## Further Resources

- [WebRTC Best Practices](https://webrtc.org/)
- [Socket.IO Deployment](https://socket.io/docs/v4/deployment/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-application-deployment/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
