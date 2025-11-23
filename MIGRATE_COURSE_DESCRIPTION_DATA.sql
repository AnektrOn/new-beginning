-- =====================================================
-- MIGRATE COURSE DESCRIPTION DATA (DENORMALISED)
-- =====================================================
-- Execute AFTER running CORRECT_COURSE_SCHEMA_MIGRATION.sql
-- and MIGRATE_COURSE_STRUCTURE_DATA.sql
--
-- This script clears the existing course_description table and
-- inserts the denormalised data exactly as supplied (chapter_?_description,
-- lesson_?_?_description, etc.). Dollar quoted strings are used so we
-- don't need to escape apostrophes.
-- =====================================================

TRUNCATE course_description RESTART IDENTITY;

-- =====================================================
-- The Politics of Ecstasy (course_id: -1211732545)
-- =====================================================
INSERT INTO course_description (
    id,
    course_id,
    chapter_1_description,
    lesson_1_1_description,
    lesson_1_2_description,
    lesson_1_3_description,
    lesson_1_4_description,
    chapter_id_1,
    chapter_2_description,
    lesson_2_1_description,
    lesson_2_2_description,
    lesson_2_3_description,
    lesson_2_4_description,
    chapter_id_2,
    chapter_3_description,
    lesson_3_1_description,
    lesson_3_2_description,
    lesson_3_3_description,
    lesson_3_4_description,
    chapter_id_3,
    created_at,
    updated_at
) VALUES (
    11,
    -1211732545,
    $$This chapter explores psychedelic experience as a process of consciousness expansion, encompassing spiritual, neurological, biological, and societal dimensions, highlighting the emergence of new individual freedom movements empowered by psychedelic and cybernetic technology.$$,
    $$Defines ecstasy as the experience of transcending limitations through an ongoing on/off process that creates individual freedom, forming a new ecstatic society empowered by psychedelic drugs and electronic communication technology, emphasizing personal mind sovereignty over traditional political or geographical affiliations.$$,
    $$Outlines seven fundamental spiritual questions addressing ultimate power, life, human nature, awareness, ego, emotion, and escape, showing how science and religion provide complementary objective and subjective answers, and positing that psychedelics, under proper conditions, facilitate mystical experiences addressing these core issues.$$,
    $$Traces the evolution from obedience-based tribal and feudal societies to a post-political information society grounded in individual thinking and creativity, highlighting the Beat Generation's pioneering counterculture use of psychedelics and electronic media that catalyzed the modern global psychedelic-cybernetic movement.$$,
    $$Describes Leary's pioneering psychedelic sessions with thousands, including religious professionals, emphasizing the Good Friday study which experimentally demonstrated that psilocybin, under spiritual preparation and setting, elicits significantly more mystical experiences than placebo, affirming the religious potential of psychedelics.$$,
    $$061c1782$$,
    $$This chapter examines the complex societal controversies, policy opposition, and ethical debates surrounding psychedelic drugs, addressing accusations against proponents, contrasting psychedelics with mainstream substances like alcohol, and advocating for cognitive liberty through new ethical commandments in the molecular age.$$,
    $$Recounts a multifaceted attack on Leary and Alpert by Martin Mayer blaming them for promoting drug use and psychosis, while detailing the responsible, scholarly and spiritual research of IFIF amidst widespread public misunderstanding and government opposition, including affirming the relatively safe nature of psychedelics compared to alcohol or tobacco.$$,
    $$Contrasts societal responses to alcohol and psychedelics, highlighting punitive laws disproportionately targeting young marijuana users despite marijuana's wide use among diverse populations, while arguing psychedelics promote internal freedom without the violent, imprisoning tendencies historically linked to alcohol.$$,
    $$Argues that with the advent of consciousness-altering molecular technologies, clear moral imperatives emerge centered on respecting cognitive liberty: no one shall alter another's consciousness without consent, nor prevent others from doing so themselves, framing these as ethical laws fundamental to personal freedom and social harmony.$$,
    $$Highlights the lack of adequate scientific language and systematic understanding in neurology, psychology, and consciousness studies, emphasizing the need for new interdisciplinary frameworks that integrate biochemistry and consciousness alteration to revolutionize future education, politics, and social communication.$$,
    $$35467cf5$$,
    $$Examines how traditional social and psychological structures impose artificial identity roles, and how LSD experience reveals the ego as a transient, constructed persona, expanding personal identity to include cellular and atomic levels and confronting the fear and ecstasy of ego dissolution.$$,
    $$Examines how traditional social and psychological structures impose artificial identity roles, and how LSD experience reveals the ego as a transient, constructed persona, expanding personal identity to include cellular and atomic levels and confronting the fear and ecstasy of ego dissolution.$$,
    $$Describes the enhancement of love, sexuality, art, and sensory perception under LSD, noting the profound increase in erotic sensitivity, sensory intensification, and the expansion of consciousness that enrich interpersonal and creative experiences.$$,
    $$Explores the cultural dichotomy between establishment authorities and the underground drop-out counterculture, highlighting the historic criminalization of ecstatic practices and Leary's call for internal transformation preceding social disengagement as a hopeful, unique evolutionary phenomenon.$$,
    $$Foresees a near future where psychedelics and advanced psychochemicals become integral educational tools to help children harness sensory and cellular faculties prior to symbolic learning, revolutionizing education, child rearing, and societal behavior within one generation.$$,
    $$846e3080$$,
    $$2025-09-05 10:11:08.471011+00$$,
    $$2025-09-06 06:39:54.770044+00$$
);

