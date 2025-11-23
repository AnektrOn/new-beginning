#!/usr/bin/env python3
"""
Generate SQL migration for course_content in batches of 20
Processes JSON data and matches lessons to course_structure
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

# Course structure mapping - lesson titles to (course_id, chapter_number, lesson_number)
# Based on MIGRATE_COURSE_STRUCTURE_DATA.sql
LESSON_MAP = {
    # Introduction to Computer Science (33)
    'What is a Computer?': (33, 1, 1),
    'Hardware and Software': (33, 1, 2),
    'Introduction to Programming': (33, 2, 1),
    'Variables and Data Types': (33, 2, 2),
    'Networking Fundamentals': (33, 3, 1),
    'The Internet and Protocols': (33, 3, 2),
    
    # Media Ecology (2043436001)
    'Media as Metaphor: How Medium Shapes the Message': (2043436001, 1, 1),
    'Media as Epistemology: Orality, Print, and Definitions of Truth and Intelligence': (2043436001, 1, 2),
    'The Age of Typography: Print Culture and the American Public Mind': (2043436001, 1, 3),
    'The Rise of the Visual and Telegraphic: The Displacement of Print by Images and Instant Information': (2043436001, 1, 4),
    'Television as Medium: Entertainment, Show Business, and Public Discourse': (2043436001, 2, 1),
    '"Now...This": Fragmentation, Incoherence, and News as Entertainment': (2043436001, 2, 2),
    'Politics and Religion as Entertainment: The Transformation of Cultural Institutions': (2043436001, 2, 3),
    'The Consequences of Entertainment Domination: Public Amnesia and the Loss of Serious Discourse': (2043436001, 2, 4),
    'Education as Amusement: The \'Sesame Street\' Model and the Changing Classroom': (2043436001, 3, 1),
    'The Television Curriculum: Learning, Attention, and Intellectual Habits': (2043436001, 3, 2),
    'Image, Politics, and the Loss of Historical Memory': (2043436001, 3, 3),
    'Cultural Survival, Resistance, and the Question of Solutions': (2043436001, 3, 4),
    
    # Hermetic Philosophy (-1048589509)
    'The Historical Roots and Transmission of Hermetic Teachings': (-1048589509, 1, 1),
    'Hermes Trismegistus and the Esoteric Lineage: Myth, Legend, and Historical Context': (-1048589509, 1, 2),
    'The Purpose and Method of The Kybalion: Hermetic Teaching and Initiation': (-1048589509, 1, 3),
    'The Seven Hermetic Principles: Foundational Axioms of Hermetic Thought': (-1048589509, 1, 4),
    'Mental Transmutation: The Art and Scope of Hermetic Alchemy': (-1048589509, 2, 1),
    'The Nature of THE ALL: Cosmology, Limits, and the Doctrine of Immanence': (-1048589509, 2, 2),
    'The Planes of Correspondence: The Structure of Reality': (-1048589509, 2, 3),
    'Divine Paradox and the Doctrine of Mentalism: Reality and Illusion': (-1048589509, 2, 4),
    'The Principle of Vibration, Polarity, and Rhythm: Laws of Change and Mastery': (-1048589509, 3, 1),
    'Cause, Effect, and Mastery: The Hermetic Art of Becoming a Mover Rather Than a Pawn': (-1048589509, 3, 2),
    'Mental Gender and the Process of Creation: Masculine and Feminine in Mind': (-1048589509, 3, 3),
    'The Application of Hermetic Axioms: Transmutation and Practical Mastery': (-1048589509, 3, 4),
    
    # Self-Compassion (-211735735)
    'Understanding Self-Compassion: Concepts and Foundations': (-211735735, 1, 1),
    'The Science and Role of Mindfulness in Emotional Healing': (-211735735, 1, 2),
    'Obstacles to and Stages of Acceptance: Resistance, Suffering, and Self-Criticism': (-211735735, 1, 3),
    'Introducing Mindfulness as a Foundation for Self-Compassion Practice': (-211735735, 1, 4),
    'Anchoring Awareness in the Body: Mindful Breathing, Sound, and Sensation': (-211735735, 2, 1),
    'Turning Toward Difficult Emotions: Mindfulness of Emotion, Self-Soothing, and Acceptance': (-211735735, 2, 2),
    'Mindful Labeling and Working with Difficult Emotional Patterns': (-211735735, 2, 3),
    'Compassionate Responses to Pain: Mindful Self-Compassion Tools and Skillful Action': (-211735735, 2, 4),
    'Practicing Loving-Kindness Meditation: Goodwill, Obstacles, and Transformation': (-211735735, 3, 1),
    'Customizing Mindfulness & Self-Compassion to Your Personality and Needs': (-211735735, 3, 2),
    'Integrating Self-Compassion in Daily Life and Relationships': (-211735735, 3, 3),
    'Measuring Progress and Sustaining Self-Compassion Practice over Time': (-211735735, 3, 4),
    
    # Politics of Ecstasy (-1211732545)
    'Defining Ecstasy: The Meaning, Process, and Political Context': (-1211732545, 1, 1),
    'The Seven Basic Spiritual Questions: Science, Religion, and the Psychedelic Experience': (-1211732545, 1, 2),
    'Historical Context: From Tribal Shamanism to the Psychedelic Counterculture': (-1211732545, 1, 3),
    'The Psychedelic Experience: Practices, Preparation, and the Good Friday Study': (-1211732545, 1, 4),
    'Psychedelics, Policy, and Cultural Opposition': (-1211732545, 2, 1),
    'Comparing Psychedelics and Mainstream Substances: The Alcoholics vs. The Psychedelics': (-1211732545, 2, 2),
    'Scientific, Moral, and Political Arguments about Cognitive Liberty': (-1211732545, 2, 3),
    'The Role of Language, Science, and Society in Consciousness Expansion': (-1211732545, 2, 4),
    'Personal Transformation: Consciousness Expansion and the Self': (-1211732545, 3, 1),
    'Ecstasy and Practical Living: Sex, Art, Love, and the Expansion of Everyday Experience': (-1211732545, 3, 2),
    'Social Change and the Politics of Ecstasy: Dropping Out, Counterculture, and Civil Liberties': (-1211732545, 3, 3),
    'The Future of Consciousness: Education, Children, and Social Evolution': (-1211732545, 3, 4),
    
    # Power of Assumption (-744437687)
    'I AM: The Principle of Self and Source': (-744437687, 1, 1),
    'Consciousness as the Sole Reality': (-744437687, 1, 2),
    'The Power of Assumption and the Law of Creation': (-744437687, 1, 3),
    'Desire, Attention, and the Formation of Self-Concept': (-744437687, 1, 4),
    'Controlled Imagination: Visualization and Emotional Acceptance': (-744437687, 2, 1),
    'The Role of Attention, Attitude, and Mental Discipline': (-744437687, 2, 2),
    'Techniques for Manifesting: Renunciation, Subjective Control, and the Effortless Way': (-744437687, 2, 3),
    'Persistence, Faith, and Overcoming Failure': (-744437687, 2, 4),
    'Righteousness, Free Will, and the Ethics of Assumption': (-744437687, 3, 1),
    'Essentials for Practice: Union, At-one-ment, and the Conditions for Success': (-744437687, 3, 2),
    'Manifestation Narratives: Case Histories and Real-World Application': (-744437687, 3, 3),
    'Destiny, Reverence, and the Deeper Meaning of Self-Creation': (-744437687, 3, 4),
    
    # Shock Doctrine (498493852)
    'Psychological and Political Roots: From Electroshock Experiments to State Repression': (498493852, 1, 1),
    'The Rise of Neoliberalism: The Intellectual Laboratory and Global Expansion': (498493852, 1, 2),
    'Crisis as Opportunity: Economic Shock Therapy and Its Early Trials': (498493852, 1, 3),
    'The Intertwining of Torture, Trauma, and Economic Policy': (498493852, 1, 4),
    'Latin America\'s Shock Laboratory: Coups, Dictatorships, and Economic Overhauls': (498493852, 2, 1),
    'Shock Therapy in the Transition from Communism: Poland, Russia, and Beyond': (498493852, 2, 2),
    'The Globalization of Disaster Capitalism: The IMF, Economic Crises, and Market Opportunity': (498493852, 2, 3),
    'Repression, Corruption, and the Suppression of Democratic Institutions': (498493852, 2, 4),
    'The War on Terror as Disaster Capitalism: Privatization of War, Government, and Reconstruction': (498493852, 3, 1),
    'Iraq as a Model and Warning: Shock, Occupation, and the Failure of the Neoliberal Project': (498493852, 3, 2),
    'Disaster as Opportunity: Reconstruction, Apartheid, and Policy Exploitation in the 21st Century': (498493852, 3, 3),
}

def dollar_quote(text):
    """Escape text for dollar-quoted strings"""
    if text is None:
        return 'NULL'
    text_str = str(text)
    # Replace $$ with $TAG$ to avoid conflicts
    return f"$${text_str.replace('$$', '$TAG$')}$$"

def generate_sql_entry(entry):
    """Generate a single SQL INSERT value entry"""
    lesson_title = entry.get('lesson_title', '')
    
    # Get chapter_number and lesson_number from LESSON_MAP
    if lesson_title in LESSON_MAP:
        course_id, chapter_number, lesson_number = LESSON_MAP[lesson_title]
    else:
        # Fallback: try to get from course_map
        course_name = entry.get('attached_to_course', '').strip()
        course_id = COURSE_MAP.get(course_name)
        if course_id is None:
            print(f"-- WARNING: Could not map lesson '{lesson_title}'", file=sys.stderr)
            return None
        # Default to chapter 1, lesson 1 if not found
        chapter_number = 1
        lesson_number = 1
        print(f"-- WARNING: Using default chapter/lesson for '{lesson_title}'", file=sys.stderr)
    
    # Generate SQL values
    values = f"""({entry.get('id')}, {dollar_quote(entry.get('lesson_id'))}, {course_id}, {chapter_number}, {lesson_number}, {dollar_quote(entry.get('lesson_title'))}, {dollar_quote(entry.get('the_hook'))}, {dollar_quote(entry.get('key_terms_1'))}, {dollar_quote(entry.get('key_terms_1_def'))}, {dollar_quote(entry.get('key_terms_2'))}, {dollar_quote(entry.get('key_terms_2_def'))}, {dollar_quote(entry.get('core_concepts_1'))}, {dollar_quote(entry.get('core_concepts_1_def'))}, {dollar_quote(entry.get('core_concepts_2'))}, {dollar_quote(entry.get('core_concepts_2_def'))}, {dollar_quote(entry.get('synthesis'))}, {dollar_quote(entry.get('connect_to_your_life'))}, {dollar_quote(entry.get('key_takeaways_1'))}, {dollar_quote(entry.get('key_takeaways_2'))}, {dollar_quote(entry.get('attached_to_chapter'))}, {dollar_quote(entry.get('attached_to_course'))}, {dollar_quote(entry.get('chapter_id'))}, {dollar_quote(entry.get('created_at'))}, {dollar_quote(entry.get('updated_at'))})"""
    
    return values

if __name__ == '__main__':
    import sys
    
    # Determine batch number from command line or default to 2
    batch_num = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    start_idx = (batch_num - 1) * 20
    end_idx = batch_num * 20
    
    # Read JSON from stdin
    data = json.load(sys.stdin)
    
    # Process entries for this batch
    batch = data[start_idx:end_idx]
    
    print(f"-- Processing entries {start_idx}-{end_idx-1} (batch {batch_num} of 20)")
    print(f"-- Generating SQL INSERT statements...")
    
    sql_entries = []
    for entry in batch:
        sql_entry = generate_sql_entry(entry)
        if sql_entry:
            sql_entries.append(sql_entry)
    
    # Output SQL
    if sql_entries:
        print("INSERT INTO course_content (")
        print("    id, lesson_id, course_id, chapter_number, lesson_number, lesson_title,")
        print("    the_hook, key_terms_1, key_terms_1_def, key_terms_2, key_terms_2_def,")
        print("    core_concepts_1, core_concepts_1_def, core_concepts_2, core_concepts_2_def,")
        print("    synthesis, connect_to_your_life, key_takeaways_1, key_takeaways_2,")
        print("    attached_to_chapter, attached_to_course, chapter_id, created_at, updated_at")
        print(") VALUES")
        print(",\n".join(sql_entries) + ";")
    
    print(f"\n-- Generated {len(sql_entries)} entries")

