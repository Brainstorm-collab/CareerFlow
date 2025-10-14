import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Test function to create sample jobs in the database
export const createTestJobs = mutation({
  args: {},
  handler: async (ctx) => {
    // First, find an existing user to use as the creator
    const existingUser = await ctx.db.query("users").first();
    if (!existingUser) {
      throw new Error("No users found in database. Please sign in first.");
    }

    // Create a test company
    const companyId = await ctx.db.insert("companies", {
      name: "Test Company",
      slug: "test-company",
      description: "A test company for demonstration purposes",
      websiteUrl: "https://testcompany.com",
      industry: "Technology",
      companySize: "50-200",
      headquarters: "San Francisco, CA",
      isVerified: false,
      isActive: true,
      createdBy: existingUser._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create test jobs
    const testJobs = [
      {
        title: "Frontend Developer",
        slug: "frontend-developer-test",
        description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-facing web applications using modern technologies.",
        requirements: "3+ years of experience with React, JavaScript, HTML, CSS. Experience with TypeScript is a plus.",
        location: "San Francisco, CA",
        jobType: "full-time",
        experienceLevel: "mid",
        remoteWork: true,
        salaryMin: 80000,
        salaryMax: 120000,
        salaryCurrency: "USD",
        salaryPeriod: "yearly",
        benefits: "Health insurance, 401k, flexible hours",
        skillsRequired: ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
        status: "open",
        isOpen: true,
        applicationCount: 0,
        viewCount: 0,
        featured: false,
        urgent: false,
        recruiterId: existingUser.socialId || existingUser._id || "test_recruiter_id",
        companyId: companyId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "Backend Developer",
        slug: "backend-developer-test",
        description: "Join our backend team to build scalable server-side applications. You'll work with Node.js, databases, and cloud services.",
        requirements: "3+ years of experience with Node.js, databases (SQL/NoSQL), REST APIs. Experience with AWS is preferred.",
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "senior",
        remoteWork: false,
        salaryMin: 100000,
        salaryMax: 150000,
        salaryCurrency: "USD",
        salaryPeriod: "yearly",
        benefits: "Health insurance, 401k, stock options",
        skillsRequired: ["Node.js", "JavaScript", "SQL", "MongoDB", "AWS"],
        status: "open",
        isOpen: true,
        applicationCount: 0,
        viewCount: 0,
        featured: false,
        urgent: false,
        recruiterId: existingUser.socialId || existingUser._id || "test_recruiter_id",
        companyId: companyId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "UI/UX Designer",
        slug: "ui-ux-designer-test",
        description: "We need a creative UI/UX Designer to design beautiful and intuitive user interfaces for our products.",
        requirements: "2+ years of experience in UI/UX design. Proficiency in Figma, Adobe Creative Suite. Portfolio required.",
        location: "Austin, TX",
        jobType: "contract",
        experienceLevel: "mid",
        remoteWork: true,
        salaryMin: 60000,
        salaryMax: 90000,
        salaryCurrency: "USD",
        salaryPeriod: "yearly",
        benefits: "Flexible schedule, professional development",
        skillsRequired: ["Figma", "Adobe Creative Suite", "Sketch", "Prototyping"],
        status: "open",
        isOpen: true,
        applicationCount: 0,
        viewCount: 0,
        featured: false,
        urgent: false,
        recruiterId: existingUser.socialId || existingUser._id || "test_recruiter_id",
        companyId: companyId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];

    const createdJobs = [];
    for (const job of testJobs) {
      const jobId = await ctx.db.insert("jobs", job);
      createdJobs.push({ ...job, _id: jobId });
    }

    return {
      message: `Created ${createdJobs.length} test jobs successfully`,
      jobs: createdJobs,
      companyId
    };
  },
});

// Test function to clear all test data
export const clearTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all jobs
    const jobs = await ctx.db.query("jobs").collect();
    for (const job of jobs) {
      await ctx.db.delete(job._id);
    }

    // Delete all companies
    const companies = await ctx.db.query("companies").collect();
    for (const company of companies) {
      await ctx.db.delete(company._id);
    }

    // Delete all saved jobs
    const savedJobs = await ctx.db.query("savedJobs").collect();
    for (const savedJob of savedJobs) {
      await ctx.db.delete(savedJob._id);
    }

    return {
      message: "Test data cleared successfully",
      deletedJobs: jobs.length,
      deletedCompanies: companies.length,
      deletedSavedJobs: savedJobs.length
    };
  },
});
