-- Create users table for Clerk authentication (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'candidate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on clerk_id for fast lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);

-- Create companies table (if not exists)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    website TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table (if not exists)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    recruiter_id TEXT REFERENCES public.users(clerk_id) ON DELETE CASCADE,
    isOpen BOOLEAN DEFAULT true,
    job_type TEXT DEFAULT 'full-time',
    experience_level TEXT DEFAULT 'entry',
    remote_work BOOLEAN DEFAULT false,
    benefits TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_jobs table (if not exists)
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(clerk_id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Create applications table (if not exists)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(clerk_id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    cover_letter TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Create indexes for better performance (if not exist)
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON public.jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_isOpen ON public.jobs(isOpen);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON public.saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create function to automatically update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at (only if they don't exist)
DO $$
BEGIN
    -- Check if trigger exists before creating
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON public.users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_companies_updated_at') THEN
        CREATE TRIGGER update_companies_updated_at 
            BEFORE UPDATE ON public.companies 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_jobs_updated_at') THEN
        CREATE TRIGGER update_jobs_updated_at 
            BEFORE UPDATE ON public.jobs 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_applications_updated_at') THEN
        CREATE TRIGGER update_applications_updated_at 
            BEFORE UPDATE ON public.applications 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.companies TO authenticated;
GRANT ALL ON public.jobs TO authenticated;
GRANT ALL ON public.saved_jobs TO authenticated;
GRANT ALL ON public.applications TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Insert sample companies
INSERT INTO public.companies (id, name, logo_url, description, website, location) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Google', '/companies/google.webp', 'Google is a multinational technology company that specializes in Internet-related services and products.', 'https://google.com', 'Mountain View, CA'),
('550e8400-e29b-41d4-a716-446655440002', 'Microsoft', '/companies/microsoft.webp', 'Microsoft Corporation is an American multinational technology company.', 'https://microsoft.com', 'Redmond, WA'),
('550e8400-e29b-41d4-a716-446655440003', 'Amazon', '/companies/amazon.svg', 'Amazon is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.', 'https://amazon.com', 'Seattle, WA'),
('550e8400-e29b-41d4-a716-446655440004', 'Meta', '/companies/meta.svg', 'Meta Platforms, Inc. is an American multinational technology conglomerate.', 'https://meta.com', 'Menlo Park, CA'),
('550e8400-e29b-41d4-a716-446655440005', 'Netflix', '/companies/netflix.png', 'Netflix is an American subscription streaming service and production company.', 'https://netflix.com', 'Los Gatos, CA'),
('550e8400-e29b-41d4-a716-446655440006', 'Uber', '/companies/uber.svg', 'Uber Technologies, Inc. is an American multinational transportation network company.', 'https://uber.com', 'San Francisco, CA'),
('550e8400-e29b-41d4-a716-446655440007', 'Atlassian', '/companies/atlassian.svg', 'Atlassian Corporation Plc is an Australian software company that develops products for software developers, project managers and content management.', 'https://atlassian.com', 'Sydney, Australia'),
('550e8400-e29b-41d4-a716-446655440008', 'IBM', '/companies/ibm.svg', 'International Business Machines Corporation is an American multinational technology corporation.', 'https://ibm.com', 'Armonk, NY')
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs
INSERT INTO public.jobs (id, title, description, requirements, location, salary_min, salary_max, company_id, job_type, experience_level, remote_work, benefits) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Senior Software Engineer', 'We are looking for a Senior Software Engineer to join our team and help build scalable web applications. You will work on cutting-edge technologies and collaborate with cross-functional teams.', '5+ years of experience in software development, Strong knowledge of JavaScript/TypeScript, React, Node.js, Experience with cloud platforms (AWS/GCP), Excellent problem-solving skills', 'San Francisco, CA', 120000, 180000, '550e8400-e29b-41d4-a716-446655440001', 'full-time', 'senior', true, ARRAY['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Professional Development']),
('660e8400-e29b-41d4-a716-446655440002', 'Frontend Developer', 'Join our frontend team to create beautiful and responsive user interfaces. You will work with modern frameworks and ensure excellent user experience across all devices.', '3+ years of frontend development experience, Proficiency in React, Vue.js, or Angular, Strong CSS and JavaScript skills, Experience with responsive design', 'New York, NY', 80000, 120000, '550e8400-e29b-41d4-a716-446655440002', 'full-time', 'mid', false, ARRAY['Health Insurance', 'Dental Coverage', 'Vision Coverage', 'Paid Time Off']),
('660e8400-e29b-41d4-a716-446655440003', 'Data Scientist', 'We are seeking a Data Scientist to analyze complex data sets and develop machine learning models. You will work on predictive analytics and help drive business decisions.', 'Masters degree in Computer Science, Statistics, or related field, Experience with Python, R, or similar, Knowledge of machine learning algorithms, Experience with big data tools', 'Seattle, WA', 100000, 150000, '550e8400-e29b-41d4-a716-446655440003', 'full-time', 'mid', true, ARRAY['Health Insurance', '401k', 'Stock Options', 'Remote Work', 'Conference Budget']),
('660e8400-e29b-41d4-a716-446655440004', 'Product Manager', 'Join our product team to define and execute product strategy. You will work closely with engineering, design, and business teams to deliver exceptional products.', '5+ years of product management experience, Strong analytical and communication skills, Experience with agile methodologies, Technical background preferred', 'Austin, TX', 110000, 160000, '550e8400-e29b-41d4-a716-446655440004', 'full-time', 'senior', false, ARRAY['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Professional Development']),
('660e8400-e29b-41d4-a716-446655440005', 'DevOps Engineer', 'We are looking for a DevOps Engineer to help us build and maintain our infrastructure. You will work on automation, monitoring, and deployment processes.', '3+ years of DevOps experience, Experience with AWS, Docker, Kubernetes, Knowledge of CI/CD pipelines, Experience with monitoring tools', 'Remote', 90000, 130000, '550e8400-e29b-41d4-a716-446655440005', 'full-time', 'mid', true, ARRAY['Health Insurance', '401k', 'Remote Work', 'Home Office Setup', 'Flexible Hours']),
('660e8400-e29b-41d4-a716-446655440006', 'UX Designer', 'Join our design team to create intuitive and beautiful user experiences. You will work on user research, wireframing, and prototyping.', '3+ years of UX design experience, Proficiency in Figma, Sketch, or similar tools, Experience with user research, Strong portfolio', 'Los Angeles, CA', 70000, 110000, '550e8400-e29b-41d4-a716-446655440006', 'full-time', 'mid', false, ARRAY['Health Insurance', 'Dental Coverage', 'Vision Coverage', 'Paid Time Off', 'Design Tools']),
('660e8400-e29b-41d4-a716-446655440007', 'Backend Developer', 'We are seeking a Backend Developer to build robust and scalable APIs. You will work on server-side logic and database design.', '3+ years of backend development experience, Proficiency in Python, Java, or Go, Experience with databases (SQL/NoSQL), Knowledge of RESTful APIs', 'Chicago, IL', 85000, 125000, '550e8400-e29b-41d4-a716-446655440007', 'full-time', 'mid', true, ARRAY['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Professional Development']),
('660e8400-e29b-41d4-a716-446655440008', 'Marketing Specialist', 'Join our marketing team to develop and execute marketing campaigns. You will work on digital marketing, content creation, and brand awareness.', '2+ years of marketing experience, Experience with social media platforms, Knowledge of digital marketing tools, Strong writing skills', 'Miami, FL', 50000, 75000, '550e8400-e29b-41d4-a716-446655440008', 'full-time', 'entry', false, ARRAY['Health Insurance', 'Paid Time Off', 'Professional Development', 'Flexible Hours']),
('660e8400-e29b-41d4-a716-446655440009', 'Sales Representative', 'We are looking for a Sales Representative to drive revenue growth. You will work on lead generation, client relationships, and sales strategies.', '1+ years of sales experience, Excellent communication skills, Goal-oriented mindset, Experience with CRM tools', 'Denver, CO', 45000, 70000, '550e8400-e29b-41d4-a716-446655440009', 'full-time', 'entry', false, ARRAY['Health Insurance', 'Commission', 'Paid Time Off', 'Professional Development']),
('660e8400-e29b-41d4-a716-446655440010', 'Customer Success Manager', 'Join our customer success team to ensure customer satisfaction and retention. You will work on onboarding, support, and relationship management.', '2+ years of customer success experience, Strong interpersonal skills, Experience with customer support tools, Problem-solving abilities', 'Remote', 60000, 90000, '550e8400-e29b-41d4-a716-446655440010', 'full-time', 'mid', true, ARRAY['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Professional Development'])
ON CONFLICT (id) DO NOTHING;
