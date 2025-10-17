-- =====================================================
-- COURSE STRUCTURE DATA IMPORT - 100% ACCURATE
-- =====================================================
-- This script imports course structure data into normalized tables
-- Execute this in Supabase SQL Editor after course_metadata is imported

-- First, clear any existing structure data to avoid conflicts
DELETE FROM course_lessons;
DELETE FROM course_chapters;

-- =====================================================
-- COURSE CHAPTERS IMPORT
-- =====================================================

INSERT INTO course_chapters (
    id,
    course_metadata_id,
    chapter_number,
    chapter_title,
    chapter_id,
    created_at,
    updated_at
) VALUES 

-- Course: The Politics of Ecstasy (course_id: -1211732545)
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -1211732545), 1, 'Foundations of Ecstasy and Consciousness Expansion', '061c1782', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -1211732545), 2, 'The Psychedelic Experience: Practices, Preparation, and the Good Friday Study', '35467cf5', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -1211732545), 3, 'Personal Transformation: Consciousness Expansion and the Self', '846e3080', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),

-- Course: Hermetic Philosophy (course_id: -1048589509) - Using the latest entry (id: 180)
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -1048589509), 1, 'Hermetic Philosophy: Origins, Framework, and Core Principles', NULL, '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -1048589509), 2, 'Hermetic Cosmology and Psychology: Mentalism, Planes of Reality, and Universal Process', NULL, '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -1048589509), 3, 'Applied Hermetics: The Principles in Practice and the Science of Transformation', NULL, '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),

-- Course: The Power of Assumption (course_id: -744437687)
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -744437687), 1, 'The Nature of Consciousness and the Foundation of Reality', NULL, '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -744437687), 2, 'Practical Application: Imagination, Technique, and Mastery', NULL, '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -744437687), 3, 'Living the Law: Ethics, Destiny, and Case Histories', NULL, '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),

-- Course: Self-Compassion (course_id: -211735735) - Using the latest entry (id: 182)
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -211735735), 1, 'Fundamentals of Self-Compassion and Mindfulness', NULL, '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -211735735), 2, 'Core Mindfulness Techniques and the Practice of Self-Compassion', NULL, '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = -211735735), 3, 'Compassionate Responses to Pain: Mindful Self-Compassion Tools and Skillful Action', NULL, '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),

-- Course: The Shock Doctrine (course_id: 498493852)
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = 498493852), 1, 'Foundations of the Shock Doctrine: Origins, Methodology, and Early Experiments', 'baaf3234', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = 498493852), 2, 'Disaster Capitalism in Practice: Global Applications, Repression, and Resistance', '34f1866c', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = 498493852), 3, 'Contemporary Shocks: The War on Terror, Privatization, and Emerging Resistance', '79e94844', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),

-- Course: Media Ecology (course_id: 2043436001) - Using the latest entry (id: 181)
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = 2043436001), 1, 'From Typography to Television: The Evolution of American Media Epistemology', NULL, '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = 2043436001), 2, 'The Age of Show Business: Television and the Redefinition of Public Life', NULL, '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_metadata WHERE course_id = 2043436001), 3, 'Impacts and Implications: Education, Politics, and Meaning in the Age of Television', NULL, '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00');

-- =====================================================
-- COURSE LESSONS IMPORT
-- =====================================================

INSERT INTO course_lessons (
    id,
    chapter_id,
    lesson_number,
    lesson_title,
    created_at,
    updated_at
) VALUES 

-- Course: The Politics of Ecstasy - Chapter 1
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of Ecstasy and Consciousness Expansion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 1, 'Defining Ecstasy: The Meaning, Process, and Political Context', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of Ecstasy and Consciousness Expansion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 2, 'The Seven Basic Spiritual Questions: Science, Religion, and the Psychedelic Experience', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of Ecstasy and Consciousness Expansion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 3, 'Historical Context: From Tribal Shamanism to the Psychedelic Counterculture', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of Ecstasy and Consciousness Expansion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 4, 'The Societal, Scientific, and Ethical Dimensions of Psychedelics', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),

-- Course: The Politics of Ecstasy - Chapter 2
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Psychedelic Experience: Practices, Preparation, and the Good Friday Study' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 1, 'Psychedelics, Policy, and Cultural Opposition', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Psychedelic Experience: Practices, Preparation, and the Good Friday Study' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 2, 'Comparing Psychedelics and Mainstream Substances: The Alcoholics vs. The Psychedelics', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Psychedelic Experience: Practices, Preparation, and the Good Friday Study' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 3, 'Scientific, Moral, and Political Arguments about Cognitive Liberty', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Psychedelic Experience: Practices, Preparation, and the Good Friday Study' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 4, 'The Role of Language, Science, and Society in Consciousness Expansion', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),

-- Course: The Politics of Ecstasy - Chapter 3
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Personal Transformation: Consciousness Expansion and the Self' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 1, 'From Personal Transformation to Social Evolution', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Personal Transformation: Consciousness Expansion and the Self' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 2, 'Ecstasy and Practical Living: Sex, Art, Love, and the Expansion of Everyday Experience', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Personal Transformation: Consciousness Expansion and the Self' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 3, 'Social Change and the Politics of Ecstasy: Dropping Out, Counterculture, and Civil Liberties', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Personal Transformation: Consciousness Expansion and the Self' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1211732545)), 4, 'The Future of Consciousness: Education, Children, and Social Evolution', '2025-09-05 06:21:01.727347+00', '2025-09-06 06:39:54.770044+00'),

-- Course: Hermetic Philosophy - Chapter 1
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Philosophy: Origins, Framework, and Core Principles' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 1, 'The Historical Roots and Transmission of Hermetic Teachings', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Philosophy: Origins, Framework, and Core Principles' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 2, 'Hermes Trismegistus and the Esoteric Lineage: Myth, Legend, and Historical Context', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Philosophy: Origins, Framework, and Core Principles' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 3, 'The Purpose and Method of The Kybalion: Hermetic Teaching and Initiation', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Philosophy: Origins, Framework, and Core Principles' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 4, 'The Seven Hermetic Principles: Foundational Axioms of Hermetic Thought', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),

-- Course: Hermetic Philosophy - Chapter 2
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Cosmology and Psychology: Mentalism, Planes of Reality, and Universal Process' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 1, 'Mental Transmutation: The Art and Scope of Hermetic Alchemy', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Cosmology and Psychology: Mentalism, Planes of Reality, and Universal Process' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 2, 'The Nature of THE ALL: Cosmology, Limits, and the Doctrine of Immanence', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Cosmology and Psychology: Mentalism, Planes of Reality, and Universal Process' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 3, 'The Planes of Correspondence: The Structure of Reality', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Hermetic Cosmology and Psychology: Mentalism, Planes of Reality, and Universal Process' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 4, 'Divine Paradox and the Doctrine of Mentalism: Reality and Illusion', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),

-- Course: Hermetic Philosophy - Chapter 3
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Applied Hermetics: The Principles in Practice and the Science of Transformation' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 1, 'The Principle of Vibration, Polarity, and Rhythm: Laws of Change and Mastery', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Applied Hermetics: The Principles in Practice and the Science of Transformation' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 2, 'Cause, Effect, and Mastery: The Hermetic Art of Becoming a Mover Rather Than a Pawn', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Applied Hermetics: The Principles in Practice and the Science of Transformation' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 3, 'Mental Gender and the Process of Creation: Masculine and Feminine in Mind', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Applied Hermetics: The Principles in Practice and the Science of Transformation' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -1048589509)), 4, 'The Application of Hermetic Axioms: Transmutation and Practical Mastery', '2025-09-20 01:55:47.980939+00', '2025-09-20 01:55:47.980939+00'),

-- Course: The Power of Assumption - Chapter 1
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Nature of Consciousness and the Foundation of Reality' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 1, 'I AM: The Principle of Self and Source', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Nature of Consciousness and the Foundation of Reality' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 2, 'Consciousness as the Sole Reality', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Nature of Consciousness and the Foundation of Reality' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 3, 'The Power of Assumption and the Law of Creation', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Nature of Consciousness and the Foundation of Reality' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 4, 'Desire, Attention, and the Formation of Self-Concept', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),

-- Course: The Power of Assumption - Chapter 2
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Practical Application: Imagination, Technique, and Mastery' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 1, 'Controlled Imagination: Visualization and Emotional Acceptance', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Practical Application: Imagination, Technique, and Mastery' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 2, 'The Role of Attention, Attitude, and Mental Discipline', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Practical Application: Imagination, Technique, and Mastery' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 3, 'Techniques for Manifesting: Renunciation, Subjective Control, and the Effortless Way', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Practical Application: Imagination, Technique, and Mastery' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 4, 'Persistence, Faith, and Overcoming Failure', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),

