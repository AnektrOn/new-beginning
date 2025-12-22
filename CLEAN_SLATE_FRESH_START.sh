#!/bin/bash
# Complete clean slate - delete everything and start fresh

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

echo "🧹 COMPLETE CLEAN SLATE - DELETING EVERYTHING..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  WARNING: This will delete ALL files in the app folder!"
echo "   (We'll backup .env and server.env first)"
echo ""

cd ~/domains/humancatalystbeacon.com/public_html/app

# Step 1: Stop PM2 if running
echo "📋 Step 1: Stopping PM2 server..."
if pm2 list | grep -q "hcuniversity-app"; then
    pm2 stop hcuniversity-app
    pm2 delete hcuniversity-app
    echo "✅ PM2 stopped and deleted"
else
    echo "✅ PM2 not running"
fi
echo ""

# Step 2: Backup important files
echo "📋 Step 2: Backing up important files..."
BACKUP_DIR=~/app_backup_$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/.env"
    echo "✅ Backed up .env"
fi

if [ -f "server.env" ]; then
    cp server.env "$BACKUP_DIR/server.env"
    echo "✅ Backed up server.env"
fi

if [ -f ".htaccess" ]; then
    cp .htaccess "$BACKUP_DIR/.htaccess"
    echo "✅ Backed up .htaccess"
fi

echo ""
echo "📁 Backup location: $BACKUP_DIR"
echo ""

# Step 3: Delete everything
echo "📋 Step 3: Deleting all files..."
echo "   (This may take a minute)"
cd ~/domains/humancatalystbeacon.com/public_html

# Remove the entire app folder
if [ -d "app" ]; then
    rm -rf app
    echo "✅ Deleted app folder"
else
    echo "✅ App folder doesn't exist"
fi

# Step 4: Create fresh app folder
echo ""
echo "📋 Step 4: Creating fresh app folder..."
mkdir -p app
cd app
echo "✅ Fresh folder created"
echo ""

# Step 5: Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CLEAN SLATE COMPLETE!"
echo ""
echo "📁 Backup saved to: $BACKUP_DIR"
echo "   (Contains: .env, server.env, .htaccess if they existed)"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Clone your repository:"
echo "   cd ~/domains/humancatalystbeacon.com/public_html/app"
echo "   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ."
echo ""
echo "2. Restore your environment files (if you had them):"
echo "   cp $BACKUP_DIR/.env .env"
echo "   cp $BACKUP_DIR/server.env server.env"
echo "   (Then edit them with your actual keys)"
echo ""
echo "3. Install and build:"
echo "   npm install --legacy-peer-deps"
echo "   npm run build"
echo ""
echo "4. Start server:"
echo "   export \$(grep -v '^#' server.env | xargs)"
echo "   pm2 start server.js --name hcuniversity-app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

