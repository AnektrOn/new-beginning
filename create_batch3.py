#!/usr/bin/env python3
"""Create batch 3 SQL from CSV data provided by user"""
import csv
import sys
import io
import json

# Import the generation function
sys.path.insert(0, '.')
from generate_migration_batch import generate_sql_entry

# The CSV data from user message - entries 40-59
# Based on the pattern, entry 40 should be id 189 (Defining Ecstasy)
# Let me parse the CSV data provided

csv_data = """id,lesson_id,lesson_title,the_hook,key_terms_1,key_terms_1_def,key_terms_2,key_terms_2_def,core_concepts_1,core_concepts_1_def,core_concepts_2,core_concepts_2_def,synthesis,connect_to_your_life,key_takeaways_1,key_takeaways_2,attached_to_chapter,attached_to_course,created_at,updated_at,chapter_id
189,cc39db7c,"Defining Ecstasy: The Meaning, Process, and Political Context","What if the most powerful social revolution of the 20th century wasn't about politics, borders, or money — but about expanding the freedom of the individual mind itself? Welcome to the age of Ecstasy.",Ecstasy,"A state of surpassing normal understanding characterized by freedom from limitations, whether self-imposed or external. It is an ongoing on/off experience that creates moments of exalted delight, often leading to profound personal transformation.",Counter-culture,"A temporary, shared social movement formed when many people simultaneously experience ecstasy, creating a culture that challenges and opposes mainstream societal norms.",Ecstasy as an Experience of Individual Freedom,"Ecstasy is defined not just as a fleeting moment of pleasure but as an ongoing process of transcending limits—whether those are imposed by society, self-doubt, or biology. This experience unlocks a new kind of individual freedom focused on expanding awareness and breaking free from conventional restrictions of thought and behavior.",The Emergence of a Post-Political Society,"The 1960s revolution introduced a shift away from traditional political and geographic identities toward a society that values inner freedom above all else. This 'neo-society' is driven by ecstatic states and powered by mind-expanding drugs and advanced electronic communication, emphasizing personal intelligence and direct access to information rather than obedience to external authorities.","Together, these concepts paint ecstasy as more than a personal sensation; it is the foundation for a historical movement toward a society centered on individual freedom and personal growth. By breaking free from inherited social, political, and ideological constraints through expanded consciousness—enabled by psychedelics and cyber-electronics—people create new communities and ways of thinking that transcend traditional boundaries and offer a vision of post-political human evolution.","Think about a time you or someone you know experienced a moment that shattered usual ways of thinking or feeling freedom — perhaps through travel, art, or a powerful conversation. How did that moment change your or their sense of personal possibilities? Can you see how such moments might lead to forming new social circles or movements?","Ecstasy is an ongoing process of breaking free from limitations, creating new states of individual freedom.",The psychedelic and cybernetic technologies of the 20th century enabled a new post-political society focused on personal consciousness and choice rather than traditional political or geographic identities.,Foundations of Ecstasy and Consciousness Expansion,"The Politics of Ecstasy: Psychedelics, Consciousness, and Society",2025-09-06 06:46:12.889595+00,2025-09-08 00:38:49.106076+00,061c1782"""

# Parse CSV
reader = csv.DictReader(io.StringIO(csv_data))
entries = list(reader)

print(f"Parsed {len(entries)} entries", file=sys.stderr)

# Generate SQL entries
sql_entries = []
for entry in entries:
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

