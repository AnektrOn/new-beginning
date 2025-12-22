import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import LoadingSpinner from '../components/common/LoadingSpinner'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e1fd222d-4bbd-4d1f-896a-e639b5e7b121',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.jsx:14',message:'Login form submitted',data:{email:email.trim(),hasPassword:!!password.trim()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }
    
    if (!password.trim()) {
      toast.error('Please enter your password')
      return
    }
    
    setLoading(true)

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e1fd222d-4bbd-4d1f-896a-e639b5e7b121',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.jsx:30',message:'Calling signIn - before',data:{email:email.trim()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const { error } = await signIn(email, password)
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e1fd222d-4bbd-4d1f-896a-e639b5e7b121',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.jsx:33',message:'signIn returned - after',data:{hasError:!!error,errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      if (error) {
        toast.error(error.message || 'Failed to sign in. Please check your credentials.')
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e1fd222d-4bbd-4d1f-896a-e639b5e7b121',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.jsx:35',message:'Navigating to dashboard - before navigate',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // Small delay to ensure auth state is updated before navigation
        // The onAuthStateChange handler will update user state, but we give it a moment
        setTimeout(() => {
          navigate('/dashboard')
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/e1fd222d-4bbd-4d1f-896a-e639b5e7b121',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.jsx:38',message:'Navigating to dashboard - after navigate',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
        }, 100)
      }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e1fd222d-4bbd-4d1f-896a-e639b5e7b121',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.jsx:38',message:'Login catch block',data:{errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('Login error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Card className="auth-card max-w-md w-full glass-effect-enhanced border-slate-600/50">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg">
              <span className="text-2xl sm:text-3xl">🎓</span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl sm:text-3xl font-extrabold text-white">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center text-slate-300">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              create a new account
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300 mb-2">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-300 mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-xs sm:text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" variant="default" className="mr-2" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
