import { useState, useEffect, useContext, useRef } from 'react';
// ✅ DEFERRED: Socket is loaded dynamically to avoid TDZ
// import socket from '../services/socketService';
import { markMessagesAsRead } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useUnreadSafe } from '../context/UnreadContext';

const ChatBox = ({ friend, onBack, onMessageSent }) => {
  const socketRef = useRef(null);
  const { user } = useContext(AuthContext) || {};
  const { refetchUnreadCount } = useUnreadSafe();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [friendRequestStatus, setFriendRequestStatus] = useState('none');
  const [sendingRequest, setSendingRequest] = useState(false);
  
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

  // ✅ LAZY LOAD SOCKET - Dynamically import socket to avoid TDZ
  useEffect(() => {
    const loadSocket = async () => {
      try {
        const socketModule = await import('../services/socketService');
        socketRef.current = socketModule.default;
        console.log('✅ Socket loaded in ChatBox');
      } catch (error) {
        console.error('❌ Failed to load socket in ChatBox:', error.message);
        socketRef.current = {
          on: () => {},
          off: () => {},
          emit: () => {}
        };
      }
    };
    
    loadSocket();
  }, []);

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

  // ✅ CHECK FRIEND REQUEST STATUS when chat opens
  useEffect(() => {
    if (!myUserId || !friend?.id) {
      console.warn('⚠️ [FRIEND STATUS] Skipping status check - missing IDs');
      console.warn('   myUserId:', myUserId);
      console.warn('   friend?.id:', friend?.id);
      return;
    }

    const checkFriendStatus = async () => {
      console.log('\n📋 [FRIEND STATUS] Checking friend request status...');
      console.log('📋 [FRIEND STATUS] Endpoint: /api/friends/status');
      console.log('📋 [FRIEND STATUS] Query params:', {
        senderPublicId: myUserId,
        receiverPublicId: friend.id,
        friendName: friend.display_name
      });

      try {
        const statusUrl = `${BACKEND_URL}/api/friends/status?senderPublicId=${myUserId}&receiverPublicId=${friend.id}`;
        console.log('📋 [FRIEND STATUS] Full URL:', statusUrl);
        
        const response = await fetch(statusUrl, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('📬 [FRIEND STATUS] Response received:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ [FRIEND STATUS] Status API success');
          console.log('✅ [FRIEND STATUS] Response data:', data);
          console.log('✅ [FRIEND STATUS] Status value:', data.status);
          setFriendRequestStatus(data.status);
          console.log('✅ [FRIEND STATUS] State updated to:', data.status);
        } else {
          console.error('❌ [FRIEND STATUS] API error status:', response.status);
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ [FRIEND STATUS] Error response:', errorData);
        }
      } catch (error) {
        console.error('❌ [FRIEND STATUS] Network error:', error.message);
        console.error('❌ [FRIEND STATUS] Full error:', error);
      }
    };

    checkFriendStatus();
  }, [myUserId, friend?.id, BACKEND_URL]);

  // ✅ SEND FRIEND REQUEST via existing API
  const sendFriendRequest = async () => {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 [FRIEND REQUEST] ========== FUNCTION TRIGGERED ==========');
    console.log('='.repeat(80));
    console.log('⏱️  Timestamp:', new Date().toISOString());
    
    // ========== DEBUG #1: Log all user context ==========
    console.log('\n📊 [DEBUG #1] SENDER IDENTITY CHECK');
    console.log('   currentUser (from AuthContext):', {
      uuid: user?.uuid,
      name: user?.name,
      email: user?.email,
      picture: user?.picture
    });
    console.log('   myUserId (extracted from user.uuid):', myUserId);
    console.log('   myUserId type:', typeof myUserId);
    console.log('   myUserId length:', myUserId?.length);
    console.log('   user object exists:', !!user);
    console.log('   user.uuid exists:', !!user?.uuid);
    
    // ========== DEBUG #2: Log receiver/friend details ==========
    console.log('\n📊 [DEBUG #2] RECEIVER IDENTITY CHECK');
    console.log('   selectedUser (friend prop):', {
      id: friend?.id,
      uuid: friend?.uuid,
      publicId: friend?.publicId,
      display_name: friend?.display_name,
      photo_url: friend?.photo_url
    });
    console.log('   friend.id type:', typeof friend?.id);
    console.log('   friend.id length:', friend?.id?.length);
    console.log('   friend object exists:', !!friend);
    
    // ========== DEBUG #3: Check for early returns ==========
    console.log('\n📊 [DEBUG #3] EARLY RETURN CHECKS');
    console.log('   myUserId exists:', !!myUserId);
    console.log('   friend?.id exists:', !!friend?.id);
    console.log('   friendRequestStatus:', friendRequestStatus);
    console.log('   sendingRequest:', sendingRequest);
    
    // ========== VALIDATION CHECK 1: Verify user and friend IDs ==========
    console.log('\n✅ [VALIDATION #1] Checking required IDs...');
    if (!myUserId) {
      console.error('❌ [VALIDATION #1] FAILED: myUserId is missing!');
      console.error('   DEBUG INFO:', {
        user_exists: !!user,
        user_uuid: user?.uuid,
        extraction_method: 'user?.uuid'
      });
      alert('Error: Current user ID not available in AuthContext');
      return;
    }
    
    if (!friend?.id) {
      console.error('❌ [VALIDATION #1] FAILED: friend.id is missing!');
      console.error('   DEBUG INFO:', {
        friend_exists: !!friend,
        friend_keys: friend ? Object.keys(friend) : 'null',
        available_ids: {
          id: friend?.id,
          uuid: friend?.uuid,
          publicId: friend?.publicId
        }
      });
      alert('Error: Receiver ID not available in friend object');
      return;
    }
    console.log('✅ [VALIDATION #1] PASSED: Both IDs exist');
    
    // ========== VALIDATION CHECK 2: Prevent duplicate friend request ==========
    console.log('\n✅ [VALIDATION #2] Checking duplicate prevention...');
    if (friendRequestStatus === 'pending') {
      console.log('❌ [VALIDATION #2] BLOCKED: Friend request already PENDING');
      return;
    }
    if (friendRequestStatus === 'accepted') {
      console.log('❌ [VALIDATION #2] BLOCKED: Already FRIENDS with this user');
      return;
    }
    console.log('✅ [VALIDATION #2] PASSED: Status is "none" - OK to send');
    
    console.log('\n✅ ALL VALIDATIONS PASSED - PROCEEDING WITH API CALL');
    
    setSendingRequest(true);
    try {
      const payload = {
        senderPublicId: myUserId,
        receiverPublicId: friend.id
      };

      console.log('\n📤 [API REQUEST] Building request...');
      console.log('   Endpoint:', `${BACKEND_URL}/api/friends/send`);
      console.log('   Method:', 'POST');
      console.log('   Payload:', JSON.stringify(payload, null, 2));
      console.log('   Content-Type:', 'application/json');
      console.log('   Authorization:', `Bearer ${localStorage.getItem('token')?.substring(0, 20)}...`);
      
      console.log('\n📤 [API REQUEST] Sending request...');
      const response = await fetch(`${BACKEND_URL}/api/friends/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      console.log('\n📥 [API RESPONSE] Response received');
      console.log('   Status Code:', response.status);
      console.log('   Status Text:', response.statusText);
      console.log('   OK:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ [API RESPONSE] SUCCESS (200)');
        console.log('   Response Data:', responseData);
        setFriendRequestStatus('pending');
        console.log('✅ [STATE UPDATE] friendRequestStatus set to "pending"');
        console.log('✅ [SUCCESS] Friend request sent to:', friend.display_name);
        alert(`✅ Friend request sent to ${friend.display_name}!`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [API RESPONSE] ERROR (' + response.status + ')');
        console.error('   Error Data:', errorData);
        console.error('   Error Message:', errorData.error || 'Unknown error');
        alert(errorData.error || `Failed to send friend request (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('\n❌ [NETWORK ERROR] Request failed');
      console.error('   Error Name:', error.name);
      console.error('   Error Message:', error.message);
      console.error('   Error Stack:', error.stack);
      console.error('   Full Error:', error);
      alert('Error sending friend request: ' + error.message);
    } finally {
      setSendingRequest(false);
      console.log('\n🎯 [FUNCTION COMPLETE] sendFriendRequest finished');
      console.log('='.repeat(80) + '\n');
    }
  };

  // ✅ GET FRIEND BUTTON TEXT AND STYLE based on status
  const getFriendButtonConfig = () => {
    let config;
    switch (friendRequestStatus) {
      case 'pending':
        config = {
          text: '⏳ SENT',
          disabled: true,
          bgColor: 'rgba(212, 175, 55, 0.1)',
          textColor: '#D4AF37',
          borderColor: '#D4AF37',
          opacity: 0.6
        };
        break;
      case 'accepted':
        config = {
          text: '💬 FRIENDS',
          disabled: true,
          bgColor: 'rgba(16, 185, 129, 0.1)',
          textColor: '#10b981',
          borderColor: '#10b981',
          opacity: 0.8
        };
        break;
      default:
        config = {
          text: '🤝 ADD FRIEND',
          disabled: false,
          bgColor: 'rgba(16, 185, 129, 0.2)',
          textColor: '#fff',
          borderColor: '#10b981',
          opacity: 1
        };
    }
    console.log('🎨 [BUTTON CONFIG] Status:', friendRequestStatus, '-> ', config);
    return config;
  };

  const friendBtnConfig = getFriendButtonConfig();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-box">
      {/* HEADER */}
      <div className="chat-header">
        <button onClick={onBack}>←</button>
        <img src={friend.photo_url} alt={friend.display_name} />
        <span>{friend.display_name}</span>
        
        {/* ✅ FRIEND REQUEST BUTTON - Reuses existing API */}
        <button
          className="friend-request-btn"
          title={friendBtnConfig.text}
          onClick={(e) => {
            console.log('\n' + '='.repeat(80));
            console.log('🖱️  [BUTTON CLICK] ========== BUTTON CLICKED ==========');
            console.log('='.repeat(80));
            console.log('⏱️  Timestamp:', new Date().toISOString());
            console.log('🖱️  Button Text:', friendBtnConfig.text);
            console.log('🖱️  Button Disabled:', friendBtnConfig.disabled);
            console.log('🖱️  Sending Request:', sendingRequest);
            console.log('🖱️  Button Enabled (effective):', !(friendBtnConfig.disabled || sendingRequest));
            console.log('🖱️  Event Type:', e.type);
            console.log('🖱️  Event Target Tag:', e.target.tagName);
            console.log('🖱️  Current State:', {
              myUserId,
              friendId: friend?.id,
              friendName: friend?.display_name,
              status: friendRequestStatus
            });
            
            // ✅ Check if button is actually clickable
            if (friendBtnConfig.disabled || sendingRequest) {
              console.log('⛔️  Button is DISABLED - action blocked');
              return;
            }
            
            console.log('✅ Button is ENABLED - proceeding to call sendFriendRequest()');
            sendFriendRequest();
          }}
          disabled={friendBtnConfig.disabled || sendingRequest}
          style={{
            backgroundColor: friendBtnConfig.bgColor,
            color: friendBtnConfig.textColor,
            border: `1px solid ${friendBtnConfig.borderColor}`,
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: friendBtnConfig.disabled || sendingRequest ? 'not-allowed' : 'pointer',
            opacity: friendBtnConfig.opacity,
            transition: 'all 0.2s ease',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}
        >
          {sendingRequest ? '⏳' : friendBtnConfig.text}
        </button>

        <button className="call-button" title="Call">📞</button>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {messages.length === 0 && (
          <p className="empty">
            Start a conversation with {friend.display_name}
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.me ? 'me' : ''}`}>
            {m.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message…"
        />
        <button onClick={send}>➤</button>
      </div>
    </div>
  );
};

export default ChatBox;
