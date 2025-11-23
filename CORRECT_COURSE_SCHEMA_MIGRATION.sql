-- =====================================================
-- CORRECT COURSE SCHEMA MIGRATION
-- =====================================================
-- This script resets the course-related tables so they match the
-- denormalised structure used by the live database.
-- It is SAFE to re-run. All tables are dropped before being recreated.
--
-- Tables created:
--   - course_metadata         (left intact if it already exists)
--   - course_structure        (denormalised: chapter_title_1, lesson_1_1, ...)
--   - course_description      (denormalised: chapter_1_description, lesson_1_1_description, ...)
--   - course_content
--   - user_course_progress
--   - user_lesson_progress
--
-- Functions created / replaced:
--   - update_updated_at_column
--   - get_user_unlocked_courses
--   - award_lesson_xp
-- =====================================================

-- =====================================================
-- STEP 0 - DROP LEGACY / NORMALISED TABLES IF THEY STILL EXIST
-- =====================================================
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS course_chapters CASCADE;

-- Drop current course tables so we can recreate them with the correct structure
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_course_progress CASCADE;
DROP TABLE IF EXISTS course_content CASCADE;
DROP TABLE IF EXISTS course_description CASCADE;
DROP TABLE IF EXISTS course_structure CASCADE;

-- =====================================================
-- STEP 1 - ENSURE course_metadata EXISTS (PRESERVE DATA IF IT DOES)
-- =====================================================
CREATE TABLE IF NOT EXISTS course_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id INTEGER UNIQUE,               -- Legacy integer identifier used in data imports
    course_title TEXT NOT NULL,
    school_name TEXT NOT NULL,
    masterschool TEXT NOT NULL,
    teacher_id UUID REFERENCES profiles(id),
    difficulty_level TEXT,
    topic TEXT,
    duration_hours INTEGER DEFAULT 0,
    xp_threshold INTEGER DEFAULT 0,
    master_skill_linked TEXT,
    stats_linked TEXT[],
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_metadata_course_id ON course_metadata(course_id);
CREATE INDEX IF NOT EXISTS idx_course_metadata_masterschool ON course_metadata(masterschool);
CREATE INDEX IF NOT EXISTS idx_course_metadata_status ON course_metadata(status);
CREATE INDEX IF NOT EXISTS idx_course_metadata_xp_threshold ON course_metadata(xp_threshold);

ALTER TABLE course_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON course_metadata;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_metadata;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_metadata;

