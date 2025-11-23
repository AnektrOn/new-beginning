-- =====================================================
-- FIX DUPLICATE MASTERSCHOOLS - Normalize Case
-- =====================================================
-- This script normalizes masterschool values to have capital first letter
-- Only keeps the capitalized version (e.g., "Ignition" not "ignition")

-- Step 1: Update all masterschool values to have capital first letter
UPDATE course_metadata
SET masterschool = INITCAP(masterschool)
WHERE masterschool != INITCAP(masterschool);

-- Step 2: Handle special case "God Mode" (two words)
UPDATE course_metadata
SET masterschool = 'God Mode'
WHERE LOWER(masterschool) = 'god mode' OR LOWER(masterschool) = 'godmode';

-- Step 3: Verify the fix - show unique masterschool values
SELECT 
    masterschool,
    COUNT(*) as course_count
FROM course_metadata
GROUP BY masterschool
ORDER BY masterschool;

-- Step 4: Show any remaining duplicates (case-insensitive)
SELECT 
    LOWER(masterschool) as normalized_name,
    COUNT(DISTINCT masterschool) as variant_count,
    array_agg(DISTINCT masterschool) as variants
FROM course_metadata
GROUP BY LOWER(masterschool)
HAVING COUNT(DISTINCT masterschool) > 1;

