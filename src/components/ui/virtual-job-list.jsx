import { useState, useEffect, useMemo, memo } from 'react';
import LandingJobCard from '../landing-job-card';
import { LandingJobCardShimmer } from './job-card-shimmer';

const VirtualJobList = memo(({ 
  jobs = [], 
  isRecruiter = false, 
  onJobDeleted,
  itemsPerPage = 12 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Calculate paginated jobs
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return jobs.slice(0, endIndex);
  }, [jobs, currentPage, itemsPerPage]);

  // Check if there are more jobs to load
  const hasMoreJobs = paginatedJobs.length < jobs.length;

  // Load more jobs
  const loadMore = () => {
    if (hasMoreJobs && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 300);
    }
  };

  // Reset pagination when jobs change
  useEffect(() => {
    setCurrentPage(1);
  }, [jobs]);

  if (jobs.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <LandingJobCardShimmer key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Jobs */}
      {paginatedJobs.slice(0, 3).length > 0 && (
        <section className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-white">Featured Opportunities</h2>
              <p className="text-gray-400 text-sm">Hand-picked jobs for you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedJobs.slice(0, 3).map((job) => (
              <div key={job._id} className="relative group">
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <LandingJobCard
                    job={job}
                    isRecruiter={isRecruiter}
                    onJobDeleted={onJobDeleted}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Regular Jobs */}
      {paginatedJobs.slice(3).length > 0 && (
        <section className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-10 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-white">All Opportunities</h2>
              <p className="text-gray-400 text-sm">Explore all available positions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedJobs.slice(3).map((job) => (
              <LandingJobCard
                key={job._id}
                job={job}
                isRecruiter={isRecruiter}
                onJobDeleted={onJobDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Load More Button */}
      {hasMoreJobs && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading more jobs...
              </div>
            ) : (
              `Load More Jobs (${jobs.length - paginatedJobs.length} remaining)`
            )}
          </button>
        </div>
      )}

      {/* Loading More Shimmer */}
      {isLoadingMore && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <LandingJobCardShimmer key={`loading-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
});

VirtualJobList.displayName = 'VirtualJobList';

export default VirtualJobList;
