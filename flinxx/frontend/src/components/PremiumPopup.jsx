import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const PremiumPopup = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  useEffect(() => {
    console.log('🛡️ [PREMIUM POPUP] Component Mounted - High Priority Modal Active');
    // Ensure body scroll is locked when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
      console.log('🛡️ [PREMIUM POPUP] Component Unmounted');
    };
  }, []);

  const content = (
    <div 
      className="premium-popup-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999999, // Super high z-index
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .premium-popup-card {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
        }
      `}</style>
      
      <div 
        className="premium-popup-card"
        style={{
          width: '90%',
          maxWidth: '650px',
          background: '#0B0B0B',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: window.innerWidth < 640 ? 'column' : 'row',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.15)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          ✕
        </button>

        {/* Left Section - Hero */}
        <div 
          style={{
            flex: '1',
            padding: '40px',
            background: 'linear-gradient(135deg, #1A1A1A 0%, #000 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: window.innerWidth < 640 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: window.innerWidth < 640 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
          }}
        >
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '24px' }}>
             <div style={{
               width: '100%',
               height: '100%',
               borderRadius: '50%',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               position: 'relative',
               background: 'transparent'
             }}>
                <img 
                  src="/bluetick.png" 
                  alt="Verified" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'contain'
                  }} 
                />
             </div>
          </div>
          <span style={{ 
            color: '#d4af37', 
            fontSize: '11px', 
            fontWeight: '600', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            textAlign: 'center'
          }}>
            Certified Excellence
          </span>
        </div>

        {/* Right Section - Content */}
        <div style={{ flex: '1.2', padding: '40px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ 
            color: '#FFD700', 
            fontSize: '26px', 
            fontWeight: '700', 
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            {message ? "Skip Limit Reached" : "Get Verified with Blue Tick"}
          </h2>
          <p style={{ 
            color: '#9CA3AF', 
            fontSize: '14px', 
            marginBottom: '28px',
            lineHeight: '1.5'
          }}>
            {message || "Unlock exclusive features and stand out in the community."}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#FFD700' }}>✓</div>
              <span style={{ color: '#E5E7EB', fontSize: '15px' }}>Verified badge (Gold)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#FFD700' }}>✓</div>
              <span style={{ color: '#E5E7EB', fontSize: '15px' }}>Priority support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#FFD700' }}>✓</div>
              <span style={{ color: '#E5E7EB', fontSize: '15px' }}>Stand out in chats</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>
                Monthly Access
              </div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: '700' }}>
                ₹69<span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '400' }}>/mo</span>
              </div>
            </div>
            <button 
              onClick={onConfirm || onClose}
              style={{
                background: 'linear-gradient(to right, #FFD900, #F59E0B)',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {message ? "Upgrade Now" : "Get Blue Tick"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default PremiumPopup;
