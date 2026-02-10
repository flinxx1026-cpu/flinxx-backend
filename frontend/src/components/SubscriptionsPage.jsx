import React from 'react';
import './SubscriptionsPage.css';

const SubscriptionsPage = ({ onClose }) => {
  // Flex Plans data
  const flexItems = [
    {
      id: 1,
      emoji: '✔️',
      name: 'Blue Tick',
      price: '₹69',
      features: ['Verified badge', 'Stand out in search', 'Premium status']
    },
    {
      id: 2,
      emoji: '🎨',
      name: 'Chat Themes',
      price: '₹49',
      features: ['Custom chat colors', '5 premium themes', 'Personalize chats']
    },
    {
      id: 3,
      emoji: '⚡',
      name: 'Match Boost',
      price: '₹39',
      features: ['Boost visibility', '10 boost credits', 'More matches']
    },
    {
      id: 4,
      emoji: '💍',
      name: 'Profile Ring',
      price: '₹79',
      features: ['Animated profile ring', 'Gold border effect', 'Premium look']
    },
    {
      id: 5,
      emoji: '✨',
      name: 'Profile Highlight',
      price: '₹99',
      features: ['Featured profile', 'Top visibility', 'Extended duration']
    }
  ];

  return (
    <div className="subscriptions-page">
      {/* Close Button */}
      <button className="subscriptions-close-btn" onClick={onClose} title="Close">
        ✖
      </button>

      {/* Main Container */}
      <div className="subscriptions-container">
        {/* Header */}
        <h1 className="subscriptions-title">Flinxx Subscriptions</h1>

        {/* Plans Grid */}
        <div className="plans-grid">
          {flexItems.map((plan) => (
            <div key={plan.id} className="plan-card">
              {/* Plan Header */}
              <div className="plan-header">
                <span className="plan-emoji">{plan.emoji}</span>
                <h3 className="plan-title">{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="plan-price">{plan.price}</div>

              {/* Features List */}
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-bullet">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Add Now Button */}
              <button className="plan-button">ADD NOW</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
