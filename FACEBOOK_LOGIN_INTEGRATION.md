# Facebook Login Integration Guide

## Overview
This document outlines the Facebook Login integration implemented in the Flinxx application using Firebase Authentication SDK.

## Implementation Details

### 1. Firebase Configuration (`src/config/firebase.js`)

#### FacebookAuthProvider Initialization
```javascript
import { FacebookAuthProvider } from 'firebase/auth'

export const facebookProvider = new FacebookAuthProvider()
facebookProvider.addScopes(['public_profile', 'email'])
facebookProvider.setCustomParameters({
  display: 'popup',
  auth_type: 'reauthenticate'
})
```

**Key Settings:**
- **Scopes**: `public_profile` and `email` - Required for accessing user profile and email
- **Display**: `popup` - Opens login in a popup window
- **Auth Type**: `reauthenticate` - Ensures user provides credentials each time

#### Sign-In Function
```javascript
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider)
    const user = result.user
    
    // Store user info
    const userInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      authProvider: 'facebook'
    }
    
    // Store auth token and provider info
    localStorage.setItem('authToken', user.accessToken)
    localStorage.setItem('authProvider', 'facebook')
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    return userInfo
  } catch (error) {
    handleFacebookLoginError(error)
    throw error
  }
}
```

### 2. Error Handling

The implementation includes comprehensive error handling for common Facebook login scenarios:

| Error Code | Scenario | User Message |
|-----------|----------|--------------|
| `auth/popup-blocked` | Browser blocked popup | "Login popup was blocked. Please allow popups and try again." |
| `auth/popup-closed-by-user` | User closed popup | "Login was cancelled. Please try again." |
| `auth/cancelled-popup-request` | Request cancelled | "Login request was cancelled. Please try again." |
| `auth/account-exists-with-different-credential` | Email already exists | "An account already exists with this email. Try a different sign-in method." |
| `auth/operation-not-allowed` | Facebook auth disabled | "Facebook login is not available at this time." |
| `auth/unauthorized-domain` | Domain not authorized | "This domain is not authorized for Facebook login." |

### 3. Authentication State Management

#### AuthContext (`src/context/AuthContext.jsx`)
The AuthContext now properly detects the authentication provider:

```javascript
const authProvider = firebaseUser.providerData[0]?.providerId || 'unknown'
```

This ensures that users logging in via Facebook, Google, or other providers are properly identified.

#### Sign Out Flow
The sign-out function clears all authentication data:
```javascript
export const signOutUser = async () => {
  try {
    await auth.signOut()
    localStorage.removeItem('authToken')
    localStorage.removeItem('authProvider')
    localStorage.removeItem('userInfo')
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}
```

### 4. Frontend Integration (`src/pages/Auth.jsx`)

The Auth page includes a "Continue with Facebook" button that triggers the login flow:

```javascript
const handleFacebookLogin = async () => {
  setIsLoading(true)
  setAuthMethod('facebook')
  setError(null)
  
  try {
    const userInfo = await signInWithFacebook()
    console.log('User signed in with Facebook:', userInfo)
    navigate('/chat')
  } catch (error) {
    console.error('Facebook login failed:', error)
    // Handle errors with user-friendly messages
    setError(errorMessage)
    setIsLoading(false)
    setAuthMethod(null)
  }
}
```

## User Flow

1. User clicks "Continue with Facebook" button
2. Facebook login popup appears
3. User enters Facebook credentials (if not already logged in)
4. Facebook displays permissions request (public_profile, email)
5. User authorizes the app
6. Firebase receives Facebook OAuth token
7. User data is stored locally and in AuthContext
8. User is redirected to chat page
9. onAuthStateChanged listener updates auth state

## Data Stored

### LocalStorage
```javascript
{
  authToken: "facebook_access_token",
  authProvider: "facebook.com",
  userInfo: {
    uid: "firebase_uid",
    email: "user@facebook.com",
    displayName: "User Name",
    photoURL: "https://facebook.com/photo.jpg",
    authProvider: "facebook.com"
  }
}
```

### Firebase Auth State
- User UID
- Email
- Display Name
- Photo URL
- Provider (facebook.com)

## Backend Integration

Currently, the implementation stores user data in localStorage. For production, consider:

1. **Save to Firestore**: Store user profiles in Firestore for persistence
2. **Match History**: Track user's match history with timestamps and metadata
3. **User Preferences**: Save gender filter, location, and other preferences
4. **Token Management**: Implement token refresh logic if needed

Example Firestore integration:
```javascript
import { setDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

// After successful login
await setDoc(doc(db, 'users', user.uid), {
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  authProvider: 'facebook',
  createdAt: new Date(),
  lastLogin: new Date()
}, { merge: true })
```

## Required Firebase Configuration

The following must be configured in Firebase Console:

1. **Facebook App ID**: 863917229498555
2. **Facebook App Secret**: 9fd35a96cf11e8f070cc856e3625494e
3. **Valid OAuth Redirect URI**: https://flinx-8a05e.firebaseapp.com/__/auth/handler
4. **Authorized Domains**: Add your deployment domains

These settings are already configured on the Firebase backend.

## Testing Facebook Login

### Local Development
```bash
# 1. Start dev server
npm run dev

# 2. Visit http://localhost:3005
# 3. Click "Continue with Facebook"
# 4. Use test Facebook account or your own
# 5. Verify user data in browser console
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Popup blocked | Allow popups for localhost in browser settings |
| CORS errors | Ensure domain is in Firebase authorized domains |
| Token invalid | Check Facebook App ID in firebase.js |
| Email not available | Update Facebook scopes or account permissions |

## Security Considerations

1. **Token Storage**: Access tokens are stored in localStorage (not secure for production)
   - Consider using httpOnly cookies for production
   - Use Firebase Session Persistence for better security

2. **HTTPS Required**: Facebook OAuth only works over HTTPS in production
   - Development can use localhost
   - Production must use HTTPS-enabled domain

3. **CORS & CSP**: Ensure proper headers for popup communication
   - Firebase handles this automatically
   - No additional configuration needed

## Deployment Checklist

- [ ] Verify Facebook App ID in firebase.js
- [ ] Add production domain to Facebook App Valid OAuth Redirect URIs
- [ ] Add production domain to Firebase Authorized Domains
- [ ] Enable HTTPS on production server
- [ ] Update database schema for user profiles if using Firestore
- [ ] Test with real Facebook account on staging
- [ ] Monitor error logs for authentication issues

## References

- [Firebase FacebookAuthProvider Documentation](https://firebase.google.com/docs/reference/js/auth.facebookauthprovider)
- [Firebase signInWithPopup Documentation](https://firebase.google.com/docs/auth/web/popup-sign-in)
- [Firebase Authentication Error Codes](https://firebase.google.com/docs/auth/admin/errors)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify Facebook App credentials
3. Ensure domain is authorized in both Firebase and Facebook
4. Check Firebase Authentication logs in console
