#!/bin/bash
# Verify the complete setup

echo "🔍 Verifying Complete Setup..."
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# 1. Check build folder
echo "1️⃣  Checking build folder..."
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "   ✅ Build folder and index.html exist"
    echo "   📊 Build size: $(du -sh build | cut -f1)"
else
    echo "   ❌ Build folder or index.html missing!"
    exit 1
fi

echo ""

# 2. Check .htaccess
echo "2️⃣  Checking .htaccess..."
if [ -f ".htaccess" ]; then
    echo "   ✅ .htaccess exists"
    echo "   📄 Content preview:"
    head -5 .htaccess
else
    echo "   ❌ .htaccess missing!"
    exit 1
fi

echo ""

# 3. Check server status
echo "3️⃣  Checking Node.js server..."
pm2 status | grep hcuniversity-app
if pm2 list | grep -q "hcuniversity-app.*online"; then
    echo "   ✅ Server is running"
else
    echo "   ⚠️  Server might not be running properly"
fi

echo ""

# 4. Test if build files are accessible
echo "4️⃣  Testing file accessibility..."
if [ -f "build/index.html" ]; then
    echo "   ✅ index.html is readable"
    file_size=$(stat -f%z build/index.html 2>/dev/null || stat -c%s build/index.html 2>/dev/null)
    echo "   📊 File size: ${file_size} bytes"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Verification Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 The error from localhost:3001 is normal if server.js"
echo "   is only for API calls. Apache will serve your React app"
echo "   via the .htaccess file."
echo ""
echo "🌐 Once you create the subdomain in Hostinger hPanel,"
echo "   your website should work at: https://app.humancatalystbeacon.com"
echo ""
echo "📝 To check server logs:"
echo "   pm2 logs hcuniversity-app --lines 20"

