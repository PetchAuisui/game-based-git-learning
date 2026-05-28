#!/bin/bash

# Git Sandbox Setup & Run Script

echo "🎮 Git Sandbox - Setup & Run Script"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend setup failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "===================================="
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "🎮 Happy Git learning!"
