# 🧪 Payment Testing Guide with Alerts

## What's New
Added browser alerts and detailed logging to help debug the payment success flow.

## Testing Steps

### 1. Make Sure Server is Running
```bash
# Terminal 1: Start the server
npm run server

# You should see:
# Server running on port 3001
```

### 2. Make Sure React App is Running
```bash
# Terminal 2: Start React app
npm start

# Opens browser at http://localhost:3000
```

### 3. Test Payment Flow

1. **Go to Pricing Page**
   - Navigate to: `http://localhost:3000/pricing`

2. **Select a Plan**
   - Click "Subscribe" on either Student or Teacher plan

3. **Complete Payment**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

4. **Watch for Alerts**
   - First alert: "🎉 Payment completed! Processing your subscription..."
   - Second alert: "✅ Subscription activated! Your role is now: Student" (or Teacher)

### 4. Check Server Logs

In your server terminal, you should see:
```
=== PAYMENT SUCCESS ENDPOINT CALLED ===
Session ID: cs_test_...
Stripe session retrieved: { id: '...', userId: '...', planType: 'student', ... }
Stripe subscription retrieved: { id: 'sub_...', priceId: 'price_...', status: 'active' }
Determined role: Student for price ID: price_1RutXI2MKT6Humxnh0WBkhCp
Profile updated successfully
=== PAYMENT SUCCESS COMPLETE ===
```

### 5. Check Database

Go to Supabase → Table Editor → profiles table:
- Find your user by email
- Check these columns:
  - `role` should be 'Student' or 'Teacher' ✅
  - `subscription_status` should be 'active' ✅
  - `subscription_id` should have a value starting with 'sub_' ✅
  - `stripe_customer_id` should have a value starting with 'cus_' ✅

### 6. Check Browser Console

Open DevTools (F12) → Console tab:
```
Payment success detected: { sessionId: 'cs_test_...', userId: '...' }
Payment success response: { success: true, role: 'Student' }
```

## What If It's Not Working?

### Alert 1 Shows But Not Alert 2
- **Problem**: Payment success endpoint is failing
- **Check**: Server logs for errors
- **Look for**: Supabase update errors or Stripe API errors

### No Alerts Show Up
- **Problem**: Not redirected to dashboard with payment params
- **Check**: URL after payment should be: `/dashboard?payment=success&session_id=cs_test_...`
- **Fix**: Check your Stripe checkout success URL configuration

### Role Not Updated in Database
- **Problem**: Either payment-success endpoint failed OR webhook handler failed
- **Check Both**:
  1. Server logs for `/api/payment-success` errors
  2. Server logs for webhook events (`checkout.session.completed`)

## Debugging Checklist

- [ ] Server is running on port 3001
- [ ] React app is running on port 3000
- [ ] Environment variables are set (.env and .env.server)
- [ ] Stripe webhook secret is configured (if using webhooks)
- [ ] User is logged in before payment
- [ ] Session metadata includes userId
- [ ] Price IDs match in code:
  - Student: `price_1RutXI2MKT6Humxnh0WBkhCp`
  - Teacher: `price_1SBPN62MKT6HumxnBoQgAdd0`

## Expected Behavior

✅ **Correct Flow:**
1. User completes payment on Stripe
2. Redirected to `/dashboard?payment=success&session_id=cs_test_...`
3. Alert shows: "Payment completed! Processing..."
4. `/api/payment-success` is called
5. Server logs show all steps
6. Database is updated
7. Alert shows: "Subscription activated! Your role is now: Student/Teacher"
8. Dashboard shows updated role badge

## Still Not Working?

Share these details:
1. Server logs (copy the relevant section)
2. Browser console errors
3. Database screenshot showing the user's profile row
4. Which alert(s) you see
5. The URL you're redirected to after payment

