#!/bin/bash
# Redeploy main branch with latest changes
# Run this on your Hostinger server via SSH

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔄 Redeploying Main Branch with Latest Changes..."
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git fetch origin main
git checkout main
git pull origin main

# Install/update dependencies
echo "📦 Updating dependencies..."
npm install --legacy-peer-deps

# Build
echo "🔨 Building project..."
npm run build

# Check build
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✅ Build successful!"
    ls -lh build/ | head -3
else
    echo "❌ Build failed!"
    exit 1
fi

# Restart server
echo "🚀 Restarting server..."
pm2 restart hcuniversity-app

echo ""
echo "✅ Deployment complete!"
echo ""
pm2 status | grep hcuniversity-app

echo ""
echo "🌐 Your website should now show the latest version at:"
echo "   https://app.humancatalystbeacon.com"
echo ""
echo "💡 Clear your browser cache if you still see the old version"

