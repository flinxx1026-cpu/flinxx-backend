import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import flinxxPremiumLogo from '../assets/flinxx-premium-logo.svg'
import './Home.css'

// ✅ HOMEPAGE: Pure hero landing page - NO chat/dashboard components
const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartChat = () => {
    setIsLoading(true)
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 500)
  }

  return (
    <div className="homepage-wrapper">
      {/* Header Navigation */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="header-left">
            <img src={flinxxPremiumLogo} alt="Flinxx" className="logo" />
            <span className="online-status">🟢 3,247 online</span>
          </div>
          
          <button 
            onClick={handleStartChat}
            className="btn-start-now"
          >
            Start Now
          </button>
        </div>
      </header>

      {/* Hero Section - Main Landing Content */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Meet New People<br />Around the World
          </h1>
          <p className="hero-subtitle">
            Connect instantly with strangers through video chat
          </p>
          <button 
            onClick={handleStartChat}
            disabled={isLoading}
            className="btn-hero-cta"
          >
            {isLoading ? '⟳ Loading...' : 'Start Video Chat'}
          </button>

          {/* Quick Features Below Button */}
          <p className="hero-tagline">
            Fast, simple video chats • Real users, real time
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="features-container">
          {/* Card - Instant Connection */}
          <div className="feature-card">
            <div className="card-content">
              <div className="card-icon">⚡</div>
              <div className="card-text">
                <h3 className="card-title">Instant Connection</h3>
                <p className="card-description">Connect with random strangers in seconds. No waiting, no hassle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Contact Us Button - Bottom Right */}
      <button
        onClick={() => window.location.href = '/contact'}
        className="btn-contact-us"
      >
        <span>💬</span>
        Contact Us
      </button>
    </div>
  )
}

export default Home
