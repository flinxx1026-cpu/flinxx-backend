import { useState } from 'react'

const Search = ({ isModal = false, onClose = null }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [friendRequestStates, setFriendRequestStates] = useState({})
  const [sendingRequest, setSendingRequest] = useState(null)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const getCurrentUser = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (!storedUser) return null
      return {
        ...storedUser,
        publicId: storedUser.publicId || storedUser.public_id || storedUser.id,
        id: storedUser.uuid || storedUser.id || storedUser.publicId || storedUser.public_id
      }
    } catch (e) {
      return null
    }
  }

  const checkFriendRequestStatus = async (userId) => {
    try {
      const currentUserData = getCurrentUser()
      if (!currentUserData || !currentUserData.id) {
        console.warn('Current user not available for status check')
        return
      }

      const response = await fetch(
        `${BACKEND_URL}/api/friends/status?senderPublicId=${currentUserData.id}&receiverPublicId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setFriendRequestStates(prev => ({
          ...prev,
          [userId]: data.status // 'none', 'pending', 'accepted', 'rejected'
        }))
      }
    } catch (error) {
      console.error('Error checking friend status:', error)
    }
  }

  const getButtonText = (userId) => {
    const status = friendRequestStates[userId]
    if (status === 'pending') return 'SENT'
    if (status === 'accepted') return 'MESSAGE'
    return 'FRIEND'
  }

  const getButtonEmoji = (userId) => {
    const status = friendRequestStates[userId]
    if (status === 'pending') return '⏳'
    if (status === 'accepted') return '💬'
    return '🤝'
  }

  const sendFriendRequest = async (targetUserId, e) => {
    if (e) e.stopPropagation()

    const friendStatus = friendRequestStates[targetUserId]
    if (friendStatus === 'pending' || friendStatus === 'accepted') {
      console.log('Friend request already sent or accepted')
      return
    }

    setSendingRequest(targetUserId)
    try {
      const currentUserData = getCurrentUser()
      const senderId = currentUserData?.uuid || currentUserData?.id || currentUserData?.publicId || currentUserData?.public_id

      if (!senderId) {
        console.error('Current user id not found', currentUserData)
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/friends/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          senderPublicId: String(senderId),
          receiverPublicId: String(targetUserId)
        })
      })

      if (response.ok) {
        setFriendRequestStates(prev => ({
          ...prev,
          [targetUserId]: 'pending'
        }))
        console.log('Friend request sent to:', targetUserId)
      } else {
        console.error('Failed to send friend request')
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
    } finally {
      setSendingRequest(null)
    }
  }

  const handleSearch = async (value) => {
    setSearchQuery(value)
    
    if (!value.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    console.log('🔍 Searching for:', value)

    try {
      const response = await fetch(`${BACKEND_URL}/api/search-user?q=${encodeURIComponent(value)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.error('Search error:', response.status)
        setSearchResults([])
        return
      }

      const data = await response.json()
      setSearchResults(Array.isArray(data) ? data : [])
      console.log('✅ Search results:', data)
      
      // Check friend request status for each result
      if (Array.isArray(data)) {
        data.forEach(user => {
          checkFriendRequestStatus(user.publicId)
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    handleSearch(value)
  }

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800/95 backdrop-blur-md rounded-3xl p-8 border border-white/10 w-full max-w-sm shadow-2xl relative max-h-[80vh] overflow-y-auto">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-800/95 pb-4">
            <h2 className="text-2xl font-bold text-white">Search Friends</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl font-bold transition"
            >
              ✕
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400">
                🔍
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search a friend by ID"
                className="w-full bg-white/10 border border-white/30 rounded-2xl px-12 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/30 transition"
                autoFocus
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-3">
            {isSearching && (
              <div className="text-center py-8">
                <div className="inline-block">
                  <div className="w-8 h-8 border-3 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                </div>
                <p className="text-white/70 text-sm mt-3">Searching...</p>
              </div>
            )}

            {!isSearching && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-white/70 text-sm">No friends found</p>
                <p className="text-white/50 text-xs mt-2">Try searching by user ID</p>
              </div>
            )}

            {!isSearching && searchResults.length === 0 && !searchQuery && (
              <div className="text-center py-12">
                <p className="text-white/70 text-sm">Enter a friend's ID to search</p>
              </div>
            )}

            {searchResults.map((user, index) => (
              <div
                key={`user-${user.publicId}-${index}`}
                className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 cursor-pointer transition border border-white/10"
              >
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                      {user.avatar && user.avatar.startsWith('http') ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{user.name}</h3>
                      <p className="text-white/50 text-xs truncate">Tap to chat</p>
                    </div>
                  </div>
                  <button
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap flex-shrink-0 disabled:opacity-60"
                    disabled={friendRequestStates[user.publicId] === 'pending'}
                    onClick={(e) => sendFriendRequest(user.publicId, e)}
                  >
                    <span>{getButtonEmoji(user.publicId)}</span>
                    <span>{getButtonText(user.publicId)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Full page view (if needed)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Search Friends</h1>
          
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search a friend by ID"
                className="w-full bg-white/10 border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/60"
              />
            </div>
          </div>

          <div className="space-y-4">
            {isSearching && (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="w-8 h-8 border-3 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                </div>
                <p className="text-white/70 text-sm mt-3">Searching...</p>
              </div>
            )}

            {!isSearching && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-white/70 text-sm">No friends found</p>
                <p className="text-white/50 text-xs mt-2">Try searching by user ID</p>
              </div>
            )}

            {!isSearching && searchResults.length === 0 && !searchQuery && (
              <div className="text-center py-12">
                <p className="text-white/70 text-sm">Enter a friend's ID to search</p>
              </div>
            )}

            {searchResults.map((user, index) => (
              <div
                key={`user-${user.publicId}-${index}`}
                className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 cursor-pointer transition border border-white/10"
              >
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                      {user.avatar && user.avatar.startsWith('http') ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">{user.name}</h3>
                      <p className="text-white/70 text-sm">ID: {user.publicId}</p>
                    </div>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={friendRequestStates[user.publicId] === 'pending'}
                    onClick={(e) => sendFriendRequest(user.publicId, e)}
                  >
                    <span>{getButtonEmoji(user.publicId)}</span>
                    <span>{getButtonText(user.publicId)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
