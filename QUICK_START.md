# Quick Start Guide - Run Both Servers

## 🚀 Fastest Method (Windows PowerShell)

### Option 1: Use the Helper Script (Easiest)

Double-click or run in PowerShell:
```powershell
.\start-all.ps1
```

This will:
- Open two new PowerShell windows
- Start backend on http://localhost:3001
- Start frontend on http://localhost:8080
- Install dependencies automatically if needed

---

### Option 2: Manual Start (Two Terminals)

#### Terminal 1 - Backend
```powershell
cd Backend
npm install  # Only needed first time
npm run dev
```

#### Terminal 2 - Frontend
```powershell
cd Frontend
npm install  # Only needed first time
npm run dev
```

---

## ✅ Verify Everything is Running

### 1. Check Backend
Open browser: **http://localhost:3001/health**

Should see:
```json
{"status":"ok","message":"RoomSync Backend is running"}
```

### 2. Check Frontend
Open browser: **http://localhost:8080**

Should see the RoomSync welcome page.

---

## 🎯 Using the App

1. **Open** http://localhost:8080 in your browser
2. **Click** "Get Started" button
3. **Complete** the questionnaire (8 questions)
4. **View** your matches (updates automatically every 30 seconds!)

---

## 🛑 To Stop Servers

- Press `Ctrl + C` in each terminal window
- Or close the terminal windows

---

## ⚠️ Troubleshooting

**"Port already in use" error:**
- Kill the process using the port:
```powershell
# Find process on port 3001
netstat -ano | findstr :3001
# Kill it (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

**"npm: command not found"**
- Install Node.js from https://nodejs.org/

**Dependencies not installing:**
```powershell
# Clean install
cd Backend
rm -r node_modules package-lock.json  # If exists
npm install

cd ../Frontend
rm -r node_modules package-lock.json  # If exists
npm install
```

---

## 📝 What's Running?

- **Backend API**: http://localhost:3001
  - Handles user data and matching algorithm
  - Hungarian algorithm calculates compatibility
  
- **Frontend**: http://localhost:8080
  - React app with live updates
  - Polls backend every 30 seconds
  - Shows matches with compatibility scores

---

That's it! 🎉 Both servers are now running and ready to use.

