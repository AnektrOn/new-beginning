#!/bin/bash
# Force complete update of the website on Hostinger server

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔄 FORCE UPDATING WEBSITE TO LATEST VERSION..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Step 1: Save and remove .htaccess
echo "📝 Step 1: Handling .htaccess..."
if [ -f ".htaccess" ]; then
    cp .htaccess .htaccess.backup
    rm -f .htaccess
fi

# Step 2: Force reset to latest GitHub code
echo ""
echo "📥 Step 2: Fetching latest from GitHub..."
git fetch origin main
git reset --hard origin/main
git clean -fd

# Step 3: Restore .htaccess
echo ""
echo "📝 Step 3: Restoring .htaccess..."
if [ -f ".htaccess.backup" ]; then
    mv .htaccess.backup .htaccess
else
    # Create .htaccess if it doesn't exist
    cat > .htaccess << 'HTACCESS'
RewriteEngine On
DirectoryIndex build/index.html

# Proxy API requests to Node.js server
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Serve static files from build folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map)$
RewriteRule ^(.*)$ build/$1 [L]

# Serve React app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [L]
HTACCESS
fi

# Step 4: Clean everything
echo ""
echo "🧹 Step 4: Cleaning old build and cache..."
rm -rf build
rm -rf node_modules/.cache
rm -rf .cache

# Step 5: Fresh install
echo ""
echo "📦 Step 5: Installing dependencies..."
npm install --legacy-peer-deps

# Step 6: Build
echo ""
echo "🔨 Step 6: Building project..."
npm run build

# Step 7: Fix permissions
echo ""
echo "🔐 Step 7: Fixing permissions..."
chmod -R 755 build
find build -type f -exec chmod 644 {} \;
chmod 644 .htaccess

# Step 8: Restart server
echo ""
echo "🚀 Step 8: Restarting server..."
pm2 restart hcuniversity-app || pm2 start server.js --name hcuniversity-app

# Step 9: Verify
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ UPDATE COMPLETE!"
echo ""
echo "📅 Build timestamp:"
ls -lh build/index.html
echo ""
echo "📊 Git commit:"
git log -1 --oneline
echo ""
echo "🌐 Server status:"
pm2 status hcuniversity-app
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  IMPORTANT: Clear your browser cache!"
echo "   • Chrome/Edge: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)"
echo "   • Or hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

