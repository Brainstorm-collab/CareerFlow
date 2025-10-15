import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new job application
export const createApplication = mutation({
  args: {
    socialId: v.string(),
    jobId: v.string(), // For sample jobs, this will be the sample job ID
    coverLetter: v.optional(v.string()),
    resumeFileId: v.optional(v.union(v.id("fileUploads"), v.string(), v.null())), // Reference to uploaded file or string or null
    resumeFileName: v.optional(v.string()),
    resumeFileSize: v.optional(v.number()),
    resumeFileType: v.optional(v.string()),
    // Personal Information
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    // Professional Information
    experienceYears: v.optional(v.string()),
    currentPosition: v.optional(v.string()),
    currentCompany: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    education: v.optional(v.string()),
    // Additional Information
    availability: v.optional(v.string()),
    expectedSalary: v.optional(v.string()),
    noticePeriod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('🚀 createApplication called with args:', args);
    
    // First, get the user by socialId
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      console.error('❌ User not found for socialId:', args.socialId);
      throw new Error("User not found");
    }

    console.log('✅ User found:', user._id);

    // For sample jobs, we'll store them with a special flag
    const isSampleJob = args.jobId.startsWith('k1734x8k');
    console.log('🔍 Job type check - isSampleJob:', isSampleJob, 'jobId:', args.jobId);
    
    if (isSampleJob) {
      console.log('📝 Processing sample job application');
      // For sample jobs, we'll create a mock application record
      // In a real app, you'd store this in a separate table or handle differently
      return {
        success: true,
        applicationId: `sample_${Date.now()}`,
        message: "Application submitted successfully (Sample Job)"
      };
    }

    // For real jobs, create an actual application record
    console.log('💼 Processing real job application');
    
    // Validate job ID before storing
    if (!args.jobId || typeof args.jobId !== 'string') {
      console.error('❌ Invalid job ID provided:', args.jobId);
      throw new Error("Invalid job ID provided");
    }
    
    // Check if job ID is a valid Convex ID (27 or 32 characters)
    if (args.jobId.length !== 27 && args.jobId.length !== 32) {
      console.error('❌ Job ID is not a valid Convex ID:', args.jobId, 'Length:', args.jobId.length);
      throw new Error("Job ID is not a valid Convex ID");
    }
    
    // Verify the job exists before creating application
    const jobExists = await ctx.db.get(args.jobId as any);
    if (!jobExists) {
      console.error('❌ Job not found in database:', args.jobId);
      throw new Error("Job not found in database");
    }
    
    console.log('✅ Job validation passed, creating application...');
    
    let applicationId;
    try {
      console.log('📝 Inserting application into database...');
      applicationId = await ctx.db.insert("applications", {
        candidateId: user._id as any, // Convex ID of the candidate
        jobId: args.jobId as any, // Cast to proper Convex ID type
        status: "pending",
        coverLetter: args.coverLetter,
        resumeUrl: args.resumeFileId ? (args.resumeFileId.startsWith('http') ? args.resumeFileId : `file:${args.resumeFileId}`) : "", // Reference to uploaded file or direct URL
        // Personal Information
        fullName: args.fullName || user.firstName + ' ' + user.lastName,
        email: args.email || user.email,
        phone: args.phone || user.phone,
        location: args.location || user.location,
        // Professional Information
        experienceYears: args.experienceYears,
        currentPosition: args.currentPosition,
        currentCompany: args.currentCompany,
        skills: args.skills || [],
        education: args.education,
        // Additional Information
        availability: args.availability,
        expectedSalary: args.expectedSalary,
        noticePeriod: args.noticePeriod,
        appliedAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log('✅ Application inserted with ID:', applicationId);
    } catch (insertError) {
      console.error('❌ Error inserting application:', insertError);
      throw new Error(`Failed to create application: ${insertError.message}`);
    }

    // Update job application count
    const job = await ctx.db.get(args.jobId as any);
    if (job) {
      await ctx.db.patch(args.jobId as any, {
        applicationCount: (job.applicationCount || 0) + 1,
        updatedAt: Date.now(),
      });
    }

    console.log('🎉 Application creation completed successfully');
    return {
      success: true,
      applicationId,
      message: "Application submitted successfully"
    };
  },
});

// Get applications by user
export const getApplicationsByUser = query({
  args: { socialId: v.string() },
  handler: async (ctx, args) => {
    console.log('🔍 getApplicationsByUser called with socialId:', args.socialId);
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      console.log('❌ User not found for socialId:', args.socialId);
      return [];
    }

    console.log('✅ User found:', user._id);

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", user._id as any))
      .collect();

    console.log('📊 Found', applications.length, 'applications');

    // Get job details, company information, and file information for each application
    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        // In queries we cannot write; merge missing fields in-memory for the response
        const mergedApp = {
          ...app,
          fullName: app.fullName || (user.firstName + ' ' + user.lastName),
          email: app.email || user.email,
          phone: app.phone || user.phone,
          location: app.location || user.location,
          experienceYears: app.experienceYears || user.experienceYears,
          currentPosition: app.currentPosition || user.currentPosition,
          currentCompany: app.currentCompany || user.currentCompany,
          skills: app.skills || user.skills || [],
          education: app.education || user.education,
          availability: app.availability || user.availability,
          expectedSalary: app.expectedSalary || user.expectedSalary,
          noticePeriod: app.noticePeriod || user.noticePeriod,
        };
        let job = null;
        let company = null;
        let resumeFile = null;
        
        // Validate and fetch job details safely
        try {
          if (app.jobId && typeof app.jobId === 'string') {
            console.log('🔍 Processing job ID:', app.jobId, 'Length:', app.jobId.length);
            
            // Check if it's a valid Convex ID (27 or 32 characters)
            if (app.jobId.length === 27 || app.jobId.length === 32) {
              console.log('✅ Valid Convex ID, fetching job...');
              try {
                job = await ctx.db.get(app.jobId as any);
                console.log('📋 Job fetched:', job ? 'Found' : 'Not found', job?.title || 'N/A');
                
                // If job has companyId, fetch the company details
                if (job?.companyId) {
                  try {
                    if (typeof job.companyId === 'string' && (job.companyId.length === 27 || job.companyId.length === 32)) {
                      console.log('🏢 Fetching company for job:', job.companyId);
                      company = await ctx.db.get(job.companyId as any);
                      console.log('🏢 Company fetched:', company ? 'Found' : 'Not found', company?.name || 'N/A');
                    }
                  } catch (companyError) {
                    console.log('⚠️ Could not fetch company for job:', job.companyId, companyError);
                    company = null;
                  }
                }
              } catch (jobFetchError) {
                console.log('⚠️ Error fetching job with ID:', app.jobId, jobFetchError);
                job = null;
                company = null;
              }
            } else {
              // For non-Convex IDs, try to find the job by searching all jobs
              console.log('⚠️ Non-Convex job ID found:', app.jobId, 'Length:', app.jobId.length);
              console.log('🔍 Attempting to find job by searching all jobs...');
              
              try {
                // Search for the job in all jobs (this is a fallback for invalid IDs)
                const allJobs = await ctx.db.query("jobs").collect();
                const foundJob = allJobs.find(j => j._id === app.jobId || j.slug === app.jobId);
                
                if (foundJob) {
                  console.log('✅ Found job by search:', foundJob.title);
                  job = foundJob;
                  
                  // Fetch company for the found job
                  if (job.companyId) {
                    try {
                      company = await ctx.db.get(job.companyId as any);
                      console.log('🏢 Company fetched for found job:', company?.name || 'N/A');
                    } catch (companyError) {
                      console.log('⚠️ Could not fetch company for found job:', companyError);
                      company = null;
                    }
                  }
                } else {
                  console.log('❌ Job not found in database');
                  job = null;
                  company = null;
                }
              } catch (searchError) {
                console.log('⚠️ Error searching for job:', searchError);
                job = null;
                company = null;
              }
            }
          } else {
            console.log('⚠️ Invalid job ID:', app.jobId, 'Type:', typeof app.jobId);
          }
        } catch (jobError) {
          console.log('⚠️ Could not fetch job details for:', app.jobId, jobError);
          job = null;
          company = null;
        }
        
        // If application has resumeUrl that starts with "file:", fetch the file details
        if (mergedApp.resumeUrl && mergedApp.resumeUrl.startsWith('file:')) {
          try {
            const fileId = mergedApp.resumeUrl.replace('file:', '');
            // Validate file ID length before fetching
            if (fileId.length === 27 || fileId.length === 32) {
              resumeFile = await ctx.db.get(fileId as any);
            } else {
              console.log('⚠️ Invalid file ID length:', fileId.length, 'for ID:', fileId);
            }
          } catch (fileError) {
            console.log('⚠️ Could not fetch resume file:', mergedApp.resumeUrl, fileError);
            resumeFile = null;
          }
        }
        
        return {
          ...mergedApp,
          job: job ? {
            ...job,
            company: company
          } : null,
          resumeFile: resumeFile
        };
      })
    );

    console.log('✅ Returning', applicationsWithJobs.length, 'applications with job details');
    return applicationsWithJobs;
  },
});

