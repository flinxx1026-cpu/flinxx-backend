@echo off
setlocal enabledelayedexpansion

cd /d c:\Users\nikhi\Downloads\joi

echo.
echo ===== GIT STATUS =====
git status

echo.
echo ===== CHECKING RECENT COMMITS =====
git log --oneline -3

echo.
echo ===== ATTEMPTING PUSH =====
REM Reset to HTTPS URL
git remote set-url origin https://github.com/flinxx1026-cpu/flinxx-backend.git

REM Try push with timeout
timeout /t 2 /nobreak

echo Pushing to GitHub...
git push origin main -v --force-with-lease

echo.
echo Push attempt complete!
echo Check GitHub: https://github.com/flinxx1026-cpu/flinxx-backend
echo.
pause
