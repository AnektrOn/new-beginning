-- Level System Schema for Human Catalyst University
-- This creates the level thresholds and synchronizes with user XP

-- Create levels table with all 51 levels
CREATE TABLE IF NOT EXISTS levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number INTEGER UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  xp_threshold INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all 51 levels with their XP thresholds
INSERT INTO levels (level_number, title, xp_threshold, description) VALUES
(1, 'New Catalyst', 0, 'The beginning of your journey'),
(2, 'Mild Catalyst', 1, 'Taking the first steps'),
(3, 'Gentle Catalyst', 5, 'Building momentum'),
(4, 'Soft Catalyst', 10, 'Finding your rhythm'),
(5, 'Light Catalyst', 25, 'Gaining clarity'),
(6, 'Easy Catalyst', 50, 'Building confidence'),
(7, 'Simple Catalyst', 100, 'Mastering the basics'),
(8, 'Basic Catalyst', 250, 'Developing foundations'),
(9, 'Average Catalyst', 500, 'Finding balance'),
(10, 'Normal Catalyst', 750, 'Establishing patterns'),
(11, 'Typical Catalyst', 1000, 'Becoming consistent'),
(12, 'Standard Catalyst', 1250, 'Raising standards'),
(13, 'Regular Catalyst', 1500, 'Building habits'),
(14, 'Frequent Catalyst', 1750, 'Increasing frequency'),
(15, 'Common Catalyst', 2000, 'Reaching common ground'),
(16, 'Uncommon Catalyst', 2500, 'Standing out'),
(17, 'Rare Catalyst', 3000, 'Becoming rare'),
(18, 'Special Catalyst', 3500, 'Developing uniqueness'),
(19, 'Unique Catalyst', 4000, 'Embracing individuality'),
(20, 'Original Catalyst', 4500, 'Creating originality'),
(21, 'Authentic Catalyst', 5000, 'Finding authenticity'),
(22, 'Genuine Catalyst', 5500, 'Being genuine'),
(23, 'Real Catalyst', 6000, 'Becoming real'),
(24, 'True Catalyst', 6500, 'Discovering truth'),
(25, 'Pure Catalyst', 7000, 'Achieving purity'),
(26, 'Flawless Catalyst', 7500, 'Reaching flawlessness'),
(27, 'Perfect Catalyst', 8000, 'Attaining perfection'),
(28, 'Ultimate Catalyst', 8500, 'Reaching the ultimate'),
(29, 'Supreme Catalyst', 9000, 'Achieving supremacy'),
(30, 'Grand Catalyst', 9500, 'Becoming grand'),
(31, 'Master Catalyst', 10000, 'Mastering the craft'),
(32, 'Divine Catalyst', 10500, 'Touching the divine'),
(33, 'Cosmic Catalyst', 11000, 'Connecting with cosmos'),
(34, 'Universal Catalyst', 11500, 'Understanding universality'),
(35, 'Transcendent Catalyst', 12000, 'Transcending limits'),
(36, 'Eternal Catalyst', 12500, 'Achieving eternity'),
(37, 'Infinite Catalyst', 13000, 'Reaching infinity'),
(38, 'Omnipotent Catalyst', 13500, 'Becoming omnipotent'),
(39, 'Omniscient Catalyst', 14000, 'Gaining omniscience'),
(40, 'Omnipresent Catalyst', 14500, 'Achieving omnipresence'),
(41, 'Alpha Catalyst', 15000, 'Being the alpha'),
(42, 'Omega Catalyst', 15500, 'Reaching omega'),
(43, 'Genesis Catalyst', 16000, 'Creating genesis'),
(44, 'Apocalypse Catalyst', 16500, 'Understanding apocalypse'),
(45, 'Nirvana Catalyst', 17000, 'Achieving nirvana'),
(46, 'Enlightenment Catalyst', 17500, 'Reaching enlightenment'),
(47, 'Ascension Catalyst', 18000, 'Ascending beyond'),
(48, 'Evolution Catalyst', 18500, 'Evolving completely'),
(49, 'Revolution Catalyst', 19000, 'Revolutionizing existence'),
(50, 'Transformation Catalyst', 19500, 'Transforming reality'),
(51, 'God Mode Catalyst', 20000, 'Achieving god mode')
ON CONFLICT (level_number) DO UPDATE SET
  title = EXCLUDED.title,
  xp_threshold = EXCLUDED.xp_threshold,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create function to get user's current level based on XP
