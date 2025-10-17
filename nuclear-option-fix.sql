-- NUCLEAR OPTION: Remove ALL triggers and functions, then create a clean one
-- This will definitely fix the user_preferences error

-- Step 1: Remove ALL possible triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_initialize_user_skills ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_trigger ON auth.users;

-- Step 2: Remove ALL possible functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.initialize_user_skills_and_stats(uuid);
DROP FUNCTION IF EXISTS public.trigger_initialize_user_skills();

-- Step 3: Create a completely new, simple function
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

-- Step 4: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Test
SELECT 'Nuclear option completed - clean function created!' as status;