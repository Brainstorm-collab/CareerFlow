# Database Setup Guide for CareerFlow Job Portal

## Overview
This guide will help you set up your Supabase database with the necessary tables and sample data for the job portal.

## Prerequisites
- Supabase project created
- Database connection details ready

## Step 1: Run the SQL Setup Script

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute the script

### Option B: Using Supabase CLI
```bash
supabase db reset
# Then copy the contents of supabase-setup.sql to your migrations
```

## Step 2: Verify Tables Created
After running the script, you should see these tables:
- `users` - User profiles and roles
- `companies` - Company information
- `jobs` - Job postings
- `saved_jobs` - User's saved jobs
- `applications` - Job applications

## Step 3: Check Sample Data
The script will automatically populate:
- **8 Sample Companies**: Google, Microsoft, Amazon, Meta, Netflix, Uber, Atlassian, IBM
- **10 Sample Jobs**: Various positions with realistic descriptions, salaries, and benefits

## Step 4: Test the Application
1. Start your React application: `npm run dev`
2. Navigate to `/onboarding` to set up your role
3. Choose "Job Seeker" to see the job listings
4. Choose "Recruiter" to post new jobs

## Sample Data Included

### Companies
- Google (Mountain View, CA)
- Microsoft (Redmond, WA)
- Amazon (Seattle, WA)
- Meta (Menlo Park, CA)
- Netflix (Los Gatos, CA)
- Uber (San Francisco, CA)
- Atlassian (Sydney, Australia)
- IBM (Armonk, NY)

### Jobs
- Senior Software Engineer (Google)
- Frontend Developer (Microsoft)
- Data Scientist (Amazon)
- Product Manager (Meta)
- DevOps Engineer (Netflix)
- UX Designer (Netflix)
- Backend Developer (Amazon)
- Marketing Specialist (Uber)
- Sales Representative (Atlassian)
- Customer Success Manager (IBM)

## Troubleshooting

### Common Issues
1. **Tables not created**: Check if you have proper permissions
2. **Sample data not inserted**: Verify the script ran completely
3. **Connection errors**: Check your environment variables

### Environment Variables
Make sure these are set in your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps
After setup, you can:
1. Customize the sample data
2. Add more companies and jobs
3. Test the full application flow
4. Deploy to production

## Support
If you encounter issues:
1. Check the Supabase logs
2. Verify your database permissions
3. Ensure all environment variables are set correctly

