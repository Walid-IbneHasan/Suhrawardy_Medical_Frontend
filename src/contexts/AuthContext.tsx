import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authUtils, User } from '@/utils/auth';
import { authAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = () => {
      const userData = authUtils.getUser();
      setUser(userData);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password) as { access: string; refresh: string };
      authUtils.setTokens(response);
      
      // Fetch user data after login
      const userData = await authAPI.getUserProfile() as User;
      authUtils.setUser(userData);
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    try {
      const response = await authAPI.register(email, password, confirmPassword) as { access: string; refresh: string };
      authUtils.setTokens(response);
      
      // Fetch user data after registration
      const userData = await authAPI.getUserProfile() as User;
      authUtils.setUser(userData);
      setUser(userData);
      
      toast({
        title: "Registration successful",
        description: "Welcome to MediCare Plus!",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    authUtils.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.is_superuser || false,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};