-- Create the missing handle_new_user function
-- This is what's been missing all along!

-- Step 1: Create the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, level, current_xp, total_xp_earned, daily_streak, rank, xp_to_next_level, level_progress_percentage, is_premium)
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

-- Step 2: Create the trigger that calls handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Test the function
SELECT 'handle_new_user function created successfully!' as status;
