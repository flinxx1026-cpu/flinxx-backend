import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

console.log('🔌 Socket.IO connecting to:', SOCKET_URL)

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  transports: ['websocket', 'polling'],
  secure: false,
  rejectUnauthorized: false,
  forceNew: false,
  withCredentials: false,
  // Add these to ensure proper connection
  upgrade: true,
  rememberUpgrade: false,
  multiplex: true,
  // Increase timeout
  timeout: 60000,
  // Add headers if needed
  extraHeaders: {
    'Access-Control-Allow-Origin': '*'
  }
})

socket.on('connect', () => {
  console.log('✅ Socket connected successfully! ID:', socket.id)
  console.log('📊 Transport method:', socket.io.engine.transport.name)
})

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message || error)
  console.error('📍 Error details:', error)
  // Try websocket if polling fails
  if (socket.io.engine.transport.name === 'polling') {
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

export default socket
