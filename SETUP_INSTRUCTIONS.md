# 🚀 Human Catalyst University - Setup Instructions

## Step 1: Environment Variables

Create a `.env` file in the project root with these values:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://mbffycgrqfeesfnhhcdm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmZ5Y2dycWZlZXNmbmhoY2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTEwOTQsImV4cCI6MjA3NDUyNzA5NH0.vRB4oPdeQ4bQBns1tOLEzoS6YWY-RjrK_t65y2D0hTM

# Stripe Configuration (add when ready)
REACT_APP_STRIPE_PUBLIC_KEY=
REACT_APP_STRIPE_SECRET_KEY=

# App Configuration
REACT_APP_SITE_NAME=The Human Catalyst University
REACT_APP_SITE_URL=http://localhost:3000
```

**Note:** The `.env` file is gitignored for security. Never commit it to version control.

---

## Step 2: Install Dependencies

Run these commands in your terminal:

```bash
# Core dependencies
npm install @supabase/supabase-js

# React Router for navigation
npm install react-router-dom

# UI Components
npm install tailwindcss postcss autoprefixer
npm install -D tailwindcss-animate class-variance-authority clsx tailwind-merge

# shadcn/ui setup
npx shadcn@latest init

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install @tanstack/react-query

# Stripe (when ready for payments)
npm install @stripe/stripe-js @stripe/react-stripe-js

# Date handling
npm install date-fns

# Icons
npm install lucide-react
```

---

## Step 3: Run Supabase Migrations

The migration SQL files are in `/supabase/migrations/`. 

To apply them, you can either:

### Option A: Use Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref mbffycgrqfeesfnhhcdm

# Apply migrations
supabase db push
```

### Option B: Manual (Copy-paste into Supabase SQL Editor)
1. Go to https://supabase.com/dashboard/project/mbffycgrqfeesfnhhcdm
2. Navigate to SQL Editor
3. Copy the contents of each migration file and run them in order

---

## Step 4: Verify Database Setup

After running migrations, check:
1. All tables created ✅
2. RLS policies enabled ✅
3. Sample data imported ✅

---

## Step 5: Start Development Server

```bash
npm start
```

Visit: http://localhost:3000

---

## Next Steps After Setup

1. ✅ Database is ready
2. ✅ Environment configured
3. ✅ Dependencies installed
4. 🚀 Start building features!

---

## Troubleshooting

**Issue:** `supabase-js` errors
- Make sure you created the `.env` file
- Restart your development server after adding environment variables

**Issue:** Cannot connect to Supabase
- Check your internet connection
- Verify the Supabase URL and Anon Key are correct
- Check Supabase project status at dashboard

**Issue:** RLS blocking queries
- Make sure you're authenticated
- Check RLS policies in Supabase dashboard
- Use service role key for admin operations (never in frontend!)

---

**Ready? Let's build! 🚀**

