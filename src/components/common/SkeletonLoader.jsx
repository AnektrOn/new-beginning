import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Enhanced Skeleton loading component with design system integration
 * Provides consistent loading states across the application
 */
const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className,
  variant = 'default' // default, glass, minimal
}) => {
  const baseClasses = 'animate-pulse';
  const glassClasses = variant === 'glass' ? 'glass-effect-enhanced' : '';
  
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={cn(
            'rounded-xl p-6 border',
            variant === 'glass' ? 'glass-effect-enhanced' : 'bg-muted/50',
            className
          )}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between pt-4">
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
            </div>
          </div>
        );
      
      case 'course-card':
        return (
          <div className={cn(
            'rounded-xl p-5 border',
            variant === 'glass' ? 'glass-effect-enhanced' : 'bg-muted/50',
            className
          )}>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="flex items-center gap-2">
                <div className="h-5 bg-muted rounded-full w-16"></div>
                <div className="h-5 bg-muted rounded-full w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
              <div className="h-10 bg-muted rounded-lg w-full"></div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  'flex items-center space-x-3 p-4 rounded-lg border',
                  variant === 'glass' ? 'glass-effect-enhanced' : 'bg-muted/50',
                  className
                )}
              >
                <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'calendar':
        return (
          <div className={cn('grid grid-cols-7 gap-2', className)}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  'h-20 rounded-lg border',
                  variant === 'glass' ? 'glass-effect-enhanced' : 'bg-muted/30'
                )}
              ></div>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <div className={cn('space-y-2', className)}>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
        );
      
      case 'avatar':
        return (
          <div className={cn('rounded-full bg-muted', className)} style={{ width: 'var(--size, 40px)', height: 'var(--size, 40px)' }}></div>
        );
      
      default:
        return (
          <div className={cn('space-y-2', className)}>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        );
    }
  };

  if (type === 'list' || type === 'calendar') {
    return renderSkeleton();
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
