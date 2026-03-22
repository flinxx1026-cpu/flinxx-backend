import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import socketWrapper from '../services/socketService';
import CallPopup from './CallPopup';
import IncomingCallScreen from './IncomingCallScreen';
import CallingWaitScreen from './CallingWaitScreen';

/**
 * GlobalCallPopup - Renders at app root level
 * Shows incoming call notification on ANY screen (dashboard, different chat, etc)
 * When accepted, shows IncomingCallScreen.jsx for direct user-to-user calls
 * Accessible from AuthContext which is available everywhere
 */
const GlobalCallPopup = ({ onAccept, onReject }) => {
  const { user, incomingCall, setIncomingCall, callType, setCallType, directCallData, setDirectCallData, localStream, setLocalStream } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(false);
  const [noResponseToast, setNoResponseToast] = useState(false);
  const callerTimeoutRef = useRef(null);
  const receiverTimeoutRef = useRef(null);

  const hasCall = !!incomingCall;
  const callerName = incomingCall?.callerName || 'Unknown User';

  console.log('🎨 [GlobalCallPopup RENDER]');
  console.log(`   hasCall: ${hasCall}`);
  console.log(`   callType: ${callType}`);
  console.log(`   caller: ${callerName}`);
  console.log(`   currentUser: ${user?.uuid?.substring(0, 8)}...`);
  console.log(`   directCallData.callerId: ${directCallData?.callerId?.substring(0, 8)}...`);
  console.log(`   localStream available: ${!!localStream}`);

  // ✅ Get user's camera stream ONCE when component mounts (or when needed)
  const getLocalStream = async () => {
    // If we already have a stream, reuse it
    if (localStream) {
      console.log('✅ [GlobalCallPopup] Using existing camera stream from context');
      return localStream;
    }

    try {
      console.log('📹 [GlobalCallPopup] Requesting camera access for the first time...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      console.log('✅ [GlobalCallPopup] Local stream acquired - storing in global context');
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('❌ [GlobalCallPopup] Camera access denied:', error);
      alert('Camera access denied. Please enable camera permissions.');
      return null;
    }
  };

  // ✅ Request camera ONLY when there's an incoming call (not on mount)
  // This prevents the green camera indicator from showing on the landing page
  useEffect(() => {
    if (!localStream && user && incomingCall) {
      console.log('📹 [GlobalCallPopup] Incoming call detected - requesting camera...');
      getLocalStream();
    }
  }, [user, incomingCall]); // Only trigger when there's an actual incoming call

  // ✅ 18-SECOND TIMEOUT FOR CALLER - Auto end call if no response
  useEffect(() => {
    // Only run when caller is waiting (CallingWaitScreen is shown)
    const isCallerWaiting = callType === 'direct' && directCallData && directCallData.callerId === user?.uuid && !directCallData.callAccepted;
    
    if (isCallerWaiting) {
      console.log('⏱️ [GlobalCallPopup] Starting 18-second caller timeout...');
      callerTimeoutRef.current = setTimeout(() => {
        console.log('⏱️ [GlobalCallPopup] 18 seconds passed - No response from user');
        
        // ✅ Emit call_no_answer FIRST to save missed call message in DB
        console.log('📵 [GlobalCallPopup] Emitting call_no_answer to save missed call in chat...');
        socketWrapper.emit('call_no_answer', {
          callerId: directCallData.callerId,
          receiverId: directCallData.receiverId,
          callerName: user?.name || 'Unknown',
          timestamp: new Date().toISOString()
        });
        
        // Emit call_ended to backend
        socketWrapper.emit('call_ended', {
          callerId: directCallData.callerId,
          receiverId: directCallData.receiverId,
          timestamp: new Date().toISOString()
        });
        
        // Show "No response" toast
        setNoResponseToast(true);
        
        // Clean up call state
        setCallType(null);
        setDirectCallData(null);
        setIncomingCall(null);
        
        // Hide toast after 3 seconds
        setTimeout(() => setNoResponseToast(false), 3000);
      }, 18000);
    }
    
    return () => {
      if (callerTimeoutRef.current) {
        clearTimeout(callerTimeoutRef.current);
        callerTimeoutRef.current = null;
      }
    };
  }, [callType, directCallData?.callAccepted, directCallData?.callerId, user?.uuid]);

  // ✅ 18-SECOND TIMEOUT FOR RECEIVER - Auto dismiss incoming call popup
  useEffect(() => {
    if (incomingCall && !directCallData?.callAccepted) {
      console.log('⏱️ [GlobalCallPopup] Starting 18-second receiver popup timeout...');
      receiverTimeoutRef.current = setTimeout(() => {
        console.log('⏱️ [GlobalCallPopup] 18 seconds passed - Auto dismissing incoming call popup');
        setIncomingCall(null);
      }, 18000);
    }
    
    return () => {
      if (receiverTimeoutRef.current) {
        clearTimeout(receiverTimeoutRef.current);
        receiverTimeoutRef.current = null;
      }
    };
  }, [incomingCall, directCallData?.callAccepted]);

  // Show IncomingCallScreen if call was accepted (for both caller and receiver)
  if (callType === 'direct' && directCallData && directCallData.callAccepted) {
    console.log('📞 [GlobalCallPopup] ACTIVE CALL - Showing IncomingCallScreen');
    
    return (
      <IncomingCallScreen
        callerName={directCallData.callerName}
        callerAvatar={directCallData.callerName?.charAt(0).toUpperCase()}
        onAccept={() => {
          console.log('✅ [GlobalCallPopup → IncomingCallScreen] User accepted call');
        }}
        onReject={() => {
          console.log('❌ [GlobalCallPopup → IncomingCallScreen] User hung up call');
          
          // ✅ EMIT CALL_ENDED EVENT TO BACKEND
          console.log('📡 [GlobalCallPopup] Emitting call_ended event to backend...');
          socketWrapper.emit('call_ended', {
            callerId: directCallData.callerId,
            receiverId: directCallData.receiverId,
            timestamp: new Date().toISOString()
          });
          console.log('✅ [GlobalCallPopup] call_ended event sent - both users will disconnect');
          
          setCallType(null);
          setDirectCallData(null);
          setIncomingCall(null);
          // Keep localStream available for next call
        }}
        isLoading={isAccepting}
        localStream={localStream}
        directCallData={directCallData}
        isFriend={directCallData?.isFriend || false}
      />
    );
  }

  // Show CallingWaitScreen if THIS user is the caller and waiting for answer
  if (callType === 'direct' && directCallData && directCallData.callerId === user?.uuid && !directCallData.callAccepted) {
    console.log('📞 [GlobalCallPopup] CALLER view - Showing CallingWaitScreen');
    console.log('   Waiting for:', directCallData.recipientName);
    console.log('   localStream available:', !!localStream);
    
    // ✅ REQUEST CAMERA IMMEDIATELY if not already available
    if (!localStream) {
      console.log('📹 [GlobalCallPopup] CallingWaitScreen shown but NO STREAM - requesting camera NOW...');
      getLocalStream();
    }
    
    return (
      <CallingWaitScreen
        callerName={directCallData.recipientName || 'Unknown User'}
        callerAvatar={(directCallData.recipientName || 'U')?.charAt(0).toUpperCase()}
        callerImage={user?.picture}
        localStream={localStream}
        onCancel={() => {
          console.log('❌ [GlobalCallPopup → CallingWaitScreen] Caller ended call');
          
          // ✅ EMIT call_no_answer FIRST to save missed call in DB
          console.log('📵 [GlobalCallPopup] Caller cancelled - saving missed call to DB...');
          socketWrapper.emit('call_no_answer', {
            callerId: directCallData.callerId,
            receiverId: directCallData.receiverId,
            callerName: user?.name || 'Unknown',
            timestamp: new Date().toISOString()
          });
          
          // ✅ EMIT CALL_ENDED EVENT TO BACKEND
          console.log('📡 [GlobalCallPopup] Emitting call_ended event to backend...');
          socketWrapper.emit('call_ended', {
            callerId: directCallData.callerId,
            receiverId: directCallData.receiverId,
            timestamp: new Date().toISOString()
          });
          console.log('✅ [GlobalCallPopup] call_ended event sent - receiver will also disconnect');
          
          setCallType(null);
          setDirectCallData(null);
          setIncomingCall(null);
          // Keep localStream available for next call
        }}
        isLoading={isAccepting}
      />
    );
  }

  const handleAccept = async () => {
    console.log('\n' + '='.repeat(80));
    console.log('📞 [GlobalCallPopup] ACCEPTING DIRECT CALL');
    console.log('='.repeat(80));
    console.log('📞 [GlobalCallPopup] Caller:', incomingCall.callerName);
    
    setIsAccepting(true);

    // ✅ Camera stream already requested globally - just use it
    // No need to request permission again
    console.log('✅ [GlobalCallPopup] Using global camera stream (no permission request)');

    // Set direct call type and data with callAccepted flag
    console.log('📞 [GlobalCallPopup] Setting callType = "direct" and callAccepted = true');
    setCallType('direct');
    setDirectCallData({
      callerId: incomingCall.callerId,
      callerName: incomingCall.callerName,
      receiverId: incomingCall.receiverId,
      timestamp: incomingCall.timestamp,
      callAccepted: true,  // ✅ Flag to show IncomingCallScreen instead of popup
      isFriend: true  // ✅ Calls are initiated from friends list - both are friends
    });

    // ✅ EMIT CALL_ACCEPTED EVENT TO BACKEND
    console.log('📡 [GlobalCallPopup] Emitting call_accepted event to backend...');
    socketWrapper.emit('call_accepted', {
      callerId: incomingCall.callerId,
      receiverId: incomingCall.receiverId,
      callerName: incomingCall.callerName,
      timestamp: new Date().toISOString()
    });
    console.log('✅ [GlobalCallPopup] call_accepted event sent to backend');
    console.log('✅ [GlobalCallPopup] IncomingCallScreen should appear NOW for both users');
    console.log('='.repeat(80) + '\n');

    if (onAccept) {
      await onAccept(incomingCall);
    }
    
    setIsAccepting(false);
  };

  const handleReject = async () => {
    console.log('❌ [GlobalCallPopup] Call rejected:', incomingCall.callerName);
    
    // ✅ EMIT call_no_answer to save missed call message in DB
    console.log('📵 [GlobalCallPopup] Receiver rejected - saving missed call to DB...');
    socketWrapper.emit('call_no_answer', {
      callerId: incomingCall.callerId,
      receiverId: incomingCall.receiverId || user?.uuid,
      callerName: incomingCall.callerName || 'Unknown',
      timestamp: new Date().toISOString()
    });
    
    // ✅ EMIT call_ended to notify caller immediately
    console.log('📡 [GlobalCallPopup] Emitting call_ended to dismiss caller\'s CallingWaitScreen...');
    socketWrapper.emit('call_ended', {
      callerId: incomingCall.callerId,
      receiverId: incomingCall.receiverId || user?.uuid,
      timestamp: new Date().toISOString()
    });
    
    if (onReject) {
      await onReject(incomingCall);
    }
    
    // Reset call-related states (but keep localStream for next call)
    setCallType(null);
    setDirectCallData(null);
    setIncomingCall(null);
    // ✅ Keep localStream available for next call - don't stop it
  };

  const handleClose = () => {
    console.log('❌ [GlobalCallPopup] Closing popup');
    handleReject();
  };

  // Only show CallPopup notification if there's an incoming call from someone else
  if (!incomingCall && !noResponseToast) {
    return null;
  }

  // ✅ SHOW "No response from user" TOAST
  if (noResponseToast) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div style={{
          background: 'linear-gradient(135deg, #1f2937, #111827)',
          color: '#fff',
          padding: '16px 32px',
          borderRadius: '999px',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 15px rgba(239, 68, 68, 0.3)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>📵</span>
          No response from user
        </div>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  if (!incomingCall) return null;

  // Show notification popup (CallPopup)
  return (
    <CallPopup
      callerName={incomingCall.callerName}
      callerAvatar={incomingCall.callerProfileImage || incomingCall.callerName?.charAt(0).toUpperCase()}
      onAccept={handleAccept}
      onReject={handleReject}
      isLoading={isAccepting}
    />
  );
};

export default GlobalCallPopup;
