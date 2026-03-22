// Utility to ensure Cashfree SDK is loaded and ready
export const ensureCashfreeLoaded = () => {
  return new Promise((resolve, reject) => {
    // Check if SDK is fully initialized with Checkout capability
    const checkSDK = () => {
      console.log('🔍 Checking for Cashfree SDK...');
      
      // Check for Cashfree SDK with Checkout method
      if (typeof window.Cashfree !== 'undefined' && 
          window.Cashfree && 
          typeof window.Cashfree.Checkout === 'function') {
        console.log('✅ Cashfree SDK with Checkout found at window.Cashfree');
        return window.Cashfree;
      }
      
      if (typeof window.cashfree !== 'undefined' && 
          window.cashfree && 
          typeof window.cashfree.Checkout === 'function') {
        console.log('✅ Cashfree SDK with Checkout found at window.cashfree');
        return window.cashfree;
      }
      
      // Log what we have for debugging
      if (window.Cashfree) {
        console.log('⚠️ window.Cashfree exists but Checkout method missing. Properties:', Object.keys(window.Cashfree || {}));
      }
      
      if (window.cashfreeSDKReady === true) {
        console.log('⚠️ SDK marked ready but Checkout not available');
      }
      
      return null;
    };

    // Try immediately first
    const sdk = checkSDK();
    if (sdk) {
      console.log('✅ Cashfree SDK already loaded and ready');
      resolve(sdk);
      return;
    }

    // If not loaded yet, wait for it
    console.log('⏳ Waiting for Cashfree SDK to load from script...');
    let attempts = 0;
    const maxAttempts = 200; // 20 seconds timeout (200 * 100ms)
    
    const waitForSDK = setInterval(() => {
      attempts++;
      
      const sdk = checkSDK();
      if (sdk) {
        clearInterval(waitForSDK);
        console.log(`✅ Cashfree SDK loaded successfully after ${attempts} attempts`);
        resolve(sdk);
        return;
      }

      if (attempts % 20 === 0) {
        console.log(`⏳ Waiting for Cashfree SDK... (${attempts}/${maxAttempts} attempts)`);
      }

      if (attempts >= maxAttempts) {
        clearInterval(waitForSDK);
        console.error('❌ Cashfree SDK failed to load after 20 seconds');
        console.error('Debugging info:');
        console.error('- window.Cashfree:', typeof window.Cashfree);
        console.error('- window.Cashfree.Checkout:', typeof window.Cashfree?.Checkout);
        console.error('- window.cashfree:', typeof window.cashfree);
        console.error('- window.cashfreeLoaded:', window.cashfreeLoaded);
        console.error('- window.cashfreeFailed:', window.cashfreeFailed);
        console.error('- window.cashfreeSDKReady:', window.cashfreeSDKReady);
        
        const scripts = Array.from(document.querySelectorAll('script[src*="cashfree"]'));
        console.error('- Cashfree scripts found:', scripts.length);
        scripts.forEach((s, i) => {
          console.error(`  ${i+1}. ${s.src} (loaded: ${s.complete || false})`);
        });
        
        // Try manual SDK reload as last resort
        if (typeof window.reloadCashfreeSDK === 'function') {
          console.log('🔄 Attempting manual SDK reload...');
          window.reloadCashfreeSDK();
          
          // Give manual reload a chance to load
          return new Promise((innerResolve, innerReject) => {
            let reloadAttempts = 0;
            const reloadInterval = setInterval(() => {
              reloadAttempts++;
              if (typeof window.Cashfree !== 'undefined' && 
                  window.Cashfree && 
                  typeof window.Cashfree.Checkout === 'function') {
                clearInterval(reloadInterval);
                console.log('✅ SDK loaded after manual reload');
                innerResolve(window.Cashfree);
              } else if (reloadAttempts > 100) {
                clearInterval(reloadInterval);
                innerReject(new Error('Cashfree SDK failed to load after 20 seconds and manual reload failed. The SDK server may be unreachable. Please check your internet connection and refresh the page.'));
              }
            }, 100);
          });
        } else {
          reject(new Error('Cashfree SDK failed to load after 20 seconds. The SDK server may be unreachable. Please try again or contact support.'));
        }
      }
    }, 100);
  });
};
