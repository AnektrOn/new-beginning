-- Add show_in_calendar field to user_habits table
-- Run this in Supabase SQL Editor

ALTER TABLE public.user_habits 
ADD COLUMN IF NOT EXISTS show_in_calendar BOOLEAN DEFAULT false;

-- Update existing habits to have show_in_calendar = false by default
UPDATE public.user_habits 
SET show_in_calendar = false 
WHERE show_in_calendar IS NULL;

-- Add comment to document the field
COMMENT ON COLUMN public.user_habits.show_in_calendar IS 'Whether this habit should be displayed in the calendar view (focused habits)';
