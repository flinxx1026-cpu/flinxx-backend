import { useState, useEffect, useContext, useRef, useCallback } from 'react';
// ✅ Import socketWrapper directly instead of lazy loading
import socketWrapper from '../services/socketService';
import { markMessagesAsRead } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';
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
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const callPopupTimeoutRef = useRef(null);

  // ✅ NEW STATE: Hover actions, context menu, reply
  const [hoveredMsgIndex, setHoveredMsgIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // { index, x, y }
  const [replyingTo, setReplyingTo] = useState(null); // { id, text, senderName, isMe }
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(null); // { msg } for bottom sheet
  const [showEmoji, setShowEmoji] = useState(false);
  const [swipeState, setSwipeState] = useState({ index: null, deltaX: 0 });
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const longPressRef = useRef(null);
  const swipeTriggeredRef = useRef(false);
  
  // Get current user UUID from AuthContext (source of truth)
  const myUserId = user?.uuid;
  const isMobile = window.innerWidth < 768;
  const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;

  // ✅ STRICT VALIDATION: Block everything until valid UUIDs exist
  if (!myUserId || typeof myUserId !== 'string' || myUserId.length !== 36) {
    return null;
  }

  if (!friend?.id || typeof friend.id !== 'string' || friend.id.length !== 36) {
    return null;
  }

  // ✅ INITIALIZE SOCKET REFERENCE - Use global socketWrapper
  useEffect(() => {
    // Socket is now globally available
    socketRef.current = socketWrapper;
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
      return;
    }

    const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
    const messagesUrl = `${BACKEND_URL}/api/messages?user1=${myUserId}&user2=${friend.id}`;
    
    try {
      const res = await fetch(messagesUrl);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(
          data.map(m => ({
            id: m.id,
            me: m.sender_id === myUserId,
            senderId: m.sender_id,
            text: m.message,
            message_type: m.message_type || 'text',
            created_at: m.created_at,
            is_deleted: m.is_deleted || false,
            reply_to_id: m.reply_to_id || null
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
      created_at: now,
      replyToId: replyingTo?.id || null
    });

    // ✅ Clear input, reply state, and stop typing indicator
    setText('');
    setReplyingTo(null);
    isTypingRef.current = false;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current?.emit('stop_typing', { senderId: myUserId, receiverId: friend.id });

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
        { 
          id: data.id,
          me: data.senderId === myUserId, 
          senderId: data.senderId,
          text: data.message, 
          message_type: data.message_type || 'text', 
          created_at: new Date().toISOString(),
          is_deleted: false,
          reply_to_id: data.replyToId || null
        }
      ]);

      // ✅ Update chat list to move this friend to top when receiving message
      if (onMessageSent && data.senderId !== myUserId) {
        const messageTime = data.created_at || new Date().toISOString();
        onMessageSent(friend.id, messageTime);
      }
    };

    // ✅ Handle message deletion for everyone (shows "This message was deleted")
    const handleMessageDeleted = (data) => {
      setMessages(prev => prev.map(m => 
        m.id === data.messageId 
          ? { ...m, is_deleted: true, text: 'This message was deleted' }
          : m
      ));
    };

    // ✅ Handle message deletion for me only (completely remove from UI)
    const handleMessageDeletedForMe = (data) => {
      setMessages(prev => prev.filter(m => m.id !== data.messageId));
    };

    socketRef.current?.on('receive_message', handleReceiveMessage);
    socketRef.current?.on('message_deleted', handleMessageDeleted);
    socketRef.current?.on('message_deleted_for_me', handleMessageDeletedForMe);

    return () => {
      socketRef.current?.off('receive_message', handleReceiveMessage);
      socketRef.current?.off('message_deleted', handleMessageDeleted);
      socketRef.current?.off('message_deleted_for_me', handleMessageDeletedForMe);
    };
  }, [myUserId, friend, onMessageSent]);

  // ✅ AUTO-SCROLL TO BOTTOM ONLY WHEN NEW MESSAGE ARRIVES
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, [messages.length]);

  // ✅ LISTEN FOR INCOMING CALLS from socket
  useEffect(() => {
    // Wait for socket to be initialized
    if (!socketRef.current) {
      return;
    }

    const handleIncomingCall = (data) => {
      // ✅ FILTER: Only show popup if THIS user is the receiver
      if (data.receiverId === myUserId) {
        setShowCallPopup(true);
      }
    };

    const handleCallEnded = (data) => {
      // Dismiss the popup regardless of who ended the call
      setShowCallPopup(false);
      setIsCallLoading(false);
    };

    socketRef.current?.on('incoming_call', handleIncomingCall);
    socketRef.current?.on('call_ended', handleCallEnded);

    return () => {
      socketRef.current?.off('incoming_call', handleIncomingCall);
      socketRef.current?.off('call_ended', handleCallEnded);
    };
  }, [myUserId]);

  // ✅ 18-SECOND TIMEOUT FOR INCOMING CALL POPUP - Auto dismiss if not answered
  useEffect(() => {
    if (showCallPopup) {
      callPopupTimeoutRef.current = setTimeout(() => {
        setShowCallPopup(false);
        setIsCallLoading(false);
      }, 18000);
    }
    
    return () => {
      if (callPopupTimeoutRef.current) {
        clearTimeout(callPopupTimeoutRef.current);
        callPopupTimeoutRef.current = null;
      }
    };
  }, [showCallPopup]);

  // ✅ TYPING INDICATOR - Emit typing events
  const handleTyping = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit('typing', { senderId: myUserId, receiverId: friend.id });
    }
    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socketRef.current?.emit('stop_typing', { senderId: myUserId, receiverId: friend.id });
    }, 2000);
  };

  // ✅ LISTEN FOR PARTNER TYPING EVENTS
  useEffect(() => {
    const handlePartnerTyping = (data) => {
      if (data.senderId === friend.id) {
        setIsPartnerTyping(true);
      }
    };
    const handlePartnerStopTyping = (data) => {
      if (data.senderId === friend.id) {
        setIsPartnerTyping(false);
      }
    };

    socketRef.current?.on('typing', handlePartnerTyping);
    socketRef.current?.on('stop_typing', handlePartnerStopTyping);

    return () => {
      socketRef.current?.off('typing', handlePartnerTyping);
      socketRef.current?.off('stop_typing', handlePartnerStopTyping);
    };
  }, [friend?.id]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ✅ CALL BUTTON HANDLER - Send call notification to friend
  const handleCallClick = () => {
    // ✅ CRITICAL: Check if socket is ready
    if (!socketRef.current) {
      alert('Socket connection not ready. Please try again in a moment.');
      return;
    }
    
    if (typeof socketRef.current.emit !== 'function') {
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
    
    // ✅ Emit socket event to notify the friend of incoming call
    socketRef.current.emit('init_call', callPayload);

    // ✅ SHOW INCOMING CALL SCREEN FOR CALLER (waiting for receiver to accept)
    setCallType('direct');
    setDirectCallData({
      callerId: callPayload.callerId,
      callerName: callPayload.callerName,
      receiverId: callPayload.receiverId,
      recipientName: callPayload.recipientName,
      callAccepted: false,
      isFriend: true
    });
  };

  // ✅ ACCEPT CALL HANDLER
  const handleAcceptCall = async () => {
    setIsCallLoading(true);
    
    // Simulate call setup delay
    setTimeout(() => {
      setShowCallPopup(false);
      setIsCallLoading(false);
    }, 1000);
  };

  // ✅ REJECT CALL HANDLER
  const handleRejectCall = () => {
    setShowCallPopup(false);
    setIsCallLoading(false);
  };

  // ============================================================
  // ✅ MESSAGE HOVER ACTIONS (WhatsApp/Instagram style)
  // ============================================================

  // Copy message text to clipboard
  const handleCopyMessage = (msg) => {
    if (msg.is_deleted) return;
    navigator.clipboard.writeText(msg.text).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
    setContextMenu(null);
  };

  // Delete for everyone (my message → both sides see "This message was deleted")
  const handleDeleteForEveryone = (msg) => {
    if (!msg.id) return;
    socketRef.current?.emit('delete_for_everyone', {
      messageId: msg.id,
      senderId: myUserId,
      receiverId: friend.id
    });
    setContextMenu(null);
  };

  // Delete for me (received message → only hides from my side)
  const handleDeleteForMe = (msg) => {
    if (!msg.id) return;
    socketRef.current?.emit('delete_for_me', {
      messageId: msg.id,
      userId: myUserId
    });
    // Immediately remove from UI
    setMessages(prev => prev.filter(m => m.id !== msg.id));
    setContextMenu(null);
  };

  // Reply to message
  const handleReplyMessage = (msg) => {
    if (msg.is_deleted) return;
    setReplyingTo({
      id: msg.id,
      text: msg.text,
      senderName: msg.me ? 'You' : friend.display_name,
      isMe: msg.me
    });
    setContextMenu(null);
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // ✅ MOBILE: Long press → bottom sheet, Swipe right → reply
  const handleTouchStart = (msg, index, e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    swipeTriggeredRef.current = false;
    setSwipeState({ index: null, deltaX: 0 });

    // Long press timer (500ms)
    longPressRef.current = setTimeout(() => {
      // Vibrate feedback if available
      if (navigator.vibrate) navigator.vibrate(30);
      setMobileSheet({ msg });
    }, 500);
  };

  const handleTouchMove = (msg, index, e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If swiping horizontally (more X than Y movement)
    if (Math.abs(deltaX) > 10 || deltaY > 10) {
      // Cancel long press if finger moves
      if (longPressRef.current) {
        clearTimeout(longPressRef.current);
        longPressRef.current = null;
      }
    }

    // Track right swipe (positive deltaX) for reply
    if (deltaX > 10 && deltaY < 40 && !msg.is_deleted) {
      const clampedDelta = Math.min(deltaX, 80);
      setSwipeState({ index, deltaX: clampedDelta });

      // Trigger reply at threshold
      if (deltaX > 60 && !swipeTriggeredRef.current) {
        swipeTriggeredRef.current = true;
        if (navigator.vibrate) navigator.vibrate(20);
      }
    }
  };

  const handleTouchEnd = (msg, index) => {
    // Clear long press timer
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }

    // If swipe was triggered → reply
    if (swipeTriggeredRef.current && msg && !msg.is_deleted) {
      handleReplyMessage(msg);
    }

    // Reset swipe animation
    setSwipeState({ index: null, deltaX: 0 });
    swipeTriggeredRef.current = false;
  };

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmoji) return;
    const handleClickOutside = (e) => {
      const pickerEl = document.querySelector('.emoji-picker-container');
      const btnEl = document.querySelector('.emoji-trigger-btn');
      if (pickerEl && !pickerEl.contains(e.target) && btnEl && !btnEl.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmoji]);

  // Close context menu ONLY on outside click (not on hover leave)
  useEffect(() => {
    if (!contextMenu) return;
    const handleClickOutside = (e) => {
      const menuEl = document.querySelector('.ctx-dropdown-menu');
      const dotBtns = document.querySelectorAll('.msg-dots-btn');
      // Don't close if clicking inside menu or on a dots button
      let clickedDots = false;
      dotBtns.forEach(btn => { if (btn.contains(e.target)) clickedDots = true; });
      if (clickedDots) return;
      if (!menuEl || !menuEl.contains(e.target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  // Find reply target message text
  const getReplyPreviewText = (replyToId) => {
    if (!replyToId) return null;
    const targetMsg = messages.find(m => m.id === replyToId);
    if (!targetMsg) return null;
    return {
      text: targetMsg.is_deleted ? 'This message was deleted' : targetMsg.text,
      senderName: targetMsg.me ? 'You' : friend.display_name
    };
  };

  // ============================================================
  // ✅ RENDER MESSAGE BUBBLE WITH HOVER ACTIONS
  // ============================================================
  const renderMessageBubble = (m, i) => {
    // Skip call messages that shouldn't be shown
    if (m.message_type === 'missed_call' && !m.me) {
      return renderMissedCallBubble(m, i);
    }
    if (m.message_type === 'outgoing_call' && m.me) {
      return renderOutgoingCallBubble(m, i);
    }
    if (m.message_type === 'missed_call' || m.message_type === 'outgoing_call') {
      return null;
    }

    const isHovered = hoveredMsgIndex === i;
    const replyPreview = getReplyPreviewText(m.reply_to_id);

     return (
      <div
        key={m.id || i}
        className="message-wrapper"
        style={{
          alignSelf: m.me ? 'flex-end' : 'flex-start',
          position: 'relative',
          maxWidth: '85%',
          padding: m.me ? '2px 0 2px 64px' : '2px 64px 2px 0',
        }}
        onMouseEnter={() => setHoveredMsgIndex(i)}
        onMouseLeave={() => setHoveredMsgIndex(null)}
        onTouchStart={(e) => handleTouchStart(m, i, e)}
        onTouchMove={(e) => handleTouchMove(m, i, e)}
        onTouchEnd={() => handleTouchEnd(m, i)}
        onTouchCancel={() => handleTouchEnd(m, i)}
      >
        {/* ✅ HOVER ACTION ICONS - Outer side of bubble */}
        <div
          className="message-actions"
          style={{
            position: 'absolute',
            ...(m.me
              ? { left: '-10px', right: 'auto' }
              : { right: '-10px', left: 'auto' }),
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: (isHovered || contextMenu?.index === i) ? 1 : 0,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: (isHovered || contextMenu?.index === i) ? 'auto' : 'none',
            zIndex: 10,
          }}
        >
          {/* Reply Button */}
          {!m.is_deleted && (
            <button
              onClick={(e) => { e.stopPropagation(); handleReplyMessage(m); }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(6px)',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                fontSize: '15px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#a5b4fc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
              title="Reply"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>reply</span>
            </button>
          )}

          {/* 3-dot Menu Button */}
          <button
            className="msg-dots-btn"
            onClick={(e) => {
              e.stopPropagation();
              // Toggle: close if same menu already open
              if (contextMenu?.index === i) {
                setContextMenu(null);
                return;
              }
              const rect = e.currentTarget.getBoundingClientRect();
              setContextMenu({ 
                index: i, 
                x: rect.left, 
                y: rect.bottom + 4,
                msg: m 
              });
            }}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(6px)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#a5b4fc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
            title="More"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>more_vert</span>
          </button>
        </div>

        {/* ✅ Swipe reply indicator icon */}
        {swipeState.index === i && swipeState.deltaX > 20 && (
          <div
            className={`swipe-reply-icon ${swipeState.deltaX > 40 ? 'visible' : ''}`}
            style={{
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: `translateY(-50%) scale(${Math.min(swipeState.deltaX / 60, 1)})`,
              transition: 'transform 0.1s ease',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: swipeState.deltaX > 60 ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: Math.min(swipeState.deltaX / 40, 1),
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: swipeState.deltaX > 60 ? '#a5b4fc' : '#94a3b8' }}>reply</span>
          </div>
        )}

        {/* ✅ MESSAGE BUBBLE */}
        <div
          style={{
            position: 'relative',
            transform: swipeState.index === i ? `translateX(${swipeState.deltaX}px)` : 'translateX(0)',
            transition: swipeState.index === i ? 'none' : 'transform 0.3s ease',
            maxWidth: '100%',
          }}
        >
          {/* Reply Preview inside bubble */}
          {replyPreview && !m.is_deleted && (
            <div
              style={{
                padding: '6px 10px',
                marginBottom: '-6px',
                borderRadius: m.me ? '18px 18px 0 0' : '18px 18px 0 0',
                background: m.me 
                  ? 'rgba(99, 102, 241, 0.35)' 
                  : 'rgba(55, 65, 81, 0.5)',
                borderLeft: '3px solid #818cf8',
                fontSize: '12px',
                color: '#c4b5fd',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '11px', color: '#a78bfa', marginBottom: '1px' }}>
                {replyPreview.senderName}
              </div>
              <div style={{ opacity: 0.8 }}>
                {replyPreview.text.length > 50 ? replyPreview.text.substring(0, 50) + '...' : replyPreview.text}
              </div>
            </div>
          )}

          {/* Actual message content */}
          {m.is_deleted ? (
            <div
              className={m.me ? 'message-bubble-right' : 'message-bubble-left'}
              style={{
                padding: '8px 16px',
                borderRadius: m.me ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                alignSelf: m.me ? 'flex-end' : 'flex-start',
                background: m.me 
                  ? 'rgba(99, 102, 241, 0.15)' 
                  : 'rgba(55, 65, 81, 0.3)',
                border: '1px dashed rgba(148, 163, 184, 0.2)',
                fontSize: '13px',
                color: 'rgba(148, 163, 184, 0.6)',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', opacity: 0.5 }}>block</span>
              This message was deleted
            </div>
          ) : (
            <div
              className={`${m.me ? 'message-bubble-right bg-indigo-600 dark:bg-indigo-600 text-white' : 'message-bubble-left bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} px-4 py-2 text-sm max-w-full shadow-md leading-relaxed tracking-wide rounded-[18px]`}
              style={{ 
                borderRadius: m.me ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                ...(m.me ? { boxShadow: '0 2px 8px rgba(99,102,241,0.25)' } : { alignSelf: 'flex-start' }),
                ...(replyPreview ? { borderTopLeftRadius: '0', borderTopRightRadius: '0' } : {})
              }}
            >
              {m.text}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Missed call bubble
  const renderMissedCallBubble = (m, i) => (
    <div
      key={m.id || i}
      onClick={handleCallClick}
      style={{
        alignSelf: 'center',
        width: '85%',
        background: 'rgba(30, 30, 40, 0.85)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '14px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(40, 40, 55, 0.95)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 30, 40, 0.85)'}
      title="Tap to call back"
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: '20px', transform: 'rotate(135deg)' }}>call</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', lineHeight: '1.3' }}>Missed call</div>
        <div style={{ color: 'rgba(156, 163, 175, 0.8)', fontSize: '12px', marginTop: '2px' }}>Tap to call back</div>
      </div>
      <div style={{ color: 'rgba(156, 163, 175, 0.6)', fontSize: '11px', flexShrink: 0 }}>
        {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      </div>
    </div>
  );

  // Outgoing call bubble
  const renderOutgoingCallBubble = (m, i) => (
    <div
      key={m.id || i}
      style={{
        alignSelf: 'center',
        width: '85%',
        background: 'linear-gradient(135deg, rgba(25, 25, 50, 0.9), rgba(35, 30, 55, 0.9))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '14px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 2px 12px rgba(99, 102, 241, 0.15), 0 1px 4px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(129, 140, 248, 0.15))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ color: '#818cf8', fontSize: '20px' }}>videocam</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#c4b5fd', fontSize: '14px', fontWeight: '600', lineHeight: '1.3' }}>Video call</div>
        <div style={{ color: 'rgba(156, 163, 175, 0.7)', fontSize: '12px', marginTop: '2px' }}>Not answered</div>
      </div>
      <div style={{ color: 'rgba(156, 163, 175, 0.5)', fontSize: '11px', flexShrink: 0 }}>
        {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      </div>
    </div>
  );

  return (
    <>
    <style>{`
      @keyframes typingBounce {
        0%, 60%, 100% { 
          transform: translateY(0); 
          opacity: 0.4; 
        }
        30% { 
          transform: translateY(-6px); 
          opacity: 1; 
        }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(6px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes slideInReply {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes toastSlide {
        0% { opacity: 0; transform: translate(-50%, 10px); }
        10% { opacity: 1; transform: translate(-50%, 0); }
        90% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -10px); }
      }
      .encryption-banner {
        position: sticky;
        top: 2px;
        z-index: 10;
        text-align: center;
        padding: 5px 12px;
        font-size: 11px;
        color: #aab3c5;
        backdrop-filter: blur(10px);
        background: rgba(10, 20, 40, 0.65);
        border-radius: 8px;
        margin: 0 auto;
        transform: translateX(-16px);
        width: fit-content;
      }
      .ctx-menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        cursor: pointer;
        transition: background 0.15s ease;
        font-size: 13px;
        color: #e2e8f0;
        border-radius: 8px;
        white-space: nowrap;
      }
      .ctx-menu-item:hover {
        background: rgba(99, 102, 241, 0.2);
      }
      .ctx-menu-item.danger {
        color: #f87171;
      }
      .ctx-menu-item.danger:hover {
        background: rgba(239, 68, 68, 0.15);
      }
      /* ✅ Hide action icons on mobile (long-press used instead) */
      @media (max-width: 768px) {
        .message-actions {
          display: none !important;
        }
        .message-wrapper {
          padding-right: 2px !important;
          padding-left: 2px !important;
        }
      }
      /* Mobile Popup styles */
      @keyframes popupFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .mobile-popup-overlay {
        position: fixed;
        inset: 0;
        z-index: 9998;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
        animation: popupFadeIn 0.2s ease-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .mobile-popup {
        width: 240px;
        background: rgba(15, 23, 42, 0.98);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 16px;
        padding: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        animation: popupFadeIn 0.2s ease-out;
      }
      .popup-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        cursor: pointer;
        font-size: 15px;
        color: #e2e8f0;
        border-radius: 12px;
        transition: background 0.15s ease;
      }
      .popup-item:active {
        background: rgba(99, 102, 241, 0.15);
      }
      .popup-item.danger {
        color: #f87171;
      }
      .popup-item.danger:active {
        background: rgba(239, 68, 68, 0.12);
      }
      /* Swipe reply indicator */
      .swipe-reply-icon {
        position: absolute;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        transition: opacity 0.15s ease;
      }
      .swipe-reply-icon.visible {
        opacity: 1;
      }
    `}</style>
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
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-cyan-500/20" style={{ overflow: 'hidden' }}>
              {friend.photo_url ? (
                <img src={friend.photo_url} alt={friend.display_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                friend.display_name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-[15px]">
                {friend.display_name}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${friendOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-[12px] text-gray-600 dark:text-gray-300 font-medium">
                  {friendOnline === null ? '...' : friendOnline ? 'Active' : `Last seen ${getTimeAgo(friendLastSeen)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleCallClick}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer hover:scale-110"
          title="Video Call"
          style={{ 
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            boxShadow: '0 0 12px rgba(124, 58, 237, 0.6)',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: '22px' }}>videocam</span>
        </button>
      </div>

      {/* MESSAGES - Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1 space-y-1 flex flex-col relative" style={{ scrollBehavior: 'smooth' }}>
        <div className="encryption-banner">
          🔒 Encrypted
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Start a conversation with {friend.display_name}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-end space-y-1">
            {messages.map((m, i) => renderMessageBubble(m, i))}
            
            {/* ✅ TYPING INDICATOR - Animated bouncing dots with avatar */}
            {isPartnerTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                {/* Mini avatar */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {friend.photo_url ? (
                    <img src={friend.photo_url} alt={friend.display_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    friend.display_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                {/* Dots bubble */}
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '18px 18px 18px 4px',
                    backgroundColor: 'rgba(55, 65, 81, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minWidth: '62px',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: '#a0aec0', display: 'inline-block',
                    animation: 'typingBounce 1.4s infinite ease-in-out both',
                    animationDelay: '0s'
                  }} />
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: '#a0aec0', display: 'inline-block',
                    animation: 'typingBounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.2s'
                  }} />
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: '#a0aec0', display: 'inline-block',
                    animation: 'typingBounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.4s'
                  }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ✅ REPLY PREVIEW BAR (above input) */}
      {replyingTo && (
        <div
          style={{
            padding: '10px 16px',
            background: 'rgba(99, 102, 241, 0.08)',
            borderTop: '1px solid rgba(99, 102, 241, 0.15)',
            borderLeft: '3px solid #6366f1',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInReply 0.25s ease-out',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#818cf8', fontSize: '18px', flexShrink: 0 }}>reply</span>
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: '600', marginBottom: '1px' }}>
              Replying to {replyingTo.senderName}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#94a3b8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {replyingTo.text.length > 60 ? replyingTo.text.substring(0, 60) + '...' : replyingTo.text}
            </div>
          </div>
          <button
            onClick={cancelReply}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#64748b'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
          </button>
        </div>
      )}

      {/* INPUT - Footer */}
      <div className="p-6 border-t border-gray-200/50 dark:border-white/10 relative">
        {showEmoji && !isMobile && (
          <div className="emoji-picker-container" style={{ position: 'absolute', bottom: '80px', left: '24px', zIndex: 50 }}>
            <EmojiPicker 
              theme="dark" 
              onEmojiClick={(emoji) => setText(prev => prev + emoji.emoji)} 
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          {!isMobile && (
            <button
              className="emoji-trigger-btn text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              onClick={() => setShowEmoji(!showEmoji)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>sentiment_satisfied</span>
            </button>
          )}
          <div className="relative flex-1">
            <input
              value={text}
              onChange={(e) => { setText(e.target.value); handleTyping(); }}
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

      {/* ✅ CONTEXT MENU (3-dot dropdown) */}
      {contextMenu && (
        <div
          className="ctx-dropdown-menu"
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: `${Math.min(contextMenu.x, window.innerWidth - 180)}px`,
            top: `${Math.min(contextMenu.y, window.innerHeight - 120)}px`,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '14px',
            padding: '6px',
            minWidth: '160px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
            animation: 'fadeInUp 0.2s ease-out',
          }}
        >
          {/* Copy option */}
          {!contextMenu.msg?.is_deleted && (
            <div
              className="ctx-menu-item"
              onClick={() => handleCopyMessage(contextMenu.msg)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#818cf8' }}>content_copy</span>
              Copy Message
            </div>
          )}

          {/* Smart Delete: sender → delete for everyone, receiver → delete for me */}
          {!contextMenu.msg?.is_deleted && (
            <>
              <div style={{ height: '1px', background: 'rgba(99,102,241,0.1)', margin: '4px 8px' }} />
              {contextMenu.msg?.me ? (
                /* Sender's message → Delete for everyone */
                <div
                  className="ctx-menu-item danger"
                  onClick={() => handleDeleteForEveryone(contextMenu.msg)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_forever</span>
                  Delete for everyone
                </div>
              ) : (
                /* Received message → Delete for me only */
                <div
                  className="ctx-menu-item danger"
                  onClick={() => handleDeleteForMe(contextMenu.msg)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                  Delete for me
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ✅ COPIED TOAST */}
      {showCopiedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'rgba(99, 102, 241, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
            animation: 'toastSlide 2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
          Message copied
        </div>
      )}

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

      {/* ✅ MOBILE POPUP (long-press menu) */}
      {mobileSheet && (
        <div className="mobile-popup-overlay" onClick={() => setMobileSheet(null)}>
          <div className="mobile-popup" onClick={(e) => e.stopPropagation()}>
            {/* Copy */}
            {!mobileSheet.msg?.is_deleted && (
              <div className="popup-item" onClick={() => { handleCopyMessage(mobileSheet.msg); setMobileSheet(null); }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#818cf8' }}>content_copy</span>
                Copy Message
              </div>
            )}

            {/* Smart Delete */}
            {!mobileSheet.msg?.is_deleted && (
              <>
                <div style={{ height: '1px', background: 'rgba(99,102,241,0.1)', margin: '4px 8px' }} />
                {mobileSheet.msg?.me ? (
                  <div className="popup-item danger" onClick={() => { handleDeleteForEveryone(mobileSheet.msg); setMobileSheet(null); }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete_forever</span>
                    Delete for everyone
                  </div>
                ) : (
                  <div className="popup-item danger" onClick={() => { handleDeleteForMe(mobileSheet.msg); setMobileSheet(null); }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    Delete for me
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ChatBox;
