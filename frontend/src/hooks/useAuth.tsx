import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  email_confirmed_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");

      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user data with unique ID based on email
    const mockUser: User = {
      id: `user-${btoa(email).replace(/[^a-zA-Z0-9]/g, '')}`,
      email: email,
      full_name: "Demo User",
      created_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
    };

    // Store mock user data
    localStorage.setItem("user", JSON.stringify(mockUser));
    
    setUser(mockUser);
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
  };

  const register = async (email: string, password: string, full_name: string) => {
    // Mock registration - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user data with unique ID based on email
    const mockUser: User = {
      id: `user-${btoa(email).replace(/[^a-zA-Z0-9]/g, '')}`,
      email: email,
      full_name: full_name,
      created_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
    };

    // Store mock user data
    localStorage.setItem("user", JSON.stringify(mockUser));
    
    setUser(mockUser);
    toast({
      title: "Welcome to ICPerfect!",
      description: "Your account has been created successfully.",
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const refreshToken = async () => {
    // Mock refresh token - no action needed for prototype
    return;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate("/login");
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}; 