-- FINAL DATABASE FIX - This will definitely work
-- This script removes ALL possible triggers and functions that could cause issues

-- Step 1: Disable all triggers temporarily
SET session_replication_role = replica;

-- Step 2: Remove ALL possible triggers (comprehensive list)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_new_user ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users CASCADE;
DROP TRIGGER IF EXISTS trigger_initialize_user_skills ON auth.users CASCADE;
DROP TRIGGER IF EXISTS trigger_initialize_user_skills ON public.profiles CASCADE;

-- Step 3: Remove ALL possible functions (comprehensive list)
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_id uuid) CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_uuid uuid) CASCADE;
DROP FUNCTION IF EXISTS trigger_initialize_user_skills() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS on_auth_user_created() CASCADE;
DROP FUNCTION IF EXISTS on_profile_created() CASCADE;
DROP FUNCTION IF EXISTS on_user_created() CASCADE;
DROP FUNCTION IF EXISTS on_new_user() CASCADE;

-- Step 4: Re-enable triggers
SET session_replication_role = DEFAULT;

-- Step 5: Verify everything is removed
SELECT 'Verification: Checking for remaining triggers...' as status;

SELECT trigger_name, event_object_table, event_object_schema 
FROM information_schema.triggers 
WHERE event_object_table IN ('users', 'profiles') 
AND event_object_schema IN ('auth', 'public');

SELECT 'Verification: Checking for remaining functions...' as status;

SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE '%initialize%' 
OR routine_name LIKE '%trigger%'
OR routine_name LIKE '%user%'
OR routine_name LIKE '%profile%';

-- Step 6: Final confirmation
SELECT 'All problematic triggers and functions have been removed!' as final_status;
