import { supabase } from '../lib/supabaseClient';

class MasteryService {
  // ===== HABITS LIBRARY =====
  
  /**
   * Get all habits from the library
   */
  async getHabitsLibrary() {
    try {
      const { data, error } = await supabase
        .from('habits_library')
        .select('*')
        .eq('is_global', true)
        .order('title');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching habits library:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user's personal habits (with pagination support)
   */
  async getUserHabits(userId, page = 1, limit = 50) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from('user_habits')
        .select(`
          *,
          habits_library (
            title,
            description,
            category,
            skill_tags,
            xp_reward
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { 
        data, 
        error: null, 
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching user habits:', error);
      return { data: null, error };
    }
  }

  /**
   * Add a habit from library to user's habits
   */
  async addHabitFromLibrary(userId, habitId) {
    try {
      // First get the habit from library
      const { data: libraryHabit, error: libraryError } = await supabase
        .from('habits_library')
        .select('*')
        .eq('id', habitId)
        .single();

      if (libraryError) throw libraryError;

      // Create user habit
      const { data, error } = await supabase
        .from('user_habits')
        .insert({
          user_id: userId,
          habit_id: habitId,
          title: libraryHabit.title,
          description: libraryHabit.description,
          frequency_type: libraryHabit.frequency_type,
          xp_reward: libraryHabit.xp_reward,
          skill_tags: libraryHabit.skill_tags,
          is_custom: false,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding habit from library:', error);
      return { data: null, error };
    }
  }

  /**
   * Create a custom habit
   */
  async createCustomHabit(userId, habitData) {
    try {
      const { data, error } = await supabase
        .from('user_habits')
        .insert({
          user_id: userId,
          title: habitData.title,
          description: habitData.description,
          frequency_type: habitData.frequency_type || 'daily',
          xp_reward: habitData.xp_reward || 10,
          skill_tags: habitData.skill_tags || [],
          is_custom: true,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating custom habit:', error);
      return { data: null, error };
    }
  }

  /**
   * Delete a user habit
   */
  async deleteUserHabit(habitId) {
    try {
      const { data, error } = await supabase
        .from('user_habits')
        .update({ is_active: false })
        .eq('id', habitId)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting user habit:', error);
      return { data: null, error };
    }
  }

  /**
   * Complete a habit for a specific date
   */
  async completeHabit(userId, habitId, date = null) {
    try {
      const completionDate = date || new Date().toISOString().split('T')[0];
      
      // Check if already completed today
      const { data: existingCompletion, error: checkError } = await supabase
        .from('user_habit_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('completed_at', `${completionDate}T00:00:00`)
        .lt('completed_at', `${completionDate}T23:59:59`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCompletion) {
        return { data: { alreadyCompleted: true }, error: null };
      }

      // Get habit details for XP reward
      const { data: habit, error: habitError } = await supabase
        .from('user_habits')
        .select('xp_reward')
        .eq('id', habitId)
        .single();

      if (habitError) throw habitError;

      // Create completion record
      const { data, error } = await supabase
        .from('user_habit_completions')
        .insert({
          user_id: userId,
          habit_id: habitId,
          completed_at: `${completionDate}T09:00:00`,
          xp_earned: habit.xp_reward
        })
        .select()
        .single();

      if (error) throw error;

      // Update habit completion count
      await this.updateHabitCompletionCount(habitId);

      // Award XP to user
      await this.awardXP(userId, habit.xp_reward, 'habit_completion', `Completed habit: ${habitId}`);

      return { data, error: null };
    } catch (error) {
      console.error('Error completing habit:', error);
      return { data: null, error };
    }
  }

  /**
   * Remove a habit completion
   */
  async removeHabitCompletion(userId, habitId, date = null) {
    try {
      const completionDate = date || new Date().toISOString().split('T')[0];
      
      // Find and delete the completion
      const { data, error } = await supabase
        .from('user_habit_completions')
        .delete()
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('completed_at', `${completionDate}T00:00:00`)
        .lt('completed_at', `${completionDate}T23:59:59`)
        .select()
        .single();

      if (error) throw error;

      // Update habit completion count
      await this.updateHabitCompletionCount(habitId);

      return { data, error: null };
    } catch (error) {
      console.error('Error removing habit completion:', error);
      return { data: null, error };
    }
  }

  /**
   * Get habit completions for a date range
   */
  async getHabitCompletions(userId, habitId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('user_habit_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('completed_at', `${startDate}T00:00:00`)
        .lte('completed_at', `${endDate}T23:59:59`)
        .order('completed_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching habit completions:', error);
      return { data: null, error };
    }
  }

  /**
   * Calculate current streak for a habit (optimized)
   */
  async calculateHabitStreak(userId, habitId) {
    try {
      // Get completions for the last 30 days only (more efficient)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: completions, error } = await supabase
        .from('user_habit_completions')
        .select('completed_at')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('completed_at', thirtyDaysAgo.toISOString())
        .order('completed_at', { ascending: false });

      if (error) throw error;

      if (!completions || completions.length === 0) {
        return { data: 0, error: null };
      }

      // Convert to date strings and sort
      const completionDates = completions.map(c => c.completed_at.split('T')[0]).sort();
      
      // Calculate streak
      let streak = 0;
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      // Check if completed today or yesterday
      let checkDate = new Date(today);
      if (!completionDates.includes(todayString)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      while (true) {
        const checkDateString = checkDate.toISOString().split('T')[0];
        if (completionDates.includes(checkDateString)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return { data: streak, error: null };
    } catch (error) {
      console.error('Error calculating habit streak:', error);
      return { data: 0, error };
    }
  }

  /**
   * Update habit completion count
   */
  async updateHabitCompletionCount(habitId) {
    try {
      const { data, error } = await supabase
        .from('user_habit_completions')
        .select('id, completed_at')
        .eq('habit_id', habitId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const completionCount = data?.length || 0;
      const lastCompleted = data?.[0]?.completed_at || null;

      const { error: updateError } = await supabase
        .from('user_habits')
        .update({
          completion_count: completionCount,
          last_completed_at: lastCompleted
        })
        .eq('id', habitId);

      if (updateError) throw updateError;
      return { data: { completionCount, lastCompleted }, error: null };
    } catch (error) {
      console.error('Error updating habit completion count:', error);
      return { data: null, error };
    }
  }

  /**
   * Award XP to user
   */
  async awardXP(userId, amount, source, description) {
    try {
      // Get current user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_xp, total_xp_earned')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          current_xp: profile.current_xp + amount,
          total_xp_earned: profile.total_xp_earned + amount
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Record XP transaction
      const { data, error } = await supabase
        .from('xp_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          source: source,
          description: description
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error awarding XP:', error);
      return { data: null, error };
    }
  }

  /**
   * Get calendar events for a date range
   */
  async getCalendarEvents(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('user_calendar_events')
        .select(`
          *,
          user_habits (
            title,
            description,
            xp_reward
          ),
          toolbox_library (
            title,
            description,
            xp_reward
          )
        `)
        .eq('user_id', userId)
        .gte('event_date', startDate)
        .lte('event_date', endDate)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return { data: null, error };
    }
  }


  // ===== TOOLBOX =====

  /**
   * Get toolbox library
   */
  async getToolboxLibrary() {
    try {
      const { data, error } = await supabase
        .from('toolbox_library')
        .select('*')
        .eq('is_global', true)
        .order('title');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching toolbox library:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user's toolbox items (with pagination support)
   */
  async getUserToolboxItems(userId, page = 1, limit = 50) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from('user_toolbox_items')
        .select(`
          *,
          toolbox_library (
            title,
            description,
            category,
            skill_tags,
            xp_reward,
            can_convert_to_habit
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { 
        data, 
        error: null, 
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching user toolbox items:', error);
      return { data: null, error };
    }
  }

  /**
   * Add toolbox item to user's toolbox
   */
  async addToolboxItem(userId, toolboxId) {
    try {
      // First check if the item already exists
      const { data: existingItem, error: checkError } = await supabase
        .from('user_toolbox_items')
        .select('*')
        .eq('user_id', userId)
        .eq('toolbox_id', toolboxId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if item doesn't exist
        throw checkError;
      }

      if (existingItem) {
        // Item already exists, return it
        return { data: existingItem, error: null };
      }

      // Item doesn't exist, create it
      const { data, error } = await supabase
        .from('user_toolbox_items')
        .insert({
          user_id: userId,
          toolbox_id: toolboxId,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding toolbox item:', error);
      return { data: null, error };
    }
  }

  /**
   * Update user toolbox item
   */
  async updateUserToolboxItem(itemId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_toolbox_items')
        .update(updates)
        .eq('id', itemId)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error(`No toolbox item found with id: ${itemId}`);
      }
      
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error updating user toolbox item:', error);
      return { data: null, error };
    }
  }

  /**
   * Get toolbox usage data for a user
   */
  async getToolboxUsage(userId, toolboxItemId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('user_toolbox_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('toolbox_item_id', toolboxItemId)
        .gte('used_at', `${startDate}T00:00:00`)
        .lte('used_at', `${endDate}T23:59:59`)
        .order('used_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching toolbox usage:', error);
      return { data: null, error };
    }
  }

  /**
   * Use a toolbox item
   */
  async useToolboxItem(userId, toolboxItemId) {
    try {
      // Get toolbox item details
      const { data: toolboxItem, error: itemError } = await supabase
        .from('user_toolbox_items')
        .select(`
          *,
          toolbox_library (
            title,
            xp_reward
          )
        `)
        .eq('id', toolboxItemId)
        .single();

      if (itemError) throw itemError;

      // Record usage
      const { data, error } = await supabase
        .from('user_toolbox_usage')
        .insert({
          user_id: userId,
          toolbox_item_id: toolboxItemId,
          used_at: new Date().toISOString(),
          xp_earned: toolboxItem.toolbox_library.xp_reward
        })
        .select()
        .single();

      if (error) throw error;

      // Award XP
      await this.awardXP(userId, toolboxItem.toolbox_library.xp_reward, 'toolbox_usage', `Used toolbox item: ${toolboxItem.toolbox_library.title}`);

      return { data, error: null };
    } catch (error) {
      console.error('Error using toolbox item:', error);
      return { data: null, error };
    }
  }

  // ===== CALENDAR =====

  /**
   * Get calendar events for a date range
   */
  async getCalendarEvents(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('user_calendar_events')
        .select(`
          *,
          user_habits (
            title,
            xp_reward
          ),
          toolbox_library (
            title,
            xp_reward
          )
        `)
        .eq('user_id', userId)
        .gte('event_date', startDate)
        .lte('event_date', endDate)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return { data: null, error };
    }
  }

  // ===== HELPER FUNCTIONS =====

  /**
   * Update habit completion count
   */
  async updateHabitCompletionCount(habitId) {
    try {
      const { data: completions, error } = await supabase
        .from('user_habit_completions')
        .select('id', { count: 'exact' })
        .eq('habit_id', habitId);

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('user_habits')
        .update({ completion_count: completions.length })
        .eq('id', habitId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating habit completion count:', error);
    }
  }

  /**
   * Award XP to user
   */
  async awardXP(userId, amount, source, description) {
    try {
      // Add XP transaction
      const { error: transactionError } = await supabase
        .from('xp_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          source: source,
          description: description
        });

      if (transactionError) throw transactionError;

      // Update user profile XP
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_xp, total_xp_earned')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          current_xp: profile.current_xp + amount,
          total_xp_earned: profile.total_xp_earned + amount
        })
        .eq('id', userId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  }

  /**
   * Test database connection and basic operations
   */
  async testConnection() {
    try {
      console.log('🧪 Testing MasteryService connection...');
      
      // Test 1: Get habits library
      console.log('📚 Testing habits library fetch...');
      const { data: habitsLibrary, error: habitsError } = await this.getHabitsLibrary();
      if (habitsError) throw habitsError;
      console.log(`✅ Found ${habitsLibrary.length} habits in library`);

      // Test 2: Get toolbox library
      console.log('🔧 Testing toolbox library fetch...');
      const { data: toolboxLibrary, error: toolboxError } = await this.getToolboxLibrary();
      if (toolboxError) throw toolboxError;
      console.log(`✅ Found ${toolboxLibrary.length} toolbox items in library`);

      // Test 3: Get current user (if authenticated)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log(`👤 Testing with user: ${user.email}`);
        
        // Test 4: Get user habits
        console.log('🎯 Testing user habits fetch...');
        const { data: userHabits, error: userHabitsError } = await this.getUserHabits(user.id);
        if (userHabitsError) throw userHabitsError;
        console.log(`✅ Found ${userHabits.length} user habits`);

        // Test 5: Get user toolbox items
        console.log('🛠️ Testing user toolbox items fetch...');
        const { data: userToolbox, error: userToolboxError } = await this.getUserToolboxItems(user.id);
        if (userToolboxError) throw userToolboxError;
        console.log(`✅ Found ${userToolbox.length} user toolbox items`);

        // Test 6: Get calendar events for current month
        console.log('📅 Testing calendar events fetch...');
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
        
        const { data: calendarEvents, error: calendarError } = await this.getCalendarEvents(
          user.id,
          startOfMonth.toISOString().split('T')[0],
          endOfMonth.toISOString().split('T')[0]
        );
        if (calendarError) throw calendarError;
        console.log(`✅ Found ${calendarEvents.length} calendar events for current month`);
      } else {
        console.log('⚠️ No authenticated user found - skipping user-specific tests');
      }

      console.log('🎉 All tests passed! MasteryService is working correctly.');
      return { success: true, error: null };
    } catch (error) {
      console.error('❌ MasteryService test failed:', error);
      return { success: false, error };
    }
  }
}

export default new MasteryService();
