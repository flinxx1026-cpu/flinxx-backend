import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './MobileHome.css'

/**
 * MobileHome - Mobile Dashboard Component
 * This component displays the dashboard UI for mobile devices (< 769px)
 * It should be used ONLY in the chat/dashboard area after user login
 * NOT on the home landing page
 */
const MobileHome = ({ user, onStartChat, onModeChange }) => {
  const navigate = useNavigate()
  const [gameMode, setGameMode] = useState('solo')

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat(gameMode)
    } else {
      navigate('/matching', { replace: true })
    }
  }

  const handleModeChange = (mode) => {
    setGameMode(mode)
    if (onModeChange) {
      onModeChange(mode)
    }
  }

  return (
    <div className="mobile-home-container">
      {/* Glow effect top */}
      <div className="glow-top"></div>
      
      {/* Header Navigation */}
      <header className="mobile-header">
        <nav className="mobile-nav">
          <button className="mobile-nav-btn" title="Profile">
            <span className="material-symbols-outlined">person</span>
          </button>
          <button className="mobile-nav-btn" title="Search">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="mobile-nav-btn" title="Favorites">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="mobile-nav-btn" title="Messages">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <button className="mobile-nav-btn" title="Awards">
            <span className="material-symbols-outlined">emoji_events</span>
          </button>
          <button className="mobile-nav-btn" title="Activity">
            <span className="material-symbols-outlined">timer</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mobile-main">
        {/* Logo */}
        <div className="mobile-logo-section">
          <h1 className="mobile-logo">Flinxx</h1>
        </div>

        {/* Game Mode Selection */}
        <div className="mobile-mode-buttons">
          <button 
            className={`mobile-mode-btn ${gameMode === 'solo' ? 'active' : ''}`}
            onClick={() => handleModeChange('solo')}
          >
            SoloX
          </button>
          <button 
            className={`mobile-mode-btn ${gameMode === 'duo' ? 'active' : ''}`}
            onClick={() => handleModeChange('duo')}
          >
            DuoX
          </button>
        </div>

        {/* Start Button */}
        <button className="mobile-start-button" onClick={handleStartChat}>
          <span className="material-symbols-outlined">movie</span>
          Start Video Chat
        </button>

        {/* Video Preview */}
        <div className="mobile-video-preview">
          <img 
            alt="Your video preview" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL4aKLR9wxfBpOGbKDML1uPyd01j-nlKQUaqncv8UO0XQPazYIC3UxkLOsQ4PDgqjrzEOT2AXaVO8JyUTprnRNeO1s8ky1zRy097myCLuEQj6BzJU2uGebRocr0ujkDGF_qnErXShu-bOwzbtNyoS-EVw7Zf9SHFx8rC9VEXDImgNPGP33R7AA7N8hdWRucQ4Ml5tRNRrTmvf0GFlkLXU4IzZB9rMakuwP1Qh4f5LtWrFeCFObJe-vYlID5UbKBIxWK75ldAkZvw"
            className="preview-image"
          />
          <div className="preview-overlay"></div>
          <div className="preview-status">
            <span className="status-dot"></span>
            YOU
          </div>
        </div>
      </main>
    </div>
  )
}

export default MobileHome
