import { useState, useRef, useEffect } from 'react'
import { FaTimes, FaPaperPlane } from 'react-icons/fa'
import './ContactChat.css'

const ContactChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi 👋 How can we help you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [hasSentFullResponse, setHasSentFullResponse] = useState(false)
  const messagesEndRef = useRef(null)

  const categories = [
    { id: 'billing', label: '💳 Payment & Billing', icon: 'flag' },
    { id: 'video', label: '📹 Video / Connection Issue', icon: 'settings_input_component' },
    { id: 'other', label: '❓ Other Question', icon: 'help_outline' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const randomDelay = 1000 + Math.random() * 1500

    // After a random delay, show auto-reply
    setTimeout(() => {
      let autoReplyMessage;

      if (!hasSentFullResponse) {
        autoReplyMessage = {
          id: Date.now() + 1,
          html: true,
          text: 'Please contact our support team at:<br/><br/>📧 <a href="mailto:contact.flinxx@gmail.com" style="color: #D4AF37; text-decoration: underline; font-weight: 600;">contact.flinxx@gmail.com</a><br/><br/>Our team will respond within 24 working hours.',
          sender: 'assistant',
          timestamp: new Date()
        }
        setHasSentFullResponse(true)
      } else {
        autoReplyMessage = {
          id: Date.now() + 1,
          html: true,
          text: 'Thanks! Your request has been received 👍<br/>Our support team will respond within 24 working hours.',
          sender: 'assistant',
          timestamp: new Date()
        }
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, autoReplyMessage])
    }, randomDelay)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={`support-panel fixed bottom-6 right-6 w-[380px] bg-[#0B0B0B] rounded-2xl border border-[#D4AF37]/40 overflow-hidden z-50 ${selectedCategory ? 'chat-mode' : 'category-mode'}`} 
      style={{ boxShadow: '0 0 20px rgba(212, 175, 55, 0.15), 0 20px 50px rgba(0, 0, 0, 0.9)' }}
    >
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between bg-[#0B0B0B] flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[#D4AF37] hover:text-white transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <span className="text-[20px]">←</span>
            </button>
          )}
          <span className="font-bold text-sm font-display text-[#D4AF37] tracking-widest uppercase truncate max-w-[200px]">
            {selectedCategory ? selectedCategory.label : 'Flinxx Support'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close chat"
        >
          <FaTimes size={20} />
        </button>
      </header>

      {/* Content */}
      <div className={`flex flex-col overflow-hidden ${selectedCategory ? 'chat-body' : 'flex-1'}`}>
        {!selectedCategory ? (
          <>
            {/* Initial Help Message */}
            <div className="px-6 pb-6 pt-2 space-y-2 flex-shrink-0">
              <p className="text-white text-2xl font-bold leading-tight font-display">Hi 👋 How can we help you today?</p>
              <p className="text-slate-400 text-sm font-medium">Our support team is available to assist you.</p>
            </div>

            {/* Category Buttons */}
            <div className="px-6 pb-6 flex flex-col gap-3 overflow-y-auto flex-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="flex items-center w-full p-4 bg-[#0B0B0B] hover:bg-white/[0.03] text-white text-sm font-semibold rounded-xl border border-[#D4AF37]/40 transition-all group"
                >
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Messages Container */}
            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] rounded-br-none'
                        : 'bg-slate-800/50 text-slate-300 rounded-bl-none'
                    }`}
                  >
                    {message.html ? (
                      <div className="text-sm break-words" dangerouslySetInnerHTML={{ __html: message.text }} />
                    ) : (
                      <p className="text-sm break-words">{message.text}</p>
                    )}
                    <span className={`text-xs mt-1 block ${message.sender === 'user' ? 'text-[#D4AF37]/60' : 'text-slate-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 rounded-lg rounded-bl-none px-4 py-3 max-w-xs">
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {/* Input Area */}
      {selectedCategory && (
        <div className="chat-input p-6 bg-[#0B0B0B] border-t border-white/5 flex-shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your issue..."
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/40 rounded-xl py-4 px-5 pr-12 text-sm text-white focus:outline-none focus:border-[#D4AF37]/80 focus:ring-1 focus:ring-[#D4AF37]/80 transition-all placeholder:text-slate-600"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-4 text-[#D4AF37] hover:text-white transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactChat
