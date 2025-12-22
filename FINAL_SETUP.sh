#!/bin/bash
# Final setup - Configure web server to serve your React app
# Run this in your SSH session

echo "🌐 Final Setup - Making Website Visible..."
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Verify build exists
if [ ! -d "build" ]; then
    echo "❌ Build folder not found! Run the fix script first."
    exit 1
fi

echo "✅ Build folder exists"
ls -lh build/ | head -3
echo ""

# Create .htaccess file
echo "📝 Creating .htaccess file..."
cat > .htaccess << 'HTACCESS'
# .htaccess for React App on Hostinger
RewriteEngine On
RewriteBase /

# Proxy API requests to Node.js server (port 3001)
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Serve static files from build folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$
RewriteRule ^(.*)$ build/$1 [L]

# Serve React app - redirect all other requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [L]
HTACCESS

echo "✅ .htaccess file created"
echo ""

# Clean up errored servers
echo "🧹 Cleaning up errored servers..."
pm2 delete hcuniversity-courses-flow 2>/dev/null || true
pm2 delete hcuniversity-deployment-optimizations 2>/dev/null || true
pm2 delete hcuniversity-feature-ux 2>/dev/null || true

echo ""
echo "📊 Current Server Status:"
pm2 status

echo ""
echo "✅ Web Server Configuration Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 FINAL STEP - Configure Subdomain in Hostinger:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://hpanel.hostinger.com/"
echo "2. Navigate to: Domains → Subdomains"
echo "3. Click 'Create Subdomain'"
echo "4. Enter: app"
echo "5. Document Root: public_html/app"
echo "6. Click 'Create'"
echo ""
echo "⏱️  Wait 5-10 minutes for DNS to propagate"
echo ""
echo "🌐 Then visit: https://app.humancatalystbeacon.com"
echo ""
echo "💡 To check if it's working:"
echo "   pm2 logs hcuniversity-app --lines 20"

