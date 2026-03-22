# ✅ Backend ESM Fix Complete

## Issues Fixed:

### 1️⃣ ReferenceError: require is not defined
**Problem:** Project uses ESM (type: module) but server.js was using `require('jsonwebtoken')`

**Solution:** 
- ✅ Added `import jwt from 'jsonwebtoken'` at top of server.js
- ✅ Removed all 6 `const jwt = require('jsonwebtoken')` calls throughout file
- ✅ Now using imported `jwt` variable everywhere

**Lines Changed:**
```
Line 10: Added import jwt from 'jsonwebtoken'
Line 303: Removed require() in verifyUserToken
Line 1974: Removed require() in /api/users/save
Line 2038: Removed require() in /auth-success
Line 2108: Removed require() in /api/get-turn-credentials
Line 2255: Removed require() in Facebook callback
Line 2320: Removed require() in /api/profile
```

### 2️⃣ firebase-service-account.json Missing
**Problem:** Service account file not on EC2 at required path

**Solution:**

#### On Local Machine:
```bash
# Download from Firebase Console
# Firebase Console → flinx-8a05e → Settings → Service Accounts → Generate New Private Key
```

#### Upload to EC2:
```bash
# For ec2-user (most common)
scp -i your-aws-key.pem firebase-service-account.json ec2-user@13.203.157.116:/home/ec2-user/flinxx-backend/backend/

# OR for ubuntu user
scp -i your-aws-key.pem firebase-service-account.json ubuntu@13.203.157.116:/home/ubuntu/flinxx-backend/backend/
```

#### Verify on EC2:
```bash
ssh -i your-aws-key.pem ec2-user@13.203.157.116
# OR
ssh -i your-aws-key.pem ubuntu@13.203.157.116

# Check if file exists
ls -la /home/ec2-user/flinxx-backend/backend/firebase-service-account.json
# OR
ls -la /home/ubuntu/flinxx-backend/backend/firebase-service-account.json
```

---

## EC2 Deployment Steps:

```bash
# 1. SSH to EC2
ssh -i your-key.pem ec2-user@13.203.157.116

# 2. Go to backend directory
cd /home/ec2-user/flinxx-backend/backend/
# OR
cd /home/ubuntu/flinxx-backend/backend/

# 3. Install/update dependencies (firebase-admin, jsonwebtoken)
npm install

# 4. Verify service account file exists
ls -la firebase-service-account.json

# 5. Restart backend with PM2
pm2 restart flinxx-backend

# 6. Check logs
pm2 logs flinxx-backend
```

---

## Expected Success Logs (After Fix):

```
✅ Firebase Admin SDK initialized successfully
📍 Project ID: flinx-8a05e
🔐 [/api/auth/firebase] Firebase authentication request
📍 Firebase ID token received
🔥 Verifying Firebase token with Admin SDK...
✅ Firebase token verified successfully
👤 Creating new user...
✅ New user created: user@gmail.com
✅ Backend JWT generated successfully
```

---

## GitHub Commits:

1. **c9ff524** - fix: add Firebase Admin SDK for proper token verification
2. **f9e9b07** - fix: replace require() with import for ESM compatibility ✅

---

## Next Steps:

1. Download `firebase-service-account.json` from Firebase Console
2. Upload to EC2 using scp command
3. SSH to EC2 and run: `npm install && pm2 restart flinxx-backend`
4. Check `pm2 logs flinxx-backend` for success
5. Test Google login from incognito browser

**Everything else is already fixed in code!** 🎉
