import React, { useState } from 'react'

const SimpleSupabaseTest = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Test 1: Check if we can import supabase
      console.log('Testing Supabase import...')
      const { supabase } = await import('../lib/supabaseClient')
      console.log('Supabase imported successfully:', !!supabase)

      // Test 2: Check environment variables
      const url = process.env.REACT_APP_SUPABASE_URL
      const key = process.env.REACT_APP_SUPABASE_ANON_KEY
      console.log('Environment variables:', { url: !!url, key: !!key })

      // Test 3: Try a simple auth call
      console.log('Testing auth.getSession...')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log('Session result:', { sessionData, sessionError })

      // Test 4: Try a simple query
      console.log('Testing profiles query...')
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      console.log('Profiles result:', { profilesData, profilesError })

      setResult({
        success: true,
        message: 'All tests passed!',
        details: {
          supabaseImported: true,
          envVars: { url: !!url, key: !!key },
          session: sessionError ? `Error: ${sessionError.message}` : 'Success',
          profiles: profilesError ? `Error: ${profilesError.message}` : 'Success'
        }
      })

    } catch (error) {
      console.error('Test failed:', error)
      setResult({
        success: false,
        message: `Test failed: ${error.message}`,
        details: {
          error: error.toString(),
          stack: error.stack
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="font-semibold mb-2">Simple Supabase Test</h3>
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Simple Test'}
      </button>
      
      {result && (
        <div className="mt-4 p-3 border rounded">
          <p className={`font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.message}
          </p>
          {result.details && (
            <div className="mt-2 text-sm text-gray-600">
              {Object.entries(result.details).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <strong>{key}:</strong> 
                  <pre className="text-xs bg-gray-100 p-1 rounded mt-1 overflow-auto">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SimpleSupabaseTest
