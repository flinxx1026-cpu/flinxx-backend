import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { MessageProvider } from './context/MessageContext'
import { UnreadProvider } from './context/UnreadContext'
import App from './App'
import './index.css'

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
