import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import courseService from '../services/courseService';
import { 
  BookOpen, 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  Star, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
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

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [course, setCourse] = useState(null);
  const [courseStructure, setCourseStructure] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [unlockStatus, setUnlockStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId, user]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load full course structure (metadata + parsed structure)
      const { data: fullCourse, error: structureError } = await courseService.getFullCourseStructure(courseId);
      if (structureError) throw structureError;
      
      setCourse(fullCourse);
      setCourseStructure(fullCourse);

      // Load unlock status
      if (user) {
        const { data: unlock, error: unlockError } = await courseService.checkCourseUnlock(user.id, courseId);
        if (unlockError) throw unlockError;
        setUnlockStatus(unlock);

        // Load user progress (use course_id, not UUID)
        if (fullCourse?.course_id) {
          const { data: progress, error: progressError } = await courseService.getUserCourseProgress(user.id, fullCourse.course_id);
          if (progressError) throw progressError;
          setUserProgress(progress);

          // Calculate progress percentage
          const { data: calculatedProgress } = await courseService.calculateCourseProgress(user.id, fullCourse.course_id);
          if (calculatedProgress) {
            setUserProgress(prev => ({
              ...prev,
              progress_percentage: calculatedProgress.progressPercentage,
              status: calculatedProgress.status
            }));
          }
        }
      }
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Failed to load course. Please try again.');
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = () => {
    if (!unlockStatus?.isUnlocked) {
      toast.error(`You need ${unlockStatus?.requiredXp || 0} XP to unlock this course`);
      return;
    }

    // Navigate to first lesson or continue from last position
    if (courseStructure?.chapters?.[0]?.lessons?.[0]) {
      const firstLesson = courseStructure.chapters[0].lessons[0];
      navigate(`/courses/${courseId}/chapters/${firstLesson.chapter_number}/lessons/${firstLesson.lesson_number}`);
    } else {
      toast.error('Course structure not available');
    }
  };

  const handleLessonClick = (chapterNumber, lessonNumber) => {
    if (!unlockStatus?.isUnlocked) {
      toast.error(`You need ${unlockStatus?.requiredXp || 0} XP to unlock this course`);
      return;
    }
    navigate(`/courses/${courseId}/chapters/${chapterNumber}/lessons/${lessonNumber}`);
  };

  const getSchoolColor = (school) => {
    const colors = {
      'Ignition': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Insight': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Transformation': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'God Mode': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    return colors[school] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

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

  if (error || !course) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <ErrorDisplay
          title="Failed to load course"
          message={error || 'Course not found'}
          onRetry={() => loadCourseData()}
          variant="card"
        />
      </div>
    );
  }

  const isUnlocked = unlockStatus?.isUnlocked || false;
  const progressPercentage = userProgress?.progress_percentage || 0;
  const totalLessons = courseStructure?.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Breadcrumbs - Hidden on mobile */}
      <div className="mb-6 hidden lg:block">
        <Breadcrumbs
          customItems={[
            { label: 'Home', path: '/dashboard', icon: Home },
            { label: 'Courses', path: '/courses' },
            { label: course.course_title, path: `/courses/${courseId}` }
          ]}
        />
      </div>

      {/* Course Header */}
      <Card className="glass-effect-enhanced border-slate-600/50 mb-6">
        <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Badge variant="outline" className={getSchoolColor(course.masterschool)}>
                {course.masterschool}
              </Badge>
              {course.difficulty_level && (
                <Badge variant="secondary">
                  {course.difficulty_level}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {course.course_title}
            </h1>
            {course.topic && (
              <p className="text-gray-400 text-lg mb-4">Topic: {course.topic}</p>
            )}
          </div>

          {/* Unlock Status */}
          {!isUnlocked && (
            <Card className="border-red-500/30 bg-red-500/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={20} className="text-red-400" />
                  <span className="text-red-400 font-semibold">Locked</span>
                </div>
                <p className="text-sm text-slate-300 mb-1">
                  Requires: <span className="text-yellow-400 font-medium">{unlockStatus?.requiredXp || 0} XP</span>
                </p>
                <p className="text-xs text-slate-400">
                  You have: <span className="text-slate-300">{unlockStatus?.userXp || 0} XP</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-effect-enhanced border-slate-600/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <BookOpen size={16} />
                <span className="text-sm">Chapters</span>
              </div>
              <p className="text-2xl font-bold text-white">{courseStructure?.chapters?.length || 0}</p>
            </CardContent>
          </Card>
          <Card className="glass-effect-enhanced border-slate-600/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Play size={16} />
                <span className="text-sm">Lessons</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalLessons}</p>
            </CardContent>
          </Card>
          <Card className="glass-effect-enhanced border-slate-600/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock size={16} />
                <span className="text-sm">Duration</span>
              </div>
              <p className="text-2xl font-bold text-white">{course.duration_hours || 0}h</p>
            </CardContent>
          </Card>
          <Card className="glass-effect-enhanced border-slate-600/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <TrendingUp size={16} />
                <span className="text-sm">XP Threshold</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{course.xp_threshold || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {userProgress && progressPercentage > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm font-medium text-white">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Start/Continue Button */}
        <Button
          onClick={handleStartCourse}
          disabled={!isUnlocked}
          size="lg"
          className={`w-full lg:w-auto ${
            isUnlocked
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
              : ''
          }`}
        >
          {userProgress?.status === 'completed' ? (
            <>
              <CheckCircle size={20} className="mr-2" />
              Course Completed
            </>
          ) : userProgress?.status === 'in_progress' ? (
            <>
              <Play size={20} className="mr-2" />
              Continue Course
            </>
          ) : (
            <>
              <Play size={20} className="mr-2" />
              Start Course
            </>
          )}
        </Button>
        </CardContent>
      </Card>

      {/* Course Outline */}
      <Card className="glass-effect-enhanced border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-2xl">Course Outline</CardTitle>
        </CardHeader>
        <CardContent>
        {!courseStructure?.chapters || courseStructure.chapters.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No chapters available"
            description="This course is still being developed. Check back soon!"
            variant="default"
          />
        ) : (
          <div className="space-y-4">
            {courseStructure.chapters.map((chapter, chapterIndex) => (
              <Card key={chapter.id} className="glass-effect-enhanced border-slate-600/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      Chapter {chapter.chapter_number}: {chapter.chapter_title}
                    </h3>
                    <Badge variant="outline" className="text-slate-400">
                      {chapter.lessons?.length || 0} {chapter.lessons?.length === 1 ? 'lesson' : 'lessons'}
                    </Badge>
                  </div>

                  {chapter.lessons && chapter.lessons.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {chapter.lessons.map((lesson, lessonIndex) => {
                        // TODO: Check if lesson is completed (need to fetch from user_lesson_progress)
                        const isCompleted = false;
                        
                        return (
                          <Button
                            key={`${lesson.chapter_number}_${lesson.lesson_number}`}
                            onClick={() => handleLessonClick(lesson.chapter_number, lesson.lesson_number)}
                            disabled={!isUnlocked}
                            variant={isUnlocked ? "outline" : "ghost"}
                            className={`w-full flex items-center justify-between ${
                              isUnlocked
                                ? 'hover:bg-slate-700'
                                : 'cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isCompleted ? (
                                <CheckCircle size={20} className="text-emerald-400" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center">
                                  <span className="text-xs text-slate-500">{lesson.lesson_number}</span>
                                </div>
                              )}
                              <span className="text-sm font-medium">
                                Lesson {lesson.lesson_number}: {lesson.lesson_title}
                              </span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400" />
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailPage;

