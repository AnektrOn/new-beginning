// Test script for signup functionality
// Run with: node test-signup.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please ensure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSignup() {
  console.log('🧪 Testing Signup Flow...\n')
  
  // Generate unique test email
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123'
  const testFullName = 'Test User'
  
  try {
    console.log('1. Testing user signup...')
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testFullName
        }
      }
    })
    
    if (error) {
      console.error('❌ Signup failed:', error.message)
      return
    }
    
    console.log('✅ User created successfully')
    console.log('   - User ID:', data.user?.id)
    console.log('   - Email:', data.user?.email)
    console.log('   - Session available:', !!data.session)
    
    if (data.user && data.session) {
      console.log('✅ User is immediately signed in (email confirmation disabled)')
      
      // Test profile creation
      console.log('\n2. Testing profile creation...')
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: testFullName,
          role: 'Free'
        })
        .select()
        .single()
      
      if (profileError) {
        console.error('❌ Profile creation failed:', profileError.message)
      } else {
        console.log('✅ Profile created successfully')
        console.log('   - Profile ID:', profileData.id)
        console.log('   - Full Name:', profileData.full_name)
        console.log('   - Role:', profileData.role)
      }
      
      // Test sign out
      console.log('\n3. Testing sign out...')
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error('❌ Sign out failed:', signOutError.message)
      } else {
        console.log('✅ User signed out successfully')
      }
      
    } else if (data.user && !data.session) {
      console.log('ℹ️  User created but email confirmation required')
    }
    
    console.log('\n🎉 Signup flow test completed!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

async function testSignIn() {
  console.log('\n🧪 Testing Sign In Flow...\n')
  
  const testEmail = 'test@example.com' // Use existing test account
  const testPassword = 'TestPassword123'
  
  try {
    console.log('1. Testing user sign in...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (error) {
      console.error('❌ Sign in failed:', error.message)
      return
    }
    
    console.log('✅ User signed in successfully')
    console.log('   - User ID:', data.user?.id)
    console.log('   - Email:', data.user?.email)
    
    // Test profile fetch
    console.log('\n2. Testing profile fetch...')
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (profileError) {
      console.error('❌ Profile fetch failed:', profileError.message)
    } else {
      console.log('✅ Profile fetched successfully')
      console.log('   - Profile ID:', profileData.id)
      console.log('   - Full Name:', profileData.full_name)
      console.log('   - Role:', profileData.role)
    }
    
    console.log('\n🎉 Sign in flow test completed!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Authentication Tests\n')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing')
  console.log('')
  
  await testSignup()
  await testSignIn()
  
  console.log('\n✨ All tests completed!')
}

runTests().catch(console.error)
