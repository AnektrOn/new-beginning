import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import courseService from '../services/courseService';
import schoolService from '../services/schoolService';
import { BookOpen, Lock, Play, Star, Clock, TrendingUp, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import EmptyState from '../components/common/EmptyState';

const CourseCatalogPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [coursesBySchool, setCoursesBySchool] = useState({});
  const [schools, setSchools] = useState([]);
  const [schoolUnlockStatus, setSchoolUnlockStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load schools with unlock status
      if (user?.id) {
        const { data: schoolsData, error: schoolsError } = await schoolService.getSchoolsWithUnlockStatus(user.id);
        if (schoolsError) throw schoolsError;
        
        setSchools(schoolsData || []);
        
        // Create a map of school unlock status
        const unlockMap = {};
        schoolsData?.forEach(school => {
          unlockMap[school.name] = school.isUnlocked;
        });
        setSchoolUnlockStatus(unlockMap);
      } else {
        // If no user, just get all schools
        const { data: schoolsData } = await schoolService.getAllSchools();
        setSchools(schoolsData || []);
      }

      // Load courses (filtered by unlocked schools if user is logged in)
      const filters = user?.id ? { userId: user.id } : {};
      const { data, error: fetchError } = await courseService.getCoursesBySchool(filters);
      
      if (fetchError) throw fetchError;
      
      setCoursesBySchool(data || {});
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
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

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return 'text-gray-400';
    if (difficulty.includes('3D') || difficulty.includes('Focused')) return 'text-yellow-400';
    if (difficulty.includes('Zoomed')) return 'text-green-400';
    return 'text-blue-400';
  };

  if (error) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <ErrorDisplay
          title="Failed to load courses"
          message={error}
          onRetry={loadData}
          variant="card"
        />
      </div>
    );
  }

  const userXp = profile?.current_xp || 0;
  
  // Use schools from state, fallback to course keys if schools not loaded yet
  const displaySchools = schools.length > 0 ? schools : Object.keys(coursesBySchool).map(name => ({ name, isUnlocked: true, requiredXp: 0 }));

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumbs - Hidden on mobile */}
      <div className="mb-4 hidden lg:block">
        <Breadcrumbs
          customItems={[
            { label: 'Home', path: '/dashboard', icon: Home },
            { label: 'Courses', path: '/courses' }
          ]}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Course Catalog</h1>
        <p className="text-gray-400">Explore courses organized by school</p>
      </div>

      {/* School Filter Tabs */}
      {displaySchools.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedSchool === null ? 'default' : 'outline'}
            onClick={() => setSelectedSchool(null)}
            size="sm"
          >
            All Schools
          </Button>
          {displaySchools.map((school) => {
            const schoolName = typeof school === 'string' ? school : school.name;
            const isUnlocked = typeof school === 'object' ? school.isUnlocked : (schoolUnlockStatus[schoolName] ?? true);
            const requiredXp = typeof school === 'object' ? school.requiredXp : 0;
            
            return (
              <Button
                key={schoolName}
                variant={selectedSchool === schoolName ? 'default' : isUnlocked ? 'outline' : 'secondary'}
                onClick={() => isUnlocked && setSelectedSchool(schoolName)}
                disabled={!isUnlocked}
                size="sm"
                title={!isUnlocked ? `Requires ${requiredXp.toLocaleString()} XP to unlock` : ''}
              >
                {schoolName}
                {!isUnlocked && <Lock size={14} className="ml-2" />}
              </Button>
            );
          })}
        </div>
      )}

      {/* Courses by School */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonLoader type="course-card" count={6} variant="glass" />
        </div>
      ) : displaySchools.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses available"
          description="Check back soon for new courses to explore."
          variant="large"
        />
      ) : (
        <div className="space-y-8">
          {displaySchools
            .filter(school => {
              const schoolName = typeof school === 'string' ? school : school.name;
              return !selectedSchool || schoolName === selectedSchool;
            })
            .map((school) => {
              const schoolName = typeof school === 'string' ? school : school.name;
              const isSchoolUnlocked = typeof school === 'object' ? school.isUnlocked : (schoolUnlockStatus[schoolName] ?? true);
              const schoolRequiredXp = typeof school === 'object' ? school.requiredXp : 0;
              const courses = coursesBySchool[schoolName] || [];
              
              return (
                <Card 
                  key={schoolName} 
                  className={`glass-effect-enhanced ${!isSchoolUnlocked ? 'opacity-60' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                          <BookOpen size={24} />
                          {schoolName}
                        </CardTitle>
                        {!isSchoolUnlocked && (
                          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                            <Lock size={14} className="mr-1" />
                            Locked - {schoolRequiredXp.toLocaleString()} XP Required
                          </Badge>
                        )}
                      </div>
                      <Badge className={getSchoolColor(schoolName)}>
                        {courses.length} {courses.length === 1 ? 'course' : 'courses'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {!isSchoolUnlocked ? (
                      <EmptyState
                        icon={Lock}
                        title="This school is locked"
                        description={`You need ${schoolRequiredXp.toLocaleString()} XP to unlock ${schoolName}. You currently have ${userXp.toLocaleString()} XP.`}
                        variant="default"
                      />
                    ) : courses.length === 0 ? (
                      <EmptyState
                        icon={BookOpen}
                        title="No courses in this school"
                        description="Check back soon for new courses."
                        variant="default"
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((course) => {
                        // Check both school unlock and course unlock
                        const isIgnition = course.masterschool === 'Ignition';
                        const meetsCourseThreshold = isIgnition || userXp >= (course.xp_threshold || 0);
                        const isUnlocked = isSchoolUnlocked && meetsCourseThreshold;
                        const userProgress = null; // TODO: Load user progress

                        return (
                        <Card
                          key={course.id}
                          className={`glass-effect-enhanced cursor-pointer transition-all hover:scale-[1.02] relative ${
                            !isUnlocked ? 'opacity-60' : ''
                          }`}
                          onClick={() => isUnlocked && handleCourseClick(course.id)}
                        >
                          {/* Lock Overlay */}
                          {!isUnlocked && (
                            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-10">
                              <div className="text-center">
                                <Lock size={32} className="text-gray-400 mx-auto mb-2" />
                                {!isSchoolUnlocked ? (
                                  <p className="text-sm text-gray-300">
                                    School locked: {schoolRequiredXp.toLocaleString()} XP required
                                  </p>
                                ) : (
                                  <>
                                    <p className="text-sm text-gray-300">
                                      Requires {course.xp_threshold || 0} XP
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      You have {userXp.toLocaleString()} XP
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white mb-2 line-clamp-2">
                              {course.course_title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Badge variant="outline" className={getDifficultyColor(course.difficulty_level)}>
                                {course.difficulty_level || 'N/A'}
                              </Badge>
                              {course.duration_hours > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {course.duration_hours}h
                                  </span>
                                </>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="space-y-2">
                              {course.topic && (
                                <div className="text-sm text-gray-400">
                                  Topic: <span className="text-gray-300">{course.topic}</span>
                                </div>
                              )}
                              {!isIgnition && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">XP Threshold:</span>
                                  <span className="text-yellow-400 font-medium">
                                    {course.xp_threshold || 0} XP
                                  </span>
                                </div>
                              )}
                              {isIgnition && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">Access:</span>
                                  <Badge variant="outline" className="text-green-400 border-green-400">
                                    Free
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardContent>

                          <CardFooter>
                            <Button
                              className="w-full"
                              variant={isUnlocked ? 'default' : 'secondary'}
                              disabled={!isUnlocked}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isUnlocked) handleCourseClick(course.id);
                              }}
                            >
                              {isUnlocked ? (
                                <>
                                  <Play size={16} className="mr-2" />
                                  {userProgress ? 'Continue' : 'Start Course'}
                                </>
                              ) : (
                                <>
                                  <Lock size={16} className="mr-2" />
                                  Locked
                                </>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CourseCatalogPage;