-- =====================================================
-- Hermetic Philosophy (course_id: -1048589509)
-- =====================================================
INSERT INTO course_description (
    id,
    course_id,
    chapter_1_description,
    lesson_1_1_description,
    lesson_1_2_description,
    lesson_1_3_description,
    lesson_1_4_description,
    chapter_2_description,
    lesson_2_1_description,
    lesson_2_2_description,
    lesson_2_3_description,
    lesson_2_4_description,
    chapter_3_description,
    lesson_3_1_description,
    lesson_3_2_description,
    lesson_3_3_description,
    lesson_3_4_description,
    created_at,
    updated_at
) VALUES (
    26,
    -1048589509,
    $$This chapter explores the historical background, fundamental nature, and foundational aims of Hermetic Philosophy, focusing on the guarded transmission of Hermetic teachings and the original truths set forth in The Kybalion.$$,
    $$This lesson details the guarded transmission and origins of Hermetic Teachings rooted in ancient Egypt, highlighting Hermes Trismegistus as the Master of Masters and explaining the role these teachings play in reconciling diverse occult knowledge across cultures and time.$$,
    $$This lesson introduces Hermes Trismegistus as the pivotal figure in the esoteric lineage of ancient Egypt, situating him within the broader context of influential Masters who disseminated occult wisdom across civilizations.$$,
    $$This lesson explains the intent and approach of The Kybalion as a guide to Hermetic teachings, emphasizing its role as a master-key to esoteric wisdom, accessible only to those prepared for its truths.$$,
    $$This lesson introduces the Seven foundational Hermetic Principles—Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause and Effect, and Gender—presenting brief explanations that establish the philosophical framework for Hermetic study.$$,
    $$This chapter examines the Hermetic view of cosmic reality and mental phenomena, elaborating on the nature of THE ALL, the structure of the universe through its planes, and the mental-spiritual processes governing existence.$$,
    $$This lesson details the Hermetic art of Mental Transmutation, describing it as the ancient technique of transforming mental states through principles of mental alchemy, underlying many modern psychological and occult practices.$$,
    $$This lesson clarifies the Hermetic concept of THE ALL as the infinite, immutable, and unknowable Substantial Reality underpinning the universe, highlighting its omnipresence, eternality, and transcendence beyond finite phenomena.$$,
    $$This lesson explains the Hermetic Principle of Correspondence via the structural division of the universe into three major Planes—Physical, Mental, and Spiritual—each further subdivided, and illustrates how these planes correspond through a unified vibrational spectrum.$$,
    $$This lesson discusses the Divine Paradox of the Hermetic doctrine that while the universe is ultimately unreal from the Absolute viewpoint, it remains real and meaningful on the Relative plane, encouraging mastery through transcending illusion rather than denying reality.$$,
    $$This lesson elaborates on the Hermetic Principles of Vibration, Polarity, and Rhythm, explaining their roles as fundamental laws governing all phenomena and providing the basis for mental mastery and transformation.$$,
    $$This lesson elaborates on the Hermetic Principles of Vibration, Polarity, and Rhythm, explaining their roles as fundamental laws governing all phenomena and providing the basis for mental mastery and transformation.$$,
    $$This lesson outlines the Principle of Cause and Effect, emphasizing universal lawfulness and how advanced practitioners rise beyond mere effects to consciously become causes and masters of their environment and destiny.$$,
    $$This lesson describes the Hermetic Principle of Gender as it applies to the mental realm, explaining the dual aspects of mind—Masculine (the active will or 'I') and Feminine (the receptive, creative 'Me')—and their roles in mental creation.$$,
    $$This lesson emphasizes the imperative of practical application of Hermetic knowledge, focusing on mental transmutation, mastery of moods, and the use of polarity and rhythm principles to transform mental states and influence environment.$$,
    $$2025-09-18 04:22:48.135266+00$$,
    $$2025-09-18 04:22:48.135266+00$$
);

