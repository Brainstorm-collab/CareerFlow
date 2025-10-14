import { lazy, Suspense } from 'react';
import { JobListingSkeleton, ProfileSkeleton, ApplicationsSkeleton } from './ui/advanced-skeleton';

// Lazy load heavy components
export const LazyJobListing = lazy(() => import('../pages/jobListing'));
export const LazyProfile = lazy(() => import('../pages/profile'));
export const LazyMyApplications = lazy(() => import('../pages/my-applications'));
export const LazySavedJobs = lazy(() => import('../pages/saved-jobs'));
export const LazyPostJob = lazy(() => import('../pages/post-job'));
export const LazyMyJobs = lazy(() => import('../pages/my-jobs'));
export const LazyJobDetails = lazy(() => import('../pages/job'));
export const LazyCandidates = lazy(() => import('../pages/candidates'));
export const LazyJobApplicants = lazy(() => import('../pages/job-applicants'));

// Lazy load with appropriate skeletons
export const LazyJobListingWithSkeleton = (props) => (
  <Suspense fallback={<JobListingSkeleton />}>
    <LazyJobListing {...props} />
  </Suspense>
);

export const LazyProfileWithSkeleton = (props) => (
  <Suspense fallback={<ProfileSkeleton />}>
    <LazyProfile {...props} />
  </Suspense>
);

export const LazyMyApplicationsWithSkeleton = (props) => (
  <Suspense fallback={<ApplicationsSkeleton />}>
    <LazyMyApplications {...props} />
  </Suspense>
);

export const LazySavedJobsWithSkeleton = (props) => (
  <Suspense fallback={<JobListingSkeleton />}>
    <LazySavedJobs {...props} />
  </Suspense>
);

export const LazyPostJobWithSkeleton = (props) => (
  <Suspense fallback={<ProfileSkeleton />}>
    <LazyPostJob {...props} />
  </Suspense>
);

export const LazyMyJobsWithSkeleton = (props) => (
  <Suspense fallback={<JobListingSkeleton />}>
    <LazyMyJobs {...props} />
  </Suspense>
);

export const LazyJobDetailsWithSkeleton = (props) => (
  <Suspense fallback={<ProfileSkeleton />}>
    <LazyJobDetails {...props} />
  </Suspense>
);

export const LazyCandidatesWithSkeleton = (props) => (
  <Suspense fallback={<ApplicationsSkeleton />}>
    <LazyCandidates {...props} />
  </Suspense>
);

export const LazyJobApplicantsWithSkeleton = (props) => (
  <Suspense fallback={<ApplicationsSkeleton />}>
    <LazyJobApplicants {...props} />
  </Suspense>
);
