#!/bin/bash

# Full Deployment Script for All Branches
# Run this on your Hostinger server after SSH connection

set -e  # Exit on error

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

# Base directory
BASE_DIR="$HOME/domains/humancatalystbeacon.com/public_html"
REPO_URL="git@github.com:AnektrOn/new-beginning.git"

# Branch configuration: branch_name:folder_name:port
declare -A BRANCHES=(
    ["main"]="app:3001"
    ["stellar-map"]="stellar-map:3002"
    ["Structure-design-UI-UX"]="structure-design:3003"
    ["feature/courses-flow"]="courses-flow:3004"
    ["feature/deployment-readiness-optimizations"]="deployment-optimizations:3005"
    ["feature/ux-ui-improvements"]="feature-ux:3006"
)

echo "🚀 Starting Full Deployment for All Branches..."
echo ""

# Function to deploy a branch
deploy_branch() {
    local branch=$1
    local folder=$(echo $2 | cut -d: -f1)
    local port=$(echo $2 | cut -d: -f2)
    local folder_path="$BASE_DIR/$folder"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Deploying branch: $branch → $folder (port $port)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create folder if it doesn't exist
    if [ ! -d "$folder_path" ]; then
        echo "📁 Creating folder: $folder_path"
        mkdir -p "$folder_path"
    fi
    
    cd "$folder_path"
    
    # Clone or update repository
    if [ ! -d ".git" ]; then
        echo "📥 Cloning repository..."
        git clone -b "$branch" "$REPO_URL" .
    else
        echo "🔄 Updating repository..."
        git fetch origin "$branch"
        git checkout "$branch" 2>/dev/null || git checkout -b "$branch" "origin/$branch" || git checkout -b "$branch" "FETCH_HEAD"
        git pull origin "$branch" || true
    fi
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm install --legacy-peer-deps 2>&1 | grep -E "(added|removed|changed|up to date|error|Error)" || true
    
    # Build the project
    echo "🔨 Building project..."
    npm run build 2>&1 | tail -20 || {
        echo "❌ Build failed for $branch"
        return 1
    }
    
    # Update server.env with correct port if server.js exists
    if [ -f "server.js" ]; then
        echo "⚙️  Configuring server (port $port)..."
        if [ -f "server.env" ]; then
            # Update PORT in server.env
            sed -i "s/^PORT=.*/PORT=$port/" server.env 2>/dev/null || echo "PORT=$port" >> server.env
        else
            echo "PORT=$port" > server.env
            echo "NODE_ENV=production" >> server.env
        fi
        
        # Stop existing PM2 process if running
        pm2 delete "hcuniversity-$folder" 2>/dev/null || true
        
        # Start server with PM2
        echo "🚀 Starting server with PM2..."
        export $(grep -v '^#' server.env | xargs)
        pm2 start server.js --name "hcuniversity-$folder" || {
            echo "❌ Failed to start server for $branch"
            return 1
        }
        
        echo "✅ Server started on port $port"
    else
        echo "ℹ️  No server.js found (static site only)"
    fi
    
    echo "✅ Branch $branch deployed successfully!"
    echo ""
}

# Deploy main branch first (already exists, but we'll update it)
if [ -d "$BASE_DIR/app" ]; then
    echo "🔄 Updating main branch..."
    deploy_branch "main" "app:3001"
fi

# Deploy all other branches
for branch_config in "${!BRANCHES[@]}"; do
    if [ "$branch_config" != "main" ]; then
        deploy_branch "$branch_config" "${BRANCHES[$branch_config]}"
    fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 PM2 Status:"
pm2 status
echo ""
echo "📝 Next Steps:"
echo "1. Configure your web server (Apache/Nginx) to proxy requests"
echo "2. Set up subdomains pointing to each folder"
echo "3. Update .env files with production keys"
echo "4. Test each deployment"
echo ""

