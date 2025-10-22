#!/usr/bin/env node

/**
 * Test script to verify the loading fix
 * Run this after starting the dev server to check if the loading issue is resolved
 */

const { createClient } = require('@supabase/supabase-js')

// Test Supabase connection
const supabaseUrl = 'https://mbffycgrqfeesfnhhcdm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmZ5Y2dycWZlZXNmbmhoY2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTEwOTQsImV4cCI6MjA3NDUyNzA5NH0.vRB4oPdeQ4bQBns1tOLEzoS6YWY-RjrK_t65y2D0hTM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
    return false
  }
}

async function testProfilesTable() {
  console.log('🔍 Testing profiles table access...')
  
  try {
    const { data, error } = await supabase.from('profiles').select('id, email, role').limit(5)
    
    if (error) {
      console.error('❌ Profiles table access failed:', error.message)
      return false
    }
    
    console.log('✅ Profiles table accessible, found', data.length, 'profiles')
    if (data.length > 0) {
      console.log('📋 Sample profiles:', data.map(p => ({ id: p.id, email: p.email, role: p.role })))
    }
    return true
  } catch (err) {
    console.error('❌ Profiles table test failed:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting loading fix verification...\n')
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.log('\n❌ Connection test failed. Please check your Supabase configuration.')
    process.exit(1)
  }
  
  const profilesOk = await testProfilesTable()
  if (!profilesOk) {
    console.log('\n❌ Profiles table test failed. Please check your database setup.')
    process.exit(1)
  }
  
  console.log('\n✅ All tests passed!')
  console.log('\n📋 Next steps:')
  console.log('1. Open your browser to http://localhost:3000')
  console.log('2. Open Developer Tools (F12) and go to Console tab')
  console.log('3. Look for the debug logs starting with 🔍, 👤, 📥, ✅')
  console.log('4. The loading should resolve within 3 seconds due to the force timeout')
  console.log('5. If you see any ❌ errors, check the console output above')
}

main().catch(console.error)
