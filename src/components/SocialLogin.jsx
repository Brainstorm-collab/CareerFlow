import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNotifications } from "../context/NotificationContext";
import { FacebookIcon } from "./ui/FacebookIcon";
import { GoogleIcon } from "./ui/GoogleIcon";
import { User } from "lucide-react";

// Facebook and Google SDK types are handled via window object

/**
 * SocialLogin Component
 * 
 * Integrates Facebook and Google OAuth login functionality with custom styled buttons.
 * Uses Google Identity Services and Facebook SDK for authentication.
 * 
 * Features:
 * - Custom styled Google OAuth login button matching Facebook button design
 * - Facebook login using Facebook SDK
 * - Integrated with existing AuthContext for user management
 * - Toast notifications for success/error states
 * - Disabled state support for loading states
 * - Callback URL logging for debugging
 * 
 * OAuth Callback URLs:
 * - Google: {baseUrl}/auth/google/callback
 * - Facebook: {baseUrl}/auth/facebook/callback
 * 
 * Environment Variables Required:
 * - REACT_APP_GOOGLE_CLIENT_ID
 * - REACT_APP_FACEBOOK_APP_ID
 * - REACT_APP_BASE_URL (optional, defaults to window.location.origin)
 * 
 * Note: Both Google and Facebook login require HTTPS in production. The warning about HTTP pages
 * is expected in development and will not appear in production with HTTPS.
 */

export const SocialLogin = ({ 
  onSuccess, 
  disabled = false 
}) => {
  const { socialLogin } = useAuth();
  const { success, error, successWithUser } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  // Google and Facebook App IDs - using environment variables for better security
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "627920922113-s113markc4ltdfa8tohu13u05t6bs01c.apps.googleusercontent.com";
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || "839782072858430";
  
  // Callback URLs for OAuth providers
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const googleCallbackUrl = `${baseUrl}/auth/google/callback`;
  const facebookCallbackUrl = `${baseUrl}/auth/facebook/callback`;
  
  // Handle Google Login Success
  const handleGoogleSuccess = async (response) => {
    try {
      
      // Decode the JWT token to extract user data
      let userData;
      if (response.credential) {
        // Decode the JWT token from Google
        userData = jwtDecode(response.credential);
      } else {
        // Fallback to response data if no credential
        userData = response.userData || response;
      }
      
      const result = await socialLogin('google', userData);
      
      if (result.success) {
        // Show success toast with user's name
        const userName = userData.name || userData.given_name || 'User';
        successWithUser(
          'Welcome {userName}! 🎉', 
          userName,
          `You have successfully logged in with Google! We're happy to have you here. Enjoy using the app!`
        );
        
        // Add notification about profile image
        if (userData.picture) {
          addNotification({
            icon: User,
            message: `Your Google profile picture has been automatically imported!`,
            time: 'Just now',
            isRead: false,
            type: 'success'
          });
        }
        
        // Navigate based on user role
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
        // Show failure toast
        error('Google Login Failed', 'You are not logged in via Google. Please try again or use another login method.');
      }
    } catch (err) {
      console.error('Google login error:', err);
      error('Google Login Failed', 'You are not logged in via Google. Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    error('Google Login Failed', 'You are not logged in via Google. Google login was cancelled or failed. Please try again.');
  };

  // Handle Facebook Login
  const handleFacebookResponse = async (response) => {
    try {
      
      // Pass the Facebook response data to the auth context
      const result = await socialLogin('facebook', response);
      
      if (result.success) {
        // Show success toast with user's name
        const userName = response.name || response.first_name || 'User';
        successWithUser(
          'Welcome {userName}! 🎉', 
          userName,
          `You have successfully logged in with Facebook! We're happy to have you here. Enjoy using the app!`
        );
        
        // Navigate based on user role
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
        // Show failure toast
        error('Facebook Login Failed', 'You are not logged in via Facebook. Please try again or use another login method.');
      }
    } catch (err) {
      console.error('Facebook login error:', err);
      error('Facebook Login Failed', 'You are not logged in via Facebook. Login failed. Please try again.');
    }
  };

  // Handle Facebook Login with SDK
  const handleFacebookLogin = () => {
    if (disabled) return;
    
    // Check if Facebook SDK is loaded
    if (typeof window !== 'undefined' && window.FB) {
      // Facebook SDK is available
    } else {
      error('Facebook Login Failed', 'You are not logged in via Facebook. Facebook SDK is not loaded. Please refresh the page and try again.');
      return;
    }

    
    window.FB.login((response) => {
      
      if (response.authResponse) {
        
        // Get user info with more detailed fields
        window.FB.api('/me', { 
          fields: 'id,name,first_name,last_name,email,picture.width(200).height(200),location,website,bio' 
        }, (userInfo) => {
          
          // Validate that we received user data
          if (!userInfo || userInfo.error) {
            error('Facebook Login Failed', 'You are not logged in via Facebook. Failed to fetch user information from Facebook.');
            return;
          }
          
          // Create a clean user data object with all the information we need
          const userData = {
            id: userInfo.id || response.authResponse.userID,
            name: userInfo.name,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email || `fb_${userInfo.id}@facebook.local`, // Fallback email if not provided
            picture: userInfo.picture?.data?.url || userInfo.picture,
            location: userInfo.location,
            website: userInfo.website,
            bio: userInfo.bio,
            // Include auth response data
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID,
            expiresIn: response.authResponse.expiresIn,
            signedRequest: response.authResponse.signedRequest
          };
          
          
          // Additional validation
          if (!userData.name) {
            userData.name = userData.first_name || 'Facebook User';
          }
          
          if (!userData.email || userData.email.includes('facebook.local')) {
          }
          
          handleFacebookResponse(userData);
        });
      } else {
        error('Facebook Login Failed', 'You are not logged in via Facebook. Login was cancelled or failed.');
      }
    }, { scope: 'email,public_profile,user_location,user_website' }); // Request email, public profile, location, and website permissions
  };


  return (
    <div className="space-y-3">
      <style dangerouslySetInnerHTML={{
        __html: `
          .google-button-container * {
            border-radius: 8px !important;
          }
          .google-button-container > div {
            border-radius: 8px !important;
          }
          .google-button-container > div > div {
            border-radius: 8px !important;
          }
          .google-button-container > div > div > div {
            border-radius: 8px !important;
          }
        `
      }} />
      <GoogleOAuthProvider clientId={googleClientId}>
        <div 
          className="google-button-container"
          style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
        >
          <GoogleLogin
            onSuccess={disabled ? () => {} : handleGoogleSuccess}
            onError={disabled ? () => {} : handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text="signin_with"
            shape="rectangular"
            useOneTap={false}
            auto_select={false}
          />
        </div>
      </GoogleOAuthProvider>

      <button
        type="button"
        onClick={handleFacebookLogin}
        disabled={disabled}
        className="w-full flex items-center justify-center px-3 py-2.5 border border-white/20 hover:bg-white/10 transition-colors text-sm bg-white/5 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed h-10 shadow-sm backdrop-blur-sm"
      >
        <FacebookIcon size={16} className="mr-2 flex-shrink-0" />
        <span>Sign in with Facebook</span>
      </button>
    </div>
  );
};
