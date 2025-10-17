-- Add background_image column to profiles table
-- This allows users to set custom background images for their app shell

-- Add the background_image column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.background_image IS 'URL of the user''s custom background image for the app shell';

-- Create index for performance (optional, since it's not frequently queried)
CREATE INDEX IF NOT EXISTS idx_profiles_background_image ON profiles(background_image) WHERE background_image IS NOT NULL;
