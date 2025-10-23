// Test script to run in browser console to debug skills loading
console.log('🧪 Testing Skills Service in Browser...');

// Test 1: Check if skillsService is imported correctly
try {
  console.log('1. Testing skillsService import...');
  // This would be run in browser console after importing
  console.log('✅ skillsService should be available');
} catch (error) {
  console.log('❌ skillsService import failed:', error);
}

// Test 2: Check if skills are loading
async function testSkillsLoading() {
  try {
    console.log('2. Testing skills loading...');
    
    // This would be run in browser console
    const { data: skills, error } = await skillsService.getAllSkills();
    
    if (error) {
      console.log('❌ Skills loading error:', error);
      return;
    }
    
    console.log(`✅ Loaded ${skills.length} skills`);
    console.log('Sample skills:', skills.slice(0, 3));
    
    // Test 3: Check habits library
    console.log('3. Testing habits library...');
    const { data: habits, error: habitsError } = await supabase
      .from('habits_library')
      .select('id, title, skill_tags')
      .limit(3);
    
    if (habitsError) {
      console.log('❌ Habits loading error:', habitsError);
      return;
    }
    
    console.log(`✅ Loaded ${habits.length} habits`);
    habits.forEach(habit => {
      console.log(`  - ${habit.title}: ${habit.skill_tags?.length || 0} skills`);
    });
    
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

console.log('To test in browser console, run: testSkillsLoading()');
