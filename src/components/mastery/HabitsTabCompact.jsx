import React, { useState, useEffect } from 'react';
import { Plus, Target, Star, BookOpen, Dumbbell, Flame, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useMasteryRefresh } from '../../pages/Mastery';

// Helper function to calculate current streak from completion dates
const calculateCurrentStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const sortedDates = [...completedDates].sort().reverse();
  
  let streak = 0;
  let currentDate = new Date(today);
  
  if (sortedDates.includes(todayString)) {
    streak = 1;
    currentDate.setDate(currentDate.getDate() - 1);
  } else {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
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

// Helper function to get appropriate icon and color for habits
const getHabitIconAndColor = (title) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('read') || titleLower.includes('book')) {
    return { icon: BookOpen, color: '#10b981' };
  } else if (titleLower.includes('workout') || titleLower.includes('exercise') || titleLower.includes('gym')) {
    return { icon: Dumbbell, color: '#8b5cf6' };
  } else if (titleLower.includes('build') || titleLower.includes('code') || titleLower.includes('program')) {
    return { icon: Target, color: '#3b82f6' };
  } else if (titleLower.includes('meditation') || titleLower.includes('mindfulness')) {
    return { icon: Star, color: '#f59e0b' };
  } else {
    return { icon: Target, color: '#6b7280' };
  }
};

