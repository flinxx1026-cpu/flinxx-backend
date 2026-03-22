import React, { createContext, useState, useEffect, useContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { getSentRequests, getNotifications, markPremiumPopupAsSeen as markPremiumPopupSeenApi } from '../services/api'
import socketWrapper from '../services/socketService'

// Create Auth Context
export const AuthContext = createContext()

// ✅ Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPending, setAuthPending] = useState(false)
  
  // ✅ SENT REQUESTS in AuthContext (requests sent BY user, for SearchFriendsModal)
  // Incoming requests are handled ONLY via socket event to incomingFriendRequest
  const [sentRequests, setSentRequests] = useState([])
  
  // ✅ INCOMING REQUESTS - Persistent list for badge count (polling every 5 seconds)
  const [incomingRequests, setIncomingRequests] = useState(() => {
    // 💚 Load from cache immediately for instant badge display
    try {
      const cached = localStorage.getItem('cachedIncomingRequests');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  })
  
  // ✅ GLOBAL FRIEND REQUEST STATE - Popup visible on ANY screen
  const [incomingFriendRequest, setIncomingFriendRequest] = useState(null)
  
  // ✅ GLOBAL INCOMING CALL STATE - Available on any screen
  const [incomingCall, setIncomingCall] = useState(null)
  
  // ✅ DIRECT CALL STATE - For direct user-to-user calls with IncomingCallScreen
  const [callType, setCallType] = useState(null) // 'direct' or null
  const [directCallData, setDirectCallData] = useState(null)
  
  // ✅ GLOBAL CAMERA STREAM - Store once, reuse everywhere (no repeated permission requests)
  const [localStream, setLocalStream] = useState(null)

  // ✅ ACCOUNT WARNING STATE - Show warning modal
  const [accountWarning, setAccountWarning] = useState(() => {
    try {
      const cached = localStorage.getItem('flinx_pending_warning');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  })

  // ✅ SETUP GLOBAL SOCKET LISTENER FOR FRIEND REQUESTS
  // This runs ONCE on mount and keeps listening throughout the app lifecycle
  useEffect(() => {
    console.log('🔔 [AuthContext - useEffect 1] ATTACHING friend_request_received listener...');
    
    const handleFriendRequest = (data) => {
      console.log('🔥🔥🔥 [AuthContext - Listener] FRIEND REQUEST RECEIVED EVENT 🔥🔥🔥');
      console.log('📦 [AuthContext] Payload received:', data);
      console.log('📦 [AuthContext] Sender:', data?.senderName);
      console.log('📦 [AuthContext] Request ID:', data?.requestId);
      
      if (data?.requestId) {
        console.log('✅ [AuthContext] Setting incomingFriendRequest state with data:', data.senderName);
        setIncomingFriendRequest({
          requestId: data.requestId,
          senderId: data.senderId,
          senderPublicId: data.senderPublicId,
          senderName: data.senderName || 'User',
          senderProfileImage: data.senderProfileImage,
          createdAt: data.createdAt,
          status: data.status
        });
        console.log('✅ [AuthContext] State updated - Component should re-render NOW!');
      } else {
        console.warn('⚠️ [AuthContext] Invalid event - missing requestId:', data);
      }
    };

    // ✅ HANDLE QUICK INVITE (Profile icon flow - direct popup, NOT panel)
    const handleQuickInvite = (data) => {
      console.log('\n' + '='.repeat(80))
      console.log('🚀🚀🚀 [QUICK INVITE - RECEIVER] Socket event received 🚀🚀🚀')
      console.log('='.repeat(80))
      console.log('📦 [QUICK INVITE - RECEIVER] Payload:', data);
      console.log('📊 [QUICK INVITE - RECEIVER] Details:', {
        senderName: data?.senderName,
        senderPublicId: data?.senderPublicId?.substring(0, 8) + '...',
        timestamp: data?.timestamp,
        isQuickInvite: data?.isQuickInvite
      })
      console.log('⚠️  [QUICK INVITE - RECEIVER] IMPORTANT: This is popup-only, NOT a panel entry!')
      
      if (data?.senderPublicId) {
        console.log('✅ [QUICK INVITE - RECEIVER] Valid data - creating popup...')
        // Generate a temporary request ID for the popup (not a real database request)
        const tempRequestId = `quick-invite-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        console.log('📱 [QUICK INVITE - RECEIVER] Showing popup with ID:', tempRequestId)
        setIncomingFriendRequest({
          requestId: tempRequestId,
          senderId: data.senderId,
          senderPublicId: data.senderPublicId,
          senderName: data.senderName || 'User',
          senderProfileImage: data.senderProfileImage,
          createdAt: data.timestamp || new Date().toISOString(),
          status: 'quick-invite', // Mark as quick invite (different from pending)
          isQuickInvite: true // Flag to differentiate from regular requests
        });
        console.log('🎯 [QUICK INVITE - RECEIVER] Popup should appear NOW!')
        console.log('='.repeat(80) + '\n')
      } else {
        console.warn('⚠️ [QUICK INVITE - RECEIVER] Invalid quick invite - missing senderPublicId:', data);
      }
    };

    // Attach listeners once and keep them forever
    socketWrapper.on('friend_request_received', handleFriendRequest);
    socketWrapper.on('friend:quick-invite-received', handleQuickInvite);
    
    // ✅ GLOBAL INCOMING CALL LISTENER
    const handleIncomingCall = (data) => {
      console.log('\n' + '='.repeat(80))
      console.log('📞📞📞 [AuthContext LISTENER] INCOMING CALL EVENT RECEIVED 📞📞📞')
      console.log('='.repeat(80))
      console.log('📦 Call event received from backend')
      console.log('📦 Event data:', {
        callerId: data?.callerId?.substring(0, 8) + '...',
        callerName: data?.callerName,
        receiverId: data?.receiverId?.substring(0, 8) + '...',
        recipientName: data?.recipientName
      })
      
      if (data?.callerId && data?.receiverId) {
        console.log('✅ Valid call data - setting incomingCall state')
        setIncomingCall({
          callerId: data.callerId,
          callerName: data.callerName || 'Unknown User',
          callerProfileImage: data.callerProfileImage,
          receiverId: data.receiverId,
          recipientName: data.recipientName || 'Unknown',
          timestamp: data.timestamp || new Date().toISOString()
        })
        console.log('🔔 Incoming call popup should appear NOW!')
        console.log('='.repeat(80) + '\n')
      } else {
        console.warn('⚠️ Invalid call data:', data)
      }
    };
    
    // ✅ CALL ACCEPTED LISTENER - When receiver accepts call
    const handleCallAccepted = (data) => {
      console.log('\n' + '='.repeat(80))
      console.log('✅✅✅ [AuthContext LISTENER] CALL ACCEPTED EVENT RECEIVED ✅✅✅')
      console.log('='.repeat(80))
      console.log('📦 Call accepted event from backend')
      console.log('📦 Event data:', {
        callerId: data?.callerId?.substring(0, 8) + '...',
        receiverId: data?.receiverId?.substring(0, 8) + '...',
        callerName: data?.callerName
      })
      
      // Update directCallData to trigger IncomingCallScreen for caller
      // ⚠️ IMPORTANT: Preserve existing data (recipientName, etc) while adding callAccepted flag
      if (data?.callerId && data?.receiverId) {
        console.log('✅ Valid acceptance data - UPDATING directCallData for caller')
        console.log('   Setting callAccepted = true to show IncomingCallScreen')
        console.log('   Preserving existing directCallData fields (recipientName, etc)')
        setCallType('direct');
        setDirectCallData(prevData => ({
          ...prevData,  // ✅ Keep existing data (callerId, receiverId, recipientName, etc)
          callAccepted: true  // ✅ Just add the acceptance flag
        }))
        console.log('🎥 DirectCallData updated - IncomingCallScreen should appear for caller NOW!')
        console.log('='.repeat(80) + '\n')
      } else {
        console.warn('⚠️ Invalid acceptance data:', data)
      }
    };
    
    socketWrapper.on('incoming_call', handleIncomingCall);
    socketWrapper.on('call_accepted', handleCallAccepted);
    
    // ✅ CALL ENDED LISTENER - When either user hangs up
    const handleCallEnded = (data) => {
      console.log('\n' + '='.repeat(80))
      console.log('❌❌❌ [AuthContext LISTENER] CALL ENDED EVENT RECEIVED ❌❌❌')
      console.log('='.repeat(80))
      console.log('📦 Call ended event from backend')
      console.log('📦 Event data:', {
        callerId: data?.callerId?.substring(0, 8) + '...',
        receiverId: data?.receiverId?.substring(0, 8) + '...'
      })
      
      // ✅ AGGRESSIVELY clear all call-related states
      console.log('✅ Starting aggressive state clearing...')
      console.log('   State BEFORE: callType=' + callType + ', directCallData=' + (directCallData ? 'SET' : 'NULL') + ', incomingCall=' + (incomingCall ? 'SET' : 'NULL'))
      
      // Use setTimeout to ensure state update actually happens
      setCallType(null);
      setDirectCallData(null);
      setIncomingCall(null);
      
      console.log('   ✅ All state setters called')
      console.log('='.repeat(80) + '\n')
    };

    // ✅ Attach specific listener
    socketWrapper.on('call_ended', handleCallEnded);
    
    // ✅ ACCOUNT BANNED LISTENER
    const handleAccountBanned = () => {
      console.log('\n' + '='.repeat(80))
      console.log('❌ ❌ ❌ [AuthContext LISTENER] ACCOUNT BANNED RECEIVED ❌ ❌ ❌')
      console.log('\n' + '='.repeat(80))
      
      const banState = {
        type: 'banned',
        message: 'Your account has been permanently suspended.',
        reason: 'Violation of Community Standards'
      }
      
      setAccountWarning(banState)
      localStorage.setItem('flinx_pending_warning', JSON.stringify(banState))
      
      // ✅ Removed automatic logout - User can still read guidelines
    };

    socketWrapper.on('user_banned', handleAccountBanned);
    window.addEventListener('account_banned', handleAccountBanned);

    // ✅ ACCOUNT WARNING LISTENER - When admin sends warning to user
    const handleAccountWarning = (warningData) => {
      console.log('\n' + '='.repeat(80))
      console.log('⚠️ ⚠️ ⚠️  [AuthContext LISTENER] ACCOUNT WARNING RECEIVED ⚠️ ⚠️ ⚠️ ')
      console.log('='.repeat(80))
      console.log('📦 Warning event from backend')
      console.log('📦 Event data:', {
        type: warningData?.type,
        warningCount: warningData?.warningCount,
        reason: warningData?.reason
      })
      
      if (warningData) {
        console.log('✅ Valid warning data - setting accountWarning state')
        const warningState = {
          type: warningData.type || 'warning',
          message: warningData.message || 'Your account has been warned',
          reason: warningData.reason || 'Violation of Premium Community Standards',
          warningCount: warningData.warningCount || 1,
          lastWarningAt: warningData.lastWarningAt,
          timestamp: warningData.timestamp
        }
        
        setAccountWarning(warningState)
        
        // ✅ BACKUP: Save to localStorage so it persists even if page refreshes
        localStorage.setItem('flinx_pending_warning', JSON.stringify(warningState))
        console.log('💾 Saved warning to localStorage as backup')
        
        console.log('🚨 Warning modal should appear NOW!')
        console.log('='.repeat(80) + '\n')
      } else {
        console.warn('⚠️ Invalid warning data:', warningData)
      }
    };

    socketWrapper.on('account_warning', handleAccountWarning);
    
    // ✅ BACKUP: Also listen via window event for warning (in case socket event doesn't work)
    const handleWindowWarning = (event) => {
      console.log('🎯 [AuthContext] Window event caught account_warning');
      console.log('📦 Event detail:', event.detail);
      handleAccountWarning(event.detail);
    };
    
    window.addEventListener('account_warning', handleWindowWarning);
    
    // ✅ BACKUP: Also listen via universal event listener to catch all events
    const handleAnyEvent = (eventName, ...args) => {
      if (eventName === 'call_ended') {
        console.log('🎯 [AuthContext] UNIVERSAL listener caught call_ended event (backup)');
        console.log('📦 Event data:', args[0]);
        handleCallEnded(args[0]);
      } else if (eventName === 'account_warning') {
        console.log('🎯 [AuthContext] UNIVERSAL listener caught account_warning event (backup)');
        console.log('📦 Event data:', args[0]);
        handleAccountWarning(args[0]);
      }
    };
    socketWrapper.onAny(handleAnyEvent);
    
    console.log('✅ [AuthContext] ✓ incoming_call listener attached - ready to receive calls');
    console.log('✅ [AuthContext] ✓ call_accepted listener attached - READY TO RELAY ACCEPTANCE TO CALLER');
    console.log('✅ [AuthContext] ✓ call_ended listener attached - READY TO DISCONNECT CALLS');
    console.log('✅ [AuthContext] ✓ account_warning listener attached - READY TO HANDLE WARNINGS');
    console.log('✅ [AuthContext] ✓ universal event listener attached - backup for call_ended and account_warning');

    // ✅ GLOBAL FETCH INTERCEPTOR FOR 403 BANS
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 403) {
        try {
          const clone = response.clone();
          const data = await clone.json();
          if (data.error === 'ACCOUNT_BANNED') {
            window.dispatchEvent(new CustomEvent('account_banned'));
          }
        } catch (e) { }
      }
      return response;
    };

    // Cleanup on unmount
    return () => {
      console.log('🔔 [AuthContext] Removing all socket listeners');
      socketWrapper.off('friend_request_received', handleFriendRequest);
      socketWrapper.off('friend:quick-invite-received', handleQuickInvite);
      socketWrapper.off('incoming_call', handleIncomingCall);
      socketWrapper.off('call_accepted', handleCallAccepted);
      socketWrapper.off('call_ended', handleCallEnded);
      socketWrapper.off('account_warning', handleAccountWarning);
      socketWrapper.off('user_banned', handleAccountBanned);
      socketWrapper.offAny(handleAnyEvent);
      window.removeEventListener('account_warning', handleWindowWarning);
      window.removeEventListener('account_banned', handleAccountBanned);
      window.fetch = originalFetch;
    };
  }, []); // Empty dependency - attach once, never re-attach

  // ✅ REGISTER USER WITH SOCKET.IO WHEN AUTHENTICATED
  useEffect(() => {
    let heartbeatInterval = null

    if (user?.uuid && isAuthenticated && !isLoading) {
      console.log(`\n📢 [AuthContext] Ready to register user ${user.uuid.substring(0, 8)}...`)
      console.log(`   Socket connected: ${socketWrapper.connected}`)
      
      const registerAndStartHeartbeat = () => {
        console.log('✅ [AuthContext] Registering user + starting heartbeat')
        socketWrapper.emit('register_user', user.uuid)
        console.log(`📢 [AuthContext] register_user emitted for ${user.uuid.substring(0, 8)}...`)
        
        // Clear any existing heartbeat
        if (heartbeatInterval) clearInterval(heartbeatInterval)
        // Send heartbeat every 20 seconds to keep Redis TTL alive (30s expiry)
        heartbeatInterval = setInterval(() => {
          socketWrapper.emit('heartbeat', { userId: user.uuid })
        }, 20000)
      }
      
      // Always emit register_user on every (re)connect
      const handleConnect = () => {
        console.log('✅ Socket (re)connected - registering user')
        registerAndStartHeartbeat()
      }
      
      // Listen for ALL future reconnections (do NOT remove after first fire)
      socketWrapper.on('connect', handleConnect)
      
      // If already connected right now, register immediately
      if (socketWrapper.connected) {
        registerAndStartHeartbeat()
      }
    }

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval)
    }
  }, [user?.uuid, isAuthenticated, isLoading]);

  // ✅ CHECK LOCALSTORAGE FOR PENDING WARNING ON APP LOAD
  useEffect(() => {
    if (isAuthenticated && user?.uuid) {
      console.log('\n' + '='.repeat(80))
      console.log('🔍 [AuthContext STARTUP] Checking localStorage for pending warning...')
      console.log('='.repeat(80))
      
      try {
        const pendingWarning = localStorage.getItem('flinx_pending_warning');
        if (pendingWarning) {
          const warningData = JSON.parse(pendingWarning);
          console.log('✅ Found pending warning in localStorage!')
          console.log('📦 Warning data:', warningData);
          console.log('🚨 Showing warning modal...')
          setAccountWarning(warningData);
          // Don't remove it yet - user might close modal and reload
        } else {
          console.log('❌ No pending warning found')
        }
      } catch (error) {
        console.error('⚠️ Error reading localStorage warning:', error.message)
      }
      console.log('='.repeat(80) + '\n')
    }
  }, [isAuthenticated, user?.uuid])

  // ✅ POLLING: Check for warnings every 10 seconds as backup
  useEffect(() => {
    if (!isAuthenticated || !user?.uuid) return;

    console.log('🔄 [AuthContext] Starting warning status polling (every 10 seconds)...');

    const pollWarningStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL}/api/user/${user.uuid}/warning-status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.hasWarning && !accountWarning) {
            console.log('🚨 [POLLING] User has a warning! Showing modal...');
            console.log('📦 Warning data:', data.warning);
            setAccountWarning(data.warning);
            // Save to localStorage as backup
            localStorage.setItem('flinx_pending_warning', JSON.stringify(data.warning));
          }
        }
      } catch (error) {
        // Silent error - this is just a backup polling mechanism
       console.log('⏭️ [POLLING] Check skipped (socket connection is primary)');
      }
    };

    // Poll every 10 seconds
    const intervalId = setInterval(pollWarningStatus, 10000);

    // Also check immediately on mount
    pollWarningStatus();

    return () => clearInterval(intervalId);
  }, [isAuthenticated, user?.uuid, accountWarning]);

  // ✅ REFRESH SENT REQUESTS (requests sent BY user)
  const refreshSentRequests = async () => {
    if (!user?.uuid || user.uuid.length !== 36) {
      console.warn('⏸ refreshSentRequests skipped: user UUID not ready');
      return;
    }
    const data = await getSentRequests(user.uuid);
    const filtered = Array.isArray(data) ? data : [];
    console.log(`📤 [AuthContext] refreshSentRequests - fetched ${filtered.length} requests`);
    if (filtered.length > 0) {
      console.log('📤 [AuthContext] Sample sent request:', {
        id: filtered[0].id,
        receiver: filtered[0].display_name,
        status: filtered[0].status,
        sender_id: filtered[0].sender_id,
        receiver_id: filtered[0].receiver_id
      });
    }
    setSentRequests(filtered);
  };

  // ✅ REFRESH INCOMING REQUESTS (requests received BY user) 
  const refreshIncomingRequests = async () => {
    if (!user?.uuid || user.uuid.length !== 36) {
      console.warn('⏸ refreshIncomingRequests skipped: user UUID not ready');
      return;
    }
    const data = await getNotifications(user.uuid);
    const filtered = Array.isArray(data) ? data : [];
    console.log(`💚 [AuthContext] refreshIncomingRequests - fetched ${filtered.length} requests`);
    if (filtered.length > 0) {
      console.log('💚 [AuthContext] Sample incoming request:', {
        id: filtered[0].id,
        sender: filtered[0].display_name,
        status: filtered[0].status
      });
    }
    setIncomingRequests(filtered);
    // 💾 Cache to localStorage for instant loading next session
    localStorage.setItem('cachedIncomingRequests', JSON.stringify(filtered));
  };

  // ✅ CRITICAL: Only fetch sent requests when USER UUID is ready
  // This dependency ensures we NEVER call APIs before user is loaded
  useEffect(() => {
    // MUST wait for authLoading to be FALSE first
    if (isLoading === true) {
      console.log('⏸ Skipping sent requests fetch – authLoading is true');
      return;
    }

    if (!user?.uuid || user.uuid.length !== 36) {
      console.log('⏸ Skipping sent requests fetch – user UUID not ready');
      return;
    }

    console.log('✅ User ready, fetching sent requests:', user.uuid.substring(0, 8) + '...');
    
    // Fetch immediately
    refreshSentRequests();

    // Poll every 5 seconds
    const notifInterval = setInterval(refreshSentRequests, 5000);

    return () => {
      clearInterval(notifInterval);
    };
  }, [isLoading, user?.uuid]);

  // ✅ FETCH INCOMING REQUESTS when USER UUID is ready
  // Polls every 5 seconds for badge count on heart icon
  useEffect(() => {
    // MUST wait for authLoading to be FALSE first
    if (isLoading === true) {
      console.log('⏸ Skipping incoming requests fetch – authLoading is true');
      return;
    }

    if (!user?.uuid || user.uuid.length !== 36) {
      console.log('⏸ Skipping incoming requests fetch – user UUID not ready');
      return;
    }

    console.log('✅ User ready, fetching incoming requests:', user.uuid.substring(0, 8) + '...');
    
    // Fetch immediately
    refreshIncomingRequests();

    // Poll every 3 seconds (faster updates)
    const incomingInterval = setInterval(refreshIncomingRequests, 3000);

    return () => {
      clearInterval(incomingInterval);
    };
  }, [isLoading, user?.uuid]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('\n\n🔵 [AuthContext] ═══════════════════════════════════════════');
        console.log('🔵 [AuthContext] INITIALIZATION STARTED');
        console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
        
        // ✅ CLEANUP STEP: Remove invalid users from old builds (numeric IDs)
        const storedUserRaw = localStorage.getItem('user');
        if (storedUserRaw) {
          try {
            const parsed = JSON.parse(storedUserRaw);
            
            // ❌ Remove if UUID is invalid or numeric
            if (!parsed.uuid || (typeof parsed.uuid === 'string' && parsed.uuid.length !== 36)) {
              console.warn('🧹 [AuthContext] Removing invalid user from localStorage:', {
                uuid: parsed.uuid,
                id: parsed.id,
                email: parsed.email
              });
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch (e) {
            console.warn('🧹 [AuthContext] Invalid JSON in localStorage user, removing');
            localStorage.removeItem('user');
          }
        }
        
        // 🚨 CRITICAL: Check for stored JWT token from Google OAuth FIRST
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        console.log('🔵 [AuthContext] STEP 1: Check localStorage');
        console.log('🔵 [AuthContext]   - token:', storedToken ? '✓ Found' : '✗ Not found')
        console.log('🔵 [AuthContext]   - user:', storedUser ? '✓ Found' : '✗ Not found')
        
        // 🚨 CRITICAL: JWT AUTH TAKES PRIORITY - NO FIREBASE IF JWT EXISTS
        if (storedToken && storedUser) {
          try {
            console.log('\n🔵 [AuthContext] ✅ JWT found in localStorage');
            const user = JSON.parse(storedUser);
            
            // ✅ STRICT VALIDATION: UUID must be exactly 36 chars
            if (!user.uuid || typeof user.uuid !== 'string' || user.uuid.length !== 36) {
              console.warn('🧹 [AuthContext] Invalid UUID in localStorage, clearing auth');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setIsLoading(false);
              return;
            }
            
            console.log('🔵 [AuthContext] ✅ User restored from JWT:', user.email);
            console.log('🔵 [AuthContext] ✅ profileCompleted:', user.profileCompleted);
            console.log('🔵 [AuthContext] ✅ Firebase auth SKIPPED — using JWT only');
            
            setUser(user);
            setIsAuthenticated(true);
            setIsLoading(false);
            console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
            console.log('🔵 [AuthContext] INITIALIZATION COMPLETE (JWT) - isLoading=false');
            console.log('🔵 [AuthContext] ═══════════════════════════════════════════\n');
            
            // 🔄 BACKGROUND REFRESH: Fetch fresh profile from backend to update premium status
            // This ensures hasUnlimitedSkip/isPremium are current, not stale from cache
            (async () => {
              try {
                const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
                const profileResponse = await fetch(`${BACKEND_URL}/api/profile`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (profileResponse.ok) {
                  const profileData = await profileResponse.json();
                  if (profileData.success && profileData.user) {
                    const freshUser = {
                      ...profileData.user,
                      publicId: profileData.user.public_id || profileData.user.publicId,
                      uuid: profileData.user.uuid,
                      hasSeenPremiumPopup: !!(profileData.user.hasSeenPremiumPopup || profileData.user.has_seen_premium_popup),
                      isPremium: !!(profileData.user.isPremium || profileData.user.is_premium),
                      hasUnlimitedSkip: !!(profileData.user.hasUnlimitedSkip || profileData.user.has_unlimited_skip),
                      has_unlimited_skip: profileData.user.has_unlimited_skip,
                      unlimited_skip_expires_at: profileData.user.unlimited_skip_expires_at,
                      unlimitedSkipExpiresAt: profileData.user.unlimited_skip_expires_at,
                      dailySkipCount: profileData.user.dailySkipCount || profileData.user.daily_skip_count || 0,
                      lastSkipResetDate: profileData.user.lastSkipResetDate || profileData.user.last_skip_reset_date || null
                    };
                    console.log('🔄 [AuthContext] Background profile refresh complete:', {
                      isPremium: freshUser.isPremium,
                      hasUnlimitedSkip: freshUser.hasUnlimitedSkip,
                      dailySkipCount: freshUser.dailySkipCount
                    });
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                  }
                }
              } catch (err) {
                console.warn('🔄 [AuthContext] Background profile refresh failed (non-critical):', err.message);
              }
            })();
            
            // 🚨 RETURN EARLY - DO NOT CONTINUE TO FIREBASE
            return;
          } catch (err) {
            console.error('🔵 [AuthContext] ❌ Error parsing JWT user:', err);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setIsLoading(false);
            return;
          }
        }
        
        console.log('\n🔵 [AuthContext] STEP 2: No JWT found, will check Firebase...');
        
        // Check Firebase authentication state
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log('\n🔵 [AuthContext] Firebase onAuthStateChanged fired');
          console.log('🔵 [AuthContext]   - firebaseUser:', firebaseUser ? firebaseUser.email : 'null');
          
          if (firebaseUser) {
            // User is logged in via Firebase (Google or Facebook)
            const authProvider = firebaseUser.providerData[0]?.providerId || 'unknown'
            console.log('🔵 [AuthContext] User authenticated via Firebase');
            console.log('🔵 [AuthContext]   - Email:', firebaseUser.email);
            console.log('🔵 [AuthContext]   - Provider:', authProvider);
            
            // CRITICAL: Get the full user profile from our database
            try {
              console.log('🔵 [AuthContext] Getting Firebase ID token...');
              const idToken = await firebaseUser.getIdToken()
              console.log('🔵 [AuthContext] ✓ ID token obtained');
              localStorage.setItem('idToken', idToken)
              console.log('🔐 Firebase ID token stored for Socket.IO')
              
              // ✅ Also store as authToken for rest of app
              localStorage.setItem('authToken', idToken)
              console.log('🔐 ✅ ID token also stored as authToken in localStorage')
              
              // Fetch full profile from backend
              const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
              console.log('🔵 [AuthContext] Calling /api/profile with ID token...');
              const profileResponse = await fetch(`${BACKEND_URL}/api/profile`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${idToken}`,
                  'Content-Type': 'application/json'
                }
              })
              
              console.log('🔵 [AuthContext] /api/profile response status:', profileResponse.status);
              
              if (profileResponse.ok) {
                const profileData = await profileResponse.json()
                console.log('🔵 [AuthContext] /api/profile response OK');
                console.log('🔵 [AuthContext]   - success:', profileData.success);
                console.log('🔵 [AuthContext]   - user.profileCompleted:', profileData.user?.profileCompleted);
                
                if (profileData.success && profileData.user) {
                  console.log('🔵 [AuthContext] ✅ Fetched full user profile from database:', {
                    email: profileData.user.email,
                    profileCompleted: profileData.user.profileCompleted
                  })
                  console.log('🔵 [AuthContext] Setting user state with profileCompleted:', profileData.user.profileCompleted);
                  
                  // Ensure publicId and uuid are included in user object
                  const userWithIds = {
                    ...profileData.user,
                    publicId: profileData.user.public_id || profileData.user.publicId,
                    uuid: profileData.user.uuid, // ✅ Use UUID from backend ONLY
                    hasSeenPremiumPopup: !!(profileData.user.hasSeenPremiumPopup || profileData.user.has_seen_premium_popup),
                    isPremium: !!(profileData.user.isPremium || profileData.user.is_premium),
                    hasUnlimitedSkip: !!(profileData.user.hasUnlimitedSkip || profileData.user.has_unlimited_skip),
                    has_unlimited_skip: profileData.user.has_unlimited_skip,
                    unlimited_skip_expires_at: profileData.user.unlimited_skip_expires_at,
                    unlimitedSkipExpiresAt: profileData.user.unlimited_skip_expires_at,
                    dailySkipCount: profileData.user.dailySkipCount || profileData.user.daily_skip_count || 0,
                    lastSkipResetDate: profileData.user.lastSkipResetDate || profileData.user.last_skip_reset_date || null
                  }
                  
                  // Safe error check - DO NOT auto-fill
                  if (!userWithIds.uuid) {
                    console.error('❌ UUID missing from backend user object');
                  }
                  
                   localStorage.setItem('user', JSON.stringify(userWithIds))
                   setUser(userWithIds)
                  setIsAuthenticated(true)
                  setIsLoading(false)
                  return
                }
              } else {
                console.log('🔵 [AuthContext] ⚠️ /api/profile response not OK:', profileResponse.status);
              }
            } catch (error) {
              console.warn('[AuthContext] ⚠️ Failed to fetch profile from database:', error)
              // Fall back to minimal user info
            }
            
            // Fallback: Create minimal userInfo if profile fetch failed
            // ✅ IMPORTANT: Don't default to false - instead determine by actual data
            // If user has birthday/gender, they completed their profile
            const userInfo = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              publicId: firebaseUser.uid, // Use UID as temporary publicId
              authProvider: authProvider,
              // ✅ Only set to false if we have no profile data
              // If user has any profile fields, assume complete
              profileCompleted: false,  // Fallback - will only be used if no profile data exists at all
              isPremium: false,
              hasUnlimitedSkip: false,
              has_unlimited_skip: false,
              unlimited_skip_expires_at: null,
              unlimitedSkipExpiresAt: null,
              dailySkipCount: 0
            }
            
            console.log('[AuthContext] Using fallback userInfo (database fetch failed):', userInfo.email)
            console.log('[AuthContext] ⚠️ WARNING: profileCompleted not available from API, will check on next profile fetch');
            setUser(userInfo)
            setIsAuthenticated(true)
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            localStorage.setItem('authProvider', authProvider)
          } else {
            console.log('🔵 [AuthContext] Firebase user is null/logged out');
            
            // Check for local auth token (legacy support for guest login)
            const authToken = localStorage.getItem('authToken')
            const authProvider = localStorage.getItem('authProvider')
            
            console.log('🔵 [AuthContext]   - authToken:', authToken ? 'Found' : 'Not found');
            console.log('🔵 [AuthContext]   - authProvider:', authProvider);
            
            if (authToken && authProvider === 'guest') {
              const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
              
              // Ensure publicId exists
              if (!userInfo.publicId && userInfo.public_id) {
                userInfo.publicId = userInfo.public_id
              }
              
              console.log('🔵 [AuthContext] Restoring guest login');
              setUser(userInfo)
              setIsAuthenticated(true)
            } else {
              // No auth found, redirect to login
              console.log('🔵 [AuthContext] ❌ No authentication found, user will be redirected to login')
              setUser(null)
              setIsAuthenticated(false)
            }
          }
          console.log('🔵 [AuthContext] ═══════════════════════════════════════════');
          console.log('🔵 [AuthContext] INITIALIZATION COMPLETE - Setting isLoading=false');
          console.log('🔵 [AuthContext] ═══════════════════════════════════════════\n');
          setIsLoading(false)
        })

        return unsubscribe
      } catch (err) {
        console.error('[AuthContext] Error initializing auth:', err)
        setIsLoading(false)
      }
    }
    
    initializeAuth()
  }, [])

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) return { success: false, error: 'No token found' };

      const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
      const profileResponse = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const status = profileResponse.status;
      if (!profileResponse.ok) {
        let body = null;
        try {
          body = await profileResponse.json();
        } catch {
          // ignore
        }
        console.error('[AuthContext] /api/profile failed', { status, body });
        return { success: false, error: body?.error || 'Failed to fetch profile', status };
      }

      const profileData = await profileResponse.json();
      if (profileData.success && profileData.user) {
          const userWithIds = {
            ...profileData.user,
            publicId: profileData.user.public_id || profileData.user.publicId,
            uuid: profileData.user.uuid, // ✅ Use UUID from backend ONLY
            hasSeenPremiumPopup: !!(profileData.user.hasSeenPremiumPopup || profileData.user.has_seen_premium_popup),
            isPremium: !!(profileData.user.isPremium || profileData.user.is_premium),
            hasUnlimitedSkip: !!(profileData.user.hasUnlimitedSkip || profileData.user.has_unlimited_skip),
            has_unlimited_skip: profileData.user.has_unlimited_skip,
            unlimited_skip_expires_at: profileData.user.unlimited_skip_expires_at,
            unlimitedSkipExpiresAt: profileData.user.unlimited_skip_expires_at,
            dailySkipCount: profileData.user.dailySkipCount || profileData.user.daily_skip_count || 0,
            lastSkipResetDate: profileData.user.lastSkipResetDate || profileData.user.last_skip_reset_date || null
          }
          setUser(userWithIds);
          localStorage.setItem('user', JSON.stringify(userWithIds));
          return { success: true, user: userWithIds };
      }

      console.error('[AuthContext] /api/profile unexpected payload', {
        success: profileData?.success,
        hasUser: !!profileData?.user
      });
      return { success: false, error: 'Failed to fetch profile', status: profileResponse.status };
    } catch (err) {
      console.error('[AuthContext] Error refreshing profile:', err);
      return { success: false, error: err.message, status: 0 };
    }
  };

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('authProvider')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const incrementSkipCount = () => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      
      const unlimitedSkipExpiresAt =
        prevUser.unlimitedSkipExpiresAt || prevUser.unlimited_skip_expires_at;
      const hasActiveUnlimitedSkip = !!(
        (prevUser.hasUnlimitedSkip || prevUser.has_unlimited_skip) &&
        (!unlimitedSkipExpiresAt || new Date(unlimitedSkipExpiresAt).getTime() > Date.now())
      );

      // ✅ Don't increment for premium users / active unlimited skip
      if (prevUser.isPremium || prevUser.is_premium || hasActiveUnlimitedSkip) {
        return prevUser;
      }

      const updatedUser = {
        ...prevUser,
        dailySkipCount: (prevUser.dailySkipCount || 0) + 1
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }

  // ✅ Check if user has reached skip limit
  const hasReachedSkipLimit = () => {
    if (!user) return false;
    
    const skipLimit = 1;

    const unlimitedSkipExpiresAt =
      user.unlimitedSkipExpiresAt || user.unlimited_skip_expires_at;
    const hasActiveUnlimitedSkip = !!(
      (user.hasUnlimitedSkip || user.has_unlimited_skip) &&
      (!unlimitedSkipExpiresAt || new Date(unlimitedSkipExpiresAt).getTime() > Date.now())
    );

    // ✅ Premium/unlimited (active) users can always skip
    if (user.isPremium || user.is_premium || hasActiveUnlimitedSkip) {
      console.log('[AuthContext] ✅ User has unlimited skip - no skip limit');
      return false;
    }
    
    // ✅ Check if daily skip count >= 1
    const currentSkipCount = user.dailySkipCount || 0;
    const hasLimit = currentSkipCount >= skipLimit;
    
    if (hasLimit) {
      console.log(`[AuthContext] ⛔ Skip limit reached: ${currentSkipCount}/${skipLimit} skip(s)`);
    } else {
      console.log(`[AuthContext] ✅ Skip available: ${currentSkipCount}/${skipLimit} skip(s)`);
    }
    
    return hasLimit;
  }

  // ✅ Get remaining skips for display
  const getRemainingSkips = () => {
    const skipLimit = 1;
    if (!user) return skipLimit;
    
    const unlimitedSkipExpiresAt =
      user.unlimitedSkipExpiresAt || user.unlimited_skip_expires_at;
    const hasActiveUnlimitedSkip = !!(
      (user.hasUnlimitedSkip || user.has_unlimited_skip) &&
      (!unlimitedSkipExpiresAt || new Date(unlimitedSkipExpiresAt).getTime() > Date.now())
    );

    // ✅ Return unlimited for premium users / active unlimited skip
    if (user.isPremium || user.is_premium || hasActiveUnlimitedSkip) {
      return Infinity;
    }

    const currentSkipCount = user.dailySkipCount || 0;
    return Math.max(0, skipLimit - currentSkipCount);
  }

  const setAuthToken = (token, userData) => {
    console.log('[AuthContext] ⚠️ setAuthToken called with userData:', {
      email: userData?.email,
      has_uuid: !!userData?.uuid,
      uuid: userData?.uuid,
      uuid_length: userData?.uuid?.length,
      all_keys: Object.keys(userData || {})
    })
    
    // ✅ CRITICAL: Create CLEAN user object with ONLY needed fields
    // ❌ DO NOT spread userData (it contains numeric id)
    const normalizedUserData = {
      uuid: userData?.uuid,
      name: userData?.name || 'User',
      email: userData?.email,
      picture: userData?.picture,
      location: userData?.location || null,
      profileCompleted: userData?.profileCompleted || false,
      isBanned: !!userData?.is_banned,
      hasSeenPremiumPopup: !!(userData?.hasSeenPremiumPopup || userData?.has_seen_premium_popup),
      isPremium: !!userData?.isPremium,
      hasUnlimitedSkip: !!(userData?.hasUnlimitedSkip || userData?.has_unlimited_skip),
      has_unlimited_skip: userData?.has_unlimited_skip || false,
      unlimited_skip_expires_at: userData?.unlimited_skip_expires_at || null,
      unlimitedSkipExpiresAt: userData?.unlimited_skip_expires_at || null,
      dailySkipCount: userData?.dailySkipCount || 0,
      lastSkipResetDate: userData?.lastSkipResetDate || null
    }
    
    // Safe error check: UUID must be exactly 36 chars
    if (!normalizedUserData.uuid || typeof normalizedUserData.uuid !== 'string' || normalizedUserData.uuid.length !== 36) {
      console.error('❌ Invalid or missing UUID in setAuthToken:', {
        uuid_received: userData?.uuid,
        uuid_type: typeof userData?.uuid,
        uuid_length: userData?.uuid?.length
      })
      return
    }
    
    console.log('[AuthContext] ✅ setAuthToken storing user with UUID:', normalizedUserData.uuid.substring(0, 8) + '...')
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(normalizedUserData))
    localStorage.setItem('authProvider', 'google')
    setUser(normalizedUserData)
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      logout, 
      authPending, 
      setAuthPending, 
      setAuthToken,
      refreshProfile,
      incrementSkipCount,
      hasReachedSkipLimit,
      getRemainingSkips,
      // ✅ SENT REQUESTS (requests sent BY user - for SearchFriendsModal)
      sentRequests,
      refreshSentRequests,
      // ✅ INCOMING REQUESTS (requests received BY user - for badge count)
      incomingRequests,
      setIncomingRequests,
      refreshIncomingRequests,
      // ✅ INCOMING REQUEST POPUP (received requests - for dashboard)
      incomingFriendRequest,
      setIncomingFriendRequest,
      // ✅ INCOMING CALL (available on any screen)
      incomingCall,
      setIncomingCall,
      // ✅ DIRECT CALL STATE
      callType,
      setCallType,
      directCallData,
      setDirectCallData,
      // ✅ GLOBAL CAMERA STREAM (stored once, reused everywhere - no repeated permission requests)
      localStream,
      setLocalStream,
      // ✅ ACCOUNT WARNING (show warning modal)
      accountWarning,
      setAccountWarning,
      // ✅ PREMIUM POPUP SEEN helper
      markPremiumPopupAsSeen: async () => {
        try {
          const result = await markPremiumPopupSeenApi();
          if (result.success) {
            setUser(prevUser => {
              const updatedUser = prevUser ? { ...prevUser, hasSeenPremiumPopup: true } : prevUser;
              if (updatedUser) {
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Keep cache in sync
              }
              return updatedUser;
            });
          }
          return result;
        } catch (err) {
          console.error('Error marking premium popup as seen:', err);
          return { success: false };
        }
      }
    }}>
      {children}
    </AuthContext.Provider>
  )
}
