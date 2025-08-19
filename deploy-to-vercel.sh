#!/bin/bash

echo "🚀 CareerFlow Vercel Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "Please create a .env file with your environment variables:"
    echo ""
    echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here"
    echo "VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here"
    echo ""
    echo "Press Enter when you've created the .env file..."
    read
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Prepare for Vercel deployment"
    echo "✅ Changes committed"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Create a GitHub repository at https://github.com/new"
echo "2. Copy the repository URL"
echo "3. Run these commands with your repository URL:"
echo ""
echo "   git remote add origin YOUR_REPOSITORY_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Go to https://vercel.com and import your repository"
echo "5. Add your environment variables in Vercel"
echo "6. Deploy! 🚀"
echo ""
echo "📖 See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions"