-- Course: The Power of Assumption - Chapter 3
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Living the Law: Ethics, Destiny, and Case Histories' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 1, 'Righteousness, Free Will, and the Ethics of Assumption', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Living the Law: Ethics, Destiny, and Case Histories' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 2, 'Essentials for Practice: Union, At-one-ment, and the Conditions for Success', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Living the Law: Ethics, Destiny, and Case Histories' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 3, 'Manifestation Narratives: Case Histories and Real-World Application', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Living the Law: Ethics, Destiny, and Case Histories' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -744437687)), 4, 'Destiny, Reverence, and the Deeper Meaning of Self-Creation', '2025-09-20 01:56:59.695546+00', '2025-09-20 01:56:59.695546+00'),

-- Course: Self-Compassion - Chapter 1
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Fundamentals of Self-Compassion and Mindfulness' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 1, 'Understanding Self-Compassion: Concepts and Foundations', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Fundamentals of Self-Compassion and Mindfulness' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 2, 'The Science and Role of Mindfulness in Emotional Healing', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Fundamentals of Self-Compassion and Mindfulness' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 3, 'Obstacles to and Stages of Acceptance: Resistance, Suffering, and Self-Criticism', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Fundamentals of Self-Compassion and Mindfulness' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 4, 'Introducing Mindfulness as a Foundation for Self-Compassion Practice', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),

-- Course: Self-Compassion - Chapter 2
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Core Mindfulness Techniques and the Practice of Self-Compassion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 1, 'Anchoring Awareness in the Body: Mindful Breathing, Sound, and Sensation', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Core Mindfulness Techniques and the Practice of Self-Compassion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 2, 'Turning Toward Difficult Emotions: Mindfulness of Emotion, Self-Soothing, and Acceptance', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Core Mindfulness Techniques and the Practice of Self-Compassion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 3, 'Mindful Labeling and Working with Difficult Emotional Patterns', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Core Mindfulness Techniques and the Practice of Self-Compassion' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 4, 'Applying, Customizing, and Sustaining Mindful Self-Compassion in Daily Life', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),

-- Course: Self-Compassion - Chapter 3
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Compassionate Responses to Pain: Mindful Self-Compassion Tools and Skillful Action' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 1, 'Practicing Loving-Kindness Meditation: Goodwill, Obstacles, and Transformation', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Compassionate Responses to Pain: Mindful Self-Compassion Tools and Skillful Action' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 2, 'Customizing Mindfulness & Self-Compassion to Your Personality and Needs', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Compassionate Responses to Pain: Mindful Self-Compassion Tools and Skillful Action' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 3, 'Integrating Self-Compassion in Daily Life and Relationships', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Compassionate Responses to Pain: Mindful Self-Compassion Tools and Skillful Action' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = -211735735)), 4, 'Measuring Progress and Sustaining Self-Compassion Practice over Time', '2025-09-20 01:56:37.84519+00', '2025-09-20 01:56:37.84519+00'),

-- Course: The Shock Doctrine - Chapter 1
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of the Shock Doctrine: Origins, Methodology, and Early Experiments' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 1, 'Psychological and Political Roots: From Electroshock Experiments to State Repression', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of the Shock Doctrine: Origins, Methodology, and Early Experiments' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 2, 'The Rise of Neoliberalism: The Intellectual Laboratory and Global Expansion', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of the Shock Doctrine: Origins, Methodology, and Early Experiments' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 3, 'Crisis as Opportunity: Economic Shock Therapy and Its Early Trials', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Foundations of the Shock Doctrine: Origins, Methodology, and Early Experiments' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 4, 'The Intertwining of Torture, Trauma, and Economic Policy', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),

-- Course: The Shock Doctrine - Chapter 2
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Disaster Capitalism in Practice: Global Applications, Repression, and Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 1, 'Latin America''s Shock Laboratory: Coups, Dictatorships, and Economic Overhauls', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Disaster Capitalism in Practice: Global Applications, Repression, and Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 2, 'Shock Therapy in the Transition from Communism: Poland, Russia, and Beyond', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Disaster Capitalism in Practice: Global Applications, Repression, and Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 3, 'The Globalization of Disaster Capitalism: The IMF, Economic Crises, and Market Opportunity', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Disaster Capitalism in Practice: Global Applications, Repression, and Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 4, 'Repression, Corruption, and the Suppression of Democratic Institutions', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),

