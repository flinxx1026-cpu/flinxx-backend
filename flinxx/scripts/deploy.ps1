# Signup Flow Fix - Deployment Script (Windows PowerShell)
# This script deploys the fixed backend server.js to production

Write-Host "🚀 Deploying Signup Flow Fix to Production..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify file exists and has all fixes
Write-Host "Step 1: Verifying fixes are in place..." -ForegroundColor Yellow

$serverJs = "backend/server.js"
$content = Get-Content $serverJs -Raw

$checksToPerform = @(
    @{ name = "Prisma validation"; pattern = "ensurePrismaAvailable()" },
    @{ name = "Google callback logging"; pattern = "AUTH/GOOGLE/CALLBACK" },
    @{ name = "Facebook callback logging"; pattern = "AUTH/FACEBOOK/CALLBACK" },
    @{ name = "Database verification"; pattern = "Database verification successful" }
)

$allChecksPass = $true
foreach ($check in $checksToPerform) {
    if ($content -match [regex]::Escape($check.pattern)) {
        Write-Host "✅ $($check.name) found" -ForegroundColor Green
    } else {
        Write-Host "❌ ERROR: $($check.name) not found!" -ForegroundColor Red
        $allChecksPass = $false
    }
}

if (-not $allChecksPass) {
    Write-Host ""
    Write-Host "❌ Fix verification failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating backup..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Copy-Item "backend/server.js" "backend/server.js.backup.2025-01-12" -Force
    Write-Host "✅ Backup created: backend/server.js.backup.2025-01-12" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: backend directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Step 4: Committing changes..." -ForegroundColor Yellow
git add backend/server.js

$commitMessage = @"
Fix: Signup flow - Add Prisma validation, verification, and logging

- Added ensurePrismaAvailable() helper to prevent null Prisma crashes
- Fixed /api/users/save to use Prisma consistently (was using raw SQL)
- Added post-creation verification for all user creation endpoints
- Enhanced logging for /auth/google/callback and /auth/facebook/callback
- Added detailed error messages in /auth-success endpoint
- All users now verified in database before success is returned

This fixes the issue where signups appeared to succeed but users weren't in DB.
"@

git commit -m $commitMessage

Write-Host ""
Write-Host "Step 5: Pushing to git (will trigger Render deployment)..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "⏳ Waiting for Render to deploy (this may take 2-3 minutes)..." -ForegroundColor Cyan
Write-Host "   Monitor at: https://dashboard.render.com/" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 6: Deployment initiated!" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Test Signup Steps:" -ForegroundColor Cyan
Write-Host "   1. Open https://flinxx-backend-frontend.vercel.app/" -ForegroundColor Gray
Write-Host "   2. Click 'Continue with Google'" -ForegroundColor Gray
Write-Host "   3. Complete Google auth" -ForegroundColor Gray
Write-Host "   4. Should see success page" -ForegroundColor Gray
Write-Host "   5. Check database - email should appear with public_id" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Deployment script complete!" -ForegroundColor Green
