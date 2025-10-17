# The Human Catalyst University - Platform Specifications

## 🎯 Executive Summary

A gamified, role-based learning platform that blends education, self-mastery, and community. Users progress through four Schools (Ignition, Insight, Transformation, God Mode) and 51 levels (XP-based), accessing courses, constellation maps, mastery tools, and community features.

---

## 📊 Architecture Decision Records (ADRs)

### ADR-1: XP → Rank → School Unlock System

**Problem:** How to implement XP progression, rank unlocks, and school access gates?

**Options Considered:**
1. **Middleware-based guards** - Check permissions on each route
2. **Context-driven state** - React Context managing user progression globally
3. **Server-side guards** - Supabase RLS policies controlling access

**Decision:** **Hybrid: Server-side RLS + React Context**

**Rationale:**
- **Server-side (Supabase RLS):** Bulletproof security - users cannot bypass access restrictions
- **React Context:** Fast UI updates, offline-capable state, better UX
- **Implementation:**
  ```typescript
  // RLS Policy Example
  CREATE POLICY "Users can only access unlocked courses" ON courses
    FOR SELECT USING (
      xp_threshold <= (SELECT total_xp FROM user_progress WHERE user_id = auth.uid())
    );
  
  // React Context
  const UserProgressContext = {
    currentXP: number,
    currentLevel: Level,
    currentSchool: School,
    unlockedCourses: Course[],
    canAccess: (resource: Resource) => boolean
  }
  ```

**Trade-offs:**
- ✅ Secure and performant
- ✅ Works offline (cached context)
- ❌ Requires syncing between server and client
- ❌ More complex initial setup

---

### ADR-2: Stellar Nexus Visualization

**Problem:** How to visualize constellation maps - 2D vs 3D, performance concerns?

**Options Considered:**
1. **2D Canvas/SVG Map** - Like a star chart, flat navigation
2. **3D Three.js Graph** - Immersive sphere navigation (current implementation)
3. **Hybrid 2D/3D Toggle** - User chooses view mode

**Decision:** **3D Three.js with Progressive Loading (Keep Current Implementation)**

**Rationale:**
- You already have a working Three.js implementation
- Aligns with "mythical, symbolic" design philosophy
- Mobile-first optimization needed:
  ```typescript
  // Progressive Loading Strategy
  const loadStrategy = {
    mobile: {
      maxNodes: 50,        // Limit visible nodes
      textureQuality: 'low',
      particleCount: 100
    },
    desktop: {
      maxNodes: 200,
      textureQuality: 'high', 
      particleCount: 500
    }
  }
  ```

**Performance Optimizations:**
- Lazy load constellation details on click
- LOD (Level of Detail) for distant nodes
- Instanced meshes for repeated elements
- Web Workers for complex calculations

**Trade-offs:**
- ✅ Unique, memorable UX
- ✅ Scalable with optimization
- ❌ Higher initial learning curve for users
- ❌ Requires more optimization work

---

### ADR-3: Hive Implementation (Social Wall + Challenges + Chat)

**Problem:** Rocket.Chat embed only vs. custom modules?

**Options Considered:**
1. **Rocket.Chat Embed Only** - Full feature iframe integration
2. **Custom React Components** - Build chat/challenges from scratch
3. **Hybrid** - Rocket.Chat for chat, custom UI for social wall/challenges

**Decision:** **Hybrid Approach with Rocket.Chat API Integration**

**Rationale:**
```typescript
// Architecture
const HiveArchitecture = {
  socialWall: {
    tech: 'Custom React + Supabase',
    features: ['Posts', 'Likes', 'Comments', 'Media uploads'],
    realtime: 'Supabase Realtime subscriptions'
  },
  challenges: {
    tech: 'Custom React + Supabase', 
    features: ['Group challenges', 'Leaderboards', 'Progress tracking'],
    gamification: 'XP rewards, badges'
  },
  messaging: {
    tech: 'Rocket.Chat API',
    integration: 'React SDK',
    auth: 'SSO with Supabase JWT',
    features: ['Direct messages', 'Group chats', 'Threads']
  }
}
```

**Implementation Plan:**
1. Phase 1: Custom social wall (MVP)
2. Phase 2: Rocket.Chat messaging integration
3. Phase 3: Custom challenges system

**Trade-offs:**
- ✅ Best of both worlds - custom UX + proven chat
- ✅ Owned data for social/challenges
- ✅ Scalable messaging without rebuilding
- ❌ More integration work
- ❌ Need to maintain Rocket.Chat instance

---

### ADR-4: Roadmap UX Structure

**Problem:** Linear unlock vs. free exploration with gated content?

**Options Considered:**
1. **Strict Linear Path** - Users must complete in order
2. **Free Exploration** - All visible, locks show requirements
3. **Guided Freedom** - Recommended path + optional branches

**Decision:** **Guided Freedom with Visual Gates**