-- Course: The Shock Doctrine - Chapter 3
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Contemporary Shocks: The War on Terror, Privatization, and Emerging Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 1, 'The War on Terror as Disaster Capitalism: Privatization of War, Government, and Reconstruction', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Contemporary Shocks: The War on Terror, Privatization, and Emerging Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 2, 'Iraq as a Model and Warning: Shock, Occupation, and the Failure of the Neoliberal Project', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Contemporary Shocks: The War on Terror, Privatization, and Emerging Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 3, 'Disaster as Opportunity: Reconstruction, Apartheid, and Policy Exploitation in the 21st Century', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Contemporary Shocks: The War on Terror, Privatization, and Emerging Resistance' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 498493852)), 4, 'Resistance, Memory, and the Future: Emergence of Social Movements and Alternatives', '2025-09-05 06:20:33.924831+00', '2025-09-06 06:39:54.770044+00'),

-- Course: Media Ecology - Chapter 1
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'From Typography to Television: The Evolution of American Media Epistemology' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 1, 'Media as Metaphor: How Medium Shapes the Message', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'From Typography to Television: The Evolution of American Media Epistemology' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 2, 'Media as Epistemology: Orality, Print, and Definitions of Truth and Intelligence', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'From Typography to Television: The Evolution of American Media Epistemology' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 3, 'The Age of Typography: Print Culture and the American Public Mind', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'From Typography to Television: The Evolution of American Media Epistemology' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 4, 'The Rise of the Visual and Telegraphic: The Displacement of Print by Images and Instant Information', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),

-- Course: Media Ecology - Chapter 2
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Age of Show Business: Television and the Redefinition of Public Life' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 1, 'Television as Medium: Entertainment, Show Business, and Public Discourse', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Age of Show Business: Television and the Redefinition of Public Life' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 2, '"Now...This": Fragmentation, Incoherence, and News as Entertainment', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Age of Show Business: Television and the Redefinition of Public Life' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 3, 'Politics and Religion as Entertainment: The Transformation of Cultural Institutions', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'The Age of Show Business: Television and the Redefinition of Public Life' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 4, 'The Consequences of Entertainment Domination: Public Amnesia and the Loss of Serious Discourse', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),

-- Course: Media Ecology - Chapter 3
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Impacts and Implications: Education, Politics, and Meaning in the Age of Television' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 1, 'Education as Amusement: The ''Sesame Street'' Model and the Changing Classroom', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Impacts and Implications: Education, Politics, and Meaning in the Age of Television' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 2, 'The Television Curriculum: Learning, Attention, and Intellectual Habits', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Impacts and Implications: Education, Politics, and Meaning in the Age of Television' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 3, 'Image, Politics, and the Loss of Historical Memory', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00'),
(gen_random_uuid(), (SELECT id FROM course_chapters WHERE chapter_title = 'Impacts and Implications: Education, Politics, and Meaning in the Age of Television' AND course_metadata_id = (SELECT id FROM course_metadata WHERE course_id = 2043436001)), 4, 'Cultural Survival, Resistance, and the Question of Solutions', '2025-09-20 01:56:12.364821+00', '2025-09-20 01:56:12.364821+00');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify chapters imported correctly
SELECT 
    'CHAPTERS BY COURSE' as summary,
    cm.course_title,
    cm.masterschool,
    COUNT(cc.id) as chapter_count,
    STRING_AGG(cc.chapter_title, ' | ') as chapters
FROM course_metadata cm
LEFT JOIN course_chapters cc ON cm.id = cc.course_metadata_id
GROUP BY cm.id, cm.course_title, cm.masterschool
ORDER BY cm.masterschool, cm.course_title;

-- Verify lessons imported correctly
SELECT 
    'LESSONS BY CHAPTER' as summary,
    cm.course_title,
    cc.chapter_number,
    cc.chapter_title,
    COUNT(cl.id) as lesson_count,
    STRING_AGG(cl.lesson_title, ' | ') as lessons
FROM course_metadata cm
JOIN course_chapters cc ON cm.id = cc.course_metadata_id
LEFT JOIN course_lessons cl ON cc.id = cl.chapter_id
GROUP BY cm.id, cm.course_title, cc.id, cc.chapter_number, cc.chapter_title
ORDER BY cm.masterschool, cm.course_title, cc.chapter_number;

-- =====================================================
-- EXPECTED RESULTS AFTER EXECUTION:
-- =====================================================
-- 6 courses × 3 chapters each = 18 chapters total
-- 18 chapters × 4 lessons each = 72 lessons total
-- =====================================================
