#!/usr/bin/env python3
"""Generate batch 3 SQL from CSV data - extract entries 40-59"""
import csv
import sys
import io

# Import the generation function
sys.path.insert(0, '.')
from generate_migration_batch import generate_sql_entry

# Based on the CSV data provided, entries 40-59 have these IDs:
# Entry 40: 189, 41: 194, 42: 190, 43: 195, 44: 191, 45: 196, 46: 192, 47: 200,
# 48: 269, 49: 264, 50: 266, 51: 270, 52: 268, 53: 271, 54: 274, 55: 272,
# 56: 267, 57: 263, 58: 273, 59: 265, then 60: 183, 61: 188, 62: 180, 63: 185,
# 64: 178, 65: 187, 66: 179, 67: 184, 68: 182, 69: 186, 70: 181

# Read CSV from stdin
csv_data = sys.stdin.read()

# Parse CSV
reader = csv.DictReader(io.StringIO(csv_data))
all_entries = list(reader)

print(f"Total entries parsed: {len(all_entries)}", file=sys.stderr)

# Extract batch 3 (entries 40-59, indices 40-59)
if len(all_entries) < 60:
    print(f"Error: Need at least 60 entries, got {len(all_entries)}", file=sys.stderr)
    print("Please provide the full CSV data with all entries.", file=sys.stderr)
    sys.exit(1)

batch3 = all_entries[40:60]
print(f"Extracted batch 3: entries {len(batch3)} (indices 40-59)", file=sys.stderr)
if batch3:
    print(f"First entry ID: {batch3[0]['id']}, Last entry ID: {batch3[-1]['id']}", file=sys.stderr)

# Generate SQL entries
sql_entries = []
for entry in batch3:
    entry_dict = {
        'id': int(entry['id']),
        'lesson_id': entry['lesson_id'],
        'lesson_title': entry['lesson_title'],
        'the_hook': entry['the_hook'],
        'key_terms_1': entry['key_terms_1'],
        'key_terms_1_def': entry['key_terms_1_def'],
        'key_terms_2': entry['key_terms_2'],
        'key_terms_2_def': entry['key_terms_2_def'],
        'core_concepts_1': entry['core_concepts_1'],
        'core_concepts_1_def': entry['core_concepts_1_def'],
        'core_concepts_2': entry['core_concepts_2'],
        'core_concepts_2_def': entry['core_concepts_2_def'],
        'synthesis': entry['synthesis'],
        'connect_to_your_life': entry['connect_to_your_life'],
        'key_takeaways_1': entry['key_takeaways_1'],
        'key_takeaways_2': entry['key_takeaways_2'],
        'attached_to_chapter': entry['attached_to_chapter'],
        'attached_to_course': entry['attached_to_course'],
        'created_at': entry['created_at'],
        'updated_at': entry['updated_at'],
        'chapter_id': entry['chapter_id']
    }
    
    sql_entry = generate_sql_entry(entry_dict)
    if sql_entry:
        sql_entries.append(sql_entry)

# Output SQL
print("-- =====================================================")
print("-- MIGRATE COURSE CONTENT DATA - BATCH 3 (Entries 40-59)")
print("-- =====================================================")
print("-- Execute AFTER running:")
print("-- 1. CORRECT_COURSE_SCHEMA_MIGRATION.sql")
print("-- 2. MIGRATE_COURSE_STRUCTURE_DATA.sql")
print("-- 3. MIGRATE_COURSE_DESCRIPTION_DATA.sql")
print("-- 4. MIGRATE_COURSE_CONTENT_DATA_BATCH_1.sql")
print("-- 5. MIGRATE_COURSE_CONTENT_DATA_BATCH_2.sql")
print("--")
print("-- This imports the third batch of 20 lesson content entries")
print("-- Dollar-quoted strings ($$...$$) are used to avoid apostrophe escaping issues.")
print("-- =====================================================")
print()
print("INSERT INTO course_content (")
print("    id, lesson_id, course_id, chapter_number, lesson_number, lesson_title,")
print("    the_hook, key_terms_1, key_terms_1_def, key_terms_2, key_terms_2_def,")
print("    core_concepts_1, core_concepts_1_def, core_concepts_2, core_concepts_2_def,")
print("    synthesis, connect_to_your_life, key_takeaways_1, key_takeaways_2,")
print("    attached_to_chapter, attached_to_course, chapter_id, created_at, updated_at")
print(") VALUES")
if sql_entries:
    print(",\n".join(sql_entries) + ";")
else:
    print(";")
print()
print(f"-- Generated {len(sql_entries)} entries")

