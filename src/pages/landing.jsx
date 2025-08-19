import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Users, Building2, ArrowRight, Star, Briefcase, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [sampleJobs, setSampleJobs] = useState([]);

  // Function to get the correct company logo path
  const getCompanyLogoPath = (companyName) => {
    const name = companyName.toLowerCase();
    if (name === 'google') return '/companies/google.webp';
    if (name === 'microsoft') return '/companies/microsoft.webp';
    if (name === 'amazon') return '/companies/amazon.svg';
    if (name === 'meta') return '/companies/meta.svg';
    if (name === 'apple') return '/companies/apple.svg';
    if (name === 'netflix') return '/companies/netflix.png';
    if (name === 'uber') return '/companies/uber.svg';
    if (name === 'ibm') return '/companies/ibm.svg';
    if (name === 'atlassian') return '/companies/atlassian.svg';
    return '/companies/default.svg';
  };

  useEffect(() => {
    // Sample jobs for the landing page
    const jobs = [
      {
        id: 'landing-1',
        title: 'Senior Software Engineer',
        company: { name: 'Google' },
        location: 'San Francisco, CA',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_work: true,
        salary_min: 120000,
        salary_max: 180000,
        description: 'Join Google\'s engineering team to build innovative solutions that impact millions of users worldwide.'
      },
      {
        id: 'landing-2',
        title: 'Frontend Developer',
        company: { name: 'Microsoft' },
        location: 'New York, NY',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: false,
        salary_min: 80000,
        salary_max: 120000,
        description: 'Create beautiful and responsive user interfaces for Microsoft\'s next-generation applications.'
      },
      {
        id: 'landing-3',
        title: 'Data Scientist',
        company: { name: 'Amazon' },
        location: 'Seattle, WA',
        job_type: 'full-time',
        experience_level: 'mid',
        remotework: true,
        salary_min: 100000,
        salary_max: 150000,
        description: 'Leverage big data to drive business insights and improve customer experience at Amazon.'
      },
      {
        id: 'landing-4',
        title: 'Product Manager',
        company: { name: 'Meta' },
        location: 'Menlo Park, CA',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_work: true,
        salary_min: 130000,
        salary_max: 200000,
        description: 'Lead product strategy and development for Meta\'s social media platforms.'
      },
      {
        id: 'landing-5',
        title: 'DevOps Engineer',
        company: { name: 'Netflix' },
        location: 'Los Gatos, CA',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: true,
        salary_min: 110000,
        salary_max: 160000,
        description: 'Build and maintain the infrastructure that powers Netflix\'s global streaming service.'
      },
      {
        id: 'landing-6',
        title: 'UX Designer',
        company: { name: 'Apple' },
        location: 'Cupertino, CA',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_work: false,
        salary_min: 140000,
        salary_max: 190000,
        description: 'Design intuitive and beautiful user experiences for Apple\'s ecosystem of products.'
      }
    ];
    setSampleJobs(jobs);
  }, []);

  return (
    <main className="flex flex-col gap-4 sm:gap-8 py-2 sm:py-4">
      {/* Hero Section */}
      <section className="text-center relative px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src="/newlogo.png" 
            alt="CareerFlow Logo" 
            className="w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 object-contain"
          />
        </div>
        
        {/* Main Title Section */}
        <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
          {/* Main Title with Enhanced Styling */}
          <div className="relative max-w-full">
            <h1 className="gradient-title font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl tracking-tight leading-none px-2 break-words">
              CAREERFLOW
            </h1>
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 blur-3xl -z-10"></div>
            {/* Additional glow layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 blur-2xl -z-20"></div>
          </div>
          
          {/* Modern Caption Design */}
          <div className="space-y-4">
            {/* Main Caption with enhanced styling */}
            <div className="relative max-w-full">
              <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl max-w-full px-4 font-black leading-tight break-words">
                  WHERE CAREERS FLOW FORWARD
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-full px-4 font-bold leading-tight break-words">
                  ACROSS THE GLOBE
                </p>
              </div>
            </div>
            
            {/* Enhanced Subtitle with better styling */}
            <div className="max-w-full px-4 overflow-hidden">
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed font-medium text-center break-words">
                Discover your dream job or find the perfect candidate. Let your career journey begin with 
                <span className="text-blue-400 font-bold"> CAREERFLOW</span>.
              </p>
            </div>
            
            {/* Enhanced Stats Section */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-6 max-w-full overflow-hidden">
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-400 group-hover:text-blue-300 transition-colors">1000+</div>
                <div className="text-gray-400 text-sm font-medium">Jobs Posted</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-400 group-hover:text-purple-300 transition-colors">500+</div>
                <div className="text-gray-400 text-sm font-medium">Companies</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-400 group-hover:text-green-300 transition-colors">50K+</div>
                <div className="text-gray-400 text-sm font-medium">Candidates</div>
              </div>
            </div>
            
            {/* Additional Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-full px-4 mt-6 overflow-hidden">
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="text-blue-400 text-2xl mb-2">🚀</div>
                <div className="text-white font-semibold text-sm">Fast & Easy</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="text-purple-400 text-2xl mb-2">🔒</div>
                <div className="text-white font-semibold text-sm">Secure Platform</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300">
                <div className="text-green-400 text-2xl mb-2">🌍</div>
                <div className="text-white font-semibold text-sm">Global Reach</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
        <Link to={"/jobs"} className="w-full sm:w-auto">
          <Button 
            variant="blue" 
            size="xl"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-base sm:text-lg py-3 sm:py-4"
          >
            <Users size={20} className="mr-2" />
            Find Jobs
          </Button>
        </Link>
        <Link to={"/post-job"} className="w-full sm:w-auto">
          <Button 
            variant="destructive" 
            size="xl"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-base sm:text-lg py-3 sm:py-4"
          >
            <Building2 size={20} className="mr-2" />
            Post a Job
          </Button>
        </Link>
      </div>
      
      {/* Companies Carousel */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full py-4"
        >
          <CarouselContent className="flex gap-3 sm:gap-5 lg:gap-20 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                <div className="rounded-lg p-2 sm:p-4 hover:scale-105 transition-all duration-300">
                  <img
                    src={path}
                    alt={name}
                    className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Banner Image */}
      <div className="relative">
        <img src="/banner.jpeg" className="w-full rounded-2xl shadow-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
      </div>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-4">
        <Card className="bg-gradient-to-br from-black/20 via-black/15 to-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="font-bold text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors text-lg sm:text-xl">
              <Users size={20} className="text-blue-400" />
              For Job Seekers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Search and apply for jobs, track applications, save interesting positions, and more.
            </p>
            <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium">
              <span>Get Started</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-black/20 via-black/15 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="font-bold text-white flex items-center gap-2 group-hover:text-red-400 transition-colors text-lg sm:text-xl">
              <Building2 size={20} className="text-red-400" />
              For Employers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Post jobs, manage applications, and find the best candidates for your team.
            </p>
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm font-medium">
              <span>Start Hiring</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sample Jobs Section */}
      <section className="relative px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Featured Job Opportunities</h2>
          <p className="text-gray-400 text-sm sm:text-base">Discover what's waiting for you</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {sampleJobs.map((job) => (
            <Card key={job.id} className="bg-black/70 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                {/* Job Title */}
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {job.title}
                  </h3>
                </div>

                {/* Company Logo and Name */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img 
                    src={getCompanyLogoPath(job.company.name)} 
                    alt={`${job.company.name} logo`}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    onError={(e) => {
                      e.target.src = '/companies/default.svg';
                    }}
                  />
                  <span className="text-white font-medium text-sm sm:text-base">{job.company.name}</span>
                </div>

                {/* Job Description */}
                <div className="text-center mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mb-4">
                  <MapPin size={14} className="text-blue-400" />
                  <span className="text-gray-200">{job.location}</span>
                </div>

                {/* Job Type & Experience */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <div className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 rounded-full px-2 py-1">
                    <Briefcase size={12} className="text-purple-300" />
                    <span className="text-purple-200 text-xs font-medium capitalize">
                      {job.job_type?.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-1">
                    <Clock size={12} className="text-orange-300" />
                    <span className="text-orange-200 text-xs font-medium capitalize">
                      {job.experience_level}
                    </span>
                  </div>
                </div>

                {/* Remote Work Badge */}
                {job.remote_work && (
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1">
                      <span className="text-green-300 text-xs font-medium">🌐 Remote</span>
                    </div>
                  </div>
                )}

                {/* Salary Information */}
                {(job.salary_min || job.salary_max) && (
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1.5">
                      <span className="text-emerald-200 text-xs font-medium">
                        {job.salary_min && job.salary_max 
                          ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                          : job.salary_min 
                            ? `$${(job.salary_min / 1000).toFixed(0)}k+`
                            : `Up to $${(job.salary_max / 1000).toFixed(0)}k`
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <div className="text-center">
                  <Link to="/jobs">
                    <Button 
                      variant="secondary" 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 transition-all duration-300 text-sm shadow-lg hover:shadow-blue-500/25"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm sm:text-base">Everything you need to know about CareerFlow</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-4 sm:px-6">
                <AccordionTrigger className="text-left text-white hover:text-blue-400 transition-colors py-4 sm:py-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pl-0 sm:pl-8 pb-4 sm:pb-6 text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/newlogo.png" 
                  alt="CareerFlow Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    CARRERFLOW
                  </h3>
                  <p className="text-xs text-gray-400">WHERE CAREERS FLOW FORWARD</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Connect talented professionals with amazing opportunities. Whether you're seeking your next career move or looking to hire exceptional talent, CareerFlow is your trusted partner.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-base sm:text-lg">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/jobs" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/post-job" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-base sm:text-lg">Get in Touch</h4>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">
                  <span className="text-blue-400">📧</span> hello@carrerflow.com
                </li>
                <li className="text-gray-300 text-sm">
                  <span className="text-blue-400">🌐</span> www.carrerflow.com
                </li>
                <li className="text-gray-300 text-sm">
                  <span className="text-blue-400">📍</span> Goa, India
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>© 2025 CareerFlow. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
