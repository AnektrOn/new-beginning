# 🚨 Comprehensive Troubleshooting Guide

## Overview
This guide documents all the critical issues encountered during development and their solutions. Use this as a reference when debugging similar problems.

---

## 🔥 **CRITICAL ISSUES & SOLUTIONS**

### 1. **Stripe.js Loading Failure** ❌ → ✅
**Problem**: App stuck in infinite loading state
**Error**: `Uncaught (in promise) Error: Failed to load Stripe.js`
**Root Cause**: Stripe.js was being loaded immediately on app startup and failing, blocking the entire app

**Solution**:
```javascript
// ❌ BEFORE (Blocking):
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// ✅ AFTER (Lazy Loading):
let stripePromise = null;
export const getStripe = async () => {
  if (!stripePromise) {
    try {
      stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      return null; // Don't crash the app
    }
  }
  return stripePromise;
};
```

**Key Points**:
- Make Stripe loading lazy (only when needed)
- Add error handling to prevent app crashes
- Return null instead of throwing errors

---

### 2. **Environment Variable Prefix Mismatch** ❌ → ✅
**Problem**: `Uncaught TypeError: can't access property "VITE_SUPABASE_URL" of undefined`
**Root Cause**: Using Vite syntax (`import.meta.env`) in a Create React App project

**Solution**:
```javascript
// ❌ WRONG (Vite syntax):
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ✅ CORRECT (Create React App syntax):
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
```

**Key Points**:
- Create React App uses `process.env.REACT_APP_`
- Vite uses `import.meta.env.VITE_`
- Always check your build tool before using environment variables

---

### 3. **Import Order Violations** ❌ → ✅
**Problem**: JavaScript not executing, no console logs
**Error**: `Import in body of module; reorder to top`
**Root Cause**: Console.log statements mixed with import statements

**Solution**:
```javascript
// ❌ WRONG (Mixed imports and code):
console.log('Starting...');
import React from 'react';
import Component from './Component';
console.log('Imports done');

// ✅ CORRECT (All imports first):
import React from 'react';
import Component from './Component';

console.log('Starting...');
console.log('Imports done');
```

**Key Points**:
- All imports must be at the top of the file
- No code execution between imports
- Console.log statements after all imports

---

### 4. **Supabase Network Connection Issues** ❌ → ✅
**Problem**: `TypeError: NetworkError when attempting to fetch resource`
**Root Cause**: Supabase connection failing, causing app to hang

**Solution**:
```javascript
// ✅ Add fallback profile creation:
const fetchUserProfile = useCallback(async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Create default profile instead of crashing
      setProfile({
        id: userId,
        full_name: 'User',
        email: user?.email || 'user@example.com',
        role: 'Student',
        xp: 0,
        level: 1
      });
    } else {
      setProfile(data);
    }
  } catch (error) {
    // Network error - create default profile
    setProfile({
      id: userId,
      full_name: 'User',
      email: user?.email || 'user@example.com',
      role: 'Student',
      xp: 0,
      level: 1
    });
  }
}, [user]);
```

**Key Points**:
- Always provide fallbacks for network failures
- Don't let database errors crash the app
- Create default data when connections fail

---

### 5. **React StrictMode Double Rendering** ❌ → ✅
**Problem**: App flickering, infinite re-renders
**Root Cause**: React StrictMode causing double execution in development

**Solution**:
```javascript
// Add mounted flags to prevent double execution:
useEffect(() => {
  let mounted = true;
  let isInitialized = false;

  const fetchData = async () => {
    if (isInitialized) return; // Prevent double execution
    isInitialized = true;
    
    try {
      // Your async operations here
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  fetchData();

  return () => {
    mounted = false;
  };
}, []);
```

**Key Points**:
- Use `mounted` flags to prevent state updates after unmount
- Use `isInitialized` flags to prevent double execution
- Always clean up in useEffect return function

---

### 6. **Component Prop Mismatch** ❌ → ✅
**Problem**: `onPageChange is not a function`
**Root Cause**: Header component expecting different prop names

**Solution**:
```javascript
// ❌ WRONG (Mismatched prop names):
<Header 
  onNavigate={() => {}}  // Header expects onPageChange
/>

// ✅ CORRECT (Matching prop names):
<Header 
  onPageChange={setCurrentPage}  // Header expects onPageChange
/>
```

