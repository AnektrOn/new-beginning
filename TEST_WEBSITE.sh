#!/bin/bash
# Test if the website is accessible

echo "🌐 Testing Website Accessibility..."
echo ""

# Test 1: Check if subdomain resolves
echo "1️⃣  Testing DNS resolution..."
if nslookup app.humancatalystbeacon.com > /dev/null 2>&1; then
    echo "   ✅ DNS is resolving"
    nslookup app.humancatalystbeacon.com | grep -A 2 "Name:"
else
    echo "   ⚠️  DNS might not be ready yet (wait 5-10 minutes)"
fi

echo ""

# Test 2: Check if files are accessible via web server
echo "2️⃣  Testing file accessibility..."
cd ~/domains/humancatalystbeacon.com/public_html/app

# Check if Apache can read the files
if [ -r "build/index.html" ]; then
    echo "   ✅ Files are readable by web server"
else
    echo "   ⚠️  Check file permissions"
fi

echo ""

# Test 3: Check .htaccess
echo "3️⃣  Verifying .htaccess..."
if [ -f ".htaccess" ]; then
    echo "   ✅ .htaccess exists"
    # Check if mod_rewrite rules are present
    if grep -q "RewriteEngine On" .htaccess; then
        echo "   ✅ Rewrite rules configured"
    fi
else
    echo "   ❌ .htaccess missing!"
fi

echo ""

# Test 4: Server status
echo "4️⃣  Server Status:"
pm2 status | grep hcuniversity-app

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Testing Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Try visiting: https://app.humancatalystbeacon.com"
echo ""
echo "💡 If it doesn't work:"
echo "   1. Wait 5-10 minutes for DNS to propagate"
echo "   2. Clear your browser cache"
echo "   3. Try in incognito/private mode"
echo "   4. Check: pm2 logs hcuniversity-app --lines 20"
echo ""

