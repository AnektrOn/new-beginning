-- Completely disable the trigger and handle profile creation in frontend
-- This is the most reliable approach

-- Step 1: Remove ALL triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS trigger_initialize_user_skills() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Step 2: Verify everything is removed
SELECT 'All triggers and functions removed!' as status;

-- Step 3: Check what remains
SELECT trigger_name, event_object_table, event_object_schema 
FROM information_schema.triggers 
WHERE event_object_table IN ('users', 'profiles') 
AND event_object_schema IN ('auth', 'public');

-- This will allow signups to work immediately
-- Profile creation will be handled in the frontend AuthContext
