import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  
  const { resetPassword } = useAuth();
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setIsEmailSent(true);
        success("Reset Email Sent", "Please check your email for password reset instructions.");
      } else {
        setError(result.error || "Failed to send reset email. Please try again.");
        showError("Reset Failed", result.error || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError("An unexpected error occurred. Please try again.");
      showError("Reset Failed", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardHeader className="space-y-1 pb-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check your email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail("");
                }}
                className="text-purple-600 hover:text-purple-500 font-medium transition-colors"
              >
                try again with a different email
              </button>
            </div>
            
            <div className="pt-4">
              <Link
                to="/sign-in"
                className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-500 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            No worries! Enter your email address and we'll send you reset instructions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={`pl-10 bg-white text-gray-900 placeholder:text-gray-500 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-purple-500'}`}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="pt-4 text-center">
            <Link
              to="/sign-in"
              className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-500 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
