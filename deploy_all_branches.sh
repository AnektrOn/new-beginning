#!/bin/bash

# Full Deployment Script for All Branches to Hostinger
# Run this from your local machine - it will SSH into the server and deploy everything

set -e

SSH_HOST="u933166613@82.180.152.127"
SSH_PORT="65002"
BASE_DIR="~/domains/humancatalystbeacon.com/public_html"
REPO_URL="git@github.com:AnektrOn/new-beginning.git"

echo "🚀 Starting Full Deployment to Hostinger..."
echo "You will be prompted for your SSH password"
echo ""

# Function to run a command on the remote server
run_remote() {
    ssh -p $SSH_PORT $SSH_HOST "$1"
}

# Function to deploy a branch
deploy_branch() {
    local branch=$1
    local folder=$2
    local port=$3
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Deploying: $branch → $folder (port $port)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create deployment script for this branch
    local deploy_script="deploy_${folder}.sh"
    
    cat > /tmp/$deploy_script <<DEPLOYSCRIPT
#!/bin/bash
set -e
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
nvm use 18

cd $BASE_DIR

# Create folder if needed
if [ ! -d "$folder" ]; then
    mkdir -p "$folder"
fi

cd "$folder"

# Clone or update repository
if [ ! -d ".git" ]; then
    echo "📥 Cloning $branch..."
    git clone -b "$branch" $REPO_URL .
else
    echo "🔄 Updating $branch..."
    git fetch origin "$branch" || true
    git checkout "$branch" 2>/dev/null || git checkout -b "$branch" "origin/$branch" 2>/dev/null || git checkout -b "$branch" FETCH_HEAD 2>/dev/null || true
    git pull origin "$branch" 2>/dev/null || true
fi

# Clean install dependencies
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm install --legacy-peer-deps 2>&1 | tail -30

# Build project
echo "🔨 Building project..."
npm run build 2>&1 | tail -30

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
    export \$(grep -v '^#' server.env | xargs)
    pm2 start server.js --name "hcuniversity-$folder" || true
fi

echo "✅ $branch deployed successfully!"
DEPLOYSCRIPT

    # Copy script to server and execute
    scp -P $SSH_PORT /tmp/$deploy_script $SSH_HOST:/tmp/$deploy_script
    run_remote "chmod +x /tmp/$deploy_script && /tmp/$deploy_script && rm /tmp/$deploy_script"
    
    echo ""
}

# Deploy all branches
echo "Starting deployment process..."
echo ""

# 1. Main branch (app subdomain)
deploy_branch "main" "app" "3001"

# 2. Stellar Map
deploy_branch "stellar-map" "stellar-map" "3002"

# 3. Structure Design UI/UX
deploy_branch "Structure-design-UI-UX" "structure-design" "3003"

# 4. Courses Flow
deploy_branch "feature/courses-flow" "courses-flow" "3004"

# 5. Deployment Optimizations
deploy_branch "feature/deployment-readiness-optimizations" "deployment-optimizations" "3005"

# 6. Feature UX
deploy_branch "feature/ux-ui-improvements" "feature-ux" "3006"

# Show final status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All Deployments Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Checking PM2 Status..."
run_remote "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\" && pm2 status"
echo ""
echo "✅ Deployment Summary:"
echo "  • main → app (port 3001)"
echo "  • stellar-map → stellar-map (port 3002)"
echo "  • Structure-design-UI-UX → structure-design (port 3003)"
echo "  • feature/courses-flow → courses-flow (port 3004)"
echo "  • feature/deployment-readiness-optimizations → deployment-optimizations (port 3005)"
echo "  • feature/ux-ui-improvements → feature-ux (port 3006)"
echo ""
echo "📝 Next Steps:"
echo "  1. Configure web server to proxy subdomains to ports"
echo "  2. Update .env files with production keys"
echo "  3. Test each deployment"
echo ""

