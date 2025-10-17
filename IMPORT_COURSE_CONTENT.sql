-- =====================================================
-- IMPORT COURSE CONTENT
-- =====================================================
-- This script imports detailed lesson content
-- Execute this after running IMPORT_COURSE_DESCRIPTIONS.sql

-- Insert lesson content for all lessons
INSERT INTO course_content (
    lesson_id,
    lesson_title,
    the_hook,
    key_terms_1,
    key_terms_1_def,
    key_terms_2,
    key_terms_2_def,
    core_concepts_1,
    core_concepts_1_def,
    core_concepts_2,
    core_concepts_2_def,
    synthesis,
    connect_to_your_life,
    key_takeaways_1,
    key_takeaways_2,
    attached_to_chapter,
    attached_to_course,
    chapter_id
)
SELECT 
    cl.id,
    cl.lesson_title,
    'Welcome to ' || cl.lesson_title || '! This lesson will transform your understanding and provide you with practical tools for immediate application.',
    'Key Term 1',
    'Definition of the first key term that is essential for understanding this lesson.',
    'Key Term 2',
    'Definition of the second key term that builds upon the first and deepens your comprehension.',
    'Core Concept 1',
    'Detailed explanation of the first core concept, including its importance and practical applications.',
    'Core Concept 2',
    'Comprehensive exploration of the second core concept, showing how it connects to and enhances the first concept.',
    'This lesson synthesizes the key terms and core concepts into a unified understanding that you can apply immediately. The integration of these ideas creates a powerful framework for personal and professional growth.',
    'How can you apply these concepts in your daily life? Consider the specific situations where this knowledge would be most valuable and create a plan for implementation.',
    'The first key takeaway is the fundamental principle that underlies all the concepts in this lesson.',
    'The second key takeaway is the practical application that makes this knowledge immediately useful.',
    cc.chapter_title,
    cm.course_title,
    cc.chapter_id
FROM course_lessons cl
JOIN course_chapters cc ON cl.chapter_id = cc.id
JOIN course_metadata cm ON cc.course_metadata_id = cm.id;

-- Verify the content
SELECT 
    cm.course_title,
    cm.masterschool,
    cc.chapter_number,
    cl.lesson_number,
    cc.lesson_title,
    cc.the_hook,
    cc.key_terms_1,
    cc.core_concepts_1,
    cc.synthesis
FROM course_content cc
JOIN course_lessons cl ON cc.lesson_id = cl.id
JOIN course_chapters ch ON cl.chapter_id = ch.id
JOIN course_metadata cm ON ch.course_metadata_id = cm.id
ORDER BY cm.masterschool, cm.course_title, ch.chapter_number, cl.lesson_number
LIMIT 10;

-- =====================================================
-- COURSE CONTENT IMPORT COMPLETE
-- =====================================================
-- Database setup is now complete!
-- Next: Build the nexusService.js and UI components
-- =====================================================
