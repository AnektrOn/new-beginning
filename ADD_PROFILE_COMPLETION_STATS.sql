-- Add completion statistics columns to profiles table
-- Run this in your Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS completion_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_today INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_week INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_month INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_total INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_completion_streak ON profiles(completion_streak);
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity ON profiles(last_activity_date);

-- Add comments for documentation
COMMENT ON COLUMN profiles.completion_streak IS 'Current consecutive days with habit completions';
COMMENT ON COLUMN profiles.longest_streak IS 'Longest streak achieved';
COMMENT ON COLUMN profiles.habits_completed_today IS 'Number of habits completed today';
COMMENT ON COLUMN profiles.habits_completed_week IS 'Number of habits completed this week';
COMMENT ON COLUMN profiles.habits_completed_month IS 'Number of habits completed this month';
COMMENT ON COLUMN profiles.habits_completed_total IS 'Total habits completed all time';
COMMENT ON COLUMN profiles.last_activity_date IS 'Last date when user completed a habit';

