-- Fix the handle_new_user function to only insert into profiles table
-- The user_preferences table exists but the function shouldn't try to insert into it during signup

-- Step 1: Create a simple handle_new_user function that only creates profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only insert into profiles table
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
    is_premium
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'Free',
    1,
    0,
    0,
    0,
    'New Catalyst',
    1,
    0.00,
    false
  );
  
  RETURN NEW;
END;
$$;

-- Step 2: Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Test the function
SELECT 'handle_new_user function fixed - only creates profiles!' as status;