**Rationale:**
```
UI Mockup - Roadmap View:

┌─────────────────────────────────────────────────┐
│  🔥 IGNITION SCHOOL                            │
│  Your XP: 2,500 / 4,500                        │
│  Current: Seeker of Fragments (Level 2)        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✅ [Spark of Inquiry]                         │
│     └─ Completed - 1,000 XP earned             │
│                                                 │
│  🎯 [Seeker of Fragments] ← YOU ARE HERE       │
│     ├─ Course: Media Control (500 XP)          │
│     ├─ Course: Psychological Control (600 XP)  │
│     └─ Unlock at: 2,500 XP ✓                  │
│                                                 │
│  🔒 [Mindful Observer]                         │
│     ├─ Requires: 4,500 XP                      │
│     ├─ Preview: Identity Deconstruction        │
│     └─ [Click to see requirements]             │
│                                                 │
│  ⏭️ [Advanced Levels...]                       │
│     └─ Unlock as you progress                  │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                 │
│  💡 INSIGHT SCHOOL (Locked)                    │
│  🔒 Requires: Complete Ignition + 10,000 XP    │
│                                                 │
└─────────────────────────────────────────────────┘

Features:
- See entire roadmap (builds excitement)
- Clear current position
- Lock overlays with XP requirements
- Preview locked content (teaser descriptions)
- Progress bars for each level
- Alternative paths visible but gated
```

**Trade-offs:**
- ✅ Motivating (see what's coming)
- ✅ Flexible (explore within level)
- ✅ Clear progression path
- ❌ Risk of overwhelming new users
- ❌ Need good onboarding

---

### ADR-5: Analytics Depth

**Problem:** Limited engagement stats vs. extended XP + habits tracking?

**Options Considered:**
1. **Basic:** Just course completion, time spent
2. **Extended:** XP, habits, skills, custom dashboards
3. **Advanced:** AI insights, predictions, recommendations

**Decision:** **Extended Analytics with Habit Integration**

**Dashboard Mockup:**
```
┌─────────────────────────────────────────────────────────┐
│  📊 YOUR ANALYTICS                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎯 PROGRESS OVERVIEW                                   │
│  ├─ Total XP: 15,450                                   │
│  ├─ Current Level: Stellar Apprentice (Level 5)        │
│  ├─ Next Level: 10,000 → 13,500 (86% complete)        │
│  └─ School: Insight                                     │
│                                                         │
│  📚 LEARNING STATS (Last 30 Days)                       │
│  ├─ Courses Completed: 3                               │
│  ├─ Lessons Watched: 24                                │
│  ├─ Total Study Time: 18h 30m                          │
│  └─ Avg. Session: 45 min                               │
│                                                         │
│  🔄 HABIT TRACKING                                      │
│  ┌───────────────────────────────────────────┐         │
│  │ Meditation Habit      ████████░░ 80%      │         │
│  │ Reading Habit         ██████░░░░ 60%      │         │
│  │ Journaling Habit      ███████░░░ 70%      │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
│  📈 SKILL DEVELOPMENT                                   │
│  ┌───────────────────────────────────────────┐         │
│  │ Psychology        ████████████ 92/100     │         │
│  │ Neuroscience      ██████████░░ 75/100     │         │
│  │ Meditation        ███████████░ 85/100     │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
│  🏆 ACHIEVEMENTS THIS MONTH                             │
│  ├─ 🎖️ Completed Ignition School                       │
│  ├─ 🔥 7-day learning streak                           │
│  └─ ⭐ Master of Awareness badge earned                │
│                                                         │
│  📊 DETAILED REPORTS → [View Full Analytics]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Tracked:**
- XP earned (by source: courses, quizzes, habits)
- Time spent (per course, lesson, overall)
- Completion rates
- Habit streaks and consistency
- Skill progression
- Engagement patterns

**Trade-offs:**
- ✅ Comprehensive insights
- ✅ Gamification-friendly
- ✅ Helps users stay motivated
- ❌ More database queries
- ❌ Privacy considerations

---

### ADR-6: Teacher-Created Content Location

**Problem:** Teacher content in own space vs. integrated into global catalog?

**Options Considered:**
1. **Isolated Teacher Space** - Separate section, manual enrollment
2. **Global Catalog Integration** - Same as platform courses
3. **Hybrid Marketplace** - Featured vs. community sections

**Decision:** **Hybrid with Approval Workflow**

**Structure:**
```
Course Catalog Organization:

┌─────────────────────────────────────────────┐
│  📚 COURSE CATALOG                          │
├─────────────────────────────────────────────┤
│                                             │
│  🌟 OFFICIAL COURSES                        │
│  ├─ Platform-created content                │
│  ├─ Quality guaranteed                      │
│  └─ Aligned with school progression         │
│                                             │
│  👥 TEACHER COURSES (VERIFIED)              │
│  ├─ Admin-approved content                  │
│  ├─ Meets quality standards                 │
│  ├─ XP rewards enabled                      │
│  └─ Shows teacher profile                   │
│                                             │
│  🔬 COMMUNITY LAB (BETA)                    │
│  ├─ New teacher submissions                 │
│  ├─ In review (no XP yet)                   │
│  ├─ Community feedback                      │
│  └─ [Request Access]                        │
│                                             │
└─────────────────────────────────────────────┘

Workflow:
Teacher Creates Course → Admin Review → Approve/Reject → 
If Approved → Assign XP value → Publish to Catalog
```

**Course Metadata:**
```typescript
interface Course {
  id: string;
  title: string;
  creator_type: 'platform' | 'teacher' | 'community';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  xp_reward: number;
  difficulty: number;
  school: 'Ignition' | 'Insight' | 'Transformation' | 'God Mode';
  teacher_id?: string;
  approval_date?: Date;
  featured: boolean; // Admin can feature quality teacher content
}
```

**Trade-offs:**
- ✅ Quality control maintained
- ✅ Teachers feel valued
- ✅ Scalable content creation
- ❌ Admin workload for approval
- ❌ Teachers wait for approval

---

## 🏗️ Technical Architecture

### Tech Stack (Based on Your Requirements)

```typescript
const techStack = {
  frontend: {
    framework: 'React 18',
    language: 'JavaScript/TypeScript',
    styling: 'Tailwind CSS',
    components: 'shadcn/ui',
    3d: 'Three.js (existing implementation)',
    routing: 'React Router v6',
    state: 'React Context + React Query',
    forms: 'React Hook Form + Zod validation'
  },
  
  backend: {
    database: 'Supabase (PostgreSQL)',
    auth: 'Supabase Auth',
    storage: 'Supabase Storage (for images/assets)',
    realtime: 'Supabase Realtime (for live updates)',
    edgeFunctions: 'Supabase Edge Functions (serverless)'
  },
  
  integrations: {
    payments: 'Stripe (you have keys)',
    video: 'YouTube (embed)',
    chat: 'Rocket.Chat (optional, Phase 2)',
    email: 'Supabase + Resend/SendGrid'
  },
  
  mobile: {
    approach: 'Responsive Web (mobile-first)',
    pwa: 'Progressive Web App capabilities',
    future: 'React Native (if needed)'
  }
};
```

---

## 📐 Database Schema

### Core Tables

```sql
-- Users and Authentication (Supabase Auth handles core user table)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student', -- student, teacher, admin
  subscription_tier TEXT NOT NULL DEFAULT 'free', -- free, paid
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress and XP
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 0,
  current_school TEXT DEFAULT 'Ignition',
  unlocked_schools TEXT[] DEFAULT ARRAY['Ignition'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- XP Transactions (for detailed tracking)
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source_type TEXT NOT NULL, -- 'course', 'quiz', 'habit', 'challenge'
  source_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Levels (from your provided data - 51 levels)
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  xp_threshold INTEGER NOT NULL,
  school TEXT, -- Which school unlocks at this level
  perks JSONB -- Special abilities/features unlocked
);

-- Schools
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- Ignition, Insight, Transformation, God Mode
  description TEXT,
  unlock_xp INTEGER NOT NULL,
  color_scheme JSONB,
  order_index INTEGER
);

