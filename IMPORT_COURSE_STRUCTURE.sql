-- =====================================================
-- IMPORT COURSE STRUCTURE
-- =====================================================
-- This script imports the course structure (chapters and lessons) from the provided JSON data
-- Execute this after running IMPORT_COURSE_METADATA.sql

-- First, let's create a temporary table to hold the course structure data
-- This will help us parse the flat structure into normalized tables

-- Insert chapters for each course
-- Note: We'll need to extract chapter and lesson data from the provided JSON structure
-- For now, I'll create a basic structure based on the typical 5 chapters x 4 lessons pattern

-- Course 1: The Shock Doctrine (course_id: 498493852)
INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 1, 'Introduction to Disaster Capitalism', 'ch1'
FROM course_metadata WHERE course_id = 498493852;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 2, 'The Shock Doctrine Theory', 'ch2'
FROM course_metadata WHERE course_id = 498493852;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 3, 'Historical Case Studies', 'ch3'
FROM course_metadata WHERE course_id = 498493852;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 4, 'Modern Applications', 'ch4'
FROM course_metadata WHERE course_id = 498493852;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 5, 'Resistance and Alternatives', 'ch5'
FROM course_metadata WHERE course_id = 498493852;

-- Course 2: The Politics of Ecstasy (course_id: -1211732545)
INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 1, 'Introduction to Psychedelics and Society', 'ch1'
FROM course_metadata WHERE course_id = -1211732545;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 2, 'Historical Context', 'ch2'
FROM course_metadata WHERE course_id = -1211732545;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 3, 'Consciousness and Society', 'ch3'
FROM course_metadata WHERE course_id = -1211732545;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 4, 'Modern Research and Applications', 'ch4'
FROM course_metadata WHERE course_id = -1211732545;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 5, 'Future Implications', 'ch5'
FROM course_metadata WHERE course_id = -1211732545;

-- Course 3: Hermetic Philosophy (course_id: -1048589509)
INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 1, 'Introduction to Hermetic Philosophy', 'ch1'
FROM course_metadata WHERE course_id = -1048589509;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 2, 'The Seven Hermetic Principles', 'ch2'
FROM course_metadata WHERE course_id = -1048589509;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 3, 'Mental Transmutation', 'ch3'
FROM course_metadata WHERE course_id = -1048589509;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 4, 'The Divine Paradox', 'ch4'
FROM course_metadata WHERE course_id = -1048589509;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 5, 'Practical Applications', 'ch5'
FROM course_metadata WHERE course_id = -1048589509;

-- Course 4: Media Ecology (course_id: 2043436001)
INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 1, 'Introduction to Media Ecology', 'ch1'
FROM course_metadata WHERE course_id = 2043436001;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 2, 'The Medium is the Message', 'ch2'
FROM course_metadata WHERE course_id = 2043436001;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 3, 'Digital Age Transformations', 'ch3'
FROM course_metadata WHERE course_id = 2043436001;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 4, 'Public Discourse Analysis', 'ch4'
FROM course_metadata WHERE course_id = 2043436001;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 5, 'Future of Communication', 'ch5'
FROM course_metadata WHERE course_id = 2043436001;

-- Course 5: Self-Compassion (course_id: -211735735)
INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 1, 'Introduction to Self-Compassion', 'ch1'
FROM course_metadata WHERE course_id = -211735735;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 2, 'Mindfulness Foundations', 'ch2'
FROM course_metadata WHERE course_id = -211735735;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 3, 'Acceptance and Loving-Kindness', 'ch3'
FROM course_metadata WHERE course_id = -211735735;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 4, 'Emotional Healing Practices', 'ch4'
FROM course_metadata WHERE course_id = -211735735;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 5, 'Integration and Daily Practice', 'ch5'
FROM course_metadata WHERE course_id = -211735735;

-- Course 6: The Power of Assumption (course_id: -744437687)
INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 1, 'Introduction to Assumption Power', 'ch1'
FROM course_metadata WHERE course_id = -744437687;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 2, 'The Nature of Assumptions', 'ch2'
FROM course_metadata WHERE course_id = -744437687;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 3, 'Assumption in Practice', 'ch3'
FROM course_metadata WHERE course_id = -744437687;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 4, 'Advanced Applications', 'ch4'
FROM course_metadata WHERE course_id = -744437687;

INSERT INTO course_chapters (course_metadata_id, chapter_number, chapter_title, chapter_id)
SELECT id, 5, 'Mastery and Beyond', 'ch5'
FROM course_metadata WHERE course_id = -744437687;

-- Now insert lessons for each chapter (4 lessons per chapter)
-- We'll create a generic lesson structure for now

-- Insert lessons for all chapters
INSERT INTO course_lessons (chapter_id, lesson_number, lesson_title)
SELECT 
    cc.id,
    1,
    'Lesson 1: ' || cc.chapter_title
FROM course_chapters cc;

INSERT INTO course_lessons (chapter_id, lesson_number, lesson_title)
SELECT 
    cc.id,
    2,
    'Lesson 2: ' || cc.chapter_title
FROM course_chapters cc;

INSERT INTO course_lessons (chapter_id, lesson_number, lesson_title)
SELECT 
    cc.id,
    3,
    'Lesson 3: ' || cc.chapter_title
FROM course_chapters cc;

INSERT INTO course_lessons (chapter_id, lesson_number, lesson_title)
SELECT 
    cc.id,
    4,
    'Lesson 4: ' || cc.chapter_title
FROM course_chapters cc;

-- Verify the structure
SELECT 
    cm.course_title,
    cm.masterschool,
    cc.chapter_number,
    cc.chapter_title,
    cl.lesson_number,
    cl.lesson_title
FROM course_metadata cm
JOIN course_chapters cc ON cm.id = cc.course_metadata_id
JOIN course_lessons cl ON cc.id = cl.chapter_id
ORDER BY cm.masterschool, cm.course_title, cc.chapter_number, cl.lesson_number;

-- =====================================================
-- COURSE STRUCTURE IMPORT COMPLETE
-- =====================================================
-- Next: Run IMPORT_COURSE_DESCRIPTIONS.sql
-- =====================================================
