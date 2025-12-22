# 🚀 Hostinger Deployment Guide - Human Catalyst University

## 📋 Overview

This guide will help you deploy your React + Node.js application to Hostinger. Hostinger offers VPS hosting which is perfect for Node.js applications.

---

## 🎯 Prerequisites

Before starting, ensure you have:
- ✅ Hostinger VPS account (or Business/Cloud hosting with Node.js support)
- ✅ Domain name configured in Hostinger
- ✅ SSH access to your Hostinger server
- ✅ Git repository access (GitHub)
- ✅ Production Stripe keys (live mode)
- ✅ Supabase credentials

---

## 📦 Step 1: Choose Your Hostinger Plan

### Option A: VPS Hosting (Recommended)
- **Best for:** Full control, Node.js support
- **Cost:** Starting from ~$4-10/month
- **Features:** Root access, custom server setup

### Option B: Business/Cloud Hosting
- **Best for:** Managed hosting with Node.js support
- **Cost:** Starting from ~$3-5/month
- **Features:** cPanel, easier setup

**Note:** Shared hosting typically doesn't support Node.js. You'll need VPS or Business/Cloud hosting.

---

## 🔧 Step 2: Prepare Your Server

### 2.1 Connect via SSH

```bash
ssh root@your-server-ip
# or
ssh username@your-domain.com
```

### 2.2 Update System

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential
```

### 2.3 Install Node.js (if not already installed)

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.4 Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Configure PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

### 2.5 Install Nginx (Web Server)

```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 📥 Step 3: Clone Your Repository

### 3.1 Create Application Directory

```bash
# Create directory for your app
sudo mkdir -p /var/www/hcuniversity
sudo chown -R $USER:$USER /var/www/hcuniversity
cd /var/www/hcuniversity
```

### 3.2 Clone from GitHub

```bash
# Clone your repository
git clone https://github.com/AnektrOn/new-beginning.git .

# Or if using a specific branch
git clone -b stellar-map https://github.com/AnektrOn/new-beginning.git .
```

---

## 🔐 Step 4: Configure Environment Variables

### 4.1 Create Production Environment File

```bash
# Create .env file for React app
nano .env
```

Add the following content:

```env
# Production Supabase
REACT_APP_SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Production Stripe (LIVE keys)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_STRIPE_STUDENT_MONTHLY_PRICE_ID=price_...
REACT_APP_STRIPE_STUDENT_YEARLY_PRICE_ID=price_...
REACT_APP_STRIPE_TEACHER_MONTHLY_PRICE_ID=price_...
REACT_APP_STRIPE_TEACHER_YEARLY_PRICE_ID=price_...

# Production URLs
REACT_APP_SITE_NAME=The Human Catalyst University
REACT_APP_SITE_URL=https://yourdomain.com

# Node environment
NODE_ENV=production
```

### 4.2 Create Server Environment File

```bash
# Create server.env file for Express server
nano server.env
```

