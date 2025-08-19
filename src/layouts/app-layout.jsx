import Header from "@/components/header";
import { Outlet, useLocation } from "react-router-dom";
import { useUser, useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import { syncUserToSupabase } from "@/utils/user-sync";
import "@/utils/test-database"; // Import for browser console testing

const AppLayout = () => {
  const { user, isSignedIn } = useUser();
  const { session } = useSession();
  const location = useLocation();

  // Automatically sync user to Supabase when they sign in
  useEffect(() => {
    if (isSignedIn && user && session) {
      console.log('AppLayout: User signed in, syncing to Supabase');
      console.log('User ID:', user.id);
      console.log('User email:', user.primaryEmailAddress?.emailAddress);
      console.log('Session exists:', !!session);
      
      syncUserToSupabase(user, session).catch(console.error);
    }
  }, [isSignedIn, user, session]);

  // Simple scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <div className="grid-background"></div>
      <Header />
      <main className="pt-0">
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by G.Eesaan
      </div>
    </div>
  );
};

export default AppLayout;
