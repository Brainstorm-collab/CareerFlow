import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { shadesOfPurple } from "@clerk/themes";
import { ToastProvider } from "./context/ToastContext";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Debug: Log environment variables
console.log('Environment check:', {
  VITE_CLERK_PUBLISHABLE_KEY: PUBLISHABLE_KEY ? 'Set' : 'Missing',
  NODE_ENV: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL
});

if (!PUBLISHABLE_KEY) {
  console.error('❌ Missing Clerk Publishable Key!');
  console.error('Please create a .env file with VITE_CLERK_PUBLISHABLE_KEY=your_key_here');
  console.error('Or set the environment variable directly');
  
  // For development only - remove this in production
  if (import.meta.env.MODE === 'development') {
    console.warn('⚠️  Development mode: You can temporarily set your key here for testing');
    // Uncomment and replace with your actual key for testing:
    // const PUBLISHABLE_KEY = 'pk_test_your_actual_key_here';
  }
  
  throw new Error("Missing Publishable Key - Check console for setup instructions");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
      }}
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
      afterSignOutUrl="/"
    >
        <ToastProvider>
          <App />
        </ToastProvider>
    </ClerkProvider>
  </React.StrictMode>
);
