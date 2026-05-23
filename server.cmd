@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js 20 or newer is required to run the FFXI Text RPG local server.
    echo Download Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting FFXI Text RPG local server...
echo.
echo Open this URL in your browser:
echo http://127.0.0.1:4173/
echo.
echo Press Ctrl+C in this window to stop the server.
echo.
npm run serve

echo.
echo Server stopped.
pause
