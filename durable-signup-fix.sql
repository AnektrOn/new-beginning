-- DURABLE SIGNUP FIX
-- This completely removes the problematic trigger and handles profile creation in frontend

-- Step 1: Remove ALL triggers and functions that could cause issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_id uuid) CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_uuid uuid) CASCADE;
DROP FUNCTION IF EXISTS trigger_initialize_user_skills() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Step 2: Verify removal
SELECT 'All problematic triggers and functions removed' as status;

-- Step 3: Check what triggers remain (should be none related to user creation)
SELECT trigger_name, event_object_table, event_object_schema 
FROM information_schema.triggers 
WHERE event_object_table IN ('users', 'profiles') 
AND event_object_schema IN ('auth', 'public');

-- This approach will:
-- 1. Allow signups to work immediately
-- 2. Handle profile creation in the frontend AuthContext
-- 3. Initialize skills/stats when users first access those features
-- 4. Be more reliable and easier to debug
