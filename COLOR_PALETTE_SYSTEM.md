# 🎨 Color Palette System

## Overview

The Human Catalyst University now includes a comprehensive color palette system that allows users to choose from multiple themes. The system is fully integrated and provides a seamless way to switch between different color schemes.

## Features

- **8 Pre-built Color Palettes**: Ocean Blue, Forest Green, Sunset Orange, Royal Purple, Ocean Teal, Rose Pink, Dark Mode, and Midnight Blue
- **Persistent Storage**: User's palette choice is saved in localStorage
- **Real-time Switching**: Colors change instantly without page reload
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: High contrast support and keyboard navigation

## File Structure

```
src/
├── config/
│   └── colorPalettes.js          # All color palette definitions
├── utils/
│   └── colorPaletteSwitcher.js   # Core switching logic
└── components/
    └── common/
        ├── ColorPaletteDropdown.js    # UI component
        └── ColorPaletteDropdown.css   # Styling
```

## Usage

### For Users
1. Look for the color palette dropdown in the header (right side)
2. Click on the current theme name to open the dropdown
3. Select your preferred theme from the list
4. The theme will be applied immediately and saved for future visits

### For Developers

#### Switching Palettes Programmatically
```javascript
import colorPaletteSwitcher from './utils/colorPaletteSwitcher';

// Switch to a specific palette
colorPaletteSwitcher.switchTo('forest');

// Get current palette
const currentPalette = colorPaletteSwitcher.getCurrentPalette();

// Reset to default
colorPaletteSwitcher.resetToDefault();
```

#### Listening to Palette Changes
```javascript
document.addEventListener('colorPaletteChanged', (event) => {
  console.log('New palette:', event.detail.paletteKey);
  console.log('Palette data:', event.detail.palette);
});
```

#### Adding New Palettes
Edit `src/config/colorPalettes.js` and add a new palette object:

```javascript
newTheme: {
  name: 'New Theme',
  description: 'Description of the new theme',
  colors: {
    '--color-primary': '#your-color',
    '--color-secondary': '#your-color',
    // ... all other color variables
  }
}
```

## Available Palettes

1. **Ocean Blue** (Default) - Professional blue theme
2. **Forest Green** - Natural green theme  
3. **Sunset Orange** - Warm orange theme
4. **Royal Purple** - Elegant purple theme
5. **Ocean Teal** - Calming teal theme
6. **Rose Pink** - Soft pink theme
7. **Dark Mode** - Dark theme for low light
8. **Midnight Blue** - Deep blue night theme

## CSS Variables

The system uses CSS custom properties (variables) that are dynamically updated:

- `--color-primary` - Main brand color
- `--color-secondary` - Secondary brand color
- `--color-success` - Success states
- `--color-warning` - Warning states
- `--color-error` - Error states
- `--bg-primary` - Main background
- `--bg-secondary` - Secondary background
- `--text-primary` - Primary text color
- `--text-secondary` - Secondary text color

## Integration Points

- **Header Component**: Contains the color palette dropdown
- **App Component**: Initializes the color palette system
- **All Components**: Automatically use the current palette via CSS variables

## Browser Support

- Modern browsers with CSS custom properties support
- localStorage for persistence
- Graceful fallback to default palette if localStorage is unavailable

## Future Enhancements

- Custom palette creation
- Palette sharing between users
- System theme detection (light/dark mode)
- Animation transitions between palettes
- Palette preview in settings
