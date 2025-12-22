// SOLUTION 4: useRef + useEffect Direct DOM Manipulation
// Add this import at the top: import React, { useState, useRef, useEffect } from 'react';
// Replace the Icon component section in AppShellMobile.jsx with this:

// Inside the map function, before return:
const iconRef = useRef(null);

useEffect(() => {
  if (iconRef.current) {
    const svg = iconRef.current.querySelector('svg');
    if (svg) {
      const targetColor = isActive ? activeColor : inactiveColor;
      
      // Set on SVG element
      svg.setAttribute('stroke', targetColor);
      svg.style.stroke = targetColor;
      svg.style.color = targetColor;
      
      // Set on all paths and child elements
      const paths = svg.querySelectorAll('path, line, circle, polyline, polygon');
      paths.forEach(el => {
        el.setAttribute('stroke', targetColor);
        el.style.stroke = targetColor;
        el.setAttribute('fill', 'none');
        el.style.fill = 'none';
      });
    }
  }
}, [isActive, activeColor, inactiveColor]);

// In JSX:
<div 
  ref={iconRef}
  className="transition-all duration-200 mobile-nav-icon"
  style={{
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
  }}
>
  <Icon 
    size={22} 
    strokeWidth={isActive ? 2.5 : 2}
  />
</div>

