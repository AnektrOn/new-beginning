-- COMPLETE SIGNUP FIX
-- This script fixes the broken trigger chain that prevents user signup
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- STEP 1: Remove all existing conflicting triggers and functions
-- ============================================================================

-- Drop triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_initialize_user_skills ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_trigger ON auth.users;

-- Drop triggers on profiles
DROP TRIGGER IF EXISTS trigger_create_user_preferences ON profiles;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_user_preferences();
DROP FUNCTION IF EXISTS public.trigger_initialize_user_skills();
DROP FUNCTION IF EXISTS public.initialize_user_skills_and_stats(uuid);

-- ============================================================================
-- STEP 2: Ensure user_preferences table exists with proper structure
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
  show_xp BOOLEAN DEFAULT true,
  show_level BOOLEAN DEFAULT true,
  theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  language_preference TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  right_sidebar_collapsed BOOLEAN DEFAULT false,
  visible_widgets JSONB DEFAULT '["profile", "calendar", "notifications", "progress", "leaderboard"]'::jsonb,
  widget_order JSONB DEFAULT '["profile", "calendar", "notifications", "progress", "leaderboard"]'::jsonb
);

-- Enable RLS on user_preferences if not already enabled
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON user_preferences;

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 3: Create handle_new_user function (for auth.users trigger)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles table
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

-- ============================================================================
-- STEP 4: Create user preferences function (for profiles trigger)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_user_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into user_preferences table
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log the error but don't fail the transaction
    RAISE NOTICE 'Failed to create user preferences for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- STEP 5: Create triggers in the correct order
-- ============================================================================

-- Trigger 1: Create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: Create preferences when profile is created
CREATE TRIGGER trigger_create_user_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_user_preferences();

-- ============================================================================
-- STEP 6: Verify the setup
-- ============================================================================

SELECT 'Complete signup fix applied successfully!' as status;

-- Display created triggers
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'trigger_create_user_preferences')
ORDER BY event_object_table;

