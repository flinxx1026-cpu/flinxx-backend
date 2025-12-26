import { useState } from 'react';

const ChatBox = ({ friend, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, { me: true, text }]);
    setText('');
  };

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
