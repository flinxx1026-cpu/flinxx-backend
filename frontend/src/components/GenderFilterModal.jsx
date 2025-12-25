import React, { useState } from "react";
import "./GenderFilterModal.css";

const GenderFilterModal = ({ isOpen, onClose, currentGender = "both", onOpenPremium }) => {
  const [selectedGender, setSelectedGender] = useState(currentGender);

  if (!isOpen) return null;

  const handleSave = () => {
    console.log("Gender filter saved:", selectedGender);
    onClose();
  };

  const handleJoin = () => {
    console.log("Join clicked - opening premium modal");
    onOpenPremium();
    onClose();
  };

  return (
    <div className="gender-filter-overlay" onClick={onClose}>
      <div className="gender-filter-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="gender-close-btn" onClick={onClose}>✖</button>

        {/* Premium Upsell Section */}
        <div className="gender-premium-section">
          <div className="premium-icon">👑</div>
          <div className="premium-content">
            <h3>Flinxx Prime</h3>
            <p>Get More Gender Filters</p>
          </div>
          <button className="join-btn" onClick={handleJoin}>Join</button>
        </div>

        {/* Gender Selection */}
        <div className="gender-section">
          <div className="gender-icon">👥</div>
          <h2>Gender</h2>

          <div className="gender-options">
            {/* Girls Only */}
            <button
              className={`gender-option ${selectedGender === "girls" ? "selected" : ""}`}
              onClick={() => setSelectedGender("girls")}
            >
              <div className="gender-emoji">👧</div>
              <div className="gender-label">Girls Only</div>
            </button>

            {/* Guys Only */}
            <button
              className={`gender-option ${selectedGender === "guys" ? "selected" : ""}`}
              onClick={() => setSelectedGender("guys")}
            >
              <div className="gender-emoji">👦</div>
              <div className="gender-label">Guys Only</div>
            </button>

            {/* Both - TEMPORARILY HIDDEN */}
            {false && (
              <button
                className={`gender-option ${selectedGender === "both" ? "selected" : ""}`}
                onClick={() => setSelectedGender("both")}
              >
                <div className="gender-emoji">👨‍👩</div>
                <div className="gender-label">Both</div>
              </button>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="gender-footer">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="filter-btn">
            🔽
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderFilterModal;
