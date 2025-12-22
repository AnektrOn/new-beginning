#!/bin/bash
# Check if website is actually working

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔍 CHECKING WEBSITE STATUS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Check 1: Build folder
echo "1. Build folder:"
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "   ✅ EXISTS"
    echo "   Size: $(du -sh build | awk '{print $1}')"
else
    echo "   ❌ MISSING - Website won't work!"
fi
echo ""

# Check 2: PM2 server
echo "2. PM2 Server:"
if pm2 list | grep -q "hcuniversity-app.*online"; then
    echo "   ✅ RUNNING"
    pm2 status hcuniversity-app | grep hcuniversity-app
else
    echo "   ❌ NOT RUNNING"
fi
echo ""

# Check 3: Test local server
echo "3. Testing local server (port 3001):"
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "   ✅ Responding"
else
    echo "   ❌ Not responding"
fi
echo ""

# Check 4: Test build/index.html
echo "4. Testing build/index.html:"
if [ -f "build/index.html" ]; then
    SIZE=$(wc -c < build/index.html)
    if [ "$SIZE" -gt 1000 ]; then
        echo "   ✅ File exists and has content ($SIZE bytes)"
    else
        echo "   ⚠️  File exists but seems too small ($SIZE bytes)"
    fi
else
    echo "   ❌ File missing"
fi
echo ""

# Check 5: .htaccess
echo "5. .htaccess file:"
if [ -f ".htaccess" ]; then
    echo "   ✅ EXISTS"
else
    echo "   ❌ MISSING"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY:"
echo ""

if [ -d "build" ] && [ -f "build/index.html" ] && pm2 list | grep -q "hcuniversity-app.*online"; then
    echo "✅ Website should be working!"
    echo ""
    echo "🌐 Visit: https://app.humancatalystbeacon.com"
    echo ""
    echo "💡 If you see errors in the browser:"
    echo "   1. Press F12 in your BROWSER (not terminal!)"
    echo "   2. Click the 'Console' tab"
    echo "   3. Look for RED error messages"
    echo "   4. Copy those RED errors and share them"
else
    echo "❌ Website has issues that need fixing:"
    [ ! -d "build" ] && echo "   - Build folder missing"
    [ ! -f "build/index.html" ] && echo "   - build/index.html missing"
    ! pm2 list | grep -q "hcuniversity-app.*online" && echo "   - PM2 server not running"
    echo ""
    echo "Run the fix script to resolve these issues."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

