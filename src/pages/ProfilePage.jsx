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
            userMasterStatsResult.data.forEach(stat => {
              const currentValue = stat.user_master_stats?.[0]?.current_value || 0;
              radarData[stat.display_name] = Math.min(currentValue, 100); // Cap at 100 for radar
            });
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
      maxPoints: 100 // Set a reasonable max for progress bars
    };
  });

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="text-gray-400 text-sm">Character Profile</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
            Character Lore
          </button>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            Achievement Book
          </button>
          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
            Save Point
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Left Column - Character Details */}
        <div className="space-y-6">
          {/* Level & Avatar */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-center">
              <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg mb-4">
                LEVEL: {currentLevel?.level_number || 0}
              </div>
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-green-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto border-4 border-green-500">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold mt-4">{displayName}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              {currentLevel && (
                <p className="text-green-400 text-sm mt-1">{currentLevel.title}</p>
              )}
            </div>
          </div>


          {/* Bio */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              Character Bio
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Role:</strong> {userRole}</p>
              <p><strong>Level:</strong> {currentLevel?.level_number || 0} - {currentLevel?.title || 'Uninitiated'}</p>
              <p><strong>Total XP:</strong> {totalXP.toFixed(1)}</p>
              <p><strong>Streak:</strong> {profile?.completion_streak || 0} days</p>
              {formData.bio && (
                <p><strong>Description:</strong> {formData.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Core Stats & Radar Chart */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-center">Core Stats</h3>
            <div className="flex justify-center">
              <RadarChart data={radarData} size={250} />
            </div>
          </div>

          {/* Current Quest */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-500" />
              Current Quest
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Complete daily habits</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span>Use toolbox items</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Level up skills</span>
              </div>
            </div>
          </div>

          {/* Pixel Art Placeholder */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-full h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white opacity-50" />
            </div>
          </div>
        </div>

        {/* Right Column - XP, Streaks, Stats */}
        <div className="space-y-6">
          {/* XP & Level */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Experience
            </h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{totalXP.toFixed(1)} XP</div>
              {levelProgress && (
                <>
                  <div className="text-sm text-gray-400 mt-1">
                    To reach {nextLevel?.title}: {levelProgress.neededXP.toFixed(0)} XP needed
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-300"
                      style={{width: `${Math.min(levelProgress.progressPercentage, 100)}%`}}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Daily Streak */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Flame className="w-5 h-5 mr-2 text-orange-500" />
              Daily Streak
            </h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{profile?.completion_streak || 0}</div>
              <div className="text-sm text-gray-400">days in a row</div>
              <div className="flex justify-center mt-3 space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full border-2 ${
                      i < (profile?.completion_streak || 0) 
                        ? 'bg-orange-500 border-orange-400' 
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Master Stats Progress */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Master Stats
            </h3>
            <div className="space-y-3">
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
              <div className="pt-2 border-t border-gray-600">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total</span>
                  <span className="text-gray-400">{totalXP.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Edit Profile */}
      <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-500" />
          Edit Character
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
              Character Name
            </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your character name"
            />
          </div>

          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-300 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar_url"
              id="avatar_url"
              value={formData.avatar_url}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Character Description
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell us about your character..."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="background_image" className="block text-sm font-medium text-gray-300 mb-2">
              Background Image URL
            </label>
            <input
              type="url"
              name="background_image"
              id="background_image"
              value={formData.background_image}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/background.jpg"
            />
            {formData.background_image && (
              <div className="mt-3">
                <div 
                  className="w-full h-24 rounded-lg bg-cover bg-center bg-no-repeat border border-gray-600"
                  style={{ backgroundImage: `url(${formData.background_image})` }}
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
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