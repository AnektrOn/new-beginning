-- Profile-Mastery Sync Fields
-- Add new columns to profiles table for Mastery integration

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_xp_earned INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS completion_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_today INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_week INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_month INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS habits_completed_total INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_current_xp ON profiles(current_xp);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_completion_streak ON profiles(completion_streak);
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity ON profiles(last_activity_date);

-- Add comments for documentation
COMMENT ON COLUMN profiles.current_xp IS 'Current XP for current level';
COMMENT ON COLUMN profiles.total_xp_earned IS 'Total XP earned across all time';
COMMENT ON COLUMN profiles.level IS 'Current user level based on total XP';
COMMENT ON COLUMN profiles.completion_streak IS 'Current consecutive days with habit completions';
COMMENT ON COLUMN profiles.longest_streak IS 'Longest streak achieved';
COMMENT ON COLUMN profiles.habits_completed_today IS 'Number of habits completed today';
COMMENT ON COLUMN profiles.habits_completed_week IS 'Number of habits completed this week';
COMMENT ON COLUMN profiles.habits_completed_month IS 'Number of habits completed this month';
COMMENT ON COLUMN profiles.habits_completed_total IS 'Total habits completed all time';
COMMENT ON COLUMN profiles.last_activity_date IS 'Last time user completed a habit or activity';
