import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { toastConfig } from './utils/toastConfig'

// Components
import AppShellMobile from './components/AppShellMobile'
import PageTransition from './components/common/PageTransition'
import LoadingSpinner from './components/common/LoadingSpinner'
import SkipLinks from './components/common/SkipLinks'
import CommandPalette from './components/common/CommandPalette'

// Auth Components
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import PricingPage from './pages/PricingPage'
import ProfilePage from './pages/ProfilePage'
import Mastery from './pages/Mastery'
import CommunityPage from './pages/CommunityPage'
import MasteryTestComponent from './components/test/MasteryTestComponent'
import CourseCatalogPage from './pages/CourseCatalogPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CoursePlayerPage from './pages/CoursePlayerPage'
import CourseCreationPage from './pages/CourseCreationPage'

// Import glassmorphism and mobile styles
import './styles/glassmorphism.css'
import './styles/mobile-responsive.css'

// Loading component
const LoadingScreen = () => {
  console.log('🔄 LoadingScreen: Rendering loading screen')
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  )
}

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  console.log('🔒 ProtectedRoute: loading =', loading, 'user =', user ? 'authenticated' : 'not authenticated')
  
  if (loading) {
    console.log('🔒 ProtectedRoute: Showing loading screen')
    return <LoadingScreen />
  }
  
  if (!user) {
    console.log('🔒 ProtectedRoute: No user, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  console.log('🔒 ProtectedRoute: User authenticated, rendering children')
  return children
}

// Auth redirect component
const AuthRedirect = () => {
  const { user, loading } = useAuth()
  
  console.log('🔄 AuthRedirect: loading =', loading, 'user =', user ? 'authenticated' : 'not authenticated')
  
  if (loading) {
    console.log('🔄 AuthRedirect: Showing loading screen')
    return <LoadingScreen />
  }
  
  if (user) {
    console.log('🔄 AuthRedirect: User authenticated, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
  } else {
    console.log('🔄 AuthRedirect: No user, redirecting to login')
    return <Navigate to="/login" replace />
  }
}

// Main App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (No AppShell) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      
      {/* Test route without authentication */}
      <Route path="/test" element={
        <div style={{padding: '20px', backgroundColor: 'lightblue'}}>
          <h1>TEST ROUTE WORKS!</h1>
          <p>If you can see this, routing is working.</p>
        </div>
      } />

      {/* Mastery Test Component */}
      <Route path="/mastery-test" element={
        <ProtectedRoute>
          <MasteryTestComponent />
        </ProtectedRoute>
      } />

      {/* Protected Routes (With AppShellMobile) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<PageTransition><Dashboard /></PageTransition>} />
      </Route>
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<PageTransition><ProfilePage /></PageTransition>} />
      </Route>

      <Route path="/mastery/*" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<PageTransition><Mastery /></PageTransition>} />
        <Route path="calendar" element={<PageTransition><Mastery /></PageTransition>} />
        <Route path="habits" element={<PageTransition><Mastery /></PageTransition>} />
        <Route path="toolbox" element={<PageTransition><Mastery /></PageTransition>} />
      </Route>

      <Route path="/community" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<PageTransition><CommunityPage /></PageTransition>} />
      </Route>

      <Route path="/courses" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<PageTransition><CourseCatalogPage /></PageTransition>} />
        <Route path="create" element={<PageTransition><CourseCreationPage /></PageTransition>} />
        <Route path=":courseId" element={<PageTransition><CourseDetailPage /></PageTransition>} />
        <Route path=":courseId/chapters/:chapterNumber/lessons/:lessonNumber" element={<PageTransition><CoursePlayerPage /></PageTransition>} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<AuthRedirect />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <SkipLinks />
          <CommandPalette />
          <AppRoutes />
          <Toaster 
            position={isMobile ? 'top-center' : toastConfig.position} 
            toastOptions={{ 
              ...toastConfig,
              style: {
                ...toastConfig.style,
                ...(isMobile ? { marginTop: '64px' } : {}),
                zIndex: 10000,
              },
            }}
            containerStyle={{
              zIndex: 10000,
              position: 'fixed',
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App