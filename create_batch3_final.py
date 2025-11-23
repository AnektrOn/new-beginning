#!/usr/bin/env python3
"""Generate batch 3 SQL from CSV data provided by user"""
import csv
import sys
import io
import json

# Import the generation function
sys.path.insert(0, '.')
from generate_migration_batch import generate_sql_entry

# Read CSV from stdin - user should pipe the full CSV data
csv_data = sys.stdin.read()

if not csv_data.strip():
    print("Error: No CSV data provided. Please pipe the CSV data to this script.", file=sys.stderr)
    sys.exit(1)

# Parse CSV
try:
    reader = csv.DictReader(io.StringIO(csv_data))
    all_entries = list(reader)
except Exception as e:
    print(f"Error parsing CSV: {e}", file=sys.stderr)
    sys.exit(1)

print(f"Total entries parsed: {len(all_entries)}", file=sys.stderr)

# Extract batch 3 (entries 40-59, indices 40-59)
# If we have fewer than 60 entries, check if these are already entries 40-59
if len(all_entries) >= 60:
    # Full dataset - extract entries 40-59
    batch3 = all_entries[40:60]
    print(f"Extracted batch 3: entries 40-59 ({len(batch3)} entries)", file=sys.stderr)
elif len(all_entries) >= 40:
    # Partial dataset starting from entry 40
    batch3 = all_entries[40:]
    print(f"Warning: Only {len(all_entries)} entries found, extracting entries 40-{len(all_entries)-1}", file=sys.stderr)
elif len(all_entries) == 20:
    # These are already entries 40-59 (20 entries)
    batch3 = all_entries
    print(f"Processing batch 3: {len(batch3)} entries (already entries 40-59)", file=sys.stderr)
else:
    print(f"Error: Need at least 20 entries for batch 3, got {len(all_entries)}", file=sys.stderr)
    sys.exit(1)

if batch3:
    print(f"First entry ID: {batch3[0]['id']}, Last entry ID: {batch3[-1]['id']}", file=sys.stderr)

# Generate SQL entries
sql_entries = []
for entry in batch3:
    try:
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
        else:
            print(f"Warning: Failed to generate SQL for entry {entry['id']}", file=sys.stderr)
    except Exception as e:
        print(f"Error processing entry {entry.get('id', 'unknown')}: {e}", file=sys.stderr)
        continue

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

