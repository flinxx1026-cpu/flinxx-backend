# 🔥 Firebase Admin SDK Setup Guide

## Status: Backend Firebase Token Verification Fixed ✅

### What Was the Problem?
- Frontend Google login was working (Firebase token generated)
- Backend was only **decoding** the token, not **verifying** it
- No Firebase Admin SDK integration
- Result: 500 Authentication failed error

### What Was Fixed?

#### 1. **Created `firebaseAdmin.js`**
- Proper Firebase Admin SDK initialization
- Token verification function using `admin.auth().verifyIdToken()`
- Error handling and logging
- Service account file handling

#### 2. **Updated `server.js`**
- Added Firebase Admin import
- Initialize Firebase Admin on startup
- Updated `/api/auth/firebase` endpoint to use `verifyFirebaseToken()`
- Enhanced error logging

#### 3. **Updated `package.json`**
- Added `firebase-admin` dependency
- Added `jsonwebtoken` for JWT generation

---

## 🚨 CRITICAL: Next Steps

You **MUST** do this on EC2 to make it work:

### Step 1: Get Service Account JSON from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **flinx-8a05e**
3. Go to **⚙️ Project Settings**
4. Click **"Service Accounts"** tab
5. Click **"Generate New Private Key"**
6. Download the JSON file

### Step 2: Upload to EC2

```bash
# On your local machine
# For ec2-user
scp -i your-key.pem firebase-service-account.json ec2-user@13.203.157.116:/home/ec2-user/flinxx-backend/backend/

# OR if using ubuntu user
scp -i your-key.pem firebase-service-account.json ubuntu@13.203.157.116:/home/ubuntu/flinxx-backend/backend/
```

**The file MUST be at:** `/home/ec2-user/flinxx-backend/backend/firebase-service-account.json` (or `/home/ubuntu/...`)

### Step 3: Install Dependencies

```bash
cd /path/to/flinxx-backend
npm install
```

This will install `firebase-admin` and `jsonwebtoken` packages.

### Step 4: Restart Backend

```bash
pm2 restart flinxx-backend
pm2 logs flinxx-backend
```

### Step 5: Check Logs

Look for:
```
✅ Firebase Admin SDK initialized successfully
📍 Project ID: flinx-8a05e
```

---

## Expected Flow After Fix

1. **Frontend:** Google popup opens → User selects Gmail account
2. **Firebase:** Generates ID token
3. **Frontend:** Sends token to backend: `POST /api/auth/firebase`
4. **Backend:** ✅ **Verifies token using Firebase Admin SDK**
5. **Backend:** Creates/updates user in database
6. **Backend:** Returns JWT token
7. **Frontend:** Redirects to `/dashboard`

---

## Troubleshooting

### Error: "firebase-service-account.json not found"
- Download from Firebase Console
- Put at `backend/firebase-service-account.json`
- Check file exists: `ls -la firebase-service-account.json`

### Error: "Project ID mismatch"
- Ensure service account is from **flinx-8a05e** project
- Check in `firebase-service-account.json`:
  ```json
  "project_id": "flinx-8a05e"
  ```

### Error: "Invalid Firebase token"
- Token might be expired (Firebase tokens expire after 1 hour)
- Check browser console for token generation errors
- Ensure frontend is using correct Firebase config

### PM2 Logs Command
```bash
pm2 logs flinxx-backend
# Or last 100 lines
pm2 logs flinxx-backend --lines 100
```

---

## Files Changed

- ✅ `backend/firebaseAdmin.js` - NEW
- ✅ `backend/server.js` - Updated (import + initialization + endpoint)
- ✅ `backend/package.json` - Updated (dependencies)

---

## Important Notes

⚠️ **NEVER commit `firebase-service-account.json` to GitHub!**

Ensure `.gitignore` has:
```
firebase-service-account.json
.env
node_modules
dist
```

---

**Status:** Ready for EC2 deployment with service account file
