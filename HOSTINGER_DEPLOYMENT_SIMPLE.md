# 🚀 Simple Guide: Put Your Website on Hostinger (For Beginners)

## 📖 What This Guide Does

This guide will help you put your website online so people can visit it. Think of it like moving your website from your computer to a computer that's always on the internet.

---

## 🎯 What You Need First

Before starting, make sure you have:

1. ✅ **A Hostinger account** - You need to buy hosting from Hostinger first
2. ✅ **A domain name** - Like `yourwebsite.com` (you can buy this from Hostinger too)
3. ✅ **Your code on GitHub** - ✅ You already have this!
4. ✅ **A computer** - To run some commands

---

## ⚠️ IMPORTANT: What Type of Hosting Do You Have?

Hostinger has different types of hosting. You need to know which one you have:

### ❌ **Shared Hosting** (Cheapest - $2-3/month)
- **Does NOT work** for your website
- Your website needs Node.js, and shared hosting doesn't support it
- **Skip this guide if you only have shared hosting**

### ✅ **VPS Hosting** (Recommended - $4-10/month)
- **This WILL work!**
- You get your own virtual computer
- You can install anything you need

### ✅ **Business/Cloud Hosting** (Also works - $3-5/month)
- **This WILL work!**
- Easier to set up than VPS
- Hostinger manages some things for you

**Don't know which one you have?** Check your Hostinger account or email them to ask.

---

## 📝 Step-by-Step Instructions

### STEP 1: Get Access to Your Server

**What you're doing:** Connecting to your Hostinger computer so you can give it commands.

**Your Server Information (from Hostinger):**
- **IP Address:** `82.180.152.127`
- **Port:** `65002` (special port - not the default!)
- **Username:** `u933166613`
- **Domain:** `humancatalystbeacon.com`

1. **Open Terminal on your computer:**
   - **Mac:** Press `Command + Space`, type "Terminal", press Enter
   - **Windows:** Press `Windows + R`, type "cmd", press Enter

2. **Connect to your server using this EXACT command:**
   ```bash
   ssh -p 65002 u933166613@82.180.152.127
   ```
   (Copy and paste this exactly - the `-p 65002` is important because your server uses a special port!)

3. **Enter your SSH password** when asked (you won't see it typing - that's normal!)
   - If you don't know your password, click "Change" in Hostinger to set a new one

**What to expect:** You'll see a prompt like `u933166613@your-server:~$` - that means you're connected!

---

### STEP 2: Install Node.js (The Language Your Website Uses)

**What you're doing:** Installing the software that runs your website.

**Copy and paste these commands one by one:**

```bash
# Update your server
apt update && apt upgrade -y
```

```bash
# Install Node.js (this is what runs your website)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```

```bash
# Check if it worked (should show a version number like v18.17.0)
node --version
```

**What to expect:** You should see `v18.17.0` or similar. If you see an error, copy the error message and ask for help.

---

### STEP 3: Install PM2 (Keeps Your Website Running)

**What you're doing:** Installing a tool that keeps your website running even if something goes wrong.

```bash
npm install -g pm2
```

**What to expect:** It will download and install. Wait for it to finish (might take 1-2 minutes).

---

### STEP 4: Get Your Website Code

**What you're doing:** Downloading your code from GitHub to your server.

```bash
# Go to a folder where websites are stored
cd /var/www
```

```bash
# Create a folder for your website
mkdir hcuniversity
cd hcuniversity
```

```bash
# Download your code from GitHub
git clone https://github.com/AnektrOn/new-beginning.git .
```

**What to expect:** Your code will download. This might take a few minutes.

---

### STEP 5: Set Up Your Website Settings

**What you're doing:** Telling your website where to find your database and payment system.

1. **Create a settings file:**
   ```bash
   nano .env
   ```

2. **A text editor will open.** Copy and paste this (then replace the placeholders):

   ```env
   REACT_APP_SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY_HERE
   
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
   REACT_APP_STRIPE_STUDENT_MONTHLY_PRICE_ID=price_YOUR_ID_HERE
   REACT_APP_STRIPE_STUDENT_YEARLY_PRICE_ID=price_YOUR_ID_HERE
   REACT_APP_STRIPE_TEACHER_MONTHLY_PRICE_ID=price_YOUR_ID_HERE
   REACT_APP_STRIPE_TEACHER_YEARLY_PRICE_ID=price_YOUR_ID_HERE
   
   REACT_APP_SITE_NAME=The Human Catalyst University
   REACT_APP_SITE_URL=https://yourdomain.com
   
   NODE_ENV=production
   ```

3. **To save and exit:**
   - Press `Ctrl + X`
   - Press `Y` (for yes)
   - Press `Enter`

4. **Create another settings file for the server:**
   ```bash
   nano server.env
   ```

5. **Copy and paste this (replace placeholders):**

   ```env
   PORT=3001
   NODE_ENV=production
   
   STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   
   SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY_HERE
   ```

6. **Save and exit:** `Ctrl + X`, then `Y`, then `Enter`

**Where to find these keys:**
- **Supabase keys:** Go to https://supabase.com/dashboard → Your Project → Settings → API
- **Stripe keys:** Go to https://dashboard.stripe.com → Developers → API keys (make sure you're in "Live mode" not "Test mode")

---

### STEP 6: Install Website Dependencies

**What you're doing:** Downloading all the code libraries your website needs.

```bash
cd /var/www/hcuniversity
npm install
```

**What to expect:** This will take 2-5 minutes. You'll see lots of text scrolling. Wait until it says "added X packages" or similar.

---

### STEP 7: Build Your Website

**What you're doing:** Converting your code into files that can be shown to visitors.

