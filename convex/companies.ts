import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all companies
export const getCompanies = query({
  args: {
    limit: v.optional(v.number()),
    industry: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { limit = 20, industry, isActive = true } = args;

    let query = ctx.db.query("companies");

    if (isActive !== undefined) {
      query = query.withIndex("by_active", (q) => q.eq("isActive", isActive));
    }

    if (industry && industry !== "all") {
      query = query.filter((q) => q.eq(q.field("industry"), industry));
    }

    const companies = await query
      .order("desc")
      .take(limit);

    return companies;
  },
});

// Query to get company by ID
export const getCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    return company;
  },
});

// Query to get company by slug
export const getCompanyBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const company = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return company;
  },
});

// Query to get companies by creator
export const getCompaniesByCreator = query({
  args: { createdBy: v.id("users") },
  handler: async (ctx, args) => {
    const companies = await ctx.db
      .query("companies")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.createdBy))
      .order("desc")
      .collect();

    return companies;
  },
});

// Mutation to create a new company
export const createCompany = mutation({
  args: {
    name: v.string(),
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
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const slug = args.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const companyId = await ctx.db.insert("companies", {
      ...args,
      slug,
      isVerified: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return companyId;
  },
});

// Mutation to update company
export const updateCompany = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.optional(v.string()),
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
    isVerified: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { companyId, ...updates } = args;

    // If name is being updated, regenerate slug
    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    await ctx.db.patch(companyId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return companyId;
  },
});

// Mutation to delete company
export const deleteCompany = mutation({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    // Delete related jobs first
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const job of jobs) {
      await ctx.db.delete(job._id);
    }

    // Delete the company
    await ctx.db.delete(args.companyId);
    return args.companyId;
  },
});
