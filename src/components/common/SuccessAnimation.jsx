import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * SuccessAnimation Component
 * Displays a success animation with checkmark icon
 */
const SuccessAnimation = ({ 
  message, 
  className,
  size = 'md',
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && (
        <CheckCircle 
          className={cn(
            'text-green-500 success-animation',
            sizeClasses[size]
          )} 
        />
      )}
      {message && (
        <span className="text-green-600 dark:text-green-400 font-medium">
          {message}
        </span>
      )}
    </div>
  );
};

export default SuccessAnimation;

