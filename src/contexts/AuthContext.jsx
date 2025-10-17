import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const createDefaultProfile = useCallback(async (userId) => {
    try {
      // Get user email from auth
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        console.error('No user email found for profile creation')
        setProfile(null)
        return
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile)
        setProfile(existingProfile)
        return
      }

      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email, // Required field - must not be null
          full_name: user.user_metadata?.full_name || 'User',
          role: 'Free',
          level: 1,
          current_xp: 0,
          total_xp_earned: 0,
          daily_streak: 0,
          rank: 'New Catalyst',
          xp_to_next_level: 1,
          level_progress_percentage: 0.00,
          is_premium: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        console.error('Error details:', error.message, error.code, error.details)
        setProfile(null)
        return
      }

      console.log('Profile created successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error creating profile:', error)
      setProfile(null)
    }
  }, [])

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create a default one
          console.log('Profile not found, creating default profile for user:', userId)
          await createDefaultProfile(userId)
          return
        }
        console.error('Error fetching profile:', error)
        console.error('Error details:', error.message, error.code, error.details)
        setProfile(null)
        return
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }, [createDefaultProfile])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async (email, password, userData = {}) => {
    try {
      console.log('Starting signup process for:', email)
      
      // Single signup attempt - let the database trigger handle profile creation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        console.error('Signup failed:', error.message)
        throw error
      }
      
      console.log('Signup successful:', data)
      
      // Handle successful signup
      if (data.user && data.session) {
        // User is immediately signed in
        console.log('User created and signed in immediately')
        toast.success('Account created successfully!')
        return { data, error: null }
      } else if (data.user && !data.session) {
        // Email confirmation is required
        console.log('User created, email confirmation required')
        toast.success('Account created! Please check your email to verify your account.')
        return { data, error: null }
      } else {
        throw new Error('Unexpected signup response')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      
      toast.success('Welcome back!')
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Signed out successfully')
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error(error.message)
      return { error }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      
      toast.success('Password reset email sent!')
      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error(error.message)
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      toast.success('Profile updated successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    fetchProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}