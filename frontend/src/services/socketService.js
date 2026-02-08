import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

let socket = null;
let isInitializing = false;

// Lazy initialization - only create socket when first accessed
const getOrCreateSocket = () => {
  if (socket) return socket;
  if (isInitializing) return null; // Prevent multiple simultaneous init attempts
  
  isInitializing = true;
  
  try {
    console.log('🔌 Socket.IO connecting to:', SOCKET_URL)
    
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      forceNew: false,
      withCredentials: true,
      upgrade: false,
      rememberUpgrade: false,
      multiplex: true,
      timeout: 60000
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully! ID:', socket.id)
      console.log('📊 Transport method:', socket.io.engine.transport.name)
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message || error)
      console.error('📍 Error details:', error)
      if (socket?.io?.engine?.transport?.name === 'polling') {
        console.log('🔄 Retrying with websocket...')
      }
    })

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Socket disconnected. Reason:', reason)
      console.log('🔄 Attempting to reconnect...')
    })

    socket.on('connect_timeout', () => {
      console.error('⏱️ Socket connection timeout')
    })

    // ✅ HANDLE FORCE LOGOUT (when user is banned)
    socket.on('force_logout', () => {
      alert('You have been banned by admin')
      localStorage.clear()
      window.location.href = '/login'
    })
  } catch (err) {
    console.error('❌ Socket.IO initialization error:', err)
    // Create a mock socket to prevent errors
    socket = {
      on: () => {},
      off: () => {},
      emit: () => {},
      id: null,
      io: { engine: { transport: { name: 'mock' } } }
    }
  }
  
  isInitializing = false;
  return socket;
};

// ✅ JOIN USER ROOM (Call this when user is authenticated)
export const joinUserRoom = (userId) => {
  const s = getOrCreateSocket();
  if (s) {
    console.log(`📍 Joining room for user: ${userId}`)
    s.emit('join', userId)
  }
}

// Export as default - will lazily initialize on first access
export default new Proxy({}, {
  get: (target, prop) => {
    const s = getOrCreateSocket();
    return s ? s[prop] : (() => {})
  }
})
