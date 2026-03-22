import React, { useEffect, useRef, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useDirectCallWebRTC from '../hooks/useDirectCallWebRTC';

const IncomingCallScreen = ({ 
  callerName, 
  callerAvatar,
  onAccept, 
  onReject,
  isLoading = false,
  localStream = null,  // ✅ Accept MediaStream directly
  directCallData = null,  // ✅ NEW: Call metadata (callerId, receiverId, etc)
  isFriend = false,  // ✅ NEW: Friend status for icon display
}) => {
  const { user } = useContext(AuthContext);
  const localVideoPreviewRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [actualFriendStatus, setActualFriendStatus] = useState(isFriend);
  const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;

  // ✅ Determine if current user is the caller
  const isCurrentUserCaller = directCallData?.callerId === user?.uuid;
  
  // ✅ Determine the partner's name
  // If current user is caller, partner is the receiver (but we don't have their name yet)
  // If current user is receiver, partner is the caller
  const partnerName = isCurrentUserCaller 
    ? (directCallData?.recipientName || 'Waiting for answer...')  // Show receiver's name (recipientName)
    : (callerName || 'Unknown User');  // Receiver sees caller's name

  // ✅ Get the other user's ID (not current user)
  const otherUserId = isCurrentUserCaller ? directCallData?.receiverId : directCallData?.callerId;

  // ✅ FETCH ACTUAL FRIEND STATUS when call is active
  useEffect(() => {
    if (!otherUserId || !user?.uuid) return;

    // If isFriend was already passed as true, use it
    if (isFriend) {
      setActualFriendStatus(true);
      return;
    }

    // Otherwise, fetch friend status from API
    const checkFriendStatus = async () => {
      try {
        // Check if the other user is in the current user's friends list
        const response = await fetch(`${BACKEND_URL}/api/friends/${user.uuid}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const friendsList = await response.json();
          const isFriendsNow = Array.isArray(friendsList) && 
            friendsList.some(f => f.id === otherUserId || f.uuid === otherUserId);
          setActualFriendStatus(isFriendsNow);
        }
      } catch (error) {
        console.log('Error checking friend status:', error);
        // Default to isFriend prop if fetch fails
        setActualFriendStatus(isFriend);
      }
    };

    checkFriendStatus();
  }, [otherUserId, user?.uuid, isFriend]);

  // ✅ Initialize WebRTC for direct call
  useDirectCallWebRTC({
    directCallData,
    localStream,
    remoteVideoRef,
    userId: user?.uuid,
    isLocalUser: isCurrentUserCaller
  });

  // ✅ Attach local stream to preview video element
  useEffect(() => {
    if (localVideoPreviewRef.current && localStream) {
      localVideoPreviewRef.current.srcObject = localStream;
      localVideoPreviewRef.current.muted = true;
      localVideoPreviewRef.current.play().catch(() => {});
    }
  }, [localStream]);
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full h-screen flex items-center justify-center px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl h-[85vh]">
        
        {/* LEFT SIDE - Local Camera (You) */}
        <div className="relative bg-gray-600 border-2 border-yellow-600 rounded-2xl flex flex-col overflow-hidden">
          
          {/* Header with Your Info */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/50 border-2 border-white/20">
              {user?.picture ? (
                <img src={user.picture} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'Y'
              )}
            </div>
            
            {/* Your Name and Status */}
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {user?.name || 'You'}
              </h2>
              <p className="text-yellow-400 text-xs font-medium">You</p>
            </div>
          </div>

          {/* Show local camera if available, otherwise show placeholder */}
          {localStream ? (
            <video
              ref={localVideoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ backgroundColor: '#000' }}
            />
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-600">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg 
                  fill="none" 
                  height="120" 
                  viewBox="0 0 100 100" 
                  width="120" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 70L25 50H75L80 70H20Z" stroke="white" strokeWidth="2.5"></path>
                  <rect fill="white" height="5" width="50" x="25" y="45"></rect>
                  <circle cx="50" cy="35" r="12" stroke="white" strokeWidth="2.5"></circle>
                  <rect fill="white" height="6" rx="3" width="12" x="44" y="32"></rect>
                  <circle cx="53" cy="35" fill="#8C8C8C" r="2"></circle>
                </svg>
              </div>
            </div>
          )}

          {/* You Badge */}
          <div className="absolute bottom-6 left-6">
            <div className="bg-black border border-gray-700 rounded-full px-4 py-1.5 flex items-center space-x-2 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-white text-[10px] font-bold tracking-wider leading-none">YOU</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Remote Camera (Caller/Other User) */}
        <div className="relative bg-black border-2 border-yellow-600 rounded-2xl flex flex-col overflow-hidden">
          
          {/* Header with Caller Info */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/50 border-2 border-white/20">
                {callerAvatar || partnerName?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {/* Caller Name and Status */}
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">
                  {partnerName}
                </h2>
              </div>
            </div>

            {/* End Call Button */}
            <button 
              onClick={onReject}
              disabled={isLoading}
              className="w-12 h-12 bg-red-700 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 border-2 border-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="End Call"
            >
              <span className="material-symbols-outlined text-2xl">call_end</span>
            </button>
          </div>
          
          {/* Remote video element */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ backgroundColor: '#000' }}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallScreen;
