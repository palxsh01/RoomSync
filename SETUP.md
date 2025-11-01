# RoomSync Setup Guide

This guide will help you run both the backend and frontend servers simultaneously.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Quick Start

### Option 1: Run in Separate Terminal Windows (Recommended)

#### Terminal 1 - Backend Server
```bash
# Navigate to backend directory
cd Backend

# Install dependencies (first time only)
npm install

# Start the backend server
npm run dev
```

The backend will run on **http://localhost:3001**

#### Terminal 2 - Frontend Server
```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies (first time only)
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on **http://localhost:8080**

---

### Option 2: Run in Background (Windows PowerShell)

#### Backend (Background)
```powershell
cd Backend
npm install  # First time only
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
```

#### Frontend (Background)
```powershell
cd Frontend
npm install  # First time only
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
```

---

### Option 3: Using a Process Manager (Advanced)

#### Install concurrently (global or local)
```bash
npm install -g concurrently
```

#### Create a start script at root level
Create `package.json` in the root directory:

```json
{
  "name": "roomsync",
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix Backend\" \"npm run dev --prefix Frontend\"",
    "install:all": "npm install --prefix Backend && npm install --prefix Frontend"
  }
}
```

Then run:
```bash
npm run dev
```

---

## Environment Configuration

### Frontend Environment Variable (Optional)

The frontend defaults to `http://localhost:3001/api`. If your backend runs on a different URL, create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### Backend Environment Variable (Optional)

If you want to change the backend port, create a `.env` file in the `Backend` directory:

```env
PORT=3001
```

---

## Verification

### 1. Check Backend is Running
Open your browser or use curl:
```bash
# Browser: http://localhost:3001/health
# Or in terminal:
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "RoomSync Backend is running"
}
```

### 2. Check Frontend is Running
Open your browser:
```
http://localhost:8080
```

You should see the RoomSync welcome page.

### 3. Test the Connection
1. Complete the questionnaire on the frontend
2. Check the browser console (F12) for API calls
3. Verify matches appear after questionnaire completion

---

## Troubleshooting

### Backend Won't Start

**Port 3001 already in use:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in Backend/.env
```

**Missing dependencies:**
```bash
cd Backend
npm install
```

### Frontend Won't Start

**Port 8080 already in use:**
- Change port in `Frontend/vite.config.ts`:
```typescript
server: {
  port: 8081, // Change to available port
}
```

**Missing dependencies:**
```bash
cd Frontend
npm install
```

### Frontend Can't Connect to Backend

1. **Verify backend is running:** Check http://localhost:3001/health
2. **Check CORS:** Backend should have CORS enabled (already configured)
3. **Check API URL:** Verify `VITE_API_URL` in Frontend/.env matches backend URL
4. **Check browser console:** Look for CORS or network errors

### Matches Not Appearing

1. **Complete questionnaire first:** Matches only appear after preferences are saved
2. **Check user is synced:** Open browser console and check for user ID in localStorage
3. **Verify backend has users:** Check if other users exist in the backend database
4. **Check network tab:** Verify API calls to `/api/matches/user/:id` are succeeding

---

## Development Workflow

1. **Start backend first** (Terminal 1)
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start frontend** (Terminal 2)
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Open browser** to http://localhost:8080

4. **Complete questionnaire** to sync with backend

5. **View matches** - they will update automatically every 30 seconds

---

## Production Build

### Build Backend
```bash
cd Backend
npm run build
npm start
```

### Build Frontend
```bash
cd Frontend
npm run build
npm run preview  # Preview production build
```

---

## Ports Summary

- **Backend API:** http://localhost:3001
- **Frontend Dev Server:** http://localhost:8080
- **Health Check:** http://localhost:3001/health

---

## Tips

- Keep both terminals visible to monitor logs
- Use `Ctrl+C` to stop either server
- Backend auto-reloads on file changes (using tsx watch)
- Frontend auto-reloads on file changes (using Vite HMR)
- Check browser console (F12) for API errors
- Check backend terminal for request logs

---

## Next Steps

Once both servers are running:
1. Complete the questionnaire
2. Your preferences will sync to the backend
3. Matches will appear automatically
4. Compatibility scores update every 30 seconds
5. New users joining will trigger match recalculation

