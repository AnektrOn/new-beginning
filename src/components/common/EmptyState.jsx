import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

/**
 * EmptyState Component
 * Beautiful empty states for when there's no content
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = 'default' // default, minimal, large
}) => {
  const variants = {
    default: 'py-12 px-6',
    minimal: 'py-8 px-4',
    large: 'py-16 px-8'
  };

  return (
    <Card className={cn('glass-effect-enhanced border-dashed', className)}>
      <CardContent className={cn('flex flex-col items-center justify-center text-center', variants[variant])}>
        {Icon && (
          <div className="mb-4 p-4 rounded-full bg-muted/50">
            <Icon size={variant === 'large' ? 48 : 32} className="text-muted-foreground" />
          </div>
        )}
        
        <h3 className={cn(
          'font-semibold text-foreground mb-2',
          variant === 'large' ? 'text-xl' : 'text-lg'
        )}>
          {title}
        </h3>
        
        {description && (
          <p className={cn(
            'text-muted-foreground mb-6 max-w-md',
            variant === 'large' ? 'text-base' : 'text-sm'
          )}>
            {description}
          </p>
        )}
        
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="default" size={variant === 'large' ? 'lg' : 'default'}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;

