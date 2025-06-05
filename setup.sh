#!/bin/bash

echo "Setting up Cal - Nutrition & Wellness Tracker"
echo "============================================"

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found in backend/"
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit backend/.env and add your ANTHROPIC_API_KEY"
fi

deactivate
cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your Anthropic API key to backend/.env"
echo "2. Run './run-dev.sh' to start the development servers"
echo "3. Open http://localhost:5173 in your browser"