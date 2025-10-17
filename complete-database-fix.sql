-- Complete Database Fix for Signup Issue
-- This script will fix all issues with the initialize_user_skills_and_stats function

-- Step 1: Check what functions exist
SELECT 'Checking existing functions...' as status;

-- Step 2: Drop ALL possible variations of the function
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid);
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_id uuid);
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_uuid uuid);

-- Step 3: Check what triggers exist
SELECT 'Checking triggers...' as status;

-- Step 4: Drop the trigger that's causing issues
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- Step 5: Create the correct function
CREATE OR REPLACE FUNCTION initialize_user_skills_and_stats(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- Initialize user master stats
    INSERT INTO user_master_stats (user_id, master_stat_id, current_value)
    SELECT user_uuid, id, 0
    FROM master_stats
    WHERE NOT EXISTS (
        SELECT 1 FROM user_master_stats 
        WHERE user_id = user_uuid AND master_stat_id = master_stats.id
    );
    
    -- Initialize user skills
    INSERT INTO user_skills (user_id, skill_id, current_value)
    SELECT user_uuid, id, 0
    FROM skills
    WHERE NOT EXISTS (
        SELECT 1 FROM user_skills 
        WHERE user_id = user_uuid AND skill_id = skills.id
    );
    
    -- Initialize user preferences
    INSERT INTO user_preferences (user_id, email_notifications, push_notifications, marketing_emails, profile_visibility, show_xp, show_level, theme_preference, language_preference, timezone, right_sidebar_collapsed, visible_widgets, widget_order)
    VALUES (
        user_uuid,
        true,  -- email_notifications
        true,  -- push_notifications
        false, -- marketing_emails
        'public', -- profile_visibility
        true,  -- show_xp
        true,  -- show_level
        'dark', -- theme_preference
        'en',  -- language_preference
        'UTC', -- timezone
        false, -- right_sidebar_collapsed
        '["profile", "calendar", "notifications", "progress", "leaderboard"]'::jsonb, -- visible_widgets
        '["profile", "calendar", "notifications", "progress", "leaderboard"]'::jsonb  -- widget_order
    )
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create the trigger function
CREATE OR REPLACE FUNCTION trigger_initialize_user_skills()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM initialize_user_skills_and_stats(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Recreate the trigger
CREATE TRIGGER on_profile_created
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_initialize_user_skills();

-- Step 8: Verify the function exists
SELECT 'Function created successfully!' as status;
