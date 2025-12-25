import React, { useState } from 'react';
import './SearchFriendsModal.css';

const SearchFriendsModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (value) => {
    setSearch(value);
    
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${BACKEND_URL}/api/search-user?q=${encodeURIComponent(value)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Search error:', response.status);
        setResults([]);
        return;
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
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
                  <p className="result-id">ID: {user.userId}</p>
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
