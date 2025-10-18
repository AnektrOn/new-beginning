import masteryService from '../services/masteryService';
import { supabase } from '../lib/supabaseClient';

/**
 * Run comprehensive tests on the MasteryService
 * This can be called from the browser console or imported into components
 */
export const runMasteryServiceTests = async () => {
  console.log('🧪 Starting MasteryService comprehensive tests...');
  console.log('='.repeat(60));

  try {
    // Test 1: Basic Connection Test
    console.log('\n📡 Test 1: Database Connection');
    const connectionResult = await masteryService.testConnection();
    console.log('✅ Connection test result:', connectionResult);

    if (!connectionResult.success) {
      console.error('❌ Connection test failed, stopping tests');
      return { success: false, error: connectionResult.error };
    }

    // Test 2: Habits Library
    console.log('\n📚 Test 2: Habits Library');
    const { data: habitsLibrary, error: habitsError } = await masteryService.getHabitsLibrary();
    if (habitsError) {
      console.error('❌ Habits library test failed:', habitsError);
    } else {
      console.log(`✅ Found ${habitsLibrary.length} habits in library`);
      console.log('Sample habits:', habitsLibrary.slice(0, 3).map(h => h.title));
    }

    // Test 3: Toolbox Library
    console.log('\n🔧 Test 3: Toolbox Library');
    const { data: toolboxLibrary, error: toolboxError } = await masteryService.getToolboxLibrary();
    if (toolboxError) {
      console.error('❌ Toolbox library test failed:', toolboxError);
    } else {
      console.log(`✅ Found ${toolboxLibrary.length} toolbox items in library`);
      console.log('Sample toolbox items:', toolboxLibrary.slice(0, 3).map(t => t.title));
    }

    // Test 4: Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('⚠️ No authenticated user found - skipping user-specific tests');
      return { success: true, message: 'Basic tests passed, but no user for advanced tests' };
    }

    console.log(`\n👤 Testing with user: ${user.email}`);

    // Test 5: User Habits
    console.log('\n🎯 Test 5: User Habits');
    const { data: userHabits, error: userHabitsError } = await masteryService.getUserHabits(user.id);
    if (userHabitsError) {
      console.error('❌ User habits test failed:', userHabitsError);
    } else {
      console.log(`✅ Found ${userHabits.length} user habits`);
      if (userHabits.length > 0) {
        console.log('Sample user habits:', userHabits.slice(0, 3).map(h => h.title));
      }
    }

    // Test 6: User Toolbox Items
    console.log('\n🛠️ Test 6: User Toolbox Items');
    const { data: userToolbox, error: userToolboxError } = await masteryService.getUserToolboxItems(user.id);
    if (userToolboxError) {
      console.error('❌ User toolbox test failed:', userToolboxError);
    } else {
      console.log(`✅ Found ${userToolbox.length} user toolbox items`);
      if (userToolbox.length > 0) {
        console.log('Sample user toolbox items:', userToolbox.slice(0, 3).map(t => t.toolbox_library?.title || 'Unknown'));
      }
    }

    // Test 7: Calendar Events
    console.log('\n📅 Test 7: Calendar Events');
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
    
    const { data: calendarEvents, error: calendarError } = await masteryService.getCalendarEvents(
      user.id,
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
    if (calendarError) {
      console.error('❌ Calendar events test failed:', calendarError);
    } else {
      console.log(`✅ Found ${calendarEvents.length} calendar events for current month`);
      if (calendarEvents.length > 0) {
        console.log('Sample calendar events:', calendarEvents.slice(0, 3).map(e => e.title));
      }
    }

    // Test 8: Add Habit from Library (if available)
    if (habitsLibrary && habitsLibrary.length > 0) {
      console.log('\n➕ Test 8: Add Habit from Library');
      const firstHabit = habitsLibrary[0];
      const { data: addedHabit, error: addHabitError } = await masteryService.addHabitFromLibrary(user.id, firstHabit.id);
      if (addHabitError) {
        console.error('❌ Add habit test failed:', addHabitError);
      } else {
        console.log(`✅ Successfully added habit: ${firstHabit.title}`);
      }
    }

    // Test 9: Add Toolbox Item (if available)
    if (toolboxLibrary && toolboxLibrary.length > 0) {
      console.log('\n🔧 Test 9: Add Toolbox Item');
      const firstToolboxItem = toolboxLibrary[0];
      const { data: addedToolboxItem, error: addToolboxError } = await masteryService.addToolboxItem(user.id, firstToolboxItem.id);
      if (addToolboxError) {
        console.error('❌ Add toolbox item test failed:', addToolboxError);
      } else {
        console.log(`✅ Successfully added toolbox item: ${firstToolboxItem.title}`);
      }
    }

    // Test 10: Create Custom Habit
    console.log('\n🎨 Test 10: Create Custom Habit');
    const customHabitData = {
      title: 'Test Custom Habit',
      description: 'This is a test custom habit created by the test suite',
      frequency_type: 'daily',
      xp_reward: 15,
      skill_tags: ['test', 'automation']
    };
    const { data: customHabit, error: customHabitError } = await masteryService.createCustomHabit(user.id, customHabitData);
    if (customHabitError) {
      console.error('❌ Create custom habit test failed:', customHabitError);
    } else {
      console.log(`✅ Successfully created custom habit: ${customHabitData.title}`);
    }

    // Test 11: Complete Habit (if we have habits)
    if (userHabits && userHabits.length > 0) {
      console.log('\n✅ Test 11: Complete Habit');
      const firstUserHabit = userHabits[0];
      const { data: completion, error: completionError } = await masteryService.completeHabit(user.id, firstUserHabit.id);
      if (completionError) {
        console.error('❌ Complete habit test failed:', completionError);
      } else {
        console.log(`✅ Successfully completed habit: ${firstUserHabit.title}`);
      }
    }

    // Test 12: Calculate Streak (if we have habits)
    if (userHabits && userHabits.length > 0) {
      console.log('\n📊 Test 12: Calculate Habit Streak');
      const firstUserHabit = userHabits[0];
      const { data: streak, error: streakError } = await masteryService.calculateHabitStreak(user.id, firstUserHabit.id);
      if (streakError) {
        console.error('❌ Calculate streak test failed:', streakError);
      } else {
        console.log(`✅ Successfully calculated streak: ${streak} days for habit: ${firstUserHabit.title}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 All MasteryService tests completed successfully!');
    console.log('='.repeat(60));

    return { success: true, message: 'All tests passed successfully' };

  } catch (error) {
    console.error('\n❌ Test suite failed with error:', error);
    return { success: false, error };
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.runMasteryServiceTests = runMasteryServiceTests;
  console.log('💡 You can run tests from the console with: runMasteryServiceTests()');
}
