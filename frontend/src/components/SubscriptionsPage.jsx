import React, { useState, useEffect, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './SubscriptionsPage.css';

const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;

const SubscriptionsPage = ({ onClose }) => {
  const { user, refreshProfile } = useContext(AuthContext);
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

  // Check for payment success and show message
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successPlan = params.get('payment_success');
    
    if (successPlan) {
      // Map plan ID to plan name
      const planNames = {
        'blue_tick': 'Blue Tick',
        'match_boost': 'Match Boost',
        'unlimited_skip': 'Unlimited Skip'
      };
      
      setPaymentSuccess(planNames[successPlan] || successPlan);
      
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refetch features to show updated status
      if (user?.uuid) {
        const refetchFeatures = async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/api/payments/features?userId=${user.uuid}`);
            const data = await res.json();
            if (data.success) {
              setUserFeatures(data.features);
              if (data.expiry) setFeatureExpiry(data.expiry);
              
              // ✅ CRITICAL: Refresh global AuthContext profile so Chat.jsx knows we are premium!
              if (refreshProfile) {
                console.log('🔄 [Subscriptions] Refreshing global user profile...');
                await refreshProfile();
              }
            }
          } catch (err) {
            console.error('Error refetching features:', err);
          }
        };
        // Small delay to ensure backend has updated
        setTimeout(refetchFeatures, 500);
      }
      
      // Clear message after 5 seconds
      setTimeout(() => setPaymentSuccess(null), 5000);
    }
  }, []);

  // Handle BUY NOW click
  const handleBuyNow = async (plan) => {
    if (!user?.uuid) {
      alert('Please login first to purchase.');
      return;
    }

    setLoading(plan.planId);

    try {
      console.log('🛒 Starting payment flow for plan:', plan.planId);

      // Get payment session from backend
      console.log('🔗 Fetching payment session from backend...');
      const linkRes = await fetch(`${BACKEND_URL}/api/payments/get-payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planId: plan.planId, userId: user.uuid }),
      });

      console.log('📋 Response status:', linkRes.status);
      
      const responseText = await linkRes.text();
      console.log('📋 Response text:', responseText.substring(0, 300));
      
      let linkData;
      try {
        linkData = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('❌ Failed to parse response:', parseErr.message);
        alert(`Backend error: ${linkRes.status}\n\n${responseText.substring(0, 200)}`);
        setLoading(null);
        return;
      }
      
      if (!linkData.success) {
        alert('Failed to get payment session: ' + (linkData.error || 'Unknown error'));
        setLoading(null);
        return;
      }

      const sessionId = linkData.sessionId;
      const orderId = linkData.orderId;
      const isMock = linkData.isMock;

      console.log('✅ Got session ID:', sessionId.substring(0, 50) + '...');

      // Handle MOCK PAYMENTS (development mode)
      if (isMock) {
        console.log('🎭 [MOCK MODE] Skipping SDK and redirecting to mock payment success');
        window.location.href = `${window.location.origin}/payment-success?orderId=${orderId}&mock=true`;
        setLoading(null);
        return;
      }

      // ===== REAL CASHFREE PAYMENT - Use SDK v3 =====
      console.log('💳 Loading Cashfree SDK...');
      
      // Load Cashfree SDK
      if (window.Cashfree && typeof window.Cashfree === 'function') {
        console.log('✅ SDK already loaded');
        openCheckout(sessionId);
      } else {
        // Load the script dynamically
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Cashfree SDK script loaded');
          // Give it a moment to initialize
          setTimeout(() => {
            openCheckout(sessionId);
          }, 300);
        };
        script.onerror = () => {
          console.error('❌ Failed to load Cashfree SDK');
          alert('Failed to load payment gateway. Please try again.');
          setLoading(null);
        };
        document.head.appendChild(script);
      }

      function openCheckout(sessionId) {
        try {
          console.log('🚀 Opening Cashfree checkout with session:', sessionId.substring(0, 50) + '...');
          console.log('📊 window.Cashfree type:', typeof window.Cashfree);
          
          // Cashfree SDK v3 - correct initialization (no 'new' keyword)
          const cashfree = window.Cashfree({
            mode: 'production' // Use production mode for real payments
          });
          
          console.log('✅ Cashfree instance created successfully');
          
          // Use modal so the user never leaves the website
          cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: '_modal'
          }).then((result) => {
            if (result.error) {
              console.log("❌ Payment error or popup closed", result.error);
              // Do nothing, let the user try again
            } else if (result.paymentDetails) {
              console.log("✅ Payment completed!", result.paymentDetails);
              // Redirect to our success handler to verify the payment on the backend
              window.location.href = `/payment-success?orderId=${orderId}`;
            }
          });
          
          setLoading(null);
        } catch (err) {
          console.error('❌ Error opening checkout:', err);
          console.error('❌ Stack:', err.stack);
          alert('Error opening payment checkout: ' + err.message);
          setLoading(null);
        }
      }

    } catch (err) {
      console.error('❌ Error in payment flow:', err);
      alert('Error starting payment: ' + (err.message || 'Something went wrong.'));
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
            <FaTimes size={24} />
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
