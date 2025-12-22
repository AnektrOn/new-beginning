#!/bin/bash
# Run this AFTER FIX_DEPLOYMENT_ISSUES.sh finishes
# This sets up the web server to serve your React app

echo "🌐 Setting Up Web Server Configuration..."
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Check if build folder exists
if [ ! -d "build" ]; then
    echo "❌ Build folder not found!"
    echo "   You need to build the project first:"
    echo "   cd ~/domains/humancatalystbeacon.com/public_html/app"
    echo "   npm run build"
    exit 1
fi

echo "✅ Build folder exists"
ls -lh build/ | head -5
echo ""

# Create .htaccess file
echo "📝 Creating .htaccess file..."
cat > .htaccess << 'HTACCESS'
# .htaccess for React App on Hostinger
RewriteEngine On
RewriteBase /

# Proxy API requests to Node.js server
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Serve React app - redirect all requests to build folder
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ build/index.html [L]

# Serve static files from build folder
RewriteCond %{REQUEST_URI} \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$
RewriteRule ^(.*)$ build/$1 [L]
HTACCESS

echo "✅ .htaccess file created"
echo ""

# Check server status
echo "📊 Server Status:"
pm2 status | grep hcuniversity-app || echo "⚠️  Main server not running"

echo ""
echo "✅ Web server configuration complete!"
echo ""
echo "📝 Next Steps in Hostinger hPanel:"
echo "  1. Go to: hPanel → Domains → Subdomains"
echo "  2. Create subdomain: app"
echo "  3. Point to: public_html/app"
echo "  4. Save"
echo ""
echo "🌐 Then visit: https://app.humancatalystbeacon.com"
echo ""
echo "💡 If it still doesn't work:"
echo "  - Check if subdomain is created in hPanel"
echo "  - Wait 5-10 minutes for DNS to propagate"
echo "  - Check PM2 logs: pm2 logs hcuniversity-app"

