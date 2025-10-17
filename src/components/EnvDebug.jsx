import React from 'react'

const EnvDebug = () => {
  const envVars = {
    'REACT_APP_SUPABASE_URL': process.env.REACT_APP_SUPABASE_URL,
    'REACT_APP_SUPABASE_ANON_KEY': process.env.REACT_APP_SUPABASE_ANON_KEY,
    'REACT_APP_STRIPE_PUBLISHABLE_KEY': process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    'NODE_ENV': process.env.NODE_ENV,
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Environment Variables Debug</h3>
      <div className="space-y-2 text-sm">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-mono">{key}:</span>
            <span className={`font-mono ${value ? 'text-green-600' : 'text-red-600'}`}>
              {value ? (key.includes('KEY') ? '***' + value.slice(-4) : value) : 'undefined'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: Keys are partially hidden for security</p>
      </div>
    </div>
  )
}

export default EnvDebug
