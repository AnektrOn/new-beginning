# 🔧 Stripe Webhook Fix - Subscription Tier Updates

## Problem Fixed
When users successfully completed payments for Student or Teacher subscriptions, their role in the database was not being updated.

## Root Cause
The webhook handler was missing the `checkout.session.completed` event, which is the primary event that fires when a payment succeeds. The webhook was only handling:
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Solution Implemented

### Added Missing Webhook Event Handlers

1. **`checkout.session.completed`** - Fires when payment succeeds
   - Updates user role to Student or Teacher based on `planType` metadata
   - Updates subscription status to 'active'
   - Stores Stripe customer ID and subscription ID
   - Creates subscription record in database

2. **`customer.subscription.created`** - Fires when subscription is created
   - Updates user role based on price ID
   - Updates subscription status

3. **`customer.subscription.updated`** - Fires when subscription changes
   - Updates user role based on price ID
   - Updates subscription status

4. **`customer.subscription.deleted`** - Fires when subscription is cancelled
   - Downgrades user to 'Free' role
   - Sets subscription status to 'cancelled'

5. **`invoice.payment_succeeded`** - Fires on recurring payments
   - Updates subscription status to 'active'

6. **`invoice.payment_failed`** - Fires when payment fails
   - Updates subscription status to 'past_due'

### Role Assignment Logic

```javascript
// From checkout session metadata
if (planType === 'teacher' || planType === 'Teacher') {
  role = 'Teacher'
} else {
  role = 'Student' // default
}

// From price ID (for subscription events)
if (priceId === 'price_1SBPN62MKT6HumxnBoQgAdd0') {
  role = 'Teacher'
} else {
  role = 'Student' // default for student price
}
```

## Testing the Fix

### 1. Restart the Server
```bash
npm run server
```

### 2. Test with Stripe CLI (Recommended)
```bash
# Install Stripe CLI if you haven't
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhook events to local server
stripe listen --forward-to localhost:3001/api/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

### 3. Test with Real Payment
1. Go to your pricing page: `http://localhost:3000/pricing`
2. Click on Student or Teacher plan
3. Complete the payment with test card: `4242 4242 4242 4242`
4. Check the server logs - you should see:
   ```
   Handling checkout.session.completed for session: cs_test_...
   Subscription checkout completed: { userId: '...', planType: 'student', ... }
   Updating profile with role: Student
   Profile updated successfully
   ```
5. Check your database - the user's role should be updated to 'Student' or 'Teacher'

### 4. Verify Database Updates
In Supabase, check the `profiles` table:
- `role` should be 'Student' or 'Teacher' (not 'Free')
- `subscription_status` should be 'active'
- `subscription_id` should contain the Stripe subscription ID
- `stripe_customer_id` should contain the Stripe customer ID

## Webhook Events Flow

```
User Completes Payment
        ↓
checkout.session.completed (PRIMARY - updates role)
        ↓
customer.subscription.created (backup - also updates role)
        ↓
invoice.payment_succeeded (confirms payment)
        ↓
User role updated to Student/Teacher ✅
```

## Important Notes

1. **Metadata is Critical**: The checkout session must include `userId` and `planType` in metadata
2. **Price IDs**: Make sure your price IDs match:
   - Student: `price_1RutXI2MKT6Humxnh0WBkhCp`
   - Teacher: `price_1SBPN62MKT6HumxnBoQgAdd0`
3. **Webhook Secret**: Ensure `STRIPE_WEBHOOK_SECRET` is set in your `.env.server` file
4. **Logs**: Check server logs for debugging - all handlers now include console.log statements

## Files Modified
- `server.js` - Added complete webhook event handlers

## What Gets Updated in Database

| Event | role | subscription_status | subscription_id | stripe_customer_id |
|-------|------|--------------------|-----------------|--------------------|
| checkout.session.completed | Student/Teacher | active | ✓ | ✓ |
| customer.subscription.created | Student/Teacher | active | ✓ | - |
| customer.subscription.updated | Student/Teacher | active/past_due | - | - |
| customer.subscription.deleted | Free | cancelled | null | - |
| invoice.payment_succeeded | - | active | - | - |
| invoice.payment_failed | - | past_due | - | - |

## Success! 🎉
Your subscription tier changes should now work correctly when users complete payments!

