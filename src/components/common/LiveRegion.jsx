import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * LiveRegion Component
 * Provides screen reader announcements for dynamic content updates
 * Use for important status changes, errors, or notifications
 */
const LiveRegion = ({ 
  message, 
  priority = 'polite', // 'polite' or 'assertive'
  className,
  id 
}) => {
  const regionRef = useRef(null);

  useEffect(() => {
    if (message && regionRef.current) {
      // Clear previous message to ensure screen reader announces new message
      regionRef.current.textContent = '';
      // Use setTimeout to ensure the clear happens before the new message
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      id={id}
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={cn('live-region', className)}
    >
      {message}
    </div>
  );
};

export default LiveRegion;

