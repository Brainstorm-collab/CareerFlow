import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

export const EmailLoginForm = ({ onSuccess, onSwitchToRegister, onBackToSocial, variant = 'light' }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { emailLogin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await emailLogin(formData.email, formData.password);
      
      if (result.success) {
        success("Login Successful", "Welcome back! You have successfully logged in.");
        
        // Redirect based on user role
        const userRole = result.user?.role;
        if (userRole === 'candidate') {
          navigate('/jobs');
        } else if (userRole === 'recruiter') {
          navigate('/post-job');
        } else {
          // No role set, go to onboarding
          navigate('/onboarding');
        }
        
        onSuccess?.();
      } else {
        error("Login Failed", result.error || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error('Login error:', err);
      error("Login Failed", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = variant === 'dark';
  
  return (
    <Card className={`w-full max-w-md mx-auto shadow-xl ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20' 
        : 'bg-white/95 backdrop-blur-sm border border-gray-200'
    }`}>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className={`text-2xl font-bold text-center ${
          isDark ? 'bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent' : 'text-gray-900'
        }`}>
          Welcome back
        </CardTitle>
        <CardDescription className={`text-center ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email Address
            </Label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${
                  isDark 
                    ? 'bg-white/10 text-white placeholder:text-gray-400 border-white/20 focus:border-blue-500' 
                    : 'bg-white text-gray-900 placeholder:text-gray-500 border-gray-300 focus:border-purple-500'
                } ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </Label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 ${
                  isDark 
                    ? 'bg-white/10 text-white placeholder:text-gray-400 border-white/20 focus:border-blue-500' 
                    : 'bg-white text-gray-900 placeholder:text-gray-500 border-gray-300 focus:border-purple-500'
                } ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                  isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className={`text-sm transition-colors ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-purple-600 hover:text-purple-500'
              }`}
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className={`w-full ${
              isDark ? 'bg-white/20' : 'bg-gray-300'
            }`} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className={`px-2 ${
              isDark ? 'bg-gradient-to-br from-gray-900/95 to-black/95 text-gray-400' : 'bg-white text-gray-500'
            }`}>Or continue with</span>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center">
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className={`font-medium transition-colors ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-purple-600 hover:text-purple-500'
              }`}
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Back to Social Login */}
        {onBackToSocial && (
          <div className="pt-4 text-center">
            <button
              onClick={onBackToSocial}
              className={`flex items-center justify-center gap-2 font-medium transition-colors ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-purple-600 hover:text-purple-500'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to social login
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
