#!/bin/bash
# Auto-fix script for common errors

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 AUTO-FIXING ALL COMMON ISSUES..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Step 1: Fix permissions
echo "📋 Step 1: Fixing file permissions..."
chmod 755 ~/domains/humancatalystbeacon.com/public_html 2>/dev/null || true
chmod 755 ~/domains/humancatalystbeacon.com/public_html/app 2>/dev/null || true
if [ -d "build" ]; then
    chmod -R 755 build
    find build -type f -exec chmod 644 {} \;
fi
echo "✅ Permissions fixed"
echo ""

# Step 2: Check and fix .env file
echo "📋 Step 2: Checking .env file..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file missing! Creating template..."
    cat > .env << 'ENV'
REACT_APP_SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
REACT_APP_SITE_NAME=The Human Catalyst University
REACT_APP_SITE_URL=https://app.humancatalystbeacon.com
NODE_ENV=production
ENV
    echo "⚠️  IMPORTANT: Edit .env file and add your actual keys!"
else
    echo "✅ .env file exists"
fi
echo ""

# Step 3: Reinstall dependencies
echo "📋 Step 3: Reinstalling dependencies..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/react-scripts" ]; then
    echo "   Installing dependencies..."
    npm install --legacy-peer-deps
else
    echo "   Dependencies already installed, skipping..."
fi
echo ""

# Step 4: Rebuild
echo "📋 Step 4: Rebuilding application..."
npm run build
echo "✅ Build complete"
echo ""

# Step 5: Fix .htaccess
echo "📋 Step 5: Updating .htaccess..."
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
echo "✅ .htaccess updated"
echo ""

# Step 6: Create index.php if missing
if [ ! -f "index.php" ]; then
    echo "📋 Step 6: Creating index.php..."
    cat > index.php << 'PHP'
<?php
header('Location: build/index.html');
exit;
?>
PHP
    chmod 644 index.php
    echo "✅ index.php created"
    echo ""
fi

# Step 7: Restart PM2 server
echo "📋 Step 7: Restarting PM2 server..."
if [ -f "server.env" ]; then
    export $(grep -v '^#' server.env | xargs)
fi

if pm2 list | grep -q "hcuniversity-app"; then
    pm2 restart hcuniversity-app
    echo "✅ Server restarted"
else
    echo "⚠️  Server not running, starting now..."
    pm2 start server.js --name hcuniversity-app
    pm2 save
    echo "✅ Server started"
fi
echo ""

# Step 8: Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AUTO-FIX COMPLETE!"
echo ""
echo "📊 Current Status:"
pm2 status hcuniversity-app
echo ""
echo "🧪 Test your website:"
echo "   https://app.humancatalystbeacon.com"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. If .env had placeholders, edit it with your actual keys"
echo "   2. Clear your browser cache (Ctrl+Shift+Delete)"
echo "   3. Check browser console (F12) for any remaining errors"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

