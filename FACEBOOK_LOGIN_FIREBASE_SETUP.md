# Facebook Login Integration - Firebase Console Setup Guide

## 📋 Overview
This guide covers the Firebase Console configuration needed to enable Facebook Login for the Flinx application.

## ✅ Checklist: Firebase Console Configuration

### Step 1: Access Firebase Authentication Settings
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Select your project: **flinx-8a05e**
- [ ] Navigate to **Authentication** → **Sign-in method**

### Step 2: Enable Facebook as a Sign-in Provider
- [ ] Locate the **Facebook** provider in the sign-in methods list
- [ ] Click on **Facebook** to open the provider settings
- [ ] Toggle the **Enabled** switch to **ON**

### Step 3: Configure Facebook Credentials
In the Facebook provider configuration panel, enter the following credentials:

#### Facebook App ID
```
863917229498555
```
✅ Already stored in: `frontend/.env` as `VITE_FACEBOOK_APP_ID`

#### Facebook App Secret
```
9fd35a96cf11e8f070cc856e3625494e
```
✅ Already stored in: `frontend/.env` as `VITE_FACEBOOK_APP_SECRET`

### Step 4: Set Authorized Redirect URLs (Important!)
In Firebase Console, you'll see the generated redirect URL field. Ensure it shows:

```
https://flinx-8a05e.firebaseapp.com/__/auth/handler
```

- [ ] Confirm this exact URL appears in your Facebook App Settings
- [ ] This URL is already configured in: `frontend/.env` as `VITE_FIREBASE_REDIRECT_URL`

### Step 5: Configure Facebook App Settings
Go to your [Facebook Developers Dashboard](https://developers.facebook.com):

#### OAuth Redirect URIs (App Settings → Basic → Facebook Login)
Add this URL under **Valid OAuth Redirect URIs**:
```
https://flinx-8a05e.firebaseapp.com/__/auth/handler
```

#### Allowed Domains
Add these URLs to **Allowed Domains for the Facebook Login**:
```
flinx-8a05e.firebaseapp.com
```

#### Website URL
Set in Facebook App Settings:
```
http://localhost:3003
```

### Step 6: Verify Permissions
The following permissions are configured in the code:
- [ ] **public_profile** - To access user's public profile information
- [ ] **email** - To access user's email address

These are set in `frontend/src/config/firebase.js` via:
```javascript
facebookProvider.addScope('public_profile')
facebookProvider.addScope('email')
```

## 📝 Current Configuration Status

### ✅ Frontend Code
- `frontend/src/config/firebase.js` - Facebook provider initialized with proper scopes
- `frontend/.env` - All credentials configured
- `frontend/src/pages/Auth.jsx` - Facebook login button implemented
- `frontend/src/context/AuthContext.jsx` - Redirect result handler active

### ✅ Code Implementation Details

**Firebase Provider Setup:**
```javascript
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '863917229498555'
const facebookProvider = new FacebookAuthProvider()

facebookProvider.setCustomParameters({
  app_id: facebookAppId,
  display: 'popup',
  auth_type: 'rerequest',
  scope: 'public_profile,email'
})

facebookProvider.addScope('public_profile')
facebookProvider.addScope('email')
```

**Sign-in Function:**
```javascript
export const signInWithFacebook = async () => {
  try {
    console.log('📱 Starting Facebook login via redirect...')
    await signInWithRedirect(auth, facebookProvider)
  } catch (error) {
    console.error('❌ Facebook redirect login failed:', error)
    throw error
  }
}
```

**Redirect Result Handler:**
The app automatically checks for redirect results when loading via `checkRedirectResult()` in AuthContext.

## 🔄 Data Flow After Facebook Login

1. User clicks "Continue with Facebook" button
2. Firebase redirects to Facebook OAuth login
3. User authorizes the app
4. Facebook redirects back to: `https://flinx-8a05e.firebaseapp.com/__/auth/handler`
5. Firebase handler processes the response
6. `getRedirectResult()` captures the user data
7. User info stored in localStorage and Firestore
8. App redirects to `/chat` page

## 📊 Extracted User Information

When a user logs in via Facebook, the following data is extracted:
```javascript
{
  uid: "firebase-uid",
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "https://facebook-profile-pic.jpg",
  authProvider: "facebook",
  facebookId: "facebook-user-id"
}
```

## 🧪 Testing the Integration

### Local Development
1. Start the frontend: `npm run dev` (runs on http://localhost:5173)
2. Click "Continue with Facebook" button
3. You'll be redirected to Facebook login
4. After authorizing, you'll return to the app
5. Check browser console for success messages

### Production Testing
1. Deploy to Firebase Hosting: `firebase deploy`
2. Visit: `https://flinx-8a05e.firebaseapp.com`
3. Test Facebook login flow end-to-end
4. Verify user data in Firestore Database under `users` collection

## 🚨 Common Issues & Solutions

### Issue: "This app isn't set up for Facebook Login"
**Solution:** 
- Verify App ID is correct in `.env`
- Check that Facebook app status is "Live" or "In Development"
- Ensure redirect URL is added in Facebook App Settings

### Issue: "Redirect URL mismatch"
**Solution:**
- Use exact URL: `https://flinx-8a05e.firebaseapp.com/__/auth/handler`
- No extra slashes or parameters
- Must match exactly in both Firebase and Facebook settings

### Issue: "Invalid OAuth request"
**Solution:**
- Verify Email scope is enabled in Facebook app
- Check that public_profile scope is enabled
- Ensure App Secret hasn't been changed recently

### Issue: "CORS or domain errors"
**Solution:**
- Add domain to Facebook App Settings → Basic
- For localhost development, add: `localhost:3003`
- For production, add: `flinx-8a05e.firebaseapp.com`

## 🔐 Security Notes

- ✅ App Secret is stored in `.env` file (frontend only reads App ID from env for security)
- ✅ Redirect-based login prevents popup-blocking issues
- ✅ Firebase handles secure credential exchange
- ✅ All sensitive data stored in localStorage with SessionStorage for tokens
- ✅ HTTPS enforced for production redirect URL

## 📞 Support & Troubleshooting

For detailed Firebase setup, visit:
- [Firebase Facebook Authentication](https://firebase.google.com/docs/auth/web/facebook-login)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)

## ✨ Summary of What's Done

| Item | Status | Details |
|------|--------|---------|
| Firebase Provider Init | ✅ | FacebookAuthProvider created and configured |
| App ID | ✅ | 863917229498555 in .env |
| App Secret | ✅ | 9fd35a96cf11e8f070cc856e3625494e in .env |
| Permissions | ✅ | public_profile, email scopes added |
| Redirect URL | ✅ | https://flinx-8a05e.firebaseapp.com/__/auth/handler |
| UI Button | ✅ | Facebook login button in Auth.jsx |
| Auth Handler | ✅ | checkRedirectResult() in AuthContext |
| Firestore Save | ✅ | User data saved to Firestore |
| localStorage | ✅ | User data persisted in browser |

## 🎯 Next Steps (Developer Must Complete in Firebase Console)

1. [ ] Open Firebase Console → flinx-8a05e project
2. [ ] Go to Authentication → Sign-in method
3. [ ] Find and click "Facebook"
4. [ ] Toggle "Enabled" to ON
5. [ ] Enter App ID: `863917229498555`
6. [ ] Enter App Secret: `9fd35a96cf11e8f070cc856e3625494e`
7. [ ] Save configuration
8. [ ] Test by visiting the app and clicking "Continue with Facebook"

---

**Status**: ✅ **READY FOR FIREBASE CONFIGURATION**
**Last Updated**: November 28, 2025
