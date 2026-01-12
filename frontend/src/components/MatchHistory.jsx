import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './MatchHistory.css';

const MatchHistory = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch match history from API
  const fetchMatches = async () => {
    if (!user?.uuid) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/matches', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || ''}`,
          'X-User-Id': user.uuid
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
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

          // Get first letter of name for avatar
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
            liked: match.is_liked || false,
            matched_user_id: match.matched_user_id
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
      const response = await fetch('/api/matches/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || ''}`,
          'X-User-Id': user.uuid
        },
        body: JSON.stringify({ matchId })
      });

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
      const response = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || ''}`,
          'X-User-Id': user.uuid
        }
      });

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

  if (!isOpen) return null;

  return (
    <div className="match-history-overlay" onClick={onClose}>
      <div className="match-history-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="match-history-header">
          <h2>Match History</h2>
          <button className="match-history-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Matches List */}
        <div className="match-history-list">
          {isLoading && (
            <div className="match-history-empty">
              <p>Loading your matches...</p>
              <p className="match-history-empty-sub">Please wait</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="match-history-empty">
              <p>Error loading matches</p>
              <p className="match-history-empty-sub">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && matches.length === 0 ? (
            <div className="match-history-empty">
              <p>No match history yet</p>
              <p className="match-history-empty-sub">Start video chatting to build your history!</p>
            </div>
          ) : (
            !isLoading && matches.map(match => (
              <div key={match.id} className="match-card">
                {/* Left: Date & Time */}
                <div className="match-card-date">
                  <div className="match-card-datetime">
                    <span className="match-date">{match.date}</span>
                    <span className="match-time">{match.time}</span>
                  </div>
                  <div className="match-duration">
                    ⏱️ {match.duration}
                  </div>
                </div>

                {/* Middle: User Info */}
                <div className="match-card-user">
                  <div className="match-card-avatar">
                    {match.avatar === 'M' ? (
                      <div className="avatar-initial">M</div>
                    ) : (
                      <span>{match.avatar}</span>
                    )}
                  </div>
                  <div className="match-card-info">
                    <p className="match-card-name">{match.name}</p>
                    <p className="match-card-location">📍 {match.location}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="match-card-actions">
                  <button
                    className={`action-btn like-btn ${match.liked ? 'liked' : ''}`}
                    onClick={() => toggleLike(match.id)}
                    title="Like this match"
                  >
                    ❤️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteMatch(match.id)}
                    title="Delete from history"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;
