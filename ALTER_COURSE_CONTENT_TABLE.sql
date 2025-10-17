-- =====================================================
-- ALTER COURSE_CONTENT TABLE TO USE INTEGER IDS
-- =====================================================
-- This script modifies the course_content table to use integer IDs
-- instead of UUIDs to match the provided data format

-- 1. Drop the existing course_content table and recreate it with integer ID
DROP TABLE IF EXISTS course_content CASCADE;

-- 2. Recreate course_content table with integer ID
CREATE TABLE course_content (
    id INTEGER PRIMARY KEY,
    lesson_id TEXT UNIQUE NOT NULL, -- Changed from UUID to TEXT to match data
    lesson_title TEXT NOT NULL,
    the_hook TEXT,
    key_terms_1 TEXT,
    key_terms_1_def TEXT,
    key_terms_2 TEXT,
    key_terms_2_def TEXT,
    core_concepts_1 TEXT,
    core_concepts_1_def TEXT,
    core_concepts_2 TEXT,
    core_concepts_2_def TEXT,
    synthesis TEXT,
    connect_to_your_life TEXT,
    key_takeaways_1 TEXT,
    key_takeaways_2 TEXT,
    attached_to_chapter TEXT,
    attached_to_course TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    chapter_id TEXT -- Changed from UUID to TEXT to match data
);

-- 3. Add indexes for course_content
CREATE INDEX idx_course_content_lesson_id ON course_content(lesson_id);
CREATE INDEX idx_course_content_chapter_id ON course_content(chapter_id);
CREATE INDEX idx_course_content_attached_to_course ON course_content(attached_to_course);

-- 4. Enable RLS for course_content
ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for course_content
CREATE POLICY "Enable read access for all users" ON course_content FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_content FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. Create update trigger
CREATE TRIGGER update_course_content_updated_at 
    BEFORE UPDATE ON course_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COURSE_CONTENT TABLE ALTERED SUCCESSFULLY
-- =====================================================
-- The table now uses integer IDs and TEXT fields to match the provided data
-- Next: Run IMPORT_COURSE_CONTENT_DATA.sql
-- =====================================================
