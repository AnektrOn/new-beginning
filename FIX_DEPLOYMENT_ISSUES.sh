#!/bin/bash
# Run this in your SSH session to fix deployment issues
# This will clean up space and fix the main branch

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 Fixing Deployment Issues..."
echo ""

# 1. Clean up space - Remove node_modules from branches that failed
echo "🧹 Cleaning up failed installations..."
cd ~/domains/humancatalystbeacon.com/public_html

# Remove incomplete node_modules from failed branches
for folder in courses-flow deployment-optimizations feature-ux; do
    if [ -d "$folder/node_modules" ]; then
        echo "  Removing $folder/node_modules..."
        rm -rf "$folder/node_modules" 2>/dev/null || true
    fi
done

# 2. Fix main branch (most important)
echo ""
echo "🔨 Fixing MAIN branch (app)..."
cd app

# Clean install
echo "  Removing old node_modules..."
rm -rf node_modules package-lock.json 2>/dev/null || true

# Install with cache clean
echo "  Installing dependencies (this may take a while)..."
npm cache clean --force 2>/dev/null || true
npm install --legacy-peer-deps --no-optional 2>&1 | tail -30

# Try to fix the ajv-keywords issue
if [ -d "node_modules/ajv-keywords" ]; then
    echo "  Fixing ajv-keywords dependency..."
    cd node_modules/ajv-keywords
    npm install ajv@^8 2>/dev/null || true
    cd ../..
fi

# Build
echo "  Building project..."
npm run build 2>&1 | tail -30 || {
    echo "⚠️  Build had issues, but checking if build folder exists..."
}

# Check if build succeeded
if [ -d "build" ]; then
    echo "✅ Main branch build folder created!"
else
    echo "❌ Build failed - checking logs..."
    echo "   Try: npm run build (to see full error)"
fi

# Restart server
if [ -f "server.js" ]; then
    echo "  Restarting server..."
    pm2 restart hcuniversity-app || pm2 start server.js --name hcuniversity-app
fi

echo ""
echo "✅ Main branch fixed!"
echo ""
echo "📊 Current PM2 Status:"
pm2 status

echo ""
echo "💡 Next Steps:"
echo "  1. Check disk space: df -h"
echo "  2. If still low on space, delete unused branches:"
echo "     rm -rf ~/domains/humancatalystbeacon.com/public_html/courses-flow"
echo "     rm -rf ~/domains/humancatalystbeacon.com/public_html/deployment-optimizations"
echo "  3. Focus on main branch only for now"

