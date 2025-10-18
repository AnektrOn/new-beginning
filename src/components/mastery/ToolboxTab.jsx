import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Target, Trash2, CheckCircle, Clock, Star } from 'lucide-react';

const ToolboxTab = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [toolboxLibrary, setToolboxLibrary] = useState([]);
  const [userToolbox, setUserToolbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [conversionData, setConversionData] = useState({
    frequency_type: 'daily',
    xp_reward: 15
  });

  // Load toolbox data
  useEffect(() => {
    const loadToolbox = async () => {
      setLoading(true);
      try {
        // TODO: Implement API calls to fetch toolbox data
        // For now, using mock data
        const mockToolboxLibrary = [
          {
            id: '1',
            title: 'Pomodoro Technique',
            description: 'Time management method using 25-minute focused work sessions',
            category: 'cognitive',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          },
          {
            id: '2',
            title: 'Mind Mapping',
            description: 'Visual technique for organizing thoughts and ideas',
            category: 'cognitive',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          },
          {
            id: '3',
            title: 'Body Scan Meditation',
            description: 'Mindfulness practice focusing on physical sensations',
            category: 'spiritual',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          },
          {
            id: '4',
            title: 'Active Listening',
            description: 'Communication technique focused on understanding others',
            category: 'social',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          }
        ];

        const mockUserToolbox = [
          {
            id: '1',
            toolbox_id: '1',
            title: 'Pomodoro Technique',
            description: 'Time management method using 25-minute focused work sessions',
            is_active: true,
            converted_to_habit_id: null,
            usage_count: 12,
            last_used: '2024-01-15',
            xp_earned: 180,
            color: '#3B82F6',
            completed_dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-05', '2024-01-06', '2024-01-08', '2024-01-09', '2024-01-10', '2024-01-12', '2024-01-13', '2024-01-14', '2024-01-15']
          },
          {
            id: '2',
            toolbox_id: '2',
            title: 'Mind Mapping',
            description: 'Visual technique for organizing thoughts and ideas',
            is_active: true,
            converted_to_habit_id: null,
            usage_count: 8,
            last_used: '2024-01-14',
            xp_earned: 120,
            color: '#8B5CF6',
            completed_dates: ['2024-01-02', '2024-01-04', '2024-01-06', '2024-01-08', '2024-01-10', '2024-01-12', '2024-01-13', '2024-01-14']
          },
          {
            id: '3',
            toolbox_id: '3',
            title: 'Body Scan Meditation',
            description: 'Mindfulness practice focusing on physical sensations',
            is_active: true,
            converted_to_habit_id: null,
            usage_count: 15,
            last_used: '2024-01-15',
            xp_earned: 225,
            color: '#10B981',
            completed_dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10', '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14', '2024-01-15']
          }
        ];

        setToolboxLibrary(mockToolboxLibrary);
        setUserToolbox(mockUserToolbox);
      } catch (error) {
        console.error('Error loading toolbox:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToolbox();
  }, []);

  // Add tool to user toolbox
  const addToolToUser = async (tool) => {
    try {
      // TODO: Implement API call to add tool to user toolbox
      console.log('Adding tool to user toolbox:', tool);
      
      const userTool = {
        id: `user_${Date.now()}`,
        toolbox_id: tool.id,
        title: tool.title,
        description: tool.description,
        is_active: true,
        converted_to_habit_id: null
      };
      
      setUserToolbox([...userToolbox, userTool]);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  // Convert tool to habit
  const convertToolToHabit = async () => {
    try {
      // TODO: Implement API call to convert tool to habit
      console.log('Converting tool to habit:', selectedTool, conversionData);
      
      // Update user toolbox item
      setUserToolbox(userToolbox.map(tool => 
        tool.toolbox_id === selectedTool.id 
          ? { ...tool, converted_to_habit_id: `habit_${Date.now()}` }
          : tool
      ));
      
      setShowConvertModal(false);
      setSelectedTool(null);
    } catch (error) {
      console.error('Error converting tool:', error);
    }
  };

  // Remove tool from user toolbox
  const removeTool = async (toolId) => {
    try {
      // TODO: Implement API call to remove tool
      console.log('Removing tool:', toolId);
      
      setUserToolbox(userToolbox.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  // Check if tool is already in user toolbox
  const isToolInUserToolbox = (toolId) => {
    return userToolbox.some(tool => tool.toolbox_id === toolId);
  };

  // Helper function to generate progress grid for toolbox items
  const generateProgressGrid = (completedDates, color) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of current month and how many days it has
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const grid = [];
    
    // Create 6 rows (weeks) x 7 columns (days)
    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      for (let day = 0; day < 7; day++) {
        const dayNumber = week * 7 + day - startingDayOfWeek + 1;
        
        if (dayNumber < 1 || dayNumber > daysInMonth) {
          // Day is outside current month
          weekRow.push(
            <div
              key={`${week}-${day}`}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: '#ffffff' }}
            />
          );
        } else {
          const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
          const isCompleted = completedDates.includes(dateString);
          
          weekRow.push(
            <div
              key={`${week}-${day}`}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: isCompleted ? color : '#ffffff' }}
            />
          );
        }
      }
      grid.push(weekRow);
    }
    
    return grid;
  };

  // Helper function to calculate current streak from completion dates
  const calculateCurrentStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Sort dates in descending order (most recent first)
    const sortedDates = [...completedDates].sort().reverse();
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // Check if today is completed
    if (sortedDates.includes(todayString)) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If today is not completed, start from yesterday
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Count consecutive days backwards
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Use toolbox tool
  const handleUseTool = async (toolId) => {
    try {
      // TODO: Implement API call to use toolbox tool
      console.log('Using toolbox tool:', toolId);
      
      const today = new Date().toISOString().split('T')[0];
      
      setUserToolbox(userToolbox.map(tool => {
        if (tool.id === toolId) {
          const isUsedToday = tool.completed_dates.includes(today);
          
          // Prevent multiple uses on the same day
          if (isUsedToday) {
            return tool; // Already used today, don't change anything
          }
          
          // Add today to completed dates
          const newCompletedDates = [...tool.completed_dates, today];
          
          // Recalculate streak based on actual completion dates
          const newStreak = calculateCurrentStreak(newCompletedDates);
          
          return {
            ...tool,
            usage_count: tool.usage_count + 1,
            last_used: today,
            xp_earned: tool.xp_earned + 15, // Assuming 15 XP per use
            streak: newStreak,
            completed_dates: newCompletedDates,
            progress_grid: generateProgressGrid(newCompletedDates, tool.color)
          };
        }
        return tool;
      }));
    } catch (error) {
      console.error('Error using toolbox tool:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="glass-tab-navigation">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab('library')}
            className={`glass-tab-btn ${activeTab === 'library' ? 'glass-tab-btn-active' : ''}`}
          >
            <Wrench size={20} className="mr-2" />
            Library ({toolboxLibrary.length})
          </button>
          <button
            onClick={() => setActiveTab('my-toolbox')}
            className={`glass-tab-btn ${activeTab === 'my-toolbox' ? 'glass-tab-btn-active' : ''}`}
          >
            <Target size={20} className="mr-2" />
            My Toolbox ({userToolbox.length})
          </button>
        </nav>
      </div>

      {/* Toolbox Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Learning Tools Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover powerful learning tools and techniques. Add them to your toolbox or convert them into habits.
          </p>
          
          <div className="grid gap-4">
            {toolboxLibrary.map(tool => (
              <div key={tool.id} className="glass-toolbox-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.title}
                      </h3>
                      <span className="glass-difficulty-badge">
                        Level {tool.difficulty_level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        +{tool.xp_reward} XP
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {tool.category}
                      </span>
                      {tool.can_convert_to_habit && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Convertible to Habit
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {!isToolInUserToolbox(tool.id) ? (
                      <button
                        onClick={() => addToolToUser(tool)}
                        className="glass-primary-btn"
                      >
                        <Plus size={16} className="mr-2" />
                        Add to Toolbox
                      </button>
                    ) : (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ In Your Toolbox
                      </span>
                    )}
                    {tool.can_convert_to_habit && (
                      <button
                        onClick={() => {
                          setSelectedTool(tool);
                          setShowConvertModal(true);
                        }}
                        className="glass-secondary-btn"
                      >
                        <Target size={16} className="mr-2" />
                        Convert to Habit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Toolbox Tab */}
      {activeTab === 'my-toolbox' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Toolbox
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your personal collection of learning tools and techniques.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {userToolbox.map(tool => {
              const today = new Date().toISOString().split('T')[0];
              const isUsedToday = tool.completed_dates.includes(today);
              const streak = calculateCurrentStreak(tool.completed_dates);
              const progressGrid = generateProgressGrid(tool.completed_dates, tool.color);
              
              return (
                <div key={tool.id} className="w-80 bg-blue-900 rounded-lg p-4 text-white">
                  {/* Header with icon and title */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Wrench size={20} className="text-white" strokeWidth={1.5} />
                      <h3 className="text-lg font-semibold text-white truncate">
                        {tool.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400" />
                      <span className="text-sm text-yellow-400 font-medium">
                        {tool.xp_earned} XP
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Usage button */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleUseTool(tool.id);
                      }}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isUsedToday
                          ? 'bg-blue-600 text-white'
                          : 'border border-white text-white hover:bg-white hover:text-blue-900'
                      }`}
                    >
                      <CheckCircle size={16} strokeWidth={1.5} />
                      <span>{isUsedToday ? 'Used Today' : 'Use Tool'}</span>
                    </button>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock size={14} className="text-gray-300" />
                      <span className="text-gray-300">
                        {tool.usage_count} uses
                      </span>
                    </div>
                  </div>

                  {/* Streak counter */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">Streak:</span>
                      <span className="text-sm font-semibold text-white">
                        {streak} days
                      </span>
                    </div>
                    
                    {!tool.converted_to_habit_id && (
                      <button
                        onClick={() => {
                          const libraryTool = toolboxLibrary.find(t => t.id === tool.toolbox_id);
                          if (libraryTool) {
                            setSelectedTool(libraryTool);
                            setShowConvertModal(true);
                          }
                        }}
                        className="text-xs text-blue-300 hover:text-blue-200 underline"
                      >
                        Convert to Habit
                      </button>
                    )}
                  </div>

                  {/* Progress grid */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-7 gap-1">
                      {progressGrid.map((week, weekIndex) =>
                        week.map((day, dayIndex) => (
                          <div key={`${weekIndex}-${dayIndex}`}>
                            {day}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Remove button */}
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => removeTool(tool.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {userToolbox.length === 0 && (
            <div className="glass-card p-8 text-center">
              <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your toolbox is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start building your learning toolkit by exploring the library.
              </p>
              <button
                onClick={() => setActiveTab('library')}
                className="glass-primary-btn"
              >
                Browse Library
              </button>
            </div>
          )}
        </div>
      )}

      {/* Convert to Habit Modal */}
      {showConvertModal && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-modal">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Convert "{selectedTool.title}" to Habit
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {selectedTool.description}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={conversionData.frequency_type}
                  onChange={(e) => setConversionData({ ...conversionData, frequency_type: e.target.value })}
                  className="glass-input"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  XP Reward
                </label>
                <input
                  type="number"
                  value={conversionData.xp_reward}
                  onChange={(e) => setConversionData({ ...conversionData, xp_reward: parseInt(e.target.value) })}
                  className="glass-input"
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={convertToolToHabit}
                className="glass-primary-btn"
              >
                Convert to Habit
              </button>
              <button
                onClick={() => {
                  setShowConvertModal(false);
                  setSelectedTool(null);
                }}
                className="glass-secondary-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolboxTab;
