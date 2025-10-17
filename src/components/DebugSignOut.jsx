import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const DebugSignOut = () => {
  const { user, profile, signOut } = useAuth()
  const [debugInfo, setDebugInfo] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setDebugInfo('Starting sign out process...')
    
    try {
      console.log('🔍 Debug: User before sign out:', user)
      console.log('🔍 Debug: Profile before sign out:', profile)
      
      setDebugInfo(prev => prev + '\nCalling signOut function...')
      
      const result = await signOut()
      
      console.log('🔍 Debug: Sign out result:', result)
      setDebugInfo(prev => prev + `\nSign out result: ${JSON.stringify(result)}`)
      
      if (result.error) {
        setDebugInfo(prev => prev + `\n❌ Error: ${result.error.message}`)
        setIsSigningOut(false)
        return
      }
      
      setDebugInfo(prev => prev + '\n✅ Sign out successful!')
      
      // Check if user is actually signed out
      setTimeout(() => {
        console.log('🔍 Debug: Checking user state after sign out...')
        setDebugInfo(prev => prev + '\nChecking user state after sign out...')
      }, 1000)
      
    } catch (error) {
      console.error('🔍 Debug: Sign out error:', error)
      setDebugInfo(prev => prev + `\n❌ Exception: ${error.message}`)
      setIsSigningOut(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Debug Sign Out</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Current State:</h3>
          <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
          <p><strong>Profile:</strong> {profile ? profile.full_name || 'No name' : 'No profile'}</p>
        </div>
        
        <Button 
          onClick={handleSignOut} 
          disabled={isSigningOut}
          variant="destructive"
        >
          {isSigningOut ? 'Signing Out...' : 'Test Sign Out'}
        </Button>
        
        {debugInfo && (
          <div>
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {debugInfo}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DebugSignOut
