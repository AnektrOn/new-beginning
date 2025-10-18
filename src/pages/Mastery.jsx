import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Target, Wrench, Clock } from 'lucide-react';

// Import components
import CalendarTab from '../components/mastery/CalendarTab';
import HabitsTab from '../components/mastery/HabitsTab';
import ToolboxTab from '../components/mastery/ToolboxTab';

// Create a context for sharing refresh state
const MasteryRefreshContext = createContext();

export const useMasteryRefresh = () => {
  const context = useContext(MasteryRefreshContext);
  if (!context) {
    throw new Error('useMasteryRefresh must be used within MasteryRefreshProvider');
  }
  return context;
};

const Mastery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[currentTime.getDay()]}, ${months[currentTime.getMonth()]} ${currentTime.getDate()}`;
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/mastery/calendar' },
    { id: 'habits', label: 'Habits', icon: Target, path: '/mastery/habits' },
    { id: 'toolbox', label: 'Toolbox', icon: Wrench, path: '/mastery/toolbox' }
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🛠️ Mastery Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Build lasting habits, track your progress, and access powerful learning tools
        </p>
      </div>
      
      {/* Sticky Tab Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 -mx-8 px-8 py-4 mb-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Current Time Display */}
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Clock size={18} />
            <div className="text-sm">
              <div className="font-semibold">{formatTime()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate()}</div>
            </div>
          </div>
          
          {/* Centered Tab Navigation */}
          <nav className="flex space-x-1 glass-tab-navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path || (tab.path === '/mastery/calendar' && location.pathname === '/mastery');
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`glass-tab-btn ${isActive ? 'glass-tab-btn-active' : ''}`}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          
          {/* Spacer for balance (same width as time display) */}
          <div className="w-32"></div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="glass-tab-content">
        <MasteryRefreshContext.Provider value={{ triggerRefresh, refreshKey }}>
          {(() => {
            if (location.pathname === '/mastery' || location.pathname === '/mastery/calendar') {
              return <CalendarTab key={`calendar-${refreshKey}`} />;
            } else if (location.pathname === '/mastery/habits') {
              return <HabitsTab key={`habits-${refreshKey}`} />;
            } else if (location.pathname === '/mastery/toolbox') {
              return <ToolboxTab key={`toolbox-${refreshKey}`} />;
            } else {
              return <CalendarTab key={`calendar-${refreshKey}`} />;
            }
          })()}
        </MasteryRefreshContext.Provider>
      </div>
    </div>
  );
};

export default Mastery;