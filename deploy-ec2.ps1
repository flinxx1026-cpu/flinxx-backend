# Flinxx Backend EC2 Deployment Script (PowerShell)
# This script SSH's to EC2, pulls latest code, installs deps, and restarts backend

param(
    [string]$EC2_IP = "13.203.157.116",
    [string]$EC2_USER = "ec2-user",
    [string]$PEM_KEY = "C:\path\to\your\key.pem",  # ← UPDATE THIS!
    [string]$BACKEND_DIR = "/home/ec2-user/flinxx-backend"
)

Write-Host "🚀 [DEPLOYMENT] Starting backend deployment on EC2..." -ForegroundColor Green
Write-Host "📍 Timestamp: $(Get-Date)" -ForegroundColor Cyan
Write-Host ""

# Check if PEM key exists
if (-not (Test-Path $PEM_KEY)) {
    Write-Host "❌ PEM key not found at: $PEM_KEY" -ForegroundColor Red
    Write-Host "Please update PEM_KEY in this script" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔑 Using PEM key: $PEM_KEY" -ForegroundColor Cyan
Write-Host "🖥️  EC2 IP: $EC2_IP" -ForegroundColor Cyan
Write-Host ""

# Create SSH command
$SSH_CMD = "ssh -i `"$PEM_KEY`" $EC2_USER@$EC2_IP"

Write-Host "1️⃣  Connecting to EC2..." -ForegroundColor Yellow
Write-Host "Command: $SSH_CMD" -ForegroundColor Gray

# Deployment commands to run on EC2
$DEPLOYMENT_SCRIPT = @"
#!/bin/bash
set -e

echo '🚀 Backend deployment starting...'
echo "📍 Date: \$(date)"

# Navigate to backend
cd $BACKEND_DIR || exit 1
echo "📂 Working in: \$(pwd)"

# Pull latest code
echo ""
echo "📥 Pulling from GitHub..."
git fetch origin
git pull origin main
echo "✅ Code pulled"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Restart backend with PM2
echo ""
echo "🛑 Stopping current process..."
pm2 stop flinxx-backend || true

echo "▶️  Starting backend..."
pm2 start npm --name "flinxx-backend" -- start || pm2 restart flinxx-backend
echo "✅ Backend started"

# Show recent logs
echo ""
echo "📋 Recent logs:"
pm2 logs flinxx-backend --lines 15 --nostream || true

echo ""
echo "✅ Deployment complete!"
echo "🔍 Testing health endpoint..."
sleep 2
curl -s https://d1pphanrf0qsx7.cloudfront.net/health || echo "Health check: connection pending"
"@

# Execute via SSH
Write-Host "2️⃣  Sending deployment commands..." -ForegroundColor Yellow
$DEPLOYMENT_SCRIPT | & $SSH_CMD "/bin/bash"

Write-Host ""
Write-Host "✅ [DEPLOYMENT] Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test OAuth: https://flinxx.in → Click 'Continue with Google'"
Write-Host "   2. Check DevTools: Application → Cookies"
Write-Host "   3. Verify: authToken cookie with HttpOnly + Secure + SameSite=None"
Write-Host "   4. Backend logs: pm2 logs flinxx-backend"
Write-Host ""
Write-Host "📍 Timestamp: $(Get-Date)" -ForegroundColor Gray
