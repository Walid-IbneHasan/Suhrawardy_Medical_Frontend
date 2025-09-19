import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authUtils, User } from "@/utils/auth";
import { authAPI } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const profile = (await authAPI.getUserProfile()) as User;
      // preserve is_superuser if your /auth/profile doesn't include it
      const stored = authUtils.getUser();
      const merged = {
        ...profile,
        is_superuser: stored?.is_superuser ?? profile?.is_superuser,
      };
      authUtils.setUser(merged);
      setUser(merged);
    } catch (e) {
      // swallow here; caller may handle UX
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const userData = authUtils.getUser();
      if (userData && authUtils.getAccessToken()) {
        try {
          const profile = (await authAPI.getUserProfile()) as User;
          setUser({ ...profile, is_superuser: userData.is_superuser });
        } catch (error) {
          authUtils.logout();
          toast({
            title: "Session expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          navigate("/login");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [navigate, toast]);

  const login = async (email: string, password: string) => {
    try {
      const response = (await authAPI.login(email, password)) as {
        access: string;
        refresh: string;
        is_superuser: boolean;
      };
      authUtils.setTokens(response);

      const userData = (await authAPI.getUserProfile()) as User;
      userData.is_superuser = response.is_superuser; // ensure flag present
      authUtils.setUser(userData);
      setUser(userData);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const response = (await authAPI.register(
        email,
        password,
        confirmPassword
      )) as { access: string; refresh: string };
      authUtils.setTokens(response);

      const userData = (await authAPI.getUserProfile()) as User;
      authUtils.setUser(userData);
      setUser(userData);

      toast({
        title: "Registration successful",
        description: "Welcome to MediCare Plus!",
      });
      navigate("/");
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
    navigate("/login");
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
