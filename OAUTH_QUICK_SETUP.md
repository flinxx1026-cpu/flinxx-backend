# 🔒 Google OAuth Configuration Checklist

## ✅ What's Been Implemented in Code

### Backend (`backend/server.js`)
- ✅ `/auth/google` - Initiates OAuth flow
- ✅ `/auth/google/callback` - Handles OAuth callback
- ✅ Token exchange with Google
- ✅ User data retrieval
- ✅ User saved to PostgreSQL
- ✅ Session token generation
- ✅ Redirect to frontend with user data

### Frontend
- ✅ Google GSI SDK script in `index.html`
- ✅ Custom Google button in Login page
- ✅ Button redirects to backend OAuth route
- ✅ `/auth/callback` route for processing OAuth response
- ✅ AuthCallback component handles redirect
- ✅ User data saved to localStorage
- ✅ Redirect to chat after login

### Environment Setup
- ✅ `backend/.env` ready for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- ✅ `frontend/.env` and `.env.production` configured
- ✅ node-fetch dependency installed

---

## ⚙️ What YOU Need to Do in Google Cloud Console

### Step 1: Access Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Sign in with your Google account
3. Select your Flinxx project (or create one)

### Step 2: Enable Google+ API
1. Go to APIs & Services → Enable APIs and Services
2. Search for "Google+ API"
3. Click Enable

### Step 3: Create OAuth 2.0 Credentials
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Choose application type: **Web application**
4. Name it: "Flinxx Backend"

### Step 4: Add Authorized Redirect URIs
In the OAuth Client ID settings, find **Authorized redirect URIs** and add:

**For Development (Local Testing):**
```
http://localhost:5000/auth/google/callback
```

**For Production (Vercel):**
```
https://flinxx-backend-frontend.vercel.app/auth/google/callback
```

⚠️ **Important**: Replace `flinxx-backend-frontend` with your actual Vercel domain!

### Step 5: Copy Credentials
After creating the OAuth client:
1. Copy your **Client ID**
2. Copy your **Client Secret**
3. Add these to `backend/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Step 6: Add Authorized JavaScript Origins (Optional but Recommended)
Add these origins for frontend:
```
http://localhost:3003
https://flinxx-backend-frontend.vercel.app
```

---

## 🚀 Testing Locally

After adding credentials:

1. Stop and restart backend:
```bash
npm run dev -w backend
```

2. Open http://localhost:3003/login

3. Click "Continue with Google"

4. Accept permissions on Google consent screen

5. You should be logged in! ✅

---

## 📋 Vercel Production Deployment

### Before Deploying to Vercel:

1. **Update backend .env in Vercel dashboard**:
   - Add GOOGLE_CLIENT_ID
   - Add GOOGLE_CLIENT_SECRET
   - Add GOOGLE_REDIRECT_URI=https://your-vercel-domain.vercel.app/auth/google/callback

2. **Add production redirect URI in Google Cloud Console**:
   - https://your-vercel-domain.vercel.app/auth/google/callback

3. **Deploy to Vercel**:
   ```bash
   git push origin main
   ```

4. **Test on Vercel domain**:
   - Open your Vercel frontend URL
   - Test Google login flow

---

## 🔍 Debugging

### "Error: Invalid redirect URI"
- ❌ URI doesn't match Google Cloud settings exactly
- ✅ Copy-paste from Google Cloud Console
- ✅ No trailing slashes or extra characters
- ✅ Use exact URL: `https://domain.vercel.app/auth/google/callback`

### "Error: Client ID mismatch"
- ❌ GOOGLE_CLIENT_ID in .env is wrong
- ✅ Verify it matches Google Cloud Console
- ✅ Restart backend server after updating .env

### User not saving to database
- ❌ PostgreSQL connection error
- ✅ Check backend logs for connection errors
- ✅ Verify DATABASE_URL in backend/.env

### No redirect after Google login
- ❌ AuthCallback page not rendering
- ✅ Check browser console for errors
- ✅ Verify /auth/callback route exists in frontend

---

## 📊 Credentials Reference

| Item | Location |
|------|----------|
| Client ID | Google Cloud Console → Credentials → OAuth Client ID |
| Client Secret | Google Cloud Console → Credentials → OAuth Client ID |
| Backend Env File | `backend/.env` |
| Frontend Dev Env | `frontend/.env` |
| Frontend Prod Env | `frontend/.env.production` |
| OAuth Redirect URI | `http://localhost:5000/auth/google/callback` (dev) |
| OAuth Redirect URI | `https://your-domain.vercel.app/auth/google/callback` (prod) |

---

## ✨ Complete Flow After Setup

```
User clicks "Continue with Google"
    ↓
Redirects to: http://localhost:5000/auth/google
    ↓
Backend redirects to Google consent screen
    ↓
User grants permission
    ↓
Google redirects to: /auth/google/callback?code=...
    ↓
Backend exchanges code for access token
    ↓
Backend fetches user info
    ↓
Backend saves user to PostgreSQL
    ↓
Backend redirects to: /auth/callback?token=...&user=...
    ↓
Frontend saves user data to localStorage
    ↓
Frontend redirects to /chat
    ✅ User is logged in!
```

---

## 📞 Support

If you encounter issues:
1. Check backend logs: `npm run dev -w backend`
2. Check frontend console (F12 → Console)
3. Verify all environment variables are set
4. Verify redirect URIs match exactly in Google Cloud Console
5. Check PostgreSQL is running and connected

---

**Status**: ✅ Code Ready | ⏳ Waiting for Google Cloud Console Configuration

