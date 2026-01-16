# 🔐 Token Implementation Guide

## ✅ Complete Flow - Login to Protected API

### 1️⃣ **Login Process**
User clicks "Login with Google" or "Login with Facebook"

### 2️⃣ **OAuth Callback** 
Backend (`/auth/google/callback` or `/auth/facebook/callback`)
- ✅ Exchanges authorization code for access token
- ✅ Creates/updates user in database
- ✅ **Generates JWT token** with `user.id` (UUID)
- ✅ Redirects to: `${FRONTEND_URL}/oauth-success?token=JWT_TOKEN`

```javascript
// Backend: server.js (lines 1703-1838)
const token = jwt.sign({
  id: user.id,
  userId: user.id,
  email: user.email,
  publicId: user.public_id
}, process.env.JWT_SECRET, { expiresIn: '7d' });

const redirectUrl = `${baseUrl}/oauth-success?token=${tokenParam}`;
res.redirect(redirectUrl);
```

### 3️⃣ **OAuth Success Page**
Frontend receives JWT in URL parameter

```javascript
// frontend/src/pages/oauth-success.jsx (lines 1-50)
export default function OAuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    // ✅ Save token to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
    
    // Redirect to /chat
    navigate('/chat', { replace: true });
  }, [navigate]);
  
  return <div>Logging in...</div>;
}
```

### 4️⃣ **AuthContext Initialization**
AuthContext detects token in localStorage and restores user

```javascript
// frontend/src/context/AuthContext.jsx
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

if (storedToken && storedUser) {
  // ✅ Token validated, user set to authenticated
  setUser(user);
  setIsAuthenticated(true);
}
```

### 5️⃣ **Protected API Calls**
All protected endpoints include Authorization header with token

```javascript
// frontend/src/services/api.js
const getToken = () => localStorage.getItem('token');

export const getNotifications = async (userUUID) => {
  const response = await fetch(
    `${BACKEND_URL}/api/notifications?userId=${userUUID}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,  // ✅ TOKEN IN HEADER
        'Content-Type': 'application/json',
      },
    }
  );
  
  return await response.json();
};
```

---

## 🔒 Protected API Endpoints

All protected endpoints expect the token in the Authorization header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

### ✅ Endpoints Using Token

| Endpoint | Method | Headers | Purpose |
|----------|--------|---------|---------|
| `/api/profile` | GET | `Authorization: Bearer {token}` | Get user profile |
| `/api/notifications` | GET | `Authorization: Bearer {token}` | Fetch notifications |
| `/api/friends` | GET | `Authorization: Bearer {token}` | Get accepted friends |
| `/api/messages/unread-count/:userId` | GET | - | Get unread message count |
| `/api/messages/mark-read/:chatId` | PUT | `Authorization: Bearer {token}` | Mark messages as read |
| `/api/friends/unfriend` | POST | `Authorization: Bearer {token}` | Unfriend user |
| `/api/friends/accept` | POST | `Authorization: Bearer {token}` | Accept friend request |
| `/api/friends/reject` | POST | `Authorization: Bearer {token}` | Reject friend request |

---

## 📝 Implementation Checklist

### Backend (Node.js/Express)
- ✅ `/auth/google/callback` - Generates JWT token
- ✅ `/auth/facebook/callback` - Generates JWT token
- ✅ Redirects to `/oauth-success?token=JWT`
- ✅ Middleware validates token on protected routes

### Frontend (React)
- ✅ `/oauth-success` page - Extracts token from URL
- ✅ `localStorage.setItem('token', token)` - Saves token
- ✅ `AuthContext` - Restores user from localStorage
- ✅ `api.js` - All endpoints use `Authorization: Bearer {token}`

---

## 🚀 Usage in Components

### Example: Using Auth Token in API Calls

```javascript
import { useAuth } from '../context/AuthContext';
import { getNotifications } from '../services/api';

function MyComponent() {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && user?.uuid) {
      // ✅ Automatically includes token in header
      getNotifications(user.uuid).then(data => {
        console.log('Notifications:', data);
      });
    }
  }, [isLoading, user?.uuid]);
  
  return <div>Notifications loading...</div>;
}
```

---

## ⚠️ Important Notes

1. **Token Storage**: JWT is stored in `localStorage` under key `token`
2. **Token Usage**: All protected API calls use `Authorization: Bearer ${token}`
3. **Token Validation**: Backend validates JWT signature and expiration
4. **Auto-refresh**: AuthContext automatically restores user if token exists in localStorage
5. **Token Expiration**: Set to 7 days (configurable via `expiresIn`)
6. **Logout**: Call `logout()` to clear token and user data

---

## 🔍 Debugging

### Check if token is saved
```javascript
console.log(localStorage.getItem('token'));
```

### Check if user is authenticated
```javascript
import { useAuth } from './context/AuthContext';

function App() {
  const { user, isAuthenticated } = useAuth();
  console.log('Authenticated:', isAuthenticated);
  console.log('User:', user);
}
```

### Monitor API calls
All API calls in `services/api.js` log:
- Request headers with token
- Response status
- Data received

---

## 📚 File References

- **Backend OAuth**: `/backend/server.js` (lines 1678-1838, 2041-2121)
- **OAuth Success Page**: `/frontend/src/pages/oauth-success.jsx`
- **Auth Context**: `/frontend/src/context/AuthContext.jsx`
- **API Service**: `/frontend/src/services/api.js`
- **Login Page**: `/frontend/src/pages/Login.jsx`
