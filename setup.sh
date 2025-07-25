#!/bin/bash

# Gender Pay Gap PWA Setup Script
# This script sets up the development environment for the Gender Pay Gap Progressive Web App

echo "🚀 Setting up Gender Pay Gap PWA..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create icons directory if it doesn't exist
if [ ! -d "icons" ]; then
    echo "📁 Creating icons directory..."
    mkdir -p icons
fi

# Generate simple placeholder icons (you should replace these with actual icons)
echo "🖼️  Creating placeholder app icons..."

# You can replace this with actual icon generation using ImageMagick or similar
# For now, we'll create simple placeholder files
touch icons/icon-72x72.png
touch icons/icon-96x96.png
touch icons/icon-128x128.png
touch icons/icon-144x144.png
touch icons/icon-152x152.png
touch icons/icon-192x192.png
touch icons/icon-384x384.png
touch icons/icon-512x512.png
touch icons/icon-16x16.png
touch icons/icon-32x32.png

echo "📱 Placeholder icons created. Replace with actual PNG icons."

# Create screenshots directory
if [ ! -d "screenshots" ]; then
    echo "📁 Creating screenshots directory..."
    mkdir -p screenshots
fi

# Check if Python is available for local server
if command -v python3 &> /dev/null; then
    echo "🐍 Python 3 found - you can use 'python3 -m http.server 8000' to test the PWA"
elif command -v python &> /dev/null; then
    echo "🐍 Python found - you can use 'python -m SimpleHTTPServer 8000' to test the PWA"
fi

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "📦 Node.js found - you can use 'npx serve .' to test the PWA"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Replace placeholder icons in the 'icons/' directory with actual PNG files"
echo "2. Add screenshots to the 'screenshots/' directory"
echo "3. Start a local server to test PWA features:"
echo "   • python3 -m http.server 8000"
echo "   • or npx serve ."
echo "4. Open http://localhost:8000 in your browser"
echo "5. Test PWA features at http://localhost:8000/pwa-test.html"
echo ""
echo "📱 PWA Features included:"
echo "• ✅ Web App Manifest"
echo "• ✅ Service Worker for offline functionality"
echo "• ✅ Install prompt"
echo "• ✅ Mobile-optimized UI"
echo "• ✅ Touch gestures"
echo "• ✅ Native sharing"
echo "• ✅ Keyboard shortcuts"
echo "• ✅ Performance monitoring"
echo ""
echo "🔧 For production deployment:"
echo "• Ensure HTTPS is enabled"
echo "• Generate actual app icons"
echo "• Test on various devices and browsers"
echo "• Consider adding push notifications server"
