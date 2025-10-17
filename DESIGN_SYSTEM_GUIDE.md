# 🎨 Design System Guide

## Overview

This design system provides a comprehensive set of reusable components, design tokens, and utilities to ensure consistency across the Human Catalyst University application.

## 🎯 Design Tokens

### Colors

```css
/* Primary Colors */
--color-primary: #3b82f6;
--color-primary-dark: #1d4ed8;
--color-primary-light: #60a5fa;

/* Secondary Colors */
--color-secondary: #667eea;
--color-secondary-dark: #4c51bf;
--color-secondary-light: #a5b4fc;

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Typography

```css
/* Font Families */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-heading: 'Space Grotesk', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### Borders & Shadows

```css
/* Border Radius */
--border-radius-sm: 0.25rem;   /* 4px */
--border-radius: 0.5rem;       /* 8px */
--border-radius-md: 0.75rem;   /* 12px */
--border-radius-lg: 1rem;      /* 16px */
--border-radius-xl: 1.5rem;    /* 24px */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

## 🧩 Components

### Button

```jsx
import { Button } from './components/common';

// Basic usage
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="error">Error</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
```

### Input

```jsx
import { Input, Textarea, Select, Checkbox, Radio } from './components/common';

// Text Input
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={hasError}
  errorText="Please enter a valid email"
/>

// Textarea
<Textarea
  label="Message"
  placeholder="Enter your message"
  rows={4}
/>

// Select
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
/>

// Checkbox
<Checkbox
  label="I agree to the terms"
  checked={isChecked}
  onChange={setIsChecked}
/>

// Radio
<Radio
  label="Option 1"
  name="option"
  value="1"
  checked={selectedOption === '1'}
/>
```

### Card

```jsx
import { Card, StatCard, FeatureCard } from './components/common';

// Basic Card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Stat Card
<StatCard
  title="Total Users"
  value="1,234"
  change="+12%"
  changeType="positive"
  icon={<span>👥</span>}
/>

// Feature Card
<FeatureCard
  title="Feature Name"
  description="Feature description"
  icon={<span>⭐</span>}
/>
```

### Modal

```jsx
import { Modal, ConfirmationModal } from './components/common';

// Basic Modal
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title">
  <p>Modal content</p>
</Modal>

// Confirmation Modal
<ConfirmationModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleConfirm}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  confirmText="Delete"
  cancelText="Cancel"
  variant="error"
/>
```

### Table

```jsx
import { DataTable } from './components/common';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' }
];

const data = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
];

<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  emptyMessage="No users found"
/>
```

### Form

```jsx
import { Form, useForm, FormInput, FormSelect } from './components/common';

const validationRules = {
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email' }
  ],
  name: [
    { type: 'required', message: 'Name is required' },
    { type: 'minLength', length: 2, message: 'Name must be at least 2 characters' }
  ]
};

function MyForm() {
  const form = useForm({ email: '', name: '' }, validationRules);
  
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };
  
  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormInput
        name="name"
        label="Full Name"
        required
        form={form}
      />
      <FormInput
        name="email"
        label="Email"
        type="email"
        required
        form={form}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Loading States

```jsx
import { LoadingSpinner, LoadingOverlay, LoadingSkeleton } from './components/common';

// Spinner
<LoadingSpinner size="lg" color="primary" />

// Overlay
<LoadingOverlay loading={isLoading} message="Loading data...">
  <div>Content that gets covered</div>
</LoadingOverlay>

// Skeleton
<LoadingSkeleton lines={3} />
```

### Alerts

```jsx
import { Alert, Toast } from './components/common';

// Alert
<Alert type="success" title="Success!" dismissible onDismiss={handleDismiss}>
  Your changes have been saved.
</Alert>

// Toast
<Toast
  type="info"
  title="Notification"
  message="Something happened"
  duration={5000}
  onClose={handleClose}
/>
```

## 🛠️ Utilities

### Common Utilities

