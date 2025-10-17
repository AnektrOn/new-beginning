# 🚀 Production Deployment Guide - Human Catalyst University

## 🎯 **Complete Deployment Process for Real Domain**

This guide covers everything you need to deploy your **FULLY WORKING** Stripe-integrated platform to production.

---

## 📋 **Pre-Deployment Checklist**

### ✅ **Current Local Setup (FULLY WORKING):**
- ✅ React app with Stripe integration
- ✅ Local API server with payment processing
- ✅ Supabase database with user profiles
- ✅ Automatic role updates after payment
- ✅ European pricing: Student €55/month, Teacher €150/month
- ✅ **Checkout sessions creating successfully**
- ✅ **Payment flow working end-to-end**
- ✅ **Stripe integration fully functional**

### 🎯 **What We're Deploying:**
- **Frontend:** React app to hosting service
- **Backend:** API server to cloud platform
- **Database:** Supabase (already production-ready)
- **Payments:** Stripe (switch to live keys)

---

## 🔧 **Key Fixes Applied (Working Locally):**

### **1. Environment Variables Fixed:**
- ✅ `.env` file with real Supabase credentials
- ✅ `.env.server` file with real Stripe keys
- ✅ Both files properly configured

### **2. Stripe Integration Fixed:**
- ✅ **Server returns both `sessionId` and `url`** from checkout session
- ✅ **Frontend uses the `url` returned by server** (not manual URL construction)
- ✅ **Proper checkout session URL format** used
- ✅ **API key properly included** in checkout sessions

### **3. URL Scheme Fixed:**
- ✅ **Success/Cancel URLs** properly formatted with `http://localhost:3000` fallback
- ✅ **No more "Invalid URL" errors**

### **4. Stripe.js Compatibility Fixed:**
- ✅ **Removed deprecated `redirectToCheckout()`** method
- ✅ **Using direct URL redirect** to Stripe checkout
- ✅ **Compatible with latest Stripe.js version**

---

## 🌐 **Step 1: Choose Your Hosting Platform**

### **Option A: Vercel (Recommended)**
- **Frontend:** Automatic deployment from GitHub
- **Backend:** Serverless functions (API routes)
- **Cost:** Free tier available
- **Setup:** Very easy

### **Option B: Netlify + Railway**
- **Frontend:** Netlify (free)
- **Backend:** Railway (paid, ~$5/month)
- **Setup:** Medium complexity

### **Option C: DigitalOcean/AWS**
- **Frontend:** Static hosting
- **Backend:** VPS/EC2 instance
- **Cost:** $10-20/month
- **Setup:** More complex

---

## 🔧 **Step 2: Prepare Your Code for Production**

### **2.1 Update Environment Variables**

Create production environment files:

**`.env.production` (for React app):**
```bash
# Production Supabase (same as development)
REACT_APP_SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmZ5Y2dycWZlZXNmbmhoY2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTEwOTQsImV4cCI6MjA3NDUyNzA5NH0.vRB4oPdeQ4bQBns1tOLEzoS6YWY-RjrK_t65y2D0hTM

# Production Stripe (LIVE keys - get from Stripe Dashboard)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51ABC123...  # Your LIVE publishable key

# Production Stripe Price IDs (create in live mode)
REACT_APP_STRIPE_STUDENT_MONTHLY_PRICE_ID=price_1ABC123...
REACT_APP_STRIPE_STUDENT_YEARLY_PRICE_ID=price_1ABC123...
REACT_APP_STRIPE_TEACHER_MONTHLY_PRICE_ID=price_1ABC123...
REACT_APP_STRIPE_TEACHER_YEARLY_PRICE_ID=price_1ABC123...

# Production URLs
REACT_APP_SITE_NAME=The Human Catalyst University
REACT_APP_SITE_URL=https://yourdomain.com
```

**`.env.production.server` (for API server):**
```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Production Stripe (LIVE keys)
STRIPE_SECRET_KEY=sk_live_51ABC123...  # Your LIVE secret key
STRIPE_WEBHOOK_SECRET=whsec_ABC123...  # Production webhook secret

# Supabase (same as development)
SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmZ5Y2dycWZlZXNmbmhoY2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTEwOTQsImV4cCI6MjA3NDUyNzA5NH0.vRB4oPdeQ4bQBns1tOLEzoS6YWY-RjrK_t65y2D0hTM
```

### **2.2 Update API Endpoints**

Update your `src/services/stripeService.js` to use production URLs:

```javascript
// Replace localhost URLs with your production domain
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://yourdomain.com' 
  : 'http://localhost:3001';

// Update all fetch calls to use API_BASE_URL
const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
  // ... rest of the code
});
```

### **2.3 Update Success/Cancel URLs**

Update `server.js` success and cancel URLs:

