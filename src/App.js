import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

// Components
import AppShellMobile from './components/AppShellMobile'

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
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
        <p className="text-sm text-gray-400 mt-2">If this takes too long, check the console for errors</p>
      </div>
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
        <Route index element={<Dashboard />} />
      </Route>
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<ProfilePage />} />
      </Route>

      <Route path="/mastery/*" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<Mastery />} />
        <Route path="calendar" element={<Mastery />} />
        <Route path="habits" element={<Mastery />} />
        <Route path="toolbox" element={<Mastery />} />
      </Route>

      <Route path="/community" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<CommunityPage />} />
      </Route>

      <Route path="/courses" element={
        <ProtectedRoute>
          <AppShellMobile />
        </ProtectedRoute>
      }>
        <Route index element={<CourseCatalogPage />} />
        <Route path="create" element={<CourseCreationPage />} />
        <Route path=":courseId" element={<CourseDetailPage />} />
        <Route path=":courseId/chapters/:chapterNumber/lessons/:lessonNumber" element={<CoursePlayerPage />} />
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
          <AppRoutes />
          <Toaster 
            position={isMobile ? 'top-center' : 'top-right'} 
            toastOptions={{ 
              style: isMobile ? { marginTop: '64px', zIndex: 10000 } : { zIndex: 10000 },
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