import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Contact Flinxx";
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#080808] text-white">
      {/* Header */}
      <header className="w-full border-b border-zinc-800/50 py-4 px-6 md:px-12 flex items-center bg-[#080808]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="Flinxx Logo" className="w-10 h-10 rounded-full shadow-lg shadow-[#D4AF37]/20 object-cover" />
            <span className="text-2xl font-bold tracking-tight text-white">Flinxx</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center pt-16 pb-24 px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-12 text-center text-white">
          <span>Contact</span>{' '}
          <span style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Us
          </span>
        </h1>

        <div className="w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 md:p-12 shadow-2xl text-center">
          <p className="text-zinc-300 leading-relaxed text-lg mb-8">
            Need help or have questions? Our support team is here for you. We aim to respond to all inquiries within 24 working hours.
          </p>

          <a href="mailto:contact.flinxx@gmail.com" className="inline-block px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b0912d] transition-colors">
            Email Us: contact.flinxx@gmail.com
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-black text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-6 text-zinc-400 text-sm">
            <a href="/about" className="hover:text-white transition-colors">About Flinxx</a>
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-zinc-600 text-sm">© <span>{currentYear}</span> Flinxx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
