import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Breadcrumbs Component
 * Shows navigation path for nested routes
 */
const Breadcrumbs = ({ className, customItems }) => {
  const location = useLocation();
  
  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (customItems) return customItems;
    
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard', icon: Home }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === paths.length - 1
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground', className)}
    >
      {breadcrumbs.map((crumb, index) => {
        const Icon = crumb.icon;
        const isLast = crumb.isLast || index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <ChevronRight size={16} className="text-muted-foreground/50" />
            )}
            {isLast ? (
              <span className="font-medium text-foreground flex items-center gap-1.5">
                {Icon && <Icon size={16} />}
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                {Icon && <Icon size={16} />}
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

