import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocialLogin } from "../components/SocialLogin";
import { EmailLoginForm } from "../components/EmailLoginForm";
import { EmailRegisterForm } from "../components/EmailRegisterForm";

const SignInPage = () => {
  const [authMode, setAuthMode] = useState('social'); // 'social', 'email-login', 'email-register'
  
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
            onBackToSocial={() => setAuthMode('social')}
          />
        );
      case 'email-register':
        return (
          <EmailRegisterForm 
            onSuccess={() => setAuthMode('social')}
            onSwitchToLogin={() => setAuthMode('email-login')}
          />
        );
      default:
        return (
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
            <SocialLogin />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign up here
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
                onClick={() => setAuthMode('email-login')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Sign in with Email
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {authMode === 'social' && (
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
        )}

        {renderAuthForm()}

        {authMode === 'social' && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:text-purple-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:text-purple-500">
                Privacy Policy
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
