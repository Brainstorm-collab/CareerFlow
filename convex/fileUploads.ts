import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get file uploads by user
export const getFileUploadsByUser = query({
  args: { uploadedBy: v.id("users") },
  handler: async (ctx, args) => {
    const fileUploads = await ctx.db
      .query("fileUploads")
      .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", args.uploadedBy))
      .order("desc")
      .collect();

    return fileUploads;
  },
});

// Query to get file upload by ID
export const getFileUpload = query({
  args: { fileUploadId: v.id("fileUploads") },
  handler: async (ctx, args) => {
    const fileUpload = await ctx.db.get(args.fileUploadId);
    return fileUpload;
  },
});

// Mutation to create file upload record
export const createFileUpload = mutation({
  args: {
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    fileUrl: v.string(),
    uploadedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const fileUploadId = await ctx.db.insert("fileUploads", {
      ...args,
      uploadedAt: Date.now(),
    });

    return fileUploadId;
  },
});

// Mutation to delete file upload record
export const deleteFileUpload = mutation({
  args: { fileUploadId: v.id("fileUploads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.fileUploadId);
    return args.fileUploadId;
  },
});

// Mutation to generate upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Mutation to get file URL
export const getFileUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

