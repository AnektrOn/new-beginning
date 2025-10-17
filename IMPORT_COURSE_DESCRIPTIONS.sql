-- =====================================================
-- IMPORT COURSE DESCRIPTIONS
-- =====================================================
-- This script imports course descriptions for chapters and lessons
-- Execute this after running IMPORT_COURSE_STRUCTURE.sql

-- Insert chapter descriptions
INSERT INTO course_descriptions (course_metadata_id, chapter_number, chapter_description)
SELECT 
    cm.id,
    cc.chapter_number,
    'This chapter explores the fundamental concepts of ' || cc.chapter_title || ' and provides a comprehensive introduction to the key principles and practices involved.'
FROM course_metadata cm
JOIN course_chapters cc ON cm.id = cc.course_metadata_id;

-- Insert lesson descriptions
INSERT INTO course_descriptions (course_metadata_id, chapter_number, lesson_number, lesson_description)
SELECT 
    cm.id,
    cc.chapter_number,
    cl.lesson_number,
    'This lesson delves deeper into ' || cl.lesson_title || ', providing practical insights and actionable knowledge that you can apply in your daily life.'
FROM course_metadata cm
JOIN course_chapters cc ON cm.id = cc.course_metadata_id
JOIN course_lessons cl ON cc.id = cl.chapter_id;

-- Verify the descriptions
SELECT 
    cm.course_title,
    cm.masterschool,
    cd.chapter_number,
    cd.chapter_description,
    cd.lesson_number,
    cd.lesson_description
FROM course_metadata cm
JOIN course_descriptions cd ON cm.id = cd.course_metadata_id
ORDER BY cm.masterschool, cm.course_title, cd.chapter_number, cd.lesson_number;

-- =====================================================
-- COURSE DESCRIPTIONS IMPORT COMPLETE
-- =====================================================
-- Next: Run IMPORT_COURSE_CONTENT.sql
-- =====================================================
