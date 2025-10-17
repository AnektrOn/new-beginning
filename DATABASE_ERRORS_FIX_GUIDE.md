# Database Errors Fix Guide

## 🚨 **Console Errors Identified:**

### **1. 404 Errors - Missing Tables**
```
XHRGET https://mbffycgrqfeesfnhhcdm.supabase.co/rest/v1/xp_logs?select=xp_amount&user_id=eq.8c94448d-e21c-4b7b-be9a-88a5692dc5d6&created_at=gte.2025-09-28T09:21:40.346Z
[HTTP/3 404  237ms]
```

### **2. 406 Errors - Missing Tables**
```
XHRGET https://mbffycgrqfeesfnhhcdm.supabase.co/rest/v1/user_preferences?select=*&user_id=eq.8c94448d-e21c-4b7b-be9a-88a5692dc5d6
[HTTP/3 406  74ms]
```

## ✅ **Fixes Applied:**

### **1. Created Missing Tables**
- ✅ **`xp_logs` table** - For tracking XP transactions and weekly XP calculation
- ✅ **`user_preferences` table** - For Settings tab preferences
- ✅ **`user_toolbox_usage` table** - For tracking toolbox item usage

### **2. Enhanced Error Handling**
- ✅ **Profile component** - Added try/catch blocks for missing tables
- ✅ **ProfileSettings component** - Better error handling for user_preferences
- ✅ **Graceful fallbacks** - Components work even when tables don't exist

### **3. Database Functions**
- ✅ **`add_xp_log()` function** - For adding XP and logging transactions
- ✅ **Auto-creation triggers** - Automatically create user preferences for new users
- ✅ **RLS policies** - Proper security for all new tables

## 🔧 **Required Actions:**

### **1. Run SQL Files in Supabase**
Execute these files in your Supabase SQL Editor:

```sql
-- 1. Create XP logs table
-- Run: CREATE_XP_LOGS_TABLE.sql

-- 2. Create user preferences table  
-- Run: CREATE_USER_PREFERENCES_TABLE.sql

-- 3. Create toolbox usage table
-- Run: CREATE_USER_TOOLBOX_USAGE_TABLE.sql
```

### **2. Verify Tables Created**
Check that these tables exist in your Supabase dashboard:
- `xp_logs`
- `user_preferences` 
- `user_toolbox_usage`

### **3. Test Profile Page**
After running the SQL files:
- ✅ Weekly XP should display (even if 0)
- ✅ Settings tab should load without errors
- ✅ Profile picture upload should work
- ✅ No more 404/406 errors in console

## 📋 **What Each Table Does:**

### **xp_logs Table**
- **Purpose**: Track all XP transactions for users
- **Used by**: Profile page weekly XP calculation
- **Features**: Source tracking, metadata, automatic user XP updates

### **user_preferences Table**
- **Purpose**: Store user settings and preferences
- **Used by**: Settings tab (notifications, privacy, theme)
- **Features**: Auto-created for new users, RLS protected

### **user_toolbox_usage Table**
- **Purpose**: Track when users use toolbox items
- **Used by**: Profile page "Best Habits & Tools" section
- **Features**: Usage analytics, XP rewards, completion tracking

## 🧪 **Testing After Setup:**

1. **Profile Page**: Should load without console errors
2. **Settings Tab**: Should work for all preference toggles
3. **Weekly XP**: Should display (0 if no XP logs yet)
4. **Profile Picture**: Should upload and display correctly
5. **Admin Tab**: Should be visible for admin users

## 🎯 **Expected Results:**

- ✅ **No more 404 errors** for xp_logs
- ✅ **No more 406 errors** for user_preferences  
- ✅ **Profile page loads cleanly** without console errors
- ✅ **Settings tab functions properly** with preference storage
- ✅ **Weekly XP tracking works** (will show 0 until XP is earned)

Run the SQL files and the console errors should disappear!
