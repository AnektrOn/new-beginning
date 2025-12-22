#!/bin/bash
# Simple deployment - Just deploy the MAIN branch to the app subdomain
# Copy and paste this into your SSH session

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

BASE_DIR="$HOME/domains/humancatalystbeacon.com/public_html"
REPO_URL="git@github.com:AnektrOn/new-beginning.git"

echo "🚀 Deploying MAIN branch to app subdomain..."
echo ""

cd "$BASE_DIR/app"

# Update repository
echo "🔄 Updating code from GitHub..."
git fetch origin main
git checkout main
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm install --legacy-peer-deps

# Build project
echo "🔨 Building website..."
npm run build

# Setup server
if [ -f "server.js" ]; then
    echo "⚙️  Configuring server..."
    
    # Update server.env
    if [ -f "server.env" ]; then
        sed -i "s/^PORT=.*/PORT=3001/" server.env 2>/dev/null || echo "PORT=3001" >> server.env
    else
        echo "PORT=3001" > server.env
        echo "NODE_ENV=production" >> server.env
    fi
    
    # Restart server
    pm2 delete hcuniversity-main 2>/dev/null || true
    export $(grep -v '^#' server.env | xargs)
    pm2 start server.js --name hcuniversity-main
    
    echo "✅ Server running on port 3001"
fi

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your website should be at: app.humancatalystbeacon.com"
echo ""
pm2 status

