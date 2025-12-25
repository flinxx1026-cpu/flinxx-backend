import React, { useState } from "react";
import "./PremiumModal.css";

const PremiumModal = ({ isOpen, onClose }) => {
  const [mainTab, setMainTab] = useState("flex");
  const [activePremiumTab, setActivePremiumTab] = useState("lite");

  if (!isOpen) return null;

  const premiumPlans = [
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
    }
  ];

  const flexItems = [
    {
      id: "blue-tick",
      name: "Blue Tick",
      emoji: "✓",
      price: "₹69",
      features: [
        "Verification badge",
        "Trust boost",
        "Status indicator"
      ]
    },
    {
      id: "chat-themes",
      name: "Chat Themes",
      emoji: "🎨",
      price: "₹49",
      features: [
        "Unlock themes",
        "Custom colors",
        "Personal style"
      ]
    },
    {
      id: "match-boost",
      name: "Match Boost",
      emoji: "⚡",
      price: "₹39",
      features: [
        "30 min visibility boost",
        "Increased reach",
        "More matches"
      ]
    },
    {
      id: "profile-ring",
      name: "Profile Ring",
      emoji: "💍",
      price: "₹79",
      features: [
        "Colored profile ring",
        "Stand out",
        "Eye-catching design"
      ]
    },
    {
      id: "profile-highlight",
      name: "Profile Highlight",
      emoji: "⭐",
      price: "₹99",
      features: [
        "24h highlight",
        "Top search visibility",
        "Premium placement"
      ]
    }
  ];

  const currentPremiumPlan = premiumPlans.find(p => p.id === activePremiumTab);

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✖</button>

        {/* Title */}
        <h2 className="premium-title">Flinxx Subscriptions</h2>

        {/* Main Tabs */}
        <div className="main-tabs-container">
          {/* TEMPORARILY HIDDEN: Premium Plans Tab */}
          {false && (
            <button
              className={`main-tab ${mainTab === "premium" ? "active" : ""}`}
              onClick={() => setMainTab("premium")}
            >
              Premium Plans
            </button>
          )}
          <button
            className={`main-tab ${mainTab === "flex" ? "active" : ""}`}
            onClick={() => setMainTab("flex")}
          >
            Flex Plans
          </button>
        </div>

        {/* TEMPORARILY HIDDEN: PREMIUM TAB CONTENT */}
        {false && mainTab === "premium" && (
          <div className="tab-content">
            {/* Premium Plan Tabs */}
            <div className="premium-tabs-container">
              {premiumPlans.map((plan) => (
                <button
                  key={plan.id}
                  className={`premium-tab ${activePremiumTab === plan.id ? "active" : ""}`}
                  onClick={() => setActivePremiumTab(plan.id)}
                >
                  <span className="tab-emoji">{plan.emoji}</span>
                  <span className="tab-name">{plan.name}</span>
                  <span className="tab-price">{plan.price}</span>
                </button>
              ))}
            </div>

            {/* Premium Feature Card - Single Card that updates */}
            {currentPremiumPlan && (
              <div className="premium-card" key={activePremiumTab}>
                <div className="card-header">
                  <h3>{currentPremiumPlan.emoji} {currentPremiumPlan.name}</h3>
                </div>

                <div className="card-price">
                  <div className="price-amount">{currentPremiumPlan.price}</div>
                  <div className="price-duration">/ {currentPremiumPlan.duration}</div>
                </div>

                <ul className="card-features">
                  {currentPremiumPlan.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="card-subscribe-btn">Subscribe Now</button>
              </div>
            )}
          </div>
        )}

        {/* FLEX TAB CONTENT */}
        {mainTab === "flex" && (
          <div className="tab-content">
            <p className="flex-subtitle">Choose individual features</p>
            
            <div className="flex-section flex-wrapper">
              <div className="flex-plans-box">
                <div className="flex-plans-container">
                  {flexItems.map((item) => (
                    <div key={item.id} className="flex-card">
                    <div className="flex-item-header">
                      <span className="flex-emoji">{item.emoji}</span>
                      <h4>{item.name}</h4>
                    </div>

                    <div className="flex-item-price">{item.price}</div>

                    <ul className="flex-item-features">
                      {item.features.map((feature, idx) => (
                        <li key={idx}>
                          <span className="flex-check">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button className="flex-item-btn">Add Now</button>
                  </div>
                ))}
                </div>
              </div>
            </div>
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
