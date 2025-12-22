#!/bin/bash
# Comprehensive diagnostic script to find ALL errors

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔍 COMPREHENSIVE ERROR DIAGNOSTIC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# ============================================
# 1. CHECK ENVIRONMENT VARIABLES
# ============================================
echo "📋 Step 1: Checking Environment Variables..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo ""
    echo "Checking required variables:"
    
    MISSING_VARS=()
    
    if grep -q "REACT_APP_SUPABASE_URL" .env && ! grep -q "REACT_APP_SUPABASE_URL=YOUR" .env; then
        echo "  ✅ REACT_APP_SUPABASE_URL is set"
    else
        echo "  ❌ REACT_APP_SUPABASE_URL is missing or has placeholder"
        MISSING_VARS+=("REACT_APP_SUPABASE_URL")
    fi
    
    if grep -q "REACT_APP_SUPABASE_ANON_KEY" .env && ! grep -q "REACT_APP_SUPABASE_ANON_KEY=YOUR" .env; then
        echo "  ✅ REACT_APP_SUPABASE_ANON_KEY is set"
    else
        echo "  ❌ REACT_APP_SUPABASE_ANON_KEY is missing or has placeholder"
        MISSING_VARS+=("REACT_APP_SUPABASE_ANON_KEY")
    fi
    
    if grep -q "REACT_APP_STRIPE_PUBLISHABLE_KEY" .env && ! grep -q "REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR" .env; then
        echo "  ✅ REACT_APP_STRIPE_PUBLISHABLE_KEY is set"
    else
        echo "  ❌ REACT_APP_STRIPE_PUBLISHABLE_KEY is missing or has placeholder"
        MISSING_VARS+=("REACT_APP_STRIPE_PUBLISHABLE_KEY")
    fi
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo ""
        echo "⚠️  MISSING ENVIRONMENT VARIABLES:"
        for var in "${MISSING_VARS[@]}"; do
            echo "   - $var"
        done
    fi
else
    echo "❌ .env file is MISSING!"
fi

echo ""

# ============================================
# 2. CHECK SERVER ENVIRONMENT VARIABLES
# ============================================
echo "📋 Step 2: Checking Server Environment Variables..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "server.env" ]; then
    echo "✅ server.env file exists"
    echo ""
    echo "Checking required variables:"
    
    if grep -q "STRIPE_SECRET_KEY" server.env && ! grep -q "STRIPE_SECRET_KEY=sk_live_YOUR" server.env; then
        echo "  ✅ STRIPE_SECRET_KEY is set"
    else
        echo "  ❌ STRIPE_SECRET_KEY is missing or has placeholder"
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" server.env && ! grep -q "SUPABASE_SERVICE_ROLE_KEY=YOUR" server.env; then
        echo "  ✅ SUPABASE_SERVICE_ROLE_KEY is set"
    else
        echo "  ❌ SUPABASE_SERVICE_ROLE_KEY is missing or has placeholder"
    fi
else
    echo "❌ server.env file is MISSING!"
fi

echo ""

# ============================================
# 3. CHECK BUILD FOLDER
# ============================================
echo "📋 Step 3: Checking Build Folder..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "build" ]; then
    echo "✅ build folder exists"
    
    if [ -f "build/index.html" ]; then
        echo "✅ build/index.html exists"
        echo "   Size: $(ls -lh build/index.html | awk '{print $5}')"
        echo "   Modified: $(ls -l build/index.html | awk '{print $6, $7, $8}')"
    else
        echo "❌ build/index.html is MISSING!"
    fi
    
    if [ -d "build/static" ]; then
        echo "✅ build/static folder exists"
        JS_COUNT=$(find build/static/js -name "*.js" 2>/dev/null | wc -l)
        CSS_COUNT=$(find build/static/css -name "*.css" 2>/dev/null | wc -l)
        echo "   JavaScript files: $JS_COUNT"
        echo "   CSS files: $CSS_COUNT"
    else
        echo "❌ build/static folder is MISSING!"
    fi
else
    echo "❌ build folder is MISSING!"
    echo "   This means the website was never built!"
fi

echo ""

# ============================================
# 4. CHECK PM2 SERVER STATUS
# ============================================
echo "📋 Step 4: Checking PM2 Server Status..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if pm2 list | grep -q "hcuniversity-app"; then
    echo "✅ PM2 process 'hcuniversity-app' is running"
    pm2 status hcuniversity-app
    echo ""
    echo "📊 Recent PM2 Logs (last 20 lines):"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    pm2 logs hcuniversity-app --lines 20 --nostream 2>&1 | tail -20
else
    echo "❌ PM2 process 'hcuniversity-app' is NOT running!"
fi

echo ""

# ============================================
# 5. CHECK SERVER.JS FILE
# ============================================
echo "📋 Step 5: Checking server.js..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "server.js" ]; then
    echo "✅ server.js exists"
    
    # Check if server can start (syntax check)
    if node -c server.js 2>/dev/null; then
        echo "✅ server.js has valid syntax"
    else
        echo "❌ server.js has SYNTAX ERRORS!"
        node -c server.js 2>&1 | head -10
    fi
else
    echo "❌ server.js is MISSING!"
fi

echo ""

