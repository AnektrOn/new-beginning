-- Corrected Schema Fix for Skills & Mastery System
-- Run this in your Supabase SQL Editor to fix all issues

-- ==================== ADD MISSING COLUMNS ====================

-- Add skill_tags column to user_habits if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_habits' 
        AND column_name = 'skill_tags'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.user_habits 
        ADD COLUMN skill_tags TEXT[] DEFAULT '{}';
        RAISE NOTICE '✅ Added skill_tags column to user_habits';
    END IF;
END $$;

-- Add skill_reward column to user_habits if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_habits' 
        AND column_name = 'skill_reward'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.user_habits 
        ADD COLUMN skill_reward INTEGER DEFAULT 1;
        RAISE NOTICE '✅ Added skill_reward column to user_habits';
    END IF;
END $$;

-- Add xp_reward column to user_habits if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_habits' 
        AND column_name = 'xp_reward'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.user_habits 
        ADD COLUMN xp_reward INTEGER DEFAULT 10;
        RAISE NOTICE '✅ Added xp_reward column to user_habits';
    END IF;
END $$;

-- ==================== UPDATE EXISTING DATA ====================

-- Update user_habits with skill_tags from habits_library (only if habits_library has skill_tags)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'habits_library' 
        AND column_name = 'skill_tags'
        AND table_schema = 'public'
    ) THEN
        UPDATE public.user_habits 
        SET skill_tags = (
            SELECT hl.skill_tags 
            FROM public.habits_library hl 
            WHERE hl.id = user_habits.habit_id
        )
        WHERE skill_tags IS NULL OR array_length(skill_tags, 1) IS NULL;
        
        RAISE NOTICE '✅ Updated user_habits with skill_tags from habits_library';
    ELSE
        RAISE NOTICE '⚠️ habits_library.skill_tags column not found - skipping update';
    END IF;
END $$;

-- Set default values for skill_reward and xp_reward
UPDATE public.user_habits 
SET skill_reward = 1
WHERE skill_reward IS NULL;

UPDATE public.user_habits 
SET xp_reward = 10
WHERE xp_reward IS NULL;

-- ==================== DROP DUPLICATE POLICIES ====================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read habits library" ON public.habits_library;
DROP POLICY IF EXISTS "Teachers and admins can insert habits" ON public.habits_library;
DROP POLICY IF EXISTS "Teachers and admins can update habits" ON public.habits_library;
DROP POLICY IF EXISTS "Teachers and admins can delete habits" ON public.habits_library;

-- ==================== RECREATE POLICIES ====================

-- Habits Library - Read for all, write for teachers/admins
CREATE POLICY "Anyone can read habits library" ON public.habits_library FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can insert habits" ON public.habits_library FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('Teacher', 'Admin')
        )
    );
CREATE POLICY "Teachers and admins can update habits" ON public.habits_library FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('Teacher', 'Admin')
        )
    );
CREATE POLICY "Teachers and admins can delete habits" ON public.habits_library FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('Teacher', 'Admin')
        )
    );

-- ==================== VERIFY TABLES EXIST ====================

-- Check if all required tables exist and create if missing
DO $$
BEGIN
    -- Check master_stats table
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'master_stats' AND table_schema = 'public') THEN
        RAISE NOTICE '⚠️ master_stats table missing - please run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
    
    -- Check skills table
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'skills' AND table_schema = 'public') THEN
        RAISE NOTICE '⚠️ skills table missing - please run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
    
    -- Check user_skills table
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_skills' AND table_schema = 'public') THEN
        RAISE NOTICE '⚠️ user_skills table missing - please run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
    
    -- Check user_master_stats table
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_master_stats' AND table_schema = 'public') THEN
        RAISE NOTICE '⚠️ user_master_stats table missing - please run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
END $$;

-- ==================== SUCCESS MESSAGE ====================

DO $$
BEGIN
    RAISE NOTICE '🎉 Corrected schema fix completed!';
    RAISE NOTICE '📊 Updated % user habits with skill data', (
        SELECT COUNT(*) FROM public.user_habits WHERE skill_tags IS NOT NULL
    );
    RAISE NOTICE '✅ All required columns are now present!';
    RAISE NOTICE '🔒 RLS policies recreated successfully!';
    RAISE NOTICE '🚀 Skills system should now work correctly!';
END $$;
