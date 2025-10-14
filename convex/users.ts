import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return user;
  },
});

// Query to get user by Social ID
export const getUserBySocialId = query({
  args: { socialId: v.string() },
  handler: async (ctx, args) => {
    console.log('getUserBySocialId called with socialId:', args.socialId);
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();
    
    console.log('getUserBySocialId returning user:', user);
    return user;
  },
});

// Query to get user by ID (for backward compatibility)
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

// Query to get candidate by ID
export const getCandidateById = query({
  args: { candidateId: v.string() },
  handler: async (ctx, args) => {
    const candidate = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.candidateId))
      .filter((q) => q.eq(q.field("role"), "candidate"))
      .first();
    
    return candidate;
  },
});

// Query to get users by role
export const getUsersByRole = query({
  args: { role: v.union(v.literal("candidate"), v.literal("recruiter")) },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();

    return users;
  },
});

// Mutation to create a new user
export const createUser = mutation({
  args: {
    socialId: v.optional(v.string()),
    provider: v.optional(v.string()),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    profileImageUrl: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("recruiter")),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    experienceYears: v.optional(v.number()),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      ...args,
      skills: args.skills || [],
      experienceYears: args.experienceYears || 0,
      currentPosition: args.currentPosition || "",
      currentCompany: args.currentCompany || "",
      certificates: args.certificates || [],
      projects: args.projects || [],
      education: args.education || "",
      availability: args.availability || "",
      expectedSalary: args.expectedSalary || "",
      noticePeriod: args.noticePeriod || "",
      isActive: true,
      nameCustomized: false, // Initially not customized
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

// Mutation to update user profile
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    fullName: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    experienceYears: v.optional(v.number()),
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
  },
  handler: async (ctx, args) => {
    console.log('updateUser called with args:', args);
    const { userId, ...updates } = args;

    // If firstName or lastName is being updated, update fullName and mark as customized
    if (updates.firstName || updates.lastName) {
      const currentUser = await ctx.db.get(userId);
      if (currentUser) {
        updates.fullName = `${updates.firstName || currentUser.firstName} ${updates.lastName || currentUser.lastName}`.trim();
        // Mark that the user has customized their name
        updates.nameCustomized = true;
      }
    }

    console.log('Updating user with:', { userId, updates });
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    console.log('User updated successfully');
    return userId;
  },
});

// Mutation to delete user
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Delete related data first
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.userId))
      .collect();

    for (const application of applications) {
      await ctx.db.delete(application._id);
    }

    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const savedJob of savedJobs) {
      await ctx.db.delete(savedJob._id);
    }

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_recruiter", (q) => q.eq("recruiterId", args.userId))
      .collect();

    for (const job of jobs) {
      await ctx.db.delete(job._id);
    }

    const companies = await ctx.db
      .query("companies")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
      .collect();

    for (const company of companies) {
      await ctx.db.delete(company._id);
    }

    // Delete the user
    await ctx.db.delete(args.userId);
    return args.userId;
  },
});

// Migration to set nameCustomized field for existing users
export const migrateNameCustomized = mutation({
  args: {},
  handler: async (ctx) => {
    console.log('Starting nameCustomized migration...');
    
    const users = await ctx.db.query("users").collect();
    let updatedCount = 0;
    
    for (const user of users) {
      if (user.nameCustomized === undefined) {
        // Set nameCustomized to true if user has custom names (not empty)
        const hasCustomNames = (user.firstName && user.firstName.trim() !== '') || 
                              (user.lastName && user.lastName.trim() !== '');
        
        await ctx.db.patch(user._id, {
          nameCustomized: hasCustomNames
        });
        updatedCount++;
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} users.`);
    return { updatedCount };
  },
});

// Mutation to manually update user role (for debugging and fixing existing users)
export const updateUserRole = mutation({
  args: {
    socialId: v.string(),
    role: v.union(v.literal("candidate"), v.literal("recruiter")),
  },
  handler: async (ctx, args) => {
    console.log('updateUserRole called with:', args);
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    console.log('Found user:', user);
    console.log('Updating role from', user.role, 'to', args.role);

    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    });

    console.log('Role updated successfully');
    return { success: true, userId: user._id, newRole: args.role };
  },
});

// Mutation to sync user from auth provider
export const syncUser = mutation({
  args: {
    socialId: v.optional(v.string()),
    provider: v.optional(v.string()),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("candidate"), v.literal("recruiter"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      // Update existing user - only update basic fields, don't overwrite custom profile data
      console.log('Updating existing user, preserving custom data');
      const updates = {
        socialId: args.socialId,
        provider: args.provider,
        updatedAt: now,
      };
      
      // Only update name fields if they haven't been customized by the user
      // This prevents overwriting user's custom profile data
      // Be very conservative: only update if nameCustomized is explicitly false AND names are empty
      const shouldUpdateNames = existingUser.nameCustomized === false && 
                               (!existingUser.firstName || existingUser.firstName.trim() === '') &&
                               (!existingUser.lastName || existingUser.lastName.trim() === '');
      
      if (shouldUpdateNames) {
        if (args.firstName && args.firstName !== existingUser.firstName) {
          updates.firstName = args.firstName;
        }
        if (args.lastName && args.lastName !== existingUser.lastName) {
          updates.lastName = args.lastName;
        }
        if (updates.firstName || updates.lastName) {
          updates.fullName = `${updates.firstName || existingUser.firstName} ${updates.lastName || existingUser.lastName}`.trim();
        }
      }
      // Only update profile image if user doesn't have a custom one
      // This prevents Google sync from overriding user's uploaded image
      if (args.profileImageUrl !== existingUser.profileImageUrl && 
          (!existingUser.profileImageUrl || existingUser.profileImageUrl.includes('lh3.googleusercontent.com'))) {
        updates.profileImageUrl = args.profileImageUrl;
      }
      // Always update role if provided (this is important for onboarding)
      if (args.role && args.role !== existingUser.role) {
        updates.role = args.role;
      }
      
      console.log('Sync updates:', updates);
      await ctx.db.patch(existingUser._id, updates);
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        socialId: args.socialId,
        provider: args.provider,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: args.fullName || `${args.firstName} ${args.lastName}`.trim(),
        profileImageUrl: args.profileImageUrl,
        role: args.role || "candidate",
        phone: "",
        location: "",
        bio: "",
        skills: [],
        experienceYears: 0,
        currentPosition: "",
        currentCompany: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        resumeUrl: "",
        certificates: [],
        projects: [],
        education: "",
        availability: "",
        expectedSalary: "",
        noticePeriod: "",
        isActive: true,
        nameCustomized: false, // Initially not customized
        createdAt: now,
        updatedAt: now,
      });
      return userId;
    }
  },
});

// Cleanup function to fix invalid resume URLs
export const cleanupInvalidResumeUrls = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let cleanedCount = 0;
    
    for (const user of users) {
      if (user.resumeUrl && 
          (user.resumeUrl.startsWith('/') || 
           user.resumeUrl.includes('Profile%20Resume') ||
           user.resumeUrl.includes('Profile Resume') ||
           !user.resumeUrl.startsWith('http'))) {
        
        await ctx.db.patch(user._id, {
          resumeUrl: "",
          updatedAt: Date.now()
        });
        cleanedCount++;
      }
    }
    
    return { cleanedCount, message: `Cleaned ${cleanedCount} invalid resume URLs` };
  },
});
