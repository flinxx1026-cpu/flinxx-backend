#!/bin/bash
# Signup Flow Fix - Deployment Script
# This script deploys the fixed backend server.js to Render

echo "🚀 Deploying Signup Flow Fix to Production..."
echo ""

# Step 1: Verify file exists and has all fixes
echo "Step 1: Verifying fixes are in place..."
if grep -q "ensurePrismaAvailable()" backend/server.js; then
    echo "✅ Prisma validation found"
else
    echo "❌ ERROR: Prisma validation not found!"
    exit 1
fi

if grep -q "AUTH/GOOGLE/CALLBACK" backend/server.js; then
    echo "✅ Google callback logging found"
else
    echo "❌ ERROR: Google callback logging not found!"
    exit 1
fi

if grep -q "AUTH/FACEBOOK/CALLBACK" backend/server.js; then
    echo "✅ Facebook callback logging found"
else
    echo "❌ ERROR: Facebook callback logging not found!"
    exit 1
fi

if grep -q "Database verification successful" backend/server.js; then
    echo "✅ Database verification found"
else
    echo "❌ ERROR: Database verification not found!"
    exit 1
fi

echo ""
echo "Step 2: Creating backup..."
if [ -d "backend" ]; then
    cp backend/server.js backend/server.js.backup.2025-01-12
    echo "✅ Backup created: backend/server.js.backup.2025-01-12"
else
    echo "❌ ERROR: backend directory not found!"
    exit 1
fi

echo ""
echo "Step 3: Git status check..."
git status

echo ""
echo "Step 4: Git commit the changes..."
git add backend/server.js
git commit -m "Fix: Signup flow - Add Prisma validation, verification, and logging

- Added ensurePrismaAvailable() helper to prevent null Prisma crashes
- Fixed /api/users/save to use Prisma consistently (was using raw SQL)
- Added post-creation verification for all user creation endpoints
- Enhanced logging for /auth/google/callback and /auth/facebook/callback
- Added detailed error messages in /auth-success endpoint
- All users now verified in database before success is returned

This fixes the issue where signups appeared to succeed but users weren't in DB."

echo ""
echo "Step 5: Push to git (which will trigger Render deployment)..."
git push origin main

echo ""
echo "⏳ Waiting for Render to deploy (this may take 2-3 minutes)..."
echo "   You can monitor at: https://dashboard.render.com/"
echo ""
echo "Step 6: Verify deployment..."
echo "   After deployment completes:"
echo "   1. Go to your website and try a test signup with new email"
echo "   2. Check backend logs for [AUTH/GOOGLE/CALLBACK] messages"
echo "   3. Query database: SELECT * FROM users WHERE email='test@example.com';"
echo "   4. User should exist with public_id set"
echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Test Signup Steps:"
echo "   1. Open https://flinxx-backend-frontend.vercel.app/"
echo "   2. Click 'Continue with Google'"
echo "   3. Complete Google auth"
echo "   4. Should see success page"
echo "   5. Check database - email should be there with public_id"
echo ""
