-- =====================================================
-- MIGRATE COURSE STRUCTURE DATA
-- =====================================================
-- This script imports course structure data using the denormalized format
-- Execute this AFTER running CORRECT_COURSE_SCHEMA_MIGRATION.sql

-- Clear existing data
DELETE FROM course_structure;

-- Insert course structure data
-- Note: Adjust IDs based on your actual data

-- Course: The Politics of Ecstasy (course_id: -1211732545, id: 148)
INSERT INTO course_structure (
    id, course_id, chapter_count,
    chapter_title_1, lesson_1_1, lesson_1_2, lesson_1_3, lesson_1_4, chapter_id_1,
    chapter_title_2, lesson_2_1, lesson_2_2, lesson_2_3, lesson_2_4, chapter_id_2,
    chapter_title_3, lesson_3_1, lesson_3_2, lesson_3_3, lesson_3_4, chapter_id_3,
    created_at, updated_at
) VALUES (
    148, -1211732545, 3,
    'Foundations of Ecstasy and Consciousness Expansion',
    'Defining Ecstasy: The Meaning, Process, and Political Context',
    'The Seven Basic Spiritual Questions: Science, Religion, and the Psychedelic Experience',
    'Historical Context: From Tribal Shamanism to the Psychedelic Counterculture',
    'The Psychedelic Experience: Practices, Preparation, and the Good Friday Study',
    '061c1782',
    'The Societal, Scientific, and Ethical Dimensions of Psychedelics',
    'Psychedelics, Policy, and Cultural Opposition',
    'Comparing Psychedelics and Mainstream Substances: The Alcoholics vs. The Psychedelics',
    'Scientific, Moral, and Political Arguments about Cognitive Liberty',
    'The Role of Language, Science, and Society in Consciousness Expansion',
    '35467cf5',
    'From Personal Transformation to Social Evolution',
    'Personal Transformation: Consciousness Expansion and the Self',
    'Ecstasy and Practical Living: Sex, Art, Love, and the Expansion of Everyday Experience',
    'Social Change and the Politics of Ecstasy: Dropping Out, Counterculture, and Civil Liberties',
    'The Future of Consciousness: Education, Children, and Social Evolution',
    '846e3080',
    '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'
);

-- Course: Hermetic Philosophy (course_id: -1048589509, id: 177)
INSERT INTO course_structure (
    id, course_id, chapter_count,
    chapter_title_1, lesson_1_1, lesson_1_2, lesson_1_3, lesson_1_4,
    chapter_title_2, lesson_2_1, lesson_2_2, lesson_2_3, lesson_2_4,
    chapter_title_3, lesson_3_1, lesson_3_2, lesson_3_3, lesson_3_4,
    created_at, updated_at
) VALUES (
    177, -1048589509, 3,
    'Hermetic Philosophy: Origins, Framework, and Core Principles',
    'The Historical Roots and Transmission of Hermetic Teachings',
    'Hermes Trismegistus and the Esoteric Lineage: Myth, Legend, and Historical Context',
    'The Purpose and Method of The Kybalion: Hermetic Teaching and Initiation',
    'The Seven Hermetic Principles: Foundational Axioms of Hermetic Thought',
    'Hermetic Cosmology and Psychology: Mentalism, Planes of Reality, and Universal Process',
    'Mental Transmutation: The Art and Scope of Hermetic Alchemy',
    'The Nature of THE ALL: Cosmology, Limits, and the Doctrine of Immanence',
    'The Planes of Correspondence: The Structure of Reality',
    'Divine Paradox and the Doctrine of Mentalism: Reality and Illusion',
    'Applied Hermetics: The Principles in Practice and the Science of Transformation',
    'The Principle of Vibration, Polarity, and Rhythm: Laws of Change and Mastery',
    'Cause, Effect, and Mastery: The Hermetic Art of Becoming a Mover Rather Than a Pawn',
    'Mental Gender and the Process of Creation: Masculine and Feminine in Mind',
    'The Application of Hermetic Axioms: Transmutation and Practical Mastery',
    '2025-09-18 10:17:53.878622+00', '2025-09-18 10:17:53.878622+00'
);

-- Course: The Power of Assumption (course_id: -744437687, id: 183)
INSERT INTO course_structure (
    id, course_id, chapter_count,
    chapter_title_1, lesson_1_1, lesson_1_2, lesson_1_3, lesson_1_4,
    chapter_title_2, lesson_2_1, lesson_2_2, lesson_2_3, lesson_2_4,
    chapter_title_3, lesson_3_1, lesson_3_2, lesson_3_3, lesson_3_4,
    created_at, updated_at
) VALUES (
    183, -744437687, 3,
    'The Nature of Consciousness and the Foundation of Reality',
    'I AM: The Principle of Self and Source',
    'Consciousness as the Sole Reality',
    'The Power of Assumption and the Law of Creation',
    'Desire, Attention, and the Formation of Self-Concept',
    'Practical Application: Imagination, Technique, and Mastery',
    'Controlled Imagination: Visualization and Emotional Acceptance',
    'The Role of Attention, Attitude, and Mental Discipline',
    'Techniques for Manifesting: Renunciation, Subjective Control, and the Effortless Way',
    'Persistence, Faith, and Overcoming Failure',
    'Living the Law: Ethics, Destiny, and Case Histories',
    'Righteousness, Free Will, and the Ethics of Assumption',
    'Essentials for Practice: Union, At-one-ment, and the Conditions for Success',
    'Manifestation Narratives: Case Histories and Real-World Application',
    'Destiny, Reverence, and the Deeper Meaning of Self-Creation',
    '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'
);

