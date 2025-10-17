# 🔗 Stripe Webhook Setup Guide

## ✅ **What's Already Implemented:**

### **1. Webhook Endpoint**
- **URL**: `http://localhost:3001/api/webhook`
- **Method**: POST
- **Events Handled**:
  - `checkout.session.completed` - Payment completed
  - `customer.subscription.created` - New subscription
  - `customer.subscription.updated` - Subscription changes
  - `customer.subscription.deleted` - Subscription cancelled
  - `invoice.payment_succeeded` - Successful recurring payment
  - `invoice.payment_failed` - Failed payment

### **2. Database Updates**
- **Profiles Table**: Updates `role`, `subscription_status`, `subscription_id`, `subscription_tier`
- **Subscriptions Table**: Creates detailed subscription records
- **Automatic Role Changes**: Free → Student/Teacher → Free (on cancellation)

## 🚀 **Setup Instructions:**

### **Step 1: Stripe Dashboard Setup**

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL**: `http://localhost:3001/api/webhook` (for local testing)
4. **Select Events**:
   ```
   ✅ checkout.session.completed
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.payment_succeeded
   ✅ invoice.payment_failed
   ```
5. **Click "Add endpoint"**
6. **Copy the webhook secret** (starts with `whsec_`)

### **Step 2: Update Environment Variables**

Add to your `.env.server` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **Step 3: Test the Webhook**

#### **Option A: Using Stripe CLI (Recommended)**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward events to local webhook
stripe listen --forward-to localhost:3001/api/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

#### **Option B: Test with Real Payments**
1. Go to your app: `http://localhost:3000/pricing`
2. Click "Subscribe" on any plan
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Check server logs for webhook events

### **Step 4: Verify Database Updates**

After a successful payment, check your Supabase database:

**Profiles Table:**
```sql
SELECT id, email, role, subscription_status, subscription_id, subscription_tier 
FROM profiles 
WHERE email = 'your-test-email@example.com';
```

**Subscriptions Table:**
```sql
SELECT * FROM subscriptions 
WHERE user_id = 'your-user-id';
```

## 🧪 **Testing Checklist:**

### **✅ Payment Flow Test:**
1. **Sign up** with a new email
2. **Go to pricing** page
3. **Subscribe** to Student plan
4. **Complete payment** with test card
5. **Check dashboard** - should show "Student" role
6. **Check database** - profile and subscription records created

### **✅ Subscription Management Test:**
1. **Go to profile** page
2. **Click "Manage Subscription"**
3. **Cancel subscription** in Stripe portal
4. **Check database** - role should change to "Free"

### **✅ Failed Payment Test:**
1. **Use declined card**: `4000 0000 0000 0002`
2. **Check database** - subscription status should be "past_due"

## 📊 **Webhook Event Flow:**

```
User Payment → Stripe → Webhook → Database Update → User Role Change
     ↓              ↓         ↓           ↓              ↓
  Checkout    checkout.session  Update   Profile +    Dashboard
  Session     .completed       Supabase  Subscription   Updates
```

## 🔍 **Debugging:**

### **Check Server Logs:**
```bash
# View server logs
tail -f server.log

# Or check console output
node server.js
```

### **Common Issues:**

1. **Webhook not receiving events**:
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Ensure server is running on port 3001

2. **Database not updating**:
   - Check Supabase connection
   - Verify table permissions (RLS policies)
   - Check server logs for errors

3. **Role not changing**:
   - Verify webhook is processing events
   - Check if user email matches in database
   - Ensure price ID mapping is correct

## 🎯 **Production Deployment:**

### **For Production:**
1. **Update webhook URL** to your production domain
2. **Use live Stripe keys** (starts with `pk_live_` and `sk_live_`)
3. **Set up proper webhook secrets** in production environment
4. **Monitor webhook delivery** in Stripe Dashboard

### **Environment Variables for Production:**
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🎉 **Success Indicators:**

- ✅ Webhook endpoint responds with 200 status
- ✅ Database updates automatically after payment
- ✅ User roles change from Free → Student/Teacher
- ✅ Subscription management works via Stripe portal
- ✅ Failed payments update subscription status
- ✅ Cancelled subscriptions revert to Free tier

---

**Your webhook system is now ready for testing! 🚀**
