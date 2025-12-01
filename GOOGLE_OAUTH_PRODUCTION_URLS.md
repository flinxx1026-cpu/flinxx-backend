# 🚀 Google OAuth Production URLs - Quick Reference

## Copy-Paste Ready URLs

### Google Cloud Console Configuration

**1. Add to Authorized JavaScript Origins:**
```
https://flinxx-backend-frontend.vercel.app
```

**2. Add to Authorized Redirect URIs:**
```
https://flinxx-backend.onrender.com/auth/google/callback
```

---

## Render Environment Variables

**Add these variables to Render dashboard → Settings → Environment Variables:**

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://flinxx-backend.onrender.com/auth/google/callback
CLIENT_URL_PROD=https://flinxx-backend-frontend.vercel.app
```

⚠️ **Get GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console OAuth credentials**

---

## Production Testing URL

After deployment, test here:
```
https://flinxx-backend-frontend.vercel.app/login
```

Click "Continue with Google" and verify it works ✅

---

## ✅ Deployment Checklist

- [ ] Google Cloud: Added JavaScript Origin (https://flinxx-backend-frontend.vercel.app)
- [ ] Google Cloud: Added Redirect URI (https://flinxx-backend.onrender.com/auth/google/callback)
- [ ] Render: Added all 4 environment variables
- [ ] Render: Clicked "Manual Deploy" to restart
- [ ] Tested Google login on production domain
- [ ] Verified redirect to /chat works

---

## 🔄 Expected Flow (Production)

```
User visits: https://flinxx-backend-frontend.vercel.app/login
                        ↓
Clicks "Continue with Google"
                        ↓
Redirects to: https://accounts.google.com/o/oauth2/v2/auth?...
                        ↓
User grants permission
                        ↓
Google redirects to: https://flinxx-backend.onrender.com/auth/google/callback?code=...
                        ↓
Backend exchanges code for token
                        ↓
Backend redirects to: https://flinxx-backend-frontend.vercel.app/auth/callback?token=...
                        ↓
Frontend saves user data & redirects to /chat
                        ↓
✅ User logged in on production!
```

---

## 📊 Domain Reference

| Component | Production URL |
|-----------|----------------|
| Frontend | https://flinxx-backend-frontend.vercel.app |
| Backend | https://flinxx-backend.onrender.com |
| OAuth Callback | https://flinxx-backend.onrender.com/auth/google/callback |

---

## ⚠️ Important Notes

✅ All environment variables are ready
✅ Codes already pushed to GitHub
✅ Just need Google Cloud configuration + Render restart
⏳ No code changes needed

---

## Next Steps (In Order)

1. **Google Cloud Console** - Add 2 URLs (5 min)
2. **Render Dashboard** - Add 4 env variables (2 min)
3. **Render** - Click "Manual Deploy" (5 min wait)
4. **Test** - Visit production login URL (2 min)
5. **Verify** - Google login should work! ✅

**Total Time: ~20 minutes**

