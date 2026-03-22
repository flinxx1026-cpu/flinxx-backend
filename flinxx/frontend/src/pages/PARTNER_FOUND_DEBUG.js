// DIAGNOSTIC: Test if partner_found listener is actually being registered
// Add this to Chat.jsx temporarily to debug the socket listener issue

export const testPartnerFoundListener = (socketRef) => {
  console.log('\n\n🧪🧪🧪 [TEST] PARTNER_FOUND LISTENER DIAGNOSIS 🧪🧪🧪\n');
  
  if (!socketRef || !socketRef.current) {
    console.error('❌ [TEST] socketRef not available');
    return;
  }
  
  const socket = socketRef.current;
  console.log('🧪 [TEST] Socket object exists:', !!socket);
  console.log('🧪 [TEST] Socket.on is function?', typeof socket.on === 'function');
  console.log('🧪 [TEST] Socket.getSocket:', typeof socket.getSocket);
  
  // Get the actual socket if using wrapper
  const actualSocket = socket.getSocket?.() || socket;
  console.log('🧪 [TEST] Actual socket exists?', !!actualSocket);
  console.log('🧪 [TEST] Actual socket.on is function?', typeof actualSocket.on === 'function');
  console.log('🧪 [TEST] Actual socket ID:', actualSocket?.id || 'null');
  console.log('🧪 [TEST] Actual socket connected?', actualSocket?.connected || false);
  
  // Check if partner_found listeners already exist
  console.log('🧪 [TEST] Checking existing listeners...');
  
  // Try to list listeners (not always available in Socket.IO)
  if (typeof actualSocket?.listeners === 'function') {
    const listeners = actualSocket.listeners('partner_found');
    console.log('🧪 [TEST] Existing partner_found listeners:', listeners.length);
  }
  
  // Test attaching a listener
  console.log('\n🧪 [TEST] Attempting to attach test listener...');
  
  let testListenerFired = false;
  const testHandler = (data) => {
    console.log('✅✅✅ [TEST] TEST LISTENER FIRED! 🎉');
    console.log('🧪 [TEST] Data:', data);
    testListenerFired = true;
  };
  
  // Attach using the socket reference
  socket.on('partner_found', testHandler);
  console.log('🧪 [TEST] Test listener attached via socket.on()');
  
  // Wait to see if it fires
  setTimeout(() => {
    console.log('🧪 [TEST] After 2 seconds - test listener fired?', testListenerFired);
    if (!testListenerFired) {
      console.warn('⚠️ [TEST] Test listener did NOT fire - listening may be broken');
      console.warn('⚠️ [TEST] This explains why partner_found is not updating the UI');
    }
    
    // Remove test listener
    socket.off('partner_found', testHandler);
    console.log('🧪 [TEST] Test listener removed\n\n');
  }, 2000);
};
