import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '../../lib/utils';

/**
 * Enhanced Error Display Component
 * Provides user-friendly error messages with recovery actions
 */
const ErrorDisplay = ({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  onGoHome,
  variant = 'card', // card, alert, minimal
  className
}) => {
  const errorMessage = message || error?.message || 'An unexpected error occurred. Please try again.';

  if (variant === 'alert') {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {errorMessage}
          {(onRetry || onGoHome) && (
            <div className="flex gap-2 mt-4">
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              {onGoHome && (
                <Button variant="outline" size="sm" onClick={onGoHome}>
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              )}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('text-center py-8', className)}>
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={cn('glass-effect-enhanced border-destructive/50', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">{title}</CardTitle>
        </div>
        <CardDescription>{errorMessage}</CardDescription>
      </CardHeader>
      {(onRetry || onGoHome) && (
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            {onRetry && (
              <Button variant="default" onClick={onRetry} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            {onGoHome && (
              <Button variant="outline" onClick={onGoHome} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ErrorDisplay;
