import React, { useState } from "react";
import "./PremiumModal.css";

const PremiumModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("plus");

  if (!isOpen) return null;

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✖</button>

        {/* Title */}
        <h2 className="premium-title">Flinxx Prime</h2>

        {/* Tabs */}
        <div className="premium-tabs">
          <button 
            className={`tab-btn ${activeTab === "plus" ? "active" : ""}`}
            onClick={() => setActiveTab("plus")}
          >
            Flinxx Prime
          </button>
          <button 
            className={`tab-btn ${activeTab === "plus+" ? "active" : ""}`}
            onClick={() => setActiveTab("plus+")}
          >
            Flinxx Ultra
          </button>
        </div>

        {/* Plans */}
        <div className="premium-plans">
          {/* Plus Plan */}
          <div className={`plan ${activeTab === "plus" ? "highlight" : ""}`}>
            <div className="plan-header">
              <h3>👑 Prime</h3>
            </div>
            <ul className="plan-features">
              <li>
                <span className="check">✓</span>
                <span>Unlimited Filters</span>
              </li>
              <li>
                <span className="check">✓</span>
                <span>Gender Filter: 150/day</span>
              </li>
              <li>
                <span className="check">✓</span>
                <span>Match Preferences</span>
              </li>
              <li>
                <span className="check">✓</span>
                <span>No Ads</span>
              </li>
            </ul>
            <div className="plan-price">₹ 299 / 7 Days</div>
            <button className="subscribe-btn">Subscribe</button>
          </div>

          {/* Ultra Plan */}
          <div className={`plan ${activeTab === "plus+" ? "highlight" : ""}`}>
            <div className="plan-header">
              <h3>💎 Ultra</h3>
            </div>
            <ul className="plan-features">
              <li>
                <span className="check">✓</span>
                <span>Unlimited Filters</span>
              </li>
              <li>
                <span className="check">✓</span>
                <span>Unlimited Gender Filter</span>
              </li>
              <li>
                <span className="check">✓</span>
                <span>Match Preferences</span>
              </li>
              <li>
                <span className="check">✓</span>
                <span>No Ads</span>
              </li>
            </ul>
            <div className="plan-price">₹ 499 / 30 Days</div>
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>

        {/* Footer */}
        <div className="premium-footer">
          <p>Recurring billing. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
