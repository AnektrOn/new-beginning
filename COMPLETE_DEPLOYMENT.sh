#!/bin/bash
# Complete deployment script for fresh server setup
# Run this on your Hostinger server after Phase 1 is complete

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🚀 COMPLETE FRESH DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2.1: Clean Server
echo "📋 Step 2.1: Cleaning server..."
cd ~/domains/humancatalystbeacon.com/public_html/app

# Stop PM2
if pm2 list | grep -q "hcuniversity-app"; then
    echo "   Stopping PM2..."
    pm2 stop hcuniversity-app
    pm2 delete hcuniversity-app
    echo "   ✅ PM2 stopped"
else
    echo "   ✅ PM2 not running"
fi

# Backup environment files
BACKUP_DIR=~/app_backup_$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"
echo "   Backing up environment files..."

if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/.env"
    echo "   ✅ Backed up .env"
fi

if [ -f "server.env" ]; then
    cp server.env "$BACKUP_DIR/server.env"
    echo "   ✅ Backed up server.env"
fi

if [ -f ".htaccess" ]; then
    cp .htaccess "$BACKUP_DIR/.htaccess"
    echo "   ✅ Backed up .htaccess"
fi

echo "   📁 Backup location: $BACKUP_DIR"
echo ""

# Delete app folder
echo "   Deleting app folder..."
cd ~/domains/humancatalystbeacon.com/public_html
rm -rf app
mkdir -p app
cd app
echo "   ✅ Fresh folder created"
echo ""

# Step 2.2: Clone Fresh Repository
echo "📋 Step 2.2: Cloning repository..."
git clone https://github.com/AnektrOn/new-beginning.git .
echo "   ✅ Repository cloned"
git branch
echo ""

# Step 2.3: Restore Environment Files
echo "📋 Step 2.3: Restoring environment files..."
if [ -f "$BACKUP_DIR/.env" ]; then
    cp "$BACKUP_DIR/.env" .env
    echo "   ✅ Restored .env"
else
    echo "   ⚠️  No .env backup found - you'll need to create one"
fi

if [ -f "$BACKUP_DIR/server.env" ]; then
    cp "$BACKUP_DIR/server.env" server.env
    echo "   ✅ Restored server.env"
else
    echo "   ⚠️  No server.env backup found - you'll need to create one"
fi

if [ -f "$BACKUP_DIR/.htaccess" ]; then
    cp "$BACKUP_DIR/.htaccess" .htaccess
    echo "   ✅ Restored .htaccess"
fi

echo ""
echo "   ⚠️  IMPORTANT: Verify your .env and server.env files contain actual keys!"
echo "      (Not placeholders like 'YOUR_KEY_HERE')"
echo ""

# Step 2.4: Setup Node.js Environment
echo "📋 Step 2.4: Setting up Node.js..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
NODE_VERSION=$(node -v)
echo "   ✅ Node.js version: $NODE_VERSION"
echo ""

# Step 2.5: Install Dependencies
echo "📋 Step 2.5: Installing dependencies..."
echo "   (This takes 3-5 minutes, warnings about 'three' package are OK)"
npm install --legacy-peer-deps

if [ -d "node_modules/react" ]; then
    echo "   ✅ Dependencies installed"
else
    echo "   ❌ Installation failed!"
    exit 1
fi
echo ""

# Step 2.6: Build Application
echo "📋 Step 2.6: Building application..."
echo "   (This takes 2-5 minutes)"
npm run build

if [ -f "build/index.html" ]; then
    BUILD_SIZE=$(ls -lh build/index.html | awk '{print $5}')
    echo "   ✅ Build successful! Size: $BUILD_SIZE"
else
    echo "   ❌ Build failed!"
    exit 1
fi
echo ""

# Step 2.7: Configure Web Server
echo "📋 Step 2.7: Configuring web server..."

# Create .htaccess if it doesn't exist
if [ ! -f ".htaccess" ]; then
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
    echo "   ✅ Created .htaccess"
fi

# Create index.php
cat > index.php << 'PHP'
<?php
header('Location: build/index.html');
exit;
?>
PHP
chmod 644 index.php
echo "   ✅ Created index.php"

# Fix permissions
chmod -R 755 build
find build -type f -exec chmod 644 {} \;
chmod 644 .htaccess
echo "   ✅ Permissions fixed"
echo ""

# Step 2.8: Start Backend Server
echo "📋 Step 2.8: Starting backend server..."
if [ -f "server.env" ]; then
    export $(grep -v '^#' server.env | xargs)
    echo "   ✅ Environment variables loaded"
fi

pm2 start server.js --name hcuniversity-app
pm2 save
echo "   ✅ Server started"
pm2 status hcuniversity-app
echo ""

# Step 2.9: Verify Deployment
echo "📋 Step 2.9: Verifying deployment..."
echo "   Testing local server..."
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "   ✅ Local server responding"
else
    echo "   ⚠️  Local server not responding (may need a moment to start)"
fi

echo ""
echo "   Testing website..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://app.humancatalystbeacon.com 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Website responding (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "   ⚠️  Website returning 403 (may need to check permissions or .htaccess)"
else
    echo "   ⚠️  Website returned HTTP $HTTP_CODE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "📊 Summary:"
echo "   ✅ Repository cloned"
echo "   ✅ Dependencies installed"
echo "   ✅ Application built"
echo "   ✅ Web server configured"
echo "   ✅ Backend server started"
echo ""
echo "🌐 Your website: https://app.humancatalystbeacon.com"
echo ""
echo "📝 Next Steps:"
echo "   1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "   2. Visit: https://app.humancatalystbeacon.com"
echo "   3. Check browser console (F12) for any errors"
echo "   4. Monitor logs: pm2 logs hcuniversity-app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

