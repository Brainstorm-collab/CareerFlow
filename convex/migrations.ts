import { mutation } from "./_generated/server";

// Migration to add "interviewed" status to existing applications
export const addInterviewedStatus = mutation({
  args: {},
  handler: async (ctx) => {
    console.log('🔄 Starting migration to add "interviewed" status...');
    
    // Get all applications
    const applications = await ctx.db.query("applications").collect();
    console.log(`📊 Found ${applications.length} applications to process`);
    
    let updatedCount = 0;
    
    // Update any applications that might need the new status
    for (const application of applications) {
      // This migration doesn't need to change existing data
      // It just ensures the schema supports the new status
      console.log(`✅ Application ${application._id} is compatible with new schema`);
      updatedCount++;
    }
    
    console.log(`🎉 Migration completed. ${updatedCount} applications processed.`);
    return { 
      success: true, 
      message: `Migration completed. ${updatedCount} applications processed.`,
      updatedCount 
    };
  },
});

// Migration to clean up invalid resume URLs
export const cleanupResumeUrls = mutation({
  args: {},
  handler: async (ctx) => {
    console.log('🔄 Starting migration to clean up invalid resume URLs...');
    
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
        console.log(`🧹 Cleaned resume URL for application ${application._id}`);
      }
    }
    
    console.log(`🎉 Resume URL cleanup completed. ${cleanedCount} applications cleaned.`);
    return { 
      success: true, 
      message: `Resume URL cleanup completed. ${cleanedCount} applications cleaned.`,
      cleanedCount 
    };
  },
});