import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getAnimationClasses, pageTransitionVariants } from '../../utils/animations';

/**
 * PageTransition Component
 * Enhanced page transitions with multiple variants and smooth animations
 * Respects user's motion preferences
 */
const PageTransition = ({ 
  children, 
  className = '',
  variant = 'slide', // 'fade', 'slide', 'scale'
  duration = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset visibility on route change
    setIsVisible(false);
    
    // Trigger animation after a brief delay for smoother transition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => {
      clearTimeout(timer);
      setIsVisible(false);
    };
  }, [location.pathname]);

  const variants = pageTransitionVariants[variant] || pageTransitionVariants.slide;
  
  const transitionClasses = getAnimationClasses(
    cn(
      variants.enter,
      isVisible && variants.enterActive,
      !isVisible && variants.exitActive,
      className
    ),
    'transition-opacity duration-150'
  );

  return (
    <div
      className={transitionClasses}
      style={{ 
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;