-- Constellation Families (13 families from your data)
CREATE TABLE constellation_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  alias TEXT NOT NULL,
  description TEXT,
  school_id UUID REFERENCES schools(id),
  icon TEXT,
  color TEXT
);

-- Constellations (sub-families)
CREATE TABLE constellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  alias TEXT NOT NULL,
  family_id UUID REFERENCES constellation_families(id) ON DELETE CASCADE,
  description TEXT,
  order_index INTEGER
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER, -- Your existing course IDs
  title TEXT NOT NULL,
  description TEXT,
  school_id UUID REFERENCES schools(id),
  difficulty_level TEXT, -- From your difficulty scale (Blind to X-Ray Clarity)
  topic TEXT,
  duration_hours DECIMAL,
  xp_threshold INTEGER, -- XP required to unlock
  xp_reward INTEGER, -- XP earned on completion
  teacher_id UUID REFERENCES user_profiles(id),
  creator_type TEXT DEFAULT 'platform', -- platform, teacher, community
  status TEXT DEFAULT 'draft', -- draft, pending, approved, published
  featured BOOLEAN DEFAULT FALSE,
  stats_linked TEXT[], -- Skills this course affects
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Structure (Chapters)
CREATE TABLE course_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  UNIQUE(course_id, chapter_number)
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES course_chapters(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content JSONB, -- Rich content: video, text, images
  video_url TEXT,
  duration_minutes INTEGER,
  xp_reward INTEGER DEFAULT 0,
  order_index INTEGER,
  UNIQUE(chapter_id, lesson_number)
);

-- User Course Progress
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- User Lesson Progress
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Skills/Stats (from your master stats)
CREATE TABLE master_stats (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- cognitive, awareness, discipline, physical, creative, social
  color TEXT,
  max_value INTEGER DEFAULT 100
);

-- User Skills
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES master_stats(id),
  current_value INTEGER DEFAULT 0,
  total_practice_time INTEGER DEFAULT 0, -- minutes
  last_practiced_at TIMESTAMPTZ,
  UNIQUE(user_id, skill_id)
);

-- Habits/Mastery Tools
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT, -- daily, weekly
  skill_id UUID REFERENCES master_stats(id),
  xp_reward INTEGER DEFAULT 10,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit Tracking
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT,
  logged_at DATE DEFAULT CURRENT_DATE,
  UNIQUE(habit_id, logged_at)
);

