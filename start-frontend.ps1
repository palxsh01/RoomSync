# PowerShell script to start the frontend server
Write-Host "🚀 Starting RoomSync Frontend Server..." -ForegroundColor Green

Set-Location -Path "$PSScriptRoot\Frontend"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Starting frontend on http://localhost:8080" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev

