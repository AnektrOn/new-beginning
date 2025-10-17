-- =====================================================
-- UPDATE COURSE METADATA TO MATCH EXACT CSV DATA
-- =====================================================
-- This script updates the existing course data to match the user's exact CSV format
-- Execute this in Supabase SQL Editor

-- Update Course 1: The Shock Doctrine (already correct, but ensuring teacher_id is set)
UPDATE course_metadata 
SET 
    teacher_id = '30d7e7b8-2f26-4079-ba98-9d2e9e974126'
WHERE course_id = 498493852;

-- Update Course 2: The Politics of Ecstasy (already correct, but ensuring teacher_id is set)
UPDATE course_metadata 
SET 
    teacher_id = '30d7e7b8-2f26-4079-ba98-9d2e9e974126'
WHERE course_id = -1211732545;

-- Update Course 3: Hermetic Philosophy (already correct, but ensuring teacher_id is set)
UPDATE course_metadata 
SET 
    teacher_id = '30d7e7b8-2f26-4079-ba98-9d2e9e974126'
WHERE course_id = -1048589509;

-- Update Course 4: Media Ecology (already correct, teacher_id should remain NULL)
-- No update needed for this course

-- Update Course 5: Self-Compassion (already correct, teacher_id should remain NULL)
-- No update needed for this course

-- Update Course 6: The Power of Assumption - MAJOR CORRECTIONS NEEDED
UPDATE course_metadata 
SET 
    course_title = 'The Power of Assumption: Consciousness, Imagination, and Manifestation in Neville Goddard''s Teachings',
    masterschool = 'Transformation',
    teacher_id = NULL,
    difficulty_level = 'Zoomed In',
    topic = 'Loi de l''Assomption',
    xp_threshold = 620,
    stats_linked = ARRAY['awareness_habit', 'psychology_habit', 'consistency_habit'],
    updated_at = NOW()
WHERE course_id = -744437687;

-- Verify the updates
SELECT 
    course_id,
    course_title,
    masterschool,
    difficulty_level,
    topic,
    xp_threshold,
    stats_linked,
    teacher_id
FROM course_metadata 
ORDER BY masterschool, xp_threshold;

-- =====================================================
-- COURSE METADATA UPDATE COMPLETE
-- =====================================================
-- Expected results:
-- Ignition: 1 course (The Shock Doctrine - 715 XP)
-- Insight: 2 courses (The Politics of Ecstasy - 715 XP, Media Ecology - 715 XP)
-- Transformation: 3 courses (Hermetic Philosophy - 430 XP, Self-Compassion - 430 XP, The Power of Assumption - 620 XP)
-- =====================================================
