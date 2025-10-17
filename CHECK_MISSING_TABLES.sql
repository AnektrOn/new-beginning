-- Check what tables are missing data
-- Run this in your Supabase SQL Editor to diagnose the issue

-- Check if skills and master stats tables exist and have data
DO $$
BEGIN
    -- Check master_stats table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'master_stats' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ master_stats table exists with % rows', (SELECT COUNT(*) FROM public.master_stats);
    ELSE
        RAISE NOTICE '❌ master_stats table MISSING - run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
    
    -- Check skills table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'skills' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ skills table exists with % rows', (SELECT COUNT(*) FROM public.skills);
    ELSE
        RAISE NOTICE '❌ skills table MISSING - run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
    
    -- Check habits_library table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'habits_library' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ habits_library table exists with % rows', (SELECT COUNT(*) FROM public.habits_library);
    ELSE
        RAISE NOTICE '❌ habits_library table MISSING';
    END IF;
    
    -- Check toolbox_library table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolbox_library' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ toolbox_library table exists with % rows', (SELECT COUNT(*) FROM public.toolbox_library);
    ELSE
        RAISE NOTICE '❌ toolbox_library table MISSING';
    END IF;
    
    -- Check user_skills table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_skills' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ user_skills table exists with % rows', (SELECT COUNT(*) FROM public.user_skills);
    ELSE
        RAISE NOTICE '❌ user_skills table MISSING - run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
    
    -- Check user_master_stats table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_master_stats' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ user_master_stats table exists with % rows', (SELECT COUNT(*) FROM public.user_master_stats);
    ELSE
        RAISE NOTICE '❌ user_master_stats table MISSING - run SKILLS_AND_MASTERY_SCHEMA.sql first';
    END IF;
END $$;
