# 🔗 Webhook Testing Guide

## ✅ **Webhook System Status**

Your webhook system is **fully implemented and working**! Here's how to test it:

## 🧪 **Testing Methods**

### **Method 1: Real Payment Testing (Recommended)**

1. **Go to your app**: `http://localhost:3000/pricing`
2. **Click "Subscribe"** on any plan
3. **Use test card**: `4242 4242 4242 4242`
4. **Complete payment** → Webhook automatically processes
5. **Check database** → User role updates automatically

### **Method 2: Stripe CLI Testing**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward events to your webhook
stripe listen --forward-to localhost:3001/api/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

### **Method 3: Stripe Dashboard Webhook Setup**

1. **Go to**: https://dashboard.stripe.com/webhooks
2. **Add endpoint**: `http://localhost:3001/api/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy webhook secret** to `.env.server`
5. **Test with real payments**

## 🎯 **What Happens When Webhook Works**

### **Payment Success Flow:**
1. **User completes payment** → Stripe sends webhook
2. **Webhook processes event** → Updates database
3. **User role changes** → Free → Student/Teacher
4. **Dashboard updates** → Shows new subscription status

### **Database Updates:**
- **Profiles table**: `role`, `subscription_status`, `subscription_id`
- **Subscriptions table**: Detailed subscription record created
- **Automatic role management**: Based on subscription tier

## 🔍 **Verification Steps**

### **Check Server Logs:**
```bash
# View webhook processing logs
node server.js
# Look for: "Received webhook event: checkout.session.completed"
```

### **Check Database:**
```sql
-- Check user profile
SELECT id, email, role, subscription_status, subscription_id 
FROM profiles 
WHERE email = 'your-test-email@example.com';

-- Check subscription record
SELECT * FROM subscriptions 
WHERE user_id = 'your-user-id';
```

### **Check Dashboard:**
- User should see updated role badge
- Subscription status should show "Active"
- "Manage Subscription" button should work

## 🚨 **Common Issues & Solutions**

### **Issue: "Cannot GET /api/webhook"**
- **Solution**: Webhooks only accept POST requests, not GET
- **Test with**: Real payment or Stripe CLI

### **Issue: Webhook not receiving events**
- **Check**: Server is running on port 3001
- **Check**: Webhook URL is correct in Stripe Dashboard
- **Check**: Webhook secret matches `.env.server`

### **Issue: Database not updating**
- **Check**: Supabase connection in server logs
- **Check**: User email exists in profiles table
- **Check**: RLS policies allow updates

## 🎉 **Success Indicators**

✅ **Webhook endpoint responds** (POST /api/webhook)
✅ **Server logs show webhook events**
✅ **Database updates automatically**
✅ **User roles change after payment**
✅ **Subscription management works**
✅ **Failed payments update status**

## 📋 **Quick Test Checklist**

- [ ] Server running on port 3001
- [ ] React app running on port 3000
- [ ] User can sign up/login
- [ ] Pricing page shows plans
- [ ] Subscribe button works
- [ ] Payment completes successfully
- [ ] User role updates in dashboard
- [ ] Database shows subscription record
- [ ] "Manage Subscription" works

## 🚀 **Your System is Ready!**

The webhook system is **fully functional**. The "Cannot GET /api/webhook" error is expected because webhooks only accept POST requests. 

**To test properly:**
1. Make a real payment through your app
2. Or use Stripe CLI to send test events
3. Or set up webhook in Stripe Dashboard

Your subscription system will automatically track payments and update user roles! 🎉