# ============================================
# 6. CHECK NODE MODULES
# ============================================
echo "📋 Step 6: Checking Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "node_modules" ]; then
    echo "✅ node_modules folder exists"
    
    # Check critical dependencies
    CRITICAL_DEPS=("react" "react-dom" "react-scripts" "@supabase/supabase-js" "express" "stripe")
    MISSING_DEPS=()
    
    for dep in "${CRITICAL_DEPS[@]}"; do
        if [ -d "node_modules/$dep" ] || [ -f "node_modules/$dep" ]; then
            echo "  ✅ $dep installed"
        else
            echo "  ❌ $dep is MISSING!"
            MISSING_DEPS+=("$dep")
        fi
    done
    
    if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
        echo ""
        echo "⚠️  MISSING DEPENDENCIES DETECTED!"
        echo "   Run: npm install --legacy-peer-deps"
    fi
else
    echo "❌ node_modules folder is MISSING!"
    echo "   Run: npm install --legacy-peer-deps"
fi

echo ""

# ============================================
# 7. CHECK BUILD ERRORS IN CONSOLE
# ============================================
echo "📋 Step 7: Checking for Build Errors..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "build/index.html" ]; then
    # Check if index.html contains error messages
    if grep -qi "error" build/index.html 2>/dev/null; then
        echo "⚠️  Found 'error' text in build/index.html"
        grep -i "error" build/index.html | head -5
    else
        echo "✅ No obvious error messages in build/index.html"
    fi
    
    # Check main JS bundle for common errors
    MAIN_JS=$(find build/static/js -name "main.*.js" 2>/dev/null | head -1)
    if [ -n "$MAIN_JS" ] && [ -f "$MAIN_JS" ]; then
        echo "✅ Main JS bundle found: $(basename $MAIN_JS)"
        
        # Check for common error patterns
        if grep -q "Cannot read property" "$MAIN_JS" 2>/dev/null; then
            echo "⚠️  Found 'Cannot read property' errors in JS bundle"
        fi
        if grep -q "is not defined" "$MAIN_JS" 2>/dev/null; then
            echo "⚠️  Found 'is not defined' errors in JS bundle"
        fi
    else
        echo "❌ Main JS bundle not found!"
    fi
fi

echo ""

# ============================================
# 8. TEST API CONNECTION
# ============================================
echo "📋 Step 8: Testing API Connection..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ API server is responding on port 3001"
elif curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "⚠️  API server responds but /api/health endpoint not found"
else
    echo "❌ API server is NOT responding on port 3001"
    echo "   Check if PM2 process is running"
fi

echo ""

# ============================================
# 9. CHECK FILE PERMISSIONS
# ============================================
echo "📋 Step 9: Checking File Permissions..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "build/index.html" ]; then
    PERMS=$(stat -c "%a" build/index.html 2>/dev/null || stat -f "%OLp" build/index.html 2>/dev/null)
    if [ "$PERMS" = "644" ] || [ "$PERMS" = "755" ]; then
        echo "✅ build/index.html has correct permissions: $PERMS"
    else
        echo "⚠️  build/index.html has unusual permissions: $PERMS"
        echo "   Should be 644 or 755"
    fi
fi

if [ -f ".htaccess" ]; then
    PERMS=$(stat -c "%a" .htaccess 2>/dev/null || stat -f "%OLp" .htaccess 2>/dev/null)
    if [ "$PERMS" = "644" ] || [ "$PERMS" = "755" ]; then
        echo "✅ .htaccess has correct permissions: $PERMS"
    else
        echo "⚠️  .htaccess has unusual permissions: $PERMS"
    fi
else
    echo "❌ .htaccess is MISSING!"
fi

echo ""

# ============================================
# 10. CHECK BROWSER CONSOLE ERRORS (via build)
# ============================================
echo "📋 Step 10: Analyzing Build for Common Error Patterns..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "build/static/js" ]; then
    ERROR_COUNT=0
    
    # Check all JS files for common error patterns
    for js_file in build/static/js/*.js; do
        if [ -f "$js_file" ]; then
            # Count potential issues
            UNDEFINED=$(grep -o "undefined" "$js_file" 2>/dev/null | wc -l)
            NULL=$(grep -o "null" "$js_file" 2>/dev/null | wc -l)
            
            if [ "$UNDEFINED" -gt 100 ] || [ "$NULL" -gt 100 ]; then
                echo "⚠️  $(basename $js_file) has many undefined/null references"
                ERROR_COUNT=$((ERROR_COUNT + 1))
            fi
        fi
    done
    
    if [ $ERROR_COUNT -eq 0 ]; then
        echo "✅ No obvious error patterns in JS bundles"
    fi
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 DIAGNOSTIC SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔍 Next Steps:"
echo ""
echo "1. If environment variables are missing:"
echo "   → Edit .env and server.env files with your actual keys"
echo ""
echo "2. If build folder is missing or outdated:"
echo "   → Run: npm run build"
echo ""
echo "3. If dependencies are missing:"
echo "   → Run: npm install --legacy-peer-deps"
echo ""
echo "4. If PM2 server is not running:"
echo "   → Run: export \$(grep -v '^#' server.env | xargs) && pm2 start server.js --name hcuniversity-app"
echo ""
echo "5. To see real-time errors in browser:"
echo "   → Open browser DevTools (F12) → Console tab"
echo "   → Look for red error messages"
echo ""
echo "6. To see server errors:"
echo "   → Run: pm2 logs hcuniversity-app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Diagnostic complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

