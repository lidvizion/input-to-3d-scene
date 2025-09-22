#!/bin/bash

echo "🎥 Setting up Video to 3D Scene application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_LV_API_URL=https://api.latentvision.com
NEXT_PUBLIC_LV_API_KEY=your_api_key_here
NEXT_PUBLIC_STORAGE_BUCKET=latentvision-storage

# Development
NODE_ENV=development
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🚀 Setup complete! To start the development server:"
echo "   npm run dev"
echo ""
echo "📖 Then open http://localhost:3000 in your browser"
echo ""
echo "🎯 Features available:"
echo "   • Video player with keyframe markers"
echo "   • 3D scene viewer with camera paths"
echo "   • Export GLB and JSON files"
echo "   • Responsive design"
