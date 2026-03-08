import { useState, useEffect, useContext, useRef } from 'react';
// ✅ Import socketWrapper directly instead of lazy loading
import socketWrapper from '../services/socketService';
import { markMessagesAsRead } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useUnreadSafe } from '../context/UnreadContext';
import IncomingCallScreen from './IncomingCallScreen';
import CallPopup from './CallPopup';

// Helper: Convert a date to relative time string (e.g. "5 min ago", "2 hours ago")
const getTimeAgo = (dateStr) => {
  if (!dateStr) return 'Offline';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

const ChatBox = ({ friend, onBack, onMessageSent }) => {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user, setCallType, setDirectCallData } = useContext(AuthContext) || {};
  const { refetchUnreadCount } = useUnreadSafe();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [friendOnline, setFriendOnline] = useState(null); // null = loading, true/false
  const [friendLastSeen, setFriendLastSeen] = useState(null);
  const [, setTick] = useState(0); // force re-render for time ago updates
  
  // Get current user UUID from AuthContext (source of truth)
  const myUserId = user?.uuid;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // ========== DEBUG: Component initialization ==========
  console.log('\n' + '='.repeat(80));
  console.log('🎬 [CHATBOX] ========== COMPONENT INITIALIZED ==========');
  console.log('='.repeat(80));
  console.log('⏱️  Mount Timestamp:', new Date().toISOString());
  console.log('📊 [CONTEXT CHECK] AuthContext user object:');
  console.log('   user:', user);
  console.log('   user?.uuid:', user?.uuid);
  console.log('   user?.uuid type:', typeof user?.uuid);
  console.log('   user?.uuid length:', user?.uuid?.length);
  console.log('   user?.name:', user?.name);
  console.log('   user?.email:', user?.email);
  console.log('📊 [EXTRACTED] myUserId:', myUserId);
  console.log('📊 [FRIEND PROP] friend object:', friend);
  console.log('📊 [FRIEND PROP] friend?.id:', friend?.id);
  console.log('📊 [FRIEND PROP] friend?.display_name:', friend?.display_name);
  console.log('='.repeat(80) + '\n');

  // ✅ STRICT VALIDATION: Block everything until valid UUIDs exist
  if (!myUserId || typeof myUserId !== 'string' || myUserId.length !== 36) {
    console.warn('⛔ ChatBox: Invalid my UUID, blocking render:', myUserId?.length);
    return null;
  }

  if (!friend?.id || typeof friend.id !== 'string' || friend.id.length !== 36) {
    console.warn('⛔ ChatBox: Invalid friend UUID, blocking render:', friend?.id?.length);
    return null;
  }

  // ✅ INITIALIZE SOCKET REFERENCE - Use global socketWrapper
  useEffect(() => {
    // Socket is now globally available
    socketRef.current = socketWrapper;
    console.log('✅ [ChatBox] Socket initialized from global socketWrapper');
  }, []);

  // ✅ CHECK FRIEND ONLINE STATUS & LISTEN FOR CHANGES
  useEffect(() => {
    if (!friend?.id) return;

    // Fetch initial status via REST API (reliable, no socket callback needed)
    fetch(`${BACKEND_URL}/api/user/status/${friend.id}`)
      .then(r => r.json())
      .then(data => {
        setFriendOnline(data.isOnline);
        setFriendLastSeen(data.lastSeen);
      })
      .catch(() => {
        setFriendOnline(false);
        setFriendLastSeen(null);
      });

    // Listen for real-time status changes via socket
    const handleStatusChange = (data) => {
      if (data.friendId === friend.id) {
        setFriendOnline(data.isOnline);
        setFriendLastSeen(data.lastSeen);
      }
    };
    socketWrapper?.on('friend_status_change', handleStatusChange);

    // Update "X ago" text every 30 seconds
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);

    return () => {
      socketWrapper?.off('friend_status_change', handleStatusChange);
      clearInterval(interval);
    };
  }, [friend?.id]);

  // ✅ JOIN CHAT ROOM when component opens
  useEffect(() => {
    if (!myUserId || !friend) return;

    // Create deterministic room ID (same for both users)
    const friendUUID = friend.id;
    const roomId = myUserId < friendUUID 
      ? `${myUserId}_${friendUUID}` 
      : `${friendUUID}_${myUserId}`;

    console.log(`📍 Joining chat room: ${roomId}`);
    console.log(`   My UUID: ${myUserId}`);
    console.log(`   Friend UUID: ${friendUUID}`);
    
    socketRef.current?.emit('join_chat', {
      senderId: myUserId,
      receiverId: friend.id
    });
  }, [friend, myUserId]);

  // ✅ MARK MESSAGES AS READ when chat opens
  useEffect(() => {
    if (!myUserId || !friend?.id) return;

    const markRead = async () => {
      try {
        // Build deterministic chatId same way roomId is built
        const friendUUID = friend.id;
        const roomId = myUserId < friendUUID ? `${myUserId}_${friendUUID}` : `${friendUUID}_${myUserId}`;

        const result = await markMessagesAsRead(roomId);
        if (result?.success) {
          console.log('✅ Messages from', friend.display_name, 'marked as read (chatId)', roomId);
          
          // 🔥 CRITICAL FIX: Refetch global unread count after marking as read
          // This ensures badge resets when user opens a chat
          await refetchUnreadCount();
        }
      } catch (error) {
        console.error('❌ Error marking messages as read:', error);
      }
    };

    markRead();
  }, [friend?.id, myUserId, refetchUnreadCount]);

  // ✅ Function to fetch messages
  const loadChatMessages = async () => {
    if (!myUserId || !friend?.id) {
      console.log('⏳ ChatBox: Waiting for myUserId or friend.id', { myUserId, friendId: friend?.id });
      return;
    }

    console.log('📨 ChatBox: Loading messages for friend:', { myUserId, friendId: friend.id, friendName: friend.display_name });

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const messagesUrl = `${BACKEND_URL}/api/messages?user1=${myUserId}&user2=${friend.id}`;
    
    console.log("📨 Fetching chat history from:", messagesUrl);
    
    try {
      const res = await fetch(messagesUrl);
      console.log("📨 Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("📨 Messages loaded:", data.length, 'messages');
      if (Array.isArray(data)) {
        setMessages(
          data.map(m => ({
            me: m.sender_id === myUserId,
            text: m.message
          }))
        );
      }
    } catch (err) {
      console.error("❌ Failed to load chat history:", err);
    }
  };

  // ✅ LOAD CHAT HISTORY when chat opens
  useEffect(() => {
    loadChatMessages();
    
    // ✅ Auto-refresh messages every 2 seconds (polling)
    const interval = setInterval(() => {
      loadChatMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [myUserId, friend?.id]);

  const send = () => {
    if (!text.trim()) return;

    const now = new Date().toISOString();

    // ✅ SEND MESSAGE VIA SOCKET AND SAVE TO DB
    socketRef.current?.emit('send_message', {
      senderId: myUserId,
      receiverId: friend.id, // UUID from friend object
      message: text,
      created_at: now
    });

    // ✅ Clear input (message will be added by socket receive_message event)
    setText('');

    // ✅ Update chat list to move this friend to top
    if (onMessageSent) {
      onMessageSent(friend.id, now);
    }

    // ✅ Auto-refresh messages after a short delay to ensure DB has the message
    setTimeout(() => {
      loadChatMessages();
    }, 500);
  };

  // ✅ RECEIVE MESSAGES FROM SOCKET (from shared room)
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages(prev => [
        ...prev,
        { me: data.senderId === myUserId, text: data.message }
      ]);

      // ✅ Update chat list to move this friend to top when receiving message
      if (onMessageSent && data.senderId !== myUserId) {
        const messageTime = data.created_at || new Date().toISOString();
        onMessageSent(friend.id, messageTime);
      }
    };

    socketRef.current?.on('receive_message', handleReceiveMessage);

    return () => socketRef.current?.off('receive_message', handleReceiveMessage);
  }, [myUserId, friend, onMessageSent]);

  // ✅ AUTO-SCROLL TO BOTTOM WHEN MESSAGES CHANGE
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, [messages]);

  // ✅ LISTEN FOR INCOMING CALLS from socket
  useEffect(() => {
    // Wait for socket to be initialized
    if (!socketRef.current) {
      console.log('⏳ Socket not ready yet, skipping listener setup');
      return;
    }

    const handleIncomingCall = (data) => {
      console.log('📞 INCOMING CALL EVENT RECEIVED:', data);
      console.log('   - Caller:', data.callerName);
      console.log('   - Caller ID:', data.callerId);
      console.log('   - Receiver ID:', data.receiverId);
      console.log('   - Current User ID:', myUserId);
      
      // ✅ FILTER: Only show popup if THIS user is the receiver
      if (data.receiverId === myUserId) {
        console.log('✅ Call is for THIS user - showing popup');
        setShowCallPopup(true);
      } else {
        console.log('⛔ Call is for someone else - ignoring');
      }
    };

    socketRef.current?.on('incoming_call', handleIncomingCall);

    return () => socketRef.current?.off('incoming_call', handleIncomingCall);
  }, [myUserId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ✅ CALL BUTTON HANDLER - Send call notification to friend
  const handleCallClick = () => {
    console.log('📞 Initiating call to:', friend.display_name);
    console.log('   Socket ref:', socketRef.current ? '✅ Available' : '❌ NULL');
    console.log('   Socket type:', typeof socketRef.current);
    console.log('   Socket has emit:', typeof socketRef.current?.emit);
    
    // ✅ CRITICAL: Check if socket is ready
    if (!socketRef.current) {
      console.error('❌ Socket not initialized yet - waiting for async load...');
      alert('Socket connection not ready. Please try again in a moment.');
      return;
    }
    
    if (typeof socketRef.current.emit !== 'function') {
      console.error('❌ Socket emit method not available');
      alert('Socket not properly connected. Please retry.');
      return;
    }
    
    const callPayload = {
      callerId: myUserId,
      callerName: user?.name || 'Unknown',
      callerProfileImage: user?.picture,
      receiverId: friend.id,
      recipientName: friend.display_name
    };
    
    console.log('📡 Emitting init_call with payload:', callPayload);
    
    // ✅ Emit socket event to notify the friend of incoming call
    socketRef.current.emit('init_call', callPayload);

    // ✅ SHOW INCOMING CALL SCREEN FOR CALLER (waiting for receiver to accept)
    console.log('📞 [ChatBox] Setting callType = "direct" for caller');
    setCallType('direct');
    setDirectCallData({
      callerId: callPayload.callerId,
      callerName: callPayload.callerName,
      receiverId: callPayload.receiverId,
      recipientName: callPayload.recipientName,
      callAccepted: false  // ✅ Flag to show CallingWaitScreen until receiver accepts
    });

    console.log('📞 ✅ Call initiated, CallingWaitScreen should appear for caller...');
  };

  // ✅ ACCEPT CALL HANDLER
  const handleAcceptCall = async () => {
    setIsCallLoading(true);
    console.log('✅ Call accepted with:', friend.display_name);
    
    // Simulate call setup delay
    setTimeout(() => {
      setShowCallPopup(false);
      setIsCallLoading(false);
      // TODO: Start video chat - trigger parent component to show video call
      console.log('🎥 Starting video chat with:', friend.display_name);
    }, 1000);
  };

  // ✅ REJECT CALL HANDLER
  const handleRejectCall = () => {
    console.log('❌ Call rejected with:', friend.display_name);
    setShowCallPopup(false);
    setIsCallLoading(false);
  };

  return (
    <div className="w-full max-w-[420px] h-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* HEADER - User Info */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200/50 dark:border-white/10 bg-white/30 dark:bg-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-cyan-500/20">
              {friend.display_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-[15px]">
                {friend.display_name}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${friendOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium">
                  {friendOnline === null ? '...' : friendOnline ? 'Online' : getTimeAgo(friendLastSeen)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleCallClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Call"
        >
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">call</span>
        </button>
      </div>

      {/* MESSAGES - Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3" ref={messagesEndRef} style={{ scrollBehavior: 'smooth' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Start a conversation with {friend.display_name}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-end space-y-2">
            {messages.map((m, i) => (
              m.me ? (
                <div
                  key={i}
                  className="message-bubble-right bg-indigo-600 dark:bg-indigo-600 text-white px-4 py-2 text-sm max-w-[80%] shadow-md shadow-indigo-600/20 leading-relaxed tracking-wide rounded-[18px]"
                  style={{ borderRadius: '18px 18px 4px 18px' }}
                >
                  {m.text}
                </div>
              ) : (
                <div
                  key={i}
                  className="message-bubble-left bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 text-sm max-w-[80%] leading-relaxed tracking-wide rounded-[18px]"
                  style={{ borderRadius: '18px 18px 18px 4px', alignSelf: 'flex-start' }}
                >
                  {m.text}
                </div>
              )
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* INPUT - Footer */}
      <div className="p-6 border-t border-gray-200/50 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-gray-200/50 dark:bg-white/5 border-none focus:ring-2 focus:ring-indigo-600/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl px-5 py-3.5 text-sm transition-all outline-none"
              placeholder="Type a message..."
              type="text"
            />
          </div>
          <button
            onClick={send}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ transform: 'rotate(-30deg)', marginLeft: '4px' }}>
              send
            </span>
          </button>
        </div>
      </div>

      {/* ✅ CALL POPUP - Top-centered notification */}
      {showCallPopup && (
        <CallPopup
          callerName={friend.display_name}
          callerAvatar={friend.display_name?.charAt(0).toUpperCase()}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          isLoading={isCallLoading}
        />
      )}
    </div>
  );
};

export default ChatBox;
