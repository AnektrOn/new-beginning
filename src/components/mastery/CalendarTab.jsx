import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Trash2 } from 'lucide-react';
const CalendarTab = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getYear() + 1900;

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get events for a specific date
  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.event_date === dateStr);
  };

  // Toggle event completion
  const toggleEventCompletion = async (eventId, isCompleted) => {
    try {
      // TODO: Implement API call to update event completion
      console.log('Toggle event completion:', eventId, !isCompleted);
      
      // Update local state
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, is_completed: !isCompleted }
          : event
      ));
    } catch (error) {
      console.error('Error toggling event completion:', error);
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      // TODO: Implement API call to delete event
      console.log('Delete event:', eventId);
      
      // Update local state
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Load events (placeholder for now)
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        // TODO: Implement API call to fetch events
        // For now, using mock data
        const mockEvents = [
          {
            id: '1',
            title: 'Morning Workout',
            event_date: '2024-01-15',
            event_time: '07:00',
            is_completed: false,
            xp_reward: 10
          },
          {
            id: '2',
            title: 'Daily Reading',
            event_date: '2024-01-15',
            event_time: '20:00',
            is_completed: true,
            xp_reward: 10
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [currentMonth, currentYear]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="glass-icon-btn"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNextMonth}
              className="glass-icon-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day === new Date().getDate() && 
                           currentMonth === new Date().getMonth() && 
                           currentYear === new Date().getFullYear();
            
            return (
              <div
                key={index}
                className={`glass-calendar-day ${isToday ? 'glass-calendar-day-today' : ''}`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                    <span className="text-sm font-medium">{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={`w-2 h-2 rounded-full ${
                              event.is_completed ? 'bg-green-400' : 'bg-orange-400'
                            }`}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${dayEvents.length - 3} more`} />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Events for {monthNames[currentMonth]} {selectedDate}, {currentYear}
          </h3>
          
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No events scheduled for this date.</p>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="glass-event-item">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleEventCompletion(event.id, event.is_completed)}
                        className="glass-completion-btn"
                      >
                        {event.is_completed ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : (
                          <Circle size={20} className="text-gray-400" />
                        )}
                      </button>
                      <div>
                        <h4 className={`font-medium ${event.is_completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {event.title}
                        </h4>
                        {event.event_time && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.event_time}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        +{event.xp_reward} XP
                      </span>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="glass-delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarTab;