const HabitsTabCompact = () => {
  const { user } = useAuth();
  const { triggerRefresh } = useMasteryRefresh();
  const [activeTab, setActiveTab] = useState('library');
  const [personalHabits, setPersonalHabits] = useState([]);
  const [habitsLibrary, setHabitsLibrary] = useState([]);
  const [error, setError] = useState(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency_type: 'daily',
    xp_reward: 10
  });

  // Load habits data from database - NO LOADING STATE
  useEffect(() => {
    const loadHabits = async () => {
      console.log('📝 HabitsTabCompact: Starting habits data load');
      setError(null);
      
      try {
        // Load habits library from database (always load this)
        const { data: libraryHabits, error: libraryError } = await supabase
          .from('habits_library')
          .select('*');

        if (libraryError) {
          console.error('❌ HabitsTabCompact: Error loading habits library:', libraryError);
          setError('Failed to load habits library');
          return;
        }

        console.log('✅ HabitsTabCompact: Library loaded successfully:', libraryHabits?.length || 0, 'items');

        // Load user habits from database (only if user exists)
        let userHabits = [];
        if (user && user.id) {
          console.log('📝 HabitsTabCompact: Loading user habits for user:', user.id);
          
          const { data: userData, error: userHabitsError } = await supabase
            .from('user_habits')
            .select('*')
            .eq('user_id', user.id);

          if (userHabitsError) {
            console.error('❌ HabitsTabCompact: Error loading user habits:', userHabitsError);
            // Don't fail completely, just use empty user habits
            userHabits = [];
          } else {
            userHabits = userData || [];
            console.log('✅ HabitsTabCompact: User habits loaded:', userHabits.length, 'items');
          }
        } else {
          console.log('📝 HabitsTabCompact: No user, using empty user habits');
        }

        // Transform user habits to include completion data and UI properties
        const transformedHabits = await Promise.all(
          (userHabits || []).map(async (habit) => {
            // Get completions for the current month
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            // Try to get completions, but don't fail if table doesn't exist or no user
            let completions = [];
            if (user && user.id) {
              try {
                const { data: completionData } = await supabase
                  .from('user_habit_completions')
                  .select('completed_at')
                  .eq('user_id', user.id)
                  .eq('habit_id', habit.id)
                  .gte('completed_at', `${firstDayOfMonth.toISOString().split('T')[0]}T00:00:00`)
                  .lte('completed_at', `${lastDayOfMonth.toISOString().split('T')[0]}T23:59:59`);
                
                completions = completionData || [];
              } catch (completionError) {
                console.log('📝 HabitsTabCompact: user_habit_completions table not found, using empty completions');
                completions = [];
              }
            }

            const completedDates = completions.map(c => c.completed_at.split('T')[0]);
            const currentStreak = calculateCurrentStreak(completedDates);
            const { icon: Icon, color } = getHabitIconAndColor(habit.title);

            return {
              ...habit,
              completedDates,
              currentStreak,
              Icon,
              color,
              progressGrid: generateProgressGrid(completedDates, color)
            };
          })
        );

        setPersonalHabits(transformedHabits);
        setHabitsLibrary(libraryHabits || []);
        console.log('✅ HabitsTabCompact: Habits loaded successfully:', transformedHabits.length, 'personal habits,', libraryHabits?.length || 0, 'library habits');
        console.log('📋 HabitsTabCompact: Library habits data:', libraryHabits);
      } catch (error) {
        console.error('❌ HabitsTabCompact: Exception during habits load:', error);
        // Try to at least load the library data as fallback
        try {
          const { data: fallbackLibrary } = await supabase
            .from('habits_library')
            .select('*');
          setHabitsLibrary(fallbackLibrary || []);
          setPersonalHabits([]);
          console.log('📝 HabitsTabCompact: Fallback library loaded:', fallbackLibrary?.length || 0, 'items');
        } catch (fallbackError) {
          console.error('❌ HabitsTabCompact: Fallback also failed:', fallbackError);
          setError('Failed to load habits data');
        }
      }
    };

    loadHabits();
  }, [user]);

  // Compact progress grid generation (4x6 = 24 squares)
  const generateProgressGrid = (completedDates = [], color) => {
    const grid = [];
    const today = new Date();
    
    // Create a 4x6 grid (24 squares) for the last 24 days
    for (let i = 23; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const wasCompleted = completedDates.includes(dateString);
      
      grid.push({
        date: dateString,
        filled: wasCompleted,
        color: wasCompleted ? color : '#e5e7eb',
        isClickable: true
      });
    }
    
    return grid;
  };

  const handleToggleHabit = async (habitId, date) => {
    if (!user) return;
    
    try {
      console.log('📝 HabitsTabCompact: Toggling habit completion:', habitId, date);
      
      // Try to toggle completion in database
      try {
        // Check if completion exists for this date
        const { data: existing } = await supabase
          .from('user_habit_completions')
          .select('id')
          .eq('user_id', user.id)
          .eq('habit_id', habitId)
          .gte('completed_at', `${date}T00:00:00`)
          .lte('completed_at', `${date}T23:59:59`)
          .maybeSingle();

        if (existing) {
          // Delete if exists (toggle off)
          await supabase
            .from('user_habit_completions')
            .delete()
            .eq('id', existing.id);
          console.log('✅ HabitsTabCompact: Completion removed from database');
        } else {
          // Insert if doesn't exist (toggle on)
          await supabase
            .from('user_habit_completions')
            .insert({
              user_id: user.id,
              habit_id: habitId,
              completed_at: new Date(date).toISOString()
            });
          console.log('✅ HabitsTabCompact: Completion added to database');
        }
      } catch (dbError) {
        console.log('📝 HabitsTabCompact: Database toggle failed, using local state only', dbError);
      }

      // Update local state immediately for responsive UI
      setPersonalHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(date);
          const newCompletedDates = isCompleted 
            ? habit.completedDates.filter(d => d !== date)
            : [...habit.completedDates, date];
          
          return {
            ...habit,
            completedDates: newCompletedDates,
            currentStreak: calculateCurrentStreak(newCompletedDates),
            progressGrid: generateProgressGrid(newCompletedDates, habit.color)
          };
        }
        return habit;
      }));
      
      // Trigger calendar refresh so completions show up
      if (triggerRefresh) {
        triggerRefresh();
      }
      
      console.log('✅ HabitsTabCompact: Habit toggled successfully');
    } catch (error) {
      console.error('❌ HabitsTabCompact: Exception during habit toggle:', error);
      setError('Failed to update habit');
    }
  };

  const handleCreateHabit = async () => {
    if (!user || !newHabit.title.trim()) return;
    
    try {
      console.log('📝 HabitsTabCompact: Creating new habit:', newHabit.title);
      
      const { data, error } = await supabase
        .from('user_habits')
        .insert({
          user_id: user.id,
          title: newHabit.title,
          description: newHabit.description,
          frequency_type: newHabit.frequency_type,
          xp_reward: newHabit.xp_reward
        })
        .select()
        .single();

      if (error) {
        console.error('❌ HabitsTabCompact: Error creating habit:', error);
        setError('Failed to create habit');
        return;
      }

      const { icon: Icon, color } = getHabitIconAndColor(data.title);
      const newHabitData = {
        ...data,
        completedDates: [],
        currentStreak: 0,
        Icon,
        color,
        progressGrid: generateProgressGrid([], color)
      };

      setPersonalHabits(prev => [...prev, newHabitData]);
      setNewHabit({ title: '', description: '', frequency_type: 'daily', xp_reward: 10 });
      setShowAddHabit(false);
      
      console.log('✅ HabitsTabCompact: Habit created successfully');
    } catch (error) {
      console.error('❌ HabitsTabCompact: Exception during habit creation:', error);
      setError('Failed to create habit');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!user) return;
    
    try {
      console.log('📝 HabitsTabCompact: Deleting habit:', habitId);
      
      const { error } = await supabase
        .from('user_habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ HabitsTabCompact: Error deleting habit:', error);
        setError('Failed to delete habit');
        return;
      }

      setPersonalHabits(prev => prev.filter(h => h.id !== habitId));
      console.log('✅ HabitsTabCompact: Habit deleted successfully');
    } catch (error) {
      console.error('❌ HabitsTabCompact: Exception during habit deletion:', error);
      setError('Failed to delete habit');
    }
  };

  const handleAddFromLibrary = async (libraryHabit) => {
    if (!user) return;
    
    try {
      console.log('📝 HabitsTabCompact: Adding habit from library:', libraryHabit.title);
      
      const { data, error } = await supabase
        .from('user_habits')
        .insert({
          user_id: user.id,
          title: libraryHabit.title,
          description: libraryHabit.description,
          frequency_type: libraryHabit.frequency_type,
          xp_reward: libraryHabit.xp_reward
        })
        .select()
        .single();

      if (error) {
        console.error('❌ HabitsTabCompact: Error adding habit from library:', error);
        setError('Failed to add habit from library');
        return;
      }

      const { icon: Icon, color } = getHabitIconAndColor(data.title);
      const newHabitData = {
        ...data,
        completedDates: [],
        currentStreak: 0,
        Icon,
        color,
        progressGrid: generateProgressGrid([], color)
      };

      setPersonalHabits(prev => [...prev, newHabitData]);
      console.log('✅ HabitsTabCompact: Habit added from library successfully');
    } catch (error) {
      console.error('❌ HabitsTabCompact: Exception during library habit addition:', error);
      setError('Failed to add habit from library');
    }
  };

  // Error display
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading habits</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Habits</h2>
        <button
          onClick={() => setShowAddHabit(true)}
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'personal'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Habits ({personalHabits.length})
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'library'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Library ({habitsLibrary.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'personal' && (
        <div className="space-y-3">
          {personalHabits.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No personal habits yet</h3>
              <p className="text-xs text-gray-600 mb-3">Add habits from the library or create your own</p>
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={() => setActiveTab('library')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Browse Library
                </button>
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Create Custom
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {personalHabits.map((habit) => {
                const Icon = habit.Icon;
                const isCompletedToday = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
                
                return (
                  <div key={habit.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                          style={{ backgroundColor: habit.color + '20' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: habit.color }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{habit.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Flame className="w-3 h-3 text-orange-500 mr-1" />
                          <span className="text-xs font-medium text-gray-900">{habit.currentStreak}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Compact Progress Grid */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleHabit(habit.id, new Date().toISOString().split('T')[0])}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompletedToday 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </button>
                      
                      <div className="grid grid-cols-6 gap-1">
                        {habit.progressGrid.map((cell, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: cell.color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'library' && (
        <div className="space-y-3">
          {habitsLibrary.map((habit) => {
            const { icon: Icon, color } = getHabitIconAndColor(habit.title);
            return (
              <div key={habit.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: color + '20' }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{habit.title}</h3>
                      <p className="text-xs text-gray-600">{habit.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddFromLibrary(habit)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Habit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Read for 30 minutes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe your habit..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                <input
                  type="number"
                  value={newHabit.xp_reward}
                  onChange={(e) => setNewHabit({ ...newHabit, xp_reward: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddHabit(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateHabit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsTabCompact;
