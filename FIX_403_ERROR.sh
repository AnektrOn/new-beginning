#!/bin/bash
# Fix 403 Forbidden Error

echo "🔧 Fixing 403 Forbidden Error..."
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# 1. Check and fix file permissions
echo "1️⃣  Fixing file permissions..."
chmod 755 . 2>/dev/null || true
chmod 644 build/index.html 2>/dev/null || true
chmod -R 755 build 2>/dev/null || true

# Make sure build folder is readable
find build -type f -exec chmod 644 {} \; 2>/dev/null || true
find build -type d -exec chmod 755 {} \; 2>/dev/null || true

echo "   ✅ Permissions updated"

# 2. Check .htaccess - might need to adjust RewriteBase
echo ""
echo "2️⃣  Checking .htaccess configuration..."

# Check current .htaccess
if [ -f ".htaccess" ]; then
    echo "   Current .htaccess:"
    cat .htaccess
    echo ""
    
    # Create a simpler .htaccess that should work better
    echo "   Creating optimized .htaccess..."
    cat > .htaccess << 'HTACCESS'
# .htaccess for React App on Hostinger
RewriteEngine On

# If accessing from subdomain root, serve index.html
DirectoryIndex build/index.html

# Proxy API requests to Node.js server
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Serve static files from build folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map)$
RewriteRule ^(.*)$ build/$1 [L]

# Serve React app - all other requests go to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [L]
HTACCESS
    
    echo "   ✅ .htaccess updated"
else
    echo "   ❌ .htaccess missing - creating it..."
    # Create .htaccess if missing
    cat > .htaccess << 'HTACCESS'
RewriteEngine On
DirectoryIndex build/index.html
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map)$
RewriteRule ^(.*)$ build/$1 [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [L]
HTACCESS
fi

# 3. Check if we need an index file in the root
echo ""
echo "3️⃣  Checking directory structure..."
if [ ! -f "index.php" ] && [ ! -f "index.html" ]; then
    echo "   Creating index.php redirect (Hostinger requirement)..."
    cat > index.php << 'PHP'
<?php
// Redirect to build folder
header('Location: build/index.html');
exit;
?>
    chmod 644 index.php
    echo "   ✅ Created index.php"
fi

# 4. Verify build folder
echo ""
echo "4️⃣  Verifying build folder..."
if [ -f "build/index.html" ]; then
    echo "   ✅ build/index.html exists"
    ls -la build/ | head -3
else
    echo "   ❌ build/index.html missing!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fix Applied!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔄 Try accessing again:"
echo "   curl -I https://app.humancatalystbeacon.com"
echo ""
echo "💡 If still 403, check in Hostinger hPanel:"
echo "   - File Manager → Check if 'app' folder is in public_html"
echo "   - Make sure subdomain points to: public_html/app"
echo ""

