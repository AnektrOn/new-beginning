const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugFunctionIssue() {
  console.log('\n🔍 Debugging Function Issue...')
  
  // Test 1: Try to call the function directly
  console.log('1. Testing function call directly...')
  try {
    const { data, error } = await supabase.rpc('initialize_user_skills_and_stats', {
      user_uuid: '00000000-0000-0000-0000-000000000000'
    })
    
    if (error) {
      console.error('❌ Function call failed:', error.message)
      console.error('Error details:', error)
    } else {
      console.log('✅ Function call successful:', data)
    }
  } catch (error) {
    console.error('❌ Function call failed with exception:', error.message)
  }

  // Test 2: Check if we can create a user with minimal data
  console.log('\n2. Testing minimal user creation...')
  const testEmail = `debug-test-${Date.now()}@example.com`
  const testPassword = 'Password123'
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (error) {
      console.error('❌ Minimal signup failed:', error.message)
      console.error('Error details:', error)
      
      // Check if it's a specific error
      if (error.message.includes('Database error')) {
        console.log('\n🔍 This is a database error - likely a trigger issue')
      }
    } else {
      console.log('✅ Minimal signup successful:', data.user?.email)
    }
  } catch (error) {
    console.error('❌ Minimal signup failed with exception:', error.message)
  }

  // Test 3: Check if we can create a profile manually
  console.log('\n3. Testing manual profile creation...')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'Free'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Manual profile creation failed:', error.message)
    } else {
      console.log('✅ Manual profile creation successful:', data)
    }
  } catch (error) {
    console.error('❌ Manual profile creation failed with exception:', error.message)
  }
}

async function runDebug() {
  console.log('🚀 Starting Function Debug')
  console.log(`\nSupabase URL: ${supabaseUrl}`)
  console.log(`Supabase Key: ${supabaseAnonKey ? '✅ Present' : '❌ Missing'}`)

  await debugFunctionIssue()
  
  console.log('\n✨ Debug completed!')
}

runDebug()
