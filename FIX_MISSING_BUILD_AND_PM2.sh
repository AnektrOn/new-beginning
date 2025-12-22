#!/bin/bash
# Fix missing build folder and PM2 server

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 FIXING MISSING BUILD AND PM2 SERVER..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Step 1: Verify we're in the right place
echo "📋 Step 1: Verifying location..."
pwd
echo "✅ In correct directory"
echo ""

# Step 2: Check .env file
echo "📋 Step 2: Checking .env file..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    # Check if it has placeholder values
    if grep -q "YOUR_SUPABASE_ANON_KEY_HERE" .env || grep -q "YOUR_KEY_HERE" .env; then
        echo "⚠️  WARNING: .env file contains placeholder values!"
        echo "   You may need to update it with your actual keys"
    else
        echo "✅ .env file looks configured"
    fi
else
    echo "❌ .env file missing! Creating template..."
    cat > .env << 'ENV'
REACT_APP_SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
REACT_APP_SITE_NAME=The Human Catalyst University
REACT_APP_SITE_URL=https://app.humancatalystbeacon.com
NODE_ENV=production
ENV
    echo "⚠️  Created .env template - UPDATE IT WITH YOUR ACTUAL KEYS!"
fi
echo ""

# Step 3: Install/update dependencies
echo "📋 Step 3: Ensuring dependencies are installed..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/react-scripts" ]; then
    echo "   Installing dependencies (this may take a few minutes)..."
    npm install --legacy-peer-deps
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Step 4: Build the application
echo "📋 Step 4: Building application (this may take 2-5 minutes)..."
echo "   This creates the 'build' folder with your website..."
npm run build

if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✅ Build successful!"
    echo "   Build folder size: $(du -sh build | awk '{print $1}')"
    echo "   index.html size: $(ls -lh build/index.html | awk '{print $5}')"
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi
echo ""

# Step 5: Fix build permissions
echo "📋 Step 5: Fixing build folder permissions..."
chmod -R 755 build
find build -type f -exec chmod 644 {} \;
echo "✅ Permissions fixed"
echo ""

# Step 6: Create/update .htaccess
echo "📋 Step 6: Creating .htaccess file..."
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
echo "✅ .htaccess created"
echo ""

# Step 7: Create index.php (Hostinger requirement)
echo "📋 Step 7: Creating index.php..."
cat > index.php << 'PHP'
<?php
header('Location: build/index.html');
exit;
?>
PHP
chmod 644 index.php
echo "✅ index.php created"
echo ""

# Step 8: Check server.env
echo "📋 Step 8: Checking server.env file..."
if [ -f "server.env" ]; then
    echo "✅ server.env exists"
    # Check for placeholders
    if grep -q "YOUR_ACTUAL" server.env || grep -q "YOUR_KEY" server.env; then
        echo "⚠️  WARNING: server.env contains placeholder values!"
        echo "   You may need to update it with your actual keys"
    fi
else
    echo "⚠️  server.env missing! Creating template..."
    cat > server.env << 'SERVERENV'
PORT=3001
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET
SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_ACTUAL_SERVICE_ROLE_KEY
SERVERENV
    echo "⚠️  Created server.env template - UPDATE IT WITH YOUR ACTUAL KEYS!"
fi
echo ""

# Step 9: Start PM2 server
echo "📋 Step 9: Starting PM2 server..."
if [ -f "server.env" ]; then
    # Load environment variables
    export $(grep -v '^#' server.env | xargs)
    echo "✅ Environment variables loaded"
else
    echo "⚠️  No server.env, using defaults"
    export PORT=3001
    export NODE_ENV=production
fi

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js is MISSING! Cannot start server."
    echo "   The backend API will not work, but the frontend should still load."
else
    # Check if PM2 process already exists
    if pm2 list | grep -q "hcuniversity-app"; then
        echo "   Restarting existing PM2 process..."
        pm2 restart hcuniversity-app
    else
        echo "   Starting new PM2 process..."
        pm2 start server.js --name hcuniversity-app
        pm2 save
    fi
    
    # Wait a moment for server to start
    sleep 2
    
    # Check if it's running
    if pm2 list | grep -q "hcuniversity-app.*online"; then
        echo "✅ PM2 server is running!"
        pm2 status hcuniversity-app
    else
        echo "⚠️  PM2 process started but may have errors"
        echo "   Check logs with: pm2 logs hcuniversity-app"
        pm2 status hcuniversity-app
    fi
fi
echo ""

# Step 10: Final verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ FIX COMPLETE!"
echo ""
echo "📊 Verification:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check build
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✅ Build folder: EXISTS"
else
    echo "❌ Build folder: MISSING"
fi

# Check PM2
if pm2 list | grep -q "hcuniversity-app.*online"; then
    echo "✅ PM2 server: RUNNING"
else
    echo "⚠️  PM2 server: NOT RUNNING (check logs)"
fi

# Check .htaccess
if [ -f ".htaccess" ]; then
    echo "✅ .htaccess: EXISTS"
else
    echo "❌ .htaccess: MISSING"
fi

echo ""
echo "🧪 Test your website:"
echo "   https://app.humancatalystbeacon.com"
echo ""
echo "📝 Next Steps:"
echo "   1. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)"
echo "   2. Visit: https://app.humancatalystbeacon.com"
echo "   3. If you see errors, press F12 → Console tab to see details"
echo ""
echo "⚠️  If .env or server.env had placeholders, update them with your actual keys!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