-- =====================================================
-- Self-Compassion (course_id: -211735735)
-- =====================================================
INSERT INTO course_description (
    id,
    course_id,
    chapter_1_description,
    lesson_1_1_description,
    lesson_1_2_description,
    lesson_1_3_description,
    lesson_1_4_description,
    chapter_2_description,
    lesson_2_1_description,
    lesson_2_2_description,
    lesson_2_3_description,
    lesson_2_4_description,
    chapter_3_description,
    lesson_3_1_description,
    lesson_3_2_description,
    lesson_3_3_description,
    lesson_3_4_description,
    created_at,
    updated_at
) VALUES (
    28,
    -211735735,
    $$This chapter introduces the nature of self-compassion, mindfulness, and acceptance as healthy ways of responding to emotional pain and life's inevitable hardships. It explores how difficult emotions and resistance to them cause suffering, and how self-compassion practices rooted in mindfulness can transform our relationship with pain, fostering emotional healing.$$,
    $$This lesson covers the foundations of self-compassion by examining how emotional pain is inevitable and often resisted, which compounds suffering. It explains how caring for oneself with kindness and acceptance, rather than self-criticism and avoidance, is the core of self-compassion and can profoundly change our emotional experience and well-being.$$,
    $$This lesson discusses mindfulness as an evidence-based psychotherapy technique that fosters awareness and acceptance of present-moment experience. It explains that practicing mindfulness helps soften the impact of negative emotions and supports emotion regulation by enabling us to experience our feelings with less struggle and self-judgment.$$,
    $$Focusing on the formula pain times resistance equals suffering, this lesson details how emotional suffering arises from resisting pain. It outlines the progressive stages of cultivating acceptance—from aversion to friendship—with one's suffering and how self-judgment disrupts emotional healing, highlighting mindful witnessing as a key skill.$$,
    $$This lesson introduces mindfulness as the deliberate awareness of present experience with an attitude of openheartedness. It describes mindfulness vs. mindlessness, the value of body awareness as a stable anchor for attention, and acknowledges the importance of emotional openness as the foundation for a healing and compassionate approach.$$,
    $$This chapter teaches practical mindfulness techniques that anchor awareness in the body and emotions, enabling practitioners to regulate difficult feelings and cultivate self-soothing and acceptance. It then presents mindful self-compassion tools and the F-A-C-E model to intentionally face emotional pain with compassion, acceptance, and wise action.$$,
    $$This lesson explains the value of giving the mind an anchor to steady attention, typically the breath, and explores how mindful awareness of body sensations provides a stable foundation for mindfulness. It addresses potential challenges for body awareness and encourages flexible use of individually chosen anchors to calm and focus the mind.$$,
    $$Here learners practice turning toward difficult emotions with openness and self-compassion rather than avoidance or resistance. The lesson explains how emotions are integrated bodily and mentally, how clinging or pushing away emotions exacerbates suffering, and how mindful acceptance and self-kindness create a healthier emotional relationship.$$,
    $$This lesson introduces the practice of labeling emotions and mental states as a powerful way to ground awareness, reduce reactivity, and calm the brain. It highlights neuroscientific evidence supporting labeling's role in emotion regulation and encourages learners to use personally meaningful words to create space around difficult feelings.$$,
    $$This lesson outlines four key steps—feel, accept, compassionately respond, and expect skillful action—for working intentionally with emotional pain. It describes key mindfulness and acceptance strategies such as softening, allowing, labeling, and loving-kindness, emphasizing kindness toward oneself as the catalyst for wise behavioral changes.$$,
    $$This chapter explores the integration of self-compassion with loving-kindness meditation and offers strategies for personalizing the practice to individual personality styles and life circumstances. It also discusses means of sustaining self-compassion practice over time, measuring progress, and addressing common challenges, emphasizing continuous cultivation of kindness toward oneself.$$,
    $$This lesson covers the history, meaning, and practice of loving-kindness (metta) meditation. It explains how loving-kindness builds upon mindfulness by cultivating intentions, attention, feelings, and connection, and discusses common obstacles like resistance and backdraft, while guiding learners through addressing difficult feelings with consistent kindness.$$,
    $$This lesson details the importance of adapting self-compassion practice to fit diverse personality types and outlines twelve common styles with typical challenges and strengths. It also describes the five mental hindrances—clinging, aversion, weariness, agitation, and doubt—and how recognizing these can help practitioners maintain a balanced and effective practice.$$,
    $$This lesson emphasizes that kindness is both the means and goal of self-compassion practice. It encourages applying kindness continuously across daily experiences and relationships, cultivating mindfulness in formal and informal ways, and highlights the importance of repeated practice to rewire the brain, reinforcing kind and compassionate responses to suffering.$$,
    $$This lesson addresses the paradoxical nature of progress in self-compassion practice, encouraging the view that progress lies in accepting oneself more fully despite negative feelings. It offers practical guidance for self-monitoring transformation through self-kindness in daily life, embracing challenges as learning opportunities, and unwavering commitment to kindness as a lifelong path.$$,
    $$2025-09-18 09:41:33.762118+00$$,
    $$2025-09-18 09:41:33.762118+00$$
);