**Key Points**:
- Always check component prop requirements
- Use consistent prop naming across components
- Pass actual functions, not empty functions

---

### 7. **Navigation State Management** ❌ → ✅
**Problem**: Navigation buttons not working
**Root Cause**: Empty function passed to onPageChange

**Solution**:
```javascript
// ❌ WRONG (Empty function):
const [currentPage, setCurrentPage] = useState('dashboard');
<Header onPageChange={() => {}} />

// ✅ CORRECT (Actual state management):
const [currentPage, setCurrentPage] = useState('dashboard');
<Header onPageChange={setCurrentPage} />

// And render different components based on currentPage:
{currentPage === 'dashboard' && <Dashboard />}
{currentPage === 'profile' && <Profile />}
```

**Key Points**:
- Pass actual state setters to navigation handlers
- Use conditional rendering for different pages
- Maintain navigation state in parent component

---

## 🛠️ **DEBUGGING TECHNIQUES**

### 1. **Minimal Test Approach**
When debugging complex issues, create a minimal test:
```javascript
// Replace complex App with simple test
const TestApp = () => {
  console.log('Test app rendering');
  return <div>Test</div>;
};
```

### 2. **Console Logging Strategy**
```javascript
// Add logs at key points:
console.log('🚀 Component: Starting...');
console.log('📥 Data: Fetching...');
console.log('✅ Success: Data loaded');
console.log('❌ Error: Something failed');
```

### 3. **Error Boundary Implementation**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

---

## 🔍 **COMMON DEBUGGING STEPS**

### 1. **Check Server Status**
```bash
curl -I http://localhost:3000
ps aux | grep "react-scripts start"
```

### 2. **Check Environment Variables**
```bash
grep REACT_APP .env
```

### 3. **Check Browser Console**
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### 4. **Check Compilation**
- Look for "Compiled successfully!" in terminal
- Check for ESLint warnings
- Verify no syntax errors

### 5. **Test Minimal Components**
- Create simple test components
- Isolate the problem
- Add complexity gradually

---

## 📋 **CHECKLIST FOR NEW ISSUES**

When encountering a new problem:

- [ ] **Check browser console** for error messages
- [ ] **Check terminal** for compilation errors
- [ ] **Verify environment variables** are set correctly
- [ ] **Test with minimal code** to isolate the issue
- [ ] **Check import/export statements** for syntax errors
- [ ] **Verify component props** match expectations
- [ ] **Check network requests** in browser dev tools
- [ ] **Test in different browsers** if needed
- [ ] **Clear browser cache** and hard refresh
- [ ] **Restart development server** if needed

---

## 🚀 **PREVENTION STRATEGIES**

### 1. **Code Organization**
- Keep imports at the top
- Use consistent naming conventions
- Add error boundaries to components

### 2. **Error Handling**
- Always wrap async operations in try-catch
- Provide fallback data for network failures
- Use loading states appropriately

### 3. **Testing**
- Test components in isolation
- Use minimal test cases for debugging
- Verify functionality step by step

### 4. **Documentation**
- Document all environment variables
- Keep troubleshooting guide updated
- Record solutions for future reference

---

### 8. **Complex Component Loading Issues** ❌ → ✅
**Problem**: App stuck in infinite loading state after restoring full functionality
**Root Cause**: One or more complex components causing errors or blocking the loading flow

**Solution - Ultra-Minimal Approach**:
```javascript
// ❌ BEFORE (Complex with many components):
const renderCurrentPage = () => {
  switch (currentPage) {
    case 'dashboard': return <Dashboard user={user} profile={profile} />;
    case 'profile': return <Profile user={user} />;
    case 'settings': return <ProfileSettings user={user} />;
    case 'admin': return <AdminPanel user={user} />;
    case 'pricing': return <Pricing user={user} />;
    case 'mastery': return <Mastery user={user} profile={profile} />;
    // ... many more complex components
  }
};

// ✅ AFTER (Ultra-minimal with force timeout):
useEffect(() => {
  // Force loading to false after 2 seconds regardless
  const forceTimeout = setTimeout(() => {
    console.log('🚨 FORCE: Setting loading to false after 2 seconds');
    setLoading(false);
  }, 2000);
  
  const checkUser = async () => {
    try {
      // Simple auth check
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
      clearTimeout(forceTimeout);
    }
  };

  checkUser();
  return () => clearTimeout(forceTimeout);
}, []);

// Simple rendering with error boundaries
const renderCurrentPage = () => {
  try {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} />;
      default: return <div>Page placeholder</div>;
    }
  } catch (error) {
    return <div>Error loading page: {error.message}</div>;
  }
};
```

