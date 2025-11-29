import React, { useState, useEffect } from 'react';
import './MatchHistory.css';

const MatchHistory = ({ isOpen, onClose }) => {
  const [matches, setMatches] = useState([
    {
      id: 1,
      username: 'Up ke 😊',
      name: 'Up ke',
      location: 'National Capital Territory of Delhi',
      duration: '00:05',
      date: '11/27/2025',
      time: '9:24PM',
      avatar: '😊',
      liked: false
    },
    {
      id: 2,
      username: 'Loup 😊',
      name: 'Loup',
      location: 'Algeria',
      duration: '00:06',
      date: '11/27/2025',
      time: '9:24PM',
      avatar: '😊',
      liked: false
    },
    {
      id: 3,
      username: 'Nish 😊',
      name: 'Nish',
      location: 'Maharashtra',
      duration: '00:04',
      date: '11/27/2025',
      time: '9:24PM',
      avatar: '😊',
      liked: false
    },
    {
      id: 4,
      username: 'Priya 😊',
      name: 'Priya',
      location: 'Gujarat',
      duration: '00:02',
      date: '11/27/2025',
      time: '9:23PM',
      avatar: 'M',
      liked: false
    },
    {
      id: 5,
      username: 'pagbigyamnmako 😊',
      name: 'pagbigyamnmako',
      location: 'Philippines',
      duration: '00:08',
      date: '11/27/2025',
      time: '9:23PM',
      avatar: '😊',
      liked: false
    }
  ]);

  const toggleLike = (id) => {
    setMatches(matches.map(match =>
      match.id === id ? { ...match, liked: !match.liked } : match
    ));
  };

  const deleteMatch = (id) => {
    setMatches(matches.filter(match => match.id !== id));
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
          {matches.length === 0 ? (
            <div className="match-history-empty">
              <p>No match history yet</p>
              <p className="match-history-empty-sub">Start video chatting to build your history!</p>
            </div>
          ) : (
            matches.map(match => (
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
