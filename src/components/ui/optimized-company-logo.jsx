import { useState, useEffect, useMemo, memo } from 'react';
import LazyImage from './lazy-image';

const OptimizedCompanyLogo = memo(({ company, className = "w-12 h-12 object-contain" }) => {
  const [logoPath, setLogoPath] = useState('/companies/default.svg');
  const [isLoading, setIsLoading] = useState(true);

  // Memoize logo path calculation
  const calculatedLogoPath = useMemo(() => {
    // First, try to use the actual company logo from database
    if (company?.logoUrl) {
      return company.logoUrl;
    }
    
    const companyName = company?.name || (typeof company === 'string' ? company : '');
    
    // If no company name, return default
    if (!companyName) {
      return '/companies/default.svg';
    }
    
    // Normalize company name for matching
    const normalizedName = companyName.toLowerCase().trim();
    
    // Map company names to their logo files (fallback for companies without logoUrl)
    const logoMap = {
      'google': '/companies/google.webp',
      'microsoft': '/companies/microsoft.webp',
      'amazon': '/companies/amazon.svg',
      'meta': '/companies/meta.svg',
      'netflix': '/companies/netflix.png',
      'uber': '/companies/uber.svg',
      'atlassian': '/companies/atlassian.svg',
      'ibm': '/companies/ibm.svg',
      'apple': '/companies/apple.svg',
      'facebook': '/companies/meta.svg',
      'alphabet': '/companies/google.webp',
      'techcorp inc': '/companies/microsoft.webp',
      'techcorp': '/companies/microsoft.webp',
      'test company': '/companies/google.webp',
      'tesla': '/companies/apple.svg',
      'nvidia': '/companies/ibm.svg',
      'salesforce': '/companies/amazon.svg',
      'adobe': '/companies/netflix.png',
      'oracle': '/companies/uber.svg',
      'intel': '/companies/atlassian.svg',
      'cisco': '/companies/google.webp',
    };
    
    return logoMap[normalizedName] || '/companies/default.svg';
  }, [company]);

  useEffect(() => {
    setLogoPath(calculatedLogoPath);
    setIsLoading(false);
  }, [calculatedLogoPath]);

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-700/50 animate-pulse rounded`}></div>
    );
  }

  return (
    <LazyImage
      src={logoPath}
      alt={`${company?.name || 'Company'} logo`}
      className={className}
      fallback="/companies/default.svg"
    />
  );
});

OptimizedCompanyLogo.displayName = 'OptimizedCompanyLogo';

export default OptimizedCompanyLogo;
