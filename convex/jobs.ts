import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all jobs with filtering
export const getJobs = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()), // Add pagination support
    location: v.optional(v.string()),
    companyName: v.optional(v.string()), // Changed from companyId to companyName
    searchQuery: v.optional(v.string()),
    jobType: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    remoteWork: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const {
      limit = 20,
      offset = 0,
      location,
      companyName,
      searchQuery,
      jobType,
      experienceLevel,
      remoteWork,
    } = args;

    // OPTIMIZATION: Limit initial query to improve performance
    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "open").eq("isOpen", true))
      .order("desc")
      .take(limit * 2); // Take more than needed for filtering, but not all

    // OPTIMIZATION: Batch fetch all companies at once instead of N+1 queries
    const companyIds = [...new Set(jobs.map(job => job.companyId))];
    const companies = await Promise.all(
      companyIds.map(id => ctx.db.get(id))
    );
    const companyMap = new Map(companies.map(c => [c._id, c]));

    // OPTIMIZATION: Batch fetch all recruiters at once instead of N+1 queries
    const recruiterIds = [...new Set(jobs.map(job => job.recruiterId))];
    const recruiters = await Promise.all(
      recruiterIds.map(id => 
        ctx.db.query("users")
          .withIndex("by_socialId", (q) => q.eq("socialId", id))
          .first()
      )
    );
    const recruiterMap = new Map(recruiters.map(r => [r?.socialId, r]));

    // Map jobs with pre-loaded data
    const jobsWithDetails = jobs.map(job => ({
      ...job,
      company: companyMap.get(job.companyId),
      recruiter: recruiterMap.get(job.recruiterId),
    }));

    // Apply filters in memory for complex queries
    let filteredJobs = jobsWithDetails;

    // Location filter (partial match)
    if (location && location !== "all") {
      filteredJobs = filteredJobs.filter((job) => 
        job.location && job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Company name filter (partial match)
    if (companyName && companyName !== "all") {
      filteredJobs = filteredJobs.filter((job) => 
        job.company && job.company.name && 
        job.company.name.toLowerCase().includes(companyName.toLowerCase())
      );
    }

    // Job type filter (exact match)
    if (jobType && jobType !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.jobType === jobType);
    }

    // Experience level filter (exact match)
    if (experienceLevel && experienceLevel !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.experienceLevel === experienceLevel);
    }

    // Remote work filter
    if (remoteWork !== undefined) {
      filteredJobs = filteredJobs.filter((job) => job.remoteWork === remoteWork);
    }

    // Search query filter (partial match in title, description, and company name)
    if (searchQuery && searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      filteredJobs = filteredJobs.filter((job) => 
        (job.title && job.title.toLowerCase().includes(searchLower)) ||
        (job.description && job.description.toLowerCase().includes(searchLower)) ||
        (job.company && job.company.name && job.company.name.toLowerCase().includes(searchLower)) ||
        (job.skillsRequired && job.skillsRequired.some(skill => 
          skill.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Apply pagination and limit
    return filteredJobs.slice(offset, offset + limit);
  },
});

// Query to get a single job by ID
export const getJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    const company = await ctx.db.get(job.companyId);
    // Get recruiter from users table by social ID
    const recruiter = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", job.recruiterId))
      .first();

    // Get applications for this job
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    // Get saved status for current user (if authenticated)
    // Note: This would need to be passed from the client
    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    return {
      ...job,
      company,
      recruiter,
      applications,
      savedJobs,
    };
  },
});

// Query to get jobs by recruiter
export const getJobsByRecruiter = query({
  args: { recruiterId: v.string() }, // Clerk ID
  handler: async (ctx, args) => {
    // console.log('🔍 getJobsByRecruiter called with recruiterId:', args.recruiterId);
    
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_recruiter", (q) => q.eq("recruiterId", args.recruiterId))
      .order("desc")
      .collect();

    // console.log('🔍 getJobsByRecruiter found jobs for recruiter:', jobs.length);

    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const company = await ctx.db.get(job.companyId);
        return { ...job, company };
      })
    );

    // console.log('🔍 getJobsByRecruiter returning:', jobsWithDetails.length, 'jobs');
    return jobsWithDetails;
  },
});

// Mutation to create a new job
export const createJob = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    requirements: v.optional(v.string()),
    responsibilities: v.optional(v.string()),
    benefits: v.optional(v.string()),
    skillsRequired: v.array(v.string()),
    skillsPreferred: v.optional(v.array(v.string())),
    location: v.string(),
    remoteWork: v.boolean(),
    jobType: v.string(),
    experienceLevel: v.string(),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    salaryPeriod: v.optional(v.string()),
    applicationDeadline: v.optional(v.number()),
    startDate: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    urgent: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    recruiterId: v.string(), // Clerk ID
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const slug = args.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const jobId = await ctx.db.insert("jobs", {
      ...args,
      slug,
      status: "open",
      isOpen: true,
      applicationCount: 0,
      viewCount: 0,
      featured: args.featured || false,
      urgent: args.urgent || false,
      createdAt: now,
      updatedAt: now,
    });

    return jobId;
  },
});

