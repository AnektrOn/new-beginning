#!/bin/bash
# Check what error the server is showing

echo "🔍 Checking Server Status..."
echo ""

# Check PM2 logs
echo "📋 Server Logs (last 30 lines):"
pm2 logs hcuniversity-app --lines 30 --nostream

echo ""
echo "🔍 Checking server.js configuration..."
cd ~/domains/humancatalystbeacon.com/public_html/app

# Check if server.js exists and what it does
if [ -f "server.js" ]; then
    echo "✅ server.js exists"
    echo ""
    echo "Checking server configuration..."
    grep -A 5 "app.use\|express.static\|build" server.js | head -10 || echo "Could not find static file serving configuration"
else
    echo "❌ server.js not found"
fi

echo ""
echo "📁 Checking build folder..."
if [ -d "build" ]; then
    echo "✅ build folder exists"
    ls -la build/ | head -5
    if [ -f "build/index.html" ]; then
        echo "✅ build/index.html exists"
    else
        echo "❌ build/index.html missing!"
    fi
else
    echo "❌ build folder not found"
fi

echo ""
echo "💡 The server might need to be configured to serve the build folder."
echo "   Or the .htaccess should handle it (which we already set up)."

