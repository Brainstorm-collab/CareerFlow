# 🚀 Vercel Deployment Guide for CareerFlow

## Prerequisites
- GitHub account
- Vercel account (free)
- Clerk account (for authentication)
- Supabase account (for database)

## Step 1: Prepare Your Project

### 1.1 Create Environment Variables File
Create a `.env` file in your project root with these variables:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Supabase Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Clerk URLs
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
```

### 1.2 Get Your API Keys

#### Clerk Setup:
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Go to API Keys in the dashboard
4. Copy your **Publishable Key** (starts with `pk_test_`)

#### Supabase Setup:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your **Project URL** and **anon public** key

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it `careerflow` (or your preferred name)
4. Make it public or private
5. Don't initialize with README (you already have one)

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/careerflow.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Vercel

### 3.1 Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### 3.2 Import Your Project
1. Click "New Project"
2. Select "Import Git Repository"
3. Choose your `careerflow` repository
4. Click "Import"

### 3.3 Configure Project Settings

#### Project Name:
- Set to `careerflow` (or your preferred name)

#### Framework Preset:
- Vercel should auto-detect **Vite**
- If not, select "Vite" manually

#### Build Settings:
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### Environment Variables:
Add these variables in Vercel:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key
VITE_SUPABASE_URL=https://your_actual_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_supabase_key
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (usually 2-5 minutes)
3. Your app will be live at `https://careerflow.vercel.app`

## Step 4: Post-Deployment Setup

### 4.1 Test Your Application
1. Visit your live URL
2. Test authentication (sign up/sign in)
3. Test job posting and application features
4. Check if database connections work

### 4.2 Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 4.3 Environment Variables for Production
1. In Vercel dashboard, go to "Settings" > "Environment Variables"
2. Make sure all variables are set for **Production** environment
3. You can also set different values for **Preview** and **Development**

## Step 5: Continuous Deployment

### 5.1 Automatic Deployments
- Every push to `main` branch will trigger a new deployment
- Vercel creates preview deployments for pull requests
- You can rollback to previous deployments if needed

### 5.2 Monitoring
- Vercel provides built-in analytics
- Check "Functions" tab for any serverless function issues
- Monitor build logs for errors

## Troubleshooting Common Issues

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Environment Variables Not Working
- Make sure variables start with `VITE_`
- Check if variables are set for the correct environment
- Redeploy after adding new variables

### Routing Issues
- Your `vercel.json` should handle SPA routing
- If issues persist, check React Router configuration

### Database Connection Issues
- Verify Supabase URL and keys
- Check if Supabase project is active
- Ensure database tables are created

## Final Checklist ✅

- [ ] Environment variables configured
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Build successful
- [ ] Application working live
- [ ] Authentication working
- [ ] Database connections working
- [ ] Custom domain configured (optional)

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

Your CareerFlow application should now be live on Vercel! 🎉
