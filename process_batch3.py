#!/usr/bin/env python3
"""Process batch 3 (entries 40-59) from CSV and generate SQL migration"""
import csv
import json
import sys
import io

# Import the generation function from the main script
sys.path.insert(0, '.')
from generate_migration_batch import generate_sql_entry

# Read CSV from stdin
csv_data = sys.stdin.read()

# Parse CSV (handle quoted fields properly)
csv_reader = csv.DictReader(io.StringIO(csv_data))

# Convert to list of dicts
entries = list(csv_reader)

print(f"Total entries parsed: {len(entries)}", file=sys.stderr)

# Extract batch 3 (entries 40-59, which are indices 40-59)
if len(entries) < 60:
    print(f"Warning: Only {len(entries)} entries found, need at least 60 for batch 3", file=sys.stderr)
    batch = entries[40:] if len(entries) > 40 else []
    print(f"Using {len(batch)} entries for batch 3", file=sys.stderr)
else:
    batch = entries[40:60]
    print(f"Extracted entries 40-59 ({len(batch)} entries)", file=sys.stderr)

# Generate SQL entries
sql_entries = []
for entry in batch:
    # Convert CSV row to expected format
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

# Output SQL file content
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
print(",\n".join(sql_entries) + ";")
print()
print(f"-- Generated {len(sql_entries)} entries")

