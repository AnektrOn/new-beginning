import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const SupabaseTest = () => {
  const [testResult, setTestResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const testSupabase = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      console.log('Testing Supabase connection...')
      
      // Test 1: Check if supabase client exists
      if (!supabase) {
        throw new Error('Supabase client is not initialized')
      }

      // Test 2: Try to get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log('Session test result:', { sessionData, sessionError })

      // Test 3: Try to query a simple table
      const { data: tableData, error: tableError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      console.log('Table test result:', { tableData, tableError })

      setTestResult({
        success: true,
        message: 'Supabase connection successful!',
        details: {
          session: sessionError ? `Session error: ${sessionError.message}` : 'Session OK',
          table: tableError ? `Table error: ${tableError.message}` : 'Table access OK'
        }
      })

    } catch (error) {
      console.error('Supabase test error:', error)
      setTestResult({
        success: false,
        message: `Error: ${error.message}`,
        details: {
          error: error.toString()
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Supabase Direct Test</h3>
      <button
        onClick={testSupabase}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Supabase'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-3 border rounded">
          <p className={`font-medium ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
            {testResult.message}
          </p>
          {testResult.details && (
            <div className="mt-2 text-sm text-gray-600">
              {Object.entries(testResult.details).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SupabaseTest
