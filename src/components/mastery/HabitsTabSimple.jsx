import React, { useState, useEffect } from 'react';
import { Plus, Target, CheckCircle, Star, BookOpen, Dumbbell, Flame, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Simple fallback version that works without complex database queries
const HabitsTabSimple = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency_type: 'daily',
    xp_reward: 10
  });

  // Simple data loading without complex queries
  useEffect(() => {
    if (!user) {
      console.log('📝 HabitsTabSimple: No user, skipping data load');
      return;
    }
    
    console.log('📝 HabitsTabSimple: Loading habits data for user:', user.id);
    setError(null);
    
    // For now, just show some sample habits
    const sampleHabits = [
      {
        id: '1',
        title: 'Read for 30 minutes',
        description: 'Read books, articles, or educational content',
        frequency_type: 'daily',
        xp_reward: 15,
        currentStreak: 3,
        completedDates: ['2024-01-20', '2024-01-21', '2024-01-22'],
        color: '#10b981',
        Icon: BookOpen
      },
      {
        id: '2',
        title: 'Exercise for 20 minutes',
        description: 'Do any form of physical exercise',
        frequency_type: 'daily',
        xp_reward: 20,
        currentStreak: 1,
        completedDates: ['2024-01-22'],
        color: '#8b5cf6',
        Icon: Dumbbell
      }
    ];
    
    setHabits(sampleHabits);
    console.log('✅ HabitsTabSimple: Sample habits loaded');
  }, [user]);

  const handleToggleHabit = async (habitId, date) => {
    console.log('📝 HabitsTabSimple: Toggling habit completion:', habitId, date);
    
    // Simple toggle logic
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(date);
        const newCompletedDates = isCompleted 
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];
        
        return {
          ...habit,
          completedDates: newCompletedDates,
          currentStreak: calculateCurrentStreak(newCompletedDates)
        };
      }
      return habit;
    }));
    
    console.log('✅ HabitsTabSimple: Habit toggled successfully');
  };

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

  const generateProgressGrid = (completedDates = [], color) => {
    const grid = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const cellIndex = week * 7 + day;
        const dayOfMonth = cellIndex - firstDayOfWeek + 1;
        
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

  const handleCreateHabit = async () => {
    if (!newHabit.title.trim()) return;
    
    console.log('📝 HabitsTabSimple: Creating new habit:', newHabit.title);
    
    const newHabitData = {
      id: Date.now().toString(),
      ...newHabit,
      currentStreak: 0,
      completedDates: [],
      color: '#3b82f6',
      Icon: Target
    };
    
    setHabits(prev => [...prev, newHabitData]);
    setNewHabit({ title: '', description: '', frequency_type: 'daily', xp_reward: 10 });
    setShowAddHabit(false);
    
    console.log('✅ HabitsTabSimple: Habit created successfully');
  };

  const handleDeleteHabit = async (habitId) => {
    console.log('📝 HabitsTabSimple: Deleting habit:', habitId);
    
    setHabits(prev => prev.filter(h => h.id !== habitId));
    
    console.log('✅ HabitsTabSimple: Habit deleted successfully');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Habits (Simple Mode)</h2>
        <button
          onClick={() => setShowAddHabit(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Target className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Simple Mode:</strong> This is a fallback version that works without complex database queries. 
              Create the missing tables to enable full functionality.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-4">Start building good habits to track your progress</p>
            <button
              onClick={() => setShowAddHabit(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {habits.map((habit) => {
              const Icon = habit.Icon;
              return (
                <div key={habit.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: habit.color + '20' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: habit.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
                        <p className="text-sm text-gray-600">{habit.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Flame className="w-4 h-4 text-orange-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{habit.currentStreak}</span>
                        <span className="text-sm text-gray-600 ml-1">day streak</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{habit.xp_reward}</span>
                        <span className="text-sm text-gray-600 ml-1">XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {generateProgressGrid(habit.completedDates, habit.color).map((cell, index) => (
                      <button
                        key={index}
                        onClick={() => cell.isCurrentMonth && handleToggleHabit(habit.id, cell.date)}
                        className={`w-6 h-6 rounded text-xs ${
                          cell.isCurrentMonth 
                            ? 'hover:opacity-80 cursor-pointer' 
                            : 'cursor-default'
                        }`}
                        style={{ 
                          backgroundColor: cell.filled ? habit.color : '#f3f4f6',
                          border: cell.filled ? `1px solid ${habit.color}` : '1px solid #e5e7eb'
                        }}
                        disabled={!cell.isCurrentMonth}
                      >
                        {cell.dayOfMonth}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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

export default HabitsTabSimple;
