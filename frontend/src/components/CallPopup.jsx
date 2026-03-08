import React from 'react';

const CallPopup = ({ 
  callerName, 
  callerAvatar,
  onAccept, 
  onReject,
  isLoading = false
}) => {
  return (
    <>
      <style>{`
        .acrylic-blur {
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }
        .glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
        }
        .glow-red {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
        }
        .status-pulse {
          position: absolute;
          inset: -2px;
          border-radius: 9999px;
          border: 2px solid #137fec;
          opacity: 0.6;
        }
      `}</style>

      <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative">
          <div className="acrylic-blur bg-black/40 border border-yellow-500/60 rounded-full px-5 py-3 flex items-center gap-5 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] min-w-[420px] h-20 transition-all duration-300 hover:border-yellow-500">
          
          {/* CALLER AVATAR WITH STATUS */}
          <div className="relative flex-shrink-0">
            <div className="status-pulse"></div>
            {callerAvatar ? (
              <img 
                alt={callerName} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-black/50" 
                src={callerAvatar}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {callerName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary border-2 border-black rounded-full"></div>
          </div>

          {/* CALLER INFO */}
          <div className="flex flex-col flex-grow overflow-hidden">
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase leading-tight">
              Incoming Video Call
            </span>
            <h3 className="text-white font-semibold text-lg truncate leading-tight mt-0.5">
              {callerName || 'Unknown User'}
            </h3>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 ml-2">
            <button 
              onClick={onReject}
              disabled={isLoading}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all duration-200 glow-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons text-2xl">call_end</span>
            </button>
            <button 
              onClick={onAccept}
              disabled={isLoading}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-green-500 hover:bg-green-600 text-white border border-green-400/30 transition-all duration-200 glow-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons text-2xl">videocam</span>
            </button>
          </div>
          </div>

          {/* GLASS GRADIENT OVERLAY */}
          <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-white/5 to-transparent"></div>
        </div>
      </div>
    </>
  );
};

export default CallPopup;
