-- App Shell Database Setup
-- Run this SQL in your Supabase SQL editor to add the required columns

-- Add columns to profiles table for App Shell features
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_image_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Add columns to user_preferences table for right sidebar preferences
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS right_sidebar_collapsed BOOLEAN DEFAULT FALSE;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS visible_widgets JSONB DEFAULT '["profile", "calendar", "notifications", "progress", "leaderboard"]';
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS widget_order JSONB DEFAULT '["profile", "calendar", "notifications", "progress", "leaderboard"]';

-- Create Supabase Storage bucket for user background images
-- Note: This needs to be done in the Supabase Dashboard under Storage
-- Bucket name: user_backgrounds
-- Public: false
-- File size limit: 5MB
-- Allowed types: image/jpeg, image/png, image/webp

-- RLS policies for the new columns (if needed)
-- The existing RLS policies should already cover these new columns
-- since they're added to existing tables with existing policies
