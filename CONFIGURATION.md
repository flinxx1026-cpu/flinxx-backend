# Configuration Reference Guide

## Environment Variables

### Frontend Configuration

**File**: `frontend/.env.local`

```env
# Socket.IO Server URL
# Development: http://localhost:5000
# Production: https://your-backend-domain.com
VITE_SOCKET_URL=http://localhost:5000

# Video Quality (optional)
# VITE_VIDEO_WIDTH=1280
# VITE_VIDEO_HEIGHT=720

# Debug Mode (optional)
# VITE_DEBUG=true
```

### Backend Configuration

**File**: `backend/.env`

```env
# Server Port (default: 5000)
PORT=5000

# Client URL for CORS (important!)
# Development: http://localhost:3000
# Production: https://your-frontend-domain.com
CLIENT_URL=http://localhost:3000

# Environment (development or production)
NODE_ENV=development

# Optional: Redis URL for scaling
# REDIS_URL=redis://localhost:6379

# Optional: Database URL for persistence
# DATABASE_URL=postgresql://user:pass@localhost/flinxx

# Optional: Sentry Error Tracking
# SENTRY_DSN=https://key@sentry.io/project

# Optional: Analytics
# ANALYTICS_KEY=your-key
```

---

## Vite Configuration

**File**: `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    target: 'esnext',
    sourcemap: false  // Set to true in dev
  }
})
```

### Customization Options

```javascript
// Change default port
server: {
  port: 3001  // Instead of 3000
}

// Enable source maps for debugging
build: {
  sourcemap: true
}

// Change build target
build: {
  target: 'es2020'  // Or 'esnext'
}

// Optimize bundle
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'webrtc': ['socket.io-client'],
        'react-vendor': ['react', 'react-dom']
      }
    }
  }
}
```

---

## Tailwind CSS Configuration

**File**: `frontend/tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6366f1',      // Indigo
        'secondary': '#8b5cf6',    // Purple
        'dark': '#0f172a',         // Dark blue
        'darker': '#020617',       // Almost black
      },
      // Add custom animations
      animation: {
        'pulse-ring': 'pulse-ring 2s infinite'
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        }
      }
    },
  },
  plugins: [],
}
```

### Color Customization

```javascript
theme: {
  colors: {
    // Primary colors
    'primary': '#6366f1',      // Change button colors
    'secondary': '#8b5cf6',    // Change accent colors
    
    // Background colors  
    'dark': '#0f172a',         // Main background
    'darker': '#020617',       // Darker background
    
    // Custom colors
    'brand': '#YourColor',
    'success': '#10b981',
    'danger': '#ef4444',
    'warning': '#f59e0b'
  }
}
```

---

## Express Server Configuration

**File**: `backend/server.js` - Top Section

```javascript
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// CORS Configuration
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
})

// Optional: Socket.IO Settings
io.set('transports', ['websocket', 'polling'])
io.set('ping interval', 25000)
io.set('ping timeout', 60000)
```

### Adding Redis Adapter (Scaling)

```javascript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({
  host: 'localhost',
  port: 6379
})

const subClient = pubClient.duplicate()
await Promise.all([pubClient.connect(), subClient.connect()])

io.adapter(createAdapter(pubClient, subClient))
```

---

## Docker Configuration

### Backend Dockerfile

**File**: `backend/Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Set environment
ENV PORT=5000
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
```

### Frontend Dockerfile

**File**: `frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - CLIENT_URL=http://localhost:3000
      - NODE_ENV=development
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_SOCKET_URL=http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev
    depends_on:
      - backend
```

---

## WebRTC Configuration

### ICE Servers

In `frontend/src/utils/webrtcUtils.js`:

```javascript
export const getIceServers = () => {
  return {
    iceServers: [
      // Google Public STUN (free)
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      
      // Twilio TURN (requires account)
      // {
      //   urls: 'turn:twilio.example.com',
      //   username: 'username',
      //   credential: 'credential'
      // }
    ]
  }
}
```

### Media Constraints

In `frontend/src/utils/webrtcUtils.js`:

```javascript
export const getMediaConstraints = () => {
  return {
    video: {
      width: { ideal: 1280 },      // Change resolution
      height: { ideal: 720 },
      frameRate: { ideal: 30 }     // Change frame rate
    },
    audio: {
      echoCancellation: true,       // Remove echo
      noiseSuppression: true,       // Reduce noise
      autoGainControl: true         // Auto volume
    }
  }
}
```

---

## WebRTC Connection Configuration

In `frontend/src/pages/Chat.jsx`:

```javascript
const peerConnectionConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Add more STUN/TURN servers as needed
  ],
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
}

const peerConnection = new RTCPeerConnection(peerConnectionConfig)
```

---

## TypeScript Configuration (Optional)

If adding TypeScript support, create `frontend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "noEmit": true,
    "noImplicitAny": false
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Linting & Formatting (Optional)

### ESLint Configuration

Create `frontend/.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
}
```

### Prettier Configuration

Create `frontend/.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "arrowParens": "avoid"
}
```

---

## Git Configuration

**File**: `.gitignore`

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*

# Build outputs
dist/
build/
.next/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
```

---

## Production Deployment Environment

### Example Railway Configuration

```env
# Railway Environment Variables
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
```

### Example Vercel Configuration

```json
{
  "env": {
    "VITE_SOCKET_URL": "https://your-backend.railway.app"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## Performance Tuning

### Frontend Optimization

```javascript
// vite.config.js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true  // Remove console logs in production
    }
  },
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'socket.io-client']
      }
    }
  }
}
```

### Backend Optimization

```javascript
// server.js
app.use(compression())  // Gzip compression
app.use(helmet())       // Security headers

// Connection timeout
io.engine.pingInterval = 25000
io.engine.pingTimeout = 60000
```

---

## Security Headers (Production)

Add to `backend/server.js`:

```javascript
import helmet from 'helmet'

// Security headers
app.use(helmet())

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST']
}))

// HTTPS redirect
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url)
  }
  next()
})
```

---

## Monitoring Configuration

### Error Tracking (Sentry)

```javascript
// frontend - Add to main.jsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: import.meta.env.MODE
})
```

### Analytics (Google Analytics)

Add to `frontend/index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || []
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date())
  gtag('config', 'GA_ID')
</script>
```

---

## Testing Configuration

### Jest for Unit Tests

```json
{
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"],
  "moduleNameMapper": {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
}
```

---

**Last Updated**: November 26, 2024

This guide covers all major configuration points. For additional configurations, refer to:
- Vite docs: https://vitejs.dev/config/
- Tailwind docs: https://tailwindcss.com/docs/configuration
- Socket.IO docs: https://socket.io/docs/v4/server-initialization/
