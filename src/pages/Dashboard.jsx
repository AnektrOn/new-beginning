import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SignupTest from '../components/SignupTest'

const Dashboard = () => {
  const { user, profile, signOut, fetchProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Handle payment success redirect
  useEffect(() => {
    const payment = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')
    
    if (payment === 'success' && sessionId && user) {
      // Show alert to confirm payment success
      alert('🎉 Payment completed! Processing your subscription...')
      
      console.log('Payment success detected:', { sessionId, userId: user.id })
      
      // Call payment success endpoint to update role
      fetch(`http://localhost:3001/api/payment-success?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Payment success response:', data)
          alert(`✅ Subscription activated! Your role is now: ${data.role}`)
          
          // Refresh profile to get updated subscription status
          fetchProfile(user.id)
          
          // Clean up URL
          navigate('/dashboard', { replace: true })
        })
        .catch(error => {
          console.error('Error processing payment success:', error)
          alert('⚠️ Payment completed but there was an error updating your subscription. Please refresh the page.')
          
          // Still try to refresh profile
          fetchProfile(user.id)
          navigate('/dashboard', { replace: true })
        })
    }
  }, [searchParams, user, fetchProfile, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const userRole = profile?.role || 'Free'
  const displayName = profile?.full_name || user?.email || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {displayName}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                userRole === 'Free' ? 'bg-gray-100 text-gray-800' :
                userRole === 'Student' ? 'bg-blue-100 text-blue-800' :
                userRole === 'Teacher' ? 'bg-purple-100 text-purple-800' :
                'bg-red-100 text-red-800'
              }`}>
                {userRole}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Profile
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {displayName}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <button
                    onClick={() => navigate('/profile')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View profile
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Subscription
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {userRole}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {userRole === 'Free' ? 'Upgrade plan' : 'Manage subscription'}
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Level
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {profile?.level || 1}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="text-gray-500">
                    {profile?.current_xp || 0} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Test - Remove in production */}
          <div className="mt-8">
            <SignupTest />
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👤</div>
                  <div className="text-sm font-medium text-gray-900">Profile</div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/pricing')}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💳</div>
                  <div className="text-sm font-medium text-gray-900">Pricing</div>
                </div>
              </button>
              
              <button className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm font-medium text-gray-900">Courses</div>
                </div>
              </button>
              
              <button className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-sm font-medium text-gray-900">Settings</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard