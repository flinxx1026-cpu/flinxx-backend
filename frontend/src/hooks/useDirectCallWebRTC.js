import { useEffect, useRef } from 'react';
import socketWrapper from '../services/socketService';
import { getIceServers } from '../utils/webrtcUtils';

/**
 * useDirectCallWebRTC - Manages WebRTC peer connection for direct user-to-user calls
 * 
 * Handles:
 * - Creating peer connection
 * - Adding local tracks
 * - Receiving remote tracks
 * - Exchanging offers/answers
 * - Exchanging ICE candidates
 * 
 * Similar to Chat.jsx but for direct calls with known peer IDs
 */
export const useDirectCallWebRTC = ({
  directCallData,           // { callerId, receiverId, callAccepted }
  localStream,              // Local MediaStream from camera
  remoteVideoRef,           // Ref to remote video element
  onRemoteStreamReady,      // Callback when remote stream is received
  userId,                   // Current user ID
  isLocalUser               // Is current user the original caller?
}) => {
  const peerConnectionRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const iceCandidateBufferRef = useRef([]);
  const isOfferingRef = useRef(false); // Track if we're the offerer (caller)

  // Initialize WebRTC peer connection and set up listeners
  useEffect(() => {
    if (!directCallData?.callAccepted || !localStream) {
      console.log('❌ [useDirectCallWebRTC] Conditions not met:', {
        callAccepted: directCallData?.callAccepted,
        hasLocalStream: !!localStream
      });
      return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎯 [useDirectCallWebRTC] INITIALIZING WEBRTC FOR DIRECT CALL');
    console.log('='.repeat(80));
    console.log('📋 Call Data:', {
      callerId: directCallData.callerId?.substring(0, 8) + '...',
      receiverId: directCallData.receiverId?.substring(0, 8) + '...',
      currentUserId: userId?.substring(0, 8) + '...',
      callAccepted: directCallData.callAccepted
    });

    // Determine if this user is the offerer (caller)
    isOfferingRef.current = directCallData.callerId === userId;
    console.log('👤 User role:', isOfferingRef.current ? 'OFFERER (Caller)' : 'ANSWERER (Receiver)');

    const createPeerConnection = async () => {
      console.log('\n🔧 Creating peer connection for direct call');

      const iceServers = await getIceServers();
      console.log('🧊 ICE servers configured:', iceServers.length > 0 ? 'Yes' : 'No');

      const peerConnection = new RTCPeerConnection({
        iceServers,
        iceTransportPolicy: 'all'
      });

      peerConnectionRef.current = peerConnection;
      console.log('✅ RTCPeerConnection created');

      // Initialize persistent remote stream
      remoteStreamRef.current = new MediaStream();
      console.log('✅ Remote MediaStream initialized');

      // ✅ Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('🧊 ICE candidate generated:', {
            type: event.candidate.type,
            protocol: event.candidate.protocol
          });

          socketWrapper.emit('direct_call:ice_candidate', {
            candidate: event.candidate,
            from: userId,
            to: isOfferingRef.current ? directCallData.receiverId : directCallData.callerId
          });
        } else {
          console.log('🧊 ICE gathering complete');
        }
      };

      // ✅ Handle remote tracks
      peerConnection.ontrack = (event) => {
        console.log('📥 ===== REMOTE TRACK RECEIVED =====');
        console.log('📥 Track kind:', event.track.kind);
        console.log('📥 Track enabled:', event.track.enabled);

        remoteStreamRef.current.addTrack(event.track);
        console.log('📥 Stream tracks count:', remoteStreamRef.current.getTracks().length);

        // Attach to video element
        if (remoteVideoRef?.current) {
          if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
            console.log('📺 ATTACHING REMOTE STREAM to video element');
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
            remoteVideoRef.current.muted = false;

            // Try to play video
            remoteVideoRef.current.play().catch(() => {
              console.log('ℹ️ Autoplay policy - will play on user interaction');
            });
          } else {
            console.log('📺 Stream already attached, adding new track:', event.track.kind);
          }
        }

        if (onRemoteStreamReady) {
          onRemoteStreamReady(remoteStreamRef.current);
        }
      };

      // ✅ Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('\n🔌 ===== CONNECTION STATE CHANGED =====');
        console.log('🔌 New Connection State:', peerConnection.connectionState);

        if (peerConnection.connectionState === 'connected') {
          console.log('✅ WebRTC connection ESTABLISHED - video should start flowing');
        } else if (peerConnection.connectionState === 'failed') {
          console.error('❌ Connection FAILED');
        } else if (peerConnection.connectionState === 'closed') {
          console.log('🛑 Connection CLOSED');
        }
      };

      // ✅ Add local tracks to peer connection
      console.log('\n📹 Adding local tracks to peer connection');
      const allTracks = localStream.getTracks();
      console.log('📹 Total local tracks:', allTracks.length);

      allTracks.forEach((track, index) => {
        console.log(`  [${index}] Adding ${track.kind} track (id: ${track.id})`);
        try {
          const sender = peerConnection.addTrack(track, localStream);
          console.log(`  [${index}] ✅ addTrack succeeded`);
        } catch (err) {
          console.error(`  [${index}] ❌ addTrack failed:`, err.message);
        }
      });

      console.log('✅ All local tracks added');

      return peerConnection;
    };

    // Create peer connection and handle offer/answer based on role
    const setupCall = async () => {
      try {
        const pc = await createPeerConnection();

        if (isOfferingRef.current) {
          // OFFERER: Create and send offer
          console.log('\n📋 ===== OFFERER CREATING OFFER =====');
          const offer = await pc.createOffer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true
          });

          console.log('✅ Offer created');
          await pc.setLocalDescription(offer);
          console.log('✅ Local description set');

          console.log('📤 Sending offer to receiver...');
          socketWrapper.emit('direct_call:offer', {
            offer: offer,
            from: userId,
            to: directCallData.receiverId
          });
          console.log('📤 Offer sent');
        } else {
          // ANSWERER: Wait for offer (listener will be set up below)
          console.log('\n📭 ANSWERER: Waiting for offer from caller...');
        }
      } catch (error) {
        console.error('❌ Error setting up call:', error);
      }
    };

    // Set up socket listeners for offer/answer/ICE
    const handleOffer = async (data) => {
      console.log('\n📩 ===== ANSWERER RECEIVED OFFER =====');
      console.log('📩 From:', data.from?.substring(0, 8) + '...');

      if (!peerConnectionRef.current) {
        console.log('📩 Creating peer connection for answer...');
        await createPeerConnection();
      }

      const pc = peerConnectionRef.current;

      try {
        // Flush buffered ICE candidates
        console.log('📩 Flushing buffered ICE candidates...');
        while (iceCandidateBufferRef.current.length > 0) {
          const candidate = iceCandidateBufferRef.current.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.warn('⚠️ Could not add buffered ICE candidate:', err.message);
          }
        }

        console.log('📩 Setting remote description (offer)...');
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        console.log('✅ Remote description set');

        // Add local tracks before creating answer
        console.log('\n📹 Adding local tracks...');
        const allTracks = localStream.getTracks();
        console.log('📹 Total local tracks:', allTracks.length);

        allTracks.forEach((track, index) => {
          console.log(`  [${index}] Adding ${track.kind} track`);
          try {
            pc.addTrack(track, localStream);
            console.log(`  [${index}] ✅ addTrack succeeded`);
          } catch (err) {
            console.error(`  [${index}] ❌ addTrack failed:`, err.message);
          }
        });

        // Create and send answer
        console.log('\n📋 ===== ANSWERER CREATING ANSWER =====');
        const answer = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true
        });

        console.log('✅ Answer created');
        await pc.setLocalDescription(answer);
        console.log('✅ Local description set');

        console.log('📤 Sending answer to caller...');
        socketWrapper.emit('direct_call:answer', {
          answer: answer,
          from: userId,
          to: data.from
        });
        console.log('📤 Answer sent');
      } catch (error) {
        console.error('❌ Error handling offer:', error);
      }
    };

    const handleAnswer = async (data) => {
      console.log('\n✅ ===== OFFERER RECEIVED ANSWER =====');
      console.log('✅ From:', data.from?.substring(0, 8) + '...');

      if (!peerConnectionRef.current) {
        console.error('❌ ERROR: No peer connection exists for answer!');
        return;
      }

      try {
        const pc = peerConnectionRef.current;

        // Flush buffered ICE candidates
        console.log('✅ Flushing buffered ICE candidates...');
        while (iceCandidateBufferRef.current.length > 0) {
          const candidate = iceCandidateBufferRef.current.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.warn('⚠️ Could not add buffered ICE candidate:', err.message);
          }
        }

        console.log('✅ Setting remote description (answer)...');
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log('✅ Remote description set - WebRTC connection should now establish');
      } catch (error) {
        console.error('❌ Error handling answer:', error);
      }
    };

    const handleIceCandidate = async (data) => {
      console.log('🧊 Received ICE candidate from:', data.from?.substring(0, 8) + '...');

      if (!peerConnectionRef.current) {
        console.log('🧊 Peer connection not ready - buffering candidate');
        iceCandidateBufferRef.current.push(data.candidate);
        return;
      }

      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log('✅ ICE candidate added');
      } catch (error) {
        console.warn('⚠️ Could not add ICE candidate:', error.message);
      }
    };

    // Attach listeners
    socketWrapper.on('direct_call:offer', handleOffer);
    socketWrapper.on('direct_call:answer', handleAnswer);
    socketWrapper.on('direct_call:ice_candidate', handleIceCandidate);

    // If offerer, set up call immediately
    if (isOfferingRef.current) {
      setupCall();
    }

    console.log('🎯 [useDirectCallWebRTC] SETUP COMPLETE');
    console.log('='.repeat(80) + '\n');

    // Cleanup
    return () => {
      console.log('🛑 [useDirectCallWebRTC] Cleaning up WebRTC');
      socketWrapper.off('direct_call:offer', handleOffer);
      socketWrapper.off('direct_call:answer', handleAnswer);
      socketWrapper.off('direct_call:ice_candidate', handleIceCandidate);

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [directCallData?.callAccepted, localStream, userId]);

  return {
    peerConnectionRef,
    remoteStreamRef
  };
};

export default useDirectCallWebRTC;
