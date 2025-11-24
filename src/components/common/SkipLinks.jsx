import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * SkipLinks Component
 * Provides keyboard-accessible skip navigation links
 * Allows users to skip to main content, navigation, etc.
 */
const SkipLinks = () => {
  const location = useLocation();

  const skipLinks = [
    { id: 'main-content', label: 'Skip to main content', href: '#main-content' },
    { id: 'navigation', label: 'Skip to navigation', href: '#main-navigation' },
    { id: 'search', label: 'Skip to search', href: '#search-content' },
  ];

  return (
    <div className="skip-links-container">
      {skipLinks.map((link) => (
        <a
          key={link.id}
          href={link.href}
          className={cn(
            'skip-link',
            'sr-only focus:not-sr-only',
            'focus:absolute focus:top-4 focus:left-4',
            'focus:z-[9999] focus:p-4',
            'focus:bg-primary focus:text-primary-foreground',
            'focus:rounded-md focus:shadow-lg',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'transition-all duration-200'
          )}
          aria-label={link.label}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;