// Get applications by job
export const getApplicationsByJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    // Get candidate details for each application
    const applicationsWithDetails = await Promise.all(
      applications.map(async (application) => {
        // console.log('🔍 Processing application:', application._id);
        
        const candidate = await ctx.db.get(application.candidateId);
        // console.log('🔍 Found candidate:', candidate?.fullName);

        // Migrate old applications to include user profile data if missing
        // Queries cannot write; prepare a merged copy for response instead of patching
        const merged = candidate ? {
          ...application,
          fullName: application.fullName || (candidate.firstName + ' ' + candidate.lastName),
          email: application.email || candidate.email,
          phone: application.phone || candidate.phone,
          location: application.location || candidate.location,
          experienceYears: application.experienceYears || candidate.experienceYears,
          currentPosition: application.currentPosition || candidate.currentPosition,
          currentCompany: application.currentCompany || candidate.currentCompany,
          skills: application.skills || candidate.skills || [],
          education: application.education || candidate.education,
          availability: application.availability || candidate.availability,
          expectedSalary: application.expectedSalary || candidate.expectedSalary,
          noticePeriod: application.noticePeriod || candidate.noticePeriod,
        } : application;

        // Get resume file details if available
        let resumeFile = null;
        if (merged.resumeUrl) {
          try {
            // Check if it's a file: reference or direct URL
            if (merged.resumeUrl.startsWith('file:')) {
              const fileId = merged.resumeUrl.replace('file:', '');
              // Validate that it's a proper Convex ID (should be 27 or 32 characters)
              if (fileId.length === 27 || fileId.length === 32) {
                resumeFile = await ctx.db.get(fileId as any);
              } else {
                console.log('Invalid file ID length:', fileId.length, 'for ID:', fileId, '- creating fallback');
                // Create a fallback file object for invalid IDs
                resumeFile = {
                  fileUrl: "", // No valid URL for invalid IDs
                  fileName: 'resume.pdf',
                  fileType: 'application/pdf',
                  fileSize: 0,
                  _invalidId: true // Flag to indicate this is an invalid ID
                };
              }
            } else {
              // If it's a direct URL, create a mock file object
              resumeFile = {
                fileUrl: merged.resumeUrl,
                fileName: 'resume.pdf',
                fileType: 'application/pdf',
                fileSize: 0
              };
            }
          } catch (error) {
            console.log('Could not fetch resume file:', error);
            // Create a fallback file object
            resumeFile = {
              fileUrl: "",
              fileName: 'resume.pdf',
              fileType: 'application/pdf',
              fileSize: 0,
              _error: true // Flag to indicate there was an error
            };
          }
        }

        return {
          ...merged,
          candidate,
          resumeFile,
        };
      })
    );

    return applicationsWithDetails;
  },
});

