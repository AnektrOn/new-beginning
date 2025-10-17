import React, { useState, useEffect } from 'react';
import { Plus, Target, Trash2, Circle, Star } from 'lucide-react';

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
        // For now, using mock data
        const mockPersonalHabits = [
          {
            id: '1',
            title: 'Morning Workout',
            description: '30 minutes of exercise to start the day',
            frequency_type: 'daily',
            xp_reward: 10,
            completion_count: 15,
            is_active: true,
            is_custom: true
          },
          {
            id: '2',
            title: 'Daily Reading',
            description: 'Read for 30 minutes to expand knowledge',
            frequency_type: 'daily',
            xp_reward: 10,
            completion_count: 8,
            is_active: true,
            is_custom: false
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

  // Delete habit
  const deleteHabit = async (habitId) => {
    try {
      // TODO: Implement API call to delete habit
      console.log('Deleting habit:', habitId);
      
      setPersonalHabits(personalHabits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  // Complete habit
  const completeHabit = async (habitId) => {
    try {
      // TODO: Implement API call to complete habit
      console.log('Completing habit:', habitId);
      
      setPersonalHabits(personalHabits.map(habit => 
        habit.id === habitId 
          ? { ...habit, completion_count: habit.completion_count + 1 }
          : habit
      ));
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
          <div className="grid gap-4">
            {personalHabits.map(habit => (
              <div key={habit.id} className="glass-habit-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => completeHabit(habit.id)}
                      className="glass-completion-btn"
                    >
                      <Circle size={24} className="text-gray-400 hover:text-green-500" />
                    </button>
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
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {habit.completion_count} completions
                        </span>
                        {habit.is_custom && (
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="glass-delete-btn"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
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
