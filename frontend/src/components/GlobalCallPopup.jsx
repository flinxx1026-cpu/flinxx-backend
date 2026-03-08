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
      callAccepted: true  // ✅ Flag to show IncomingCallScreen instead of popup
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
  if (!incomingCall) {
    return null;
  }

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
