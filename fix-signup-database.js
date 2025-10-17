// Script to fix the signup database issue by running the missing SQL
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config()

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please ensure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixDatabase() {
  console.log('🔧 Fixing database signup issue...\n')
  
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('CREATE_SKILLS_SYSTEM.sql', 'utf8')
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`\n${i + 1}. Executing statement...`)
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.log(`   ⚠️  Statement ${i + 1} had an issue:`, error.message)
          // Continue with other statements
        } else {
          console.log(`   ✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.log(`   ⚠️  Statement ${i + 1} failed:`, err.message)
      }
    }
    
    console.log('\n🎉 Database fix completed!')
    console.log('\nNow testing signup...')
    
    // Test signup
    await testSignup()
    
  } catch (error) {
    console.error('❌ Error fixing database:', error.message)
  }
}

async function testSignup() {
  // Create a new Supabase client with anon key for testing
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
  const testSupabase = createClient(supabaseUrl, supabaseAnonKey)
  
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123'
  const testFullName = 'Test User'
  
  try {
    console.log('🧪 Testing signup with fixed database...')
    
    const { data, error } = await testSupabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testFullName
        }
      }
    })
    
    if (error) {
      console.error('❌ Signup still failed:', error.message)
    } else {
      console.log('✅ Signup successful!')
      console.log('   - User ID:', data.user?.id)
      console.log('   - Email:', data.user?.email)
      console.log('   - Session available:', !!data.session)
      
      if (data.user && data.session) {
        console.log('✅ User is immediately signed in')
      } else {
        console.log('ℹ️  User needs email verification')
      }
    }
    
  } catch (error) {
    console.error('❌ Test signup failed:', error.message)
  }
}

// Run the fix
fixDatabase().catch(console.error)
