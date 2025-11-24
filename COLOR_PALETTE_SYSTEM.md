# Color Palette System

## Overview
The application now uses a dual-palette system with separate color schemes for light and dark themes.

## Light Theme Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Old lace** | `#F7F1E1` | Primary background |
| **Bone** | `#E3D8C1` | Secondary background, surfaces |
| **Dark goldenrod** | `#B4833D` | Primary accent, active states |
| **Kobicha** | `#66371B` | Primary text, dark accents |
| **Coyote** | `#81754B` | Borders, secondary text |
| **Earth Green** | `#3F3F2C` | Darkest text, emphasis |

### Light Theme CSS Variables
- `--palette-light-bg`: `#F7F1E1` (Old lace)
- `--palette-light-surface`: `#E3D8C1` (Bone)
- `--palette-light-accent`: `#B4833D` (Dark goldenrod)
- `--palette-light-text`: `#66371B` (Kobicha)
- `--palette-light-border`: `#81754B` (Coyote)
- `--palette-light-dark`: `#3F3F2C` (Earth Green)

## Dark Theme Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Lightest** | `#EEE8B2` | Primary text, light accents |
| **Brown/Orange** | `#C18D52` | Accent, warning states |
| **Darkest** | `#081818` | Primary background |
| **Dark teal** | `#203837` | Secondary background, surfaces |
| **Medium green** | `#5A8F76` | Primary accent, active states |
| **Light green** | `#96CDB0` | Secondary text, borders |

### Dark Theme CSS Variables
- `--palette-dark-bg`: `#081818` (Darkest)
- `--palette-dark-surface`: `#203837` (Dark teal)
- `--palette-dark-accent`: `#C18D52` (Brown/Orange)
- `--palette-dark-text`: `#EEE8B2` (Lightest)
- `--palette-dark-secondary`: `#96CDB0` (Light green)
- `--palette-dark-primary`: `#5A8F76` (Medium green)

## Semantic Color Mapping

### Light Theme
- **Primary**: Dark goldenrod (`#B4833D`)
- **Secondary**: Bone (`#E3D8C1`)
- **Success**: Earth Green (`#3F3F2C`)
- **Warning**: Dark goldenrod (`#B4833D`)
- **Error**: Dark goldenrod (`#B4833D`)
- **Info**: Coyote (`#81754B`)

### Dark Theme
- **Primary**: Medium green (`#5A8F76`)
- **Secondary**: Dark teal (`#203837`)
- **Success**: Medium green (`#5A8F76`)
- **Warning**: Brown/Orange (`#C18D52`)
- **Error**: Brown/Orange (`#C18D52`)
- **Info**: Light green (`#96CDB0`)

## Bottom Navigation Colors

### Light Theme
- **Background**: `rgba(247, 241, 225, 0.95)` (Old lace with opacity)
- **Border**: `rgba(129, 117, 75, 0.3)` (Coyote)
- **Active Icon**: `#B4833D` (Dark goldenrod)
- **Inactive Icon**: `#81754B` (Coyote)

### Dark Theme
- **Background**: `rgba(8, 24, 24, 0.95)` (Darkest with opacity)
- **Border**: `rgba(90, 143, 118, 0.3)` (Medium green)
- **Active Icon**: `#5A8F76` (Medium green)
- **Inactive Icon**: `#96CDB0` (Light green)

## Usage

All colors are available as CSS custom properties in `src/styles/design-tokens.css`. Components should use these variables instead of hardcoded colors to ensure theme consistency.

### Example Usage

```css
/* Light theme (default) */
.my-component {
  background-color: var(--color-background);
  color: var(--color-text);
  border-color: var(--color-border);
}

/* Dark theme (automatic via .dark class) */
.dark .my-component {
  /* Colors automatically switch via CSS variables */
}
```

## Theme Switching

The theme is controlled by the `.dark` class on the root element. The `AppShellMobile` component manages theme state and applies the class accordingly.
