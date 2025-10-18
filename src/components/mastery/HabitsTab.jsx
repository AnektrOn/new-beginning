import React, { useState, useEffect } from 'react';
import { Plus, Target, CheckCircle, Star, Laptop, BookOpen, Dumbbell, Flame } from 'lucide-react';

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

// Helper function to generate progress grid for current month with proper calendar layout
const generateProgressGrid = (completedDates = [], color) => {
  const grid = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Create 6 rows x 7 columns = 42 cells to cover any month
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      const cellIndex = week * 7 + day;
      const dayOfMonth = cellIndex - firstDayOfWeek + 1;
      
      // Check if this cell represents a valid day of the month
      if (dayOfMonth >= 1 && dayOfMonth <= lastDayOfMonth.getDate()) {
        const date = new Date(currentYear, currentMonth, dayOfMonth);
        const dateString = date.toISOString().split('T')[0];
        const wasCompleted = completedDates.includes(dateString);
        
        grid.push({
          date: dateString,
          dayOfMonth: dayOfMonth,
          filled: wasCompleted,
          color: wasCompleted ? color : '#ffffff',
          isCurrentMonth: true
        });
      } else {
        // Empty cell for days outside the current month
        grid.push({
          date: null,
          dayOfMonth: null,
          filled: false,
          color: '#ffffff',
          isCurrentMonth: false
        });
      }
    }
  }
  
  return grid;
};

