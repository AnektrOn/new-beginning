-- Mastery System Database Schema
-- Run this in your Supabase SQL Editor

-- Global Habits Library
CREATE TABLE IF NOT EXISTS public.habits_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    skill_tags TEXT[] DEFAULT '{}',
    xp_reward INTEGER DEFAULT 10,
    frequency_type TEXT DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekly', 'monthly')),
    is_global BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Global Toolbox Library
CREATE TABLE IF NOT EXISTS public.toolbox_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    skill_tags TEXT[] DEFAULT '{}',
    xp_reward INTEGER DEFAULT 15,
    can_convert_to_habit BOOLEAN DEFAULT true,
    is_global BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Personal Habits
CREATE TABLE IF NOT EXISTS public.user_habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.habits_library(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    frequency_type TEXT DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekly', 'monthly')),
    xp_reward INTEGER DEFAULT 10,
    is_custom BOOLEAN DEFAULT false,
    completion_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Habit Completions (for tracking streaks and XP)
CREATE TABLE IF NOT EXISTS public.user_habit_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.user_habits(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    xp_earned INTEGER DEFAULT 0,
    notes TEXT
);

-- User Calendar Events (synced with Google Calendar)
CREATE TABLE IF NOT EXISTS public.user_calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.user_habits(id) ON DELETE CASCADE,
    toolbox_id UUID REFERENCES public.toolbox_library(id) ON DELETE CASCADE,
    google_event_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    is_completed BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Toolbox Items (converted from library)
CREATE TABLE IF NOT EXISTS public.user_toolbox_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    toolbox_id UUID NOT NULL REFERENCES public.toolbox_library(id) ON DELETE CASCADE,
    converted_to_habit_id UUID REFERENCES public.user_habits(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_habits_user_id ON public.user_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_habit_completions_user_id ON public.user_habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_calendar_events_user_id ON public.user_calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_calendar_events_date ON public.user_calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_user_toolbox_items_user_id ON public.user_toolbox_items(user_id);

-- RLS Policies
ALTER TABLE public.habits_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolbox_items ENABLE ROW LEVEL SECURITY;

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

-- Toolbox Library - Read for all, write for teachers/admins
CREATE POLICY "Anyone can read toolbox library" ON public.toolbox_library FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can insert toolbox items" ON public.toolbox_library FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('Teacher', 'Admin')
        )
    );

-- User Habits - Users can only access their own
CREATE POLICY "Users can manage their own habits" ON public.user_habits 
    FOR ALL USING (user_id = auth.uid());

-- User Habit Completions - Users can only access their own
CREATE POLICY "Users can manage their own habit completions" ON public.user_habit_completions 
    FOR ALL USING (user_id = auth.uid());

-- User Calendar Events - Users can only access their own
CREATE POLICY "Users can manage their own calendar events" ON public.user_calendar_events 
    FOR ALL USING (user_id = auth.uid());

-- User Toolbox Items - Users can only access their own
CREATE POLICY "Users can manage their own toolbox items" ON public.user_toolbox_items 
    FOR ALL USING (user_id = auth.uid());
