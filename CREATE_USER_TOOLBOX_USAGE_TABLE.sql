-- Create user_toolbox_usage table for tracking toolbox item usage
-- This needs to be run in Supabase SQL Editor

-- Create user_toolbox_usage table
CREATE TABLE IF NOT EXISTS user_toolbox_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  toolbox_item_id UUID NOT NULL REFERENCES user_toolbox_items(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_toolbox_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own toolbox usage" ON user_toolbox_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own toolbox usage" ON user_toolbox_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own toolbox usage" ON user_toolbox_usage
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own toolbox usage" ON user_toolbox_usage
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_toolbox_usage_user_id ON user_toolbox_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_toolbox_usage_toolbox_item_id ON user_toolbox_usage(toolbox_item_id);
CREATE INDEX IF NOT EXISTS idx_user_toolbox_usage_used_at ON user_toolbox_usage(used_at);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_toolbox_usage TO authenticated;
