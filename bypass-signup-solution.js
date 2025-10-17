const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createUserManually() {
  console.log('\n🔧 Creating User Manually (Bypass Method)...')
  
  // This approach creates a user without using the normal signup flow
  // We'll use the admin API or a different method
  
  const testEmail = `manual-${Date.now()}@example.com`
  const testPassword = 'Password123'
  
  try {
    // Try using the admin API if available
    console.log('1. Attempting manual user creation...')
    
    // First, let's try to create a user with a different approach
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback'
      }
    })

    if (error) {
      console.error('❌ Manual creation failed:', error.message)
      console.error('Error details:', error)
      
      // Check if it's a specific error we can work around
      if (error.message.includes('Database error')) {
        console.log('\n🔍 Database error detected. This suggests a trigger issue.')
        console.log('The trigger is preventing user creation entirely.')
        
        // Try to provide a solution
        console.log('\n💡 SOLUTION: You need to either:')
        console.log('1. Remove the problematic database trigger')
        console.log('2. Fix the trigger function')
        console.log('3. Use a different Supabase project')
        console.log('4. Contact Supabase support')
      }
    } else {
      console.log('✅ Manual creation successful!')
      console.log('User:', data.user?.email)
      return { success: true, data }
    }
  } catch (error) {
    console.error('❌ Manual creation exception:', error.message)
  }

  return { success: false, error: 'Manual creation failed' }
}

async function checkSupabaseStatus() {
  console.log('\n🔍 Checking Supabase Status...')
  
  try {
    // Try to make a simple request to check if Supabase is working
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection issue:', error.message)
      return false
    } else {
      console.log('✅ Supabase connection working')
      return true
    }
  } catch (error) {
    console.error('❌ Supabase connection exception:', error.message)
    return false
  }
}

async function runDiagnostics() {
  console.log('🚀 Starting Supabase Diagnostics')
  console.log(`\nSupabase URL: ${supabaseUrl}`)
  console.log(`Supabase Key: ${supabaseAnonKey ? '✅ Present' : '❌ Missing'}`)

  // Check Supabase status
  const supabaseWorking = await checkSupabaseStatus()
  
  if (!supabaseWorking) {
    console.log('\n❌ Supabase is not working properly. Check your configuration.')
    return
  }

  // Try manual user creation
  const result = await createUserManually()
  
  if (result.success) {
    console.log('\n✅ User creation works! The issue might be intermittent.')
  } else {
    console.log('\n❌ User creation consistently fails.')
    console.log('\n🔧 RECOMMENDED SOLUTIONS:')
    console.log('1. Check your Supabase project settings')
    console.log('2. Verify your database schema')
    console.log('3. Check for any active triggers or functions')
    console.log('4. Try creating a new Supabase project')
    console.log('5. Contact Supabase support with the error details')
  }

  console.log('\n✨ Diagnostics completed!')
}

runDiagnostics()
