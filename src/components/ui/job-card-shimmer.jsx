import { Card, CardContent } from "./card";

const JobCardShimmer = () => (
  <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 h-full flex flex-col transform hover:-translate-y-1">
    <CardContent className="flex flex-col gap-5 flex-1 p-6">
      {/* Job Title - Clean, prominent display */}
      <div className="text-center">
        <div className="h-6 bg-gray-700/50 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700/30 rounded w-3/4 mx-auto animate-pulse"></div>
      </div>

      {/* Company Logo - Clean display without padding */}
      <div className="flex justify-center">
        <div className="w-28 h-28 bg-gray-700/50 rounded animate-pulse"></div>
      </div>

      {/* Company Name - Clean badge design */}
      <div className="text-center">
        <div className="h-6 bg-gray-700/50 rounded-full w-32 mx-auto animate-pulse"></div>
      </div>

      {/* Location - Clean location display */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-4 h-4 bg-gray-700/50 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-700/50 rounded w-24 animate-pulse"></div>
      </div>

      {/* Job Type & Experience - Clean badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="h-6 bg-gray-700/50 rounded-full w-20 animate-pulse"></div>
        <div className="h-6 bg-gray-700/50 rounded-full w-16 animate-pulse"></div>
      </div>

      {/* Remote Work Badge */}
      <div className="text-center">
        <div className="h-6 bg-gray-700/50 rounded-full w-20 mx-auto animate-pulse"></div>
      </div>

      {/* Salary Information - Clean display */}
      <div className="text-center">
        <div className="h-6 bg-gray-700/50 rounded-full w-32 mx-auto animate-pulse"></div>
      </div>

      {/* Applicants Count */}
      <div className="text-center">
        <div className="h-6 bg-gray-700/50 rounded-full w-24 mx-auto animate-pulse"></div>
      </div>
    </CardContent>
    
    <div className="flex gap-3 pt-4 border-t border-gray-700/50 p-6 bg-gray-800/50">
      <div className="h-10 bg-gray-700/50 rounded flex-1 animate-pulse"></div>
      <div className="h-10 w-10 bg-gray-700/50 rounded animate-pulse"></div>
    </div>
  </Card>
);

const LandingJobCardShimmer = () => (
  <Card className="relative bg-[#1A1E24] border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 rounded-lg min-h-[380px]">
    <CardContent className="p-6">
      {/* Top Right Section - Dropdown shimmer */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <div className="h-6 bg-gray-700/50 rounded w-16 animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-700/50 rounded animate-pulse"></div>
      </div>

      {/* Top Section - Job Title, Company, Location */}
      <div className="mb-4">
        {/* Job Title */}
        <div className="mb-3">
          <div className="h-6 bg-gray-700/50 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700/30 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Company Logo and Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Horizontal Separator */}
      <div className="border-t border-gray-600/30 mb-4"></div>

      {/* Middle Section - Job Description */}
      <div className="mb-4">
        <div className="h-4 bg-gray-700/50 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6 animate-pulse"></div>
      </div>

      {/* Application Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-700/50 rounded w-20 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-700/50 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-700/50 rounded w-12 animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Section - Action Buttons */}
      <div className="flex items-center gap-3">
        <div className="h-10 bg-gray-700/50 rounded flex-1 animate-pulse"></div>
        <div className="h-10 w-20 bg-gray-700/50 rounded animate-pulse"></div>
      </div>

      {/* Apply Button */}
      <div className="mt-3">
        <div className="h-10 bg-gray-700/50 rounded w-full animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

export { JobCardShimmer, LandingJobCardShimmer };

