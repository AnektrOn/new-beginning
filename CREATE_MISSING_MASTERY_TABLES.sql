-- Create missing mastery system tables
-- Run this in your Supabase SQL Editor

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS habit_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES user_habits(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, habit_id, completion_date)
);

-- Create toolbox_usage table
CREATE TABLE IF NOT EXISTS toolbox_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    toolbox_item_id UUID NOT NULL REFERENCES user_toolbox_items(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, toolbox_item_id, usage_date)
);

-- Enable RLS
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for habit_completions
CREATE POLICY "Users can view their own habit completions" ON habit_completions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions" ON habit_completions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions" ON habit_completions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions" ON habit_completions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for toolbox_usage
CREATE POLICY "Users can view their own toolbox usage" ON toolbox_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own toolbox usage" ON toolbox_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own toolbox usage" ON toolbox_usage
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own toolbox usage" ON toolbox_usage
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_habit_date ON habit_completions(user_id, habit_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_toolbox_usage_user_toolbox_date ON toolbox_usage(user_id, toolbox_item_id, usage_date);

-- Insert some sample data for testing
INSERT INTO habits_library (title, description, category, xp_reward) VALUES
('Read for 30 minutes', 'Read books, articles, or educational content for 30 minutes daily', 'learning', 15),
('Exercise for 20 minutes', 'Do any form of physical exercise for at least 20 minutes', 'health', 20),
('Meditate for 10 minutes', 'Practice mindfulness or meditation for 10 minutes', 'wellness', 10),
('Write in journal', 'Write thoughts, goals, or reflections in a journal', 'personal', 12),
('Practice coding', 'Work on coding projects or learn new programming concepts', 'skill', 25)
ON CONFLICT DO NOTHING;

INSERT INTO toolbox_library (title, description, category, xp_reward) VALUES
('Pomodoro Timer', 'Use the Pomodoro technique for focused work sessions', 'productivity', 10),
('Mind Mapping', 'Create mind maps to organize thoughts and ideas', 'creativity', 15),
('Active Listening', 'Practice active listening in conversations', 'communication', 12),
('Deep Breathing', 'Practice deep breathing exercises for stress relief', 'wellness', 8),
('Time Blocking', 'Use time blocking to organize your daily schedule', 'productivity', 10)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON habit_completions TO authenticated;
GRANT ALL ON toolbox_usage TO authenticated;
