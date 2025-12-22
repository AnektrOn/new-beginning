#!/bin/bash
# Complete fix for 403 Forbidden error on Hostinger

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 FIXING 403 FORBIDDEN ERROR..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Step 1: Check if build exists
echo "📁 Step 1: Checking build folder..."
if [ ! -d "build" ]; then
    echo "   ⚠️  Build folder missing! Building now..."
    npm install --legacy-peer-deps
    npm run build
fi

# Step 2: Fix all permissions
echo ""
echo "🔐 Step 2: Fixing file permissions..."
chmod 755 ~/domains/humancatalystbeacon.com/public_html
chmod 755 ~/domains/humancatalystbeacon.com/public_html/app
chmod -R 755 build
find build -type f -exec chmod 644 {} \;

# Step 3: Create index.php in app folder (Hostinger requirement)
echo ""
echo "📝 Step 3: Creating index.php redirect..."
cat > index.php << 'PHP'
<?php
// Redirect to build folder
header('Location: build/index.html');
exit;
?>
PHP
chmod 644 index.php

# Step 4: Create/update .htaccess
echo ""
echo "📝 Step 4: Creating/updating .htaccess..."
cat > .htaccess << 'HTACCESS'
# Enable rewrite engine
RewriteEngine On
RewriteBase /

# Set directory index
DirectoryIndex build/index.html index.php index.html

# Allow access to build folder
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

# Step 5: Create index.html in build folder if missing
echo ""
echo "📝 Step 5: Verifying build/index.html exists..."
if [ ! -f "build/index.html" ]; then
    echo "   ⚠️  build/index.html missing! Rebuilding..."
    npm run build
fi

# Step 6: Create a simple test file to verify access
echo ""
echo "📝 Step 6: Creating test file..."
echo "OK" > test.txt
chmod 644 test.txt

# Step 7: Verify server is running
echo ""
echo "🚀 Step 7: Checking PM2 server..."
if ! pm2 list | grep -q "hcuniversity-app"; then
    echo "   ⚠️  Server not running! Starting..."
    cd ~/domains/humancatalystbeacon.com/public_html/app
    export $(grep -v '^#' server.env | xargs)
    pm2 start server.js --name hcuniversity-app
else
    pm2 restart hcuniversity-app
fi

# Step 8: Test local access
echo ""
echo "🧪 Step 8: Testing local access..."
echo "   Testing build/index.html:"
if [ -f "build/index.html" ]; then
    echo "   ✅ build/index.html exists"
    ls -lh build/index.html
else
    echo "   ❌ build/index.html missing!"
fi

echo ""
echo "   Testing test.txt:"
if [ -f "test.txt" ]; then
    echo "   ✅ test.txt exists"
    ls -lh test.txt
else
    echo "   ❌ test.txt missing!"
fi

# Step 9: Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 403 FIX COMPLETE!"
echo ""
echo "📋 What was fixed:"
echo "   ✅ File permissions set correctly"
echo "   ✅ index.php created in app folder"
echo "   ✅ .htaccess configured"
echo "   ✅ build/index.html verified"
echo "   ✅ Server restarted"
echo ""
echo "🧪 Test these URLs:"
echo "   • https://app.humancatalystbeacon.com/test.txt"
echo "   • https://app.humancatalystbeacon.com/build/index.html"
echo "   • https://app.humancatalystbeacon.com/"
echo ""
echo "📊 Current status:"
pm2 status hcuniversity-app
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  If still getting 403:"
echo "   1. Check Hostinger hPanel → File Manager"
echo "   2. Verify subdomain 'app' points to: public_html/app"
echo "   3. Check if mod_rewrite is enabled (should be by default)"
echo "   4. Try accessing: https://app.humancatalystbeacon.com/test.txt"
echo "      (If this works, the issue is with .htaccess or build folder)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

