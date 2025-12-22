# How to Diagnose and Fix All Errors

## Step 1: Run the Diagnostic Script

**Connect to your server:**
```bash
ssh -p 65002 u933166613@82.180.152.127
```

**Copy and paste this entire command** (all at once):
```bash
cat > ~/DIAGNOSE_ALL_ERRORS.sh << 'SCRIPT'
#!/bin/bash
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
echo "🔍 COMPREHENSIVE ERROR DIAGNOSTIC"
cd ~/domains/humancatalystbeacon.com/public_html/app
echo "📋 Step 1: Checking Environment Variables..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
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
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo "⚠️  MISSING ENVIRONMENT VARIABLES:"
        for var in "${MISSING_VARS[@]}"; do
            echo "   - $var"
        done
    fi
else
    echo "❌ .env file is MISSING!"
fi
echo ""
echo "📋 Step 2: Checking Build Folder..."
if [ -d "build" ]; then
    echo "✅ build folder exists"
    if [ -f "build/index.html" ]; then
        echo "✅ build/index.html exists"
        echo "   Size: $(ls -lh build/index.html | awk '{print $5}')"
    else
        echo "❌ build/index.html is MISSING!"
    fi
else
    echo "❌ build folder is MISSING!"
fi
echo ""
echo "📋 Step 3: Checking PM2 Server..."
if pm2 list | grep -q "hcuniversity-app"; then
    echo "✅ PM2 process is running"
    echo ""
    echo "📊 Recent PM2 Logs (last 20 lines):"
    pm2 logs hcuniversity-app --lines 20 --nostream 2>&1 | tail -20
else
    echo "❌ PM2 process is NOT running!"
fi
echo ""
echo "📋 Step 4: Checking Dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    CRITICAL_DEPS=("react" "react-dom" "react-scripts" "@supabase/supabase-js")
    for dep in "${CRITICAL_DEPS[@]}"; do
        if [ -d "node_modules/$dep" ] || [ -f "node_modules/$dep" ]; then
            echo "  ✅ $dep installed"
        else
            echo "  ❌ $dep is MISSING!"
        fi
    done
else
    echo "❌ node_modules is MISSING!"
fi
echo ""
echo "✅ Diagnostic complete! Check the output above for ❌ errors."
SCRIPT
chmod +x ~/DIAGNOSE_ALL_ERRORS.sh
~/DIAGNOSE_ALL_ERRORS.sh
```

**This will show you:**
- ✅ What's working
- ❌ What's broken
- ⚠️ What needs attention

---

## Step 2: Common Error Types and Fixes

### Error Type 1: Missing Environment Variables
**Symptoms:** Website loads but shows blank page or "Missing Supabase" errors

**Fix:**
```bash
cd ~/domains/humancatalystbeacon.com/public_html/app
nano .env
```

Make sure these are set (NOT placeholders):
- `REACT_APP_SUPABASE_URL=your_actual_url`
- `REACT_APP_SUPABASE_ANON_KEY=your_actual_key`
- `REACT_APP_STRIPE_PUBLISHABLE_KEY=your_actual_key`

Then rebuild:
```bash
npm run build
pm2 restart hcuniversity-app
```

---

### Error Type 2: Build Folder Missing or Outdated
**Symptoms:** 403 error or old version of website

**Fix:**
```bash
cd ~/domains/humancatalystbeacon.com/public_html/app
npm install --legacy-peer-deps
npm run build
chmod -R 755 build
pm2 restart hcuniversity-app
```

---

### Error Type 3: Missing Dependencies
**Symptoms:** Build fails or "module not found" errors

**Fix:**
```bash
cd ~/domains/humancatalystbeacon.com/public_html/app
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

---

### Error Type 4: PM2 Server Not Running
**Symptoms:** API calls fail, backend not responding

**Fix:**
```bash
cd ~/domains/humancatalystbeacon.com/public_html/app
export $(grep -v '^#' server.env | xargs)
pm2 start server.js --name hcuniversity-app
pm2 save
```

---

### Error Type 5: Browser Console Errors
**To see these errors:**
1. Open your website: https://app.humancatalystbeacon.com
2. Press `F12` (or right-click → Inspect)
3. Click the **Console** tab
4. Look for red error messages

**Common browser errors:**
- `Cannot read property 'X' of undefined` → Missing data or API error
- `Failed to fetch` → Backend server not running or CORS issue
- `Module not found` → Build issue, need to rebuild
- `Supabase error` → Wrong Supabase keys or connection issue

---

## Step 3: Auto-Fix Script

If the diagnostic shows multiple issues, run this auto-fix:

```bash
cat > ~/AUTO_FIX_ALL.sh << 'FIX'
#!/bin/bash
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
cd ~/domains/humancatalystbeacon.com/public_html/app
echo "🔧 AUTO-FIXING ALL ISSUES..."
echo "1. Fixing permissions..."
chmod 755 ~/domains/humancatalystbeacon.com/public_html
chmod 755 ~/domains/humancatalystbeacon.com/public_html/app
chmod -R 755 build 2>/dev/null || true
find build -type f -exec chmod 644 {} \; 2>/dev/null || true
echo "2. Reinstalling dependencies..."
npm install --legacy-peer-deps
echo "3. Rebuilding..."
npm run build
echo "4. Fixing .htaccess..."
cat > .htaccess << 'HTACCESS'
RewriteEngine On
RewriteBase /
DirectoryIndex build/index.html index.php index.html
<Directory "build">
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
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
chmod 644 .htaccess
echo "5. Restarting server..."
export $(grep -v '^#' server.env | xargs)
pm2 restart hcuniversity-app || pm2 start server.js --name hcuniversity-app
echo "✅ AUTO-FIX COMPLETE!"
FIX
chmod +x ~/AUTO_FIX_ALL.sh
~/AUTO_FIX_ALL.sh
```

---

## Step 4: Share the Results

After running the diagnostic, please share:
1. **What the diagnostic script showed** (especially the ❌ errors)
2. **What errors you see in browser console** (F12 → Console tab)
3. **What the website shows** (blank page, error message, old version, etc.)

This will help me create a targeted fix for your specific issues!

