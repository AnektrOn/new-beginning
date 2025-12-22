#!/bin/bash
# Fix old version showing - Run this on your Hostinger server

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔍 Troubleshooting Old Version Issue..."
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# 1. Check current git status
echo "1️⃣  Checking Git Status..."
git fetch origin main
CURRENT_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)
echo "   Current commit: ${CURRENT_COMMIT:0:8}"
echo "   Remote commit:  ${REMOTE_COMMIT:0:8}"

if [ "$CURRENT_COMMIT" != "$REMOTE_COMMIT" ]; then
    echo "   ⚠️  Local code is outdated! Updating..."
    git checkout main
    git pull origin main
    echo "   ✅ Code updated"
else
    echo "   ✅ Code is up to date"
fi

echo ""

# 2. Force rebuild
echo "2️⃣  Force Rebuilding..."
rm -rf build node_modules/.cache
npm install --legacy-peer-deps
npm run build

# 3. Check build
echo ""
echo "3️⃣  Verifying Build..."
if [ -d "build" ] && [ -f "build/index.html" ]; then
    BUILD_SIZE=$(du -sh build | cut -f1)
    BUILD_TIME=$(stat -c %y build/index.html 2>/dev/null || stat -f %Sm build/index.html 2>/dev/null)
    echo "   ✅ Build exists (${BUILD_SIZE})"
    echo "   📅 Build time: ${BUILD_TIME}"
    
    # Check if index.html has new content
    if grep -q "react" build/index.html 2>/dev/null; then
        echo "   ✅ Build looks valid"
    else
        echo "   ⚠️  Build might be corrupted"
    fi
else
    echo "   ❌ Build failed!"
    exit 1
fi

# 4. Fix permissions
echo ""
echo "4️⃣  Fixing Permissions..."
chmod -R 755 build
find build -type f -exec chmod 644 {} \;
echo "   ✅ Permissions fixed"

# 5. Restart server
echo ""
echo "5️⃣  Restarting Server..."
pm2 restart hcuniversity-app
sleep 2
pm2 status | grep hcuniversity-app

# 6. Clear any caches
echo ""
echo "6️⃣  Clearing Caches..."
# Remove any old build artifacts
find build -name "*.map" -delete 2>/dev/null || true
echo "   ✅ Caches cleared"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fix Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Now try:"
echo "   1. Hard refresh your browser:"
echo "      - Windows/Linux: Ctrl + Shift + R"
echo "      - Mac: Cmd + Shift + R"
echo "   2. Or try incognito/private mode"
echo "   3. Or clear browser cache completely"
echo ""
echo "📝 To verify build date:"
echo "   ls -lh build/index.html"
echo ""

