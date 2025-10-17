-- Badge System Tables
-- Create badges library and user badges tables

-- Badges library table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  badge_image_url TEXT,
  category VARCHAR(100), -- e.g., 'milestone', 'streak', 'achievement', 'custom'
  criteria JSONB, -- e.g., {"type": "habits_completed", "count": 10}
  xp_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP DEFAULT NOW(),
  awarded_by UUID REFERENCES auth.users(id), -- NULL for automatic, admin ID for manual
  UNIQUE(user_id, badge_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_is_active ON badges(is_active);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_awarded_at ON user_badges(awarded_at);

-- RLS policies
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges viewable by everyone" ON badges FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage badges" ON badges FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can award badges" ON user_badges FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add comments for documentation
COMMENT ON TABLE badges IS 'Library of available badges that can be earned';
COMMENT ON TABLE user_badges IS 'Badges earned by users';
COMMENT ON COLUMN badges.criteria IS 'JSON criteria for earning the badge';
COMMENT ON COLUMN badges.category IS 'Badge category: milestone, streak, achievement, custom';
COMMENT ON COLUMN user_badges.awarded_by IS 'NULL for automatic awards, admin ID for manual awards';
