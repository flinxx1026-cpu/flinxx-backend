// 🚀 QUICK INVITE SERVICE - Real-time popup invites (NO pending requests)
// Used by profile icon for instant friend invites
// Different from SearchModal which creates pending requests

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * 🚀 Send a quick friend invite (real-time popup, no pending request)
 * 
 * This is used by profile icons for instant invites.
 * The receiving user sees an immediate popup on their dashboard.
 * NO pending request is created in the Friends & Requests panel.
 * 
 * @param {string} senderPublicId - Current user's ID
 * @param {string} receiverPublicId - Target user's ID
 * @returns {Promise<{success: boolean, ephemeral: boolean, inviteId?: string, error?: string}>}
 */
export const sendQuickInvite = async (senderPublicId, receiverPublicId) => {
  try {
    console.log('🚀 [QuickInvite] Sending quick invite...');
    console.log('   From:', senderPublicId);
    console.log('   To:', receiverPublicId);

    if (!senderPublicId || !receiverPublicId) {
      console.error('❌ [QuickInvite] Missing sender or receiver ID');
      return {
        success: false,
        error: 'Missing sender or receiver ID'
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/friends/quick-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        senderPublicId: String(senderPublicId),
        receiverPublicId: String(receiverPublicId)
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ [QuickInvite] Invite sent successfully (ephemeral, no pending request)');
      return {
        success: true,
        ephemeral: data.ephemeral || true,
        inviteId: data.inviteId
      };
    } else {
      const errorData = await response.json();
      console.error('❌ [QuickInvite] Failed to send invite:', errorData);
      return {
        success: false,
        error: errorData.error || 'Failed to send quick invite'
      };
    }
  } catch (error) {
    console.error('❌ [QuickInvite] Network error:', error);
    return {
      success: false,
      error: error.message || 'Network error'
    };
  }
};

export default {
  sendQuickInvite
};
