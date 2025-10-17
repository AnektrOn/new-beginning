import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Target, Wrench } from 'lucide-react';

// Import components (we'll create these next)
import CalendarTab from '../components/mastery/CalendarTab';
import HabitsTab from '../components/mastery/HabitsTab';
import ToolboxTab from '../components/mastery/ToolboxTab';

const Mastery = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

      {/* Tab Navigation */}
      <div className="glass-tab-navigation mb-8">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
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
      </div>

      {/* Tab Content */}
      <div className="glass-tab-content">
        <Routes>
          <Route path="/" element={<CalendarTab />} />
          <Route path="/calendar" element={<CalendarTab />} />
          <Route path="/habits" element={<HabitsTab />} />
          <Route path="/toolbox" element={<ToolboxTab />} />
        </Routes>
      </div>
    </div>
  );
};

export default Mastery;