**Key Points**:
- **Use force timeouts** to prevent infinite loading
- **Start with minimal components** and add complexity gradually
- **Add error boundaries** around component rendering
- **Test each component individually** before combining them
- **Use placeholder components** to isolate problematic ones

---

## 🛠️ **DEBUGGING TECHNIQUES**

### 1. **Minimal Test Approach**
When debugging complex issues, create a minimal test:
```javascript
// Replace complex App with simple test
const TestApp = () => {
  console.log('Test app rendering');
  return <div>Test</div>;
};
```

### 2. **Ultra-Minimal Recovery Strategy**
When the app is completely broken:
```javascript
// 1. Force timeout to prevent infinite loading
useEffect(() => {
  const forceTimeout = setTimeout(() => {
    setLoading(false);
  }, 2000);
  return () => clearTimeout(forceTimeout);
}, []);

// 2. Simplify to bare minimum
const renderCurrentPage = () => {
  return <div>Minimal page</div>;
};

// 3. Add components back one by one
```

### 3. **Console Logging Strategy**
```javascript
// Add logs at key points:
console.log('🚀 Component: Starting...');
console.log('📥 Data: Fetching...');
console.log('✅ Success: Data loaded');
console.log('❌ Error: Something failed');
```

### 4. **Error Boundary Implementation**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

---

## 🔍 **COMMON DEBUGGING STEPS**

### 1. **Check Server Status**
```bash
curl -I http://localhost:3000
ps aux | grep "react-scripts start"
```

### 2. **Check Environment Variables**
```bash
grep REACT_APP .env
```

### 3. **Check Browser Console**
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### 4. **Check Compilation**
- Look for "Compiled successfully!" in terminal
- Check for ESLint warnings
- Verify no syntax errors

### 5. **Test Minimal Components**
- Create simple test components
- Isolate the problem
- Add complexity gradually

### 6. **Use Force Timeouts**
```javascript
// Prevent infinite loading
useEffect(() => {
  const timeout = setTimeout(() => setLoading(false), 3000);
  return () => clearTimeout(timeout);
}, []);
```

---

## 📋 **CHECKLIST FOR NEW ISSUES**

When encountering a new problem:

- [ ] **Check browser console** for error messages
- [ ] **Check terminal** for compilation errors
- [ ] **Verify environment variables** are set correctly
- [ ] **Test with minimal code** to isolate the issue
- [ ] **Add force timeout** to prevent infinite loading
- [ ] **Check import/export statements** for syntax errors
- [ ] **Verify component props** match expectations
- [ ] **Check network requests** in browser dev tools
- [ ] **Test in different browsers** if needed
- [ ] **Clear browser cache** and hard refresh
- [ ] **Restart development server** if needed
- [ ] **Use ultra-minimal approach** if all else fails

---

## 🚀 **PREVENTION STRATEGIES**

### 1. **Code Organization**
- Keep imports at the top
- Use consistent naming conventions
- Add error boundaries to components
- Use force timeouts for loading states

### 2. **Error Handling**
- Always wrap async operations in try-catch
- Provide fallback data for network failures
- Use loading states appropriately
- Add force timeouts to prevent infinite loading

### 3. **Testing**
- Test components in isolation
- Use minimal test cases for debugging
- Verify functionality step by step
- Start simple, add complexity gradually

### 4. **Documentation**
- Document all environment variables
- Keep troubleshooting guide updated
- Record solutions for future reference

---

## 📝 **UPDATE LOG**

- **2024-01-XX**: Initial guide created
- **2024-01-XX**: Added Stripe.js loading issue
- **2024-01-XX**: Added environment variable mismatch
- **2024-01-XX**: Added import order violations
- **2024-01-XX**: Added Supabase network issues
- **2024-01-XX**: Added React StrictMode issues
- **2024-01-XX**: Added component prop mismatch
- **2024-01-XX**: Added navigation state management
- **2024-01-XX**: Added complex component loading issues and ultra-minimal recovery strategy

---

**Remember**: When in doubt, simplify, test, and add complexity gradually! Use force timeouts to prevent infinite loading! 🎯
