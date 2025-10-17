-- Skills and Mastery System Database Schema
-- Run this in your Supabase SQL Editor

-- ==================== MASTER STATS SYSTEM ====================

-- Master Stats table (RPG-like main attributes)
CREATE TABLE IF NOT EXISTS public.master_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Master Stats (RPG-like main attributes per user)
CREATE TABLE IF NOT EXISTS public.user_master_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    master_stat_id UUID NOT NULL REFERENCES public.master_stats(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    max_value INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, master_stat_id)
);

-- ==================== SKILLS SYSTEM ====================

-- Skills table (RPG-like skill system)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    master_stat_id UUID REFERENCES public.master_stats(id) ON DELETE SET NULL,
    max_value INTEGER DEFAULT 100,
    category TEXT DEFAULT 'general',
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Skills (RPG-like skill points per user)
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    max_value INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, skill_id)
);

-- ==================== HABITS SYSTEM ====================

-- Global Habits Library
CREATE TABLE IF NOT EXISTS public.habits_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    skill_tags TEXT[] DEFAULT '{}', -- Array of skill IDs this habit affects
    xp_reward INTEGER DEFAULT 10,
    skill_reward INTEGER DEFAULT 1, -- Points added to skills
    frequency_type TEXT DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekly', 'monthly')),
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    is_global BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Personal Habits
CREATE TABLE IF NOT EXISTS public.user_habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.habits_library(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    frequency_type TEXT DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekly', 'monthly')),
    xp_reward INTEGER DEFAULT 10,
    skill_reward INTEGER DEFAULT 1,
    skill_tags TEXT[] DEFAULT '{}', -- Skills this habit affects
    is_custom BOOLEAN DEFAULT false,
    completion_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Habit Completions (for tracking streaks and XP)
CREATE TABLE IF NOT EXISTS public.user_habit_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.user_habits(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    xp_earned INTEGER DEFAULT 0,
    skill_points_earned JSONB DEFAULT '{}', -- {skill_id: points_earned}
    notes TEXT
);

-- ==================== TOOLBOX SYSTEM ====================

-- Global Toolbox Library
CREATE TABLE IF NOT EXISTS public.toolbox_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    skill_tags TEXT[] DEFAULT '{}', -- Array of skill IDs this tool affects
    xp_reward INTEGER DEFAULT 15,
    skill_reward INTEGER DEFAULT 2, -- Points added to skills
    can_convert_to_habit BOOLEAN DEFAULT true,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    is_global BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Toolbox Items (converted from library)
CREATE TABLE IF NOT EXISTS public.user_toolbox_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    toolbox_id UUID NOT NULL REFERENCES public.toolbox_library(id) ON DELETE CASCADE,
    converted_to_habit_id UUID REFERENCES public.user_habits(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==================== CALENDAR SYSTEM ====================

-- User Calendar Events (synced with Google Calendar)
CREATE TABLE IF NOT EXISTS public.user_calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.user_habits(id) ON DELETE CASCADE,
    toolbox_id UUID REFERENCES public.toolbox_library(id) ON DELETE CASCADE,
    google_event_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    is_completed BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 0,
    skill_points_earned JSONB DEFAULT '{}', -- {skill_id: points_earned}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==================== INDEXES ====================

-- Master Stats indexes
CREATE INDEX IF NOT EXISTS idx_master_stats_name ON public.master_stats(name);
CREATE INDEX IF NOT EXISTS idx_user_master_stats_user_id ON public.user_master_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_master_stats_master_stat_id ON public.user_master_stats(master_stat_id);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_master_stat_id ON public.skills(master_stat_id);

-- User Skills indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON public.user_skills(skill_id);

-- Habits indexes
CREATE INDEX IF NOT EXISTS idx_habits_library_category ON public.habits_library(category);
CREATE INDEX IF NOT EXISTS idx_habits_library_skill_tags ON public.habits_library USING GIN(skill_tags);
CREATE INDEX IF NOT EXISTS idx_user_habits_user_id ON public.user_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_habits_skill_tags ON public.user_habits USING GIN(skill_tags);
CREATE INDEX IF NOT EXISTS idx_user_habit_completions_user_id ON public.user_habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_habit_completions_habit_id ON public.user_habit_completions(habit_id);

-- Toolbox indexes
CREATE INDEX IF NOT EXISTS idx_toolbox_library_category ON public.toolbox_library(category);
CREATE INDEX IF NOT EXISTS idx_toolbox_library_skill_tags ON public.toolbox_library USING GIN(skill_tags);
CREATE INDEX IF NOT EXISTS idx_user_toolbox_items_user_id ON public.user_toolbox_items(user_id);

-- Calendar indexes
CREATE INDEX IF NOT EXISTS idx_user_calendar_events_user_id ON public.user_calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_calendar_events_date ON public.user_calendar_events(event_date);

-- ==================== RLS POLICIES ====================

-- Enable RLS
ALTER TABLE public.master_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_master_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolbox_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_calendar_events ENABLE ROW LEVEL SECURITY;

-- Master Stats - Read for all
CREATE POLICY "Anyone can read master stats" ON public.master_stats FOR SELECT USING (true);

-- User Master Stats - Users can only access their own
CREATE POLICY "Users can manage their own master stats" ON public.user_master_stats 
    FOR ALL USING (user_id = auth.uid());

-- Skills - Read for all
CREATE POLICY "Anyone can read skills" ON public.skills FOR SELECT USING (true);

-- User Skills - Users can only access their own
CREATE POLICY "Users can manage their own skills" ON public.user_skills 
    FOR ALL USING (user_id = auth.uid());

-- Habits Library - Read for all, write for teachers/admins
DROP POLICY IF EXISTS "Anyone can read habits library" ON public.habits_library;
DROP POLICY IF EXISTS "Teachers and admins can insert habits" ON public.habits_library;

CREATE POLICY "Anyone can read habits library" ON public.habits_library FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can insert habits" ON public.habits_library FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('Teacher', 'Admin')
        )
    );

