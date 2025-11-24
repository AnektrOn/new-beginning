import React, { useRef, useEffect } from 'react';

/**
 * ColoredIcon - Global SVG Icon Color Fix Component
 * 
 * This component ensures SVG colors are properly applied across the entire application.
 * It handles hardcoded stroke attributes in lucide-react icons by:
 * 1. Setting stroke prop directly
 * 2. Using refs to manipulate DOM directly
 * 3. Removing hardcoded stroke attributes and replacing them
 * 4. Applying styles to all SVG child elements with !important
 * 
 * Usage:
 * <ColoredIcon Icon={Home} size={22} color="#B4833D" />
 */
const ColoredIcon = ({ 
  Icon, 
  size = 22, 
  strokeWidth = 2, 
  color, 
  isActive = false,
  className = '',
  style = {}
}) => {
  const iconRef = useRef(null);

  useEffect(() => {
    if (iconRef.current) {
      const svg = iconRef.current.querySelector('svg');
      if (svg) {
        // If color is provided, use it; otherwise let CSS handle it
        const targetColor = color || 'currentColor';
        
        // Set on SVG element
        svg.setAttribute('stroke', targetColor);
        svg.style.setProperty('stroke', targetColor, 'important');
        svg.style.setProperty('color', targetColor, 'important');
        
        // CRITICAL: Remove hardcoded stroke attributes and force new color
        // Target all possible SVG elements
        const allElements = svg.querySelectorAll('path, line, circle, polyline, polygon, rect, ellipse');
        allElements.forEach(el => {
          // Remove hardcoded stroke attribute (like stroke="#1C274C")
          el.removeAttribute('stroke');
          // Set new stroke via attribute
          el.setAttribute('stroke', targetColor);
          // Force via style with !important
          el.style.setProperty('stroke', targetColor, 'important');
          el.style.setProperty('fill', 'none', 'important');
          // Also set fill attribute
          el.setAttribute('fill', 'none');
        });
      }
    }
  }, [color]);

  return (
    <div 
      ref={iconRef}
      className={className}
      style={{
        color: color || 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <Icon 
        size={size} 
        strokeWidth={strokeWidth}
        stroke={color || 'currentColor'}
        color={color || 'currentColor'}
      />
    </div>
  );
};

export default ColoredIcon;

