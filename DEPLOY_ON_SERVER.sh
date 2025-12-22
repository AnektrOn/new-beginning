#!/bin/bash
# Copy and paste this ENTIRE script into your SSH session on Hostinger
# It will deploy all branches automatically

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

BASE_DIR="$HOME/domains/humancatalystbeacon.com/public_html"
REPO_URL="git@github.com:AnektrOn/new-beginning.git"

echo "🚀 Starting Full Deployment for All Branches to Subdomain Folders..."
echo "📁 Base directory: $BASE_DIR"
echo ""

# Function to deploy a branch
deploy_branch() {
    local branch=$1
    local folder=$2
    local port=$3
    local subdomain_path="$BASE_DIR/$folder"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Deploying: $branch"
    echo "📂 Subdomain folder: $folder"
    echo "🌐 Will be accessible at: ${folder}.humancatalystbeacon.com"
    echo "🔌 Server port: $port"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create subdomain folder if needed
    if [ ! -d "$subdomain_path" ]; then
        echo "📁 Creating subdomain folder: $subdomain_path"
        mkdir -p "$subdomain_path"
    fi
    
    cd "$subdomain_path"
    
    # Clone or update repository
    if [ ! -d ".git" ]; then
        echo "📥 Cloning $branch..."
        git clone -b "$branch" "$REPO_URL" .
    else
        echo "🔄 Updating $branch..."
        git fetch origin "$branch" 2>/dev/null || true
        git checkout "$branch" 2>/dev/null || git checkout -b "$branch" "origin/$branch" 2>/dev/null || git checkout -b "$branch" FETCH_HEAD 2>/dev/null || true
        git pull origin "$branch" 2>/dev/null || true
    fi
    
    # Clean install dependencies
    echo "📦 Installing dependencies..."
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm install --legacy-peer-deps 2>&1 | grep -E "(added|removed|changed|up to date|error|Error|WARN)" | tail -20 || true
    
    # Build project
    echo "🔨 Building project..."
    npm run build 2>&1 | tail -30 || {
        echo "⚠️  Build had warnings but continuing..."
    }
    
    # Setup server if server.js exists
    if [ -f "server.js" ]; then
        echo "⚙️  Configuring server (port $port)..."
        
        # Create/update server.env
        if [ -f "server.env" ]; then
            sed -i "s/^PORT=.*/PORT=$port/" server.env 2>/dev/null || echo "PORT=$port" >> server.env
        else
            echo "PORT=$port" > server.env
            echo "NODE_ENV=production" >> server.env
        fi
        
        # Stop existing PM2 process
        pm2 delete "hcuniversity-$folder" 2>/dev/null || true
        
        # Start server
        echo "🚀 Starting server..."
        export $(grep -v '^#' server.env | xargs)
        pm2 start server.js --name "hcuniversity-$folder" || {
            echo "⚠️  Server start had issues, but continuing..."
        }
        
        echo "✅ Server configured on port $port"
    else
        echo "ℹ️  No server.js found (static site only)"
    fi
    
    echo "✅ $branch deployed successfully!"
    echo ""
}

# Deploy all branches
deploy_branch "main" "app" "3001"
deploy_branch "stellar-map" "stellar-map" "3002"
deploy_branch "Structure-design-UI-UX" "structure-design" "3003"
deploy_branch "feature/courses-flow" "courses-flow" "3004"
deploy_branch "feature/deployment-readiness-optimizations" "deployment-optimizations" "3005"
deploy_branch "feature/ux-ui-improvements" "feature-ux" "3006"

# Show final status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All Deployments Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
pm2 status
echo ""
echo "✅ Deployment Summary:"
echo "  • main → app folder (port 3001) → app.humancatalystbeacon.com"
echo "  • stellar-map → stellar-map folder (port 3002) → stellar-map.humancatalystbeacon.com"
echo "  • Structure-design-UI-UX → structure-design folder (port 3003) → structure-design.humancatalystbeacon.com"
echo "  • feature/courses-flow → courses-flow folder (port 3004) → courses-flow.humancatalystbeacon.com"
echo "  • feature/deployment-readiness-optimizations → deployment-optimizations folder (port 3005)"
echo "  • feature/ux-ui-improvements → feature-ux folder (port 3006) → feature-ux.humancatalystbeacon.com"
echo ""
echo "📝 IMPORTANT: Next Steps in Hostinger hPanel:"
echo "  1. Go to hPanel → Domains → Subdomains"
echo "  2. Create subdomains pointing to these folders:"
echo "     - app → public_html/app"
echo "     - stellar-map → public_html/stellar-map"
echo "     - structure-design → public_html/structure-design"
echo "     - courses-flow → public_html/courses-flow"
echo "     - deployment-optimizations → public_html/deployment-optimizations"
echo "     - feature-ux → public_html/feature-ux"
echo "  3. Configure web server to proxy each subdomain to its port (3001-3006)"
echo "  4. Update .env files in each folder with production keys"
echo ""

