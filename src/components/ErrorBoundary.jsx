import React from 'react'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import ErrorDisplay from './common/ErrorDisplay'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected error occurred. Please try again.';
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Card className="max-w-lg w-full glass-effect-enhanced border-slate-600/50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-destructive/20 border-2 border-destructive/30">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Something went wrong</CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert variant="destructive" className="bg-red-950/50 border-red-800/50">
                  <AlertDescription>
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium text-red-300">
                        Error Details (Development Only)
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto text-red-200 bg-red-950/30 p-3 rounded">
                        {this.state.error.toString()}
                        {this.state.errorInfo?.componentStack && (
                          <div className="mt-2 pt-2 border-t border-red-800/50">
                            <div className="font-semibold mb-1">Component Stack:</div>
                            {this.state.errorInfo.componentStack}
                          </div>
                        )}
                      </pre>
                    </details>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRetry} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1 border-slate-600 hover:bg-slate-700/50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex-1 border-slate-600 hover:bg-slate-700/50"
                >
                  Reload Page
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'production' && (
                <div className="pt-4 border-t border-slate-600/50">
                  <p className="text-xs text-slate-500 text-center">
                    If this problem persists, please contact support.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
