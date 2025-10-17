-- =====================================================
-- IMPORT COURSE METADATA
-- =====================================================
-- This script imports the course metadata from the provided JSON data
-- Execute this after running CREATE_NEXUS_DATABASE_SCHEMA.sql

-- Insert course metadata records
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
-- Course 1: The Shock Doctrine
(498493852, 'The Shock Doctrine: The Rise of Disaster Capitalism', 'School of Foundational Knowledge', 'Ignition', '30d7e7b8-2f26-4079-ba98-9d2e9e974126', '3D', 'Disaster Capitalism', 0, 715, NULL, ARRAY['awareness_habit', 'psychology_habit', 'advocacy_habit'], 'published', '2025-09-05 05:29:16.355527+00', '2025-09-12 08:46:06.228603+00'),

-- Course 2: The Politics of Ecstasy
(-1211732545, 'The Politics of Ecstasy: Psychedelics, Consciousness, and Society', 'School of Foundational Knowledge', 'Insight', '30d7e7b8-2f26-4079-ba98-9d2e9e974126', '3D', 'Psychedelics & Society', 0, 715, NULL, ARRAY['awareness_habit', 'psychology_habit', 'advocacy_habit'], 'published', '2025-09-05 05:31:45.3617+00', '2025-09-12 08:46:15.694285+00'),

-- Course 3: Hermetic Philosophy
(-1048589509, 'The Foundations and Practice of Hermetic Philosophy: An Analytical Study of The Kybalion', 'School of Foundational Knowledge', 'Transformation', '30d7e7b8-2f26-4079-ba98-9d2e9e974126', 'Focused', 'Hermetic Philosophy', 0, 430, NULL, ARRAY['psychology_habit', 'awareness_habit', 'reading_habit'], 'published', '2025-09-18 02:24:52.317995+00', '2025-09-18 04:18:46.639386+00'),

-- Course 4: Media Ecology
(2043436001, 'Media Ecology and the Transformation of Public Discourse in America', 'School of Foundational Knowledge', 'Insight', NULL, '3D', 'Media Ecology', 0, 715, NULL, ARRAY['awareness_habit', 'psychology_habit', 'reading_habit'], 'published', '2025-09-18 09:13:22.974292+00', '2025-09-18 09:13:22.974292+00'),

-- Course 5: Self-Compassion
(-211735735, 'The Mindful Path to Self-Compassion: Integrating Mindfulness, Acceptance, and Loving-Kindness for Emotional Healing', 'School of Foundational Knowledge', 'Transformation', NULL, 'Focused', 'Self-Compassion', 0, 430, NULL, ARRAY['awareness_habit', 'meditation_habit', 'psychology_habit'], 'published', '2025-09-18 09:19:54.208738+00', '2025-09-18 09:19:54.208738+00'),

-- Course 6: The Power of Assumption
(-744437687, 'The Power of Assumption: Consciousness, Imagination, and Manifestation in Neville Goddard''s Teachings', 'School of Foundational Knowledge', 'Transformation', NULL, 'Zoomed In', 'Loi de l''Assomption', 0, 620, NULL, ARRAY['awareness_habit', 'psychology_habit', 'consistency_habit'], 'published', '2025-09-20 01:56:59.345056+00', '2025-09-20 01:56:59.345056+00');

-- Verify the import
SELECT 
    course_id,
    course_title,
    masterschool,
    difficulty_level,
    xp_threshold,
    stats_linked
FROM course_metadata 
ORDER BY masterschool, xp_threshold;

-- =====================================================
-- COURSE METADATA IMPORT COMPLETE
-- =====================================================
-- Next: Run IMPORT_COURSE_STRUCTURE.sql
-- =====================================================
