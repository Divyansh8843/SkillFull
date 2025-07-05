import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";
import socketService from "../services/socket";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  totalReviews?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (googleUser: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (fallback to localStorage)
    const initializeAuth = async () => {
      try {
        // Try to get user from localStorage first
        const savedUser = localStorage.getItem("skillEdgeUser");
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setLoading(false);
            return;
          } catch (error) {
            localStorage.removeItem("skillEdgeUser");
          }
        }

        // If backend is available, try API
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            apiService.setToken(token);
            const userData = await apiService.getProfile();
            setUser(userData);

            // Connect to socket if available
            socketService.connect(userData.id);
          } catch (error) {
            // Backend not available, clear token
            localStorage.removeItem("authToken");
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (googleUser: any) => {
    try {
      setLoading(true);

      // Try API first, fallback to localStorage
      try {
        const response = await apiService.loginWithGoogle({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          picture: googleUser.picture,
        });

        setUser(response.user);
        // Also save to localStorage as backup
        localStorage.setItem("skillEdgeUser", JSON.stringify(response.user));

        // Connect to socket if available
        socketService.connect(response.user.id);
      } catch (apiError) {
        // Backend not available, use localStorage
        console.log("Backend not available, using localStorage authentication");

        const user = {
          id: googleUser.id,
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          bio: "",
          skills: [],
          rating: 0,
          totalReviews: 0,
        };

        console.log("Storing user data in localStorage:", user);
        setUser(user);
        localStorage.setItem("skillEdgeUser", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skillEdgeUser");
    apiService.logout();
    socketService.disconnect();
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await apiService.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
