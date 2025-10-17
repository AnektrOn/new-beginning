-- Temporary Fix: Disable the problematic trigger
-- This will allow signups to work while we fix the function issue

-- Drop the trigger that's causing the signup to fail
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- Also drop the trigger function
DROP FUNCTION IF EXISTS trigger_initialize_user_skills();

-- This will allow signups to work immediately
-- The user skills and stats can be initialized later when the user first accesses those features
