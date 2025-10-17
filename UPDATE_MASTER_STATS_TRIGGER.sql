-- =====================================================
-- UPDATE MASTER STATS TRIGGER
-- =====================================================
-- This creates a trigger that automatically updates master stats
-- when individual skills are updated

-- First, create a function to update master stats based on skills
CREATE OR REPLACE FUNCTION update_master_stats_from_skills()
RETURNS TRIGGER AS $$
BEGIN
  -- Update master stats for the user based on their skills
  -- This calculates the average of all skills for each master stat
  
  INSERT INTO user_master_stats (user_id, master_stat_id, current_value)
  SELECT 
    NEW.user_id,
    s.master_stat_id,
    COALESCE(AVG(us.current_value), 0)::integer
  FROM skills s
  LEFT JOIN user_skills us ON s.id = us.skill_id AND us.user_id = NEW.user_id
  WHERE s.master_stat_id IS NOT NULL
  GROUP BY s.master_stat_id
  ON CONFLICT (user_id, master_stat_id) 
  DO UPDATE SET 
    current_value = EXCLUDED.current_value,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on user_skills table
DROP TRIGGER IF EXISTS trigger_update_master_stats ON user_skills;
CREATE TRIGGER trigger_update_master_stats
  AFTER INSERT OR UPDATE OR DELETE ON user_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_master_stats_from_skills();

-- Also create a function to manually recalculate all master stats for a user
CREATE OR REPLACE FUNCTION recalculate_user_master_stats(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete existing master stats for the user
  DELETE FROM user_master_stats WHERE user_id = target_user_id;
  
  -- Recalculate and insert new master stats
  INSERT INTO user_master_stats (user_id, master_stat_id, current_value)
  SELECT 
    target_user_id,
    s.master_stat_id,
    COALESCE(AVG(us.current_value), 0)::integer
  FROM skills s
  LEFT JOIN user_skills us ON s.id = us.skill_id AND us.user_id = target_user_id
  WHERE s.master_stat_id IS NOT NULL
  GROUP BY s.master_stat_id;
END;
$$ LANGUAGE plpgsql;

-- Test the function by recalculating master stats for all users
-- This will fix any existing data
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT DISTINCT user_id FROM user_skills LOOP
    PERFORM recalculate_user_master_stats(user_record.user_id);
  END LOOP;
END $$;

-- Show the results
SELECT 
  p.full_name,
  ms.display_name as master_stat,
  ums.current_value
FROM user_master_stats ums
JOIN master_stats ms ON ums.master_stat_id = ms.id
JOIN profiles p ON ums.user_id = p.id
ORDER BY p.full_name, ms.display_name;
