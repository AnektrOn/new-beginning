import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Star, Flame, Target, BookOpen, Heart, Brain, Sparkles } from 'lucide-react'
import RadarChart from '../components/profile/RadarChart'
import ProgressBar from '../components/profile/ProgressBar'
import skillsService from '../services/skillsService'
import levelsService from '../services/levelsService'

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
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
          
          console.log('🎯 ProfilePage Debug:');
          console.log('- User skills data:', userSkillsResult.data);
          console.log('- User master stats data:', userMasterStatsResult.data);
          console.log('- Total XP from profile.current_xp:', totalXP);
          console.log('- Profile object:', profile);
          
          // Get current and next level based on total XP
          const levelResult = await levelsService.getCurrentAndNextLevel(totalXP);
          if (levelResult.data) {
            console.log('- Current level:', levelResult.data.currentLevel);
            console.log('- Next level:', levelResult.data.nextLevel);
            setCurrentLevel(levelResult.data.currentLevel);
            setNextLevel(levelResult.data.nextLevel);
          }
          
          // Calculate radar chart data from user master stats
          const radarData = {};
          if (userMasterStatsResult.data) {
            console.log('🎯 Radar Chart Debug - User Master Stats:', userMasterStatsResult.data);
            userMasterStatsResult.data.forEach(stat => {
              const currentValue = stat.user_master_stats?.[0]?.current_value || 0;
              radarData[stat.display_name] = Math.min(currentValue, 200); // Cap at 200 for radar
              console.log(`- ${stat.display_name}: ${currentValue}`);
            });
            console.log('🎯 Final Radar Data:', radarData);
          } else {
            console.log('❌ No user master stats data available for radar chart');
          }
          setRadarData(radarData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user?.id]);

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

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {displayName}
          </h1>
          <p className="text-slate-300 text-sm mt-1">Character Profile</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25">
            Character Lore
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25">
            Achievement Book
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-violet-500/25">
            Save Point
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
        
        {/* Left Column - Character Details */}
        <div className="xl:col-span-1 space-y-6">
          {/* Level & Avatar */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold text-xl mb-6 shadow-lg">
                LEVEL: {currentLevel?.level_number || 0}
              </div>
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-36 h-36 rounded-full mx-auto border-4 border-gradient-to-r from-emerald-400 to-cyan-400 shadow-2xl"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-400 flex items-center justify-center mx-auto border-4 border-gradient-to-r from-emerald-400 to-cyan-400 shadow-2xl">
                    <User className="w-20 h-20 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 text-white">{displayName}</h2>
              <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
              {currentLevel && (
                <p className="text-emerald-400 text-sm mt-2 font-medium">{currentLevel.title}</p>
              )}
            </div>
          </div>


          {/* Bio */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
              Character Bio
            </h3>
            <div className="text-sm text-slate-300 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Role:</span>
                <span className="text-emerald-400 font-medium">{userRole}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Level:</span>
                <span className="text-cyan-400 font-medium">{currentLevel?.level_number || 0} - {currentLevel?.title || 'Uninitiated'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total XP:</span>
                <span className="text-yellow-400 font-medium">{totalXP.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Streak:</span>
                <span className="text-orange-400 font-medium">{profile?.completion_streak || 0} days</span>
              </div>
              {formData.bio && (
                <div className="pt-2 border-t border-slate-600">
                  <p className="text-slate-300"><strong>Description:</strong> {formData.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Core Stats & Radar Chart */}
        <div className="xl:col-span-2 space-y-6">
          {/* Radar Chart */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <h3 className="text-xl font-semibold mb-6 text-center text-white">Core Stats</h3>
            <div className="flex justify-center">
              <RadarChart data={radarData} size={400} />
            </div>
          </div>

          {/* Current Quest */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <Target className="w-5 h-5 mr-2 text-yellow-400" />
              Current Quest
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mr-3 shadow-lg"></div>
                <span className="text-slate-300">Complete daily habits</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3 shadow-lg"></div>
                <span className="text-slate-300">Use toolbox items</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mr-3 shadow-lg"></div>
                <span className="text-slate-300">Level up skills</span>
              </div>
            </div>
          </div>

          {/* Skills Tabs */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <Brain className="w-5 h-5 mr-2 text-violet-400" />
              Skills ({userSkills.length})
            </h3>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {skillTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSkillTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSkillTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeSkillTab === 'summary' ? (
                <div>
                  <h4 className="text-md font-semibold text-slate-300 mb-4">Top Skills</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {topSkills.map((skill, index) => (
                      <div key={skill.id} className="flex justify-between items-center text-sm bg-slate-700/30 rounded-lg p-3 hover:bg-slate-600/30 transition-colors">
                        <div className="flex items-center">
                          <span className="text-slate-400 text-xs mr-2">#{index + 1}</span>
                          <span className="text-slate-300 truncate">{skill.skills?.display_name || skill.skills?.name}</span>
                        </div>
                        <span className="text-emerald-400 font-medium bg-slate-800/50 px-2 py-1 rounded">
                          {skill.current_value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-md font-semibold text-slate-300 mb-4">
                    {skillsByMasterStat[activeSkillTab]?.masterStat?.display_name} Skills
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {skillsByMasterStat[activeSkillTab]?.skills?.map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center text-sm bg-slate-700/30 rounded-lg p-3 hover:bg-slate-600/30 transition-colors">
                        <span className="text-slate-300 truncate">{skill.skills?.display_name || skill.skills?.name}</span>
                        <span 
                          className="font-medium bg-slate-800/50 px-2 py-1 rounded"
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
          </div>
        </div>

        {/* Right Column - XP, Streaks, Stats */}
        <div className="xl:col-span-1 space-y-6">
          {/* XP & Level */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
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
                  <div className="w-full bg-slate-700 rounded-full h-4 mt-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-4 rounded-full transition-all duration-500 shadow-lg"
                      style={{width: `${Math.min(levelProgress.progressPercentage, 100)}%`}}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Daily Streak */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <Flame className="w-5 h-5 mr-2 text-orange-400" />
              Daily Streak
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {profile?.completion_streak || 0}
              </div>
              <div className="text-sm text-slate-400 mt-1">days in a row</div>
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-200 ${
                      i < (profile?.completion_streak || 0) 
                        ? 'bg-gradient-to-r from-orange-400 to-red-400 border-orange-300 shadow-orange-400/50' 
                        : 'bg-slate-700 border-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Master Stats Progress */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <Brain className="w-5 h-5 mr-2 text-violet-400" />
              Master Stats
            </h3>
            <div className="space-y-4">
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
              <div className="pt-3 border-t border-slate-600">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-300">Total</span>
                  <span className="text-emerald-400 font-bold">{masterStatsProgress.reduce((sum, stat) => sum + stat.points, 0).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Edit Profile */}
      <div className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center text-white">
          <User className="w-6 h-6 mr-3 text-cyan-400" />
          Edit Character
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">
              Character Name
            </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter your character name"
            />
          </div>

          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-slate-300 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar_url"
              id="avatar_url"
              value={formData.avatar_url}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
              Character Description
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              placeholder="Tell us about your character..."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="background_image" className="block text-sm font-medium text-slate-300 mb-2">
              Background Image URL
            </label>
            <input
              type="url"
              name="background_image"
              id="background_image"
              value={formData.background_image}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              placeholder="https://example.com/background.jpg"
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
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              {loading ? 'Saving...' : 'Save Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage