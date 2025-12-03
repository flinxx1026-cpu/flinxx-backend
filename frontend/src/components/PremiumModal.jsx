import React, { useState } from "react";
import "./PremiumModal.css";

const PremiumModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("lite");

  if (!isOpen) return null;

  const plans = [
    {
      id: "lite",
      name: "LITE",
      emoji: "✨",
      price: "₹69",
      duration: "1 Day",
      features: [
        "Unlimited Filters",
        "Gender Filter: 50/day",
        "10 Match Preferences",
        "Ads Enabled",
        "No Boost"
      ]
    },
    {
      id: "prime",
      name: "PRIME",
      emoji: "👑",
      price: "₹199",
      duration: "15 Days",
      features: [
        "Unlimited Filters",
        "Gender Filter: 150/day",
        "Full Match Preferences",
        "No Ads",
        "2x Profile Boost",
        "Priority Match Queue"
      ]
    },
    {
      id: "ultra",
      name: "ULTRA",
      emoji: "💎",
      price: "₹399",
      duration: "30 Days",
      features: [
        "Unlimited Filters",
        "Unlimited Gender Filter",
        "Full Match Preferences",
        "No Ads",
        "5x Profile Boost",
        "Ultra Priority Queue",
        "Ultra Badge",
        "Double Visibility"
      ]
    },
    {
      id: "ultra-plus",
      name: "ULTRA PLUS",
      emoji: "👑💎",
      price: "₹499",
      duration: "30 Days",
      features: [
        "All Ultra features",
        "Blue Tick",
        "Chat Themes",
        "Profile Ring",
        "Global Boost"
      ]
    }
  ];

  const currentPlan = plans.find(p => p.id === activeTab);

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✖</button>

        {/* Title */}
        <h2 className="premium-title">Flinxx Premium Plans</h2>
        <p className="premium-subtitle">Choose the perfect plan for you</p>

        {/* Tab Navigation */}
        <div className="premium-tabs-container">
          {plans.map((plan) => (
            <button
              key={plan.id}
              className={`premium-tab ${activeTab === plan.id ? "active" : ""}`}
              onClick={() => setActiveTab(plan.id)}
            >
              <span className="tab-emoji">{plan.emoji}</span>
              <span className="tab-name">{plan.name}</span>
              <span className="tab-price">{plan.price} / {plan.duration.split(" ")[0]}d</span>
            </button>
          ))}
        </div>

        {/* Feature Card - Single Card that updates */}
        {currentPlan && (
          <div className="premium-card" key={activeTab}>
            <div className="card-header">
              <h3>{currentPlan.emoji} {currentPlan.name}</h3>
            </div>

            <div className="card-price">
              <div className="price-amount">{currentPlan.price}</div>
              <div className="price-duration">/ {currentPlan.duration}</div>
            </div>

            <ul className="card-features">
              {currentPlan.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="feature-check">✓</span>
                  <span className="feature-text">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="card-subscribe-btn">Subscribe Now</button>
          </div>
        )}

        {/* Footer */}
        <div className="premium-footer">
          <p>Recurring billing. Cancel anytime. No hidden charges.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
