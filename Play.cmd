@echo off
setlocal

set "GAME_URL=http://127.0.0.1:4173/"
echo Opening FFXI Text RPG...
echo %GAME_URL%
echo.
echo If the page does not load, run "Start Server.cmd" first.
start "" "%GAME_URL%"
