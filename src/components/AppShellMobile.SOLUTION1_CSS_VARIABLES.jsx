// SOLUTION 1: CSS Custom Properties (CSS Variables)
// Replace the Icon component in AppShellMobile.jsx with this:

<button
  style={{
    '--icon-color': isActive ? activeColor : inactiveColor,
    '--icon-stroke': isActive ? activeColor : inactiveColor,
    color: isActive ? activeColor : inactiveColor,
    backgroundColor: isActive ? activeBg : 'transparent',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  }}
>
  <Icon 
    size={22} 
    strokeWidth={isActive ? 2.5 : 2}
    className="mobile-nav-icon transition-all duration-200"
    style={{
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
      filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
      stroke: 'var(--icon-stroke)',
      color: 'var(--icon-color)',
    }}
  />
</button>

// Add to mobile-responsive.css:
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

