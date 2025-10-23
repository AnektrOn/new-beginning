# Skills System Implementation Plan

## 🎯 Overview
Integrate the skills system with habits and toolbox to properly reward skill points and enable skill-based filtering.

## 📊 Reward System
- **Habit completion**: 10 XP + 0.1 points to EACH skill in skill_tags
- **Toolbox usage**: 15 XP + 0.15 points to EACH skill in skill_tags
- **Multiple skills**: If habit has 3 skill_tags, all 3 get points

## 🔧 Implementation Steps

### Phase 1: Skills Service & Data Layer
- [ ] Create `skillsService.js` for skill operations
- [ ] Add functions to fetch all skills
- [ ] Add functions to fetch/update user_skills
- [ ] Add function to award skill points
- [ ] Add function to get skills by IDs (for skill_tags)

### Phase 2: Reward System Integration
- [ ] Update `masteryService.completeHabit()` to award skill points
- [ ] Update `masteryService.useToolboxItem()` to award skill points
- [ ] Create `awardSkillPoints(userId, skillIds, amount)` function
- [ ] Ensure user_skills records are created/updated properly

### Phase 3: UI Components Update
- [ ] Update HabitsTabCompact to display skill tags
- [ ] Update ToolboxTabCompact to display skill tags  
- [ ] Add skill-based filtering to both components
- [ ] Show skill icons/colors from master_stats

### Phase 4: Calendar Integration
- [ ] Group calendar events by skills
- [ ] Add skill filter dropdown in calendar
- [ ] Color-code events by master stat color
- [ ] Show skill progress in calendar view

### Phase 5: Skills Dashboard
- [ ] Create SkillsOverview component
- [ ] Show all 34 skills with progress bars
- [ ] Group by 5 master stats
- [ ] Show which habits/toolbox items improve each skill

## 📋 Database Schema Reference

### skills table
```
- id (uuid)
- name (text)
- display_name (text)
- description (text)
- master_stat_id (uuid) -> links to master_stats
- max_value (int) = 100
```

### user_skills table
```
- id (uuid)
- user_id (uuid)
- skill_id (uuid) -> links to skills
- current_value (numeric) = skill points accumulated
- created_at (timestamp)
- updated_at (timestamp)
```

### master_stats table
```
- id (uuid)
- name (text)
- display_name (text)
- description (text)
- color (text) = hex color for UI
```

### habits_library / toolbox_library
```
- skill_tags (uuid[]) = array of skill IDs
- xp_reward (int) = 10 for habits, 15 for toolbox
```

## 🎨 UI/UX Improvements

### Skill Display
- Show skill badges on habit/toolbox cards
- Use master stat colors for visual grouping
- Display "+0.1" or "+0.15" skill point indicators

### Filtering
- Multi-select skill filter
- Group by master stat (6 categories)
- "Show all" / "Show incomplete" toggles
- Search by skill name

### Progress Tracking
- Skill progress bars (0-100)
- Master stat overview charts
- "Skills improved today" summary
- Skill level indicators

## 🚀 Priority Order
1. **High**: Skills service + reward system (Phase 1-2)
2. **High**: UI display of skills (Phase 3)
3. **Medium**: Calendar skill filtering (Phase 4)
4. **Low**: Skills dashboard (Phase 5)

