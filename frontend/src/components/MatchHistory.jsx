import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './MatchHistory.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const MatchHistory = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('token');

  // Fetch match history from API
  const fetchMatches = async () => {
    if (!user?.uuid) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/matches?userId=${user.uuid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🔍 [MatchHistory] API Response:', data);
      if (data.success && data.data) {
        console.log('📋 [MatchHistory] Sample match:', data.data[0]);
        // Transform API response to match UI format
        const formattedMatches = data.data.map((match) => {
          const date = new Date(match.created_at);
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          // Format duration as MM:SS
          const totalSeconds = match.duration_seconds || 0;
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          const durationStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

          // Get first letter of name for avatar fallback
          const avatarLetter = match.matched_user_name?.charAt(0).toUpperCase() || 'U';

          return {
            id: match.id,
            username: match.matched_user_name,
            name: match.matched_user_name,
            location: match.matched_user_country || 'Unknown',
            duration: durationStr,
            date: dateStr,
            time: timeStr,
            avatar: avatarLetter,
            profileImage: match.profileImage || match.photo_url || null,
            liked: match.is_liked || false,
            matched_user_id: match.matched_user_id,
            matched_user_public_id: match.matched_user_public_id,
            hasBlueTick: !!(match.has_blue_tick && match.blue_tick_expires_at && new Date(match.blue_tick_expires_at) > new Date())
          };
        });

        setMatches(formattedMatches);
        console.log('✅ Match history loaded:', formattedMatches.length, 'matches');
      } else {
        setMatches([]);
      }
    } catch (err) {
      console.error('❌ Error fetching matches:', err);
      setError(err.message);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch matches when modal opens
  useEffect(() => {
    if (isOpen && user?.uuid) {
      fetchMatches();
    }
  }, [isOpen, user?.uuid]);

  const toggleLike = async (matchId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/matches/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ matchId })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to like match');
      }

      // Update local state
      setMatches(matches.map(match =>
        match.id === matchId ? { ...match, liked: !match.liked } : match
      ));
      console.log('❤️ Match liked:', matchId);
    } catch (err) {
      console.error('❌ Error liking match:', err);
    }
  };

  const deleteMatch = async (matchId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/matches/${matchId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete match');
      }

      // Update local state
      setMatches(matches.filter(match => match.id !== matchId));
      console.log('🗑️ Match deleted:', matchId);
    } catch (err) {
      console.error('❌ Error deleting match:', err);
    }
  };

  const sendFriendRequest = async (match) => {
    try {
      // ✅ Use publicId (camelCase) from AuthContext user object
      const senderPublicId = user?.publicId || user?.uuid || user?.id;
      const receiverPublicId = match.matched_user_public_id;
      
      if (!senderPublicId || !receiverPublicId) {
        console.error('❌ Missing public IDs for friend request:', { 
          senderPublicId, 
          receiverPublicId 
        });
        alert('Unable to send friend request - missing user information');
        return;
      }

      console.log('🚀 [MatchHistory] Sending friend request:', {
        senderPublicId,
        receiverPublicId,
        receiverName: match.name
      });

      const response = await fetch(
        `${BACKEND_URL}/api/friends/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            senderPublicId,
            receiverPublicId
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send friend request');
      }

      const result = await response.json();
      console.log('✅ Friend request sent:', result);
      alert(`Friend request sent to ${match.name}!`);
    } catch (err) {
      console.error('❌ Error sending friend request:', err);
      alert(`Error: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-start pt-24 pl-8 z-50" onClick={onClose}>
      <style>{`
        .glass-dark {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glow-hover-blue:hover {
          background-color: rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.2);
        }
        .glow-hover-red:hover {
          background-color: rgba(239, 68, 68, 0.2);
          box-shadow: 0 0 20px 5px rgba(239, 68, 68, 0.2);
        }
        .has-tooltip {
          position: relative;
        }
        .tooltip {
          visibility: hidden;
          position: absolute;
          z-index: 50;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 10px;
          background-color: #000;
          color: #fff;
          font-size: 0.75rem;
          white-space: nowrap;
          border-radius: 6px;
          opacity: 0;
          transition: opacity 0.2s, visibility 0.2s;
          pointer-events: none;
        }
        .has-tooltip:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
        .tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #000 transparent transparent transparent;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
        }
      `}</style>
      
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white tracking-tight">Match History</h1>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white w-10 h-10 flex items-center justify-center transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-300">Loading your matches...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-400">Error loading matches: {error}</p>
            </div>
          )}
          
          {!isLoading && !error && matches.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-300">No match history yet</p>
            </div>
          )}
          
          {!isLoading && matches.map(match => (
            <div key={match.id} className="group relative bg-slate-800/40 hover:bg-slate-800 p-4 rounded-2xl border border-gray-800 transition-all duration-300">
              <div className="flex items-center gap-4">
                {/* Date & Time */}
                <div className="flex flex-col min-w-[100px]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{match.date}</span>
                  <span className="text-sm font-medium text-gray-300">{match.time}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-400">schedule</span>
                    <span className="text-xs font-mono text-indigo-400">{match.duration}</span>
                  </div>
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    {match.profileImage ? (
                      <img
                        src={match.profileImage}
                        alt={match.name}
                        className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white/10"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-white/10">
                        {match.avatar}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="text-lg font-bold text-white leading-tight">{match.name}</span>
                      {match.hasBlueTick && (
                        <img src="/bluetick.png" alt="Verified" style={{ width: '38px', height: '38px', marginLeft: '4px', marginTop: '-3px', marginBottom: '-7px', flexShrink: 0, objectFit: 'contain' }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <div className="has-tooltip">
                    <button 
                      onClick={() => sendFriendRequest(match)}
                      className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all glow-hover-blue"
                    >
                      <span className="material-symbols-outlined text-lg">group</span>
                    </button>
                    <span className="tooltip">Add Friends</span>
                  </div>
                  <div className="has-tooltip">
                    <button 
                      onClick={() => deleteMatch(match.id)}
                      className="w-9 h-9 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all glow-hover-red"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                    <span className="tooltip">Delete</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;
