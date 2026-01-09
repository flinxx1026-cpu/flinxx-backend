import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import flinxxLogo from '../assets/flinxx-logo.svg'
import './Home.css'

// ✅ HOMEPAGE: Pure hero landing page - NO chat/dashboard components
// Gold/Black Premium Theme - 2025
const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartChat = () => {
    setIsLoading(true)
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 500)
  }

  const handleContactUs = () => {
    navigate('/contact', { replace: true })
  }

  return (
    <div className="homepage-wrapper">
      {/* Animated Background Blobs */}
      <div className="animated-bg-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`float-particle float-${i}`}></div>
        ))}
      </div>

      {/* Header Navigation */}
      <nav className="homepage-header glass-panel">
        <div className="header-content">
          <div className="header-left">
            <span className="logo-text">FLINXX</span>
            <div className="online-indicator">
              <span className="pulse-dot"></span>
              <span className="online-text">3,247 online</span>
            </div>
          </div>
          
          <div className="header-right">
            <button 
              onClick={handleStartChat}
              className="btn-start-now"
            >
              <span>Start Now</span>
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Meet New People <br className="hidden-mobile" />
              <span className="hero-gradient">Around the World</span>
            </h1>
            <p className="hero-subtitle">
              Connect instantly with strangers through high-quality video chat. No waiting, no hassle, just pure connection.
            </p>
            <div className="hero-buttons">
              <button 
                onClick={handleStartChat}
                disabled={isLoading}
                className="btn-hero-cta"
              >
                <span className="material-icons">video_call</span>
                {isLoading ? 'Loading...' : 'Start Video Chat'}
              </button>
              <p className="hero-tagline">Fast, simple video chats • Real users, real time</p>
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="features-grid">
          {/* Card 1 - Instant Connection */}
          <div className="feature-card glass-panel">
            <div className="card-icon-box">
              <span className="material-icons">bolt</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Instant Connection</h3>
              <p className="card-description">Connect with random strangers in seconds. No waiting queues, just instant matching.</p>
            </div>
          </div>

          {/* Card 2 - Safe & Secure */}
          <div className="feature-card glass-panel">
            <div className="card-icon-box">
              <span className="material-icons">security</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Safe & Secure</h3>
              <p className="card-description">Our AI moderation keeps the community safe. Report inappropriate behavior instantly.</p>
            </div>
          </div>

          {/* Card 3 - Real Nearby Users */}
          <div className="feature-card glass-panel">
            <div className="card-icon-box">
              <span className="material-icons">groups</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Real Nearby Users</h3>
              <p className="card-description">Chat with active, genuine users around you. No bots, no fake profiles.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Contact Us Button */}
      <button
        onClick={handleContactUs}
        className="btn-contact-us"
      >
        <span className="material-icons">chat_bubble_outline</span>
        Contact Us
      </button>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <p>© 2023 FLINXX Inc. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Community Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
