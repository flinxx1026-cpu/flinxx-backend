import React, { useEffect, useState } from 'react';

const CashfreeDebug = () => {
  const [sdkStatus, setSdkStatus] = useState('Loading...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const checkSDK = () => {
      let status = '❌ Not loaded';
      let info = '';

      // Check window.Cashfree
      if (typeof window.Cashfree !== 'undefined') {
        status = '✅ window.Cashfree available';
        info = 'Type: ' + typeof window.Cashfree;
      } else if (typeof window.cashfree !== 'undefined') {
        status = '✅ window.cashfree available';
        info = 'Type: ' + typeof window.cashfree;
      } else {
        // Check other possible locations
        console.log('🔍 Debugging Cashfree SDK location:');
        console.log('window.Cashfree:', window.Cashfree);
        console.log('window.cashfree:', window.cashfree);
        console.log('window.__CASHFREE__:', window.__CASHFREE__);
        
        const scripts = document.querySelectorAll('script[src*="cashfree"]');
        info = `Found ${scripts.length} Cashfree script(s)`;
        scripts.forEach((script, idx) => {
          console.log(`Script ${idx}:`, script.src);
        });
      }

      setSdkStatus(status);
      setDetails(info);
    };

    // Check immediately
    checkSDK();

    // Check again after 2 seconds
    const timer = setTimeout(checkSDK, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: '#1a1a1a',
      color: '#fff',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      border: '1px solid #333',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <div><strong>Cashfree SDK Status</strong></div>
      <div style={{ marginTop: '8px', color: sdkStatus.includes('✅') ? '#4ade80' : '#ef4444' }}>
        {sdkStatus}
      </div>
      {details && (
        <div style={{ marginTop: '8px', color: '#aaa' }}>
          {details}
        </div>
      )}
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Open browser console (F12) for more details
      </div>
    </div>
  );
};

export default CashfreeDebug;
