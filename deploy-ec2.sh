#!/bin/bash

# Flinxx Backend EC2 Deployment Script
# This script pulls latest code, installs dependencies, and restarts the backend

set -e  # Exit on error

echo "🚀 [DEPLOYMENT] Starting backend deployment on EC2..."
echo "📍 Timestamp: $(date)"

# Navigate to backend directory
BACKEND_DIR="/home/ec2-user/flinxx-backend"
# If above doesn't exist, try:
# BACKEND_DIR="/opt/flinxx-backend"
# Or check your actual path

if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found at: $BACKEND_DIR"
    echo "Please update BACKEND_DIR in this script"
    exit 1
fi

cd "$BACKEND_DIR"
echo "📂 Working directory: $(pwd)"

# 1. Pull latest code from GitHub
echo ""
echo "📥 [GIT] Pulling latest changes from GitHub..."
git fetch origin
git pull origin main
echo "✅ Latest code pulled"

# 2. Install dependencies (including new cookie-parser)
echo ""
echo "📦 [NPM] Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# 3. Stop current backend process
echo ""
echo "🛑 [PM2] Stopping backend service..."
pm2 stop flinxx-backend || true  # Don't fail if not running
echo "✅ Backend stopped"

# 4. Start/restart backend
echo ""
echo "▶️  [PM2] Starting backend service..."
pm2 start npm --name "flinxx-backend" -- start
# OR if using pm2 restart:
# pm2 restart flinxx-backend
echo "✅ Backend started"

# 5. Show logs
echo ""
echo "📋 [LOGS] Recent backend logs:"
pm2 logs flinxx-backend --lines 20 --nostream

# 6. Verify backend is responding
echo ""
echo "🔍 [HEALTH CHECK] Testing backend health..."
sleep 2
HEALTH_CHECK=$(curl -s https://d1pphanrf0qsx7.cloudfront.net/health || echo "failed")
if echo "$HEALTH_CHECK" | grep -q "ok"; then
    echo "✅ Backend is responding! Status: $HEALTH_CHECK"
else
    echo "⚠️  Backend health check returned: $HEALTH_CHECK"
    echo "⚠️  This might be normal if CloudFront is caching"
fi

echo ""
echo "✅ [DEPLOYMENT] Backend deployment complete!"
echo "📍 Timestamp: $(date)"
echo ""
echo "📌 Next steps:"
echo "   1. Test OAuth login: https://flinxx.in"
echo "   2. Click 'Continue with Google'"
echo "   3. Check browser DevTools > Application > Cookies"
echo "   4. Cookie should be: authToken with HttpOnly + Secure + SameSite=None"
echo "   5. Check backend logs: pm2 logs flinxx-backend"
