#!/usr/bin/env node

/**
 * Test script to verify the compact components are working with database
 */

const { createClient } = require('@supabase/supabase-js')

// Test Supabase connection
const supabaseUrl = 'https://mbffycgrqfeesfnhhcdm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmZ5Y2dycWZlZXNmbmhoY2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTEwOTQsImV4cCI6MjA3NDUyNzA5NH0.vRB4oPdeQ4bQBns1tOLEzoS6YWY-RjrK_t65y2D0hTM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testComponentsData() {
  console.log('🔍 Testing components data loading...')
  
  try {
    // Test habits library
    const { data: habitsLibrary, error: habitsError } = await supabase
      .from('habits_library')
      .select('*')
    
    if (habitsError) {
      console.error('❌ Habits library error:', habitsError.message)
      return false
    }
    
    console.log(`✅ Habits library: ${habitsLibrary.length} items`)
    console.log('📋 Sample habits:')
    habitsLibrary.slice(0, 5).forEach((habit, index) => {
      console.log(`  ${index + 1}. ${habit.title} - ${habit.xp_reward} XP`)
    })
    
    // Test toolbox library
    const { data: toolboxLibrary, error: toolboxError } = await supabase
      .from('toolbox_library')
      .select('*')
    
    if (toolboxError) {
      console.error('❌ Toolbox library error:', toolboxError.message)
      return false
    }
    
    console.log(`✅ Toolbox library: ${toolboxLibrary.length} items`)
    console.log('📋 Sample tools:')
    toolboxLibrary.slice(0, 5).forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.title} - ${tool.xp_reward} XP`)
    })
    
    return true
  } catch (err) {
    console.error('❌ Test failed:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Testing compact components data loading...\n')
  
  const success = await testComponentsData()
  
  if (success) {
    console.log('\n✅ Components should be working!')
    console.log('\n📋 What you should see:')
    console.log('1. Habits tab should show 13 habits in the library')
    console.log('2. Toolbox tab should show 8 tools in the library')
    console.log('3. Both tabs start on "Library" view by default')
    console.log('4. You can add items from library to your personal collection')
    console.log('5. Compact card design with progress grids')
    
    console.log('\n🔍 If you still see empty components:')
    console.log('1. Check browser console for error messages')
    console.log('2. Look for logs starting with 📝 (habits) and 🔧 (toolbox)')
    console.log('3. Make sure you are logged in with a valid user')
    console.log('4. Check if there are any network errors in browser dev tools')
    
    console.log('\n🎯 Expected behavior:')
    console.log('- Library tab shows all available habits/tools')
    console.log('- Personal tab shows your added habits/tools (empty initially)')
    console.log('- You can add items from library to personal collection')
    console.log('- Compact design with small cards and progress grids')
  } else {
    console.log('\n❌ Components may have issues. Check the errors above.')
  }
}

main().catch(console.error)
