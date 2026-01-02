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
        <h3 className="text-2xl font-bold" style={{ color: '#d9b85f' }}>My Duo Squad</h3>
      </div>
    </div>
  );
};

export default DuoPanel;
