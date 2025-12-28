import { useState, useEffect } from 'react';
import socket from '../services/socketService';

const ChatBox = ({ friend, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  
  // Get current user UUID from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const myUserId = currentUser.uuid || currentUser.id; // UUID only

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

  // ✅ LOAD CHAT HISTORY when chat opens
  useEffect(() => {
    if (!myUserId || !friend?.id) return;

    fetch(`/api/messages?user1=${myUserId}&user2=${friend.id}`)
      .then(res => res.json())
      .then(data => {
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
        console.error("Failed to load chat history", err);
      });
  }, [myUserId, friend]);

  const send = () => {
    if (!text.trim()) return;

    // ✅ SEND MESSAGE VIA SOCKET AND SAVE TO DB
    socket.emit('send_message', {
      senderId: myUserId,
      receiverId: friend.id, // UUID from friend object
      message: text
    });

    // Add to local messages immediately
    setMessages(prev => [...prev, { me: true, text }]);
    setText('');
  };

  // ✅ RECEIVE MESSAGES FROM SOCKET (from shared room)
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages(prev => [
        ...prev,
        { me: data.senderId === myUserId, text: data.message }
      ]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => socket.off('receive_message', handleReceiveMessage);
  }, [myUserId]);

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
