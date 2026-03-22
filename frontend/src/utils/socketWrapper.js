import { io } from "socket.io-client";

let socket = null;

export const socketWrapper = (() => {
  if (!socket) {
    // Determine socket URL from environment or use localhost:5000
    const socketUrl = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL);
    
    console.log("🔌 [socketWrapper] Connecting to:", socketUrl);
    
    socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 15
    });
    
    socket.on("connect", () => {
      console.log("✅ [socketWrapper] Connected! Socket ID:", socket.id);
    });
    
    socket.on("connect_error", (error) => {
      console.error("❌ [socketWrapper] Connection error:", error);
    });
  }
  return socket;
})();
