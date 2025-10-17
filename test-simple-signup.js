const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSimpleSignup() {
  console.log('\n🧪 Testing Simple Signup (No Profile Creation)...')
  const testEmail = `simple-test-${Date.now()}@example.com`
  const testPassword = 'Password123'

  console.log('1. Testing basic user signup...')
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (error) {
      console.error('❌ Signup failed:', error.message)
      console.error('Error details:', error)
      return { success: false, error }
    }

    if (data.user) {
      console.log('✅ User created successfully:', data.user.email)
      console.log('User ID:', data.user.id)
      console.log('Session available:', !!data.session)
      
      if (data.session) {
        console.log('✅ User is immediately signed in')
      } else {
        console.log('⚠️  User needs email confirmation')
      }
      
      return { success: true, user: data.user, session: data.session }
    } else {
      console.error('❌ No user returned from signup')
      return { success: false, error: 'No user returned' }
    }
  } catch (error) {
    console.error('❌ Signup failed with exception:', error.message)
    return { success: false, error }
  }
}

async function testProfileCreation(userId) {
  console.log('\n🧪 Testing Profile Creation...')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'Free'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Profile creation failed:', error.message)
      return { success: false, error }
    }

    console.log('✅ Profile created successfully:', data)
    return { success: true, profile: data }
  } catch (error) {
    console.error('❌ Profile creation failed with exception:', error.message)
    return { success: false, error }
  }
}

async function runTests() {
  console.log('🚀 Starting Simple Signup Tests')
  console.log(`\nSupabase URL: ${supabaseUrl}`)
  console.log(`Supabase Key: ${supabaseAnonKey ? '✅ Present' : '❌ Missing'}`)

  // Test 1: Simple signup
  const signupResult = await testSimpleSignup()
  
  if (signupResult.success && signupResult.user) {
    // Test 2: Profile creation
    const profileResult = await testProfileCreation(signupResult.user.id)
    
    if (profileResult.success) {
      console.log('\n✅ All tests passed! Signup and profile creation work.')
    } else {
      console.log('\n⚠️  Signup works but profile creation failed.')
    }
  } else {
    console.log('\n❌ Signup failed. The issue is with user creation itself.')
  }

  console.log('\n✨ Tests completed!')
}

runTests()