// Update application status
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("shortlisted"),
      v.literal("scheduled_for_interview"),
      v.literal("interviewed"),
      v.literal("rejected"),
      v.literal("hired")
    ),
    notes: v.optional(v.string()),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      notes: args.notes,
      rating: args.rating,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Check if user has applied to a job
export const hasUserApplied = query({
  args: { socialId: v.string(), jobId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      return false;
    }

    // For sample jobs, always return false (no real applications)
    if (args.jobId.startsWith('k1734x8k')) {
      return false;
    }

    const application = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", user._id as any))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first();

    return !!application;
  },
});

// Withdraw/Delete an application
export const withdrawApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    socialId: v.string(), // To verify the user owns this application
  },
  handler: async (ctx, args) => {
    // First, get the user by socialId
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the application
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Verify the user owns this application
    if (application.candidateId !== user._id) {
      throw new Error("You can only withdraw your own applications");
    }

    // Get the job to update application count
    const job = await ctx.db.get(application.jobId);
    if (job && (job.applicationCount || 0) > 0) {
      await ctx.db.patch(application.jobId, {
        applicationCount: (job.applicationCount || 0) - 1,
        updatedAt: Date.now(),
      });
    }

    // Delete the application
    await ctx.db.delete(args.applicationId);

    return { 
      success: true, 
      message: "Application withdrawn successfully" 
    };
  },
});

// Cleanup function to fix invalid resume URLs in applications
export const cleanupInvalidApplicationResumeUrls = mutation({
  args: {},
  handler: async (ctx) => {
    const applications = await ctx.db.query("applications").collect();
    let cleanedCount = 0;
    
    for (const application of applications) {
      if (application.resumeUrl && 
          (application.resumeUrl.startsWith('/') || 
           application.resumeUrl.includes('Profile%20Resume') ||
           application.resumeUrl.includes('Profile Resume') ||
           (!application.resumeUrl.startsWith('http') && !application.resumeUrl.startsWith('file:')))) {
        
        await ctx.db.patch(application._id, {
          resumeUrl: "",
          updatedAt: Date.now()
        });
        cleanedCount++;
      }
    }
    
    return { cleanedCount, message: `Cleaned ${cleanedCount} invalid application resume URLs` };
  },
});

// Get all applications with detailed debugging
export const debugApplications = query({
  args: {},
  handler: async (ctx) => {
    console.log('🔍 Debug: Getting all applications...');
    
    const allApplications = await ctx.db
      .query("applications")
      .collect();
    
    console.log('📊 Total applications found:', allApplications.length);
    
    const debugData = allApplications.map(app => ({
      _id: app._id,
      jobId: app.jobId,
      jobIdLength: app.jobId?.length,
      candidateId: app.candidateId,
      candidateIdLength: app.candidateId?.length,
      status: app.status,
      appliedAt: app.appliedAt
    }));
    
    console.log('🔍 Application debug data:', debugData);
    
    return debugData;
  },
});