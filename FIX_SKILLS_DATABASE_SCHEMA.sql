-- Fix Skills Database Schema Issues
-- This script addresses the missing columns and relationships found in testing

-- 1. Create user_skills table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    points_earned DECIMAL(10,2) DEFAULT 0,
    last_awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- 2. Create user_toolbox_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_toolbox_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    toolbox_id UUID NOT NULL REFERENCES toolbox_library(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, toolbox_id)
);

-- 3. Add missing columns to user_skills if they don't exist
DO $$ 
BEGIN
    -- Add last_awarded_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_skills' AND column_name = 'last_awarded_at') THEN
        ALTER TABLE user_skills ADD COLUMN last_awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add points_earned column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_skills' AND column_name = 'points_earned') THEN
        ALTER TABLE user_skills ADD COLUMN points_earned DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_toolbox_items_user_id ON user_toolbox_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_toolbox_items_toolbox_id ON user_toolbox_items(toolbox_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_toolbox_items ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for user_skills
DROP POLICY IF EXISTS "Users can view their own skills" ON user_skills;
CREATE POLICY "Users can view their own skills" ON user_skills
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own skills" ON user_skills;
CREATE POLICY "Users can insert their own skills" ON user_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own skills" ON user_skills;
CREATE POLICY "Users can update their own skills" ON user_skills
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. Create RLS policies for user_toolbox_items
DROP POLICY IF EXISTS "Users can view their own toolbox items" ON user_toolbox_items;
CREATE POLICY "Users can view their own toolbox items" ON user_toolbox_items
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own toolbox items" ON user_toolbox_items;
CREATE POLICY "Users can insert their own toolbox items" ON user_toolbox_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own toolbox items" ON user_toolbox_items;
CREATE POLICY "Users can update their own toolbox items" ON user_toolbox_items
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own toolbox items" ON user_toolbox_items;
CREATE POLICY "Users can delete their own toolbox items" ON user_toolbox_items
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_skills_updated_at ON user_skills;
CREATE TRIGGER update_user_skills_updated_at
    BEFORE UPDATE ON user_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_toolbox_items_updated_at ON user_toolbox_items;
CREATE TRIGGER update_user_toolbox_items_updated_at
    BEFORE UPDATE ON user_toolbox_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Grant necessary permissions
GRANT ALL ON user_skills TO authenticated;
GRANT ALL ON user_toolbox_items TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 11. Insert some sample data for testing (optional)
-- This will help verify the schema is working correctly
INSERT INTO user_skills (user_id, skill_id, points_earned, last_awarded_at)
SELECT 
    '8c94448d-e21c-4b7b-be9a-88a5692dc5d6'::uuid, -- Test user ID
    s.id,
    0,
    NOW()
FROM skills s
WHERE NOT EXISTS (
    SELECT 1 FROM user_skills us 
    WHERE us.user_id = '8c94448d-e21c-4b7b-be9a-88a5692dc5d6'::uuid 
    AND us.skill_id = s.id
)
ON CONFLICT (user_id, skill_id) DO NOTHING;

COMMENT ON TABLE user_skills IS 'Tracks user progress in individual skills with points earned';
COMMENT ON TABLE user_toolbox_items IS 'Tracks which tools users have added to their personal toolbox';
