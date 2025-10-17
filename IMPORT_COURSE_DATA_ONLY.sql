-- =====================================================
-- COURSE DATA IMPORT ONLY - NO TABLE CREATION
-- =====================================================
-- This script ONLY imports course data into existing tables
-- Execute this in Supabase SQL Editor

-- First, clear any existing data to avoid conflicts
DELETE FROM course_metadata;

-- Insert ALL course metadata records exactly as provided in CSV
INSERT INTO course_metadata (
    course_id, 
    course_title, 
    school_name, 
    masterschool, 
    teacher_id, 
    difficulty_level, 
    topic, 
    duration_hours, 
    xp_threshold, 
    master_skill_linked, 
    stats_linked, 
    status, 
    created_at, 
    updated_at
) VALUES 

-- Course 1: The Shock Doctrine (ID: 22)
(498493852, 'The Shock Doctrine: The Rise of Disaster Capitalism', 'School of Foundational Knowledge', 'Ignition', '8c94448d-e21c-4b7b-be9a-88a5692dc5d6', '3D', 'Disaster Capitalism', 0, 715, NULL, ARRAY['awareness_habit', 'psychology_habit', 'advocacy_habit'], 'published', '2025-09-05 05:29:16.355527+00', '2025-09-12 08:46:06.228603+00'),

-- Course 2: The Politics of Ecstasy (ID: 23)
(-1211732545, 'The Politics of Ecstasy: Psychedelics, Consciousness, and Society', 'School of Foundational Knowledge', 'Insight', '8c94448d-e21c-4b7b-be9a-88a5692dc5d6', '3D', 'Psychedelics & Society', 0, 715, NULL, ARRAY['awareness_habit', 'psychology_habit', 'advocacy_habit'], 'published', '2025-09-05 05:31:45.3617+00', '2025-09-12 08:46:15.694285+00'),

-- Course 3: Hermetic Philosophy (ID: 44)
(-1048589509, 'The Foundations and Practice of Hermetic Philosophy: An Analytical Study of The Kybalion', 'School of Foundational Knowledge', 'Transformation', '8c94448d-e21c-4b7b-be9a-88a5692dc5d6', 'Focused', 'Hermetic Philosophy', 0, 430, NULL, ARRAY['psychology_habit', 'awareness_habit', 'reading_habit'], 'published', '2025-09-18 02:24:52.317995+00', '2025-09-18 04:18:46.639386+00'),

-- Course 4: Media Ecology (ID: 46)
(2043436001, 'Media Ecology and the Transformation of Public Discourse in America', 'School of Foundational Knowledge', 'Insight', NULL, '3D', 'Media Ecology', 0, 715, NULL, ARRAY['awareness_habit', 'psychology_habit', 'reading_habit'], 'published', '2025-09-18 09:13:22.974292+00', '2025-09-18 09:13:22.974292+00'),

-- Course 5: Self-Compassion (ID: 58)
(-211735735, 'The Mindful Path to Self-Compassion: Integrating Mindfulness, Acceptance, and Loving-Kindness for Emotional Healing', 'School of Foundational Knowledge', 'Transformation', NULL, 'Focused', 'Self-Compassion', 0, 430, NULL, ARRAY['awareness_habit', 'meditation_habit', 'psychology_habit'], 'published', '2025-09-18 09:19:54.208738+00', '2025-09-18 09:19:54.208738+00'),

-- Course 6: The Power of Assumption (ID: 97)
(-744437687, 'The Power of Assumption: Consciousness, Imagination, and Manifestation in Neville Goddard''s Teachings', 'School of Foundational Knowledge', 'Transformation', NULL, 'Zoomed In', 'Loi de l''Assomption', 0, 620, NULL, ARRAY['awareness_habit', 'psychology_habit', 'consistency_habit'], 'published', '2025-09-20 01:56:59.345056+00', '2025-09-20 01:56:59.345056+00');

-- Verify the import with exact counts and distribution
SELECT 
    'COURSE COUNT BY MASTERSCHOOL' as summary,
    masterschool,
    COUNT(*) as course_count,
    STRING_AGG(course_title, ' | ') as courses
FROM course_metadata 
GROUP BY masterschool
ORDER BY masterschool;

-- Verify all courses imported correctly
SELECT 
    'ALL COURSES VERIFICATION' as summary,
    course_id,
    course_title,
    masterschool,
    difficulty_level,
    topic,
    xp_threshold,
    stats_linked,
    CASE 
        WHEN teacher_id IS NOT NULL THEN 'Has Teacher'
        ELSE 'No Teacher'
    END as teacher_status
FROM course_metadata 
ORDER BY masterschool, xp_threshold;

-- =====================================================
-- EXPECTED RESULTS AFTER EXECUTION:
-- =====================================================
-- Ignition: 1 course (The Shock Doctrine - 715 XP)
-- Insight: 2 courses (The Politics of Ecstasy - 715 XP, Media Ecology - 715 XP)
-- Transformation: 3 courses (Hermetic Philosophy - 430 XP, Self-Compassion - 430 XP, The Power of Assumption - 620 XP)
-- Total: 6 courses
-- =====================================================
