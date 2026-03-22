import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaBolt, FaShieldAlt, FaUsers, FaArrowRight, FaComments } from 'react-icons/fa'
import flinxxLogo from '../assets/flinxx-logo.svg'
import ContactChat from '../components/ContactChat'
import { useAuth } from '../context/AuthContext'
import './Home.css'

// Custom hook for dynamic users counter
const useDynamicUsers = (min = 1700, max = 2000) => {
  const [targetUsers, setTargetUsers] = useState(() => Math.floor(Math.random() * (max - min + 1)) + min);
  const [displayUsers, setDisplayUsers] = useState(targetUsers);

  // Generate new target every 3-6 seconds
  useEffect(() => {
    let timeoutId;
    const updateTarget = () => {
      setTargetUsers(prev => {
        const change = Math.floor(Math.random() * 41) - 20; // Fluctuation Â±20
        let next = prev + change;
        if (next < min) next = min;
        if (next > max) next = max;
        return next;
      });
      const nextTime = Math.floor(Math.random() * 3000) + 3000;
      timeoutId = setTimeout(updateTarget, nextTime);
    };

    timeoutId = setTimeout(updateTarget, Math.floor(Math.random() * 3000) + 3000);
    return () => clearTimeout(timeoutId);
  }, [min, max]);

  // Smooth count up/down animation towards target
  useEffect(() => {
    if (displayUsers === targetUsers) return;

    const diff = targetUsers - displayUsers;
    const step = diff > 0 ? 1 : -1;
    const steps = Math.abs(diff);
    // Smooth count effect over ~1 second (max 30ms per step)
    const stepTime = Math.max(1000 / steps, 30);

    const timer = setInterval(() => {
      setDisplayUsers(prev => {
        if (prev === targetUsers) {
          clearInterval(timer);
          return prev;
        }
        return prev + step;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetUsers]); // React to new targets, but animate displayUsers

  return displayUsers;
};

// ✅ HOMEPAGE: Pure hero landing page - NO chat/dashboard components
// Gold/Black Premium Theme - 2025
const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, accountWarning } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  
  const activeUsers = useDynamicUsers(1700, 2000)
  
  // Decide if this is a ban
  const isBanned = user?.isBanned || accountWarning?.type === 'banned';

  // Auto-redirect authenticated AND unbanned users to /chat
  useEffect(() => {
    if (isAuthenticated && !isBanned) {
      navigate('/chat')
    }
  }, [isAuthenticated, isBanned, navigate])

  const handleStartChat = () => {
    setIsLoading(true)
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 500)
  }

  const handleContactUs = () => {
    setIsContactOpen(true)
  }

  const handleAcceptTerms = () => {
    localStorage.setItem('terms_consent_accepted', 'true')
    setShowTermsModal(false)
  }

  const handleDeclineTerms = () => {
    // User declines - don't save consent and don't show the modal again unless they clear localStorage
    // Still allow them to browse but show modal again on next visit
    setShowTermsModal(false)
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
              <span className="online-text">
                <span className="counter-number">{activeUsers.toLocaleString()}</span> online
              </span>
            </div>
          </div>
          
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="/about" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>About Flinxx</a>
            <button 
              onClick={handleStartChat}
              className="btn-start-now"
            >
              <span>Start Now</span>
              <FaArrowRight size={18} />
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                    <path d="M17 10.5V6c0-1.1-.9-2-2-2H5C3.9 4 3 4.9 3 6v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4.5l4 4v-11l-4 4z"/>
                  </svg>
                  {isLoading ? 'Loading...' : 'Start Video Chat'}
                </span>
              </button>
              <p className="hero-tagline">Fast, simple video chats • Real users, real time</p>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="/about" style={{ color: '#D4AF37', textDecoration: 'underline', fontWeight: 500 }}>Learn more About Flinxx</a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="features-grid">
          {/* Card 1 - Instant Connection */}
          <div className="feature-card glass-panel">
            <div className="feature-icon">
              <FaBolt size={22} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Instant Connection</h3>
              <p className="card-description">Connect with random strangers in seconds. No waiting queues, just instant matching.</p>
            </div>
          </div>

          {/* Card 2 - Safe & Secure */}
          <div className="feature-card glass-panel">
            <div className="feature-icon">
              <FaShieldAlt size={22} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Safe & Secure</h3>
              <p className="card-description">Our AI moderation keeps the community safe. Report inappropriate behavior instantly.</p>
            </div>
          </div>

          {/* Card 3 - Real Nearby Users */}
          <div className="feature-card glass-panel">
            <div className="feature-icon">
              <FaUsers size={22} />
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
        <FaComments size={18} />
        Contact Us
      </button>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <p>Â© 2023 FLINXX Inc. All rights reserved.</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>

      {/* Contact Chat Widget */}
      <ContactChat isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  )
}

export default Home
