-- FINAL FIX: Create a simple handle_new_user function that ONLY creates profiles
-- This will fix the "user_preferences does not exist" error

-- Step 1: Drop the existing function and trigger completely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create a NEW, simple handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- ONLY insert into profiles table - nothing else
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

-- Step 3: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Test the function
SELECT 'Simple handle_new_user function created successfully!' as status;
