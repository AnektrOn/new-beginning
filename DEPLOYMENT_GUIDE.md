# Complete Deployment Guide

## Phase 1: ✅ COMPLETE
All code has been committed and pushed to GitHub main branch.

## Phase 2: Server Deployment

### Quick Start (Automated)

**On your Hostinger server, run:**

```bash
ssh -p 65002 u933166613@82.180.152.127
```

Then copy and paste this entire command:

```bash
cat > ~/COMPLETE_DEPLOYMENT.sh << 'SCRIPT'
#!/bin/bash
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
echo "🚀 COMPLETE FRESH DEPLOYMENT"
cd ~/domains/humancatalystbeacon.com/public_html/app
if pm2 list | grep -q "hcuniversity-app"; then
    pm2 stop hcuniversity-app && pm2 delete hcuniversity-app
fi
BACKUP_DIR=~/app_backup_$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"
[ -f ".env" ] && cp .env "$BACKUP_DIR/.env"
[ -f "server.env" ] && cp server.env "$BACKUP_DIR/server.env"
[ -f ".htaccess" ] && cp .htaccess "$BACKUP_DIR/.htaccess"
cd ~/domains/humancatalystbeacon.com/public_html
rm -rf app && mkdir -p app && cd app
git clone https://github.com/AnektrOn/new-beginning.git .
[ -f "$BACKUP_DIR/.env" ] && cp "$BACKUP_DIR/.env" .env
[ -f "$BACKUP_DIR/server.env" ] && cp "$BACKUP_DIR/server.env" server.env
npm install --legacy-peer-deps
npm run build
cat > .htaccess << 'HT'
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
HT
cat > index.php << 'PHP'
<?php
header('Location: build/index.html');
exit;
?>
PHP
chmod -R 755 build && find build -type f -exec chmod 644 {} \;
chmod 644 .htaccess index.php
export $(grep -v '^#' server.env | xargs)
pm2 start server.js --name hcuniversity-app && pm2 save
echo "✅ DEPLOYMENT COMPLETE!"
pm2 status
SCRIPT
chmod +x ~/COMPLETE_DEPLOYMENT.sh
~/COMPLETE_DEPLOYMENT.sh
```

### Manual Steps (If Needed)

If the automated script doesn't work, follow these steps:

1. **SSH into server:**
   ```bash
   ssh -p 65002 u933166613@82.180.152.127
   ```

2. **Stop PM2:**
   ```bash
   pm2 stop hcuniversity-app
   pm2 delete hcuniversity-app
   ```

3. **Backup environment files:**
   ```bash
   cd ~/domains/humancatalystbeacon.com/public_html/app
   mkdir -p ~/app_backup_$(date +%Y%m%d_%H%M%S)
   cp .env ~/app_backup_*/.env
   cp server.env ~/app_backup_*/server.env
   cp .htaccess ~/app_backup_*/.htaccess
   ```

4. **Clean and clone:**
   ```bash
   cd ~/domains/humancatalystbeacon.com/public_html
   rm -rf app
   mkdir -p app
   cd app
   git clone https://github.com/AnektrOn/new-beginning.git .
   ```

5. **Restore environment files:**
   ```bash
   cp ~/app_backup_*/.env .env
   cp ~/app_backup_*/server.env server.env
   ```

6. **Install and build:**
   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
   nvm use 18
   npm install --legacy-peer-deps
   npm run build
   ```

7. **Configure web server:**
   ```bash
   # Create .htaccess (see script above for content)
   # Create index.php (see script above for content)
   chmod -R 755 build
   find build -type f -exec chmod 644 {} \;
   ```

8. **Start server:**
   ```bash
   export $(grep -v '^#' server.env | xargs)
   pm2 start server.js --name hcuniversity-app
   pm2 save
   ```

## Phase 3: Post-Deployment Verification

### Browser Testing

1. **Visit your website:**
   - URL: `https://app.humancatalystbeacon.com`

2. **Clear browser cache:**
   - Windows: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`
   - Or hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

3. **Check browser console:**
   - Press `F12` (or right-click → Inspect)
   - Click "Console" tab
   - Look for **RED** error messages (yellow/orange warnings are OK)

### Functional Testing

- ✅ Test login/signup flow
- ✅ Test API endpoints (if any)
- ✅ Verify Supabase connection works
- ✅ Check PM2 stays running: `pm2 status`

### Monitor Logs

```bash
# Watch PM2 logs in real-time
pm2 logs hcuniversity-app

# Check last 50 lines
pm2 logs hcuniversity-app --lines 50

# Monitor server resources
pm2 monit
```

## Troubleshooting

### If website shows 403 Forbidden:
1. Check permissions: `ls -la build/index.html`
2. Verify `.htaccess` exists: `ls -la .htaccess`
3. Check PM2 is running: `pm2 status`
4. Run: `chmod -R 755 build && find build -type f -exec chmod 644 {} \;`

### If website shows old version:
1. Clear browser cache (hard refresh)
2. Check build timestamp: `ls -lh build/index.html`
3. Rebuild: `npm run build`
4. Restart PM2: `pm2 restart hcuniversity-app`

### If PM2 server crashes:
1. Check logs: `pm2 logs hcuniversity-app`
2. Verify environment variables: `cat server.env`
3. Test server manually: `node server.js` (then Ctrl+C to stop)
4. Restart: `pm2 restart hcuniversity-app`

## Important Notes

- ⚠️ **Environment files** (`.env`, `server.env`) contain secrets - never commit them to git
- ⚠️ **npm warnings** about `three` package are harmless - ignore them
- ✅ **PM2** will auto-restart if server crashes (if `pm2 save` was run)
- ✅ **Build folder** is generated - don't commit it to git

## Support

If deployment fails:
1. Check PM2 logs: `pm2 logs hcuniversity-app`
2. Check build output: `ls -la build/`
3. Verify environment files have actual keys (not placeholders)
4. Test local server: `curl http://localhost:3001`

