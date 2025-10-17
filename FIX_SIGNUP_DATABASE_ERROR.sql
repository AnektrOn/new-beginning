-- =====================================================
-- FIX SIGNUP DATABASE ERROR - Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Remove ALL existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS trigger_initialize_user_skills() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Step 2: Create a simple function that just inserts a basic profile
CREATE OR REPLACE FUNCTION initialize_user_skills_and_stats(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert a basic profile record with minimal required fields
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        created_at,
        updated_at
    ) VALUES (
        user_uuid,
        (SELECT email FROM auth.users WHERE id = user_uuid),
        COALESCE((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = user_uuid), 'User'),
        'Free',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Log success
    RAISE NOTICE 'Profile created for user: %', user_uuid;
END;
$$;

-- Step 3: Create a simple trigger function
CREATE OR REPLACE FUNCTION trigger_initialize_user_skills()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Call the profile creation function
    PERFORM initialize_user_skills_and_stats(NEW.id);
    RETURN NEW;
END;
$$;

-- Step 4: Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_initialize_user_skills();

-- Step 5: Test the function (optional)
-- SELECT initialize_user_skills_and_stats('00000000-0000-0000-0000-000000000000');

-- =====================================================
-- ALTERNATIVE: If the above doesn't work, try this simpler approach
-- =====================================================

-- Option B: Disable all triggers and handle profile creation in frontend
-- Uncomment the lines below if Option A doesn't work:

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
-- DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid) CASCADE;
-- DROP FUNCTION IF EXISTS trigger_initialize_user_skills() CASCADE;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if function exists:
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'initialize_user_skills_and_stats';

-- Check if trigger exists:
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- Check profiles table structure:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';
