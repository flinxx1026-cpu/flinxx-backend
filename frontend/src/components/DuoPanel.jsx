import React, { useState } from 'react';

const DuoPanel = () => {
  const [inviteMethod, setInviteMethod] = useState(null);

  const handleShare = (method) => {
    // Placeholder for share functionality
    console.log(`Share via ${method}`);
    setInviteMethod(method);
  };

  return (
    <div className="duo-panel w-full h-full rounded-3xl p-8 flex flex-col items-center justify-between text-center" style={{ backgroundColor: '#131313', border: '1px solid #d9b85f' }}>
      {/* Header */}
      <div className="w-full">
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#d9b85f' }}>My Duo Squad</h3>
        <p className="text-sm" style={{ color: '#999' }}>Team up with a partner</p>
      </div>

      {/* Empty State Content */}
      <div className="flex flex-col items-center gap-6">
        {/* Illustration / Icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 184, 95, 0.1)' }}>
          <span className="text-5xl">👥</span>
        </div>

        {/* Text Content */}
        <div>
          <p className="text-white text-lg font-semibold mb-2">No partner joined yet</p>
          <p className="text-sm" style={{ color: '#999' }}>Invite a friend to start Duo</p>
        </div>
      </div>

      {/* Share/Invite Section */}
      <div className="w-full space-y-4">
        <p className="text-xs" style={{ color: '#666' }}>SHARE INVITE</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg text-xl"
            style={{ 
              backgroundColor: 'rgba(217, 184, 95, 0.15)',
              border: '1px solid #d9b85f'
            }}
            title="Share on WhatsApp"
          >
            💬
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg text-xl"
            style={{ 
              backgroundColor: 'rgba(217, 184, 95, 0.15)',
              border: '1px solid #d9b85f'
            }}
            title="Share on Facebook"
          >
            f
          </button>

          {/* Snapchat */}
          <button
            onClick={() => handleShare('snapchat')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg text-xl"
            style={{ 
              backgroundColor: 'rgba(217, 184, 95, 0.15)',
              border: '1px solid #d9b85f'
            }}
            title="Share on Snapchat"
          >
            👻
          </button>

          {/* X (Twitter) */}
          <button
            onClick={() => handleShare('x')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg text-xl"
            style={{ 
              backgroundColor: 'rgba(217, 184, 95, 0.15)',
              border: '1px solid #d9b85f'
            }}
            title="Share on X"
          >
            𝕏
          </button>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={() => handleShare('link')}
          className="w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm"
          style={{ 
            backgroundColor: 'transparent',
            border: '1px solid #d9b85f',
            color: '#d9b85f'
          }}
        >
          Copy Invite Link
        </button>
      </div>
    </div>
  );
};

export default DuoPanel;
