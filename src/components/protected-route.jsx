/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoading, user } = useAuth();
  const { pathname } = useLocation();

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" replace />;
  }

  // Redirect to onboarding if user doesn't have a role
  if (
    user !== undefined &&
    !user?.role &&
    pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
