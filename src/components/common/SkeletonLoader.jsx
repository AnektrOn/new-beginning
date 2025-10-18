import React from 'react';

/**
 * Skeleton loading component for better perceived performance
 */
const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-blue-900 rounded-lg p-4 shadow-sm w-80 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 bg-gray-700 rounded-sm"></div>
                  ))}
                </div>
                <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'calendar':
        return (
          <div className="grid grid-cols-7 gap-1 animate-pulse">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        );
    }
  };

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
