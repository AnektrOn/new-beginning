#!/bin/bash
# Fix .htaccess conflict and update to latest version

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 Fixing .htaccess Conflict and Updating..."
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Save .htaccess
if [ -f ".htaccess" ]; then
    echo "💾 Saving .htaccess..."
    cp .htaccess .htaccess.backup
fi

# Remove .htaccess temporarily
rm -f .htaccess

# Update code
echo "📥 Updating code from GitHub..."
git checkout main
git pull origin main

# Restore .htaccess (or create new one if needed)
echo "📝 Restoring .htaccess..."
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

# Force rebuild
echo "🔨 Rebuilding..."
rm -rf build node_modules/.cache
npm install --legacy-peer-deps
npm run build

# Fix permissions
chmod -R 755 build
find build -type f -exec chmod 644 {} \;

# Restart server
echo "🚀 Restarting server..."
pm2 restart hcuniversity-app

echo ""
echo "✅ Update Complete!"
echo ""
echo "📅 Build date:"
ls -lh build/index.html

echo ""
echo "🌐 Now hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)"

