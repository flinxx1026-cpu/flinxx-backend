import io from 'socket.io-client'

// Determine correct socket URL based on environment
const getSocketUrl = () => {
  // If env vars are set, use them
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  // Default to localhost backend
  return import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
};

const SOCKET_URL = getSocketUrl();

let socket = null;
let isInitializing = false;

// Lazy initialization - only create socket when first accessed
const getOrCreateSocket = () => {
  if (socket) return socket;
  if (isInitializing) return null; // Prevent multiple simultaneous init attempts
  
  isInitializing = true;
  
  try {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 20,
      // Enable both websocket and polling for maximum compatibility
      transports: ['websocket', 'polling'],
      rejectUnauthorized: false,
      forceNew: false,
      withCredentials: true,
      upgrade: true,  // Allow upgrading from polling to websocket
      rememberUpgrade: false,
      multiplex: true,
      timeout: 20000,
      'sync disconnect on unload': true,
      autoConnect: true
    })

    socket.on('connect', () => {
      // Connected silently
    })

    socket.on('connect_error', (error) => {
      // Connection errors are expected during reconnection — no logging needed
    })

    socket.on('error', (error) => {
      // Socket errors handled silently
    })

    socket.on('disconnect', (reason) => {
      // Disconnection handled silently
    })

    socket.on('connect_timeout', () => {
      // Timeout handled silently
    })

    // ✅ SPECIFIC LISTENER: call_ended
    socket.on('call_ended', (data) => {
      // Handled by component listeners
    });

    // ✅ HANDLE FRIEND REQUEST RECEIVED
    socket.on('friend_request_received', (data) => {
      // Handled by component listeners
    });

    // ✅ HANDLE FORCE LOGOUT (when user is banned)
    socket.on('force_logout', () => {
      alert('You have been banned by admin')
      localStorage.clear()
      window.location.href = '/login'
    })

    // ✅ HANDLE ACCOUNT WARNING
    socket.on('account_warning', (warningData) => {
      // Dispatch custom event so AuthContext can listen
      if (typeof window !== 'undefined') {
        const warningEvent = new CustomEvent('account_warning', {
          detail: warningData
        });
        window.dispatchEvent(warningEvent);
      }
    })
  } catch (err) {
    // Create a mock socket to prevent errors
    socket = {
      on: () => {},
      off: () => {},
      emit: () => {},
      onAny: () => {},
      offAny: () => {},
      id: null,
      connected: false,
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
    s.emit('join', userId)
  }
}

// ✅ Safe wrapper functions instead of Proxy to avoid minification TDZ issues
const socketWrapper = {
  on: (event, handler) => {
    const s = getOrCreateSocket();
    if (s && typeof s.on === 'function') {
      s.on(event, handler);
    }
  },
  off: (event, handler) => {
    const s = getOrCreateSocket();
    if (s && typeof s.off === 'function') {
      s.off(event, handler);
    }
  },
  emit: (event, ...args) => {
    const s = getOrCreateSocket();
    if (s && typeof s.emit === 'function') {
      s.emit(event, ...args);
    }
  },
  onAny: (handler) => {
    const s = getOrCreateSocket();
    if (s && typeof s.onAny === 'function') {
      s.onAny(handler);
    }
  },
  offAny: (handler) => {
    const s = getOrCreateSocket();
    if (s && typeof s.offAny === 'function') {
      s.offAny(handler);
    }
  },
  get id() {
    const s = getOrCreateSocket();
    return s ? s.id : null;
  },
  get io() {
    const s = getOrCreateSocket();
    return s ? s.io : { engine: { transport: { name: 'mock' } } };
  },
  get connected() {
    const s = getOrCreateSocket();
    return s ? s.connected : false;
  },
  // Direct socket access for advanced use cases
  getSocket: () => getOrCreateSocket(),
  // Force initialization
  connect: () => {
    const s = getOrCreateSocket();
    return s;
  }
};

// Export as default - safe wrapper object
export default socketWrapper;
