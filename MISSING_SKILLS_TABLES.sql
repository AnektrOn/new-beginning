-- Add missing skills system tables
-- This creates the RPG-like skills system that the Mastery components need

-- 1. Master Stats table (the 6 main stats)
CREATE TABLE IF NOT EXISTS master_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Master Stats (user's current values for each master stat)
CREATE TABLE IF NOT EXISTS user_master_stats (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    master_stat_id UUID NOT NULL REFERENCES master_stats(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    max_value INTEGER DEFAULT 100,
    PRIMARY KEY (user_id, master_stat_id)
);

-- 3. Skills table (34 individual skills linked to master stats)
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    master_stat_id UUID NOT NULL REFERENCES master_stats(id) ON DELETE CASCADE,
    max_value INTEGER DEFAULT 100,
    category TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Skills (user's current values for each skill)
CREATE TABLE IF NOT EXISTS user_skills (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    max_value INTEGER DEFAULT 100,
    PRIMARY KEY (user_id, skill_id)
);

-- Enable RLS
ALTER TABLE master_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_master_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read master stats" ON master_stats FOR SELECT USING (true);
CREATE POLICY "Anyone can read skills" ON skills FOR SELECT USING (true);

CREATE POLICY "Users can read their own master stats" ON user_master_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own master stats" ON user_master_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own master stats" ON user_master_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own skills" ON user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON user_skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skills" ON user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert the 6 Master Stats
INSERT INTO master_stats (id, name, display_name, description, color) VALUES
('12d730b1-4e67-4bf4-888e-c549ee165321', 'cognitive_theoretical', 'Cognitive & Theoretical', 'Mental processing and knowledge', '#3b82f6'),
('29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 'inner_awareness', 'Inner Awareness', 'Self-awareness and mindfulness', '#f97316'),
('982ba44f-3430-41e8-bf21-2ec3b50cbc00', 'discipline_ritual', 'Discipline & Ritual', 'Consistency and habit formation', '#a855f7'),
('f31b12a6-7339-40d5-9cbb-59d37c4d6607', 'physical_mastery', 'Physical Mastery', 'Physical fitness and movement skills', '#ef4444'),
('f9f76f0f-0333-4408-9bd1-80446e643019', 'creative_reflective', 'Creative & Reflective', 'Creative expression and self-reflection', '#ec4899'),
('fb51c028-f847-4c85-9fc7-0c464b96d051', 'social_influence', 'Social & Influence', 'Community engagement and leadership', '#22c55e')
ON CONFLICT (id) DO NOTHING;

-- Insert the 34 Skills
INSERT INTO skills (id, name, display_name, description, master_stat_id, max_value) VALUES
('4ad13e10-5e10-400c-82cf-2649479a981f', 'workout_habit', 'Workout Habit', 'Regular exercise routine', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100),
('fe8c74b5-bac7-4cdc-8391-e2fbb20ffc5c', 'time_management', 'Time Management', 'Effective use of time', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100),
('6cd99875-b638-48fe-bc15-8d7f7d60f45d', 'shadow_work_habit', 'Shadow Work', 'Exploring unconscious patterns', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100),
('887cbb15-ec9a-4f09-a4c7-7657e1b0ddf1', 'self_awareness', 'Self Awareness', 'Understanding oneself', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100),
('e034e341-f503-4dce-9235-8005dd553050', 'ritual_discipline_habit', 'Ritual Discipline', 'Ritual and ceremonial practices', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100),
('b2028ed7-1cd0-4ea4-a827-f61854d95238', 'ritual_creation', 'Ritual Creation', 'Creating meaningful routines', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100),
('7d649a01-a03b-482f-82cc-6248e5c0d5fc', 'reflection_habit', 'Reflection', 'Self-reflection and introspection', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100),
('bc0e93ba-488b-4000-97c2-fe5df6341b53', 'reading_habit', 'Reading', 'Regular reading and learning', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('110b005b-8998-4bbc-86d0-254274d90878', 'quantum_understanding_habit', 'Quantum Understanding', 'Quantum physics concepts', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('74087c81-ffb6-48bf-9f97-6174d37224c6', 'psychology_habit', 'Psychology', 'Understanding human behavior', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('86963e5d-9bcc-45d2-b4db-b01eee6d4e23', 'problem_solving', 'Problem Solving', 'Finding solutions to challenges', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('cd3e3c54-cdba-4a19-a9f6-e456fdb8fa24', 'peer_coaching_habit', 'Peer Coaching', 'Helping others grow', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100),
('4b30cee0-448e-479c-9927-96dc76d17cd1', 'nutrition_habit', 'Nutrition', 'Healthy eating habits', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100),
('a5f9dcc4-d8dc-47e5-871a-7646060ffd79', 'neuroscience_habit', 'Neuroscience', 'Understanding brain science', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('029877e7-6067-4508-95c3-39889430315c', 'networking', 'Networking', 'Building professional relationships', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100),
('879b7be0-d391-40d2-9cde-fc34c83919cf', 'movement_habit', 'Movement', 'Physical movement and exercise', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100),
('2aa8a313-1e77-4288-85e8-d85f337fb462', 'mindfulness_habit', 'Mindfulness', 'Present moment awareness', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100),
('20d8a253-94d2-49ed-bb90-b3a3fc296a79', 'memory_techniques', 'Memory Techniques', 'Improving memory and recall', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('c45eddd4-660b-4bd5-8fdb-516772cab0a7', 'meditation_habit', 'Meditation Habit', 'Regular meditation practice', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100),
('cde2de09-9ce1-4971-b3f8-21b941622d69', 'learning_habit', 'Learning', 'Continuous learning and education', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('79003e06-75fa-46f3-ab1e-1b9860f6f17e', 'leadership', 'Leadership', 'Leading and inspiring others', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100),
('ae890576-71a0-4390-902a-79625b91ab5b', 'journaling_habit', 'Journaling Habit', 'Regular writing and reflection', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100),
('8eb8adba-4209-483b-a503-4664e5247574', 'habit_tracking_habit', 'Habit Tracking', 'Monitoring and tracking habits', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100),
('7e4d9759-3a64-4084-9bd2-805ded61d30e', 'goal_setting', 'Goal Setting', 'Setting and achieving goals', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100),
('729578db-7e95-480e-ba04-52f1ec9400d7', 'empathy', 'Empathy', 'Understanding and relating to others', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100),
('afac2c42-4c84-4b31-9458-a6e98e09b6ba', 'emotional_regulation', 'Emotional Regulation', 'Managing emotions effectively', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100),
('1dffd208-2946-4e57-b80c-279a23e9bc1e', 'critical_thinking', 'Critical Thinking', 'Analytical and logical reasoning', '12d730b1-4e67-4bf4-888e-c549ee165321', 100),
('38a68fb3-80bd-443c-a157-8a9bf1a15774', 'creative_expression', 'Creative Expression', 'Artistic and creative activities', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100),
('6b277aa5-3591-4173-b917-9334201a66be', 'consistency', 'Consistency', 'Maintaining regular habits', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100),
('bd689e1f-941e-4374-b647-021c2eccdf5e', 'communication', 'Communication', 'Effective communication skills', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100),
('5ef11d83-d3ba-4410-be99-c248a0713a14', 'breathwork_habit', 'Breathwork', 'Breathing exercises and techniques', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100),
('78cd368f-88d7-4dd9-b627-b0d5ba874e1c', 'awareness_habit', 'Awareness', 'Mindfulness and presence', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100),
('35f24adf-2fe2-4f06-bd22-4da33da7e76d', 'advocacy_habit', 'Advocacy', 'Speaking up for causes', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100),
('5eae0e71-bc16-43b1-ac8d-300789ae665a', 'adaptation', 'Adaptation', 'Ability to adapt to change', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100)
ON CONFLICT (id) DO NOTHING;

-- Function to initialize user stats and skills when a new profile is created
CREATE OR REPLACE FUNCTION initialize_user_stats_and_skills()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert user_master_stats for all master stats
    INSERT INTO user_master_stats (user_id, master_stat_id, current_value, max_value)
    SELECT NEW.id, id, 0, 100 FROM master_stats;
    
    -- Insert user_skills for all skills
    INSERT INTO user_skills (user_id, skill_id, current_value, max_value)
    SELECT NEW.id, id, 0, max_value FROM skills;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to initialize stats and skills for new users
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_stats_and_skills();

-- Function to award skill points
CREATE OR REPLACE FUNCTION award_skill_points(user_id UUID, skill_points JSONB)
RETURNS VOID AS $$
DECLARE
    skill_record RECORD;
BEGIN
    -- Loop through the skill_points JSONB object
    FOR skill_record IN 
        SELECT key as skill_name, value::INTEGER as points
        FROM jsonb_each_text(skill_points)
    LOOP
        -- Update the user's skill value
        UPDATE user_skills 
        SET current_value = LEAST(current_value + skill_record.points, max_value)
        WHERE user_skills.user_id = award_skill_points.user_id 
        AND skill_id = (SELECT id FROM skills WHERE name = skill_record.skill_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
