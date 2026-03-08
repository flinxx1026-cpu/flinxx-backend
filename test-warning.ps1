# Test Warning System Script
# This script gets a user UUID and sends a warning to them

Write-Host "🚀 [TEST WARNING] Starting warning system test..." -ForegroundColor Cyan

# Get first user from database (using psql)
Write-Host "`n📊 [TEST WARNING] Fetching first user from database..." -ForegroundColor Yellow
$psqlQuery = @"
SELECT id, email, public_id FROM users LIMIT 1;
"@

# Try to get user from database
try {
  $userResult = & psql -h localhost -U postgres -d mydatabase -t -c $psqlQuery 2>$null
  
  if ($userResult) {
    Write-Host "✅ [TEST WARNING] User found!" -ForegroundColor Green
    Write-Host "   User data: $userResult" -ForegroundColor White
    
    # Extract UUID (first column)
    $userId = ($userResult -split '\|')[0].Trim()
    Write-Host "   UUID: $userId" -ForegroundColor Cyan
  } else {
    Write-Host "❌ [TEST WARNING] No users found in database" -ForegroundColor Red
    Write-Host "   Make sure PostgreSQL is running and database is populated" -ForegroundColor Yellow
    exit 1
  }
} catch {
  Write-Host "❌ [TEST WARNING] Error connecting to database: $_" -ForegroundColor Red
  Write-Host "   Alternative: Use Postman to send warning manually" -ForegroundColor Yellow
  exit 1
}

# Send warning to user via backend API
Write-Host "`n📡 [TEST WARNING] Sending warning to user..." -ForegroundColor Yellow

$warningPayload = @{
  userId = $userId
  reason = "Test warning from automated script"
} | ConvertTo-Json

Write-Host "   Payload: $warningPayload" -ForegroundColor White

try {
  $response = Invoke-WebRequest -Uri "http://localhost:3001/api/admin/send-warning" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $warningPayload `
    -ErrorAction Stop
    
  Write-Host "`n✅ [TEST WARNING] Warning sent successfully!" -ForegroundColor Green
  Write-Host "   Response: $($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)" -ForegroundColor White
} catch {
  Write-Host "`n❌ [TEST WARNING] Error sending warning: $_" -ForegroundColor Red
  Write-Host "   Make sure backend is running on port 3001" -ForegroundColor Yellow
}

Write-Host "`n💡 [TEST WARNING] Instructions:" -ForegroundColor Cyan
Write-Host "   1. Open your browser and login to the app" -ForegroundColor White
Write-Host "   2. Keep the browser tab active and check the console" -ForegroundColor White
 Write-Host "   3. The warning modal should appear immediately" -ForegroundColor White
Write-Host "   4. Check browser console for debug logs starting with [WarningModal]" -ForegroundColor White
