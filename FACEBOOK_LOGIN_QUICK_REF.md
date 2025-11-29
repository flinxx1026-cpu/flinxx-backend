# Facebook Login - Quick Reference Card

## 🚀 Quick Start

### For Developer Testing
```bash
# 1. Start Backend
cd backend && npm start

# 2. Start Frontend (new terminal)
cd frontend && npm run dev

# 3. Open Browser
http://localhost:3003

# 4. Click "Continue with Facebook"
# 5. Follow Facebook OAuth flow
```

---

## 🔑 Credentials
```
Facebook App ID:      863917229498555
Facebook App Secret:  9fd35a96cf11e8f070cc856e3625494e
Firebase Project:     flinx-8a05e
Local Dev URL:        http://localhost:3003
Redirect URL:         https://flinx-8a05e.firebaseapp.com/__/auth/handler
```

---

## 📋 Console Setup (Copy-Paste Ready)

### Facebook Console
1. **App Domains:**
   - flinx-8a05e.firebaseapp.com
   - localhost

2. **Valid OAuth Redirect URIs:**
   - https://flinx-8a05e.firebaseapp.com/__/auth/handler
   - http://localhost:3003

3. **App Tester:**
   - Add your Facebook account

### Firebase Console
1. **Provider:** Facebook
2. **App ID:** 863917229498555
3. **App Secret:** 9fd35a96cf11e8f070cc856e3625494e
4. **Authorized Domain:** localhost:3003

---

## ✅ What to Expect

### Success Flow
```
Click Facebook → 
Facebook Login Screen → 
Grant Permissions → 
Redirect to App → 
Show /chat → 
Profile Modal shows Facebook Data
```

### User Data Displayed
- Facebook Profile Picture
- User's Full Name
- User's Email
- Facebook ID

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| "App not set up" | Check .env has App ID: 863917229498555 |
| "Invalid Redirect URL" | Add exact: `https://flinx-8a05e.firebaseapp.com/__/auth/handler` |
| "Permission Denied" | Add Facebook account as App Tester |
| "Data not showing" | Check localStorage has 'user' key |

---

## 📱 File Locations

```
.env
├─ VITE_FACEBOOK_APP_ID
├─ VITE_FIREBASE_AUTH_DOMAIN
└─ VITE_FIREBASE_REDIRECT_URL

src/config/firebase.js
├─ FacebookAuthProvider initialization
├─ signInWithFacebook() function
└─ handleLoginSuccess() function

src/pages/Login.jsx
├─ Facebook Login button
└─ handleFacebookLogin() handler

src/components/ProfileModal.jsx
└─ Displays user data from AuthContext
```

---

## 🔍 Debug Tips

### Check localStorage
```javascript
// Open browser console and run:
console.log(localStorage.getItem('user'))
console.log(localStorage.getItem('authProvider'))
```

### Check Console Logs
```
Look for: "📱 Starting Facebook login..."
Look for: "✅ Redirect login successful:"
Look for: "📝 Processing facebook login for user:"
```

### Verify User in Firestore
```
Firebase Console > Firestore > users collection
Find your user by email
Check authProvider: "facebook"
```

---

## ✨ Features Status

✅ Google Login
✅ Facebook Login
✅ Profile Display
✅ User Persistence
✅ Error Handling
✅ Multi-Provider Support

---

## 📞 Support

**Setup Guide:** See `FACEBOOK_LOGIN_SETUP.md`
**Detailed Checklist:** See `FACEBOOK_LOGIN_CHECKLIST.md`
**Full Status:** See `FACEBOOK_LOGIN_STATUS.md`

---

**Last Updated:** Nov 28, 2025
**Status:** ✅ Ready for Testing
