import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { MessageProvider } from './context/MessageContext'
import { UnreadProvider } from './context/UnreadContext'
import App from './App'
import './index.css'

// =====================================================================
// PRODUCTION CONSOLE HARDENING
// Primary stripping: Vite esbuild `drop: ['console']` removes ALL calls
// This runtime override is a SECONDARY safety net for:
//   1. Third-party SDK logs (Firebase, Socket.IO use internal `debug` module)
//   2. Any dynamically-generated console calls that escape static analysis
// =====================================================================

const _originalError = console.error;

if (import.meta.env.MODE !== 'development') {
  // ── PRODUCTION ──

  // 1. Kill Socket.IO / debug module logs
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('debug');
      localStorage.debug = '';
    }
  } catch (_) {}

  // 2. Silent remote error monitor (fire-and-forget)
  const _sendToBackend = (args) => {
    try {
      const payload = args.map(a =>
        a instanceof Error ? { message: a.message, stack: a.stack } : String(a)
      );
      const url = import.meta.env.VITE_BACKEND_URL || '';
      if (url) {
        fetch(`${url}/api/logs/error`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: payload,
            timestamp: new Date().toISOString(),
            source: 'frontend'
          }),
          keepalive: true
        }).catch(() => {});
      }
    } catch (_) {}
  };

  // 3. Override ALL console methods — complete silence
  const _noop = () => {};
  console.log = _noop;
  console.info = _noop;
  console.warn = _noop;
  console.debug = _noop;
  console.trace = _noop;
  console.dir = _noop;
  console.dirxml = _noop;
  console.table = _noop;
  console.group = _noop;
  console.groupEnd = _noop;
  console.groupCollapsed = _noop;
  console.clear = _noop;
  console.count = _noop;
  console.countReset = _noop;
  console.time = _noop;
  console.timeEnd = _noop;
  console.timeLog = _noop;

  // 4. console.error → filter SDK noise, forward only critical errors silently
  //    Third-party SDKs (Firebase, Socket.IO, Cashfree) call console.error internally.
  //    We suppress known SDK noise and only report genuine app errors to backend.
  const _sdkNoisePatterns = [
    /firebase/i, /firestore/i, /auth\//i,
    /socket\.io/i, /websocket/i, /polling/i, /engine\.io/i,
    /cashfree/i, /sdk/i,
    /webrtc/i, /rtc/i, /ice/i, /stun/i, /turn/i,
    /ERR_BLOCKED/i, /net::ERR/i,
    /ResizeObserver/i,
    /Loading chunk/i, /dynamically imported module/i,
  ];

  console.error = (...args) => {
    // Check if this is SDK noise
    const msg = args.map(a => (a instanceof Error ? a.message : String(a))).join(' ');
    const isSDKNoise = _sdkNoisePatterns.some(p => p.test(msg));
    if (!isSDKNoise) {
      _sendToBackend(args);
    }
  };

} else {
  // ── DEVELOPMENT ──
  // Lightweight sensitive-data redaction for local debugging
  const _origLog = console.log;
  const _origInfo = console.info;
  const _origWarn = console.warn;
  const _origDebug = console.debug;

  const _redact = (args) =>
    args.map(arg => {
      if (typeof arg === 'string') {
        return arg.replace(/(token|password|secret|credential)=[^\s&]+/gi, '$1=[REDACTED]');
      }
      return arg;
    });

  console.log = (...args) => _origLog(..._redact(args));
  console.info = (...args) => _origInfo(..._redact(args));
  console.warn = (...args) => _origWarn(..._redact(args));
  console.debug = (...args) => _origDebug(..._redact(args));
  console.error = (...args) => _originalError(..._redact(args));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider 
      clientId="373922547944-gm8fgpgjebnraruomkpajoa7s3nqups0.apps.googleusercontent.com"
      onScriptProps={{
        async: true,
        defer: true,
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
