// Simple test to check Supabase connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('Environment variables:')
console.log('URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('Key:', supabaseAnonKey ? 'Present' : 'Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth error:', error)
    } else {
      console.log('Auth connection successful:', !!data.session)
    }
    
    // Test database connection
    const { data: profiles, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (dbError) {
      console.error('Database error:', dbError)
    } else {
      console.log('Database connection successful')
    }
    
  } catch (err) {
    console.error('Connection test failed:', err)
  }
}

testConnection()
