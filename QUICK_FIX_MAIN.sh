#!/bin/bash
# Quick fix for main branch - Run this in SSH

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 Quick Fix for Main Branch"
echo ""

# Check disk space first
echo "📊 Checking disk space..."
df -h ~ | tail -1

echo ""
echo "🧹 Cleaning up space..."
cd ~/domains/humancatalystbeacon.com/public_html

# Stop errored servers to free memory
pm2 delete hcuniversity-courses-flow 2>/dev/null || true
pm2 delete hcuniversity-deployment-optimizations 2>/dev/null || true

# Remove failed branches to free space (optional - uncomment if needed)
# rm -rf courses-flow deployment-optimizations 2>/dev/null || true

echo ""
echo "🔨 Fixing main branch..."
cd app

# Remove and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force

echo "📦 Installing dependencies (please wait)..."
npm install --legacy-peer-deps 2>&1 | grep -E "(added|removed|error|Error)" | tail -20

# Fix ajv-keywords if needed
if [ ! -d "node_modules/ajv-keywords/node_modules/ajv" ]; then
    echo "🔧 Fixing ajv-keywords..."
    cd node_modules/ajv-keywords
    npm install ajv@^8.0.0 --no-save 2>/dev/null || true
    cd ../..
fi

# Build
echo "🔨 Building..."
npm run build 2>&1 | tail -30

# Check result
if [ -d "build" ]; then
    echo "✅ Build successful!"
    ls -lh build/ | head -5
else
    echo "❌ Build failed - run 'npm run build' to see full error"
fi

# Restart server
pm2 restart hcuniversity-app

echo ""
pm2 status

