import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocialLogin } from "../components/SocialLogin";
import { EmailLoginForm } from "../components/EmailLoginForm";
import { EmailRegisterForm } from "../components/EmailRegisterForm";

const SignUpPage = () => {
  const [authMode, setAuthMode] = useState('email-register'); // 'social', 'email-login', 'email-register'
  
  // Load Facebook SDK
  useEffect(() => {
    const loadFacebookSDK = () => {
      if (typeof window !== 'undefined' && window.FB) return; // Already loaded

      if (typeof window !== 'undefined') {
        window.fbAsyncInit = function() {
          window.FB.init({
            appId: import.meta.env.VITE_FACEBOOK_APP_ID || "839782072858430",
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
        };
      }

      // Load the SDK asynchronously
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  const renderAuthForm = () => {
    switch (authMode) {
      case 'email-login':
        return (
          <EmailLoginForm 
            onSuccess={() => setAuthMode('social')}
            onSwitchToRegister={() => setAuthMode('email-register')}
          />
        );
      case 'email-register':
        return (
          <EmailRegisterForm 
            onSuccess={() => setAuthMode('social')}
            onSwitchToLogin={() => setAuthMode('email-login')}
            onBackToSocial={() => setAuthMode('social')}
            variant="dark"
          />
        );
      default:
        return (
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
            <SocialLogin />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setAuthMode('email-register')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Create Account with Email
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {authMode === 'social' && (
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-200">
              Join CareerFlow and start your journey
            </p>
          </div>
        )}

        {renderAuthForm()}

        {authMode === 'social' && (
          <div className="text-center">
            <p className="text-xs text-gray-300">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-blue-300 hover:text-blue-200">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-300 hover:text-blue-200">
                Privacy Policy
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
