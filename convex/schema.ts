import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - stores user profiles
  users: defineTable({
    socialId: v.optional(v.string()), // Social login ID (Google/Facebook)
    provider: v.optional(v.string()), // Social provider (google, facebook, email)
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    profileImageUrl: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("recruiter")),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.array(v.string()),
    experienceYears: v.number(),
    currentPosition: v.optional(v.string()),
    currentCompany: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    certificates: v.optional(v.array(v.string())),
    projects: v.optional(v.array(v.string())),
    education: v.optional(v.string()),
    availability: v.optional(v.string()),
    expectedSalary: v.optional(v.string()),
    noticePeriod: v.optional(v.string()),
    isActive: v.boolean(),
    nameCustomized: v.optional(v.boolean()), // Track if user has customized their name
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_socialId", ["socialId"])
    .index("by_provider", ["provider"])
    .index("by_role", ["role"]),

  // Companies table - stores company information
  companies: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    industry: v.optional(v.string()),
    companySize: v.optional(v.string()),
    foundedYear: v.optional(v.number()),
    headquarters: v.optional(v.string()),
    remotePolicy: v.optional(v.string()),
    benefits: v.optional(v.array(v.string())),
    cultureTags: v.optional(v.array(v.string())),
    socialLinks: v.optional(v.object({
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      facebook: v.optional(v.string()),
    })),
    isVerified: v.boolean(),
    isActive: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_created_by", ["createdBy"])
    .index("by_active", ["isActive"]),

  // Jobs table - stores job postings
  jobs: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    requirements: v.optional(v.string()),
    responsibilities: v.optional(v.string()),
    benefits: v.optional(v.string()),
    skillsRequired: v.array(v.string()),
    skillsPreferred: v.optional(v.array(v.string())),
    status: v.union(v.literal("open"), v.literal("closed"), v.literal("paused")),
    isOpen: v.boolean(),
    location: v.string(),
    remoteWork: v.boolean(),
    jobType: v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"), v.literal("internship")),
    experienceLevel: v.union(v.literal("entry"), v.literal("mid"), v.literal("senior"), v.literal("lead")),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    salaryPeriod: v.optional(v.string()),
    applicationDeadline: v.optional(v.number()),
    startDate: v.optional(v.number()),
    applicationCount: v.number(),
    viewCount: v.number(),
    featured: v.boolean(),
    urgent: v.boolean(),
    tags: v.optional(v.array(v.string())),
    recruiterId: v.string(), // Clerk ID of the recruiter
    companyId: v.id("companies"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_recruiter", ["recruiterId"])
    .index("by_company", ["companyId"])
    .index("by_status", ["status", "isOpen"])
    .index("by_featured", ["featured", "isOpen"])
    .index("by_location", ["location", "isOpen"])
    .index("by_job_type", ["jobType", "isOpen"])
    .index("by_experience", ["experienceLevel", "isOpen"])
    .index("by_created_at", ["createdAt"]),

  // Applications table - stores job applications
  applications: defineTable({
    candidateId: v.id("users"), // Convex ID of the candidate
    jobId: v.id("jobs"),
    status: v.union(v.literal("pending"), v.literal("reviewed"), v.literal("shortlisted"), v.literal("scheduled_for_interview"), v.literal("interviewed"), v.literal("rejected"), v.literal("hired")),
    coverLetter: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    rating: v.optional(v.number()),
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
    appliedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_candidate", ["candidateId"])
    .index("by_job", ["jobId"])
    .index("by_status", ["status"])
    .index("by_applied_at", ["appliedAt"]),

  // Saved jobs table - stores user's saved jobs
  savedJobs: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
    savedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_user_job", ["userId", "jobId"]),

  // File uploads table - stores file metadata
  fileUploads: defineTable({
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    fileUrl: v.string(),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  })
    .index("by_uploaded_by", ["uploadedBy"])
    .index("by_file_type", ["fileType"]),
});
