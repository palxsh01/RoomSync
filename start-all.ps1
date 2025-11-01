# PowerShell script to start both backend and frontend servers
Write-Host "🚀 Starting RoomSync (Backend + Frontend)..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
Write-Host "📡 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Backend'; if (-Not (Test-Path 'node_modules')) { npm install }; Write-Host '🚀 Backend running on http://localhost:3001' -ForegroundColor Green; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Frontend'; if (-Not (Test-Path 'node_modules')) { npm install }; Write-Host '🌐 Frontend running on http://localhost:8080' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:3001" -ForegroundColor Yellow
Write-Host "🌐 Frontend: http://localhost:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

