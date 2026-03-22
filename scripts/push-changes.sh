#!/bin/bash
cd /c/Users/nikhi/Downloads/joi

echo "📋 Checking git status..."
git status

echo ""
echo "📝 Adding Login.jsx changes..."
git add frontend/src/pages/Login.jsx

echo ""
echo "💾 Committing changes..."
git commit -m "fix: add dashboard redirect after login success

- Google login now redirects to /chat after successful authentication
- Facebook login now redirects to /chat after successful authentication
- Terms modal login handlers also redirect on success with 300ms delay
- Small delay ensures localStorage is fully synced before navigation"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main -v

echo ""
echo "✓ Done!"
