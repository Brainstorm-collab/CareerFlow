import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import AppLayout from "./layouts/app-layout";
import AuthLayout from "./layouts/auth-layout";
import ProtectedRoute from "./components/protected-route";
import { JobProvider } from "./context/JobContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ConvexProvider, convex } from "./lib/convex";

import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import PostJob from "./pages/post-job";
import JobListing from "./pages/jobListing";
import MyJobs from "./pages/my-jobs";
import SavedJobs from "./pages/saved-jobs";
import MyApplications from "./pages/my-applications";
import MyResumes from "./pages/my-resumes";
import CleanupResumes from "./pages/cleanup-resumes";
import RoleDebug from "./pages/role-debug";
import JobApplicants from "./pages/job-applicants";
import CandidateDetails from "./pages/candidate-details";
import CandidateProfile from "./pages/candidate-profile";
import Candidates from "./pages/candidates";
import Unauthorized from "./pages/unauthorized";
import FixLogos from "./pages/fix-logos";

import JobPage from "./pages/job";
import ApplicationStatus from "./pages/application-status";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import ProfilePage from "./pages/profile";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import ForgotPasswordPage from "./pages/forgot-password";
import AuthTestPage from "./pages/auth-test";
import ConvexTest from "./components/ConvexTest";
import UpdateJobs from "./pages/update-jobs";
import EditJob from "./pages/edit-job";
import Notifications from "./pages/notifications";

import "./App.css";

const router = createBrowserRouter([
  // Auth routes (outside of main app layout)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/auth-test",
        element: <AuthTestPage />,
      },
      {
        path: "/convex-test",
        element: <ConvexTest />,
      },
    ],
  },
  // Main app routes
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/update-jobs",
        element: (
          <ProtectedRoute>
            <UpdateJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-applications",
        element: (
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-resumes",
        element: (
          <ProtectedRoute>
            <MyResumes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cleanup-resumes",
        element: (
          <ProtectedRoute>
            <CleanupResumes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/application-status/:id",
        element: (
          <ProtectedRoute>
            <ApplicationStatus />
          </ProtectedRoute>
        ),
      },
      // Debug route for development
      {
        path: "/role-debug",
        element: (
          <ProtectedRoute>
            <RoleDebug />
          </ProtectedRoute>
        ),
      },
      {
        path: "/fix-logos",
        element: (
          <ProtectedRoute>
            <FixLogos />
          </ProtectedRoute>
        ),
      },
      // Job applicants route for recruiters
      {
        path: "/job/:jobId/applicants",
        element: (
          <ProtectedRoute>
            <JobApplicants />
          </ProtectedRoute>
        ),
      },
      // Edit job route for recruiters
      {
        path: "/edit-job/:jobId",
        element: (
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        ),
      },
      // Candidate details route
      {
        path: "/candidate-details/:applicationId",
        element: (
          <ProtectedRoute>
            <CandidateDetails />
          </ProtectedRoute>
        ),
      },
      // Candidate profile route
      {
        path: "/candidate-profile/:candidateId",
        element: (
          <ProtectedRoute>
            <CandidateProfile />
          </ProtectedRoute>
        ),
      },
      // Candidate profile route (alternative path)
      {
        path: "/candidate/:candidateId",
        element: (
          <ProtectedRoute>
            <CandidateProfile />
          </ProtectedRoute>
        ),
      },
      // Candidates listing route
      {
        path: "/candidates",
        element: (
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>
        ),
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      // Catch-all route for invalid URLs (like resume URLs)
      {
        path: "*",
        element: (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
              <p className="text-gray-300 mb-8">The page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        ),
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    // Set dark theme directly
    const root = window.document.documentElement;
    root.classList.remove("light", "system");
    root.classList.add("dark");
  }, []);

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <JobProvider>
              <RouterProvider router={router} />
            </JobProvider>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ConvexProvider>
  );
}

export default App;
