import Header from "@/components/header";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useSyncUser, useGetUser } from "@/api/apiUsers";

const AppLayout = () => {
  const { user, isSignedIn } = useAuth();
  const location = useLocation();
  const syncUser = useSyncUser();
  const databaseUser = useGetUser(user?.id);

  // Automatically sync user to Convex when they sign in (only if no database user exists)
  useEffect(() => {
    const syncUserToConvex = async () => {
      if (isSignedIn && user) {
        // Don't sync if database user already exists to prevent overwriting custom data
        if (databaseUser) {
          console.log('AppLayout: Database user exists, skipping sync to prevent data overwrite');
          return;
        }
        
        console.log('AppLayout: User signed in, syncing to Convex');
        console.log('User ID:', user.id);
        console.log('User email:', user.email);
        console.log('User name:', user.name);
        
        try {
          await syncUser({
            socialId: user.id, // Use the user's ID as socialId
            provider: user.provider, // Use the provider (google, facebook, email)
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.name || `${user.firstName} ${user.lastName}`.trim(),
            profileImageUrl: user.picture,
            role: user.role || "candidate"
          });
          console.log('✅ User synced to Convex successfully');
        } catch (error) {
          console.error('❌ Error syncing user to Convex:', error);
        }
      }
    };

    // Only sync once when user first signs in, not on every user change
    if (isSignedIn && user) {
      syncUserToConvex();
    }
  }, [isSignedIn, user?.id, syncUser, databaseUser]); // Include databaseUser in dependencies

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
      {/* Footer removed to fix scrolling issue */}
    </div>
  );
};

export default AppLayout;
