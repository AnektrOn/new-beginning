# 🎮 RPG Skills & Mastery System - Complete Setup Guide

## 📋 **Overview**

This guide covers the complete setup of the RPG-like Skills & Mastery System for The Human Catalyst University. The system includes 6 Master Stats, 34 Individual Skills, and integrates with Habits and Toolbox systems.

---

## 🗄️ **Database Setup**

### **Step 1: Run Main Schema**
Execute `SKILLS_AND_MASTERY_SCHEMA.sql` in your Supabase SQL Editor:

```sql
-- This creates all tables, indexes, policies, and sample data
-- Includes: master_stats, skills, user_skills, user_master_stats
-- Plus: habits_library, toolbox_library, and all related tables
```

### **Step 2: Fix Any Column Issues**
If you encounter column errors, run `CORRECTED_SCHEMA_FIX.sql`:

```sql
-- This safely adds missing columns and fixes RLS policies
-- Handles: skill_tags, skill_reward, xp_reward columns
-- Fixes: Duplicate policy errors
```

---

## 🏆 **System Architecture**

### **Master Stats (6 Main Attributes):**
1. **🧠 Cognitive & Theoretical** (`#3b82f6`) - Mental processing and knowledge
2. **🧘 Inner Awareness** (`#f97316`) - Self-awareness and mindfulness  
3. **⚡ Discipline & Ritual** (`#a855f7`) - Consistency and habit formation
4. **💪 Physical Mastery** (`#ef4444`) - Physical fitness and movement skills
5. **🎨 Creative & Reflective** (`#ec4899`) - Creative expression and self-reflection
6. **🤝 Social & Influence** (`#22c55e`) - Community engagement and leadership

### **Skills System (34 Individual Skills):**
- **Physical Mastery:** Workout Habit, Movement, Nutrition, Breathwork
- **Cognitive & Theoretical:** Reading, Quantum Understanding, Psychology, Problem Solving, Neuroscience, Memory Techniques, Learning, Critical Thinking
- **Inner Awareness:** Shadow Work, Self Awareness, Mindfulness, Meditation, Awareness, Emotional Regulation
- **Discipline & Ritual:** Time Management, Ritual Discipline, Ritual Creation, Habit Tracking, Goal Setting, Consistency
- **Creative & Reflective:** Reflection, Journaling, Creative Expression, Adaptation
- **Social & Influence:** Peer Coaching, Networking, Leadership, Empathy, Communication, Advocacy

---

## 🎯 **Reward System**

### **Habits:**
- **XP Reward:** 10 XP per completion
- **Skill Points:** 1 point per affected skill
- **Multiple Skills:** Single habit can affect multiple skills

### **Toolbox Items:**
- **XP Reward:** 15 XP per completion
- **Skill Points:** 2 points per affected skill
- **Higher Rewards:** More valuable than habits

---

## 🔧 **Service Integration**

### **MasteryService Methods:**
```javascript
// Get user's skill progress
await masteryService.getUserSkills(userId);

// Get user's master stat progress
await masteryService.getUserMasterStats(userId);

// Award skill points (used automatically)
await masteryService.awardSkillPoints(userId, skillPoints);

// Complete habit (awards XP + skill points)
await masteryService.completeHabit(userId, habitId, notes);
```

### **Automatic Features:**
- ✅ **New User Initialization** - All skills/stats start at 0
- ✅ **Skill Point Calculation** - Database function handles distribution
- ✅ **XP Integration** - Works with existing XP system
- ✅ **Progress Tracking** - All completions recorded with skill gains

---

## 🎨 **UI Integration Points**

### **Dashboard Enhancements Needed:**
- Skills progress bars by master stat
- Master stat overview with colors
- Recent skill gains from activities
- Level progression indicators

### **Mastery Page Features:**
- Skills tab showing all 34 skills
- Master stats overview
- Habit completion tracking with skill gains
- Toolbox conversion with skill preview

---

## 🚀 **How It Works**

### **User Journey:**
1. **Sign Up** → All skills and master stats initialized at 0
2. **Complete Habits** → Earn XP + skill points
3. **Use Toolbox** → Earn more XP + skill points
4. **Level Up Skills** → Visual progress in dashboard
5. **Master Stats Increase** → Based on related skill gains

### **Example Flow:**
1. User completes "Morning Workout" habit
2. Earns 10 XP + 1 point in "Workout Habit" skill + 1 point in "Movement" skill
3. Both skills are under "Physical Mastery" master stat
4. Physical Mastery master stat increases
5. Dashboard shows progress bars for all affected skills

---

## 🔍 **Troubleshooting**

### **Common Issues:**

**Error: `column "skill_tags" does not exist`**
- **Solution:** Run `CORRECTED_SCHEMA_FIX.sql`

**Error: `policy "Anyone can read habits library" already exists`**
- **Solution:** The fix file handles this automatically

**Skills not updating after habit completion**
- **Check:** Database function `award_skill_points` exists
- **Check:** User has entries in `user_skills` table
- **Check:** Habit has `skill_tags` populated

### **Verification Queries:**
```sql
-- Check if user has skills initialized
SELECT COUNT(*) FROM user_skills WHERE user_id = 'your-user-id';

-- Check habit skill tags
SELECT title, skill_tags FROM habits_library WHERE skill_tags IS NOT NULL;

-- Check recent completions
SELECT * FROM user_habit_completions ORDER BY completed_at DESC LIMIT 5;
```

---

## ✅ **System Status**

### **Completed:**
- ✅ Database schema with all tables and relationships
- ✅ 6 Master Stats with color coding
- ✅ 34 Individual Skills organized by category
- ✅ Sample habits and toolbox items
- ✅ Service layer integration
- ✅ Automatic skill point awarding
- ✅ RLS security policies
- ✅ Performance indexes

### **Ready for:**
- 🎨 UI component development
- 🧪 System testing
- 📊 Analytics integration
- 🎮 Gamification features

---

## 🎉 **Success Indicators**

When everything is working correctly, you should see:
- New users get all skills initialized at 0
- Completing habits awards XP and skill points
- Skills progress bars show advancement
- Master stats increase based on skill gains
- Dashboard displays RPG-like character progression

---

**Last Updated:** October 3, 2024  
**Status:** ✅ FULLY IMPLEMENTED AND READY FOR UI INTEGRATION