// Mutation to update a job
export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.string()),
    responsibilities: v.optional(v.string()),
    benefits: v.optional(v.string()),
    skillsRequired: v.optional(v.array(v.string())),
    skillsPreferred: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    remoteWork: v.optional(v.boolean()),
    jobType: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    salaryPeriod: v.optional(v.string()),
    applicationDeadline: v.optional(v.number()),
    startDate: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    urgent: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    isOpen: v.optional(v.boolean()),
    companyName: v.optional(v.string()), // Add company name update
  },
  handler: async (ctx, args) => {
    const { jobId, companyName, ...updates } = args;
    
    // If title is being updated, regenerate slug
    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    // If company name is being updated, update the company record
    if (companyName) {
      const job = await ctx.db.get(jobId);
      if (job && job.companyId) {
        // Update the company name in the companies table
        await ctx.db.patch(job.companyId, {
          name: companyName,
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.patch(jobId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return jobId;
  },
});

// Mutation to delete a job
export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    // Delete related applications and saved jobs first
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    for (const application of applications) {
      await ctx.db.delete(application._id);
    }

    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    for (const savedJob of savedJobs) {
      await ctx.db.delete(savedJob._id);
    }

    // Delete the job
    await ctx.db.delete(args.jobId);
    return args.jobId;
  },
});

