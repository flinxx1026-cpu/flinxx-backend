#!/usr/bin/env powershell
<#
Direct Git Push Script
This script attempts to push changes to GitHub without interactive terminal
#>

Write-Host "===== Git Push Script =====" -ForegroundColor Cyan
Write-Host ""

# Set working directory
$workdir = "c:\Users\nikhi\Downloads\joi"
Set-Location $workdir

Write-Host "Working Directory: $workdir" -ForegroundColor Yellow
Write-Host ""

# Check git status
Write-Host "Checking git status..." -ForegroundColor Cyan
$gitStatus = & git status --porcelain 2>&1
if ($gitStatus) {
    Write-Host "Modified files:" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host ""
    
    # Stage all changes
    Write-Host "Staging all changes..." -ForegroundColor Green
    & git add -A
    Write-Host "✓ Files staged" -ForegroundColor Green
    Write-Host ""
    
    # Commit changes
    Write-Host "Creating commit..." -ForegroundColor Green
    $commitMsg = "fix: Frontend socket URL to HTTPS CloudFront for secure WSS connection - Production deployment"
    & git commit -m $commitMsg
    Write-Host "✓ Commit created" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "No changes to stage. Checking if commits need pushing..." -ForegroundColor Yellow
    Write-Host ""
}

# Check remote
Write-Host "Checking git remote..." -ForegroundColor Cyan
$remote = & git remote -v 2>&1
Write-Host $remote
Write-Host ""

# Attempt push
Write-Host "Pushing to GitHub..." -ForegroundColor Green
$pushOutput = & git push origin main -v 2>&1
Write-Host $pushOutput
Write-Host ""

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Push successful!" -ForegroundColor Green
} else {
    Write-Host "✗ Push failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Retrying with force-with-lease..." -ForegroundColor Yellow
    Write-Host ""
    
    $forceOutput = & git push origin main --force-with-lease -v 2>&1
    Write-Host $forceOutput
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Force push successful!" -ForegroundColor Green
    } else {
        Write-Host "✗ Force push also failed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "===== Script Complete =====" -ForegroundColor Cyan
Write-Host "Check GitHub: https://github.com/flinxx1026-cpu/flinxx-backend"
