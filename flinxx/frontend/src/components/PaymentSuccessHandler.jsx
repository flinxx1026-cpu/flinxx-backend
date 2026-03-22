import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './PaymentSuccessHandler.css';

const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;

const PaymentSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [message, setMessage] = useState('Verifying your payment...');
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('orderId');
        const mock = searchParams.get('mock');

        if (!orderId) {
          setStatus('failed');
          setMessage('Order ID not found in URL. Please contact support.');
          return;
        }

        // Verify payment on backend
        const verifyRes = await fetch(`${BACKEND_URL}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ orderId }),
        });

        const verifyData = await verifyRes.json();
        console.log('✅ Verification response:', verifyData);

        if (verifyData.success) {
          setStatus('success');
          setPlanName(verifyData.planName || 'Subscription');
          setMessage(`✅ Payment successful!\n\n${verifyData.planName || 'Your subscription'} is now active for 30 days.`);
          
          // Redirect to subscriptions page with success flag after 3 seconds
          setTimeout(() => {
            const plan = verifyData.plan || 'unknown';
            window.location.href = `/chat?payment_success=${plan}`;
          }, 3000);
        } else {
          setStatus('pending');
          setPlanName(verifyData.planName || 'Subscription');
          setMessage(`⏳ Payment verification is pending.\n\n${verifyData.message || 'Your subscription will be activated shortly.'}`);
          
          // Redirect to subscriptions page after 3 seconds even if pending
          setTimeout(() => {
            window.location.href = '/chat';
          }, 3000);
        }
      } catch (err) {
        console.error('❌ Verification error:', err);
        setStatus('failed');
        setMessage(`Error verifying payment: ${err.message || 'Unknown error'}\n\nPlease contact support if the issue persists.`);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="payment-success-handler">
      <div className="payment-success-modal">
        {status === 'verifying' && (
          <div className="payment-status verifying">
            <div className="spinner">⏳</div>
            <h2>Verifying Payment...</h2>
            <p>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="payment-status success">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>{message}</p>
            <p className="redirect-msg">Redirecting in 3 seconds...</p>
          </div>
        )}

        {status === 'pending' && (
          <div className="payment-status pending">
            <div className="pending-icon">⏳</div>
            <h2>Processing...</h2>
            <p>{message}</p>
            <p className="redirect-msg">Redirecting in 3 seconds...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="payment-status failed">
            <div className="error-icon">❌</div>
            <h2>Payment Verification Failed</h2>
            <p>{message}</p>
            <button className="retry-btn" onClick={() => window.location.href = '/chat'}>
              Back to Subscriptions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessHandler;