-- =====================================================
-- The Shock Doctrine (course_id: 498493852)
-- =====================================================
INSERT INTO course_description (
    id,
    course_id,
    chapter_1_description,
    lesson_1_1_description,
    lesson_1_2_description,
    lesson_1_3_description,
    lesson_1_4_description,
    chapter_id_1,
    chapter_2_description,
    lesson_2_1_description,
    lesson_2_2_description,
    lesson_2_3_description,
    lesson_2_4_description,
    chapter_id_2,
    chapter_3_description,
    lesson_3_1_description,
    lesson_3_2_description,
    lesson_3_3_description,
    lesson_3_4_description,
    chapter_id_3,
    created_at,
    updated_at
) VALUES (
    10,
    498493852,
    $$This chapter explores the psychological and political roots of the Shock Doctrine by examining experiments in electroshock and sensory deprivation, alongside the development of neoliberal economic strategy from its origins in the 1950s, highlighting how early mind control experiments and thought leaders like Milton Friedman shaped the ideology and tactics of crisis exploitation.$$,
    $$This lesson traces the origins of the Shock Doctrine to CIA-funded electroshock and sensory deprivation experiments designed to erase and remake the human mind, illustrating how these tactics later influenced state repression and neoliberal economic strategies of exploiting crises.$$,
    $$This lesson focuses on the development of neoliberal thought at the University of Chicago under Milton Friedman, describing how this intellectual movement sought to purify markets globally by removing state interventions, with Latin America's Southern Cone becoming an early testing ground for这些 ideas.$$,
    $$This lesson examines the early applications of economic shock therapy by governments, highlighting its rapid and brutal implementation in Chile under Pinochet, where severe economic contractions and mass unemployment were rationalized as necessary for sweeping neoliberal reforms.$$,
    $$This lesson links the processes and logic of torture and trauma with economic shock therapy, illustrating how mass disorientation is used politically and economically to enforce radical neoliberal policies, changing the course of history.$$,
    $$baaf3234$$,
    $$This chapter explores the global application of disaster capitalism through cases in Latin America, Eastern Europe, Asia, and Africa where neoliberal shock therapy was imposed often through authoritarian regimes, repression, and the suppression of democratic institutions, while resistance and reemergence of social movements challenged这些 strategies.$$,
    $$This lesson discusses how Chile's 1973 coup introduced three successive shocks—political, economic, and terror—that reshaped the country and were replicated in other Latin American nations, showing the brutal tactics authoritarian regimes used to maintain control.$$,
    $$This lesson examines the implementation of shock therapy in post-communist countries like Poland and Russia, highlighting the economic hardships, rise of inequality and the fusion of corporate and state power at the expense of workers and social protections.$$,
    $$This lesson explores how the International Monetary Fund exploited hyperinflation and economic crises in developing countries to impose structural adjustment programs, forcing radical economic reforms and creating new market opportunities for multinational corporations.$$,
    $$This lesson discusses how neoliberalism's association with repression and corruption in Latin America created initial doubts, but the ideology escaped lasting dis credibility—with many key proponents holding influential roles in both public policy and private industry, blurring the lines between politics and privatized war and reconstruction.$$,
    $$34f1866c$$,
    $$This lesson outlines how the Bush administration transformed the War on Terror into a privatized economy based on fear and crisis exploitation, creating a disaster capitalism complex with profound corporate involvement in war, governmental functions, and disaster response.$$,
    $$This lesson outlines how the Bush administration transformed the War on Terror into a privatized economy based on fear and crisis exploitation, creating a disaster capitalism complex with profound corporate involvement in war, governmental functions, and disaster response.$$,
    $$This lesson examines the neoliberal shock therapy and economic liberalization imposed during the Iraq occupation, highlighting the resulting economic devastation, resistance fueled by privatization and exclusion, and the emergence of stark social divisions symbolized by the Green Zone.$$,
    $$This lesson details how post-disaster reconstruction in Sri Lanka became an opportunity for privatization and land grabs under the guise of development, exacerbating inequalities and sparking social conflict, while public discourse narrowly focuses on individual corruption and neglects the deeper privatized war economy.$$,
    $$This lesson explorers the rise of social movements across former shock doctrine experiment sites, highlighting a spreading resistance to neoliberalism that demands greater democracy and economic control, including the notable awakening in China breaking years of suppressed dissent.$$,
    $$79e94844$$,
    $$2025-09-05 10:11:08.327148+00$$,
    $$2025-09-06 06:39:54.770044+00$$
);

