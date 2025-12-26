import { useState, useEffect } from 'react';
import socket from '../services/socketService';

const ChatBox = ({ friend, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  
  // Get current user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const myUserId = currentUser.id || currentUser.publicId;

  const send = () => {
    if (!text.trim()) return;

    // ✅ SEND MESSAGE VIA SOCKET AND SAVE TO DB
    socket.emit('send_message', {
      senderId: myUserId,
      receiverId: friend.id,
      message: text
    });

    // Add to local messages immediately
    setMessages(prev => [...prev, { me: true, text }]);
    setText('');
  };

  // ✅ RECEIVE MESSAGES FROM SOCKET
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages(prev => [
        ...prev,
        { me: false, text: data.message }
      ]);
    });

    return () => socket.off('receive_message');
  }, []);

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
