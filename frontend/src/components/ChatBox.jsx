import { useState, useEffect, useContext } from 'react';
import socket from '../services/socketService';
import { markMessagesAsRead, getUnreadCount } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ChatBox = ({ friend, onBack, onMessageSent }) => {
  const { user } = useContext(AuthContext) || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  
  // Get current user UUID from AuthContext (source of truth)
  const myUserId = user?.uuid;

  // ✅ STRICT VALIDATION: Block everything until valid UUID exists
  if (!myUserId || typeof myUserId !== 'string' || myUserId.length !== 36) {
    console.log('⏳ ChatBox: Waiting for valid UUID from AuthContext');
    return null;
  }

  if (!friend?.id || typeof friend.id !== 'string' || friend.id.length !== 36) {
    console.error('❌ ChatBox: Invalid friend UUID:', friend?.id);
    return null;
  }

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
    
    socket.emit('join_chat', {
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
        }

        // Refresh unread count in background (TopActions polls, but fetch once immediately)
        const count = await getUnreadCount(myUserId);
        console.log('📬 Unread count after mark-read:', count);
      } catch (error) {
        console.error('❌ Error marking messages as read:', error);
      }
    };

    markRead();
  }, [friend?.id, myUserId]);

  // ✅ LOAD CHAT HISTORY when chat opens
  useEffect(() => {
    if (!myUserId || !friend?.id) {
      console.log('⏳ ChatBox: Waiting for myUserId or friend.id', { myUserId, friendId: friend?.id });
      return;
    }

    console.log('📨 ChatBox: Loading messages for friend:', { myUserId, friendId: friend.id, friendName: friend.display_name });

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const messagesUrl = `${BACKEND_URL}/api/messages?user1=${myUserId}&user2=${friend.id}`;
    
    console.log("📨 Fetching chat history from:", messagesUrl);
    
    fetch(messagesUrl)
      .then(res => {
        console.log("📨 Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("📨 Messages loaded:", data.length, 'messages');
        if (Array.isArray(data)) {
          setMessages(
            data.map(m => ({
              me: m.sender_id === myUserId,
              text: m.message
            }))
          );
        }
      })
      .catch(err => {
        console.error("❌ Failed to load chat history:", err);
      });
  }, [myUserId, friend]);

  const send = () => {
    if (!text.trim()) return;

    const now = new Date().toISOString();

    // ✅ SEND MESSAGE VIA SOCKET AND SAVE TO DB
    socket.emit('send_message', {
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

    socket.on('receive_message', handleReceiveMessage);

    return () => socket.off('receive_message', handleReceiveMessage);
  }, [myUserId, friend, onMessageSent]);

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