const HabitsTab = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalHabits, setPersonalHabits] = useState([]);
  const [habitsLibrary, setHabitsLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency_type: 'daily',
    xp_reward: 10
  });

  // Load habits data
  useEffect(() => {
    const loadHabits = async () => {
      setLoading(true);
      try {
        // TODO: Implement API calls to fetch habits
        // For now, using mock data matching the image design
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Generate some realistic completion dates for demonstration
        const buildInPublicDates = [today, yesterday, twoDaysAgo, '2024-10-14', '2024-10-13', '2024-10-12', '2024-10-11', '2024-10-10'];
        const readDates = [yesterday, twoDaysAgo, '2024-10-14', '2024-10-13', '2024-10-12'];
        const workoutDates = [today, yesterday, twoDaysAgo];
        
        const mockPersonalHabits = [
          {
            id: '1',
            title: 'Build in Public',
            description: 'Share your progress and learnings publicly',
            frequency_type: 'daily',
            xp_reward: 10,
            completion_count: buildInPublicDates.length,
            streak: calculateCurrentStreak(buildInPublicDates),
            is_active: true,
            is_custom: true,
            icon: Laptop,
            color: '#3b82f6', // Blue
            completed_today: buildInPublicDates.includes(today),
            completed_dates: buildInPublicDates,
            progress_grid: generateProgressGrid(buildInPublicDates, '#3b82f6')
          },
          {
            id: '2',
            title: 'Read 10 pages',
            description: 'Read at least 10 pages daily',
            frequency_type: 'daily',
            xp_reward: 10,
            completion_count: readDates.length,
            streak: calculateCurrentStreak(readDates),
            is_active: true,
            is_custom: false,
            icon: BookOpen,
            color: '#10b981', // Green
            completed_today: readDates.includes(today),
            completed_dates: readDates,
            progress_grid: generateProgressGrid(readDates, '#10b981')
          },
          {
            id: '3',
            title: 'Workout',
            description: 'Exercise for at least 30 minutes',
            frequency_type: 'daily',
            xp_reward: 10,
            completion_count: workoutDates.length,
            streak: calculateCurrentStreak(workoutDates),
            is_active: true,
            is_custom: true,
            icon: Dumbbell,
            color: '#8b5cf6', // Purple
            completed_today: workoutDates.includes(today),
            completed_dates: workoutDates,
            progress_grid: generateProgressGrid(workoutDates, '#8b5cf6')
          }
        ];

        const mockHabitsLibrary = [
          {
            id: '3',
            title: 'Meditation',
            description: 'Practice mindfulness for 15 minutes',
            category: 'spiritual',
            xp_reward: 10,
            frequency_type: 'daily'
          },
          {
            id: '4',
            title: 'Journaling',
            description: 'Write in your journal for 10 minutes',
            category: 'creative',
            xp_reward: 10,
            frequency_type: 'daily'
          },
          {
            id: '5',
            title: 'Healthy Breakfast',
            description: 'Eat a nutritious breakfast every morning',
            category: 'physical',
            xp_reward: 10,
            frequency_type: 'daily'
          }
        ];

        setPersonalHabits(mockPersonalHabits);
        setHabitsLibrary(mockHabitsLibrary);
      } catch (error) {
        console.error('Error loading habits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  // Add habit from library to personal
  const addHabitFromLibrary = async (habit) => {
    try {
      // TODO: Implement API call to add habit to personal list
      console.log('Adding habit from library:', habit);
      
      const newPersonalHabit = {
        ...habit,
        id: `personal_${Date.now()}`,
        completion_count: 0,
        is_active: true,
        is_custom: false
      };
      
      setPersonalHabits([...personalHabits, newPersonalHabit]);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  // Create custom habit
  const createCustomHabit = async () => {
    try {
      // TODO: Implement API call to create custom habit
      console.log('Creating custom habit:', newHabit);
      
      const customHabit = {
        ...newHabit,
        id: `custom_${Date.now()}`,
        completion_count: 0,
        is_active: true,
        is_custom: true
      };
      
      setPersonalHabits([...personalHabits, customHabit]);
      setNewHabit({ title: '', description: '', frequency_type: 'daily', xp_reward: 10 });
      setShowAddHabit(false);
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  // Delete habit (commented out for now - will be added back when needed)
  // const deleteHabit = async (habitId) => {
  //   try {
  //     // TODO: Implement API call to delete habit
  //     console.log('Deleting habit:', habitId);
  //     
  //     setPersonalHabits(personalHabits.filter(habit => habit.id !== habitId));
  //   } catch (error) {
  //     console.error('Error deleting habit:', error);
  //   }
  // };

  // Complete habit
  const completeHabit = async (habitId) => {
    try {
      // TODO: Implement API call to complete habit
      console.log('Completing habit:', habitId);
      
      const today = new Date().toISOString().split('T')[0];
      
      setPersonalHabits(personalHabits.map(habit => {
        if (habit.id === habitId) {
          const isCompletedToday = habit.completed_dates.includes(today);
          
          // Prevent multiple completions on the same day
          if (isCompletedToday) {
            return habit; // Already completed today, don't change anything
          }
          
          // Add today to completed dates
          const newCompletedDates = [...habit.completed_dates, today];
          
          // Recalculate streak based on actual completion dates
          const newStreak = calculateCurrentStreak(newCompletedDates);
          
          return {
            ...habit,
            completion_count: newCompletedDates.length,
            streak: newStreak,
            completed_today: true,
            completed_dates: newCompletedDates,
            progress_grid: generateProgressGrid(newCompletedDates, habit.color)
          };
        }
        return habit;
      }));
    } catch (error) {
      console.error('Error completing habit:', error);
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
            onClick={() => setActiveTab('personal')}
            className={`glass-tab-btn ${activeTab === 'personal' ? 'glass-tab-btn-active' : ''}`}
          >
            <Target size={20} className="mr-2" />
            My Habits ({personalHabits.length})
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`glass-tab-btn ${activeTab === 'library' ? 'glass-tab-btn-active' : ''}`}
          >
            <Star size={20} className="mr-2" />
            Library ({habitsLibrary.length})
          </button>
        </nav>
      </div>

      {/* Personal Habits Tab */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          {/* Add Custom Habit Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              My Habits
            </h2>
            <button
              onClick={() => setShowAddHabit(true)}
              className="glass-primary-btn"
            >
              <Plus size={20} className="mr-2" />
              Add Custom Habit
            </button>
          </div>

          {/* Add Custom Habit Form */}
          {showAddHabit && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create Custom Habit
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Habit Title
                  </label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    className="glass-input"
                    placeholder="e.g., Morning Meditation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="glass-input"
                    rows={3}
                    placeholder="Describe your habit..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newHabit.frequency_type}
                      onChange={(e) => setNewHabit({ ...newHabit, frequency_type: e.target.value })}
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
                      value={newHabit.xp_reward}
                      onChange={(e) => setNewHabit({ ...newHabit, xp_reward: parseInt(e.target.value) })}
                      className="glass-input"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={createCustomHabit}
                    className="glass-primary-btn"
                    disabled={!newHabit.title.trim()}
                  >
                    Create Habit
                  </button>
                  <button
                    onClick={() => setShowAddHabit(false)}
                    className="glass-secondary-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personal Habits List */}
          <div className="flex flex-wrap gap-3">
            {personalHabits.map(habit => {
              const IconComponent = habit.icon;
              return (
                <div key={habit.id} className="bg-blue-900 rounded-lg p-4 shadow-sm w-80">
                  <div className="flex items-center justify-between">
                    {/* Left Section - Icon, Title, and Completion Button */}
                    <div className="flex items-center space-x-3">
                      <IconComponent size={16} className="text-white" strokeWidth={1.5} />
                      <h3 className="text-sm font-semibold text-white">
                        {habit.title}
                      </h3>
                      <button
                        onClick={() => completeHabit(habit.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          habit.completed_today
                            ? 'bg-blue-600 text-white'
                            : 'border-2 border-white text-white hover:bg-white hover:text-blue-900'
                        }`}
                      >
                        <CheckCircle size={12} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Right Section - Streak and Progress Grid */}
                    <div className="flex items-center space-x-3">
                      {/* Streak Counter */}
                      <div className="flex items-center space-x-1">
                        <Flame size={14} className="text-white" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-white">
                          {habit.streak}
                        </span>
                      </div>

                      {/* Progress Grid - Monthly Calendar Layout */}
                      <div className="grid grid-cols-7 gap-0.5">
                        {habit.progress_grid.map((day, index) => (
                          <div
                            key={index}
                            className={`w-2.5 h-2.5 rounded-sm ${
                              day.isCurrentMonth ? '' : 'opacity-30'
                            }`}
                            style={{ 
                              backgroundColor: day.filled ? day.color : '#ffffff',
                              border: day.isCurrentMonth ? 'none' : '1px solid #e5e7eb'
                            }}
                            title={day.date ? new Date(day.date).toLocaleDateString() : ''}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {personalHabits.length === 0 && (
            <div className="glass-card p-8 text-center">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No habits yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start building your habits by adding from the library or creating custom ones.
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

      {/* Habits Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Habits Library
          </h2>
          
          <div className="grid gap-4">
            {habitsLibrary.map(habit => (
              <div key={habit.id} className="glass-habit-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {habit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {habit.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        +{habit.xp_reward} XP
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {habit.frequency_type}
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {habit.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addHabitFromLibrary(habit)}
                    className="glass-primary-btn"
                  >
                    <Plus size={20} className="mr-2" />
                    Add to My Habits
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsTab;