-- Posts (for Stellar Nexus and Social Wall)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  post_type TEXT DEFAULT 'video', -- video, article, discussion
  video_url TEXT,
  youtube_id TEXT,
  image_url TEXT,
  tags TEXT[],
  constellation_id UUID REFERENCES constellations(id),
  difficulty INTEGER, -- 1-11 scale
  xp_reward INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes (environment for future implementation)
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pass_percentage INTEGER DEFAULT 70,
  xp_reward INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT, -- multiple_choice, true_false, essay
  options JSONB, -- For multiple choice
  correct_answer TEXT,
  explanation TEXT,
  order_index INTEGER
);

-- Payments/Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT, -- monthly, yearly
  status TEXT, -- active, canceled, past_due
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  event_type TEXT NOT NULL, -- page_view, video_watch, course_complete, etc.
  event_data JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 UI/UX Mockups

### 1. Homepage/Dashboard (Not Logged In)

```
┌──────────────────────────────────────────────────────────────┐
│  [LOGO] The Human Catalyst University    [Sign In] [Sign Up] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              🌌 Welcome to Your Transformation               │
│                                                              │
│         A gamified journey through consciousness,            │
│         self-mastery, and universal understanding            │
│                                                              │
│              [🚀 Start Your Journey - Free]                  │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐  │
│  │🔥 IGNITION │ │💡 INSIGHT  │ │🔄 TRANSFORM│ │⚡ GOD MODE│  │
│  │            │ │            │ │            │ │          │  │
│  │ Expose the │ │ Reclaim    │ │ Rewire     │ │ Master   │  │
│  │ rigged     │ │ your inner │ │ yourself   │ │ reality  │  │
│  │ system     │ │ power      │ │ completely │ │ itself   │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘  │
│                                                              │
│  📊 51 Levels of Mastery  •  13 Constellation Families       │
│  🎯 Gamified Progression  •  💎 Community Support            │
│                                                              │
│              [View Roadmap] [Explore Constellations]         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 2. Dashboard (Logged In - Free User)

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO] HC University    [Nexus] [Mastery] [Profile]  👤 John │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Welcome back, John! Level 2: Seeker of Fragments           │
│  ████████░░░░░░░░░░░░░░░ 2,500 / 4,500 XP                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🎯 CONTINUE YOUR JOURNEY                            │    │
│  │                                                     │    │
│  │ Last watched: "Media Control Exposed"              │    │
│  │ [▶ Continue Watching]                              │    │
│  │                                                     │    │
│  │ Next: "Psychological Manipulation Techniques"      │    │
│  │ +500 XP                                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  📚 YOUR COURSES (Ignition School)                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ ✅ Completed │ │ 📖 In Progress│ │ 🔒 Locked    │        │
│  │ Media Control│ │ Psych Control│ │ Economic     │        │
│  │ +600 XP      │ │ 60% complete │ │ Exploitation │        │
│  └──────────────┘ └──────────────┘ │ Need 4,500XP │        │
│                                     └──────────────┘        │
│                                                              │
│  🛠️ MASTERY TOOLS (Always Free)                            │
│  [📅 Calendar] [🎯 Habits] [🧰 Toolbox]                     │
│                                                              │
│  ⚡ UPGRADE TO UNLOCK                                        │
│  ├─ 🏘️ Hive (Community Features)                           │
│  ├─ 📊 Advanced Analytics                                   │
│  └─ 🚀 Full Course Library                                  │
│  [💎 Upgrade Now - $29/month]                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3. Nexus Page (3 Tabs)

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO] HC University                              👤 John    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🌌 STELLAR NEXUS                                            │
│                                                              │
│  [📚 Courses] [✨ Stellar Map] [🗺️ Roadmap]  ← Tab Navigation│
│  ────────────────────────────────────────────────────────    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🔥 IGNITION SCHOOL                                 │    │
│  │                                                     │    │
│  │  Available Courses:                                │    │
│  │                                                     │    │
│  │  ┌─ Media & Narrative Control                      │    │
│  │  │  Difficulty: ███████░░░ (7/11)                  │    │
│  │  │  XP Reward: 715                                 │    │
│  │  │  [▶ Start Course]                               │    │
│  │  │                                                 │    │
│  │  ┌─ Digital Surveillance State                     │    │
│  │  │  Difficulty: ██████░░░░ (6/11)                  │    │
│  │  │  XP Reward: 620                                 │    │
│  │  │  [▶ Start Course]                               │    │
│  │  │                                                 │    │
│  │  ┌─ 🔒 Economic Exploitation                       │    │
│  │  │  Locked - Requires 4,500 XP                     │    │
│  │  │  [View Requirements]                            │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Stellar Map Tab** = Your existing Three.js visualization

**Roadmap Tab:**
```
┌─────────────────────────────────────────────────────────────┐
│  🗺️ YOUR LEARNING ROADMAP                                   │
│                                                             │
│  Legend: ✅ Complete  🎯 Current  🔓 Unlocked  🔒 Locked     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Level 0: Uninitiated (0 XP)                      │      │
│  │ ✅ Welcome Video                                 │      │
│  │ ✅ Platform Orientation                          │      │
│  └──────────────────────────────────────────────────┘      │
│          │                                                  │
│          ▼                                                  │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Level 1: Spark of Inquiry (1,000 XP)            │      │
│  │ ✅ Introduction to Systemic Exposé              │      │
│  │ ✅ First Constellation: Veil Piercers           │      │
│  └──────────────────────────────────────────────────┘      │
│          │                                                  │
│          ▼                                                  │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 🎯 Level 2: Seeker of Fragments (2,500 XP) ← YOU │      │
│  │ ✅ Media Control (600 XP earned)                │      │
│  │ 📖 Psychological Control (60% complete)         │      │
│  │ 🔓 Identity Deconstruction (available)          │      │
│  └──────────────────────────────────────────────────┘      │
│          │                                                  │
│          ▼                                                  │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 🔒 Level 3: Mindful Observer (4,500 XP)         │      │
│  │ Unlock Requirements:                             │      │
│  │ • Complete Level 2 courses                       │      │
│  │ • Earn 2,000 more XP                             │      │
│  │ Preview: Advanced manipulation techniques...     │      │
│  │ [View Details]                                   │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  [Continue scrolling to see all 51 levels...]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Course Viewer (Video Lesson)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Course                                   [Menu ≡] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │                                                   │     │
│  │         [YouTube Video Player Embedded]           │     │
│  │                                                   │     │
│  │         "Media Control Exposed"                   │     │
│  │                                                   │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  Chapter 1: Foundations of Media Manipulation              │
│  Lesson 1.2: How Headlines Shape Reality                   │
│                                                             │
│  📝 THE HOOK:                                              │
│  How does the way we get news shape what we believe? ...   │
│                                                             │
│  🔑 KEY CONCEPTS:                                          │
│  1. Media as Epistemology - How medium shapes message     │
│  2. Fragmentation in News - Disconnected snippets         │
│                                                             │
│  ✅ Mark as Complete [+50 XP]                              │
│                                                             │
│  ──────────────────────────────────────────────────────    │
│                                                             │
│  COURSE OUTLINE (Sidebar)                                  │
│  ├─ ✅ Chapter 1: Foundations                              │
│  │   ├─ ✅ 1.1 Media as Metaphor                          │
│  │   ├─ 🎯 1.2 Headlines (Current)                        │
│  │   ├─ 🔓 1.3 Typography Age                             │
│  │   └─ 🔓 1.4 Visual & Telegraphic                       │
│  ├─ 🔒 Chapter 2: Show Business                           │
│  ├─ 🔒 Chapter 3: Implications                            │
│                                                             │
│  [← Previous Lesson]  [Next Lesson →]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 User Flows

### Flow 1: New User Onboarding

```
1. Land on Homepage
   ↓
2. Click "Start Your Journey - Free"
   ↓
3. Sign Up Form (email, username, password)
   ↓
4. Email Verification
   ↓
5. Welcome Modal: "Choose Your Path"
   - Short quiz: What interests you most?
   - Assigns initial constellation family
   ↓
6. 🎬 Stage 0 Video Tutorial (Auto-plays)
   - Platform overview
   - How XP/Levels work
   - What's free vs paid
   ↓
7. First Mission: "Unlock Your First Constellation"
   - Watch 1 video from Ignition
   - Earn 100 XP
   - Unlock Roadmap tab
   ↓
8. Dashboard Tour
   - Highlight navigation
   - Show Mastery tools (always free)
   - Point to Hive (locked, upgrade prompt)
   ↓
9. User is now active! 🎉
```

### Flow 2: Course Completion & XP

```
1. User selects course from Nexus
   ↓
2. Checks XP requirement (RLS enforces)
   - If insufficient XP → Lock overlay
   - If sufficient → Enter course
   ↓
3. Course page loads
   - Show outline
   - Start first chapter
   ↓
4. User watches video lesson
   ↓
5. Clicks "Mark as Complete"
   ↓
6. XP Transaction recorded
   - user_lesson_progress: completed = true
   - xp_transactions: +XP entry
   - user_progress: total_xp updated
   ↓
7. Check for level-up
   - If total_xp >= next threshold:
     ✨ Level Up Animation!
     - Show new title
     - Unlock notifications
     - +Badge/achievement
   ↓
8. Auto-advance to next lesson OR
   Show course complete screen
   - Celebrate! 🎉
   - Show XP earned
   - Suggest next course
```

### Flow 3: Teacher Creates Course

```
1. Teacher (approved role) clicks "Create Course"
   ↓
2. Course Creation Form
   - Title, description
   - Select school (Ignition/Insight/etc.)
   - Assign difficulty (1-11)
   - Upload video links (YouTube)
   - Add chapters/lessons
   ↓
3. Save as Draft
   ↓
4. Click "Submit for Review"
   - Status → pending
   - Notification sent to admin
   ↓
5. Admin Reviews
   - Checks quality
   - Assigns XP value
   - Approves OR rejects (with feedback)
   ↓
6. If Approved:
   - Status → published
   - Appears in Teacher Courses section
   - Teacher notified
   - Students can now access
   ↓
7. Teacher earns reputation/badges
```

---

## 🔐 Access Control Matrix

| Feature | Free User | Paid User | Teacher | Admin |
|---------|-----------|-----------|---------|-------|
| **Ignition Courses** | ✅ | ✅ | ✅ | ✅ |
| **Insight Courses** | 🔒 | ✅ | ✅ | ✅ |
| **Transformation Courses** | 🔒 | ✅ | ✅ | ✅ |
| **God Mode Courses** | 🔒 | ✅ | ✅ | ✅ |
| **Roadmap (View)** | ✅ | ✅ | ✅ | ✅ |
| **Stellar Nexus** | 🔒 Partial | ✅ | ✅ | ✅ |
| **Mastery Tools** | ✅ | ✅ | ✅ | ✅ |
| **Hive (Social Wall)** | 🔒 | ✅ | ✅ | ✅ |
| **Hive (Challenges)** | 🔒 | ✅ | ✅ | ✅ |
| **Hive (Messaging)** | 🔒 | ✅ | ✅ | ✅ |
| **Analytics** | Basic | ✅ Advanced | ✅ Advanced | ✅ Full |
| **Profile View** | ✅ | ✅ | ✅ | ✅ |
| **Profile Settings** | ✅ | ✅ | ✅ | ✅ |
| **Create Courses** | 🔒 | 🔒 | ✅ | ✅ |
| **Create Toolbox** | 🔒 | 🔒 | ✅ | ✅ |
| **Create Groups** | 🔒 | 🔒 | ✅ | ✅ |
| **Create Events** | 🔒 | 🔒 | ✅ | ✅ |
| **Admin Panel** | 🔒 | 🔒 | 🔒 | ✅ |
| **Teacher Panel** | 🔒 | 🔒 | ✅ | ✅ |

---

## 🎨 Design System

### Color Palette

**Light Mode:**
```css
/* Palette 1 - Warm Earth Tones */
--light-bg-primary: #F7F1E1;    /* Old Lace */
--light-bg-secondary: #E3D8C1;  /* Bone */
--light-accent: #B4833D;        /* Dark Goldenrod */
--light-accent-dark: #66371B;   /* Kobicha */
--light-text: #3F3F2C;          /* Earth Green */
--light-text-muted: #81754B;    /* Coyote */

/* Palette 2 - Soft Neutrals */
--light-alt-bg: #F6F5EF;        /* Muslin */
--light-alt-secondary: #D6CAB6; /* Sand */
--light-alt-text: #AAAC5B;      /* Sage */
--light-alt-accent: #452829;    /* Deep Maroon */
```

**Dark Mode:**
```css
/* Palette 1 - Rich Earth & Teal */
--dark-bg-primary: #081818;     /* Deep Teal Black */
--dark-bg-secondary: #203837;   /* Dark Teal */
--dark-accent: #5A8F76;         /* Muted Teal */
--dark-accent-light: #96CDB0;   /* Light Teal */
--dark-highlight: #EEE8B2;      /* Cream */
--dark-text: #C18D52;           /* Warm Sand */

/* Palette 2 - Warm Browns */
--dark-alt-bg: #1A120C;         /* Deep Brown */
--dark-alt-secondary: #22221F;  /* Charcoal */
--dark-alt-text: #B57C35;       /* Golden Brown */
--dark-alt-accent: #985815;     /* Rust */
--dark-alt-muted: #7E572C;      /* Brown */
--dark-alt-border: #534536;     /* Dark Tan */
```

**School-Specific Colors:**
```css
/* Ignition (Fire) */
--ignition-core: #FF0000;       /* Red center */
--ignition-glow: #FF4444;       /* Lighter red glow */

/* Insight (Light) */
--insight-core: #FFD700;        /* Gold center */
--insight-glow: #FFA500;        /* Orange glow */

/* Transformation (Evolution) */
--transformation-core: #8B00FF; /* Purple center */
--transformation-glow: #DA70D6; /* Orchid glow */

/* God Mode (Cosmic) */
--godmode-core: #00FFFF;        /* Cyan center */
--godmode-glow: #0080FF;        /* Blue glow */
```

### Typography

```css
/* Fonts */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading: 'Space Grotesk', sans-serif; /* Slightly futuristic */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--mobile: 320px;     /* Small phones */
--mobile-lg: 480px;  /* Large phones */
--tablet: 768px;     /* Tablets */
--desktop: 1024px;   /* Laptops */
--desktop-lg: 1440px;/* Large screens */
--desktop-xl: 1920px;/* Extra large */

/* Priority: 2:3 Mobile Display (360x540 optimal) */
```

### Mobile Optimizations

