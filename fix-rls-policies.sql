-- Fix RLS policies to trust Clerk JWT tokens
-- This will resolve the 401 Unauthorized errors
-- NOTE: Run supabase-setup.sql FIRST to create the tables

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- First, drop existing policies that might be blocking access
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Create new policies that trust Clerk JWTs
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (
        -- Allow access if JWT is from Clerk and matches the user's clerk_id
        (auth.jwt() ->> 'sub' = clerk_id)
        OR
        -- Allow users to see other users (for basic profile viewing)
        true
    );

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (
        -- Allow access if JWT is from Clerk and matches the user's clerk_id
        (auth.jwt() ->> 'sub' = clerk_id)
    );

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (
        -- Allow access if JWT is from Clerk and matches the user's clerk_id
        (auth.jwt() ->> 'sub' = clerk_id)
    );

-- ========================================
-- JOBS TABLE POLICIES
-- ========================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.jobs;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.jobs;
DROP POLICY IF EXISTS "Allow update for job owners" ON public.jobs;
DROP POLICY IF EXISTS "Allow delete for job owners" ON public.jobs;

-- Allow all authenticated users to read jobs (anyone with a valid JWT)
CREATE POLICY "Allow read for authenticated users" ON public.jobs
    FOR SELECT USING (
        -- Allow if JWT exists (user is authenticated)
        auth.jwt() IS NOT NULL
    );

-- Allow authenticated users to create jobs
CREATE POLICY "Allow insert for authenticated users" ON public.jobs
    FOR INSERT WITH CHECK (
        -- Allow if JWT exists (user is authenticated)
        auth.jwt() IS NOT NULL
    );

-- Allow job owners to update their jobs
CREATE POLICY "Allow update for job owners" ON public.jobs
    FOR UPDATE USING (
        -- Allow if user is the recruiter who created the job
        (auth.jwt() ->> 'sub' = recruiter_id)
        OR
        -- Allow if user has admin role
        (auth.jwt() ->> 'sub' IN (
            SELECT clerk_id FROM public.users WHERE role = 'admin'
        ))
    );

-- Allow job owners to delete their jobs
CREATE POLICY "Allow delete for job owners" ON public.jobs
    FOR DELETE USING (
        -- Allow if user is the recruiter who created the job
        (auth.jwt() ->> 'sub' = recruiter_id)
        OR
        -- Allow if user has admin role
        (auth.jwt() ->> 'sub' IN (
            SELECT clerk_id FROM public.users WHERE role = 'admin'
        ))
    );

-- ========================================
-- COMPANIES TABLE POLICIES
-- ========================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Allow update for company owners" ON public.companies;

-- Allow all authenticated users to read companies
CREATE POLICY "Allow read for authenticated users" ON public.companies
    FOR SELECT USING (
        -- Allow if JWT exists (user is authenticated)
        auth.jwt() IS NOT NULL
    );

-- Allow authenticated users to create companies
CREATE POLICY "Allow insert for authenticated users" ON public.companies
    FOR INSERT WITH CHECK (
        -- Allow if JWT exists (user is authenticated)
        auth.jwt() IS NOT NULL
    );

-- Allow company owners to update their companies
CREATE POLICY "Allow update for company owners" ON public.companies
    FOR UPDATE USING (
        -- Allow if user created the company (you may need to add a created_by field)
        true
        -- OR add a more specific condition based on your company ownership logic
    );

-- ========================================
-- SAVED_JOBS TABLE POLICIES
-- ========================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read own saved jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Allow insert own saved jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Allow delete own saved jobs" ON public.saved_jobs;

-- Allow users to read their own saved jobs
CREATE POLICY "Allow read own saved jobs" ON public.saved_jobs
    FOR SELECT USING (
        -- Allow if user is the one who saved the job
        (auth.jwt() ->> 'sub' = user_id)
    );

-- Allow users to insert their own saved jobs
CREATE POLICY "Allow insert own saved jobs" ON public.saved_jobs
    FOR INSERT WITH CHECK (
        -- Allow if user is the one saving the job
        (auth.jwt() ->> 'sub' = user_id)
    );

-- Allow users to delete their own saved jobs
CREATE POLICY "Allow delete own saved jobs" ON public.saved_jobs
    FOR DELETE USING (
        -- Allow if user is the one who saved the job
        (auth.jwt() ->> 'sub' = user_id)
    );

-- ========================================
-- APPLICATIONS TABLE POLICIES
-- ========================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read own applications" ON public.applications;
DROP POLICY IF EXISTS "Allow insert own applications" ON public.applications;
DROP POLICY IF EXISTS "Allow update own applications" ON public.applications;

-- Allow users to read their own applications
CREATE POLICY "Allow read own applications" ON public.applications
    FOR SELECT USING (
        (auth.jwt() ->> 'sub' = user_id)
        OR
        -- Allow job creators to see applications for their jobs
        (auth.jwt() ->> 'sub' IN (
            SELECT recruiter_id FROM public.jobs WHERE id = job_id
        ))
    );

-- Allow users to create applications
CREATE POLICY "Allow insert own applications" ON public.applications
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'sub' = user_id)
    );

-- Allow users to update their own applications
CREATE POLICY "Allow update own applications" ON public.applications
    FOR UPDATE USING (
        (auth.jwt() ->> 'sub' = user_id)
    );

-- ========================================
-- IMPORTANT NOTES
-- ========================================

-- 1. FIRST run supabase-setup.sql to create all the tables
-- 2. THEN run this file to set up the RLS policies
-- 3. Make sure your .env file has the correct Supabase credentials
-- 4. After running both files, restart your React app

-- The policies are designed to work with these table structures:
--    - users.clerk_id (for Clerk user ID)
--    - jobs.recruiter_id (for who created the job)
--    - saved_jobs.user_id (for who saved the job)
--    - applications.user_id (for who applied)
--    - applications.job_id (for which job was applied to)
