import { createClient } from '@supabase/supabase-js'

// Use hardcoded values to fix loading issues
const supabaseUrl = 'https://mbffycgrqfeesfnhhcdm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmZ5Y2dycWZlZXNmbmhoY2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTEwOTQsImV4cCI6MjA3NDUyNzA5NH0.vRB4oPdeQ4bQBns1tOLEzoS6YWY-RjrK_t65y2D0hTM'
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY).');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})