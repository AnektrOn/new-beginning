import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import courseService from '../services/courseService';
import { 
  ArrowLeft, 
  CheckCircle, 
  Play, 
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CoursePlayerPage = () => {
  const { courseId, chapterNumber, lessonNumber } = useParams();
  const navigate = useNavigate();
  const { user, profile, fetchProfile } = useAuth();
  const [course, setCourse] = useState(null);
  const [courseStructure, setCourseStructure] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [lessonDescription, setLessonDescription] = useState(null);
  const [userLessonProgress, setUserLessonProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const chapterNum = parseInt(chapterNumber);
  const lessonNum = parseInt(lessonNumber);

  useEffect(() => {
    if (courseId && chapterNum && lessonNum) {
      loadLessonData();
    }
  }, [courseId, chapterNum, lessonNum, user]);

  const loadLessonData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load full course structure
      const { data: fullCourse, error: structureError } = await courseService.getFullCourseStructure(courseId);
      if (structureError) throw structureError;
      
      setCourse(fullCourse);
      setCourseStructure(fullCourse);

      // Find current chapter and lesson
      const chapter = fullCourse?.chapters?.find(ch => ch.chapter_number === chapterNum);
      const lesson = chapter?.lessons?.find(l => l.lesson_number === lessonNum);

      if (!chapter || !lesson) {
        throw new Error('Lesson not found');
      }

      setCurrentChapter(chapter);
      setCurrentLesson(lesson);

      // Load lesson content (use course_id, not UUID)
      if (fullCourse?.course_id) {
        const { data: content, error: contentError } = await courseService.getLessonContent(
          fullCourse.course_id,
          chapterNum,
          lessonNum
        );
        if (contentError && contentError.code !== 'PGRST116') {
          console.warn('Lesson content not found:', contentError);
        } else {
          setLessonContent(content);
        }

        // Load lesson description
        const { data: description } = await courseService.getLessonDescription(
          courseId,
          chapterNum,
          lessonNum
        );
        setLessonDescription(description);

        // Load user progress
        if (user) {
          const { data: progress } = await courseService.getUserLessonProgress(
            user.id,
            fullCourse.course_id,
            chapterNum,
            lessonNum
          );
          setUserLessonProgress(progress);
        }
      }
    } catch (err) {
      console.error('Error loading lesson:', err);
      setError('Failed to load lesson. Please try again.');
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!user || !course?.course_id) return;

    try {
      setIsCompleting(true);
      
      // Complete lesson (awards XP)
      const { data, error: completeError } = await courseService.completeLesson(
        user.id,
        course.course_id,
        chapterNum,
        lessonNum,
        50
      );
      
      if (completeError) throw completeError;

      setUserLessonProgress({ ...data.lessonProgress, is_completed: true });

      // Refresh profile to update XP
      if (user.id) {
        setTimeout(async () => {
          await fetchProfile(user.id);
        }, 500);
      }

      // Recalculate course progress
      await courseService.calculateCourseProgress(user.id, course.course_id);

      toast.success(`Lesson completed! +${data.xpAwarded} XP earned`, {
        duration: 4000,
        style: {
          background: 'rgba(30, 41, 59, 0.95)',
          color: '#fff',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 9999,
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#fff',
        },
      });
    } catch (err) {
      console.error('Error completing lesson:', err);
      toast.error('Failed to complete lesson. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const getNextLesson = () => {
    if (!courseStructure?.chapters) return null;

    let foundCurrent = false;
    for (const chapter of courseStructure.chapters) {
      for (const lesson of chapter.lessons || []) {
        if (foundCurrent) {
          return { lesson, chapter };
        }
        if (lesson.chapter_number === chapterNum && lesson.lesson_number === lessonNum) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!courseStructure?.chapters) return null;

    let previousLesson = null;
    for (const chapter of courseStructure.chapters) {
      for (const lesson of chapter.lessons || []) {
        if (lesson.chapter_number === chapterNum && lesson.lesson_number === lessonNum) {
          return previousLesson;
        }
        previousLesson = { lesson, chapter };
      }
    }
    return null;
  };

  const handleNavigateLesson = (targetChapterNum, targetLessonNum) => {
    navigate(`/courses/${courseId}/chapters/${targetChapterNum}/lessons/${targetLessonNum}`);
  };

  const isCompleted = userLessonProgress?.is_completed || false;
  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Lesson not found'}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Course</span>
        </button>

        <div className="flex items-center gap-2">
          {previousLesson && (
            <button
              onClick={() => handleNavigateLesson(previousLesson.lesson.chapter_number, previousLesson.lesson.lesson_number)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="hidden md:inline">Previous</span>
            </button>
          )}
          {nextLesson && (
            <button
              onClick={() => handleNavigateLesson(nextLesson.lesson.chapter_number, nextLesson.lesson.lesson_number)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <div className="glass-effect rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <BookOpen size={16} />
            <span>Chapter {chapterNum}</span>
            <span>•</span>
            <span>Lesson {lessonNum}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            {currentLesson.lesson_title}
          </h1>
          {lessonDescription?.lesson_description && (
            <p className="text-gray-400 mt-2">{lessonDescription.lesson_description}</p>
          )}
          {lessonDescription?.chapter_description && (
            <p className="text-sm text-gray-500 mt-1 italic">{lessonDescription.chapter_description}</p>
          )}
        </div>

        {/* Completion Status */}
        <div className="flex items-center justify-between">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={20} />
              <span className="font-medium">Lesson Completed</span>
            </div>
          ) : (
            <button
              onClick={handleCompleteLesson}
              disabled={isCompleting || isCompleted}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isCompleted
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Mark as Complete
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="glass-effect rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Lesson Content</h2>
        
        {lessonContent ? (
          <div className="space-y-6">
            {/* The Hook */}
            {lessonContent.the_hook && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">The Hook</h3>
                <p className="text-gray-300">{lessonContent.the_hook}</p>
              </div>
            )}

            {/* Key Terms */}
            {(lessonContent.key_terms_1 || lessonContent.key_terms_2) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Terms</h3>
                <div className="space-y-3">
                  {lessonContent.key_terms_1 && (
                    <div className="bg-slate-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-400 mb-1">{lessonContent.key_terms_1}</h4>
                      <p className="text-gray-300 text-sm">{lessonContent.key_terms_1_def}</p>
                    </div>
                  )}
                  {lessonContent.key_terms_2 && (
                    <div className="bg-slate-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-400 mb-1">{lessonContent.key_terms_2}</h4>
                      <p className="text-gray-300 text-sm">{lessonContent.key_terms_2_def}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Core Concepts */}
            {(lessonContent.core_concepts_1 || lessonContent.core_concepts_2) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Core Concepts</h3>
                <div className="space-y-3">
                  {lessonContent.core_concepts_1 && (
                    <div className="bg-slate-800 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-400 mb-1">{lessonContent.core_concepts_1}</h4>
                      <p className="text-gray-300 text-sm">{lessonContent.core_concepts_1_def}</p>
                    </div>
                  )}
                  {lessonContent.core_concepts_2 && (
                    <div className="bg-slate-800 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-400 mb-1">{lessonContent.core_concepts_2}</h4>
                      <p className="text-gray-300 text-sm">{lessonContent.core_concepts_2_def}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Synthesis */}
            {lessonContent.synthesis && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Synthesis</h3>
                <p className="text-gray-300">{lessonContent.synthesis}</p>
              </div>
            )}

            {/* Connect to Your Life */}
            {lessonContent.connect_to_your_life && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Connect to Your Life</h3>
                <p className="text-gray-300">{lessonContent.connect_to_your_life}</p>
              </div>
            )}

            {/* Key Takeaways */}
            {(lessonContent.key_takeaways_1 || lessonContent.key_takeaways_2) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Takeaways</h3>
                <ul className="space-y-2">
                  {lessonContent.key_takeaways_1 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{lessonContent.key_takeaways_1}</span>
                    </li>
                  )}
                  {lessonContent.key_takeaways_2 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{lessonContent.key_takeaways_2}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Lesson content is being prepared. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        {previousLesson ? (
          <button
            onClick={() => handleNavigateLesson(previousLesson.lesson.chapter_number, previousLesson.lesson.lesson_number)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
            <div className="text-left">
              <div className="text-xs text-gray-400">Previous</div>
              <div className="text-sm font-medium text-white">
                {previousLesson.lesson.lesson_title}
              </div>
            </div>
          </button>
        ) : (
          <div></div>
        )}

        {nextLesson ? (
          <button
            onClick={() => handleNavigateLesson(nextLesson.lesson.chapter_number, nextLesson.lesson.lesson_number)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-gray-200">Next</div>
              <div className="text-sm font-medium text-white">
                {nextLesson.lesson.lesson_title}
              </div>
            </div>
            <ChevronRight size={20} />
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
