# PowerShell script to start the backend server
Write-Host "🚀 Starting RoomSync Backend Server..." -ForegroundColor Green

Set-Location -Path "$PSScriptRoot\Backend"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Starting backend on http://localhost:3001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev

