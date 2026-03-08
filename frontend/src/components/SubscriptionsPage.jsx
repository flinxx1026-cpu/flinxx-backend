import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './SubscriptionsPage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const SubscriptionsPage = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(null); // planId currently loading
  const [userFeatures, setUserFeatures] = useState({});
  const [featureExpiry, setFeatureExpiry] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const flexItems = [
    {
      id: 1,
      planId: 'blue_tick',
      icon: 'verified',
      name: 'Blue Tick',
      price: '₹69',
      amount: 69,
      features: ['Verified badge', 'Priority support', 'Exclusive icon']
    },
    {
      id: 2,
      planId: 'match_boost',
      icon: 'bolt',
      name: 'Match Boost',
      price: '₹189',
      amount: 189,
      features: ['Faster matches', 'Priority matching', 'Less waiting time']
    },
    {
      id: 3,
      planId: 'unlimited_skip',
      icon: 'skip_next',
      name: 'Unlimited Skip',
      price: '₹149',
      amount: 149,
      features: ['Unlimited skips', 'Skip anyone anytime', 'No daily limit']
    }
  ];

  // Fetch user's active features on mount
  useEffect(() => {
    if (!user?.uuid) return;
    const fetchFeatures = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/payments/features?userId=${user.uuid}`);
        const data = await res.json();
        if (data.success) {
          setUserFeatures(data.features);
          if (data.expiry) setFeatureExpiry(data.expiry);
        }
      } catch (err) {
        console.error('Error fetching features:', err);
      }
    };
    fetchFeatures();
  }, [user?.uuid]);

  // Handle BUY NOW click
  const handleBuyNow = async (plan) => {
    if (!user?.uuid) {
      alert('Please login first to purchase.');
      return;
    }

    setLoading(plan.planId);

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planId: plan.planId, userId: user.uuid }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert('Failed to create order: ' + (orderData.error || 'Unknown error'));
        setLoading(null);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Flinxx',
        description: orderData.plan.description,
        order_id: orderData.order.id,
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch(`${BACKEND_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.uuid,
                planId: plan.planId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPaymentSuccess(plan.name);
              setUserFeatures(prev => ({ ...prev, [plan.planId]: true }));
              if (verifyData.expiresAt) {
                setFeatureExpiry(prev => ({ ...prev, [plan.planId]: verifyData.expiresAt }));
              }
              setTimeout(() => setPaymentSuccess(null), 4000);
            } else {
              alert('Payment verification failed: ' + (verifyData.error || 'Unknown error'));
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment verification failed. Please contact support.');
          }
          setLoading(null);
        },
        prefill: {
          name: user.display_name || user.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#EAB308',
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoading(null);
      });
      rzp.open();

    } catch (err) {
      console.error('Error initiating payment:', err);
      alert('Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-modal">
        {/* Header */}
        <header className="subscriptions-header">
          <h2 className="subscriptions-title">Flinxx Subscriptions</h2>
          <button className="subscriptions-close-btn" onClick={onClose} title="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Payment Success Banner */}
        {paymentSuccess && (
          <div style={{
            background: 'linear-gradient(90deg, #10b981, #059669)',
            color: 'white',
            padding: '12px 24px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '14px',
            animation: 'fadeIn 0.3s ease-out',
          }}>
            ✅ {paymentSuccess} activated successfully! Enjoy your premium features.
          </div>
        )}

        {/* Cards Grid */}
        <div className="subscriptions-content">
          <div className="plans-grid">
            {flexItems.map((plan) => {
              const isActive = userFeatures[plan.planId];
              const isLoading = loading === plan.planId;
              
              // Calculate days remaining (date-based, not timestamp)
              let daysLeft = null;
              const expiryDate = featureExpiry[plan.planId];
              if (isActive && expiryDate) {
                const now = new Date();
                const expiry = new Date(expiryDate);
                // Strip time - compare dates only for accurate day count
                const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const expiryDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
                daysLeft = Math.max(0, Math.round((expiryDateOnly - nowDateOnly) / (1000 * 60 * 60 * 24)));
              }

              return (
                <div key={plan.id} className={`plan-card ${isActive ? 'plan-card-active' : ''}`}>
                  <div className="plan-card-top">
                    <span className="material-symbols-outlined plan-icon">{plan.icon}</span>
                    <h3 className="plan-title">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="plan-price-amount">{plan.price}</span>
                      <span className="plan-price-period">/mo</span>
                    </div>
                  </div>

                  <div className="plan-features-list">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="plan-feature-item">
                        <span className="material-symbols-outlined plan-check-icon">check_circle</span>
                        {feature}
                      </div>
                    ))}
                    {isActive && daysLeft !== null && (
                      <div className="plan-feature-item" style={{ color: daysLeft <= 3 ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                        <span className="material-symbols-outlined plan-check-icon" style={{ color: daysLeft <= 3 ? '#ef4444' : '#10b981' }}>timer</span>
                        Days left: {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {isActive ? (
                    <button className="plan-button plan-button-active" disabled>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>check_circle</span>
                      ACTIVE
                    </button>
                  ) : (
                    <button
                      className="plan-button"
                      onClick={() => handleBuyNow(plan)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span className="payment-spinner"></span>
                          Processing...
                        </span>
                      ) : (
                        'BUY NOW'
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
