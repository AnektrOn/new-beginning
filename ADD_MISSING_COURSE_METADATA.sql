-- =====================================================
-- ADD MISSING COURSE METADATA
-- =====================================================
-- This script adds the missing "Introduction to Computer Science" course
-- to course_metadata so that course_content can reference it.
-- =====================================================

-- Add "Introduction to Computer Science" course (course_id: 33)
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
) VALUES (
    33,
    'Introduction to Computer Science',
    'School of Foundational Knowledge',
    'Ignition',  -- Assuming it's an Ignition course (always unlocked)
    NULL,  -- No teacher_id specified
    'Focused',  -- Default difficulty level
    'Computer Science',
    0,  -- Duration not specified
    0,  -- XP threshold - 0 means always unlocked (Ignition course)
    NULL,
    ARRAY[]::TEXT[],  -- Empty array for stats_linked
    'published',
    NOW(),
    NOW()
)
ON CONFLICT (course_id) DO NOTHING;  -- Don't error if it already exists

-- Verify the course was added
SELECT 
    course_id,
    course_title,
    masterschool,
    xp_threshold,
    status
FROM course_metadata
WHERE course_id = 33;

