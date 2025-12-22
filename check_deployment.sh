#!/bin/bash
# Run this in your SSH session to check deployment status

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Deployment Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 PM2 Processes:"
pm2 status
echo ""

echo "📁 Folders Created:"
cd ~/domains/humancatalystbeacon.com/public_html
ls -la | grep -E "(app|stellar-map|structure-design|courses-flow|deployment-optimizations|feature-ux)"
echo ""

echo "🔨 Build Folders:"
for folder in app stellar-map structure-design courses-flow deployment-optimizations feature-ux; do
    if [ -d "$folder/build" ]; then
        echo "  ✅ $folder/build exists"
    else
        echo "  ❌ $folder/build missing"
    fi
done
echo ""

echo "🌐 Server Ports:"
pm2 list | grep hcuniversity | awk '{print $2, $8}' || echo "No servers found"
echo ""

echo "📝 Next Steps:"
echo "  1. Configure web server (Apache/Nginx) to proxy:"
echo "     - app.humancatalystbeacon.com → localhost:3001"
echo "     - stellar-map.humancatalystbeacon.com → localhost:3002"
echo "     - structure-design.humancatalystbeacon.com → localhost:3003"
echo "     - courses-flow.humancatalystbeacon.com → localhost:3004"
echo "     - deployment-optimizations.humancatalystbeacon.com → localhost:3005"
echo "     - feature-ux.humancatalystbeacon.com → localhost:3006"
echo ""
echo "  2. Update .env files with production keys"
echo "  3. Test each subdomain"

