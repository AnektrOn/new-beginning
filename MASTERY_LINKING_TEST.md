# Mastery System Linking Test Checklist

## 🧪 Test 1: Habit to User Linking
**Goal:** Verify habits from library are properly linked to users

### Steps:
1. Go to Mastery → Habits tab → "Habits Library" sub-tab
2. Click the **+** button on any habit
3. Check if habit appears in "My Habits (1)" tab

### Expected Result:
- ✅ Habit should appear in user's personal habits list
- ✅ Database: `user_habits` table should have entry with `user_id` and `habit_id`

### Database Query to Verify:
```sql
SELECT 
  uh.id,
  uh.user_id,
  uh.habit_id,
  uh.title,
  hl.title as library_habit_title
FROM user_habits uh
LEFT JOIN habits_library hl ON uh.habit_id = hl.id
WHERE uh.user_id = 'YOUR_USER_ID'
ORDER BY uh.created_at DESC;
```

---

## 🧪 Test 2: Habit to Calendar Event Linking
**Goal:** Verify adding a habit creates calendar events

### Steps:
1. After adding a habit from library (Test 1)
2. Go to Mastery → Calendar tab
3. Look for events in the next 30 days

### Expected Result:
- ✅ Should see 30 calendar events created (one per day)
- ✅ Events should have the same title as the habit
- ✅ Database: `user_calendar_events` table should have 30 entries with `habit_id`

### Database Query to Verify:
```sql
SELECT 
  uce.id,
  uce.title,
  uce.event_date,
  uce.habit_id,
  uce.is_completed,
  uh.title as habit_title
FROM user_calendar_events uce
LEFT JOIN user_habits uh ON uce.habit_id = uh.id
WHERE uce.user_id = 'YOUR_USER_ID'
ORDER BY uce.event_date ASC
LIMIT 10;
```

---

## 🧪 Test 3: Calendar Event Display with Habit Info
**Goal:** Verify calendar shows which habit each event belongs to

### Steps:
1. Go to Mastery → Calendar tab
2. Click on any day that has events
3. Look at the event details in the sidebar

### Expected Result:
- ✅ Each event should show:
  - Event title
  - Blue badge with habit name (e.g., "📋 Morning Workout")
  - Green frequency badge (e.g., "daily")
  - Complete and Delete buttons

---

## 🧪 Test 4: Complete Calendar Event → Update Habit
**Goal:** Verify completing a calendar event updates the habit completion count

### Steps:
1. Go to Mastery → Calendar tab
2. Click on today's date
3. Find an incomplete event and click ✅ button
4. Go to Mastery → Habits tab → "My Habits" sub-tab
5. Check the completion count for that habit

### Expected Result:
- ✅ Event should be marked as completed (green checkmark or strikethrough)
- ✅ Habit completion count should increase by 1
- ✅ User should receive XP (check header)
- ✅ Database: `user_habit_completions` table should have new entry

### Database Query to Verify:
```sql
-- Check habit completion count
SELECT 
  uh.id,
  uh.title,
  uh.completion_count,
  COUNT(uhc.id) as actual_completions
FROM user_habits uh
LEFT JOIN user_habit_completions uhc ON uh.id = uhc.habit_id
WHERE uh.user_id = 'YOUR_USER_ID'
GROUP BY uh.id, uh.title, uh.completion_count;

-- Check recent completions
SELECT 
  uhc.id,
  uhc.completed_at,
  uhc.xp_earned,
  uh.title as habit_title
FROM user_habit_completions uhc
JOIN user_habits uh ON uhc.habit_id = uh.id
WHERE uhc.user_id = 'YOUR_USER_ID'
ORDER BY uhc.completed_at DESC
LIMIT 5;
```

---

## 🧪 Test 5: Delete Calendar Event
**Goal:** Verify events can be deleted from calendar

### Steps:
1. Go to Mastery → Calendar tab
2. Click on any day with events
3. Click 🗑️ button on an event
4. Confirm deletion

### Expected Result:
- ✅ Event should disappear from calendar
- ✅ Event should be removed from sidebar
- ✅ Database: Event deleted from `user_calendar_events` table

---

## 🧪 Test 6: Habit Removal Cascades to Events
**Goal:** Verify removing a habit also removes its calendar events

### Steps:
1. Go to Mastery → Habits tab → "My Habits" sub-tab
2. Click 🗑️ button on any habit
3. Go to Mastery → Calendar tab
4. Check if that habit's events are gone

### Expected Result:
- ✅ Habit removed from user's habits list
- ✅ All calendar events for that habit should be removed
- ✅ Database: Cascade delete should work (ON DELETE CASCADE)

---

## 🧪 Test 7: Multiple Habits → Multiple Calendar Events
**Goal:** Verify multiple habits create distinct calendar events

### Steps:
1. Add 3 different habits from library
2. Go to Mastery → Calendar tab
3. Click on any day
4. Check event list in sidebar

### Expected Result:
- ✅ Should see multiple events per day (one per habit)
- ✅ Each event should show its corresponding habit badge
- ✅ Events should be clearly distinguishable

---

## 📊 Summary Check

After running all tests, verify:

| Test | Status | Notes |
|------|--------|-------|
| 1. Habit to User Linking | ⬜ | |
| 2. Habit to Calendar Linking | ⬜ | |
| 3. Calendar Display | ⬜ | |
| 4. Complete Event → Update Habit | ⬜ | |
| 5. Delete Calendar Event | ⬜ | |
| 6. Remove Habit Cascades | ⬜ | |
| 7. Multiple Habits | ⬜ | |

---

## 🔍 Troubleshooting

### If habits don't appear in calendar:
- Check browser console for errors
- Verify `addHabitToCalendar` is called in `masteryService.js`
- Check database: Does event have `habit_id`?

### If habit badges don't show:
- Check if join query is working
- Look for console errors about "user_habits"
- Verify `user_habits` relation exists in database

### If completion doesn't update count:
- Check `completeCalendarEvent` method
- Verify `completeHabit` is being called
- Check database RLS policies

---

## 🎯 Expected Database State After Tests

```
habits_library: Multiple global habits
    ↓
user_habits: 3+ habits linked to user (habit_id → habits_library)
    ↓
user_calendar_events: 90+ events (30 per habit, habit_id → user_habits)
    ↓
user_habit_completions: 1+ completions (habit_id → user_habits)
```

