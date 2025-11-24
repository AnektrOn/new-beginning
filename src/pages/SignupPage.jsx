import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Checkbox } from '../components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import LoadingSpinner from '../components/common/LoadingSpinner'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setErrors({})

    try {
      const { data, error } = await signUp(formData.email, formData.password, { 
        full_name: formData.fullName.trim() 
      })
      
      if (!error) {
        // Check if user was immediately signed in (email confirmation disabled)
        if (data?.user && data?.session) {
          // User is signed in, redirect to dashboard
          navigate('/dashboard')
        } else {
          // User needs to verify email, redirect to login
          navigate('/login')
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
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
              <span className="text-2xl sm:text-3xl">🚀</span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl sm:text-3xl font-extrabold text-white">
            Create your account
          </CardTitle>
          <CardDescription className="text-center text-slate-300">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              sign in to your existing account
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-slate-300 mb-2">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 ${
                    errors.fullName ? 'border-red-500' : ''
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-400">{errors.fullName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-slate-300 mb-2">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="password" className="text-slate-300 mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-400">{errors.password}</p>
                )}
                <p className="mt-1.5 text-[10px] sm:text-xs text-slate-400">
                  Must be at least 6 characters with uppercase, lowercase, and number
                </p>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-slate-300 mb-2">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ ...prev, agreeToTerms: checked === true }))
                    if (errors.agreeToTerms) {
                      setErrors(prev => ({ ...prev, agreeToTerms: '' }))
                    }
                  }}
                  disabled={loading}
                  className="mt-0.5"
                />
                <Label htmlFor="agreeToTerms" className="text-xs sm:text-sm text-slate-300 cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs sm:text-sm text-red-400">{errors.agreeToTerms}</p>
              )}
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
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupPage
