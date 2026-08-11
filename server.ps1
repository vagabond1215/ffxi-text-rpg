$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js 20 or newer is required to run the FFXI Text RPG local server.' -ForegroundColor Red
    Write-Host 'Download Node.js from https://nodejs.org/'
    Read-Host 'Press Enter to exit'
    exit 1
}

Write-Host 'Starting FFXI Text RPG local server...' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Open this URL in your browser:' -ForegroundColor Yellow
Write-Host 'http://127.0.0.1:4173/' -ForegroundColor Green
Write-Host ''
Write-Host 'Press Ctrl+C in this window to stop the server.' -ForegroundColor Yellow
Write-Host ''

npm run serve

Write-Host ''
Write-Host 'Server stopped.' -ForegroundColor Cyan
Read-Host 'Press Enter to exit'
