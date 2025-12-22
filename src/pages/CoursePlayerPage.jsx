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
  Clock,
  Home
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <SkeletonLoader type="text" count={1} variant="glass" />
        </div>
        <div className="space-y-6">
          <SkeletonLoader type="card" count={1} variant="glass" />
          <SkeletonLoader type="card" count={1} variant="glass" />
        </div>
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <ErrorDisplay
          title="Failed to load lesson"
          message={error || 'Lesson not found'}
          onRetry={() => loadLessonData()}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Breadcrumbs - Hidden on mobile */}
      <div className="mb-6 hidden lg:block">
        <Breadcrumbs
          customItems={[
            { label: 'Home', path: '/dashboard', icon: Home },
            { label: 'Courses', path: '/courses' },
            { label: course?.course_title || 'Course', path: `/courses/${courseId}` },
            { label: `Chapter ${chapterNum} - Lesson ${lessonNum}`, path: `/courses/${courseId}/chapters/${chapterNum}/lessons/${lessonNum}` }
          ]}
        />
      </div>

      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/courses/${courseId}`)}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Course
        </Button>

        <div className="flex items-center gap-2">
          {previousLesson && (
            <Button
              variant="outline"
              onClick={() => handleNavigateLesson(previousLesson.lesson.chapter_number, previousLesson.lesson.lesson_number)}
              className="hidden md:flex"
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </Button>
          )}
          {nextLesson && (
            <Button
              onClick={() => handleNavigateLesson(nextLesson.lesson.chapter_number, nextLesson.lesson.lesson_number)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hidden md:flex"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <Card className="glass-effect-enhanced border-slate-600/50 mb-6">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2 flex-wrap">
              <BookOpen size={16} />
              <Badge variant="outline">Chapter {chapterNum}</Badge>
              <span>•</span>
              <Badge variant="outline">Lesson {lessonNum}</Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              {currentLesson.lesson_title}
            </h1>
            {lessonDescription?.lesson_description && (
              <p className="text-slate-400 mt-2">{lessonDescription.lesson_description}</p>
            )}
            {lessonDescription?.chapter_description && (
              <p className="text-sm text-slate-500 mt-1 italic">{lessonDescription.chapter_description}</p>
            )}
          </div>

          {/* Completion Status */}
          <div className="flex items-center justify-between">
            {isCompleted ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={20} />
                <span className="font-medium">Lesson Completed</span>
              </div>
            ) : (
              <Button
                onClick={handleCompleteLesson}
                disabled={isCompleting || isCompleted}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isCompleting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <Card className="glass-effect-enhanced border-slate-600/50 mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-400 mb-1">{lessonContent.key_terms_1}</h4>
                        <p className="text-slate-300 text-sm">{lessonContent.key_terms_1_def}</p>
                      </CardContent>
                    </Card>
                  )}
                  {lessonContent.key_terms_2 && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-400 mb-1">{lessonContent.key_terms_2}</h4>
                        <p className="text-slate-300 text-sm">{lessonContent.key_terms_2_def}</p>
                      </CardContent>
                    </Card>
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
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-purple-400 mb-1">{lessonContent.core_concepts_1}</h4>
                        <p className="text-slate-300 text-sm">{lessonContent.core_concepts_1_def}</p>
                      </CardContent>
                    </Card>
                  )}
                  {lessonContent.core_concepts_2 && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-purple-400 mb-1">{lessonContent.core_concepts_2}</h4>
                        <p className="text-slate-300 text-sm">{lessonContent.core_concepts_2_def}</p>
                      </CardContent>
                    </Card>
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
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{lessonContent.key_takeaways_1}</span>
                    </li>
                  )}
                  {lessonContent.key_takeaways_2 && (
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{lessonContent.key_takeaways_2}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Content coming soon"
            description="This lesson content is being prepared. Check back soon!"
            variant="default"
          />
        )}
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4">
        {previousLesson ? (
          <Button
            variant="outline"
            onClick={() => handleNavigateLesson(previousLesson.lesson.chapter_number, previousLesson.lesson.lesson_number)}
            className="flex items-center gap-2 flex-1 md:flex-initial"
          >
            <ChevronLeft size={20} />
            <div className="text-left hidden sm:block">
              <div className="text-xs text-slate-400">Previous</div>
              <div className="text-sm font-medium">
                {previousLesson.lesson.lesson_title}
              </div>
            </div>
            <span className="sm:hidden">Previous</span>
          </Button>
        ) : (
          <div></div>
        )}

        {nextLesson ? (
          <Button
            onClick={() => handleNavigateLesson(nextLesson.lesson.chapter_number, nextLesson.lesson.lesson_number)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex-1 md:flex-initial"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-200">Next</div>
              <div className="text-sm font-medium">
                {nextLesson.lesson.lesson_title}
              </div>
            </div>
            <span className="sm:hidden">Next</span>
            <ChevronRight size={20} />
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