Add the following content:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Production Stripe (LIVE keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** Replace all placeholder values with your actual production keys!

---

## 🏗️ Step 5: Build and Install Dependencies

### 5.1 Install Dependencies

```bash
cd /var/www/hcuniversity
npm install
```

### 5.2 Build React Application

```bash
# Build the React app for production
npm run build
```

This will create a `build/` directory with your production-ready React app.

---

## ⚙️ Step 6: Update Server Configuration

### 6.1 Update server.js for Production

You need to update the success/cancel URLs in `server.js`:

```bash
nano server.js
```

Find these lines (around line 111-112):
```javascript
success_url: `http://localhost:3000/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `http://localhost:3000/pricing?payment=cancelled`,
```

Replace with:
```javascript
success_url: `https://yourdomain.com/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `https://yourdomain.com/pricing?payment=cancelled`,
```

Also update the portal return URL (around line 202):
```javascript
return_url: `${req.headers.origin}/dashboard`,
```

This should automatically use your domain, but you can hardcode it if needed:
```javascript
return_url: `https://yourdomain.com/dashboard`,
```

### 6.2 Create Production Server Script

Create a file to serve both static files and API:

```bash
nano server-production.js
```

Add this content:

```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');

// Import your existing server routes
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// API routes (import from your existing server.js)
// For now, we'll keep server.js separate and run it via PM2
// But you can also merge the routes here

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Note: API routes should be handled by server.js running separately
// Or merge server.js routes into this file

module.exports = app;
```

**Alternative Approach:** Keep `server.js` as-is and run it separately. We'll configure Nginx to proxy API requests.

---

## 🚀 Step 7: Start Your Application with PM2

### 7.1 Start the Express Server

```bash
cd /var/www/hcuniversity

# Start server with PM2
pm2 start server.js --name hcuniversity-api --env-file server.env

# Or if you created server-production.js:
# pm2 start server-production.js --name hcuniversity-api --env-file server.env
```

### 7.2 Verify PM2 Status

```bash
pm2 status
pm2 logs hcuniversity-api
```

### 7.3 Save PM2 Configuration

```bash
# Save PM2 process list
pm2 save
```

---

## 🌐 Step 8: Configure Nginx

### 8.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/hcuniversity
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    # For now, serve on HTTP (remove redirect above)
    # After SSL setup, uncomment the redirect above

    # Serve React app static files
    root /var/www/hcuniversity/build;
    index index.html;

    # API proxy - forward API requests to Node.js server
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve React app for all other routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

**Important:** Replace `yourdomain.com` with your actual domain name!

### 8.2 Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/hcuniversity /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 9: Set Up SSL Certificate (Let's Encrypt)

### 9.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 Obtain SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

### 9.3 Auto-Renewal

Certbot automatically sets up auto-renewal. Test it:

```bash
sudo certbot renew --dry-run
```

---

## 🔄 Step 10: Update Stripe Webhooks

### 10.1 Update Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in `server.env`
6. Restart PM2: `pm2 restart hcuniversity-api`

---

## 🧪 Step 11: Test Your Deployment

### 11.1 Test Checklist

- [ ] Visit `https://yourdomain.com` - React app loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Test payment flow (use Stripe test card: 4242 4242 4242 4242)
- [ ] Verify webhook receives events
- [ ] Check API endpoints: `https://yourdomain.com/api/payment-success`
- [ ] Test customer portal access

### 11.2 Monitor Logs

```bash
# PM2 logs
pm2 logs hcuniversity-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔧 Step 12: Set Up Auto-Deployment (Optional)

### 12.1 Create Deployment Script

```bash
nano /var/www/hcuniversity/deploy.sh
```

Add:

```bash
#!/bin/bash
cd /var/www/hcuniversity
git pull origin stellar-map
npm install
npm run build
pm2 restart hcuniversity-api
echo "Deployment complete!"
```

Make it executable:

```bash
chmod +x deploy.sh
```

### 12.2 Manual Deployment

Whenever you push to GitHub:

```bash
cd /var/www/hcuniversity
./deploy.sh
```

---

## 🛠️ Troubleshooting

### Issue: Application not loading

```bash
# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs hcuniversity-api

# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: API endpoints not working

- Verify server is running: `pm2 list`
- Check server logs: `pm2 logs hcuniversity-api`
- Verify Nginx proxy configuration
- Check firewall: `sudo ufw status`

### Issue: Build fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use

```bash
# Find process using port 3001
sudo lsof -i :3001

# Kill the process
sudo kill -9 <PID>
```

---

## 📊 Monitoring & Maintenance

### PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs

# Restart application
pm2 restart hcuniversity-api

# Stop application
pm2 stop hcuniversity-api

# Delete application from PM2
pm2 delete hcuniversity-api

# Monitor resources
pm2 monit
```

### Update Application

```bash
cd /var/www/hcuniversity
git pull
npm install
npm run build
pm2 restart hcuniversity-api
```

---

## 🔐 Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Environment variables secured (not in git)
- [ ] Firewall configured (only ports 80, 443 open)
- [ ] SSH key authentication enabled
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] PM2 running as non-root user
- [ ] Database credentials secured
- [ ] Stripe keys are production (live) keys

---

## 📞 Support Resources

- **Hostinger Support:** https://www.hostinger.com/contact
- **PM2 Documentation:** https://pm2.keymetrics.io/docs/
- **Nginx Documentation:** https://nginx.org/en/docs/
- **Stripe Support:** https://support.stripe.com
- **Supabase Support:** https://supabase.com/support

---

## 🎯 Quick Reference Commands

```bash
# Deploy updates
cd /var/www/hcuniversity && git pull && npm install && npm run build && pm2 restart hcuniversity-api

# View logs
pm2 logs hcuniversity-api

# Restart server
pm2 restart hcuniversity-api

# Check status
pm2 status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

**Your application should now be live at `https://yourdomain.com`! 🚀**

**Last Updated:** December 2024  
**Status:** Ready for Hostinger Deployment

