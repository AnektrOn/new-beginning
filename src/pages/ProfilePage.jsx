import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Star, Flame, Target, BookOpen, Heart, Brain, Sparkles, Home } from 'lucide-react'
import RadarChart from '../components/profile/RadarChart'
import ProgressBar from '../components/profile/ProgressBar'
import skillsService from '../services/skillsService'
import levelsService from '../services/levelsService'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import Breadcrumbs from '../components/common/Breadcrumbs'
import SkeletonLoader from '../components/common/SkeletonLoader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState(null)
  const [skills, setSkills] = useState([]) // eslint-disable-line no-unused-vars
  const [masterStats, setMasterStats] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [userMasterStats, setUserMasterStats] = useState([])
  const [radarData, setRadarData] = useState({})
  const [currentLevel, setCurrentLevel] = useState(null)
  const [nextLevel, setNextLevel] = useState(null)
  const [activeSkillTab, setActiveSkillTab] = useState('summary')
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
    background_image: profile?.background_image || ''
  })

  // Load skills, levels, and user progress data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setDataLoading(true)
        setError(null)
        
        // Load all skills, master stats, and levels
        const [skillsResult, masterStatsResult] = await Promise.all([
          skillsService.getAllSkills(),
          skillsService.getMasterStats()
        ]);

        if (skillsResult.data) setSkills(skillsResult.data);
        if (masterStatsResult.data) setMasterStats(masterStatsResult.data);

        // Load user skills and master stats if user exists
        if (user?.id) {
          const [userSkillsResult, userMasterStatsResult] = await Promise.all([
            skillsService.getUserSkills(user.id),
            skillsService.getUserMasterStats(user.id)
          ]);
          
          if (userSkillsResult.data) {
            setUserSkills(userSkillsResult.data);
          }
          
          if (userMasterStatsResult.data) {
            setUserMasterStats(userMasterStatsResult.data);
          }
          
          // Use current_xp from profiles table (the actual XP system)
          const totalXP = profile?.current_xp || 0;
          
          // Get current and next level based on total XP
          const levelResult = await levelsService.getCurrentAndNextLevel(totalXP);
          if (levelResult.data) {
            setCurrentLevel(levelResult.data.currentLevel);
            setNextLevel(levelResult.data.nextLevel);
          }
          
          // Calculate radar chart data from user master stats
          const radarData = {};
          if (userMasterStatsResult.data) {
            userMasterStatsResult.data.forEach(stat => {
              const currentValue = stat.user_master_stats?.[0]?.current_value || 0;
              radarData[stat.display_name] = Math.min(currentValue, 200); // Cap at 200 for radar
            });
          }
          setRadarData(radarData);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setDataLoading(false)
      }
    };

    loadUserData();
  }, [user?.id, profile?.current_xp]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await updateProfile(formData)
    
    if (!error) {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const userRole = profile?.role || 'Free'
  const displayName = profile?.full_name || user?.email || 'User'
  
  // Calculate master stats progress - use user master stats data directly
  const masterStatsProgress = userMasterStats.map(stat => {
    const currentValue = stat.user_master_stats?.[0]?.current_value || 0;
    
    return {
      ...stat,
      points: currentValue,
      maxPoints: 200 // Set a reasonable max for progress bars
    };
  });

  // Group skills by master stats for tabbed interface
  const skillsByMasterStat = masterStats.reduce((acc, masterStat) => {
    acc[masterStat.id] = {
      masterStat,
      skills: userSkills.filter(skill => skill.skills?.master_stat_id === masterStat.id)
    };
    return acc;
  }, {});

  // Get top skills across all categories for summary tab
  const topSkills = userSkills
    .sort((a, b) => (b.current_value || 0) - (a.current_value || 0))
    .slice(0, 12);

  // Create tab data
  const skillTabs = [
    { id: 'summary', label: 'Summary', count: topSkills.length },
    ...masterStats.map(stat => ({
      id: stat.id,
      label: stat.display_name,
      count: skillsByMasterStat[stat.id]?.skills?.length || 0
    }))
  ];

  // Use current_xp from profiles table (the actual XP system)
  const totalXP = profile?.current_xp || 0;
  
  // Calculate level progress
  const levelProgress = currentLevel && nextLevel ? {
    currentXP: totalXP,
    currentLevelXP: currentLevel.xp_threshold,
    nextLevelXP: nextLevel.xp_threshold,
    progressXP: totalXP - currentLevel.xp_threshold,
    neededXP: nextLevel.xp_threshold - totalXP,
    progressPercentage: ((totalXP - currentLevel.xp_threshold) / (nextLevel.xp_threshold - currentLevel.xp_threshold)) * 100
  } : null;

  if (error && !dataLoading) {
    return (
      <div className="w-full p-4">
        <ErrorDisplay
          title="Failed to load profile"
          message={error}
          onRetry={() => window.location.reload()}
          variant="card"
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Breadcrumbs - Hidden on mobile */}
      <div className="mb-4 hidden lg:block">
        <Breadcrumbs
          customItems={[
            { label: 'Home', path: '/dashboard', icon: Home },
            { label: 'Profile', path: '/profile' }
          ]}
        />
      </div>

      {/* Header - Mobile Optimized */}
      <div className="profile-header mb-4 sm:mb-6 lg:mb-8">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {displayName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Main Content - Reorganized Layout */}
      {dataLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <SkeletonLoader type="card" count={3} variant="glass" />
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Top Row - Character Info & Key Stats - Mobile: Single Column */}
          <div className="profile-stats-grid grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Character Card - Mobile: Full Width */}
            <Card className="glass-effect-enhanced border-slate-600/50 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative flex-shrink-0">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={displayName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gradient-to-r from-emerald-400 to-cyan-400 shadow-2xl"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-400 flex items-center justify-center border-4 border-gradient-to-r from-emerald-400 to-cyan-400 shadow-2xl">
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-2 sm:px-3 py-1 rounded-xl font-bold text-xs sm:text-sm inline-block">
                        LEVEL: {currentLevel?.level_number || 0}
                      </div>
                      {currentLevel && (
                        <span className="text-emerald-400 text-xs sm:text-sm font-medium mt-1 sm:mt-0">{currentLevel.title}</span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">{displayName}</h2>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            

            {/* XP & Progress - Center */}
            <Card className="glass-effect-enhanced border-slate-600/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-white">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                  Experience
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {totalXP.toFixed(1)} XP
                  </div>
                  {levelProgress && (
                    <>
                      <div className="text-sm text-slate-400 mt-2">
                        To reach {nextLevel?.title}: {levelProgress.neededXP.toFixed(0)} XP needed
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3 mt-4 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                          style={{width: `${Math.min(levelProgress.progressPercentage, 100)}%`}}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Daily Streak - Right */}
            <Card className="glass-effect-enhanced border-slate-600/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-white">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-400" />
                  Daily Streak
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {profile?.completion_streak || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1">days in a row</div>
                  <div className="flex justify-center mt-3 sm:mt-4 space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 shadow-lg transition-all duration-200 ${
                          i < (profile?.completion_streak || 0) 
                            ? 'bg-gradient-to-r from-orange-400 to-red-400 border-orange-300 shadow-orange-400/50' 
                            : 'bg-slate-700 border-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row - Core Stats & Master Stats - Mobile: Stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Radar Chart - Mobile: Full Width, Optimized Size */}
            <Card className="glass-effect-enhanced border-slate-600/50">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6 text-center text-white">Core Stats</h3>
                <div className="profile-radar-chart flex justify-center overflow-x-auto">
                  <RadarChart 
                    data={radarData} 
                    size={typeof window !== 'undefined' ? Math.min(280, Math.max(250, window.innerWidth - 80)) : 280} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Master Stats Progress - Mobile: Full Width */}
            <Card className="glass-effect-enhanced border-slate-600/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-white">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-violet-400" />
                  Master Stats
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {masterStatsProgress.map((stat) => (
                    <ProgressBar
                      key={stat.id}
                      label={stat.display_name}
                      value={stat.points}
                      maxValue={stat.maxPoints}
                      color={stat.color}
                      showValue={true}
                    />
                  ))}
                  <div className="pt-2 sm:pt-3 border-t border-slate-600/50">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="font-medium text-slate-300">Total</span>
                      <span className="text-emerald-400 font-bold">{masterStatsProgress.reduce((sum, stat) => sum + stat.points, 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Skills & Bio - Mobile: Stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Skills Tabs - Mobile: Full Width */}
            <Card className="lg:col-span-2 glass-effect-enhanced border-slate-600/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-white">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-violet-400" />
                  Skills ({userSkills.length})
                </h3>
                
                {/* Tab Navigation - Mobile: Scrollable Horizontal */}
                <div className="profile-skills-tabs flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar">
                  {skillTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeSkillTab === tab.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveSkillTab(tab.id)}
                      className={`whitespace-nowrap flex-shrink-0 ${
                        activeSkillTab === tab.id 
                          ? 'bg-gradient-to-r from-violet-600 to-violet-700' 
                          : ''
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </Button>
                  ))}
                </div>
                    
                {/* Tab Content - Mobile: Single Column */}
                <div className="min-h-[200px] sm:min-h-[300px]">
                  {activeSkillTab === 'summary' ? (
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-300 mb-3 sm:mb-4">Top Skills</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {topSkills.map((skill, index) => (
                          <div key={skill.id} className="flex justify-between items-center text-sm bg-slate-700/30 rounded-lg p-3 sm:p-3 hover:bg-slate-600/30 transition-colors min-h-[44px]">
                            <div className="flex items-center flex-1 min-w-0">
                              <span className="text-slate-400 text-xs mr-2 flex-shrink-0">#{index + 1}</span>
                              <span className="text-slate-300 truncate">{skill.skills?.display_name || skill.skills?.name}</span>
                            </div>
                            <span className="text-emerald-400 font-medium bg-slate-800/50 px-2 py-1 rounded flex-shrink-0 ml-2">
                              {skill.current_value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-300 mb-3 sm:mb-4">
                        {skillsByMasterStat[activeSkillTab]?.masterStat?.display_name} Skills
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {skillsByMasterStat[activeSkillTab]?.skills?.map((skill) => (
                          <div key={skill.id} className="flex justify-between items-center text-sm bg-slate-700/30 rounded-lg p-3 sm:p-3 hover:bg-slate-600/30 transition-colors min-h-[44px]">
                            <span className="text-slate-300 truncate flex-1 min-w-0">{skill.skills?.display_name || skill.skills?.name}</span>
                            <span 
                              className="font-medium bg-slate-800/50 px-2 py-1 rounded flex-shrink-0 ml-2"
                              style={{ color: skillsByMasterStat[activeSkillTab]?.masterStat?.color || '#10b981' }}
                            >
                              {skill.current_value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio & Quest - Mobile: Full Width, Stacked */}
            <div className="space-y-4 sm:space-y-6">
              {/* Character Bio */}
              <Card className="glass-effect-enhanced border-slate-600/50">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-white">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400" />
                    Character Bio
                  </h3>
                  <div className="text-sm text-slate-300 space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Role:</span>
                      <span className="text-emerald-400 font-medium">{userRole}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Level:</span>
                      <span className="text-cyan-400 font-medium text-sm">{currentLevel?.level_number || 0} - {currentLevel?.title || 'Uninitiated'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Total XP:</span>
                      <span className="text-yellow-400 font-medium">{totalXP.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Streak:</span>
                      <span className="text-orange-400 font-medium">{profile?.completion_streak || 0} days</span>
                    </div>
                    {formData.bio && (
                      <div className="pt-2 sm:pt-3 border-t border-slate-600">
                        <p className="text-slate-300 text-xs sm:text-sm"><strong>Description:</strong> {formData.bio}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Quest */}
              <Card className="glass-effect-enhanced border-slate-600/50">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-white">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                    Current Quest
                  </h3>
                  <div className="space-y-2 sm:space-y-3 text-sm">
                    <div className="flex items-center min-h-[44px]">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mr-3 shadow-lg flex-shrink-0"></div>
                      <span className="text-slate-300">Complete daily habits</span>
                    </div>
                    <div className="flex items-center min-h-[44px]">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3 shadow-lg flex-shrink-0"></div>
                      <span className="text-slate-300">Use toolbox items</span>
                    </div>
                    <div className="flex items-center min-h-[44px]">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mr-3 shadow-lg flex-shrink-0"></div>
                      <span className="text-slate-300">Level up skills</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section - Edit Profile - Mobile Optimized */}
      <Card className="mt-4 sm:mt-6 lg:mt-8 glass-effect-enhanced border-slate-600/50">
        <CardContent className="p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center text-white">
          <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-cyan-400" />
          Edit Character
        </h3>
        
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="full_name" className="text-slate-300 mb-2">
                Character Name
              </Label>
              <Input
                type="text"
                name="full_name"
                id="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your character name"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url" className="text-slate-300 mb-2">
                Avatar URL
              </Label>
              <Input
                type="url"
                name="avatar_url"
                id="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio" className="text-slate-300 mb-2">
                Character Description
              </Label>
              <textarea
                name="bio"
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-slate-700/50 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about your character..."
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="background_image" className="text-slate-300 mb-2">
                Background Image URL
              </Label>
              <Input
                type="url"
                name="background_image"
                id="background_image"
                value={formData.background_image}
                onChange={handleInputChange}
                placeholder="https://example.com/background.jpg"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              {formData.background_image && (
                <div className="mt-4">
                  <div 
                    className="w-full h-32 rounded-xl bg-cover bg-center bg-no-repeat border border-slate-600 shadow-lg"
                    style={{ backgroundImage: `url(${formData.background_image})` }}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600"
              >
                {loading ? 'Saving...' : 'Save Character'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage