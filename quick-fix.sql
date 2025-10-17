-- Quick Fix: Disable the problematic trigger completely
-- This will allow signups to work immediately

-- Drop the trigger that's causing the signup to fail
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- Drop the trigger function
DROP FUNCTION IF EXISTS trigger_initialize_user_skills();

-- Drop any existing problematic function
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(uuid);
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_id uuid);
DROP FUNCTION IF EXISTS initialize_user_skills_and_stats(user_uuid uuid);

-- This will allow signups to work immediately
-- User skills and stats can be initialized later when needed
