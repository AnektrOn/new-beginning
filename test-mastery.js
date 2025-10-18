// Simple test script to validate mastery service
// Run with: node test-mastery.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMasteryService() {
  console.log('🧪 Testing Mastery Service...');
  console.log('='.repeat(50));

  try {
    // Test 1: Check habits_library table
    console.log('\n📚 Test 1: Habits Library Table');
    const { data: habitsLibrary, error: habitsError } = await supabase
      .from('habits_library')
      .select('*')
      .limit(5);

    if (habitsError) {
      console.error('❌ Habits library error:', habitsError);
    } else {
      console.log(`✅ Found ${habitsLibrary.length} habits in library`);
      habitsLibrary.forEach(habit => {
        console.log(`   - ${habit.title} (${habit.category}) - ${habit.xp_reward} XP`);
      });
    }

    // Test 2: Check toolbox_library table
    console.log('\n🔧 Test 2: Toolbox Library Table');
    const { data: toolboxLibrary, error: toolboxError } = await supabase
      .from('toolbox_library')
      .select('*')
      .limit(5);

    if (toolboxError) {
      console.error('❌ Toolbox library error:', toolboxError);
    } else {
      console.log(`✅ Found ${toolboxLibrary.length} toolbox items in library`);
      toolboxLibrary.forEach(tool => {
        console.log(`   - ${tool.title} (${tool.category}) - ${tool.xp_reward} XP`);
      });
    }

    // Test 3: Check user_habits table
    console.log('\n🎯 Test 3: User Habits Table');
    const { data: userHabits, error: userHabitsError } = await supabase
      .from('user_habits')
      .select('*')
      .limit(5);

    if (userHabitsError) {
      console.error('❌ User habits error:', userHabitsError);
    } else {
      console.log(`✅ Found ${userHabits.length} user habits`);
      userHabits.forEach(habit => {
        console.log(`   - ${habit.title} (${habit.frequency_type}) - ${habit.completion_count} completions`);
      });
    }

    // Test 4: Check user_habit_completions table
    console.log('\n✅ Test 4: User Habit Completions Table');
    const { data: completions, error: completionsError } = await supabase
      .from('user_habit_completions')
      .select('*')
      .limit(5);

    if (completionsError) {
      console.error('❌ Habit completions error:', completionsError);
    } else {
      console.log(`✅ Found ${completions.length} habit completions`);
      completions.forEach(completion => {
        console.log(`   - Habit ${completion.habit_id} completed on ${completion.completed_at} - ${completion.xp_earned} XP`);
      });
    }

    // Test 5: Check user_calendar_events table
    console.log('\n📅 Test 5: User Calendar Events Table');
    const { data: calendarEvents, error: calendarError } = await supabase
      .from('user_calendar_events')
      .select('*')
      .limit(5);

    if (calendarError) {
      console.error('❌ Calendar events error:', calendarError);
    } else {
      console.log(`✅ Found ${calendarEvents.length} calendar events`);
      calendarEvents.forEach(event => {
        console.log(`   - ${event.title} on ${event.event_date} - ${event.xp_reward} XP`);
      });
    }

    // Test 6: Check user_toolbox_items table
    console.log('\n🛠️ Test 6: User Toolbox Items Table');
    const { data: toolboxItems, error: toolboxItemsError } = await supabase
      .from('user_toolbox_items')
      .select('*')
      .limit(5);

    if (toolboxItemsError) {
      console.error('❌ User toolbox items error:', toolboxItemsError);
    } else {
      console.log(`✅ Found ${toolboxItems.length} user toolbox items`);
      toolboxItems.forEach(item => {
        console.log(`   - Toolbox item ${item.toolbox_id} - Active: ${item.is_active}`);
      });
    }

    // Test 7: Check user_toolbox_usage table
    console.log('\n📊 Test 7: User Toolbox Usage Table');
    const { data: toolboxUsage, error: toolboxUsageError } = await supabase
      .from('user_toolbox_usage')
      .select('*')
      .limit(5);

    if (toolboxUsageError) {
      console.error('❌ Toolbox usage error:', toolboxUsageError);
    } else {
      console.log(`✅ Found ${toolboxUsage.length} toolbox usage records`);
      toolboxUsage.forEach(usage => {
        console.log(`   - Toolbox item ${usage.toolbox_item_id} used on ${usage.used_at} - ${usage.xp_earned} XP`);
      });
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All database table tests completed!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMasteryService();
