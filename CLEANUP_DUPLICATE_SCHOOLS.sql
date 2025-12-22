-- =====================================================
-- CLEANUP DUPLICATE SCHOOLS - Remove Case Variants
-- =====================================================
-- This script removes duplicate schools, keeping only capitalized versions

-- Step 1: Delete all lowercase and variant entries, keep only capitalized
DELETE FROM schools 
WHERE name IN ('ignition', 'insight', 'transformation', 'god_mode', 'godmode')
   OR name != INITCAP(name);

-- Step 2: Handle "God Mode" special case - delete "god_mode" if it exists
DELETE FROM schools WHERE LOWER(name) = 'god_mode' OR LOWER(name) = 'godmode';

-- Step 3: Ensure name column has unique constraint
DO $$
BEGIN
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'schools_name_key' 
        AND conrelid = 'schools'::regclass
    ) THEN
        ALTER TABLE schools ADD CONSTRAINT schools_name_key UNIQUE (name);
    END IF;
END $$;

-- Step 4: Verify cleanup - should only show 4 schools
SELECT 
    name,
    display_name,
    unlock_xp,
    order_index,
    CASE 
        WHEN unlock_xp = 0 THEN 'Always Unlocked'
        ELSE unlock_xp::TEXT || ' XP Required'
    END AS unlock_requirement
FROM schools
ORDER BY order_index;