```typescript
// Three.js Performance for Mobile
const isMobile = window.innerWidth < 768;

const stellarNexusConfig = {
  mobile: {
    antialias: false,          // Faster rendering
    shadows: false,            // No shadows
    particleCount: 50,         // Reduce particles
    orbitControls: {
      enableDamping: false,    // Faster response
      rotateSpeed: 0.5
    },
    camera: {
      fov: 60,                 // Wider FOV
      far: 100                 // Shorter draw distance
    }
  },
  desktop: {
    antialias: true,
    shadows: true,
    particleCount: 200,
    orbitControls: {
      enableDamping: true,
      rotateSpeed: 1.0
    },
    camera: {
      fov: 75,
      far: 1000
    }
  }
};
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
**Goal:** Core infrastructure + basic user flow

**Tasks:**
- [ ] Set up Supabase project
  - [ ] Configure database schema
  - [ ] Set up RLS policies
  - [ ] Enable Supabase Auth
- [ ] Create React app structure
  - [ ] Install Tailwind + shadcn/ui
  - [ ] Set up routing (React Router)
  - [ ] Create layout components
- [ ] Implement authentication
  - [ ] Sign up/Sign in pages
  - [ ] Email verification
  - [ ] Password reset
- [ ] Build core pages
  - [ ] Homepage (landing)
  - [ ] Dashboard (logged in)
  - [ ] Profile view
- [ ] Import your existing data
  - [ ] Levels (51 levels)
  - [ ] Schools (4)
  - [ ] Constellation families (13)
  - [ ] Constellations
  - [ ] Skills/Master stats
  - [ ] Courses (existing 6+ courses)
  - [ ] Video posts

**Deliverable:** Users can sign up, view dashboard, see their XP/level

---

### Phase 2: Learning Core (Weeks 5-8)
**Goal:** Course system + XP mechanics

**Tasks:**
- [ ] Build Nexus page
  - [ ] Courses tab (list view)
  - [ ] Integrate existing Stellar Nexus (Three.js)
  - [ ] Roadmap tab (linear visualization)
- [ ] Course viewer
  - [ ] Video player (YouTube embed)
  - [ ] Lesson structure (chapters)
  - [ ] Progress tracking
- [ ] XP system
  - [ ] XP transactions
  - [ ] Level-up logic
  - [ ] Unlock notifications
  - [ ] Lock overlays (RLS)
- [ ] Basic analytics
  - [ ] Time tracking
  - [ ] Completion rates
  - [ ] XP history

**Deliverable:** Users can watch courses, earn XP, level up

---

### Phase 3: Mastery & Gamification (Weeks 9-10)
**Goal:** Habits, skills, and progression

**Tasks:**
- [ ] Mastery Tools
  - [ ] Calendar view (habit tracking)
  - [ ] Habits CRUD
  - [ ] Daily check-ins
  - [ ] Streak system
- [ ] Skills system
  - [ ] Link courses to skills
  - [ ] Track skill progression
  - [ ] Skill-based unlocks
- [ ] Enhanced roadmap
  - [ ] Visual progression
  - [ ] Alternative paths
  - [ ] Milestone celebrations

**Deliverable:** Full gamification loop working

---

### Phase 4: Payments & Access Control (Weeks 11-12)
**Goal:** Monetization + tiered access

**Tasks:**
- [ ] Stripe integration
  - [ ] Checkout flow
  - [ ] Subscription management
  - [ ] Webhook handling
- [ ] Access control
  - [ ] Free vs Paid logic
  - [ ] Content gating
  - [ ] Upgrade prompts
- [ ] Admin panel (basic)
  - [ ] User management
  - [ ] Course approval
  - [ ] Analytics dashboard

**Deliverable:** Payment system working, tiered access enforced

---

### Phase 5: Community (Hive) - Phase 1 (Weeks 13-14)
**Goal:** Social features (MVP)

**Tasks:**
- [ ] Social wall
  - [ ] Post creation
  - [ ] Comments
  - [ ] Likes/reactions
- [ ] User profiles (public)
  - [ ] Achievement display
  - [ ] Course history
  - [ ] Follower system (optional)

**Deliverable:** Basic social interaction

---

### Phase 6: Teacher & Content Creation (Weeks 15-16)
**Goal:** Enable teacher contributions

**Tasks:**
- [ ] Teacher panel
  - [ ] Course creation UI (WYSIWYG)
  - [ ] Chapter/lesson builder
  - [ ] Video upload (YouTube links)
- [ ] Admin approval workflow
  - [ ] Review queue
  - [ ] Approve/reject
  - [ ] XP value assignment
- [ ] Teacher profiles
  - [ ] Bio, credentials
  - [ ] Course portfolio

**Deliverable:** Teachers can create and publish courses

---

### Phase 7: Advanced Analytics (Week 17)
**Goal:** Deep insights

**Tasks:**
- [ ] Extended analytics
  - [ ] XP breakdown charts
  - [ ] Habit correlation
  - [ ] Skill progression graphs
  - [ ] Learning patterns
- [ ] Exports/reports
  - [ ] PDF reports
  - [ ] CSV downloads

**Deliverable:** Comprehensive analytics dashboard

---

### Phase 8: Polish & Launch Prep (Weeks 18-20)
**Goal:** Production-ready platform

**Tasks:**
- [ ] Performance optimization
  - [ ] Code splitting
  - [ ] Image optimization
  - [ ] Caching strategies
- [ ] Mobile optimization
  - [ ] Touch gestures (Stellar Nexus)
  - [ ] Mobile navigation
  - [ ] PWA setup
- [ ] Testing
  - [ ] Unit tests (key functions)
  - [ ] E2E tests (critical flows)
  - [ ] User acceptance testing
- [ ] Documentation
  - [ ] User guides
  - [ ] Teacher guides
  - [ ] Admin docs
- [ ] Launch checklist
  - [ ] SSL certificate
  - [ ] Custom domain
  - [ ] Analytics (Google Analytics/Plausible)
  - [ ] Error monitoring (Sentry)

**Deliverable:** Production launch! 🚀

---

### Future Phases (Post-Launch)

**Phase 9: Rocket.Chat Integration**
- Messaging system
- SSO with Supabase
- Group chats

**Phase 10: Challenges & Competitions**
- Team challenges
- Leaderboards
- Seasonal events

**Phase 11: Quiz System**
- Question builder
- Quiz grading
- Adaptive difficulty

**Phase 12: Advanced Features**
- AI recommendations
- Peer learning
- Live sessions
- Mobile app (React Native)

---

## 📋 Detailed Questions for You

Before I start implementation, please clarify:

### Critical Decisions:

1. **Color Palette Preference:**
   - Light Mode: Palette 1 (warm earth tones) or Palette 2 (soft neutrals)?
   - Dark Mode: Palette 1 (rich teal) or Palette 2 (warm browns)?
   - Or mix and match?

2. **School Unlocking:**
   - You said "4 Schools" but your levels go to 51 (not 15 ranks)
   - Should schools unlock at specific XP thresholds? E.g.:
     * Ignition: 0 XP (free access)
     * Insight: 10,000 XP (Level 5)
     * Transformation: 50,000 XP (Level 15?)
     * God Mode: 100,000 XP (Level 30?)
   - Or different logic?

3. **Free User Access:**
   - You said "only Roadmap free" under Nexus
   - But also "Mastery tools (all free)"
   - Confirm free users get:
     * ✅ Roadmap tab
     * ✅ Mastery tools (Calendar, Habits, Toolbox)
     * ✅ Profile basics
     * ✅ Ignition courses?
     * 🔒 Everything else paid?

4. **Veilkeeper Feature:**
   - You mentioned "Veilkeeper unlock at threshold"
   - What is Veilkeeper? A tool? A course? A special feature?
   - What XP threshold?

5. **Stage System:**
   - You mentioned "Stage 0 → intro video, Stage 1 → Hub, Stage 3 → Veilkeeper"
   - Is this separate from the 51 levels?
   - How do Stages relate to Levels/Schools?

6. **Existing Supabase Setup:**
   - Do you already have a Supabase project?
   - Should I create the schema from scratch?
   - Or do you have tables already?

7. **Logo & Assets:**
   - Can you share your logo file?
   - Any icon preferences (Heroicons, Lucide, custom)?
   - Crow skull, stone halo imagery - do you have these assets?

8. **Rocket.Chat:**
   - Skip for now (Phase 9)?
   - Or do you already have an instance running?

### Nice to Know:

9. **Domain Name:**
   - What will the domain be?
   - Do you have it registered?

10. **Content Import:**
    - You have courses ready - are they in a specific format?
    - Can you export from your current system?
    - Or should I create import scripts for your provided JSON?

---

## 🎯 Next Steps

**Once you answer the questions above, I will:**

1. ✅ Finalize this specification document
2. 🏗️ Set up the project structure
3. 🗄️ Create Supabase schema + RLS policies
4. ⚛️ Build React app foundation
5. 🎨 Implement design system
6. 🚀 Start Phase 1 development

**Estimated Timeline:**
- With your approval, I can start immediately
- Phase 1 (Foundation): ~4 weeks
- MVP (Phases 1-3): ~10 weeks
- Full Platform (All phases): ~20 weeks

---

## 📝 Appendix

### A. Technology Justifications

**Why React?**
- Component reusability
- Large ecosystem
- Your existing Three.js code is React-compatible
- Easy to go mobile (React Native) later

**Why Supabase?**
- PostgreSQL (robust, relational)
- Built-in auth (saves time)
- Real-time subscriptions (for Hive)
- RLS (row-level security) = bulletproof access control
- Edge functions (serverless backend)

**Why Tailwind + shadcn/ui?**
- Rapid development
- Consistent design
- Accessible components
- Easy theming (light/dark)
- Mobile-first

**Why Three.js (keep existing)?**
- You already built it!
- Perfect for symbolic/mythical aesthetic
- Unique differentiator
- Works on mobile with optimization

### B. Security Considerations

1. **Authentication:**
   - Email verification required
   - Password reset via email
   - JWT tokens (Supabase Auth)
   - No plaintext passwords

2. **Authorization:**
   - RLS policies on every table
   - Server-side validation (Edge Functions)
   - Client-side guards (React Context)
   - API rate limiting

3. **Payments:**
   - Stripe Checkout (PCI compliant)
   - Webhook signature verification
   - No card data stored locally

4. **Data Privacy:**
   - GDPR compliance options
   - User data export
   - Account deletion
   - Cookie consent

### C. Scalability Considerations

1. **Database:**
   - Indexing on foreign keys
   - Materialized views for analytics
   - Query optimization (EXPLAIN ANALYZE)

2. **Frontend:**
   - Code splitting by route
   - Lazy loading components
   - Image optimization (WebP)
   - CDN for static assets

3. **Three.js:**
   - Instanced meshes
   - LOD (Level of Detail)
   - Frustum culling
   - Web Workers for physics

4. **Caching:**
   - React Query (client-side)
   - Service Worker (PWA)
   - Supabase Realtime (optimistic updates)

---

**Ready to build when you are! 🚀**

Please review and answer the critical questions above, then we'll begin implementation.

