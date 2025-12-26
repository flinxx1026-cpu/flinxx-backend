import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import '../styles/ChatPanel.css';

const ChatPanel = () => {
  const { friendId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const friendName = location.state?.name || 'Friend';
  const friendPhoto = location.state?.photo || '👤';

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages(prev => [
      ...prev,
      { 
        id: Date.now(),
        fromMe: true, 
        text,
        timestamp: new Date()
      }
    ]);
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        <button 
          className="chat-back-btn"
          onClick={() => navigate(-1)}
          title="Go back"
        >
          ←
        </button>
        {friendPhoto && friendPhoto !== '👤' ? (
          <img 
            src={friendPhoto} 
            alt={friendName}
            className="chat-avatar"
          />
        ) : (
          <div className="chat-avatar-placeholder">👤</div>
        )}
        <span className="chat-friend-name">{friendName}</span>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <p>Start a conversation with {friendName}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.fromMe ? 'me' : 'them'}`}
            >
              <span className="chat-bubble-text">{msg.text}</span>
              <span className="chat-bubble-time">
                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button 
          onClick={sendMessage}
          className="chat-send-btn"
          title="Send message"
        >
          ✈️
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
