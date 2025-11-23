# Database Migration Prompt for Gemini

Use this prompt when asking Gemini to help migrate course content data from your previous database to the new one:

---

## Migration Task: Course Content Data Migration

I need help migrating course content data from my previous database to a new Supabase PostgreSQL database. The data is in CSV format and needs to be converted into SQL INSERT statements with proper mappings.

### Current Setup

I have a Python script (`generate_migration_batch.py`) that:
- Maps course titles to `course_id`s
- Maps lesson titles to `chapter_number` and `lesson_number` based on course structure
- Generates SQL INSERT statements with dollar-quoted strings ($$...$$) to handle special characters
- Processes data in batches of 20 entries

### Data Format

The CSV data has the following columns:
- `id` - unique identifier
- `lesson_id` - lesson identifier
- `lesson_title` - title of the lesson
- `the_hook` - introductory question/text
- `key_terms_1`, `key_terms_1_def` - first key term and definition
- `key_terms_2`, `key_terms_2_def` - second key term and definition
- `core_concepts_1`, `core_concepts_1_def` - first core concept and definition
- `core_concepts_2`, `core_concepts_2_def` - second core concept and definition
- `synthesis` - synthesis text
- `connect_to_your_life` - reflection question
- `key_takeaways_1`, `key_takeaways_2` - key takeaways
- `attached_to_chapter` - chapter title
- `attached_to_course` - course title
- `created_at`, `updated_at` - timestamps
- `chapter_id` - chapter identifier

### Course ID Mappings

The following courses need to be mapped to their `course_id`s:
- "Introduction to Computer Science" → 33
- "Media Ecology and the Transformation of Public Discourse in America" → 2043436001
- "The Foundations and Practice of Hermetic Philosophy: An Analytical Study of The Kybalion" → -1048589509
- "The Mindful Path to Self-Compassion: Integrating Mindfulness, Acceptance, and Loving-Kindness for Emotional Healing" → -211735735
- "The Politics of Ecstasy: Psychedelics, Consciousness, and Society" → -1211732545
- "The Power of Assumption: Consciousness, Imagination, and Manifestation in Neville Goddard's Teachings" → -744437687
- "The Shock Doctrine: The Rise of Disaster Capitalism" → 498493852

### Course Structure Mapping

Each course has a specific structure with chapters and lessons. The mapping is done by matching `lesson_title` to get `(course_id, chapter_number, lesson_number)`. The full lesson mapping is in `generate_migration_batch.py`.

Key mappings include:
- **Introduction to Computer Science (33)**: 6 lessons across 3 chapters
- **Media Ecology (2043436001)**: 12 lessons across 3 chapters
- **Hermetic Philosophy (-1048589509)**: 12 lessons across 3 chapters
- **Self-Compassion (-211735735)**: 12 lessons across 3 chapters
- **Politics of Ecstasy (-1211732545)**: 12 lessons across 3 chapters
- **Power of Assumption (-744437687)**: 12 lessons across 3 chapters
- **Shock Doctrine (498493852)**: Multiple lessons (see full mapping)

The script needs to:
1. Match the `attached_to_course` field to get the `course_id`
2. Match the `lesson_title` to determine `chapter_number` and `lesson_number` from the LESSON_MAP
3. Handle edge cases like lesson titles with "(Part 1)" suffixes by stripping them before matching
4. If a match is not found, skip the entry with a warning

### SQL Output Format

The SQL INSERT statement should:
- Use dollar-quoting ($$...$$) for all text fields to avoid apostrophe escaping issues
- Follow this column order:
  ```
  id, lesson_id, course_id, chapter_number, lesson_number, lesson_title,
  the_hook, key_terms_1, key_terms_1_def, key_terms_2, key_terms_2_def,
  core_concepts_1, core_concepts_1_def, core_concepts_2, core_concepts_2_def,
  synthesis, connect_to_your_life, key_takeaways_1, key_takeaways_2,
  attached_to_chapter, attached_to_course, chapter_id, created_at, updated_at
  ```
- Include proper SQL comment headers indicating batch number and entry range
- Be formatted for readability

### Batch Processing

Data should be processed in batches of 20 entries:
- Batch 1: entries 0-19
- Batch 2: entries 20-39
- Batch 3: entries 40-59
- And so on...

Each batch should generate a separate SQL file: `MIGRATE_COURSE_CONTENT_DATA_BATCH_N.sql`

### What I Need

Please help me:
1. Process the remaining batches (batch 4, 5, etc.) from my CSV data
2. Ensure all course mappings are correct
3. Verify chapter/lesson number mappings match the course structure
4. Generate clean SQL files without any debug output or errors
5. Handle any edge cases or data inconsistencies

### Example Output Format

```sql
-- =====================================================
-- MIGRATE COURSE CONTENT DATA - BATCH N (Entries X-Y)
-- =====================================================
-- Execute AFTER running:
-- 1. CORRECT_COURSE_SCHEMA_MIGRATION.sql
-- 2. MIGRATE_COURSE_STRUCTURE_DATA.sql
-- 3. MIGRATE_COURSE_DESCRIPTION_DATA.sql
-- 4. MIGRATE_COURSE_CONTENT_DATA_BATCH_1.sql
-- ... (previous batches)
--
-- This imports the Nth batch of 20 lesson content entries
-- Dollar-quoted strings ($$...$$) are used to avoid apostrophe escaping issues.
-- =====================================================

INSERT INTO course_content (
    id, lesson_id, course_id, chapter_number, lesson_number, lesson_title,
    the_hook, key_terms_1, key_terms_1_def, key_terms_2, key_terms_2_def,
    core_concepts_1, core_concepts_1_def, core_concepts_2, core_concepts_2_def,
    synthesis, connect_to_your_life, key_takeaways_1, key_takeaways_2,
    attached_to_chapter, attached_to_course, chapter_id, created_at, updated_at
) VALUES
(entry1...),
(entry2...),
...
(entry20...);

-- Generated 20 entries
```

### Important Notes

- All text fields must use dollar-quoting ($$...$$) to handle apostrophes and special characters
- If a course_id or chapter/lesson mapping is not found, the entry should be skipped with a warning
- The script should handle CSV parsing correctly, including quoted fields with commas
- No debug output should be included in the final SQL file (redirect stderr to /dev/null)

---

**Please provide the CSV data for the next batch, and I'll generate the SQL migration file.**

