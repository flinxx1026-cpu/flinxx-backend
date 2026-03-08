import React, { useEffect, useRef } from 'react';

const CallingWaitScreen = ({ 
  callerName,  // ✅ Now actually the recipient's name (person being called)
  callerAvatar,
  callerImage,
  onCancel,
  isLoading = false,
  localStream = null  // ✅ Accept MediaStream to display camera
}) => {
  const localVideoPreviewRef = useRef(null);

  // ✅ Attach local stream to preview video element
  useEffect(() => {
    if (localVideoPreviewRef.current && localStream) {
      localVideoPreviewRef.current.srcObject = localStream;
      localVideoPreviewRef.current.muted = true;
      localVideoPreviewRef.current.play().catch(() => {});
    }
  }, [localStream]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Dot pulse animation */}
      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .dot-anim { animation: dot-pulse 1.4s infinite; }
        .dot-anim:nth-child(2) { animation-delay: 0.2s; }
        .dot-anim:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <main className="w-full mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center min-h-screen max-w-6xl">
        
        {/* LEFT - Recipient Card */}
        <section className="w-full bg-[#1a1a1a] rounded-[2.5rem] border-[1.5px] border-yellow-400 relative flex flex-col items-center justify-center p-8 aspect-square">
          {/* Profile Image */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-[#333] flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
              <span className="text-white text-5xl font-bold">
                {callerAvatar || callerName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          {/* User Details */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 tracking-wide text-white">
              {callerName || 'Unknown User'}
            </h2>
            <p className="text-gray-400 text-sm font-semibold tracking-[0.2em] mb-4">CALLING...</p>
            {/* Animated Calling Dots */}
            <div className="flex justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 dot-anim"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-400 dot-anim"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-400 dot-anim"></span>
            </div>
          </div>
        </section>

        {/* RIGHT - User Preview Card */}
        <section className="w-full bg-[#808080] rounded-[2.5rem] border-[1.5px] border-yellow-400 relative flex items-center justify-center overflow-hidden aspect-square">
          
          {/* Video Stream or Camera Off Placeholder */}
          {localStream ? (
            <video
              ref={localVideoPreviewRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ backgroundColor: '#000' }}
            />
          ) : (
            <div className="text-white opacity-90">
              <svg fill="none" height="80" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="80">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
                <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2"></line>
              </svg>
            </div>
          )}
          
          {/* End Call Button (Top Right) */}
          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg"
            >
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
              </svg>
            </button>
          </div>

          {/* YOU Badge (Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-bold tracking-widest text-white uppercase">You</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CallingWaitScreen;
