const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAlternativeSignup() {
  console.log('\n🧪 Testing Alternative Signup Approaches...')
  const testEmail = `alt-test-${Date.now()}@example.com`
  const testPassword = 'Password123'

  // Approach 1: Try with different options
  console.log('1. Testing signup with different options...')
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: undefined,
        data: {}
      }
    })

    if (error) {
      console.error('❌ Approach 1 failed:', error.message)
    } else {
      console.log('✅ Approach 1 successful!')
      console.log('User:', data.user?.email)
      console.log('Session:', !!data.session)
      return { success: true, data }
    }
  } catch (error) {
    console.error('❌ Approach 1 exception:', error.message)
  }

  // Approach 2: Try with minimal data
  console.log('\n2. Testing signup with minimal data...')
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (error) {
      console.error('❌ Approach 2 failed:', error.message)
    } else {
      console.log('✅ Approach 2 successful!')
      console.log('User:', data.user?.email)
      console.log('Session:', !!data.session)
      return { success: true, data }
    }
  } catch (error) {
    console.error('❌ Approach 2 exception:', error.message)
  }

  // Approach 3: Try with different email format
  console.log('\n3. Testing signup with different email format...')
  const altEmail = `test${Date.now()}@example.com`
  try {
    const { data, error } = await supabase.auth.signUp({
      email: altEmail,
      password: testPassword
    })

    if (error) {
      console.error('❌ Approach 3 failed:', error.message)
    } else {
      console.log('✅ Approach 3 successful!')
      console.log('User:', data.user?.email)
      console.log('Session:', !!data.session)
      return { success: true, data }
    }
  } catch (error) {
    console.error('❌ Approach 3 exception:', error.message)
  }

  return { success: false, error: 'All approaches failed' }
}

async function testSignIn() {
  console.log('\n🧪 Testing Sign In...')
  const testEmail = 'humancatalystnote@gmail.com' // Use existing user
  const testPassword = 'Password123'

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (error) {
      console.error('❌ Sign in failed:', error.message)
      return { success: false, error }
    } else {
      console.log('✅ Sign in successful!')
      console.log('User:', data.user?.email)
      return { success: true, data }
    }
  } catch (error) {
    console.error('❌ Sign in exception:', error.message)
    return { success: false, error }
  }
}

async function runTests() {
  console.log('🚀 Starting Alternative Signup Tests')
  console.log(`\nSupabase URL: ${supabaseUrl}`)
  console.log(`Supabase Key: ${supabaseAnonKey ? '✅ Present' : '❌ Missing'}`)

  // Test signup
  const signupResult = await testAlternativeSignup()
  
  if (signupResult.success) {
    console.log('\n✅ Signup works! The issue might be with specific configurations.')
  } else {
    console.log('\n❌ All signup approaches failed. Testing sign in...')
    
    // Test sign in to see if the issue is with signup specifically
    const signInResult = await testSignIn()
    
    if (signInResult.success) {
      console.log('\n✅ Sign in works! The issue is specifically with signup.')
    } else {
      console.log('\n❌ Both signup and sign in failed. This might be a broader auth issue.')
    }
  }

  console.log('\n✨ Tests completed!')
}

runTests()
