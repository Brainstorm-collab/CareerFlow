# Supabase Setup Guide for CareerFlow Job Portal

This guide will help you resolve the 401 Unauthorized and 400 Bad Request errors you're experiencing with your Supabase integration.

## Issues Identified

1. **401 Unauthorized errors** when accessing `saved_jobs` table
2. **400 Bad Request errors** when accessing `applications` table and storage
3. **Multiple GoTrueClient instances** warning
4. **Missing or incorrect RLS policies** for Clerk authentication

## Step-by-Step Solution

### 1. Database Setup

First, you need to run the complete database setup in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire contents of `supabase-setup-complete.sql`
4. Run the SQL script

This will:
- Create all necessary tables with proper relationships
- Enable Row Level Security (RLS) on all tables
- Create RLS policies that work with Clerk JWT tokens
- Insert sample data for testing

### 2. Environment Variables

Ensure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Clerk JWT Template Configuration

In your Clerk dashboard, ensure you have a JWT template configured for Supabase:

1. Go to Clerk Dashboard → JWT Templates
2. Create a new template named "supabase"
3. Use this configuration:

```json
{
  "aud": "authenticated",
  "exp": "{{exp}}",
  "iat": "{{iat}}",
  "iss": "{{iss}}",
  "sub": "{{user.id}}"
}
```

### 4. Restart Your Application

After running the SQL script:
1. Stop your React development server
2. Clear your browser cache and local storage
3. Restart the development server

## How the Solution Works

### RLS Policies

The RLS policies are designed to work with Clerk JWT tokens:

- **Users can only access their own data** (saved jobs, applications)
- **Jobs are readable by all authenticated users**
- **Companies are readable by all authenticated users**
- **Proper authorization checks** for updates and deletes

### JWT Token Handling

The updated Supabase client:
- Creates a single base instance to avoid conflicts
- Creates temporary authenticated instances for each request
- Properly passes Clerk JWT tokens in Authorization headers
- Handles token refresh and error cases gracefully

### User Synchronization

Users are automatically created in Supabase when they first sign in through Clerk, ensuring:
- Proper user records exist for database operations
- RLS policies can properly identify users
- Seamless integration between Clerk and Supabase

## Testing the Setup

After completing the setup:

1. **Sign in** with a Clerk account
2. **Check the console** for successful user sync messages
3. **Try saving a job** - should work without 401 errors
4. **Check applications** - should load without 400 errors
5. **Verify storage access** - resume uploads should work

## Troubleshooting

### Still Getting 401 Errors?

1. Check that the SQL script ran successfully
2. Verify RLS policies are created in Supabase dashboard
3. Ensure Clerk JWT template is configured correctly
4. Check that user sync is working (look for console messages)

### Still Getting 400 Errors?

1. Verify table structures match the SQL script
2. Check that foreign key relationships are correct
3. Ensure sample data was inserted properly
4. Verify user records exist in the users table

### Multiple GoTrueClient Warning?

This should be resolved by the updated Supabase client configuration. The warning appears when multiple Supabase instances are created in the same context.

## Database Schema Overview

```
users (clerk_id, email, first_name, last_name, role)
├── jobs (recruiter_id references users.clerk_id)
├── saved_jobs (user_id references users.clerk_id)
└── applications (user_id references users.clerk_id)

companies
└── jobs (company_id references companies.id)
```

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their own data
- **JWT-based authentication** with Clerk integration
- **Proper authorization** for different user roles
- **Audit trails** with created_at and updated_at timestamps

## Next Steps

After resolving these issues:

1. Test all CRUD operations for jobs, applications, and saved jobs
2. Implement additional features like job search and filtering
3. Add admin functionality for user management
4. Implement email notifications for applications
5. Add analytics and reporting features

## Support

If you continue to experience issues:

1. Check the Supabase logs in your dashboard
2. Verify Clerk JWT token generation
3. Test database connections directly in Supabase
4. Review browser console for detailed error messages

The setup should resolve all the authentication and authorization issues you're currently experiencing.
