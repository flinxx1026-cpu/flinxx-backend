import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { MessageProvider } from './context/MessageContext'
import { UnreadProvider } from './context/UnreadContext'
import App from './App'
import './index.css'

// Fallback runtime logger override (Vite esbuild handles primary stripping)
const originalLog = console.log;
const originalInfo = console.info;
const originalWarn = console.warn;
const originalDebug = console.debug;
const originalError = console.error;

// Lightweight redaction to avoid performance overhead in dev
const redact = (args) => {
  return args.map(arg => {
    if (typeof arg === 'string') {
      let redactedArg = arg;
      if (/token|password|secret|credential/i.test(redactedArg)) {
        redactedArg = redactedArg.replace(/(token|password|secret|credential)=[^&\s]+/gi, '$1=[REDACTED]');
      }
      return redactedArg;
    }
    // Deep JSON.stringify is too expensive for frequent socket logs.
    // Instead of deep stringifying, we just allow the object in dev for performance,
    // or do a shallow key check if needed, but dev environment is secure locally.
    // Prevention at source (which we did by removing logs) is preferred over deep runtime scanning.
    return arg; 
  });
};

// Simple remote error monitor (mimicking Sentry functionality)
const monitorError = (errorArgs) => {
  try {
    // Only send the first argument if it's an Error to avoid large payloads,
    // or stringify simple messages
    const errorPayload = errorArgs.map(arg => 
      arg instanceof Error ? { message: arg.message, stack: arg.stack } : String(arg)
    );
    
    const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : (import.meta.env.VITE_BACKEND_URL || '');
    if (BACKEND_URL) {
      // Fire-and-forget remote logging
      fetch(`${BACKEND_URL}/api/logs/error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: errorPayload, 
          timestamp: new Date().toISOString(), 
          source: 'frontend-monitor' 
        }),
        keepalive: true
      }).catch(() => {}); // silent fail
    }
  } catch (e) {
    // Ensure monitoring never crashes the app
  }
};

if (import.meta.env.MODE === 'development') {
  console.log = (...args) => originalLog(...redact(args));
  console.info = (...args) => originalInfo(...redact(args));
  console.warn = (...args) => originalWarn(...redact(args));
  console.debug = (...args) => originalDebug(...redact(args));
  console.error = (...args) => originalError(...redact(args));
} else {
  // Production
  // 1. Silence third-party SDKs that use the 'debug' module (like Socket.IO)
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.debug = '';
    }
  } catch (e) {}

  // 2. Fallback runtime no-op (primary stripping is handled natively by Vite esbuild)
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
  console.trace = () => {};
  
  // 3. Keep error but add remote monitoring
  console.error = (...args) => {
    monitorError(args);
    originalError(...redact(args));
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider 
      clientId="373922547944-gm8fgpgjebnraruomkpajoa7s3nqups0.apps.googleusercontent.com"
      onScriptProps={{
        async: true,
        defer: true,
        nonce: 'YOUR_NONCE_VALUE'
      }}
    >
      <AuthProvider>
        <UnreadProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </UnreadProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
