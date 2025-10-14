import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get saved jobs for a user
export const getSavedJobs = query({
  args: { socialId: v.string() }, // Social ID (Google/Facebook)
  handler: async (ctx, args) => {
    // First, find the user by social ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();
    
    if (!user) {
      return [];
    }

    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const savedJobsWithDetails = await Promise.all(
      savedJobs.map(async (savedJob) => {
        const job = await ctx.db.get(savedJob.jobId);
        if (!job) return null;

        const company = await ctx.db.get(job.companyId);
        
        // Find recruiter by social ID since recruiterId is a social ID string
        const recruiter = await ctx.db
          .query("users")
          .withIndex("by_socialId", (q) => q.eq("socialId", job.recruiterId))
          .first();

        return {
          ...savedJob,
          job: {
            ...job,
            company,
            recruiter,
          },
        };
      })
    );

    return savedJobsWithDetails.filter(Boolean);
  },
});

// Query to check if a job is saved by a user
export const isJobSaved = query({
  args: { 
    socialId: v.string(), // Social ID (Google/Facebook)
    jobId: v.id("jobs")
  },
  handler: async (ctx, args) => {
    // First, find the user by social ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();
    
    if (!user) {
      return false;
    }

    const savedJob = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_job", (q) => 
        q.eq("userId", user._id).eq("jobId", args.jobId)
      )
      .first();

    return !!savedJob;
  },
});

// Mutation to save a job
export const saveJob = mutation({
  args: { 
    socialId: v.string(), // Social ID (Google/Facebook)
    jobId: v.id("jobs")
  },
  handler: async (ctx, args) => {
    // First, find the user by social ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }

    // Check if already saved
    const existingSavedJob = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_job", (q) => 
        q.eq("userId", user._id).eq("jobId", args.jobId)
      )
      .first();

    if (existingSavedJob) {
      throw new Error("Job is already saved");
    }

    const savedJobId = await ctx.db.insert("savedJobs", {
      userId: user._id,
      jobId: args.jobId,
      savedAt: Date.now(),
    });

    return savedJobId;
  },
});

// Mutation to unsave a job
export const unsaveJob = mutation({
  args: { 
    socialId: v.string(), // Social ID (Google/Facebook)
    jobId: v.id("jobs")
  },
  handler: async (ctx, args) => {
    // First, find the user by social ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }

    const savedJob = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_job", (q) => 
        q.eq("userId", user._id).eq("jobId", args.jobId)
      )
      .first();

    if (!savedJob) {
      throw new Error("Job is not saved");
    }

    await ctx.db.delete(savedJob._id);
    return savedJob._id;
  },
});

// Mutation to toggle save status
export const toggleSaveJob = mutation({
  args: { 
    socialId: v.string(), // Social ID (Google/Facebook)
    jobId: v.id("jobs")
  },
  handler: async (ctx, args) => {
    // First, find the user by social ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }

    const savedJob = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_job", (q) => 
        q.eq("userId", user._id).eq("jobId", args.jobId)
      )
      .first();

    if (savedJob) {
      // Unsave the job
      await ctx.db.delete(savedJob._id);
      return { action: "unsaved", savedJobId: savedJob._id };
    } else {
      // Save the job
      const savedJobId = await ctx.db.insert("savedJobs", {
        userId: user._id,
        jobId: args.jobId,
        savedAt: Date.now(),
      });
      return { action: "saved", savedJobId };
    }
  },
});