CREATE OR REPLACE FUNCTION get_user_level(user_xp INTEGER)
RETURNS TABLE (
  level_number INTEGER,
  title VARCHAR(100),
  xp_threshold INTEGER,
  current_xp INTEGER,
  xp_to_next INTEGER,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.level_number,
    l.title,
    l.xp_threshold,
    user_xp as current_xp,
    CASE 
      WHEN l.level_number = 51 THEN 0
      ELSE (SELECT l2.xp_threshold FROM levels l2 WHERE l2.level_number = l.level_number + 1) - user_xp
    END as xp_to_next,
    CASE 
      WHEN l.level_number = 51 THEN 100.0
      ELSE ROUND(
        ((user_xp - l.xp_threshold)::NUMERIC / 
         ((SELECT l3.xp_threshold FROM levels l3 WHERE l3.level_number = l.level_number + 1) - l.xp_threshold)::NUMERIC) * 100, 
        2
      )
    END as progress_percentage
  FROM levels l
  WHERE l.xp_threshold <= user_xp
  ORDER BY l.level_number DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user's level in profiles table
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
  user_level RECORD;
BEGIN
  -- Get the user's current level based on their XP
  SELECT * INTO user_level FROM get_user_level(NEW.current_xp);
  
  -- Update the profile with the new level information
  UPDATE profiles 
  SET 
    level = user_level.level_number,
    rank = user_level.title,
    xp_to_next_level = user_level.xp_to_next,
    level_progress_percentage = user_level.progress_percentage,
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update level when XP changes
DROP TRIGGER IF EXISTS trigger_update_user_level ON profiles;
CREATE TRIGGER trigger_update_user_level
  AFTER UPDATE OF current_xp ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Add level-related columns to profiles table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'level') THEN
    ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rank') THEN
    ALTER TABLE profiles ADD COLUMN rank VARCHAR(100) DEFAULT 'New Catalyst';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'xp_to_next_level') THEN
    ALTER TABLE profiles ADD COLUMN xp_to_next_level INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'level_progress_percentage') THEN
    ALTER TABLE profiles ADD COLUMN level_progress_percentage NUMERIC(5,2) DEFAULT 0.00;
  END IF;
END $$;

-- Update all existing users with their current levels
UPDATE profiles 
SET 
  level = (SELECT level_number FROM get_user_level(current_xp)),
  rank = (SELECT title FROM get_user_level(current_xp)),
  xp_to_next_level = (SELECT xp_to_next FROM get_user_level(current_xp)),
  level_progress_percentage = (SELECT progress_percentage FROM get_user_level(current_xp)),
  updated_at = NOW()
WHERE current_xp IS NOT NULL;

-- Create RLS policies for levels table
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read levels" ON levels
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_levels_xp_threshold ON levels(xp_threshold);
CREATE INDEX IF NOT EXISTS idx_levels_level_number ON levels(level_number);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_current_xp ON profiles(current_xp);

-- Create view for user level information
CREATE OR REPLACE VIEW user_level_info AS
SELECT 
  p.id,
  p.full_name,
  p.current_xp,
  p.level,
  p.rank,
  p.xp_to_next_level,
  p.level_progress_percentage,
  l.title as level_title,
  l.description as level_description,
  CASE 
    WHEN p.level = 51 THEN NULL
    ELSE (SELECT title FROM levels WHERE level_number = p.level + 1)
  END as next_level_title,
  CASE 
    WHEN p.level = 51 THEN 0
    ELSE (SELECT xp_threshold FROM levels WHERE level_number = p.level + 1) - p.current_xp
  END as xp_needed_for_next
FROM profiles p
LEFT JOIN levels l ON p.level = l.level_number;

-- Grant permissions
GRANT SELECT ON levels TO authenticated;
GRANT SELECT ON user_level_info TO authenticated;
GRANT SELECT ON profiles TO authenticated;
