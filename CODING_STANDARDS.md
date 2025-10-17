# 📋 Coding Standards

This document outlines the coding standards and best practices for the Human Catalyst University project.

## 🎯 General Principles

### 1. Consistency
- Follow established patterns and conventions
- Use the design system components and tokens
- Maintain consistent naming conventions
- Apply consistent code formatting

### 2. Readability
- Write self-documenting code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### 3. Maintainability
- Write reusable components
- Avoid code duplication
- Use proper error handling
- Follow DRY (Don't Repeat Yourself) principle

## 🎨 Design System Standards

### CSS Custom Properties
Always use design tokens instead of hardcoded values:

```css
/* ✅ Correct */
.button {
  background-color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--border-radius);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

/* ❌ Incorrect */
.button {
  background-color: #3b82f6;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}
```

### Component Usage
Use design system components instead of custom implementations:

```jsx
// ✅ Correct
import { Button, Card, Input } from './components/common';

<Button variant="primary" size="md" onClick={handleClick}>
  Save
</Button>

// ❌ Incorrect
<button 
  className="bg-blue-600 text-white px-4 py-2 rounded"
  onClick={handleClick}
>
  Save
</button>
```

## 📁 File Organization

### Directory Structure
```
src/
├── components/
│   ├── common/           # Reusable components
│   ├── [feature]/        # Feature-specific components
│   └── index.js          # Component exports
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── api/                  # API functions
├── config/               # Configuration files
├── styles/               # Global styles
└── pages/                # Page components
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.js`)
- **Hooks**: camelCase starting with 'use' (e.g., `useUserData.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- **CSS Files**: kebab-case (e.g., `user-profile.css`)

## 🧩 Component Standards

### Component Structure
```jsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Button, Card } from './components/common';
import { utils } from '../utils/common';
import './ComponentName.css';

// 2. Component definition
const ComponentName = ({ prop1, prop2, ...props }) => {
  // 3. State declarations
  const [state, setState] = useState(initialValue);
  
  // 4. Effect hooks
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 5. Event handlers
  const handleEvent = (event) => {
    // Handler logic
  };
  
  // 6. Render
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

// 7. PropTypes (if not using TypeScript)
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// 8. Default props
ComponentName.defaultProps = {
  prop2: 0,
};

// 9. Export
export default ComponentName;
```

### Component Naming
- Use descriptive, meaningful names
- Use PascalCase for component names
- Include the component type in the name when helpful (e.g., `UserCard`, `LoginForm`)

### Props Standards
```jsx
// ✅ Good prop naming
<UserProfile 
  userId={user.id}
  showAvatar={true}
  onUserUpdate={handleUserUpdate}
  className="custom-class"
/>

// ❌ Poor prop naming
<UserProfile 
  id={user.id}
  avatar={true}
  update={handleUserUpdate}
  style="custom-class"
/>
```

## 🎣 Hook Standards

### Custom Hook Structure
```jsx
// hooks/useUserData.js
import { useState, useEffect } from 'react';
import { api } from '../api/common';

export const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await api.read('users', { id: userId });
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUser();
    }
  }, [userId]);
  
  return { user, loading, error };
};
```

### Hook Naming
- Start with 'use' prefix
- Use camelCase
- Be descriptive about what the hook does

## 🛠️ Utility Function Standards

### Function Structure
```jsx
// utils/formatDate.js
import { utils } from './common';

