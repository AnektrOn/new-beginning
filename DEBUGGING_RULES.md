# CRITICAL DEBUGGING RULES - SUPABASE AUTHENTICATION

## 🚨 RULE #1: ALWAYS CHECK CORE FUNCTIONS FIRST

When debugging Supabase authentication issues, **NEVER** create complex workarounds until you verify the basics:

### MANDATORY FIRST STEPS:
1. **Check if `handle_new_user()` function exists**
2. **Check if `on_auth_user_created` trigger exists** 
3. **Verify they are properly connected**

### SQL TO CHECK:
```sql
-- Check if handle_new_user function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name = 'handle_new_user';

-- Check if trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

## 🚨 RULE #2: NEVER ASSUME FUNCTIONS EXIST

- **NEVER** assume database functions exist
- **ALWAYS** verify before debugging
- **ALWAYS** check the most basic functions first
- **NEVER** create complex solutions for missing basics

## 🚨 RULE #3: ERROR MESSAGE ANALYSIS

When you see errors like:
- `function does not exist`
- `Database error saving new user`
- `trigger function not found`

**STOP** and check if the basic functions exist first.

## 🚨 RULE #4: SUPABASE AUTH FLOW BASICS

The standard Supabase auth flow requires:
1. `handle_new_user()` function
2. `on_auth_user_created` trigger
3. Proper connection between them

**Without these, signup will ALWAYS fail.**

## 🚨 RULE #5: DEBUGGING HIERARCHY

1. **FIRST**: Check core functions exist
2. **SECOND**: Check function syntax/parameters
3. **THIRD**: Check trigger connections
4. **LAST**: Create complex workarounds

## 🚨 RULE #6: NEVER IGNORE USER FEEDBACK

When user says:
- "the function is not missing"
- "i must have the db trigger"
- "isn't it because of full name return empty"

**LISTEN** and check the basics they're pointing to.

---

## FAILURE ANALYSIS

**What went wrong:**
- Created 10+ complex SQL scripts
- Spent hours debugging triggers
- Ignored the most basic requirement
- Didn't check if `handle_new_user()` exists
- Created workarounds for missing fundamentals

**What should have happened:**
- First check: Does `handle_new_user()` exist?
- Answer: NO
- Solution: Create the basic function
- Done in 2 minutes

---

## PREVENTION CHECKLIST

Before any Supabase auth debugging:
- [ ] Check if `handle_new_user()` exists
- [ ] Check if `on_auth_user_created` trigger exists
- [ ] Verify basic auth flow components
- [ ] Only then proceed with complex debugging

**REMEMBER: Basics first, complexity last.**
