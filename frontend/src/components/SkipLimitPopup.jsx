import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const SkipLimitPopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  useEffect(() => {
    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const content = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999999] flex items-center justify-center p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <style>{`
        .gold-glow {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.15);
        }
        .btn-gold-gradient {
          background: linear-gradient(135deg, #f2ca50 0%, #d4af37 100%);
          box-shadow: 0 4px 25px rgba(242, 202, 80, 0.4);
        }
        .icon-circle-glow {
          background: rgba(212, 175, 55, 0.1);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }
      `}</style>
      
      <main 
        className="relative z-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0A0A0A] gold-glow rounded-[20px] p-8 relative border border-[#D4AF37]/10">
          {/* Close Action */}
          <button 
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          {/* Content Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full icon-circle-glow mb-6">
              <span className="material-symbols-outlined text-[#D4AF37] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h1 className="font-headline text-2xl font-extrabold text-white tracking-tight mb-2">Skip Limit Reached</h1>
            <p className="text-white text-sm opacity-80 leading-relaxed max-w-[280px] mx-auto mb-4">
              You've used all 120 daily skips. Your skips will reset at midnight. Upgrade for unlimited skips!
            </p>
          </div>

          {/* Plan Card (Unlimited Skip) */}
          <div className="bg-[#111111] rounded-2xl p-6 mb-8 border border-[#D4AF37]/10 relative overflow-hidden">
            <div className="flex flex-col gap-1 mb-6">
              <span className="font-headline text-lg font-bold text-white">Unlimited Skip</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#D4AF37]">₹149</span>
                <span className="text-white/40 text-sm">/mo</span>
              </div>
            </div>

            {/* Features List */}
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#D4AF37] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium text-white/80">Unlimited skips</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#D4AF37] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium text-white/80">Skip anyone anytime</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#D4AF37] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium text-white/80">No daily limit</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <button 
            className="btn-gold-gradient w-full py-4 rounded-full text-[#3c2f00] font-headline font-extrabold tracking-widest text-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
            onClick={onConfirm}
          >
            BUY NOW
          </button>
        </div>
      </main>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default SkipLimitPopup;
