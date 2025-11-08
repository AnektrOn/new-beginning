import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Target, Wrench, Clock } from 'lucide-react';

// Import components
import CalendarTab from '../components/mastery/CalendarTab';
import CalendarTabMobile from '../components/mastery/CalendarTabMobile';
import HabitsTabCompact from '../components/mastery/HabitsTabCompact';
import HabitsTabMobile from '../components/mastery/HabitsTabMobile';
import ToolboxTabCompact from '../components/mastery/ToolboxTabCompact';
import ToolboxTabMobile from '../components/mastery/ToolboxTabMobile';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="min-h-full w-full pb-safe">
      {/* Mobile-First Header - Clean & Minimal */}
      <div className="mb-6">
        {/* Tab Navigation - Clean Pills */}
        <nav className="flex bg-slate-800/60 backdrop-blur-md rounded-2xl p-1.5 shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || (tab.path === '/mastery/calendar' && location.pathname === '/mastery');
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-semibold transition-all min-h-[48px] ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        <MasteryRefreshContext.Provider value={{ triggerRefresh, refreshKey }}>
          {(() => {
            if (location.pathname === '/mastery' || location.pathname === '/mastery/calendar') {
              return isMobile ? <CalendarTabMobile key={`calendar-${refreshKey}`} /> : <CalendarTab key={`calendar-${refreshKey}`} />;
            } else if (location.pathname === '/mastery/habits') {
              return isMobile ? <HabitsTabMobile key={`habits-${refreshKey}`} /> : <HabitsTabCompact key={`habits-${refreshKey}`} />;
            } else if (location.pathname === '/mastery/toolbox') {
              return isMobile ? <ToolboxTabMobile key={`toolbox-${refreshKey}`} /> : <ToolboxTabCompact key={`toolbox-${refreshKey}`} />;
            } else {
              return isMobile ? <CalendarTabMobile key={`calendar-${refreshKey}`} /> : <CalendarTab key={`calendar-${refreshKey}`} />;
            }
          })()}
        </MasteryRefreshContext.Provider>
      </div>
    </div>
  );
};

export default Mastery;