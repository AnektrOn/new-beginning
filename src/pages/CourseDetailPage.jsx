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
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const isUnlocked = unlockStatus?.isUnlocked || false;
  const progressPercentage = userProgress?.progress_percentage || 0;
  const totalLessons = courseStructure?.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Catalog</span>
      </button>

      {/* Course Header */}
      <div className="glass-effect rounded-2xl p-6 lg:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSchoolColor(course.masterschool)}`}>
                {course.masterschool}
              </span>
              {course.difficulty_level && (
                <span className="px-3 py-1 rounded-full text-sm bg-slate-700 text-gray-300">
                  {course.difficulty_level}
                </span>
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
            <div className="glass-effect rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={20} className="text-red-400" />
                <span className="text-red-400 font-semibold">Locked</span>
              </div>
              <p className="text-sm text-gray-300 mb-1">
                Requires: <span className="text-yellow-400 font-medium">{unlockStatus?.requiredXp || 0} XP</span>
              </p>
              <p className="text-xs text-gray-400">
                You have: <span className="text-gray-300">{unlockStatus?.userXp || 0} XP</span>
              </p>
            </div>
          )}
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <BookOpen size={16} />
              <span className="text-sm">Chapters</span>
            </div>
            <p className="text-2xl font-bold text-white">{courseStructure?.chapters?.length || 0}</p>
          </div>
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Play size={16} />
              <span className="text-sm">Lessons</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalLessons}</p>
          </div>
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock size={16} />
              <span className="text-sm">Duration</span>
            </div>
            <p className="text-2xl font-bold text-white">{course.duration_hours || 0}h</p>
          </div>
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <TrendingUp size={16} />
              <span className="text-sm">XP Threshold</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{course.xp_threshold || 0}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {userProgress && progressPercentage > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-medium text-white">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Start/Continue Button */}
        <button
          onClick={handleStartCourse}
          disabled={!isUnlocked}
          className={`w-full lg:w-auto px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            isUnlocked
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {userProgress?.status === 'completed' ? (
            <>
              <CheckCircle size={20} />
              Course Completed
            </>
          ) : userProgress?.status === 'in_progress' ? (
            <>
              <Play size={20} />
              Continue Course
            </>
          ) : (
            <>
              <Play size={20} />
              Start Course
            </>
          )}
        </button>
      </div>

      {/* Course Outline */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Course Outline</h2>
        
        {!courseStructure?.chapters || courseStructure.chapters.length === 0 ? (
          <p className="text-gray-400">No chapters available yet.</p>
        ) : (
          <div className="space-y-4">
            {courseStructure.chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    Chapter {chapter.chapter_number}: {chapter.chapter_title}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {chapter.lessons?.length || 0} {chapter.lessons?.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>

                {chapter.lessons && chapter.lessons.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {chapter.lessons.map((lesson, lessonIndex) => {
                      // TODO: Check if lesson is completed (need to fetch from user_lesson_progress)
                      const isCompleted = false;
                      
                      return (
                        <button
                          key={`${lesson.chapter_number}_${lesson.lesson_number}`}
                          onClick={() => handleLessonClick(lesson.chapter_number, lesson.lesson_number)}
                          disabled={!isUnlocked}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            isUnlocked
                              ? 'bg-slate-800 hover:bg-slate-700 text-white'
                              : 'bg-slate-900 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle size={20} className="text-green-400" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                                <span className="text-xs text-gray-500">{lesson.lesson_number}</span>
                              </div>
                            )}
                            <span className="text-sm font-medium">
                              Lesson {lesson.lesson_number}: {lesson.lesson_title}
                            </span>
                          </div>
                          <ChevronRight size={20} className="text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;

