import React, { useState } from 'react';
import './SearchFriendsModal.css';

const SearchFriendsModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  if (!isOpen) return null;

  const handleSearch = (value) => {
    setSearch(value);
    // TODO: Connect to backend API for friend search
    // For now, just update the search state
    if (value.trim()) {
      // Mock search results
      setResults([]);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-friends-overlay" onClick={onClose}>
      <div className="search-friends-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="search-friends-header">
          <h2>Search Friends</h2>
          <button className="search-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Search Input */}
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search a friend by ID"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
            autoFocus
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Results Container */}
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty-state">
              <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', marginTop: '40px' }}>
                {search ? 'No users found' : 'Start typing to search'}
              </p>
            </div>
          ) : (
            results.map((user) => (
              <div key={user.id} className="search-result-item">
                <div className="result-avatar">{user.avatar || '👤'}</div>
                <div className="result-info">
                  <p className="result-name">{user.name}</p>
                  <p className="result-id">ID: {user.id}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFriendsModal;
