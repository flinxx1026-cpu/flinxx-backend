# Git deployment script with error handling
$ErrorActionPreference = "Stop"

try {
    Write-Host "📦 Starting git deployment..." -ForegroundColor Green
    
    Set-Location "c:\Users\nikhi\Downloads\joi"
    
    Write-Host "📝 Staging all changes..." -ForegroundColor Cyan
    & git add .
    
    Write-Host "✅ Staged changes. Commit log:" -ForegroundColor Cyan
    & git diff --cached --name-only
    
    Write-Host "`n💾 Creating commit..." -ForegroundColor Cyan
    & git commit -m "production CORS fix"
    
    Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Cyan
    & git push origin main
    
    Write-Host "`n✨ Deployment successful!" -ForegroundColor Green
    Write-Host "✅ Changes pushed to: https://github.com/flinxx1026-cpu/flinxx-backend" -ForegroundColor Green
    
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. SSH to EC2: ssh ubuntu@13.203.157.116"
    Write-Host "2. Restart backend: pm2 restart all"
    Write-Host "3. Test frontend: https://flinxx.in"
}
catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
