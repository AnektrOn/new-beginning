import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Grid3X3, 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  Sun, 
  Moon,
  Upload,
  Plus,
  Square,
  ArrowLeft,
  ArrowRight,
  Type,
  Users,
  Target,
  Home,
  LogOut,
  BookOpen,
  Bell
} from 'lucide-react';
import SearchBar from './common/SearchBar';
import NotificationCenter from './common/NotificationCenter';
import ColoredIcon from './common/ColoredIcon';

const AppShellMobile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const sidebarItems = [
    { icon: Grid3X3, label: 'Dashboard', path: '/dashboard' },
    { icon: Target, label: 'Mastery', path: '/mastery' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Target, label: 'Mastery', path: '/mastery' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`} style={{ position: 'relative' }}>
      {/* Background - User's custom background or default */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: profile?.background_image 
            ? `url(${profile.background_image})` 
            : `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><filter id="blur"><feGaussianBlur stdDeviation="8"/></filter></defs><rect width="1200" height="800" fill="%23f5f3f0"/><rect x="0" y="0" width="400" height="800" fill="%23e8e4d8"/><rect x="400" y="200" width="200" height="400" fill="%23d4c4a8"/><rect x="600" y="100" width="300" height="600" fill="%23c9b99a"/><rect x="900" y="0" width="300" height="800" fill="%23b8a082"/></svg>')`
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>

      {/* Desktop Header - Hidden on mobile, shown on lg+ */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 safe-area-top">
        <div className="glass-header-browser flex items-center justify-between">
          {/* Desktop left navigation */}
          <div className="flex items-center space-x-2">
            <button className="glass-icon-btn focus-ring" aria-label="Dashboard">
              <Grid3X3 size={16} aria-hidden="true" />
            </button>
            <button className="glass-icon-btn focus-ring" aria-label="Go back">
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <button className="glass-icon-btn focus-ring" aria-label="Go forward">
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button className="glass-icon-btn focus-ring" aria-label="Search">
              <Type size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Center - Search */}
          <div className="flex-1 flex items-center justify-center px-2 max-w-2xl mx-auto">
            <SearchBar variant="compact" placeholder="Search courses..." />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <NotificationCenter />
            <button 
              onClick={toggleTheme}
              className="glass-icon-btn focus-ring"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <button className="glass-icon-btn focus-ring" aria-label="Upload">
              <Upload size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar - Only show on large screens */}
      <aside className="hidden lg:block fixed left-4 top-20 bottom-4 z-40 w-24">
        <div className="glass-sidebar-panel">
          {/* Top section - Toggle and active indicator */}
          <div className="flex flex-col items-center pt-6 pb-4">
            {/* Toggle button */}
            <div className="glass-toggle-btn mb-4">
              <div className="w-4 h-3 bg-orange-400 rounded-sm"></div>
              <div className="flex space-x-1 mt-1">
                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Active dashboard icon */}
            <button className="glass-nav-btn-active mb-6">
              <Grid3X3 size={20} />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 flex flex-col items-center space-y-4">
            {sidebarItems.slice(1).map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                               (item.path === '/mastery' && location.pathname.startsWith('/mastery')) ||
                               (item.path === '/courses' && location.pathname.startsWith('/courses'));
              
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`glass-nav-btn focus-ring ${isActive ? 'glass-nav-btn-active' : ''}`}
                  title={item.label}
                >
                  <Icon size={20} aria-hidden="true" />
                </button>
              );
            })}
          </nav>

          {/* Theme toggle - Circular switch */}
          <div className="flex flex-col items-center pb-6">
            <div className="glass-theme-toggle">
              <button 
                onClick={toggleTheme}
                className={`glass-theme-btn ${!isDarkMode ? 'glass-theme-btn-active' : ''}`}
                title="Light mode"
              >
                <Sun size={14} />
              </button>
              <button 
                onClick={toggleTheme}
                className={`glass-theme-btn ${isDarkMode ? 'glass-theme-btn-active' : ''}`}
                title="Dark mode"
              >
                <Moon size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>


      {/* Main Content Area */}
      <main 
        id="main-content"
        role="main"
        className="fixed lg:left-32 left-0 top-0 lg:top-20 right-0 bottom-[72px] lg:bottom-4 z-30 lg:right-4"
        style={{ 
          paddingBottom: 'calc(72px + env(safe-area-inset-bottom))',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="glass-main-panel h-full overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation - Optimized UX/UI */}
      <nav 
        id="main-navigation"
        role="navigation"
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 w-full z-[9999] lg:hidden mobile-bottom-nav"
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          paddingBottom: 'env(safe-area-inset-bottom)',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          pointerEvents: 'auto'
        }}
      >
        <div 
          className="w-full backdrop-blur-xl border-t mobile-bottom-nav-container"
          style={{
            backgroundColor: isDarkMode 
              ? '#203837'  /* Dark theme: Dark teal - palette-dark-surface */
              : '#F7F1E1', /* Light theme: Old lace - palette-light-bg */
            borderColor: isDarkMode
              ? '#5A8F76'  /* Dark theme: Medium green - palette-dark-primary */
              : '#81754B',  /* Light theme: Coyote - palette-light-border */
            borderTopWidth: '1px',
            boxShadow: isDarkMode
              ? '0 -4px 20px rgba(8, 24, 24, 0.4)'
              : '0 -4px 20px rgba(63, 63, 44, 0.15)'
          }}
        >
          <div className="flex items-center justify-around w-full px-2 py-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                               (item.path === '/mastery' && location.pathname.startsWith('/mastery')) ||
                               (item.path === '/courses' && location.pathname.startsWith('/courses'));
              
              // Color palette mapping - Following palette system
              // Dark theme: Active = Light green (#96CDB0), Inactive = Medium green (#5A8F76)
              // Light theme: Active = Dark goldenrod (#B4833D), Inactive = Coyote (#81754B)
              const activeColor = isDarkMode 
                ? '#96CDB0'  // Light green - palette-dark-secondary
                : '#B4833D'; // Dark goldenrod - palette-light-accent
              const inactiveColor = isDarkMode 
                ? '#5A8F76'  // Medium green - palette-dark-primary
                : '#81754B';  // Coyote - palette-light-border
              const activeBg = isDarkMode 
                ? 'rgba(90, 143, 118, 0.2)'      // Medium green with opacity (dark) - more visible
                : 'rgba(180, 131, 61, 0.2)';     // Dark goldenrod with opacity (light) - more visible
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  className="mobile-nav-button relative flex-1 flex flex-col items-center justify-center min-h-[56px] py-2 px-1 rounded-xl transition-all duration-200 focus-ring touch-manipulation"
                  style={{
                    color: isActive ? activeColor : inactiveColor,
                    backgroundColor: isActive ? activeBg : 'transparent',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                  data-active={isActive}
                  data-theme={isDarkMode ? 'dark' : 'light'}
                  onTouchStart={(e) => {
                    const target = e.currentTarget;
                    if (target) {
                      target.style.transform = 'scale(0.95)';
                      target.style.opacity = '0.8';
                    }
                  }}
                  onTouchEnd={(e) => {
                    const target = e.currentTarget;
                    if (target) {
                      setTimeout(() => {
                        if (target && target.style) {
                          target.style.transform = '';
                          target.style.opacity = '';
                        }
                      }, 150);
                    }
                  }}
                >
                  {/* Solution 5: Custom ColoredIcon Component */}
                  <ColoredIcon
                    Icon={Icon}
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    color={isActive ? activeColor : inactiveColor}
                    isActive={isActive}
                    className="transition-all duration-200 mobile-nav-icon"
                    style={{
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
                    }}
                  />
                  {/* Active indicator - Underline bar instead of dot */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-200"
                    style={{
                      width: isActive ? '60%' : '0%',
                      height: '3px',
                      backgroundColor: activeColor,
                      borderRadius: '3px 3px 0 0',
                      opacity: isActive ? 1 : 0
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppShellMobile;