-- =====================================================
-- Media Ecology (course_id: 2043436001)
-- =====================================================
INSERT INTO course_description (
    id,
    course_id,
    chapter_1_description,
    lesson_1_1_description,
    lesson_1_2_description,
    lesson_1_3_description,
    lesson_1_4_description,
    chapter_2_description,
    lesson_2_1_description,
    lesson_2_2_description,
    lesson_2_3_description,
    lesson_2_4_description,
    chapter_3_description,
    lesson_3_1_description,
    lesson_3_2_description,
    lesson_3_3_description,
    lesson_3_4_description,
    created_at,
    updated_at
) VALUES (
    27,
    2043436001,
    $$This chapter traces the transformation of American public discourse from a culture dominated by the printed word and typographic reason to one fundamentally altered by electronic media, particularly television. It explores how different media forms shape the content, style, and epistemology of communication, showing the decline of rational, print-based public conversation and the rise of fragmented, image-based discourse.$$,
    $$This lesson establishes the fundamental thesis that media act as metaphors shaping the very content and forms of human conversation within a culture, illustrating how shifts from one medium (like writing) to another (like television) transform how societies think and what ideas they can express.$$,
    $$This lesson examines how the dominant medium of communication determines a culture's epistemology, or its way of knowing, illustrating that the printed word shaped American definitions of truth and intelligence centered on rationality and coherence, contrasted with the fragmentation introduced by electronic media.$$,
    $$This lesson details how Colonial and 19th-century America was profoundly shaped by the printed word and typographic culture, which fostered literacy, reasoned public discourse, and intellectual rigor, coining this era the Age of Exposition before its gradual decline late in the 19th century.$$,
    $$This lesson explains how electricity, through the telegraph and photography, revolutionized communication by collapsing space and speed constraints but in doing so undermined the coherent, contextualized typographic discourse, initiating a new fragmented, image-driven, and context-free public conversation.$$,
    $$This chapter examines television as the dominant medium transforming American public life into entertainment-oriented show business, fundamentally altering politics, religion, news, and education into forms driven by images, rapid fragments, and theatrical performance rather than reasoned discourse.$$,
    $$This lesson defines television as a medium that fundamentally transforms public discourse by prioritizing entertainment above all else, making entertainment itself the primary format for the presentation of all experience and reshaping news and其他 content accordingly.$$,
    $$This lesson focuses on the 'Now...This' phenomenon in television news, highlighting how rapid, disconnected news segments erode context and significance, promoting trivialization and emotional detachment from serious events, and reinforcing an entertainment-driven approach to public discourse.$$,
    $$This lesson analyzes how politics and religion have been transformed into entertainment forms under television's influence, where political image and advertising supersede substantive discourse and religious ritual and theology are largely replaced by media-driven spectacle.$$,
    $$This lesson contrasts Orwell's vision of oppressive tyranny with Huxley's warning about a culture pacified and debilitated by endless amusement, arguing that American society is increasingly realizing the latter scenario as entertainment dominates public discourse, risking cultural and intellectual decay.$$,
    $$This chapter focuses on television's profound impact on education, politics, and cultural meaning by reshaping learning into entertainment, transforming political discourse into image-based therapy, and contributing to a shallow, amnesiac public consciousness with significant implications for cultural survival and resistance.$$,
    $$This lesson critiques 'Sesame Street' and类似电视 programming for transforming education into entertainment, fostering a style of learning that conflicts with traditional classroom methods and encouraging children to love television more than formal schooling.$$,
    $$This lesson describes television as a pervasive curriculum that shapes youth's attention, learning habits, and intellectual development outside traditional schools, ultimately competing with and undermining established educational systems.$$,
    $$This lesson discusses how television politics prioritizes image and psychological appeal over substantive policy or history, resulting in symbolic voting behavior and a collapse of historical memory into an incoherent continuous present.$$,
    $$This lesson contrasts Orwellian oppression with Huxleyan distraction, highlights the spiritual risks of a culture consumed by amusement, and urges developing critical media awareness as an essential step toward cultural survival and resistance.$$,
    $$2025-09-18 09:13:54.459505+00$$,
    $$2025-09-18 09:13:54.459505+00$$
);

