import React, { useState } from "react";
import "./PremiumModal.css";

const PremiumModal = ({ isOpen, onClose }) => {
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
      ],
      popular: true
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
      ],
      mostPopular: true
    }
  ];

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✖</button>

        {/* Title */}
        <h2 className="premium-title">Flinxx Premium Plans</h2>
        <p className="premium-subtitle">Choose the perfect plan for you</p>

        {/* Plans Grid */}
        <div className="premium-plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan ${plan.popular ? "highlight" : ""} ${plan.mostPopular ? "most-popular" : ""}`}
            >
              {plan.mostPopular && (
                <div className="best-value-badge">BEST VALUE</div>
              )}
              {plan.popular && (
                <div className="popular-badge">MOST POPULAR</div>
              )}
              
              <div className="plan-header">
                <h3>{plan.emoji} {plan.name}</h3>
              </div>
              
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="duration">/ {plan.duration}</span>
              </div>
              
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="check">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="subscribe-btn">Subscribe Now</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="premium-footer">
          <p>Recurring billing. Cancel anytime. No hidden charges.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
