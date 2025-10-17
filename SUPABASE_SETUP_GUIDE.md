# 🗄️ Supabase Database Setup Guide

## Step 1: Create .env File

Since `.env` is gitignored (for security), you need to create it manually:

1. Create a new file named `.env` in your project root
2. Copy and paste this content:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmZ5Y2dycWZlZXNmbmhoY2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTEwOTQsImV4cCI6MjA3NDUyNzA5NH0.vRB4oPdeQ4bQBns1tOLEzoS6YWY-RjrK_t65y2D0hTM

# Stripe Configuration (add later)
REACT_APP_STRIPE_PUBLIC_KEY=
REACT_APP_STRIPE_SECRET_KEY=

# App Configuration
REACT_APP_SITE_NAME=The Human Catalyst University
REACT_APP_SITE_URL=http://localhost:3000
```

3. Save the file
4. **Restart your development server** for changes to take effect

---

## Step 2: Database Migrations

### ✅ ALL MIGRATIONS COMPLETED!

**Status:** ✅ **COMPLETED** - All database migrations have been successfully applied!

The following tables are now in your database:
- ✅ schools (4 rows - Ignition, Insight, Transformation, God Mode)
- ✅ profiles (user profiles extending Supabase auth)
- ✅ constellation_families
- ✅ constellations  
- ✅ courses
- ✅ course_chapters
- ✅ lessons
- ✅ posts
- ✅ comments
- ✅ subscriptions
- ✅ analytics_events
- ✅ groups
- ✅ challenges
- ✅ quizzes
- ✅ xp_transactions
- ✅ user_roles
- ✅ And many more...

### ✅ What's Working:

- ✅ **All tables created** with proper relationships
- ✅ **Foreign key constraints** linking all tables
- ✅ **RLS policies** for security
- ✅ **Helper functions** for XP and progress tracking
- ✅ **Indexes** for performance
- ✅ **4 schools** with proper data

### 📁 Migration Files:

All completed migration files have been moved to `supabase/migrations/archive/` for reference.


---

## Step 3: Verify Database Setup

Run this query in SQL Editor to check everything:

```sql
-- Check all main tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'schools', 
  'constellation_families', 
  'constellations',
  'courses',
  'course_chapters',
  'lessons',
  'posts',
  'subscriptions'
)
ORDER BY table_name;
```

Expected result: **8 tables** listed

Check schools data:
```sql
SELECT * FROM schools ORDER BY order_index;
```

Expected result: **4 schools** (Ignition, Insight, Transformation, God Mode)

---

## Step 4: Set Up Your Admin Account

After migrations are complete, you need to make yourself an admin:

1. **Sign up for an account** on your app (once auth is built)
   OR create manually in Supabase:

```sql
-- First, check your user ID from auth
SELECT id, email FROM auth.users;

-- Then update your profile to admin role
UPDATE profiles 
SET role = 'Admin'
WHERE email = 'your-email@example.com';

-- Add you to user_roles as admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'your-email@example.com'
ON CONFLICT DO NOTHING;
```

---

## Step 5: Test Database Connection

Once your React app is running with the Supabase client, test the connection:

```javascript
// In browser console (after app loads):
import { supabase } from './lib/supabaseClient';

// Test query
const { data, error } = await supabase
  .from('schools')
  .select('*')
  .order('order_index');

console.log('Schools:', data);
// Should show: Ignition, Insight, Transformation, God Mode
```

---

## Troubleshooting

### Problem: "Missing environment variables" error

**Solution:** 
- Make sure you created the `.env` file in the project root
- Restart your development server (`npm start`)
- Check that variable names start with `REACT_APP_`

### Problem: "relation does not exist" error

**Solution:**
- Migrations weren't run yet
- Go to Supabase SQL Editor and run the migration files in order

### Problem: "permission denied" errors

**Solution:**
- RLS policies are blocking you
- Make sure you're authenticated
- Check that your user has the correct role
- For testing, you can temporarily disable RLS on a table (not recommended for production)

### Problem: Tables already exist

**Solution:**
- This is fine! The migrations use `CREATE TABLE IF NOT EXISTS`
- They won't overwrite existing data

---

## Next Steps

Once database is set up:

✅ Database schema created  
✅ RLS policies active  
✅ Helper functions ready  
✅ Supabase client configured  

**Now you can:**
1. Build authentication pages (Sign In/Sign Up)
2. Import your existing course data
3. Start building the UI components

---

## Important Security Notes

🔒 **NEVER commit the `.env` file to git**
- It's already in `.gitignore`
- Contains sensitive API keys

🔒 **Use environment variables for all secrets**
- Supabase keys
- Stripe keys
- Any API tokens

🔒 **RLS policies protect your data**
- Users can only access what they've unlocked
- Users can only modify their own data
- Admins have elevated permissions

---

**Questions? Issues?**

Check the Supabase logs:
1. Go to Supabase Dashboard
2. Click "Logs" → "Postgres Logs"
3. Look for errors

Good luck! 🚀

