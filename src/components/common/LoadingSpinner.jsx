import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Enhanced Loading Spinner Component
 * Consistent loading states with design system integration
 */
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default', // default, primary, secondary, success, warning, error
  text,
  fullScreen = false,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400'
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {text && (
        <p className={cn('mt-3 text-sm font-medium', variantClasses[variant])}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