```jsx
import { utils } from './utils/common';

// Validation
const isValidEmail = utils.validateEmail('user@example.com');
const isValidPassword = utils.validatePassword('password123');

// Formatting
const formattedDate = utils.formatDate(new Date());
const formattedCurrency = utils.formatCurrency(99.99, 'USD');

// String utilities
const capitalized = utils.capitalize('hello world');
const truncated = utils.truncate('Long text here', 10);

// Local storage
utils.setLocalStorage('key', { data: 'value' });
const data = utils.getLocalStorage('key', {});
```

### Hooks

```jsx
import { useAsync, useLocalStorage, useDebounce } from './hooks';

// Async operations
const { loading, error, data, execute } = useAsync(fetchData);

// Local storage
const [value, setValue] = useLocalStorage('key', 'default');

// Debounced values
const debouncedSearch = useDebounce(searchTerm, 500);
```

### API Functions

```jsx
import { api } from './api/common';

// CRUD operations
const user = await api.create('users', { name: 'John', email: 'john@example.com' });
const users = await api.read('users', { role: 'admin' });
const updatedUser = await api.update('users', userId, { name: 'Jane' });
await api.delete('users', userId);

// User-specific operations
await api.updateUserProfile(userId, { full_name: 'John Doe' });
await api.updateUserXP(userId, 100, 'Completed lesson');
```

## 📱 Responsive Design

The design system includes responsive utilities and breakpoints:

```css
/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

Use responsive classes in your components:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Content 1</Card>
  <Card>Content 2</Card>
  <Card>Content 3</Card>
</div>
```

## 🎨 Customization

### Overriding Design Tokens

To customize the design system, override CSS custom properties:

```css
:root {
  --color-primary: #your-brand-color;
  --font-family-primary: 'Your-Font', sans-serif;
  --border-radius: 12px;
}
```

### Creating Custom Components

Extend existing components or create new ones following the established patterns:

```jsx
import { Button } from './components/common';

const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      className="custom-button-class"
      {...props}
    >
      {children}
    </Button>
  );
};
```

## 📋 Best Practices

### 1. Use Design Tokens
Always use CSS custom properties instead of hardcoded values:

```css
/* ✅ Good */
.button {
  background-color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--border-radius);
}

/* ❌ Bad */
.button {
  background-color: #3b82f6;
  padding: 16px;
  border-radius: 8px;
}
```

### 2. Consistent Spacing
Use the spacing scale for consistent layouts:

```jsx
// ✅ Good
<div className="space-y-4">
  <Card className="p-6">
    <h3 className="mb-4">Title</h3>
    <p className="mb-2">Content</p>
  </Card>
</div>
```

### 3. Semantic Colors
Use semantic color names for better maintainability:

```jsx
// ✅ Good
<Alert type="success">Success message</Alert>
<Button variant="error">Delete</Button>

// ❌ Bad
<Alert type="green">Success message</Alert>
<Button variant="red">Delete</Button>
```

### 4. Accessibility
Always include proper accessibility attributes:

```jsx
<Button
  aria-label="Close modal"
  onClick={onClose}
>
  <CloseIcon />
</Button>
```

### 5. Error Handling
Use the provided error handling utilities:

```jsx
import { utils } from './utils/common';

try {
  const result = await api.create('users', userData);
  utils.handleSuccess('User created successfully', result);
} catch (error) {
  const errorInfo = utils.handleError(error, 'createUser');
  setError(errorInfo.message);
}
```

## 🚀 Getting Started

1. Import the global styles in your main CSS file:
```css
@import './styles/globals.css';
```

2. Import components as needed:
```jsx
import { Button, Card, Input } from './components/common';
```

3. Use design tokens in your custom CSS:
```css
.my-component {
  color: var(--text-primary);
  background: var(--bg-primary);
  padding: var(--space-4);
}
```

4. Follow the established patterns for consistency across your application.

## 📚 Additional Resources

- [CSS Custom Properties Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [React Component Patterns](https://reactpatterns.com/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Design System Best Practices](https://designsystemsrepo.com/)

---

This design system is continuously evolving. For questions or contributions, please refer to the project documentation or contact the development team.
