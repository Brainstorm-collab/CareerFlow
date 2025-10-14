import React, { useState } from "react";
import { EmailLoginForm } from "../components/EmailLoginForm";
import { EmailRegisterForm } from "../components/EmailRegisterForm";
import { SocialLogin } from "../components/SocialLogin";

const AuthTestPage = () => {
  const [activeForm, setActiveForm] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Authentication Forms Test
        </h1>
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveForm('login')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeForm === 'login' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setActiveForm('register')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeForm === 'register' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Email Register
          </button>
          <button
            onClick={() => setActiveForm('social')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeForm === 'social' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Social Login
          </button>
        </div>

        <div className="flex justify-center">
          {activeForm === 'login' && (
            <EmailLoginForm 
              onSuccess={() => console.log('Login success')}
              onSwitchToRegister={() => setActiveForm('register')}
            />
          )}
          {activeForm === 'register' && (
            <EmailRegisterForm 
              onSuccess={() => console.log('Register success')}
              onSwitchToLogin={() => setActiveForm('login')}
            />
          )}
          {activeForm === 'social' && (
            <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
              <SocialLogin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
