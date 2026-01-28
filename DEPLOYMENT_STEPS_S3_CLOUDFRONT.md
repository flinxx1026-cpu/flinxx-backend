# S3 & CloudFront Deployment Steps

## ✅ Completed
- [x] Removed hard-coded EC2 URLs (13.203.157.116:5000)
- [x] Updated all files to use environment-based URLs (VITE_BACKEND_URL, VITE_SOCKET_URL)
- [x] Rebuilt frontend: `npm run build` ✓ (dist2/ ready)
- [x] Fixed backend package.json (jsonwebtoken 9.1.2 → 9.0.0)
- [x] Pushed to GitHub: commit e453847

## 📦 Build Output
**Location**: `frontend/dist2/`

Files ready for deployment:
- `dist2/index.html` (1.41 kB)
- `dist2/assets/vendor-*.js` (160.34 kB)
- `dist2/assets/index-*.js` (681.73 kB)  
- `dist2/assets/index-*.css` (240.73 kB)
- `dist2/assets/remixicon-*` (fonts & icons)

## 🔧 S3 Deployment (AWS Required)

### Option 1: Using AWS CLI
```powershell
# Install AWS CLI if not present
# https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

# Configure AWS credentials
aws configure

# Deploy to S3 bucket (replace BUCKET_NAME)
aws s3 sync frontend/dist2/ s3://BUCKET_NAME/ --delete

# Or upload individual files
aws s3 cp frontend/dist2/ s3://BUCKET_NAME/ --recursive
```

### Option 2: Using Node.js AWS SDK
```powershell
npm install -g aws-sdk

# Create deployment script and run
node deploy-s3.js
```

### Option 3: Using AWS Console (Manual)
1. Go to AWS S3 Console
2. Navigate to your bucket
3. Upload contents of `frontend/dist2/`
4. Set public read permissions on files

## 🌐 CloudFront Invalidation

### CloudFront Distribution ID (Frontend)
`d2v5adgyikd2u0`

### Option 1: AWS CLI
```powershell
aws cloudfront create-invalidation --distribution-id d2v5adgyikd2u0 --paths "/*"
```

### Option 2: AWS Console
1. Go to CloudFront Console
2. Select distribution `d2v5adgyikd2u0`
3. Go to "Invalidations" tab
4. Create invalidation with path: `/*`

### Option 3: Using Node.js
```powershell
node invalidate-cloudfront.js
```

## 📋 Environment Variables (Production)

Frontend (.env):
```
VITE_API_URL=https://d1pphanr0qsx7.cloudfront.net
VITE_SOCKET_URL=https://d1pphanr0qsx7.cloudfront.net
VITE_BACKEND_URL=https://d1pphanr0qsx7.cloudfront.net
VITE_FACEBOOK_APP_ID=863917229498555
VITE_FACEBOOK_APP_SECRET=9fd35a96cf11e8f070cc856e3625494e
VITE_FIREBASE_AUTH_DOMAIN=flinx-8a05e.firebaseapp.com
```

Backend (.env):
```
BACKEND_URL=https://d1pphanr0qsx7.cloudfront.net
CLIENT_URL=https://d2v5adgyikd2u0.cloudfront.net
```

## 🔍 Verification Checklist

After deployment, verify:
- [ ] Frontend loads at https://d2v5adgyikd2u0.cloudfront.net
- [ ] Backend API responds at https://d1pphanr0qsx7.cloudfront.net/api/health
- [ ] WebSocket connects properly
- [ ] Google login works
- [ ] Facebook login works
- [ ] Video chat initializes
- [ ] Console logs show env-based URLs (no hard-coded IPs)

## 📝 Git Status
```
Commit: e453847
Branch: main
Remote: https://github.com/flinxx1026-cpu/flinxx-backend.git

Changes committed:
✓ frontend/src/services/socketService.js
✓ frontend/src/pages/Profile.jsx
✓ frontend/src/pages/Login.jsx
✓ frontend/vite.config.js
✓ backend/package.json
```

## 🚀 Next Steps

1. **AWS Setup** (if not done)
   - Create IAM user with S3 & CloudFront permissions
   - Generate access key & secret
   - Configure `aws configure`

2. **Deploy to S3**
   ```powershell
   aws s3 sync frontend/dist2/ s3://YOUR_BUCKET_NAME/ --delete
   ```

3. **Invalidate CloudFront**
   ```powershell
   aws cloudfront create-invalidation --distribution-id d2v5adgyikd2u0 --paths "/*"
   ```

4. **Monitor**
   - Check CloudFront invalidation status
   - Wait 2-5 minutes for cache to clear
   - Test on https://d2v5adgyikd2u0.cloudfront.net

---
Generated: 2026-01-23
Status: Ready for S3 deployment
