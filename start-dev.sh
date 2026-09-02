#!/bin/bash
# Debug Arena - Development Startup Script
# Ensures backend is running BEFORE the frontend dev server starts

echo "🚀 Starting Debug Arena..."
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Start / restart the backend with PM2
echo "📦 Starting backend server (PM2)..."
cd "$PROJECT_DIR"
npx pm2 start ecosystem.config.js --no-daemon &>/dev/null || npx pm2 restart debug-arena-server &>/dev/null

# 2. Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..15}; do
  if curl -s http://localhost:3000/api/auth/admin/login -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' &>/dev/null; then
    echo "✅ Backend is ready!"
    break
  fi
  sleep 1
done

# 3. Start the Vite dev server
echo "🌐 Starting frontend dev server..."
cd "$PROJECT_DIR/client"
npm run dev
