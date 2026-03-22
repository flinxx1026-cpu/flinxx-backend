@echo off
cd /d c:\Users\nikhi\Downloads\joi
echo.
echo ========================================
echo Pushing Login Redirect Fix to GitHub
echo ========================================
echo.
git add frontend/src/pages/Login.jsx
echo Added Login.jsx changes
echo.
git commit -m "fix: add dashboard redirect after login - await sign-in and navigate to chat"
echo Committed changes
echo.
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
  echo ✓ Successfully pushed to GitHub!
  echo.
  echo Changes:
  echo - Google login now redirects to /chat after successful auth
  echo - Facebook login now redirects to /chat after successful auth  
  echo - Terms modal login handlers also redirect on success
) else (
  echo ! Push failed - check credentials or connection
)
echo.
pause