```bash
npm run build
```

**What to expect:** This takes 1-3 minutes. Wait until you see "Compiled successfully" or similar.

---

### STEP 8: Fix the Server File

**What you're doing:** Updating your server code to use your real website address instead of "localhost".

```bash
nano server.js
```

**Find these lines (around line 111-112):**
```javascript
success_url: `http://localhost:3000/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `http://localhost:3000/pricing?payment=cancelled`,
```

**Change them to:**
```javascript
success_url: `https://yourdomain.com/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `https://yourdomain.com/pricing?payment=cancelled`,
```

(Replace `yourdomain.com` with your actual domain name)

**Save and exit:** `Ctrl + X`, `Y`, `Enter`

---

### STEP 9: Start Your Website

**What you're doing:** Starting your website so it's running and people can visit it.

```bash
pm2 start server.js --name hcuniversity-api --env-file server.env
```

```bash
# Make sure it keeps running even if server restarts
pm2 startup
pm2 save
```

**What to expect:** You should see a table showing your website is "online". If you see "errored", there's a problem - check the next step.

**Check if it's working:**
```bash
pm2 logs hcuniversity-api
```

Press `Ctrl + C` to exit the logs view.

---

### STEP 10: Set Up Nginx (The Web Server)

**What you're doing:** Installing software that shows your website to visitors.

```bash
# Install Nginx
apt install -y nginx
```

```bash
# Start Nginx
systemctl start nginx
systemctl enable nginx
```

---

### STEP 11: Configure Nginx

**What you're doing:** Telling Nginx where your website files are and how to show them.

```bash
nano /etc/nginx/sites-available/hcuniversity
```

**Copy and paste this entire block** (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/hcuniversity/build;
    index index.html;

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

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Save and exit:** `Ctrl + X`, `Y`, `Enter`

**Enable the site:**
```bash
ln -s /etc/nginx/sites-available/hcuniversity /etc/nginx/sites-enabled/
```

**Test the configuration:**
```bash
nginx -t
```

**If it says "syntax is ok", reload:**
```bash
systemctl reload nginx
```

---

### STEP 12: Get SSL Certificate (Makes Your Site Secure)

**What you're doing:** Getting a security certificate so your website shows a padlock icon and uses "https://".

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

```bash
# Get SSL certificate (replace yourdomain.com with your domain)
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**What to expect:**
- It will ask for your email (enter it)
- It will ask you to agree to terms (type `A` and press Enter)
- It will ask if you want to redirect HTTP to HTTPS (type `2` for "Redirect" and press Enter)

**Done!** Your website should now work at `https://yourdomain.com`

---

### STEP 13: Update Stripe Webhooks

**What you're doing:** Telling Stripe where to send payment notifications.

1. **Go to:** https://dashboard.stripe.com → Developers → Webhooks
2. **Click "Add endpoint"**
3. **Enter:** `https://yourdomain.com/api/webhook`
4. **Select these events:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Click "Add endpoint"**
6. **Copy the "Signing secret"** (starts with `whsec_`)
7. **Go back to your server and update server.env:**
   ```bash
   nano server.env
   ```
   Update the `STRIPE_WEBHOOK_SECRET` line with the new secret
8. **Restart your website:**
   ```bash
   pm2 restart hcuniversity-api
   ```

---

## ✅ Test Your Website

1. **Open your browser**
2. **Go to:** `https://yourdomain.com`
3. **Try to:**
   - See the homepage
   - Create an account
   - Log in
   - (If payment is set up) Try the payment flow

---

## 🆘 Common Problems and Fixes

### Problem: "Command not found"
**Fix:** You might have typed the command wrong. Check for typos. Make sure you're connected to your server (you should see `root@your-server` in your terminal).

### Problem: "Permission denied"
**Fix:** Make sure you're logged in as `root` or use `sudo` before commands:
```bash
sudo npm install -g pm2
```

### Problem: Website shows "502 Bad Gateway"
**Fix:** Your server might not be running. Check:
```bash
pm2 status
```
If it's not running, start it:
```bash
pm2 start server.js --name hcuniversity-api --env-file server.env
```

### Problem: Website shows "404 Not Found"
**Fix:** Check if you built the website:
```bash
cd /var/www/hcuniversity
npm run build
```

### Problem: Can't connect via SSH
**Fix:** 
- Make sure you're using the correct IP address
- Make sure your password is correct
- Some Hostinger plans require you to enable SSH access in the control panel first

### Problem: "Port already in use"
**Fix:** Something else is using port 3001. Find and stop it:
```bash
lsof -i :3001
kill -9 [PID_NUMBER]
```
(Replace `[PID_NUMBER]` with the number you see)

---

## 📞 Need More Help?

If you get stuck:

1. **Copy the exact error message** you see
2. **Note which step you're on**
3. **Ask for help** - share the error message and step number

---

## 🎯 Quick Checklist

Before you start, make sure you have:
- [ ] Hostinger VPS or Business hosting (NOT shared hosting)
- [ ] Domain name
- [ ] Supabase keys (from Supabase dashboard)
- [ ] Stripe live keys (from Stripe dashboard - make sure you're in "Live mode")
- [ ] Your domain pointing to your Hostinger server IP

After deployment, test:
- [ ] Website loads at `https://yourdomain.com`
- [ ] Can create account
- [ ] Can log in
- [ ] Payment works (if set up)

---

## 🔄 How to Update Your Website Later

When you make changes and push to GitHub, update your website:

```bash
cd /var/www/hcuniversity
git pull
npm install
npm run build
pm2 restart hcuniversity-api
```

That's it! Your website is now updated.

---

**Good luck! Take it one step at a time. If you get stuck, just ask for help! 🚀**

