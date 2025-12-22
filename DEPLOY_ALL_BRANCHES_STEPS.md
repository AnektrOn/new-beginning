# Deploy All Branches - Step by Step Commands

Run these commands **one by one** in your SSH session on Hostinger.

## Setup (Run Once)

```bash
# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18

# Go to base directory
cd ~/domains/humancatalystbeacon.com/public_html
```

## 1. Main Branch (Already Done - Just Verify)

```bash
cd app
git checkout main
git pull origin main
npm run build
pm2 restart hcuniversity-main
cd ..
```

## 2. Stellar Map Branch (Already Done - Just Verify)

```bash
cd stellar-map
git checkout stellar-map
git pull origin stellar-map
npm run build
# Update server.env PORT to 3002
sed -i 's/^PORT=.*/PORT=3002/' server.env || echo "PORT=3002" >> server.env
export $(grep -v '^#' server.env | xargs)
pm2 restart hcuniversity-stellar-map
cd ..
```

## 3. Structure Design UI/UX Branch

```bash
# Create folder
mkdir -p structure-design
cd structure-design

# Clone branch
git clone -b Structure-design-UI-UX git@github.com:AnektrOn/new-beginning.git .
# OR if folder exists:
# git fetch origin Structure-design-UI-UX
# git checkout Structure-design-UI-UX || git checkout -b Structure-design-UI-UX FETCH_HEAD

# Install and build
npm install --legacy-peer-deps
npm run build

# Setup server (if server.js exists)
if [ -f server.js ]; then
    echo "PORT=3003" > server.env
    echo "NODE_ENV=production" >> server.env
    export $(grep -v '^#' server.env | xargs)
    pm2 start server.js --name hcuniversity-structure-design
fi

cd ..
```

## 4. Courses Flow Branch

```bash
mkdir -p courses-flow
cd courses-flow
git clone -b feature/courses-flow git@github.com:AnektrOn/new-beginning.git .
npm install --legacy-peer-deps
npm run build

if [ -f server.js ]; then
    echo "PORT=3004" > server.env
    echo "NODE_ENV=production" >> server.env
    export $(grep -v '^#' server.env | xargs)
    pm2 start server.js --name hcuniversity-courses-flow
fi

cd ..
```

## 5. Deployment Optimizations Branch

```bash
mkdir -p deployment-optimizations
cd deployment-optimizations
git clone -b feature/deployment-readiness-optimizations git@github.com:AnektrOn/new-beginning.git .
npm install --legacy-peer-deps
npm run build

if [ -f server.js ]; then
    echo "PORT=3005" > server.env
    echo "NODE_ENV=production" >> server.env
    export $(grep -v '^#' server.env | xargs)
    pm2 start server.js --name hcuniversity-deployment-optimizations
fi

cd ..
```

## 6. Feature UX Branch (Fix the Current Issue)

```bash
cd feature-ux

# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Build
npm run build

# Setup server
if [ -f server.js ]; then
    echo "PORT=3006" > server.env
    echo "NODE_ENV=production" >> server.env
    export $(grep -v '^#' server.env | xargs)
    pm2 start server.js --name hcuniversity-feature-ux
fi

cd ..
```

## Verify All Deployments

```bash
# Check PM2 status
pm2 status

# Check PM2 logs for any errors
pm2 logs --lines 50
```

## Port Summary

- **main** → `app` folder → Port **3001**
- **stellar-map** → `stellar-map` folder → Port **3002**
- **Structure-design-UI-UX** → `structure-design` folder → Port **3003**
- **feature/courses-flow** → `courses-flow` folder → Port **3004**
- **feature/deployment-readiness-optimizations** → `deployment-optimizations` folder → Port **3005**
- **feature/ux-ui-improvements** → `feature-ux` folder → Port **3006**

## Next Steps

1. **Configure Web Server**: Set up Apache/Nginx to proxy each subdomain to the correct port
2. **Update Environment Variables**: Add production Supabase and Stripe keys to `.env` and `server.env` files
3. **Test Each Deployment**: Visit each subdomain to verify it's working

