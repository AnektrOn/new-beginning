# Complete Course Data Migration Guide

## Overview
This guide will help you migrate all course data to match your actual database structure (denormalized tables).

## Migration Order

Execute these SQL files in your Supabase SQL Editor **in this exact order**:

### Step 1: Schema Migration
**File:** `CORRECT_COURSE_SCHEMA_MIGRATION.sql`

**What it does:**
- Creates all course tables with the correct denormalized structure
- Sets up RLS policies
- Creates helper functions
- Updates `award_lesson_xp` function to match your schema

**Status:** ✅ Ready to run

---

### Step 2: Course Metadata (if not already imported)
**File:** `COMPLETE_COURSE_METADATA_IMPORT.sql`

**What it does:**
- Imports 6 courses:
  - The Shock Doctrine (Ignition)
  - The Politics of Ecstasy (Insight)
  - Media Ecology (Insight)
  - Hermetic Philosophy (Transformation)
  - Self-Compassion (Transformation)
  - The Power of Assumption (Transformation)

**Status:** ⚠️ May already exist - check if you have data in `course_metadata` table

---

### Step 3: Course Structure
**File:** `MIGRATE_COURSE_STRUCTURE_DATA.sql`

**What it does:**
- Imports denormalized course structure
- Maps chapters and lessons for all 6 courses
- Uses the actual IDs from your database

**Status:** ✅ Ready to run

---

### Step 4: Course Descriptions
**File:** `MIGRATE_COURSE_DESCRIPTION_DATA.sql`

**What it does:**
- Imports chapter and lesson descriptions
- Uses denormalized format (chapter_1_description, lesson_1_1_description, etc.)
- Covers all 6 courses

**Status:** ✅ Ready to run

---

### Step 5: Course Content (Optional)
**File:** `IMPORT_COURSE_CONTENT_DATA.sql`

**What it does:**
- Imports detailed lesson content (hook, key terms, concepts, synthesis, takeaways)
- This data may not exist for all courses yet

**Status:** ⚠️ Check if you have this data

---

## Table Structure Summary

### course_metadata
- Stores course information (title, school, difficulty, XP threshold)
- Uses both `id` (UUID) and `course_id` (INTEGER)

### course_structure (DENORMALIZED)
- One row per course
- Contains all chapters and lessons in columns
- Format: `chapter_title_1`, `lesson_1_1`, `lesson_1_2`, etc.

### course_description (DENORMALIZED)
- One row per course
- Contains all chapter and lesson descriptions
- Format: `chapter_1_description`, `lesson_1_1_description`, etc.

### course_content
- Multiple rows per course (one per lesson)
- Contains detailed lesson content
- References lesson by `course_id`, `chapter_number`, `lesson_number`

### user_course_progress
- Tracks user progress at course level
- Uses `course_id` (INTEGER) not UUID

### user_lesson_progress
- Tracks user progress at lesson level
- Uses `course_id` (INTEGER), `chapter_number`, `lesson_number`

---

## Quick Check

Before migrating, verify your current state:

```sql
-- Check if course_metadata exists and has data
SELECT COUNT(*) FROM course_metadata;

-- Check if course_structure exists
SELECT COUNT(*) FROM course_structure;

-- Check if course_description exists
SELECT COUNT(*) FROM course_description;
```

---

## After Migration

Once all scripts are run, verify:

```sql
-- Verify all courses are imported
SELECT course_id, course_title, masterschool FROM course_metadata ORDER BY masterschool;

-- Verify structures
SELECT id, course_id, chapter_count, chapter_title_1 FROM course_structure;

-- Verify descriptions
SELECT id, course_id, chapter_1_description FROM course_description;
```

---

## Testing

After migration, test the course flow:

1. Navigate to `/courses` in the app
2. You should see 6 courses grouped by school
3. Ignition courses should be unlocked (no XP required)
4. Other courses should show XP threshold
5. Click on a course to see its structure
6. Click on a lesson to view content

---

## Troubleshooting

**Error: "relation already exists"**
- The migration script uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen
- If it does, the table already exists - skip to data migration steps

**Error: "course_id does not exist"**
- Run `COMPLETE_COURSE_METADATA_IMPORT.sql` first
- This creates the base course records

**Error: "foreign key violation"**
- Ensure course_metadata is populated before importing structure/descriptions

**Missing course_content**
- This is optional - courses will work without detailed content
- Just descriptions and titles will show

---

## Summary

✅ **Schema:** `CORRECT_COURSE_SCHEMA_MIGRATION.sql`  
✅ **Structure:** `MIGRATE_COURSE_STRUCTURE_DATA.sql`  
✅ **Descriptions:** `MIGRATE_COURSE_DESCRIPTION_DATA.sql`  
⚠️ **Content:** `IMPORT_COURSE_CONTENT_DATA.sql` (optional)

Run these in order and your course system will be fully operational.

