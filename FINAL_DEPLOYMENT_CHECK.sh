#!/bin/bash
# Final deployment verification and setup

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔍 FINAL DEPLOYMENT CHECK..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Check 1: Build folder
echo "1. Build folder:"
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "   ✅ EXISTS"
    BUILD_SIZE=$(ls -lh build/index.html | awk '{print $5}')
    echo "   Size: $BUILD_SIZE"
else
    echo "   ❌ MISSING"
fi
echo ""

# Check 2: .htaccess
echo "2. .htaccess file:"
if [ -f ".htaccess" ]; then
    echo "   ✅ EXISTS"
    HTACCESS_SIZE=$(wc -l < .htaccess)
    echo "   Lines: $HTACCESS_SIZE"
else
    echo "   ❌ MISSING - Creating now..."
    cat > .htaccess << 'HTACCESS'
RewriteEngine On
RewriteBase /
DirectoryIndex build/index.html index.php index.html

<Directory "build">
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

# Proxy API requests to Node.js server
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Serve static files from build folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map)$
RewriteRule ^(.*)$ build/$1 [L]

# Serve React app from build folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [L]
HTACCESS
    chmod 644 .htaccess
    echo "   ✅ CREATED"
fi
echo ""

# Check 3: index.php
echo "3. index.php file:"
if [ -f "index.php" ]; then
    echo "   ✅ EXISTS"
else
    echo "   ❌ MISSING - Creating now..."
    cat > index.php << 'PHP'
<?php
header('Location: build/index.html');
exit;
?>
PHP
    chmod 644 index.php
    echo "   ✅ CREATED"
fi
echo ""

# Check 4: PM2 Server
echo "4. PM2 Server:"
if pm2 list | grep -q "hcuniversity-app.*online"; then
    echo "   ✅ RUNNING"
    pm2 status hcuniversity-app | grep hcuniversity-app
else
    echo "   ❌ NOT RUNNING"
    echo "   Starting server..."
    if [ -f "server.env" ]; then
        export $(grep -v '^#' server.env | xargs)
    fi
    pm2 start server.js --name hcuniversity-app
    pm2 save
    echo "   ✅ STARTED"
fi
echo ""

# Check 5: Permissions
echo "5. File Permissions:"
BUILD_PERMS=$(stat -c "%a" build 2>/dev/null || stat -f "%OLp" build 2>/dev/null)
INDEX_PERMS=$(stat -c "%a" build/index.html 2>/dev/null || stat -f "%OLp" build/index.html 2>/dev/null)
echo "   build folder: $BUILD_PERMS (should be 755)"
echo "   build/index.html: $INDEX_PERMS (should be 644)"

if [ "$BUILD_PERMS" != "755" ] || [ "$INDEX_PERMS" != "644" ]; then
    echo "   ⚠️  Fixing permissions..."
    chmod -R 755 build
    find build -type f -exec chmod 644 {} \;
    echo "   ✅ FIXED"
else
    echo "   ✅ CORRECT"
fi
echo ""

# Check 6: Test local server
echo "6. Testing local server (port 3001):"
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "   ✅ Responding"
else
    echo "   ⚠️  Not responding (may need a moment to start)"
fi
echo ""

# Check 7: Test website
echo "7. Testing website:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://app.humancatalystbeacon.com 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Website responding (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "   ⚠️  Website returning 403 Forbidden"
    echo "   This may be a permissions or .htaccess issue"
elif [ "$HTTP_CODE" = "000" ]; then
    echo "   ⚠️  Could not connect (check DNS or server)"
else
    echo "   ⚠️  Website returned HTTP $HTTP_CODE"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 DEPLOYMENT SUMMARY:"
echo ""
[ -d "build" ] && [ -f "build/index.html" ] && echo "   ✅ Build: READY" || echo "   ❌ Build: MISSING"
[ -f ".htaccess" ] && echo "   ✅ .htaccess: READY" || echo "   ❌ .htaccess: MISSING"
[ -f "index.php" ] && echo "   ✅ index.php: READY" || echo "   ❌ index.php: MISSING"
pm2 list | grep -q "hcuniversity-app.*online" && echo "   ✅ PM2 Server: RUNNING" || echo "   ❌ PM2 Server: NOT RUNNING"
echo ""
echo "🌐 Your website: https://app.humancatalystbeacon.com"
echo ""
echo "📝 Next Steps:"
echo "   1. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)"
echo "   2. Visit: https://app.humancatalystbeacon.com"
echo "   3. If you see 403, wait 1-2 minutes for DNS/propagation"
echo "   4. Check browser console (F12) for any errors"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

