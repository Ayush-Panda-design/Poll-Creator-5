# 🚀 PollWave Deployment & Setup Guide

This guide provides step-by-step instructions for deploying and running the **PollWave** platform locally and in a production environment.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (Local instance or Atlas URI)

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies
```powershell
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=5009
MONGO_URI=mongodb://localhost:27017/poll-platform
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_CALLBACK_URL=http://localhost:5009/api/auth/google/callback
NODE_ENV=development
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5009/api
VITE_SOCKET_URL=http://localhost:5009
VITE_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
```

### 3. Run the Application
```powershell
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

---

## 🌐 Production Deployment

### 1. Backend Deployment (Node.js)
1. **Build Step**: No build step required for the Node.js backend (using ESM).
2. **Process Management**: Use `pm2` to keep the server alive.
   ```powershell
   npm install -g pm2
   cd server
   pm2 start src/server.js --name pollwave-api
   ```
3. **Static Assets**: Ensure the `public/uploads/avatars` directory exists and has write permissions.

### 2. Frontend Deployment (Vite/React)
1. **Build the production bundle**:
   ```powershell
   cd client
   npm run build
   ```
2. **Serve the build**:
   - The contents of the `client/dist` folder should be served by a web server (Nginx, Apache, or Vercel/Netlify).
   - Ensure all routes redirect to `index.html` (Single Page Application configuration).

---

## 🚨 Troubleshooting

### 1. Port Already in Use (`EADDRINUSE`)
If you see an error saying port `5009` is in use, run this in PowerShell to kill the zombie process:
```powershell
$port = 5009; $pidToKill = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess; if ($pidToKill) { taskkill /F /PID $pidToKill }
```

### 2. Images Not Loading
Check that the `server/public` folder is being served correctly and that the `VITE_API_URL` in the client `.env` does not end with a trailing slash.

### 3. MongoDB Connection
Ensure your MongoDB service is running. On Windows:
```powershell
services.msc # Look for MongoDB and start it
```

---

## ✨ Features Summary
- **Real-time Analytics**: Live charts via Socket.io.
- **Contextual Help**: Page-specific guidance for creators.
- **Profile System**: Custom avatars, activity streaks, and engagement insights.
- **Presentation Mode**: Fullscreen results view for live events.

---
MIT © 2025 PollWave
