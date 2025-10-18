import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

// Components
import AppShell from './components/AppShell'

// Auth Components
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import PricingPage from './pages/PricingPage'
import ProfilePage from './pages/ProfilePage'
import Mastery from './pages/Mastery'
import MasteryTestComponent from './components/test/MasteryTestComponent'

// Import glassmorphism styles
import './styles/glassmorphism.css'

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  
  return user ? children : <Navigate to="/login" replace />
}

// Auth redirect component
const AuthRedirect = () => {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
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

      {/* Protected Routes (With AppShell) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppShell>
            <Dashboard />
          </AppShell>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppShell>
            <ProfilePage />
          </AppShell>
        </ProtectedRoute>
      } />

      <Route path="/mastery/*" element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
        <Route index element={<Mastery />} />
        <Route path="calendar" element={<Mastery />} />
        <Route path="habits" element={<Mastery />} />
        <Route path="toolbox" element={<Mastery />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<AuthRedirect />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App