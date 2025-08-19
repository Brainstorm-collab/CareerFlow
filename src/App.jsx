import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import AppLayout from "./layouts/app-layout";
import AuthLayout from "./layouts/auth-layout";
import ProtectedRoute from "./components/protected-route";
import { JobProvider } from "./context/JobContext";

import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import PostJob from "./pages/post-job";
import JobListing from "./pages/jobListing";
import MyJobs from "./pages/my-jobs";
import SavedJobs from "./pages/saved-jobs";
import MyApplications from "./pages/my-applications";
import RoleDebug from "./pages/role-debug";
import JobApplicants from "./pages/job-applicants";
import Unauthorized from "./pages/unauthorized";

import JobPage from "./pages/job";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";

// Import Clerk components
import { SignIn, SignUp } from "@clerk/clerk-react";

import "./App.css";

const router = createBrowserRouter([
  // Auth routes (outside of main app layout)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignIn routing="path" path="/sign-in" />,
      },
      {
        path: "/sign-up",
        element: <SignUp routing="path" path="/sign-up" />,
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
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
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
      // Job applicants route for recruiters
      {
        path: "/job/:jobId/applicants",
        element: (
          <ProtectedRoute>
            <JobApplicants />
          </ProtectedRoute>
        ),
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
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
    <JobProvider>
      <RouterProvider router={router} />
    </JobProvider>
  );
}

export default App;
