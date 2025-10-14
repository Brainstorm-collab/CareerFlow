import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('careerflow_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('careerflow_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Social login function
  const socialLogin = async (provider, userData) => {
    try {
      setIsLoading(true);
      
      // Create user object with consistent structure
      const user = {
        id: userData.id || userData.sub || `social_${Date.now()}`,
        email: userData.email || `${provider}_${userData.id}@${provider}.local`,
        name: userData.name || userData.given_name || userData.first_name || 'User',
        firstName: userData.given_name || userData.first_name || '',
        lastName: userData.family_name || userData.last_name || '',
        picture: userData.picture || userData.avatar_url || '',
        provider: provider,
        providerId: userData.id || userData.sub,
        role: userData.role || null, // Include role from userData
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      // Store user in localStorage
      localStorage.setItem('careerflow_user', JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error(`${provider} login error:`, error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password login function
  const emailLogin = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('careerflow_users') || '[]');
      
      // Find user with matching email and password
      const foundUser = storedUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password // In a real app, you'd hash and compare passwords
      );
      
      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Create session user object (without password)
      const sessionUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        picture: foundUser.picture || '',
        provider: 'email',
        providerId: foundUser.id,
        role: foundUser.role || null, // Include role from stored user
        createdAt: foundUser.createdAt,
        lastLoginAt: new Date().toISOString()
      };
      
      // Store session user in localStorage
      localStorage.setItem('careerflow_user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      
      return { success: true, user: sessionUser };
    } catch (error) {
      console.error('Email login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password registration function
  const emailRegister = async (name, email, password) => {
    try {
      setIsLoading(true);
      
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('careerflow_users') || '[]');
      
      // Check if user already exists
      const existingUser = storedUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }
      
      // Create new user
      const newUser = {
        id: `email_${Date.now()}`,
        email: email.toLowerCase(),
        name: name.trim(),
        firstName: name.trim().split(' ')[0] || '',
        lastName: name.trim().split(' ').slice(1).join(' ') || '',
        password: password, // In a real app, you'd hash this
        picture: '',
        provider: 'email',
        providerId: `email_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Store user in users list
      storedUsers.push(newUser);
      localStorage.setItem('careerflow_users', JSON.stringify(storedUsers));
      
      // Create session user object (without password)
      const sessionUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        picture: newUser.picture,
        provider: newUser.provider,
        providerId: newUser.providerId,
        role: newUser.role || null, // Include role from new user
        createdAt: newUser.createdAt,
        lastLoginAt: newUser.lastLoginAt
      };
      
      // Store session user in localStorage
      localStorage.setItem('careerflow_user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      
      return { success: true, user: sessionUser };
    } catch (error) {
      console.error('Email registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    try {
      setIsLoading(true);
      
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('careerflow_users') || '[]');
      
      // Check if user exists
      const existingUser = storedUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!existingUser) {
        return { success: false, error: 'No account found with this email address' };
      }
      
      // In a real app, you would:
      // 1. Generate a secure reset token
      // 2. Store it in your database with expiration
      // 3. Send an email with the reset link
      // 4. Handle the reset token verification
      
      // For demo purposes, we'll just simulate success
      console.log('Password reset requested for:', email);
      
      return { success: true, message: 'Password reset instructions sent to your email' };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('careerflow_user');
    setUser(null);
    // Navigation will be handled by the component that calls signOut
  };

  // Update user role function
  const updateUserRole = (role) => {
    if (user) {
      const updatedUser = { ...user, role };
      localStorage.setItem('careerflow_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Check if user is authenticated
  const isSignedIn = !!user;

  // OPTIMIZATION: Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isSignedIn,
    isLoading,
    socialLogin,
    emailLogin,
    emailRegister,
    resetPassword,
    signOut,
    updateUserRole
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
