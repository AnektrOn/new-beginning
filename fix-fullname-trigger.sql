-- Fix the trigger function to handle full name properly
-- The issue might be that full_name is empty or null

-- Step 1: Create a function that handles full name properly
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
    SELECT 
        email, 
        COALESCE(
            NULLIF(raw_user_meta_data->>'full_name', ''), 
            NULLIF(raw_user_meta_data->>'fullName', ''), 
            'User'
        )
    INTO user_email, user_full_name
    FROM auth.users 
    WHERE id = user_uuid;
    
    -- If no user found, skip profile creation
    IF user_email IS NULL THEN
        RAISE NOTICE 'User % not found in auth.users, skipping profile creation', user_uuid;
        RETURN;
    END IF;
    
    -- Ensure full_name is not empty
    IF user_full_name IS NULL OR user_full_name = '' THEN
        user_full_name := 'User';
    END IF;
    
    -- Insert profile with proper email and full name
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
    
    RAISE NOTICE 'Profile created for user: % with email: % and name: %', user_uuid, user_email, user_full_name;
END;
$$;

-- Step 2: Create the trigger function
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

-- Step 3: Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_initialize_user_skills();

-- Step 4: Test the function
SELECT 'Trigger function fixed to handle full name properly!' as status;
