-- Create xp_logs table for tracking XP transactions and weekly XP calculation
-- This needs to be run in Supabase SQL Editor

-- Create xp_logs table
CREATE TABLE IF NOT EXISTS xp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'habit_completion', 'lesson_completion', 'quiz_completion', 'manual', etc.
  description TEXT,
  metadata JSONB, -- Additional data like habit_id, lesson_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own XP logs" ON xp_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own XP logs" ON xp_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all XP logs
CREATE POLICY "Admins can view all XP logs" ON xp_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_xp_logs_user_id ON xp_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_logs_created_at ON xp_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_xp_logs_source ON xp_logs(source);

-- Grant permissions
GRANT SELECT, INSERT ON xp_logs TO authenticated;

-- Create function to add XP and log it
CREATE OR REPLACE FUNCTION add_xp_log(
  p_user_id UUID,
  p_xp_amount INTEGER,
  p_source TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  -- Insert XP log
  INSERT INTO xp_logs (user_id, xp_amount, source, description, metadata)
  VALUES (p_user_id, p_xp_amount, p_source, p_description, p_metadata)
  RETURNING id INTO log_id;
  
  -- Update user's current XP
  UPDATE profiles 
  SET 
    current_xp = current_xp + p_xp_amount,
    total_xp_earned = total_xp_earned + p_xp_amount,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION add_xp_log TO authenticated;