-- User Habits - Users can only access their own
CREATE POLICY "Users can manage their own habits" ON public.user_habits 
    FOR ALL USING (user_id = auth.uid());

-- User Habit Completions - Users can only access their own
CREATE POLICY "Users can manage their own habit completions" ON public.user_habit_completions 
    FOR ALL USING (user_id = auth.uid());

-- Toolbox Library - Read for all, write for teachers/admins
CREATE POLICY "Anyone can read toolbox library" ON public.toolbox_library FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can insert toolbox items" ON public.toolbox_library FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('Teacher', 'Admin')
        )
    );

-- User Toolbox Items - Users can only access their own
CREATE POLICY "Users can manage their own toolbox items" ON public.user_toolbox_items 
    FOR ALL USING (user_id = auth.uid());

-- User Calendar Events - Users can only access their own
CREATE POLICY "Users can manage their own calendar events" ON public.user_calendar_events 
    FOR ALL USING (user_id = auth.uid());

-- ==================== FUNCTIONS ====================

-- Function to initialize user master stats and skills when a new user is created
CREATE OR REPLACE FUNCTION initialize_user_stats_and_skills()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert all master stats for the new user with 0 points
    INSERT INTO public.user_master_stats (user_id, master_stat_id, current_value, max_value)
    SELECT NEW.id, id, 0, 100
    FROM public.master_stats;
    
    -- Insert all skills for the new user with 0 points
    INSERT INTO public.user_skills (user_id, skill_id, current_value, max_value)
    SELECT NEW.id, id, 0, max_value
    FROM public.skills;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize master stats and skills when a new profile is created
CREATE OR REPLACE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_stats_and_skills();

-- Function to award skill points
CREATE OR REPLACE FUNCTION award_skill_points(
    p_user_id UUID,
    p_skill_points JSONB
)
RETURNS VOID AS $$
DECLARE
    skill_record RECORD;
BEGIN
    -- Loop through each skill in the JSONB object
    FOR skill_record IN 
        SELECT key::UUID as skill_id, value::INTEGER as points
        FROM jsonb_each_text(p_skill_points)
    LOOP
        -- Update user skill points
        UPDATE public.user_skills 
        SET 
            current_value = LEAST(current_value + skill_record.points, max_value),
            updated_at = now()
        WHERE user_id = p_user_id AND skill_id = skill_record.skill_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== INSERT MASTER STATS DATA ====================

