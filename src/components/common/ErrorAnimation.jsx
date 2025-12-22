import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ErrorAnimation Component
 * Displays an error animation with alert icon
 */
const ErrorAnimation = ({ 
  message, 
  className,
  size = 'md',
  variant = 'alert', // 'alert' or 'error'
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const Icon = variant === 'error' ? XCircle : AlertCircle;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && (
        <Icon 
          className={cn(
            'text-red-500 error-animation',
            sizeClasses[size]
          )} 
        />
      )}
      {message && (
        <span className="text-red-600 dark:text-red-400 font-medium">
          {message}
        </span>
      )}
    </div>
  );
};

export default ErrorAnimation;

