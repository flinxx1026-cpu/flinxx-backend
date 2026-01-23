import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

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
  withCredentials: true,
  upgrade: true,
  rememberUpgrade: false,
  multiplex: true,
  timeout: 60000,
  extraHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true'
  }
})

socket.on('connect', () => {
  console.log('✅ Socket connected successfully! ID:', socket.id)
  console.log('📊 Transport method:', socket.io.engine.transport.name)
})

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message || error)
  console.error('📍 Error details:', error)
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

// ✅ HANDLE FORCE LOGOUT (when user is banned)
socket.on('force_logout', () => {
  alert('You have been banned by admin')
  localStorage.clear()
  window.location.href = '/login'
})

// ✅ JOIN USER ROOM (Call this when user is authenticated)
export const joinUserRoom = (userId) => {
  console.log(`📍 Joining room for user: ${userId}`)
  socket.emit('join', userId)
}

export default socket
