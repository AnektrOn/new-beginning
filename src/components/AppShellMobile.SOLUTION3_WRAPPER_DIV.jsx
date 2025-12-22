// SOLUTION 3: Wrapper Div with Color Inheritance
// Replace the Icon component in AppShellMobile.jsx with this:

<div 
  className="mobile-icon-wrapper"
  style={{
    color: isActive ? activeColor : inactiveColor,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
    transition: 'all 0.2s',
  }}
>
  <Icon 
    size={22} 
    strokeWidth={isActive ? 2.5 : 2}
    className="mobile-nav-icon"
  />
</div>

// Add to mobile-responsive.css:
.mobile-icon-wrapper {
  color: inherit;
}

.mobile-icon-wrapper svg {
  stroke: currentColor !important;
  fill: none !important;
}

.mobile-icon-wrapper svg path,
.mobile-icon-wrapper svg line,
.mobile-icon-wrapper svg circle,
.mobile-icon-wrapper svg polyline,
.mobile-icon-wrapper svg polygon {
  stroke: currentColor !important;
  fill: none !important;
}

