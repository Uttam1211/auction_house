import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/auth-check");
      setIsAuthenticated(response.ok);
    }

    checkAuth();
  }, []);

  return isAuthenticated;
}