// Mutation to increment job view count
export const incrementViewCount = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return;

    await ctx.db.patch(args.jobId, {
      viewCount: job.viewCount + 1,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to create diverse companies and update jobs to use them
export const updateJobsWithDiverseCompanies = mutation({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();
    
    const companyData = [
      { name: "Google", slug: "google", industry: "Technology", logoUrl: "/companies/google.webp" },
      { name: "Microsoft", slug: "microsoft", industry: "Technology", logoUrl: "/companies/microsoft.webp" },
      { name: "Amazon", slug: "amazon", industry: "E-commerce", logoUrl: "/companies/amazon.svg" },
      { name: "Meta", slug: "meta", industry: "Social Media", logoUrl: "/companies/meta.svg" },
      { name: "Netflix", slug: "netflix", industry: "Entertainment", logoUrl: "/companies/netflix.png" },
      { name: "Uber", slug: "uber", industry: "Transportation", logoUrl: "/companies/uber.svg" },
      { name: "Atlassian", slug: "atlassian", industry: "Software", logoUrl: "/companies/atlassian.svg" },
      { name: "IBM", slug: "ibm", industry: "Technology", logoUrl: "/companies/ibm.svg" },
      { name: "Apple", slug: "apple", industry: "Technology", logoUrl: "/companies/apple.svg" },
      { name: "TechCorp Inc", slug: "techcorp-inc", industry: "Technology", logoUrl: "/companies/microsoft.webp" }
    ];
    
    // Get a user ID to use as createdBy (use the first user found)
    const firstUser = await ctx.db.query("users").first();
    if (!firstUser) {
      throw new Error("No users found in database");
    }
    
    console.log("First user found:", firstUser._id);

    // Create diverse companies
    const companyIds = [];
    for (const company of companyData) {
      const companyObject = {
        ...company,
        description: `${company.name} is a leading company in the ${company.industry} industry.`,
        websiteUrl: `https://${company.slug}.com`,
        headquarters: "San Francisco, CA",
        remotePolicy: "Hybrid",
        benefits: ["Health Insurance", "401k", "Flexible Hours"],
        cultureTags: ["Innovative", "Collaborative"],
        socialLinks: {
          linkedin: `https://linkedin.com/company/${company.slug}`,
          twitter: "",
          facebook: ""
        },
        isVerified: true,
        isActive: true,
        createdBy: firstUser._id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      console.log("Inserting company object:", JSON.stringify(companyObject, null, 2));
      
      const companyId = await ctx.db.insert("companies", companyObject);
      companyIds.push(companyId);
    }
    
    // Update jobs to use different companies
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const companyId = companyIds[i % companyIds.length];
      
      await ctx.db.patch(job._id, {
        companyId: companyId,
        updatedAt: Date.now(),
      });
    }
    
    return { 
      updated: jobs.length, 
      companiesCreated: companyIds.length 
    };
  },
});

// Mutation to create real jobs for testing
export const createRealJobs = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // First, get or create a recruiter user
    let recruiter = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", "100236442534619013178"))
      .first();

    if (!recruiter) {
      // Create a recruiter user if it doesn't exist
      recruiter = await ctx.db.insert("users", {
        email: "recruiter@careerflow.com",
        firstName: "Test",
        lastName: "Recruiter",
        fullName: "Test Recruiter",
        role: "recruiter",
        phone: "+1234567890",
        location: "San Francisco, CA",
        bio: "Test recruiter for CareerFlow",
        skills: ["Recruiting", "HR", "Talent Acquisition"],
        experienceYears: 5,
        linkedinUrl: "https://linkedin.com/in/testrecruiter",
        githubUrl: "",
        portfolioUrl: "",
        resumeUrl: "",
        isActive: true,
        socialId: "100236442534619013178",
        provider: "google",
        createdAt: now,
        updatedAt: now,
      });
    }

    // Create companies
    const companies = [
      {
        name: "Google",
        slug: "google",
        description: "A multinational technology company specializing in Internet-related services and products.",
        logoUrl: "/companies/google.webp",
        websiteUrl: "https://google.com",
        industry: "Technology",
        companySize: "10000+",
        foundedYear: 1998,
        headquarters: "Mountain View, CA",
        remotePolicy: "Hybrid",
        benefits: ["Health Insurance", "401k", "Flexible Hours", "Remote Work", "Free Meals"],
        cultureTags: ["Innovative", "Collaborative", "Growth-oriented"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Microsoft",
        slug: "microsoft",
        description: "A multinational technology corporation that develops, manufactures, licenses, supports and sells computer software, consumer electronics and personal computers.",
        logoUrl: "/companies/microsoft.webp",
        websiteUrl: "https://microsoft.com",
        industry: "Technology",
        companySize: "10000+",
        foundedYear: 1975,
        headquarters: "Redmond, WA",
        remotePolicy: "Hybrid",
        benefits: ["Health Insurance", "401k", "Flexible Hours", "Remote Work"],
        cultureTags: ["Innovative", "Collaborative", "Growth-oriented"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Amazon",
        slug: "amazon",
        description: "An American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
        logoUrl: "/companies/amazon.svg",
        websiteUrl: "https://amazon.com",
        industry: "Technology",
        companySize: "10000+",
        foundedYear: 1994,
        headquarters: "Seattle, WA",
        remotePolicy: "Hybrid",
        benefits: ["Health Insurance", "401k", "Flexible Hours", "Remote Work"],
        cultureTags: ["Innovative", "Collaborative", "Growth-oriented"],
        createdAt: now,
        updatedAt: now,
      }
    ];

    const companyIds = [];
    for (const companyData of companies) {
      const companyId = await ctx.db.insert("companies", companyData);
      companyIds.push(companyId);
    }

    // Create real jobs
    const jobs = [
      {
        title: "Senior Software Engineer",
        description: "Join our engineering team to build innovative products that impact millions of users worldwide. You'll work on cutting-edge technologies and collaborate with talented engineers.",
        requirements: ["5+ years of software development experience", "Strong knowledge of JavaScript, Python, or Java", "Experience with cloud platforms (AWS, GCP, or Azure)", "Bachelor's degree in Computer Science or related field"],
        skillsRequired: ["JavaScript", "Python", "React", "Node.js", "AWS"],
        location: "Mountain View, CA",
        jobType: "full-time",
        experienceLevel: "senior",
        salaryMin: 150000,
        salaryMax: 250000,
        remoteWork: true,
        status: "open",
        isOpen: true,
        applicationCount: 0,
        companyId: companyIds[0], // Google
        recruiterId: recruiter.socialId || "100236442534619013178",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Product Manager",
        description: "Lead product development for our cloud services and drive innovation in enterprise solutions. You'll work closely with engineering, design, and business teams.",
        requirements: ["3+ years of product management experience", "Strong analytical and problem-solving skills", "Experience with agile development methodologies", "MBA or Bachelor's degree in Business or related field"],
        skillsRequired: ["Product Management", "Analytics", "Agile", "Leadership", "SQL"],
        location: "Seattle, WA",
        jobType: "full-time",
        experienceLevel: "mid",
        salaryMin: 120000,
        salaryMax: 180000,
        remoteWork: true,
        status: "open",
        isOpen: true,
        applicationCount: 0,
        companyId: companyIds[1], // Microsoft
        recruiterId: recruiter.socialId || "100236442534619013178",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Frontend Developer",
        description: "Build beautiful and responsive user interfaces for our e-commerce platform. You'll work with modern frameworks and collaborate with UX designers.",
        requirements: ["2+ years of frontend development experience", "Strong knowledge of React, Vue, or Angular", "Experience with CSS frameworks and responsive design", "Bachelor's degree in Computer Science or related field"],
        skillsRequired: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
        location: "Seattle, WA",
        jobType: "full-time",
        experienceLevel: "mid",
        salaryMin: 90000,
        salaryMax: 140000,
        remoteWork: true,
        status: "open",
        isOpen: true,
        applicationCount: 0,
        companyId: companyIds[2], // Amazon
        recruiterId: recruiter.socialId || "100236442534619013178",
        createdAt: now,
        updatedAt: now,
      }
    ];

    const jobIds = [];
    for (const jobData of jobs) {
      const jobId = await ctx.db.insert("jobs", jobData);
      jobIds.push(jobId);
    }

    return {
      success: true,
      message: "Real jobs created successfully",
      data: {
        recruiterId: recruiter._id,
        companyIds,
        jobIds,
      },
    };
  },
});
