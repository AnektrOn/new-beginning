import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SignupTest from '../components/SignupTest'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import Breadcrumbs from '../components/common/Breadcrumbs'
import SkeletonLoader from '../components/common/SkeletonLoader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'
import EmptyState from '../components/common/EmptyState'
import { Home, User, CreditCard, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user, profile, signOut, fetchProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Retry logic here if needed
    setTimeout(() => setLoading(false), 1000)
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <ErrorDisplay
          title="Failed to load dashboard"
          message={error}
          onRetry={handleRetry}
          onGoHome={() => navigate('/dashboard')}
          variant="card"
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Breadcrumbs - Hidden on mobile */}
      <div className="mb-4 hidden lg:block">
        <Breadcrumbs
          customItems={[
            { label: 'Home', path: '/dashboard', icon: Home }
          ]}
        />
      </div>

      {/* Mobile-Optimized Header */}
      <header className="mb-4 lg:mb-6">
        <div className="dashboard-header flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Welcome back, {displayName}</p>
          </div>
          <div className="dashboard-header-actions flex items-center space-x-2">
            <Badge
              variant={userRole === 'Free' ? 'secondary' : userRole === 'Student' ? 'default' : 'outline'}
              className={
                userRole === 'Free' ? '' :
                userRole === 'Student' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                userRole === 'Teacher' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }
            >
              {userRole}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <SkeletonLoader type="card" count={3} variant="glass" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Profile Card */}
              <Card className="glass-effect-enhanced border-slate-600/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-medium text-lg">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <CardTitle className="text-xs sm:text-sm font-medium text-slate-400 truncate mb-1">
                        Profile
                      </CardTitle>
                      <p className="text-base sm:text-lg font-medium text-white truncate">
                        {displayName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="bg-slate-700/30 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
                  >
                    View profile →
                  </Button>
                </CardFooter>
              </Card>

              {/* Subscription Card */}
              <Card className="glass-effect-enhanced border-slate-600/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <CardTitle className="text-xs sm:text-sm font-medium text-slate-400 truncate mb-1">
                        Subscription
                      </CardTitle>
                      <p className="text-base sm:text-lg font-medium text-white truncate">
                        {userRole}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="bg-slate-700/30 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/pricing')}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
                  >
                    {userRole === 'Free' ? 'Upgrade plan →' : 'Manage subscription →'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Progress Card */}
              <Card className="glass-effect-enhanced border-slate-600/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <CardTitle className="text-xs sm:text-sm font-medium text-slate-400 truncate mb-1">
                        Level
                      </CardTitle>
                      <p className="text-base sm:text-lg font-medium text-white truncate">
                        Level {profile?.level || 1}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="bg-slate-700/30 pt-3">
                  <div className="text-sm">
                    <span className="text-yellow-400 font-medium">
                      {profile?.current_xp || 0} XP
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </div>

          {/* Signup Test - Remove in production - Hide on mobile */}
          <div className="hidden lg:block">
            <SignupTest />
          </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="dashboard-quick-actions grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card
                  className="glass-effect-enhanced border-slate-600/50 hover:border-emerald-500/50 cursor-pointer transition-all"
                  onClick={() => navigate('/profile')}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl mb-2">👤</div>
                    <div className="text-xs sm:text-sm font-medium text-white">Profile</div>
                  </CardContent>
                </Card>
                
                <Card
                  className="glass-effect-enhanced border-slate-600/50 hover:border-emerald-500/50 cursor-pointer transition-all"
                  onClick={() => navigate('/pricing')}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl mb-2">💳</div>
                    <div className="text-xs sm:text-sm font-medium text-white">Pricing</div>
                  </CardContent>
                </Card>
                
                <Card
                  className="glass-effect-enhanced border-slate-600/50 hover:border-emerald-500/50 cursor-pointer transition-all"
                  onClick={() => navigate('/mastery')}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl mb-2">🎯</div>
                    <div className="text-xs sm:text-sm font-medium text-white">Mastery</div>
                  </CardContent>
                </Card>
                
                <Card
                  className="glass-effect-enhanced border-slate-600/50 hover:border-emerald-500/50 cursor-pointer transition-all"
                  onClick={() => navigate('/community')}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl mb-2">👥</div>
                    <div className="text-xs sm:text-sm font-medium text-white">Community</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard