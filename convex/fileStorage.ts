import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for resume files
export const generateUploadUrl = mutation({
  args: {
    socialId: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the user by socialId
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if a file with the same name already exists for this user
    const existingFiles = await ctx.db
      .query("fileUploads")
      .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", user._id))
      .collect();

    const existingFile = existingFiles.find(file => 
      file.fileName.toLowerCase() === args.fileName.toLowerCase()
    );

    if (existingFile) {
      // If file with same name exists, delete the old one first
      console.log(`Deleting existing file: ${existingFile.fileName}`);
      
      // Delete from storage if it has a valid storage ID
      if (existingFile.fileUrl && existingFile.fileUrl.includes('/api/storage/')) {
        try {
          const storageId = existingFile.fileUrl.split('/api/storage/')[1];
          await ctx.storage.delete(storageId);
        } catch (error) {
          console.error('Error deleting old file from storage:', error);
        }
      }
      
      // Delete from database
      await ctx.db.delete(existingFile._id);
    }

    // Generate upload URL
    const uploadUrl = await ctx.storage.generateUploadUrl();

    // Store file metadata in fileUploads table
    const fileId = await ctx.db.insert("fileUploads", {
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      fileUrl: uploadUrl, // This will be updated after upload
      uploadedBy: user._id,
      uploadedAt: Date.now(),
    });

    return {
      uploadUrl,
      fileId,
      replacedExisting: !!existingFile,
    };
  },
});

// Update file URL after successful upload
export const updateFileUrl = mutation({
  args: {
    fileId: v.id("fileUploads"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get the file URL from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    
    if (!fileUrl) {
      throw new Error("Failed to get file URL from storage");
    }

    // Update the file record with the actual URL
    await ctx.db.patch(args.fileId, {
      fileUrl: fileUrl,
    });

    return {
      success: true,
      fileUrl: fileUrl,
    };
  },
});

// Complete resume upload process - upload file and update user profile
export const uploadResumeAndUpdateProfile = mutation({
  args: {
    socialId: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get the user by socialId
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the file URL from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    
    if (!fileUrl) {
      throw new Error("Failed to get file URL from storage");
    }

    // Check if a resume file with the same name already exists for this user
    const existingFiles = await ctx.db
      .query("fileUploads")
      .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", user._id))
      .collect();

    const existingResumeFile = existingFiles.find(file => 
      file.fileName.toLowerCase() === args.fileName.toLowerCase() &&
      file.fileType.includes('pdf')
    );

    if (existingResumeFile) {
      // Delete the old resume file from storage
      if (existingResumeFile.fileUrl && existingResumeFile.fileUrl.includes('/api/storage/')) {
        try {
          const oldStorageId = existingResumeFile.fileUrl.split('/api/storage/')[1];
          await ctx.storage.delete(oldStorageId);
        } catch (error) {
          console.error('Error deleting old resume file from storage:', error);
        }
      }
      
      // Delete the old file record from database
      await ctx.db.delete(existingResumeFile._id);
    }

    // Create new file record
    const fileId = await ctx.db.insert("fileUploads", {
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      fileUrl: fileUrl,
      uploadedBy: user._id,
      uploadedAt: Date.now(),
    });

    // Update user's resumeUrl in the users table
    await ctx.db.patch(user._id, {
      resumeUrl: fileUrl,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      fileUrl: fileUrl,
      fileId: fileId,
      replacedExisting: !!existingResumeFile,
    };
  },
});

// Get file by ID
export const getFile = query({
  args: { fileId: v.id("fileUploads") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null;
    }

    // Get the actual file URL
    const fileUrl = await ctx.storage.getUrl(args.fileId);
    
    return {
      ...file,
      downloadUrl: fileUrl,
    };
  },
});

// Get files by user
export const getFilesByUser = query({
  args: { socialId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      return [];
    }

    const files = await ctx.db
      .query("fileUploads")
      .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", user._id))
      .collect();

    // Get download URLs for all files
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        let downloadUrl = null;
        
        if (file.fileUrl) {
          try {
            // Extract storage ID from URL if it's a full URL
            let storageId = file.fileUrl;
            if (file.fileUrl.includes('/api/storage/')) {
              // Extract UUID from URL like "https://wary-duck-375.convex.cloud/api/storage/e9ad3e88-ff1c-4b0b-a29f-a03bb32b1620"
              storageId = file.fileUrl.split('/api/storage/')[1];
            }
            
            downloadUrl = await ctx.storage.getUrl(storageId);
          } catch (error) {
            console.error('Error getting download URL for file:', file.fileName, error);
            // If fileUrl is already a download URL, use it directly
            downloadUrl = file.fileUrl;
          }
        }
        
        return {
          ...file,
          downloadUrl,
        };
      })
    );

    return filesWithUrls;
  },
});

// Delete file
export const deleteFile = mutation({
  args: { fileId: v.id("fileUploads") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    // Delete from storage if it has a valid storage ID
    if (file.fileUrl && file.fileUrl.includes('/api/storage/')) {
      try {
        const storageId = file.fileUrl.split('/api/storage/')[1];
        await ctx.storage.delete(storageId);
      } catch (error) {
        console.error('Error deleting file from storage:', error);
      }
    }
    
    // Delete from database
    await ctx.db.delete(args.fileId);

    return { success: true };
  },
});

// Clean up duplicate files for a user (keep only the latest version of each file)
export const cleanupDuplicateFiles = mutation({
  args: { socialId: v.string() },
  handler: async (ctx, args) => {
    // Get the user by socialId
    const user = await ctx.db
      .query("users")
      .withIndex("by_socialId", (q) => q.eq("socialId", args.socialId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all files for this user
    const files = await ctx.db
      .query("fileUploads")
      .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", user._id))
      .collect();

    // Group files by name (case-insensitive)
    const filesByName = new Map();
    
    files.forEach(file => {
      const fileName = file.fileName.toLowerCase();
      if (!filesByName.has(fileName)) {
        filesByName.set(fileName, []);
      }
      filesByName.get(fileName).push(file);
    });

    let deletedCount = 0;

    // For each group of files with the same name, keep only the latest one
    for (const [fileName, fileGroup] of filesByName) {
      if (fileGroup.length > 1) {
        // Sort by upload date (newest first)
        fileGroup.sort((a, b) => b.uploadedAt - a.uploadedAt);
        
        // Keep the first (newest) file, delete the rest
        const filesToDelete = fileGroup.slice(1);
        
        for (const fileToDelete of filesToDelete) {
          console.log(`Deleting duplicate file: ${fileToDelete.fileName}`);
          
          // Delete from storage if it has a valid storage ID
          if (fileToDelete.fileUrl && fileToDelete.fileUrl.includes('/api/storage/')) {
            try {
              const storageId = fileToDelete.fileUrl.split('/api/storage/')[1];
              await ctx.storage.delete(storageId);
            } catch (error) {
              console.error('Error deleting duplicate file from storage:', error);
            }
          }
          
          // Delete from database
          await ctx.db.delete(fileToDelete._id);
          deletedCount++;
        }
      }
    }

    return {
      success: true,
      deletedCount,
      message: `Cleaned up ${deletedCount} duplicate files`,
    };
  },
});
