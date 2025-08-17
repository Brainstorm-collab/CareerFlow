# Job Posting System Documentation

## Overview
This document explains how the job posting system works in the CareerFlow job portal. **Recruiters can post new jobs and manage existing ones.** The system is designed for recruiters to post jobs and for administrators or users without roles to also have access.

## How It Works

### 1. Job Posting Flow
1. **Recruiter or Administrator fills out job form** (`/post-job`)
2. **Job is saved to localStorage** using `postJob()` function
3. **Job is added to global context** using `addNewJob()` from JobContext
4. **Job appears immediately** on the latest jobs page
5. **Job is visible** in recruiter's "my jobs" section for management

### 2. Data Storage
- **Posted Jobs**: Stored in `careerflow_posted_jobs` localStorage key
- **Global Jobs List**: Stored in `jobsList` localStorage key
- **Job Context**: In-memory state for immediate updates

### 3. Key Functions

#### `postJob(jobData, userId)` - Local Storage Service
- Saves job to posted jobs storage
- Also adds to global jobs list
- Returns success/failure with job data

#### `addNewJob(job)` - Job Context
- Adds job to in-memory context
- Saves to localStorage for persistence
- Triggers re-renders in components

#### `getAllJobs()` - Local Storage Service
- Combines posted jobs with sample jobs
- Sorts by creation date (newest first)
- Adds applicant counts

### 4. Component Integration

#### Post Job Page (`/post-job`)
- **Access for recruiters and users without roles** - Candidates cannot access
- Form validation and submission
- Calls `postJob()` to save
- Calls `addNewJob()` for immediate display
- Shows success message

#### Latest Jobs Page (`/jobs`)
- Fetches jobs using `getAllJobs()`
- Combines with context jobs
- Filters to show only open jobs
- Displays jobs for candidates

#### My Jobs Page (`/my-jobs`)
- Shows jobs posted by current recruiter
- **Recruiters can delete jobs and post new ones**
- Combines localStorage and context data
- Updates when new jobs are posted

### 5. Job Status Management
- **Open**: Visible to candidates, accepting applications
- **Closed**: Not visible to candidates, not accepting applications
- **On Hold**: Temporarily paused
- **Draft**: Saved but not published

### 6. Data Flow
```
Recruiter Posts Job → localStorage → JobContext → Components Update
                                    ↓
                              Latest Jobs Page
                                    ↓
                              Candidates Can Apply
```

## Testing the System

1. **Post a job** as a recruiter or administrator (user without role set)
2. **Check latest jobs page** - job should appear
3. **Check my jobs page** - job should be listed for recruiters
4. **Test recruiter access** - recruiters should be able to access post-job page
5. **Test job deletion** - recruiters should be able to delete jobs
6. **Apply as candidate** - should be able to apply
7. **Check console logs** - debug information available

## Troubleshooting

### Job not appearing on latest jobs page
- Check if `isOpen` is set to `true`
- Verify job is saved in localStorage
- Check console for error messages

### Job not showing in my jobs
- Verify `recruiter_id` matches current user
- Check if job is properly saved
- Refresh the page

### Duplicate jobs
- Check for duplicate IDs
- Verify deduplication logic in components

## Future Enhancements
- Real-time updates using WebSockets
- Database integration (Supabase)
- Job analytics and metrics
- Advanced filtering and search
- Email notifications