-- =====================================================
-- The Power of Assumption (course_id: -744437687)
-- =====================================================
INSERT INTO course_description (
    id,
    course_id,
    chapter_1_description,
    lesson_1_1_description,
    lesson_1_2_description,
    lesson_1_3_description,
    lesson_1_4_description,
    chapter_2_description,
    lesson_2_1_description,
    lesson_2_2_description,
    lesson_2_3_description,
    lesson_2_4_description,
    chapter_3_description,
    lesson_3_1_description,
    lesson_3_2_description,
    lesson_3_3_description,
    lesson_3_4_description,
    created_at,
    updated_at
) VALUES (
    34,
    -744437687,
    $$This chapter explores consciousness as the fundamental and indivisible reality that manifests in all forms, emphasizing that 'I AM' is the self-definition of the absolute and the foundation of existence. It presents consciousness as the sole cause-substance determining all life phenomena, where individual experiences are shaped by one's concepts of self.$$,
    $$This lesson explains that 'I AM' is the indivisible consciousness underlying all existence, the self-definition of the absolute, which manifests uniquely through personal self-concepts. It establishes that one's concept of self directly shapes one's reality, making each individual the arbiter of their own fate.$$,
    $$This lesson elucidates that consciousness is the sole reality and substance, with all phenomena including material objects being products of其 arrangement. It emphasizes the inseparability of the individual and their environment, and how changing one's self-concept alters one's experience.$$,
    $$This lesson reveals that all external events stem from an individual's state of consciousness, and personal transformation begins with desire followed by assuming the feeling of the wish fulfilled. It underscores imagination as the sole creative and redemptive power by which one incarnates new states of being.$$,
    $$This lesson强调 that life changes are governed solely by one's assumptions and attitudes toward self, which create fate. Persisting in the sensory vivid feeling of the wish fulfilled transforms desire into its inevitable fulfillment and fosters a higher self-concept.$$,
    $$This chapter focuses on the practical application of controlling imagination and attention to consciously manifest desires. It details techniques such as visualization, focused attention, renunciation of negative thoughts, persistence, and faith, highlighting the psychological principles that enable mastery over one's assumptions and resultant life.$$,
    $$This lesson teaches how deliberate control of imagination through vivid visualization and sustained emotional feeling of already being the desired state transforms mental images into perceived reality, empowering mastery over life's circumstances.$$,
    $$This lesson highlights the critical role of focused and disciplined attention in controlling imagination to change self-concept and life outcomes. It illustrates how assumptions shape perception and behavior, and how mastery of attention enables problem-solving and transformation.$$,
    $$This lesson instructs on renouncing negativity by withdrawing attention from undesired states and focusing on desired outcomes, employing subjective control over attention. It introduces the principle of Least Action, explaining that effortless attainment is achieved through persistent assumption anchored in focused attention.$$,
    $$This lesson stresses that persistence in assuming the wish fulfilled is essential to manifesting desires, and that success depends on the naturalness of feeling already to be what you want. Faith is定义为 a personal, unwavering conviction in the unseen reality of assumed states and is a vital conscious activity.$$,
    $$This chapter addresses the ethical implications of the law of assumption, the role of free will, and the conscious creation of destiny. It includes illustrative case histories demonstrating practical applications and concludes with an exploration of reverence as the highest feeling arising from awareness of one's divine creative power.$$,
    $$This lesson clarifies that righteousness is the consciousness of already being what one desires and is essential to transcending sin, defined as failure to attain desires. It explains that free will is the freedom to select assumptions, but all events follow automatically from those assumptions.$$,
    $$This lesson outlines three prerequisites for successful use of the law: intense desire, cultivating physical immobility to enhance concentration, and assuming the wish fulfilled through masterful imagination. It stresses at-onement with the goal through joyful identification and notes the impartial operation of the law regardless of intent.$$,
    $$This lesson presents multiple detailed case histories showing how individuals successfully applied the law of assumption by assuming desired states in imagination persistently, resulting in concrete life changes such as honorable discharge, business success, and acquiring a dog through unexpected means.$$,
    $$This lesson explains that destiny is the inevitable experience created moment-to-moment by one's consciousness, with infinite life offering endless new destinies to attain. It culminates in describing reverence—the profound feeling of closeness to one's divine self—as central to a rich and meaningful life.$$,
    $$2025-09-20 01:57:47.179428+00$$,
    $$2025-09-20 01:57:47.179428+00$$
);

-- =====================================================
-- Verification query
-- =====================================================
SELECT id, course_id FROM course_description ORDER BY id;

