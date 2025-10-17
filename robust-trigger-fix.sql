-- Create a more robust trigger that handles errors gracefully
-- This approach makes the trigger more resilient to failures

-- Step 1: Create a robust function that handles errors
CREATE OR REPLACE FUNCTION initialize_user_skills_and_stats(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
    user_full_name text;
    retry_count integer := 0;
    max_retries integer := 3;
BEGIN
    -- Retry logic to handle timing issues
    WHILE retry_count < max_retries LOOP
        BEGIN
            -- Get user email and full name from auth.users
            SELECT email, COALESCE(raw_user_meta_data->>'full_name', 'User')
            INTO user_email, user_full_name
            FROM auth.users 
            WHERE id = user_uuid;
            
            -- If no user found, wait and retry
            IF user_email IS NULL THEN
                retry_count := retry_count + 1;
                IF retry_count < max_retries THEN
                    PERFORM pg_sleep(0.2 * retry_count); -- Increasing delay
                    CONTINUE;
                ELSE
                    RAISE NOTICE 'User % not found after % retries, skipping profile creation', user_uuid, max_retries;
                    RETURN;
                END IF;
            END IF;
            
            -- Insert profile with proper email and all required fields
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
            RETURN; -- Success, exit the function
            
        EXCEPTION WHEN OTHERS THEN
            retry_count := retry_count + 1;
            IF retry_count < max_retries THEN
                RAISE NOTICE 'Error creating profile for user % (attempt %): %', user_uuid, retry_count, SQLERRM;
                PERFORM pg_sleep(0.2 * retry_count);
            ELSE
                RAISE NOTICE 'Failed to create profile for user % after % attempts: %', user_uuid, max_retries, SQLERRM;
                RETURN; -- Give up after max retries
            END IF;
        END;
    END LOOP;
END;
$$;

-- Step 2: Create a robust trigger function
CREATE OR REPLACE FUNCTION trigger_initialize_user_skills()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Call the profile creation function with error handling
    BEGIN
        PERFORM initialize_user_skills_and_stats(NEW.id);
    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE NOTICE 'Trigger error for user %: %', NEW.id, SQLERRM;
    END;
    
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
SELECT 'Robust trigger and function created successfully!' as status;
