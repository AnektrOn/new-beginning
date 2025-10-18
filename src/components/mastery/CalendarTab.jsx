import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid3X3, Clock, Edit3, Trash2, CheckCircle, Target } from 'lucide-react';
import masteryService from '../../services/masteryService';
import { useAuth } from '../../contexts/AuthContext';
import { useMasteryRefresh } from '../../pages/Mastery';

const CalendarTab = () => {
  const { user } = useAuth();
  const { triggerRefresh } = useMasteryRefresh();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [habits, setHabits] = useState([]);
  const [view, setView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to calculate current streak from completion dates
  const calculateCurrentStreak = (completedDates = []) => {
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

  // Helper function to get appropriate color for habits
  const getHabitColor = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('read') || titleLower.includes('book')) {
      return '#10b981'; // Green
    } else if (titleLower.includes('workout') || titleLower.includes('exercise') || titleLower.includes('gym')) {
      return '#8b5cf6'; // Purple
    } else if (titleLower.includes('build') || titleLower.includes('code') || titleLower.includes('program')) {
      return '#3b82f6'; // Blue
    } else if (titleLower.includes('meditation') || titleLower.includes('mindfulness')) {
      return '#f59e0b'; // Orange
    } else if (titleLower.includes('journal') || titleLower.includes('write')) {
      return '#ef4444'; // Red
    } else {
      return '#6b7280'; // Gray default
    }
  };

  // Load habits data and convert to calendar events
  useEffect(() => {
    const loadHabitsAndEvents = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load user habits
        const { data: userHabits, error: userHabitsError } = await masteryService.getUserHabits(user.id);
        if (userHabitsError) throw userHabitsError;

        // Load calendar events for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);

        // Transform user habits to include completion data
        const transformedHabits = await Promise.all(
          (userHabits || []).map(async (habit) => {
            // Get completions for the entire current month
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            const { data: completions } = await masteryService.getHabitCompletions(
              user.id,
              habit.id,
              firstDayOfMonth.toISOString().split('T')[0],
              lastDayOfMonth.toISOString().split('T')[0]
            );

            // Calculate streak
            const { data: streak } = await masteryService.calculateHabitStreak(user.id, habit.id);

            // Get completion dates
            const completedDates = (completions || []).map(c => c.completed_at.split('T')[0]);
            const todayString = today.toISOString().split('T')[0];

            return {
              ...habit,
              completed_dates: completedDates,
              completed_today: completedDates.includes(todayString),
              streak: streak || 0,
              color: getHabitColor(habit.title)
            };
          })
        );

        // Store habits for virtual calendar generation (no pre-generated events)
        setHabits(transformedHabits);

        // No events stored - all habit events generated virtually on-demand
        setEvents([]);
      } catch (error) {
        console.error('Error loading habits and events:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHabitsAndEvents();
  }, [user]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Virtual event generation - creates habit events on-demand
  const getVirtualHabitEvents = (date) => {
    if (!date || !habits) return [];
    const dateStr = date.toISOString().split('T')[0];
    const virtualEvents = [];

    // Check if this date is within completion range (current day + 2 days prior)
    const today = new Date();
    const targetDate = new Date(dateStr);
    const daysDiff = Math.floor((today - targetDate) / (1000 * 60 * 60 * 24));
    const isClickable = daysDiff >= 0 && daysDiff <= 2;

    habits.forEach(habit => {
      // For daily habits, create virtual event for any date
      if (habit.frequency_type === 'daily') {
        const isCompleted = habit.completed_dates.includes(dateStr);
        virtualEvents.push({
          id: `habit-${habit.id}-${dateStr}`,
          title: habit.title,
          date: dateStr,
          startTime: '09:00',
          endTime: '09:30',
          color: habit.color,
          completed: isCompleted,
          source: 'habit',
          habitId: habit.id,
          description: habit.description,
          xp_reward: habit.xp_reward,
          isClickable: isClickable
        });
      } else {
        // For non-daily habits, only show if completed on this date
        if (habit.completed_dates.includes(dateStr)) {
          virtualEvents.push({
            id: `habit-${habit.id}-${dateStr}`,
            title: habit.title,
            date: dateStr,
            startTime: '09:00',
            endTime: '09:30',
            color: habit.color,
            completed: true,
            source: 'habit',
            habitId: habit.id,
            description: habit.description,
            xp_reward: habit.xp_reward,
            isClickable: isClickable
          });
        }
      }
    });

    return virtualEvents;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    
    // Get real events from database
    const realEvents = events.filter(event => event.date === dateStr);
    
    // Get virtual habit events for this date
    const virtualHabitEvents = getVirtualHabitEvents(date);
    
    // Combine real events with virtual habit events
    return [...realEvents, ...virtualHabitEvents];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePrevDay = () => {
    const newDay = new Date(selectedDay);
    newDay.setDate(newDay.getDate() - 1);
    setSelectedDay(newDay);
  };

  const handleNextDay = () => {
    const newDay = new Date(selectedDay);
    newDay.setDate(newDay.getDate() + 1);
    setSelectedDay(newDay);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setView('day');
  };

  const toggleEventCompletion = async (eventId) => {
    console.log('🎯 toggleEventCompletion called with:', eventId);
    if (!user) {
      console.log('❌ No user found');
      return;
    }
    
    // Parse the event ID to get habit info (format: habit-{habitId}-{date})
    if (eventId.startsWith('habit-')) {
      // Remove 'habit-' prefix and split by the last occurrence of '-'
      const withoutPrefix = eventId.substring(6); // Remove 'habit-'
      const lastDashIndex = withoutPrefix.lastIndexOf('-');
      const habitId = withoutPrefix.substring(0, lastDashIndex);
      const dateString = withoutPrefix.substring(lastDashIndex + 1);
      
      console.log('📅 Parsed habitId:', habitId, 'dateString:', dateString);
      
      // Check if completion is allowed (current day + 2 days prior)
      const today = new Date();
      const targetDate = new Date(dateString);
      const daysDiff = Math.floor((today - targetDate) / (1000 * 60 * 60 * 24));
      
      console.log('📊 Days difference:', daysDiff);
      
      if (daysDiff > 2) {
        alert('You can only complete habits for today and up to 2 days prior.');
        return;
      }
      
      if (daysDiff < 0) {
        alert('You cannot complete habits for future dates.');
        return;
      }
      
      try {
        console.log('🚀 Calling masteryService.completeHabit with:', user.id, habitId);
        const { data: completion, error } = await masteryService.completeHabit(user.id, habitId);
        console.log('✅ Completion result:', completion, error);
        if (error) throw error;

        // Update the specific habit in our habits state (virtual calendar approach)
        setHabits(prevHabits => 
          prevHabits.map(habit => {
            if (habit.id === habitId) {
              const updatedCompletedDates = [...habit.completed_dates];
              
              // Add completion date if not already present
              if (!updatedCompletedDates.includes(dateString)) {
                updatedCompletedDates.push(dateString);
              }
              
              return {
                ...habit,
                completed_dates: updatedCompletedDates,
                completed_today: updatedCompletedDates.includes(new Date().toISOString().split('T')[0]),
                streak: (habit.streak || 0) + 1
              };
            }
            return habit;
          })
        );
        
        // Trigger refresh to update other tabs
        triggerRefresh();
      } catch (error) {
        console.error('Error completing habit:', error);
        setError(error.message);
      }
    } else {
      // Handle regular events (find in events array)
      const event = events.find(e => e.id === eventId);
      if (event) {
        setEvents(events.map(e => 
          e.id === eventId ? { ...e, completed: !e.completed } : e
        ));
      }
    }
  };

  const deleteEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (event.source === 'habit') {
      // For habits, we don't delete the event, we just mark it as incomplete
      toggleEventCompletion(eventId);
    } else {
      // For regular events, delete them
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  // Add habit completion for today
  const addHabitCompletion = async (habitId, date) => {
    if (!user) return;
    
    try {
      const { data: completion, error } = await masteryService.completeHabit(user.id, habitId);
      if (error) throw error;

      // Update the specific habit in our habits state (virtual calendar approach)
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          if (habit.id === habitId) {
            const todayString = new Date().toISOString().split('T')[0];
            const updatedCompletedDates = [...habit.completed_dates];
            
            // Add today's completion if not already present
            if (!updatedCompletedDates.includes(todayString)) {
              updatedCompletedDates.push(todayString);
            }
            
            return {
              ...habit,
              completed_dates: updatedCompletedDates,
              completed_today: true,
              streak: (habit.streak || 0) + 1
            };
          }
          return habit;
        })
      );
      
      // Trigger refresh to update other tabs
      triggerRefresh();
    } catch (error) {
      console.error('Error completing habit:', error);
      setError(error.message);
    }
  };


  const formatTime = (startTime, endTime) => {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    };
    
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  };


  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const days = getDaysInMonth(currentDate);
  const totalEvents = events.length;
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const selectedDayEvents = getEventsForDate(selectedDay);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={
                view === 'month' ? handlePrevMonth : 
                view === 'week' ? handlePrevWeek : 
                handlePrevDay
              }
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={
                view === 'month' ? handleNextMonth : 
                view === 'week' ? handleNextWeek : 
                handleNextDay
              }
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {view === 'month' 
                ? `${currentMonth} ${currentYear}`
                : view === 'week'
                ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : `${selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
              }
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {view === 'month' ? `${totalEvents} events` : 
               view === 'week' ? `${getWeekDays(currentDate).map(day => getEventsForDate(day)).flat().length} events` :
               `${selectedDayEvents.length} events`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'month' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 size={16} />
              <span>Month</span>
            </button>
            <button
              onClick={() => setView('week')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'week' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon size={16} />
              <span>Week</span>
            </button>
            <button
              onClick={() => setView('day')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'day' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock size={16} />
              <span>Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6">
        {/* Calendar Content */}
        <div className="flex-1">

          {/* Calendar Content */}
          {view === 'month' ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {dayNames.map(day => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isCurrentMonth = day && day.getMonth() === currentDate.getMonth();
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 cursor-pointer ${
                    !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800 text-gray-400' : ''
                  } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <div
                            key={event.id}
                            className="p-2 rounded text-xs cursor-pointer transition-colors relative group"
                            style={{
                              backgroundColor: event.completed ? `${event.color}40` : event.color,
                              borderLeft: `3px solid ${event.color}`
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center space-x-1">
                              {event.source === 'habit' && (
                                <Target size={10} className="text-white/80" />
                              )}
                              <div className={`font-medium truncate ${
                                event.completed 
                                  ? 'text-white line-through' 
                                  : 'text-white'
                              }`}>
                                {event.title}
                              </div>
                            </div>
                            <div className="text-xs text-white/80">
                              {event.source === 'habit' ? `+${event.xp_reward} XP` : formatTime(event.startTime, event.endTime)}
                            </div>
                            
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('🖱️ Completion button clicked for event:', event.id, 'isClickable:', event.isClickable);
                                  if (event.isClickable !== false) {
                                    toggleEventCompletion(event.id);
                                  } else {
                                    console.log('❌ Event not clickable');
                                  }
                                }}
                                className={`p-1 rounded text-xs ${
                                  event.isClickable === false
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : event.completed 
                                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                      : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                                title={
                                  event.isClickable === false
                                    ? 'Cannot complete - too far in the past'
                                    : event.completed 
                                      ? 'Mark as incomplete' 
                                      : 'Mark as complete'
                                }
                                disabled={event.isClickable === false}
                              >
                                <CheckCircle size={12} />
                              </button>
                              {event.source !== 'habit' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteEvent(event.id);
                                  }}
                                  className="p-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs"
                                  title="Delete event"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Add habit completion for today */}
                        {day && day.toDateString() === new Date().toDateString() && (
                          <div className="mt-2">
                            {habits.filter(habit => {
                              const today = new Date().toISOString().split('T')[0];
                              return !habit.completed_dates.includes(today);
                            }).map(habit => (
                              <button
                                key={habit.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addHabitCompletion(habit.id, day.toISOString().split('T')[0]);
                                }}
                                className="w-full p-1 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
                              >
                                <Target size={10} />
                                <span>+ {habit.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : view === 'week' ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {getWeekDays(currentDate).map((day, index) => (
              <div key={index} className="p-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {dayNames[index]}
                </div>
                <div className={`text-lg font-semibold ${
                  day.toDateString() === new Date().toDateString() 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 min-h-[400px]">
            {getWeekDays(currentDate).map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 ${
                    isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className="p-2 rounded text-xs cursor-pointer transition-colors relative group"
                        style={{
                          backgroundColor: event.completed ? `${event.color}40` : event.color,
                          borderLeft: `3px solid ${event.color}`
                        }}
                        onClick={() => event.source !== 'habit' && console.log('Edit event:', event)}
                      >
                        <div className="flex items-center space-x-1">
                          {event.source === 'habit' && (
                            <Target size={10} className="text-white/80" />
                          )}
                          <div className={`font-medium truncate ${
                            event.completed 
                              ? 'text-white line-through' 
                              : 'text-white'
                          }`}>
                            {event.title}
                          </div>
                        </div>
                        <div className="text-xs text-white/80">
                          {event.source === 'habit' ? `+${event.xp_reward} XP` : formatTime(event.startTime, event.endTime)}
                        </div>
                        
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleEventCompletion(event.id);
                            }}
                            className={`p-1 rounded text-xs ${
                              event.completed 
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            title={event.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            <CheckCircle size={12} />
                          </button>
                          {event.source !== 'habit' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEvent(event.id);
                              }}
                              className="p-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs"
                              title="Delete event"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add habit completion for today */}
                    {day.toDateString() === new Date().toDateString() && (
                      <div className="mt-2">
                        {habits.filter(habit => {
                          const today = new Date().toISOString().split('T')[0];
                          return !habit.completed_dates.includes(today);
                        }).map(habit => (
                          <button
                            key={habit.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              addHabitCompletion(habit.id, day.toISOString().split('T')[0]);
                            }}
                            className="w-full p-1 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
                          >
                            <Target size={10} />
                            <span>+ {habit.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevDay}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextDay}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          
          {/* Hourly Grid Day View */}
          <div className="flex">
            {/* Time Column */}
            <div className="w-20 border-r border-gray-200 dark:border-gray-700">
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i;
                const timeString = hour === 0 ? '12 AM' : 
                                 hour < 12 ? `${hour} AM` : 
                                 hour === 12 ? '12 PM' : 
                                 `${hour - 12} PM`;
                return (
                  <div key={hour} className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-start justify-end pr-2 pt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{timeString}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Events Column */}
            <div className="flex-1 relative">
              {/* Hour Lines */}
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="h-16 border-b border-gray-100 dark:border-gray-800"></div>
              ))}
              
              {/* Events positioned by time */}
              {selectedDayEvents.map(event => {
                const [startHour, startMinute] = event.startTime.split(':').map(Number);
                const [endHour, endMinute] = event.endTime.split(':').map(Number);
                
                const startMinutes = startHour * 60 + startMinute;
                const endMinutes = endHour * 60 + endMinute;
                const duration = endMinutes - startMinutes;
                
                const topPosition = (startMinutes / 60) * 64; // 64px per hour
                const height = (duration / 60) * 64;
                
                return (
                  <div
                    key={event.id}
                    className="absolute left-2 right-2 rounded-md border-l-4 p-2 cursor-pointer transition-colors group"
                    style={{
                      top: `${topPosition}px`,
                      height: `${height}px`,
                      backgroundColor: event.completed ? `${event.color}20` : `${event.color}10`,
                      borderLeftColor: event.color,
                      minHeight: '32px'
                    }}
                    onClick={() => event.source !== 'habit' && console.log('Edit event:', event)}
                  >
                    <div className="flex items-start justify-between h-full">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          {event.source === 'habit' && (
                            <Target size={12} className="text-gray-600 dark:text-gray-400" />
                          )}
                          <div className={`font-medium text-sm truncate ${
                            event.completed 
                              ? 'text-gray-600 dark:text-gray-400 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {event.title}
                          </div>
                        </div>
                        <div className={`text-xs ${
                          event.completed 
                            ? 'text-gray-500 dark:text-gray-500' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {event.source === 'habit' ? `+${event.xp_reward} XP` : formatTime(event.startTime, event.endTime)}
                        </div>
                        {height > 40 && event.description && (
                          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
                            {event.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Action buttons - appear on hover */}
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {event.source !== 'habit' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Edit event:', event);
                            }}
                            className="p-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"
                            title="Edit event"
                          >
                            <Edit3 size={12} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEventCompletion(event.id);
                          }}
                          className={`p-1 rounded text-xs ${
                            event.completed 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                          title={event.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <CheckCircle size={12} />
                        </button>
                        {event.source !== 'habit' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEvent(event.id);
                            }}
                            className="p-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs"
                            title="Delete event"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Add habit completion for today */}
              {selectedDay.toDateString() === new Date().toDateString() && (
                <div className="absolute left-2 right-2 top-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Complete habits for today:</div>
                  <div className="space-y-1">
                    {habits.filter(habit => {
                      const today = new Date().toISOString().split('T')[0];
                      return !habit.completed_dates.includes(today);
                    }).map(habit => (
                      <button
                        key={habit.id}
                        onClick={() => addHabitCompletion(habit.id, selectedDay.toISOString().split('T')[0])}
                        className="w-full p-1 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center space-x-1"
                      >
                        <Target size={10} />
                        <span>+ {habit.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
              <span className="text-gray-600 dark:text-gray-300">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
              <span className="text-gray-600 dark:text-gray-300">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-50 dark:bg-blue-900/20 rounded"></div>
              <span className="text-gray-600 dark:text-gray-300">Today</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          {/* Mini Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex space-x-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            {/* Mini Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 p-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => {
                const isToday = day && day.toDateString() === new Date().toDateString();
                const isSelected = day && day.toDateString() === selectedDay.toDateString();
                const hasEvents = day && getEventsForDate(day).length > 0;
                
                return (
                  <button
                    key={index}
                    onClick={() => day && handleDayClick(day)}
                    className={`text-sm p-1 rounded transition-colors ${
                      !day 
                        ? 'text-gray-300 dark:text-gray-600' 
                        : isSelected
                        ? 'bg-blue-600 text-white'
                        : isToday
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : hasEvents
                        ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {day ? day.getDate() : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Events</h3>
            <div className="space-y-2">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(event => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => event.source !== 'habit' && console.log('Edit event:', event)}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: event.color }}
                      ></div>
                      {event.source === 'habit' && (
                        <Target size={12} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        event.completed 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {event.source === 'habit' ? `+${event.xp_reward} XP` : formatTime(event.startTime, event.endTime)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No events today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CalendarTab;