import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "About Flinxx";

    // Add or update meta description
    const updateMeta = (name, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        if (isProperty) meta.setAttribute("property", name);
        else meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
      return meta;
    };

    const desc = "Learn more about Flinxx, a video chat platform designed to help you meet new people instantly in a simple and friendly way.";
    updateMeta("description", desc);
    updateMeta("og:title", "About Flinxx", true);
    updateMeta("og:description", desc, true);

    return () => {
      // Optional cleanup if needed (usually persist on route change is fine, but we can restore default)
      const defaultDesc = "Flinxx is a video chat platform to meet new people instantly.";
      updateMeta("description", defaultDesc);
      updateMeta("og:title", "Flinxx - Meet New People Instantly", true);
      updateMeta("og:description", defaultDesc, true);
    };
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="Flinxx Logo"
              className="w-10 h-10 rounded-full shadow-lg shadow-[#D4AF37]/20 object-cover"
            />
            <span className="text-2xl font-bold tracking-tight text-white">Flinxx</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 pb-24 px-6">

        {/* Page Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-12 text-center text-white">
          <span>About</span>{' '}
          <span style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Flinxx
          </span>
        </h1>

        {/* Content Container */}
        <div className="w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 md:p-12 shadow-2xl">
          <div className="space-y-10 text-zinc-300 leading-relaxed text-base md:text-lg">

            {/* Intro Section */}
            <p>
              Flinxx is a video chat platform where you can meet and talk to new people instantly. You can connect with random users from different places, including many active users from India. The platform is designed to keep things simple, fast, and easy to use. Flinxx focuses on providing a clean and smooth experience so you can have real conversations without hassle.
            </p>

            {/* Our Mission */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white border-l-4 border-[#D4AF37] pl-4">
                Our Mission
              </h2>
              <p>
                To make it easy for people to connect, talk, and meet new people online in a simple and friendly way.
              </p>
            </div>

            {/* Why Flinxx? */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white border-l-4 border-[#D4AF37] pl-4">
                Why Flinxx?
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-center gap-3 bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  <span className="text-zinc-200">Instant connection with random people</span>
                </li>
                <li className="flex items-center gap-3 bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  <span className="text-zinc-200">Active Indian users</span>
                </li>
                <li className="flex items-center gap-3 bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  <span className="text-zinc-200">Simple and easy to use</span>
                </li>
                <li className="flex items-center gap-3 bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  <span className="text-zinc-200">Clean and smooth experience</span>
                </li>
              </ul>
            </div>

            {/* Footer Note */}
            <p className="pt-6 border-t border-zinc-800 text-zinc-400 italic text-center">
              Flinxx is built for people who just want to connect and talk without complications.
            </p>

          </div>
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

export default About;
