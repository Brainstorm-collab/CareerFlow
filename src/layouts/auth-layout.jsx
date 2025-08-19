import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const AuthLayout = () => {
  const location = useLocation();

  // Simple scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <div className="grid-background"></div>
      <main className="pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
