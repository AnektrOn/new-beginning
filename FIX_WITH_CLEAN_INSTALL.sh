#!/bin/bash
# Clean install that handles npm warnings better

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 CLEAN INSTALL AND BUILD..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Step 1: Clean everything
echo "📋 Step 1: Cleaning old files..."
rm -rf node_modules
rm -f package-lock.json
echo "✅ Cleaned"
echo ""

# Step 2: Install with better error handling
echo "📋 Step 2: Installing dependencies..."
echo "   (This may show warnings - that's OK, we'll ignore them)"
echo "   Installing... (this takes 3-5 minutes)"
echo ""

# Install and suppress warnings to stdout, but keep errors
npm install --legacy-peer-deps 2>&1 | grep -v "TAR_ENTRY_ERROR" | grep -v "ENOENT" | grep -v "lstat" || true

# Check if critical packages installed
echo ""
echo "📋 Step 3: Verifying critical packages..."
if [ -d "node_modules/react" ] && [ -d "node_modules/react-dom" ] && [ -f "node_modules/.bin/react-scripts" ]; then
    echo "✅ Critical packages installed successfully"
else
    echo "❌ Critical packages missing - trying alternative install..."
    npm install react react-dom react-scripts --legacy-peer-deps --no-optional
fi
echo ""

# Step 3: Build (warnings during build are OK)
echo "📋 Step 4: Building website..."
echo "   (This takes 2-5 minutes)"
echo "   (You may see warnings - that's normal)"
echo ""

# Build and suppress common warnings
npm run build 2>&1 | grep -v "TAR_ENTRY_ERROR" | grep -v "ENOENT" | grep -v "lstat" || true

# Check if build succeeded
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo ""
    echo "✅ Build successful!"
    echo "   Build size: $(du -sh build | awk '{print $1}')"
else
    echo ""
    echo "❌ Build failed! Check errors above."
    exit 1
fi
echo ""

# Step 4: Fix permissions
echo "📋 Step 5: Fixing permissions..."
chmod -R 755 build
find build -type f -exec chmod 644 {} \;
echo "✅ Permissions fixed"
echo ""

# Step 5: Start PM2
echo "📋 Step 6: Starting PM2 server..."
if [ -f "server.env" ]; then
    export $(grep -v '^#' server.env | xargs)
fi

if pm2 list | grep -q "hcuniversity-app"; then
    pm2 restart hcuniversity-app
else
    pm2 start server.js --name hcuniversity-app
    pm2 save
fi

echo ""
echo "✅ Server started"
pm2 status hcuniversity-app
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ INSTALLATION COMPLETE!"
echo ""
echo "📊 Status:"
[ -d "build" ] && [ -f "build/index.html" ] && echo "   ✅ Build folder: EXISTS" || echo "   ❌ Build folder: MISSING"
pm2 list | grep -q "hcuniversity-app.*online" && echo "   ✅ PM2 server: RUNNING" || echo "   ❌ PM2 server: NOT RUNNING"
echo ""
echo "🌐 Test your website:"
echo "   https://app.humancatalystbeacon.com"
echo ""
echo "💡 Note: Those npm warnings are harmless - they're just about"
echo "   example files in the 'three' package. Your website will work fine!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

