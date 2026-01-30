@echo off
setlocal enabledelayedexpansion

cd /d c:\Users\nikhi\Downloads\joi

echo =====================================
echo Git Push Helper
echo =====================================
echo.

echo Step 1: Checking git status...
git status --short > temp_status.txt
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="" (
    echo ✓ No changes to commit
    echo.
    echo Checking if commits need to be pushed...
    git log origin/main..main --oneline > temp_unpushed.txt
    for /f "tokens=*" %%a in (temp_unpushed.txt) do set unpushed=%%a
    del temp_unpushed.txt
    
    if "%unpushed%"=="" (
        echo ✓ Everything is up to date
    ) else (
        echo Found unpushed commits:
        echo %unpushed%
        echo.
        echo Pushing...
        git push origin main
    )
) else (
    echo Changes found:
    echo %status%
    echo.
    
    echo Step 2: Adding all changes...
    git add .
    echo ✓ Changes staged
    echo.
    
    echo Step 3: Committing...
    git commit -m "fix: add complete dashboard redirect after login success"
    echo ✓ Changes committed
    echo.
    
    echo Step 4: Pushing to GitHub...
    git push origin main
    
    if !ERRORLEVEL! EQU 0 (
        echo ✓ Successfully pushed!
    ) else (
        echo ! Push failed with error code !ERRORLEVEL!
    )
)

echo.
echo =====================================
pause
