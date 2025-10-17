-- Fix the function to handle the email issue properly
-- The problem is that the function is trying to get email from auth.users
-- but the trigger fires during user creation, so the email might not be available yet

-- Step 1: Drop the existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS trigger_initialize_user_skills() CASCADE;

-- Step 2: Create a fixed function that handles the email properly
CREATE OR REPLACE FUNCTION initialize_user_skills_and_stats(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
    user_full_name text;
BEGIN
    -- Get user email and full name from auth.users
    SELECT email, COALESCE(raw_user_meta_data->>'full_name', 'User')
    INTO user_email, user_full_name
    FROM auth.users 
    WHERE id = user_uuid;
    
    -- If no user found, skip profile creation
    IF user_email IS NULL THEN
        RAISE NOTICE 'User % not found in auth.users, skipping profile creation', user_uuid;
        RETURN;
    END IF;
    
    -- Insert profile with proper email
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        level,
        current_xp,
        total_xp_earned,
        daily_streak,
        rank,
        xp_to_next_level,
        level_progress_percentage,
        is_premium,
        created_at,
        updated_at
    ) VALUES (
        user_uuid,
        user_email,
        user_full_name,
        'Free',
        1,
        0,
        0,
        0,
        'New Catalyst',
        1,
        0.00,
        false,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Profile created for user: % with email: %', user_uuid, user_email;
END;
$$;

-- Step 3: Create the trigger function
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

-- Step 5: Test the function
SELECT 'Function and trigger created successfully!' as status;
