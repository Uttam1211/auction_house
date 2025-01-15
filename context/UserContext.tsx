import React, { createContext, useContext, useState, useEffect } from "react";
import Router from "next/router";

type User = {
  name: string;
  role: string;
  authenticated: boolean;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<any>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Prevent multiple logouts

  const logout = () => {
    if (isLoggingOut) return; // Prevent multiple calls to logout
    setIsLoggingOut(true);

    setUser(null);
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    if (Router.pathname !== "/login") {
      Router.push("/login");
    }

    setTimeout(() => setIsLoggingOut(false), 100); // Reset after a short delay
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        logout(); // Trigger logout for unauthorized responses
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error("API error:", err);
      logout(); // Handle unexpected errors
      return null;
    }
  };

  useEffect(() => {
    if (!user) return; // Skip validation if user is not logged in

    const validateToken = async () => {
      try {
        const response = await fetch("/api/auth-check");

        if (response.status === 401) {
          logout(); // Trigger logout if token is invalid
        } else {
          const data = await response.json();
          if (data.authenticated) {
            setUser(data.user); // Update the context with latest user data
          }
        }
      } catch (err) {
        console.error("Token validation failed:", err);
        logout();
      }
    };

    validateToken();
    const interval = setInterval(validateToken, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval); // Cleanup on unmount
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, logout, fetchWithAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
