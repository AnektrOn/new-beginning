// SOLUTION 2: React.cloneElement with Direct Props
// Replace the Icon component in AppShellMobile.jsx with this:
// Make sure to import React at the top: import React from 'react';

{React.cloneElement(
  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />,
  {
    stroke: isActive ? activeColor : inactiveColor,
    color: isActive ? activeColor : inactiveColor,
    fill: 'none',
    className: 'mobile-nav-icon transition-all duration-200',
    style: {
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
      filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
    }
  }
)}

