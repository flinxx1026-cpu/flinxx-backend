# Google OAuth Setup Guide for Flinxx

## Step 1: Add Authorized Redirect URIs in Google Cloud Console

### Development (Local Testing)
```
http://localhost:5000/auth/google/callback
```

### Production (Vercel Deployment)
```
https://flinxx-backend-frontend.vercel.app/auth/google/callback
```

**Note**: Replace `flinxx-backend-frontend` with your actual Vercel domain

---

## Step 2: Environment Variables for Backend

Add these to your `backend/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# For Production
# GOOGLE_REDIRECT_URI=https://flinxx-backend-frontend.vercel.app/auth/google/callback
```

Get these values from Google Cloud Console:
1. Go to https://console.cloud.google.com/
2. Select your project
3. Navigate to "Credentials"
4. Find your OAuth 2.0 Client ID
5. Click to view credentials
6. Copy `Client ID` and `Client Secret`

---

## Step 3: Environment Variables for Frontend

Add these to your `frontend/.env` and `frontend/.env.production`:

**Development (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Production (.env.production)**
```env
VITE_API_URL=https://flinxx-backend-frontend.vercel.app
VITE_SOCKET_URL=https://flinxx-backend-frontend.vercel.app
```

---

## Step 4: How OAuth Flow Works

### Flow Diagram
```
User clicks "Continue with Google"
    ↓
Frontend: Redirects to http://localhost:5000/auth/google
    ↓
Backend: Redirects to Google OAuth consent screen
    ↓
Google: User grants permission
    ↓
Google: Redirects back to /auth/google/callback with code
    ↓
Backend: Exchanges code for access token
    ↓
Backend: Fetches user info from Google
    ↓
Backend: Saves user to PostgreSQL
    ↓
Backend: Redirects to frontend with user data
    ↓
Frontend: AuthCallback page processes data
    ↓
Frontend: Saves to localStorage and redirects to /chat
```

### Backend Routes
- `GET /auth/google` - Initiates Google OAuth flow
- `GET /auth/google/callback` - Handles OAuth callback and exchanges code for tokens

### Frontend Route
- `GET /auth/callback` - Processes OAuth response and saves user data

---

## Step 5: Frontend HTML Setup

The Google Sign-In SDK script is already added to `frontend/index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

---

## Step 6: Testing the OAuth Flow

### Local Development
1. Start both servers:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3003/login

3. Click "Continue with Google"

4. You should be redirected to Google's consent screen

5. After authorization, you'll be redirected back with user data

### Production Testing
1. Deploy to Vercel
2. Update redirect URI in Google Cloud Console
3. Test the same flow on your Vercel domain

---

## Troubleshooting

### Error: "Redirect URI mismatch"
- Make sure the redirect URI in Google Cloud Console **exactly matches** your backend URL
- Include the full path: `https://yourdomain.com/auth/google/callback`
- No trailing slashes or extra characters

### Error: "Invalid client"
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Make sure they're set in backend/.env
- Restart the backend server after updating .env

### User not saving to database
- Check PostgreSQL connection in backend logs
- Verify users table was created
- Check backend/.env DATABASE_URL

### Session not persisting after redirect
- Check browser's localStorage in DevTools
- Verify AuthCallback page is loading
- Check browser console for errors

---

## API Documentation

### GET /auth/google
Initiates the OAuth flow

**Response**: Redirects to Google OAuth consent screen

---

### GET /auth/google/callback
Handles OAuth callback

**Query Parameters**:
- `code` - Authorization code from Google
- `error` - Error code if authentication failed

**Response**: Redirects to frontend with user data
```
/auth/callback?token=BASE64_ENCODED_TOKEN&user=JSON_ENCODED_USER_DATA
```

---

## Backend Response Structure

When redirecting to frontend after OAuth:

```json
{
  "token": "base64_encoded_session_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "googleId": "google_sub_id"
  }
}
```

---

## Security Notes

✅ **Implemented**:
- Client secrets stored in environment variables
- Authorization code exchange on backend (not frontend)
- HTTPS in production
- CORS configured for allowed origins

✅ **Recommended**:
- Add PKCE (Proof Key for Code Exchange) for enhanced security
- Implement refresh token rotation
- Add rate limiting to OAuth endpoints
- Validate JWT tokens on each request

---

## Database User Storage

Users are stored in PostgreSQL `users` table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  photo_url TEXT,
  auth_provider VARCHAR(50),
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

On subsequent logins, the user is updated (not duplicated) based on email.

---

## Next Steps

1. ✅ Add Authorized Redirect URIs in Google Cloud Console
2. ✅ Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env
3. ✅ Set VITE_API_URL in frontend/.env
4. ✅ Start both servers
5. ✅ Test the Google login flow
6. ✅ Deploy to Vercel (update redirect URIs for production domain)

