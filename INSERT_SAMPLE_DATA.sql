-- Insert Sample Habits and Toolbox Data
-- Run this in your Supabase SQL Editor to fix the flickering

-- ==================== INSERT SAMPLE HABITS ====================

INSERT INTO public.habits_library (title, description, category, skill_tags, xp_reward, frequency_type) VALUES
-- Physical & Health Habits
('Morning Workout', 'Start your day with physical exercise', 'physical', ARRAY['4ad13e10-5e10-400c-82cf-2649479a981f', '887cbb15-ec9a-4f09-a4c7-7657e1b0ddf1'], 10, 'daily'),
('Healthy Breakfast', 'Eat a nutritious morning meal', 'physical', ARRAY['4b30cee0-448e-479c-9927-96dc76d17cd1'], 10, 'daily'),
('Deep Breathing', 'Practice breathing exercises for 5 minutes', 'physical', ARRAY['5ef11d83-d3ba-4410-be99-c248a0713a14'], 10, 'daily'),

-- Mental & Learning Habits
('Daily Reading', 'Read for at least 30 minutes', 'mental', ARRAY['bc0e93ba-488b-4000-97c2-fe5df6341b53', 'cde2de09-9ce1-4971-b3f8-21b941622d69'], 10, 'daily'),
('Time Blocking', 'Plan your day with time blocks', 'mental', ARRAY['fe8c74b5-bac7-4cdc-8391-e2fbb20ffc5c', '7e4d9759-3a64-4084-9bd2-805ded61d30e'], 10, 'daily'),
('Problem Solving Practice', 'Work on a challenging problem for 20 minutes', 'mental', ARRAY['110b005b-8998-4bbc-86d0-254274d90878', '1dffd208-2946-4e57-b80c-279a23e9bc1e'], 10, 'daily'),

-- Spiritual & Mindfulness Habits
('Morning Meditation', 'Meditate for 10-15 minutes', 'spiritual', ARRAY['c45eddd4-660b-4bd5-8fdb-516772cab0a7', '2aa8a313-1e77-4288-85e8-d85f337fb462'], 10, 'daily'),
('Evening Reflection', 'Reflect on your day and lessons learned', 'spiritual', ARRAY['7d649a01-a03b-482f-82cc-6248e5c0d5fc', 'ae890576-71a0-4390-902a-79625b91ab5b'], 10, 'daily'),
('Gratitude Practice', 'Write down 3 things you are grateful for', 'spiritual', ARRAY['38a68fb3-80bd-443c-a157-8a9bf1a15774', '7d649a01-a03b-482f-82cc-6248e5c0d5fc'], 10, 'daily'),

-- Social & Communication Habits
('Connect with Someone', 'Reach out to a friend, family member, or colleague', 'social', ARRAY['cd3e3c54-cdba-4a19-a9f6-e456fdb8fa24', 'bd689e1f-941e-4374-b647-021c2eccdf5e'], 10, 'daily'),
('Practice Empathy', 'Try to understand someone else perspective today', 'social', ARRAY['729578db-7e95-480e-ba04-52f1ec9400d7', '2aa8a313-1e77-4288-85e8-d85f337fb462'], 10, 'daily'),

-- Creative & Expressive Habits
('Daily Journaling', 'Write in your journal for 15 minutes', 'creative', ARRAY['ae890576-71a0-4390-902a-79625b91ab5b', '38a68fb3-80bd-443c-a157-8a9bf1a15774'], 10, 'daily'),
('Creative Expression', 'Engage in any creative activity', 'creative', ARRAY['38a68fb3-80bd-443c-a157-8a9bf1a15774', '5eae0e71-bc16-43b1-ac8d-300789ae665a'], 10, 'daily');

-- ==================== INSERT SAMPLE TOOLBOX ITEMS ====================

INSERT INTO public.toolbox_library (title, description, category, skill_tags, xp_reward, can_convert_to_habit) VALUES
-- Learning Tools
('Pomodoro Technique', '25-minute focused work sessions with 5-minute breaks', 'learning', ARRAY['fe8c74b5-bac7-4cdc-8391-e2fbb20ffc5c', 'cde2de09-9ce1-4971-b3f8-21b941622d69'], 25, true),
('Mind Mapping', 'Visual technique for organizing thoughts and ideas', 'learning', ARRAY['1dffd208-2946-4e57-b80c-279a23e9bc1e', '38a68fb3-80bd-443c-a157-8a9bf1a15774'], 30, true),
('Active Recall', 'Testing yourself on material to improve retention', 'learning', ARRAY['20d8a253-94d2-49ed-bb90-b3a3fc296a79', 'cde2de09-9ce1-4971-b3f8-21b941622d69'], 35, true),

-- Wellness Tools
('Body Scan Meditation', 'Progressive relaxation technique', 'wellness', ARRAY['c45eddd4-660b-4bd5-8fdb-516772cab0a7', '2aa8a313-1e77-4288-85e8-d85f337fb462'], 20, true),
('Progressive Muscle Relaxation', 'Tension and release technique for stress relief', 'wellness', ARRAY['5ef11d83-d3ba-4410-be99-c248a0713a14', 'afac2c42-4c84-4b31-9458-a6e98e09b6ba'], 25, true),
('Gratitude Journaling', 'Structured approach to gratitude practice', 'wellness', ARRAY['ae890576-71a0-4390-902a-79625b91ab5b', '7d649a01-a03b-482f-82cc-6248e5c0d5fc'], 15, true),

-- Social Tools
('Active Listening', 'Communication technique focused on understanding others', 'social', ARRAY['bd689e1f-941e-4374-b647-021c2eccdf5e', '729578db-7e95-480e-ba04-52f1ec9400d7'], 40, true),
('Feedback Sandwich', 'Method for giving constructive feedback', 'social', ARRAY['cd3e3c54-cdba-4a19-a9f6-e456fdb8fa24', 'bd689e1f-941e-4374-b647-021c2eccdf5e'], 50, true);

-- ==================== SUCCESS MESSAGE ====================

DO $$
BEGIN
    RAISE NOTICE '🎉 Sample data inserted successfully!';
    RAISE NOTICE '🎯 % habits added to library', (SELECT COUNT(*) FROM public.habits_library);
    RAISE NOTICE '🛠️ % toolbox items added to library', (SELECT COUNT(*) FROM public.toolbox_library);
    RAISE NOTICE '✅ Flickering should now be fixed!';
END $$;