```javascript
success_url: `${req.headers.origin || 'https://yourdomain.com'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${req.headers.origin || 'https://yourdomain.com'}/pricing?payment=cancelled`,
```

---

## 🏗️ **Step 3: Deploy to Vercel (Recommended)**

### **3.1 Prepare for Vercel**

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ],
  "env": {
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "STRIPE_WEBHOOK_SECRET": "@stripe-webhook-secret",
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### **3.2 Deploy to Vercel**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add all environment variables from `.env.production.server`

---

## 💳 **Step 4: Set Up Production Stripe**

### **4.1 Switch to Live Mode**

1. **Go to [Stripe Dashboard](https://dashboard.stripe.com)**
2. **Toggle to "Live mode"** (top right)
3. **Get your live keys:**
   - Publishable key (starts with `pk_live_`)
   - Secret key (starts with `sk_live_`)

### **4.2 Create Production Products**

Create the same products in live mode:
- **Student Monthly:** €55/month
- **Student Yearly:** €528/year
- **Teacher Monthly:** €150/month
- **Teacher Yearly:** €1332/year

### **4.3 Set Up Production Webhooks**

1. **Go to Webhooks in Stripe Dashboard**
2. **Add endpoint:** `https://yourdomain.com/api/webhook`
3. **Select events:**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy webhook secret** to your environment variables

---

## 🗄️ **Step 5: Database Setup**

### **5.1 Supabase (Already Production-Ready)**

Your Supabase database is already production-ready. Just ensure:
- RLS policies are properly configured
- All tables exist and have correct permissions
- Test data is cleaned up (if needed)

### **5.2 Database Security**

Update RLS policies for production:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create production policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🔒 **Step 6: Security & Performance**

### **6.1 Security Headers**

Add to your `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **6.2 Environment Variables Security**

- Never commit `.env` files to git
- Use platform-specific secret management
- Rotate keys regularly
- Monitor for unauthorized access

---

## 🧪 **Step 7: Testing Production**

### **7.1 Pre-Launch Checklist**

- [ ] All environment variables set correctly
- [ ] Stripe live keys configured
- [ ] Webhooks working
- [ ] Database permissions correct
- [ ] SSL certificate active
- [ ] Domain DNS configured
- [ ] Payment flow tested with real card

### **7.2 Test Payment Flow**

1. **Use real payment method** (small amount)
2. **Verify webhook events** in Stripe Dashboard
3. **Check database updates** in Supabase
4. **Test customer portal** functionality
5. **Verify email notifications** (if implemented)

---

## 📊 **Step 8: Monitoring & Analytics**

### **8.1 Set Up Monitoring**

- **Stripe Dashboard:** Monitor payments and disputes
- **Supabase Dashboard:** Monitor database performance
- **Vercel Analytics:** Monitor app performance
- **Error tracking:** Consider Sentry or similar

### **8.2 Key Metrics to Track**

- Payment success rate
- User conversion rate
- Database query performance
- API response times
- Error rates

---

## 🚀 **Step 9: Go Live**

### **9.1 Final Steps**

1. **Update DNS** to point to your hosting platform
2. **Test everything** one final time
3. **Monitor closely** for the first 24 hours
4. **Have support ready** for any issues

### **9.2 Launch Checklist**

- [ ] Domain configured and SSL active
- [ ] All services running smoothly
- [ ] Payment processing working
- [ ] User registration working
- [ ] Database backups configured
- [ ] Support contact information available
- [ ] Terms of service and privacy policy updated

---

## 🆘 **Step 10: Troubleshooting**

### **Common Issues:**

**Payment Failures:**
- Check Stripe live keys
- Verify webhook endpoints
- Check database permissions

**Database Errors:**
- Verify Supabase connection
- Check RLS policies
- Monitor query performance

**API Errors:**
- Check environment variables
- Verify server logs
- Test endpoints individually

---

## 📞 **Support Resources**

- **Stripe Support:** [support.stripe.com](https://support.stripe.com)
- **Supabase Support:** [supabase.com/support](https://supabase.com/support)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

## 🎯 **Quick Deployment Commands**

```bash
# 1. Prepare environment
cp .env.production .env
cp .env.production.server .env.server

# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy
vercel --prod

# 4. Set environment variables in Vercel dashboard
# 5. Test payment flow
# 6. Go live!
```

---

## 🎉 **SUCCESS! Your Platform is Ready for Production**

**Your Stripe integration is fully working locally and ready for production deployment!**

**Key Working Features:**
- ✅ User authentication and profiles
- ✅ Stripe checkout sessions
- ✅ Payment processing
- ✅ Role updates after payment
- ✅ European pricing (€55/month Student, €150/month Teacher)
- ✅ Admin panel for user management
- ✅ Profile settings and preferences

**Last Updated:** October 3, 2024  
**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT
