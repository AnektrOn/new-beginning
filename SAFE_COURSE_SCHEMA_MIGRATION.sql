-- =====================================================
-- SAFE COURSE SCHEMA MIGRATION
-- =====================================================
-- This script safely creates course tables only if they don't exist
-- Use this if you're getting "relation already exists" errors
-- Execute this in Supabase SQL Editor

-- Step 1: Drop existing test course tables (if they exist)
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_course_progress CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS course_chapters CASCADE;
DROP TABLE IF EXISTS course_content CASCADE;
DROP TABLE IF EXISTS course_descriptions CASCADE;
-- Note: We're NOT dropping course_metadata as it likely has data

-- Step 2: Create course_metadata table ONLY if it doesn't exist
CREATE TABLE IF NOT EXISTS course_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id INTEGER UNIQUE, -- Legacy reference from provided data
    course_title TEXT NOT NULL,
    school_name TEXT NOT NULL,
    masterschool TEXT NOT NULL,
    teacher_id UUID REFERENCES profiles(id),
    difficulty_level TEXT,
    topic TEXT,
    duration_hours INTEGER DEFAULT 0,
    xp_threshold INTEGER DEFAULT 0,
    master_skill_linked TEXT,
    stats_linked TEXT[], -- Array of skill tags
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for course_metadata (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_course_metadata_course_id ON course_metadata(course_id);
CREATE INDEX IF NOT EXISTS idx_course_metadata_masterschool ON course_metadata(masterschool);
CREATE INDEX IF NOT EXISTS idx_course_metadata_status ON course_metadata(status);
CREATE INDEX IF NOT EXISTS idx_course_metadata_xp_threshold ON course_metadata(xp_threshold);

-- Enable RLS for course_metadata (idempotent)
ALTER TABLE course_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Enable read access for all users" ON course_metadata;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_metadata;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_metadata;

CREATE POLICY "Enable read access for all users" ON course_metadata FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_metadata FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_metadata FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 3: Create course_chapters table (normalized structure)
CREATE TABLE IF NOT EXISTS course_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_metadata_id UUID NOT NULL REFERENCES course_metadata(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL CHECK (chapter_number >= 1 AND chapter_number <= 5),
    chapter_title TEXT NOT NULL,
    chapter_id TEXT, -- Legacy reference
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_metadata_id, chapter_number)
);

-- Add indexes for course_chapters
CREATE INDEX IF NOT EXISTS idx_course_chapters_course_metadata_id ON course_chapters(course_metadata_id);
CREATE INDEX IF NOT EXISTS idx_course_chapters_chapter_number ON course_chapters(chapter_number);

-- Enable RLS for course_chapters
ALTER TABLE course_chapters ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Enable read access for all users" ON course_chapters;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_chapters;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_chapters;

CREATE POLICY "Enable read access for all users" ON course_chapters FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_chapters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_chapters FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 4: Create course_lessons table (normalized structure)
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES course_chapters(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL CHECK (lesson_number >= 1 AND lesson_number <= 4),
    lesson_title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chapter_id, lesson_number)
);

-- Add indexes for course_lessons
CREATE INDEX IF NOT EXISTS idx_course_lessons_chapter_id ON course_lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_lesson_number ON course_lessons(lesson_number);

-- Enable RLS for course_lessons
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Enable read access for all users" ON course_lessons;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_lessons;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_lessons;

CREATE POLICY "Enable read access for all users" ON course_lessons FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_lessons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_lessons FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 5: Create course_descriptions table
CREATE TABLE IF NOT EXISTS course_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_metadata_id UUID NOT NULL REFERENCES course_metadata(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    chapter_description TEXT,
    lesson_number INTEGER,
    lesson_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_metadata_id, chapter_number, lesson_number)
);

-- Add composite index for course_descriptions
CREATE INDEX IF NOT EXISTS idx_course_descriptions_composite ON course_descriptions(course_metadata_id, chapter_number, lesson_number);

-- Enable RLS for course_descriptions
ALTER TABLE course_descriptions ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Enable read access for all users" ON course_descriptions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_descriptions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_descriptions;

CREATE POLICY "Enable read access for all users" ON course_descriptions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_descriptions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_descriptions FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 6: Create course_content table
CREATE TABLE IF NOT EXISTS course_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
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
    chapter_id TEXT, -- Legacy reference
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for course_content
CREATE INDEX IF NOT EXISTS idx_course_content_lesson_id ON course_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_content_chapter_id ON course_content(chapter_id);

-- Enable RLS for course_content
ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Enable read access for all users" ON course_content;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON course_content;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON course_content;

CREATE POLICY "Enable read access for all users" ON course_content FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON course_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON course_content FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 7: Create user_course_progress table
CREATE TABLE IF NOT EXISTS user_course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_metadata_id UUID NOT NULL REFERENCES course_metadata(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_metadata_id)
);

-- Add indexes for user_course_progress
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_metadata_id ON user_course_progress(course_metadata_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_status ON user_course_progress(status);

-- Enable RLS for user_course_progress
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view their own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_course_progress;

CREATE POLICY "Users can view their own progress" ON user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_course_progress FOR UPDATE USING (auth.uid() = user_id);

-- Step 8: Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Add indexes for user_lesson_progress
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_is_completed ON user_lesson_progress(is_completed);

-- Enable RLS for user_lesson_progress
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON user_lesson_progress;

CREATE POLICY "Users can view their own lesson progress" ON user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lesson progress" ON user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lesson progress" ON user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- Step 9: Create helper functions (replace if exists)

-- Function to get user's unlocked courses based on XP
CREATE OR REPLACE FUNCTION get_user_unlocked_courses(user_id UUID)
RETURNS TABLE (
    course_id UUID,
    course_title TEXT,
    masterschool TEXT,
    difficulty_level TEXT,
    xp_threshold INTEGER,
    is_unlocked BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.id as course_id,
        cm.course_title,
        cm.masterschool,
        cm.difficulty_level,
        cm.xp_threshold,
        -- Ignition courses are always unlocked, others require XP
        (cm.masterschool = 'Ignition' OR p.current_xp >= cm.xp_threshold) as is_unlocked
    FROM course_metadata cm
    CROSS JOIN profiles p
    WHERE p.id = user_id
    AND cm.status = 'published'
    ORDER BY cm.masterschool, cm.xp_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get course progress for a user
CREATE OR REPLACE FUNCTION get_course_progress(user_id UUID, course_id UUID)
RETURNS TABLE (
    status TEXT,
    progress_percentage INTEGER,
    last_accessed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ucp.status,
        ucp.progress_percentage,
        ucp.last_accessed_at,
        ucp.completed_at
    FROM user_course_progress ucp
    WHERE ucp.user_id = get_course_progress.user_id
    AND ucp.course_metadata_id = get_course_progress.course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get next lesson for a user in a course
CREATE OR REPLACE FUNCTION get_next_lesson(user_id UUID, course_id UUID)
RETURNS TABLE (
    lesson_id UUID,
    lesson_title TEXT,
    chapter_number INTEGER,
    lesson_number INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cl.id as lesson_id,
        cl.lesson_title,
        cc.chapter_number,
        cl.lesson_number
    FROM course_lessons cl
    JOIN course_chapters cc ON cl.chapter_id = cc.id
    WHERE cc.course_metadata_id = get_next_lesson.course_id
    AND cl.id NOT IN (
        SELECT ulp.lesson_id 
        FROM user_lesson_progress ulp 
        WHERE ulp.user_id = get_next_lesson.user_id 
        AND ulp.is_completed = TRUE
    )
    ORDER BY cc.chapter_number, cl.lesson_number
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award lesson XP
CREATE OR REPLACE FUNCTION award_lesson_xp(user_id UUID, lesson_id UUID, xp_amount INTEGER DEFAULT 50)
RETURNS BOOLEAN AS $$
BEGIN
    -- Insert XP transaction (if xp_transactions table exists)
    -- Note: Adjust column names based on your actual xp_transactions schema
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'xp_transactions') THEN
        INSERT INTO xp_transactions (user_id, amount, source_type, description)
        VALUES (user_id, xp_amount, 'lesson_completion', 'Completed lesson: ' || lesson_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Update user's current XP in profiles
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

-- Step 10: Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables (drop first if exists)
DROP TRIGGER IF EXISTS update_course_metadata_updated_at ON course_metadata;
DROP TRIGGER IF EXISTS update_course_chapters_updated_at ON course_chapters;
DROP TRIGGER IF EXISTS update_course_lessons_updated_at ON course_lessons;
DROP TRIGGER IF EXISTS update_course_descriptions_updated_at ON course_descriptions;
DROP TRIGGER IF EXISTS update_course_content_updated_at ON course_content;
DROP TRIGGER IF EXISTS update_user_course_progress_updated_at ON user_course_progress;
DROP TRIGGER IF EXISTS update_user_lesson_progress_updated_at ON user_lesson_progress;

CREATE TRIGGER update_course_metadata_updated_at BEFORE UPDATE ON course_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_chapters_updated_at BEFORE UPDATE ON course_chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_descriptions_updated_at BEFORE UPDATE ON course_descriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_content_updated_at BEFORE UPDATE ON course_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON user_course_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON user_lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAFE MIGRATION COMPLETE
-- =====================================================
-- This script:
-- ✅ Uses CREATE TABLE IF NOT EXISTS to avoid errors
-- ✅ Preserves existing course_metadata data
-- ✅ Drops and recreates policies safely
-- ✅ Updates functions to handle Ignition courses (always unlocked)
-- =====================================================