-- Course: Self-Compassion (course_id: -211735735, id: 182)
INSERT INTO course_structure (
    id, course_id, chapter_count,
    chapter_title_1, lesson_1_1, lesson_1_2, lesson_1_3, lesson_1_4,
    chapter_title_2, lesson_2_1, lesson_2_2, lesson_2_3, lesson_2_4,
    chapter_title_3, lesson_3_1, lesson_3_2, lesson_3_3, lesson_3_4,
    created_at, updated_at
) VALUES (
    182, -211735735, 3,
    'Fundamentals of Self-Compassion and Mindfulness',
    'Understanding Self-Compassion: Concepts and Foundations',
    'The Science and Role of Mindfulness in Emotional Healing',
    'Obstacles to and Stages of Acceptance: Resistance, Suffering, and Self-Criticism',
    'Introducing Mindfulness as a Foundation for Self-Compassion Practice',
    'Core Mindfulness Techniques and the Practice of Self-Compassion',
    'Anchoring Awareness in the Body: Mindful Breathing, Sound, and Sensation',
    'Turning Toward Difficult Emotions: Mindfulness of Emotion, Self-Soothing, and Acceptance',
    'Mindful Labeling and Working with Difficult Emotional Patterns',
    'Compassionate Responses to Pain: Mindful Self-Compassion Tools and Skillful Action',
    'Applying, Customizing, and Sustaining Mindful Self-Compassion in Daily Life',
    'Practicing Loving-Kindness Meditation: Goodwill, Obstacles, and Transformation',
    'Customizing Mindfulness & Self-Compassion to Your Personality and Needs',
    'Integrating Self-Compassion in Daily Life and Relationships',
    'Measuring Progress and Sustaining Self-Compassion Practice over Time',
    '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'
);

-- Course: The Shock Doctrine (course_id: 498493852, id: 147)
INSERT INTO course_structure (
    id, course_id, chapter_count,
    chapter_title_1, lesson_1_1, lesson_1_2, lesson_1_3, lesson_1_4, chapter_id_1,
    chapter_title_2, lesson_2_1, lesson_2_2, lesson_2_3, lesson_2_4, chapter_id_2,
    chapter_title_3, lesson_3_1, lesson_3_2, lesson_3_3, lesson_3_4, chapter_id_3,
    created_at, updated_at
) VALUES (
    147, 498493852, 3,
    'Foundations of the Shock Doctrine: Origins, Methodology, and Early Experiments',
    'Psychological and Political Roots: From Electroshock Experiments to State Repression',
    'The Rise of Neoliberalism: The Intellectual Laboratory and Global Expansion',
    'Crisis as Opportunity: Economic Shock Therapy and Its Early Trials',
    'The Intertwining of Torture, Trauma, and Economic Policy',
    'baaf3234',
    'Disaster Capitalism in Practice: Global Applications, Repression, and Resistance',
    'Latin America''s Shock Laboratory: Coups, Dictatorships, and Economic Overhauls',
    'Shock Therapy in the Transition from Communism: Poland, Russia, and Beyond',
    'The Globalization of Disaster Capitalism: The IMF, Economic Crises, and Market Opportunity',
    'Repression, Corruption, and the Suppression of Democratic Institutions',
    '34f1866c',
    'Contemporary Shocks: The War on Terror, Privatization, and Emerging Resistance',
    'The War on Terror as Disaster Capitalism: Privatization of War, Government, and Reconstruction',
    'Iraq as a Model and Warning: Shock, Occupation, and the Failure of the Neoliberal Project',
    'Disaster as Opportunity: Reconstruction, Apartheid, and Policy Exploitation in the 21st Century',
    'Resistance, Memory, and the Future: Emergence of Social Movements and Alternatives',
    '79e94844',
    '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'
);

-- Course: Media Ecology (course_id: 2043436001, id: 167)
INSERT INTO course_structure (
    id, course_id, chapter_count,
    chapter_title_1, lesson_1_1, lesson_1_2, lesson_1_3, lesson_1_4,
    chapter_title_2, lesson_2_1, lesson_2_2, lesson_2_3, lesson_2_4,
    chapter_title_3, lesson_3_1, lesson_3_2, lesson_3_3, lesson_3_4,
    created_at, updated_at
) VALUES (
    167, 2043436001, 3,
    'From Typography to Television: The Evolution of American Media Epistemology',
    'Media as Metaphor: How Medium Shapes the Message',
    'Media as Epistemology: Orality, Print, and Definitions of Truth and Intelligence',
    'The Age of Typography: Print Culture and the American Public Mind',
    'The Rise of the Visual and Telegraphic: The Displacement of Print by Images and Instant Information',
    'The Age of Show Business: Television and the Redefinition of Public Life',
    'Television as Medium: Entertainment, Show Business, and Public Discourse',
    '"Now...This": Fragmentation, Incoherence, and News as Entertainment',
    'Politics and Religion as Entertainment: The Transformation of Cultural Institutions',
    'The Consequences of Entertainment Domination: Public Amnesia and the Loss of Serious Discourse',
    'Impacts and Implications: Education, Politics, and Meaning in the Age of Television',
    'Education as Amusement: The ''Sesame Street'' Model and the Changing Classroom',
    'The Television Curriculum: Learning, Attention, and Intellectual Habits',
    'Image, Politics, and the Loss of Historical Memory',
    'Cultural Survival, Resistance, and the Question of Solutions',
    '2025-09-18 09:17:50.879066+00', '2025-09-18 09:17:50.879066+00'
);

-- Verify import
SELECT 
    id,
    course_id,
    chapter_count,
    chapter_title_1,
    chapter_title_2,
    chapter_title_3
FROM course_structure
ORDER BY id;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

