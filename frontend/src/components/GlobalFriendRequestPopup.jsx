import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { acceptFriendRequest, rejectFriendRequest } from '../services/api';
import FriendRequestToast from './FriendRequestToast';

/**
 * GlobalFriendRequestPopup - Renders at app root level
 * Shows friend request toast notification on ANY screen (video call, dashboard, etc)
 * Accessible from AuthContext which is available everywhere
 */
const GlobalFriendRequestPopup = () => {
  const { incomingFriendRequest, setIncomingFriendRequest, user } = useContext(AuthContext);

  const hasRequest = !!incomingFriendRequest;
  const requestSender = incomingFriendRequest?.senderName || 'Unknown';

  console.log('🎨 [GlobalFriendRequestPopup RENDER]');
  console.log(`   hasRequest: ${hasRequest}`);
  console.log(`   sender: ${requestSender}`);
  console.log(`   full object:`, incomingFriendRequest);

  // Don't render if no request
  if (!incomingFriendRequest) {
    return null;
  }

  console.log(`🎨 [GlobalFriendRequestPopup] SHOWING TOAST for: ${requestSender}`);

  const handleAccept = async (requestId) => {
    console.log('👍 Accepting friend request:', requestId);
    
    // ✅ Check if this is a quick invite (no database ID yet)
    const isQuickInvite = incomingFriendRequest?.isQuickInvite === true;
    
    if (isQuickInvite) {
      console.log('📱 [QUICK INVITE] Accept clicked - creating and instantly accepting real friend request now...');
      try {
        // ✅ QUICK INVITE ACCEPT: Call the API to create an accepted friendship instantly
        const { acceptQuickInvite } = await import('../services/api');
        
        // The senderPublicId is the person who sent the invite
        // The receiverPublicId is the current user (receiver of the invite)
        const result = await acceptQuickInvite(
          incomingFriendRequest?.senderPublicId,
          user?.publicId || user?.uuid
        );
        
        if (result.success) {
          console.log('✅ [QUICK INVITE ACCEPT] Friendship established instantly!');
          setIncomingFriendRequest(null);
        } else {
          throw new Error('Failed to create friend request');
        }
      } catch (error) {
        console.error('❌ [QUICK INVITE ACCEPT] Error:', error);
      }
    } else {
      // ✅ REGULAR REQUEST: Accept using the existing API
      console.log('📋 [REGULAR REQUEST] Accept clicked - calling API with existing requestId...');
      try {
        await acceptFriendRequest(requestId);
        console.log('✅ Request accepted');
        setIncomingFriendRequest(null);
      } catch (error) {
        console.error('❌ Error accepting request:', error);
      }
    }
  };

  const handleReject = async (requestId) => {
    console.log('👎 Rejecting friend request:', requestId);
    
    // ✅ Check if this is a quick invite (no database ID yet)
    const isQuickInvite = incomingFriendRequest?.isQuickInvite === true;
    
    if (isQuickInvite) {
      console.log('📱 [QUICK INVITE] Reject clicked - just closing popup (no database entry)...');
      setIncomingFriendRequest(null);
    } else {
      // ✅ REGULAR REQUEST: Reject using the existing API
      console.log('📋 [REGULAR REQUEST] Reject clicked - calling API with existing requestId...');
      try {
        await rejectFriendRequest(requestId);
        console.log('✅ Request rejected');
        setIncomingFriendRequest(null);
      } catch (error) {
        console.error('❌ Error rejecting request:', error);
        alert('Failed to reject request');
      }
    }
  };

  const handleClose = () => {
    console.log('❌ Closing toast');
    setIncomingFriendRequest(null);
  };

  return (
    <FriendRequestToast
      request={incomingFriendRequest}
      onAccept={handleAccept}
      onReject={handleReject}
      onClose={handleClose}
    />
  );
};

export default GlobalFriendRequestPopup;
