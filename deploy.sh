#!/bin/bash

# Music Groovo Deployment Script
# This script helps prepare your app for deployment

echo "🎵 Music Groovo Deployment Helper"
echo "=================================="

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the Sonify directory"
    echo "   Make sure you have both 'backend' and 'frontend' folders"
    exit 1
fi

echo "✅ Found backend and frontend directories"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found"
    echo "   Please create it with your MongoDB connection string"
    echo "   See backend/env.example for reference"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Warning: frontend/.env file not found"
    echo "   Please create it with your backend URL"
    echo "   See frontend/env.example for reference"
fi

echo ""
echo "🚀 Deployment Steps:"
echo "===================="
echo ""
echo "1. BACKEND DEPLOYMENT (Render):"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set Root Directory: Sonify/backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Add environment variables:"
echo "     * MONGO_URI=your_mongodb_connection_string"
echo "     * JWT_SECRET=your_jwt_secret"
echo "     * FRONTEND_URL=https://your-frontend.vercel.app"
echo "     * PORT=1337"
echo ""
echo "2. FRONTEND DEPLOYMENT (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set Root Directory: Sonify/frontend"
echo "   - Framework Preset: Vite"
echo "   - Add environment variable:"
echo "     * VITE_BACKEND_URL=https://your-backend.onrender.com"
echo ""
echo "3. TEST YOUR DEPLOYMENT:"
echo "   - Test backend: https://your-backend.onrender.com/health"
echo "   - Test frontend: https://your-app.vercel.app"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔧 Quick Commands:"
echo "=================="
echo "Test backend locally: cd backend && npm run dev"
echo "Test frontend locally: cd frontend && npm run dev"
echo "Build frontend: cd frontend && npm run build"
echo ""

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "   Backend: Installing dependencies..."
    cd backend && npm install && cd ..
else
    echo "   Backend: ✅ Dependencies installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "   Frontend: Installing dependencies..."
    cd frontend && npm install && cd ..
else
    echo "   Frontend: ✅ Dependencies installed"
fi

echo ""
echo "🎉 Setup complete! Follow the deployment steps above." 