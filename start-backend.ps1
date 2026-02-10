#!/usr/bin/env powershell

# Start backend server from the correct directory
Set-Location "C:\Users\nikhi\Downloads\joi\backend"
Write-Host "📍 Current directory: $(Get-Location)"
Write-Host "📍 Starting backend server..."
Write-Host ""

& node server.js
