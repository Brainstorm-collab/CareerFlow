import { memo } from 'react';

// Advanced skeleton with shimmer effect
const AdvancedSkeleton = memo(({ 
  variant = 'default', 
  className = '',
  lines = 1,
  width = '100%',
  height = '1rem'
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 bg-[length:200%_100%] animate-[shimmer_2s_infinite]";
  
  const variants = {
    default: "rounded",
    circle: "rounded-full",
    rectangle: "rounded-lg",
    text: "rounded h-4",
    button: "rounded-lg h-10",
    card: "rounded-lg h-32"
  };

  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variants[variant]}`}
            style={{
              width: i === lines - 1 ? '75%' : width,
              height: height
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
});

// Page-level skeleton components
export const JobListingSkeleton = memo(() => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="text-center space-y-4">
      <AdvancedSkeleton variant="text" width="300px" height="2rem" className="mx-auto" />
      <AdvancedSkeleton variant="text" width="400px" height="1.25rem" className="mx-auto" />
    </div>

    {/* Search Bar Skeleton */}
    <div className="max-w-2xl mx-auto">
      <AdvancedSkeleton variant="rectangle" height="3rem" />
    </div>

    {/* Filters Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <AdvancedSkeleton key={i} variant="rectangle" height="2.5rem" />
      ))}
    </div>

    {/* Job Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <AdvancedSkeleton variant="text" width="80%" height="1.5rem" />
          <AdvancedSkeleton variant="circle" width="3rem" height="3rem" className="mx-auto" />
          <AdvancedSkeleton variant="text" width="60%" height="1rem" className="mx-auto" />
          <AdvancedSkeleton variant="text" width="40%" height="1rem" className="mx-auto" />
          <div className="flex gap-2 justify-center">
            <AdvancedSkeleton variant="button" width="4rem" height="1.5rem" />
            <AdvancedSkeleton variant="button" width="3rem" height="1.5rem" />
          </div>
        </div>
      ))}
    </div>
  </div>
));

export const ProfileSkeleton = memo(() => (
  <div className="max-w-4xl mx-auto space-y-6">
    {/* Profile Header */}
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <AdvancedSkeleton variant="circle" width="4rem" height="4rem" />
        <div className="space-y-2 flex-1">
          <AdvancedSkeleton variant="text" width="200px" height="1.5rem" />
          <AdvancedSkeleton variant="text" width="150px" height="1rem" />
          <AdvancedSkeleton variant="text" width="100px" height="1rem" />
        </div>
      </div>
    </div>

    {/* Profile Sections */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <AdvancedSkeleton variant="text" width="150px" height="1.25rem" />
        <AdvancedSkeleton lines={3} variant="text" />
      </div>
    ))}
  </div>
));

export const ApplicationsSkeleton = memo(() => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <AdvancedSkeleton variant="text" width="250px" height="1.25rem" />
            <AdvancedSkeleton variant="text" width="150px" height="1rem" />
            <AdvancedSkeleton variant="text" width="100px" height="1rem" />
          </div>
          <AdvancedSkeleton variant="button" width="6rem" height="2rem" />
        </div>
      </div>
    ))}
  </div>
));

AdvancedSkeleton.displayName = 'AdvancedSkeleton';
JobListingSkeleton.displayName = 'JobListingSkeleton';
ProfileSkeleton.displayName = 'ProfileSkeleton';
ApplicationsSkeleton.displayName = 'ApplicationsSkeleton';

export default AdvancedSkeleton;
