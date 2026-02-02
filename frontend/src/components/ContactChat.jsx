import { useState, useRef, useEffect } from 'react'

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
  const messagesEndRef = useRef(null)

  const categories = [
    { id: 'report', label: 'Report a user', icon: 'flag' },
    { id: 'technical', label: 'Technical issue', icon: 'settings_input_component' },
    { id: 'general', label: 'General support', icon: 'help_outline' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    const userMessage = {
      id: messages.length + 1,
      text: `I need help with: ${category.label}`,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages([...messages, userMessage])
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputValue('')

    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        text: 'Thanks for reaching out! Our team will get back to you shortly.',
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 w-[380px] flex flex-col bg-[#0B0B0B] rounded-2xl border border-[#D4AF37]/40 overflow-hidden z-50" style={{ boxShadow: '0 0 20px rgba(212, 175, 55, 0.15), 0 20px 50px rgba(0, 0, 0, 0.9)' }}>
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between bg-[#0B0B0B]">
        <span className="font-bold text-sm font-display text-[#D4AF37] tracking-widest uppercase">Flinxx Support</span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex flex-col flex-1">
        {!selectedCategory ? (
          <>
            {/* Initial Help Message */}
            <div className="px-6 pb-6 pt-2 space-y-2">
              <p className="text-white text-2xl font-bold leading-tight font-display">Hi 👋 How can we help you today?</p>
              <p className="text-slate-400 text-sm font-medium">Our support team is available to assist you.</p>
            </div>

            {/* Category Buttons */}
            <div className="px-6 pb-8 flex flex-col gap-2.5">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="flex items-center justify-between w-full p-4 bg-[#0B0B0B] hover:bg-white/[0.03] text-white text-sm font-semibold rounded-xl border border-[#D4AF37]/40 transition-all group"
                >
                  <span>{category.label}</span>
                  <span className="material-symbols-outlined text-[18px] text-[#D4AF37] group-hover:scale-110 transition-transform">{category.icon}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
                    <p className="text-sm break-words">{message.text}</p>
                    <span className={`text-xs mt-1 block ${message.sender === 'user' ? 'text-[#D4AF37]/60' : 'text-slate-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0B0B0B] border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full bg-[#0B0B0B] border border-[#D4AF37]/40 rounded-xl py-4 px-5 pr-12 text-sm text-white focus:outline-none focus:border-[#D4AF37]/80 focus:ring-1 focus:ring-[#D4AF37]/80 transition-all placeholder:text-slate-600"
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-4 text-[#D4AF37] hover:text-white transition-colors flex items-center justify-center"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined font-bold text-[22px]">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactChat
