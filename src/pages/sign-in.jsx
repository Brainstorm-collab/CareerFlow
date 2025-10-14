import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocialLogin } from "../components/SocialLogin";
import { EmailLoginForm } from "../components/EmailLoginForm";
import { EmailRegisterForm } from "../components/EmailRegisterForm";

const SignInPage = () => {
  const [authMode, setAuthMode] = useState('combined'); // 'combined', 'email-login', 'email-register'
  
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
        // Combined dark-themed sign-in: Social + Email + Guest + Sign-up link
        return (
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Sign in to CareerFlow
              </h2>
              <p className="text-sm text-gray-300 mt-1">Welcome back! Choose a method below</p>
            </div>

            <SocialLogin />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-gradient-to-br from-gray-900/95 to-black/95 text-gray-400">Or sign in with email</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <EmailLoginForm 
                onSuccess={() => setAuthMode('combined')}
                onSwitchToRegister={() => setAuthMode('email-register')}
                variant="dark"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-3 text-center">
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
                Continue as Guest
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-200">Sign in to your account to continue</p>
        </div>

        {renderAuthForm()}

        <div className="text-center">
          <p className="text-xs text-gray-300">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-300 hover:text-blue-200">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-blue-300 hover:text-blue-200">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
