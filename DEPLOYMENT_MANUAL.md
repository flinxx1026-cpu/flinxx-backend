# EC2 Backend Deployment - Manual Commands

## 🚀 Quick Deployment (Copy-Paste Commands)

### **Step 1: SSH to EC2**
```bash
# Replace with your actual key and IP
ssh -i /path/to/your/key.pem ec2-user@13.203.157.116
```

### **Step 2: Navigate to Backend**
```bash
cd /home/ec2-user/flinxx-backend
# OR
cd /opt/flinxx-backend
# (Check which directory has your backend code)
```

### **Step 3: Pull Latest Code**
```bash
git fetch origin
git pull origin main
```

### **Step 4: Install Dependencies**
```bash
npm install
```

This will install the NEW dependency: `cookie-parser`

### **Step 5: Restart Backend**

**Option A: Using PM2**
```bash
pm2 stop flinxx-backend
pm2 start npm --name "flinxx-backend" -- start
# OR
pm2 restart flinxx-backend
```

**Option B: Using npm directly**
```bash
npm start
```

### **Step 6: Verify Backend is Running**
```bash
# Check PM2 status
pm2 status

# Watch logs (real-time)
pm2 logs flinxx-backend

# Test health endpoint (from your local machine)
curl https://d1pphanrf0qsx7.cloudfront.net/health
```

---

## 🔍 Check if Deployment Worked

### **From Your Local Machine:**

#### **1. Test /health endpoint**
```bash
curl https://d1pphanrf0qsx7.cloudfront.net/health
```
Expected response:
```json
{"status":"ok","timestamp":"2026-02-01T...","backend":"flinxx-backend running"}
```

#### **2. Test /debug/cookies endpoint**
```bash
curl https://d1pphanrf0qsx7.cloudfront.net/debug/cookies
```
Expected response (before login):
```json
{"cookiesReceived":{},"authTokenPresent":false}
```

#### **3. Full OAuth Test**
1. Open https://flinxx.in
2. Clear cookies: `localStorage.clear()`
3. Click "Continue with Google"
4. Watch backend logs:
   ```bash
   pm2 logs flinxx-backend
   ```
5. Look for:
   ```
   🔐 [AUTH/GOOGLE/CALLBACK] SETTING HTTPONLY COOKIE
   ✅ [AUTH/GOOGLE/CALLBACK] httpOnly cookie SET
   ```
6. Check browser DevTools > Application > Cookies
   - Name: `authToken`
   - HttpOnly: ✅
   - Secure: ✅
   - SameSite: `None`

---

## ⚠️ If Something Goes Wrong

### **Backend won't start**
```bash
# Check what's using port 10000 (default backend port)
sudo netstat -tlnp | grep 10000

# Check error logs
pm2 logs flinxx-backend --err

# Check if Node is installed
node --version

# Check npm
npm --version
```

### **Git pull fails**
```bash
# Check git status
git status

# Force pull latest
git fetch --all
git reset --hard origin/main
```

### **npm install fails**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still fails, check Node version
node --version  # Should be 18.x or higher
```

### **Port 10000 already in use**
```bash
# Kill process using port 10000
sudo kill -9 $(sudo lsof -i :10000 -t)

# Or restart from PM2
pm2 restart flinxx-backend
```

---

## 📋 Complete Step-by-Step (Copy All at Once)

Paste this entire block into your EC2 terminal:

```bash
#!/bin/bash
set -e

echo "🚀 [1/6] Connecting to backend directory..."
cd /home/ec2-user/flinxx-backend || cd /opt/flinxx-backend || exit 1
echo "✅ Location: $(pwd)"

echo ""
echo "📥 [2/6] Pulling latest code..."
git fetch origin
git pull origin main
echo "✅ Code updated"

echo ""
echo "📦 [3/6] Installing dependencies (including cookie-parser)..."
npm install
echo "✅ Dependencies installed"

echo ""
echo "🛑 [4/6] Stopping backend..."
pm2 stop flinxx-backend || true
echo "✅ Stopped"

echo ""
echo "▶️  [5/6] Starting backend..."
pm2 start npm --name "flinxx-backend" -- start || pm2 restart flinxx-backend
echo "✅ Started"

echo ""
echo "📋 [6/6] Recent logs:"
sleep 2
pm2 logs flinxx-backend --lines 20 --nostream || true

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🔍 Test health: https://d1pphanrf0qsx7.cloudfront.net/health"
echo "🧪 Test OAuth: https://flinxx.in → Continue with Google"
```

---

## 🧪 Test Sequence (In Order)

### **1. Verify Backend is Running**
```bash
# On EC2
pm2 status
# Should show flinxx-backend running

# From your local machine
curl https://d1pphanrf0qsx7.cloudfront.net/health
# Should return 200 with JSON
```

### **2. Do Full OAuth Flow**
- Visit https://flinxx.in
- Clear cookies: `localStorage.clear()`
- Click "Continue with Google"
- Complete Google login
- Watch backend logs:
  ```bash
  pm2 logs flinxx-backend
  ```

### **3. Check Cookie is Set**
- Browser DevTools > Application > Cookies > flinxx.in
- Should see: `authToken` with HttpOnly ✅, Secure ✅, SameSite: None

### **4. Verify /api/profile Works**
- Backend logs should show:
  ```
  ✅ [PROFILE API] Token found in httpOnly cookie
  ✅ JWT token verified
  ```

### **5. User Should Land on Dashboard**
- URL: https://flinxx.in/dashboard (NOT /login)
- Page loads without 401 errors
- Can click "Find Partner"

---

## 📞 Troubleshooting Checklist

- [ ] Backend started: `pm2 status` shows running
- [ ] Code updated: `git log --oneline -5` shows latest commits
- [ ] Dependencies installed: `npm install` completed without errors
- [ ] Health endpoint works: `curl /health` returns 200
- [ ] Cookie debug works: `curl /debug/cookies` returns JSON
- [ ] OAuth logs show: "Cookie SET successfully"
- [ ] Browser shows: authToken cookie in DevTools
- [ ] /api/profile returns 200: Not 401
- [ ] Frontend redirects to /dashboard: Not /login

---

## 🎉 Success Indicators

✅ Backend health: `https://d1pphanrf0qsx7.cloudfront.net/health` → 200 OK
✅ OAuth logs: `🔐 [AUTH/GOOGLE/CALLBACK] SETTING HTTPONLY COOKIE`
✅ Cookie debug: `authTokenPresent: true` (after login)
✅ Profile logs: `✅ Token found in httpOnly cookie`
✅ Frontend: Redirects to /dashboard (not /login)
✅ User: Can start video matching 🎉

---

## 📝 Git Commits to Verify

After pull, check these commits are present:
```bash
git log --oneline | head -20
```

Should include:
- `f252d2f` - docs: Add comprehensive OAuth cookie debugging
- `706bf59` - 🔍 CRITICAL DIAGNOSTICS
- `81d7ed8` - feat: Add /health endpoint
- `98c45cc` - 🔥 CRITICAL FIX: Add cookie-parser middleware
- etc...

If these aren't present, the pull failed!

---

**Ready to deploy!** 🚀