CREATE POLICY "Enable read access for all users" ON course_metadata FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_metadata FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_metadata FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- STEP 2 - CREATE DENORMALISED course_structure TABLE
-- =====================================================
CREATE TABLE course_structure (
    id INTEGER PRIMARY KEY,                              -- Matches the IDs in the legacy dataset
    course_id INTEGER NOT NULL REFERENCES course_metadata(course_id) ON DELETE CASCADE,
    chapter_count SMALLINT DEFAULT 0,
    -- Chapter 1
    chapter_title_1 TEXT,
    lesson_1_1 TEXT,
    lesson_1_2 TEXT,
    lesson_1_3 TEXT,
    lesson_1_4 TEXT,
    chapter_id_1 TEXT,
    -- Chapter 2
    chapter_title_2 TEXT,
    lesson_2_1 TEXT,
    lesson_2_2 TEXT,
    lesson_2_3 TEXT,
    lesson_2_4 TEXT,
    chapter_id_2 TEXT,
    -- Chapter 3
    chapter_title_3 TEXT,
    lesson_3_1 TEXT,
    lesson_3_2 TEXT,
    lesson_3_3 TEXT,
    lesson_3_4 TEXT,
    chapter_id_3 TEXT,
    -- Chapter 4
    chapter_title_4 TEXT,
    lesson_4_1 TEXT,
    lesson_4_2 TEXT,
    lesson_4_3 TEXT,
    lesson_4_4 TEXT,
    chapter_id_4 TEXT,
    -- Chapter 5
    chapter_title_5 TEXT,
    lesson_5_1 TEXT,
    lesson_5_2 TEXT,
    lesson_5_3 TEXT,
    lesson_5_4 TEXT,
    chapter_id_5 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_course_structure_course_id ON course_structure(course_id);

ALTER TABLE course_structure ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON course_structure;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_structure;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_structure;

CREATE POLICY "Enable read access for all users" ON course_structure FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_structure FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_structure FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- STEP 3 - CREATE DENORMALISED course_description TABLE
-- =====================================================
CREATE TABLE course_description (
    id INTEGER PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES course_metadata(course_id) ON DELETE CASCADE,
    -- Chapter 1 descriptions
    chapter_1_description TEXT,
    lesson_1_1_description TEXT,
    lesson_1_2_description TEXT,
    lesson_1_3_description TEXT,
    lesson_1_4_description TEXT,
    chapter_id_1 TEXT,
    -- Chapter 2 descriptions
    chapter_2_description TEXT,
    lesson_2_1_description TEXT,
    lesson_2_2_description TEXT,
    lesson_2_3_description TEXT,
    lesson_2_4_description TEXT,
    chapter_id_2 TEXT,
    -- Chapter 3 descriptions
    chapter_3_description TEXT,
    lesson_3_1_description TEXT,
    lesson_3_2_description TEXT,
    lesson_3_3_description TEXT,
    lesson_3_4_description TEXT,
    chapter_id_3 TEXT,
    -- Chapter 4 descriptions
    chapter_4_description TEXT,
    lesson_4_1_description TEXT,
    lesson_4_2_description TEXT,
    lesson_4_3_description TEXT,
    lesson_4_4_description TEXT,
    chapter_id_4 TEXT,
    -- Chapter 5 descriptions
    chapter_5_description TEXT,
    lesson_5_1_description TEXT,
    lesson_5_2_description TEXT,
    lesson_5_3_description TEXT,
    lesson_5_4_description TEXT,
    chapter_id_5 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_course_description_course_id ON course_description(course_id);

ALTER TABLE course_description ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON course_description;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_description;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_description;

CREATE POLICY "Enable read access for all users" ON course_description FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_description FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_description FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- STEP 4 - CREATE course_content TABLE
-- =====================================================
CREATE TABLE course_content (
    id INTEGER PRIMARY KEY,                              -- Matches the IDs in the legacy dataset
    lesson_id TEXT NOT NULL,
    course_id INTEGER NOT NULL REFERENCES course_metadata(course_id) ON DELETE CASCADE,
    chapter_number SMALLINT,
    lesson_number SMALLINT,
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
    chapter_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_course_content_lesson_identity ON course_content(course_id, chapter_number, lesson_number);
CREATE UNIQUE INDEX idx_course_content_lesson_id ON course_content(lesson_id);
CREATE INDEX idx_course_content_course_id ON course_content(course_id);

ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON course_content;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_content;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_content;

CREATE POLICY "Enable read access for all users" ON course_content FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_content FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- STEP 5 - CREATE user_course_progress TABLE
-- =====================================================
CREATE TABLE user_course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES course_metadata(course_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage SMALLINT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    last_accessed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX idx_user_course_progress_status ON user_course_progress(status);

ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_course_progress;

CREATE POLICY "Users can view their own progress" ON user_course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_course_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_course_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- STEP 6 - CREATE user_lesson_progress TABLE
-- =====================================================
CREATE TABLE user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES course_metadata(course_id) ON DELETE CASCADE,
    chapter_number SMALLINT NOT NULL,
    lesson_number SMALLINT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id, chapter_number, lesson_number)
);

CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_course_id ON user_lesson_progress(course_id);
CREATE INDEX idx_user_lesson_progress_is_completed ON user_lesson_progress(is_completed);

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON user_lesson_progress;

CREATE POLICY "Users can view their own lesson progress" ON user_lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress" ON user_lesson_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" ON user_lesson_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- STEP 7 - TRIGGERS TO KEEP updated_at FRESH
-- =====================================================
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers so they can be recreated cleanly
DROP TRIGGER IF EXISTS update_course_metadata_updated_at ON course_metadata;
DROP TRIGGER IF EXISTS update_course_structure_updated_at ON course_structure;
DROP TRIGGER IF EXISTS update_course_description_updated_at ON course_description;
DROP TRIGGER IF EXISTS update_course_content_updated_at ON course_content;
DROP TRIGGER IF EXISTS update_user_course_progress_updated_at ON user_course_progress;
DROP TRIGGER IF EXISTS update_user_lesson_progress_updated_at ON user_lesson_progress;

CREATE TRIGGER update_course_metadata_updated_at
    BEFORE UPDATE ON course_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_structure_updated_at
    BEFORE UPDATE ON course_structure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_description_updated_at
    BEFORE UPDATE ON course_description
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_content_updated_at
    BEFORE UPDATE ON course_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at
    BEFORE UPDATE ON user_course_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_lesson_progress_updated_at
    BEFORE UPDATE ON user_lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 8 - HELPER FUNCTIONS
-- =====================================================
DROP FUNCTION IF EXISTS get_user_unlocked_courses(UUID);
DROP FUNCTION IF EXISTS award_lesson_xp(UUID, INTEGER, INTEGER, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION get_user_unlocked_courses(user_id UUID)
RETURNS TABLE (
    course_id INTEGER,
    course_title TEXT,
    masterschool TEXT,
    difficulty_level TEXT,
    xp_threshold INTEGER,
    is_unlocked BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cm.course_id,
        cm.course_title,
        cm.masterschool,
        cm.difficulty_level,
        cm.xp_threshold,
        (cm.masterschool = 'Ignition' OR p.current_xp >= cm.xp_threshold) AS is_unlocked
    FROM course_metadata cm
    JOIN profiles p ON p.id = user_id
    WHERE cm.status = 'published'
    ORDER BY cm.masterschool, cm.xp_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION award_lesson_xp(
    user_id UUID,
    course_id INTEGER,
    chapter_number INTEGER,
    lesson_number INTEGER,
    xp_amount INTEGER DEFAULT 50
) RETURNS BOOLEAN AS $$
BEGIN
    -- Insert XP transaction if the table exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'xp_transactions'
    ) THEN
        INSERT INTO xp_transactions (user_id, amount, source_type, description)
        VALUES (
            user_id,
            xp_amount,
            'lesson_completion',
            'Completed lesson: course ' || course_id || ', chapter ' || chapter_number || ', lesson ' || lesson_number
        )
        ON CONFLICT DO NOTHING;
    END IF;

    -- Update profile XP totals
    UPDATE profiles
    SET
        current_xp = COALESCE(current_xp, 0) + xp_amount,
        total_xp_earned = COALESCE(total_xp_earned, 0) + xp_amount,
        updated_at = NOW()
    WHERE id = user_id;

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Tables are now aligned with the denormalised dataset provided.
-- You can proceed with the data migration scripts:
--   1. MIGRATE_COURSE_STRUCTURE_DATA.sql
--   2. MIGRATE_COURSE_DESCRIPTION_DATA.sql
--   3. (Optional) IMPORT_COURSE_CONTENT_DATA.sql
-- =====================================================

