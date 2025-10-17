# 🎯 Project Rules - The Human Catalyst University

## 🚨 **CRITICAL RULE: React Component Loading State Management**

### **The Problem**
Components with their own loading states cause:
- ❌ **Infinite re-render loops**
- ❌ **Continuous webpack recompilation** 
- ❌ **App stuck in loading state**
- ❌ **Navigation buttons not working**
- ❌ **Performance issues**

### **The Solution**
**NEVER create components with their own loading states when the main App already manages loading.**

#### **✅ CORRECT Approach:**
```javascript
// Simple component that receives data as props
const DashboardSimple = ({ user, profile }) => {
  const [schools, setSchools] = useState([]);
  
  useEffect(() => {
    // Fetch data once, no loading state
    const fetchData = async () => {
      const { data } = await supabase.from('schools').select('*');
      setSchools(data || []);
    };
    fetchData();
  }, [user]);
  
  return <div>Content renders immediately</div>;
};
```

#### **❌ WRONG Approach:**
```javascript
// Component with its own loading state - CAUSES PROBLEMS
const Dashboard = ({ user, profile }) => {
  const [loading, setLoading] = useState(true); // ❌ DON'T DO THIS
  const [schools, setSchools] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ❌ CONFLICTS WITH MAIN APP
      // ... fetch data
      setLoading(false); // ❌ CAUSES RE-RENDER LOOPS
    };
    fetchData();
  }, [user]);
  
  if (loading) return <div>Loading...</div>; // ❌ BLOCKS RENDERING
  return <div>Content</div>;
};
```

### **Main App Loading Management:**
```javascript
// App.js - Single source of truth for loading
const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Force timeout to prevent infinite loading
    const forceTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    const checkUser = async () => {
      // ... auth logic
      setLoading(false);
      clearTimeout(forceTimeout);
    };
    
    checkUser();
    return () => clearTimeout(forceTimeout);
  }, []);
  
  if (loading) return <LoadingSpinner />;
  return <MainApp />;
};
```

---

## 🎯 **Component Design Rules**

### **1. Simple Components First**
- ✅ Start with simple, stateless components
- ✅ Add complexity gradually
- ✅ Test each component individually
- ✅ Use props for data, not internal state

### **2. Data Flow Rules**
- ✅ **Main App** handles authentication and global state
- ✅ **Components** receive data as props
- ✅ **No independent data fetching** in child components
- ✅ **Single loading state** managed by main App

### **3. Error Handling Rules**
- ✅ **Try-catch blocks** around async operations
- ✅ **Fallback data** for network failures
- ✅ **Error boundaries** for component crashes
- ✅ **Force timeouts** to prevent infinite loading

---

## 🛠️ **Debugging Rules**

### **When App Gets Stuck in Loading:**
1. **Check for multiple loading states** in components
2. **Remove internal loading states** from child components
3. **Add force timeout** to main App loading
4. **Use simple components** to isolate issues
5. **Check for infinite useEffect loops**

### **When Navigation Doesn't Work:**
1. **Verify onPageChange prop** is passed correctly
2. **Check currentPage state** is updating
3. **Ensure renderCurrentPage function** exists
4. **Add error boundaries** around page rendering

### **When Continuous Recompilation Occurs:**
1. **Check for ESLint warnings** causing hot-reload loops
2. **Look for impure functions** in useEffect
3. **Verify dependency arrays** are correct
4. **Remove React.StrictMode** temporarily if needed

---

## 📋 **Component Creation Checklist**

Before creating any new component:

- [ ] **No internal loading state** (use props instead)
- [ ] **No complex useEffect loops** (simple data fetching only)
- [ ] **Error handling** with try-catch blocks
- [ ] **Fallback data** for network failures
- [ ] **Props validation** for required data
- [ ] **Simple rendering** (no conditional loading states)
- [ ] **Test in isolation** before integrating

---

## 🚀 **Performance Rules**

### **State Management:**
- ✅ **Minimal state** in components
- ✅ **Props over state** when possible
- ✅ **Single source of truth** for global state
- ✅ **Force timeouts** to prevent infinite loading

### **Rendering:**
- ✅ **Immediate rendering** (no loading states in components)
- ✅ **Error boundaries** for crash protection
- ✅ **Simple conditional rendering** only
- ✅ **No complex state dependencies**

---

## 📝 **Update Log**

- **2024-01-XX**: Initial rules created
- **2024-01-XX**: Added critical loading state management rule
- **2024-01-XX**: Added component design and debugging rules

---

**Remember**: When in doubt, simplify! Simple components that receive data as props are always better than complex components with their own loading states. 🎯
