# Service Layer Debugging Guide & Rules

## 🚨 **CRITICAL RULE: Always Test Service Layer vs Direct Database Queries**

### **The Problem We Just Solved:**
- **Calendar was working** ✅ - Used `getUserCalendarEvents()` service method
- **Habits weren't working** ❌ - Used `getUserHabits()` service method  
- **Database had the data** ✅ - Direct queries worked perfectly
- **Service layer was broken** ❌ - Caching, RLS, or other service issues

---

## 🔍 **Debugging Process (Follow This Every Time)**

### **Step 1: Identify the Issue**
When a component shows "No data" or empty state:
1. **Check if data exists in database** using SQL queries
2. **Test direct database access** vs service layer
3. **Compare working vs broken components**

### **Step 2: Create Test Buttons**
Always add these debugging buttons to components:

```javascript
// Test Button - Direct Database Query
<button 
  onClick={async () => {
    try {
      const { supabase } = await import('../../lib/supabaseClient');
      const { data, error } = await supabase
        .from('TABLE_NAME')
        .select('*')
        .eq('user_id', user.id);
      console.log('Direct query test:', { data, error });
      setState(data || []);
    } catch (err) {
      console.error('Direct query error:', err);
    }
  }}
>
  🧪 Test Direct Query
</button>

// Refresh Button - Service Layer Test
<button 
  onClick={async () => {
    try {
      const result = await serviceMethod(user.id);
      console.log('Service layer result:', result);
      setState(result || []);
    } catch (err) {
      console.error('Service layer error:', err);
    }
  }}
>
  🔄 Test Service Layer
</button>
```

### **Step 3: Compare Results**
- **If Test Button works** → Service layer issue
- **If Test Button fails** → Database/RLS issue
- **If both work** → UI rendering issue

---

## 🛠️ **Service Layer Issues & Solutions**

### **Issue 1: Caching Problems**
**Symptoms:** Data doesn't update after changes
**Solution:** Clear cache or bypass service layer

```javascript
// Clear cache
cacheService.clearCache(cacheService.KEYS.USER_HABITS, [userId]);

// Or bypass service layer entirely
const { supabase } = await import('../../lib/supabaseClient');
const { data } = await supabase.from('table').select('*');
```

### **Issue 2: RLS (Row Level Security) Problems**
**Symptoms:** Service method returns empty array, direct query works
**Solution:** Check RLS policies or use direct queries

```javascript
// Check RLS policies in Supabase
// Or use direct queries with proper user context
```

### **Issue 3: Complex Joins Failing**
**Symptoms:** Service method throws errors, simple queries work
**Solution:** Simplify queries or add fallbacks

```javascript
// Add fallback query
if (error) {
  // Try simple query without joins
  const { data: fallbackData } = await supabase
    .from('table')
    .select('*')
    .eq('user_id', userId);
  return fallbackData || [];
}
```

---

## 📝 **Implementation Rules**

### **Rule 1: Always Add Debugging Tools**
Every data-fetching component MUST have:
- **Test button** for direct database queries
- **Console logging** for debugging
- **Error handling** with fallbacks

### **Rule 2: Service Layer Fallback**
If service layer fails, implement direct database access:

```javascript
// Primary: Use service layer
try {
  const data = await serviceMethod(userId);
  return data;
} catch (error) {
  console.error('Service layer failed:', error);
  
  // Fallback: Direct database query
  const { supabase } = await import('../../lib/supabaseClient');
  const { data } = await supabase
    .from('table')
    .select('*')
    .eq('user_id', userId);
  return data || [];
}
```

### **Rule 3: Consistent Error Handling**
Always handle errors gracefully:

```javascript
// Good
const data = await serviceMethod(userId).catch(() => []);

// Bad
const data = await serviceMethod(userId); // Can throw and break UI
```

### **Rule 4: Cache Management**
When data changes, always clear relevant caches:

```javascript
// After adding/updating/deleting data
cacheService.clearCache(cacheService.KEYS.USER_HABITS, [userId]);
```

---

## 🧪 **Testing Checklist**

Before considering a feature "complete":

- [ ] **Data displays correctly** in UI
- [ ] **Test button works** (direct database query)
- [ ] **Service layer works** (or has fallback)
- [ ] **Error handling** doesn't break UI
- [ ] **Cache invalidation** works after changes
- [ ] **Console logs** show expected data
- [ ] **No JavaScript errors** in console

---

## 🔧 **Quick Fixes for Common Issues**

### **Empty Data Issue:**
1. Add test button
2. Check console logs
3. Compare service vs direct query
4. Implement fallback if needed

### **Caching Issue:**
1. Clear cache manually
2. Add cache clearing to mutations
3. Reduce cache time
4. Bypass cache entirely

### **RLS Issue:**
1. Check Supabase RLS policies
2. Verify user authentication
3. Use direct queries with proper context
4. Test with different user roles

---

## 📊 **Success Metrics**

A component is working correctly when:
- ✅ **Data loads** without errors
- ✅ **Test button** shows same data as service
- ✅ **Console logs** show expected data flow
- ✅ **Error states** are handled gracefully
- ✅ **Cache invalidation** works properly

---

## 🎯 **Remember**

**The calendar worked because it used a different service method. The habits failed because of a service layer issue. Always test both approaches to identify the root cause quickly.**

**When in doubt: Add test buttons, check console logs, and implement fallbacks.**
