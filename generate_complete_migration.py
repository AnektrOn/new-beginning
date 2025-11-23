#!/usr/bin/env python3
"""
Generate complete MIGRATE_COURSE_CONTENT_DATA.sql with all 71 entries
"""
import json
import sys

# Course ID mappings
COURSE_MAP = {
    'Introduction to Computer Science': 33,
    'Media Ecology and the Transformation of Public Discourse in America': 2043436001,
    'The Foundations and Practice of Hermetic Philosophy: An Analytical Study of The Kybalion': -1048589509,
    'The Mindful Path to Self-Compassion: Integrating Mindfulness, Acceptance, and Loving-Kindness for Emotional Healing': -211735735,
    'The Politics of Ecstasy: Psychedelics, Consciousness, and Society': -1211732545,
    "The Power of Assumption: Consciousness, Imagination, and Manifestation in Neville Goddard's Teachings": -744437687,
    'The Shock Doctrine: The Rise of Disaster Capitalism': 498493852
}

def dollar_quote(text):
    """Escape text for dollar-quoted strings"""
    if text is None:
        return 'NULL'
    # Replace $$ with $TAG$ to avoid conflicts
    return f"$${str(text).replace('$$', '$TAG$')}$$"

def generate_sql_entry(entry):
    """Generate a single SQL INSERT value entry"""
    course_name = entry.get('attached_to_course', '').strip()
    course_id = COURSE_MAP.get(course_name, None)
    
    if course_id is None:
        print(f"WARNING: Unknown course: {course_name}", file=sys.stderr)
        return None
    
    # Extract chapter_number and lesson_number from course_structure matching
    # This will need to be done by matching lesson_title to course_structure
    # For now, we'll use a placeholder that needs manual adjustment
    chapter_number = None  # Will be determined by matching to course_structure
    lesson_number = None   # Will be determined by matching to course_structure
    
    # Generate the SQL values
    values = f"""({entry.get('id')}, {dollar_quote(entry.get('lesson_id'))}, {course_id}, {chapter_number}, {lesson_number}, {dollar_quote(entry.get('lesson_title'))}, {dollar_quote(entry.get('the_hook'))}, {dollar_quote(entry.get('key_terms_1'))}, {dollar_quote(entry.get('key_terms_1_def'))}, {dollar_quote(entry.get('key_terms_2'))}, {dollar_quote(entry.get('key_terms_2_def'))}, {dollar_quote(entry.get('core_concepts_1'))}, {dollar_quote(entry.get('core_concepts_1_def'))}, {dollar_quote(entry.get('core_concepts_2'))}, {dollar_quote(entry.get('core_concepts_2_def'))}, {dollar_quote(entry.get('synthesis'))}, {dollar_quote(entry.get('connect_to_your_life'))}, {dollar_quote(entry.get('key_takeaways_1'))}, {dollar_quote(entry.get('key_takeaways_2'))}, {dollar_quote(entry.get('attached_to_chapter'))}, {dollar_quote(entry.get('attached_to_course'))}, {dollar_quote(entry.get('chapter_id'))}, {dollar_quote(entry.get('created_at'))}, {dollar_quote(entry.get('updated_at'))})"""
    
    return values

if __name__ == '__main__':
    print("-- This script needs the JSON data to process")
    print("-- It will generate SQL INSERT statements for all entries")

