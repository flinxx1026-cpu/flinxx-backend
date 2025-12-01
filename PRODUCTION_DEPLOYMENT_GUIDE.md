# 🚀 Google OAuth Production Deployment Checklist

## Status: Ready for Production Setup

Your local development is working! Now follow these steps to deploy to production.

---

## ✅ STEP 1: Update Google Cloud Console

### Add Production Redirect URI

1. Go to https://console.cloud.google.com/
2. Select your Flinxx project
3. Go to **APIs & Services → Credentials**
4. Click your "Flinxx Backend" OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:

```
https://flinxx-backend.onrender.com/auth/google/callback
```

⚠️ **Important**: Replace `flinxx-backend` with your actual Render domain if different

### Add Production JavaScript Origins

Under **Authorized JavaScript Origins**, add:

```
https://flinxx-backend-frontend.vercel.app
```

⚠️ **Important**: Replace `flinxx-backend-frontend` with your actual Vercel domain if different

**Save Changes** - Click the Save button in Google Cloud Console

---

## ✅ STEP 2: Configure Render Backend Environment Variables

### Navigate to Render Dashboard

1. Go to https://dashboard.render.com/
2. Select your "flinxx-backend" service
3. Go to **Settings → Environment**

### Add/Update Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://flinxx-backend.onrender.com/auth/google/callback

# Frontend URLs
CLIENT_URL=https://flinxx-backend-frontend.vercel.app
CLIENT_URL_PROD=https://flinxx-backend-frontend.vercel.app

# Database
DATABASE_URL=postgresql://...
REDIS_URL=rediss://...
```

**Save Changes**

---

## ✅ STEP 3: Redeploy Backend on Render

### Option A: Manual Redeploy
1. In Render dashboard, go to your flinxx-backend service
2. Click **"Manual Deploy"** → **"Deploy Latest Commit"**
3. Wait for deployment to complete (status should be "Live")

### Option B: Automatic Redeploy via Git
```bash
git push origin main
```
Render will automatically redeploy if you have GitHub integration enabled

**Status Check**: Look for "Deploy successful" message in Render dashboard

---

## ✅ STEP 4: Configure Vercel Frontend Environment Variables

### Navigate to Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your flinxx-frontend project
3. Go to **Settings → Environment Variables**

### Add Variables (if needed)

```env
VITE_API_URL=https://flinxx-backend.onrender.com
VITE_SOCKET_URL=https://flinxx-backend.onrender.com
```

**Save Changes**

---

## ✅ STEP 5: Test Production Google Login

### Test URL
```
https://flinxx-backend-frontend.vercel.app/login
```

### Test Steps
1. Open the Vercel production URL
2. Click **"Continue with Google"**
3. Accept Google permissions
4. Should redirect to `/chat` with your user data
5. Check if user is logged in

### Expected Flow
```
Click Google button
    ↓
Redirect to Google consent screen
    ↓
User grants permission
    ↓
Redirect to: https://flinxx-backend.onrender.com/auth/google/callback
    ↓
Backend exchanges code for token
    ↓
Redirect to: https://flinxx-backend-frontend.vercel.app/auth/callback
    ↓
User logged in on Vercel ✅
```

---

## 🔍 Troubleshooting Production Issues

### Error: "redirect_uri_mismatch"
- ❌ Production redirect URI not added to Google Cloud
- ✅ Add `https://flinxx-backend.onrender.com/auth/google/callback` in Google Console
- ✅ Redeploy backend
- ✅ Wait 2-3 minutes for changes to take effect

### Error: "Invalid OAuth Scope"
- ✅ This is normal - just click continue
- ✅ Google is showing scope warning, not an error

### User stuck on loading page
- ❌ Backend environment variables not updated
- ✅ Check Render dashboard for GOOGLE_REDIRECT_URI
- ✅ Check backend logs in Render

### Blank page after clicking Google
- ❌ Frontend environment variables not set
- ✅ Check Vercel environment variables
- ✅ Redeploy frontend

---

## 📋 Production Domains Reference

| Service | Domain |
|---------|--------|
| Backend | https://flinxx-backend.onrender.com |
| Frontend | https://flinxx-backend-frontend.vercel.app |
| Google Redirect URI | https://flinxx-backend.onrender.com/auth/google/callback |
| Google Origin | https://flinxx-backend-frontend.vercel.app |

---

## ✅ Pre-Deployment Checklist

- [ ] Google Cloud Console: Added production redirect URI
- [ ] Google Cloud Console: Added production JavaScript origin
- [ ] Render: Updated GOOGLE_REDIRECT_URI environment variable
- [ ] Render: Updated CLIENT_URL and CLIENT_URL_PROD
- [ ] Render: Backend redeployed successfully
- [ ] Vercel: Frontend environment variables set (if needed)
- [ ] Tested Google login on local: Works ✅
- [ ] Ready to test on production domain

---

## 🚀 Deployment Order

1. **Google Cloud Console** - Add production URIs (5 min)
2. **Render Dashboard** - Set environment variables (2 min)
3. **Render Redeploy** - Deploy backend (3-5 min)
4. **Test Production** - Verify Google login works (5 min)

**Total Time**: ~20 minutes

---

## 📞 Quick Support

**If Google login fails in production:**

1. Check Render logs: Dashboard → flinxx-backend → Logs
2. Look for errors like:
   - `GOOGLE_REDIRECT_URI environment variable is not set`
   - `Exchanging code with redirect_uri: ...`
3. Verify exact URIs match in Google Cloud Console
4. Redeploy backend after any environment changes

---

## 🎉 Summary

**Local Development**: ✅ COMPLETE
- Google OAuth working
- Custom button styled
- Database saving users
- AuthCallback handling responses

**Production Deployment**: ⏳ READY
- Code committed to GitHub
- Vercel frontend deployed
- Render backend deployed
- Just need to add Google OAuth URLs

**Next Action**: Follow the 5 steps above in order

You're ready for production! 🚀