export const formatUserDate = (date, format = 'short') => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString();
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      default:
        return dateObj.toLocaleDateString();
    }
  } catch (error) {
    utils.handleError(error, 'formatUserDate');
    return '';
  }
};
```

### Error Handling
Always include proper error handling:

```jsx
// ✅ Good error handling
export const fetchUserData = async (userId) => {
  try {
    const response = await api.read('users', { id: userId });
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};

// ❌ Poor error handling
export const fetchUserData = async (userId) => {
  const response = await api.read('users', { id: userId });
  return response;
};
```

## 🎨 CSS Standards

### Class Naming
Use BEM (Block Element Modifier) methodology:

```css
/* Block */
.user-card { }

/* Element */
.user-card__header { }
.user-card__body { }
.user-card__footer { }

/* Modifier */
.user-card--featured { }
.user-card--compact { }
.user-card__header--centered { }
```

### CSS Organization
```css
/* 1. CSS Custom Properties (if component-specific) */
.user-card {
  --card-padding: var(--space-6);
  --card-border-radius: var(--border-radius-lg);
}

/* 2. Base styles */
.user-card {
  background: var(--bg-primary);
  border-radius: var(--card-border-radius);
  padding: var(--card-padding);
  box-shadow: var(--shadow-md);
}

/* 3. Element styles */
.user-card__header {
  margin-bottom: var(--space-4);
}

.user-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

/* 4. Modifier styles */
.user-card--featured {
  border: 2px solid var(--color-primary);
}

/* 5. Responsive styles */
@media (max-width: 768px) {
  .user-card {
    padding: var(--space-4);
  }
}
```

## 🔧 API Standards

### Function Naming
```jsx
// ✅ Good API function names
export const api = {
  createUser: async (userData) => { },
  updateUserProfile: async (userId, profileData) => { },
  deleteUserAccount: async (userId) => { },
  getUserById: async (userId) => { },
  searchUsers: async (query) => { }
};

// ❌ Poor API function names
export const api = {
  create: async (data) => { },
  update: async (id, data) => { },
  delete: async (id) => { },
  get: async (id) => { },
  search: async (q) => { }
};
```

### Error Handling
```jsx
// ✅ Good API error handling
export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};
```

## 📝 Documentation Standards

### Component Documentation
```jsx
/**
 * UserProfile component displays user information and allows editing
 * 
 * @param {Object} props - Component props
 * @param {string} props.userId - Unique identifier for the user
 * @param {boolean} props.editable - Whether the profile can be edited
 * @param {Function} props.onUpdate - Callback when user data is updated
 * @param {string} props.className - Additional CSS classes
 * 
 * @example
 * <UserProfile 
 *   userId="123" 
 *   editable={true} 
 *   onUpdate={handleUserUpdate} 
 * />
 */
const UserProfile = ({ userId, editable, onUpdate, className }) => {
  // Component implementation
};
```

### Function Documentation
```jsx
/**
 * Formats a date string according to the specified format
 * 
 * @param {string|Date} date - The date to format
 * @param {string} format - Format type ('short', 'long', 'iso')
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate('2023-12-25', 'long') // Returns "December 25, 2023"
 */
export const formatDate = (date, format = 'short') => {
  // Function implementation
};
```

## 🧪 Testing Standards

### Test File Naming
- Test files should be named `ComponentName.test.js`
- Place tests in the same directory as the component or in a `__tests__` folder

### Test Structure
```jsx
// UserProfile.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com'
  };
  
  beforeEach(() => {
    // Setup before each test
  });
  
  it('renders user information correctly', () => {
    render(<UserProfile userId="123" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
  
  it('calls onUpdate when edit button is clicked', () => {
    const mockOnUpdate = jest.fn();
    render(<UserProfile userId="123" onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser);
  });
});
```

## 🚀 Performance Standards

### Component Optimization
```jsx
// ✅ Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component implementation
});

// ✅ Use useMemo for expensive calculations
const ExpensiveCalculation = ({ items }) => {
  const processedItems = useMemo(() => {
    return items.map(item => expensiveProcessing(item));
  }, [items]);
  
  return <div>{/* Render processed items */}</div>;
};

// ✅ Use useCallback for event handlers
const ParentComponent = () => {
  const handleClick = useCallback((id) => {
    // Handle click
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};
```

### Bundle Optimization
- Use dynamic imports for code splitting
- Lazy load components when appropriate
- Optimize images and assets

## 🔒 Security Standards

### Input Validation
```jsx
// ✅ Always validate user input
const handleSubmit = (formData) => {
  if (!utils.validateEmail(formData.email)) {
    setError('Please enter a valid email address');
    return;
  }
  
  if (!utils.validateRequired(formData.name)) {
    setError('Name is required');
    return;
  }
  
  // Process valid data
};
```

### API Security
```jsx
// ✅ Sanitize data before sending to API
const createUser = async (userData) => {
  const sanitizedData = {
    name: utils.sanitizeString(userData.name),
    email: userData.email.toLowerCase().trim(),
    // Remove any sensitive fields
  };
  
  return await api.create('users', sanitizedData);
};
```

## 📊 Code Quality Standards

### ESLint Configuration
Use the following ESLint rules:
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Code Review Checklist
- [ ] Code follows established patterns
- [ ] Uses design system components
- [ ] Includes proper error handling
- [ ] Has appropriate tests
- [ ] Is properly documented
- [ ] Follows accessibility guidelines
- [ ] Is performant and optimized

## 🎯 Accessibility Standards

### ARIA Labels
```jsx
// ✅ Include proper ARIA labels
<Button 
  aria-label="Close modal"
  onClick={onClose}
>
  <CloseIcon />
</Button>

// ✅ Use semantic HTML
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <p>Content</p>
  </section>
</main>
```

### Keyboard Navigation
```jsx
// ✅ Support keyboard navigation
const handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

<button 
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
>
  Click me
</button>
```

These coding standards ensure consistency, maintainability, and quality across the entire codebase. All team members should follow these guidelines to maintain a high standard of code quality.
