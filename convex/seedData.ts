import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to seed initial data
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Create a test user
    const userId = await ctx.db.insert("users", {
      email: "test@careerflow.com",
      firstName: "Test",
      lastName: "User",
      fullName: "Test User",
      role: "recruiter",
      phone: "+1234567890",
      location: "San Francisco, CA",
      bio: "Test recruiter for CareerFlow",
      skills: ["Recruiting", "HR", "Talent Acquisition"],
      experienceYears: 5,
      linkedinUrl: "https://linkedin.com/in/testuser",
      githubUrl: "",
      portfolioUrl: "",
      resumeUrl: "",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create a test company
    const companyId = await ctx.db.insert("companies", {
      name: "TechCorp Inc",
      slug: "techcorp-inc",
      description: "A leading technology company focused on innovation and growth.",
      logoUrl: "",
      coverImageUrl: "",
      websiteUrl: "https://techcorp.com",
      industry: "Technology",
      companySize: "100-500",
      foundedYear: 2015,
      headquarters: "San Francisco, CA",
      remotePolicy: "Hybrid",
      benefits: ["Health Insurance", "401k", "Flexible Hours", "Remote Work"],
      cultureTags: ["Innovative", "Collaborative", "Growth-oriented"],
      socialLinks: {
        linkedin: "https://linkedin.com/company/techcorp",
        twitter: "https://twitter.com/techcorp",
        facebook: "",
      },
      isVerified: true,
      isActive: true,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    });

    // Create some test jobs
    const job1Id = await ctx.db.insert("jobs", {
      title: "Senior Frontend Developer",
      slug: "senior-frontend-developer",
      description: "We are looking for a talented Senior Frontend Developer to join our team. You will be responsible for building user-facing features and ensuring a great user experience.",
      requirements: "5+ years of React experience, TypeScript, CSS/SCSS, Git",
      responsibilities: "Develop user interfaces, collaborate with design team, optimize performance",
      benefits: "Competitive salary, health insurance, flexible hours",
      skillsRequired: ["React", "TypeScript", "CSS", "JavaScript", "Git"],
      skillsPreferred: ["Next.js", "Tailwind CSS", "GraphQL"],
      status: "open",
      isOpen: true,
      location: "San Francisco, CA",
      remoteWork: true,
      jobType: "full-time",
      experienceLevel: "senior",
      salaryMin: 120000,
      salaryMax: 160000,
      salaryCurrency: "USD",
      salaryPeriod: "year",
      applicationDeadline: now + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      startDate: now + (7 * 24 * 60 * 60 * 1000), // 7 days from now
      applicationCount: 0,
      viewCount: 0,
      featured: true,
      urgent: false,
      tags: ["Frontend", "React", "TypeScript", "Remote"],
      recruiterId: userId,
      companyId: companyId,
      createdAt: now,
      updatedAt: now,
    });

    const job2Id = await ctx.db.insert("jobs", {
      title: "Product Manager",
      slug: "product-manager",
      description: "Join our product team as a Product Manager. You will be responsible for defining product strategy and working with cross-functional teams.",
      requirements: "3+ years product management experience, analytical skills, communication skills",
      responsibilities: "Define product roadmap, work with engineering team, analyze user feedback",
      benefits: "Competitive salary, equity, health insurance",
      skillsRequired: ["Product Management", "Analytics", "Communication", "Strategy"],
      skillsPreferred: ["Agile", "Figma", "SQL"],
      status: "open",
      isOpen: true,
      location: "New York, NY",
      remoteWork: false,
      jobType: "full-time",
      experienceLevel: "mid",
      salaryMin: 100000,
      salaryMax: 140000,
      salaryCurrency: "USD",
      salaryPeriod: "year",
      applicationDeadline: now + (21 * 24 * 60 * 60 * 1000), // 21 days from now
      startDate: now + (14 * 24 * 60 * 60 * 1000), // 14 days from now
      applicationCount: 0,
      viewCount: 0,
      featured: false,
      urgent: true,
      tags: ["Product", "Management", "Strategy"],
      recruiterId: userId,
      companyId: companyId,
      createdAt: now,
      updatedAt: now,
    });

    return {
      userId,
      companyId,
      jobIds: [job1Id, job2Id],
      message: "Sample data created successfully!"
    };
  },
});

// Mutation to create real jobs for testing applications
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

