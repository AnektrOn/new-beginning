const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testFullNameIssue() {
  console.log('\n🔍 Testing Full Name Issue...')
  
  // Test 1: Try signup with full name in metadata
  console.log('1. Testing signup with full name in metadata...')
  const testEmail = `fullname-test-${Date.now()}@example.com`
  const testPassword = 'Password123'
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User Full Name'
        }
      }
    })

    if (error) {
      console.error('❌ Signup with full name failed:', error.message)
    } else {
      console.log('✅ Signup with full name successful!')
      console.log('User:', data.user?.email)
      console.log('Metadata:', data.user?.user_metadata)
      return { success: true, data }
    }
  } catch (error) {
    console.error('❌ Signup with full name exception:', error.message)
  }

  // Test 2: Try signup without full name
  console.log('\n2. Testing signup without full name...')
  const testEmail2 = `no-fullname-${Date.now()}@example.com`
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail2,
      password: testPassword
    })

    if (error) {
      console.error('❌ Signup without full name failed:', error.message)
    } else {
      console.log('✅ Signup without full name successful!')
      console.log('User:', data.user?.email)
      console.log('Metadata:', data.user?.user_metadata)
      return { success: true, data }
    }
  } catch (error) {
    console.error('❌ Signup without full name exception:', error.message)
  }

  return { success: false, error: 'Both tests failed' }
}

async function runFullNameTest() {
  console.log('🚀 Starting Full Name Issue Test')
  console.log(`\nSupabase URL: ${supabaseUrl}`)
  console.log(`Supabase Key: ${supabaseAnonKey ? '✅ Present' : '❌ Missing'}`)

  const result = await testFullNameIssue()
  
  if (result.success) {
    console.log('\n✅ Signup works! The issue might be with full name handling.')
  } else {
    console.log('\n❌ Both signup tests failed. The issue is deeper than full name.')
  }

  console.log('\n✨ Full name test completed!')
}

runFullNameTest()
