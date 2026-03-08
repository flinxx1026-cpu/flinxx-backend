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
  return 'http://localhost:5000';
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
    console.log('🔌 Socket.IO attempting connection...');
    console.log('🔌 Target URL:', SOCKET_URL);
    
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 20,
      // Enable both websocket and polling for maximum compatibility
      transports: ['websocket', 'polling'],
      secure: false,  // Use http:// protocol, not https://
      rejectUnauthorized: false,
      forceNew: false,
      withCredentials: true,
      upgrade: true,  // Allow upgrading from polling to websocket
      rememberUpgrade: false,
      multiplex: true,
      timeout: 20000,
      // Additional socket.io options
      'sync disconnect on unload': true,
      autoConnect: true
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully! ID:', socket.id)
      console.log('📊 Transport:', socket.io.engine.transport.name)
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
    
    // 🔍 DEBUG: Log all unhandled events
    socket.onAny((eventName, ...args) => {
      if (!['connect', 'disconnect', 'ping', 'pong'].includes(eventName)) {
        if (eventName === 'call_ended') {
          console.log(`🎯🎯🎯 [socketService] RECEIVED call_ended EVENT! 🎯🎯🎯`, args);
        } else {
          console.log(`🎯 [socketService DEBUG] Event: "${eventName}"`, args);
        }
      }
    });

    // ✅ SPECIFIC LISTENER: call_ended - to catch and log
    socket.on('call_ended', (data) => {
      console.log('🔔 [socketService] call_ended listener triggered directly');
      console.log('📦 Data:', data);
    });

    // ✅ HANDLE FRIEND REQUEST RECEIVED - Debug handler
    socket.on('friend_request_received', (data) => {
      console.log('🔥🔥🔥 [socketService] FRIEND REQUEST EVENT RECEIVED 🔥🔥🔥');
      console.log('📦 Data:', data);
      console.log('🔥🔥🔥 Event will now bubble to all AuthContext listeners 🔥🔥🔥');
    });

    // ✅ HANDLE FORCE LOGOUT (when user is banned)
    socket.on('force_logout', () => {
      alert('You have been banned by admin')
      localStorage.clear()
      window.location.href = '/login'
    })

    // ✅ HANDLE ACCOUNT WARNING
    socket.on('account_warning', (warningData) => {
      console.log('🚨 [socketService] ACCOUNT WARNING EVENT RECEIVED 🚨');
      console.log('📦 Warning data:', warningData);
      
      // Dispatch custom event so AuthContext can listen
      if (typeof window !== 'undefined') {
        const warningEvent = new CustomEvent('account_warning', {
          detail: warningData
        });
        window.dispatchEvent(warningEvent);
        console.log('✅ [socketService] Window event dispatched for account_warning');
      }
    })
  } catch (err) {
    console.error('❌ Socket.IO initialization error:', err)
    console.error('❌ Error message:', err.message)
    console.error('❌ Error stack:', err.stack)
    console.error('❌ Falling back to mock socket')
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
    console.log(`📍 Joining room for user: ${userId}`)
    s.emit('join', userId)
  }
}

// ✅ Safe wrapper functions instead of Proxy to avoid minification TDZ issues
const socketWrapper = {
  on: (event, handler) => {
    const s = getOrCreateSocket();
    if (s && typeof s.on === 'function') {
      console.log(`🔌 [socketWrapper] Attaching listener for event: "${event}"`);
      s.on(event, handler);
      console.log(`✅ [socketWrapper] Listener attached for: "${event}"`);
    } else {
      console.warn(`⚠️ [socketWrapper] Cannot attach listener for "${event}" - socket not available`);
    }
  },
  off: (event, handler) => {
    const s = getOrCreateSocket();
    if (s && typeof s.off === 'function') {
      console.log(`🔌 [socketWrapper] Detaching listener for event: "${event}"`);
      s.off(event, handler);
    }
  },
  emit: (event, ...args) => {
    const s = getOrCreateSocket();
    if (s && typeof s.emit === 'function') {
      console.log(`📤 [socketWrapper] Emitting event: "${event}"`);
      s.emit(event, ...args);
      console.log(`✅ [socketWrapper] Event emitted: "${event}"`);
    }
  },
  onAny: (handler) => {
    const s = getOrCreateSocket();
    if (s && typeof s.onAny === 'function') {
      console.log(`🔌 [socketWrapper] Attaching universal event listener`);
      s.onAny(handler);
      console.log(`✅ [socketWrapper] Universal listener attached`);
    } else if (s) {
      console.warn('⚠️ Socket.IO onAny() not available - universal event listener may not work');
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
    console.log('🔌 [socketService] connect() called, socket state:', {
      exists: !!s,
      isConnected: s?.connected || false,
      id: s?.id || null,
      isMock: !s?.io?.engine
    });
    return s;
  }
};

// Export as default - safe wrapper object
export default socketWrapper;
