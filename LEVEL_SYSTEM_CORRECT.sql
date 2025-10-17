-- Level System Schema with USER'S EXACT DATA
-- Using the exact level titles and XP thresholds provided by the user

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

-- Insert all 51 levels with USER'S EXACT XP thresholds and titles
INSERT INTO levels (level_number, title, xp_threshold, description) VALUES
(0, 'Uninitiated', 0, 'The beginning of your journey'),
(1, 'Spark of Inquiry', 1000, 'Taking the first steps'),
(2, 'Seeker of Fragments', 2500, 'Building momentum'),
(3, 'Mindful Observer', 4500, 'Finding your rhythm'),
(4, 'Newborn Awakened', 7000, 'Gaining clarity'),
(5, 'Stellar Apprentice', 10000, 'Building confidence'),
(6, 'Acolyte of Insight', 13500, 'Mastering the basics'),
(7, 'Thought Collector', 17500, 'Developing foundations'),
(8, 'Habit Architect', 22000, 'Finding balance'),
(9, 'Pattern Weaver', 27000, 'Establishing patterns'),
(10, 'Nexus Initiate', 33000, 'Becoming consistent'),
(11, 'Thought Catalyst', 40000, 'Raising standards'),
(12, 'Mind Sculptor', 48000, 'Building habits'),
(13, 'Stellar Cartographer', 57000, 'Increasing frequency'),
(14, 'Knowledge Engineer', 67000, 'Reaching common ground'),
(15, 'Guardian of Lore', 78000, 'Standing out'),
(16, 'Will Shaper', 90000, 'Becoming rare'),
(17, 'Reality Prober', 103000, 'Developing uniqueness'),
(18, 'Insight Forger', 117000, 'Embracing individuality'),
(19, 'Nexus Adept', 132000, 'Creating originality'),
(20, 'Cosmic Shaper', 150000, 'Finding authenticity'),
(21, 'Star-Treader', 170000, 'Being genuine'),
(22, 'Celestial Pilgrim', 192000, 'Becoming real'),
(23, 'Ethereal Conduit', 215000, 'Discovering truth'),
(24, 'Oracle of the Nexus', 240000, 'Achieving purity'),
(25, 'Ascendant', 270000, 'Reaching flawlessness'),
(26, 'Master of Whispers', 300000, 'Attaining perfection'),
(27, 'Dream Architect', 335000, 'Reaching the ultimate'),
(28, 'Void Navigator', 370000, 'Achieving supremacy'),
(29, 'Stellar Sage', 410000, 'Becoming grand'),
(30, 'Transcendent', 450000, 'Mastering the craft'),
(31, 'Echo of Infinity', 500000, 'Touching the divine'),
(32, 'Weaver of Fates', 555000, 'Connecting with cosmos'),
(33, 'Cosmic Sovereign', 615000, 'Understanding universality'),
(34, 'Celestial Forgemaster', 680000, 'Transcending limits'),
(35, 'Keeper of Paradox', 750000, 'Achieving eternity'),
(36, 'Galactic Chronicler', 825000, 'Reaching infinity'),
(37, 'Master of Constants', 905000, 'Becoming omnipotent'),
(38, 'Void Theorist', 1000000, 'Gaining omniscience'),
(39, 'Nexus Embodied', 1100000, 'Achieving omnipresence'),
(40, 'Beacon of Insight', 1250000, 'Being the alpha'),
(41, 'The Prime Catalyst', 1400000, 'Reaching omega'),
(42, 'Architect of Reality', 1560000, 'Creating genesis'),
(43, 'Unbound', 1730000, 'Understanding apocalypse'),
(44, 'Living Constellation', 1910000, 'Achieving nirvana'),
(45, 'The Penultimate', 2100000, 'Reaching enlightenment'),
(46, 'Harbinger of Dawn', 2300000, 'Ascending beyond'),
(47, 'Glimpse of Godhood', 2550000, 'Evolving completely'),
(48, 'The Infinite Mind', 2800000, 'Revolutionizing existence'),
(49, 'Master of the Echo', 3100000, 'Transforming reality'),
(50, 'The Human Catalyst', 3500000, 'Achieving god mode')
ON CONFLICT (level_number) DO UPDATE SET
  title = EXCLUDED.title,
  xp_threshold = EXCLUDED.xp_threshold,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create function to get user's current level based on XP (FIXED VERSION)
CREATE OR REPLACE FUNCTION get_user_level(input_xp INTEGER)
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
    input_xp as current_xp,
    CASE 
      WHEN l.level_number = 50 THEN 0
      ELSE (SELECT l2.xp_threshold FROM levels l2 WHERE l2.level_number = l.level_number + 1) - input_xp
    END as xp_to_next,
    CASE 
      WHEN l.level_number = 50 THEN 100.0
      ELSE ROUND(
        ((input_xp - l.xp_threshold)::NUMERIC / 
         ((SELECT l3.xp_threshold FROM levels l3 WHERE l3.level_number = l.level_number + 1) - l.xp_threshold)::NUMERIC) * 100, 
        2
      )
    END as progress_percentage
  FROM levels l
  WHERE l.xp_threshold <= input_xp
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
    ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rank') THEN
    ALTER TABLE profiles ADD COLUMN rank VARCHAR(100) DEFAULT 'Uninitiated';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'xp_to_next_level') THEN
    ALTER TABLE profiles ADD COLUMN xp_to_next_level INTEGER DEFAULT 1000;
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

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can read levels" ON levels;

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
    WHEN p.level = 50 THEN NULL
    ELSE (SELECT title FROM levels WHERE level_number = p.level + 1)
  END as next_level_title,
  CASE 
    WHEN p.level = 50 THEN 0
    ELSE (SELECT xp_threshold FROM levels WHERE level_number = p.level + 1) - p.current_xp
  END as xp_needed_for_next
FROM profiles p
LEFT JOIN levels l ON p.level = l.level_number;

-- Grant permissions
GRANT SELECT ON levels TO authenticated;
GRANT SELECT ON user_level_info TO authenticated;
GRANT SELECT ON profiles TO authenticated;
