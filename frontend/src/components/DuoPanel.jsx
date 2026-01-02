import React from 'react';
import './DuoPanel.css';

const DuoPanel = ({ onClose }) => {
  return (
    <div className="duo-panel w-full h-full rounded-3xl p-8 flex flex-col items-center justify-between text-center relative" style={{ backgroundColor: '#131313', border: '1px solid #d9b85f' }}>
      {/* Close Button */}
      <button
        className="modal-close-btn"
        onClick={onClose}
        title="Close"
      >
        ✕
      </button>
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
    </div>
  );
};

export default DuoPanel;
