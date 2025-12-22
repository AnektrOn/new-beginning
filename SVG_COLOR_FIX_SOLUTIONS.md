# 5 Solutions for SVG Color Application in Mobile Navigation

## Solution 1: CSS Custom Properties (CSS Variables)
**Approach**: Use CSS variables set on the button, inherited by SVG

```jsx
// In AppShellMobile.jsx - Replace Icon component
<button
  style={{
    '--icon-color': isActive ? activeColor : inactiveColor,
    '--icon-stroke': isActive ? activeColor : inactiveColor,
  }}
>
  <Icon 
    size={22} 
    strokeWidth={isActive ? 2.5 : 2}
    className="mobile-nav-icon"
    style={{
      stroke: 'var(--icon-stroke)',
      color: 'var(--icon-color)',
    }}
  />
</button>
```

```css
/* In mobile-responsive.css */
.mobile-nav-button {
  --icon-color: inherit;
  --icon-stroke: inherit;
}

.mobile-nav-button svg,
.mobile-nav-icon {
  stroke: var(--icon-stroke) !important;
  color: var(--icon-color) !important;
  fill: none !important;
}
```

---

## Solution 2: React.cloneElement with Direct Props
**Approach**: Clone the icon element and inject color props directly

```jsx
// In AppShellMobile.jsx - Replace Icon component
{React.cloneElement(
  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />,
  {
    stroke: isActive ? activeColor : inactiveColor,
    color: isActive ? activeColor : inactiveColor,
    fill: 'none',
    className: 'mobile-nav-icon',
    style: {
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
    }
  }
)}
```

---

## Solution 3: Wrapper Div with Color Inheritance
**Approach**: Wrap icon in colored div, let SVG inherit

```jsx
// In AppShellMobile.jsx - Replace Icon component
<div 
  className="mobile-icon-wrapper"
  style={{
    color: isActive ? activeColor : inactiveColor,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Icon 
    size={22} 
    strokeWidth={isActive ? 2.5 : 2}
    className="mobile-nav-icon"
    style={{
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
    }}
  />
</div>
```

```css
/* In mobile-responsive.css */
.mobile-icon-wrapper {
  color: inherit;
}

.mobile-icon-wrapper svg {
  stroke: currentColor !important;
  fill: none !important;
}
```

---

## Solution 4: useRef + useEffect Direct DOM Manipulation
**Approach**: Use refs to directly manipulate SVG DOM attributes

```jsx
// In AppShellMobile.jsx
const iconRef = useRef(null);

useEffect(() => {
  if (iconRef.current) {
    const svg = iconRef.current.querySelector('svg');
    if (svg) {
      svg.setAttribute('stroke', isActive ? activeColor : inactiveColor);
      svg.style.stroke = isActive ? activeColor : inactiveColor;
      
      // Set on all paths
      const paths = svg.querySelectorAll('path, line, circle, polyline, polygon');
      paths.forEach(el => {
        el.setAttribute('stroke', isActive ? activeColor : inactiveColor);
        el.style.stroke = isActive ? activeColor : inactiveColor;
        el.setAttribute('fill', 'none');
      });
    }
  }
}, [isActive, activeColor, inactiveColor]);

// In JSX
<div ref={iconRef}>
  <Icon 
    size={22} 
    strokeWidth={isActive ? 2.5 : 2}
    className="mobile-nav-icon"
  />
</div>
```

---

## Solution 5: Custom Icon Wrapper Component
**Approach**: Create a dedicated component that forces color application

```jsx
// Create new file: src/components/common/ColoredIcon.jsx
import React, { useRef, useEffect } from 'react';

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
    if (iconRef.current && color) {
      const svg = iconRef.current.querySelector('svg');
      if (svg) {
        // Set on SVG element
        svg.setAttribute('stroke', color);
        svg.style.stroke = color;
        svg.style.color = color;
        
        // Force on all child elements
        const allElements = svg.querySelectorAll('*');
        allElements.forEach(el => {
          el.setAttribute('stroke', color);
          el.style.stroke = color;
          if (el.tagName !== 'path') {
            el.setAttribute('fill', 'none');
          }
        });
      }
    }
  }, [color]);

  return (
    <div 
      ref={iconRef}
      className={className}
      style={style}
    >
      <Icon 
        size={size} 
        strokeWidth={strokeWidth}
        stroke={color}
        color={color}
      />
    </div>
  );
};

export default ColoredIcon;
```

```jsx
// In AppShellMobile.jsx - Import and use
import ColoredIcon from './common/ColoredIcon';

// Replace Icon component with:
<ColoredIcon
  Icon={Icon}
  size={22}
  strokeWidth={isActive ? 2.5 : 2}
  color={isActive ? activeColor : inactiveColor}
  isActive={isActive}
  className="mobile-nav-icon transition-all duration-200"
  style={{
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
  }}
/>
```

---

## Recommendation Order:
1. **Solution 5** (Custom Component) - Most reliable, reusable
2. **Solution 1** (CSS Variables) - Clean, maintainable
3. **Solution 3** (Wrapper Div) - Simple, effective
4. **Solution 4** (DOM Manipulation) - Most control, but more complex
5. **Solution 2** (cloneElement) - React-native, but may have issues with lucide-react

