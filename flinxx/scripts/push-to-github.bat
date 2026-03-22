@echo off
cd /d c:\Users\nikhi\Downloads\joi
echo Checking git status...
git status
echo.
echo Adding frontend files...
git add frontend/.env.production -f
echo.
echo Committing changes...
git commit -m "fix: Socket URL update to HTTPS CloudFront domain for WSS support" --allow-empty
echo.
echo Pulling from remote...
git pull origin main --rebase
echo.
echo Pushing to GitHub...
git push origin main -v
echo.
echo Done!
pause
