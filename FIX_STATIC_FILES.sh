#!/bin/bash
# Fix .htaccess to properly serve static files

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔧 FIXING STATIC FILES CONFIGURATION..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Create proper .htaccess
echo "Creating .htaccess with correct static file handling..."
cat > .htaccess << 'HTACCESS'
RewriteEngine On
RewriteBase /

# Set proper MIME types
<IfModule mod_mime.c>
    AddType application/javascript js
    AddType text/css css
    AddType image/svg+xml svg
    AddType application/json json
    AddType font/woff woff
    AddType font/woff2 woff2
    AddType application/font-woff woff
    AddType application/font-woff2 woff2
</IfModule>

# Directory index
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

# Serve static files from build folder (MUST come before the catch-all)
# Check if file exists in build folder first
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} ^/static/
RewriteRule ^static/(.*)$ build/static/$1 [L]

# Serve other static assets from build folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map|webp)$
RewriteRule ^(.*)$ build/$1 [L]

# Serve React app - redirect all other requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [L]
HTACCESS

chmod 644 .htaccess
echo "✅ .htaccess updated"
echo ""

# Verify static files exist
echo "Verifying static files..."
if [ -f "build/static/js/main.b99ecb73.js" ]; then
    echo "✅ JavaScript file exists"
    ls -lh build/static/js/main.b99ecb73.js
else
    echo "⚠️  JavaScript file not found at expected path"
    echo "   Available JS files:"
    ls -lh build/static/js/*.js 2>/dev/null | head -3 || echo "   No JS files found"
fi

if [ -f "build/static/css/main.fae6e353.css" ]; then
    echo "✅ CSS file exists"
    ls -lh build/static/css/main.fae6e353.css
else
    echo "⚠️  CSS file not found at expected path"
    echo "   Available CSS files:"
    ls -lh build/static/css/*.css 2>/dev/null | head -3 || echo "   No CSS files found"
fi
echo ""

# Test file access
echo "Testing file access..."
if [ -f "build/static/js/main.b99ecb73.js" ]; then
    FILE_SIZE=$(wc -c < build/static/js/main.b99ecb73.js)
    echo "   JavaScript file size: $FILE_SIZE bytes"
    if [ "$FILE_SIZE" -gt 1000 ]; then
        echo "   ✅ File has content"
    else
        echo "   ⚠️  File seems too small"
    fi
fi
echo ""

# Restart PM2 (in case it helps)
echo "Restarting PM2 server..."
pm2 restart hcuniversity-app
echo "✅ PM2 restarted"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ FIX COMPLETE!"
echo ""
echo "📝 Next Steps:"
echo "   1. Clear your browser cache completely"
echo "   2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo "   3. Visit: https://app.humancatalystbeacon.com"
echo "   4. If still white page, check browser console (F12)"
echo ""
echo "🧪 Test static file directly:"
echo "   https://app.humancatalystbeacon.com/static/js/main.b99ecb73.js"
echo "   (Should show JavaScript code, not HTML)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

