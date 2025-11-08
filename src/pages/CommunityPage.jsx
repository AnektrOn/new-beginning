import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import CreatePostModal from '../components/social/CreatePostModal'
import socialService from '../services/socialService'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Star,
  Award,
  Target,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText,
  Link as LinkIcon
} from 'lucide-react'

const CommunityPage = () => {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [leaderboard, setLeaderboard] = useState([])
  const [challenges, setChallenges] = useState([])

  // Mock data for now - will be replaced with real API calls
  const mockPosts = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        level: 8,
        title: 'Mindful Explorer',
        xp: 2450
      },
      content: 'Just completed my 30-day meditation streak! 🧘‍♀️ The transformation in my focus and clarity has been incredible. Who else is on a mindfulness journey?',
      type: 'text',
      tags: ['mindfulness', 'meditation', 'personal-growth'],
      likes: 23,
      comments: 8,
      shares: 3,
      createdAt: '2 hours ago',
      isLiked: false
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: 12,
        title: 'Wisdom Seeker',
        xp: 4200
      },
      content: 'Sharing my latest learning: The power of compound habits. Small daily actions create massive long-term results. What\'s one small habit you\'ve been consistent with?',
      type: 'text',
      tags: ['habits', 'productivity', 'learning'],
      likes: 45,
      comments: 12,
      shares: 7,
      createdAt: '4 hours ago',
      isLiked: true
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: 'Marcus Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        level: 15,
        title: 'Transformation Catalyst',
        xp: 6800
      },
      content: 'Just unlocked the "Discipline Master" achievement! 🏆 100 days of consistent morning routine. The key was starting small and building momentum.',
      type: 'achievement',
      tags: ['achievement', 'discipline', 'morning-routine'],
      likes: 67,
      comments: 15,
      shares: 12,
      createdAt: '6 hours ago',
      isLiked: false
    }
  ]

  const mockLeaderboard = [
    { id: '1', full_name: 'Elena Martinez', current_xp: 12500, level: 18, title: 'Enlightened Sage', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    { id: '2', full_name: 'David Kim', current_xp: 11200, level: 17, title: 'Wisdom Keeper', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '3', full_name: 'Lisa Wang', current_xp: 10800, level: 16, title: 'Transformation Master', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    { id: '4', full_name: 'James Wilson', current_xp: 9500, level: 15, title: 'Growth Catalyst', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { id: '5', full_name: 'Maria Garcia', current_xp: 8900, level: 14, title: 'Insight Seeker', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' }
  ]

  const mockChallenges = [
    {
      id: '1',
      title: '30-Day Mindfulness Challenge',
      description: 'Practice meditation or mindfulness for 30 consecutive days',
      participants: 156,
      xpReward: 500,
      endDate: '2024-02-15',
      isParticipating: true
    },
    {
      id: '2',
      title: 'Habit Stacking Mastery',
      description: 'Create and maintain 3 new positive habits for 21 days',
      participants: 89,
      xpReward: 300,
      endDate: '2024-02-20',
      isParticipating: false
    },
    {
      id: '3',
      title: 'Knowledge Sharing Week',
      description: 'Share one learning insight every day for a week',
      participants: 234,
      xpReward: 200,
      endDate: '2024-02-10',
      isParticipating: true
    }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load posts
      const postsResult = await socialService.getPosts()
      if (postsResult.data) {
        setPosts(postsResult.data)
      } else {
        // Fallback to mock data if no real data
        setPosts(mockPosts)
      }

      // Load leaderboard
      const leaderboardResult = await socialService.getLeaderboard()
      console.log('Leaderboard result:', leaderboardResult)
      if (leaderboardResult.data) {
        setLeaderboard(leaderboardResult.data)
        console.log('Set leaderboard data:', leaderboardResult.data)
      } else {
        setLeaderboard(mockLeaderboard)
        console.log('Using mock leaderboard data:', mockLeaderboard)
      }

      // Load challenges
      const challengesResult = await socialService.getChallenges()
      if (challengesResult.data) {
        setChallenges(challengesResult.data)
      } else {
        setChallenges(mockChallenges)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Use mock data as fallback
      setPosts(mockPosts)
      setLeaderboard(mockLeaderboard)
      setChallenges(mockChallenges)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    if (!user) return

    try {
      const result = await socialService.togglePostLike(postId, user.id)
      if (result.data) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: result.data.liked, 
                likes_count: result.data.liked ? post.likes_count + 1 : post.likes_count - 1 
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleShare = (postId) => {
    // TODO: Implement share functionality
    console.log('Sharing post:', postId)
  }

  const handlePostCreated = (newPost) => {
    // Add the new post to the beginning of the posts array
    setPosts(prevPosts => [newPost, ...prevPosts])
  }

  const tabs = [
    { id: 'feed', label: 'Feed', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'discover', label: 'Discover', icon: Search }
  ]

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="community-header flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Community
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">Connect, learn, and grow together</p>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={() => setShowCreatePost(true)}
            className="px-3 py-2 sm:px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 flex items-center space-x-1 sm:space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="community-search-filter flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search posts, users, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">All Posts</option>
          <option value="text">Text Posts</option>
          <option value="achievement">Achievements</option>
          <option value="question">Questions</option>
        </select>
      </div>

      {/* Mobile Tab Navigation - Show only on mobile */}
      <div className="xl:hidden mb-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-2 border border-slate-600/50 shadow-xl">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg'
                  : 'text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Left Sidebar - Navigation - Hidden on mobile */}
        <div className="community-left-sidebar hidden xl:block xl:col-span-1">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="community-main-content xl:col-span-2">
          {activeTab === 'feed' && (
            <div className="space-y-4 sm:space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="community-post bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-600/50 shadow-xl">
                    {/* Post Header */}
                    <div className="community-post-header flex items-start space-x-3 mb-3 sm:mb-4">
                      <img
                        src={post.profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt={post.profiles?.full_name || 'User'}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-emerald-400/50 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <h4 className="font-semibold text-white text-sm sm:text-base truncate">{post.profiles?.full_name || 'User'}</h4>
                          <span className="text-[10px] sm:text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 sm:py-1 rounded-full inline-block w-fit mt-1 sm:mt-0">
                            Level {post.profiles?.level || 1}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                      <button className="text-slate-400 hover:text-white">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Title */}
                    {post.title && (
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{post.title}</h3>
                    )}

                    {/* Post Content */}
                    <div className="mb-3 sm:mb-4">
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{post.content}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-[10px] sm:text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 sm:py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="community-post-actions flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 sm:pt-4 border-t border-slate-600/50 gap-3 sm:gap-0">
                      <div className="flex items-center space-x-4 sm:space-x-6 justify-around sm:justify-start">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1.5 sm:space-x-2 transition-colors min-w-0 ${
                            post.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-xs sm:text-sm">{post.likes_count || 0}</span>
                        </button>
                        <button className="flex items-center space-x-1.5 sm:space-x-2 text-slate-400 hover:text-blue-400 transition-colors min-w-0">
                          <Reply className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{post.comments_count || 0}</span>
                        </button>
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center space-x-1.5 sm:space-x-2 text-slate-400 hover:text-green-400 transition-colors min-w-0"
                        >
                          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{post.shares_count || 0}</span>
                        </button>
                      </div>
                      <div className="hidden sm:flex items-center space-x-2 text-slate-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">1.2k views</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 text-white text-center">Top Performers</h3>
              
              {/* Podium for Top 3 */}
              {leaderboard.length >= 3 ? (
                <div className="mb-8">
                  {/* Trophy Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Podium */}
                  <div className="flex items-end justify-center space-x-4 mb-6">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <img
                          src={leaderboard[1]?.avatar_url || `https://images.unsplash.com/photo-${1500000000000 + 1 * 100000000}?w=60&h=60&fit=crop&crop=face`}
                          alt={leaderboard[1]?.full_name || 'User'}
                          className="w-16 h-16 rounded-full border-2 border-slate-400"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          2
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold text-sm">{leaderboard[1]?.full_name || 'User'}</p>
                        <p className="text-emerald-400 text-xs flex items-center justify-center">
                          <Star className="w-3 h-3 mr-1" />
                          {leaderboard[1]?.current_xp?.toLocaleString() || 0} XP
                        </p>
                      </div>
                      <div className="w-20 h-16 bg-slate-600/50 rounded-t-lg mt-2 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <img
                          src={leaderboard[0]?.avatar_url || `https://images.unsplash.com/photo-${1500000000000 + 0 * 100000000}?w=60&h=60&fit=crop&crop=face`}
                          alt={leaderboard[0]?.full_name || 'User'}
                          className="w-20 h-20 rounded-full border-2 border-yellow-400"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          1
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold text-sm">{leaderboard[0]?.full_name || 'User'}</p>
                        <p className="text-emerald-400 text-xs flex items-center justify-center">
                          <Star className="w-3 h-3 mr-1" />
                          {leaderboard[0]?.current_xp?.toLocaleString() || 0} XP
                        </p>
                      </div>
                      <div className="w-20 h-24 bg-gradient-to-t from-yellow-400/20 to-yellow-400/40 rounded-t-lg mt-2 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <img
                          src={leaderboard[2]?.avatar_url || `https://images.unsplash.com/photo-${1500000000000 + 2 * 100000000}?w=60&h=60&fit=crop&crop=face`}
                          alt={leaderboard[2]?.full_name || 'User'}
                          className="w-16 h-16 rounded-full border-2 border-orange-400"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          3
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold text-sm">{leaderboard[2]?.full_name || 'User'}</p>
                        <p className="text-emerald-400 text-xs flex items-center justify-center">
                          <Star className="w-3 h-3 mr-1" />
                          {leaderboard[2]?.current_xp?.toLocaleString() || 0} XP
                        </p>
                      </div>
                      <div className="w-20 h-12 bg-slate-600/50 rounded-t-lg mt-2 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback for when there are fewer than 3 users */
                <div className="mb-8 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-slate-400">Not enough users for podium yet</p>
                </div>
              )}

              {/* List for remaining users */}
              <div className="space-y-3">
                {leaderboard.slice(3).map((user, index) => (
                  <div key={user.id} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-600 text-white font-bold text-sm">
                      {index + 4}
                    </div>
                    <img
                      src={user.avatar_url || `https://images.unsplash.com/photo-${1500000000000 + (index + 3) * 100000000}?w=40&h=40&fit=crop&crop=face`}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{user.full_name}</h4>
                      <p className="text-emerald-400 text-sm flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {user.current_xp?.toLocaleString() || 0} XP
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-12 relative">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-600"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-emerald-400"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${(user.current_xp || 0) / 100}, 100`}
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {Math.min(Math.round((user.current_xp || 0) / 100), 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
                      <p className="text-slate-300 mb-4">{challenge.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{challenge.participants || 0} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{challenge.xp_reward || 0} XP reward</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Ends {new Date(challenge.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        challenge.isParticipating
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {challenge.isParticipating ? 'Participating' : 'Join Challenge'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 text-white">Discover</h3>
              <p className="text-slate-300">Discover new users, topics, and content coming soon!</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Quick Stats - Hidden on mobile */}
        <div className="community-right-sidebar hidden xl:block xl:col-span-1">
          <div className="space-y-6">
            {/* Your Stats */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-white">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Level</span>
                  <span className="text-emerald-400 font-semibold">{profile?.level || 6}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total XP</span>
                  <span className="text-emerald-400 font-semibold">{profile?.current_xp || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Posts</span>
                  <span className="text-emerald-400 font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Followers</span>
                  <span className="text-emerald-400 font-semibold">89</span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-white">Trending</h3>
              <div className="space-y-3">
                {['#mindfulness', '#productivity', '#learning', '#habits', '#growth'].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-300">{topic}</span>
                    <span className="text-sm text-slate-400">{Math.floor(Math.random() * 1000)} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}

export default CommunityPage
