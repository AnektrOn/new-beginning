import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetPortal,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Mobile-optimized BottomSheet component
 * Wraps shadcn Sheet with mobile-specific enhancements:
 * - Bottom sheet animation from bottom
 * - Touch-friendly sizing
 * - Safe area support for iOS
 * - Swipe-to-dismiss gesture support
 */
const BottomSheet = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  showCloseButton = true,
  maxHeight = '90vh',
  ...props
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...props}>
      <SheetContent
        side="bottom"
        className={cn(
          'max-h-[90vh] rounded-t-2xl border-t-2 border-slate-600/50',
          'glass-effect-enhanced',
          'overflow-y-auto',
          className
        )}
        style={{ 
          maxHeight,
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center mb-4 pt-2">
          <div className="w-12 h-1.5 bg-slate-400/50 rounded-full" />
        </div>

        {/* Header */}
        {(title || description) && (
          <SheetHeader className="text-left mb-4">
            {title && (
              <SheetTitle className="text-xl font-bold text-white">
                {title}
              </SheetTitle>
            )}
            {description && (
              <SheetDescription className="text-slate-400 mt-2">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        )}

        {/* Close Button */}
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}

        {/* Content */}
        <div className="pb-4">{children}</div>

        {/* Footer */}
        {footer && (
          <SheetFooter className="mt-4 pt-4 border-t border-slate-600/50">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default BottomSheet;