-- Insert all the master stats from your list
INSERT INTO public.master_stats (id, name, display_name, description, color) VALUES
('12d730b1-4e67-4bf4-888e-c549ee165321', 'cognitive_theoretical', 'Cognitive & Theoretical', 'Mental processing and knowledge', '#3b82f6'),
('29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 'inner_awareness', 'Inner Awareness', 'Self-awareness and mindfulness', '#f97316'),
('982ba44f-3430-41e8-bf21-2ec3b50cbc00', 'discipline_ritual', 'Discipline & Ritual', 'Consistency and habit formation', '#a855f7'),
('f31b12a6-7339-40d5-9cbb-59d37c4d6607', 'physical_mastery', 'Physical Mastery', 'Physical fitness and movement skills', '#ef4444'),
('f9f76f0f-0333-4408-9bd1-80446e643019', 'creative_reflective', 'Creative & Reflective', 'Creative expression and self-reflection', '#ec4899'),
('fb51c028-f847-4c85-9fc7-0c464b96d051', 'social_influence', 'Social & Influence', 'Community engagement and leadership', '#22c55e');

-- ==================== INSERT SKILLS DATA ====================

-- Insert all the skills from your list
INSERT INTO public.skills (id, name, display_name, description, master_stat_id, max_value, category) VALUES
-- Physical & Health Skills
('4ad13e10-5e10-400c-82cf-2649479a981f', 'workout_habit', 'Workout Habit', 'Regular exercise routine', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100, 'physical'),
('887cbb15-ec9a-4f09-a4c7-7657e1b0ddf1', 'movement_habit', 'Movement', 'Physical movement and exercise', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100, 'physical'),
('4b30cee0-448e-479c-9927-96dc76d17cd1', 'nutrition_habit', 'Nutrition', 'Healthy eating habits', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100, 'physical'),
('5ef11d83-d3ba-4410-be99-c248a0713a14', 'breathwork_habit', 'Breathwork', 'Breathing exercises and techniques', 'f31b12a6-7339-40d5-9cbb-59d37c4d6607', 100, 'physical'),

-- Mental & Cognitive Skills
('fe8c74b5-bac7-4cdc-8391-e2fbb20ffc5c', 'time_management', 'Time Management', 'Effective use of time', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100, 'cognitive'),
('6cd99875-b638-48fe-bc15-8d7f7d60f45d', 'shadow_work_habit', 'Shadow Work', 'Exploring unconscious patterns', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100, 'mental'),
('887cbb15-ec9a-4f09-a4c7-7657e1b0ddf1', 'self_awareness', 'Self Awareness', 'Understanding oneself', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100, 'mental'),
('7d649a01-a03b-482f-82cc-6248e5c0d5fc', 'reflection_habit', 'Reflection', 'Self-reflection and introspection', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100, 'mental'),
('bc0e93ba-488b-4000-97c2-fe5df6341b53', 'reading_habit', 'Reading', 'Regular reading and learning', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),
('110b005b-8998-4bbc-86d0-254274d90878', 'quantum_understanding_habit', 'Quantum Understanding', 'Quantum physics concepts', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),
('74087c81-ffb6-48bf-9f97-6174d37224c6', 'psychology_habit', 'Psychology', 'Understanding human behavior', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),
('86963e5d-9bcc-45d2-b4db-b01eee6d4e23', 'problem_solving', 'Problem Solving', 'Finding solutions to challenges', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),
('a5f9dcc4-d8dc-47e5-871a-7646060ffd79', 'neuroscience_habit', 'Neuroscience', 'Understanding brain science', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),
('20d8a253-94d2-49ed-bb90-b3a3fc296a79', 'memory_techniques', 'Memory Techniques', 'Improving memory and recall', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),
('cde2de09-9ce1-4971-b3f8-21b941622d69', 'learning_habit', 'Learning', 'Continuous learning and education', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),
('1dffd208-2946-4e57-b80c-279a23e9bc1e', 'critical_thinking', 'Critical Thinking', 'Analytical and logical reasoning', '12d730b1-4e67-4bf4-888e-c549ee165321', 100, 'cognitive'),

-- Spiritual & Mindfulness Skills
('e034e341-f503-4dce-9235-8005dd553050', 'ritual_discipline_habit', 'Ritual Discipline', 'Ritual and ceremonial practices', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100, 'spiritual'),
('b2028ed7-1cd0-4ea4-a827-f61854d95238', 'ritual_creation', 'Ritual Creation', 'Creating meaningful routines', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100, 'spiritual'),
('2aa8a313-1e77-4288-85e8-d85f337fb462', 'mindfulness_habit', 'Mindfulness', 'Present moment awareness', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100, 'spiritual'),
('c45eddd4-660b-4bd5-8fdb-516772cab0a7', 'meditation_habit', 'Meditation Habit', 'Regular meditation practice', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100, 'spiritual'),
('78cd368f-88d7-4dd9-b627-b0d5ba874e1c', 'awareness_habit', 'Awareness', 'Mindfulness and presence', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100, 'spiritual'),
('afac2c42-4c84-4b31-9458-a6e98e09b6ba', 'emotional_regulation', 'Emotional Regulation', 'Managing emotions effectively', '29ceb54d-cf71-4777-b7da-bbbd6efd6a14', 100, 'spiritual'),

-- Social & Leadership Skills
('cd3e3c54-cdba-4a19-a9f6-e456fdb8fa24', 'peer_coaching_habit', 'Peer Coaching', 'Helping others grow', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100, 'social'),
('029877e7-6067-4508-95c3-39889430315c', 'networking', 'Networking', 'Building professional relationships', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100, 'social'),
('79003e06-75fa-46f3-ab1e-1b9860f6f17e', 'leadership', 'Leadership', 'Leading and inspiring others', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100, 'social'),
('729578db-7e95-480e-ba04-52f1ec9400d7', 'empathy', 'Empathy', 'Understanding and relating to others', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100, 'social'),
('bd689e1f-941e-4374-b647-021c2eccdf5e', 'communication', 'Communication', 'Effective communication skills', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100, 'social'),
('35f24adf-2fe2-4f06-bd22-4da33da7e76d', 'advocacy_habit', 'Advocacy', 'Speaking up for causes', 'fb51c028-f847-4c85-9fc7-0c464b96d051', 100, 'social'),

-- Creative & Personal Development Skills
('ae890576-71a0-4390-902a-79625b91ab5b', 'journaling_habit', 'Journaling Habit', 'Regular writing and reflection', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100, 'creative'),
('8eb8adba-4209-483b-a503-4664e5247574', 'habit_tracking_habit', 'Habit Tracking', 'Monitoring and tracking habits', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100, 'personal'),
('7e4d9759-3a64-4084-9bd2-805ded61d30e', 'goal_setting', 'Goal Setting', 'Setting and achieving goals', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100, 'personal'),
('38a68fb3-80bd-443c-a157-8a9bf1a15774', 'creative_expression', 'Creative Expression', 'Artistic and creative activities', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100, 'creative'),
('6b277aa5-3591-4173-b917-9334201a66be', 'consistency', 'Consistency', 'Maintaining regular habits', '982ba44f-3430-41e8-bf21-2ec3b50cbc00', 100, 'personal'),
('5eae0e71-bc16-43b1-ac8d-300789ae665a', 'adaptation', 'Adaptation', 'Ability to adapt to change', 'f9f76f0f-0333-4408-9bd1-80446e643019', 100, 'personal');

-- ==================== SAMPLE HABITS DATA ====================

-- Insert some sample habits that reward different skills
INSERT INTO public.habits_library (title, description, category, skill_tags, xp_reward, skill_reward, frequency_type, difficulty_level) VALUES
-- Physical Habits
('Morning Workout', 'Start your day with 30 minutes of exercise', 'physical', ARRAY['4ad13e10-5e10-400c-82cf-2649479a981f', '887cbb15-ec9a-4f09-a4c7-7657e1b0ddf1'], 10, 1, 'daily', 2),
('Healthy Breakfast', 'Eat a nutritious breakfast every morning', 'physical', ARRAY['4b30cee0-448e-479c-9927-96dc76d17cd1'], 10, 1, 'daily', 1),
('Deep Breathing', 'Practice 10 minutes of breathwork daily', 'physical', ARRAY['5ef11d83-d3ba-4410-be99-c248a0713a14'], 10, 1, 'daily', 1),

-- Mental Habits
('Daily Reading', 'Read for 30 minutes to expand knowledge', 'cognitive', ARRAY['bc0e93ba-488b-4000-97c2-fe5df6341b53', 'cde2de09-9ce1-4971-b3f8-21b941622d69'], 10, 1, 'daily', 2),
('Time Blocking', 'Plan your day with time blocks', 'cognitive', ARRAY['fe8c74b5-bac7-4cdc-8391-e2fbb20ffc5c'], 10, 1, 'daily', 2),
('Problem Solving Practice', 'Solve one challenging problem daily', 'cognitive', ARRAY['86963e5d-9bcc-45d2-b4db-b01eee6d4e23', '1dffd208-2946-4e57-b80c-279a23e9bc1e'], 10, 1, 'daily', 3),

-- Spiritual Habits
('Morning Meditation', 'Meditate for 15 minutes each morning', 'spiritual', ARRAY['c45eddd4-660b-4bd5-8fdb-516772cab0a7', '2aa8a313-1e77-4288-85e8-d85f337fb462'], 10, 1, 'daily', 2),
('Evening Reflection', 'Reflect on your day before bed', 'spiritual', ARRAY['7d649a01-a03b-482f-82cc-6248e5c0d5fc', '6cd99875-b638-48fe-bc15-8d7f7d60f45d'], 10, 1, 'daily', 1),
('Gratitude Practice', 'Write down 3 things you are grateful for', 'spiritual', ARRAY['afac2c42-4c84-4b31-9458-a6e98e09b6ba'], 10, 1, 'daily', 1),

-- Social Habits
('Connect with Someone', 'Reach out to a friend or colleague', 'social', ARRAY['029877e7-6067-4508-95c3-39889430315c', 'bd689e1f-941e-4374-b647-021c2eccdf5e'], 10, 1, 'daily', 1),
('Practice Empathy', 'Try to understand someone else''s perspective', 'social', ARRAY['729578db-7e95-480e-ba04-52f1ec9400d7'], 10, 1, 'daily', 2),

-- Creative Habits
('Daily Journaling', 'Write in your journal for 10 minutes', 'creative', ARRAY['ae890576-71a0-4390-902a-79625b91ab5b', '7d649a01-a03b-482f-82cc-6248e5c0d5fc'], 10, 1, 'daily', 1),
('Creative Expression', 'Engage in any creative activity', 'creative', ARRAY['38a68fb3-80bd-443c-a157-8a9bf1a15774'], 10, 1, 'daily', 2);

-- ==================== SAMPLE TOOLBOX DATA ====================

-- Insert some sample toolbox items
INSERT INTO public.toolbox_library (title, description, category, skill_tags, xp_reward, skill_reward, can_convert_to_habit, difficulty_level) VALUES
-- Learning Tools
('Pomodoro Technique', 'Time management method using 25-minute focused work sessions', 'cognitive', ARRAY['fe8c74b5-bac7-4cdc-8391-e2fbb20ffc5c'], 15, 2, true, 2),
('Mind Mapping', 'Visual technique for organizing thoughts and ideas', 'cognitive', ARRAY['1dffd208-2946-4e57-b80c-279a23e9bc1e', '86963e5d-9bcc-45d2-b4db-b01eee6d4e23'], 15, 2, true, 2),
('Active Recall', 'Learning technique that involves actively retrieving information', 'cognitive', ARRAY['20d8a253-94d2-49ed-bb90-b3a3fc296a79', 'cde2de09-9ce1-4971-b3f8-21b941622d69'], 15, 2, true, 3),

-- Wellness Tools
('Body Scan Meditation', 'Mindfulness practice focusing on physical sensations', 'spiritual', ARRAY['c45eddd4-660b-4bd5-8fdb-516772cab0a7', '2aa8a313-1e77-4288-85e8-d85f337fb462'], 15, 2, true, 2),
('Progressive Muscle Relaxation', 'Technique for reducing physical tension', 'physical', ARRAY['5ef11d83-d3ba-4410-be99-c248a0713a14', 'afac2c42-4c84-4b31-9458-a6e98e09b6ba'], 15, 2, true, 2),

-- Social Tools
('Active Listening', 'Communication technique focused on understanding others', 'social', ARRAY['bd689e1f-941e-4374-b647-021c2eccdf5e', '729578db-7e95-480e-ba04-52f1ec9400d7'], 15, 2, true, 2),
('Feedback Sandwich', 'Method for giving constructive feedback', 'social', ARRAY['cd3e3c54-cdba-4a19-a9f6-e456fdb8fa24', 'bd689e1f-941e-4374-b647-021c2eccdf5e'], 15, 2, true, 3);

-- ==================== COMPLETION MESSAGE ====================

-- This will show a success message when the schema is created
DO $$
BEGIN
    RAISE NOTICE '🎉 Skills and Mastery System created successfully!';
    RAISE NOTICE '🏆 % master stats inserted', (SELECT COUNT(*) FROM public.master_stats);
    RAISE NOTICE '📊 % skills inserted', (SELECT COUNT(*) FROM public.skills);
    RAISE NOTICE '🎯 % sample habits created', (SELECT COUNT(*) FROM public.habits_library);
    RAISE NOTICE '🛠️ % toolbox items created', (SELECT COUNT(*) FROM public.toolbox_library);
    RAISE NOTICE '✅ All tables, indexes, and policies are ready!';
    RAISE NOTICE '🎮 RPG-like skill system is now active!';
END $$;
