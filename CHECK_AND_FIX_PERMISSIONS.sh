#!/bin/bash
# Check and fix permissions with verbose output

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔍 CHECKING AND FIXING PERMISSIONS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Check if build folder exists
if [ ! -d "build" ]; then
    echo "❌ Build folder doesn't exist!"
    echo ""
    echo "You need to build the application first:"
    echo "   npm run build"
    echo ""
    exit 1
fi

echo "✅ Build folder exists"
echo ""

# Show current permissions
echo "📋 Current permissions:"
ls -ld build
ls -l build/index.html 2>/dev/null || echo "   ⚠️  build/index.html not found"
echo ""

# Fix permissions with verbose output
echo "📋 Fixing permissions..."

# Fix directory permissions
echo "   Setting directory permissions to 755..."
chmod -R 755 build
echo "   ✅ Directories set to 755"

# Fix file permissions
echo "   Setting file permissions to 644..."
find build -type f -exec chmod 644 {} \;
FILE_COUNT=$(find build -type f | wc -l)
echo "   ✅ $FILE_COUNT files set to 644"

# Fix .htaccess if it exists
if [ -f ".htaccess" ]; then
    chmod 644 .htaccess
    echo "   ✅ .htaccess set to 644"
fi

# Fix index.php if it exists
if [ -f "index.php" ]; then
    chmod 644 index.php
    echo "   ✅ index.php set to 644"
fi

echo ""

# Verify permissions
echo "📋 Verifying permissions:"
ls -ld build
if [ -f "build/index.html" ]; then
    PERMS=$(stat -c "%a" build/index.html 2>/dev/null || stat -f "%OLp" build/index.html 2>/dev/null)
    echo "   build/index.html permissions: $PERMS (should be 644)"
    if [ "$PERMS" = "644" ]; then
        echo "   ✅ Correct permissions!"
    else
        echo "   ⚠️  Permissions may need adjustment"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PERMISSIONS FIXED!"
echo ""
echo "📊 Summary:"
echo "   • Directories: 755"
echo "   • Files: 644"
echo "   • Total files processed: $FILE_COUNT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

